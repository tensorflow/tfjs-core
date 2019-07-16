## Installation

Add the wasm32 target to the rust toolchain:
```sh
rustup target add wasm32-unknown-unknown
```

If on a Linux machine, install `pkg-config`:
```sh
sudo apt-get install pkg-config
```

## VSCode setup
- Install Better TOML extension
- Install Rust (rls) extension

## Building

```sh
cargo build # Defaults to --target wasm32-unknown-unknown
```

```sh
wasm-bindgen ./target/wasm32-unknown-unknown/debug/tfjs_backend_wasm.wasm --target web --out-dir=./pkg
```

## Post-building steps

 - After compilation, run `wasm-opt` to optimize aggressively for speed.
```
wasm-opt -O3 -o output.wasm input.wasm
```

- If there are functions that are unused but the compiler can't prove it at compile time, you can remove it manually using `wasm-snip`: https://github.com/rustwasm/wasm-snip
