var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc } from './doc';
import { ENV } from './environment';
import { extractTensorsFromAny } from './util';
var Tracking = (function () {
    function Tracking() {
    }
    Tracking.tidy = function (nameOrFn, fn, gradMode) {
        if (gradMode === void 0) { gradMode = false; }
        var name = null;
        if (fn == null) {
            if (typeof nameOrFn !== 'function') {
                throw new Error('Please provide a function to tidy()');
            }
            fn = nameOrFn;
        }
        else {
            if (typeof nameOrFn !== 'string' && !(nameOrFn instanceof String)) {
                throw new Error('When calling with two arguments, the first argument ' +
                    'to tidy() must be a string');
            }
            if (typeof fn !== 'function') {
                throw new Error('When calling with two arguments, the 2nd argument ' +
                    'to tidy() must be a function');
            }
            name = nameOrFn;
        }
        ENV.engine.startScope(name, gradMode);
        var result = fn();
        if (result instanceof Promise) {
            console.error('Cannot return a Promise inside of tidy.');
        }
        ENV.engine.endScope(result, gradMode);
        return result;
    };
    Tracking.dispose = function (container) {
        var tensors = extractTensorsFromAny(container);
        tensors.forEach(function (tensor) { return tensor.dispose(); });
    };
    Tracking.keep = function (result) {
        return ENV.engine.keep(result);
    };
    Tracking.time = function (f) {
        return ENV.engine.time(f);
    };
    __decorate([
        doc({ heading: 'Performance', subheading: 'Memory' })
    ], Tracking, "tidy", null);
    __decorate([
        doc({ heading: 'Performance', subheading: 'Memory' })
    ], Tracking, "keep", null);
    __decorate([
        doc({ heading: 'Performance', subheading: 'Timing' })
    ], Tracking, "time", null);
    return Tracking;
}());
export { Tracking };
//# sourceMappingURL=tracking.js.map