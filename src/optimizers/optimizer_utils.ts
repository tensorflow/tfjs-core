/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

const DEFAULT_FLOAT32_EPSILON = 1e-8;
const DEFAULT_FLOAT16_EPSILON = 1e-5;

export function getOptimizerDefaultEpsilonValue() {
  if (ENV.get('WEBGL_RENDER_FLOAT32_ENABLED')) {
    return DEFAULT_FLOAT32_EPSILON;
  }

  return DEFAULT_FLOAT16_EPSILON;
}
