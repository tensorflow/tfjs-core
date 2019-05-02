/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
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
import {ENV} from '../environment';
import {Platform} from './platform';

export class PlatformBrowser implements Platform {
  /**
   * Makes an HTTP GET request.
   * @param path The URL path to make a request to
   * @param init The request init. See init here:
   *     https://developer.mozilla.org/en-US/docs/Web/API/Request/Request
   */
  fetch(path: string, init?: RequestInit): Promise<Response> {
    return fetch(path, init);
  }
}

if (ENV.get('IS_BROWSER')) {
  ENV.setPlatform('browser', new PlatformBrowser());
}
