declare let OffscreenCanvas: {
  new (width: number, height: number): HTMLCanvasElement;
  prototype: HTMLCanvasElement;
}

interface OffscreenCanvas extends EventTarget {}
