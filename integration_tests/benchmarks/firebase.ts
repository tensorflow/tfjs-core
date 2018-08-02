/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import firebase from 'firebase/app';
import {BenchmarkLog} from './benchmark_log';

// tslint:disable-next-line:no-any
declare let __karma__: any;

import 'firebase/auth';
import 'firebase/database';
import {ApplicationConfig, BenchmarkEntry} from './firebase_types';

// TODO(nsthorat): Support more than Chrome + mac;
const DEVICE = 'chrome_mac';

const karmaFlags = parseKarmaFlags(__karma__.config.args);

const config: ApplicationConfig = {
  apiKey: karmaFlags.apiKey,
  authDomain: 'jstensorflow.firebaseapp.com',
  databaseURL: 'https://tensorflowjs-benchmarks.firebaseio.com',
  projectId: 'jstensorflow',
  storageBucket: 'jstensorflow.appspot.com',
  messagingSenderId: '433613381222'
};

firebase.initializeApp(config);
try {
  firebase.auth();
} catch (e) {
  throw new Error(`Firebase auth failed with error: ${e}`);
}

export async function logBenchmarkRun(
    benchmarkName: string, logs: BenchmarkLog[]): Promise<void> {
  const date = new Date();
  let month = date.getMonth().toString();
  if (month.length === 1) {
    month = '0' + month;
  }
  let day = date.getDay().toString();
  if (day.length === 1) {
    day = '0' + day;
  }
  const humanReadableDate = date.getFullYear() + '-' + month + '-' + day;

  const runs: {[params: string]: BenchmarkEntry} = {};
  logs.forEach(log => {
    runs[log.params] = {averageTimeMs: log.averageTimeMs};
  });

  if (!karmaFlags.travis) {
    console.log(
        'Not inside travis so not querying Firebase. Would have entered: ');
    console.log(runs);
  } else {
    return new Promise<void>(resolve => {
      firebase.database()
          .ref(`${humanReadableDate}/${benchmarkName}/${DEVICE}`)
          // We set the database entry to be an array of one value so in the
          // future we can benchmark multiple devices.
          .set(runs, error => {
            if (error) {
              throw new Error(`Write to firebase failed with error: ${error}`);
            }
            resolve();
          });
    });
  }
}

interface KarmaFlags {
  apiKey: string;
  travis: boolean;
}

function parseKarmaFlags(args: string[]): KarmaFlags {
  let apiKey: string;
  let travis: boolean;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--firebaseKey') {
      apiKey = args[i + 1];
    }
    if (args[i] === '--travis') {
      travis = args[i + 1] === 'true';
    }
  }
  return {apiKey, travis};
}
