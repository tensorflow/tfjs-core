import { IORouter } from './router_registry';
import { IOHandler, ModelArtifacts, ModelArtifactsInfo, ModelStoreManager, SaveResult } from './types';
export declare function deleteDatabase(): Promise<void>;
export declare class BrowserIndexedDB implements IOHandler {
    protected readonly indexedDB: IDBFactory;
    protected readonly modelPath: string;
    static readonly URL_SCHEME: string;
    constructor(modelPath: string);
    save(modelArtifacts: ModelArtifacts): Promise<SaveResult>;
    load(): Promise<ModelArtifacts>;
    private databaseAction(modelPath, modelArtifacts?);
}
export declare const indexedDBRouter: IORouter;
export declare function browserIndexedDB(modelPath: string): IOHandler;
export declare class BrowserIndexedDBManager implements ModelStoreManager {
    private indexedDB;
    constructor();
    listModels(): Promise<{
        [path: string]: ModelArtifactsInfo;
    }>;
    removeModel(path: string): Promise<ModelArtifactsInfo>;
}
