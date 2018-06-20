import { ConfigDict, Serializable, SerializableConstructor } from '../serialization';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class AdamOptimizer extends Optimizer {
    protected learningRate: number;
    protected beta1: number;
    protected beta2: number;
    protected epsilon: number;
    static className: string;
    private c;
    private epsScalar;
    private beta1Scalar;
    private beta2Scalar;
    private accBeta1;
    private accBeta2;
    private oneMinusBeta1;
    private oneMinusBeta2;
    private one;
    private accumulatedFirstMoment;
    private accumulatedSecondMoment;
    constructor(learningRate: number, beta1: number, beta2: number, epsilon?: number);
    applyGradients(variableGradients: NamedVariableMap): void;
    dispose(): void;
    getConfig(): ConfigDict;
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
