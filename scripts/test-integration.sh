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

function test () {
  echo '######################'
  echo 'version.ts was modified.'
  echo 'Testing layers/converter/node againts tfjs-core@master.'
  echo '######################'
  yarn build && yarn run yalc publish

  echo 'Cloning layers'
  git clone https://github.com/tensorflow/tfjs-layers.git --depth 5
  cd tfjs-layers
  yarn && yarn link-local '@tensorflow/tfjs-core' && ./scripts/test-travis.sh

  cd ..
  echo 'Cloning node'
  git clone https://github.com/tensorflow/tfjs-node.git --depth 5
  cd tfjs-node
  yarn && yarn link-local '@tensorflow/tfjs-core' && ./scripts/test-travis.sh

  cd ..
  echo 'Cloning converter'
  git clone https://github.com/tensorflow/tfjs-converter.git --depth 5
  cd tfjs-converter
  yarn && yarn link-local '@tensorflow/tfjs-core'
  yarn build && yarn lint && yarn test-travis
}


readarray -t files_changed <<< "$(git diff --name-only $TRAVIS_COMMIT_RANGE)"

for file in "${files_changed[@]}"
do
   if [ "$file" = "src/version.ts" ]; then test; break; fi
done
