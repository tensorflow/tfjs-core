/* Copyright 2019 Google Inc. All Rights Reserved.
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
 * ===========================================================================*/

#include <cstdio>

#include "kernels.h"

namespace tfjs {
void add_f32(float* a_buf, float* b_buf, float* out_buf, int size) {
  for (int i = 0; i < size; ++i) {
    out_buf[i] = a_buf[i] + b_buf[i];
  }
}
}  // namespace tfjs
