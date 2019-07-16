use wasm_bindgen::prelude::*;

// Defines a console_log macro that's like `println!` but works with
// `console.log`.
macro_rules! console_log {
  ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn add(a: f32, b: f32) -> f32 {
  console_log!("Debugging {}, {}", a, b);
  a + b
}

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}
