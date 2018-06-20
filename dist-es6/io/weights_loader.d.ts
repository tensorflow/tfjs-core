import { NamedTensorMap } from '../types';
import { WeightsManifestConfig } from './types';
export declare function loadWeightsAsArrayBuffer(fetchURLs: string[], requestOptions?: RequestInit): Promise<ArrayBuffer[]>;
export declare function loadWeights(manifest: WeightsManifestConfig, filePathPrefix?: string, weightNames?: string[], requestOptions?: RequestInit): Promise<NamedTensorMap>;
