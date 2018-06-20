import { Features } from './environment';
export declare function describeWithFlags(name: string, constraints: Features, tests: () => void): void;
export declare function setBeforeAll(f: (features: Features) => void): void;
export declare function setAfterAll(f: (features: Features) => void): void;
export declare function setBeforeEach(f: (features: Features) => void): void;
export declare function setAfterEach(f: (features: Features) => void): void;
export declare function setTestEnvFeatures(features: Features[]): void;
