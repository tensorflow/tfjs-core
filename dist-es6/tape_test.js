import * as tf from './index';
import * as tape_util from './tape';
import { CPU_ENVS, expectArraysClose } from './test_util';
import { describeWithFlags } from './jasmine_util';
describeWithFlags('getFilteredNodesXToY', CPU_ENVS, function () {
    it('getFilteredNodesXToY no paths from x to y', function () {
        var x = tf.scalar(1);
        var intermediate1 = tf.scalar(0);
        var intermediate2 = tf.scalar(0);
        var y = tf.scalar(2);
        var tape = [
            {
                id: 0,
                name: 'node0',
                inputs: { x: x },
                output: intermediate1,
                gradient: null
            },
            {
                id: 1,
                name: 'node1',
                inputs: { intermediate2: intermediate2 },
                output: y,
                gradient: null
            }
        ];
        var filteredTapeNodes = tape_util.getFilteredNodesXToY(tape, [x], y);
        expect(filteredTapeNodes.length).toBe(0);
        expect(filteredTapeNodes).toEqual([]);
    });
    it('getFilteredNodesXToY one operation x => y', function () {
        var x = tf.scalar(1);
        var y = tf.scalar(2);
        var tape = [{ id: 0, name: 'node0', inputs: { x: x }, output: y, gradient: null }];
        var filteredTapeNodes = tape_util.getFilteredNodesXToY(tape, [x], y);
        expect(filteredTapeNodes.length).toBe(1);
        expect(filteredTapeNodes).toEqual(tape);
    });
    it('getFilteredNodesXToY 1 operation [x0, x1] => y, all input paths', function () {
        var x0 = tf.scalar(0);
        var x1 = tf.scalar(1);
        var y = tf.scalar(2);
        var tape = [{ id: 0, name: 'node0', inputs: { x0: x0, x1: x1 }, output: y, gradient: null }];
        var filteredTapeNodes = tape_util.getFilteredNodesXToY(tape, [x0, x1], y);
        expect(filteredTapeNodes.length).toBe(1);
        expect(filteredTapeNodes).toEqual(tape);
    });
    it('getFilteredNodesXToY one operation [x0, x1] => y, one input paths', function () {
        var x0 = tf.scalar(0);
        var x1 = tf.scalar(1);
        var y = tf.scalar(2);
        var tape = [
            { id: 0, name: 'node0', inputs: { x0: x0, x1: x1 }, output: y, gradient: null }
        ];
        var filteredTapeNodes = tape_util.getFilteredNodesXToY(tape, [x0], y);
        expect(filteredTapeNodes.length).toBe(1);
        expect(filteredTapeNodes[0])
            .toEqual({ id: 0, name: 'node0', inputs: { x0: x0 }, output: y, gradient: null });
    });
    it('getFilteredNodesXToY two operations x => intermediate => y', function () {
        var x = tf.scalar(1);
        var intermediate = tf.scalar(0);
        var y = tf.scalar(2);
        var tape = [
            { id: 0, name: 'node0', inputs: { x: x }, output: intermediate, gradient: null },
            {
                id: 1,
                name: 'node1',
                inputs: { intermediate: intermediate },
                output: y,
                gradient: null
            }
        ];
        var filteredTapeNodes = tape_util.getFilteredNodesXToY(tape, [x], y);
        expect(filteredTapeNodes.length).toBe(2);
        expect(filteredTapeNodes).toEqual(tape);
    });
    it('getFilteredNodesXToY two operations [x0, x1], [x2] => ' +
        'intermediate => y', function () {
        var x0 = tf.scalar(1);
        var x1 = tf.scalar(2);
        var x2 = tf.scalar(3);
        var intermediate = tf.scalar(4);
        var y = tf.scalar(2);
        var tape = [
            {
                id: 0,
                name: 'node0',
                inputs: { x0: x0, x1: x1 },
                output: intermediate,
                gradient: null
            },
            {
                id: 1,
                name: 'node1',
                inputs: { x2: x2, intermediate: intermediate },
                output: y,
                gradient: null
            }
        ];
        var filteredTapeNodes = tape_util.getFilteredNodesXToY(tape, [x0, x1, x2], y);
        expect(filteredTapeNodes.length).toBe(2);
        expect(filteredTapeNodes).toEqual(tape);
    });
    it('getFilteredNodesXToY x => y and x => orphan', function () {
        var x = tf.scalar(1);
        var orphan = tf.scalar(0);
        var y = tf.scalar(2);
        var tape = [
            { id: 0, name: 'node0', inputs: { x: x }, output: orphan, gradient: null },
            { id: 1, name: 'node1', inputs: { x: x }, output: y, gradient: null }
        ];
        var filteredTapeNodes = tape_util.getFilteredNodesXToY(tape, [x], y);
        expect(filteredTapeNodes.length).toBe(1);
        expect(filteredTapeNodes[0]).toEqual(tape[1]);
    });
    it('getFilteredNodesXToY x => y and orphan => y', function () {
        var x = tf.scalar(1);
        var orphan = tf.scalar(0);
        var y = tf.scalar(2);
        var tape = [
            { id: 0, name: 'node0', inputs: { x: x, orphan: orphan }, output: y, gradient: null }
        ];
        var filteredTapeNodes = tape_util.getFilteredNodesXToY(tape, [x], y);
        expect(filteredTapeNodes.length).toBe(1);
        expect(filteredTapeNodes[0])
            .toEqual({ id: 0, name: 'node0', inputs: { x: x }, output: y, gradient: null });
    });
});
describeWithFlags('backpropagateGradients', CPU_ENVS, function () {
    it('Throws if gradient is not defined', function () {
        var x = tf.scalar(0);
        var y = tf.scalar(1);
        var dy = tf.scalar(1);
        var accumulatedGradientsMap = {};
        accumulatedGradientsMap[y.id] = dy;
        var tape = [{ id: 0, name: 'node0', inputs: { x: x }, output: y, gradient: null }];
        expect(function () { return tape_util.backpropagateGradients(accumulatedGradientsMap, tape); })
            .toThrowError();
    });
    it('basic backprop with 1 node', function () {
        var x = tf.scalar(0);
        var y = tf.scalar(1);
        var dy = tf.scalar(1);
        var accumulatedGradientsMap = {};
        accumulatedGradientsMap[y.id] = dy;
        var tape = [{
                id: 0,
                name: 'node0',
                inputs: { x: x },
                output: y,
                gradient: function (dy) {
                    return { x: function () { return dy.add(tf.scalar(1)); } };
                }
            }];
        tape_util.backpropagateGradients(accumulatedGradientsMap, tape);
        expectArraysClose(accumulatedGradientsMap[x.id], [2]);
    });
    it('basic backprop with 2 nodes', function () {
        var x = tf.scalar(0);
        var intermediate = tf.scalar(1);
        var y = tf.scalar(2);
        var dy = tf.scalar(1);
        var accumulatedGradientsMap = {};
        accumulatedGradientsMap[y.id] = dy;
        var tape = [
            {
                id: 0,
                name: 'node0',
                inputs: { x: x },
                output: intermediate,
                gradient: function (dy) {
                    return { x: function () { return dy.add(tf.scalar(1)); } };
                }
            },
            {
                id: 1,
                name: 'node1',
                inputs: { intermediate: intermediate },
                output: y,
                gradient: function (dy) {
                    return { intermediate: function () { return dy.add(tf.scalar(1)); } };
                }
            }
        ];
        tape_util.backpropagateGradients(accumulatedGradientsMap, tape);
        expectArraysClose(accumulatedGradientsMap[x.id], [3]);
    });
    it('basic backprop with a split node accumulates gradients', function () {
        var x = tf.scalar(0);
        var intermediate1 = tf.scalar(1);
        var intermediate2 = tf.scalar(2);
        var y = tf.scalar(3);
        var dy = tf.scalar(1);
        var accumulatedGradientsMap = {};
        accumulatedGradientsMap[y.id] = dy;
        var tape = [
            {
                id: 0,
                name: 'node0',
                inputs: { x: x },
                output: intermediate1,
                gradient: function (dy) {
                    return { x: function () { return dy.add(tf.scalar(1)); } };
                }
            },
            {
                id: 1,
                name: 'node1',
                inputs: { x: x },
                output: intermediate2,
                gradient: function (dy) {
                    return { x: function () { return dy.add(tf.scalar(1)); } };
                }
            },
            {
                id: 2,
                name: 'node2',
                inputs: { intermediate1: intermediate1, intermediate2: intermediate2 },
                output: y,
                gradient: function (dy) {
                    return {
                        intermediate1: function () { return dy.add(tf.scalar(1)); },
                        intermediate2: function () { return dy.add(tf.scalar(1)); }
                    };
                }
            }
        ];
        tape_util.backpropagateGradients(accumulatedGradientsMap, tape);
        expectArraysClose(accumulatedGradientsMap[x.id], [dy.dataSync()[0] + 5]);
    });
});
//# sourceMappingURL=tape_test.js.map