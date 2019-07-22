

Module.onRuntimeInitialized = () => {
  const int_sqrt = Module.cwrap('int_sqrt', null, ['string']);
  console.log(int_sqrt);

  int_sqrt("hello world!!!");


  const in_array = Module.cwrap('in_array', null, ['array']);
  in_array(new Uint8Array(new Float32Array([1.1, 3.14]).buffer));
}
