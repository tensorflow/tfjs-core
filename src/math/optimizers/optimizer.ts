import {ENV} from '../../environment';
import {DataType, Scalar} from '../ndarray';
import {Variable} from '../variable';

export abstract class Optimizer {
  minimize<D extends DataType>(f: () => Scalar<D>) {
    const variableGradients = ENV.math.variableGradients(f);
    this.applyGradients(variableGradients);
  }

  abstract applyGradients(variableGradients: {[varName: string]: Variable}):
      void;
}
