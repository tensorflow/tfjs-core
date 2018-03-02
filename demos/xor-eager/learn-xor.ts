/* Copyright 2017 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
'use strict';

import * as dl from 'deeplearn';

const EPSILON = dl.scalar(1e-7);
const HIDDEN_UNITS = 10;
const one = dl.scalar(1);

const input = [[0, 0], [0, 1], [1, 0], [1, 1]];
const target = [[0], [1], [1], [0]];

const inputTensor: dl.Tensor2D = dl.tensor2d(input, [4, 2]);

const targetTensor: dl.Tensor2D = dl.tensor2d(target, [4, 1]);

const fullyConnectedWeights1 =
    dl.variable(initializeWeights([2, HIDDEN_UNITS], 2) as dl.Tensor2D);

const fullyConnectedBias1 = dl.variable(dl.scalar(0) as dl.Scalar);

const fullyConnectedWeights2 = dl.variable(
    initializeWeights([HIDDEN_UNITS, 1], HIDDEN_UNITS) as dl.Tensor2D);

const fullyConnectedBias2 = dl.variable(dl.scalar(0) as dl.Scalar);

const optimizer = new dl.SGDOptimizer(0.1);

const getRandomIntegerInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function initializeWeights(shape: number[], prevLayerSize: number) {
  return dl.randomNormal(shape).mul(dl.scalar(Math.sqrt(2.0 / prevLayerSize)));
}

function calculateCost(y: dl.Tensor2D, output: dl.Tensor2D): dl.Scalar {
  return dl.add(
               y.mul(output.add(EPSILON).log()),
               one.sub(y).mul(one.sub(output).add(EPSILON).log()))
             .sum()
             .neg() as dl.Scalar;
}

function model(xs: dl.Tensor2D): dl.Tensor2D {
  const hiddenLayer = dl.tidy(() => {
    return xs.matMul(fullyConnectedWeights1).add(fullyConnectedBias1).relu() as
        dl.Tensor2D;
  });

  return hiddenLayer.matMul(fullyConnectedWeights2)
             .add(fullyConnectedBias2)
             .sigmoid() as dl.Tensor2D;
}

// Train the model.
export async function train(iterations: number) {
  const returnCost = true;
  let cost;

  for (let i = 0; i < iterations; i++) {
    cost = optimizer.minimize(() => {
      return calculateCost(targetTensor, model(inputTensor));
    }, returnCost);

    if (i % 10 === 0) {
      console.log(`loss[${i}]: ${cost.getValues()}`);
    }

    await dl.nextFrame();
  }

  return cost.dataSync();
}

export const learnXOR = async () => {
  const iterations = getRandomIntegerInRange(800, 1000);
  const timeStart: number = performance.now();
  const result = [];

  const loss = await train(iterations);

  /**
   * Test the model
   */
  for (let i = 0; i < 4; i += 1) {
    const inputData = dl.tensor2d([input[i]], [1, 2]);
    const expectedOutput = dl.tensor1d(target[i]);

    const val = model(inputData);

    result.push({
      input: await inputData.data(),
      expected: await expectedOutput.data(),
      output: await val.data()
    });
  }

  const timeEnd: number = performance.now();
  const time = timeEnd - timeStart;

  return {iterations, loss: loss[0], time, result};
};
