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

module.exports = function(config) {
  const args = [];
  if (config.backend) {
    args.push('--backend', config.backend);
  }
  if (config.grep) {
    args.push('--grep', config.grep);
  }
  if (config.features) {
    args.push('--features', config.features);
  }

  config.set({
    frameworks: ['browserify', 'jasmine'],
    files: [{pattern: 'dist/**/*_test.js'}],
    exclude: ['dist/test_node.js'],
    preprocessors: {'dist/**/*_test.js': ['browserify']},
    browserify: {debug: false},
    reporters: ['progress'],
    browsers: ['Chrome'],
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_KEY
    },
    captureTimeout: 120000,
    reportSlowerThan: 500,
    browserNoActivityTimeout: 180000,
    customLaunchers: {
      bs_chrome_mac: {
        base: 'BrowserStack',
        browser: 'chrome',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'safari',
        browser_version: 'latest',
        os: 'OS X',
        os_version: 'High Sierra'
      },
      bs_ios_11: {
        base: 'BrowserStack',
        device: 'iPhone X',
        os: 'iOS',
        os_version: '11.0',
        real_mobile: true
      },
      chrome_with_swift_shader: {
        base: 'Chrome',
        flags: ['--blacklist-accelerated-compositing', '--blacklist-webgl']
      },
      chrome_debugging:
          {base: 'Chrome', flags: ['--remote-debugging-port=9333']}
    },
    client: {jasmine: {random: false}, args: args}
  });
};
