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

import * as device_util from './device_util';
import * as webgl_util from './math/webgl/webgl_util';

export enum Feature {
  DISJOINT_QUERY_TIMER = 'DISJOINT_QUERY_TIMER',
  // 0 when WebGL is not enabled, 1 or 2 for WebGL version when available.
  WEBGL_VERSION = 'WEBGL_VERSION'
}


function getFeatureEvaluators(): {[feature: string]: () => FeatureValue} {
  const featureEvaluators: {[feature: string]: () => FeatureValue} = {};

  featureEvaluators[Feature.DISJOINT_QUERY_TIMER] = () => {
    return !device_util.isMobile();
  };

  featureEvaluators[Feature.WEBGL_VERSION] = () => {
    if (webgl_util.isWebGL2Enabled()) {
      return 2;
    } else if (webgl_util.isWebGL1Enabled()) {
      return 1;
    }
    return 0;
  };

  return featureEvaluators;
}

export type FeatureValue = boolean|string|number;
export type FeatureValueMap = {
  [feature: string]: FeatureValue
};

export class Environment {
  private featureEvaluators: {[feature: string]: () => FeatureValue} =
      getFeatureEvaluators();
  private features: FeatureValueMap = {};

  constructor(features?: FeatureValueMap) {
    if (features != null) {
      this.features = features;
    }
  }

  get(feature: Feature): FeatureValue {
    if (feature in this.features) {
      return this.features[feature];
    }

    if (!(feature in this.featureEvaluators)) {
      throw new Error(`Unknown feature ${feature}.`);
    }

    this.features[feature] = this.featureEvaluators[feature]();

    return this.features[feature];
  }

  getNumber(feature: Feature): number {
    const numberValue = this.get(feature);
    if (typeof numberValue !== 'number') {
      throw new Error(`${feature} is not of type 'number'.`);
    }
    return numberValue as number;
  }

  getString(feature: Feature): string {
    const numberValue = this.get(feature);
    if (typeof numberValue !== 'string') {
      throw new Error(`${feature} is not of type 'string'.`);
    }
    return numberValue as string;
  }

  enabled(feature: Feature): boolean {
    const numberValue = this.get(feature);
    if (typeof numberValue !== 'boolean') {
      throw new Error(`${feature} is not of type 'boolean'.`);
    }
    return numberValue as boolean;
  }

  getFeatureValues(): FeatureValueMap {
    return this.features;
  }
}

export let ENV = new Environment();

export function setEnvironment(environment: Environment) {
  ENV = environment;
}
