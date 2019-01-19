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

// https://en.wikipedia.org/wiki/Mersenne_Twister
export class MersenneTwister {
  /* word size (in number of bits) */
  WORD_SIZE = 32;

  // Degree of recurrence
  N = 624;

  /* middle word, an offset used in the recurrence relation defining the series
   * x, 1 ≤ m < n */
  M = 397;

  /* separation point of one word, or the number of bits of the lower bitmask,
   * 0 ≤ r ≤ w - 1 */
  R = 31;

  /* coefficients of the rational normal form twist matrix */
  A = 0x9908b0df;

  /* TGFSR(R) tempering bitmasks */
  B = 0x9d2c5680;
  C = 0xefc60000;

  /* TGFSR(R) tempering bit shifts */
  S = 7;
  T = 15;

  /* additional Mersenne Twister tempering bit shifts/masks */
  U = 11;
  D = 0xffffffff;
  L = 18;

  // That is, the binary number of r 1's
  LOWER_MASK = 0x7fffffff;
  UPPER_MASK = 0x80000000;
  index = this.N + 1;
  MT: number[] = new Array(this.N);
  constructor(seed: number) {
    this.initSeed(seed);
  }

  /*
   *  Generate the next n values from the series x_i
   *  function twist() {
   *    for i from 0 to (n-1) {
   *      int x := (MT[i] and upper_mask)
   *                + (MT[(i+1) mod n] and lower_mask)
   *      int xA := x >> 1
   *      if (x mod 2) != 0 { // lowest bit of x is 1
   *        xA := xA xor a
   *      }
   *      MT[i] := MT[(i + m) mod n] xor xA
   *    }
   *    index := 0
   *  }
   */

  twist = () => {
    for (let i = 0; i < this.N; i++) {
      const x = (this.MT[i] & this.UPPER_MASK) +
          (this.MT[(i + 1) % this.N] & this.LOWER_MASK);
      let xA = x >> 1;
      if (x % 2 !== 0) {
        xA = xA ^ this.A;
      }
      this.MT[i] = this.MT[(i + this.M) % this.N] ^ xA;
    }
    this.index = 0;
  };

  getNext = () => {
    if (this.index >= this.N) {
      if (this.index > this.N) {
        return Math.random();
      }
      this.twist();
    }

    let y = this.MT[this.index];
    y = y ^ ((y >> this.U) & this.D);
    y = y ^ ((y << this.S) & this.B);
    y = y ^ ((y << this.T) & this.C);
    y = y ^ (y >> this.L);

    this.index++;
    return y >>> 0;
  };

  initSeed = (seed: number = Date.now()) => {
    this.MT[0] = seed >>> 0;
    for (this.index = 1; this.index < this.N; this.index++) {
      const s = this.MT[this.index - 1] ^ (this.MT[this.index - 1] >>> 30);
      this.MT[this.index] = ((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
          (s & 0x0000ffff) * 1812433253 + this.index;
      /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
      /* In the previous versions, MSBs of the seed affect   */
      /* only MSBs of the array mt[].                        */
      /* 2002/01/09 modified by Makoto Matsumoto             */
      this.MT[this.index] >>>= 0;
      /* for >32 bit machines */
    }
  };

  random = () => {
    return this.getNext() * (1.0 / 4294967295.0);
  };

  randomWithLimits = (min: number, max: number) => {
    const r = this.random();
    return max * r + (1 - r) * min;
  };
}
