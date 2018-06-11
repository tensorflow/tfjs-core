import { ConfigDict, Serializable, SerializableConstructor } from '../serialization';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class AdamaxOptimizer extends Optimizer {
    protected learningRate: number;
    protected beta1: number;
    protected beta2: number;
    protected epsilon: number;
    protected decay: number;
    static className: string;
    private c;
    private epsScalar;
    private accBeta1;
    private beta1Scalar;
    private beta2Scalar;
    private decayScalar;
    private oneMinusBeta1;
    private one;
    private iteration;
    private accumulatedFirstMoment;
    private accumulatedWeightedInfNorm;
    constructor(learningRate: number, beta1: number, beta2: number, epsilon?: number, decay?: number);
    applyGradients(variableGradients: NamedVariableMap): void;
    dispose(): void;
    getConfig(): ConfigDict;
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
