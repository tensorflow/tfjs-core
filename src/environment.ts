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

type FlagValue = number|boolean;
export type Flags = {
  [featureName: string]: FlagValue
};
export type FlagRegistryEntry = {
  evaluationFn: () => FlagValue;
  setHook?: (value: FlagValue) => void;
};

export class Environment {
  private flags: Flags = {};
  private flagRegistry: {[flagName: string]: FlagRegistryEntry} = {};

  constructor() {
    this.populateFlagsFromURL();
  }

  registerFlag(
      flagName: string, evaluationFn: () => FlagValue,
      setHook?: (value: FlagValue) => void) {
    this.flagRegistry[flagName] = {evaluationFn};
  }

  get(flagName: string): FlagValue {
    if (flagName in this.flags) {
      return this.flags[flagName];
    }

    this.flags[flagName] = this.evaluateFlag(flagName);

    return this.flags[flagName];
  }

  getFlags(): Flags {
    return this.flags;
  }
  // For backwards compatibility.
  get features(): Flags {
    return this.flags;
  }

  set(flagName: string, value: FlagValue): void {
    if (this.flagRegistry[flagName] == null) {
      throw new Error(
          `Cannot set flag ${flagName} as it has not been registered.`);
    }
    this.flags[flagName] = value;
    if (this.flagRegistry[flagName].setHook != null) {
      this.flagRegistry[flagName].setHook(value);
    }
  }

  private evaluateFlag(flagName: string): FlagValue {
    if (this.flagRegistry[flagName] == null) {
      throw new Error(
          `Cannot evaluate flag '${flagName}': no evaluation function found.`);
    }
    return this.flagRegistry[flagName].evaluationFn();
  }

  setFlags(flags: Flags) {
    this.flags = Object.assign({}, flags);
  }

  reset() {
    this.flags = {};
    this.populateFlagsFromURL();
  }

  // tslint:disable-next-line:no-any
  get global(): any {
    return global;
  }

  private populateFlagsFromURL(): void {
    if (typeof window === 'undefined' ||
        typeof window.location === 'undefined' ||
        typeof window.location.search === 'undefined') {
      return;
    }

    const urlParams = getQueryParams(window.location.search);
    if (TENSORFLOWJS_FLAGS_PREFIX in urlParams) {
      const urlFlags: {[key: string]: string} = {};

      const keyValues = urlParams[TENSORFLOWJS_FLAGS_PREFIX].split(',');
      keyValues.forEach(keyValue => {
        const [key, value] = keyValue.split(':') as [string, string];
        urlFlags[key] = value;
      });

      // for (const flagName in this.flagRegistry) {

      // }

      // URL_PROPERTIES.forEach(urlProperty => {
      //   if (urlProperty.name in urlFlags) {
      //     console.log(
      //         `Setting feature override from URL ${urlProperty.name}: ` +
      //         `${urlFlags[urlProperty.name]}`);
      //     if (urlProperty.type === Type.NUMBER) {
      //       features[urlProperty.name] = +urlFlags[urlProperty.name];
      //     } else if (urlProperty.type === Type.BOOLEAN) {
      //       features[urlProperty.name] = urlFlags[urlProperty.name] ===
      //       'true';
      //     } else if (urlProperty.type === Type.STRING) {
      //       // tslint:disable-next-line:no-any
      //       features[urlProperty.name] = urlFlags[urlProperty.name] as any;
      //     } else {
      //       console.warn(`Unknown URL param: ${urlProperty.name}.`);
      //     }
      //   }
      // });
    }
  }
}

// Expects flags from URL in the format ?tfjsflags=FLAG1:1,FLAG2:true.
const TENSORFLOWJS_FLAGS_PREFIX = 'tfjsflags';

export function getQueryParams(queryString: string): {[key: string]: string} {
  const params = {};
  queryString.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g, (s, ...t) => {
    decodeParam(params, t[0], t[1]);
    return t.join('=');
  });
  return params;
}

function decodeParam(
    params: {[key: string]: string}, name: string, value?: string) {
  params[decodeURIComponent(name)] = decodeURIComponent(value || '');
}

// tslint:disable-next-line:no-any
let global: any;
export let ENV: Environment;
// tslint:disable-next-line:no-any
export function setEnvironmentGlobal(environment: Environment, ns: any) {
  ENV = environment;
  global = ns;
}
