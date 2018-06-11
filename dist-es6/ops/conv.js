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
var ConvOps = (function () {
    function ConvOps() {
    }
    ConvOps.conv1d = function (x, filter, stride, pad, dataFormat, dilation, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NWC'; }
        if (dilation === void 0) { dilation = 1; }
        util.assertArgumentsAreTensors({ x: x, filter: filter }, 'conv1d');
        var x3D = x;
        var reshapedTo3D = false;
        if (x.rank === 2) {
            reshapedTo3D = true;
            x3D = x.as3D(1, x.shape[0], x.shape[1]);
        }
        util.assert(x3D.rank === 3, "Error in conv1d: input must be rank 3, but got rank " + x3D.rank + ".");
        util.assert(filter.rank === 3, "Error in conv1d: filter must be rank 3, but got rank " +
            (filter.rank + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv1d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        util.assert(x3D.shape[2] === filter.shape[1], "Error in conv1d: depth of input (" + x3D.shape[2] + ") must match " +
            ("input depth for filter " + filter.shape[1] + "."));
        util.assert(eitherStridesOrDilationsAreOne(stride, dilation), 'Error in conv1D: Either stride or dilation must be 1. ' +
            ("Got stride " + stride + " and dilation '" + dilation + "'"));
        util.assert(dataFormat === 'NWC', "Error in conv1d: got dataFormat of " + dataFormat + " but only NWC is currently supported.");
        var filter4D = filter.as4D(1, filter.shape[0], filter.shape[1], filter.shape[2]);
        var input4D = x3D.as4D(x3D.shape[0], 1, x3D.shape[1], x3D.shape[2]);
        var strides = [1, stride];
        var dilations = [1, dilation];
        var conv2dDataFormat = 'NHWC';
        var res = ConvOps.conv2d(input4D, filter4D, strides, pad, conv2dDataFormat, dilations, dimRoundingMode);
        if (reshapedTo3D) {
            return res.as2D(res.shape[2], res.shape[3]);
        }
        return res.as3D(res.shape[0], res.shape[2], res.shape[3]);
    };
    ConvOps.conv2d = function (x, filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        util.assertArgumentsAreTensors({ x: x, filter: filter }, 'conv2d');
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in conv2d: input must be rank 4, but got rank " + x4D.rank + ".");
        util.assert(filter.rank === 4, "Error in conv2d: filter must be rank 4, but got rank " +
            (filter.rank + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        util.assert(x4D.shape[3] === filter.shape[2], "Error in conv2d: depth of input (" + x4D.shape[3] + ") must match " +
            ("input depth for filter " + filter.shape[2] + "."));
        util.assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in conv2D: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        util.assert(dataFormat === 'NHWC', "Error in conv2d: got dataFormat of " + dataFormat + " but only NHWC is currently supported.");
        var convInfo = conv_util.computeConv2DInfo(x4D.shape, filter.shape, strides, dilations, pad, dimRoundingMode);
        var grad = function (dy) {
            util.assert(tupleValuesAreOne(dilations), 'Error in gradient of conv2D: dilation rates greater than 1 are not' +
                ("yet supported in gradients. Got dilations '" + dilations + "'"));
            return {
                x: function () { return ConvOps.conv2dDerInput(x4D.shape, dy, filter, strides, pad); },
                filter: function () {
                    return ConvOps.conv2dDerFilter(x4D, dy, filter.shape, strides, pad);
                }
            };
        };
        var res = ENV.engine.runKernel(function (backend) { return backend.conv2d(x4D, filter, convInfo); }, { x: x4D, filter: filter }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ConvOps.conv2dDerInput = function (xShape, dy, filter, strides, pad, dimRoundingMode) {
        util.assertArgumentsAreTensors({ dy: dy, filter: filter }, 'conv2dDerInput');
        util.assert(xShape.length === dy.rank, "Length of inShape " +
            ("(" + xShape.length + ") and rank of dy (" + dy.rank + ") must match"));
        var xShape4D = xShape;
        var dy4D = dy;
        var reshapedTo4D = false;
        if (dy.rank === 3) {
            reshapedTo4D = true;
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
            xShape4D = [1, xShape[0], xShape[1], xShape[2]];
        }
        var inDepth = xShape4D[3];
        var outDepth = dy4D.shape[3];
        util.assert(xShape4D.length === 4, "Error in conv2dDerInput: inShape must be length 4, but got length " +
            (xShape4D.length + "."));
        util.assert(dy4D.rank === 4, "Error in conv2dDerInput: dy must be rank 4, but got " +
            ("rank " + dy4D.rank));
        util.assert(filter.rank === 4, "Error in conv2dDerInput: filter must be rank 4, but got " +
            ("rank " + filter.rank));
        util.assert(inDepth === filter.shape[2], "Error in conv2dDerInput: depth of input (" + inDepth + ") must " +
            ("match input depth for filter " + filter.shape[2] + "."));
        util.assert(outDepth === filter.shape[3], "Error in conv2dDerInput: depth of output (" + outDepth + ") must " +
            ("match output depth for filter " + filter.shape[3] + "."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2dDerInput: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var dilations = 1;
        var convInfo = conv_util.computeConv2DInfo(xShape4D, filter.shape, strides, dilations, pad, dimRoundingMode);
        var res = ENV.engine.runKernel(function (backend) { return backend.conv2dDerInput(dy4D, filter, convInfo); }, { dy4D: dy4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ConvOps.conv2dDerFilter = function (x, dy, filterShape, strides, pad, dimRoundingMode) {
        util.assertArgumentsAreTensors({ x: x, dy: dy }, 'conv2dDerFilter');
        var x4D = x;
        if (x.rank === 3) {
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        var dy4D = dy;
        if (dy4D.rank === 3) {
            dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in conv2dDerFilter: input must be rank 4, but got shape " +
            (x4D.shape + "."));
        util.assert(dy4D.rank === 4, "Error in conv2dDerFilter: dy must be rank 4, but got shape " +
            (dy4D.shape + "."));
        util.assert(filterShape.length === 4, "Error in conv2dDerFilter: filterShape must be length 4, but got " +
            (filterShape + "."));
        util.assert(x4D.shape[3] === filterShape[2], "Error in conv2dDerFilter: depth of input " + x4D.shape[3] + ") must " +
            ("match input depth in filter (" + filterShape[2] + "."));
        util.assert(dy4D.shape[3] === filterShape[3], "Error in conv2dDerFilter: depth of dy (" + dy4D.shape[3] + ") must " +
            ("match output depth for filter (" + filterShape[3] + ")."));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in conv2dDerFilter: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var dilations = 1;
        var convInfo = conv_util.computeConv2DInfo(x4D.shape, filterShape, strides, dilations, pad, dimRoundingMode);
        return ENV.engine.runKernel(function (backend) { return backend.conv2dDerFilter(x4D, dy4D, convInfo); }, { x4D: x4D, dy4D: dy4D });
    };
    ConvOps.conv2dTranspose = function (x, filter, outputShape, strides, pad, dimRoundingMode) {
        util.assertArgumentsAreTensors({ x: x, filter: filter }, 'conv2dTranspose');
        return ConvOps.conv2dDerInput(outputShape, x, filter, strides, pad, dimRoundingMode);
    };
    ConvOps.depthwiseConv2d = function (x, filter, strides, pad, dataFormat, dilations, dimRoundingMode) {
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        if (dilations === void 0) { dilations = [1, 1]; }
        util.assertArgumentsAreTensors({ x: x, filter: filter }, 'depthwiseConv2d');
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        util.assert(x4D.rank === 4, "Error in depthwiseConv2d: input must be rank 4, but got " +
            ("rank " + x4D.rank + "."));
        util.assert(filter.rank === 4, "Error in depthwiseConv2d: filter must be rank 4, but got rank " +
            (filter.rank + "."));
        util.assert(x4D.shape[3] === filter.shape[2], "Error in depthwiseConv2d: number of input channels " +
            ("(" + x4D.shape[3] + ") must match the inChannels dimension in ") +
            ("filter " + filter.shape[2] + "."));
        if (dilations == null) {
            dilations = [1, 1];
        }
        util.assert(eitherStridesOrDilationsAreOne(strides, dilations), 'Error in depthwiseConv2d: Either strides or dilations must be 1. ' +
            ("Got strides " + strides + " and dilations '" + dilations + "'"));
        if (dimRoundingMode != null) {
            util.assert(util.isInt(pad), "Error in depthwiseConv2d: pad must be an integer when using, " +
                ("dimRoundingMode " + dimRoundingMode + " but got pad " + pad + "."));
        }
        var convInfo = conv_util.computeConv2DInfo(x4D.shape, filter.shape, strides, dilations, pad, dimRoundingMode, true);
        var grad = function (dy) {
            util.assert(tupleValuesAreOne(dilations), 'Error in gradient of depthwiseConv2d: dilation rates greater than ' +
                ("1 are not yet supported. Got dilations '" + dilations + "'"));
            return {
                x: function () { return depthwiseConv2dDerInput(x4D.shape, dy, filter, convInfo); },
                filter: function () { return depthwiseConv2dDerFilter(x4D, dy, filter.shape, convInfo); },
            };
        };
        var res = ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2D(x4D, filter, convInfo); }, { x: x4D, filter: filter }, grad);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ConvOps.separableConv2d = function (x, depthwiseFilter, pointwiseFilter, strides, pad, dilation, dataFormat) {
        if (dilation === void 0) { dilation = [1, 1]; }
        if (dataFormat === void 0) { dataFormat = 'NHWC'; }
        util.assertArgumentsAreTensors({ x: x, depthwiseFilter: depthwiseFilter, pointwiseFilter: pointwiseFilter }, 'separableConv2d');
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        if (dataFormat === 'NCHW') {
            throw new Error('separableConv2d currently does not support dataFormat NCHW; only ' +
                'NHWC is supported');
        }
        util.assert(x4D.rank === 4, "Error in separableConv2d: input must be rank 4, but got " +
            ("rank " + x4D.rank + "."));
        util.assert(depthwiseFilter.rank === 4, "Error in separableConv2d: depthwise filter must be rank 4, but got " +
            ("rank " + depthwiseFilter.rank + "."));
        util.assert(pointwiseFilter.rank === 4, "Error in separableConv2d: pointwise filter must be rank 4, but got " +
            ("rank " + depthwiseFilter.rank + "."));
        util.assert(pointwiseFilter.shape[0] === 1, "Error in separableConv2d: the first dimension of pointwise filter " +
            (" must be 1, but got " + pointwiseFilter.shape[0] + "."));
        util.assert(pointwiseFilter.shape[1] === 1, "Error in separableConv2d: the second dimension of pointwise filter " +
            (" must be 1, but got " + pointwiseFilter.shape[1] + "."));
        var inChannels = depthwiseFilter.shape[2];
        var channelMultiplier = depthwiseFilter.shape[3];
        util.assert(pointwiseFilter.shape[2] === inChannels * channelMultiplier, "Error in separableConv2d: the third dimension of pointwise filter " +
            ("must be " + inChannels * channelMultiplier + ", ") +
            ("but got " + pointwiseFilter.shape[2] + "."));
        var depthwise = ConvOps.depthwiseConv2d(x4D, depthwiseFilter, strides, pad, dataFormat, dilation);
        var pointwiseStride = 1;
        var res = ConvOps.conv2d(depthwise, pointwiseFilter, pointwiseStride, 'valid', dataFormat);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation
    ], ConvOps, "conv1d", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation
    ], ConvOps, "conv2d", null);
    __decorate([
        operation
    ], ConvOps, "conv2dDerInput", null);
    __decorate([
        operation
    ], ConvOps, "conv2dDerFilter", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation
    ], ConvOps, "conv2dTranspose", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation
    ], ConvOps, "depthwiseConv2d", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Convolution' }),
        operation
    ], ConvOps, "separableConv2d", null);
    return ConvOps;
}());
export { ConvOps };
function parseTupleParam(param) {
    return typeof param === 'number' ? [param, param] : param;
}
function tupleValuesAreOne(param) {
    var _a = parseTupleParam(param), dimA = _a[0], dimB = _a[1];
    return dimA === 1 && dimB === 1;
}
function eitherStridesOrDilationsAreOne(strides, dilations) {
    return tupleValuesAreOne(strides) || tupleValuesAreOne(dilations);
}
function depthwiseConv2dDerInput(xShape, dy, filter, convInfo) {
    var dy4D = dy;
    var reshapedTo4D = false;
    if (dy.rank === 3) {
        reshapedTo4D = true;
        dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
    }
    var res = ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2DDerInput(dy4D, filter, convInfo); }, { dy4D: dy4D });
    if (reshapedTo4D) {
        return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
    }
    return res;
}
function depthwiseConv2dDerFilter(x, dy, filterShape, convInfo) {
    var x4D = x;
    if (x.rank === 3) {
        x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
    }
    var dy4D = dy;
    if (dy4D.rank === 3) {
        dy4D = dy.as4D(1, dy.shape[0], dy.shape[1], dy.shape[2]);
    }
    return ENV.engine.runKernel(function (backend) { return backend.depthwiseConv2DDerFilter(x4D, dy4D, convInfo); }, { x4D: x4D, dy4D: dy4D });
}
//# sourceMappingURL=conv.js.map