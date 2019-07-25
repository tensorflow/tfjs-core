mkdir -p dist/

emcc src/lib.cc \
  -std=c++11 \
  -o wasm-out/tfjs-backend-wasm.js \
  -s EXTRA_EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
  -s EXPORT_ES6=1 \
  -s MODULARIZE=1 \
  -s EXPORT_NAME=WasmBackendModule

# Replace the _scriptDir with the karma base output. This will have to change
# when we publish this outside of karma.
sed -i 's/var _scriptDir = import.meta.url;/var _scriptDir = "\/base\/wasm-out\/";/g' wasm-out/tfjs-backend-wasm.js
