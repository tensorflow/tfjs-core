import { AdadeltaOptimizer } from './optimizers/adadelta_optimizer';
import { AdagradOptimizer } from './optimizers/adagrad_optimizer';
import { AdamOptimizer } from './optimizers/adam_optimizer';
import { AdamaxOptimizer } from './optimizers/adamax_optimizer';
import { MomentumOptimizer } from './optimizers/momentum_optimizer';
import { OptimizerConstructors } from './optimizers/optimizer_constructors';
import { RMSPropOptimizer } from './optimizers/rmsprop_optimizer';
import { SGDOptimizer } from './optimizers/sgd_optimizer';
[MomentumOptimizer, SGDOptimizer, AdadeltaOptimizer, AdagradOptimizer,
    RMSPropOptimizer, AdamaxOptimizer, AdamOptimizer];
export var train = {
    sgd: OptimizerConstructors.sgd,
    momentum: OptimizerConstructors.momentum,
    adadelta: OptimizerConstructors.adadelta,
    adagrad: OptimizerConstructors.adagrad,
    rmsprop: OptimizerConstructors.rmsprop,
    adamax: OptimizerConstructors.adamax,
    adam: OptimizerConstructors.adam
};
//# sourceMappingURL=train.js.map