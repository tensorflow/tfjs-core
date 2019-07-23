
import * as tfBackendWasm from './index';

describe('wasm', () => {
  it('basic usage', async () => {
    await tfBackendWasm.init();
    expect(tfBackendWasm.intSqrt(25)).toBe(5);
  });
});
