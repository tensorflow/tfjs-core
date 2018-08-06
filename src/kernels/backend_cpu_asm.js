export function AsmModule(stdlib, foreign, heap) {
  'use asm';

  var arr = new stdlib.Float32Array(heap);
  var fround = stdlib.Math.fround;
  var imul = stdlib.Math.imul;

  function matmul(leftDim, sharedDim, rightDim, transposeA, transposeB) {
    leftDim = leftDim | 0;
    sharedDim = sharedDim | 0;
    rightDim = rightDim | 0;
    transposeA = transposeA | 0;
    transposeB = transposeB | 0;

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
    cOffset = (bOffset + imul(rightDim, sharedDim)) | 0;
    for (i = 0; (i | 0) < (iEnd | 0); i = (i + iStep) | 0) {
      for (j = 0; (j | 0) < (jEnd | 0); j = (j + jStep) | 0) {
        iInner = i;
        jInner = j;
        sum = fround(0);
        for (k = 0; (k | 0) < (sharedDim | 0); k = (k + 1) | 0) {
          iIdx = imul(iInner, 4);
          jIdx = imul((bOffset + jInner) | 0, 4);
          sum = fround(sum + fround(arr[iIdx >> 2] * arr[jIdx >> 2]));
          iInner = (iInner + iInnerStep) | 0;
          jInner = (jInner + jInnerStep) | 0;
        }
        cIdx = imul((cOffset + idx) | 0, 4);
        arr[cIdx >> 2] = sum;
        idx = (idx + 1) | 0;
      }
    }
  }

  function conv2d(
      xStride0, xStride1, yStride0, yStride1, filterStride0, filterStride1,
      batchSize, inHeight, inWidth, inChannels, outHeight, outWidth,
      outChannels, strideHeight, strideWidth, dilationHeight, dilationWidth,
      filterHeight, filterWidth, padLeft, padTop) {
    xStride0 = xStride0 | 0;
    xStride1 = xStride1 | 0;
    yStride0 = yStride0 | 0;
    yStride1 = yStride1 | 0;
    filterStride0 = filterStride0 | 0;
    filterStride1 = filterStride1 | 0;
    batchSize = batchSize | 0;
    inHeight = inHeight | 0;
    inWidth = inWidth | 0;
    inChannels = inChannels | 0;
    outHeight = outHeight | 0;
    outWidth = outWidth | 0;
    outChannels = outChannels | 0;
    strideHeight = strideHeight | 0;
    strideWidth = strideWidth | 0;
    dilationHeight = dilationHeight | 0;
    dilationWidth = dilationWidth | 0;
    filterHeight = filterHeight | 0;
    filterWidth = filterWidth | 0;
    padLeft = padLeft | 0;
    padTop = padTop | 0;

    // Variables used.
    var wShift = 0;
    var yShift = 0;
    var b = 0;
    var xOffset1 = 0;
    var yOffset1 = 0;
    var yR = 0;
    var yOffset2 = 0;
    var xRCorner = 0;
    var wR = 0;
    var xR = 0;
    var wOffset1 = 0;
    var xOffset2 = 0;
    var yC = 0;
    var yOffset3 = 0;
    var xCCorner = 0;
    var wC = 0;
    var xC = 0;
    var wOffset2 = 0;
    var xOffset3 = 0;
    var wOffset3 = 0;
    var d1 = 0;
    var xIdx = 0;
    var xVal = fround(0.0);
    var d2 = 0;
    var yIdx = 0;
    var wIdx = 0;

    // Layout in heap is [x, w, y]
    wShift = imul(imul(imul(batchSize, inHeight), inWidth), inChannels);
    yShift =
        (wShift +
         imul(imul(imul(filterHeight, filterWidth), inChannels), outChannels)) |
        0;

    // Start computation.
    for (b = 0; (b | 0) < (batchSize | 0); b = (b + 1) | 0) {
      xOffset1 = imul(b, xStride0);
      yOffset1 = imul(b, yStride0);
      for (yR = 0; (yR | 0) < (outHeight | 0); yR = (yR + 1) | 0) {
        yOffset2 = (yOffset1 + imul(yR, yStride1)) | 0;
        xRCorner = (imul(yR, strideHeight) - padLeft) | 0;
        for (wR = 0; (wR | 0) < (filterHeight | 0); wR = (wR + 1) | 0) {
          xR = (xRCorner + imul(wR, dilationHeight)) | 0;
          if (((xR | 0) < 0) | ((xR | 0) >= (inHeight | 0))) {
            continue;
          }
          wOffset1 = imul(wR, filterStride0);
          xOffset2 = (xOffset1 + imul(xR, xStride1)) | 0;
          for (yC = 0; (yC | 0) < (outWidth | 0); yC = (yC + 1) | 0) {
            yOffset3 = (yOffset2 + imul(yC, outChannels)) | 0;
            xCCorner = (imul(yC, strideWidth) - padTop) | 0;
            for (wC = 0; (wC | 0) < (filterWidth | 0); wC = (wC + 1) | 0) {
              xC = (xCCorner + imul(wC, dilationWidth)) | 0;
              if (((xC | 0) < 0) | ((xC | 0) >= (inWidth | 0))) {
                continue;
              }
              wOffset2 = (wOffset1 + imul(wC, filterStride1)) | 0;
              xOffset3 = (xOffset2 + imul(xC, inChannels)) | 0;
              wOffset3 = wOffset2;
              for (d1 = 0; (d1 | 0) < (inChannels | 0); d1 = (d1 + 1) | 0) {
                xIdx = imul((xOffset3 + d1) | 0, 4);
                xVal = fround(arr[xIdx >> 2]);
                for (d2 = 0; (d2 | 0) < (outChannels | 0); d2 = (d2 + 1) | 0) {
                  yIdx = imul((yShift + yOffset3 + d2) | 0, 4);
                  wIdx = imul((wShift + wOffset3 + d2) | 0, 4);
                  arr[yIdx >> 2] =
                      fround(arr[yIdx >> 2] + fround(xVal * arr[wIdx >> 2]));
                }
                wOffset3 = (wOffset3 + outChannels) | 0;
              }
            }
          }
        }
      }
    }
  }
  return {matmul: matmul, conv2d: conv2d};
}
