import { GPGPUContext } from './gpgpu_context';
import { TextureType } from './tex_util';
export declare class TextureManager {
    private gpgpu;
    private numUsedTextures;
    private numFreeTextures;
    private freeTextures;
    private logEnabled;
    private allocatedTextures;
    private usedTextureCount;
    constructor(gpgpu: GPGPUContext);
    acquireTexture(shapeRC: [number, number], texType?: TextureType): WebGLTexture;
    releaseTexture(texture: WebGLTexture, shape: [number, number], texType?: TextureType): void;
    private log();
    getNumUsedTextures(): number;
    getNumFreeTextures(): number;
    dispose(): void;
}
