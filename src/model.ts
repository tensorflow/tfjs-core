/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as dl from './index';

//// API code as part of dl. /////

interface Dataset {
  next(): dl.Tensor;
}

interface Model {
  initVars(): void;
  loss(batch: dl.Tensor): dl.Scalar;
  predict(batch: dl.Tensor): dl.Tensor;
  dispose(): void;
}

// Exposed via dl.train.trainer().
class Trainer {
  constructor(
      private model: Model, private dataset: Dataset,
      private optimizer: dl.Optimizer) {
    model.initVars();
  }
  async train(
      everyNumSteps: number,
      callback: (step: number, loss: number) => boolean | void): Promise<void> {
    let step = 0;
    while (true) {
      ++step;
      const batch = this.dataset.next();
      const returnLoss = step % everyNumSteps === 0;
      const loss =
          this.optimizer.minimize(() => this.model.loss(batch), returnLoss);
      if (returnLoss) {
        const shouldStop = callback(step, loss.dataSync()[0]);
        loss.dispose();
        if (shouldStop) {
          break;
        }
      }
      batch.dispose();
      // Smart logic using timing info to decide how often to await next frame.
      const giveHandleToUI = true;
      if (giveHandleToUI) {
        await dl.nextFrame();
      }
    }
  }
}

//// User code below. ////

// Generate random numbers with mean 0.
class SomeDataset implements Dataset {
  next(): dl.Tensor {
    return dl.scalar(Math.random());
  }
}

// Silly model that learns the mean of the data.
class SomeModel implements Model {
  private mean: dl.Variable;

  initVars() {
    this.mean = dl.variable(dl.scalar(Math.random()));
  }
  predict(batch: dl.Tensor) {
    return this.mean;
  }
  loss(batch: dl.Tensor): dl.Scalar {
    return batch.sub(this.mean).square().mean();
  }
  dispose() {
    this.mean.dispose();
  }
}

const model = new SomeModel();
const dataset = new SomeDataset();
const optimizer = dl.train.sgd(0.01);

// Exposed as dl.train.trainer().
const tr = new Trainer(model, dataset, optimizer);

// Calls back every 10 steps.
await tr.train(10, (step, loss) => {
  console.log(step, loss);
  if (step >= 1000) {
    // Stop training.
    return true;
  }
  return false;
});
// Test what the model learned - don't care much about the next mem leak.
console.log(model.predict(dataset.next()));
model.dispose();  // For pedantic users, clean up all variables.
