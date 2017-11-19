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

# Download the Caffe Proto definition from github.com/BVLC/caffe and
# compile it into a JavaScript module and a Typescript definition.

set -e

CAFFE_CONTRIB_DIR=models/caffe/proto
CAFFE_PROTO_URL=http://cdn.rawgit.com/BVLC/caffe/master/src/caffe/proto/caffe.proto

# Download the proto definition
wget -qO $CAFFE_CONTRIB_DIR/caffe.proto $CAFFE_PROTO_URL

# Create a JavaScript module
node_modules/.bin/pbjs -t static-module -w commonjs -o $CAFFE_CONTRIB_DIR/caffe.js $CAFFE_CONTRIB_DIR/caffe.proto
node_modules/.bin/pbts -o $CAFFE_CONTRIB_DIR/caffe.d.ts $CAFFE_CONTRIB_DIR/caffe.js