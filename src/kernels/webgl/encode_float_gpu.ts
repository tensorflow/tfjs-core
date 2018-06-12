/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {GPGPUProgram} from './gpgpu_math';

export class EncodeFloatProgram implements GPGPUProgram {
  variableNames = ['A'];
  userCode: string;
  outputShape: number[];

  constructor(outputShape: number[]) {
    this.outputShape = outputShape;
    this.userCode = `
      const float FLOAT_MAX = 1.70141184e38;
      const float FLOAT_MIN = 1.17549435e-38;

      lowp vec4 encode_float(highp float v) {
        if (isNaN(v)) {
          return vec4(255, 255, 255, 255);
        }

        highp float av = abs(v);

        if(av < FLOAT_MIN) {
          return vec4(0.0, 0.0, 0.0, 0.0);
        } else if(v > FLOAT_MAX) {
          return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
        } else if(v < -FLOAT_MAX) {
          return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
        }

        highp vec4 c = vec4(0,0,0,0);

        highp float e = floor(log2(av));
        //highp float m = av * pow(2.0, -e) - 1.0;
        highp float m = exp2(log2(av) - e) - 1.0;
        //pow(2.0, -e) - 1.0;

        c[2] = floor(128.0 * m);
        m -= c[2] / 128.0;
        c[1] = floor(32768.0 * m);
        m -= c[1] / 32768.0;
        c[0] = floor(8388608.0 * m);

        highp float ebias = e + 127.0;
        c[3] = floor(ebias / 2.0);
        ebias -= c[3] * 2.0;
        c[2] += floor(ebias) * 128.0;

        c[3] += 128.0 * step(0.0, -v);

        return c / 255.0;
      }

      // vec4 encode_float2(float val) {

      //   // TODO: correctly handle denormal numbers
      //   // http://www.2ality.com/2012/04/number-encoding.html
      //   // encode absolute value + sign
      //   float a = abs(val);
      //   float exp = floor(log2(a));                 // number of powers of 2
      //   // multiply to fill 24 bits (implied leading 1)
      //   float mant = pow(2.,log2(a)-exp) * pow(2.,23.);
      //   float mant1 = floor(mant / 256. / 256.);
      // first 8 bits of mantissa
      //   float mant2 = mod(floor(mant / 256.),256.); // second 8 bits
      //   float mant3 = mod(mant,256.);               // third 8 bits

      //   highp float sign = 128.-128.*(a/val);			// sign bit is 256 or 0
      //   highp float e = (sign+exp+127.)/510.;		// exponent and sign
      //   // handle leading bit
      //   highp float m1 = (mant1-(128.*(1.-mod(exp+127.,2.))))/255.;
      //   highp float m2 = (mant2)/255.;				// middle part
      //   highp float m3 = (mant3+.5)/255.;			// scale to 0 - 255

      //   return vec4(m3,m2,m1,e);
      // }

      void main() {
        float x = getAAtOutCoords();
        gl_FragColor = encode_float(x);
      }
    `;
  }
}
