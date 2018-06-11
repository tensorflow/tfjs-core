import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('clone', ALL_ENVS, function () {
    it('returns a tensor with the same shape and value', function () {
        var a = tf.tensor2d([1, 2, 3, 4, 5, 6, 7, 8, 9], [3, 3]);
        var aPrime = tf.clone(a);
        expect(aPrime.shape).toEqual(a.shape);
        expectArraysClose(aPrime, a);
    });
});
//# sourceMappingURL=clone_test.js.map