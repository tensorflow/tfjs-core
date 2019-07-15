use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: f32, b: f32) -> f32 {
  a + b
}

fn main() {
  println!("{}", add(2.0, 4.1));
}
