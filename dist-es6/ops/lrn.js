var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import * as util from '../util';
import { operation } from './operation';
var LRNOps = (function () {
    function LRNOps() {
    }
    LRNOps.localResponseNormalization = function (x, radius, bias, alpha, beta) {
        if (radius === void 0) { radius = 5; }
        if (bias === void 0) { bias = 1; }
        if (alpha === void 0) { alpha = 1; }
        if (beta === void 0) { beta = 0.5; }
        util.assertArgumentsAreTensors({ x: x }, 'localResponseNormalization');
        util.assert(x.rank === 4 || x.rank === 3, "Error in localResponseNormalization: x must be rank 3 or 4 but got\n               rank " + x.rank + ".");
        util.assert(util.isInt(radius), "Error in localResponseNormalization3D: radius must be an integer\n                     but got radius " + radius + ".");
        var x4D = x;
        var reshapedTo4D = false;
        if (x.rank === 3) {
            reshapedTo4D = true;
            x4D = x.as4D(1, x.shape[0], x.shape[1], x.shape[2]);
        }
        var res = ENV.engine.runKernel(function (backend) { return backend.localResponseNormalization4D(x4D, radius, bias, alpha, beta); }, { x4D: x4D });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        else {
            return res;
        }
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Normalization' }),
        operation
    ], LRNOps, "localResponseNormalization", null);
    return LRNOps;
}());
export { LRNOps };
//# sourceMappingURL=lrn.js.map