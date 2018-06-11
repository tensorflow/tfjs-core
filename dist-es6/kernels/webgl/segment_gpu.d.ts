import { SegOpInfo } from '../../ops/segment_util';
import { GPGPUProgram } from './gpgpu_math';
export declare class SegmentOpProgram implements GPGPUProgram {
    variableNames: string[];
    outputShape: number[];
    userCode: string;
    constructor(segOpInfo: SegOpInfo, segOpType: 'unsortedSegmentSum');
}
