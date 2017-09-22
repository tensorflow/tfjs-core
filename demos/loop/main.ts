import {Array2D, NDArray, NDArrayMathGPU} from '../deeplearn';

// tslint:disable-next-line:no-any
(window as any).going = true;

const math = new NDArrayMathGPU();

const mats: Array2D[] = [];
for (let i = 0; i < 1; i++) {
  mats.push(Array2D.randNormal([256, 256], 0, .01));
}

let beforeTimestamp = 0;

const vecIn = NDArray.randNormal<Array2D>([256, 256], 0, .01);

function loop() {
  console.log(performance.now() - beforeTimestamp);
  // tslint:disable-next-line:no-any
  if (!(window as any).going) {
    return;
  }

  const start = performance.now();
  const scopeOut = math.scope((keep, track) => {
    let out = vecIn;
    for (let i = 0; i < mats.length; i++) {
      out = math.matMul(mats[i], out);
    }
    return out;
  });

  // scopeOut.getValues();
  // console.log('time: ' + (performance.now() - start));


  scopeOut.getValuesAsync().then(values => {
    console.log('time: ' + (performance.now() - start));
    // console.log(values);
    scopeOut.dispose();
    beforeTimestamp = performance.now();
    setTimeout(loop, 0);
  });
}

loop();
