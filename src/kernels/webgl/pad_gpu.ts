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

import {GPGPUProgram} from './gpgpu_math';
import {getCoordsDataType} from './shader_compiler';

export class PadProgram implements GPGPUProgram {
  variableNames = ['x'];
  outputShape: number[];
  userCode: string;

  constructor(
      xShape: number[], paddings: Array<[number, number]>,
      constantValue: number, mode: string) {
    this.outputShape = paddings.map(
        (p, i) => p[0] /* beforePad */ + xShape[i] + p[1] /* afterPad */);
    const rank = xShape.length;
    const type = getCoordsDataType(rank);

    const start = paddings.map(p => p[0]).join(',');
    const end = paddings.map((p, i) => p[0] + xShape[i]).join(',');
    const afterPad = paddings.map(p => p[1]).join(',');
    const unpackedCoords =
        ['coords[0]', 'coords[1]', 'coords[2]', 'coords[3]'].slice(0, rank);

    if (mode === 'constant') {
      if (rank === 1) {
        this.userCode = `
        int start = ${start};
        int end = ${end};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(float(${constantValue}));
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;
        return;
      }

      this.userCode = `
      ${type} start = ${type}(${start});
      ${type} end = ${type}(${end});

      void main() {
        ${type} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(float(${constantValue}));
        } else {
          ${type} coords = outC - start;
          setOutput(getX(${unpackedCoords}));
        }
      }
    `;
    } else if (mode === 'reflect') {
      const indexCalculationMethods = `
      int reflectedIndexInInputForPadBefore(int coord, int start) {
        return int(abs(float(start - coord)));
      }

      int reflectedIndexInInputForPadAfter(int coord, int start,
        int length, int afterPad) {
        int indexInPad = coord - start - length;
        int index = length - indexInPad - 2;
        return index;
      }
      `;

      const pad2dFunction = `
      ivec2 get2DCoordinates(
        ivec2 outC,
        ivec2 coords,
        ivec2 start,
        ivec2 end,
        ivec2 afterPad,
        int height,
        int width) {

        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          // Select non-padding rows
          if (outC.x >= start.x && outC.x < start.x + height) {
            // Select before pad columns
            if (outC.y < start.y) {
              int yIndex =
                reflectedIndexInInputForPadBefore(outC.y, start.y);
              return ivec2(coords.x, yIndex);
            // Select after pad columns
            } else if (outC.y >= start.y + width) {
              int yIndex =
                reflectedIndexInInputForPadAfter(outC.y, start.y,
                  width, afterPad.y);
              return ivec2(coords.x, yIndex);
            }

          // Select top and bottom rows, but only non-padding columns
          } else if (outC.y >= start.y && outC.y < start.y + height) {
            // Select top padding rows
            if (outC.x < start.x) {
              int xIndex =
                reflectedIndexInInputForPadBefore(outC.x, start.x);
              return ivec2(xIndex, coords.y);
            // Select bottom padding rows
            } else {
              int xIndex =
                reflectedIndexInInputForPadAfter(outC.x, start.x, height,
                  afterPad.x);
              return ivec2(xIndex, coords.y);
            }

          // Handle diagonal corner cases
          } else if (outC.x < start.x && outC.y < end.y) { // Top Left
            ivec2 index = outC - start;
            vec2 absIndex = vec2(abs(float(index.x)), abs(float(index.y)));
            return ivec2(int(absIndex.x), int(absIndex.y));
          } else if (outC.x < start.x && outC.y >= end.y) { // Top Right
            int targetCol =
              reflectedIndexInInputForPadAfter(outC.y, start.y, width,
                afterPad.y);
            int targetRow =
              reflectedIndexInInputForPadBefore(outC.x, start.x);
            return ivec2(targetRow, targetCol);
          } else if (outC.x >= end.x && outC.y < end.y) { // Bottom Left
            int targetRow =
              reflectedIndexInInputForPadAfter(outC.x, start.x, height,
                afterPad.x);
            int targetCol =
              reflectedIndexInInputForPadBefore(outC.y, start.y);
            return ivec2(targetRow, targetCol);
          } else if (outC.x >= end.x && outC.y >= end.y) { // Bottom Right
            int targetRow =
              reflectedIndexInInputForPadAfter(outC.x, start.x, height,
                afterPad.x);
            int targetCol =
              reflectedIndexInInputForPadAfter(outC.y, start.y, width,
                afterPad.y);
            return ivec2(targetRow, targetCol);
          }
        } else {
          return coords;
        }
      }
      `;

      const pad3dFunction = `
      ivec3 get3DCoordinates(
        ivec3 outC,
        ivec3 coords,
        ivec3 start,
        ivec3 end,
        ivec3 afterPad,
        int length,
        int height,
        int width) {
        if (any(lessThan(outC, start))
          || any(greaterThanEqual(outC, end))) {

          // Calculate the current positions inner indices in the original
          // input tensor
          ivec2 innerIndices = get2DCoordinates(
            ivec2(outC.y, outC.z),
            ivec2(coords.y, coords.z),
            ivec2(start.y, start.z),
            ivec2(end.y, end.z),
            ivec2(afterPad.y, afterPad.z),
            height,
            width
          );

          if (outC.x < start.x) {
            int outerIndex =
              reflectedIndexInInputForPadBefore(outC.x, start.x);
            return ivec3(outerIndex, innerIndices.x, innerIndices.y);
          } else if (outC.x >= end.x) {
            int outerIndex = reflectedIndexInInputForPadAfter(
              outC.x, start.x, length, afterPad.x);
            return ivec3(outerIndex, innerIndices.x, innerIndices.y);
          } else {
            return ivec3(coords.x, innerIndices.x, innerIndices.y);
          }
        } else {
          return coords;
        }
      }
      `;

      if (rank === 1) {
        this.userCode = `
        int start = ${start};
        int end = ${end};
        int width = ${xShape[0]};
        int afterPad = ${afterPad};

        ${indexCalculationMethods}

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            int index = reflectedIndexInInputForPadBefore(outC, start);
            setOutput(getX(index));
          } else if (outC >= end) {
            int index =
            reflectedIndexInInputForPadAfter(outC, start, width, afterPad);
            setOutput(getX(index));
          } else {
            setOutput(getX(outC - start));
          }
        }
        `;
      } else if (rank === 2) {
        this.userCode = `
        ${type} start = ${type}(${start});
        ${type} end = ${type}(${end});
        ${type} afterPad = ${type}(${afterPad});
        int height = ${xShape[0]};
        int width = ${xShape[1]};

        ${indexCalculationMethods}
        ${pad2dFunction}

        void main() {
          ${type} outC = getOutputCoords(); // [x: row][y: col]
          ${type} coords = outC - start; // Coords in input
          ivec2 coordsInSrcVec = get2DCoordinates(
            outC,
            coords,
            start,
            end,
            afterPad,
            height,
            width
          );
          setOutput(getX(coordsInSrcVec.x, coordsInSrcVec.y));
        }
        `;
      } else if (rank === 3) {
        this.userCode = `
          ${type} start = ${type}(${start});
          ${type} end = ${type}(${end});
          ${type} afterPad = ${type}(${afterPad});

          ${indexCalculationMethods}
          ${pad2dFunction}
          ${pad3dFunction}

          void main() {
            ${type} outC = getOutputCoords();
            ${type} coords = outC - start; // Coords in input
            ivec3 coordsInSrcVec = get3DCoordinates(
              outC,
              coords,
              start,
              end,
              afterPad,
              ${xShape[0]},
              ${xShape[1]},
              ${xShape[2]}
            );
            setOutput(
              getX(coordsInSrcVec.x, coordsInSrcVec.y, coordsInSrcVec.z)
            );
          }
        `;
      } else if (rank === 4) {
        this.userCode = `
          ${type} start = ${type}(${start});
          ${type} end = ${type}(${end});
          ${type} afterPad = ${type}(${afterPad});
          int length = ${xShape[0]};

          ${indexCalculationMethods}
          ${pad2dFunction}
          ${pad3dFunction}

          void main() {
            ${type} outC = getOutputCoords();
            ${type} coords = outC - start; // Coords in input

            if (any(lessThan(outC, start))
                || any(greaterThanEqual(outC, end))) {

              ivec3 innerIndices = get3DCoordinates(
                ivec3(outC.y, outC.z, outC.w),
                ivec3(coords.y, coords.z, coords.w),
                ivec3(start.y, start.z, start.w),
                ivec3(end.y, end.z, end.w),
                ivec3(afterPad.y, afterPad.z, afterPad.w),
                ${xShape[1]},
                ${xShape[2]},
                ${xShape[3]}
              );

              if (outC.x < start.x) {
                int outerIndex =
                  reflectedIndexInInputForPadBefore(outC.x, start.x);
                setOutput(getX(
                    outerIndex,
                    innerIndices.x,
                    innerIndices.y,
                    innerIndices.z
                  ));
              } else if (outC.x >= end.x) {
                int outerIndex = reflectedIndexInInputForPadAfter(
                  outC.x, start.x, length, afterPad.x);
                setOutput(getX(
                  outerIndex,
                  innerIndices.x,
                  innerIndices.y,
                  innerIndices.z
                ));
              } else {
                setOutput(getX(
                  coords.x,
                  innerIndices.x,
                  innerIndices.y,
                  innerIndices.z));
              }
            } else {
              setOutput(getX(${unpackedCoords}));
            }
          }
        `;
      }
    }
  }
}
