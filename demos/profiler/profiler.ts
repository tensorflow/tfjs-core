import * as dl from 'deeplearn';
import {SqueezeNet} from 'deeplearn-squeezenet';

(async () => {
  const squeezeNet = new SqueezeNet(dl.ENV.math);
  await squeezeNet.load();

  // const math = dl.ENV.math;
  // const a = dl.Array1D.randNormal([1000]);

  const result = squeezeNet.predict(dl.Array3D.randNormal([227, 227, 3]));

  // const result = math.neg(math.square(math.square(a)));

  console.log(result.dataSync());
})();
