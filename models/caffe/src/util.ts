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
import {caffe} from 'caffe-proto';
import * as prototxtParser from 'prototxt-parser';

export function isNotNull(val: any): boolean {
  return val !== undefined && val !== null;
}

export function fetchText(uri: string) : Promise<string> {
  return fetch(new Request(uri)).then((res) => res.text());
}

export function fetchArrayBuffer(uri: string) : Promise<ArrayBuffer> {
  return fetch(new Request(uri)).then((res) => res.arrayBuffer());
}

export function parseBlob(data: ArrayBuffer) {
  return caffe.BlobProto.decode(new Uint8Array(data));
}

export function parseCaffemodel(data: ArrayBuffer) {
  return caffe.NetParameter.decode(new Uint8Array(data));
}

export function parsePrototxt(data: string) {
  const params = snakeToCamel(prototxtParser.parse(data));
  return caffe.NetParameter.create(params);
}

// camelize string
const camelize = (str: string) => {
  const c = (m: string, i: number) => i === 0 ? m : m.charAt(0).toUpperCase() + m.slice(1);
  return str.split('_').map(c).join("");
}

// convert object with snake case properties to camel case
function snakeToCamel(obj: any): any {
  // Check if obj is an array
  if (Array.isArray(obj)) {
    return obj.map(snakeToCamel);
  }
  // check if obj is an object
  else if (obj === Object(obj)) {
    for (var key in obj) {
      // skip loop if the property is from prototype
      if (!obj.hasOwnProperty(key)) continue;
      let newKey = camelize(key);
      obj[newKey] = snakeToCamel(obj[key]);
      if (newKey != key) {
        delete obj[key];
      }
    }
  }
  return obj;
}
