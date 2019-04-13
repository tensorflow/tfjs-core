# To run the test suite:
CHROME_BIN="$PWD/chromium.sh" yarn test

# TensorFlow.js WebGPU backend

This repo contains a standalone WebGPU backend that implements the TensorFlow.js `KernelBackend` interface.

You can run the test suite with the following command:

    $ yarn # to install dependencies
    $ yarn test

This test (`src/mul_test.ts`) executes element-wise multiplication on the WebGPU backend. The order of operations is as follows:

1. Initialize the two tensors `a` and `b` that are to be multiplied. Each initialization calls `WebGPUBackend.register()`, which adds `a` and `b` to a data registry (`tensorMap`).

2. After registration we call `WebGPUBackend.write()` for each tensor, which passes in the actual data for the tensors.

3. We call `WebGPUBackend.multiply()` on `a` and `b`, which is where we would execute the actual multiplication kernel. In the WebGL backend, this is where we lazily upload data to WebGL textures, compile shaders, and execute draw calls on the GPU.

4. Finally we call `WebGPUBackend.read()` on `c`, the output of multiplication, which is where we retrieve the data from `c`. In the WebGL backend, this is where we call `gl.getBufferSubData()` on the output texture from the draw call executed in step 3.
