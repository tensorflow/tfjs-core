import { Tensor4D } from '../../tensor';
import { GPGPUProgram } from './gpgpu_math';
export declare class ResizeBilinearBackpropProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(dy: Tensor4D, x: Tensor4D, alignCorners: boolean);
}
