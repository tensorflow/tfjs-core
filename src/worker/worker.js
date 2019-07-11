importScripts('../../dist/tf-core.js')
let a = tf.tensor1d([1, 2, 3]);
let b = tf.tensor1d([3, 2, 1]);
a = a.add(b);
self.postMessage({data: a.dataSync()});
