import {HAS_WORKER, describeWithFlags} from './jasmine_util';
import {expectArraysClose} from './test_util';
import * as tf from './index';

const workerTest = () => {
	//@ts-ignore
	importScripts('http://bs-local.com:12345/base/dist/tf-core.js');
	let a = tf.tensor1d([1, 2, 3]);
	const b = tf.tensor1d([3, 2, 1]);
	a = a.add(b);
	//@ts-ignore
	self.postMessage({data: a.dataSync()});
};

const fn2workerURL = (fn: Function): string => {
	const blob =
			new Blob(['('+fn.toString()+')()'], {type: 'application/javascript'});
  return URL.createObjectURL(blob);
};

describeWithFlags('computation in worker', HAS_WORKER, () => {
  it('tensor in worker', (done) => {
		const worker = new Worker(fn2workerURL(workerTest));
		worker.onmessage = (msg) => {
			const data = msg.data.data;
			expectArraysClose(data, [4, 4, 4]);
			done();
		};
	});
});
