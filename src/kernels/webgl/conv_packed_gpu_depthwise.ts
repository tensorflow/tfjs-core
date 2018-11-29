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

import {Conv2DInfo} from '../../ops/conv_util';
import {GPGPUProgram} from './gpgpu_math';

export class DepthwiseConvPacked2DProgram implements GPGPUProgram {
  variableNames = ['x', 'W'];
  usesPackedTextures = true;
  outputShape: number[];
  userCode: string;

  constructor(convInfo: Conv2DInfo) {
    this.outputShape = convInfo.outShape;

    const xNumRows = convInfo.inHeight;
    const xNumCols = convInfo.inWidth;
    const padTop = convInfo.padInfo.top;
    const padLeft = convInfo.padInfo.left;
    const strideHeight = convInfo.strideHeight;
    const strideWidth = convInfo.strideWidth;
    // const dilationHeight = convInfo.dilationHeight;
    // const dilationWidth = convInfo.dilationWidth;
    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const channelMul = convInfo.outChannels / convInfo.inChannels;
    const texelsAcross = Math.ceil((filterWidth + 1) / 2);

    let mainLoop = `int xR; int xC;`;

    for (let r = 0; r < filterHeight; r++) {
      for (let c = -padLeft; c < texelsAcross * 2; c++) {
        mainLoop += `vec4 ${xTexelName(r, c)} = vec4(0.);`;
      }

      for (let c = 0; c < filterWidth; c++) {
        mainLoop += `
          vec4 wR${r}C${c} = vec4(0.);
          vec4 xR${r}C${c} = vec4(0.);`;
      }
    }

    for (let r = 0; r < filterHeight; r++) {
      for (let c = 0; c < texelsAcross; c++) {
        const col = c * 2;

        mainLoop += `
          xR = xRCorner + ${r};
          xC = xCCorner + ${col};`;

        if (padLeft === 0) {
          mainLoop += `
            if(xR >= 0 && xR < ${xNumRows} && xC >= 0 && xC < ${xNumCols}) {
              ${xTexelName(r, col)} = getX(batch, xR, xC, d1);
            }`;

          if (strideWidth === 1) {
            if (col > 0) {
              mainLoop += `
                xR${r}C${col - 2} = ${xTexelName(r, col - 2)};
                xR${r}C${col - 1} = vec4(
                  ${xTexelName(r, col - 2)}.zw, ${xTexelName(r, col)}.xy);`;
            }

            if (col < filterWidth && c === texelsAcross - 1) {
              mainLoop += `
                xR${r}C${col} = ${xTexelName(r, col)};
              `;
            }
          } else {
            if (col > 0) {
              mainLoop += `
                xR${r}C${col - 2} = vec4(
                  ${xTexelName(r, col - 2)}.xy, ${xTexelName(r, col)}.xy);
                xR${r}C${col - 1} = vec4(
                  ${xTexelName(r, col - 2)}.zw, ${xTexelName(r, col)}.zw);
              `;
            }

            if (col < filterWidth && c === texelsAcross - 1) {
              mainLoop += `
                vec4 ${xTexelName(r, col + 2)} = vec4(0.);

                if(xR >= 0 && xR < ${xNumRows} && xC + 2 < ${xNumCols}) {
                  ${xTexelName(r, col + 2)} = getX(batch, xR, xC + 2, d1);
                }

                xR${r}C${col} = vec4(
                  ${xTexelName(r, col)}.xy,
                  ${xTexelName(r, col + 2)}.xy);
              `;
            }
          }
        } else {
          if (c === 0) {  // first in a row
            mainLoop += `
              if(xR >= 0 && xR < ${xNumRows} && xC - 1 >= 0) {
                ${xTexelName(r, col - 1)} = getX(batch, xR, xC - 1, d1);
              }`;
          }

          mainLoop += `
            if(xR >= 0 && xR < ${xNumRows}
              && xC + 1 >= 0 && xC + 1 < ${xNumCols}) {
              ${xTexelName(r, col + 1)} = getX(batch, xR, xC + 1, d1);
            }`;

          if (strideWidth === 1) {
            if (col > 0) {
              mainLoop += `xR${r}C${col - 1} = ${xTexelName(r, col - 1)};`;
            }

            if(col < filterWidth) {
              mainLoop += `
                xR${r}C${col} = vec4(
                  ${xTexelName(r, col - 1)}.zw,
                  ${xTexelName(r, col + 1)}.xy);`;
            }
          } else {
            if(col > 0) {
              mainLoop += `xR${r}C${col - 1} = vec4(
                ${xTexelName(r, col - 1)}.xy,
                ${xTexelName(r, col + 1)}.xy);`;
            }

            if(col < filterWidth) {
              mainLoop += `
                xR${r}C${col} = vec4(
                  ${xTexelName(r, col - 1)}.zw,
                  ${xTexelName(r, col + 1)}.zw);`;
            }
          }
        }

        if (col < filterWidth) {
          mainLoop += `
            vec4 wTexel${r}C${col} = getW(${r}, ${col}, d1, q);
            wR${r}C${col} = vec4(wTexel${r}C${col}.xz, wTexel${r}C${col}.xz);
          `;

          if (col + 1 < filterWidth) {
            mainLoop += `
              vec4 wTexelR${r}C${col + 1} = getW(${r}, ${col + 1}, d1, q);
              wR${r}C${col + 1} = vec4(
                wTexelR${r}C${col + 1}.xz, wTexelR${r}C${col + 1}.xz);`;
          }
        }
      }
    }

    for (let r = 0; r < filterHeight; r++) {
      for (let c = 0; c < filterWidth; c++) {
        mainLoop += `result += xR${r}C${c} * wR${r}C${c};`;
      }
    }

    this.userCode = `
      const ivec2 strides = ivec2(${strideHeight}, ${strideWidth});
      const ivec2 pads = ivec2(${padTop}, ${padLeft});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${channelMul};
        int q = d2 - d1 * ${channelMul};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        vec4 result = vec4(0.);

        ${mainLoop}

        setOutput(result);
      }
    `;
  }
}

function xTexelName(r: number, c: number) {
  return `xTexelR${r}C${c < 0 ? 'minus' + Math.abs(c) : c}`;
}