var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import { Tracking } from '../tracking';
import { assert } from '../util';
import { operation } from './operation';
import { norm, split, squeeze, stack, sum } from './ops';
var LinalgOps = (function () {
    function LinalgOps() {
    }
    LinalgOps.gramSchmidt = function (xs) {
        var inputIsTensor2D;
        if (Array.isArray(xs)) {
            inputIsTensor2D = false;
            assert(xs != null && xs.length > 0, 'Gram-Schmidt process: input must not be null, undefined, or empty');
            var dim = xs[0].shape[0];
            for (var i = 1; i < xs.length; ++i) {
                assert(xs[i].shape[0] === dim, 'Gram-Schmidt: Non-unique lengths found in the input vectors: ' +
                    ("(" + xs[i].shape[0] + " vs. " + dim + ")"));
            }
        }
        else {
            inputIsTensor2D = true;
            xs = split(xs, xs.shape[0], 0).map(function (x) { return squeeze(x, [0]); });
        }
        assert(xs.length <= xs[0].shape[0], "Gram-Schmidt: Number of vectors (" + xs.length + ") exceeds " +
            ("number of dimensions (" + xs[0].shape[0] + ")."));
        var ys = [];
        var xs1d = xs;
        var _loop_1 = function (i) {
            ys.push(Tracking.tidy(function () {
                var x = xs1d[i];
                if (i > 0) {
                    for (var j = 0; j < i; ++j) {
                        var proj = sum(ys[j].mulStrict(x)).mul(ys[j]);
                        x = x.sub(proj);
                    }
                }
                return x.div(norm(x, 'euclidean'));
            }));
        };
        for (var i = 0; i < xs.length; ++i) {
            _loop_1(i);
        }
        if (inputIsTensor2D) {
            return stack(ys, 0);
        }
        else {
            return ys;
        }
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Linear Algebra' }),
        operation
    ], LinalgOps, "gramSchmidt", null);
    return LinalgOps;
}());
export { LinalgOps };
//# sourceMappingURL=linalg_ops.js.map