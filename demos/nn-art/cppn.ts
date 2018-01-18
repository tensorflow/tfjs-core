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

// tslint:disable-next-line:max-line-length
import {Array2D, ENV, gpgpu_util, GPGPUContext, MathBackendWebGL, NDArrayMath, Scalar, webgl_util} from 'deeplearn';

import * as nn_art_util from './nn_art_util';

const MAX_LAYERS = 10;

export type ColorMode = 'rgb'|'rgba'|'hsv'|'hsva'|'yuv'|'yuva'|'bw';
const colorModeOutputDimensions: {[colorMode in ColorMode]: number} = {
  'rgb': 3,
  'rgba': 4,
  'hsv': 3,
  'hsva': 4,
  'yuv': 3,
  'yuva': 4,
  'bw': 1
};

export type ActivationFunction = 'tanh'|'sin'|'relu'|'step';
const activationFunctionMap: {
  [activationFunction in ActivationFunction]: (
      math: NDArrayMath, ndarray: Array2D) => Array2D
} = {
  'tanh': (math: NDArrayMath, ndarray: Array2D) => math.tanh(ndarray),
  'sin': (math: NDArrayMath, ndarray: Array2D) => math.sin(ndarray),
  'relu': (math: NDArrayMath, ndarray: Array2D) => math.relu(ndarray),
  'step': (math: NDArrayMath, ndarray: Array2D) => math.step(ndarray)
};

const NUM_IMAGE_SPACE_VARIABLES = 3;  // x, y, r
const NUM_LATENT_VARIABLES = 2;

export class CPPN {
  private math: NDArrayMath;
  private backend: MathBackendWebGL;
  private gpgpu: GPGPUContext;
  private renderShader: WebGLProgram;
  // private addLatentVariablesShader: WebGLProgram;

  private inputAtlas: Array2D;
  private ones: Array2D<'float32'>;
  private weights: Array2D[] = [];

  private z1Counter = 0;
  private z2Counter = 0;
  private z1Scale: number;
  private z2Scale: number;
  private numLayers: number;

  private colorModeNames: ColorMode[] =
      ['rgb', 'rgba', 'hsv', 'hsva', 'yuv', 'yuva', 'bw'];

  private selectedColorModeName: ColorMode;
  private selectedActivationFunctionName: ActivationFunction;

  private isInferring = false;

  constructor(private inferenceCanvas: HTMLCanvasElement) {
    const gl = gpgpu_util.createWebGLContext(this.inferenceCanvas);
    this.gpgpu = new GPGPUContext(gl);
    this.backend = new MathBackendWebGL(this.gpgpu);
    const safeMode = false;
    this.math = new NDArrayMath(this.backend, safeMode);
    ENV.setMath(this.math);

    const maxTextureSize = webgl_util.queryMaxTextureSize(gl);
    const canvasSize = Math.floor(Math.sqrt(maxTextureSize));
    this.inferenceCanvas.width = canvasSize;
    this.inferenceCanvas.height = canvasSize;

    this.renderShader = nn_art_util.getRenderShader(this.gpgpu, canvasSize);

    this.inputAtlas = nn_art_util.createInputAtlas(
        canvasSize, NUM_IMAGE_SPACE_VARIABLES, NUM_LATENT_VARIABLES);
    this.ones = Array2D.ones([this.inputAtlas.shape[0], 1]);
  }

  generateWeights(neuronsPerLayer: number, weightsStdev: number) {
    for (let i = 0; i < this.weights.length; i++) {
      this.weights[i].dispose();
    }
    this.weights = [];

    this.weights.push(Array2D.randTruncatedNormal(
        [NUM_IMAGE_SPACE_VARIABLES + NUM_LATENT_VARIABLES, neuronsPerLayer], 0,
        weightsStdev));
    for (let i = 0; i < MAX_LAYERS; i++) {
      this.weights.push(Array2D.randTruncatedNormal(
          [neuronsPerLayer, neuronsPerLayer], 0, weightsStdev));
    }
    this.weights.push(Array2D.randTruncatedNormal(
        [neuronsPerLayer, 4 /** max output channels */], 0, weightsStdev));
  }

  setColorMode(colorMode: ColorMode) {
    this.selectedColorModeName = colorMode;
  }

  setActivationFunction(activationFunction: ActivationFunction) {
    this.selectedActivationFunctionName = activationFunction;
  }

  setNumLayers(numLayers: number) {
    this.numLayers = numLayers;
  }

  setZ1Scale(z1Scale: number) {
    this.z1Scale = z1Scale;
  }

  setZ2Scale(z2Scale: number) {
    this.z2Scale = z2Scale;
  }

  start() {
    this.isInferring = true;
    this.runInferenceLoop();
  }

  private runInferenceLoop() {
    if (!this.isInferring) {
      return;
    }

    const colorModeIndex =
        this.colorModeNames.indexOf(this.selectedColorModeName);
    const outputDimensions =
        colorModeOutputDimensions[this.selectedColorModeName];

    this.z1Counter += 1 / this.z1Scale;
    this.z2Counter += 1 / this.z2Scale;

    this.math.scope(() => {
      const concatAxis = 1;
      const z1 = Scalar.new(Math.sin(this.z1Counter));
      const z2 = Scalar.new(Math.cos(this.z2Counter));
      const latentVars = this.math.concat2D(
          this.math.multiply(z1, this.ones) as Array2D,
          this.math.multiply(z2, this.ones) as Array2D, concatAxis);

      let lastOutput =
          this.math.concat2D(this.inputAtlas, latentVars, concatAxis);

      for (let i = 0; i < this.numLayers; i++) {
        const lastLayer = (i === this.numLayers - 1);
        const matmulResult = this.math.matMul(
            lastOutput,
            lastLayer ? this.weights[this.weights.length - 1] :
                        this.weights[i]);

        lastOutput = lastLayer ?
            this.math.sigmoid(matmulResult) :
            activationFunctionMap[this.selectedActivationFunctionName](
                this.math, matmulResult);
      }
      console.log('o', lastOutput.shape);
      nn_art_util.render(
          this.gpgpu, this.renderShader,
          this.backend.getTexture(lastOutput.dataId), outputDimensions,
          colorModeIndex);
    });

    // inputAtlasWithLatentVariables.dispose();

    requestAnimationFrame(() => this.runInferenceLoop());
  }

  stopInferenceLoop() {
    this.isInferring = false;
  }
}
