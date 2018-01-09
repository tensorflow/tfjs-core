import {Array1D, NDArray, NDArrayMath, Scalar} from 'deeplearn';
import {PredictionModel} from './prediction_model';

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
const MODEL_TXT_FILE_URL = 'http://localhost:8000/squeezenet.pbtxt';
const MODEL_FILE_URL = 'http://localhost:8000/squeezenet.pb';
export class SqueezeNet extends PredictionModel {
  constructor(math: NDArrayMath) {
    super(math, MODEL_FILE_URL);
  }

  /**
   * Infer through SqueezeNet, assumes variables have been loaded. This does
   * standard ImageNet pre-processing before inferring through the model. This
   * method returns named activations as well as pre-softmax logits.
   *
   * @param input un-preprocessed input Array.
   * @return The pre-softmax logits.
   */
  predict(input: NDArray): Array1D {
    const reshapedInput = input.reshape([1, ...input.shape]);
    return super.predict(undefined, {
      'image_placeholder': reshapedInput,
      'Placeholder': Scalar.new(1.0)
    }) as Array1D;
  };
}
