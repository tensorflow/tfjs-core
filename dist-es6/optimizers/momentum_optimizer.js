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
import { tidy } from '../globals';
import { scalar, zerosLike } from '../ops/ops';
import { SerializationMap } from '../serialization';
import { SGDOptimizer } from './sgd_optimizer';
var MomentumOptimizer = (function (_super) {
    __extends(MomentumOptimizer, _super);
    function MomentumOptimizer(learningRate, momentum, useNesterov) {
        if (useNesterov === void 0) { useNesterov = false; }
        var _this = _super.call(this, learningRate) || this;
        _this.learningRate = learningRate;
        _this.momentum = momentum;
        _this.useNesterov = useNesterov;
        _this.m = scalar(_this.momentum);
        _this.accumulations = {};
        return _this;
    }
    MomentumOptimizer.prototype.applyGradients = function (variableGradients) {
        var _this = this;
        var _loop_1 = function (variableName) {
            var value = ENV.engine.registeredVariables[variableName];
            if (this_1.accumulations[variableName] == null) {
                var trainable_1 = false;
                tidy(function () {
                    _this.accumulations[variableName] =
                        zerosLike(value).variable(trainable_1);
                });
            }
            var accumulation = this_1.accumulations[variableName];
            var gradient = variableGradients[variableName];
            tidy(function () {
                var newValue;
                var newAccumulation = _this.m.mul(accumulation).add(gradient);
                if (_this.useNesterov) {
                    newValue =
                        _this.c.mul(gradient.add(newAccumulation.mul(_this.m))).add(value);
                }
                else {
                    newValue = _this.c.mul(newAccumulation).add(value);
                }
                _this.accumulations[variableName].assign(newAccumulation);
                value.assign(newValue);
            });
        };
        var this_1 = this;
        for (var variableName in variableGradients) {
            _loop_1(variableName);
        }
    };
    MomentumOptimizer.prototype.dispose = function () {
        _super.prototype.dispose.call(this);
        this.m.dispose();
        if (this.accumulations != null) {
            for (var variableName in this.accumulations) {
                this.accumulations[variableName].dispose();
            }
        }
    };
    MomentumOptimizer.prototype.setMomentum = function (momentum) {
        this.momentum = momentum;
    };
    MomentumOptimizer.prototype.getConfig = function () {
        return {
            learningRate: this.learningRate,
            momentum: this.momentum,
            useNesterov: this.useNesterov
        };
    };
    MomentumOptimizer.fromConfig = function (cls, config) {
        return new cls(config.learningRate, config.momentum, config.useNesterov);
    };
    MomentumOptimizer.className = 'MomentumOptimizer';
    return MomentumOptimizer;
}(SGDOptimizer));
export { MomentumOptimizer };
SerializationMap.register(MomentumOptimizer);
//# sourceMappingURL=momentum_optimizer.js.map