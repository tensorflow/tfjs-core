<a id="travis-badge" href="https://travis-ci.org/PAIR-code/deeplearnjs" alt="Build Status">
  <img src="https://travis-ci.org/PAIR-code/deeplearnjs.svg?branch=master" />
</a>

# TensorFlow.js Core API

> Building on the momentum of deeplearn.js, we have joined the TensorFlow
family and we are starting a new ecosystem of libraries and tools for Machine
Learning in Javascript, called [TensorFlow.js](js.tensorflow.org).
This repo moved from `PAIR-code/deeplearnjs` to `tensorflow/tfjs-core`.

A part of the TensorFlow.js ecosystem, this repo hosts `@tensorflow/tfjs-core`, an API enabling users to build, train and execute deep learning models in the browser.

Check out [js.tensorflow.org](https://js.tensorflow.org) for more
information about the library, tutorials and API docs.

To keep track of issues, we use the [tensorflow/tfjs](https://github.com/tensorflow/tfjs) Github repo.

## Importing

You can install TensorFlow.js via yarn or npm. We recommend using the [@tensorflow/tfjs](https://www.npmjs.com/package/@tensorflow/tfjs) npm package, which gives you both the Core API and the higher-level Layers API:

```js
import * as tf from '@tensorflow/tfjs';
// You have the Core API: tf.matMul(), tf.softmax(), ...
// You also have Layers API: tf.model(), tf.layers.dense(), ...
```

On the other hand, if you care about the bundle size and you do not use the Layers API, you can import only the Core library:

```js
import * as tf from '@tensorflow/tfjs-core';
// You have the Core API: tf.matMul(), tf.softmax(), ...
// You do not have Layers API.
```

For info about development, check out [DEVELOPMENT.md](./DEVELOPMENT.md).

## For more information

- [TensorFlow.js API documentation](https://js.tensorflow.org/api/index.html)
- [TensorFlow.js Tutorials](https://js.tensorflow.org/tutorials/)

Thanks <span><a href="https://www.browserstack.com/">
  <img src="https://www.browserstack.com/images/layout/browserstack-logo-600x315.png" height="70" style="height:70px;">
</a></span> for providing testing support.
