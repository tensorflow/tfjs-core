import { ConfigDict, Serializable, SerializableConstructor } from '../serialization';
import { NamedVariableMap } from '../types';
import { Optimizer } from './optimizer';
export declare class AdagradOptimizer extends Optimizer {
    protected learningRate: number;
    private initialAccumulatorValue;
    static className: string;
    private c;
    private epsilon;
    private accumulatedGrads;
    constructor(learningRate: number, initialAccumulatorValue?: number);
    applyGradients(variableGradients: NamedVariableMap): void;
    dispose(): void;
    getConfig(): ConfigDict;
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
