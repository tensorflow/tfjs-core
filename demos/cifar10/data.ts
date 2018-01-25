import {Array3D, ENV, NDArray, XhrDataset, XhrDatasetConfig} from 'deeplearn';
import {Array4D} from 'deeplearn/dist/math/ndarray';

interface Label {
  label: number;
  labelString: string;
}

/**
 * Load all of the Cifar10 data and then return a subset of it.
 *
 * @param limit number of images and labels to return
 */
export function loadCifarData(limit = 100):
    Promise<{images: NDArray[], labelled: Label[]}> {
  const datasetConfig: XhrDatasetConfig = {
    'data': [
      {
        'name': 'images',
        'path':
            // tslint:disable-next-line:max-line-length
            'https://storage.googleapis.com/learnjs-data/model-builder/cifar10_images.png',
        'dataType': 'png',
        'shape': [32, 32, 3]
      },
      {
        'name': 'labels',
        'path':
            // tslint:disable-next-line:max-line-length
            'https://storage.googleapis.com/learnjs-data/model-builder/cifar10_labels_uint8',
        'dataType': 'uint8',
        'shape': [10]
      }
    ],
    'labelClassNames': [
      'airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse',
      'ship', 'truck'
    ],
    modelConfigs: undefined,
  };

  const dataset = new XhrDataset(datasetConfig);

  return dataset.fetchData().then(() => {
    let [images, labels] = dataset.getData();

    images = images.slice(0, limit);
    labels = labels.slice(0, limit);

    // Resize the images
    images = images.map((i) => {
      return ENV.math.resizeBilinear3D(i as Array3D, [24, 24]);
    });

    const labelled = labels.map((l) => {
      const label = ENV.math.argMax(l).get(0);
      const labelString = datasetConfig.labelClassNames[label];
      return {
        label,
        labelString,
      };
    });

    return {
      images,
      labelled,
    };
  });
}

/**
 * Convert an array of Array3d's to one Array4D
 * @param images
 */
export function toArray4d(images: Array3D[]): Array4D {
  console.log('toArray4d:start');
  const asArray4d: Array4D[] = images.map((i) => {
    const newShape = [1, ...i.shape];
    return i.reshape(newShape) as Array4D;
  });

  const all = asArray4d.reduce((memo, curr) => {
    return ENV.math.concat4D(memo, curr, 0);
  });

  console.log('toArray4d:out', all.shape);
  return all;
}
