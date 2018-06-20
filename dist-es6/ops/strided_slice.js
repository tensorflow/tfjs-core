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
var StridedSliceOps = (function () {
    function StridedSliceOps() {
    }
    StridedSliceOps.stridedSlice = function (x, begin, end, strides, beginMask, endMask) {
        if (beginMask === void 0) { beginMask = 0; }
        if (endMask === void 0) { endMask = 0; }
        util.assertArgumentsAreTensors({ x: x }, 'stridedSlice');
        return ENV.engine.runKernel(function (backend) { return backend.stridedSlice(x, begin, end, strides, beginMask, endMask); }, { x: x });
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Slicing and Joining' }),
        operation
    ], StridedSliceOps, "stridedSlice", null);
    return StridedSliceOps;
}());
export { StridedSliceOps };
//# sourceMappingURL=strided_slice.js.map