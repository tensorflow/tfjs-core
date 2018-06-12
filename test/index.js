import * as tfc from '../src/index';

tfc.tensor1d([.1]);

console.log(tfc.ENV.features);

// tfc.tensor1d([2, 4, 16, 2.4]).square().print();

const a = tfc.tensor1d([1, -2, 0, 3, -0.1, NaN]);
const result = tfc.relu(a);

const res = tfc.tensor1d([2, 4, 16, 2.4, 32, NaN]).square();
document.getElementById('content').innerHTML =
  `[0] -- tfc.tensor1d([2, 4, 16, 2.4, NaN]).square() = ${result}`;


// tfc.tensor1d([2, 4, 16, 2.4, NaN]).square()
// //tfc.tensor1d([.1]).square().print();
