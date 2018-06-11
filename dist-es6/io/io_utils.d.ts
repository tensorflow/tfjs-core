import { NamedTensorMap, TypedArray } from '../types';
import { ModelArtifacts, ModelArtifactsInfo, WeightsManifestEntry } from './types';
export declare function encodeWeights(tensors: NamedTensorMap): Promise<{
    data: ArrayBuffer;
    specs: WeightsManifestEntry[];
}>;
export declare function decodeWeights(buffer: ArrayBuffer, specs: WeightsManifestEntry[]): NamedTensorMap;
export declare function concatenateTypedArrays(xs: TypedArray[]): ArrayBuffer;
export declare function stringByteLength(str: string): number;
export declare function arrayBufferToBase64String(buffer: ArrayBuffer): string;
export declare function base64StringToArrayBuffer(str: string): ArrayBuffer;
export declare function concatenateArrayBuffers(buffers: ArrayBuffer[]): ArrayBuffer;
export declare function basename(path: string): string;
export declare function getModelArtifactsInfoForJSON(modelArtifacts: ModelArtifacts): ModelArtifactsInfo;
