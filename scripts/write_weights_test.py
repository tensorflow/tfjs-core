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

import json
import numpy as np
import os
import unittest
import shutil

from write_weights import write_weights

TMP_DIR = '/tmp/write_weights_test/'

class TestWriteWeights(unittest.TestCase):
  def setUp(self):
    if not os.path.exists(TMP_DIR):
      os.makedirs(TMP_DIR)

  def tearDown(self):
    if os.path.exists(TMP_DIR):
      shutil.rmtree(TMP_DIR)

  def test_1_group_1_weight(self):
    groups = [
      [{
        'name': 'weight1',
        'data': np.array([1, 2, 3], 'float32')
      }]
    ]

    manifest_json = write_weights(groups, TMP_DIR, shard_size = 4 * 4)
    manifest = json.loads(manifest_json)

    self.assertTrue(
        os.path.isfile(os.path.join(TMP_DIR, 'weights_manifest.json')),
        'weights_manifest.json does not exist')

    self.assertEquals(
      manifest,
      [{
        'filepaths': ['group0-000001-of-000001'],
        'weights': [{
          'name': 'weight1',
          'shape': [3],
          'dtype': 'float32'
        }]
      }])

    weights_path = os.path.join(TMP_DIR, 'group0-000001-of-000001')
    weight1 = np.fromfile(weights_path, 'float32')
    np.testing.assert_array_equal(weight1, np.array([1, 2, 3], 'float32'))

  def test_1_group_1_weight_sharded(self):
    groups = [
      [{
        'name': 'weight1',
        'data': np.array([1, 2, 3], 'float32')
      }]
    ]
    # Shard size is smaller than the size of the array so it gets split between
    # multiple files.
    manifest_json = write_weights(groups, TMP_DIR, shard_size = 2 * 4)
    manifest = json.loads(manifest_json)

    self.assertTrue(
        os.path.isfile(os.path.join(TMP_DIR, 'weights_manifest.json')),
        'weights_manifest.json does not exist')

    self.assertEquals(
      manifest,
      [{
        'filepaths': ['group0-000001-of-000002', 'group0-000002-of-000002'],
        'weights': [{
          'name': 'weight1',
          'shape': [3],
          'dtype': 'float32'
        }]
      }])

    shard_1_path = os.path.join(TMP_DIR, 'group0-000001-of-000002')
    shard_1 = np.fromfile(shard_1_path, 'float32')
    np.testing.assert_array_equal(shard_1, np.array([1, 2], 'float32'))

    shard_2_path = os.path.join(TMP_DIR, 'group0-000002-of-000002')
    shard_2 = np.fromfile(shard_2_path, 'float32')
    np.testing.assert_array_equal(shard_2, np.array([3], 'float32'))

  def test_1_group_2_weights_packed(self):
    groups = [
      [{
        'name': 'weight1',
        'data': np.array([1, 2, 3], 'float32')
      }, {
        'name': 'weight2',
        'data': np.array([4, 5], 'float32')
      }]
    ]

    # Shard size is larger than the sum of the two weights so they get packed.
    manifest_json = write_weights(groups, TMP_DIR, shard_size = 8 * 4)
    manifest = json.loads(manifest_json)

    self.assertTrue(
        os.path.isfile(os.path.join(TMP_DIR, 'weights_manifest.json')),
        'weights_manifest.json does not exist')
    self.assertEquals(
      manifest,
      [{
        'filepaths': ['group0-000001-of-000001'],
        'weights': [{
          'name': 'weight1',
          'shape': [3],
          'dtype': 'float32'
        }, {
          'name': 'weight2',
          'shape': [2],
          'dtype': 'float32'
        }]
      }])

    weights_path = os.path.join(TMP_DIR, 'group0-000001-of-000001')
    weights = np.fromfile(weights_path, 'float32')
    np.testing.assert_array_equal(weights, np.array([1, 2, 3, 4, 5], 'float32'))

  def test_1_group_2_packed_sharded_multi_dtype(self):
    groups = [
      [{
        'name': 'weight1',
        'data': np.array([1, 2, 3], 'int32')
      }, {
        'name': 'weight2',
        'data': np.array([4.1, 5.1], 'float32')
      }]
    ]

    # Shard size is smaller than the sum of the weights so they get packed and
    # then sharded. The two buffers will get sharded into 3 files, with shapes
    # [2], [2], and [1]. The second shard is a mixed dtype.
    manifest_json = write_weights(groups, TMP_DIR, shard_size = 2 * 4)
    manifest = json.loads(manifest_json)

    self.assertTrue(
        os.path.isfile(os.path.join(TMP_DIR, 'weights_manifest.json')),
        'weights_manifest.json does not exist')
    self.assertEquals(
      manifest,
      [{
        'filepaths': [
            'group0-000001-of-000003',
            'group0-000002-of-000003',
            'group0-000003-of-000003'
        ],
        'weights': [{
          'name': 'weight1',
          'shape': [3],
          'dtype': 'int32'
        }, {
          'name': 'weight2',
          'shape': [2],
          'dtype': 'float32'
        }]
      }])

    shard_1_path = os.path.join(TMP_DIR, 'group0-000001-of-000003')
    shard_1 = np.fromfile(shard_1_path, 'int32')
    np.testing.assert_array_equal(shard_1, np.array([1, 2], 'int32'))

    # Shard 2 has a mixed dtype so we parse the bytes directly.
    shard_2_path = os.path.join(TMP_DIR, 'group0-000002-of-000003')
    with open(shard_2_path, 'r') as f:
      shard_2_bytes = f.read()
    shard_2_int = np.frombuffer(shard_2_bytes[:4], 'int32')
    np.testing.assert_array_equal(shard_2_int, np.array([3], 'int32'))
    shard_2_float = np.frombuffer(shard_2_bytes[4:], 'float32')
    np.testing.assert_array_equal(shard_2_float, np.array([4.1], 'float32'))

    shard_3_path = os.path.join(TMP_DIR, 'group0-000003-of-000003')
    shard_3 = np.fromfile(shard_3_path, 'float32')
    np.testing.assert_array_equal(shard_3, np.array([5.1], 'float32'))

  def test_2_groups_4_weights_sharded_packed(self):
    groups = [
      # Group 1
      [{
        'name': 'weight1',
        'data': np.array([1, 2, 3], 'float32')
      }, {
        'name': 'weight2',
        'data': np.array([[4, 5], [6, 7]], 'float32')
      }],
      # Group 2
      [{
        'name': 'weight3',
        'data': np.array([1, 2, 3, 4], 'int32')
      }, {
        'name': 'weight4',
        'data': np.array([[1.1, 1.2], [1.3, 1.4], [1.5, 1.6]], 'float32')
      }]
    ]

    manifest_json = write_weights(groups, TMP_DIR, shard_size = 4 * 4)
    manifest = json.loads(manifest_json)

    self.assertTrue(
        os.path.isfile(os.path.join(TMP_DIR, 'weights_manifest.json')),
        'weights_manifest.json does not exist')
    self.assertEquals(
      manifest,
      [{
        'filepaths': ['group0-000001-of-000002', 'group0-000002-of-000002'],
        'weights': [{
          'name': 'weight1',
          'shape': [3],
          'dtype': 'float32'
        }, {
          'name': 'weight2',
          'shape': [2, 2],
          'dtype': 'float32'
        }]
      }, {
        'filepaths': [
          'group1-000001-of-000003',
          'group1-000002-of-000003',
          'group1-000003-of-000003'
        ],
        'weights': [{
          'name': 'weight3',
          'shape': [4],
          'dtype': 'int32'
        }, {
          'name': 'weight4',
          'shape': [3, 2],
          'dtype': 'float32'
        }]
      }])

    group0_shard_1_path = os.path.join(TMP_DIR, 'group0-000001-of-000002')
    group0_shard_1 = np.fromfile(group0_shard_1_path, 'float32')
    np.testing.assert_array_equal(group0_shard_1, np.array([1, 2, 3, 4], 'float32'))

    group0_shard_2_path = os.path.join(TMP_DIR, 'group0-000002-of-000002')
    group0_shard_2 = np.fromfile(group0_shard_2_path, 'float32')
    np.testing.assert_array_equal(group0_shard_2, np.array([5, 6, 7], 'float32'))

    group1_shard_1_path = os.path.join(TMP_DIR, 'group1-000001-of-000003')
    group1_shard_1 = np.fromfile(group1_shard_1_path, 'int32')
    np.testing.assert_array_equal(group1_shard_1, np.array([1, 2, 3, 4], 'int32'))

    group2_shard_2_path = os.path.join(TMP_DIR, 'group1-000002-of-000003')
    group2_shard_2 = np.fromfile(group2_shard_2_path, 'float32')
    np.testing.assert_array_equal(group2_shard_2, np.array([1.1, 1.2, 1.3, 1.4], 'float32'))

    group2_shard_3_path = os.path.join(TMP_DIR, 'group1-000003-of-000003')
    group2_shard_3 = np.fromfile(group2_shard_3_path, 'float32')
    np.testing.assert_array_equal(group2_shard_3, np.array([1.5, 1.6], 'float32'))

  def test_no_write_manfest(self):
    groups = [
      [{
        'name': 'weight1',
        'data': np.array([1, 2, 3], 'float32')
      }]
    ]

    manifest_json = write_weights(groups, TMP_DIR, write_manifest=False)
    manifest = json.loads(manifest_json)

    self.assertFalse(
        os.path.isfile(os.path.join(TMP_DIR, 'weights_manifest.json')),
        'weights_manifest.json exists, but expected not to exist')
    self.assertEquals(
      manifest,
      [{
        'filepaths': ['group0-000001-of-000001'],
        'weights': [{
          'name': 'weight1',
          'shape': [3],
          'dtype': 'float32'
        }]
      }])

    weights_path = os.path.join(TMP_DIR, 'group0-000001-of-000001')
    weight1 = np.fromfile(weights_path, 'float32')
    np.testing.assert_array_equal(weight1, np.array([1, 2, 3], 'float32'))

  def test_no_weights_groups_throws(self):
    groups = None
    with self.assertRaises(Exception):
      write_weights(groups, TMP_DIR)

  def test_empty_groups_throws(self):
    groups = []
    with self.assertRaises(Exception):
      write_weights(groups, TMP_DIR)

  def test_non_grouped_weights_throws(self):
    groups = [{
      'name': 'weight1',
      'data': np.array([1, 2, 3], 'float32')
    }]

    with self.assertRaises(Exception):
      write_weights(groups, TMP_DIR)

  def test_bad_weights_entry_throws_no_name(self):
    groups = [
      [{
        'noname': 'weight1',
        'data': np.array([1, 2, 3], 'float32')
      }]
    ]

    with self.assertRaises(Exception):
      write_weights(groups, TMP_DIR)

  def test_bad_weights_entry_throws_no_data(self):
    groups = [
      [{
        'name': 'weight1',
        'nodata': np.array([1, 2, 3], 'float32')
      }]
    ]

    with self.assertRaises(Exception):
      write_weights(groups, TMP_DIR)

  def test_bad_numpy_array_dtype_throws(self):
    groups = [
      [{
        'name': 'weight1',
        'data': np.array([1, 2, 3], 'float64')
      }]
    ]

    with self.assertRaises(Exception):
      write_weights(groups, TMP_DIR)

  def test_duplicate_weight_name_throws(self):
    groups = [
      [{
        'name': 'duplicate',
        'data': np.array([1, 2, 3], 'float32')
      }], [{
        'name': 'duplicate',
        'data': np.array([4, 5, 6], 'float32')
      }]
    ]

    with self.assertRaises(Exception):
      write_weights(groups, TMP_DIR)

if __name__ == '__main__':
    unittest.main()
