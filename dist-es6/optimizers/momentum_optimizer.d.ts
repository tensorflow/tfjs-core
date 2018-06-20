import { ConfigDict, Serializable, SerializableConstructor } from '../serialization';
import { NamedVariableMap } from '../types';
import { SGDOptimizer } from './sgd_optimizer';
export declare class MomentumOptimizer extends SGDOptimizer {
    protected learningRate: number;
    private momentum;
    private useNesterov;
    static className: string;
    private m;
    private accumulations;
    constructor(learningRate: number, momentum: number, useNesterov?: boolean);
    applyGradients(variableGradients: NamedVariableMap): void;
    dispose(): void;
    setMomentum(momentum: number): void;
    getConfig(): ConfigDict;
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
