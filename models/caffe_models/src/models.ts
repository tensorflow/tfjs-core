/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import {CaffeModel} from 'deeplearn-caffe'; 
import {IMAGENET_CLASSES} from './imagenet_classes';

const GITHUB_CDN = 'https://rawgit.com/';
const GITHUB_GIST = 'https://gist.githubusercontent.com/';

// copy the models to this directory
const MODEL_DIR = 'models/'


export class GoogLeNet extends CaffeModel {

  // download model from 
  // http://dl.caffe.berkeleyvision.org
  static caffemodel = 'bvlc_googlenet.caffemodel';
  static prototxt = 'BVLC/caffe/master/models/bvlc_googlenet/deploy.prototxt';

  // Target labels
  static labels = IMAGENET_CLASSES;

  constructor() {
    super(MODEL_DIR + GoogLeNet.caffemodel, GITHUB_CDN + GoogLeNet.prototxt);
  }
}


export class GoogLeNetBN extends CaffeModel {

  // download model from 
  // https://github.com/lim0606/caffe-googlenet-bn/blob/master/snapshots
  static caffemodel = 'googlenet_bn_stepsize_6400_iter_1200000.caffemodel';
  static prototxt = 'lim0606/caffe-googlenet-bn/master/deploy.prototxt';

  // Target labels
  static labels = IMAGENET_CLASSES;

  constructor() {
    super(MODEL_DIR + GoogLeNetBN.caffemodel, GITHUB_CDN + GoogLeNetBN.prototxt);
  }
}


export class SqueezeNet extends CaffeModel {

  // model served entirely from github.com
  static caffemodel = 'DeepScale/SqueezeNet/master/SqueezeNet_v1.1/squeezenet_v1.1.caffemodel';
  static prototxt = 'DeepScale/SqueezeNet/master/SqueezeNet_v1.1/deploy.prototxt';

  // Target labels
  static labels = IMAGENET_CLASSES;

  constructor() {
    super(GITHUB_CDN + SqueezeNet.caffemodel, GITHUB_CDN + SqueezeNet.prototxt);
  }
}


export class VGG16 extends CaffeModel {

  // download model from 
  // https://gist.github.com/ksimonyan/211839e770f7b538e2d8
  static caffemodel = 'VGG_ILSVRC_16_layers.caffemodel'; 
  static prototxt = 'ksimonyan/211839e770f7b538e2d8/raw/ded9363bd93ec0c770134f4e387d8aaaaa2407ce/VGG_ILSVRC_16_layers_deploy.prototxt';

  // Target labels
  static labels = IMAGENET_CLASSES;

  constructor() {
    super(MODEL_DIR + VGG16.caffemodel, GITHUB_GIST + VGG16.prototxt);
  }
}


export class NiN extends CaffeModel {

  // download model from 
  // https://gist.github.com/mavenlin/d802a5849de39225bcc6
  static caffemodel = 'nin_imagenet.caffemodel'; 
  static prototxt = 'tzutalin/0e3fd793a5b13dd7f647/raw/207d710d2e089423eda4b0b76ca4b139b7a461f7/deploy.prototxt';

  constructor() {
    super(MODEL_DIR + NiN.caffemodel, GITHUB_GIST + NiN.prototxt);
  }
}


export class AgeNet extends CaffeModel {

  // download model from 
  // https://gist.github.com/GilLevi/c9e99062283c719c03de
  static caffemodel = 'age_net.caffemodel'; 
  static prototxt = 'GilLevi/c9e99062283c719c03de/raw/ddd9cf649c323041ee6e4731ff45636a09261597/deploy_age.prototxt';
  static meanfile = 'GilLevi/AgeGenderDeepLearning/master/models/mean.binaryproto';

  // Target labels
  static labels = ['(0, 2)','(4, 6)','(8, 12)','(15, 20)','(25, 32)','(38, 43)','(48, 53)','(60, 100)'];

  constructor() {
    super(MODEL_DIR + AgeNet.caffemodel, GITHUB_GIST + AgeNet.prototxt, GITHUB_CDN + AgeNet.meanfile);
  }
}


export class GenderNet extends CaffeModel {

  // download model from 
  // https://gist.github.com/GilLevi/c9e99062283c719c03de
  static caffemodel = 'gender_net.caffemodel'; 
  static prototxt = 'GilLevi/c9e99062283c719c03de/raw/ddd9cf649c323041ee6e4731ff45636a09261597/deploy_gender.prototxt';
  static meanfile = 'GilLevi/AgeGenderDeepLearning/master/models/mean.binaryproto';

  // Target labels
  static labels = ['Male','Female'];

  constructor() {
    super(MODEL_DIR + GenderNet.caffemodel, GITHUB_GIST + GenderNet.prototxt, GITHUB_CDN + GenderNet.meanfile);
  }
}