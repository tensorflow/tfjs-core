import { KernelBackend } from '.';
import { Environment, Features } from './environment';
export declare function canEmulateEnvironment(emulatedFeatures: Features, testBackendFactories?: TestBackendFactory[]): boolean;
export declare function anyFeaturesEquivalentToDefault(emulatedFeatures: Features[], environent: Environment): boolean;
export declare function describeWithFlags(name: string, featuresToRun: Features[], tests: () => void): void;
export interface TestBackendFactory {
    name: string;
    factory: () => KernelBackend;
    priority: number;
}
export declare let TEST_BACKENDS: TestBackendFactory[];
export declare function setBeforeAll(f: (features: Features) => void): void;
export declare function setAfterAll(f: (features: Features) => void): void;
export declare function setBeforeEach(f: (features: Features) => void): void;
export declare function setAfterEach(f: (features: Features) => void): void;
export declare function setTestBackends(testBackends: TestBackendFactory[]): void;
