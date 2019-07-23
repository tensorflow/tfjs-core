#include <math.h>
#include <emscripten.h>
#include <string>
#include <math.h>

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  float int_sqrt(int input) {
    printf("%f\n", sqrt(input));
    return sqrt(input);
  }

  EMSCRIPTEN_KEEPALIVE
  void in_array(float* input, int len) {
    printf("%f%f\n",input[0], input[1]);
  }
}
