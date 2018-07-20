import * as tf from '../src/index';

console.log(tf);
tf.square([2]).data().then(data => console.log('squared result:', data));
