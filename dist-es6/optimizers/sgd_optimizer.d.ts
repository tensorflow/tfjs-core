import { ConfigDict, Serializable, SerializableConstructor } from '../serialization';
import { Scalar } from '../tensor';
import { NamedTensorMap } from '../types';
import { Optimizer } from './optimizer';
export declare class SGDOptimizer extends Optimizer {
    protected learningRate: number;
    static className: string;
    protected c: Scalar;
    constructor(learningRate: number);
    applyGradients(variableGradients: NamedTensorMap): void;
    setLearningRate(learningRate: number): void;
    dispose(): void;
    getConfig(): ConfigDict;
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
