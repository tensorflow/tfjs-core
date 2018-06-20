import { ConfigDict, Serializable, SerializableConstructor } from '../serialization';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class AdadeltaOptimizer extends Optimizer {
    protected learningRate: number;
    protected rho: number;
    protected epsilon: number;
    static className: string;
    private c;
    private epsilonScalar;
    private rhoScalar;
    private oneMinusRho;
    private accumulatedGrads;
    private accumulatedUpdates;
    constructor(learningRate: number, rho: number, epsilon?: number);
    applyGradients(variableGradients: NamedVariableMap): void;
    dispose(): void;
    getConfig(): ConfigDict;
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
