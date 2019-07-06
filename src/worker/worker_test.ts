import {ALL_ENVS, describeWithFlags} from '../jasmine_util';
import {expectArraysClose} from '../test_util';

describeWithFlags('computation in worker', ALL_ENVS, () => {
  it('tensor in worker', (done) => {
		const worker = new Worker('base/src/worker/worker.js');
		worker.onmessage = (msg) => {
			const data = msg.data.data;
			expectArraysClose(data, [4, 4, 4]);
			done();
		};
	});
});
