var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import * as util from '../util';
import { ArrayOps } from './array_ops';
import { BinaryOps } from './binary_ops';
import { operation } from './operation';
var MovingAverageOps = (function () {
    function MovingAverageOps() {
    }
    MovingAverageOps.movingAverage = function (v, x, decay, step, zeroDebias) {
        if (zeroDebias === void 0) { zeroDebias = true; }
        util.assertArgumentsAreTensors({ v: v, x: x }, 'movingAverage');
        util.assertTypesMatch(v, x);
        util.assert(util.arraysEqual(v.shape, x.shape), 'Shape mismatch in v and x');
        var one = ArrayOps.scalar(1);
        decay = typeof decay === 'number' ? ArrayOps.scalar(decay) : decay;
        var oneMinusDecay = one.sub(decay);
        var update = x.sub(v).mul(oneMinusDecay);
        if (zeroDebias) {
            util.assert(step != null, 'When using zeroDebias: true, step is required.');
            step = typeof step === 'number' ? ArrayOps.scalar(step) : step;
            update = update.div(one.sub(BinaryOps.pow(decay, step)));
        }
        return v.add(update);
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Moving Average' }),
        operation
    ], MovingAverageOps, "movingAverage", null);
    return MovingAverageOps;
}());
export { MovingAverageOps };
//# sourceMappingURL=moving_average.js.map