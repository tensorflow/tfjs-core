declare var moduleFactory: () => EmscriptenModule & {
  onRuntimeInitialized: () => void;
  writeData(
      tensorId: number, shape: number[], shapeLength: number,
      memoryOffset: number): void;
  disposeData(tensorId: number): void;
};
export default moduleFactory;
