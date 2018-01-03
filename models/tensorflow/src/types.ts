/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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
export enum DataType {
  // Not a legal value for DataType.  Used to indicate a DataType field
  // has not been set.
  DT_INVALID = 0,
  // Data types that all computation devices are expected to be
  // capable to support.
  DT_FLOAT,
  DT_DOUBLE,
  DT_INT32,
  DT_UINT8,
  DT_INT16,
  DT_INT8,
  DT_STRING,
  DT_COMPLEX64,  // Single-precision complex
  DT_INT64,
  DT_BOOL,
  DT_QINT8,     // Quantized int8
  DT_QUINT8,    // Quantized uint8
  DT_QINT32,    // Quantized int32
  DT_BFLOAT16,  // Float32 truncated to 16 bits.  Only for cast ops.
  DT_QINT16,    // Quantized int16
  DT_QUINT16,   // Quantized uint16
  DT_UINT16,
  DT_COMPLEX128,  // Double-precision complex
  DT_HALF,
  DT_RESOURCE,
  DT_VARIANT,  // Arbitrary C++ data types
  DT_UINT32,
  DT_UINT64,
}

export interface Dim {
  size?: number;
  name?: string;
}

export interface TensorShape {
  dim?: Dim[]|Dim;
  unknown_rank?: boolean;
}

export interface Tensor {
  dtype?: string;
  tensor_shape?: TensorShape;
  version_number?: number[];
  tensor_content?: string;
  half_val?: number[];
  float_val?: number[];
  double_val?: number[];
  int_val?: number[];
  string_val?: string[];
  scomplex_val?: number[];
  int64_val?: number[];
  bool_val?: boolean[];
  dcomplex_val?: number[];
  uint32_val?: number[];
  uint64_val?: number[];
}

export interface ListValue {
  s?: string[];
  i?: number[];
  f?: number[];
  b?: boolean[];
  type?: string[];
  shape?: TensorShape[];
  tensor?: Tensor[];
}

export interface AttrValue {
  s?: string;
  i?: number;
  f?: number;
  b?: boolean;
  type?: string;
  shape?: TensorShape;
  tensor?: Tensor;
  list?: ListValue;
}

export interface Attr {
  key: string;
  value: AttrValue;
}
export interface Node {
  name: string;
  op: string;
  // tslint:disable-next-line:no-any
  attr: Attr[];
  input?: string[];
}

export interface Graph {
  node: Node[];
  version: {[key: string]: number};
}

export interface LayerNode {
  node: string;
  parents: string[];
}

export interface Layer {
  nodes: LayerNode[];
}
