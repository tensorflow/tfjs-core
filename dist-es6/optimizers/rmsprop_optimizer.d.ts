import { ConfigDict, Serializable, SerializableConstructor } from '../serialization';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class RMSPropOptimizer extends Optimizer {
    protected learningRate: number;
    protected decay: number;
    protected momentum: number;
    protected epsilon: number;
    static className: string;
    private c;
    private epsilonScalar;
    private decayScalar;
    private momentumScalar;
    private oneMinusDecay;
    private centered;
    private accumulatedMeanSquares;
    private accumulatedMeanGrads;
    private accumulatedMoments;
    constructor(learningRate: number, decay?: number, momentum?: number, epsilon?: number, centered?: boolean);
    applyGradients(variableGradients: NamedVariableMap): void;
    dispose(): void;
    getConfig(): ConfigDict;
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
