import { IORouter } from './router_registry';
import { IOHandler, ModelArtifacts, SaveResult } from './types';
export declare class BrowserHTTPRequest implements IOHandler {
    protected readonly path: string;
    protected readonly requestInit: RequestInit;
    readonly DEFAULT_METHOD: string;
    static readonly URL_SCHEMES: string[];
    constructor(path: string, requestInit?: RequestInit);
    save(modelArtifacts: ModelArtifacts): Promise<SaveResult>;
    load(): Promise<ModelArtifacts>;
}
export declare const httpRequestRouter: IORouter;
export declare function browserHTTPRequest(path: string, requestInit?: RequestInit): IOHandler;
