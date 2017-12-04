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

import {Array2D} from "./ndarray";

/**
 * Checks if a matrix is a square matrix
 * @param {Array2D} a Matrix
 * @returns {boolean}
 */
export function isSquare(a: Array2D): boolean {
    return a.shape[0] === a.shape[1];
}

/**
 * Checks if a matrix is symmetric
 * @param {Array2D} a Matrix
 * @returns {boolean}
 */
export function isSymmetric(a: Array2D): boolean {
    if (!isSquare(a)) {
        return false;
    }
    const n: number = a.shape[0];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (a.get(i, j) !== a.get(j, i)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Return the Cholesky decomposition
 * @param {Array2D} a Matrix
 * @returns {Array2D} l lower triangular matrix
 */
export function cholesky(a: Array2D): Array2D {
    if (!isSquare(a)) {
        throw new Error('Cholesky error: matrix is not square');
    }
    if (!isSymmetric(a)) {
        throw new Error('Cholesky error: matrix is not symmetric');
    }
    const n: number = a.shape[0];
    const l: Array2D = Array2D.zeros(a.shape, a.dtype);
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < (i + 1); j++) {
            let sum = 0;
            for (let k = 0; k < j; k++) {
                sum += l.get(i, k) * l.get(j, k);
            }
            const value = i === j ? Math.sqrt(a.get(i, i) - sum) || 0 :
                (1.0 / l.get(j, j) * (a.get(i, j) - sum));
            l.set(value, i, j);
        }
        if (l.get(i, i) <= 0) {
            throw new Error('Cholesky error: matrix is not positive definite');
        }
    }
    return l;
}
