import { Tensor3D, Tensor4D } from '../tensor';
export declare class ImageOps {
    static resizeBilinear<T extends Tensor3D | Tensor4D>(images: T, size: [number, number], alignCorners?: boolean): T;
    static resizeNearestNeighbor<T extends Tensor3D | Tensor4D>(images: T, size: [number, number], alignCorners?: boolean): T;
}
