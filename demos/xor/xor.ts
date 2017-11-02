import {
    Array1D,
    CostReduction,
    Graph,
    InCPUMemoryShuffledInputProviderBuilder,
    NDArrayMathGPU,
    Session,
    SGDOptimizer
} from '../deeplearn';

const graph = new Graph();
const math = new NDArrayMathGPU();

const input = graph.placeholder('input', [2]);
const y = graph.placeholder('y', [1]);

const hiddenLayer = graph.layers.dense(
    'hiddenLayer',
    input,
    2,
    (x) => graph.relu(x), true);
const output = graph.layers.dense('outputLayer', hiddenLayer, 1);

const costTensor = graph.meanSquaredCost(output, y);

const session = new Session(graph, math);
const optimizer = new SGDOptimizer(0.01);

const inputArray = [
    Array1D.new([0, 0]),
    Array1D.new([0, 1]),
    Array1D.new([1, 0]),
    Array1D.new([1, 1])
];

const targetArray = [
    Array1D.new([0]),
    Array1D.new([1]),
    Array1D.new([1]),
    Array1D.new([0])
];

const shuffledInputProviderBuilder =
    new InCPUMemoryShuffledInputProviderBuilder([
        inputArray,
        targetArray
    ]);

const [
    inputProvider,
    targetProvider
] = shuffledInputProviderBuilder.getInputProviders();

const feedEntries = [
    {tensor: input, data: inputProvider},
    {tensor: y, data: targetProvider}
];

/**
 * Train the model
 */
for (let i = 0; i < 1000; i += 1) {

    math.scope(() => {

        const cost = session.train(
            costTensor,
            feedEntries,
            5,
            optimizer,
            CostReduction.MEAN);

        if (i % 10 === 0) {
            const costValue = cost.get();
            console.log(costValue);
        }
    });
}

/**
 * Test the model
 */
for (let i = 0; i < 4; i += 1) {
    const data = inputArray[i];
    const val = session.eval(output, [{tensor: input, data}]);
    console.log(data.dataSync(), val.getValues());
}