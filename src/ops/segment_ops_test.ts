import * as tf from '../index';
import {describeWithFlags} from '../jasmine_util';
import {ALL_ENVS, expectArraysClose} from '../test_util';
import {PARALLELIZE_THRESHOLD} from './reduce_util';

describeWithFlags('unsortedSegmentSum', ALL_ENVS, () => {
  it('tensor1D', () => {
    const t = tf.tensor1d([1, 2, 3, 4]);
    const segmentIds = tf.tensor1d([0, 2, 0, 1], 'int32');
    const numSegments = 3;
    const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);

    expect(res.shape).toEqual([numSegments]);
    expectArraysClose(res, [4, 4, 2]);
  });

  it('tensor2D axis=0', () => {
    const t = tf.tensor2d([1, 2, 3, 4], [2, 2]);
    const segmentIds = tf.tensor1d([0, 0], 'int32');
    const numSegments = 2;
    const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);

    expect(res.shape).toEqual([numSegments, 2]);
    expectArraysClose(res, [4, 6, 0, 0]);
  });

  it('tensor2D axis=11', () => {
    const t = tf.tensor2d([1, 2, 3, 4], [2, 2]);
    const segmentIds = tf.tensor1d([0, 0], 'int32');
    const numSegments = 2;
    const axis = 1;
    const res = tf.unsortedSegmentSum(t, segmentIds, numSegments, axis);

    expect(res.shape).toEqual([2, numSegments]);
    expectArraysClose(res, [3, 0, 7, 0]);
  });

  it('tensor3D axis=0', () => {
    const t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [3, 2, 2]);
    const segmentIds = tf.tensor1d([2, 1, 2], 'int32');
    const numSegments = 3;
    const axis = 0;
    const res = tf.unsortedSegmentSum(t, segmentIds, numSegments, axis);

    expect(res.shape).toEqual([numSegments, 2, 2]);
    expectArraysClose(res, [0, 0, 0, 0, 5, 6, 7, 8, 10, 12, 14, 16]);
  });

  it('tensor3D axis=1', () => {
    const t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [2, 3, 2]);
    const segmentIds = tf.tensor1d([2, 2, 2], 'int32');
    const numSegments = 3;
    const axis = 1;
    const res = tf.unsortedSegmentSum(t, segmentIds, numSegments, axis);

    expect(res.shape).toEqual([2, numSegments, 2]);
    expectArraysClose(res, [0, 0, 0, 0, 9, 12, 0, 0, 0, 0, 27, 30]);
  });

  it('tensor3D axis=2', () => {
    const t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [2, 3, 2]);
    const segmentIds = tf.tensor1d([0, 0], 'int32');
    const numSegments = 2;
    const axis = 2;
    const res = tf.unsortedSegmentSum(t, segmentIds, numSegments, axis);

    expect(res.shape).toEqual([2, 3, numSegments]);
    expectArraysClose(res, [3, 0, 7, 0, 11, 0, 15, 0, 19, 0, 23, 0]);
  });

  it('N > than parallelization threshold, tensor1D', () => {
    const n = PARALLELIZE_THRESHOLD * 2;
    const values = new Float32Array(n);
    const numSegments = 5;
    const segmentIdValues = new Float32Array(n);
    const vals = new Float32Array(numSegments);
    for (let i = 0; i < n; i++) {
      values[i] = i;
      segmentIdValues[i] = i % numSegments;
      vals[i % numSegments] += i;
    }
    const t = tf.tensor1d(values);
    const segmentIds = tf.tensor1d(segmentIdValues, 'int32');
    const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);

    expect(res.shape).toEqual([numSegments]);
    expectArraysClose(res, vals);
  });

  it('ignores negative segmentIds', () => {
    const t = tf.tensor1d([1, 2, 3, 4]);
    const segmentIds = tf.tensor1d([0, 2, -1, 1], 'int32');
    const numSegments = 3;

    const res = tf.unsortedSegmentSum(t, segmentIds, numSegments);

    expect(res.shape).toEqual([numSegments]);
    expectArraysClose(res, [1, 4, 2]);
  });

  it('tensor1D gradient', () => {
    const t = tf.tensor1d([1, 2, 3, 4]);
    const segmentIds = tf.tensor1d([0, 2, 0, 1], 'int32');
    const numSegments = 3;

    const dy = tf.tensor1d([11, 2, 7]);
    const gradient =
        tf.grad(a => tf.unsortedSegmentSum(a, segmentIds, numSegments))(t, dy);

    expect(gradient.shape).toEqual(t.shape);
    expectArraysClose(gradient, [11, 7, 11, 2]);
  });

  it('tensor2D gradient axis=0', () => {
    const t = tf.tensor2d([1, 2, 3, 4], [2, 2]);
    const segmentIds = tf.tensor1d([0, 0], 'int32');
    const numSegments = 2;

    const dy = tf.tensor2d([11, 2, 4, 5], [2, 2]);
    const gradient =
        tf.grad(a => tf.unsortedSegmentSum(a, segmentIds, numSegments))(t, dy);

    expect(gradient.shape).toEqual(t.shape);
    expectArraysClose(gradient, [11, 2, 11, 2]);
  });

  it('tensor2D gradient axis=1', () => {
    const t = tf.tensor2d([1, 2, 3, 4], [2, 2]);
    const segmentIds = tf.tensor1d([0, 0], 'int32');
    const numSegments = 2;
    const axis = 1;

    const dy = tf.tensor2d([11, 2, 4, 5], [2, 2]);
    const gradient = tf.grad(
        a => tf.unsortedSegmentSum(a, segmentIds, numSegments, axis))(t, dy);

    expect(gradient.shape).toEqual(t.shape);
    expectArraysClose(gradient, [11, 11, 4, 4]);
  });

  it('tensor3D gradient axis=0', () => {
    const t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [3, 2, 2]);
    const segmentIds = tf.tensor1d([2, 1, 2], 'int32');
    const numSegments = 3;
    const axis = 0;

    const dy =
        tf.tensor3d([11, 2, 4, 5, 17, 31, 1, 0, -1, 14, 3, 28], [3, 2, 2]);
    const gradient = tf.grad(
        a => tf.unsortedSegmentSum(a, segmentIds, numSegments, axis))(t, dy);

    expect(gradient.shape).toEqual(t.shape);
    expectArraysClose(gradient, [-1, 14, 3, 28, 17, 31, 1, 0, -1, 14, 3, 28]);
  });

  it('tensor3D gradient axis=1', () => {
    const t = tf.tensor3d([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [2, 3, 2]);
    const segmentIds = tf.tensor1d([2, 2, 2], 'int32');
    const numSegments = 3;
    const axis = 1;

    const dy =
        tf.tensor3d([11, 2, 4, 5, 17, 31, 1, 0, -1, 14, 3, 28], [2, 3, 2]);
    const gradient = tf.grad(
        a => tf.unsortedSegmentSum(a, segmentIds, numSegments, axis))(t, dy);

    expect(gradient.shape).toEqual(t.shape);
    expectArraysClose(gradient, [17, 31, 17, 31, 17, 31, 3, 28, 3, 28, 3, 28]);
  });

  it('tensor3D gradient axis=2', () => {
    const t = tf.tensor3d(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
        [2, 3, 3]);
    const segmentIds = tf.tensor1d([0, 1, 1], 'int32');
    const numSegments = 2;
    const axis = 2;

    const dy =
        tf.tensor3d([11, 2, 4, 5, 17, 31, 1, 0, -1, 14, 3, 28], [2, 3, 2]);
    const gradient = tf.grad(
        a => tf.unsortedSegmentSum(a, segmentIds, numSegments, axis))(t, dy);

    expect(gradient.shape).toEqual(t.shape);
    expectArraysClose(
        gradient,
        [11, 2, 2, 4, 5, 5, 17, 31, 31, 1, 0, 0, -1, 14, 14, 3, 28, 28]);
  });
});
