import * as tf from './src/index';

console.log(tf);

// tf.setBackend('cpu');

async function init() {
	const { profile, result } = await tf.profile(() => {
    /*
    this function triggers:
    - acquireTexture
    - releaseTexture
    - acquireTexture
    - releaseTexture
    */
    const x = tf.tensor1d([1, 2, 3]); // does not trigger acquire, but would if it were larger
	  let x2 = x.square(); // [1, 4, 9]
	  // x2.dispose();
	  // x2 = x.square();
	  // x2.dispose();
	  return x;
	});
	
	console.log('RESULT OF PROFILE');
	console.log(profile);

	console.log('ACTUAL RESULT');
	console.log(result);
  console.log(tf.memory());
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