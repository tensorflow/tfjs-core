/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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

/**
 * Linear algebra ops utility methods.
 */

import {Tensor} from '../tensor';
import {broadcastTo} from './array_ops'

/** Broadcasts the given tensors of matrices iff necessary. This is a <i>matrix</i>
  * broadcast, i.e. the last two dimensions of every tensor are neither broadcast
  * nor checked in any way.
  */
export function broadcastMatrices( ...tensors: Tensor[] ): Tensor[]
{
  if( tensors.length < 2 )
    throw new Error('broadcastMatrices(): At least two tensors expected.');
  for( const tensor of tensors )
    if( tensor.rank < 2 ) throw new Error('broadcastMatrices(): At least one tensor has rank < 2.');

//  console.log('SHAPES:', tensors.map( t => t.shape ) );

  const rank: number   = tensors.map( x => x.rank ).reduce( (r,s) => Math.max(r,s) ),
       shape: number[] = Array.from({ length: rank }, () => 1 );

  // FIND COMMON (BROADCASTED) SHAPE
  for( const tensor of tensors )
    for( let i=rank-2, j=tensor.rank-2; i-- > 0 && j-- > 0; )
      if( 1 === shape[i] )
        shape[i] = tensor.shape[j];
      else if( shape[i] != tensor.shape[j] && tensor.shape[j] != 1 )
        throw new Error(`triangularSolve(): Shapes not broadcast-compatible.`);

  return tensors.map( tensor => {
    shape[shape.length-2] = tensor.shape[tensor.rank-2];
    shape[shape.length-1] = tensor.shape[tensor.rank-1];
    return broadcastTo( tensor, shape.slice() );// <- make protection copy of shape (better safe than sorry)
  });
}