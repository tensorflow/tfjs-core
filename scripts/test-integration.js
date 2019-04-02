#!/usr/bin/env node
// Copyright 2018 Google LLC. All Rights Reserved.
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

const shell = require('shelljs');
console.log(shell.env['BRANCH_NAME']);
console.log(shell.env['COMMIT_SHA']);

shell.exec(
    `git clone --branch=${shell.env['BRANCH_NAME']} ` +
    `https://github.com/tensorflow/tfjs-core.git`);
shell.cd('tfjs-core');
const res = shell.exec(
    `git diff --name-only ${shell.env['COMMIT_SHA']}..origin/master`);
const files = res.stdout.trim().split('\n');
files.forEach(file => {
  if (file === 'src/version.ts') {
    shell.cd('..');
    shell.exec('./scripts/test-integration.sh');
  }
});
