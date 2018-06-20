import { IORouter } from './router_registry';
import { IOHandler, ModelArtifacts, ModelArtifactsInfo, ModelStoreManager, SaveResult } from './types';
export declare function purgeLocalStorageArtifacts(): string[];
export declare class BrowserLocalStorage implements IOHandler {
    protected readonly LS: Storage;
    protected readonly modelPath: string;
    protected readonly keys: {
        [key: string]: string;
    };
    static readonly URL_SCHEME: string;
    constructor(modelPath: string);
    save(modelArtifacts: ModelArtifacts): Promise<SaveResult>;
    load(): Promise<ModelArtifacts>;
}
export declare const localStorageRouter: IORouter;
export declare function browserLocalStorage(modelPath: string): IOHandler;
export declare class BrowserLocalStorageManager implements ModelStoreManager {
    private readonly LS;
    constructor();
    listModels(): Promise<{
        [path: string]: ModelArtifactsInfo;
    }>;
    removeModel(path: string): Promise<ModelArtifactsInfo>;
}
