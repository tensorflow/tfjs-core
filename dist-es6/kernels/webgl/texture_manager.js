import { TextureType } from './tex_util';
var TextureManager = (function () {
    function TextureManager(gpgpu) {
        this.gpgpu = gpgpu;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
        this.freeTextures = {};
        this.logEnabled = false;
        this.allocatedTextures = [];
        this.usedTextureCount = {};
    }
    TextureManager.prototype.acquireTexture = function (shapeRC, texType) {
        if (texType === void 0) { texType = TextureType.FLOAT; }
        var shapeKey = getKeyFromTextureShape(shapeRC, texType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        if (!(shapeKey in this.usedTextureCount)) {
            this.usedTextureCount[shapeKey] = 0;
        }
        this.usedTextureCount[shapeKey]++;
        if (this.freeTextures[shapeKey].length > 0) {
            this.numFreeTextures--;
            this.numUsedTextures++;
            this.log();
            return this.freeTextures[shapeKey].shift();
        }
        this.numUsedTextures++;
        this.log();
        var newTexture = this.gpgpu.createMatrixTexture(shapeRC[0], shapeRC[1]);
        this.allocatedTextures.push(newTexture);
        return newTexture;
    };
    TextureManager.prototype.releaseTexture = function (texture, shape, texType) {
        if (texType === void 0) { texType = TextureType.FLOAT; }
        var shapeKey = getKeyFromTextureShape(shape, texType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        this.freeTextures[shapeKey].push(texture);
        this.numFreeTextures++;
        this.numUsedTextures--;
        this.usedTextureCount[shapeKey]--;
        this.log();
    };
    TextureManager.prototype.log = function () {
        if (!this.logEnabled) {
            return;
        }
        var total = this.numFreeTextures + this.numUsedTextures;
        console.log('Free/Used', this.numFreeTextures + " / " + this.numUsedTextures, "(" + total + ")");
    };
    TextureManager.prototype.getNumUsedTextures = function () {
        return this.numUsedTextures;
    };
    TextureManager.prototype.getNumFreeTextures = function () {
        return this.numFreeTextures;
    };
    TextureManager.prototype.dispose = function () {
        var _this = this;
        if (this.allocatedTextures == null) {
            return;
        }
        this.allocatedTextures.forEach(function (texture) {
            _this.gpgpu.deleteMatrixTexture(texture);
        });
        this.freeTextures = null;
        this.allocatedTextures = null;
        this.usedTextureCount = null;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
    };
    return TextureManager;
}());
export { TextureManager };
function getKeyFromTextureShape(shapeRowsCol, texType) {
    return shapeRowsCol[0] + "_" + shapeRowsCol[1] + "_" + texType;
}
//# sourceMappingURL=texture_manager.js.map