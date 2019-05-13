This is an experimantal WebAssembly backend for TensorFlow.js project written in Rust.

Possible post-building steps:

- After compilation, run `wasm-opt` to optimize aggressively for speed.
```
wasm-opt -O3 -o output.wasm input.wasm
```
- If there are functions that are unused but the compiler can't prove it at compile time, you can remove it manually using `wasm-snip`: https://github.com/rustwasm/wasm-snip
