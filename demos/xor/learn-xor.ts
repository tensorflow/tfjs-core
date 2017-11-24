import {Array1D, CostReduction, Graph, NDArrayMathGPU} from 'deeplearn';
import {InCPUMemoryShuffledInputProviderBuilder} from 'deeplearn';
import {Session, SGDOptimizer, Tensor} from 'deeplearn';
import {Scalar} from 'deeplearn';

const EPSILON = 1e-7;

const getRandomIntegerInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const learnXOR = () => {
  const iterations = getRandomIntegerInRange(800, 1000);
  let loss: number;
  let cost: Scalar;

  const graph = new Graph();
  const math = new NDArrayMathGPU();

  const input = graph.placeholder('input', [2]);
  const y = graph.placeholder('y', [1]);

  const hiddenLayer = graph.layers.dense(
      'hiddenLayer', input, 10, (x: Tensor) => graph.relu(x), true);
  const output = graph.layers.dense(
      'outputLayer', hiddenLayer, 1, (x: Tensor) => graph.sigmoid(x), true);

  const costTensor = graph.reduceSum(graph.add(
      graph.multiply(
          graph.constant([-1]),
          graph.multiply(
              y, graph.log(graph.add(output, graph.constant([EPSILON]))))),
      graph.multiply(
          graph.constant([-1]),
          graph.multiply(
              graph.subtract(graph.constant([1]), y),
              graph.log(graph.add(
                  graph.subtract(graph.constant([1]), output),
                  graph.constant([EPSILON])))))));

  const session = new Session(graph, math);
  const optimizer = new SGDOptimizer(0.2);

  const inputArray = [
    Array1D.new([0, 0]), Array1D.new([0, 1]), Array1D.new([1, 0]),
    Array1D.new([1, 1])
  ];

  const targetArray =
      [Array1D.new([0]), Array1D.new([1]), Array1D.new([1]), Array1D.new([0])];

  const shuffledInputProviderBuilder =
      new InCPUMemoryShuffledInputProviderBuilder([inputArray, targetArray]);

  const [inputProvider, targetProvider] =
      shuffledInputProviderBuilder.getInputProviders();

  const feedEntries =
      [{tensor: input, data: inputProvider}, {tensor: y, data: targetProvider}];

  /**
   * Train the model
   */
  math.scope(() => {
    for (let i = 0; i < iterations; i += 1) {
      cost = session.train(
          costTensor, feedEntries, 4, optimizer, CostReduction.MEAN);
    }
    loss = cost.get();
  });

  /**
   * Test the model
   */
  for (let i = 0; i < 4; i += 1) {
    const inputData = inputArray[i];
    const val = session.eval(output, [{tensor: input, data: inputData}]);
    console.log(inputData.dataSync(), val.getValues());
  }

  console.log(iterations);

  return {iterations, loss};
};
