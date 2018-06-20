import { Engine, MemoryInfo } from './engine';
import { KernelBackend } from './kernels/backend';
export declare enum Type {
    NUMBER = 0,
    BOOLEAN = 1,
    STRING = 2,
}
export interface Features {
    'DEBUG'?: boolean;
    'IS_BROWSER'?: boolean;
    'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION'?: number;
    'WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE'?: boolean;
    'WEBGL_VERSION'?: number;
    'WEBGL_FLOAT_TEXTURE_ENABLED'?: boolean;
    'WEBGL_GET_BUFFER_SUB_DATA_ASYNC_EXTENSION_ENABLED'?: boolean;
    'BACKEND'?: string;
}
export declare const URL_PROPERTIES: URLProperty[];
export interface URLProperty {
    name: keyof Features;
    type: Type;
}
export declare class Environment {
    private features;
    private globalEngine;
    private registry;
    private currentBackend;
    constructor(features?: Features);
    static setBackend(backendType: string, safeMode?: boolean): void;
    static getBackend(): string;
    static disposeVariables(): void;
    static memory(): MemoryInfo;
    get<K extends keyof Features>(feature: K): Features[K];
    set<K extends keyof Features>(feature: K, value: Features[K]): void;
    getBestBackendType(): string;
    private evaluateFeature<K>(feature);
    setFeatures(features: Features): void;
    reset(): void;
    private initBackend(backendType?, safeMode?);
    findBackend(name: string): KernelBackend;
    registerBackend(name: string, factory: () => KernelBackend, priority?: number): boolean;
    removeBackend(name: string): void;
    readonly engine: Engine;
    private initDefaultBackend();
}
export declare let ENV: Environment;
