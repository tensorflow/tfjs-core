import { Conv2DInfo } from '../../ops/conv_util';
import { GPGPUProgram } from './gpgpu_math';
export declare class AvgPool2DBackpropProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(convInfo: Conv2DInfo);
}
