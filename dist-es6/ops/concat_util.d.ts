export declare function assertParams(aShape: number[], bShape: number[], axis: number): void;
export declare function computeOutShape1D(x1Shape: number[], x2Shape: number[]): number[];
export declare function computeOutShape(x1Shape: number[], x2Shape: number[], axis: number): number[];
export declare function computeGradientSliceShapes(aShape: [number, number], bShape: [number, number]): {
    aBegin: [number, number];
    aSize: [number, number];
    bBegin: [number, number];
    bSize: [number, number];
};
