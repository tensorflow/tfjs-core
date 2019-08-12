#!/usr/bin/env node
// Copyright 2019 Google LLC. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// =============================================================================

const {exec} = require('./test-util');

const CLONE_PATH = 'clone';

const dirName = process.argv[2];
if (dirName == null || dirName == '') {
  throw new Error(
      'Please specify a top-level directory as the first argument: ' +
      './scripts/cloudbuild.js DIR_NAME');
}

const diffCmd = `diff -rq ${CLONE_PATH}/${dirName}/ ./${dirName}/`;
const diffOutput = exec(diffCmd, {silent: true}, true).stdout.trim();

if (diffOutput !== '') {
  console.log(`${dirName} has modified files.`);
  console.log(diffOutput);
  console.log('Running CI...');
  exec(`gcloud builds submit ${dirName} --config=${dirName}/cloudbuild.yml`);
} else {
  console.log(`No modified files found in ${dirName}`);
}
