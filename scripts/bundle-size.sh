#!/usr/bin/env bash
# Copyright 2019 Google LLC. All Rights Reserved.
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

rimraf dist/
yarn build
yarn rollup -c

BOLD=$(tput bold)
NORMAL=$(tput sgr0)

echo
echo -e "${BOLD}~~Minified bundle size~~${NORMAL}"
# Gzip the minified bundle.
gzip -c dist/tf-core.min.js > dist/tf-core.min.js.gzip
# Show the size of the minified bundle and the post-gzip minified bundle.
ls -lh dist/tf-core.min.js.gzip | awk '{print $5, $9}'
ls -lh dist/tf-core.min.js | awk '{print $5, $9}'
rm dist/tf-core.min.js.gzip

echo
echo -e "${BOLD}~~Unminified bundle size~~${NORMAL}"
# Gzip the bundle.
gzip -c dist/tf-core.js > dist/tf-core.js.gzip
# Show the size of the bundle and the post-gzip bundle.
ls -lh dist/tf-core.js.gzip | awk '{print $5, $9}'
ls -lh dist/tf-core.js | awk '{print $5, $9}'
rm dist/tf-core.js.gzip

echo
echo -e "${BOLD}~~ESM bundle size~~${NORMAL}"
# Gzip the bundle.
gzip -c dist/tf-core.esm.js > dist/tf-core.esm.js.gzip
# Show the size of the bundle and the post-gzip bundle.
ls -lh dist/tf-core.esm.js.gzip | awk '{print $5, $9}'
ls -lh dist/tf-core.esm.js | awk '{print $5, $9}'
rm dist/tf-core.esm.js.gzip
echo
