import {ENV} from '../../environment';
import {Scalar} from '../ndarray';
import {Variable} from '../variable';

import {Optimizer} from './optimizer';

export class SGDOptimizerEager extends Optimizer {
  private c: Scalar;

  constructor(learningRate: number) {
    super();

    this.c = ENV.math.keep(Scalar.new(learningRate));
  }

  applyGradients(variableGradients: {[varName: string]: Variable}) {
    const varNames = Object.keys(variableGradients);
    varNames.forEach(varName => {
      const gradient = variableGradients[varName];
      const value = ENV.math.registeredVariables[varName];

      const newValue = ENV.math.add(ENV.math.multiply(this.c, gradient), value);

      value.assign(newValue);
    });
  }
}
