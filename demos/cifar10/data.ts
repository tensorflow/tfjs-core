import {Array3D, ENV, NDArray, XhrDataset, XhrDatasetConfig} from 'deeplearn';

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
