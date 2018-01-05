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
import {Array1D, ENV} from 'deeplearn';

export interface ITopK {
  indices: Int32Array;
  values: Float32Array;
}

/**
 * Get the topK classes for pre-softmax logits. Returns a map of className
 * to softmax normalized probability.
 *
 * @param logits Pre-softmax logits array.
 * @param topK How many top classes to return.
 */
export async function getTopK(prob: Array1D, topK: number): Promise<ITopK> {
  const math = ENV.math;
  const topk = math.topK(prob, topK);
  const topkIndices = await topk.indices.data() as Int32Array;
  const topkValues = await topk.values.data() as Float32Array;

  return {indices: topkIndices, values: topkValues};
}
