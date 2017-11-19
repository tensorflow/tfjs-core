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
import {Array1D, Array3D, Array4D, CheckpointLoader, initializeGPU, Model, NDArray, NDArrayMath, NDArrayMathGPU, Scalar} from 'deeplearn';
import {BoundingBox} from './mobilenet_utils'; 

//const GOOGLE_CLOUD_STORAGE_DIR = 'https://storage.googleapis.com/learnjs-data/checkpoint_zoo/';
   
export class MobileNet implements Model {  
  private variables: {[varName: string]: NDArray};

  private preprocessOffset = Array1D.new([103.939, 116.779, 123.68]);

  // yolo variables
  private HALF_TWO_FIVE_FIVE  = Scalar.new(255.0/2);
  private ONE = Scalar.ONE;
  private THRESHOLD = 0.3;
  private ANCHORS: number[] = [0.57273, 0.677385, 1.87446, 2.06253, 3.33843, 5.47434, 7.88282, 3.52778, 9.77052, 9.16828];

  constructor(private math: NDArrayMath) {
    // TODO(nsthorat): This awful hack is because we need to share the global
    // GPGPU between deeplearn loaded from standalone as well as the internal
    // deeplearn that gets compiled as part of this model. Remove this once we
    // decouple NDArray from storage mechanism.
    initializeGPU(
        (this.math as NDArrayMathGPU).getGPGPUContext(),  
        (this.math as NDArrayMathGPU).getTextureManager());
  }

  /**
   * Loads necessary variables for MobileNet.
   */
  async load(): Promise<void> {
    const checkpointLoader =
        new CheckpointLoader('weights/');
    this.variables = await checkpointLoader.getAllVariables();
  }

    /**
   * Infer through MobileNet, assumes variables have been loaded. This does
   * standard ImageNet pre-processing before inferring through the model. This
   * method returns named activations as well as pre-softmax logits.
   *
   * @param input un-preprocessed input Array.
   * @return Named activations and the pre-softmax logits.
   */
  async predict(input: Array3D): Promise<{
    netout: Array4D
  }> {
    // Keep a map of named activations for rendering purposes.
    const netout = this.math.scope((keep) => {
      // Preprocess the input.
      const preprocessedInput = this.math.subtract(this.math.arrayDividedByScalar(input, this.HALF_TWO_FIVE_FIVE), this.ONE) as Array3D;

      const x1  = this._conv_block(preprocessedInput, [2, 2])
      const x2  = this._depthwise_conv_block(x1,  [1, 1], 1)

      const x3  = this._depthwise_conv_block(x2,  [2, 2], 2)
      const x4  = this._depthwise_conv_block(x3,  [1, 1], 3)

      const x5  = this._depthwise_conv_block(x4,  [2, 2], 4)
      const x6  = this._depthwise_conv_block(x5,  [1, 1], 5)

      const x7  = this._depthwise_conv_block(x6,  [2, 2], 6)
      const x8  = this._depthwise_conv_block(x7,  [1, 1], 7)
      const x9  = this._depthwise_conv_block(x8,  [1, 1], 8)
      const x10 = this._depthwise_conv_block(x9,  [1, 1], 9)
      const x11 = this._depthwise_conv_block(x10, [1, 1], 10)
      const x12 = this._depthwise_conv_block(x11, [1, 1], 11)

      const x13 = this._depthwise_conv_block(x12, [2, 2], 12)
      const x14 = this._depthwise_conv_block(x13, [1, 1], 13) 

      const x15 = this.math.conv2d(x14, // input
                                   this.variables['conv_23/kernel'] as Array4D, // filter
                                   this.variables['conv_23/bias'] as Array1D, // bias
                                   [1,1], // stride
                                   'same'); // padding      
 
      return x15.as4D(13, 13, 5, 6);
    });

    return {netout: netout};
    } 

  private _conv_block(inputs: Array3D, strides: [number, number]) { 

    const x1 = this.math.conv2d(inputs, // input
                                this.variables['conv1/kernel'] as Array4D, // filter
                                null, // bias
                                strides, // stride
                                'same'); // padding

    const x2 = this.math.batchNormalization3D(x1,
                                              this.variables['conv1_bn/moving_mean'] as Array1D, // mean
                                              this.variables['conv1_bn/moving_variance'] as Array1D, // variance
                                              .001,
                                              this.variables['conv1_bn/gamma'] as Array1D, // gamma
                                              this.variables['conv1_bn/beta'] as Array1D); // beta

    return this.math.clip(x2, 0, 6); // simple implementation of Relu6
  }

  private _depthwise_conv_block(inputs: Array3D,
                                strides: [number, number],
                                blockID: number) {

    const x1 = this.math.depthwiseConv2D(inputs, // input
                                         this.variables['conv_dw_' + blockID + '/depthwise_kernel'] as Array4D, // filter
                                         strides, // strides
                                         'same') as Array3D; // padding

    const x2 = this.math.batchNormalization3D(x1, 
                                              this.variables['conv_dw_' + blockID + '_bn/moving_mean'] as Array1D, // mean
                                              this.variables['conv_dw_' + blockID + '_bn/moving_variance'] as Array1D, // variance
                                              .001,
                                              this.variables['conv_dw_' + blockID + '_bn/gamma'] as Array1D, // gamma
                                              this.variables['conv_dw_' + blockID + '_bn/beta'] as Array1D); // beta

    const x3 = this.math.clip(x2, 0, 6)

    const x4 = this.math.conv2d(x3, // input
                                this.variables['conv_pw_' + blockID + '/kernel'] as Array4D, // filter
                                null, // bias
                                [1, 1], // strides
                                'same'); // padding

    const x5 = this.math.batchNormalization3D(x4, 
                                              this.variables['conv_pw_' + blockID + '_bn/moving_mean'] as Array1D, // mean
                                              this.variables['conv_pw_' + blockID + '_bn/moving_variance'] as Array1D, // variance
                                              .001,
                                              this.variables['conv_pw_' + blockID + '_bn/gamma'] as Array1D, // gamma
                                              this.variables['conv_pw_' + blockID + '_bn/beta'] as Array1D); // beta

    return this.math.clip(x5, 0, 6)
  }

  interpret_netout(netout: Array4D){ 
    // interpret the output by the network
    var [GRID_H, GRID_W, BOX, CLASS] = netout.shape;
    const values = netout.getValues() as Float32Array;
    const boxes: BoundingBox[] = new Array<BoundingBox>();

    CLASS = CLASS - 5;

    for (var row = 0; row < GRID_H; row++) {
      for (var col = 0; col < GRID_W; col++) {
        for (var box = 0; box < BOX; box++) {
          const l_bound = netout.locToIndex([row, col, box, 0]);
         
          // get and adjust the confidence of the box
          var confidence = this.sigmoid(values[l_bound+4]);

          // get and adjust class likelihoods
          var classes = values.slice(l_bound+5, l_bound+5+CLASS);
          classes = this.sofmax(classes).map((x) => (x * confidence)).map((x) => x > this.THRESHOLD ? x : 0);

          if (classes.reduce(( a, b ) => a + b, 0) > 0) {
            var x = values[l_bound];
            var y = values[l_bound+1];
            var w = values[l_bound+2];
            var h = values[l_bound+3];
            
            x = (col + this.sigmoid(x)) / GRID_W;
            y = (row + this.sigmoid(y)) / GRID_H;
            w = this.ANCHORS[2 * box + 0] * Math.exp(w) / GRID_W;
            h = this.ANCHORS[2 * box + 1] * Math.exp(h) / GRID_H;

            boxes.push(new BoundingBox(x, y, w, h, confidence, classes));
          }
        }
      }
    }

    // suppress nonmaximal boxes
    for (var cls = 0; cls < CLASS; cls++) {
      const all_probs = boxes.map((box) => box.probs[cls])
      var indices = new Array(all_probs.length);

      for (var i = 0; i < all_probs.length; ++i) indices[i] = i;
      indices.sort((a,b) => {return all_probs[a] > all_probs[b] ? 1 : 0});

      for (var i = 0; i < all_probs.length; i++) {
        const index_i = indices[i];

        if (boxes[index_i].probs[cls] == 0) {
          continue
        } else {
          for (var j = i+1; j < all_probs.length; j++){
            const index_j = indices[j];

            if (boxes[index_i].iou(boxes[index_j]) > 0.4) {
              boxes[index_j].probs[cls] = 0;
            }
          }
        }
      }

    }

    // obtain the most likely boxes
    var likelyBoxes = []

    for (let box of boxes) {
      if (box.getMaxProb() > this.THRESHOLD) { 
        likelyBoxes.push(box);
      }
    }

    return likelyBoxes
  }

  private sigmoid(x: number): number {
    return 1./ (1. + Math.exp(-x));
  }

  private sofmax(x: Float32Array): Float32Array {
    const expX = x.map(Math.exp);
    const sumX = expX.reduce((a,b) => (a+b));

    return expX.map((x) => (x/sumX));
  }

  dispose() {
    this.preprocessOffset.dispose();
    for (const varName in this.variables) {
      this.variables[varName].dispose();
    }
  }
}