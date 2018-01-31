var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function dec(target, name, descriptor) {
    var fn = descriptor.value;
    // tslint:disable-next-line:no-any
    descriptor.value = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return fn.apply(void 0, args);
    };
    return descriptor;
}
/**
 * a nikhil.
 */
var Nikhil = /** @class */ (function () {
    /**
     *
     */
    function Nikhil() {
    }
    Nikhil.prototype.method = function () {
        console.log('nothing');
    };
    __decorate([
        dec
    ], Nikhil.prototype, "method");
    return Nikhil;
}());
function op() { }
