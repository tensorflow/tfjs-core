import {NDArray} from '../math/ndarray';

export abstract class Sensor {
  constructor() {}

  abstract getArray(): NDArray;
}
