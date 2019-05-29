// @tensorflow/tfjs-models Copyright 2019 Google
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tensorflow/tfjs')) :
  typeof define === 'function' && define.amd ? define(['exports', '@tensorflow/tfjs'], factory) :
  (global = global || self, factory(global.posenet = {}, global.tf));
}(this, function (exports, tf) { 'use strict';

  const MANIFEST_FILE = 'manifest.json';
  class CheckpointLoader {
      constructor(urlPath) {
          this.urlPath = urlPath;
          if (this.urlPath.charAt(this.urlPath.length - 1) !== '/') {
              this.urlPath += '/';
          }
      }
      loadManifest() {
          return new Promise(async (resolve, reject) => {
              try {
                  const response = await tf.util.fetch(this.urlPath + MANIFEST_FILE);
                  if (!response.ok) {
                      throw new Error(`Not found manifest ${this.urlPath + MANIFEST_FILE}`);
                  }
                  this.checkpointManifest = await response.json();
                  resolve();
              }
              catch (error) {
                  throw new Error(`${MANIFEST_FILE} not found at ${this.urlPath}. ${error}`);
              }
          });
      }
      getCheckpointManifest() {
          if (this.checkpointManifest == null) {
              return new Promise((resolve, reject) => {
                  this.loadManifest().then(() => {
                      resolve(this.checkpointManifest);
                  });
              });
          }
          return new Promise((resolve, reject) => {
              resolve(this.checkpointManifest);
          });
      }
      getAllVariables() {
          if (this.variables != null) {
              return new Promise((resolve, reject) => {
                  resolve(this.variables);
              });
          }
          return new Promise((resolve, reject) => {
              this.getCheckpointManifest().then((checkpointDefinition) => {
                  const variableNames = Object.keys(this.checkpointManifest);
                  const variablePromises = [];
                  for (let i = 0; i < variableNames.length; i++) {
                      variablePromises.push(this.getVariable(variableNames[i]));
                  }
                  Promise.all(variablePromises).then(variables => {
                      this.variables = {};
                      for (let i = 0; i < variables.length; i++) {
                          this.variables[variableNames[i]] = variables[i];
                      }
                      resolve(this.variables);
                  });
              });
          });
      }
      getVariable(varName) {
          if (!(varName in this.checkpointManifest)) {
              throw new Error('Cannot load non-existant variable ' + varName);
          }
          const variableRequestPromiseMethod = async (resolve, reject) => {
              const fname = this.checkpointManifest[varName].filename;
              try {
                  const response = await tf.util.fetch(this.urlPath + fname);
                  if (!response.ok) {
                      throw new Error(`Not found variable ${varName}`);
                  }
                  const values = new Float32Array(await response.arrayBuffer());
                  const checkpointTensor = tf.tensor(values, this.checkpointManifest[varName].shape, 'float32');
                  resolve(checkpointTensor);
              }
              catch (error) {
                  throw new Error(`Could not fetch variable ${varName}: ${error}`);
              }
          };
          if (this.checkpointManifest == null) {
              return new Promise((resolve, reject) => {
                  this.loadManifest().then(() => {
                      new Promise(variableRequestPromiseMethod).then(resolve);
                  });
              });
          }
          return new Promise(variableRequestPromiseMethod);
      }
  }

  const mobileNet100Architecture = [
      ['conv2d', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1]
  ];
  const mobileNet75Architecture = [
      ['conv2d', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1]
  ];
  const mobileNet50Architecture = [
      ['conv2d', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 2],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1],
      ['separableConv', 1]
  ];
  const mobileNet25Architecture = mobileNet50Architecture;
  const VALID_OUTPUT_STRIDES = [8, 16, 32];
  function assertValidOutputStride(outputStride) {
      tf.util.assert(typeof outputStride === 'number', () => 'outputStride is not a number');
      tf.util.assert(VALID_OUTPUT_STRIDES.indexOf(outputStride) >= 0, () => `outputStride of ${outputStride} is invalid. ` +
          `It must be either 8, 16, or 32`);
  }
  function assertValidResolution(resolution, outputStride) {
      tf.util.assert(typeof resolution === 'number', () => 'resolution is not a number');
      tf.util.assert((resolution - 1) % outputStride === 0, () => `resolution of ${resolution} is invalid for output stride ` +
          `${outputStride}.`);
  }
  const mobileNetArchitectures = {
      100: mobileNet100Architecture,
      75: mobileNet75Architecture,
      50: mobileNet50Architecture,
      25: mobileNet25Architecture
  };
  function toOutputStridedLayers(convolutionDefinition, outputStride) {
      let currentStride = 1;
      let rate = 1;
      return convolutionDefinition.map(([convType, stride], blockId) => {
          let layerStride, layerRate;
          if (currentStride === outputStride) {
              layerStride = 1;
              layerRate = rate;
              rate *= stride;
          }
          else {
              layerStride = stride;
              layerRate = 1;
              currentStride *= stride;
          }
          return {
              blockId,
              convType,
              stride: layerStride,
              rate: layerRate,
              outputStride: currentStride
          };
      });
  }
  class MobileNet {
      constructor(modelWeights, convolutionDefinitions, inputResolution, outputStride) {
          this.PREPROCESS_DIVISOR = tf.scalar(255.0 / 2);
          this.ONE = tf.scalar(1.0);
          this.modelWeights = modelWeights;
          this.convolutionDefinitions = convolutionDefinitions;
          this.inputResolution = inputResolution;
          this.outputStride = outputStride;
      }
      predict(input) {
          const normalized = tf.div(input.toFloat(), this.PREPROCESS_DIVISOR);
          const preprocessedInput = tf.sub(normalized, this.ONE);
          const layers = toOutputStridedLayers(this.convolutionDefinitions, this.outputStride);
          return tf.tidy(() => {
              const mobileNetOutput = layers.reduce((previousLayer, { blockId, stride, convType, rate }) => {
                  if (convType === 'conv2d') {
                      return this.conv(previousLayer, stride, blockId);
                  }
                  else if (convType === 'separableConv') {
                      return this.separableConv(previousLayer, stride, blockId, rate);
                  }
                  else {
                      throw Error(`Unknown conv type of ${convType}`);
                  }
              }, preprocessedInput);
              const heatmaps = this.convToOutput(mobileNetOutput, 'heatmap_2');
              const offsets = this.convToOutput(mobileNetOutput, 'offset_2');
              const displacementFwd = this.convToOutput(mobileNetOutput, 'displacement_fwd_2');
              const displacementBwd = this.convToOutput(mobileNetOutput, 'displacement_bwd_2');
              return {
                  heatmapScores: heatmaps.sigmoid(),
                  offsets,
                  displacementFwd,
                  displacementBwd
              };
          });
      }
      convToOutput(mobileNetOutput, outputLayerName) {
          return mobileNetOutput.conv2d(this.weights(outputLayerName), 1, 'same')
              .add(this.convBias(outputLayerName));
      }
      conv(inputs, stride, blockId) {
          const weights = this.weights(`Conv2d_${String(blockId)}`);
          const a = inputs.conv2d(weights, stride, 'same');
          const b = a.add(this.convBias(`Conv2d_${String(blockId)}`));
          return b.clipByValue(0, 6);
      }
      separableConv(inputs, stride, blockID, dilations = 1) {
          const dwLayer = `Conv2d_${String(blockID)}_depthwise`;
          const pwLayer = `Conv2d_${String(blockID)}_pointwise`;
          const x1 = inputs
              .depthwiseConv2D(this.depthwiseWeights(dwLayer), stride, 'same', 'NHWC', dilations)
              .add(this.depthwiseBias(dwLayer))
              .clipByValue(0, 6);
          const x2 = x1.conv2d(this.weights(pwLayer), [1, 1], 'same')
              .add(this.convBias(pwLayer))
              .clipByValue(0, 6);
          return x2;
      }
      weights(layerName) {
          return this.modelWeights.weights(layerName);
      }
      convBias(layerName) {
          return this.modelWeights.convBias(layerName);
      }
      depthwiseBias(layerName) {
          return this.modelWeights.depthwiseBias(layerName);
      }
      depthwiseWeights(layerName) {
          return this.modelWeights.depthwiseWeights(layerName);
      }
      dispose() {
          this.modelWeights.dispose();
      }
  }

  function half(k) {
      return Math.floor(k / 2);
  }
  class MaxHeap {
      constructor(maxSize, getElementValue) {
          this.priorityQueue = new Array(maxSize);
          this.numberOfElements = -1;
          this.getElementValue = getElementValue;
      }
      enqueue(x) {
          this.priorityQueue[++this.numberOfElements] = x;
          this.swim(this.numberOfElements);
      }
      dequeue() {
          const max = this.priorityQueue[0];
          this.exchange(0, this.numberOfElements--);
          this.sink(0);
          this.priorityQueue[this.numberOfElements + 1] = null;
          return max;
      }
      empty() {
          return this.numberOfElements === -1;
      }
      size() {
          return this.numberOfElements + 1;
      }
      all() {
          return this.priorityQueue.slice(0, this.numberOfElements + 1);
      }
      max() {
          return this.priorityQueue[0];
      }
      swim(k) {
          while (k > 0 && this.less(half(k), k)) {
              this.exchange(k, half(k));
              k = half(k);
          }
      }
      sink(k) {
          while (2 * k <= this.numberOfElements) {
              let j = 2 * k;
              if (j < this.numberOfElements && this.less(j, j + 1)) {
                  j++;
              }
              if (!this.less(k, j)) {
                  break;
              }
              this.exchange(k, j);
              k = j;
          }
      }
      getValueAt(i) {
          return this.getElementValue(this.priorityQueue[i]);
      }
      less(i, j) {
          return this.getValueAt(i) < this.getValueAt(j);
      }
      exchange(i, j) {
          const t = this.priorityQueue[i];
          this.priorityQueue[i] = this.priorityQueue[j];
          this.priorityQueue[j] = t;
      }
  }

  function scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores) {
      const [height, width] = scores.shape;
      let localMaximum = true;
      const yStart = Math.max(heatmapY - localMaximumRadius, 0);
      const yEnd = Math.min(heatmapY + localMaximumRadius + 1, height);
      for (let yCurrent = yStart; yCurrent < yEnd; ++yCurrent) {
          const xStart = Math.max(heatmapX - localMaximumRadius, 0);
          const xEnd = Math.min(heatmapX + localMaximumRadius + 1, width);
          for (let xCurrent = xStart; xCurrent < xEnd; ++xCurrent) {
              if (scores.get(yCurrent, xCurrent, keypointId) > score) {
                  localMaximum = false;
                  break;
              }
          }
          if (!localMaximum) {
              break;
          }
      }
      return localMaximum;
  }
  function buildPartWithScoreQueue(scoreThreshold, localMaximumRadius, scores) {
      const [height, width, numKeypoints] = scores.shape;
      const queue = new MaxHeap(height * width * numKeypoints, ({ score }) => score);
      for (let heatmapY = 0; heatmapY < height; ++heatmapY) {
          for (let heatmapX = 0; heatmapX < width; ++heatmapX) {
              for (let keypointId = 0; keypointId < numKeypoints; ++keypointId) {
                  const score = scores.get(heatmapY, heatmapX, keypointId);
                  if (score < scoreThreshold) {
                      continue;
                  }
                  if (scoreIsMaximumInLocalWindow(keypointId, score, heatmapY, heatmapX, localMaximumRadius, scores)) {
                      queue.enqueue({ score, part: { heatmapY, heatmapX, id: keypointId } });
                  }
              }
          }
      }
      return queue;
  }

  const partNames = [
      'nose', 'leftEye', 'rightEye', 'leftEar', 'rightEar', 'leftShoulder',
      'rightShoulder', 'leftElbow', 'rightElbow', 'leftWrist', 'rightWrist',
      'leftHip', 'rightHip', 'leftKnee', 'rightKnee', 'leftAnkle', 'rightAnkle'
  ];
  const NUM_KEYPOINTS = partNames.length;
  const partIds = partNames.reduce((result, jointName, i) => {
      result[jointName] = i;
      return result;
  }, {});
  const connectedPartNames = [
      ['leftHip', 'leftShoulder'], ['leftElbow', 'leftShoulder'],
      ['leftElbow', 'leftWrist'], ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'], ['rightHip', 'rightShoulder'],
      ['rightElbow', 'rightShoulder'], ['rightElbow', 'rightWrist'],
      ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
      ['leftShoulder', 'rightShoulder'], ['leftHip', 'rightHip']
  ];
  const poseChain = [
      ['nose', 'leftEye'], ['leftEye', 'leftEar'], ['nose', 'rightEye'],
      ['rightEye', 'rightEar'], ['nose', 'leftShoulder'],
      ['leftShoulder', 'leftElbow'], ['leftElbow', 'leftWrist'],
      ['leftShoulder', 'leftHip'], ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'], ['nose', 'rightShoulder'],
      ['rightShoulder', 'rightElbow'], ['rightElbow', 'rightWrist'],
      ['rightShoulder', 'rightHip'], ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle']
  ];
  const connectedPartIndices = connectedPartNames.map(([jointNameA, jointNameB]) => ([partIds[jointNameA], partIds[jointNameB]]));
  const partChannels = [
      'left_face',
      'right_face',
      'right_upper_leg_front',
      'right_lower_leg_back',
      'right_upper_leg_back',
      'left_lower_leg_front',
      'left_upper_leg_front',
      'left_upper_leg_back',
      'left_lower_leg_back',
      'right_feet',
      'right_lower_leg_front',
      'left_feet',
      'torso_front',
      'torso_back',
      'right_upper_arm_front',
      'right_upper_arm_back',
      'right_lower_arm_back',
      'left_lower_arm_front',
      'left_upper_arm_front',
      'left_upper_arm_back',
      'left_lower_arm_back',
      'right_hand',
      'right_lower_arm_front',
      'left_hand'
  ];

  function getOffsetPoint(y, x, keypoint, offsets) {
      return {
          y: offsets.get(y, x, keypoint),
          x: offsets.get(y, x, keypoint + NUM_KEYPOINTS)
      };
  }
  function getImageCoords(part, outputStride, offsets) {
      const { heatmapY, heatmapX, id: keypoint } = part;
      const { y, x } = getOffsetPoint(heatmapY, heatmapX, keypoint, offsets);
      return {
          x: part.heatmapX * outputStride + x,
          y: part.heatmapY * outputStride + y
      };
  }
  function clamp(a, min, max) {
      if (a < min) {
          return min;
      }
      if (a > max) {
          return max;
      }
      return a;
  }
  function squaredDistance(y1, x1, y2, x2) {
      const dy = y2 - y1;
      const dx = x2 - x1;
      return dy * dy + dx * dx;
  }
  function addVectors(a, b) {
      return { x: a.x + b.x, y: a.y + b.y };
  }

  const parentChildrenTuples = poseChain.map(([parentJoinName, childJoinName]) => ([partIds[parentJoinName], partIds[childJoinName]]));
  const parentToChildEdges = parentChildrenTuples.map(([, childJointId]) => childJointId);
  const childToParentEdges = parentChildrenTuples.map(([parentJointId,]) => parentJointId);
  function getDisplacement(edgeId, point, displacements) {
      const numEdges = displacements.shape[2] / 2;
      return {
          y: displacements.get(point.y, point.x, edgeId),
          x: displacements.get(point.y, point.x, numEdges + edgeId)
      };
  }
  function getStridedIndexNearPoint(point, outputStride, height, width) {
      return {
          y: clamp(Math.round(point.y / outputStride), 0, height - 1),
          x: clamp(Math.round(point.x / outputStride), 0, width - 1)
      };
  }
  function traverseToTargetKeypoint(edgeId, sourceKeypoint, targetKeypointId, scoresBuffer, offsets, outputStride, displacements, offsetRefineStep = 2) {
      const [height, width] = scoresBuffer.shape;
      const sourceKeypointIndices = getStridedIndexNearPoint(sourceKeypoint.position, outputStride, height, width);
      const displacement = getDisplacement(edgeId, sourceKeypointIndices, displacements);
      let displacedPoint = addVectors(sourceKeypoint.position, displacement);
      let targetKeypoint = displacedPoint;
      for (let i = 0; i < offsetRefineStep; i++) {
          const targetKeypointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
          const offsetPoint = getOffsetPoint(targetKeypointIndices.y, targetKeypointIndices.x, targetKeypointId, offsets);
          targetKeypoint = addVectors({
              x: targetKeypointIndices.x * outputStride,
              y: targetKeypointIndices.y * outputStride
          }, { x: offsetPoint.x, y: offsetPoint.y });
      }
      const targetKeyPointIndices = getStridedIndexNearPoint(targetKeypoint, outputStride, height, width);
      const score = scoresBuffer.get(targetKeyPointIndices.y, targetKeyPointIndices.x, targetKeypointId);
      return { position: targetKeypoint, part: partNames[targetKeypointId], score };
  }
  function decodePose(root, scores, offsets, outputStride, displacementsFwd, displacementsBwd) {
      const numParts = scores.shape[2];
      const numEdges = parentToChildEdges.length;
      const instanceKeypoints = new Array(numParts);
      const { part: rootPart, score: rootScore } = root;
      const rootPoint = getImageCoords(rootPart, outputStride, offsets);
      instanceKeypoints[rootPart.id] = {
          score: rootScore,
          part: partNames[rootPart.id],
          position: rootPoint
      };
      for (let edge = numEdges - 1; edge >= 0; --edge) {
          const sourceKeypointId = parentToChildEdges[edge];
          const targetKeypointId = childToParentEdges[edge];
          if (instanceKeypoints[sourceKeypointId] &&
              !instanceKeypoints[targetKeypointId]) {
              instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsBwd);
          }
      }
      for (let edge = 0; edge < numEdges; ++edge) {
          const sourceKeypointId = childToParentEdges[edge];
          const targetKeypointId = parentToChildEdges[edge];
          if (instanceKeypoints[sourceKeypointId] &&
              !instanceKeypoints[targetKeypointId]) {
              instanceKeypoints[targetKeypointId] = traverseToTargetKeypoint(edge, instanceKeypoints[sourceKeypointId], targetKeypointId, scores, offsets, outputStride, displacementsFwd);
          }
      }
      return instanceKeypoints;
  }

  function withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, { x, y }, keypointId) {
      return poses.some(({ keypoints }) => {
          const correspondingKeypoint = keypoints[keypointId].position;
          return squaredDistance(y, x, correspondingKeypoint.y, correspondingKeypoint.x) <=
              squaredNmsRadius;
      });
  }
  function getInstanceScore(existingPoses, squaredNmsRadius, instanceKeypoints) {
      let notOverlappedKeypointScores = instanceKeypoints.reduce((result, { position, score }, keypointId) => {
          if (!withinNmsRadiusOfCorrespondingPoint(existingPoses, squaredNmsRadius, position, keypointId)) {
              result += score;
          }
          return result;
      }, 0.0);
      return notOverlappedKeypointScores /= instanceKeypoints.length;
  }
  const kLocalMaximumRadius = 1;
  function decodeMultiplePoses(scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, outputStride, maxPoseDetections, scoreThreshold = 0.5, nmsRadius = 20) {
      const poses = [];
      const queue = buildPartWithScoreQueue(scoreThreshold, kLocalMaximumRadius, scoresBuffer);
      const squaredNmsRadius = nmsRadius * nmsRadius;
      while (poses.length < maxPoseDetections && !queue.empty()) {
          const root = queue.dequeue();
          const rootImageCoords = getImageCoords(root.part, outputStride, offsetsBuffer);
          if (withinNmsRadiusOfCorrespondingPoint(poses, squaredNmsRadius, rootImageCoords, root.part.id)) {
              continue;
          }
          const keypoints = decodePose(root, scoresBuffer, offsetsBuffer, outputStride, displacementsFwdBuffer, displacementsBwdBuffer);
          const score = getInstanceScore(poses, squaredNmsRadius, keypoints);
          poses.push({ keypoints, score });
      }
      return poses;
  }

  function eitherPointDoesntMeetConfidence(a, b, minConfidence) {
      return (a < minConfidence || b < minConfidence);
  }
  function getAdjacentKeyPoints(keypoints, minConfidence) {
      return connectedPartIndices.reduce((result, [leftJoint, rightJoint]) => {
          if (eitherPointDoesntMeetConfidence(keypoints[leftJoint].score, keypoints[rightJoint].score, minConfidence)) {
              return result;
          }
          result.push([keypoints[leftJoint], keypoints[rightJoint]]);
          return result;
      }, []);
  }
  const { NEGATIVE_INFINITY, POSITIVE_INFINITY } = Number;
  function getBoundingBox(keypoints) {
      return keypoints.reduce(({ maxX, maxY, minX, minY }, { position: { x, y } }) => {
          return {
              maxX: Math.max(maxX, x),
              maxY: Math.max(maxY, y),
              minX: Math.min(minX, x),
              minY: Math.min(minY, y)
          };
      }, {
          maxX: NEGATIVE_INFINITY,
          maxY: NEGATIVE_INFINITY,
          minX: POSITIVE_INFINITY,
          minY: POSITIVE_INFINITY
      });
  }
  function getBoundingBoxPoints(keypoints) {
      const { minX, minY, maxX, maxY } = getBoundingBox(keypoints);
      return [
          { x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY },
          { x: minX, y: maxY }
      ];
  }
  async function toTensorBuffer(tensor, type = 'float32') {
      const tensorData = await tensor.data();
      return tf.buffer(tensor.shape, type, tensorData);
  }
  async function toTensorBuffers3D(tensors) {
      return Promise.all(tensors.map(tensor => toTensorBuffer(tensor, 'float32')));
  }
  function scalePose(pose, scaleY, scaleX, offsetY = 0, offsetX = 0) {
      return {
          score: pose.score,
          keypoints: pose.keypoints.map(({ score, part, position }) => ({
              score,
              part,
              position: { x: position.x * scaleX + offsetX,
                  y: position.y * scaleY + offsetY }
          }))
      };
  }
  function scalePoses(poses, scaleY, scaleX, offsetY = 0, offsetX = 0) {
      if (scaleX === 1 && scaleY === 1 && offsetY === 0 && offsetX === 0) {
          return poses;
      }
      return poses.map(pose => scalePose(pose, scaleY, scaleX, offsetY, offsetX));
  }
  function flipPoseHorizontal(pose, imageWidth) {
      return {
          score: pose.score,
          keypoints: pose.keypoints.map(({ score, part, position }) => ({
              score,
              part,
              position: { x: imageWidth - 1 - position.x,
                  y: position.y }
          }))
      };
  }
  function flipPosesHorizontal(poses, imageWidth) {
      if (imageWidth <= 0) {
          return poses;
      }
      return poses.map(pose => flipPoseHorizontal(pose, imageWidth));
  }
  function getInputTensorDimensions(input) {
      return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] :
          [input.height, input.width];
  }
  function toInputTensor(input) {
      return input instanceof tf.Tensor ? input : tf.browser.fromPixels(input);
  }
  function padAndResizeTo(input, [targetH, targetW], flipHorizontal = false) {
      const [height, width] = getInputTensorDimensions(input);
      const targetAspect = targetW / targetH;
      const aspect = width / height;
      let [padT, padB, padL, padR] = [0, 0, 0, 0];
      if (aspect < targetAspect) {
          padT = 0;
          padB = 0;
          padL = Math.round(0.5 * (targetAspect * height - width));
          padR = Math.round(0.5 * (targetAspect * height - width));
      }
      else {
          padT = Math.round(0.5 * ((1.0 / targetAspect) * width - height));
          padB = Math.round(0.5 * ((1.0 / targetAspect) * width - height));
          padL = 0;
          padR = 0;
      }
      let imageTensor = toInputTensor(input);
      imageTensor = tf.pad3d(imageTensor, [[padT, padB], [padL, padR], [0, 0]]);
      let resized;
      if (flipHorizontal) {
          resized = imageTensor.reverse(1).resizeBilinear([targetH, targetW]);
      }
      else {
          resized = imageTensor.resizeBilinear([targetH, targetW]);
      }
      return { resized, paddedBy: [[padT, padB], [padL, padR]] };
  }

  function mod(a, b) {
      return tf.tidy(() => {
          const floored = a.div(tf.scalar(b, 'int32'));
          return a.sub(floored.mul(tf.scalar(b, 'int32')));
      });
  }
  function argmax2d(inputs) {
      const [height, width, depth] = inputs.shape;
      return tf.tidy(() => {
          const reshaped = inputs.reshape([height * width, depth]);
          const coords = reshaped.argMax(0);
          const yCoords = coords.div(tf.scalar(width, 'int32')).expandDims(1);
          const xCoords = mod(coords, width).expandDims(1);
          return tf.concat([yCoords, xCoords], 1);
      });
  }

  function getPointsConfidence(heatmapScores, heatMapCoords) {
      const numKeypoints = heatMapCoords.shape[0];
      const result = new Float32Array(numKeypoints);
      for (let keypoint = 0; keypoint < numKeypoints; keypoint++) {
          const y = heatMapCoords.get(keypoint, 0);
          const x = heatMapCoords.get(keypoint, 1);
          result[keypoint] = heatmapScores.get(y, x, keypoint);
      }
      return result;
  }
  function getOffsetPoint$1(y, x, keypoint, offsetsBuffer) {
      return {
          y: offsetsBuffer.get(y, x, keypoint),
          x: offsetsBuffer.get(y, x, keypoint + NUM_KEYPOINTS)
      };
  }
  function getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer) {
      const result = [];
      for (let keypoint = 0; keypoint < NUM_KEYPOINTS; keypoint++) {
          const heatmapY = heatMapCoordsBuffer.get(keypoint, 0).valueOf();
          const heatmapX = heatMapCoordsBuffer.get(keypoint, 1).valueOf();
          const { x, y } = getOffsetPoint$1(heatmapY, heatmapX, keypoint, offsetsBuffer);
          result.push(y);
          result.push(x);
      }
      return tf.tensor2d(result, [NUM_KEYPOINTS, 2]);
  }
  function getOffsetPoints(heatMapCoordsBuffer, outputStride, offsetsBuffer) {
      return tf.tidy(() => {
          const offsetVectors = getOffsetVectors(heatMapCoordsBuffer, offsetsBuffer);
          return heatMapCoordsBuffer.toTensor()
              .mul(tf.scalar(outputStride, 'int32'))
              .toFloat()
              .add(offsetVectors);
      });
  }

  async function decodeSinglePose(heatmapScores, offsets, outputStride) {
      let totalScore = 0.0;
      const heatmapValues = argmax2d(heatmapScores);
      const [scoresBuffer, offsetsBuffer, heatmapValuesBuffer] = await Promise.all([
          toTensorBuffer(heatmapScores), toTensorBuffer(offsets),
          toTensorBuffer(heatmapValues, 'int32')
      ]);
      const offsetPoints = getOffsetPoints(heatmapValuesBuffer, outputStride, offsetsBuffer);
      const offsetPointsBuffer = await toTensorBuffer(offsetPoints);
      const keypointConfidence = Array.from(getPointsConfidence(scoresBuffer, heatmapValuesBuffer));
      const keypoints = keypointConfidence.map((score, keypointId) => {
          totalScore += score;
          return {
              position: {
                  y: offsetPointsBuffer.get(keypointId, 0),
                  x: offsetPointsBuffer.get(keypointId, 1)
              },
              part: partNames[keypointId],
              score
          };
      });
      heatmapValues.dispose();
      offsetPoints.dispose();
      return { keypoints, score: totalScore / keypoints.length };
  }

  const BASE_URL = 'https://storage.googleapis.com/tfjs-models/weights/posenet/';
  const RESNET50_BASE_URL = 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet_resnet50/quant2/';
  const checkpoints = {
      1.01: {
          url: BASE_URL + 'mobilenet_v1_101/',
          architecture: mobileNetArchitectures[100]
      },
      1.0: {
          url: BASE_URL + 'mobilenet_v1_100/',
          architecture: mobileNetArchitectures[100]
      },
      0.75: {
          url: BASE_URL + 'mobilenet_v1_075/',
          architecture: mobileNetArchitectures[75]
      },
      0.5: {
          url: BASE_URL + 'mobilenet_v1_050/',
          architecture: mobileNetArchitectures[50]
      }
  };
  const resnet50_checkpoints = {
      801: {
          32: RESNET50_BASE_URL + 'model-513x513-stride32.json',
          16: RESNET50_BASE_URL + 'model-513x513-stride16.json',
      },
      513: {
          32: RESNET50_BASE_URL + 'model-513x513-stride32.json',
          16: RESNET50_BASE_URL + 'model-513x513-stride16.json',
      },
      257: {
          32: RESNET50_BASE_URL + 'model-257x257-stride32.json',
          16: RESNET50_BASE_URL + 'model-257x257-stride16.json',
      }
  };

  class ModelWeights {
      constructor(variables) {
          this.variables = variables;
      }
      weights(layerName) {
          return this.variables[`MobilenetV1/${layerName}/weights`];
      }
      depthwiseBias(layerName) {
          return this.variables[`MobilenetV1/${layerName}/biases`];
      }
      convBias(layerName) {
          return this.depthwiseBias(layerName);
      }
      depthwiseWeights(layerName) {
          return this.variables[`MobilenetV1/${layerName}/depthwise_weights`];
      }
      dispose() {
          for (const varName in this.variables) {
              this.variables[varName].dispose();
          }
      }
  }

  function toFloatIfInt(input) {
      return tf.tidy(() => {
          if (input.dtype === 'int32')
              input = input.toFloat();
          const ImageNetMean = tf.tensor([-123.15, -115.90, -103.06]);
          return input.add(ImageNetMean);
      });
  }
  class ResNet {
      constructor(model, inputResolution, outputStride) {
          this.model = model;
          const inputShape = this.model.inputs[0].shape;
          [inputShape[1], inputShape[2]];
          tf.util.assert((inputShape[1] === inputResolution) &&
              (inputShape[2] === inputResolution), () => `Input shape [${inputShape[1]}, ${inputShape[2]}] ` +
              `must both be equal to ${inputResolution}`);
          this.inputResolution = inputResolution;
          this.outputStride = outputStride;
      }
      predict(input) {
          return tf.tidy(() => {
              const asFloat = toFloatIfInt(input);
              const asBatch = asFloat.expandDims(0);
              const [displacementFwd4d, displacementBwd4d, offsets4d, heatmaps4d] = this.model.predict(asBatch);
              const heatmaps = heatmaps4d.squeeze();
              const heatmapScores = heatmaps.sigmoid();
              const offsets = offsets4d.squeeze();
              const displacementFwd = displacementFwd4d.squeeze();
              const displacementBwd = displacementBwd4d.squeeze();
              return {
                  heatmapScores, offsets: offsets,
                  displacementFwd: displacementFwd,
                  displacementBwd: displacementBwd
              };
          });
      }
      dispose() {
          this.model.dispose();
      }
  }

  const RESNET_CONFIG = {
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: 257,
      multiplier: 1.0
  };
  function validateModelConfig(config) {
      config = config || RESNET_CONFIG;
      const VALID_ARCHITECTURE = ['MobileNetV1', 'ResNet50'];
      const VALID_STRIDE = { 'MobileNetV1': [8, 16, 32], 'ResNet50': [32, 16] };
      const VALID_RESOLUTION = {
          'MobileNetV1': [161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513],
          'ResNet50': [257, 513]
      };
      const VALID_MULTIPLIER = {
          'MobileNetV1': [0.25, 0.50, 0.75, 1.0, 1.01],
          'ResNet50': [1.0]
      };
      if (config.architecture == null) {
          config.architecture = 'MobileNetV1';
      }
      if (VALID_ARCHITECTURE.indexOf(config.architecture) < 0) {
          throw new Error(`Invalid architecture ${config.architecture}. ` +
              `Should be one of ${VALID_ARCHITECTURE}`);
      }
      if (config.outputStride == null) {
          config.outputStride = 16;
      }
      if (VALID_STRIDE[config.architecture].indexOf(config.outputStride) < 0) {
          throw new Error(`Invalid outputStride ${config.outputStride}. ` +
              `Should be one of ${VALID_STRIDE[config.architecture]} ` +
              `for architecutre ${config.architecture}.`);
      }
      if (config.inputResolution == null) {
          config.inputResolution = 513;
      }
      if (VALID_RESOLUTION[config.architecture].indexOf(config.inputResolution) <
          0) {
          throw new Error(`Invalid inputResolution ${config.inputResolution}. ` +
              `Should be one of ${VALID_RESOLUTION[config.architecture]} ` +
              `for architecutre ${config.architecture}.`);
      }
      if (config.multiplier == null) {
          config.multiplier = 1.0;
      }
      if (VALID_MULTIPLIER[config.architecture].indexOf(config.multiplier) < 0) {
          throw new Error(`Invalid multiplier ${config.multiplier}. ` +
              `Should be one of ${VALID_MULTIPLIER[config.architecture]} ` +
              `for architecutre ${config.architecture}.`);
      }
      return config;
  }
  const MULTI_PERSON_INFERENCE_CONFIG = {
      flipHorizontal: false,
      decodingMethod: 'multi-person',
      maxDetections: 5,
      scoreThreshold: 0.5,
      nmsRadius: 20
  };
  function validateInferenceConfig(config) {
      config = config || MULTI_PERSON_INFERENCE_CONFIG;
      const VALID_DECODING_METHOD = ['single-person', 'multi-person'];
      if (config.flipHorizontal == null) {
          config.flipHorizontal = false;
      }
      if (config.decodingMethod == null) {
          config.decodingMethod = 'multi-person';
      }
      if (VALID_DECODING_METHOD.indexOf(config.decodingMethod) < 0) {
          throw new Error(`Invalid decoding method ${config.decodingMethod}. ` +
              `Should be one of ${VALID_DECODING_METHOD}`);
      }
      if (config.decodingMethod == 'multi-person') {
          if (config.maxDetections == null) {
              config.maxDetections = 5;
          }
          if (config.maxDetections <= 0) {
              throw new Error(`Invalid maxDetections ${config.maxDetections}. ` +
                  `Should be > 0 for decodingMethod ${config.decodingMethod}.`);
          }
          if (config.scoreThreshold == null) {
              config.scoreThreshold = 0.5;
          }
          if (config.scoreThreshold < 0.0 || config.scoreThreshold > 1.0) {
              throw new Error(`Invalid scoreThreshold ${config.scoreThreshold}. ` +
                  `Should be in range [0.0, 1.0] for decodingMethod ${config.decodingMethod}.`);
          }
          if (config.nmsRadius == null) {
              config.nmsRadius = 20;
          }
          if (config.nmsRadius <= 0) {
              throw new Error(`Invalid nmsRadius ${config.nmsRadius}. ` +
                  `Should be positive for decodingMethod ${config.decodingMethod}.`);
          }
      }
      return config;
  }
  class PoseNet {
      constructor(net) {
          this.baseModel = net;
      }
      async estimatePoses(input, config = MULTI_PERSON_INFERENCE_CONFIG) {
        console.log("ESTIMATE POSES");
          config = validateInferenceConfig(config);
          const outputStride = this.baseModel.outputStride;
          const inputResolution = this.baseModel.inputResolution;
          assertValidOutputStride(outputStride);
          assertValidResolution(this.baseModel.inputResolution, outputStride);
          const [height, width] = getInputTensorDimensions(input);
          let [resizedHeight, resizedWidth] = [0, 0];
          let [padTop, padBottom, padLeft, padRight] = [0, 0, 0, 0];
          let heatmapScores, offsets, displacementFwd, displacementBwd;
          resizedHeight = inputResolution;
          resizedWidth = inputResolution;
          const outputs = tf.tidy(() => {
              const { resized, paddedBy } = padAndResizeTo(input, [resizedHeight, resizedWidth]);
              padTop = paddedBy[0][0];
              padBottom = paddedBy[0][1];
              padLeft = paddedBy[1][0];
              padRight = paddedBy[1][1];
              return this.baseModel.predict(resized);
          });
          heatmapScores = outputs.heatmapScores;
          offsets = outputs.offsets;
          displacementFwd = outputs.displacementFwd;
          displacementBwd = outputs.displacementBwd;
          const [scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer] = await toTensorBuffers3D([heatmapScores, offsets, displacementFwd, displacementBwd]);
          let poses;
          if (config.decodingMethod === 'multi-person') {
            console.log("decoding multiple poses");
              poses = await decodeMultiplePoses(scoresBuffer, offsetsBuffer, displacementsFwdBuffer, displacementsBwdBuffer, outputStride, config.maxDetections, config.scoreThreshold, config.nmsRadius);
              console.log(poses);
          }
          else {
            console.log("decoding single pose");
              const pose = await decodeSinglePose(heatmapScores, offsets, outputStride);
              poses = [pose];
          }
          const scaleY = (height + padTop + padBottom) / (resizedHeight);
          const scaleX = (width + padLeft + padRight) / (resizedWidth);
          let scaledPoses = scalePoses(poses, scaleY, scaleX, -padTop, -padLeft);
          if (config.flipHorizontal) {
              scaledPoses = flipPosesHorizontal(scaledPoses, width);
          }
          heatmapScores.dispose();
          offsets.dispose();
          displacementFwd.dispose();
          displacementBwd.dispose();
          return scaledPoses;
      }
      dispose() {
          this.baseModel.dispose();
      }
  }
  async function loadMobileNet(config) {
      const multiplier = config.multiplier;
      if (tf == null) {
          throw new Error(`Cannot find TensorFlow.js. If you are using a <script> tag, please ` +
              `also include @tensorflow/tfjs on the page before using this
        model.`);
      }
      const possibleMultipliers = Object.keys(checkpoints);
      tf.util.assert(typeof multiplier === 'number', () => `got multiplier type of ${typeof multiplier} when it should be a ` +
          `number.`);
      tf.util.assert(possibleMultipliers.indexOf(multiplier.toString()) >= 0, () => `invalid multiplier value of ${multiplier}.  No checkpoint exists for that ` +
          `multiplier. Must be one of ${possibleMultipliers.join(',')}.`);
      const mobileNet = await mobilenetLoader.load(config);
      return new PoseNet(mobileNet);
  }
  const mobilenetLoader = {
      load: async (config) => {
          const checkpoint = checkpoints[config.multiplier];
          const checkpointLoader = new CheckpointLoader(checkpoint.url);
          const variables = await checkpointLoader.getAllVariables();
          const weights = new ModelWeights(variables);
          return new MobileNet(weights, checkpoint.architecture, config.inputResolution, config.outputStride);
      },
  };
  async function loadResNet(config) {
      const inputResolution = config.inputResolution;
      const outputStride = config.outputStride;
      if (tf == null) {
          throw new Error(`Cannot find TensorFlow.js. If you are using a <script> tag, please ` +
              `also include @tensorflow/tfjs on the page before using this
        model.`);
      }
      const graphModel = await tf.loadGraphModel(resnet50_checkpoints[inputResolution][outputStride]);
      const resnet = new ResNet(graphModel, inputResolution, outputStride);
      return new PoseNet(resnet);
  }
  async function load(config = RESNET_CONFIG) {
      console.log('LOAD POSENET MODEL');
      await tf.ready();
      config = validateModelConfig(config);
      if (config.architecture === 'ResNet50') {
          return loadResNet(config);
      }
      else if (config.architecture === 'MobileNetV1') {
          return loadMobileNet(config);
      }
      else {
          return null;
      }
  }

  exports.decodeMultiplePoses = decodeMultiplePoses;
  exports.decodeSinglePose = decodeSinglePose;
  exports.MobileNet = MobileNet;
  exports.mobileNetArchitectures = mobileNetArchitectures;
  exports.CheckpointLoader = CheckpointLoader;
  exports.checkpoints = checkpoints;
  exports.partChannels = partChannels;
  exports.partIds = partIds;
  exports.partNames = partNames;
  exports.poseChain = poseChain;
  exports.load = load;
  exports.PoseNet = PoseNet;
  exports.getAdjacentKeyPoints = getAdjacentKeyPoints;
  exports.getBoundingBox = getBoundingBox;
  exports.getBoundingBoxPoints = getBoundingBoxPoints;
  exports.scalePose = scalePose;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
