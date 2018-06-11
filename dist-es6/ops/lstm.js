var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from '../doc';
import * as util from '../util';
import { operation } from './operation';
var LSTMOps = (function () {
    function LSTMOps() {
    }
    LSTMOps.multiRNNCell = function (lstmCells, data, c, h) {
        util.assertArgumentsAreTensors({ data: data, c: c, h: h }, 'multiRNNCell');
        var input = data;
        var newStates = [];
        for (var i = 0; i < lstmCells.length; i++) {
            var output = lstmCells[i](input, c[i], h[i]);
            newStates.push(output[0]);
            newStates.push(output[1]);
            input = output[1];
        }
        var newC = [];
        var newH = [];
        for (var i = 0; i < newStates.length; i += 2) {
            newC.push(newStates[i]);
            newH.push(newStates[i + 1]);
        }
        return [newC, newH];
    };
    LSTMOps.basicLSTMCell = function (forgetBias, lstmKernel, lstmBias, data, c, h) {
        util.assertArgumentsAreTensors({ forgetBias: forgetBias, lstmKernel: lstmKernel, lstmBias: lstmBias, data: data, c: c, h: h }, 'basicLSTMCell');
        var combined = data.concat(h, 1);
        var weighted = combined.matMul(lstmKernel);
        var res = weighted.add(lstmBias);
        var batchSize = res.shape[0];
        var sliceCols = res.shape[1] / 4;
        var sliceSize = [batchSize, sliceCols];
        var i = res.slice([0, 0], sliceSize);
        var j = res.slice([0, sliceCols], sliceSize);
        var f = res.slice([0, sliceCols * 2], sliceSize);
        var o = res.slice([0, sliceCols * 3], sliceSize);
        var newC = i.sigmoid().mulStrict(j.tanh()).addStrict(c.mulStrict(forgetBias.add(f).sigmoid()));
        var newH = newC.tanh().mulStrict(o.sigmoid());
        return [newC, newH];
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'RNN' }),
        operation
    ], LSTMOps, "multiRNNCell", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'RNN' }),
        operation
    ], LSTMOps, "basicLSTMCell", null);
    return LSTMOps;
}());
export { LSTMOps };
//# sourceMappingURL=lstm.js.map