import { AdadeltaOptimizer } from './adadelta_optimizer';
import { AdagradOptimizer } from './adagrad_optimizer';
import { AdamOptimizer } from './adam_optimizer';
import { AdamaxOptimizer } from './adamax_optimizer';
import { MomentumOptimizer } from './momentum_optimizer';
import { RMSPropOptimizer } from './rmsprop_optimizer';
import { SGDOptimizer } from './sgd_optimizer';
export declare class OptimizerConstructors {
    static sgd(learningRate: number): SGDOptimizer;
    static momentum(learningRate: number, momentum: number, useNesterov?: boolean): MomentumOptimizer;
    static rmsprop(learningRate: number, decay?: number, momentum?: number, epsilon?: number, centered?: boolean): RMSPropOptimizer;
    static adam(learningRate?: number, beta1?: number, beta2?: number, epsilon?: number): AdamOptimizer;
    static adadelta(learningRate?: number, rho?: number, epsilon?: number): AdadeltaOptimizer;
    static adamax(learningRate?: number, beta1?: number, beta2?: number, epsilon?: number, decay?: number): AdamaxOptimizer;
    static adagrad(learningRate: number, initialAccumulatorValue?: number): AdagradOptimizer;
}
