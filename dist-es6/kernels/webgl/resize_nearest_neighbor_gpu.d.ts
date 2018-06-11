import { GPGPUProgram } from './gpgpu_math';
export declare class ResizeNearestNeighborProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(inputShape: [number, number, number, number], newHeight: number, newWidth: number, alignCorners: boolean);
}
