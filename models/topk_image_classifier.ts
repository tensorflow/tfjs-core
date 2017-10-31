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
import {SqueezeNet} from './squeezenet';
import {Array3D, NDArrayMathCPU, NDArrayMathGPU} from '../src';

export class TopKImageClassifier {
  private logitsPerClass: Array3D[] = [];
  private classExampleCount: number[] = [];
  private squeezeNet: SqueezeNet;
  private trainLogitsMatrix: Array3D;
  private varsLoaded = false;

  constructor(private numClasses: number, private k: number,
    private math: NDArrayMathGPU, private mathCPU: NDArrayMathCPU) {
    for (let i = 0; i < this.numClasses; i++) {
      this.logitsPerClass.push(null);
      this.classExampleCount.push(0);
    }
    this.squeezeNet = new SqueezeNet(this.math);
    this.squeezeNet.loadVariables().then(() => {
      this.varsLoaded = true;
    });
  }

  public clearClass(classIndex: number) {
    this.logitsPerClass[classIndex] = null;
    this.classExampleCount[classIndex] = 0;
    if (this.trainLogitsMatrix != null) {
      this.trainLogitsMatrix.dispose();
      this.trainLogitsMatrix = null;
    }
  }

  public async addImage(image: Array3D, classIndex: number) {
    if (!this.varsLoaded) {
      return;
    }
    if (this.trainLogitsMatrix != null) {
      this.trainLogitsMatrix.dispose();
      this.trainLogitsMatrix = null;
    }
    await this.math.scope(async (keep, track) => {
      const imageLogits = this.squeezeNet.infer(image).logits;
      if (!this.logitsPerClass[classIndex]) {
        this.logitsPerClass[classIndex] = imageLogits.as3D(1, 1000, 1);
      } else {
        const newTrainLogitsMatrix = this.math.concat3D(
          this.logitsPerClass[classIndex].as3D(
            this.classExampleCount[classIndex], 1000, 1),
          imageLogits.as3D(1, 1000, 1), 0);
        this.logitsPerClass[classIndex].dispose();
        this.logitsPerClass[classIndex] = newTrainLogitsMatrix;
      }
      keep(this.logitsPerClass[classIndex]);
      this.classExampleCount[classIndex] += 1;
  });
  }

  public infer(image: Array3D): {classIndex: number, confidences: number[]} {
    let imageClass = -1;
    const confidences = new Array<number>(this.numClasses);
    if (!this.varsLoaded) {
      return {classIndex: imageClass, confidences};
    }
    this.math.scope((keep) => {
      const imageLogits = this.squeezeNet.infer(image).logits;
      if (this.trainLogitsMatrix == null) {
        let newTrainLogitsMatrix = null;

        for (let index = 0; index < this.numClasses; index += 1) {
          newTrainLogitsMatrix = this.concat(
            newTrainLogitsMatrix, this.logitsPerClass[index]);
        }
        this.trainLogitsMatrix = newTrainLogitsMatrix;
      }

      if (this.trainLogitsMatrix == null) {
        return;
      }
      keep(this.trainLogitsMatrix);
      const numExamples = this.getNumExamples();
      const knn = this.math.matMul(
        this.trainLogitsMatrix.as2D(numExamples, 1000),
        imageLogits.as2D(1000, 1)).as1D();
      const kVal = Math.min(this.k, numExamples);
      const topK = this.mathCPU.topK(knn, kVal);
      const indices = topK.indices.dataSync();

      const indexMapForClasses = [];
      const classTopKMap = [];
      for (let index = 0; index < this.numClasses; index++) {
        classTopKMap.push(0);
        let num = this.classExampleCount[index];
        if (index > 0) {
          num += indexMapForClasses[index - 1];
        }
        indexMapForClasses.push(num);
      }
      for (let index = 0; index < indices.length; index += 1) {
        let classForEntry = 0;
        for (; classForEntry < indexMapForClasses.length; classForEntry++) {
          if (indices[index] < indexMapForClasses[classForEntry]) {
            break;
          }
        }
        classTopKMap[classForEntry] += 1;
      }


      let topConfidence = 0;
      for (let index = 0; index < this.numClasses; index += 1) {
        const probability = classTopKMap[index] / kVal;
        if (probability > topConfidence) {
          topConfidence = probability;
          imageClass = index;
        }
        confidences[index] = probability;
      }
    });
    return {classIndex: imageClass, confidences};
  }

  private concat(ndarray1: Array3D, ndarray2: Array3D): Array3D {
    if (ndarray1 == null && ndarray2 == null) {
      return null;
    }
    if (ndarray1 === null) {
      return this.math.clone(ndarray2);
    } else if (ndarray2 === null) {
      return this.math.clone(ndarray1);
    }
    const axis = 0;
    return this.math.concat3D(
      ndarray1.as3D(ndarray1.shape[0], 1000, 1),
      ndarray2.as3D(ndarray2.shape[0], 1000, 1), axis);
  }

  private getNumExamples() {
    let total = 0;
    for (let index = 0; index < this.classExampleCount.length; index += 1) {
      total += this.classExampleCount[index];
    }

    return total;
  }
}