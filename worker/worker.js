onmessage = function(e) {
  const [aBytes, bBytes, mid] = e.data;
  const aVals = new Float32Array(aBytes);
  const bVals = new Float32Array(bBytes);
  const aSize = aVals.length / mid;
  const bSize = bVals.length / mid;
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
