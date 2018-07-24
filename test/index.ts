import * as tf from '../src/index';

console.log(tf);
tf.square([200, 100]).data().then(data => console.log('squared result:', data));
