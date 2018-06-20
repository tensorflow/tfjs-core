export declare const DTYPE_VALUE_SIZE_MAP: {
    [dtype: string]: number;
};
export declare type WeightsManifestConfig = WeightsManifestGroupConfig[];
export interface WeightsManifestGroupConfig {
    paths: string[];
    weights: WeightsManifestEntry[];
}
export interface WeightsManifestEntry {
    name: string;
    shape: number[];
    dtype: 'float32' | 'int32' | 'bool';
    quantization?: {
        scale: number;
        min: number;
        dtype: 'uint16' | 'uint8';
    };
}
export interface SaveConfig {
    trainableOnly?: boolean;
}
export interface SaveResult {
    modelArtifactsInfo: ModelArtifactsInfo;
    responses?: Response[];
    errors?: Array<{} | string>;
}
export interface ModelArtifactsInfo {
    dateSaved: Date;
    modelTopologyType: 'JSON' | 'GraphDef';
    modelTopologyBytes?: number;
    weightSpecsBytes?: number;
    weightDataBytes?: number;
}
export interface ModelArtifacts {
    modelTopology?: {} | ArrayBuffer;
    weightSpecs?: WeightsManifestEntry[];
    weightData?: ArrayBuffer;
}
export declare type LoadHandler = () => Promise<ModelArtifacts>;
export declare type SaveHandler = (modelArtifact: ModelArtifacts) => Promise<SaveResult>;
export interface IOHandler {
    save?: SaveHandler;
    load?: LoadHandler;
}
export interface ModelStoreManager {
    listModels(): Promise<{
        [path: string]: ModelArtifactsInfo;
    }>;
    removeModel(path: string): Promise<ModelArtifactsInfo>;
}
