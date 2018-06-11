import { TextureType } from './tex_util';
var TextureManager = (function () {
    function TextureManager(gpgpu) {
        this.gpgpu = gpgpu;
        this.numUsedTextures = 0;
        this.numFreeTextures = 0;
        this.freeTextures = {};
        this.logEnabled = false;
        this.usedTextures = {};
    }
    TextureManager.prototype.acquireTexture = function (shapeRC, texType) {
        if (texType === void 0) { texType = TextureType.FLOAT; }
        var shapeKey = getKeyFromTextureShape(shapeRC, texType);
        if (!(shapeKey in this.freeTextures)) {
            this.freeTextures[shapeKey] = [];
        }
        if (!(shapeKey in this.usedTextures)) {
            this.usedTextures[shapeKey] = [];
        }
        if (this.freeTextures[shapeKey].length > 0) {
            this.numFreeTextures--;
            this.numUsedTextures++;
            this.log();
            var newTexture_1 = this.freeTextures[shapeKey].shift();
            this.usedTextures[shapeKey].push(newTexture_1);
            return newTexture_1;
        }
        this.numUsedTextures++;
        this.log();
        var newTexture = this.gpgpu.createMatrixTexture(shapeRC[0], shapeRC[1]);
        this.usedTextures[shapeKey].push(newTexture);
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
        var texList = this.usedTextures[shapeKey];
        var texIndex = texList.indexOf(texture);
        if (texIndex < 0) {
            throw new Error('Cannot release a texture that was never provided by this ' +
                'texture manager');
        }
        texList.splice(texIndex, 1);
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
        if (this.freeTextures == null) {
            return;
        }
        for (var texShape in this.freeTextures) {
            this.freeTextures[texShape].forEach(function (tex) {
                _this.gpgpu.deleteMatrixTexture(tex);
            });
        }
        for (var texShape in this.usedTextures) {
            this.usedTextures[texShape].forEach(function (tex) {
                _this.gpgpu.deleteMatrixTexture(tex);
            });
        }
        this.freeTextures = null;
        this.usedTextures = null;
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