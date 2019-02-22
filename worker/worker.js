function ASMModule(stdlib, _, heap) {
  "use asm";

  var fround = stdlib.Math.fround;
  var imul = stdlib.Math.imul;
  var heap32 = new stdlib.Float32Array(heap);
  

  function matmul(aSize, bSize, mid) {
    // Function arguments.
    aSize = aSize | 0;
    bSize = bSize | 0;
    mid = mid | 0;

    // Variable declaration.
    var offset = 0;
    var i = 0;
    var j = 0;
    var k = 0;
    var bOffset = 0;
    var cOffset = 0;
    var a = fround(0);
    var b = fround(0);
    var dot = fround(0);

    bOffset = imul(aSize, mid);
    cOffset = (bOffset + imul(bSize, mid))|0;
  
    for (i = 0; (i|0) < (aSize|0); i = (i + 1)|0) {
      for (j = 0; (j|0) < (bSize|0); j = (j + 1)|0) {
        dot = fround(0);
        for (k = 0; (k|0) < (mid|0); k = (k + 1)|0) {
          offset = (imul(i, mid) + k) << 2;
          a = fround(heap32[offset >> 2]); // a[i * mid + k]

          offset = (bOffset + imul(k, bSize) + j) << 2;
          b = fround(heap32[offset >> 2]); // b[k * bSize + j]

          dot = fround(dot + fround(a * b));
        }
        offset = (cOffset + imul(i, bSize) + j) << 2;
        heap32[offset >> 2] = fround(dot);
      }
    }
  }
  return {matmul: matmul};
}

var heap = new ArrayBuffer(1024 * 1024 * 16); // 128k heap
var heapF32 = new Float32Array(heap);
var asm = ASMModule(self, null, heap);

function matmulSimple(aVals, bVals, mid) {
  const aSize = aVals.length / mid;
  const bSize = bVals.length / mid;
  const res = new Float32Array(aSize * bSize);
  for (let i = 0; i < aSize; ++i) {
    const iMid = i * mid;
    const iBSize = i * bSize;
    for (let j = 0; j < bSize; ++j) {
      let dot = 0;
      for (let k = 0; k < mid; ++k) {
        dot += aVals[iMid + k] * bVals[k * bSize + j];
      }
      res[iBSize + j] = dot;
    }
  }
  return res;
}

onmessage = function(e) {
  const [aVals, bVals, mid] = e.data;
  const aSize = aVals.length / mid;
  const bSize = bVals.length / mid;

  heapF32.set(aVals, 0);
  heapF32.set(bVals, aVals.length);
  asm.matmul(aSize, bSize, mid);
  const offset = aVals.length + bVals.length;
  const res = heapF32.slice(offset, offset + aSize * bSize);

  // const res = matmulSimple(aVals, bVals, mid);

  postMessage(res);
}
