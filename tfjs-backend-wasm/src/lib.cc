#include <emscripten.h>
#include <math.h>
#include <cstdio>
#include <map>
#include <vector>

enum DType { float32, int32, boolean };

// A union of pointers that points to memory for a given tensor.
union DataPtrUnion {
  // TODO(smilkov): Add other dtypes.
  float* f32;
};

// Holds information about a tensor such as dtype, shape and pointer to its data
// in memory.
struct TensorInfo {
  DataPtrUnion buf;
  DType dtype;
  std::vector<int> shape;
};

// Maps a unique tensor id to info about that tensor. The map owns all of its
// entries.
std::map<int, TensorInfo> data;

// Helper method to log values in a vector. Used for debugging.
template <class T>
void log_vector(std::vector<T>& v) {
  printf("[");
  for (auto const& value : v) {
    printf("%d,", value);
  }
  printf("]\n");
}

extern "C" {
EMSCRIPTEN_KEEPALIVE
void write_data(int data_id, int* shape, int shape_length,
                void* memory_offset) {
  TensorInfo info = {
      .buf = {.f32 = (float*)memory_offset},
      .dtype = DType::float32,
      .shape = std::vector<int>(shape, shape + shape_length),
  };
  // We move info to avoid a copy.
  data.insert(std::make_pair(data_id, std::move(info)));
}

EMSCRIPTEN_KEEPALIVE
void dispose_data(int data_id) {
  TensorInfo info = data.at(data_id);
  switch (info.dtype) {
    case DType::float32:
      delete[] info.buf.f32;
      break;
    default:
      printf("Dispose for tensor id %d failed. Unknown dtype %d\n", data_id,
             info.dtype);
  }
  data.erase(data_id);
}
}
