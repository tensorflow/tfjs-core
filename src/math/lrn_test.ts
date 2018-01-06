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

import * as test_util from '../test_util';
import {MathTests} from '../test_util';

import {Array3D, Array4D} from './ndarray';

const sqArr = (arr: number[]) => arr.map(d => Math.pow(d, 2));
const sumArr = (arr: number[]) => arr.reduce((prev, curr) => prev + curr, 0);

// math.localResponseNormalization3D
{
  const tests: MathTests = it => {

    it('simple localResponseNormalization3D acrossChannels', math => {
      const x = Array3D.new([1, 1, 4], new Float32Array([1, 20, 300, 4]));
      const radius = 3;
      const bias = 1;
      const alpha = 1;
      const beta = 0.5;

      const result = math.localResponseNormalization3D(x, radius, bias, alpha,
        beta);

      const f = (...vals: number[]) =>
        Math.pow(bias + (alpha / radius) * sumArr(sqArr(vals)), -beta);

      test_util.expectArraysClose(
        result,
        [
          x.get(0, 0, 0) * f(x.get(0, 0, 0), x.get(0, 0, 1)),
          x.get(0, 0, 1) * f(x.get(0, 0, 0), x.get(0, 0, 1), x.get(0, 0, 2)),
          x.get(0, 0, 2) * f(x.get(0, 0, 1), x.get(0, 0, 2), x.get(0, 0, 3)),
          x.get(0, 0, 3) * f(x.get(0, 0, 2), x.get(0, 0, 3)),
        ]);
    });

    it('complex localResponseNormalization3D acrossChannels', math => {
      const x = Array3D.new([2, 2, 4], new Float32Array([
        1, 20, 300, 4, 5, 15, 24, 200, 1, 20, 300, 4, 5, 15, 24, 200
      ]));
      const radius = 3;
      const bias = 1;
      const alpha = 1;
      const beta = 0.5;
      const normRegion = "acrossChannels";

      const result = math.localResponseNormalization3D(x, radius, bias, alpha,
        beta, normRegion);

      const f = (...vals: number[]) =>
        Math.pow(bias + (alpha / radius) * sumArr(sqArr(vals)), -beta);

      // 1       | 2       | 3       | 4
      // ------- | ------- | ------- | -------
      // o x . . | x o x . | . x o x | . . x o

      test_util.expectArraysClose(
          result,
          [
            // 1 - 4
            x.get(0, 0, 0) * f(x.get(0, 0, 0), x.get(0, 0, 1)),
            x.get(0, 0, 1) * f(x.get(0, 0, 0), x.get(0, 0, 1), x.get(0, 0, 2)),
            x.get(0, 0, 2) * f(x.get(0, 0, 1), x.get(0, 0, 2), x.get(0, 0, 3)),
            x.get(0, 0, 3) * f(x.get(0, 0, 2), x.get(0, 0, 3)),

            // 1 - 4
            x.get(0, 1, 0) * f(x.get(0, 1, 0), x.get(0, 1, 1)),
            x.get(0, 1, 1) * f(x.get(0, 1, 0), x.get(0, 1, 1), x.get(0, 1, 2)),
            x.get(0, 1, 2) * f(x.get(0, 1, 1), x.get(0, 1, 2), x.get(0, 1, 3)),
            x.get(0, 1, 3) * f(x.get(0, 1, 2), x.get(0, 1, 3)),

            // 1 - 4
            x.get(1, 0, 0) * f(x.get(1, 0, 0), x.get(1, 0, 1)),
            x.get(1, 0, 1) * f(x.get(1, 0, 0), x.get(1, 0, 1), x.get(1, 0, 2)),
            x.get(1, 0, 2) * f(x.get(1, 0, 1), x.get(1, 0, 2), x.get(1, 0, 3)),
            x.get(1, 0, 3) * f(x.get(1, 0, 2), x.get(1, 0, 3)),

            // 1 - 4
            x.get(1, 1, 0) * f(x.get(1, 1, 0), x.get(1, 1, 1)),
            x.get(1, 1, 1) * f(x.get(1, 1, 0), x.get(1, 1, 1), x.get(1, 1, 2)),
            x.get(1, 1, 2) * f(x.get(1, 1, 1), x.get(1, 1, 2), x.get(1, 1, 3)),
            x.get(1, 1, 3) * f(x.get(1, 1, 2), x.get(1, 1, 3)),
          ]);
    });

    it('simple localResponseNormalization3D withinChannel', math => {
      const x = Array3D.new([2, 2, 1], new Float32Array([1, 20, 300, 4]));
      const radius = 3;
      const bias = 1;
      const alpha = 1;
      const beta = 0.5;
      const normRegion = "withinChannel";

      const result = math.localResponseNormalization3D(x, radius, bias, alpha,
        beta, normRegion);

      const f = (...vals: number[]) =>
        Math.pow(bias + (alpha / radius) * sumArr(sqArr(vals)), -beta);

      const multip = f(
            x.get(0, 0, 0), x.get(1, 0, 0),
            x.get(0, 1, 0), x.get(1, 1, 0));

      test_util.expectArraysClose(
        result,
        [
          x.get(0, 0, 0) * multip,
          x.get(0, 0, 1) * multip,
          x.get(0, 0, 2) * multip,
          x.get(0, 0, 3) * multip,
        ]);
    });

    it('localResponseNormalization3D non odd radius', math => {
      const x = Array3D.new([2, 2, 1], new Float32Array([1, 20, 300, 4]));
      const radius = 4;

      expect(() => math.localResponseNormalization3D(x, radius)).toThrowError();
    });

    it('complex localResponseNormalization3D withinChannel', math => {
      const x = Array3D.new([3, 3, 2], new Float32Array([
        1, 20, 300, 4, 23, 25, 13, 156, 123, 5, 15, 24, 200, 12, 12, 13, 21, 3
      ]));
      const radius = 3;
      const bias = 1;
      const alpha = 1;
      const beta = 0.5;
      const normRegion = "withinChannel";

      const result = math.localResponseNormalization3D(x, radius, bias, alpha,
        beta, normRegion);

      const f = (...vals: number[]) =>
        Math.pow(bias + (alpha / radius) * sumArr(sqArr(vals)), -beta);

      // Easier to read using these vars
      const d0 = 0;
      const d1 = 1;

      // 1     | 2     | 3     | 4     | 5     | 6     | 7     | 8     | 9
      // ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | -----
      // o x . | x o x | . x o | x x . | x x x | . x x | . . . | . . . | . . .
      // x x . | x x x | . x x | o x . | x o x | . x o | x x . | x x x | . x x
      // . . . | . . . | . . . | x x . | x x x | . x x | o x . | x o x | . x o

      test_util.expectArraysClose(
          result,
          [
            // 1
            x.get(0, 0, d0) * f(
              x.get(0, 0, d0), x.get(1, 0, d0),
              x.get(0, 1, d0), x.get(1, 1, d0)),

            x.get(0, 0, d1) * f(
              x.get(0, 0, d1), x.get(1, 0, d1),
              x.get(0, 1, d1), x.get(1, 1, d1)),

            // 4
            x.get(0, 1, d0) * f(
              x.get(0, 0, d0), x.get(1, 0, d0),
              x.get(0, 1, d0), x.get(1, 1, d0),
              x.get(0, 2, d0), x.get(1, 2, d0)),
            x.get(0, 1, d1) * f(
              x.get(0, 0, d1), x.get(1, 0, d1),
              x.get(0, 1, d1), x.get(1, 1, d1),
              x.get(0, 2, d1), x.get(1, 2, d1)),

            // 7
            x.get(0, 2, d0) * f(
              x.get(0, 1, d0), x.get(1, 1, d0),
              x.get(0, 2, d0), x.get(1, 2, d0)),
            x.get(0, 2, d1) * f(
              x.get(0, 1, d1), x.get(1, 1, d1),
              x.get(0, 2, d1), x.get(1, 2, d1)),

            // 2
            x.get(1, 0, d0) * f(
              x.get(0, 0, d0), x.get(1, 0, d0), x.get(2, 0, d0),
              x.get(0, 1, d0), x.get(1, 1, d0), x.get(2, 1, d0)),
            x.get(1, 0, d1) * f(
              x.get(0, 0, d1), x.get(1, 0, d1), x.get(2, 0, d1),
              x.get(0, 1, d1), x.get(1, 1, d1), x.get(2, 1, d1)),

            // 5
            x.get(1, 1, d0) * f(
              x.get(0, 0, d0), x.get(1, 0, d0), x.get(2, 0, d0),
              x.get(0, 1, d0), x.get(1, 1, d0), x.get(2, 1, d0),
              x.get(0, 2, d0), x.get(1, 2, d0), x.get(2, 2, d0)),
            x.get(1, 1, d1) * f(
              x.get(0, 0, d1), x.get(1, 0, d1), x.get(2, 0, d1),
              x.get(0, 1, d1), x.get(1, 1, d1), x.get(2, 1, d1),
              x.get(0, 2, d1), x.get(1, 2, d1), x.get(2, 2, d1)),

            // 8
            x.get(1, 2, d0) * f(
              x.get(0, 1, d0), x.get(1, 1, d0), x.get(2, 1, d0),
              x.get(0, 2, d0), x.get(1, 2, d0), x.get(2, 2, d0)),
             x.get(1, 2, d1) * f(
              x.get(0, 1, d1), x.get(1, 1, d1), x.get(2, 1, d1),
              x.get(0, 2, d1), x.get(1, 2, d1), x.get(2, 2, d1)),

            // 3
            x.get(2, 0, d0) * f(
              x.get(1, 0, d0), x.get(2, 0, d0),
              x.get(1, 1, d0), x.get(2, 1, d0)),
            x.get(2, 0, d1) * f(
              x.get(1, 0, d1), x.get(2, 0, d1),
              x.get(1, 1, d1), x.get(2, 1, d1)),

            // 6
            x.get(2, 1, d0) * f(
              x.get(1, 0, d0), x.get(2, 0, d0),
              x.get(1, 1, d0), x.get(2, 1, d0),
              x.get(1, 2, d0), x.get(2, 2, d0)),
            x.get(2, 1, d1) * f(
              x.get(1, 0, d1), x.get(2, 0, d1),
              x.get(1, 1, d1), x.get(2, 1, d1),
              x.get(1, 2, d1), x.get(2, 2, d1)),

            // 9
            x.get(2, 2, d0) * f(
              x.get(1, 1, d0), x.get(2, 1, d0),
              x.get(1, 2, d0), x.get(2, 2, d0)),
            x.get(2, 2, d1) * f(
              x.get(1, 1, d1), x.get(2, 1, d1),
              x.get(1, 2, d1), x.get(2, 2, d1)),
          ]);
    });
  };

  test_util.describeMathCPU('localResponseNormalization3D', [tests]);
  test_util.describeMathGPU('localResponseNormalization3D', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}

// math.localResponseNormalization4D
{
  const tests: MathTests = it => {

    it('simple localResponseNormalization4D acrossChannels', math => {
      const x = Array4D.new([2, 1, 1, 4],
        new Float32Array([1, 20, 300, 4, 1, 20, 300, 4]));
      const radius = 3;
      const bias = 1;
      const alpha = 1;
      const beta = 0.5;

      const result = math.localResponseNormalization4D(x, radius, bias, alpha,
        beta);

      const f = (...vals: number[]) =>
        Math.pow(bias + (alpha / radius) * sumArr(sqArr(vals)), -beta);

      // Easier to read using these vars
      const b0 = 0;
      const b1 = 1;

      test_util.expectArraysClose(
        result,
        [
          x.get(b0, 0, 0, 0) * f(x.get(b0, 0, 0, 0), x.get(b0, 0, 0, 1)),
          x.get(b0, 0, 0, 1) *
            f(x.get(b0, 0, 0, 0),x.get(b0, 0, 0, 1), x.get(b0, 0, 0, 2)),
          x.get(b0, 0, 0, 2) *
            f(x.get(b0, 0, 0, 1), x.get(b0, 0, 0, 2), x.get(b0, 0, 0, 3)),
          x.get(b0, 0, 0, 3) * f(x.get(b0, 0, 0, 2), x.get(b0, 0, 0, 3)),

          x.get(b1, 0, 0, 0) * f(x.get(b1, 0, 0, 0), x.get(b1, 0, 0, 1)),
          x.get(b1, 0, 0, 1) *
            f(x.get(b1, 0, 0, 0), x.get(b1, 0, 0, 1), x.get(b1, 0, 0, 2)),
          x.get(b1, 0, 0, 2) *
            f(x.get(b1, 0, 0, 1), x.get(b1, 0, 0, 2), x.get(b1, 0, 0, 3)),
          x.get(b1, 0, 0, 3) * f(x.get(b1, 0, 0, 2), x.get(b1, 0, 0, 3)),
        ]);
    });

    it('simple localResponseNormalization4D withinChannel', math => {
      const x = Array4D.new([2, 2, 2, 1],
        new Float32Array([1, 20, 300, 4, 1, 20, 300, 4]));
      const radius = 3;
      const bias = 1;
      const alpha = 1;
      const beta = 0.5;
      const normRegion = "withinChannel";

      const result = math.localResponseNormalization4D(x, radius, bias, alpha,
        beta, normRegion);

      const f = (...vals: number[]) =>
        Math.pow(bias + (alpha / radius) * sumArr(sqArr(vals)), -beta);

      const multip = (b: number) => f(
            x.get(b, 0, 0, 0), x.get(b, 1, 0, 0),
            x.get(b, 0, 1, 0), x.get(b, 1, 1, 0));

      // Easier to read using these vars
      const b0 = 0;
      const b1 = 1;

      test_util.expectArraysClose(
        result,
        [
          x.get(b0, 0, 0, 0) * multip(b0),
          x.get(b0, 0, 0, 1) * multip(b0),
          x.get(b0, 0, 0, 2) * multip(b0),
          x.get(b0, 0, 0, 3) * multip(b0),

          x.get(b1, 0, 0, 0) * multip(b1),
          x.get(b1, 0, 0, 1) * multip(b1),
          x.get(b1, 0, 0, 2) * multip(b1),
          x.get(b1, 0, 0, 3) * multip(b1),
        ]);
    });

    it('localResponseNormalization4D non odd radius', math => {
      const x = Array4D.new([1, 2, 2, 1], new Float32Array([1, 20, 300, 4]));
      const radius = 4;

      expect(() => math.localResponseNormalization4D(x, radius)).toThrowError();
    });

    it('compare result with tensorflow', math => {

      // tslint:disable-next-line:no-any
      const flatten = (arr: any): number[] => {
        // tslint:disable-next-line:no-any
        return arr.reduce((prev: any, curr: any) => {
          return prev.concat(Array.isArray(curr) ? flatten(curr) : curr);
        }, []);
      };

      const input = [[
        [[ 0.18131578,  0.63923073,  0.46540618,  0.18966269,  0.53920102,
          0.06494355,  0.94328058,  0.63116813],
        [ 0.04989576,  0.38336563,  0.14511418,  0.42091358,  0.06668127,
          0.36315763,  0.68200994,  0.39224088],
        [ 0.6962297 ,  0.81458151,  0.64133286,  0.79663002,  0.18417788,
          0.93727708,  0.17409444,  0.66373098]],

        [[ 0.08156753,  0.48849237,  0.03893805,  0.97015679,  0.76409626,
          0.44835722,  0.45164454,  0.7408638 ],
        [ 0.82349432,  0.36134887,  0.42502427,  0.52196109,  0.4016006 ,
          0.6481204 ,  0.93262601,  0.95187056],
        [ 0.97210717,  0.24377906,  0.42526495,  0.03013968,  0.69660497,
          0.01439023,  0.78891408,  0.6691494 ]],

        [[ 0.5429194 ,  0.2120589 ,  0.5307281 ,  0.20710731,  0.67700243,
          0.52827108,  0.39732468,  0.0317266 ],
        [ 0.71350014,  0.64022255,  0.38543093,  0.10279858,  0.76854324,
          0.28109419,  0.5336225 ,  0.84840786],
        [ 0.71277773,  0.74621427,  0.85350287,  0.74515891,  0.92433357,
          0.5164746 ,  0.47580981,  0.73108137]]],

        [[[ 0.75566137,  0.14035034,  0.9790405 ,  0.15621102,  0.54722261,
          0.32976949,  0.14749217,  0.82067323],
        [ 0.69872284,  0.51619899,  0.90417838,  0.42470264,  0.13754916,
          0.02867293,  0.69719827,  0.22094154],
        [ 0.3784641 ,  0.6568011 ,  0.72850513,  0.85087204,  0.89203179,
          0.49304557,  0.38364565,  0.69364476]],

        [[ 0.32489944,  0.75147176,  0.6375289 ,  0.53734398,  0.66700578,
          0.09124267,  0.03851235,  0.79048026],
        [ 0.20672762,  0.2758652 ,  0.9900049 ,  0.68648672,  0.17934632,
          0.54714286,  0.14928579,  0.81499696],
        [ 0.56324136,  0.97960377,  0.94923866,  0.1834166 ,  0.98466325,
          0.22385693,  0.4179244 ,  0.56673622]],

        [[ 0.76374388,  0.33553112,  0.8305459 ,  0.29856455,  0.07728517,
          0.44510317,  0.01880741,  0.63781643],
        [ 0.9710108 ,  0.18910742,  0.8013823 ,  0.86647093,  0.59375167,
          0.704651  ,  0.00345099,  0.95125782],
        [ 0.614815  ,  0.10106695,  0.06676865,  0.02703381,  0.35907662,
          0.27831733,  0.29555357,  0.71847856]]]
      ];

      const x = Array4D.new([2, 3, 3, 8], new Float32Array(flatten(input)));
      const radius = 5;

      const result = math.localResponseNormalization4D(x, radius);

      const expected = [[
        [[ 0.12856296,  0.37674883,  0.25708836,  0.10476886,  0.29785234,
          0.03587454,  0.52369761,  0.37481445],
        [ 0.04095855,  0.27459353,  0.10006671,  0.29025033,  0.04598155,
          0.25042343,  0.47057375,  0.28063443],
        [ 0.34356624,  0.40049371,  0.29975817,  0.37234387,  0.08608451,
          0.43808213,  0.08605547,  0.35842365]],

      [[ 0.04730746,  0.2740688 ,  0.02017291,  0.50261605,  0.39586079,
          0.23228362,  0.2341959 ,  0.39711899],
        [ 0.48838338,  0.18752871,  0.19776066,  0.24286465,  0.1868618 ,
          0.30156565,  0.46979931,  0.48764008],
        [ 0.59473675,  0.1343175 ,  0.21984665,  0.01558113,  0.36011967,
          0.00743923,  0.4717361 ,  0.40444207]],

      [[ 0.35032901,  0.13254806,  0.33166796,  0.12942758,  0.42307919,
          0.33013248,  0.26395729,  0.02128946],
        [ 0.43043172,  0.36764553,  0.19897431,  0.05306859,  0.39675167,
          0.14511167,  0.29630926,  0.50402826],
        [ 0.33714151,  0.34434402,  0.37318823,  0.32581556,  0.40415844,
          0.22582494,  0.21894942,  0.35819501]]],

      [[[ 0.43760738,  0.08098274,  0.51056111,  0.08146269,  0.28537184,
          0.17197192,  0.08368791,  0.46713835],
        [ 0.41964558,  0.2859658 ,  0.49718952,  0.23353545,  0.07563552,
          0.01576667,  0.4152481 ,  0.13828973],
        [ 0.19243036,  0.32777327,  0.34355548,  0.40126246,  0.42067295,
          0.23251519,  0.18387569,  0.35026112]],

      [[ 0.19352034,  0.44748253,  0.34348226,  0.28950551,  0.35936356,
          0.04915893,  0.02107474,  0.47454721],
        [ 0.1213582 ,  0.16132665,  0.52263212,  0.36240226,  0.09467847,
          0.28884143,  0.0792828 ,  0.43755049],
        [ 0.27381739,  0.46669525,  0.43659493,  0.08436104,  0.45288819,
          0.10296125,  0.19901516,  0.30511078]],

      [[ 0.46662462,  0.20498593,  0.47278059,  0.1699551 ,  0.04399387,
          0.25337085,  0.01188824,  0.41255185],
        [ 0.47264242,  0.09204847,  0.35397121,  0.38272092,  0.26226059,
          0.31124493,  0.00168738,  0.46712503],
        [ 0.48608467,  0.07780946,  0.04498107,  0.01821228,  0.24190471,
          0.18749835,  0.21875678,  0.53328294]]
      ]];

      test_util.expectArraysClose(result, flatten(expected));
    });
  };

  test_util.describeMathCPU('localResponseNormalization4D', [tests]);
  test_util.describeMathGPU('localResponseNormalization4D', [tests], [
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 1},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': true, 'WEBGL_VERSION': 2},
    {'WEBGL_FLOAT_TEXTURE_ENABLED': false, 'WEBGL_VERSION': 1}
  ]);
}