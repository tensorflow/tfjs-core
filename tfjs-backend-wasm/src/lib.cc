#include <math.h>
#include <emscripten.h>
#include <string>
#include <math.h>
#include <map>

enum DType { float32, int32, boolean };

struct TensorInfo {
  void* buf;
  DType dtype;
  int shape[6];
};

std::map<int, TensorInfo> data;

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  void writeData(int dataId, int* shape, int shape_length, void* memory_offset, int num_bytes) {
    TensorInfo info = {
      memory_offset, DType::float32, {0, 0, 0, 0, 0, 0}
    };
    info.shape[0] = shape[0];
    info.shape[1] = shape[1];
    info.shape[2] = shape[2];
    info.shape[3] = shape[3];
    info.shape[4] = shape[4];
    info.shape[5] = shape[5];

    data[dataId] = info;
  }
}
