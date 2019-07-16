import init, {add} from '../pkg/tfjs_backend_wasm.js';

init().then(() => {
  console.log(add(1, 2));
});
