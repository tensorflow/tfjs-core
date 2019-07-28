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

#include <emscripten.h>
#include <math.h>
#include <cstdio>
#include <map>
#include <vector>

#include "kernels.h"
#include "util.h"

namespace tfjs {

enum DType {
  float32 = 0,
  int32 = 1,
  boolean = 2,
};

// A union of pointers that points to memory for a given tensor.
union DataPtrUnion {
  // TODO(smilkov): Add other dtypes.
  float* f32;
};

// Holds information about a tensor such as dtype, shape and pointer to its data
// in memory.
struct TensorInfo {
  // Pointer to the bytes where the data is allocated.
  DataPtrUnion buf;
  DType dtype;
  std::vector<int> shape;
  // Total number of elements.
  int size;
};

// Maps a unique tensor id to info about that tensor. The map owns all of its
// entries.
std::map<int, TensorInfo> data;

extern "C" {
EMSCRIPTEN_KEEPALIVE
void register_tensor(int data_id, int* shape_ptr, int shape_length, DType dtype,
                     void* memory_offset) {
  std::vector<int> shape(shape_ptr, shape_ptr + shape_length);
  auto size = util::size_from_shape(shape);

  TensorInfo info = {
      .buf = {.f32 = (float*)memory_offset},
      .dtype = dtype,
      .shape = std::move(shape),
      .size = size,
  };
  // We move info to avoid a copy.
  data.insert(std::make_pair(data_id, std::move(info)));
}

EMSCRIPTEN_KEEPALIVE
void dispose_data(int data_id) {
  TensorInfo info = data.at(data_id);
  switch (info.dtype) {
    case DType::float32:
      free(info.buf.f32);
      break;
    default:
      printf("Dispose for tensor id %d failed. Unknown dtype %d\n", data_id,
             info.dtype);
  }
  data.erase(data_id);
}

EMSCRIPTEN_KEEPALIVE
void add(int a_id, int b_id, int out_id) {
  const auto a_info = data.at(a_id);
  const auto b_info = data.at(b_id);
  const auto out_info = data.at(out_id);
  switch (a_info.dtype) {
    case DType::float32:
      add_f32(a_info.buf.f32, b_info.buf.f32, out_info.buf.f32, a_info.size);
      break;
    default:
      printf("Add for tensor ids %d and %d failed. Unknown dtype %d\n", a_id,
             b_id, a_info.dtype);
  }
}

EMSCRIPTEN_KEEPALIVE
void dispose() { data.clear(); }

}  // extern "C"
}  // namespace tfjs
