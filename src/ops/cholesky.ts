import { Tensor } from '../tensor';
import { op } from './operation';
import { Tensor1D } from '../tensor';

// function choleskey(a: tf.Tensor) : tf.Tensor {
//   // Based on https://rosettacode.org/wiki/Cholesky_decomposition
//   const n = a.shape[0]
//   const L = tf.buffer([n, n], a.dtype);

//   let Ldata = L.values as TypedArray;
//   let aData = a.dataSync();

//   for (let i = 0; i < n; i++) {
//     for (let k = 0; k < (i + 1); k++) {
//       let sum = 0.0;
//       for (let j = 0; j < k; j++) {
//         sum = sum + Ldata[i * n + j] * Ldata[k * n + j];
//       }
//       Ldata[i * n + k] = (i === k) ? Math.sqrt(aData[i * n  + i] - sum)
//         : (1.0 / Ldata[k * n + k] * (aData[i * n + k] - sum))
//     }
//   }

//   return L.toTensor();
// }

function level2partition(A: Tensor, j: number): [Tensor, Tensor, Tensor, Tensor] {
  // +-----+
  // | r d |
  // | B c |
  // +-----+
  const n = A.shape[0];
  const rr = A.slice([j, 0], [1, j]).as1D();
  const dd = A.slice([j, j], [1, 1]).asScalar();
  const B = A.slice([j + 1, 0], [n - (j + 1), j]);
  const cc = A.slice([j + 1, j], [n - (j + 1), 1]).as1D();
  return [rr, dd, B, cc];
}

function cholesky_unblocked_(A: Tensor): Tensor {
  let n = A.shape[0]
  const res = A.clone();
  const resData = res.buffer();

  for (let j = 0; j < n; j++) {
    let [rr, dd, B, cc] = level2partition(res, j);
    const ddnew = dd.sub(rr.dot(rr)).sqrt();
    const ccnew = cc.sub(B.dot(rr)).div(ddnew);

    const ddnewVals = ddnew.dataSync();
    const ccnewVals = ccnew.dataSync();
    // update ddnew
    resData.values[j * n + j] = ddnewVals[0];
    // update ccnew
    for (let k = (j + 1); k < n; k++) {
      resData.values[k * n + j] = ccnewVals[k - (j + 1)];
    }
  }

  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      resData.values[i * n + j] = 0;
  return resData.toTensor();
}


function cholesky_unblocked_grad(L: Tensor, Abar: Tensor) {
  let res = Abar.clone();
  let resData = res.buffer();
  let n = L.shape[0];

  for (let j = n - 1; j > -1; j--) {

    let [rr, dd, B, cc] = level2partition(L, j);
    let [rbar, dbar, Bbar, cbar] = level2partition(res, j);

    dbar = dbar.sub(cc.dot(cbar).div(dd));
    dbar = dbar.div(dd)
    cbar = cbar.div(dd)

    rbar = rbar.sub(dbar.mul(rr));
    rbar = rbar.sub(B.transpose().dot(cbar));
    Bbar = Bbar.sub(
      tf.outerProduct(cbar as Tensor1D, rr as Tensor1D));
    dbar = dbar.div(2);

    // Copy into result
    // update dbar
    resData.values[j * n + j] = dbar.dataSync()[0];
    // update cbar
    let ccnewVals = cbar.dataSync();
    for (let k = (j + 1); k < n; k++) {
      resData.values[k * n + j] = ccnewVals[k - (j + 1)];
    }
    // update rbar
    let rbarVals = rbar.dataSync();
    for (let k = 0; k < j; k++) {
      resData.values[j * n + k] = rbarVals[k];
    }
    // // update Bbar
    let BbarVals = Bbar.dataSync();
    for (let r = j + 1; r < n; r++) {
      for (let c = 0; c < j; c++) {
        resData.values[r * n + c] = BbarVals[(r - (j + 1)) * n + c];
      }
    }
  }
  return resData.toTensor();
}

export const cholesky = op({ cholesky_unblocked_ })
