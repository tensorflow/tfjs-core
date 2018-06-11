var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import * as util from '../util';
import { operation } from './operation';
import * as ops from './ops';
export var Reduction;
(function (Reduction) {
    Reduction[Reduction["NONE"] = 0] = "NONE";
    Reduction[Reduction["MEAN"] = 1] = "MEAN";
    Reduction[Reduction["SUM"] = 2] = "SUM";
    Reduction[Reduction["SUM_BY_NONZERO_WEIGHTS"] = 3] = "SUM_BY_NONZERO_WEIGHTS";
})(Reduction || (Reduction = {}));
var LossOps = (function () {
    function LossOps() {
    }
    LossOps.computeWeightedLoss = function (losses, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        util.assertArgumentsAreTensors({ losses: losses }, 'computeWeightedLoss');
        if (weights != null) {
            util.assertArgumentsAreTensors({ weights: weights }, 'computeWeightedLoss');
        }
        var weightedLoss = (weights == null) ? losses : losses.mul(weights);
        if (reduction === Reduction.NONE) {
            return weightedLoss;
        }
        if (reduction === Reduction.SUM) {
            return weightedLoss.sum();
        }
        if (reduction === Reduction.MEAN) {
            return (weights == null) ? weightedLoss.mean() :
                weightedLoss.sum().div(weights.sum());
        }
        if (reduction === Reduction.SUM_BY_NONZERO_WEIGHTS) {
            if (weights == null) {
                return weightedLoss.sum().div(ops.scalar(losses.size));
            }
            else {
                var numNonZeros = weights.notEqual(ops.scalar(0)).sum().toFloat();
                return weightedLoss.sum().div(numNonZeros);
            }
        }
        throw Error("Unknown reduction: " + reduction);
    };
    LossOps.absoluteDifference = function (labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        util.assertArgumentsAreTensors({ labels: labels, predictions: predictions }, 'absoluteDifference');
        if (weights != null) {
            util.assertArgumentsAreTensors({ weights: weights }, 'absoluteDifference');
        }
        util.assertShapesMatch(labels.shape, predictions.shape, 'Error in absoluteDifference: ');
        var losses = labels.sub(predictions).abs();
        return LossOps.computeWeightedLoss(losses, weights, reduction);
    };
    LossOps.meanSquaredError = function (labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        util.assertArgumentsAreTensors({ labels: labels, predictions: predictions }, 'meanSquaredError');
        if (weights != null) {
            util.assertArgumentsAreTensors({ weights: weights }, 'meanSquaredError');
        }
        util.assertShapesMatch(labels.shape, predictions.shape, 'Error in meanSquaredError: ');
        var losses = labels.squaredDifference(predictions);
        return LossOps.computeWeightedLoss(losses, weights, reduction);
    };
    LossOps.cosineDistance = function (labels, predictions, axis, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        util.assertArgumentsAreTensors({ labels: labels, predictions: predictions }, 'cosineDistance');
        if (weights != null) {
            util.assertArgumentsAreTensors({ weights: weights }, 'cosineDistance');
        }
        util.assertShapesMatch(labels.shape, predictions.shape, 'Error in cosineDistance: ');
        var one = ops.scalar(1);
        var losses = one.sub(labels.mul(predictions).sum(axis, true));
        return LossOps.computeWeightedLoss(losses, weights, reduction);
    };
    LossOps.hingeLoss = function (labels, predictions, weights, reduction) {
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        util.assertArgumentsAreTensors({ labels: labels, predictions: predictions }, 'hingeLoss');
        if (weights != null) {
            util.assertArgumentsAreTensors({ weights: weights }, 'hingeLoss');
        }
        util.assertShapesMatch(labels.shape, predictions.shape, 'Error in hingeLoss: ');
        var one = ops.scalar(1);
        labels = ops.scalar(2).mul(labels).sub(one);
        var losses = one.sub(labels.mul(predictions)).relu();
        return LossOps.computeWeightedLoss(losses, weights, reduction);
    };
    LossOps.logLoss = function (labels, predictions, weights, epsilon, reduction) {
        if (epsilon === void 0) { epsilon = 1e-7; }
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        util.assertArgumentsAreTensors({ labels: labels, predictions: predictions }, 'logLoss');
        if (weights != null) {
            util.assertArgumentsAreTensors({ weights: weights }, 'logLoss');
        }
        util.assertShapesMatch(labels.shape, predictions.shape, 'Error in logLoss: ');
        var one = ops.scalar(1);
        var epsilonScalar = ops.scalar(epsilon);
        var losses = labels.mul(predictions.add(epsilonScalar).log())
            .neg()
            .sub(one.sub(labels).mul(one.sub(predictions).add(epsilonScalar).log()));
        return LossOps.computeWeightedLoss(losses, weights, reduction);
    };
    LossOps.huberLoss = function (labels, predictions, weights, delta, reduction) {
        if (delta === void 0) { delta = 1.0; }
        if (reduction === void 0) { reduction = Reduction.SUM_BY_NONZERO_WEIGHTS; }
        util.assertArgumentsAreTensors({ labels: labels, predictions: predictions }, 'huberLoss');
        if (weights != null) {
            util.assertArgumentsAreTensors({ weights: weights }, 'huberLoss');
        }
        util.assertShapesMatch(labels.shape, predictions.shape, 'Error in huberLoss: ');
        var deltaScalar = ops.scalar(delta);
        var error = predictions.sub(labels).abs();
        var quadratic = ops.minimum(error, deltaScalar);
        var linear = error.sub(quadratic);
        var losses = ops.scalar(0.5).mul(quadratic.square()).add(deltaScalar.mul(linear));
        return LossOps.computeWeightedLoss(losses, weights, reduction);
    };
    __decorate([
        doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation
    ], LossOps, "computeWeightedLoss", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation
    ], LossOps, "absoluteDifference", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation
    ], LossOps, "meanSquaredError", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation
    ], LossOps, "cosineDistance", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation
    ], LossOps, "hingeLoss", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation
    ], LossOps, "logLoss", null);
    __decorate([
        doc({ heading: 'Training', subheading: 'Losses', namespace: 'losses' }),
        operation
    ], LossOps, "huberLoss", null);
    return LossOps;
}());
export { LossOps };
//# sourceMappingURL=loss_ops.js.map