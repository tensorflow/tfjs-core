import {doc} from '../doc';
import {ENV} from '../environment';
import {Tensor, Tensor1D} from '../tensor';
import * as util from '../util';
import {ArrayOps} from './array_ops';
import * as axis_util from './axis_util';
import {BinaryOps} from './binary_ops';
import {CompareOps} from './compare';
import {LogicalOps} from './logical_ops';
import {operation} from './operation';

export class SegmentOps {
  /**
   * Computes the sum along segments of a `Tensor`.
   *
   * ```js
   * const x = tf.tensor1d([1, 2, 3, 4]);
   * const segmentIds = tf.tensor1d([1, 2, 0, 1], 'int32');
   * comst numSegments = 3;
   * const axis = 0;
   *
   * x.unsortedSegmentSum(indices, numSegments, axis).print() //or
   * tf.unsortedSegmentSum(x, indices, numSegments, axis)
   * ```
   * @param x The `Tensor` that will be summed along its segments
   * @param segmentIds A `Tensor1D` whose rank is equal to the rank of `x`'s
   * dimension along the `axis`.  Maps each element of `x` to a segment.
   * @param numSegments The number of distinct `segmentIds`
   * @param axis The dimension along which the sums will be
   * calculated. Defaults to 0.
   */
  @doc({heading: 'Operations', subheading: 'Segment'})
  @operation
  static unsortedSegmentSum<T extends Tensor>(
      x: T, segmentIds: Tensor1D, numSegments: number, axis = 0): T {
    util.assertArgumentsAreTensors({x, segmentIds}, 'unsortedSegmentSum');

    util.assert(
        segmentIds.dtype === 'int32', 'segmentIds must be of dtype `int32`');

    util.assert(util.isInt(numSegments), 'numSegments must be of dtype int');

    const permutation = axis_util.getAxesPermutation([axis], x.rank);
    axis = axis_util.parseAxisParam(axis, x.shape)[0];
    let permutedX = x;
    if (permutation != null) {
      permutedX = x.transpose(permutation);
      axis = axis_util.getInnerMostAxes(1, x.rank)[0];
    }
    const grad = (dy: T) => {
      const derX = () => {
        let gradRes = gatherDropNegatives(dy, segmentIds, axis);
        if (permutation != null) {
          gradRes =
              gradRes.transpose(axis_util.getUndoAxesPermutation(permutation));
        }
        return gradRes;
      };
      return {x: derX};
    };
    const res = ENV.engine.runKernel(
                    backend => backend.unsortedSegmentSum(
                        permutedX, segmentIds, numSegments, axis),
                    {x}, grad) as T;
    if (permutation != null) {
      return res.transpose(axis_util.getUndoAxesPermutation(permutation));
    }
    return res;
  }
}

function gatherDropNegatives<T extends Tensor>(
    x: T, indices: Tensor1D, axis: number) {
  // Helper function for unsorted segment ops. Gathers params for
  // positive segment ids and gathers 0 for inputs with negative segment id.
  // Mirrors _GatherDropNegatives from tensorflow/python/ops/math_grad.py
  const zeroClippedIndices =
      BinaryOps.maximum(indices, ArrayOps.zerosLike(indices));
  const gathered = ArrayOps.gather(x, zeroClippedIndices as Tensor1D, axis);
  let isPositive =
      CompareOps.greaterEqual(indices, ArrayOps.scalar(0, 'int32'));
  for (let i = 0; i < gathered.rank - isPositive.rank; ++i) {
    isPositive = ArrayOps.expandDims(isPositive, -1);
  }
  const bools = ArrayOps.onesLike(gathered).equal(ArrayOps.scalar(1));
  isPositive = LogicalOps.logicalAnd(isPositive, bools);
  const zeroSlice = ArrayOps.zerosLike(gathered);
  return LogicalOps.where(isPositive, gathered, zeroSlice);
}
