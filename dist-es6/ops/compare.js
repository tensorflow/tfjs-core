var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import * as util from '../util';
import * as broadcast_util from './broadcast_util';
import { operation } from './operation';
var CompareOps = (function () {
    function CompareOps() {
    }
    CompareOps.notEqual = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'notEqual');
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.notEqual(a, b); }, { a: a, b: b });
    };
    CompareOps.notEqualStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in notEqualStrict: ');
        return a.notEqual(b);
    };
    CompareOps.less = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'less');
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.less(a, b); }, { a: a, b: b });
    };
    CompareOps.lessStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in lessStrict: ');
        return a.less(b);
    };
    CompareOps.equal = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'equal');
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.equal(a, b); }, { a: a, b: b });
    };
    CompareOps.equalStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in equalStrict: ');
        return a.equal(b);
    };
    CompareOps.lessEqual = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'lessEqual');
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.lessEqual(a, b); }, { a: a, b: b });
    };
    CompareOps.lessEqualStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in lessEqualStrict: ');
        return a.lessEqual(b);
    };
    CompareOps.greater = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'greater');
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.greater(a, b); }, { a: a, b: b });
    };
    CompareOps.greaterStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in greaterStrict: ');
        return a.greater(b);
    };
    CompareOps.greaterEqual = function (a, b) {
        util.assertArgumentsAreTensors({ a: a, b: b }, 'greaterEqual');
        util.assertTypesMatch(a, b);
        broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        return ENV.engine.runKernel(function (backend) { return backend.greaterEqual(a, b); }, { a: a, b: b });
    };
    CompareOps.greaterEqualStrict = function (a, b) {
        util.assertShapesMatch(a.shape, b.shape, 'Error in greaterEqualStrict: ');
        return a.greaterEqual(b);
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], CompareOps, "notEqual", null);
    __decorate([
        operation
    ], CompareOps, "notEqualStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], CompareOps, "less", null);
    __decorate([
        operation
    ], CompareOps, "lessStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], CompareOps, "equal", null);
    __decorate([
        operation
    ], CompareOps, "equalStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], CompareOps, "lessEqual", null);
    __decorate([
        operation
    ], CompareOps, "lessEqualStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], CompareOps, "greater", null);
    __decorate([
        operation
    ], CompareOps, "greaterStrict", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Logical' }),
        operation
    ], CompareOps, "greaterEqual", null);
    __decorate([
        operation
    ], CompareOps, "greaterEqualStrict", null);
    return CompareOps;
}());
export { CompareOps };
//# sourceMappingURL=compare.js.map