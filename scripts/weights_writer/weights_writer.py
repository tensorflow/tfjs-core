# Copyright 2018 Google Inc. All Rights Reserved.
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
# ==============================================================================

import numpy as np
import math
import string

FILENAME_CHARS = string.ascii_letters + string.digits + '_'
DTYPE_BYTES = {'float32': 4}


def write_weights(weights_map, writeDir, options={'max_shard_bytes': 4 * 4}): #1024 * 1024 * 4
  manifest_json = []

  for group_name, group in weights_map.iteritems():
    byte_buffers = []
    byte_buffer = ''

    for name, data in group.iteritems():
      if isinstance(data, np.ndarray):
        bytes = data.tobytes()
        total_bytes = len(bytes)

        if len(byte_buffer) + total_bytes > options.max_shard_bytes:


        print 'total bytes', total_bytes

        #chunks = math.ceil(float(total_bytes) /

        chunk_elements_size = options['max_shard_bytes'] / DTYPE_BYTES[data.dtype.name]
        print chunk_elements_size

        num_chunks = int(math.ceil(float(len(data)) / chunk_elements_size))

        for i in range(num_chunks):
          offset = i * chunk_elements_size
          chunk = data[offset : offset + chunk_elements_size]

          print chunk

        #print np.array_split(data, chunks)

groups = {
  'group1': {
    'weight1': np.array([1, 2, 3, 4, 5, 6], 'float32')
  }
}
write_weights(groups, './weights')
