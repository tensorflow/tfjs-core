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

import * as test_util from "../test_util";
import {Array2D} from "./ndarray";
import * as linalg from "./linalg";

function squareMatrixEquals(a: Array2D, b: Array2D): boolean {
    const n = a.shape[0];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (a.get(i, j) !== b.get(i, j)) {
                return false;
            }
        }
    }
    return true;
}

test_util.describeCustom('linalg', () => {

    it('Cholesky decompose', () => {
        const t1 = Array2D.new([3, 3],
            [1, 2, 3, 2, 5, 7, 3, 7, 26]);
        const chol1: Array2D = linalg.cholesky(t1);
        const exp1 = Array2D.new([3, 3], [1, 0, 0, 2, 1, 0, 3, 1, 4]);
        expect(squareMatrixEquals(chol1, exp1)).toEqual(true);

        const t2 = Array2D.new([3, 3], [4, 12, -16, 12, 37, -43, -16, -43, 98]);
        const chol2 = linalg.cholesky(t2);
        const exp2 = Array2D.new([3, 3], [2, 0, 0, 6, 1, 0, -8, 5, 3]);
        expect(squareMatrixEquals(chol2, exp2)).toEqual(true);

        const t3 = Array2D.new([3, 3], [25, 15, -5, 15, 18, 0, -5, 0, 11]);
        const chol3 = linalg.cholesky(t3);
        const exp3 = Array2D.new([3, 3], [5, 0, 0, 3, 3, 0, -1, 1, 3]);
        expect(squareMatrixEquals(chol3, exp3)).toEqual(true);

        const t4 = Array2D.new([4, 4], [18, 22, 54, 42, 22, 70, 86, 62,
            54, 86, 174, 134, 42, 62, 134, 106]);
        const chol4 = linalg.cholesky(t4);
        const exp4 = Array2D.new([4, 4],
            new Float32Array([4.24264, 0, 0, 0, 5.18545, 6.56591,
                0, 0, 12.72792, 3.04604, 1.64974, 0, 9.89949, 1.62455,
                1.84971, 1.39262]));
        test_util.expectArraysClose(chol4.dataSync(), exp4.dataSync());

        t1.dispose();
        exp1.dispose();
        t2.dispose();
        exp2.dispose();
        t3.dispose();
        exp3.dispose();
        t4.dispose();
        exp4.dispose();
    });

    it('Cholesky throw error for non square matrix', () => {
        const t = Array2D.new([2, 1], [1, 2]);
        expect(() => linalg.cholesky(t))
            .toThrowError('Cholesky error: matrix is not square');
        t.dispose();
    });

    it('Cholesky throw error for non symmetric matrix', () => {
        const t = Array2D.new([3, 3], [2, 6, 0, 8, 3, -11, 1, -1, 4]);
        expect(() => linalg.cholesky(t))
            .toThrowError('Cholesky error: matrix is not symmetric');
        t.dispose();
    });

    it('Cholesky throw error for not positive definite matrix', () => {
        const t1 = Array2D.new([2, 2], [1, 2, 2, 1]);
        expect(() => linalg.cholesky(t1))
            .toThrowError('Cholesky error: matrix is not positive definite');

        const t2 = Array2D.new([3, 3], [-3, 0, 0, 0, -2, 0, 0, 0, 1]);
        expect(() => linalg.cholesky(t2))
            .toThrowError('Cholesky error: matrix is not positive definite');
        t1.dispose();
        t2.dispose();
    });
});