---
layout: page
order: 2
---
# Training for ML Beginners

In order to get a model to learn to do the things we would like, we have to train it. There are various styles of training, but this guide will primarily focus on supoervised training. This is where we give build a model and give it some examples of inputs and _desired outputs_, we then adjust our model variables to learn to correctly map from these inputs to outputs and hopefully generalize to unseen inputs.

Lets look at a small toy example to get a feel for what training a model looks like. Note that this tutorials does not include machine learning best practices that deeplearn.js supports such as batching or shuffling training examples.

In this guide we will build a very simple model to learn the coefficients for a quadratic equation given a set of existing x, y observations. This is the equation we want to fit to our data

```
y = a * x^2 + b * x + c
```

To do this the key deeplearn.js API we will use is the *optimizer* API. We will set up some variables (or weights) to represent the coefficients (a, b and c), and the optimizer will automatically adjust the values of these coefficients. Lets take a look at the code, it is heavily commented so feel free to read through it slowly.

```js
import * as dl from 'deeplearn';

/**
 * We want to learn the coefficients that give correct solutions to the
 * following quadratic equation:
 *      y = a * x^2 + b * x + c
 * In other words we want to learn values for:
 *      a
 *      b
 *      c
 * Such that this function produces "desired outputs" for y when provided
 * with x. We will provide some examples of xs and ys to allow this model
 * to learn what we mean by desired outputs and then use it to produce new
 * values of y that fit the curve implied by our example.
 */


// Step 1. Set up variables, these are the things we want the model
// to learn in order to do prediction accurately. We will initialize
// them with random variables.
const a = dl.variable(dl.scalar(Math.random()));
const b = dl.variable(dl.scalar(Math.random()));
const c = dl.variable(dl.scalar(Math.random()));


// Step 2. Create an optimizer, we will use this later
const learningRate = 0.01;
const optimizer = new dl.SGDOptimizer(learningRate);

// Step 3. Write our training process functions.


/*
 * This function represents our 'model'. Given an input 'x' it will try and predict
 * the appropriate output 'y'.
 *
 * This could be as complicated a 'neural net' as we would like, but we can just
 * directly model the quadratic equation we are trying to model.
 *
 * It is also sometimes referred to as the "forward" step of our training process.
 * Though we will use the same function for predictions later.
 *
 *
 * @return number predicted y value
 */
function predict(input) {
  // y = a * x ^ 2 + b * x + c
  return dl.tidy(() => {
    const x = dl.scalar(input);

    const ax2 = a.mul(x.square());
    const bx = b.mul(x);
    const y = ax2.add(bx).add(c);

    return y;
  });
}

/*
 * This will tell us how good a prediction is from what we expect.
 *
 * prediction is a tensor with our predicted y value
 * actual number is a number with the y value the model should have predicted
 */
function loss(prediction, actual) {
  // Having a good error metric is key for training a machine learning model
  // Feel free to experiment with this and see how it affects the result.
  const error = dl.scalar(actual).sub(prediction).square();
  return error;
}

/*
 * This will iteratively train our model. We test how well it is doing
 * after numIterations by calculating the mean error over all the given
 * samples after our training.
 *
 * xs - training data x values
 * ys — training data y values
 */
function train(xs, ys, numIterations, done) {
  let currentIteration = 0;

  // We use requestAnimationFrame to not block the browser ui.
  requestAnimationFrame(function trainStep() {
    for (let i = 0; i < xs.length; i++) {
      // Minimize is where the magic happens, we must return a
      // numerical estimate of how well we are doing using the
      // current state of the variables we created at the start.

      // This optimizer does the 'backward' step of our training data
      // updating variables defined previously based on the amount error
      // from the last step.
      optimizer.minimize(() => {
        // Feed the examples into the model
        const pred = predict(xs[i]);
        const predLoss = loss(pred, ys[i]);

        return predLoss;
      });
    }

    // Keep training until we finish the specified number of iterations.
    if (currentIteration < numIterations) {
      currentIteration += 1;
      requestAnimationFrame(trainStep);
    } else {
      done();
    }
  });
}

/*
 * This function compare expected results with the predicted results from
 * our model.
 */
function test(xs, ys) {
  dl.tidy(() => {
    const predictedYs = xs.map(predict);
    console.log('Expected', ys);
    console.log('Got', predictedYs.map((p) => p.dataSync()[0]));
  })
}


const data = {
  xs: [0, 1, 2, 3],
  ys: [1.1, 5.9, 16.8, 33.9]
};

// Lets see how it does before training.
console.log("Before training: using random coefficients")
test(data.xs, data.ys);
train(data.xs, data.ys, 50, () => {
  console.log(
      `After training: a=${a.dataSync()}, b=${b.dataSync()}, c=${c.dataSync()}`)
  test(data.xs, data.ys);
});

// Huzzah We have trained a simple machine learning model!
```


After training the model, you can infer through the graph again to get a
value for "y" given an "x".

This is a very simple model and training setup. Too simple for most challenges we would want to use neural networks for. In practice we would likely not just use `Scalar` variables. We would likely want to use techniques like batching our training data, which allows us to run prediction over a number of inputs in parallel, and computing error over a batch. As well as shuffling our training data, so that the model doesn't learn something dependent on the order of examples. Future tutorials will explore common techniques used in building more robust training pipelines.
