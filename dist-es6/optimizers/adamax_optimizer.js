var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { ENV } from '../environment';
import { keep, tidy } from '../globals';
import { scalar, zerosLike } from '../ops/ops';
import { SerializationMap } from '../serialization';
import { Optimizer } from './optimizer';
var AdamaxOptimizer = (function (_super) {
    __extends(AdamaxOptimizer, _super);
    function AdamaxOptimizer(learningRate, beta1, beta2, epsilon, decay) {
        if (epsilon === void 0) { epsilon = 1e-8; }
        if (decay === void 0) { decay = 0.0; }
        var _this = _super.call(this) || this;
        _this.learningRate = learningRate;
        _this.beta1 = beta1;
        _this.beta2 = beta2;
        _this.epsilon = epsilon;
        _this.decay = decay;
        _this.accumulatedFirstMoment = {};
        _this.accumulatedWeightedInfNorm = {};
        _this.c = keep(scalar(-learningRate));
        _this.epsScalar = keep(scalar(epsilon));
        _this.beta1Scalar = keep(scalar(beta1));
        _this.beta2Scalar = keep(scalar(beta2));
        _this.decayScalar = keep(scalar(decay));
        tidy(function () {
            _this.iteration = scalar(0).variable();
            _this.accBeta1 = scalar(beta1).variable();
        });
        _this.oneMinusBeta1 = keep(scalar(1 - beta1));
        _this.one = keep(scalar(1));
        return _this;
    }
    AdamaxOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        tidy(function () {
            var oneMinusAccBeta1 = _this.one.sub(_this.accBeta1);
            var lr = _this.c.div(_this.one.add(_this.decayScalar.mul(_this.iteration)));
            for (var variableName in variableGradients) {
                var value = ENV.engine.registeredVariables[variableName];
                if (_this.accumulatedFirstMoment[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedFirstMoment[variableName] =
                        zerosLike(value).variable(trainable);
                }
                if (_this.accumulatedWeightedInfNorm[variableName] == null) {
                    var trainable = false;
                    _this.accumulatedWeightedInfNorm[variableName] =
                        zerosLike(value).variable(trainable);
                }
                var gradient = variableGradients[variableName];
                var firstMoment = _this.accumulatedFirstMoment[variableName];
                var weightedInfNorm = _this.accumulatedWeightedInfNorm[variableName];
                var newFirstMoment = _this.beta1Scalar.mul(firstMoment)
                    .add(_this.oneMinusBeta1.mul(gradient));
                var ut0 = _this.beta2Scalar.mul(weightedInfNorm);
                var ut1 = gradient.abs();
                var newWeightedInfNorm = ut0.maximum(ut1);
                _this.accumulatedFirstMoment[variableName].assign(newFirstMoment);
                _this.accumulatedWeightedInfNorm[variableName].assign(newWeightedInfNorm);
                var newValue = lr.div(oneMinusAccBeta1)
                    .mul(newFirstMoment.div(_this.epsScalar.add(newWeightedInfNorm)))
                    .add(value);
                value.assign(newValue);
            }
            _this.iteration.assign(_this.iteration.add(_this.one));
            _this.accBeta1.assign(_this.accBeta1.mul(_this.beta1Scalar));
        });
    };
    AdamaxOptimizer.prototype.dispose = function () {
        var _this = this;
        this.c.dispose();
        this.epsScalar.dispose();
        this.accBeta1.dispose();
        this.beta1Scalar.dispose();
        this.beta2Scalar.dispose();
        this.oneMinusBeta1.dispose();
        this.decayScalar.dispose();
        this.iteration.dispose();
        this.one.dispose();
        if (this.accumulatedFirstMoment != null) {
            Object.keys(this.accumulatedFirstMoment)
                .forEach(function (name) { return _this.accumulatedFirstMoment[name].dispose(); });
        }
        if (this.accumulatedWeightedInfNorm != null) {
            Object.keys(this.accumulatedWeightedInfNorm)
                .forEach(function (name) { return _this.accumulatedWeightedInfNorm[name].dispose(); });
        }
    };
    AdamaxOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            beta1: this.beta1,
            beta2: this.beta2,
            epsilon: this.epsilon,
            decay: this.decay
        };
    };
    AdamaxOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.beta1, config.beta2, config.epsilon, config.decay);
    };
    AdamaxOptimizer.className = 'AdamaxOptimizer';
    return AdamaxOptimizer;
}(Optimizer));
export { AdamaxOptimizer };
SerializationMap.register(AdamaxOptimizer);
//# sourceMappingURL=adamax_optimizer.js.map