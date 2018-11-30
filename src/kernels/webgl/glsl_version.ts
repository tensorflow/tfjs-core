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

import {ENV} from '../../environment';

export type GLSL = {
  version: string,
  attribute: string,
  varyingInVertexShader: string,
  varyingInFragmentShader: string,
  texture2D: string,
  output: string
};

export function getGlslDifferences(): GLSL {
  let version: string;
  let attribute: string;
  let varyingInVertexShader: string;
  let varyingInFragmentShader: string;
  let texture2D: string;
  let output: string;

  if (ENV.get('WEBGL_VERSION') === 2) {
    version = '#version 300 es';
    attribute = 'in';
    varyingInVertexShader = 'out';
    varyingInFragmentShader = 'in';
    texture2D = 'texture';
    output = 'outputColor';
  } else {
    version = '';
    attribute = 'attribute';
    varyingInVertexShader = 'varying';
    varyingInFragmentShader = 'varying';
    texture2D = 'texture2D';
    output = 'gl_FragColor';
  }

  return {
    version,
    attribute,
    varyingInVertexShader,
    varyingInFragmentShader,
    texture2D,
    output
  }
}
