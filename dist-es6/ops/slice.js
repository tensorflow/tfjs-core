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
import * as slice_util from './slice_util';
var SliceOps = (function () {
    function SliceOps() {
    }
    SliceOps.slice1d = function (x, begin, size) {
        util.assert(x.rank === 1, "slice1d expects a rank-1 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, [begin], [size]);
    };
    SliceOps.slice2d = function (x, begin, size) {
        util.assert(x.rank === 2, "slice1d expects a rank-2 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice3d = function (x, begin, size) {
        util.assert(x.rank === 3, "slice1d expects a rank-3 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice4d = function (x, begin, size) {
        util.assert(x.rank === 4, "slice1d expects a rank-4 tensor, but got a rank-" + x.rank + " tensor");
        return SliceOps.slice(x, begin, size);
    };
    SliceOps.slice = function (x, begin, size) {
        util.assertArgumentsAreTensors({ x: x }, 'slice');
        if (x.rank === 0) {
            throw new Error('Slicing scalar is not possible');
        }
        var begin_;
        if (typeof begin === 'number') {
            begin_ = [begin].concat(new Array(x.rank - 1).fill(0));
        }
        else if (begin.length < x.rank) {
            begin_ = begin.concat(new Array(x.rank - begin.length).fill(0));
        }
        else {
            begin_ = begin;
        }
        var size_;
        if (size == null) {
            size_ = new Array(x.rank).fill(-1);
        }
        else if (typeof size === 'number') {
            size_ = [size].concat(new Array(x.rank - 1).fill(-1));
        }
        else if (size.length < x.rank) {
            size_ = size.concat(new Array(x.rank - size.length).fill(-1));
        }
        else {
            size_ = size;
        }
        size_ = size_.map(function (d, i) {
            if (d >= 0) {
                return d;
            }
            else {
                util.assert(d === -1, 'Bad value in size');
                return x.shape[i] - begin_[i];
            }
        });
        slice_util.assertParamsValid(x, begin_, size_);
        var inputShape = x.shape;
        var grad = function (dy) {
            var paddings = [];
            for (var i = 0; i < dy.rank; i++) {
                paddings.push([begin_[i], inputShape[i] - begin_[i] - size_[i]]);
            }
            return { x: function () { return dy.pad(paddings); } };
        };
        return ENV.engine.runKernel(function (backend) { return backend.slice(x, begin_, size_); }, { x: x }, grad);
    };
    __decorate([
        doc({ heading: 'Tensors', subheading: 'Slicing and Joining' }),
        operation
    ], SliceOps, "slice", null);
    return SliceOps;
}());
export { SliceOps };
//# sourceMappingURL=slice.js.map