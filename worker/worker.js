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

    bOffset = imul(aSize, mid) << 2;
    cOffset = imul(bSize, mid) << 2;
  
    for (i = 0; (i|0) < (bOffset|0); i = (i + 4)|0) {
      for (j = 0; (j|0) < (cOffset|0); j = (j + 4)|0) {
        dot = fround(0);
        for (k = 0; (k|0) < (mid << 2); k = (k + 4)|0) {
          ;
          //a = // aVals[i * mid + k]
        }
      }
      // read A.
      offset = i;
      a = fround(heap32[offset >> 2]);
      
      // read B.
      offset = (offset + bOffset)|0;
      b = fround(heap32[offset >> 2]);
      
      // write to C.
      offset = (offset + cOffset)|0;
      heap32[offset >> 2] = fround(a * b);
    }
  }
  return {matmul: matmul};
}

var heap = new ArrayBuffer(128 * 1024); // 128k heap
var heapF32 = new Float32Array(heap);
var asm = ASMModule(self, null, heap);

onmessage = function(e) {
  const [aVals, bVals, mid] = e.data;
  const aSize = aVals.length / mid;
  const bSize = bVals.length / mid;

  heapF32.set(aVals, 0);
  heapF32.set(bVals, aVals.length);
  console.log(heapF32);
  asm.matmul(aSize, bSize, mid);
  const offset = aVals.length + bVals.length;
  const res = heapF32.slice(offset, offset + aSize * bSize);
  console.log('Result', res);
  // const res = new Float32Array(aSize * bSize);
  // for (let i = 0; i < aSize; ++i) {
  //   for (let j = 0; j < bSize; ++j) {
  //     let dot = 0;
  //     for (let k = 0; k < mid; ++k) {
  //       dot += aVals[i * mid + k] * bVals[k * bSize + j];
  //     }
  //     res[i * bSize + j] = dot;
  //   }
  // }
  postMessage(res);
}
