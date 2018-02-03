import * as seedrandom from 'seedrandom';

import {NDArray} from '../../math/ndarray';
import * as util from '../../util';

import {PrefetchStream, ShuffleStream} from './ring_streams';
import {DataStream} from './stream';

// TODO(soergel): clean up the |string union type throughout when NDArray
// supports string.

/**
 * The value associated with a given key for a single element.
 *
 * Such a value may not have a batch dimension.  A value may be a scalar or a
 * 1-D, 2-D, or 3-D array.
 *
 * Arrays of higher rank are not currently supported.  Once these elements are
 * grouped into batches (represented as `BatchArray`), those batches are limited
 * to 4-D (the most that NDArray currently supports).  Thus the individual
 * elements can be at most 3-D.
 */
export type ElementArray = number|number[]|NDArray|string|undefined;
// Valid NDArrays here are Scalar|Array1D|Array2D|Array3D.

/**
 * The value associated with a given key for a batch of elements.
 *
 * Such a value must always have a batch dimension, even if it is of length 1.
 *
 * A batch value may be a 1-D, 2-D, 3-D, or 4-D array.  Arrays of higher rank
 * are not currently supported by the underlying NDArray.
 */
export type BatchArray = NDArray|string[];  // Array1D|Array2D|Array3D|Array4D

/**
 * A map from string keys (aka column names) to values for a single element.
 */
export type DatasetElement = {
  [key: string]: ElementArray
};

/**
 * A map from string keys (aka column names) to values for a batch of elements.
 */
export type DatasetBatch = {
  [key: string]: BatchArray
};

// TODO(soergel): consider vectorized operations within the pipeline.

/**
 * Represents a potentially large set of elements.
 *
 * A `Dataset` can be used to represent an input pipeline as a
 * collection of elements (maps from string keys to values) and a "logical
 * plan" of transformations that act on those elements.
 *
 * A `Dataset` provides a stream of unbatched examples, and its transformations
 * are applied one example at a time.  Batching produces a BatchDataset, and so
 * must come last in the pipeline because there are no batch-enabled
 * transformations.
 */
export abstract class Dataset {
  /*
   * Provide a new stream of elements.  Note this will also start new streams
   * from any underlying `Dataset`s.
   */
  abstract async getStream(): Promise<DataStream<DatasetElement>>;

  /**
   * Create a `Dataset` from an array of elements.
   */
  static ofElements(items: DatasetElement[]): Dataset {
    return new (class ArrayDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        return Promise.resolve(DataStream.ofItems(items));
      }
    })();
  }

  /**
   * Create a `Dataset` by concatenating underlying `Dataset`s.
   *
   * Note that if the underlying `Dataset`s return elements in a
   * nondeterministic order, then this concatenated `Dataset` will do the same.
   */
  static ofConcatenated(datasets: Dataset[]) {
    return new (class OfConcatenatedDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        const streamStream =
            await Promise.all(datasets.map((d) => d.getStream()));
        return DataStream.ofConcatenated(DataStream.ofItems(streamStream));
      }
    })();
  }

  /**
   * Filters this dataset according to `predicate`.
   *
   * @param predicate A function mapping a `DatasetElement` to a boolean or a
   * `Promise` for one.
   *
   * @returns A `Dataset` of elements for which the predicate was true.
   */
  filter(filterer: (value: DatasetElement) => boolean | Promise<boolean>):
      Dataset {
    const base = this;
    return new (class FilterDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        return (await base.getStream()).filter(filterer);
      }
    })();
  }

  /**
   * Maps this dataset through a 1-to-1 transform.
   *
   * @param transform A function mapping a `DatasetElement` to a transformed
   *   `DatasetElement`.
   *
   * @returns A `Dataset` of transformed elements.
   */
  map(transform: (value: DatasetElement) => DatasetElement |
          Promise<DatasetElement>): Dataset {
    const base = this;
    return new (class MapDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        return (await base.getStream()).map(transform);
      }
    })();
  }

  /**
   * Groups elements into batches and arranges their values in columnar form.
   *
   * It is assumed that each of the incoming DatasetElements has the same set of
   * keys.  For each key, the resulting BatchDataset provides a BatchElement
   * collecting all of the incoming values for that key.  Incoming strings are
   * grouped into a string[].  Incoming NDArrays are grouped into a new NDArray
   * where the 0'th axis is the batch dimension.  These columnar representations
   * for each key can be zipped together to reconstruct the original
   * DatasetElements.
   *
   * @param batchSize The number of elements desired per batch.
   * @param smallLastBatch Whether to emit the final batch when it has fewer
   *   than batchSize elements. Default true.
   * @returns A `BatchDataset`, from which a stream of batches can be obtained.
   */
  batch(batchSize: number, smallLastBatch = true): BatchDataset {
    return new BatchDataset(this, batchSize, smallLastBatch);
  }

  /**
   * Concatenates this `Dataset` with another.
   *
   * @param dataset A `Dataset` to be concatenated onto this one.
   * @returns A `Dataset`.
   */
  concatenate(dataset: Dataset): Dataset {
    const base = this;
    return new (class ConcatenateDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        return (await base.getStream()).concatenate(await dataset.getStream());
      }
    })();
  }

  /**
   * Repeats this dataset `count` times.
   *
   * NOTE: If this dataset is a function of global state (e.g. a random number
   * generator), then different repetitions may produce different elements.
   *
   * @param count: (Optional.) An integer, representing the number of times
   *   the dataset should be repeated. The default behavior (if `count` is
   *   `undefined` or negative) is for the dataset be repeated indefinitely.
   * @returns A `Dataset`.
   */
  repeat(count?: number): Dataset {
    const base = this;
    return new (class RepeatDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        const streamStream = DataStream.ofFunction(() => base.getStream());
        return (await DataStream.ofConcatenated(streamStream.take(count)));
      }
    })();
  }

  /**
   * Creates a `Dataset` with at most `count` elements from this dataset.
   *
   * @param count: The number of elements of this dataset that should be taken
   *   to form the new dataset.  If `count` is `undefined` or negative, or if
   *   `count` is greater than the size of this dataset, the new dataset will
   *   contain all elements of this dataset.
   * @returns A `Dataset`.
   */
  take(count: number): Dataset {
    const base = this;
    return new (class TakeDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        return (await base.getStream()).take(count);
      }
    })();
  }

  /**
   * Creates a `Dataset` that skips `count` elements from this dataset.
   *
   * @param count: The number of elements of this dataset that should be skipped
   *   to form the new dataset.  If `count` is greater than the size of this
   *   dataset, the new dataset will contain no elements.  If `count`
   *   is `undefined` or negative, skips the entire dataset.
   *
   * @returns A `Dataset`.
   */
  skip(count: number): Dataset {
    const base = this;
    return new (class SkipDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        return (await base.getStream()).skip(count);
      }
    })();
  }

  /**
   * Randomly shuffles the elements of this dataset.
   *
   * @param bufferSize: An integer specifying the number of elements from this
   *   dataset from which the new dataset will sample.
   * @param seed: (Optional.) An integer specifying the random seed that will
   *   be used to create the distribution.
   * @param reshuffleEachIteration: (Optional.) A boolean, which if true
   *   indicates that the dataset should be pseudorandomly reshuffled each time
   *   it is iterated over. (Defaults to `true`.)
   * @returns A `Dataset`.
   */
  shuffle(bufferSize: number, seed?: string, reshuffleEachIteration = true):
      Dataset {
    const base = this;
    const random = seedrandom(seed);
    return new (class ShuffleDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        let seed2 = random.int32();
        if (reshuffleEachIteration) {
          seed2 += random.int32();
        }
        return new ShuffleStream(
            await base.getStream(), bufferSize, seed2.toString());
      }
    })();
  }

  /**
   *  Creates a `Dataset` that prefetches elements from this Dataset.
   *
   * @param bufferSize: An integer specifying the number of elements to be
   *   prefetched.
   * @returns A `Dataset`.
   */
  prefetch(bufferSize: number): Dataset {
    const base = this;
    return new (class PrefetchDataset extends Dataset {
      async getStream(): Promise<DataStream<DatasetElement>> {
        return new PrefetchStream(await base.getStream(), bufferSize);
      }
    })();
  }

  /* TODO(soergel): for parity with tf.data:
  Dataset.flat_map()
  Dataset.zip()
  Dataset.dense_to_sparse_batch()
  Dataset.group_by_window()
  Dataset.padded_batch()
  */
}

/**
 * Represents a potentially large set of elements, grouped into batches.
 *
 * There are currently no batch-oriented data transformations.  Any desired
 * transformations should be applied to a `Dataset` so that they are
 * computed one example at a time.  The transformed data can then be batched
 * as the final step via `Dataset.batch()`.
 *
 * @param base: An underlying row-oriented `Dataset` to group into batches.
 * @param batchSize: The desired number of examples per batch.
 * @param smallLastBatch: Whether to emit a final batch with fewer than
 *   batchSize elements.  (Default true).
 */
export class BatchDataset {
  constructor(
      protected base: Dataset, protected batchSize: number,
      protected smallLastBatch = true) {}

  /*
   * Provide a new stream of batches.  Note this will also start new streams
   * from any underlying `Dataset`s or 'BatchDataset's.
   */
  async getStream(): Promise<DataStream<DatasetBatch>> {
    const batchesAsArrays = (await this.base.getStream())
                                .batch(this.batchSize, this.smallLastBatch);
    return batchesAsArrays.map(BatchDataset.makeDatasetBatch);
  }

  /**
   * Constructs a DatasetBatch from a list of DatasetElements.
   */
  private static makeDatasetBatch(elements: DatasetElement[]): DatasetBatch {
    const rotated: {[key: string]: (ElementArray[]|string[])} = {};

    // Assume that the first element is representative.
    // We do end up enforcing NDArray shape consistency below, but not
    // cleanly.
    // TODO(soergel) validate against a schema, allow missing keys, etc.
    // etc.
    const firstElement: DatasetElement = elements[0];
    const keys = Object.keys(firstElement);
    keys.forEach(key => {
      rotated[key] = [];
    });

    for (const e of elements) {
      keys.forEach(key => {
        const value = e[key];
        (rotated[key] as ElementArray[]).push(value);
      });
    }

    const result: {[key: string]: (BatchArray|string[])} = {};
    for (const key of keys) {
      // this sanity check should always pass
      if (rotated[key].length !== elements.length) {
        throw new Error(
            `Batching failed to get a '${key}' value for each element.`);
      }
      if (typeof rotated[key][0] === 'string') {
        result[key] = rotated[key] as string[];
      } else {
        result[key] = BatchDataset.batchConcat(
            rotated[key] as Array<number|number[]|NDArray>);
      }
    }
    return result;
  }

  /**
   * Assembles a list of same-shaped numbers, number arrays, or NDArrays
   * into a single new NDArray where axis 0 is the batch dimension.
   */
  private static batchConcat(arrays: Array<number|number[]|NDArray>): NDArray {
    // Should we use GPU-enabled concat ops in deeplearn's math.ts?
    // Probably not; the GPU roundtrip is not worth it for a trivial
    // operation.
    const [elementShape, ] = BatchDataset.shapeAndValues(arrays[0]);
    const batchShape = [arrays.length].concat(elementShape);
    const resultVals = new Float32Array(batchShape.reduce((x, y) => x * y));

    let offset = 0;
    for (const a of arrays) {
      const [aShape, aVals] = BatchDataset.shapeAndValues(a);
      if (!util.arraysEqual(aShape, elementShape)) {
        throw new Error('Elements must have the same shape to be batched');
      }
      resultVals.set(aVals, offset);
      offset += aVals.length;
    }
    const result = NDArray.make(batchShape, {values: resultVals});
    return result;
  }

  private static shapeAndValues(array: number|number[]|NDArray):
      [number[], number[]|Float32Array|Int32Array|Uint8Array] {
    if (array instanceof NDArray) {
      return [array.shape, array.dataSync()];
    } else if (Array.isArray(array)) {
      return [[array.length], array];
    } else {
      return [[], [array]];
    }
  }
}
