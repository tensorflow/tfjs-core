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
    const dilationHeight = convInfo.dilationHeight;
    const dilationWidth = convInfo.dilationWidth;
    const filterHeight = convInfo.filterHeight;
    const filterWidth = convInfo.filterWidth;
    const texelsAcross = filterWidth;

    let mainLoop = `int xR; int xC; int xCOffset;`;

    for (let r = 0; r < filterHeight; r++) {
      for (let c = 0; c < filterWidth; c++) {
        mainLoop += `
          vec4 xTexelR${r}C${c * 2} = vec4(0.);

          vec4 wR${r}C${c} = vec4(0.);
          vec4 xR${r}C${c} = vec4(0.);`;
      }
    }

    for (let r = 0; r < filterHeight; r++) {
      for (let texelC = 0; texelC < texelsAcross; texelC++) {
        const c = texelC * 2;

        mainLoop += `
          xR = xRCorner + ${r * dilationHeight};
          xC = xCCorner + ${c * dilationWidth};
        `;

        if (strideWidth === 1) {
          if (c < filterWidth) {
            // if padding is odd, the outer texels have to be composed
            if (padLeft % 2 == 1) {
              // TODO: Remove redundant samples (ensure vec4 previous is not
              // redundant, and avoid setting xTexelRC's that exceed the
              // boundary in the first place rather than resetting them to
              // vec4(0)).

              // If padding is odd, we must add 1 to ensure we ask for an
              // even-numbered row.
              // We subtract 2 to access the previous texel.

              mainLoop += `
                xCOffset = xC + 1;
                if(xR >= 0 && xR < ${xNumRows} && xCOffset >= 0 && xCOffset < ${
                  xNumCols}) {
                  xTexelR${r}C${c} = getX(batch, xR, xCOffset, d1);
                } else {
                  xTexelR${r}C${c} = vec4(0.);
                }

                xCOffset = xC + 1 - 2;
                if(xR >= 0 && xR < ${xNumRows} && xCOffset >= 0 && xCOffset < ${
                  xNumCols}) {
                  vec4 previous = getX(batch, xR, xCOffset, d1);
                  xR${r}C${c} = vec4(previous.zw, xTexelR${r}C${c}.xy);
                } else {
                  xR${r}C${c} = vec4(0, 0, xTexelR${r}C${c}.xy);
                }
              `;
            } else {
              mainLoop += `
                if(xR >= 0 && xR < ${xNumRows} && xC >= 0 && xC < ${xNumCols}) {
                  xTexelR${r}C${c} = getX(batch, xR, xC, d1);
                } else {
                  xTexelR${r}C${c} = vec4(0.);
                }

                xR${r}C${c} = xTexelR${r}C${c};
              `;
            }

            if (c + 1 < filterWidth) {
              // If dilation is even, then we want the second entry to match the
              // first (either both are composed or both are single samples).
              // But if dilation is odd, then we want the second entry to be the
              // opposite of the first (if the first is composed, the second is
              // a single sample, and vice versa.)

              const nextTexelOffset =
                  padLeft % 2 === 0 ? dilationWidth + 1 : dilationWidth;

              mainLoop +=
                  `xCOffset = xC + ${padLeft % 2} + ${nextTexelOffset};`;

              if ((dilationWidth % 2 == 0 && padLeft % 2 == 1) ||
                  (dilationWidth % 2 !== 0 && padLeft % 2 !== 1)) {
                mainLoop += `
                  if(xR >= 0 && xR < ${xNumRows} &&
                    xCOffset >= 0 && xCOffset < ${xNumCols}) {
                    xTexelR${r}C${c + 2} = getX(batch, xR, xCOffset, d1);
                  }

                  xR${r}C${c + 1} = vec4(
                    xTexelR${r}C${c}.zw, xTexelR${r}C${c + 2}.xy);
                `;
              } else {
                mainLoop += `
                  if(xR >= 0 && xR < ${xNumRows} &&
                    xCOffset >= 0 && xCOffset < ${xNumCols}) {
                    xTexelR${r}C${c + 2} = getX(batch, xR, xCOffset, d1);
                  }

                  xR${r}C${c + 1} = xTexelR${r}C${c + 2};
                `;
              }
            }
          }
        } else {  // stride > 1
          if (c < filterWidth) {
            mainLoop += `
              if(xR >= 0 && xR < ${xNumRows}) {
            `;

            if (padLeft % 2 == 1) {
              mainLoop += `
                xCOffset = xC + 1 - ${strideWidth};
                if(xCOffset >= 0 && xCOffset < ${xNumCols}) {
                  xTexelR${r}C${c} = getX(batch, xR, xCOffset, d1);
                } else {
                  xTexelR${r}C${c} = vec4(0.);
                }

                if(xC + 1 >= 0 && xC + 1 < ${xNumCols}) {
                  next = getX(batch, xR, xC + 1, d1);
                } else {
                  next = vec4(0.);
                }

                xR${r}C${c} = vec4(xTexelR${r}C${c}.zw, next.zw);
              `;

              if (c + 1 < filterWidth) {
                mainLoop += `
                  vec4 final = vec4(0.);
                  xCOffset = xC + 1 + ${strideWidth};
                  if(xCOffset >= 0 && xCOffset < ${xNumCols}) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xR${r}C${c + 1} = vec4(next.xy, final.xy);
                `;
              }
            } else {
              mainLoop += `
                if(xC >= 0 && xC < ${xNumCols}) {
                  xTexelR${r}C${c} = getX(batch, xR, xC, d1);
                } else {
                  xTexelR${r}C${c} = vec4(0.);
                }

                xCOffset = xC + ${strideWidth};
                if(xCOffset >= 0 && xCOffset < ${xNumCols}) {
                  next = getX(batch, xR, xCOffset, d1);
                } else {
                  next = vec4(0.);
                }

                xR${r}C${c} = vec4(xTexelR${r}C${c}.xy, next.xy);
              `;

              if (c + 1 < filterWidth) {
                mainLoop += `
                  xR${r}C${c + 1} = vec4(xTexelR${r}C${c}.zw, next.zw);
                `;
              }
            }

            mainLoop += `}`;
          }
        }

        if (c < filterWidth) {
          mainLoop += `
            vec4 wTexelR${r}C${c} = getW(${r}, ${c}, d1, q);
            wR${r}C${c} = vec4(wTexelR${r}C${c}.xz, wTexelR${r}C${c}.xz);
          `;

          if (c + 1 < filterWidth) {
            mainLoop += `
              vec4 wTexelR${r}C${c + 1} = getW(${r}, ${c + 1}, d1, q);
              wR${r}C${c + 1} =
                vec4(wTexelR${r}C${c + 1}.xz, wTexelR${r}C${c + 1}.xz);`;
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
        int d1 = d2;
        int q = 0;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        vec4 result = vec4(0.);
        vec4 next = vec4(0.);

        ${mainLoop}

        setOutput(result);
      }
    `;
  }
}
