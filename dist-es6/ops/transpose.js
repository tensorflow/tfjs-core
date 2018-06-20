var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import * as util from '../util';
import * as axis_util from './axis_util';
import { operation } from './operation';
var TransposeOps = (function () {
    function TransposeOps() {
    }
    TransposeOps.transpose = function (x, perm) {
        util.assertArgumentsAreTensors({ x: x }, 'transpose');
        if (perm == null) {
            perm = x.shape.map(function (s, i) { return i; }).reverse();
        }
        util.assert(x.rank === perm.length, "Error in transpose: rank of input " + x.rank + " " +
            ("must match length of perm " + perm + "."));
        perm.forEach(function (axis) {
            util.assert(axis >= 0 && axis < x.rank, "All entries in 'perm' must be between 0 and " + (x.rank - 1) +
                (" but got " + perm));
        });
        if (x.rank <= 1) {
            return x.clone();
        }
        var der = function (dy) {
            var undoPerm = axis_util.getUndoAxesPermutation(perm);
            return { x: function () { return dy.transpose(undoPerm); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.transpose(x, perm); }, { x: x }, der);
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Matrices' }),
        operation
    ], TransposeOps, "transpose", null);
    return TransposeOps;
}());
export { TransposeOps };
//# sourceMappingURL=transpose.js.map