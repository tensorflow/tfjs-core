import { ReduceInfo } from '../../ops/reduce_util';
import { GPGPUProgram } from './gpgpu_math';
export declare class ArgMinMaxProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(reduceInfo: ReduceInfo, op: 'max' | 'min', firstPass: boolean);
}
