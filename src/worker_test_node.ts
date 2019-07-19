import {HAS_NODE_WORKER, describeWithFlags} from './jasmine_util';
import {expectArraysClose} from './test_util';

const fn2String = (fn: Function): string => {
  const funcStr = '('+fn.toString()+')()';
  return funcStr;
};

const workerTestNode = () => {
  const tf = require(`${process.cwd()}/dist/tf-core.js`);
  // tslint:disable-next-line:no-require-imports
  const {parentPort} = require('worker_threads');
  let a = tf.tensor1d([1, 2, 3]);
  const b = tf.tensor1d([3, 2, 1]);
  a = a.add(b);
  parentPort.postMessage({data: a.dataSync()});
};

describeWithFlags('computation in worker (node env)', HAS_NODE_WORKER, () => {
  it('tensor in worker', (done) => {
    // tslint:disable-next-line:no-require-imports
    const {Worker} = require('worker_threads');
    const worker = new Worker(fn2String(workerTestNode), {eval: true});
    // tslint:disable-next-line:no-any
    worker.on('message', (msg: any) => {
      const data = msg.data;
      expectArraysClose(data, [4, 4, 4]);
      done();
    });
  });
});
