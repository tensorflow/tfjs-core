import * as dl from 'deeplearn';

const math = dl.ENV.math;
const a = dl.Scalar.new(1);

const result = math.neg(math.square(a));


console.log(result.dataSync());
