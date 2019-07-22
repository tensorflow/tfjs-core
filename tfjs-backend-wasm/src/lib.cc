#include <math.h>
#include <emscripten.h>
#include <string>

extern "C" {
  EMSCRIPTEN_KEEPALIVE
  void int_sqrt(char* input) {
    printf("%s\n", input);
  }

  EMSCRIPTEN_KEEPALIVE
  void in_array(float* input, int len) {
    printf("%f%f\n",input[0], input[1]);
  }
}
