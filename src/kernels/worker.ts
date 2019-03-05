// tslint:disable

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

  var heap = new ArrayBuffer(1024 * 1024 * 16);  // 128k heap
  var heapF32 = new Float32Array(heap);
  var asm = ASMModule(self as any, null, heap);

  self.onmessage = function(msg) {
    const [msgId, [aVals, bVals, mid]] = msg.data;

    const aSize = aVals.length / mid;
    const bSize = bVals.length / mid;
    heapF32.set(aVals, 0);
    heapF32.set(bVals, aVals.length);
    const offset = aVals.length + bVals.length;
    heapF32.fill(0, offset, offset + aSize * bSize);
    asm.matmul(aSize, bSize, mid);
    const res = heapF32.slice(offset, offset + aSize * bSize);
    self.postMessage([msgId, res], null);
  }
}
