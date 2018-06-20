import { Tensor, util } from '..';
import { ArrayOps } from '../ops/array_ops';
export function castTensor(x, dtype, backend) {
    if (!util.hasEncodingLoss(x.dtype, dtype)) {
        return Tensor.make(x.shape, { dataId: x.dataId }, dtype);
    }
    if (dtype === 'int32') {
        return backend.int(x);
    }
    else if (dtype === 'bool') {
        return backend.notEqual(x, ArrayOps.scalar(0, x.dtype));
    }
    else {
        throw new Error("Error in Cast: unknown dtype argument (" + dtype + ")");
    }
}
export function reshapeTensor(x, shape) {
    return Tensor.make(shape, { dataId: x.dataId }, x.dtype);
}
//# sourceMappingURL=backend_util.js.map