import { IORouter } from './router_registry';
import { IOHandler, ModelArtifacts, SaveResult } from './types';
export declare class BrowserDownloads implements IOHandler {
    private readonly modelTopologyFileName;
    private readonly weightDataFileName;
    private readonly jsonAnchor;
    private readonly weightDataAnchor;
    static readonly URL_SCHEME: string;
    constructor(fileNamePrefix?: string);
    save(modelArtifacts: ModelArtifacts): Promise<SaveResult>;
}
export declare const browserDownloadsRouter: IORouter;
export declare function browserDownloads(fileNamePrefix?: string): IOHandler;
export declare function browserFiles(files: File[]): IOHandler;
