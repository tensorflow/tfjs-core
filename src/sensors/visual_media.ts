import {NDArrayMathGPU} from '../math/math_gpu';
import {Array3D} from '../math/ndarray';

import {Sensor} from './sensor';

const NUM_CHANNELS = 4;

export class VisualSensor extends Sensor {
  constructor(
      private math: NDArrayMathGPU,
      private element: HTMLImageElement|HTMLCanvasElement|HTMLVideoElement) {
    super();
  }

  public getArray(): Array3D {
    const logicalShape =
        [this.element.height, this.element.width, NUM_CHANNELS];

    const canvasTextureShape = logicalShape.slice(0, 2) as [number, number];
    const canvasTexture =
        this.math.getTextureManager().acquireTexture(canvasTextureShape);
    this.math.getGPGPUContext().uploadPixelDataToTexture(
        canvasTexture, this.element);

    return Array3D.make(logicalShape, {
      texture: canvasTexture,
      textureShapeRC: canvasTextureShape,
      textureChannelPackingFormat: [1, 4]
    });
  }
}
