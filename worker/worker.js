function ASMModule(stdlib, _, heap) {
  "use asm";

  var imul = stdlib.Math.imul;

  function square(aSize, bSize, mid) {
    aSize = aSize | 0;
    bSize = bSize | 0;
    mid = mid | 0;

    const a = new Float32Array(heap, 0, aSize * mid);
    const b = new Float32Array(heap, a.length * a.BYTES_PER_ELEMENT, bSize * mid);
    for (let i = 0; (i|0) < (aSize|0); i = (i + 1)|0) {

    }
  }

  return {square: square};
}

var heap = new ArrayBuffer(0x10000); 
var asm = ASMModule(self, null, heap);

onmessage = function(e) {
  const [aVals, bVals, mid] = e.data;
  const aSize = aVals.length / mid;
  const bSize = bVals.length / mid;

  console.log(asm.square(3));

  const res = new Float32Array(aSize * bSize);
  for (let i = 0; i < aSize; ++i) {
    for (let j = 0; j < bSize; ++j) {
      let dot = 0;
      for (let k = 0; k < mid; ++k) {
        dot += aVals[i * mid + k] * bVals[k * bSize + j];
      }
      res[i * bSize + j] = dot;
    }
  }
  postMessage(res);
}
