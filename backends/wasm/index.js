// Use ES module import syntax to import functionality from the module
// that we have compiled.
//
// Note that the `default` import is an initialization function which
// will "boot" the module and make it ready to use. Currently browsers
// don't support natively imported WebAssembly as an ES module, but
// eventually the manual initialization won't be required!
import {default as init, greet} from './pkg/tfjs_wasm.js';

async function run() {
  await init('./pkg/tfjs_wasm_bg.wasm');
  greet('world');
}

run();
