/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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

const cp = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const rimraf = require('rimraf');
const tar = require('tar');
const util = require('util');
const os = require('os');
const url = require('url');
const HttpsProxyAgent = require('https-proxy-agent');
const ProgressBar = require('progress');

const mkdir = util.promisify(fs.mkdir);
const exists = util.promisify(fs.exists);

// Determine which tarball to download based on the OS platform and arch:
const platform = os.platform().toLowerCase();
const platformArch = `${platform}-${os.arch().toLowerCase()}`;
let ANGLE_BINARY_URI = 'https://storage.googleapis.com/angle-builds/';
if (platform === 'darwin') {
  // TODO(add debug flag?)
  ANGLE_BINARY_URI += `angle-3729-${platformArch}.tar.gz`;
} else if (platform === 'linux') {
  // TODO(add debug flag?)
  ANGLE_BINARY_URI += `angle-3729-${platformArch}.tar.gz`;
} else {
  throw new Error(`The platform ${platformArch} is not currently supported!`);
}

// Dependency storage paths:
const depsPath = path.join(__dirname, '..', 'deps');

//
// Ensures that a directory exists at a given path.
//
async function ensureDir(dirPath) {
  if (!await exists(dirPath)) {
    await mkdir(dirPath);
  }
}

//
// Downloads the ANGLE tarball set at `ANGLE_BINARY_URI` with an optional
// callback when downloading and extracting has finished.
//
async function downloadAngleLibs(callback) {
  console.error('* Downloading ANGLE');
  await ensureDir(depsPath);

  // If HTTPS_PROXY, https_proxy, HTTP_PROXY, or http_proxy is set
  const proxy = process.env['HTTPS_PROXY'] || process.env['https_proxy'] ||
      process.env['HTTP_PROXY'] || process.env['http_proxy'] || '';

  // Using object destructuring to construct the options object for the
  // http request.  the '...url.parse(ANGLE_BINARY_URI)' part fills in the host,
  // path, protocol, etc from the ANGLE_BINARY_URI and then we set the agent to
  // the default agent which is overridden a few lines down if there is a proxy
  const options = {...url.parse(ANGLE_BINARY_URI), agent: https.globalAgent};

  if (proxy !== '') {
    options.agent = new HttpsProxyAgent(proxy);
  }

  const request = https.get(options, response => {
    const bar = new ProgressBar('[:bar] :rate/bps :percent :etas', {
      complete: '=',
      incomplete: ' ',
      width: 30,
      total: parseInt(response.headers['content-length'], 10)
    });

    if (platform === 'win32') {
      //
      // TODO(kreeger): write me.
      //
    } else {
      // All other platforms use a tarball:
      response
          .on('data',
              (chunk) => {
                bar.tick(chunk.length);
              })
          .pipe(tar.x({C: depsPath, strict: true}))
          .on('close', () => {
            if (callback !== undefined) {
              callback();
            }
          });
    }
  });

  request.end();
}

//
// Wraps and executes a node-gyp rebuild command.
//
async function buildBindings() {
  console.error('* Building ANGLE bindings')
  cp.execSync('node-gyp rebuild', (err) => {
    if (err) {
      throw new Error('node-gyp failed with: ' + err);
    }
  });
}

//
// Main execution function for this script.
//
async function run() {
  await downloadAngleLibs(buildBindings);
}

run();
