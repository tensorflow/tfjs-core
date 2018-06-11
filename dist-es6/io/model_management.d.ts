import { ModelArtifactsInfo, ModelStoreManager } from './types';
export declare class ModelStoreManagerRegistry {
    private static instance;
    private managers;
    private constructor();
    private static getInstance();
    static registerManager(scheme: string, manager: ModelStoreManager): void;
    static getManager(scheme: string): ModelStoreManager;
    static getSchemes(): string[];
}
export declare class ModelManagement {
    static listModels(): Promise<{
        [url: string]: ModelArtifactsInfo;
    }>;
    static removeModel(url: string): Promise<ModelArtifactsInfo>;
    static copyModel(sourceURL: string, destURL: string): Promise<ModelArtifactsInfo>;
    static moveModel(sourceURL: string, destURL: string): Promise<ModelArtifactsInfo>;
}
