import * as tf from '../index';
import { ALL_ENVS, expectArraysClose } from '../test_util';
import { describeWithFlags } from '../jasmine_util';
describeWithFlags('multinomial', ALL_ENVS, function () {
    var NUM_SAMPLES = 10000;
    var EPSILON = 0.05;
    it('Flip a fair coin and check bounds', function () {
        var probs = tf.tensor1d([1, 1]);
        var seed = null;
        var result = tf.multinomial(probs, NUM_SAMPLES, seed);
        expect(result.dtype).toBe('int32');
        expect(result.shape).toEqual([NUM_SAMPLES]);
        var outcomeProbs = computeProbs(result.dataSync(), 2);
        expectArraysClose(outcomeProbs, [0.5, 0.5], EPSILON);
    });
    it('Flip a two-sided coin with 100% of heads', function () {
        var logits = tf.tensor1d([1, -100]);
        var seed = null;
        var result = tf.multinomial(logits, NUM_SAMPLES, seed);
        expect(result.dtype).toBe('int32');
        expect(result.shape).toEqual([NUM_SAMPLES]);
        var outcomeProbs = computeProbs(result.dataSync(), 2);
        expectArraysClose(outcomeProbs, [1, 0], EPSILON);
    });
    it('Flip a two-sided coin with 100% of tails', function () {
        var logits = tf.tensor1d([-100, 1]);
        var seed = null;
        var result = tf.multinomial(logits, NUM_SAMPLES, seed);
        expect(result.dtype).toBe('int32');
        expect(result.shape).toEqual([NUM_SAMPLES]);
        var outcomeProbs = computeProbs(result.dataSync(), 2);
        expectArraysClose(outcomeProbs, [0, 1], EPSILON);
    });
    it('Flip a single-sided coin throws error', function () {
        var probs = tf.tensor1d([1]);
        var seed = null;
        expect(function () { return tf.multinomial(probs, NUM_SAMPLES, seed); }).toThrowError();
    });
    it('Flip a ten-sided coin and check bounds', function () {
        var numOutcomes = 10;
        var logits = tf.fill([numOutcomes], 1).as1D();
        var seed = null;
        var result = tf.multinomial(logits, NUM_SAMPLES, seed);
        expect(result.dtype).toBe('int32');
        expect(result.shape).toEqual([NUM_SAMPLES]);
        var outcomeProbs = computeProbs(result.dataSync(), numOutcomes);
        expect(outcomeProbs.length).toBeLessThanOrEqual(numOutcomes);
    });
    it('Flip 3 three-sided coins, each coin is 100% biases', function () {
        var numOutcomes = 3;
        var logits = tf.tensor2d([[-100, -100, 1], [-100, 1, -100], [1, -100, -100]], [3, numOutcomes]);
        var seed = null;
        var result = tf.multinomial(logits, NUM_SAMPLES, seed);
        expect(result.dtype).toBe('int32');
        expect(result.shape).toEqual([3, NUM_SAMPLES]);
        var outcomeProbs = computeProbs(result.dataSync().slice(0, NUM_SAMPLES), numOutcomes);
        expectArraysClose(outcomeProbs, [0, 0, 1], EPSILON);
        outcomeProbs = computeProbs(result.dataSync().slice(NUM_SAMPLES, 2 * NUM_SAMPLES), numOutcomes);
        expectArraysClose(outcomeProbs, [0, 1, 0], EPSILON);
        outcomeProbs =
            computeProbs(result.dataSync().slice(2 * NUM_SAMPLES), numOutcomes);
        expectArraysClose(outcomeProbs, [1, 0, 0], EPSILON);
    });
    it('passing Tensor3D throws error', function () {
        var probs = tf.zeros([3, 2, 2]);
        var seed = null;
        var normalized = true;
        expect(function () { return tf.multinomial(probs, 3, seed, normalized); })
            .toThrowError();
    });
    it('throws when passed a non-tensor', function () {
        var seed = null;
        expect(function () { return tf.multinomial({}, NUM_SAMPLES, seed); })
            .toThrowError(/Argument 'logits' passed to 'multinomial' must be a Tensor/);
    });
    function computeProbs(events, numOutcomes) {
        var counts = [];
        for (var i = 0; i < numOutcomes; ++i) {
            counts[i] = 0;
        }
        var numSamples = events.length;
        for (var i = 0; i < events.length; ++i) {
            counts[events[i]]++;
        }
        for (var i = 0; i < counts.length; i++) {
            counts[i] /= numSamples;
        }
        return counts;
    }
});
//# sourceMappingURL=multinomial_test.js.map