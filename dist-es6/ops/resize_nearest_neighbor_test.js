import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('resizeNearestNeighbor', ALL_ENVS, function () {
    it('simple alignCorners=false', function () {
        var input = tf.tensor3d([2, 2, 4, 4], [2, 2, 1]);
        var output = input.resizeNearestNeighbor([3, 3], false);
        expectArraysClose(output, [2, 2, 2, 2, 2, 2, 4, 4, 4]);
    });
    it('simple alignCorners=true', function () {
        var input = tf.tensor3d([2, 2, 4, 4], [2, 2, 1]);
        var output = input.resizeNearestNeighbor([3, 3], true);
        expectArraysClose(output, [2, 2, 2, 4, 4, 4, 4, 4, 4]);
    });
    it('matches tensorflow w/ random numbers alignCorners=false', function () {
        var input = tf.tensor3d([
            1.19074044, 0.91373104, 2.01611669, -0.52270832, 0.38725395,
            1.30809779, 0.61835143, 3.49600659, 2.09230986, 0.56473997,
            0.03823943, 1.19864896
        ], [2, 3, 2]);
        var output = input.resizeNearestNeighbor([4, 5], false);
        expectArraysClose(output, [
            1.19074047, 0.913731039, 1.19074047, 0.913731039, 2.01611662,
            -0.522708297, 2.01611662, -0.522708297, 0.38725394, 1.30809784,
            1.19074047, 0.913731039, 1.19074047, 0.913731039, 2.01611662,
            -0.522708297, 2.01611662, -0.522708297, 0.38725394, 1.30809784,
            0.61835146, 3.49600649, 0.61835146, 3.49600649, 2.09230995,
            0.564739943, 2.09230995, 0.564739943, 0.0382394306, 1.19864893,
            0.61835146, 3.49600649, 0.61835146, 3.49600649, 2.09230995,
            0.564739943, 2.09230995, 0.564739943, 0.0382394306, 1.19864893
        ]);
    });
    it('matches tensorflow w/ random numbers alignCorners=true', function () {
        var input = tf.tensor3d([
            1.19074044, 0.91373104, 2.01611669, -0.52270832, 0.38725395,
            1.30809779, 0.61835143, 3.49600659, 2.09230986, 0.56473997,
            0.03823943, 1.19864896
        ], [2, 3, 2]);
        var output = input.resizeNearestNeighbor([4, 5], true);
        expectArraysClose(output, [
            1.19074044, 0.91373104, 2.01611669, -0.52270832, 2.01611669, -0.52270832,
            0.38725395, 1.30809779, 0.38725395, 1.30809779, 1.19074044, 0.91373104,
            2.01611669, -0.52270832, 2.01611669, -0.52270832, 0.38725395, 1.30809779,
            0.38725395, 1.30809779, 0.61835143, 3.49600659, 2.09230986, 0.56473997,
            2.09230986, 0.56473997, 0.03823943, 1.19864896, 0.03823943, 1.19864896,
            0.61835143, 3.49600659, 2.09230986, 0.56473997, 2.09230986, 0.56473997,
            0.03823943, 1.19864896, 0.03823943, 1.19864896
        ]);
    });
    it('batch of 2, simple, alignCorners=true', function () {
        var input = tf.tensor4d([2, 2, 4, 4, 3, 3, 5, 5], [2, 2, 2, 1]);
        var output = input.resizeNearestNeighbor([3, 3], true);
        expectArraysClose(output, [2, 2, 2, 4, 4, 4, 4, 4, 4, 3, 3, 3, 5, 5, 5, 5, 5, 5]);
    });
    it('throws when passed a non-tensor', function () {
        var e = /Argument 'images' passed to 'resizeNearestNeighbor' must be a Tensor/;
        expect(function () { return tf.image.resizeNearestNeighbor({}, [
            1, 1
        ]); }).toThrowError(e);
    });
});
//# sourceMappingURL=resize_nearest_neighbor_test.js.map