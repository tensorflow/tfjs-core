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
# ==============================================================================
"""A script to dump pytorch checkpoint variables to deeplearnjs.

This script takes a checkpoint file and writes all of the variables in the
checkpoint to a directory.
"""
import argparse
import torch

import os
import re
import json
import string

import numpy as np

FLAGS = None
FILENAME_CHARS = string.ascii_letters + string.digits + '_'


def _var_name_to_filename(var_name):
  chars = []
  for c in var_name:
    if c in FILENAME_CHARS:
      chars.append(c)
    elif c == '.':
      chars.append('_')
  return ''.join(chars)


def main():
  checkpoint_file_path = os.path.expanduser(FLAGS.checkpoint_file)
  output_dir = os.path.expanduser(FLAGS.output_dir)

  state_dict = torch.load(checkpoint_file_path)

  if not os.path.exists(output_dir):
    os.makedirs(output_dir)

  manifest = {}
  remove_vars_compiled_re = re.compile(FLAGS.remove_variables_regex)

  for name in state_dict:
    if (FLAGS.remove_variables_regex and re.match(remove_vars_compiled_re, name)):
      print('Ignoring ' + name)
      continue

    var_filename = _var_name_to_filename(name)
    var_shape = map(int, list(state_dict[name].size()))
    var_weights = state_dict[name].numpy()

    manifest[name] = {'filename': var_filename, 'shape': var_shape}

    print('Writing variable ' + name + '...')

    with open(os.path.join(output_dir, var_filename), 'wb') as f:
      f.write(var_weights.tobytes())

  manifest_fpath = os.path.join(output_dir, 'manifest.json')

  print('Writing manifest to ' + manifest_fpath)
  with open(manifest_fpath, 'w') as f:
    f.write(json.dumps(manifest, indent=2, sort_keys=True))

  print('Done!')


if __name__ == '__main__':
  parser = argparse.ArgumentParser()
  parser.add_argument(
      '--checkpoint_file',
      type=str,
      required=True,
      help='Path to the model checkpoint')
  parser.add_argument(
      '--output_dir',
      type=str,
      required=True,
      help='The output directory where to store the converted weights')
  parser.add_argument(
      '--remove_variables_regex',
      type=str,
      default='',
      help='A regular expression to match against variable names that should '
      'not be included')
  FLAGS, unparsed = parser.parse_known_args()
  if unparsed:
    print('Error, unrecognized flags:', unparsed)
    exit(-1)
  main()