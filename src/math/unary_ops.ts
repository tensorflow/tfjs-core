/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {ENV} from '../environment';
import * as util from '../util';

import {doc, operation} from './decorators';
import * as ops from './ops';
import {zerosLike} from './ops';
import * as selu_util from './selu_util';
import {Tensor} from './tensor';

export class Ops {
  /**
   * Computes -1 * A element-wise.
   * @param x The input array.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static neg<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.neg()};
    };
    return ENV.engine.runKernel(backend => backend.neg(x), {x}, grad);
  }

  /**
   * Computes ceiling of input Tensor element-wise. y = ceil(x)
   * TODO(nsthorat): Make this return an int32 when we add rank as a
   * generic.
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static ceil<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => ops.zerosLike(y)};
    };
    return ENV.engine.runKernel(backend => backend.ceil(x), {x}, grad);
  }

  /**
   * Computes floor of input NDArray element-wise. y = floor(x).
   * TODO(manrajgrover): Fix gradient once backprop handles nulls
   * @param x The input NDArray.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static floor<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => ops.zerosLike(y)};
    };
    return ENV.engine.runKernel(backend => backend.floor(x), {x}, grad);
  }

  /**
   * Computes exponential of the input Tensor element-wise. y = e ^ x
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static exp<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.mulStrict(y)};
    };
    return ENV.engine.runKernel(backend => backend.exp(x), {x}, grad);
  }

  /**
   * Computes natural logarithm of the input Tensor element-wise. y = ln(x)
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static log<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.divStrict(x.toFloat())};
    };
    return ENV.engine.runKernel(backend => backend.log(x), {x}, grad);
  }

  /**
   * Computes square root of the input Tensor element-wise. y = sqrt(x)
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static sqrt<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.divStrict(x.toFloat().sqrt().mul(ops.scalar(2)))};
    };
    return ENV.engine.runKernel(backend => backend.sqrt(x), {x}, grad);
  }

  /**
   * Computes square of `x` element-wise.
   *
   * @param x The input array.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static square<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.mulStrict(x.toFloat().mul(ops.scalar(2)))};
    };
    return ENV.engine.runKernel(backend => backend.square(x), {x}, grad);
  }

  /**
   * Computes absolute value element-wise.
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static abs<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.mulStrict(x.toFloat().step(-1))};
    };
    return ENV.engine.runKernel(backend => backend.abs(x), {x}, grad);
  }

  /**
   * Clips values element-wise.
   * @param x The input Tensor.
   * @param min Lower-bound of range to be clipped to.
   * @param max Upper-bound of range to be clipped to.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static clip<T extends Tensor>(x: T, min: number, max: number): T {
    util.assert(
        (min <= max),
        `Error in clip: min (${min}) must be` +
            `less than or equal to max (${max}).`);
    const grad = (dy: T, y: T) => {
      return {
        // TODO(cais): Fix gradients for the case where x = min or x
        // = max.
        x: () =>
            dy.where(
                x.greater(ops.scalar(min)).logicalAnd(x.less(ops.scalar(max))),
                zerosLike(dy)) as T,
      };
    };
    return ENV.engine.runKernel(
        backend => backend.clip(x, min, max), {x}, grad);
  }

  /**
   * Computes rectified linear element-wise, max(x, 0).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static relu<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      const stepRes = x.step();
      return {x: () => dy.mulStrict(stepRes.toFloat())};
    };
    return ENV.engine.runKernel(backend => backend.relu(x), {x}, grad);
  }

  /**
   * Computes exponential linear element-wise
   * @param x the input Tensor
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static elu<T extends Tensor>(x: T): T {
    const grad = (dy: T) => {
      return {x: () => dy.mulStrict(eluDer(x))};
    };
    return ENV.engine.runKernel(backend => backend.elu(x), {x}, grad);
  }

  /**
   * Computes scaled exponential linear element-wise.
   * @hidden
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static selu<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {
        x: () => {
          // Currently, Scalars are not supported by ops.where
          util.assert(x.rank !== 0, 'Error in selu gradient: ');
          const mask = x.greater(ops.scalar(0));

          const scaleAlpha = ops.scalar(selu_util.SELU_SCALEALPHA);
          const scale = ops.scalar(selu_util.SELU_SCALE);

          const greaterThanZeroDer = dy.mul(scale);
          const lessEqualZeroDer = dy.mul(scaleAlpha).mul(x.toFloat().exp());

          return ops.where(mask, greaterThanZeroDer, lessEqualZeroDer) as T;
        }
      };
    };
    return ENV.engine.runKernel(backend => backend.selu(x), {x}, grad);
  }

  /**
   * Computes leaky rectified linear element-wise
   * @param x the input Tensor
   * @param alpha scaling factor for negative values, defaults to 0.2
   * @return {Tensor}
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static leakyRelu<T extends Tensor>(x: T, alpha = 0.2): T {
    return ENV.engine.runKernel(backend => backend.leakyRelu(x, alpha));
  }

  /**
   * Computes leaky rectified linear element-wise with parametric alphas
   * @param x the input Tensor
   * @param alpha scaling factor Tensor for negative values
   * @return {Tensor}
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static prelu<T extends Tensor>(x: T, alpha: T): T {
    const grad = (dy: T) => {
      return {x: () => dy.mulStrict(preluDer(x, alpha))};
    };
    return ENV.engine.runKernel(backend => backend.prelu(x, alpha), {x}, grad);
  }

  /**
   * Computes sigmoid element-wise, y = 1 / (1 + exp(-x)).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static sigmoid<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.mulStrict(y.mul(ops.scalar(1).sub(y)))};
    };
    return ENV.engine.runKernel(backend => backend.sigmoid(x), {x}, grad);
  }

  /**
   * Computes sin of the input Tensor element-wise, y = sin(x).
   * @param x The input Tensor.
   *
   * TODO(smilkov): Fix dl.cos() and other ops that should return a float.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static sin<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => x.toFloat().cos().mulStrict(dy)};
    };
    return ENV.engine.runKernel(backend => backend.sin(x), {x}, grad);
  }

  /**
   * Computes cos of the input Tensor element-wise, y = cos(x).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static cos<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => x.toFloat().sin().neg().mulStrict(dy)};
    };
    return ENV.engine.runKernel(backend => backend.cos(x), {x}, grad);
  }

  /**
   * Computes tan of the input Tensor element-wise, y = tan(x).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static tan<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.divStrict(x.cos().square())};
    };
    return ENV.engine.runKernel(backend => backend.tan(x), {x}, grad);
  }

  /**
   * Computes asin of the input Tensor element-wise, y = asin(x).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static asin<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {
        x: () => dy.divStrict(Ops.sqrt(ops.scalar(1).sub(x.toFloat().square())))
      };
    };
    return ENV.engine.runKernel(backend => backend.asin(x), {x}, grad);
  }

  /**
   * Computes acos of the input Tensor element-wise, y = acos(x).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static acos<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {
        x: () => dy.divStrict(Ops.sqrt(ops.scalar(1).sub(x.toFloat().square())))
                     .neg()
      };
    };
    return ENV.engine.runKernel(backend => backend.acos(x), {x}, grad);
  }

  /**
   * Computes atan of the input Tensor element-wise, y = atan(x).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static atan<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => dy.divStrict(ops.scalar(1).add(x.toFloat().square()))};
    };
    return ENV.engine.runKernel(backend => backend.atan(x), {x}, grad);
  }

  /**
   * Computes hyperbolic sin of the input Tensor element-wise, y = sinh(x).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static sinh<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => x.toFloat().cosh().mulStrict(dy)};
    };
    return ENV.engine.runKernel(backend => backend.sinh(x), {x}, grad);
  }

  /**
   * Computes hyperbolic cos of the input Tensor element-wise, y = cosh(x).
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static cosh<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => x.toFloat().sinh().mulStrict(dy)};
    };
    return ENV.engine.runKernel(backend => backend.cosh(x), {x}, grad);
  }

  /**
   * Computes hyperbolic tangent of the input Tensor element-wise.
   * @param x The input Tensor.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static tanh<T extends Tensor>(x: T): T {
    const grad = (dy: T, y: T) => {
      return {x: () => ops.scalar(1).sub(y.square()).mulStrict(dy) as T};
    };
    return ENV.engine.runKernel(backend => backend.tanh(x), {x}, grad);
  }

  /**
   * Computes step of the input Tensor element-wise,
   * y=1 if x>0|alpha*x if x<=0.
   *
   * @param x The input Tensor.
   * @param alpha The gradient when input is negative.
   */
  @doc({heading: 'Operations', subheading: 'Basic math'})
  @operation
  static step<T extends Tensor>(x: T, alpha = 0.0): T {
    return ENV.engine.runKernel(backend => backend.step(x, alpha));
  }
}

function preluDer<T extends Tensor>(x: T, alpha: T): T {
  return ENV.engine.runKernel(backend => backend.preluDer(x, alpha));
}

function eluDer<T extends Tensor>(x: T): T {
  return ENV.engine.runKernel(backend => backend.eluDer(x));
}
