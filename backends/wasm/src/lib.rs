use wasm_bindgen::prelude::*;
use std::collections::HashMap;

#[wasm_bindgen]
extern "C" {
  // Bind to console.log
  #[wasm_bindgen(js_namespace = console)]
  fn log(s: &str);
}

// Next let's define a macro that's like `println!`, only it works for
// `console.log`. Note that `println!` doesn't actually work on the wasm target
// because the standard library currently just eats all output. To get
// `println!`-like behavior in your app you'll likely want a macro like this.
macro_rules! console_log {
  ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

#[wasm_bindgen]
pub fn greet(name: &str) {
  console_log!("Hello, {}!", name);
}

struct TensorData {
  shape: Vec<u32>,
  data: Vec<f32>,
}

#[wasm_bindgen]
struct Backend {
  next_data_id: u32,
  data_map: HashMap<u32, TensorData>,
}

fn size_from_shape(shape: &[u32]) -> u32 {
  shape.iter().fold(1, |acc, x| acc * x)
}

#[wasm_bindgen]
impl Backend {
  // Registered the tensor and returns a data id.
  pub fn register(&mut self, shape: Vec<u32>) -> u32 {
    let data_id = self.next_data_id;
    let data = Vec::with_capacity(size_from_shape(&shape) as usize);
    let tensor_data = TensorData {shape, data};
    self.data_map.insert(data_id, tensor_data);
    self.next_data_id += 1;
    data_id
  }

  pub fn read(&self, data_id: u32) -> *const f32 {
    self.data_map.get(&data_id).unwrap().data.as_ptr()
  }

  pub fn write(&mut self, data_id: u32, values: &[f32]) {
    self.data_map.get_mut(&data_id).unwrap().data = Vec::from(values);
  }

  pub fn new() -> Backend {
    Backend {
      next_data_id: 0,
      data_map: HashMap::new(),
    }
  }
}
