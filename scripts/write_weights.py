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
# =============================================================================

import io
import json
import math
import numpy as np
import os
import string

FILENAME_CHARS = string.ascii_letters + string.digits + '_'
DTYPE_BYTES = {'float32': 4, 'int32': 4}

"""Writes weights to a binary format on disk for ingestion by JavaScript.

  Large weights are sharded into chunks, given by shard_size (default 4MB),
  and small weights are packed into 4MB shards.

  Weights are aggregated and sharded by group so end-users can choose to fetch
  individual groups.

  Args:
    weight_groups: An list of groups. Each group is an array of weight entries.
      Each entry is a dict that maps a unique name to a numpy array, for
      example:
      entry = {
        'name': 'weight1',
        'data': np.array([1, 2, 3], 'float32')
      }

      Weights groups would then look like:
      weight_groups = [
        [group_0_entry1, group_0_entry2],
        [group_1_entry1, group_1_entry2],
      ]

      The 'name' must be unique across all groups. The 'data' field must be a
      numpy ndarray.
    write_dir: A directory to write the files to.
    shard_size_bytes: The size of shards in bytes. Defaults to 4MB, which is
      the max file size for caching for most major browsers.
    write_manifest: Whether to write the manifest JSON to disk. Defaults to
      True.
  Returns:
    The weights manifest JSON string.

    An example manifest with 2 groups, 2 weights, and each weight sharded
    into 2:

    The manifest looks like the following:
    [{
      'filepaths': ['group0-000001-of-000002', 'group0-000002-of-000002'],
      'weights': [{
        'name': 'weight1',
        'shape': [1000, 1000],
        'dtype': 'float32'
      }]
    }, {
      'filepaths': ['group1-000001-of-000002', 'group1-000002-of-000002'],
      'weights': [{
        'name': 'weight2',
        'shape': [2000, 2000],
        'dtype': 'float32'
      }]
    }]
"""
def write_weights(
    weight_groups, write_dir, shard_size_bytes = 1024 * 1024 * 4,
    write_manifest=True):
  if not isinstance(weight_groups, list):
    raise Exception('weight_groups must be a list of groups')
  if len(weight_groups) == 0:
    raise Exception('weight_groups must have more than one list element')
  for i in range(len(weight_groups)):
    if not isinstance(weight_groups[i], list):
      raise Exception(
          'weight_groups[' + i + '] must be a list of weight entries')
    for j in range(len(weight_groups[i])):
      if 'name' not in weight_groups[i][j]:
        raise Exception(
            'weight_groups[' + i + '][' + j + '] has no string field \'name\'')
      if 'data' not in weight_groups[i][j]:
        raise Exception(
            'weight_groups[' + i + '][' + j + '] has no numpy ' + \
            'array field \'data\'')
      if not isinstance(weight_groups[i][j]['data'], np.ndarray):
        raise Exception(
            'weight_groups[' + i + '][' + j + '][\'data\'] is not a numpy ' + \
            'array')

  weight_names = {}
  manifest = []

  for group_index, group in enumerate(weight_groups):
    # Stack all of the bytes for the group into a flat byte array before
    # sharding.
    group_bytes = io.BytesIO()
    group_bytes_writer = io.BufferedWriter(group_bytes)
    total_bytes = 0

    weights_entries = []
    for entry in group:
      data = entry['data']
      name = entry['name']
      if isinstance(data, np.ndarray):
        if not data.dtype.name in DTYPE_BYTES:
          raise Exception('Error dumping weight ' + name + ' dtype ' +
              data.dtype.name + ' from not supported.')

        bytes = data.tobytes()
        group_bytes_writer.write(bytes)
        total_bytes += len(bytes)

        if name in weight_names:
          raise Exception(
              'Error dumping weights, duplicate weight name ' + name)
        weight_names[name] = True

        var_manifest = {
          'name': name,
          'shape': [d for d in data.shape],
          'dtype': data.dtype.name
        }
        weights_entries.append(var_manifest)

    group_bytes_writer.flush()
    group_bytes.seek(0)

    # Shard the bytes for the group.
    if shard_size_bytes is None:
      shard_size_bytes = total_bytes

    num_shards = int(math.ceil(float(total_bytes) / shard_size_bytes))

    filenames = []
    total_shards_display = '{:0>6d}'.format(num_shards)
    for i in range(num_shards):
      offset = i * shard_size_bytes
      shard = group_bytes.read(shard_size_bytes)

      shard_idx = '{:0>6d}'.format(i + 1)
      filename ='group' + str(group_index) + '-' + shard_idx + '-of-' + \
          total_shards_display
      filenames.append(filename)
      filepath = os.path.join(write_dir, filename)
      # Write the shard to disk.
      with open(filepath, 'wb') as f:
        f.write(shard)

    manifest_entry = {
      'filepaths': filenames,
      'weights': weights_entries
    }
    manifest.append(manifest_entry)

  manifest_json = json.dumps(manifest)

  if write_manifest:
    manifest_path = os.path.join(write_dir, 'weights_manifest.json')
    with open(manifest_path, 'wb') as f:
      f.write(manifest_json.encode())

  return manifest_json
