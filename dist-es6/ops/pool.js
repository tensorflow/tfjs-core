var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import * as util from '../util';
import * as conv_util from './conv_util';
import { operation } from './operation';
var PoolOps = (function () {
    function PoolOps() {
    }
    PoolOps.maxPool = function (x, filterSize, strides, pad, dimRoundingMode) {
        util.assertArgumentsAreTensors({ x: x }, 'maxPool');
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in maxPool: input must be rank 4 but got rank " + x4D.rank + ".");
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in maxPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(x4D.shape, filterSize, strides, pad, dimRoundingMode);
        var grad = function (dy, saved) {
            var y4D = saved[0];
            return {
                x: function () { return PoolOps.maxPoolBackprop(dy, x4D, y4D, filterSize, strides, pad); }
            };
        };
        var res = ENV.engine.runKernel(function (backend, save) { return save(backend.maxPool(x4D, convInfo)); }, { x: x4D }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    PoolOps.maxPoolBackprop = function (dy, input, output, filterSize, strides, pad, dimRoundingMode) {
        util.assertArgumentsAreTensors({ dy: dy, input: input, output: output }, 'maxPoolBackprop');
        util.assert(input.rank === dy.rank, "Rank of input (" + input.rank + ") does not match rank of dy (" + dy.rank + ")");
        util.assert(dy.rank === 4, "Error in maxPoolBackprop: dy must be rank 4 but got rank " +
            (dy.rank + "."));
        util.assert(input.rank === 4, "Error in maxPoolBackprop: input must be rank 4 but got rank " +
            (input.rank + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in maxPoolBackprop: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(input.shape, filterSize, strides, pad, dimRoundingMode);
        var res = ENV.engine.runKernel(function (backend) { return backend.maxPoolBackprop(dy, input, output, convInfo); }, { dy: dy, input: input });
        return res;
    };
    PoolOps.avgPool = function (x, filterSize, strides, pad, dimRoundingMode) {
        util.assertArgumentsAreTensors({ x: x }, 'avgPool');
        util.assert(x.dtype === 'float32', 'The input dtype to avgPool must be float32');
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in avgPool: x must be rank 4 but got rank " + x4D.rank + ".");
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in avgPool: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computePool2DInfo(x4D.shape, filterSize, strides, pad);
        var grad = function (dy) {
            return {
                x: function () { return PoolOps.avgPoolBackprop(dy, x4D, filterSize, strides, pad); }
            };
        };
        var res = ENV.engine.runKernel(function (backend) { return backend.avgPool(x4D, convInfo); }, { x: x4D }, grad);
        res = res.cast(x.dtype);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    PoolOps.avgPoolBackprop = function (dy, input, filterSize, strides, pad) {
        util.assertArgumentsAreTensors({ dy: dy, input: input }, 'avgPoolBackprop');
        util.assert(input.rank === dy.rank, "Rank of input (" + input.rank + ") does not match rank of dy (" + dy.rank + ")");
        var input4D = input;
        var dy4D = dy;
        var reshapedTo4D = false;
        if (input.rank === 3) {
            reshapedTo4D = true;
            input4D = input.as4D(1, input.shape[0], input.shape[1], input.shape[2]);
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
        }
        util.assert(dy4D.rank === 4, "Error in avgPoolBackprop: dy must be rank 4 but got rank " +
            (dy4D.rank + "."));
        util.assert(input4D.rank === 4, "Error in avgPoolBackprop: input must be rank 4 but got rank " +
            (input4D.rank + "."));
        var convInfo = conv_util.computePool2DInfo(input4D.shape, filterSize, strides, pad);
        var res = ENV.engine.runKernel(function (backend) { return backend.avgPoolBackprop(dy4D, input4D, convInfo); }, { dy4D: dy4D, input4D: input4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation
    ], PoolOps, "maxPool", null);
    __decorate([
        operation
    ], PoolOps, "maxPoolBackprop", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation
    ], PoolOps, "avgPool", null);
    __decorate([
        operation
    ], PoolOps, "avgPoolBackprop", null);
    return PoolOps;
}());
export { PoolOps };
//# sourceMappingURL=pool.js.map