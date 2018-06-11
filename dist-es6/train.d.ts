import { OptimizerConstructors } from './optimizers/optimizer_constructors';
export declare const train: {
    sgd: typeof OptimizerConstructors.sgd;
    momentum: typeof OptimizerConstructors.momentum;
    adadelta: typeof OptimizerConstructors.adadelta;
    adagrad: typeof OptimizerConstructors.adagrad;
    rmsprop: typeof OptimizerConstructors.rmsprop;
    adamax: typeof OptimizerConstructors.adamax;
    adam: typeof OptimizerConstructors.adam;
};
