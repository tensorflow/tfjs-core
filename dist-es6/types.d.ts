import { Tensor, Variable } from './tensor';
export declare enum DType {
    float32 = "float32",
    int32 = "int32",
    bool = "bool",
}
export interface ShapeMap {
    R0: number[];
    R1: [number];
    R2: [number, number];
    R3: [number, number, number];
    R4: [number, number, number, number];
    R5: [number, number, number, number, number];
}
export interface DataTypeMap {
    float32: Float32Array;
    int32: Int32Array;
    bool: Uint8Array;
}
export declare type DataType = keyof DataTypeMap;
export declare type TypedArray = DataTypeMap[DataType];
export declare enum Rank {
    R0 = "R0",
    R1 = "R1",
    R2 = "R2",
    R3 = "R3",
    R4 = "R4",
    R5 = "R5",
}
export declare type TensorLike = TypedArray | number | boolean | number[] | number[][] | number[][][] | number[][][][] | number[][][][][] | boolean[] | boolean[][] | boolean[][][] | boolean[][][][] | boolean[][][][][];
export declare type TensorLike1D = TypedArray | number[] | boolean[];
export declare type TensorLike2D = TypedArray | number[] | number[][] | boolean[] | boolean[][];
export declare type TensorLike3D = TypedArray | number[] | number[][][] | boolean[] | boolean[][][];
export declare type TensorLike4D = TypedArray | number[] | number[][][][] | boolean[] | boolean[][][][];
export declare type TensorLike5D = TypedArray | number[] | number[][][][][] | boolean[] | boolean[][][][][];
export declare type FlatVector = boolean[] | number[] | TypedArray;
export declare type RegularArray<T> = T[] | T[][] | T[][][] | T[][][][] | T[][][][][];
export declare type ArrayData<D extends DataType> = DataTypeMap[D] | RegularArray<number> | RegularArray<boolean>;
export interface RecursiveArray<T extends any> {
    [index: number]: T | RecursiveArray<T>;
}
export declare type NamedTensorMap = {
    [name: string]: Tensor;
};
export declare type NamedVariableMap = {
    [name: string]: Variable;
};
export declare function upcastType(typeA: DataType, typeB: DataType): DataType;
export declare function sumOutType(type: DataType): "float32" | "int32" | "bool";
export declare type TensorContainer = void | Tensor | string | number | boolean | TensorContainerObject | TensorContainerArray;
export interface TensorContainerObject {
    [x: string]: TensorContainer;
}
export interface TensorContainerArray extends Array<TensorContainer> {
}
export interface ModelPredictConfig {
    batchSize?: number;
    verbose?: boolean;
}
export interface InferenceModel {
    predict(inputs: Tensor | Tensor[] | NamedTensorMap, config: ModelPredictConfig): Tensor | Tensor[] | NamedTensorMap;
    execute(inputs: Tensor | Tensor[] | NamedTensorMap, outputs: string | string[]): Tensor | Tensor[];
}
