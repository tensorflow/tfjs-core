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

import { Cache } from './ModelCache.ts';
import {
  CheckpointLoader, NDArrayMathGPU, Scalar, Array1D
} from "deeplearn";

let variables: any;
let math: NDArrayMathGPU;

const NUM_LAYERS = 4;
const IMAGE_SIZE = 64;

export default class Model {
  public metaData = "A";
  public dimensions = 40;
  private inferCache = new Cache(this, this.infer);
  private numberOfValidChars = 62;
  public range = 0.4;
  public charIdMap: any = {};
  private multiplierScalar = Scalar.new(255);

  constructor() {
    // Set up character ID mapping.
    for (let i = 65; i < 91; i++) {
      this.charIdMap[String.fromCharCode(i)] = i - 65;
    }
    for (let i = 97; i < 123; i++) {
      this.charIdMap[String.fromCharCode(i)] = i - 97 + 26;
    }
    for (let i = 48; i < 58; i++) {
      this.charIdMap[String.fromCharCode(i)] = i - 48 + 52;
    }
  }

  load(cb: any) {
    const checkpointLoader = new CheckpointLoader(
      "https://storage.googleapis.com/learnjs-data/checkpoint_zoo/fonts/");
    checkpointLoader.getAllVariables().then(vars => {
      variables = vars;
      cb();
    });
  }

  get(id: number, args: any, priority: number) {
    args.push(this.metaData);

    return new Promise((resolve, reject) => {
      args.push((d: any) => resolve(d));
      this.inferCache.get(id, args);
    });
  }

  remove(id: number) {
    //TODO
  }

  init() {
    math = new NDArrayMathGPU();
  }

  infer(args: any) {
    const embedding = args[0];
    const ctx = args[1];
    const char = args[2];
    const cb = args[3];

    const charId = this.charIdMap[char.charAt(0)];
    if (charId == null) {
      throw (new Error("Invalid character id"))
    }

    const adjusted = math.scope((keep, track) => {
      const idx = track(Array1D.new([charId]));
      const onehotVector = math.oneHot(idx, this.numberOfValidChars).as1D();

      const inputData = math.concat1D(embedding.as1D(), onehotVector);

      let lastOutput = inputData;

      for (let i = 0; i < NUM_LAYERS; i++) {
        const weights = variables[`Stack/fully_connected_${i + 1}/weights`];
        const biases = variables[`Stack/fully_connected_${i + 1}/biases`];
        lastOutput = math.relu(
          math.add(math.vectorTimesMatrix(lastOutput, weights), biases)) as any;
      }

      const finalWeights = variables['fully_connected/weights'];
      const finalBiases = variables['fully_connected/biases'];
      const finalOutput = math.sigmoid(
        math.add(math.vectorTimesMatrix(
          lastOutput, finalWeights), finalBiases));

      // Convert the inferred tensor to the proper scaling then draw it.
      const scaled = math.scalarTimesArray(this.multiplierScalar, finalOutput);
      return math.scalarMinusArray(this.multiplierScalar, scaled);
    });

    const d = adjusted.as3D(IMAGE_SIZE, IMAGE_SIZE, 1);

    d.data().then(() => {
      const imageData = ctx.createImageData(IMAGE_SIZE, IMAGE_SIZE);

      let pixelOffset = 0;
      for (let i = 0; i < d.shape[0]; i++) {
        for (let j = 0; j < d.shape[1]; j++) {
          const value = d.get(i, j, 0);
          imageData.data[pixelOffset++] = value;
          imageData.data[pixelOffset++] = value;
          imageData.data[pixelOffset++] = value;
          imageData.data[pixelOffset++] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      d.dispose();

      cb();
    });
  }
}
