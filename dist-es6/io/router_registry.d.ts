import { IOHandler } from './io';
export declare type IORouter = (url: string) => IOHandler;
export declare class IORouterRegistry {
    private static instance;
    private saveRouters;
    private loadRouters;
    private constructor();
    private static getInstance();
    static registerSaveRouter(saveRouter: IORouter): void;
    static registerLoadRouter(loadRouter: IORouter): void;
    static getSaveHandlers(url: string): IOHandler[];
    static getLoadHandlers(url: string): IOHandler[];
    private static getHandlers(url, handlerType);
}
