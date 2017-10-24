# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.3] - 2017-10-23

## [0.3.0] - 2017-10-09

Thanks @Lewuathe and @mnottheone for the implementations and @SayHelloToWorld for the bug fixes!

### API additions

- 🎉 Added support for iOS 🎉 #109
- Added optimizers (Adam, AdaGrad, AdaDelta, RMSProp). #170 #102 #183
- Added math.cos, math.tan, math.asin, math.acos, math.atan, math.sinh, math.cosh, math.abs #123
- Added math.oneHot and math.multinomial #160
- Added NDArray.getValuesAsync() which asynchronously downloads the values from the GPU #146
- Added math.concat[1-4]D and math.slice[1-4]D #151

### Bug fixes

- Fixed bug in NDArray.randTruncatedNormal. #172 Thanks @caisq for the find!

### Other improvements

- Added highlighting when glsl fragment shaders fail to compile
- Faster reduction ops (min/max/reduce_sum/logsumexp) #145
- Faster matmul and convolutions/pooling #129
- Added script for model builder training data preprocessing. #136 Thanks @kaihuchen!
- Improved benchmark measurements. #140

Thanks to all our contributors!

## [0.2.0] - 2017-09-07

### API additions:

- Add broadcasting to NDArrayMath functions. e.g. math.add(array2d, scalar) works. Use math.addStrict(a, b) to statically enforce a and b to be of the same rank.
- Add NDArrayMath.basicLSTMCell and NDArrayMath.multiRNNCell to the math layer for inference only
- Add a TensorFlow-like API for NDArrayMath.conv2d padding, with 'SAME'|'VALID' paddings
- Add NDArrayMath.sqrt
- Add sgd momentumOptimizer

### Other features:

- math.enableDebugMode() now has console profiling for math functions:

### Internal changes:

- Add logical sampling, with a shader compiler that splices in methods for sampling in logical space, instead of sampling on 2D physical texture space. This lets us do broadcasting, and opens up the door for batching. It is also a prerequisite for integer textures to get iOS working (this will be part of the next release).

## [0.1.0] - 2017-08-04

We are so excited to finally open source this library. We can't wait to see what you build with it!
