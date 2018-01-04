import {ENV} from '../../environment';
import {DataType, Scalar} from '../ndarray';
import {Variable} from '../variable';

export abstract class Optimizer {
  minimize<D extends DataType>(f: () => Scalar<D>): Scalar<D> {
    const variableGradients = this.computeGradients(f);
    this.applyGradients(variableGradients.gradients);
    return variableGradients.value as Scalar<D>;
  }

  computeGradients<D extends DataType>(f: () => Scalar<D>):
      {value: Scalar<D>, gradients: {[varName: string]: Variable}} {
    return ENV.math.variableGradients(f) as
        {value: Scalar<D>, gradients: {[varName: string]: Variable}};
  }

  abstract applyGradients(variableGradients: {[varName: string]: Variable}):
      void;
}
