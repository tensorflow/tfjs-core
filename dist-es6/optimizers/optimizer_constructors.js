var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { AdadeltaOptimizer } from './adadelta_optimizer';
import { AdagradOptimizer } from './adagrad_optimizer';
import { AdamOptimizer } from './adam_optimizer';
import { AdamaxOptimizer } from './adamax_optimizer';
import { MomentumOptimizer } from './momentum_optimizer';
import { RMSPropOptimizer } from './rmsprop_optimizer';
import { SGDOptimizer } from './sgd_optimizer';
var OptimizerConstructors = (function () {
    function OptimizerConstructors() {
    }
    OptimizerConstructors.sgd = function (learningRate) {
        return new SGDOptimizer(learningRate);
    };
    OptimizerConstructors.momentum = function (learningRate, momentum, useNesterov) {
        if (useNesterov === void 0) { useNesterov = false; }
        return new MomentumOptimizer(learningRate, momentum, useNesterov);
    };
    OptimizerConstructors.rmsprop = function (learningRate, decay, momentum, epsilon, centered) {
        if (decay === void 0) { decay = .9; }
        if (momentum === void 0) { momentum = 0.0; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        if (centered === void 0) { centered = false; }
        return new RMSPropOptimizer(learningRate, decay, momentum, epsilon, centered);
    };
    OptimizerConstructors.adam = function (learningRate, beta1, beta2, epsilon) {
        if (learningRate === void 0) { learningRate = 0.001; }
        if (beta1 === void 0) { beta1 = 0.9; }
        if (beta2 === void 0) { beta2 = 0.999; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        return new AdamOptimizer(learningRate, beta1, beta2, epsilon);
    };
    OptimizerConstructors.adadelta = function (learningRate, rho, epsilon) {
        if (learningRate === void 0) { learningRate = .001; }
        if (rho === void 0) { rho = .95; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        return new AdadeltaOptimizer(learningRate, rho, epsilon);
    };
    OptimizerConstructors.adamax = function (learningRate, beta1, beta2, epsilon, decay) {
        if (learningRate === void 0) { learningRate = 0.002; }
        if (beta1 === void 0) { beta1 = 0.9; }
        if (beta2 === void 0) { beta2 = 0.999; }
        if (epsilon === void 0) { epsilon = 1e-8; }
        if (decay === void 0) { decay = 0.0; }
        return new AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay);
    };
    OptimizerConstructors.adagrad = function (learningRate, initialAccumulatorValue) {
        if (initialAccumulatorValue === void 0) { initialAccumulatorValue = 0.1; }
        return new AdagradOptimizer(learningRate, initialAccumulatorValue);
    };
    __decorate([
        doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "sgd", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "momentum", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "rmsprop", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adam", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adadelta", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adamax", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Optimizers', namespace: 'train' })
    ], OptimizerConstructors, "adagrad", null);
    return OptimizerConstructors;
}());
export { OptimizerConstructors };
//# sourceMappingURL=optimizer_constructors.js.map