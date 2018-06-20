import { CustomGradientFunc } from './engine';
import { ScopeFn } from './engine';
import { Scalar, Tensor, Variable } from './tensor';
import { NamedTensorMap, TensorContainer } from './types';
export declare class Gradients {
    static gradScope<T extends TensorContainer>(nameOrScopeFn: string | ScopeFn<T>, scopeFn?: ScopeFn<T>): T;
    static grad<I extends Tensor, O extends Tensor>(f: (x: I) => O): (x: I, dy?: O) => I;
    static grads<O extends Tensor>(f: (...args: Tensor[]) => O): (args: Tensor[], dy?: O) => Tensor[];
    static valueAndGrad<I extends Tensor, O extends Tensor>(f: (x: I) => O): (x: I, dy?: O) => {
        value: O;
        grad: I;
    };
    static valueAndGrads<O extends Tensor>(f: (...args: Tensor[]) => O): (args: Tensor[], dy?: O) => {
        grads: Tensor[];
        value: O;
    };
    static variableGrads(f: () => Scalar, varList?: Variable[]): {
        value: Scalar;
        grads: NamedTensorMap;
    };
    static customGrad<T extends Tensor>(f: CustomGradientFunc<T>): (...args: Tensor[]) => T;
}
