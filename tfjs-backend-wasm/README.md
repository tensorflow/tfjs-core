## Installation

```sh
sudo apt-get install pkg-config
```

```sh
cargo install wasm-bindgen-cli
```

## Building

```sh
cargo build --target wasm32-unknown-unknown
```

```sh
wasm-bindgen ./target/wasm32-unknown-unknown/debug/tfjs_backend_wasm.wasm --target web --out-dir=./pkg
```
