import * as tf from './src/index';

console.log(tf);

// tf.setBackend('cpu');

async function init() {
 //  console.log('------- squaring op -------');
	// const { profile, result } = await tf.profile(() => {
 //    /*
 //    this function triggers:
 //    - acquireTexture
 //    - releaseTexture
 //    - acquireTexture
 //    - releaseTexture
 //    */
 //    const x = tf.tensor1d([1, 2, 3]); // does not trigger acquire, but would if it were larger. at this point there are 0 bytes in the GPU.
	//   let x2 = x.square(); // [1, 4, 9]
	//   x2.dispose();
	//   x2 = x.square();
	//   x2.dispose();
	//   return x;
	// });
	
	// console.log('RESULT OF PROFILE');
	// console.log(profile);

	// console.log('ACTUAL RESULT');
	// console.log(result);
 //  console.log(tf.memory());

  console.log('------- matmul op -------');
  const { profile, result } = await tf.profile(() => {
    const a = tf.tensor2d([1, 2], [1, 2]);
    const b = tf.tensor2d([1, 2, 3, 4], [2, 2]);
    const c = a.matMul(b); // bytes should be: 8

    return c;
  });

  console.log('TF.MEMORY');
  console.log(tf.memory()); // should be: 32

  console.log('PROFILE OBJECT');
  console.log(profile);

  console.log('ACTUAL RESULT');
  console.log(result.dataSync());
}

init();

/* RETURN
{
  memory: {
    peakBytes: 24,
    averageBytes: 20  // (12 + 24 + 24) / 3, after each kernel is run
    newTensors: 1,
    newTensorsBytes: 12
  },
  timing: {
    totalKernelTimeMs: 100 // cannot implement this yet
  },
  kernels: [
    {name: square, kernelTimeMs: 10, inputShapes: [[3]], outputShape: [3]},
    {name: square, kernelTimeMs: 12, inputShapes: [[3]], outputShape: [3]},
  ]
}
*/