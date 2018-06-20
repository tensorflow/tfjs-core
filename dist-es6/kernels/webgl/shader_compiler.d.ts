export declare type ShapeInfo = {
    logicalShape: number[];
    texShape: [number, number];
};
export declare type InputInfo = {
    name: string;
    shapeInfo: ShapeInfo;
};
export declare function makeShader(inputsInfo: InputInfo[], outputShape: ShapeInfo, userCode: string, broadcast: boolean): string;
export declare function getCoordsDataType(rank: number): string;
