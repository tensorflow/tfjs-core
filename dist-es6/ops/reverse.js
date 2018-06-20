var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { ENV } from '../environment';
import * as util from '../util';
import { parseAxisParam } from './axis_util';
import { operation } from './operation';
var ReverseOps = (function () {
    function ReverseOps() {
    }
    ReverseOps.reverse1d = function (x) {
        util.assert(x.rank === 1, "Error in reverse1D: x must be rank 1 but got\n             rank " + x.rank + ".");
        return ReverseOps.reverse(x, 0);
    };
    ReverseOps.reverse2d = function (x, axis) {
        util.assert(x.rank === 2, "Error in reverse2D: x must be rank 2 but got\n             rank " + x.rank + ".");
        return ReverseOps.reverse(x, axis);
    };
    ReverseOps.reverse3d = function (x, axis) {
        util.assert(x.rank === 3, "Error in reverse3D: x must be rank 3 but got\n             rank " + x.rank + ".");
        return ReverseOps.reverse(x, axis);
    };
    ReverseOps.reverse4d = function (x, axis) {
        util.assert(x.rank === 4, "Error in reverse4D: x must be rank 4 but got\n             rank " + x.rank + ".");
        return ReverseOps.reverse(x, axis);
    };
    ReverseOps.reverse = function (x, axis) {
        util.assertArgumentsAreTensors({ x: x }, 'reverse');
        if (x.rank === 0) {
            return x.clone();
        }
        var axes = parseAxisParam(axis, x.shape);
        var grad = function (dy) {
            return { x: function () { return dy.reverse(axes); } };
        };
        var res = ENV.engine.runKernel(function (backend) { return backend.reverse(x, axes); }, { x: x }, grad);
        return res.reshapeAs(x);
    };
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation
    ], ReverseOps, "reverse", null);
    return ReverseOps;
}());
export { ReverseOps };
//# sourceMappingURL=reverse.js.map