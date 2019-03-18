// tslint:disable

import {Conv2DInfo} from '../ops/conv_util';

type Message = [number, string, any];

export function worker() {
  function ASMModule(
      stdlib: {Math: typeof Math, Float32Array: typeof Float32Array}, _: {},
      heap: ArrayBuffer) {
    'use asm';

    var fround = stdlib.Math.fround;
    var imul = stdlib.Math.imul;
    var heap32 = new stdlib.Float32Array(heap);
    var min = stdlib.Math.min;

    function matmul(aSize: number, bSize: number, mid: number) {
      // Function arguments.
      aSize = aSize | 0;
      bSize = bSize | 0;
      mid = mid | 0;

      // Variable declaration.
      var offset = 0;
      var blockSize = 48;
      var i0 = 0;
      var j0 = 0;
      var k0 = 0;
      var iBlock = 0;
      var jBlock = 0;
      var kBlock = 0;
      var i = 0;
      var j = 0;
      var k = 0;
      var imid = 0;
      var iBsize = 0;
      var bOffset = 0;
      var cOffset = 0;
      var dot = fround(0);
      var a = fround(0);
      var b = fround(0);
      var c = fround(0);

      bOffset = imul(aSize, mid);
      cOffset = (bOffset + imul(bSize, mid)) | 0;

      for (i0 = 0; (i0 | 0) < (aSize | 0); i0 = (i0 + blockSize) | 0) {
        iBlock = min((i0 + blockSize) | 0, aSize | 0);
        for (j0 = 0; (j0 | 0) < (bSize | 0); j0 = (j0 + blockSize) | 0) {
          jBlock = min((j0 + blockSize) | 0, bSize | 0);
          for (k0 = 0; (k0 | 0) < (mid | 0); k0 = (k0 + blockSize) | 0) {
            kBlock = min((k0 + blockSize) | 0, mid | 0);

            for (i = i0; (i | 0) < (iBlock | 0); i = (i + 1) | 0) {
              imid = imul(i, mid);
              iBsize = imul(i, bSize);
              for (j = j0; (j | 0) < (jBlock | 0); j = (j + 1) | 0) {
                dot = fround(0);
                for (k = k0; (k | 0) < (kBlock | 0); k = (k + 1) | 0) {
                  offset = (imid + k) << 2;
                  a = fround(heap32[offset >> 2]);  // a[i * mid + k]

                  offset = (bOffset + imul(k, bSize) + j) << 2;
                  b = fround(heap32[offset >> 2]);  // b[k * bSize + j]

                  dot = fround(dot + fround(a * b));
                }
                offset = (cOffset + iBsize + j) << 2;
                c = fround(heap32[offset >> 2]);
                heap32[offset >> 2] = fround(c + dot);
              }
            }
          }
        }
      }
    }
    return {matmul: matmul};
  }

  // TODO(smilkov): Grow the heap dynamically.
  var heap = new ArrayBuffer(1024 * 1024 * 8);  // 8MB heap
  var heapF32 = new Float32Array(heap);
  var asm = ASMModule(self as any, null, heap);

  function matmul(data: [Float32Array, Float32Array, number]): Float32Array {
    const [aVals, bVals, mid] = data;
    const aSize = aVals.length / mid;
    const bSize = bVals.length / mid;
    heapF32.set(aVals, 0);
    heapF32.set(bVals, aVals.length);
    const offset = aVals.length + bVals.length;
    heapF32.fill(0, offset, offset + aSize * bSize);
    asm.matmul(aSize, bSize, mid);
    return heapF32.slice(offset, offset + aSize * bSize);
  }

  function conv2d(data: [
    Conv2DInfo, number, number, number, number, Float32Array, Float32Array
  ]): Float32Array {
    const [convInfo, yRstart, yREnd, xRStart, xREnd, xVals, wVals] = data;
    const {
      filterHeight,
      filterWidth,
      dilationHeight,
      dilationWidth,
      outWidth,
      outChannels,
      inWidth,
      inChannels,
      strideHeight,
      strideWidth,
      padInfo: {left, top}
    } = convInfo;
    const outHeight = yREnd - yRstart;
    const inHeight = xREnd - xRStart;
    const y = new Float32Array(outHeight * outWidth * outChannels);
    const yStrideWC = outWidth * outChannels;
    const xStrideWC = inWidth * inChannels;
    const wStrideWIO = filterWidth * inChannels * outChannels;
    const wStrideIO = inChannels * outChannels;
    for (let yR = 0; yR < outHeight; ++yR) {
      const yOffset1 = yR * yStrideWC;
      const xRCorner = yR * strideHeight - top;
      for (let wR = 0; wR < filterHeight; ++wR) {
        const xR = xRCorner + wR * dilationHeight;
        if (xR < 0 || xR >= inHeight) {
          continue;
        }
        const wOffset1 = wR * wStrideWIO;
        const xOffset1 = xR * xStrideWC;
        for (let yC = 0; yC < outWidth; ++yC) {
          const yOffset2 = yOffset1 + yC * outChannels;
          const xCCorner = yC * strideWidth - left;
          for (let wC = 0; wC < filterWidth; ++wC) {
            const xC = xCCorner + wC * dilationWidth;
            if (xC < 0 || xC >= inWidth) {
              continue;
            }
            const wOffset2 = wOffset1 + wC * wStrideIO;
            const xOffset2 = xOffset1 + xC * inChannels;
            for (let d1 = 0; d1 < inChannels; ++d1) {
              const xVal = xVals[xOffset2 + d1];
              const wOffset3 = wOffset2 + d1 * outChannels;
              for (let d2 = 0; d2 < outChannels; ++d2) {
                y[yOffset2 + d2] += xVal * wVals[wOffset3 + d2];
              }
            }
          }
        }
      }
    }
    return y;
  }

  function depthwiseConv2D(data: [
    Conv2DInfo, number, number, number, number, Float32Array, Float32Array
  ]): Float32Array {
    const [convInfo, yRstart, yREnd, xRStart, xREnd, xVals, wVals] = data;
    const {
      filterHeight,
      filterWidth,
      dilationHeight,
      dilationWidth,
      outWidth,
      outChannels,
      inWidth,
      inChannels,
      strideHeight,
      strideWidth,
      padInfo: {left, top}
    } = convInfo;
    const outHeight = yREnd - yRstart;
    const inHeight = xREnd - xRStart;
    const y = new Float32Array(outHeight * outWidth * outChannels);
    const chMul = outChannels / inChannels;
    const yStrideWC = outWidth * outChannels;
    const xStrideWC = inWidth * inChannels;
    const wStrideWIO = filterWidth * inChannels * chMul;
    const wStrideIO = inChannels * chMul;

    for (let q = 0; q < chMul; ++q) {
      for (let yR = 0; yR < outHeight; ++yR) {
        const yOffset1 = yR * yStrideWC;
        const xRCorner = yR * strideHeight - top;
        for (let wR = 0; wR < filterHeight; ++wR) {
          const xR = xRCorner + wR * dilationHeight;
          if (xR < 0 || xR >= inHeight) {
            continue;
          }
          const wOffset1 = wR * wStrideWIO;
          const xOffset1 = xR * xStrideWC;
          for (let yC = 0; yC < outWidth; ++yC) {
            const yOffset2 = yOffset1 + yC * outChannels;
            const xCCorner = yC * strideWidth - left;
            for (let wC = 0; wC < filterWidth; ++wC) {
              const xC = xCCorner + wC * dilationWidth;
              if (xC < 0 || xC >= inWidth) {
                continue;
              }
              const wOffset2 = wOffset1 + wC * wStrideIO;
              const xOffset2 = xOffset1 + xC * inChannels;
              for (let d1 = 0; d1 < inChannels; ++d1) {
                const dOffset = d1 * chMul + q;
                y[yOffset2 + dOffset] +=
                    xVals[xOffset2 + d1] * wVals[wOffset2 + dOffset];
              }
            }
          }
        }
      }
    }
    return y;
  }

  self.onmessage = function(msg) {
    let [msgId, type, data] = msg.data as Message;
    data = (data as Array<{}>).map(v => {
      if (v instanceof ArrayBuffer) {
        return new Float32Array(v);
      }
      return v;
    });
    let res: Float32Array;
    if (type === 'matmul') {
      res = matmul(data);
    } else if (type === 'conv2d') {
      res = conv2d(data);
    } else if (type === 'depthwiseConv2D') {
      res = depthwiseConv2D(data);
    } else {
      throw new Error(`Unknown message type: ${type}`);
    }
    (self as any).postMessage([msgId, res.buffer], [res.buffer]);
  }
}
