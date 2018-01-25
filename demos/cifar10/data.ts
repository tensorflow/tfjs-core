import * as dl from 'deeplearn';


/**
 * Load all of the Cifar10 data and then return a subset of it.
 *
 * @param limit number of images and labels to return
 */
export async function loadCifarData(limit = 100):
    Promise<{images: dl.NDArray[], labels: dl.NDArray[]}> {
  const datasetConfig: dl.XhrDatasetConfig = {
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
    modelConfigs: null,
  };

  const dataset = new dl.XhrDataset(datasetConfig);

  await dataset.fetchData();
  let [images, labels] = dataset.getData();

  images = images.slice(0, limit);
  labels = labels.slice(0, limit);

  // Resize the images
  images = images.map(
      (i) => dl.ENV.math.resizeBilinear3D(i as dl.Array3D, [24, 24]));

  // const labelled = labels.map((l) => {
  //   const label = ENV.math.argMax(l).get(0);
  //   const labelString = datasetConfig.labelClassNames[label];

  //   return {label, labelString};
  // });

  return {images, labels};
}

/**
 * Convert an array of Array3d's to one Array4D
 * @param images
 */
export function toArray4d(images: dl.Array3D[]): dl.Array4D {
  const asArray4d: dl.Array4D[] = images.map((i) => {
    const newShape = [1, ...i.shape];
    return i.reshape(newShape) as dl.Array4D;
  });

  const all =
      asArray4d.reduce((memo, curr) => dl.ENV.math.concat4D(memo, curr, 0));

  return all;
}

/**
 * Convert an array of Array1d's to one Array2D
 * @param images
 */
export function toArray2d(input: dl.Array1D[]): dl.Array2D {
  const asArray2d: dl.Array2D[] = input.map((i) => {
    const newShape = [1, ...i.shape];
    return i.reshape(newShape) as dl.Array2D;
  });

  const all =
      asArray2d.reduce((memo, curr) => dl.ENV.math.concat2D(memo, curr, 0));

  return all;
}
