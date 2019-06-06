/**
 * @license
 * Copyright 2019 mogoweb@gmail.com. All Rights Reserved.
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
import { ENV } from '../environment';
import { Platform } from './platform';
/// <reference path="./wx.d.ts">
export class PlatformMP implements Platform {
  fetch(path: string, init?: RequestInit): Promise<Response> {
    return fetch(path, init);
  }
}

if (ENV.get('IS_BROWSER')) {
  ENV.setPlatform('browser', new PlatformMP());
}

function generateResponse(res: any) {
  let header = res.header || {};
  return {
    ok: ((res.statusCode / 200) | 0) === 1, // 200-299
    status: res.statusCode,
    statusText: res.errMsg,
    url: '',
    clone: () => {
      return generateResponse(res);
    },
    text: () => Promise.resolve(String.fromCharCode.apply(null, new Uint8Array(res.data))),
    json: () => {
      var json = {};
      try {
        json = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(res.data)));
      }
      catch (err) {
        console.error(err);
      }
      return Promise.resolve(json);
    },
    arrayBuffer: () => Promise.resolve(res.data),
    blob: () => Promise.resolve(res.data),
    headers: {
      keys: () => Object.keys(header),
      entries: () => {
        let all = [];
        for (let key in header) {
          if (header.hasOwnProperty(key)) {
            all.push([key, header[key]]);
          }
        }
        return all;
      },
      get: (n: string) => header[n.toLowerCase()],
      has: (n: string) => n.toLowerCase() in header
    }
  };
}

async function fetch(input: any, init: any): Promise<any> {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: input,
      header: init.headers || {},
      data: init.body || {},
      method: init.method || 'GET',
      dataType: '',
      responseType: 'arraybuffer',
      success: function (res: any) {
        resolve(generateResponse(res))
      },
      fail: function (res: any) {
        reject(generateResponse(res))
      }
    })
  })
}

export {
  fetch,
};
