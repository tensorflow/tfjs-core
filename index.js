import * as tf from './src/index';

// console.log('lol');
console.log(tf.nextFrame);
console.log(tf.lol);

// const {profile, result} = tf.profile(() => {
//   const x = tf.tensor1d([1, 2, 3]);
//   let x2 = x.square();
//   x2.dispose();
//   x2 = x.square();
//   x2.dispose();
//   return x;
// });