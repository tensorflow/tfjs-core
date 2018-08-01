TensorFlow.js Benchmark Tools
=====

This is a micro benchmark to measure the performance of TensorFlow.js kernel ops.

There are two directories, `karma` and `ui` which contain headless tests and a
UI for running benchmarks respectively.

# Benchmarks UI usage

While inside the `ui` directory, install all dependencies.

```
$ yarn
```

Launch the server to host benchmark application.

```
$ yarn server
```

http://localhost:8080 shows the benchmark tool for various kind of kernel ops.

- Batch Normalization 3D
- Matrix multiplication
- Convolutional Ops
- Pooling Ops
- Unary Ops
- Reduction Ops

Each benchmark suite runs kernel ops with specific size of input in target backend implementation. This benchmark tools support following backends for now.

- CPU
- WebGL

