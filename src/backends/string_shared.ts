/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import {arrayBufferToBase64String, arrayBufferToString, base64StringToArrayBuffer, stringToArrayBuffer, urlSafeBase64, urlUnsafeBase64} from '../io/io_utils';
import {StringTensor, Tensor} from '../tensor';
import {TypedArray} from '../types';

/** Shared implementation of the encodeBase64 kernel across WebGL and CPU. */
export function encodeBase64Impl<T extends StringTensor>(
    values: TypedArray|string[], shape: number[], pad = false): T {
  const resultValues = new Array(values.length);

  for (let i = 0; i < values.length; ++i) {
    // Convert from string to ArrayBuffer of UTF-8 multibyte sequence
    // tslint:disable-next-line: max-line-length
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    const aBuff = stringToArrayBuffer(values[i].toString());

    // Encode to Base64 and make URL safe
    const bVal = urlSafeBase64(arrayBufferToBase64String(aBuff));

    // Remove padding
    resultValues[i] = pad ? bVal : bVal.replace(/=/g, '');
  }

  return Tensor.make(shape, {values: resultValues}, 'string') as T;
}

/** Shared implementation of the decodeBase64 kernel across WebGL and CPU. */
export function decodeBase64Impl<T extends StringTensor>(
    values: TypedArray|string[], shape: number[]): T {
  const resultValues = new Array(values.length);

  for (let i = 0; i < values.length; ++i) {
    // Undo URL safe and decode from Base64 to ArrayBuffer
    const aBuff =
        base64StringToArrayBuffer(urlUnsafeBase64(values[i].toString()));

    // Convert from ArrayBuffer of UTF-8 multibyte sequence to string
    resultValues[i] = arrayBufferToString(aBuff);
  }

  return Tensor.make(shape, {values: resultValues}, 'string') as T;
}
