import {describeWithFlags} from '../jasmine_util';
import {ALL_ENVS, expectArraysClose} from '../test_util';
import {Complex} from './complex';

describeWithFlags('Complex', ALL_ENVS, () => {
  it('c1 + c2', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(2, 3);

    expect(c1.add(c2)).toEqual(new Complex(3, 5));
  });

  it('c1 - c2', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(2, 3);

    expect(c1.sub(c2)).toEqual(new Complex(-1, -1));
  });

  it('c1 * c2', () => {
    const c1 = new Complex(1, 2);
    const c2 = new Complex(2, 3);

    expect(c1.mul(c2)).toEqual(new Complex(-4, 7));
  });

  it('get complex number from TypedArray', () => {
    const t = new Float32Array(4);
    t[0] = 1;
    t[1] = 2;
    t[2] = 3;
    t[3] = 4;

    expect(Complex.fromTypedArrayWithIndex(t, 0)).toEqual(new Complex(1, 2));
    expect(Complex.fromTypedArrayWithIndex(t, 1)).toEqual(new Complex(3, 4));
  });

  it('assign complex value in TypedArray', () => {
    const t = new Float32Array(4);

    Complex.assign(t, new Complex(1, 2), 0);
    Complex.assign(t, new Complex(3, 4), 1);

    expectArraysClose(t, new Float32Array([1, 2, 3, 4]));
  });
});
