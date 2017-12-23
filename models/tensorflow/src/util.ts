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

// Lookup table for non - utf8, with necessary escapes at(o >= 127 or o < 32)

export function unescape(text: string): string {
  const UNESCAPE_STR_TO_BYTE: {[key: string]: number} = {};
  UNESCAPE_STR_TO_BYTE['t'] = 9;
  UNESCAPE_STR_TO_BYTE['n'] = 10;
  UNESCAPE_STR_TO_BYTE['r'] = 13;
  UNESCAPE_STR_TO_BYTE['\''] = 39;
  UNESCAPE_STR_TO_BYTE['"'] = 34;
  UNESCAPE_STR_TO_BYTE['\\'] = 92;

  const CUNESCAPE = /(\\[0-7]{3})|(\\[tnr'"\\])/gi;
  return text.replace(CUNESCAPE, (match, g1, g2) => {
    if (!!g1) {
      return String.fromCharCode(parseInt(g1.substring(1), 8));
    }
    if (!!g2) {
      return String.fromCharCode(UNESCAPE_STR_TO_BYTE[g2.substring(1)]);
    }
    return match;
  });
}
