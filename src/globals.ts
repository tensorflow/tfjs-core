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

import {Gradients} from './math/backends/gradients';
import {Tracking} from './math/backends/tracking';

export const tidy = Tracking.tidy;
export const keep = Tracking.keep;
export const time = Tracking.time;

export const vjp = Gradients.vjp;
export const gradients = Gradients.gradients;
export const grad = Gradients.grad;
export const variableGradients = Gradients.variableGradients;
export const valueAndGradients = Gradients.valueAndGradients;
export const customGradient = Gradients.customGradient;
