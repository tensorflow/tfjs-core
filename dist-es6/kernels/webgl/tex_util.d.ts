import { DataType, DataTypeMap } from '../../types';
export declare enum TextureType {
    FLOAT = 0,
    UNSIGNED_BYTE = 1,
}
export interface TextureData {
    texture: WebGLTexture;
    shape: number[];
    texShape: [number, number];
    dtype: DataType;
    values: DataTypeMap[DataType];
    texType: TextureType;
}
export declare function getUnpackedMatrixTextureShapeWidthHeight(rows: number, columns: number): [number, number];
export declare function getUnpackedArraySizeFromMatrixSize(matrixSize: number, channelsPerTexture: number): number;
export declare function getColorMatrixTextureShapeWidthHeight(rows: number, columns: number): [number, number];
export declare function getMatrixSizeFromUnpackedArraySize(unpackedSize: number, channelsPerTexture: number): number;
export declare type TypedArray = Float32Array | Uint8Array;
export declare function encodeMatrixToUnpackedArray(matrix: TypedArray, unpackedArray: TypedArray, channelsPerTexture: number): void;
export declare const FLOAT_MAX = 20000;
export declare const FLOAT_MIN: number;
export declare const BYTE_NAN_VALUE = 0;
export declare function encodeFloatArray(floatArray: Float32Array): Uint8Array;
export declare function decodeToFloatArray(uintArray: Uint8Array): Float32Array;
export declare function decodeMatrixFromUnpackedArray(unpackedArray: Float32Array, matrix: Float32Array, channelsPerTexture: number): void;
export declare function decodeMatrixFromUnpackedColorRGBAArray(unpackedArray: Float32Array, matrix: Float32Array, channels: number): void;
export declare function getPackedMatrixTextureShapeWidthHeight(rows: number, columns: number): [number, number];
export declare function getPackedRGBAArraySizeFromMatrixShape(rows: number, columns: number): number;
export declare function encodeMatrixToPackedRGBA(matrix: Float32Array, rows: number, columns: number, packedRGBA: Float32Array): Float32Array;
export declare function decodeMatrixFromPackedRGBA(packedRGBA: Float32Array, rows: number, columns: number, matrix: Float32Array): Float32Array;
