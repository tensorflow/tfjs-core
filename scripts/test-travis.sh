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

if [[ $(node -v) = *v10* ]]; then
  yarn test-travis --browsers='bs_firefox_mac' &

  yarn test-travis --browsers='bs_chrome_mac' &

  yarn test-travis --browsers='bs_safari_mac' \
      --features '{}' --backend webgl &

  yarn test-travis --browsers='bs_safari_mac' \
      --features '{"HAS_WEBGL": false}' --backend cpu &

  yarn test-travis --browsers='bs_ios_11' \
      --features '{}' --backend webgl &

  yarn test-travis --browsers='bs_ios_11' \
      --features '{"HAS_WEBGL": false}' --backend cpu
fi
