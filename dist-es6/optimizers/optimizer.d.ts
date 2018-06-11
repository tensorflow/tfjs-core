import { Serializable } from '../serialization';
import { Scalar, Variable } from '../tensor';
import { NamedTensorMap } from '../types';
export declare abstract class Optimizer extends Serializable {
    minimize(f: () => Scalar, returnCost?: boolean, varList?: Variable[]): Scalar | null;
    computeGradients(f: () => Scalar, varList?: Variable[]): {
        value: Scalar;
        grads: NamedTensorMap;
    };
    abstract applyGradients(variableGradients: NamedTensorMap): void;
}
