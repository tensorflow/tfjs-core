import { tidy } from '../globals';
export function operation(target, name, descriptor) {
    var fn = descriptor.value;
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return tidy(name, function () { return fn.apply(void 0, args); });
    };
    return descriptor;
}
//# sourceMappingURL=operation.js.map