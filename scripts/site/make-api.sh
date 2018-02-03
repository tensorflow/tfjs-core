#!/usr/bin/env bash
# Copyright 2017 Google Inc. All Rights Reserved.
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

# TODO(nsthorat): Remove "new".
OUT_PATH="/tmp/deeplearn-new-website/api"
node_modules/.bin/mkdirp $OUT_PATH

./node_modules/.bin/tsc ./scripts/site/make-api.ts --target es6 --module commonjs
node ./scripts/site/make-api.js --htmlOutPath "$OUT_PATH/index.html"
