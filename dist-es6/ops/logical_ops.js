var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import * as types from '../types';
import * as util from '../util';
import * as broadcast_util from './broadcast_util';
import { operation } from './operation';
var LogicalOps = (function () {
    function LogicalOps() {
    }
    LogicalOps.logicalNot = function (x) {
        util.assertArgumentsAreTensors({ x: x }, 'logicalNot');
        util.assert(x.dtype === 'bool', 'Error Array must be of type bool.');
        return ENV.engine.runKernel(function (backend) { return backend.logicalNot(x); }, { x: x });
    };
    LogicalOps.logicalAnd = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'logicalAnd');
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.logicalAnd(a, b); }, { a: a, b: b });
    };
    LogicalOps.logicalOr = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'logicalOr');
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.logicalOr(a, b); }, { a: a, b: b });
    };
    LogicalOps.logicalXor = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'logicalXor');
        util.assert(a.dtype === 'bool' && b.dtype === 'bool', 'Error Array must be of type bool.');
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return LogicalOps.logicalOr(a, b).logicalAnd(LogicalOps.logicalAnd(a, b).logicalNot());
    };
    LogicalOps.where = function (condition, a, b) {
        util.assertArgumentsAreTensors({ condition: condition, a: a, b: b }, 'where');
        util.assert(condition.dtype === 'bool', 'Error Condition must be of type bool.');
        util.assertShapesMatch(a.shape, b.shape, 'Error in where: ');
        if (condition.rank === 1) {
            util.assert(condition.shape[0] === a.shape[0], 'The first dimension of `a` must match the size of `condition`.');
        }
        else {
            util.assertShapesMatch(condition.shape, b.shape, 'Error in where: ');
        }
        var dtype = types.upcastType(a.dtype, b.dtype);
        return ENV.engine.runKernel(function (backend) { return backend.where(condition, a, b, dtype); }, { condition: condition, a: a, b: b });
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], LogicalOps, "logicalNot", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], LogicalOps, "logicalAnd", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], LogicalOps, "logicalOr", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], LogicalOps, "logicalXor", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], LogicalOps, "where", null);
    return LogicalOps;
}());
export { LogicalOps };
//# sourceMappingURL=logical_ops.js.map