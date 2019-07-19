import {HAS_WORKER, HAS_NODE_WORKER, describeWithFlags} from './jasmine_util';
import {expectArraysClose} from './test_util';
import * as tf from './index';

const fn2String = (fn: Function): string => {
  const funcStr = '('+fn.toString()+')()';
  return funcStr;
};

const fn2workerURL = (fn: Function): string => {
  const blob =
      new Blob([fn2String(fn)], {type: 'application/javascript'});
  return URL.createObjectURL(blob);
};

const workerTest = () => {
  //@ts-ignore
  importScripts('http://bs-local.com:12345/base/dist/tf-core.js');
  let a = tf.tensor1d([1, 2, 3]);
  const b = tf.tensor1d([3, 2, 1]);
  a = a.add(b);
  //@ts-ignore
  self.postMessage({data: a.dataSync()});
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


const workerTestNode = () => {
  const tf = require(`${process.cwd()}/dist/tf-core.js`);
  const {parentPort} = require('worker_threads');
  let a = tf.tensor1d([1, 2, 3]);
  const b = tf.tensor1d([3, 2, 1]);
  a = a.add(b);
  //@ts-ignore
  parentPort.postMessage({data: a.dataSync()});
};

describeWithFlags('computation in worker (node env)', HAS_NODE_WORKER, () => {
  it('tensor in worker', (done) => {
    const {Worker} = require('worker_threads');
    const worker = new Worker(fn2String(workerTestNode), {eval: true});
    worker.on('message', (msg: any) => {
      const data = msg.data;
      expectArraysClose(data, [4, 4, 4]);
      done();
    });
  });
});
