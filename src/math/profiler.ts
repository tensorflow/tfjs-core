import * as util from '../util';
import {TypedArray} from '../util';

import {DataTypes, NDArray, NDArrayObject} from './ndarray';
import {Timer} from './timer';

const WARNING_SYMBOL = String.fromCharCode(9888, 65039);

export class Profiler {
  // TODO(nsthorat): Make this a deeplearn.js global.
  private debugMode = false;
  private debugModeOpExecutionInfoStack: OpExecutionInfoNode[] = [];

  constructor(private timer: Timer) {}

  getTimer(): Timer {
    return this.timer;
  }

  enableDebugMode() {
    this.debugMode = true;
  }

  profile<G extends keyof DataTypes, T extends NDArrayObject<G>>(
      name: string, inputs: {[name: string]: NDArray}, f: () => T): T {
    let result: T;
    if (!this.debugMode) {
      result = f();
    } else {
      const opExecutionInfo = new OpExecutionInfoNode(name);

      if (this.debugModeOpExecutionInfoStack.length > 0) {
        const parent = this.debugModeOpExecutionInfoStack
                           [this.debugModeOpExecutionInfoStack.length - 1];
        parent.childInfoNodes.push(opExecutionInfo);
        opExecutionInfo.parentInfoNode = parent;
      }

      this.debugModeOpExecutionInfoStack.push(opExecutionInfo);

      // Time and run the function.
      const query = this.timer.startTimer();

      result = f();

      this.timer.endTimer(query);

      const outputs = makeOutputMapFromNDArrayObject(result);
      checkOutputsForNaNs(opExecutionInfo, outputs);

      opExecutionInfo.outputShapes = getShapesFromNDArrayMap(outputs);
      opExecutionInfo.inputShapes = getShapesFromNDArrayMap(inputs);

      const endTimer = this.timer.getTime(query);

      this.debugModeOpExecutionInfoStack.pop();

      if (endTimer == null) {
        opExecutionInfo.notifyNodeReady();
      } else {
        endTimer.then(timeMs => {
          opExecutionInfo.nodeTimeMs = timeMs;
          opExecutionInfo.notifyNodeReady();
        });
      }
    }

    return result;
  }
}

/**
 * Represents a node in the op execution graph. Nodes are asynchronously
 * resolved, so the root only resolves and renders the profile output
 * once the entire tree has been resolved.
 */
export class OpExecutionInfoNode {
  // When an exception is thrown, expclititly stop displaying profiler.
  static haltExecution = false;

  parentInfoNode?: OpExecutionInfoNode;
  childInfoNodes: OpExecutionInfoNode[] = [];

  inputShapes: {[key: string]: number[]};
  outputShapes: {[key: string]: number[]};

  public nodeTimeMs?: number;
  private totalTime?: number;

  isNodeReady = false;
  error: {error: Error, message: string}|null;

  constructor(public name: string) {}

  isNodeAndChildrenReady(): boolean {
    let childrenReady = true;
    for (let i = 0; i < this.childInfoNodes.length; i++) {
      childrenReady =
          childrenReady && this.childInfoNodes[i].isNodeAndChildrenReady();
    }

    return this.isNodeReady && childrenReady;
  }

  getTotalTimeMs() {
    if (this.totalTime == null) {
      this.totalTime = this.nodeTimeMs == null ? 0 : this.nodeTimeMs;
      for (let i = 0; i < this.childInfoNodes.length; i++) {
        this.totalTime += this.childInfoNodes[i].getTotalTimeMs();
      }
    }
    return this.totalTime;
  }

  notifyNodeReady() {
    this.isNodeReady = true;

    this.bubbleReadyNotification();
  }

  bubbleReadyNotification() {
    if (!this.isNodeReady) {
      return;
    }

    if (this.isNodeAndChildrenReady()) {
      if (this.parentInfoNode == null) {
        const depth = 0;
        recursivelyRenderOpExecutionTree(this, depth);
      } else {
        // Notify the parent.
        this.parentInfoNode.bubbleReadyNotification();
      }
    }
  }
}

function checkOutputsForNaNs(
    node: OpExecutionInfoNode, outputs: {[key: string]: NDArray}) {
  // Check for NaNs in all outputs.
  const keys = Object.keys(outputs);
  for (let i = 0; i < keys.length; i++) {
    const ndarray = outputs[keys[i]];
    const vals = ndarray.dataSync();
    const error = checkForNaN(vals, ndarray.dtype, name);
    if (error != null) {
      node.error = error;
    }
  }
}

function checkForNaN(vals: TypedArray, dtype: keyof DataTypes, name: string):
    {error: Error, message: string}|null {
  for (let i = 0; i < vals.length; i++) {
    if (util.isValNaN(vals[i], dtype)) {
      const message = `The result of the last math.${name} has NaNs.`;
      return {error: new Error(message), message};
    }
  }
  return null;
}

function getShapesFromNDArrayMap(ndarrays: {[key: string]: NDArray}):
    {[key: string]: number[]} {
  const shapesMap: {[key: string]: number[]} = {};

  const keys = Object.keys(ndarrays);
  for (let i = 0; i < keys.length; i++) {
    const ndarray = ndarrays[keys[i]];
    shapesMap[keys[i]] = ndarray.shape.slice();
  }
  return shapesMap;
}

function makeOutputMapFromNDArrayObject<G extends keyof DataTypes>(
    result: NDArrayObject<G>): {[key: string]: NDArray} {
  // Build the map of string key to output.
  const outputs: {[key: string]: NDArray} = {};
  if (result instanceof NDArray) {
    outputs['output'] = result;
  } else if (result instanceof Array) {
    for (let i = 0; i < result.length; i++) {
      if (result[i] instanceof Array) {
        for (let j = 0; j < result.length; j++) {
          outputs[String(i) + ',' + String(j)] =
              (result[i] as NDArray[])[j] as NDArray;
        }
      } else {
        outputs[String(i)] = result[i] as NDArray;
      }
    }
  } else if (result instanceof Object) {
    const map = result as {[key: string]: NDArray<G>};
    const keys = Object.keys(map);
    for (let i = 0; i < keys.length; i++) {
      outputs[keys[i]] = map[keys[i]];
    }
  }
  return outputs;
}

function renderShapeInfo(
    title: string, node: OpExecutionInfoNode,
    shapes: {[key: string]: number[]}) {
  const names = Object.keys(shapes);
  const styles = [
    'font-weight:normal', 'font-weight:bold', 'color:red', 'color:blue',
    'color: orange'
  ];

  const paddedTitle = util.rightPad(title + ':', 10);
  for (const name of names) {
    const shape = shapes[name];

    const paddedName = util.rightPad(name, 15);
    const paddedRank = util.rightPad(shape.length + 'D', 9);
    const paddedSize = util.rightPad(String(util.sizeFromShape(shape)), 9);

    const outputDisplays = [
      paddedTitle, paddedName, paddedRank, paddedSize,
      util.getDisplayShape(shape)
    ];

    const outputStr = outputDisplays.map(arg => '%c' + arg).join('\t');
    console.log(outputStr, ...styles);
  }
}

function recursivelyRenderOpExecutionTree(
    node: OpExecutionInfoNode, depth: number) {
  if (OpExecutionInfoNode.haltExecution) {
    return;
  }

  const hasError = node.error != null;
  const isLeaf = node.childInfoNodes.length === 0;

  const totalTimeMs = node.getTotalTimeMs();
  const time = `${totalTimeMs.toFixed(3)}ms`;

  const paddedName = util.rightPad(node.name, 15);

  let displayStr = `%c${paddedName}%c${time}`;
  const displayStyles = ['font-weight:bold', 'color:red'];

  if (hasError) {
    // Display an exclamation mark.
    displayStr = WARNING_SYMBOL + displayStr;
    displayStyles.unshift('color:red');
  }

  const isChildNode = node.childInfoNodes.length === 0;
  if (isChildNode && !hasError) {
    console.groupCollapsed(displayStr, ...displayStyles);
  } else {
    console.group(displayStr, ...displayStyles);
  }

  renderShapeInfo('Output', node, node.outputShapes);
  renderShapeInfo('Input', node, node.inputShapes);

  if (hasError) {
    console.group('%c' + node.error.message, 'color:red');
    console.error(node.error.error);
    console.groupEnd();

    // Walk up the tree and resolve the group ends.
    if (isLeaf) {
      OpExecutionInfoNode.haltExecution = true;
      console.groupEnd();

      let parent = node.parentInfoNode;
      while (parent != null) {
        console.groupEnd();
        parent = parent.parentInfoNode;
      }
      return;
    }
  }

  for (let i = 0; i < node.childInfoNodes.length; i++) {
    recursivelyRenderOpExecutionTree(node.childInfoNodes[i], depth + 1);
  }

  console.groupEnd();
}
