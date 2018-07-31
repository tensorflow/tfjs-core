/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

import * as karma from 'karma';
import * as path from 'path';
import {BenchmarkLog} from './benchmark_log';

const config = {
  configFile: path.resolve('./karma.conf.js')
};

const server = new karma.Server(config, exitCode => {
  process.exit(exitCode);
});

const results: BenchmarkLog[] = [];
server.on('browser_log', (_, result: string) => {
  // Strip the leading and trailing quotes.
  if (result.startsWith('\'')) {
    result = result.substring(1);
  }
  if (result.endsWith('\'')) {
    result = result.substring(0, result.length - 1);
  }

  let json;
  try {
    json = JSON.parse(result) as BenchmarkLog;
  } catch (e) {
  }

  results.push(json);
});

server.on('run_complete', () => {
  console.log(results);
});

server.start();
