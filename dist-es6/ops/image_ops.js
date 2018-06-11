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
var ImageOps = (function () {
    function ImageOps() {
    }
    ImageOps.resizeBilinear = function (images, size, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        util.assertArgumentsAreTensors({ images: images }, 'resizeBilinear');
        util.assert(images.rank === 3 || images.rank === 4, "Error in resizeBilinear: x must be rank 3 or 4, but got " +
            ("rank " + images.rank + "."));
        util.assert(size.length === 2, "Error in resizeBilinear: new shape must 2D, but got shape " +
            (size + "."));
        var batchImages = images;
        var reshapedTo4D = false;
        if (images.rank === 3) {
            reshapedTo4D = true;
            batchImages =
                images.as4D(1, images.shape[0], images.shape[1], images.shape[2]);
        }
        var newHeight = size[0], newWidth = size[1];
        var forward = function (backend, save) {
            return backend.resizeBilinear(batchImages, newHeight, newWidth, alignCorners);
        };
        var backward = function (dy, saved) {
            return {
                batchImages: function () { return ENV.engine.runKernel(function (backend) {
                    return backend.resizeBilinearBackprop(dy, batchImages, alignCorners);
                }, {}); }
            };
        };
        var res = ENV.engine.runKernel(forward, { batchImages: batchImages }, backward);
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    ImageOps.resizeNearestNeighbor = function (images, size, alignCorners) {
        if (alignCorners === void 0) { alignCorners = false; }
        util.assertArgumentsAreTensors({ images: images }, 'resizeNearestNeighbor');
        util.assert(images.rank === 3 || images.rank === 4, "Error in resizeNearestNeighbor: x must be rank 3 or 4, but got " +
            ("rank " + images.rank + "."));
        util.assert(size.length === 2, "Error in resizeNearestNeighbor: new shape must 2D, but got shape " +
            (size + "."));
        util.assert(images.dtype === 'float32' || images.dtype === 'int32', '`images` must have `int32` or `float32` as dtype');
        var batchImages = images;
        var reshapedTo4D = false;
        if (images.rank === 3) {
            reshapedTo4D = true;
            batchImages =
                images.as4D(1, images.shape[0], images.shape[1], images.shape[2]);
        }
        var newHeight = size[0], newWidth = size[1];
        var res = ENV.engine.runKernel(function (backend) { return backend.resizeNearestNeighbor(batchImages, newHeight, newWidth, alignCorners); }, { batchImages: batchImages });
        if (reshapedTo4D) {
            return res.as3D(res.shape[1], res.shape[2], res.shape[3]);
        }
        return res;
    };
    __decorate([
        doc({ heading: 'Operations', subheading: 'Images', namespace: 'image' }),
        operation
    ], ImageOps, "resizeBilinear", null);
    __decorate([
        doc({ heading: 'Operations', subheading: 'Images', namespace: 'image' }),
        operation
    ], ImageOps, "resizeNearestNeighbor", null);
    return ImageOps;
}());
export { ImageOps };
//# sourceMappingURL=image_ops.js.map