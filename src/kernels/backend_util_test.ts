import * as tf from '../index';
import {ALL_ENVS} from '../test_util';
import {describeWithFlags} from '../jasmine_util';
import {reshapeTensor} from './backend_util';

describeWithFlags('backendUtil', ALL_ENVS, () => {
  it('reshapeTensor throw error with null shape', () => {
    const t = tf.tensor([1,2,3,4], [1, 4]);
    expect(() => reshapeTensor(t, null))
        .toThrowError('The shape field passed to the tensor ' +
            'constructor is null. Please pass a non-null shape.');
  });
});