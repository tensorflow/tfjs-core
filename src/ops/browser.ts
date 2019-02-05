/**
 * @license
 * Copyright 201 Google Inc. All Rights Reserved.
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

import {ENV} from '../environment';
import {Tensor3D} from '../tensor';
import {op} from './operation';

/**
 * Creates a `tf.Tensor` from an image.
 *
 * ```js
 * const image = new ImageData(1, 1);
 * image.data[0] = 100;
 * image.data[1] = 150;
 * image.data[2] = 200;
 * image.data[3] = 255;
 *
 * tf.browser.fromPixels(image).print();
 * ```
 *
 * @param pixels The input image to construct the tensor from. The
 * supported image types are all 4-channel.
 * @param numChannels The number of channels of the output tensor. A
 * numChannels value less than 4 allows you to ignore channels. Defaults to
 * 3 (ignores alpha channel of input image).
 */
/** @doc {heading: 'Tensors', subheading: 'Creation', namespace: 'browser'} */
function fromPixels_(
    pixels: ImageData|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement,
    numChannels = 3): Tensor3D {
  if (numChannels > 4) {
    throw new Error(
        'Cannot construct Tensor with more than 4 channels from pixels.');
  }
  return ENV.engine.fromPixels(pixels, numChannels);
}

export const fromPixels = op({fromPixels_});
