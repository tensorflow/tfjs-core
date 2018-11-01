#!/usr/bin/env bash
# Copyright 2018 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# =============================================================================

set -e


function test () {
  # Simulates a cron job, which uses tfjs-core@master.
  export TRAVIS_EVENT_TYPE=cron

  echo 'Cloning layers'
  git clone https://github.com/tensorflow/tfjs-layers.git --depth 5
  cd tfjs-layers && yarn && ./scripts/test-travis.sh

  cd ..
  echo 'Cloning node'
  git clone https://github.com/tensorflow/tfjs-node.git --depth 5
  cd tfjs-node && yarn && ./scripts/test-travis.sh
}


readarray -t files_changed <<<"$(git diff --name-only HEAD HEAD~1)"

for file in "${files_changed[@]}"
do
   if [ "$file" = "src/version.ts" ]; then test; break; fi
done
