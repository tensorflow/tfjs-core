export function AsmModule(stdlib, foreign, heap) {
  'use asm';

  var arr = new stdlib.Float32Array(heap);
  var fround = stdlib.Math.fround;
  var imul = stdlib.Math.imul;

  function matmul(leftDim, sharedDim, rightDim, transposeA, transposeB) {
    leftDim = leftDim|0;
    sharedDim = sharedDim|0;
    rightDim = rightDim|0;
    transposeA = transposeA|0;
    transposeB = transposeB|0;

    var i = 0;
    var j = 0;
    var k = 0;
    var idx = 0;
    var iStep = 0;
    var iInnerStep = 0;
    var iInner = 0;
    var iEnd = 0;
    var jStep = 0;
    var jInnerStep = 0;
    var jInner = 0;
    var jEnd = 0;
    var bOffset = 0;
    var cOffset = 0;
    var sum = fround(0);
    var iIdx = 0;
    var jIdx = 0;
    var cIdx = 0;

    iStep = transposeA ? 1 : sharedDim;
    jStep = transposeB ? sharedDim : 1;
    iInnerStep = transposeA ? leftDim : 1;
    jInnerStep = transposeB ? 1 : rightDim;

    iEnd = imul(leftDim, iStep);
    jEnd = imul(rightDim, jStep);
    bOffset = imul(leftDim, sharedDim);
    cOffset = (bOffset + imul(rightDim, sharedDim))|0;
    for(i = 0; (i|0) < (iEnd|0); i = (i+iStep)|0) {
      for (j = 0; (j|0) < (jEnd|0); j = (j+jStep)|0) {
        iInner = i;
        jInner = j;
        sum = fround(0);
        for (k = 0; (k|0) < (sharedDim|0); k = (k+1)|0) {
          iIdx = imul(iInner, 4);
          jIdx = imul((bOffset + jInner)|0, 4);
          sum = fround(sum + fround(arr[iIdx >> 2] * arr[jIdx >> 2]));
          iInner = (iInner + iInnerStep)|0;
          jInner = (jInner + jInnerStep)|0;
        }
        cIdx = imul((cOffset + idx)|0, 4);
        arr[cIdx >> 2] = sum;
        idx = (idx+1)|0;
      }
    }
  }
  return {matmul: matmul};
}
