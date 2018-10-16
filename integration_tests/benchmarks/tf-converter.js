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
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@tensorflow/tfjs-core')) :
    typeof define === 'function' && define.amd ? define(['exports', '@tensorflow/tfjs-core'], factory) :
    (factory((global.tf = global.tf || {}),global.tf));
}(this, (function (exports,tfc) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, module) {
      return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var aspromise = asPromise;

    /**
     * Callback as used by {@link util.asPromise}.
     * @typedef asPromiseCallback
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {...*} params Additional arguments
     * @returns {undefined}
     */

    /**
     * Returns a promise from a node-style callback function.
     * @memberof util
     * @param {asPromiseCallback} fn Function to call
     * @param {*} ctx Function context
     * @param {...*} params Function arguments
     * @returns {Promise<*>} Promisified function
     */
    function asPromise(fn, ctx/*, varargs */) {
        var params  = new Array(arguments.length - 1),
            offset  = 0,
            index   = 2,
            pending = true;
        while (index < arguments.length)
            params[offset++] = arguments[index++];
        return new Promise(function executor(resolve, reject) {
            params[offset] = function callback(err/*, varargs */) {
                if (pending) {
                    pending = false;
                    if (err)
                        reject(err);
                    else {
                        var params = new Array(arguments.length - 1),
                            offset = 0;
                        while (offset < params.length)
                            params[offset++] = arguments[offset];
                        resolve.apply(null, params);
                    }
                }
            };
            try {
                fn.apply(ctx || null, params);
            } catch (err) {
                if (pending) {
                    pending = false;
                    reject(err);
                }
            }
        });
    }

    var base64_1 = createCommonjsModule(function (module, exports) {

    /**
     * A minimal base64 implementation for number arrays.
     * @memberof util
     * @namespace
     */
    var base64 = exports;

    /**
     * Calculates the byte length of a base64 encoded string.
     * @param {string} string Base64 encoded string
     * @returns {number} Byte length
     */
    base64.length = function length(string) {
        var p = string.length;
        if (!p)
            return 0;
        var n = 0;
        while (--p % 4 > 1 && string.charAt(p) === "=")
            ++n;
        return Math.ceil(string.length * 3) / 4 - n;
    };

    // Base64 encoding table
    var b64 = new Array(64);

    // Base64 decoding table
    var s64 = new Array(123);

    // 65..90, 97..122, 48..57, 43, 47
    for (var i = 0; i < 64;)
        s64[b64[i] = i < 26 ? i + 65 : i < 52 ? i + 71 : i < 62 ? i - 4 : i - 59 | 43] = i++;

    /**
     * Encodes a buffer to a base64 encoded string.
     * @param {Uint8Array} buffer Source buffer
     * @param {number} start Source start
     * @param {number} end Source end
     * @returns {string} Base64 encoded string
     */
    base64.encode = function encode(buffer, start, end) {
        var parts = null,
            chunk = [];
        var i = 0, // output index
            j = 0, // goto index
            t;     // temporary
        while (start < end) {
            var b = buffer[start++];
            switch (j) {
                case 0:
                    chunk[i++] = b64[b >> 2];
                    t = (b & 3) << 4;
                    j = 1;
                    break;
                case 1:
                    chunk[i++] = b64[t | b >> 4];
                    t = (b & 15) << 2;
                    j = 2;
                    break;
                case 2:
                    chunk[i++] = b64[t | b >> 6];
                    chunk[i++] = b64[b & 63];
                    j = 0;
                    break;
            }
            if (i > 8191) {
                (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                i = 0;
            }
        }
        if (j) {
            chunk[i++] = b64[t];
            chunk[i++] = 61;
            if (j === 1)
                chunk[i++] = 61;
        }
        if (parts) {
            if (i)
                parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
            return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i));
    };

    var invalidEncoding = "invalid encoding";

    /**
     * Decodes a base64 encoded string to a buffer.
     * @param {string} string Source string
     * @param {Uint8Array} buffer Destination buffer
     * @param {number} offset Destination offset
     * @returns {number} Number of bytes written
     * @throws {Error} If encoding is invalid
     */
    base64.decode = function decode(string, buffer, offset) {
        var start = offset;
        var j = 0, // goto index
            t;     // temporary
        for (var i = 0; i < string.length;) {
            var c = string.charCodeAt(i++);
            if (c === 61 && j > 1)
                break;
            if ((c = s64[c]) === undefined)
                throw Error(invalidEncoding);
            switch (j) {
                case 0:
                    t = c;
                    j = 1;
                    break;
                case 1:
                    buffer[offset++] = t << 2 | (c & 48) >> 4;
                    t = c;
                    j = 2;
                    break;
                case 2:
                    buffer[offset++] = (t & 15) << 4 | (c & 60) >> 2;
                    t = c;
                    j = 3;
                    break;
                case 3:
                    buffer[offset++] = (t & 3) << 6 | c;
                    j = 0;
                    break;
            }
        }
        if (j === 1)
            throw Error(invalidEncoding);
        return offset - start;
    };

    /**
     * Tests if the specified string appears to be base64 encoded.
     * @param {string} string String to test
     * @returns {boolean} `true` if probably base64 encoded, otherwise false
     */
    base64.test = function test(string) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string);
    };
    });

    var eventemitter = EventEmitter;

    /**
     * Constructs a new event emitter instance.
     * @classdesc A minimal event emitter.
     * @memberof util
     * @constructor
     */
    function EventEmitter() {

        /**
         * Registered listeners.
         * @type {Object.<string,*>}
         * @private
         */
        this._listeners = {};
    }

    /**
     * Registers an event listener.
     * @param {string} evt Event name
     * @param {function} fn Listener
     * @param {*} [ctx] Listener context
     * @returns {util.EventEmitter} `this`
     */
    EventEmitter.prototype.on = function on(evt, fn, ctx) {
        (this._listeners[evt] || (this._listeners[evt] = [])).push({
            fn  : fn,
            ctx : ctx || this
        });
        return this;
    };

    /**
     * Removes an event listener or any matching listeners if arguments are omitted.
     * @param {string} [evt] Event name. Removes all listeners if omitted.
     * @param {function} [fn] Listener to remove. Removes all listeners of `evt` if omitted.
     * @returns {util.EventEmitter} `this`
     */
    EventEmitter.prototype.off = function off(evt, fn) {
        if (evt === undefined)
            this._listeners = {};
        else {
            if (fn === undefined)
                this._listeners[evt] = [];
            else {
                var listeners = this._listeners[evt];
                for (var i = 0; i < listeners.length;)
                    if (listeners[i].fn === fn)
                        listeners.splice(i, 1);
                    else
                        ++i;
            }
        }
        return this;
    };

    /**
     * Emits an event by calling its listeners with the specified arguments.
     * @param {string} evt Event name
     * @param {...*} args Arguments
     * @returns {util.EventEmitter} `this`
     */
    EventEmitter.prototype.emit = function emit(evt) {
        var listeners = this._listeners[evt];
        if (listeners) {
            var args = [],
                i = 1;
            for (; i < arguments.length;)
                args.push(arguments[i++]);
            for (i = 0; i < listeners.length;)
                listeners[i].fn.apply(listeners[i++].ctx, args);
        }
        return this;
    };

    var float_1 = factory(factory);

    /**
     * Reads / writes floats / doubles from / to buffers.
     * @name util.float
     * @namespace
     */

    /**
     * Writes a 32 bit float to a buffer using little endian byte order.
     * @name util.float.writeFloatLE
     * @function
     * @param {number} val Value to write
     * @param {Uint8Array} buf Target buffer
     * @param {number} pos Target buffer offset
     * @returns {undefined}
     */

    /**
     * Writes a 32 bit float to a buffer using big endian byte order.
     * @name util.float.writeFloatBE
     * @function
     * @param {number} val Value to write
     * @param {Uint8Array} buf Target buffer
     * @param {number} pos Target buffer offset
     * @returns {undefined}
     */

    /**
     * Reads a 32 bit float from a buffer using little endian byte order.
     * @name util.float.readFloatLE
     * @function
     * @param {Uint8Array} buf Source buffer
     * @param {number} pos Source buffer offset
     * @returns {number} Value read
     */

    /**
     * Reads a 32 bit float from a buffer using big endian byte order.
     * @name util.float.readFloatBE
     * @function
     * @param {Uint8Array} buf Source buffer
     * @param {number} pos Source buffer offset
     * @returns {number} Value read
     */

    /**
     * Writes a 64 bit double to a buffer using little endian byte order.
     * @name util.float.writeDoubleLE
     * @function
     * @param {number} val Value to write
     * @param {Uint8Array} buf Target buffer
     * @param {number} pos Target buffer offset
     * @returns {undefined}
     */

    /**
     * Writes a 64 bit double to a buffer using big endian byte order.
     * @name util.float.writeDoubleBE
     * @function
     * @param {number} val Value to write
     * @param {Uint8Array} buf Target buffer
     * @param {number} pos Target buffer offset
     * @returns {undefined}
     */

    /**
     * Reads a 64 bit double from a buffer using little endian byte order.
     * @name util.float.readDoubleLE
     * @function
     * @param {Uint8Array} buf Source buffer
     * @param {number} pos Source buffer offset
     * @returns {number} Value read
     */

    /**
     * Reads a 64 bit double from a buffer using big endian byte order.
     * @name util.float.readDoubleBE
     * @function
     * @param {Uint8Array} buf Source buffer
     * @param {number} pos Source buffer offset
     * @returns {number} Value read
     */

    // Factory function for the purpose of node-based testing in modified global environments
    function factory(exports) {

        // float: typed array
        if (typeof Float32Array !== "undefined") (function() {

            var f32 = new Float32Array([ -0 ]),
                f8b = new Uint8Array(f32.buffer),
                le  = f8b[3] === 128;

            function writeFloat_f32_cpy(val, buf, pos) {
                f32[0] = val;
                buf[pos    ] = f8b[0];
                buf[pos + 1] = f8b[1];
                buf[pos + 2] = f8b[2];
                buf[pos + 3] = f8b[3];
            }

            function writeFloat_f32_rev(val, buf, pos) {
                f32[0] = val;
                buf[pos    ] = f8b[3];
                buf[pos + 1] = f8b[2];
                buf[pos + 2] = f8b[1];
                buf[pos + 3] = f8b[0];
            }

            /* istanbul ignore next */
            exports.writeFloatLE = le ? writeFloat_f32_cpy : writeFloat_f32_rev;
            /* istanbul ignore next */
            exports.writeFloatBE = le ? writeFloat_f32_rev : writeFloat_f32_cpy;

            function readFloat_f32_cpy(buf, pos) {
                f8b[0] = buf[pos    ];
                f8b[1] = buf[pos + 1];
                f8b[2] = buf[pos + 2];
                f8b[3] = buf[pos + 3];
                return f32[0];
            }

            function readFloat_f32_rev(buf, pos) {
                f8b[3] = buf[pos    ];
                f8b[2] = buf[pos + 1];
                f8b[1] = buf[pos + 2];
                f8b[0] = buf[pos + 3];
                return f32[0];
            }

            /* istanbul ignore next */
            exports.readFloatLE = le ? readFloat_f32_cpy : readFloat_f32_rev;
            /* istanbul ignore next */
            exports.readFloatBE = le ? readFloat_f32_rev : readFloat_f32_cpy;

        // float: ieee754
        })(); else (function() {

            function writeFloat_ieee754(writeUint, val, buf, pos) {
                var sign = val < 0 ? 1 : 0;
                if (sign)
                    val = -val;
                if (val === 0)
                    writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos);
                else if (isNaN(val))
                    writeUint(2143289344, buf, pos);
                else if (val > 3.4028234663852886e+38) // +-Infinity
                    writeUint((sign << 31 | 2139095040) >>> 0, buf, pos);
                else if (val < 1.1754943508222875e-38) // denormal
                    writeUint((sign << 31 | Math.round(val / 1.401298464324817e-45)) >>> 0, buf, pos);
                else {
                    var exponent = Math.floor(Math.log(val) / Math.LN2),
                        mantissa = Math.round(val * Math.pow(2, -exponent) * 8388608) & 8388607;
                    writeUint((sign << 31 | exponent + 127 << 23 | mantissa) >>> 0, buf, pos);
                }
            }

            exports.writeFloatLE = writeFloat_ieee754.bind(null, writeUintLE);
            exports.writeFloatBE = writeFloat_ieee754.bind(null, writeUintBE);

            function readFloat_ieee754(readUint, buf, pos) {
                var uint = readUint(buf, pos),
                    sign = (uint >> 31) * 2 + 1,
                    exponent = uint >>> 23 & 255,
                    mantissa = uint & 8388607;
                return exponent === 255
                    ? mantissa
                    ? NaN
                    : sign * Infinity
                    : exponent === 0 // denormal
                    ? sign * 1.401298464324817e-45 * mantissa
                    : sign * Math.pow(2, exponent - 150) * (mantissa + 8388608);
            }

            exports.readFloatLE = readFloat_ieee754.bind(null, readUintLE);
            exports.readFloatBE = readFloat_ieee754.bind(null, readUintBE);

        })();

        // double: typed array
        if (typeof Float64Array !== "undefined") (function() {

            var f64 = new Float64Array([-0]),
                f8b = new Uint8Array(f64.buffer),
                le  = f8b[7] === 128;

            function writeDouble_f64_cpy(val, buf, pos) {
                f64[0] = val;
                buf[pos    ] = f8b[0];
                buf[pos + 1] = f8b[1];
                buf[pos + 2] = f8b[2];
                buf[pos + 3] = f8b[3];
                buf[pos + 4] = f8b[4];
                buf[pos + 5] = f8b[5];
                buf[pos + 6] = f8b[6];
                buf[pos + 7] = f8b[7];
            }

            function writeDouble_f64_rev(val, buf, pos) {
                f64[0] = val;
                buf[pos    ] = f8b[7];
                buf[pos + 1] = f8b[6];
                buf[pos + 2] = f8b[5];
                buf[pos + 3] = f8b[4];
                buf[pos + 4] = f8b[3];
                buf[pos + 5] = f8b[2];
                buf[pos + 6] = f8b[1];
                buf[pos + 7] = f8b[0];
            }

            /* istanbul ignore next */
            exports.writeDoubleLE = le ? writeDouble_f64_cpy : writeDouble_f64_rev;
            /* istanbul ignore next */
            exports.writeDoubleBE = le ? writeDouble_f64_rev : writeDouble_f64_cpy;

            function readDouble_f64_cpy(buf, pos) {
                f8b[0] = buf[pos    ];
                f8b[1] = buf[pos + 1];
                f8b[2] = buf[pos + 2];
                f8b[3] = buf[pos + 3];
                f8b[4] = buf[pos + 4];
                f8b[5] = buf[pos + 5];
                f8b[6] = buf[pos + 6];
                f8b[7] = buf[pos + 7];
                return f64[0];
            }

            function readDouble_f64_rev(buf, pos) {
                f8b[7] = buf[pos    ];
                f8b[6] = buf[pos + 1];
                f8b[5] = buf[pos + 2];
                f8b[4] = buf[pos + 3];
                f8b[3] = buf[pos + 4];
                f8b[2] = buf[pos + 5];
                f8b[1] = buf[pos + 6];
                f8b[0] = buf[pos + 7];
                return f64[0];
            }

            /* istanbul ignore next */
            exports.readDoubleLE = le ? readDouble_f64_cpy : readDouble_f64_rev;
            /* istanbul ignore next */
            exports.readDoubleBE = le ? readDouble_f64_rev : readDouble_f64_cpy;

        // double: ieee754
        })(); else (function() {

            function writeDouble_ieee754(writeUint, off0, off1, val, buf, pos) {
                var sign = val < 0 ? 1 : 0;
                if (sign)
                    val = -val;
                if (val === 0) {
                    writeUint(0, buf, pos + off0);
                    writeUint(1 / val > 0 ? /* positive */ 0 : /* negative 0 */ 2147483648, buf, pos + off1);
                } else if (isNaN(val)) {
                    writeUint(0, buf, pos + off0);
                    writeUint(2146959360, buf, pos + off1);
                } else if (val > 1.7976931348623157e+308) { // +-Infinity
                    writeUint(0, buf, pos + off0);
                    writeUint((sign << 31 | 2146435072) >>> 0, buf, pos + off1);
                } else {
                    var mantissa;
                    if (val < 2.2250738585072014e-308) { // denormal
                        mantissa = val / 5e-324;
                        writeUint(mantissa >>> 0, buf, pos + off0);
                        writeUint((sign << 31 | mantissa / 4294967296) >>> 0, buf, pos + off1);
                    } else {
                        var exponent = Math.floor(Math.log(val) / Math.LN2);
                        if (exponent === 1024)
                            exponent = 1023;
                        mantissa = val * Math.pow(2, -exponent);
                        writeUint(mantissa * 4503599627370496 >>> 0, buf, pos + off0);
                        writeUint((sign << 31 | exponent + 1023 << 20 | mantissa * 1048576 & 1048575) >>> 0, buf, pos + off1);
                    }
                }
            }

            exports.writeDoubleLE = writeDouble_ieee754.bind(null, writeUintLE, 0, 4);
            exports.writeDoubleBE = writeDouble_ieee754.bind(null, writeUintBE, 4, 0);

            function readDouble_ieee754(readUint, off0, off1, buf, pos) {
                var lo = readUint(buf, pos + off0),
                    hi = readUint(buf, pos + off1);
                var sign = (hi >> 31) * 2 + 1,
                    exponent = hi >>> 20 & 2047,
                    mantissa = 4294967296 * (hi & 1048575) + lo;
                return exponent === 2047
                    ? mantissa
                    ? NaN
                    : sign * Infinity
                    : exponent === 0 // denormal
                    ? sign * 5e-324 * mantissa
                    : sign * Math.pow(2, exponent - 1075) * (mantissa + 4503599627370496);
            }

            exports.readDoubleLE = readDouble_ieee754.bind(null, readUintLE, 0, 4);
            exports.readDoubleBE = readDouble_ieee754.bind(null, readUintBE, 4, 0);

        })();

        return exports;
    }

    // uint helpers

    function writeUintLE(val, buf, pos) {
        buf[pos    ] =  val        & 255;
        buf[pos + 1] =  val >>> 8  & 255;
        buf[pos + 2] =  val >>> 16 & 255;
        buf[pos + 3] =  val >>> 24;
    }

    function writeUintBE(val, buf, pos) {
        buf[pos    ] =  val >>> 24;
        buf[pos + 1] =  val >>> 16 & 255;
        buf[pos + 2] =  val >>> 8  & 255;
        buf[pos + 3] =  val        & 255;
    }

    function readUintLE(buf, pos) {
        return (buf[pos    ]
              | buf[pos + 1] << 8
              | buf[pos + 2] << 16
              | buf[pos + 3] << 24) >>> 0;
    }

    function readUintBE(buf, pos) {
        return (buf[pos    ] << 24
              | buf[pos + 1] << 16
              | buf[pos + 2] << 8
              | buf[pos + 3]) >>> 0;
    }

    var inquire_1 = inquire;

    /**
     * Requires a module only if available.
     * @memberof util
     * @param {string} moduleName Module to require
     * @returns {?Object} Required module if available and not empty, otherwise `null`
     */
    function inquire(moduleName) {
        try {
            var mod = eval("quire".replace(/^/,"re"))(moduleName); // eslint-disable-line no-eval
            if (mod && (mod.length || Object.keys(mod).length))
                return mod;
        } catch (e) {} // eslint-disable-line no-empty
        return null;
    }

    var utf8_1 = createCommonjsModule(function (module, exports) {

    /**
     * A minimal UTF8 implementation for number arrays.
     * @memberof util
     * @namespace
     */
    var utf8 = exports;

    /**
     * Calculates the UTF8 byte length of a string.
     * @param {string} string String
     * @returns {number} Byte length
     */
    utf8.length = function utf8_length(string) {
        var len = 0,
            c = 0;
        for (var i = 0; i < string.length; ++i) {
            c = string.charCodeAt(i);
            if (c < 128)
                len += 1;
            else if (c < 2048)
                len += 2;
            else if ((c & 0xFC00) === 0xD800 && (string.charCodeAt(i + 1) & 0xFC00) === 0xDC00) {
                ++i;
                len += 4;
            } else
                len += 3;
        }
        return len;
    };

    /**
     * Reads UTF8 bytes as a string.
     * @param {Uint8Array} buffer Source buffer
     * @param {number} start Source start
     * @param {number} end Source end
     * @returns {string} String read
     */
    utf8.read = function utf8_read(buffer, start, end) {
        var len = end - start;
        if (len < 1)
            return "";
        var parts = null,
            chunk = [],
            i = 0, // char offset
            t;     // temporary
        while (start < end) {
            t = buffer[start++];
            if (t < 128)
                chunk[i++] = t;
            else if (t > 191 && t < 224)
                chunk[i++] = (t & 31) << 6 | buffer[start++] & 63;
            else if (t > 239 && t < 365) {
                t = ((t & 7) << 18 | (buffer[start++] & 63) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63) - 0x10000;
                chunk[i++] = 0xD800 + (t >> 10);
                chunk[i++] = 0xDC00 + (t & 1023);
            } else
                chunk[i++] = (t & 15) << 12 | (buffer[start++] & 63) << 6 | buffer[start++] & 63;
            if (i > 8191) {
                (parts || (parts = [])).push(String.fromCharCode.apply(String, chunk));
                i = 0;
            }
        }
        if (parts) {
            if (i)
                parts.push(String.fromCharCode.apply(String, chunk.slice(0, i)));
            return parts.join("");
        }
        return String.fromCharCode.apply(String, chunk.slice(0, i));
    };

    /**
     * Writes a string as UTF8 bytes.
     * @param {string} string Source string
     * @param {Uint8Array} buffer Destination buffer
     * @param {number} offset Destination offset
     * @returns {number} Bytes written
     */
    utf8.write = function utf8_write(string, buffer, offset) {
        var start = offset,
            c1, // character 1
            c2; // character 2
        for (var i = 0; i < string.length; ++i) {
            c1 = string.charCodeAt(i);
            if (c1 < 128) {
                buffer[offset++] = c1;
            } else if (c1 < 2048) {
                buffer[offset++] = c1 >> 6       | 192;
                buffer[offset++] = c1       & 63 | 128;
            } else if ((c1 & 0xFC00) === 0xD800 && ((c2 = string.charCodeAt(i + 1)) & 0xFC00) === 0xDC00) {
                c1 = 0x10000 + ((c1 & 0x03FF) << 10) + (c2 & 0x03FF);
                ++i;
                buffer[offset++] = c1 >> 18      | 240;
                buffer[offset++] = c1 >> 12 & 63 | 128;
                buffer[offset++] = c1 >> 6  & 63 | 128;
                buffer[offset++] = c1       & 63 | 128;
            } else {
                buffer[offset++] = c1 >> 12      | 224;
                buffer[offset++] = c1 >> 6  & 63 | 128;
                buffer[offset++] = c1       & 63 | 128;
            }
        }
        return offset - start;
    };
    });

    var pool_1 = pool;

    /**
     * An allocator as used by {@link util.pool}.
     * @typedef PoolAllocator
     * @type {function}
     * @param {number} size Buffer size
     * @returns {Uint8Array} Buffer
     */

    /**
     * A slicer as used by {@link util.pool}.
     * @typedef PoolSlicer
     * @type {function}
     * @param {number} start Start offset
     * @param {number} end End offset
     * @returns {Uint8Array} Buffer slice
     * @this {Uint8Array}
     */

    /**
     * A general purpose buffer pool.
     * @memberof util
     * @function
     * @param {PoolAllocator} alloc Allocator
     * @param {PoolSlicer} slice Slicer
     * @param {number} [size=8192] Slab size
     * @returns {PoolAllocator} Pooled allocator
     */
    function pool(alloc, slice, size) {
        var SIZE   = size || 8192;
        var MAX    = SIZE >>> 1;
        var slab   = null;
        var offset = SIZE;
        return function pool_alloc(size) {
            if (size < 1 || size > MAX)
                return alloc(size);
            if (offset + size > SIZE) {
                slab = alloc(SIZE);
                offset = 0;
            }
            var buf = slice.call(slab, offset, offset += size);
            if (offset & 7) // align to 32 bit
                offset = (offset | 7) + 1;
            return buf;
        };
    }

    var longbits = LongBits;



    /**
     * Constructs new long bits.
     * @classdesc Helper class for working with the low and high bits of a 64 bit value.
     * @memberof util
     * @constructor
     * @param {number} lo Low 32 bits, unsigned
     * @param {number} hi High 32 bits, unsigned
     */
    function LongBits(lo, hi) {

        // note that the casts below are theoretically unnecessary as of today, but older statically
        // generated converter code might still call the ctor with signed 32bits. kept for compat.

        /**
         * Low bits.
         * @type {number}
         */
        this.lo = lo >>> 0;

        /**
         * High bits.
         * @type {number}
         */
        this.hi = hi >>> 0;
    }

    /**
     * Zero bits.
     * @memberof util.LongBits
     * @type {util.LongBits}
     */
    var zero = LongBits.zero = new LongBits(0, 0);

    zero.toNumber = function() { return 0; };
    zero.zzEncode = zero.zzDecode = function() { return this; };
    zero.length = function() { return 1; };

    /**
     * Zero hash.
     * @memberof util.LongBits
     * @type {string}
     */
    var zeroHash = LongBits.zeroHash = "\0\0\0\0\0\0\0\0";

    /**
     * Constructs new long bits from the specified number.
     * @param {number} value Value
     * @returns {util.LongBits} Instance
     */
    LongBits.fromNumber = function fromNumber(value) {
        if (value === 0)
            return zero;
        var sign = value < 0;
        if (sign)
            value = -value;
        var lo = value >>> 0,
            hi = (value - lo) / 4294967296 >>> 0;
        if (sign) {
            hi = ~hi >>> 0;
            lo = ~lo >>> 0;
            if (++lo > 4294967295) {
                lo = 0;
                if (++hi > 4294967295)
                    hi = 0;
            }
        }
        return new LongBits(lo, hi);
    };

    /**
     * Constructs new long bits from a number, long or string.
     * @param {Long|number|string} value Value
     * @returns {util.LongBits} Instance
     */
    LongBits.from = function from(value) {
        if (typeof value === "number")
            return LongBits.fromNumber(value);
        if (minimal.isString(value)) {
            /* istanbul ignore else */
            if (minimal.Long)
                value = minimal.Long.fromString(value);
            else
                return LongBits.fromNumber(parseInt(value, 10));
        }
        return value.low || value.high ? new LongBits(value.low >>> 0, value.high >>> 0) : zero;
    };

    /**
     * Converts this long bits to a possibly unsafe JavaScript number.
     * @param {boolean} [unsigned=false] Whether unsigned or not
     * @returns {number} Possibly unsafe number
     */
    LongBits.prototype.toNumber = function toNumber(unsigned) {
        if (!unsigned && this.hi >>> 31) {
            var lo = ~this.lo + 1 >>> 0,
                hi = ~this.hi     >>> 0;
            if (!lo)
                hi = hi + 1 >>> 0;
            return -(lo + hi * 4294967296);
        }
        return this.lo + this.hi * 4294967296;
    };

    /**
     * Converts this long bits to a long.
     * @param {boolean} [unsigned=false] Whether unsigned or not
     * @returns {Long} Long
     */
    LongBits.prototype.toLong = function toLong(unsigned) {
        return minimal.Long
            ? new minimal.Long(this.lo | 0, this.hi | 0, Boolean(unsigned))
            /* istanbul ignore next */
            : { low: this.lo | 0, high: this.hi | 0, unsigned: Boolean(unsigned) };
    };

    var charCodeAt = String.prototype.charCodeAt;

    /**
     * Constructs new long bits from the specified 8 characters long hash.
     * @param {string} hash Hash
     * @returns {util.LongBits} Bits
     */
    LongBits.fromHash = function fromHash(hash) {
        if (hash === zeroHash)
            return zero;
        return new LongBits(
            ( charCodeAt.call(hash, 0)
            | charCodeAt.call(hash, 1) << 8
            | charCodeAt.call(hash, 2) << 16
            | charCodeAt.call(hash, 3) << 24) >>> 0
        ,
            ( charCodeAt.call(hash, 4)
            | charCodeAt.call(hash, 5) << 8
            | charCodeAt.call(hash, 6) << 16
            | charCodeAt.call(hash, 7) << 24) >>> 0
        );
    };

    /**
     * Converts this long bits to a 8 characters long hash.
     * @returns {string} Hash
     */
    LongBits.prototype.toHash = function toHash() {
        return String.fromCharCode(
            this.lo        & 255,
            this.lo >>> 8  & 255,
            this.lo >>> 16 & 255,
            this.lo >>> 24      ,
            this.hi        & 255,
            this.hi >>> 8  & 255,
            this.hi >>> 16 & 255,
            this.hi >>> 24
        );
    };

    /**
     * Zig-zag encodes this long bits.
     * @returns {util.LongBits} `this`
     */
    LongBits.prototype.zzEncode = function zzEncode() {
        var mask =   this.hi >> 31;
        this.hi  = ((this.hi << 1 | this.lo >>> 31) ^ mask) >>> 0;
        this.lo  = ( this.lo << 1                   ^ mask) >>> 0;
        return this;
    };

    /**
     * Zig-zag decodes this long bits.
     * @returns {util.LongBits} `this`
     */
    LongBits.prototype.zzDecode = function zzDecode() {
        var mask = -(this.lo & 1);
        this.lo  = ((this.lo >>> 1 | this.hi << 31) ^ mask) >>> 0;
        this.hi  = ( this.hi >>> 1                  ^ mask) >>> 0;
        return this;
    };

    /**
     * Calculates the length of this longbits when encoded as a varint.
     * @returns {number} Length
     */
    LongBits.prototype.length = function length() {
        var part0 =  this.lo,
            part1 = (this.lo >>> 28 | this.hi << 4) >>> 0,
            part2 =  this.hi >>> 24;
        return part2 === 0
             ? part1 === 0
               ? part0 < 16384
                 ? part0 < 128 ? 1 : 2
                 : part0 < 2097152 ? 3 : 4
               : part1 < 16384
                 ? part1 < 128 ? 5 : 6
                 : part1 < 2097152 ? 7 : 8
             : part2 < 128 ? 9 : 10;
    };

    var minimal = createCommonjsModule(function (module, exports) {
    var util = exports;

    // used to return a Promise where callback is omitted
    util.asPromise = aspromise;

    // converts to / from base64 encoded strings
    util.base64 = base64_1;

    // base class of rpc.Service
    util.EventEmitter = eventemitter;

    // float handling accross browsers
    util.float = float_1;

    // requires modules optionally and hides the call from bundlers
    util.inquire = inquire_1;

    // converts to / from utf8 encoded strings
    util.utf8 = utf8_1;

    // provides a node-like buffer pool in the browser
    util.pool = pool_1;

    // utility to work with the low and high bits of a 64 bit value
    util.LongBits = longbits;

    /**
     * An immuable empty array.
     * @memberof util
     * @type {Array.<*>}
     * @const
     */
    util.emptyArray = Object.freeze ? Object.freeze([]) : /* istanbul ignore next */ []; // used on prototypes

    /**
     * An immutable empty object.
     * @type {Object}
     * @const
     */
    util.emptyObject = Object.freeze ? Object.freeze({}) : /* istanbul ignore next */ {}; // used on prototypes

    /**
     * Whether running within node or not.
     * @memberof util
     * @type {boolean}
     * @const
     */
    util.isNode = Boolean(commonjsGlobal.process && commonjsGlobal.process.versions && commonjsGlobal.process.versions.node);

    /**
     * Tests if the specified value is an integer.
     * @function
     * @param {*} value Value to test
     * @returns {boolean} `true` if the value is an integer
     */
    util.isInteger = Number.isInteger || /* istanbul ignore next */ function isInteger(value) {
        return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
    };

    /**
     * Tests if the specified value is a string.
     * @param {*} value Value to test
     * @returns {boolean} `true` if the value is a string
     */
    util.isString = function isString(value) {
        return typeof value === "string" || value instanceof String;
    };

    /**
     * Tests if the specified value is a non-null object.
     * @param {*} value Value to test
     * @returns {boolean} `true` if the value is a non-null object
     */
    util.isObject = function isObject(value) {
        return value && typeof value === "object";
    };

    /**
     * Checks if a property on a message is considered to be present.
     * This is an alias of {@link util.isSet}.
     * @function
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util.isset =

    /**
     * Checks if a property on a message is considered to be present.
     * @param {Object} obj Plain object or message instance
     * @param {string} prop Property name
     * @returns {boolean} `true` if considered to be present, otherwise `false`
     */
    util.isSet = function isSet(obj, prop) {
        var value = obj[prop];
        if (value != null && obj.hasOwnProperty(prop)) // eslint-disable-line eqeqeq, no-prototype-builtins
            return typeof value !== "object" || (Array.isArray(value) ? value.length : Object.keys(value).length) > 0;
        return false;
    };

    /**
     * Any compatible Buffer instance.
     * This is a minimal stand-alone definition of a Buffer instance. The actual type is that exported by node's typings.
     * @interface Buffer
     * @extends Uint8Array
     */

    /**
     * Node's Buffer class if available.
     * @type {Constructor<Buffer>}
     */
    util.Buffer = (function() {
        try {
            var Buffer = util.inquire("buffer").Buffer;
            // refuse to use non-node buffers if not explicitly assigned (perf reasons):
            return Buffer.prototype.utf8Write ? Buffer : /* istanbul ignore next */ null;
        } catch (e) {
            /* istanbul ignore next */
            return null;
        }
    })();

    // Internal alias of or polyfull for Buffer.from.
    util._Buffer_from = null;

    // Internal alias of or polyfill for Buffer.allocUnsafe.
    util._Buffer_allocUnsafe = null;

    /**
     * Creates a new buffer of whatever type supported by the environment.
     * @param {number|number[]} [sizeOrArray=0] Buffer size or number array
     * @returns {Uint8Array|Buffer} Buffer
     */
    util.newBuffer = function newBuffer(sizeOrArray) {
        /* istanbul ignore next */
        return typeof sizeOrArray === "number"
            ? util.Buffer
                ? util._Buffer_allocUnsafe(sizeOrArray)
                : new util.Array(sizeOrArray)
            : util.Buffer
                ? util._Buffer_from(sizeOrArray)
                : typeof Uint8Array === "undefined"
                    ? sizeOrArray
                    : new Uint8Array(sizeOrArray);
    };

    /**
     * Array implementation used in the browser. `Uint8Array` if supported, otherwise `Array`.
     * @type {Constructor<Uint8Array>}
     */
    util.Array = typeof Uint8Array !== "undefined" ? Uint8Array /* istanbul ignore next */ : Array;

    /**
     * Any compatible Long instance.
     * This is a minimal stand-alone definition of a Long instance. The actual type is that exported by long.js.
     * @interface Long
     * @property {number} low Low bits
     * @property {number} high High bits
     * @property {boolean} unsigned Whether unsigned or not
     */

    /**
     * Long.js's Long class if available.
     * @type {Constructor<Long>}
     */
    util.Long = /* istanbul ignore next */ commonjsGlobal.dcodeIO && /* istanbul ignore next */ commonjsGlobal.dcodeIO.Long || util.inquire("long");

    /**
     * Regular expression used to verify 2 bit (`bool`) map keys.
     * @type {RegExp}
     * @const
     */
    util.key2Re = /^true|false|0|1$/;

    /**
     * Regular expression used to verify 32 bit (`int32` etc.) map keys.
     * @type {RegExp}
     * @const
     */
    util.key32Re = /^-?(?:0|[1-9][0-9]*)$/;

    /**
     * Regular expression used to verify 64 bit (`int64` etc.) map keys.
     * @type {RegExp}
     * @const
     */
    util.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/;

    /**
     * Converts a number or long to an 8 characters long hash string.
     * @param {Long|number} value Value to convert
     * @returns {string} Hash
     */
    util.longToHash = function longToHash(value) {
        return value
            ? util.LongBits.from(value).toHash()
            : util.LongBits.zeroHash;
    };

    /**
     * Converts an 8 characters long hash string to a long or number.
     * @param {string} hash Hash
     * @param {boolean} [unsigned=false] Whether unsigned or not
     * @returns {Long|number} Original value
     */
    util.longFromHash = function longFromHash(hash, unsigned) {
        var bits = util.LongBits.fromHash(hash);
        if (util.Long)
            return util.Long.fromBits(bits.lo, bits.hi, unsigned);
        return bits.toNumber(Boolean(unsigned));
    };

    /**
     * Merges the properties of the source object into the destination object.
     * @memberof util
     * @param {Object.<string,*>} dst Destination object
     * @param {Object.<string,*>} src Source object
     * @param {boolean} [ifNotSet=false] Merges only if the key is not already set
     * @returns {Object.<string,*>} Destination object
     */
    function merge(dst, src, ifNotSet) { // used by converters
        for (var keys = Object.keys(src), i = 0; i < keys.length; ++i)
            if (dst[keys[i]] === undefined || !ifNotSet)
                dst[keys[i]] = src[keys[i]];
        return dst;
    }

    util.merge = merge;

    /**
     * Converts the first character of a string to lower case.
     * @param {string} str String to convert
     * @returns {string} Converted string
     */
    util.lcFirst = function lcFirst(str) {
        return str.charAt(0).toLowerCase() + str.substring(1);
    };

    /**
     * Creates a custom error constructor.
     * @memberof util
     * @param {string} name Error name
     * @returns {Constructor<Error>} Custom error constructor
     */
    function newError(name) {

        function CustomError(message, properties) {

            if (!(this instanceof CustomError))
                return new CustomError(message, properties);

            // Error.call(this, message);
            // ^ just returns a new error instance because the ctor can be called as a function

            Object.defineProperty(this, "message", { get: function() { return message; } });

            /* istanbul ignore next */
            if (Error.captureStackTrace) // node
                Error.captureStackTrace(this, CustomError);
            else
                Object.defineProperty(this, "stack", { value: (new Error()).stack || "" });

            if (properties)
                merge(this, properties);
        }

        (CustomError.prototype = Object.create(Error.prototype)).constructor = CustomError;

        Object.defineProperty(CustomError.prototype, "name", { get: function() { return name; } });

        CustomError.prototype.toString = function toString() {
            return this.name + ": " + this.message;
        };

        return CustomError;
    }

    util.newError = newError;

    /**
     * Constructs a new protocol error.
     * @classdesc Error subclass indicating a protocol specifc error.
     * @memberof util
     * @extends Error
     * @template T extends Message<T>
     * @constructor
     * @param {string} message Error message
     * @param {Object.<string,*>} [properties] Additional properties
     * @example
     * try {
     *     MyMessage.decode(someBuffer); // throws if required fields are missing
     * } catch (e) {
     *     if (e instanceof ProtocolError && e.instance)
     *         console.log("decoded so far: " + JSON.stringify(e.instance));
     * }
     */
    util.ProtocolError = newError("ProtocolError");

    /**
     * So far decoded message instance.
     * @name util.ProtocolError#instance
     * @type {Message<T>}
     */

    /**
     * A OneOf getter as returned by {@link util.oneOfGetter}.
     * @typedef OneOfGetter
     * @type {function}
     * @returns {string|undefined} Set field name, if any
     */

    /**
     * Builds a getter for a oneof's present field name.
     * @param {string[]} fieldNames Field names
     * @returns {OneOfGetter} Unbound getter
     */
    util.oneOfGetter = function getOneOf(fieldNames) {
        var fieldMap = {};
        for (var i = 0; i < fieldNames.length; ++i)
            fieldMap[fieldNames[i]] = 1;

        /**
         * @returns {string|undefined} Set field name, if any
         * @this Object
         * @ignore
         */
        return function() { // eslint-disable-line consistent-return
            for (var keys = Object.keys(this), i = keys.length - 1; i > -1; --i)
                if (fieldMap[keys[i]] === 1 && this[keys[i]] !== undefined && this[keys[i]] !== null)
                    return keys[i];
        };
    };

    /**
     * A OneOf setter as returned by {@link util.oneOfSetter}.
     * @typedef OneOfSetter
     * @type {function}
     * @param {string|undefined} value Field name
     * @returns {undefined}
     */

    /**
     * Builds a setter for a oneof's present field name.
     * @param {string[]} fieldNames Field names
     * @returns {OneOfSetter} Unbound setter
     */
    util.oneOfSetter = function setOneOf(fieldNames) {

        /**
         * @param {string} name Field name
         * @returns {undefined}
         * @this Object
         * @ignore
         */
        return function(name) {
            for (var i = 0; i < fieldNames.length; ++i)
                if (fieldNames[i] !== name)
                    delete this[fieldNames[i]];
        };
    };

    /**
     * Default conversion options used for {@link Message#toJSON} implementations.
     *
     * These options are close to proto3's JSON mapping with the exception that internal types like Any are handled just like messages. More precisely:
     *
     * - Longs become strings
     * - Enums become string keys
     * - Bytes become base64 encoded strings
     * - (Sub-)Messages become plain objects
     * - Maps become plain objects with all string keys
     * - Repeated fields become arrays
     * - NaN and Infinity for float and double fields become strings
     *
     * @type {IConversionOptions}
     * @see https://developers.google.com/protocol-buffers/docs/proto3?hl=en#json
     */
    util.toJSONOptions = {
        longs: String,
        enums: String,
        bytes: String,
        json: true
    };

    util._configure = function() {
        var Buffer = util.Buffer;
        /* istanbul ignore if */
        if (!Buffer) {
            util._Buffer_from = util._Buffer_allocUnsafe = null;
            return;
        }
        // because node 4.x buffers are incompatible & immutable
        // see: https://github.com/dcodeIO/protobuf.js/pull/665
        util._Buffer_from = Buffer.from !== Uint8Array.from && Buffer.from ||
            /* istanbul ignore next */
            function Buffer_from(value, encoding) {
                return new Buffer(value, encoding);
            };
        util._Buffer_allocUnsafe = Buffer.allocUnsafe ||
            /* istanbul ignore next */
            function Buffer_allocUnsafe(size) {
                return new Buffer(size);
            };
    };
    });

    var writer = Writer;



    var BufferWriter; // cyclic

    var LongBits$1  = minimal.LongBits,
        base64    = minimal.base64,
        utf8      = minimal.utf8;

    /**
     * Constructs a new writer operation instance.
     * @classdesc Scheduled writer operation.
     * @constructor
     * @param {function(*, Uint8Array, number)} fn Function to call
     * @param {number} len Value byte length
     * @param {*} val Value to write
     * @ignore
     */
    function Op(fn, len, val) {

        /**
         * Function to call.
         * @type {function(Uint8Array, number, *)}
         */
        this.fn = fn;

        /**
         * Value byte length.
         * @type {number}
         */
        this.len = len;

        /**
         * Next operation.
         * @type {Writer.Op|undefined}
         */
        this.next = undefined;

        /**
         * Value to write.
         * @type {*}
         */
        this.val = val; // type varies
    }

    /* istanbul ignore next */
    function noop() {} // eslint-disable-line no-empty-function

    /**
     * Constructs a new writer state instance.
     * @classdesc Copied writer state.
     * @memberof Writer
     * @constructor
     * @param {Writer} writer Writer to copy state from
     * @ignore
     */
    function State(writer) {

        /**
         * Current head.
         * @type {Writer.Op}
         */
        this.head = writer.head;

        /**
         * Current tail.
         * @type {Writer.Op}
         */
        this.tail = writer.tail;

        /**
         * Current buffer length.
         * @type {number}
         */
        this.len = writer.len;

        /**
         * Next state.
         * @type {State|null}
         */
        this.next = writer.states;
    }

    /**
     * Constructs a new writer instance.
     * @classdesc Wire format writer using `Uint8Array` if available, otherwise `Array`.
     * @constructor
     */
    function Writer() {

        /**
         * Current length.
         * @type {number}
         */
        this.len = 0;

        /**
         * Operations head.
         * @type {Object}
         */
        this.head = new Op(noop, 0, 0);

        /**
         * Operations tail
         * @type {Object}
         */
        this.tail = this.head;

        /**
         * Linked forked states.
         * @type {Object|null}
         */
        this.states = null;

        // When a value is written, the writer calculates its byte length and puts it into a linked
        // list of operations to perform when finish() is called. This both allows us to allocate
        // buffers of the exact required size and reduces the amount of work we have to do compared
        // to first calculating over objects and then encoding over objects. In our case, the encoding
        // part is just a linked list walk calling operations with already prepared values.
    }

    /**
     * Creates a new writer.
     * @function
     * @returns {BufferWriter|Writer} A {@link BufferWriter} when Buffers are supported, otherwise a {@link Writer}
     */
    Writer.create = minimal.Buffer
        ? function create_buffer_setup() {
            return (Writer.create = function create_buffer() {
                return new BufferWriter();
            })();
        }
        /* istanbul ignore next */
        : function create_array() {
            return new Writer();
        };

    /**
     * Allocates a buffer of the specified size.
     * @param {number} size Buffer size
     * @returns {Uint8Array} Buffer
     */
    Writer.alloc = function alloc(size) {
        return new minimal.Array(size);
    };

    // Use Uint8Array buffer pool in the browser, just like node does with buffers
    /* istanbul ignore else */
    if (minimal.Array !== Array)
        Writer.alloc = minimal.pool(Writer.alloc, minimal.Array.prototype.subarray);

    /**
     * Pushes a new operation to the queue.
     * @param {function(Uint8Array, number, *)} fn Function to call
     * @param {number} len Value byte length
     * @param {number} val Value to write
     * @returns {Writer} `this`
     * @private
     */
    Writer.prototype._push = function push(fn, len, val) {
        this.tail = this.tail.next = new Op(fn, len, val);
        this.len += len;
        return this;
    };

    function writeByte(val, buf, pos) {
        buf[pos] = val & 255;
    }

    function writeVarint32(val, buf, pos) {
        while (val > 127) {
            buf[pos++] = val & 127 | 128;
            val >>>= 7;
        }
        buf[pos] = val;
    }

    /**
     * Constructs a new varint writer operation instance.
     * @classdesc Scheduled varint writer operation.
     * @extends Op
     * @constructor
     * @param {number} len Value byte length
     * @param {number} val Value to write
     * @ignore
     */
    function VarintOp(len, val) {
        this.len = len;
        this.next = undefined;
        this.val = val;
    }

    VarintOp.prototype = Object.create(Op.prototype);
    VarintOp.prototype.fn = writeVarint32;

    /**
     * Writes an unsigned 32 bit value as a varint.
     * @param {number} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.uint32 = function write_uint32(value) {
        // here, the call to this.push has been inlined and a varint specific Op subclass is used.
        // uint32 is by far the most frequently used operation and benefits significantly from this.
        this.len += (this.tail = this.tail.next = new VarintOp(
            (value = value >>> 0)
                    < 128       ? 1
            : value < 16384     ? 2
            : value < 2097152   ? 3
            : value < 268435456 ? 4
            :                     5,
        value)).len;
        return this;
    };

    /**
     * Writes a signed 32 bit value as a varint.
     * @function
     * @param {number} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.int32 = function write_int32(value) {
        return value < 0
            ? this._push(writeVarint64, 10, LongBits$1.fromNumber(value)) // 10 bytes per spec
            : this.uint32(value);
    };

    /**
     * Writes a 32 bit value as a varint, zig-zag encoded.
     * @param {number} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.sint32 = function write_sint32(value) {
        return this.uint32((value << 1 ^ value >> 31) >>> 0);
    };

    function writeVarint64(val, buf, pos) {
        while (val.hi) {
            buf[pos++] = val.lo & 127 | 128;
            val.lo = (val.lo >>> 7 | val.hi << 25) >>> 0;
            val.hi >>>= 7;
        }
        while (val.lo > 127) {
            buf[pos++] = val.lo & 127 | 128;
            val.lo = val.lo >>> 7;
        }
        buf[pos++] = val.lo;
    }

    /**
     * Writes an unsigned 64 bit value as a varint.
     * @param {Long|number|string} value Value to write
     * @returns {Writer} `this`
     * @throws {TypeError} If `value` is a string and no long library is present.
     */
    Writer.prototype.uint64 = function write_uint64(value) {
        var bits = LongBits$1.from(value);
        return this._push(writeVarint64, bits.length(), bits);
    };

    /**
     * Writes a signed 64 bit value as a varint.
     * @function
     * @param {Long|number|string} value Value to write
     * @returns {Writer} `this`
     * @throws {TypeError} If `value` is a string and no long library is present.
     */
    Writer.prototype.int64 = Writer.prototype.uint64;

    /**
     * Writes a signed 64 bit value as a varint, zig-zag encoded.
     * @param {Long|number|string} value Value to write
     * @returns {Writer} `this`
     * @throws {TypeError} If `value` is a string and no long library is present.
     */
    Writer.prototype.sint64 = function write_sint64(value) {
        var bits = LongBits$1.from(value).zzEncode();
        return this._push(writeVarint64, bits.length(), bits);
    };

    /**
     * Writes a boolish value as a varint.
     * @param {boolean} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.bool = function write_bool(value) {
        return this._push(writeByte, 1, value ? 1 : 0);
    };

    function writeFixed32(val, buf, pos) {
        buf[pos    ] =  val         & 255;
        buf[pos + 1] =  val >>> 8   & 255;
        buf[pos + 2] =  val >>> 16  & 255;
        buf[pos + 3] =  val >>> 24;
    }

    /**
     * Writes an unsigned 32 bit value as fixed 32 bits.
     * @param {number} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.fixed32 = function write_fixed32(value) {
        return this._push(writeFixed32, 4, value >>> 0);
    };

    /**
     * Writes a signed 32 bit value as fixed 32 bits.
     * @function
     * @param {number} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.sfixed32 = Writer.prototype.fixed32;

    /**
     * Writes an unsigned 64 bit value as fixed 64 bits.
     * @param {Long|number|string} value Value to write
     * @returns {Writer} `this`
     * @throws {TypeError} If `value` is a string and no long library is present.
     */
    Writer.prototype.fixed64 = function write_fixed64(value) {
        var bits = LongBits$1.from(value);
        return this._push(writeFixed32, 4, bits.lo)._push(writeFixed32, 4, bits.hi);
    };

    /**
     * Writes a signed 64 bit value as fixed 64 bits.
     * @function
     * @param {Long|number|string} value Value to write
     * @returns {Writer} `this`
     * @throws {TypeError} If `value` is a string and no long library is present.
     */
    Writer.prototype.sfixed64 = Writer.prototype.fixed64;

    /**
     * Writes a float (32 bit).
     * @function
     * @param {number} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.float = function write_float(value) {
        return this._push(minimal.float.writeFloatLE, 4, value);
    };

    /**
     * Writes a double (64 bit float).
     * @function
     * @param {number} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.double = function write_double(value) {
        return this._push(minimal.float.writeDoubleLE, 8, value);
    };

    var writeBytes = minimal.Array.prototype.set
        ? function writeBytes_set(val, buf, pos) {
            buf.set(val, pos); // also works for plain array values
        }
        /* istanbul ignore next */
        : function writeBytes_for(val, buf, pos) {
            for (var i = 0; i < val.length; ++i)
                buf[pos + i] = val[i];
        };

    /**
     * Writes a sequence of bytes.
     * @param {Uint8Array|string} value Buffer or base64 encoded string to write
     * @returns {Writer} `this`
     */
    Writer.prototype.bytes = function write_bytes(value) {
        var len = value.length >>> 0;
        if (!len)
            return this._push(writeByte, 1, 0);
        if (minimal.isString(value)) {
            var buf = Writer.alloc(len = base64.length(value));
            base64.decode(value, buf, 0);
            value = buf;
        }
        return this.uint32(len)._push(writeBytes, len, value);
    };

    /**
     * Writes a string.
     * @param {string} value Value to write
     * @returns {Writer} `this`
     */
    Writer.prototype.string = function write_string(value) {
        var len = utf8.length(value);
        return len
            ? this.uint32(len)._push(utf8.write, len, value)
            : this._push(writeByte, 1, 0);
    };

    /**
     * Forks this writer's state by pushing it to a stack.
     * Calling {@link Writer#reset|reset} or {@link Writer#ldelim|ldelim} resets the writer to the previous state.
     * @returns {Writer} `this`
     */
    Writer.prototype.fork = function fork() {
        this.states = new State(this);
        this.head = this.tail = new Op(noop, 0, 0);
        this.len = 0;
        return this;
    };

    /**
     * Resets this instance to the last state.
     * @returns {Writer} `this`
     */
    Writer.prototype.reset = function reset() {
        if (this.states) {
            this.head   = this.states.head;
            this.tail   = this.states.tail;
            this.len    = this.states.len;
            this.states = this.states.next;
        } else {
            this.head = this.tail = new Op(noop, 0, 0);
            this.len  = 0;
        }
        return this;
    };

    /**
     * Resets to the last state and appends the fork state's current write length as a varint followed by its operations.
     * @returns {Writer} `this`
     */
    Writer.prototype.ldelim = function ldelim() {
        var head = this.head,
            tail = this.tail,
            len  = this.len;
        this.reset().uint32(len);
        if (len) {
            this.tail.next = head.next; // skip noop
            this.tail = tail;
            this.len += len;
        }
        return this;
    };

    /**
     * Finishes the write operation.
     * @returns {Uint8Array} Finished buffer
     */
    Writer.prototype.finish = function finish() {
        var head = this.head.next, // skip noop
            buf  = this.constructor.alloc(this.len),
            pos  = 0;
        while (head) {
            head.fn(head.val, buf, pos);
            pos += head.len;
            head = head.next;
        }
        // this.head = this.tail = null;
        return buf;
    };

    Writer._configure = function(BufferWriter_) {
        BufferWriter = BufferWriter_;
    };

    var writer_buffer = BufferWriter$1;

    // extends Writer

    (BufferWriter$1.prototype = Object.create(writer.prototype)).constructor = BufferWriter$1;



    var Buffer = minimal.Buffer;

    /**
     * Constructs a new buffer writer instance.
     * @classdesc Wire format writer using node buffers.
     * @extends Writer
     * @constructor
     */
    function BufferWriter$1() {
        writer.call(this);
    }

    /**
     * Allocates a buffer of the specified size.
     * @param {number} size Buffer size
     * @returns {Buffer} Buffer
     */
    BufferWriter$1.alloc = function alloc_buffer(size) {
        return (BufferWriter$1.alloc = minimal._Buffer_allocUnsafe)(size);
    };

    var writeBytesBuffer = Buffer && Buffer.prototype instanceof Uint8Array && Buffer.prototype.set.name === "set"
        ? function writeBytesBuffer_set(val, buf, pos) {
            buf.set(val, pos); // faster than copy (requires node >= 4 where Buffers extend Uint8Array and set is properly inherited)
                               // also works for plain array values
        }
        /* istanbul ignore next */
        : function writeBytesBuffer_copy(val, buf, pos) {
            if (val.copy) // Buffer values
                val.copy(buf, pos, 0, val.length);
            else for (var i = 0; i < val.length;) // plain array values
                buf[pos++] = val[i++];
        };

    /**
     * @override
     */
    BufferWriter$1.prototype.bytes = function write_bytes_buffer(value) {
        if (minimal.isString(value))
            value = minimal._Buffer_from(value, "base64");
        var len = value.length >>> 0;
        this.uint32(len);
        if (len)
            this._push(writeBytesBuffer, len, value);
        return this;
    };

    function writeStringBuffer(val, buf, pos) {
        if (val.length < 40) // plain js is faster for short strings (probably due to redundant assertions)
            minimal.utf8.write(val, buf, pos);
        else
            buf.utf8Write(val, pos);
    }

    /**
     * @override
     */
    BufferWriter$1.prototype.string = function write_string_buffer(value) {
        var len = Buffer.byteLength(value);
        this.uint32(len);
        if (len)
            this._push(writeStringBuffer, len, value);
        return this;
    };

    var reader = Reader;



    var BufferReader; // cyclic

    var LongBits$2  = minimal.LongBits,
        utf8$1      = minimal.utf8;

    /* istanbul ignore next */
    function indexOutOfRange(reader, writeLength) {
        return RangeError("index out of range: " + reader.pos + " + " + (writeLength || 1) + " > " + reader.len);
    }

    /**
     * Constructs a new reader instance using the specified buffer.
     * @classdesc Wire format reader using `Uint8Array` if available, otherwise `Array`.
     * @constructor
     * @param {Uint8Array} buffer Buffer to read from
     */
    function Reader(buffer) {

        /**
         * Read buffer.
         * @type {Uint8Array}
         */
        this.buf = buffer;

        /**
         * Read buffer position.
         * @type {number}
         */
        this.pos = 0;

        /**
         * Read buffer length.
         * @type {number}
         */
        this.len = buffer.length;
    }

    var create_array = typeof Uint8Array !== "undefined"
        ? function create_typed_array(buffer) {
            if (buffer instanceof Uint8Array || Array.isArray(buffer))
                return new Reader(buffer);
            throw Error("illegal buffer");
        }
        /* istanbul ignore next */
        : function create_array(buffer) {
            if (Array.isArray(buffer))
                return new Reader(buffer);
            throw Error("illegal buffer");
        };

    /**
     * Creates a new reader using the specified buffer.
     * @function
     * @param {Uint8Array|Buffer} buffer Buffer to read from
     * @returns {Reader|BufferReader} A {@link BufferReader} if `buffer` is a Buffer, otherwise a {@link Reader}
     * @throws {Error} If `buffer` is not a valid buffer
     */
    Reader.create = minimal.Buffer
        ? function create_buffer_setup(buffer) {
            return (Reader.create = function create_buffer(buffer) {
                return minimal.Buffer.isBuffer(buffer)
                    ? new BufferReader(buffer)
                    /* istanbul ignore next */
                    : create_array(buffer);
            })(buffer);
        }
        /* istanbul ignore next */
        : create_array;

    Reader.prototype._slice = minimal.Array.prototype.subarray || /* istanbul ignore next */ minimal.Array.prototype.slice;

    /**
     * Reads a varint as an unsigned 32 bit value.
     * @function
     * @returns {number} Value read
     */
    Reader.prototype.uint32 = (function read_uint32_setup() {
        var value = 4294967295; // optimizer type-hint, tends to deopt otherwise (?!)
        return function read_uint32() {
            value = (         this.buf[this.pos] & 127       ) >>> 0; if (this.buf[this.pos++] < 128) return value;
            value = (value | (this.buf[this.pos] & 127) <<  7) >>> 0; if (this.buf[this.pos++] < 128) return value;
            value = (value | (this.buf[this.pos] & 127) << 14) >>> 0; if (this.buf[this.pos++] < 128) return value;
            value = (value | (this.buf[this.pos] & 127) << 21) >>> 0; if (this.buf[this.pos++] < 128) return value;
            value = (value | (this.buf[this.pos] &  15) << 28) >>> 0; if (this.buf[this.pos++] < 128) return value;

            /* istanbul ignore if */
            if ((this.pos += 5) > this.len) {
                this.pos = this.len;
                throw indexOutOfRange(this, 10);
            }
            return value;
        };
    })();

    /**
     * Reads a varint as a signed 32 bit value.
     * @returns {number} Value read
     */
    Reader.prototype.int32 = function read_int32() {
        return this.uint32() | 0;
    };

    /**
     * Reads a zig-zag encoded varint as a signed 32 bit value.
     * @returns {number} Value read
     */
    Reader.prototype.sint32 = function read_sint32() {
        var value = this.uint32();
        return value >>> 1 ^ -(value & 1) | 0;
    };

    /* eslint-disable no-invalid-this */

    function readLongVarint() {
        // tends to deopt with local vars for octet etc.
        var bits = new LongBits$2(0, 0);
        var i = 0;
        if (this.len - this.pos > 4) { // fast route (lo)
            for (; i < 4; ++i) {
                // 1st..4th
                bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
                if (this.buf[this.pos++] < 128)
                    return bits;
            }
            // 5th
            bits.lo = (bits.lo | (this.buf[this.pos] & 127) << 28) >>> 0;
            bits.hi = (bits.hi | (this.buf[this.pos] & 127) >>  4) >>> 0;
            if (this.buf[this.pos++] < 128)
                return bits;
            i = 0;
        } else {
            for (; i < 3; ++i) {
                /* istanbul ignore if */
                if (this.pos >= this.len)
                    throw indexOutOfRange(this);
                // 1st..3th
                bits.lo = (bits.lo | (this.buf[this.pos] & 127) << i * 7) >>> 0;
                if (this.buf[this.pos++] < 128)
                    return bits;
            }
            // 4th
            bits.lo = (bits.lo | (this.buf[this.pos++] & 127) << i * 7) >>> 0;
            return bits;
        }
        if (this.len - this.pos > 4) { // fast route (hi)
            for (; i < 5; ++i) {
                // 6th..10th
                bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
                if (this.buf[this.pos++] < 128)
                    return bits;
            }
        } else {
            for (; i < 5; ++i) {
                /* istanbul ignore if */
                if (this.pos >= this.len)
                    throw indexOutOfRange(this);
                // 6th..10th
                bits.hi = (bits.hi | (this.buf[this.pos] & 127) << i * 7 + 3) >>> 0;
                if (this.buf[this.pos++] < 128)
                    return bits;
            }
        }
        /* istanbul ignore next */
        throw Error("invalid varint encoding");
    }

    /* eslint-enable no-invalid-this */

    /**
     * Reads a varint as a signed 64 bit value.
     * @name Reader#int64
     * @function
     * @returns {Long} Value read
     */

    /**
     * Reads a varint as an unsigned 64 bit value.
     * @name Reader#uint64
     * @function
     * @returns {Long} Value read
     */

    /**
     * Reads a zig-zag encoded varint as a signed 64 bit value.
     * @name Reader#sint64
     * @function
     * @returns {Long} Value read
     */

    /**
     * Reads a varint as a boolean.
     * @returns {boolean} Value read
     */
    Reader.prototype.bool = function read_bool() {
        return this.uint32() !== 0;
    };

    function readFixed32_end(buf, end) { // note that this uses `end`, not `pos`
        return (buf[end - 4]
              | buf[end - 3] << 8
              | buf[end - 2] << 16
              | buf[end - 1] << 24) >>> 0;
    }

    /**
     * Reads fixed 32 bits as an unsigned 32 bit integer.
     * @returns {number} Value read
     */
    Reader.prototype.fixed32 = function read_fixed32() {

        /* istanbul ignore if */
        if (this.pos + 4 > this.len)
            throw indexOutOfRange(this, 4);

        return readFixed32_end(this.buf, this.pos += 4);
    };

    /**
     * Reads fixed 32 bits as a signed 32 bit integer.
     * @returns {number} Value read
     */
    Reader.prototype.sfixed32 = function read_sfixed32() {

        /* istanbul ignore if */
        if (this.pos + 4 > this.len)
            throw indexOutOfRange(this, 4);

        return readFixed32_end(this.buf, this.pos += 4) | 0;
    };

    /* eslint-disable no-invalid-this */

    function readFixed64(/* this: Reader */) {

        /* istanbul ignore if */
        if (this.pos + 8 > this.len)
            throw indexOutOfRange(this, 8);

        return new LongBits$2(readFixed32_end(this.buf, this.pos += 4), readFixed32_end(this.buf, this.pos += 4));
    }

    /* eslint-enable no-invalid-this */

    /**
     * Reads fixed 64 bits.
     * @name Reader#fixed64
     * @function
     * @returns {Long} Value read
     */

    /**
     * Reads zig-zag encoded fixed 64 bits.
     * @name Reader#sfixed64
     * @function
     * @returns {Long} Value read
     */

    /**
     * Reads a float (32 bit) as a number.
     * @function
     * @returns {number} Value read
     */
    Reader.prototype.float = function read_float() {

        /* istanbul ignore if */
        if (this.pos + 4 > this.len)
            throw indexOutOfRange(this, 4);

        var value = minimal.float.readFloatLE(this.buf, this.pos);
        this.pos += 4;
        return value;
    };

    /**
     * Reads a double (64 bit float) as a number.
     * @function
     * @returns {number} Value read
     */
    Reader.prototype.double = function read_double() {

        /* istanbul ignore if */
        if (this.pos + 8 > this.len)
            throw indexOutOfRange(this, 4);

        var value = minimal.float.readDoubleLE(this.buf, this.pos);
        this.pos += 8;
        return value;
    };

    /**
     * Reads a sequence of bytes preceeded by its length as a varint.
     * @returns {Uint8Array} Value read
     */
    Reader.prototype.bytes = function read_bytes() {
        var length = this.uint32(),
            start  = this.pos,
            end    = this.pos + length;

        /* istanbul ignore if */
        if (end > this.len)
            throw indexOutOfRange(this, length);

        this.pos += length;
        if (Array.isArray(this.buf)) // plain array
            return this.buf.slice(start, end);
        return start === end // fix for IE 10/Win8 and others' subarray returning array of size 1
            ? new this.buf.constructor(0)
            : this._slice.call(this.buf, start, end);
    };

    /**
     * Reads a string preceeded by its byte length as a varint.
     * @returns {string} Value read
     */
    Reader.prototype.string = function read_string() {
        var bytes = this.bytes();
        return utf8$1.read(bytes, 0, bytes.length);
    };

    /**
     * Skips the specified number of bytes if specified, otherwise skips a varint.
     * @param {number} [length] Length if known, otherwise a varint is assumed
     * @returns {Reader} `this`
     */
    Reader.prototype.skip = function skip(length) {
        if (typeof length === "number") {
            /* istanbul ignore if */
            if (this.pos + length > this.len)
                throw indexOutOfRange(this, length);
            this.pos += length;
        } else {
            do {
                /* istanbul ignore if */
                if (this.pos >= this.len)
                    throw indexOutOfRange(this);
            } while (this.buf[this.pos++] & 128);
        }
        return this;
    };

    /**
     * Skips the next element of the specified wire type.
     * @param {number} wireType Wire type received
     * @returns {Reader} `this`
     */
    Reader.prototype.skipType = function(wireType) {
        switch (wireType) {
            case 0:
                this.skip();
                break;
            case 1:
                this.skip(8);
                break;
            case 2:
                this.skip(this.uint32());
                break;
            case 3:
                do { // eslint-disable-line no-constant-condition
                    if ((wireType = this.uint32() & 7) === 4)
                        break;
                    this.skipType(wireType);
                } while (true);
                break;
            case 5:
                this.skip(4);
                break;

            /* istanbul ignore next */
            default:
                throw Error("invalid wire type " + wireType + " at offset " + this.pos);
        }
        return this;
    };

    Reader._configure = function(BufferReader_) {
        BufferReader = BufferReader_;

        var fn = minimal.Long ? "toLong" : /* istanbul ignore next */ "toNumber";
        minimal.merge(Reader.prototype, {

            int64: function read_int64() {
                return readLongVarint.call(this)[fn](false);
            },

            uint64: function read_uint64() {
                return readLongVarint.call(this)[fn](true);
            },

            sint64: function read_sint64() {
                return readLongVarint.call(this).zzDecode()[fn](false);
            },

            fixed64: function read_fixed64() {
                return readFixed64.call(this)[fn](true);
            },

            sfixed64: function read_sfixed64() {
                return readFixed64.call(this)[fn](false);
            }

        });
    };

    var reader_buffer = BufferReader$1;

    // extends Reader

    (BufferReader$1.prototype = Object.create(reader.prototype)).constructor = BufferReader$1;



    /**
     * Constructs a new buffer reader instance.
     * @classdesc Wire format reader using node buffers.
     * @extends Reader
     * @constructor
     * @param {Buffer} buffer Buffer to read from
     */
    function BufferReader$1(buffer) {
        reader.call(this, buffer);

        /**
         * Read buffer.
         * @name BufferReader#buf
         * @type {Buffer}
         */
    }

    /* istanbul ignore else */
    if (minimal.Buffer)
        BufferReader$1.prototype._slice = minimal.Buffer.prototype.slice;

    /**
     * @override
     */
    BufferReader$1.prototype.string = function read_string_buffer() {
        var len = this.uint32(); // modifies pos
        return this.buf.utf8Slice(this.pos, this.pos = Math.min(this.pos + len, this.len));
    };

    var service = Service;



    // Extends EventEmitter
    (Service.prototype = Object.create(minimal.EventEmitter.prototype)).constructor = Service;

    /**
     * A service method callback as used by {@link rpc.ServiceMethod|ServiceMethod}.
     *
     * Differs from {@link RPCImplCallback} in that it is an actual callback of a service method which may not return `response = null`.
     * @typedef rpc.ServiceMethodCallback
     * @template TRes extends Message<TRes>
     * @type {function}
     * @param {Error|null} error Error, if any
     * @param {TRes} [response] Response message
     * @returns {undefined}
     */

    /**
     * A service method part of a {@link rpc.Service} as created by {@link Service.create}.
     * @typedef rpc.ServiceMethod
     * @template TReq extends Message<TReq>
     * @template TRes extends Message<TRes>
     * @type {function}
     * @param {TReq|Properties<TReq>} request Request message or plain object
     * @param {rpc.ServiceMethodCallback<TRes>} [callback] Node-style callback called with the error, if any, and the response message
     * @returns {Promise<Message<TRes>>} Promise if `callback` has been omitted, otherwise `undefined`
     */

    /**
     * Constructs a new RPC service instance.
     * @classdesc An RPC service as returned by {@link Service#create}.
     * @exports rpc.Service
     * @extends util.EventEmitter
     * @constructor
     * @param {RPCImpl} rpcImpl RPC implementation
     * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
     * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
     */
    function Service(rpcImpl, requestDelimited, responseDelimited) {

        if (typeof rpcImpl !== "function")
            throw TypeError("rpcImpl must be a function");

        minimal.EventEmitter.call(this);

        /**
         * RPC implementation. Becomes `null` once the service is ended.
         * @type {RPCImpl|null}
         */
        this.rpcImpl = rpcImpl;

        /**
         * Whether requests are length-delimited.
         * @type {boolean}
         */
        this.requestDelimited = Boolean(requestDelimited);

        /**
         * Whether responses are length-delimited.
         * @type {boolean}
         */
        this.responseDelimited = Boolean(responseDelimited);
    }

    /**
     * Calls a service method through {@link rpc.Service#rpcImpl|rpcImpl}.
     * @param {Method|rpc.ServiceMethod<TReq,TRes>} method Reflected or static method
     * @param {Constructor<TReq>} requestCtor Request constructor
     * @param {Constructor<TRes>} responseCtor Response constructor
     * @param {TReq|Properties<TReq>} request Request message or plain object
     * @param {rpc.ServiceMethodCallback<TRes>} callback Service callback
     * @returns {undefined}
     * @template TReq extends Message<TReq>
     * @template TRes extends Message<TRes>
     */
    Service.prototype.rpcCall = function rpcCall(method, requestCtor, responseCtor, request, callback) {

        if (!request)
            throw TypeError("request must be specified");

        var self = this;
        if (!callback)
            return minimal.asPromise(rpcCall, self, method, requestCtor, responseCtor, request);

        if (!self.rpcImpl) {
            setTimeout(function() { callback(Error("already ended")); }, 0);
            return undefined;
        }

        try {
            return self.rpcImpl(
                method,
                requestCtor[self.requestDelimited ? "encodeDelimited" : "encode"](request).finish(),
                function rpcCallback(err, response) {

                    if (err) {
                        self.emit("error", err, method);
                        return callback(err);
                    }

                    if (response === null) {
                        self.end(/* endedByRPC */ true);
                        return undefined;
                    }

                    if (!(response instanceof responseCtor)) {
                        try {
                            response = responseCtor[self.responseDelimited ? "decodeDelimited" : "decode"](response);
                        } catch (err) {
                            self.emit("error", err, method);
                            return callback(err);
                        }
                    }

                    self.emit("data", response, method);
                    return callback(null, response);
                }
            );
        } catch (err) {
            self.emit("error", err, method);
            setTimeout(function() { callback(err); }, 0);
            return undefined;
        }
    };

    /**
     * Ends this service and emits the `end` event.
     * @param {boolean} [endedByRPC=false] Whether the service has been ended by the RPC implementation.
     * @returns {rpc.Service} `this`
     */
    Service.prototype.end = function end(endedByRPC) {
        if (this.rpcImpl) {
            if (!endedByRPC) // signal end to rpcImpl
                this.rpcImpl(null, null, null);
            this.rpcImpl = null;
            this.emit("end").off();
        }
        return this;
    };

    var rpc_1 = createCommonjsModule(function (module, exports) {

    /**
     * Streaming RPC helpers.
     * @namespace
     */
    var rpc = exports;

    /**
     * RPC implementation passed to {@link Service#create} performing a service request on network level, i.e. by utilizing http requests or websockets.
     * @typedef RPCImpl
     * @type {function}
     * @param {Method|rpc.ServiceMethod<Message<{}>,Message<{}>>} method Reflected or static method being called
     * @param {Uint8Array} requestData Request data
     * @param {RPCImplCallback} callback Callback function
     * @returns {undefined}
     * @example
     * function rpcImpl(method, requestData, callback) {
     *     if (protobuf.util.lcFirst(method.name) !== "myMethod") // compatible with static code
     *         throw Error("no such method");
     *     asynchronouslyObtainAResponse(requestData, function(err, responseData) {
     *         callback(err, responseData);
     *     });
     * }
     */

    /**
     * Node-style callback as used by {@link RPCImpl}.
     * @typedef RPCImplCallback
     * @type {function}
     * @param {Error|null} error Error, if any, otherwise `null`
     * @param {Uint8Array|null} [response] Response data or `null` to signal end of stream, if there hasn't been an error
     * @returns {undefined}
     */

    rpc.Service = service;
    });

    var roots = {};

    var indexMinimal = createCommonjsModule(function (module, exports) {
    var protobuf = exports;

    /**
     * Build type, one of `"full"`, `"light"` or `"minimal"`.
     * @name build
     * @type {string}
     * @const
     */
    protobuf.build = "minimal";

    // Serialization
    protobuf.Writer       = writer;
    protobuf.BufferWriter = writer_buffer;
    protobuf.Reader       = reader;
    protobuf.BufferReader = reader_buffer;

    // Utility
    protobuf.util         = minimal;
    protobuf.rpc          = rpc_1;
    protobuf.roots        = roots;
    protobuf.configure    = configure;

    /* istanbul ignore next */
    /**
     * Reconfigures the library according to the environment.
     * @returns {undefined}
     */
    function configure() {
        protobuf.Reader._configure(protobuf.BufferReader);
        protobuf.util._configure();
    }

    // Configure serialization
    protobuf.Writer._configure(protobuf.BufferWriter);
    configure();
    });

    var minimal$1 = indexMinimal;
    var minimal_1 = minimal$1.roots;
    var minimal_2 = minimal$1.Reader;
    var minimal_3 = minimal$1.util;

    var $Reader = minimal$1.Reader, $util = minimal$1.util;

    var $root = minimal$1.roots["default"] || (minimal$1.roots["default"] = {});

    $root.tensorflow = (function() {

        var tensorflow = {};

        tensorflow.Any = (function() {

            function Any(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            Any.prototype.typeUrl = "";
            Any.prototype.value = $util.newBuffer([]);

            Any.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.Any();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.typeUrl = r.string();
                        break;
                    case 2:
                        m.value = r.bytes();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return Any;
        })();

        tensorflow.DataType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DT_INVALID"] = 0;
            values[valuesById[1] = "DT_FLOAT"] = 1;
            values[valuesById[2] = "DT_DOUBLE"] = 2;
            values[valuesById[3] = "DT_INT32"] = 3;
            values[valuesById[4] = "DT_UINT8"] = 4;
            values[valuesById[5] = "DT_INT16"] = 5;
            values[valuesById[6] = "DT_INT8"] = 6;
            values[valuesById[7] = "DT_STRING"] = 7;
            values[valuesById[8] = "DT_COMPLEX64"] = 8;
            values[valuesById[9] = "DT_INT64"] = 9;
            values[valuesById[10] = "DT_BOOL"] = 10;
            values[valuesById[11] = "DT_QINT8"] = 11;
            values[valuesById[12] = "DT_QUINT8"] = 12;
            values[valuesById[13] = "DT_QINT32"] = 13;
            values[valuesById[14] = "DT_BFLOAT16"] = 14;
            values[valuesById[101] = "DT_FLOAT_REF"] = 101;
            values[valuesById[102] = "DT_DOUBLE_REF"] = 102;
            values[valuesById[103] = "DT_INT32_REF"] = 103;
            values[valuesById[104] = "DT_UINT8_REF"] = 104;
            values[valuesById[105] = "DT_INT16_REF"] = 105;
            values[valuesById[106] = "DT_INT8_REF"] = 106;
            values[valuesById[107] = "DT_STRING_REF"] = 107;
            values[valuesById[108] = "DT_COMPLEX64_REF"] = 108;
            values[valuesById[109] = "DT_INT64_REF"] = 109;
            values[valuesById[110] = "DT_BOOL_REF"] = 110;
            values[valuesById[111] = "DT_QINT8_REF"] = 111;
            values[valuesById[112] = "DT_QUINT8_REF"] = 112;
            values[valuesById[113] = "DT_QINT32_REF"] = 113;
            values[valuesById[114] = "DT_BFLOAT16_REF"] = 114;
            return values;
        })();

        tensorflow.TensorShape = (function() {

            function TensorShape(p) {
                this.dim = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            TensorShape.prototype.dim = $util.emptyArray;
            TensorShape.prototype.unknownRank = false;

            TensorShape.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.TensorShape();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 2:
                        if (!(m.dim && m.dim.length))
                            m.dim = [];
                        m.dim.push($root.tensorflow.TensorShape.Dim.decode(r, r.uint32()));
                        break;
                    case 3:
                        m.unknownRank = r.bool();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            TensorShape.Dim = (function() {

                function Dim(p) {
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                Dim.prototype.size = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                Dim.prototype.name = "";

                Dim.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.TensorShape.Dim();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            m.size = r.int64();
                            break;
                        case 2:
                            m.name = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return Dim;
            })();

            return TensorShape;
        })();

        tensorflow.Tensor = (function() {

            function Tensor(p) {
                this.floatVal = [];
                this.doubleVal = [];
                this.intVal = [];
                this.stringVal = [];
                this.scomplexVal = [];
                this.int64Val = [];
                this.boolVal = [];
                this.uint32Val = [];
                this.uint64Val = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            Tensor.prototype.dtype = 0;
            Tensor.prototype.tensorShape = null;
            Tensor.prototype.versionNumber = 0;
            Tensor.prototype.tensorContent = $util.newBuffer([]);
            Tensor.prototype.floatVal = $util.emptyArray;
            Tensor.prototype.doubleVal = $util.emptyArray;
            Tensor.prototype.intVal = $util.emptyArray;
            Tensor.prototype.stringVal = $util.emptyArray;
            Tensor.prototype.scomplexVal = $util.emptyArray;
            Tensor.prototype.int64Val = $util.emptyArray;
            Tensor.prototype.boolVal = $util.emptyArray;
            Tensor.prototype.uint32Val = $util.emptyArray;
            Tensor.prototype.uint64Val = $util.emptyArray;

            Tensor.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.Tensor();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.dtype = r.int32();
                        break;
                    case 2:
                        m.tensorShape = $root.tensorflow.TensorShape.decode(r, r.uint32());
                        break;
                    case 3:
                        m.versionNumber = r.int32();
                        break;
                    case 4:
                        m.tensorContent = r.bytes();
                        break;
                    case 5:
                        if (!(m.floatVal && m.floatVal.length))
                            m.floatVal = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.floatVal.push(r.float());
                        } else
                            m.floatVal.push(r.float());
                        break;
                    case 6:
                        if (!(m.doubleVal && m.doubleVal.length))
                            m.doubleVal = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.doubleVal.push(r.double());
                        } else
                            m.doubleVal.push(r.double());
                        break;
                    case 7:
                        if (!(m.intVal && m.intVal.length))
                            m.intVal = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.intVal.push(r.int32());
                        } else
                            m.intVal.push(r.int32());
                        break;
                    case 8:
                        if (!(m.stringVal && m.stringVal.length))
                            m.stringVal = [];
                        m.stringVal.push(r.bytes());
                        break;
                    case 9:
                        if (!(m.scomplexVal && m.scomplexVal.length))
                            m.scomplexVal = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.scomplexVal.push(r.float());
                        } else
                            m.scomplexVal.push(r.float());
                        break;
                    case 10:
                        if (!(m.int64Val && m.int64Val.length))
                            m.int64Val = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.int64Val.push(r.int64());
                        } else
                            m.int64Val.push(r.int64());
                        break;
                    case 11:
                        if (!(m.boolVal && m.boolVal.length))
                            m.boolVal = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.boolVal.push(r.bool());
                        } else
                            m.boolVal.push(r.bool());
                        break;
                    case 16:
                        if (!(m.uint32Val && m.uint32Val.length))
                            m.uint32Val = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.uint32Val.push(r.uint32());
                        } else
                            m.uint32Val.push(r.uint32());
                        break;
                    case 17:
                        if (!(m.uint64Val && m.uint64Val.length))
                            m.uint64Val = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.uint64Val.push(r.uint64());
                        } else
                            m.uint64Val.push(r.uint64());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return Tensor;
        })();

        tensorflow.AttrValue = (function() {

            function AttrValue(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            AttrValue.prototype.list = null;
            AttrValue.prototype.s = $util.newBuffer([]);
            AttrValue.prototype.i = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
            AttrValue.prototype.f = 0;
            AttrValue.prototype.b = false;
            AttrValue.prototype.type = 0;
            AttrValue.prototype.shape = null;
            AttrValue.prototype.tensor = null;
            AttrValue.prototype.placeholder = "";
            AttrValue.prototype.func = null;

            var $oneOfFields;

            Object.defineProperty(AttrValue.prototype, "value", {
                get: $util.oneOfGetter($oneOfFields = ["list", "s", "i", "f", "b", "type", "shape", "tensor", "placeholder", "func"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            AttrValue.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.AttrValue();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.list = $root.tensorflow.AttrValue.ListValue.decode(r, r.uint32());
                        break;
                    case 2:
                        m.s = r.bytes();
                        break;
                    case 3:
                        m.i = r.int64();
                        break;
                    case 4:
                        m.f = r.float();
                        break;
                    case 5:
                        m.b = r.bool();
                        break;
                    case 6:
                        m.type = r.int32();
                        break;
                    case 7:
                        m.shape = $root.tensorflow.TensorShape.decode(r, r.uint32());
                        break;
                    case 8:
                        m.tensor = $root.tensorflow.Tensor.decode(r, r.uint32());
                        break;
                    case 9:
                        m.placeholder = r.string();
                        break;
                    case 10:
                        m.func = $root.tensorflow.NameAttrList.decode(r, r.uint32());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            AttrValue.ListValue = (function() {

                function ListValue(p) {
                    this.s = [];
                    this.i = [];
                    this.f = [];
                    this.b = [];
                    this.type = [];
                    this.shape = [];
                    this.tensor = [];
                    this.func = [];
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                ListValue.prototype.s = $util.emptyArray;
                ListValue.prototype.i = $util.emptyArray;
                ListValue.prototype.f = $util.emptyArray;
                ListValue.prototype.b = $util.emptyArray;
                ListValue.prototype.type = $util.emptyArray;
                ListValue.prototype.shape = $util.emptyArray;
                ListValue.prototype.tensor = $util.emptyArray;
                ListValue.prototype.func = $util.emptyArray;

                ListValue.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.AttrValue.ListValue();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 2:
                            if (!(m.s && m.s.length))
                                m.s = [];
                            m.s.push(r.bytes());
                            break;
                        case 3:
                            if (!(m.i && m.i.length))
                                m.i = [];
                            if ((t & 7) === 2) {
                                var c2 = r.uint32() + r.pos;
                                while (r.pos < c2)
                                    m.i.push(r.int64());
                            } else
                                m.i.push(r.int64());
                            break;
                        case 4:
                            if (!(m.f && m.f.length))
                                m.f = [];
                            if ((t & 7) === 2) {
                                var c2 = r.uint32() + r.pos;
                                while (r.pos < c2)
                                    m.f.push(r.float());
                            } else
                                m.f.push(r.float());
                            break;
                        case 5:
                            if (!(m.b && m.b.length))
                                m.b = [];
                            if ((t & 7) === 2) {
                                var c2 = r.uint32() + r.pos;
                                while (r.pos < c2)
                                    m.b.push(r.bool());
                            } else
                                m.b.push(r.bool());
                            break;
                        case 6:
                            if (!(m.type && m.type.length))
                                m.type = [];
                            if ((t & 7) === 2) {
                                var c2 = r.uint32() + r.pos;
                                while (r.pos < c2)
                                    m.type.push(r.int32());
                            } else
                                m.type.push(r.int32());
                            break;
                        case 7:
                            if (!(m.shape && m.shape.length))
                                m.shape = [];
                            m.shape.push($root.tensorflow.TensorShape.decode(r, r.uint32()));
                            break;
                        case 8:
                            if (!(m.tensor && m.tensor.length))
                                m.tensor = [];
                            m.tensor.push($root.tensorflow.Tensor.decode(r, r.uint32()));
                            break;
                        case 9:
                            if (!(m.func && m.func.length))
                                m.func = [];
                            m.func.push($root.tensorflow.NameAttrList.decode(r, r.uint32()));
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return ListValue;
            })();

            return AttrValue;
        })();

        tensorflow.NameAttrList = (function() {

            function NameAttrList(p) {
                this.attr = {};
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            NameAttrList.prototype.name = "";
            NameAttrList.prototype.attr = $util.emptyObject;

            NameAttrList.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.NameAttrList(), k;
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.name = r.string();
                        break;
                    case 2:
                        r.skip().pos++;
                        if (m.attr === $util.emptyObject)
                            m.attr = {};
                        k = r.string();
                        r.pos++;
                        m.attr[k] = $root.tensorflow.AttrValue.decode(r, r.uint32());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return NameAttrList;
        })();

        tensorflow.NodeDef = (function() {

            function NodeDef(p) {
                this.input = [];
                this.attr = {};
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            NodeDef.prototype.name = "";
            NodeDef.prototype.op = "";
            NodeDef.prototype.input = $util.emptyArray;
            NodeDef.prototype.device = "";
            NodeDef.prototype.attr = $util.emptyObject;

            NodeDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.NodeDef(), k;
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.name = r.string();
                        break;
                    case 2:
                        m.op = r.string();
                        break;
                    case 3:
                        if (!(m.input && m.input.length))
                            m.input = [];
                        m.input.push(r.string());
                        break;
                    case 4:
                        m.device = r.string();
                        break;
                    case 5:
                        r.skip().pos++;
                        if (m.attr === $util.emptyObject)
                            m.attr = {};
                        k = r.string();
                        r.pos++;
                        m.attr[k] = $root.tensorflow.AttrValue.decode(r, r.uint32());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return NodeDef;
        })();

        tensorflow.VersionDef = (function() {

            function VersionDef(p) {
                this.badConsumers = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            VersionDef.prototype.producer = 0;
            VersionDef.prototype.minConsumer = 0;
            VersionDef.prototype.badConsumers = $util.emptyArray;

            VersionDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.VersionDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.producer = r.int32();
                        break;
                    case 2:
                        m.minConsumer = r.int32();
                        break;
                    case 3:
                        if (!(m.badConsumers && m.badConsumers.length))
                            m.badConsumers = [];
                        if ((t & 7) === 2) {
                            var c2 = r.uint32() + r.pos;
                            while (r.pos < c2)
                                m.badConsumers.push(r.int32());
                        } else
                            m.badConsumers.push(r.int32());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return VersionDef;
        })();

        tensorflow.GraphDef = (function() {

            function GraphDef(p) {
                this.node = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            GraphDef.prototype.node = $util.emptyArray;
            GraphDef.prototype.versions = null;
            GraphDef.prototype.library = null;

            GraphDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.GraphDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        if (!(m.node && m.node.length))
                            m.node = [];
                        m.node.push($root.tensorflow.NodeDef.decode(r, r.uint32()));
                        break;
                    case 4:
                        m.versions = $root.tensorflow.VersionDef.decode(r, r.uint32());
                        break;
                    case 2:
                        m.library = $root.tensorflow.FunctionDefLibrary.decode(r, r.uint32());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return GraphDef;
        })();

        tensorflow.CollectionDef = (function() {

            function CollectionDef(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            CollectionDef.prototype.nodeList = null;
            CollectionDef.prototype.bytesList = null;
            CollectionDef.prototype.int64List = null;
            CollectionDef.prototype.floatList = null;
            CollectionDef.prototype.anyList = null;

            var $oneOfFields;

            Object.defineProperty(CollectionDef.prototype, "kind", {
                get: $util.oneOfGetter($oneOfFields = ["nodeList", "bytesList", "int64List", "floatList", "anyList"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            CollectionDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.nodeList = $root.tensorflow.CollectionDef.NodeList.decode(r, r.uint32());
                        break;
                    case 2:
                        m.bytesList = $root.tensorflow.CollectionDef.BytesList.decode(r, r.uint32());
                        break;
                    case 3:
                        m.int64List = $root.tensorflow.CollectionDef.Int64List.decode(r, r.uint32());
                        break;
                    case 4:
                        m.floatList = $root.tensorflow.CollectionDef.FloatList.decode(r, r.uint32());
                        break;
                    case 5:
                        m.anyList = $root.tensorflow.CollectionDef.AnyList.decode(r, r.uint32());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            CollectionDef.NodeList = (function() {

                function NodeList(p) {
                    this.value = [];
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                NodeList.prototype.value = $util.emptyArray;

                NodeList.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.NodeList();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            if (!(m.value && m.value.length))
                                m.value = [];
                            m.value.push(r.string());
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return NodeList;
            })();

            CollectionDef.BytesList = (function() {

                function BytesList(p) {
                    this.value = [];
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                BytesList.prototype.value = $util.emptyArray;

                BytesList.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.BytesList();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            if (!(m.value && m.value.length))
                                m.value = [];
                            m.value.push(r.bytes());
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return BytesList;
            })();

            CollectionDef.Int64List = (function() {

                function Int64List(p) {
                    this.value = [];
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                Int64List.prototype.value = $util.emptyArray;

                Int64List.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.Int64List();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            if (!(m.value && m.value.length))
                                m.value = [];
                            if ((t & 7) === 2) {
                                var c2 = r.uint32() + r.pos;
                                while (r.pos < c2)
                                    m.value.push(r.int64());
                            } else
                                m.value.push(r.int64());
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return Int64List;
            })();

            CollectionDef.FloatList = (function() {

                function FloatList(p) {
                    this.value = [];
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                FloatList.prototype.value = $util.emptyArray;

                FloatList.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.FloatList();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            if (!(m.value && m.value.length))
                                m.value = [];
                            if ((t & 7) === 2) {
                                var c2 = r.uint32() + r.pos;
                                while (r.pos < c2)
                                    m.value.push(r.float());
                            } else
                                m.value.push(r.float());
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return FloatList;
            })();

            CollectionDef.AnyList = (function() {

                function AnyList(p) {
                    this.value = [];
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                AnyList.prototype.value = $util.emptyArray;

                AnyList.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.CollectionDef.AnyList();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            if (!(m.value && m.value.length))
                                m.value = [];
                            m.value.push($root.tensorflow.Any.decode(r, r.uint32()));
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return AnyList;
            })();

            return CollectionDef;
        })();

        tensorflow.SaverDef = (function() {

            function SaverDef(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            SaverDef.prototype.filenameTensorName = "";
            SaverDef.prototype.saveTensorName = "";
            SaverDef.prototype.restoreOpName = "";
            SaverDef.prototype.maxToKeep = 0;
            SaverDef.prototype.sharded = false;
            SaverDef.prototype.keepCheckpointEveryNHours = 0;
            SaverDef.prototype.version = 0;

            SaverDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.SaverDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.filenameTensorName = r.string();
                        break;
                    case 2:
                        m.saveTensorName = r.string();
                        break;
                    case 3:
                        m.restoreOpName = r.string();
                        break;
                    case 4:
                        m.maxToKeep = r.int32();
                        break;
                    case 5:
                        m.sharded = r.bool();
                        break;
                    case 6:
                        m.keepCheckpointEveryNHours = r.float();
                        break;
                    case 7:
                        m.version = r.int32();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            SaverDef.CheckpointFormatVersion = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "LEGACY"] = 0;
                values[valuesById[1] = "V1"] = 1;
                values[valuesById[2] = "V2"] = 2;
                return values;
            })();

            return SaverDef;
        })();

        tensorflow.TensorInfo = (function() {

            function TensorInfo(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            TensorInfo.prototype.name = "";
            TensorInfo.prototype.cooSparse = null;
            TensorInfo.prototype.dtype = 0;
            TensorInfo.prototype.tensorShape = null;

            var $oneOfFields;

            Object.defineProperty(TensorInfo.prototype, "encoding", {
                get: $util.oneOfGetter($oneOfFields = ["name", "cooSparse"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            TensorInfo.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.TensorInfo();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.name = r.string();
                        break;
                    case 4:
                        m.cooSparse = $root.tensorflow.TensorInfo.CooSparse.decode(r, r.uint32());
                        break;
                    case 2:
                        m.dtype = r.int32();
                        break;
                    case 3:
                        m.tensorShape = $root.tensorflow.TensorShape.decode(r, r.uint32());
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            TensorInfo.CooSparse = (function() {

                function CooSparse(p) {
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                CooSparse.prototype.valuesTensorName = "";
                CooSparse.prototype.indicesTensorName = "";
                CooSparse.prototype.denseShapeTensorName = "";

                CooSparse.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.TensorInfo.CooSparse();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            m.valuesTensorName = r.string();
                            break;
                        case 2:
                            m.indicesTensorName = r.string();
                            break;
                        case 3:
                            m.denseShapeTensorName = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return CooSparse;
            })();

            return TensorInfo;
        })();

        tensorflow.SignatureDef = (function() {

            function SignatureDef(p) {
                this.inputs = {};
                this.outputs = {};
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            SignatureDef.prototype.inputs = $util.emptyObject;
            SignatureDef.prototype.outputs = $util.emptyObject;
            SignatureDef.prototype.methodName = "";

            SignatureDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.SignatureDef(), k;
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        r.skip().pos++;
                        if (m.inputs === $util.emptyObject)
                            m.inputs = {};
                        k = r.string();
                        r.pos++;
                        m.inputs[k] = $root.tensorflow.TensorInfo.decode(r, r.uint32());
                        break;
                    case 2:
                        r.skip().pos++;
                        if (m.outputs === $util.emptyObject)
                            m.outputs = {};
                        k = r.string();
                        r.pos++;
                        m.outputs[k] = $root.tensorflow.TensorInfo.decode(r, r.uint32());
                        break;
                    case 3:
                        m.methodName = r.string();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return SignatureDef;
        })();

        tensorflow.AssetFileDef = (function() {

            function AssetFileDef(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            AssetFileDef.prototype.tensorInfo = null;
            AssetFileDef.prototype.filename = "";

            AssetFileDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.AssetFileDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.tensorInfo = $root.tensorflow.TensorInfo.decode(r, r.uint32());
                        break;
                    case 2:
                        m.filename = r.string();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return AssetFileDef;
        })();

        tensorflow.OpDef = (function() {

            function OpDef(p) {
                this.inputArg = [];
                this.outputArg = [];
                this.attr = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            OpDef.prototype.name = "";
            OpDef.prototype.inputArg = $util.emptyArray;
            OpDef.prototype.outputArg = $util.emptyArray;
            OpDef.prototype.attr = $util.emptyArray;
            OpDef.prototype.deprecation = null;
            OpDef.prototype.summary = "";
            OpDef.prototype.description = "";
            OpDef.prototype.isCommutative = false;
            OpDef.prototype.isAggregate = false;
            OpDef.prototype.isStateful = false;
            OpDef.prototype.allowsUninitializedInput = false;

            OpDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.name = r.string();
                        break;
                    case 2:
                        if (!(m.inputArg && m.inputArg.length))
                            m.inputArg = [];
                        m.inputArg.push($root.tensorflow.OpDef.ArgDef.decode(r, r.uint32()));
                        break;
                    case 3:
                        if (!(m.outputArg && m.outputArg.length))
                            m.outputArg = [];
                        m.outputArg.push($root.tensorflow.OpDef.ArgDef.decode(r, r.uint32()));
                        break;
                    case 4:
                        if (!(m.attr && m.attr.length))
                            m.attr = [];
                        m.attr.push($root.tensorflow.OpDef.AttrDef.decode(r, r.uint32()));
                        break;
                    case 8:
                        m.deprecation = $root.tensorflow.OpDef.OpDeprecation.decode(r, r.uint32());
                        break;
                    case 5:
                        m.summary = r.string();
                        break;
                    case 6:
                        m.description = r.string();
                        break;
                    case 18:
                        m.isCommutative = r.bool();
                        break;
                    case 16:
                        m.isAggregate = r.bool();
                        break;
                    case 17:
                        m.isStateful = r.bool();
                        break;
                    case 19:
                        m.allowsUninitializedInput = r.bool();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            OpDef.ArgDef = (function() {

                function ArgDef(p) {
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                ArgDef.prototype.name = "";
                ArgDef.prototype.description = "";
                ArgDef.prototype.type = 0;
                ArgDef.prototype.typeAttr = "";
                ArgDef.prototype.numberAttr = "";
                ArgDef.prototype.typeListAttr = "";
                ArgDef.prototype.isRef = false;

                ArgDef.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpDef.ArgDef();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            m.name = r.string();
                            break;
                        case 2:
                            m.description = r.string();
                            break;
                        case 3:
                            m.type = r.int32();
                            break;
                        case 4:
                            m.typeAttr = r.string();
                            break;
                        case 5:
                            m.numberAttr = r.string();
                            break;
                        case 6:
                            m.typeListAttr = r.string();
                            break;
                        case 16:
                            m.isRef = r.bool();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return ArgDef;
            })();

            OpDef.AttrDef = (function() {

                function AttrDef(p) {
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                AttrDef.prototype.name = "";
                AttrDef.prototype.type = "";
                AttrDef.prototype.defaultValue = null;
                AttrDef.prototype.description = "";
                AttrDef.prototype.hasMinimum = false;
                AttrDef.prototype.minimum = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
                AttrDef.prototype.allowedValues = null;

                AttrDef.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpDef.AttrDef();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            m.name = r.string();
                            break;
                        case 2:
                            m.type = r.string();
                            break;
                        case 3:
                            m.defaultValue = $root.tensorflow.AttrValue.decode(r, r.uint32());
                            break;
                        case 4:
                            m.description = r.string();
                            break;
                        case 5:
                            m.hasMinimum = r.bool();
                            break;
                        case 6:
                            m.minimum = r.int64();
                            break;
                        case 7:
                            m.allowedValues = $root.tensorflow.AttrValue.decode(r, r.uint32());
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return AttrDef;
            })();

            OpDef.OpDeprecation = (function() {

                function OpDeprecation(p) {
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                OpDeprecation.prototype.version = 0;
                OpDeprecation.prototype.explanation = "";

                OpDeprecation.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpDef.OpDeprecation();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            m.version = r.int32();
                            break;
                        case 2:
                            m.explanation = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return OpDeprecation;
            })();

            return OpDef;
        })();

        tensorflow.OpList = (function() {

            function OpList(p) {
                this.op = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            OpList.prototype.op = $util.emptyArray;

            OpList.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.OpList();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        if (!(m.op && m.op.length))
                            m.op = [];
                        m.op.push($root.tensorflow.OpDef.decode(r, r.uint32()));
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return OpList;
        })();

        tensorflow.MetaGraphDef = (function() {

            function MetaGraphDef(p) {
                this.collectionDef = {};
                this.signatureDef = {};
                this.assetFileDef = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            MetaGraphDef.prototype.metaInfoDef = null;
            MetaGraphDef.prototype.graphDef = null;
            MetaGraphDef.prototype.saverDef = null;
            MetaGraphDef.prototype.collectionDef = $util.emptyObject;
            MetaGraphDef.prototype.signatureDef = $util.emptyObject;
            MetaGraphDef.prototype.assetFileDef = $util.emptyArray;

            MetaGraphDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.MetaGraphDef(), k;
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.metaInfoDef = $root.tensorflow.MetaGraphDef.MetaInfoDef.decode(r, r.uint32());
                        break;
                    case 2:
                        m.graphDef = $root.tensorflow.GraphDef.decode(r, r.uint32());
                        break;
                    case 3:
                        m.saverDef = $root.tensorflow.SaverDef.decode(r, r.uint32());
                        break;
                    case 4:
                        r.skip().pos++;
                        if (m.collectionDef === $util.emptyObject)
                            m.collectionDef = {};
                        k = r.string();
                        r.pos++;
                        m.collectionDef[k] = $root.tensorflow.CollectionDef.decode(r, r.uint32());
                        break;
                    case 5:
                        r.skip().pos++;
                        if (m.signatureDef === $util.emptyObject)
                            m.signatureDef = {};
                        k = r.string();
                        r.pos++;
                        m.signatureDef[k] = $root.tensorflow.SignatureDef.decode(r, r.uint32());
                        break;
                    case 6:
                        if (!(m.assetFileDef && m.assetFileDef.length))
                            m.assetFileDef = [];
                        m.assetFileDef.push($root.tensorflow.AssetFileDef.decode(r, r.uint32()));
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            MetaGraphDef.MetaInfoDef = (function() {

                function MetaInfoDef(p) {
                    this.tags = [];
                    if (p)
                        for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                            if (p[ks[i]] != null)
                                this[ks[i]] = p[ks[i]];
                }

                MetaInfoDef.prototype.metaGraphVersion = "";
                MetaInfoDef.prototype.strippedOpList = null;
                MetaInfoDef.prototype.anyInfo = null;
                MetaInfoDef.prototype.tags = $util.emptyArray;
                MetaInfoDef.prototype.tensorflowVersion = "";
                MetaInfoDef.prototype.tensorflowGitVersion = "";

                MetaInfoDef.decode = function decode(r, l) {
                    if (!(r instanceof $Reader))
                        r = $Reader.create(r);
                    var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.MetaGraphDef.MetaInfoDef();
                    while (r.pos < c) {
                        var t = r.uint32();
                        switch (t >>> 3) {
                        case 1:
                            m.metaGraphVersion = r.string();
                            break;
                        case 2:
                            m.strippedOpList = $root.tensorflow.OpList.decode(r, r.uint32());
                            break;
                        case 3:
                            m.anyInfo = $root.tensorflow.Any.decode(r, r.uint32());
                            break;
                        case 4:
                            if (!(m.tags && m.tags.length))
                                m.tags = [];
                            m.tags.push(r.string());
                            break;
                        case 5:
                            m.tensorflowVersion = r.string();
                            break;
                        case 6:
                            m.tensorflowGitVersion = r.string();
                            break;
                        default:
                            r.skipType(t & 7);
                            break;
                        }
                    }
                    return m;
                };

                return MetaInfoDef;
            })();

            return MetaGraphDef;
        })();

        tensorflow.SavedModel = (function() {

            function SavedModel(p) {
                this.metaGraphs = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            SavedModel.prototype.savedModelSchemaVersion = $util.Long ? $util.Long.fromBits(0,0,false) : 0;
            SavedModel.prototype.metaGraphs = $util.emptyArray;

            SavedModel.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.SavedModel();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.savedModelSchemaVersion = r.int64();
                        break;
                    case 2:
                        if (!(m.metaGraphs && m.metaGraphs.length))
                            m.metaGraphs = [];
                        m.metaGraphs.push($root.tensorflow.MetaGraphDef.decode(r, r.uint32()));
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return SavedModel;
        })();

        tensorflow.FunctionDefLibrary = (function() {

            function FunctionDefLibrary(p) {
                this["function"] = [];
                this.gradient = [];
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            FunctionDefLibrary.prototype["function"] = $util.emptyArray;
            FunctionDefLibrary.prototype.gradient = $util.emptyArray;

            FunctionDefLibrary.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.FunctionDefLibrary();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        if (!(m["function"] && m["function"].length))
                            m["function"] = [];
                        m["function"].push($root.tensorflow.FunctionDef.decode(r, r.uint32()));
                        break;
                    case 2:
                        if (!(m.gradient && m.gradient.length))
                            m.gradient = [];
                        m.gradient.push($root.tensorflow.GradientDef.decode(r, r.uint32()));
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return FunctionDefLibrary;
        })();

        tensorflow.FunctionDef = (function() {

            function FunctionDef(p) {
                this.attr = {};
                this.nodeDef = [];
                this.ret = {};
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            FunctionDef.prototype.signature = null;
            FunctionDef.prototype.attr = $util.emptyObject;
            FunctionDef.prototype.nodeDef = $util.emptyArray;
            FunctionDef.prototype.ret = $util.emptyObject;

            FunctionDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.FunctionDef(), k;
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.signature = $root.tensorflow.OpDef.decode(r, r.uint32());
                        break;
                    case 5:
                        r.skip().pos++;
                        if (m.attr === $util.emptyObject)
                            m.attr = {};
                        k = r.string();
                        r.pos++;
                        m.attr[k] = $root.tensorflow.AttrValue.decode(r, r.uint32());
                        break;
                    case 3:
                        if (!(m.nodeDef && m.nodeDef.length))
                            m.nodeDef = [];
                        m.nodeDef.push($root.tensorflow.NodeDef.decode(r, r.uint32()));
                        break;
                    case 4:
                        r.skip().pos++;
                        if (m.ret === $util.emptyObject)
                            m.ret = {};
                        k = r.string();
                        r.pos++;
                        m.ret[k] = r.string();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return FunctionDef;
        })();

        tensorflow.GradientDef = (function() {

            function GradientDef(p) {
                if (p)
                    for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                        if (p[ks[i]] != null)
                            this[ks[i]] = p[ks[i]];
            }

            GradientDef.prototype.functionName = "";
            GradientDef.prototype.gradientFunc = "";

            GradientDef.decode = function decode(r, l) {
                if (!(r instanceof $Reader))
                    r = $Reader.create(r);
                var c = l === undefined ? r.len : r.pos + l, m = new $root.tensorflow.GradientDef();
                while (r.pos < c) {
                    var t = r.uint32();
                    switch (t >>> 3) {
                    case 1:
                        m.functionName = r.string();
                        break;
                    case 2:
                        m.gradientFunc = r.string();
                        break;
                    default:
                        r.skipType(t & 7);
                        break;
                    }
                }
                return m;
            };

            return GradientDef;
        })();

        return tensorflow;
    })();

    var compiled_api = $root;
    var compiled_api_1 = compiled_api.tensorflow;

    function getParamValue(paramName, node, tensorMap, context) {
        var param = node.params[paramName];
        if (param && param.inputIndex !== undefined) {
            if (param.type === 'tensor') {
                return getTensor(node.inputNames[param.inputIndex], tensorMap, context);
            }
            if (param.type === 'tensors') {
                var inputs = param.inputIndex === 0 ?
                    (param.inputParamLength === 0 ?
                        node.inputNames :
                        node.inputNames.slice(param.inputIndex, -param.inputParamLength)) :
                    node.inputNames.splice(param.inputIndex);
                return inputs.map(function (name) { return getTensor(name, tensorMap, context); });
            }
            var data = Array.prototype.slice.call(getTensor(node.inputNames.slice(param.inputIndex)[0], tensorMap, context)
                .dataSync());
            return param.type === 'number' ? data[0] : data;
        }
        return param && param.value;
    }
    function getTensor(name, tensorsMap, context) {
        var _a = parseNodeName(name), nodeName = _a[0], index = _a[1];
        var contextId = context.currentContextIds.find(function (contextId) {
            return !!tensorsMap[getNodeNameWithContextId(nodeName, contextId)];
        });
        return contextId !== undefined ?
            tensorsMap[getNodeNameWithContextId(nodeName, contextId)][index] :
            undefined;
    }
    function getNodeNameAndIndex(inputName, context) {
        var _a = parseNodeName(inputName), nodeName = _a[0], index = _a[1];
        return [
            getNodeNameWithContextId(nodeName, context && context.currentContextId),
            index
        ];
    }
    function getNodeNameWithContextId(name, contextId) {
        return !!contextId ? name + "-" + contextId : name;
    }
    function parseNodeName(name) {
        var index = name.lastIndexOf(':');
        if (index === -1)
            return [name, 0];
        var nodeName = name.substring(0, index);
        return [nodeName, Number(name.substring(index + 1))];
    }
    function split(arr, size) {
        var res = [];
        for (var i = 0; i < arr.length; i += size) {
            res.push(arr.slice(i, i + size));
        }
        return res;
    }

    var json = [
        {
            'tfOpName': 'Add',
            'dlOpName': 'add',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'AddN',
            'dlOpName': 'addN',
            'category': 'arithmetic',
            'params': [{
                    'tfInputIndex': 0,
                    'tfInputParamLength': 0,
                    'dlParamName': 'tensors',
                    'type': 'tensors'
                }]
        },
        {
            'tfOpName': 'BiasAdd',
            'dlOpName': 'add',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Sub',
            'dlOpName': 'sub',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'RealDiv',
            'dlOpName': 'div',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Div',
            'dlOpName': 'div',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'FloorDiv',
            'dlOpName': 'floorDiv',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Mul',
            'dlOpName': 'mul',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Maximum',
            'dlOpName': 'maximum',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }
            ]
        },
        {
            'tfOpName': 'Minimum',
            'dlOpName': 'minimum',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }
            ]
        },
        {
            'tfOpName': 'Pow',
            'dlOpName': 'pow',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'SquaredDifference',
            'dlOpName': 'squaredDifference',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Mod',
            'dlOpName': 'mod',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'FloorMod',
            'dlOpName': 'mod',
            'category': 'arithmetic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        }
    ];

    var arithmetic = /*#__PURE__*/Object.freeze({
        json: json
    });

    var json$1 = [
        {
            'tfOpName': 'Abs',
            'dlOpName': 'abs',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Acos',
            'dlOpName': 'acos',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Asin',
            'dlOpName': 'asin',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'atan',
            'dlOpName': 'atan',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Ceil',
            'dlOpName': 'ceil',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'ClipByValue',
            'dlOpName': 'clipByValue',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'clip_value_min',
                    'dlParamName': 'clipValueMin',
                    'type': 'number'
                },
                {
                    'tfParamName': 'clip_value_max',
                    'dlParamName': 'clipValueMax',
                    'type': 'number'
                }
            ]
        },
        {
            'tfOpName': 'Cos',
            'dlOpName': 'cos',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Cosh',
            'dlOpName': 'cosh',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Elu',
            'dlOpName': 'elu',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Exp',
            'dlOpName': 'exp',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Floor',
            'dlOpName': 'floor',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Log',
            'dlOpName': 'log',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Neg',
            'dlOpName': 'neg',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Relu',
            'dlOpName': 'relu',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Relu6',
            'dlOpName': 'clipByValue',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                },
                { 'dlParamName': 'clipValueMin', 'type': 'number', 'defaultValue': 0 },
                { 'dlParamName': 'clipValueMax', 'type': 'number', 'defaultValue': 6 }
            ]
        },
        {
            'tfOpName': 'Selu',
            'dlOpName': 'selu',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Sigmoid',
            'dlOpName': 'sigmoid',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Sin',
            'dlOpName': 'sin',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Sinh',
            'dlOpName': 'sinh',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Sqrt',
            'dlOpName': 'sqrt',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Rsqrt',
            'dlOpName': 'rsqrt',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Square',
            'dlOpName': 'square',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Tan',
            'dlOpName': 'tan',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Tanh',
            'dlOpName': 'tanh',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Sign',
            'dlOpName': 'sign',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Round',
            'dlOpName': 'round',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Expm1',
            'dlOpName': 'expm1',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Log1p',
            'dlOpName': 'log1p',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Reciprocal',
            'dlOpName': 'reciprocal',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Reciprocal',
            'dlOpName': 'reciprocal',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Softplus',
            'dlOpName': 'softplus',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Asinh',
            'dlOpName': 'asinh',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Acosh',
            'dlOpName': 'acosh',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Atanh',
            'dlOpName': 'atanh',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Erf',
            'dlOpName': 'erf',
            'category': 'basic_math',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        }
    ];

    var basicMath = /*#__PURE__*/Object.freeze({
        json: json$1
    });

    var json$2 = [
        {
            'tfOpName': 'LoopCond',
            'dlOpName': 'loopCond',
            'category': 'control',
            'params': [{ 'tfInputIndex': 0, 'dlParamName': 'pred', 'type': 'tensor' }]
        },
        {
            'tfOpName': 'Switch',
            'dlOpName': 'switch',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'data', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'pred', 'type': 'tensor' }
            ]
        },
        {
            'tfOpName': 'Merge',
            'dlOpName': 'merge',
            'category': 'control',
            'params': [{
                    'tfInputIndex': 0,
                    'tfInputParamLength': 0,
                    'dlParamName': 'tensors',
                    'type': 'tensors'
                }]
        },
        {
            'tfOpName': 'Enter',
            'dlOpName': 'enter',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensor', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                },
                {
                    'tfParamName': 'frame_name',
                    'dlParamName': 'frameName',
                    'type': 'string'
                },
                {
                    'tfParamName': 'is_constant',
                    'dlParamName': 'isConstant',
                    'type': 'bool'
                }
            ]
        },
        {
            'tfOpName': 'Exit',
            'dlOpName': 'exit',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensor', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'NextIteration',
            'dlOpName': 'nextIteration',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensor', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'TensorArrayV3',
            'dlOpName': 'tensorArray',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'size', 'type': 'number' },
                { 'tfParamName': 'dtype', 'dlParamName': 'dtype', 'type': 'dtype' }, {
                    'tfParamName': 'element_shape',
                    'dlParamName': 'elementShape',
                    'type': 'shape'
                },
                {
                    'tfParamName': 'dynamic_size',
                    'dlParamName': 'dynamicSize',
                    'type': 'bool'
                },
                {
                    'tfParamName': 'clear_after_read',
                    'dlParamName': 'clearAfterRead',
                    'type': 'bool'
                },
                {
                    'tfParamName': 'identical_element_shapes',
                    'dlParamName': 'identicalElementShapes',
                    'type': 'bool'
                },
                {
                    'tfParamName': 'tensor_array_name',
                    'dlParamName': 'name',
                    'type': 'string'
                }
            ]
        },
        {
            'tfOpName': 'TensorArrayWriteV3',
            'dlOpName': 'tensorArrayWrite',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensorArrayId', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'index', 'type': 'number' },
                { 'tfInputIndex': 2, 'dlParamName': 'tensor', 'type': 'tensor' },
                { 'tfInputIndex': 3, 'dlParamName': 'flowIn', 'type': 'number' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'TensorArrayReadV3',
            'dlOpName': 'tensorArrayRead',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensorArrayId', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'index', 'type': 'number' },
                { 'tfInputIndex': 2, 'dlParamName': 'flowIn', 'type': 'number' }, {
                    'tfParamName': 'dtype',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'TensorArrayGatherV3',
            'dlOpName': 'tensorArrayGather',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensorArrayId', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'indices', 'type': 'number[]' },
                { 'tfInputIndex': 2, 'dlParamName': 'flowIn', 'type': 'number' },
                { 'tfParamName': 'dtype', 'dlParamName': 'dtype', 'type': 'dtype' }, {
                    'tfParamName': 'element_shape',
                    'dlParamName': 'elementShape',
                    'type': 'shape'
                }
            ]
        },
        {
            'tfOpName': 'TensorArrayScatterV3',
            'dlOpName': 'tensorArrayScatter',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensorArrayId', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'indices', 'type': 'number[]' },
                { 'tfInputIndex': 2, 'dlParamName': 'tensor', 'type': 'tensor' },
                { 'tfInputIndex': 3, 'dlParamName': 'flowIn', 'type': 'number' },
                { 'tfParamName': 'T', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'TensorArrayConcatV3',
            'dlOpName': 'tensorArrayConcat',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensorArrayId', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'flowIn', 'type': 'number' },
                { 'tfParamName': 'dtype', 'dlParamName': 'dtype', 'type': 'dtype' }, {
                    'tfParamName': 'element_shape_except0',
                    'dlParamName': 'elementShapeExcept0',
                    'type': 'shape',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'TensorArraySplitV3',
            'dlOpName': 'tensorArraySplit',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensorArrayId', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'tensor', 'type': 'tensor' },
                { 'tfInputIndex': 2, 'dlParamName': 'lengths', 'type': 'number[]' },
                { 'tfInputIndex': 3, 'dlParamName': 'flowIn', 'type': 'number' },
                { 'tfParamName': 'T', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'TensorArraySizeV3',
            'dlOpName': 'tensorArraySize',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensorArrayId', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'flowIn', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'TensorArrayCloseV3',
            'dlOpName': 'tensorArrayClose',
            'category': 'control',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'tensorArrayId', 'type': 'number' }
            ]
        }
    ];

    var control = /*#__PURE__*/Object.freeze({
        json: json$2
    });

    var json$3 = [
        {
            'tfOpName': 'AvgPool',
            'dlOpName': 'avgPool',
            'category': 'convolution',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfParamName': 'strides', 'dlParamName': 'strides', 'type': 'number[]' },
                { 'tfParamName': 'padding', 'dlParamName': 'pad', 'type': 'string' }, {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'notSupported': true
                },
                { 'tfParamName': 'ksize', 'dlParamName': 'kernelSize', 'type': 'number[]' },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'MaxPool',
            'dlOpName': 'maxPool',
            'category': 'convolution',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfParamName': 'strides', 'dlParamName': 'strides', 'type': 'number[]' },
                { 'tfParamName': 'padding', 'dlParamName': 'pad', 'type': 'string' }, {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'notSupported': true
                },
                { 'tfParamName': 'ksize', 'dlParamName': 'kernelSize', 'type': 'number[]' },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Conv1D',
            'dlOpName': 'conv1d',
            'category': 'convolution',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'filter', 'type': 'tensor' },
                { 'tfParamName': 'stride', 'dlParamName': 'stride', 'type': 'number' },
                { 'tfParamName': 'padding', 'dlParamName': 'pad', 'type': 'string' }, {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'defaultValue': 'NWC'
                },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                },
                {
                    'tfParamName': 'dilation',
                    'dlParamName': 'dilation',
                    'type': 'number',
                    'defaultValue': 1
                }
            ]
        },
        {
            'tfOpName': 'Conv2D',
            'dlOpName': 'conv2d',
            'category': 'convolution',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'filter', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                },
                { 'tfParamName': 'strides', 'dlParamName': 'strides', 'type': 'number[]' },
                { 'tfParamName': 'padding', 'dlParamName': 'pad', 'type': 'string' }, {
                    'tfParamName': 'useCudnnOnGpu',
                    'dlParamName': 'useCudnnOnGpu',
                    'type': 'bool'
                },
                {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'defaultValue': 'NHWC'
                },
                {
                    'tfParamName': 'dilations',
                    'dlParamName': 'dilations',
                    'type': 'number[]'
                }
            ]
        },
        {
            'tfOpName': 'Conv2DBackpropInput',
            'dlOpName': 'conv2dTranspose',
            'category': 'convolution',
            'params': [
                { 'tfInputIndex': 2, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'filter', 'type': 'tensor' },
                { 'tfInputIndex': 0, 'dlParamName': 'outputShape', 'type': 'number[]' },
                { 'tfParamName': 'strides', 'dlParamName': 'strides', 'type': 'number[]' },
                { 'tfParamName': 'padding', 'dlParamName': 'pad', 'type': 'string' }, {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'DepthwiseConv2d',
            'dlOpName': 'depthwiseConv2d',
            'category': 'convolution',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'input', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'filter', 'type': 'tensor' },
                { 'tfParamName': 'strides', 'dlParamName': 'strides', 'type': 'number[]' },
                { 'tfParamName': 'padding', 'dlParamName': 'pad', 'type': 'string' }, {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'defaultValue': 'NHWC'
                },
                {
                    'tfParamName': 'dilations',
                    'dlParamName': 'dilations',
                    'type': 'number[]'
                }
            ]
        },
        {
            'tfOpName': 'DepthwiseConv2dNative',
            'dlOpName': 'depthwiseConv2d',
            'category': 'convolution',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'input', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'filter', 'type': 'tensor' },
                { 'tfParamName': 'strides', 'dlParamName': 'strides', 'type': 'number[]' },
                { 'tfParamName': 'padding', 'dlParamName': 'pad', 'type': 'string' }, {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'defaultValue': 'NHWC'
                },
                {
                    'tfParamName': 'dilations',
                    'dlParamName': 'dilations',
                    'type': 'number[]'
                }
            ]
        }
    ];

    var convolution = /*#__PURE__*/Object.freeze({
        json: json$3
    });

    var json$4 = [
        {
            'tfOpName': 'Fill',
            'dlOpName': 'fill',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'shape', 'type': 'number[]' },
                { 'tfInputIndex': 1, 'dlParamName': 'value', 'type': 'number' },
                { 'tfParamName': 'T', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'LinSpace',
            'dlOpName': 'linspace',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'start', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'stop', 'type': 'number' },
                { 'tfInputIndex': 2, 'dlParamName': 'num', 'type': 'number' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'OneHot',
            'dlOpName': 'oneHot',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'indices', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'depth', 'type': 'number' }, {
                    'tfInputIndex': 2,
                    'dlParamName': 'onValue',
                    'type': 'number',
                    'defaultValue': 1
                },
                {
                    'tfInputIndex': 3,
                    'dlParamName': 'offValue',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'axis',
                    'dlParamName': 'axis',
                    'type': 'number',
                    'notSupported': true
                },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Ones',
            'dlOpName': 'ones',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'shape', 'type': 'number[]' },
                { 'tfParamName': 'T', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'OnesLike',
            'dlOpName': 'onesLike',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfParamName': 'dtype', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'RandomUniform',
            'dlOpName': 'randomUniform',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'shape', 'type': 'number[]' }, {
                    'tfParamName': 'minval',
                    'dlParamName': 'minval',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'maxval',
                    'dlParamName': 'maxval',
                    'type': 'number',
                    'defaultValue': 1
                },
                { 'tfParamName': 'dtype', 'dlParamName': 'dtype', 'type': 'dtype' }, {
                    'tfParamName': 'seed',
                    'dlParamName': 'seed',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'seed2',
                    'dlParamName': 'seed2',
                    'type': 'number',
                    'defaultValue': 0,
                    'notSupported': true
                },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'T',
                    'type': 'number',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Range',
            'dlOpName': 'range',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'start', 'type': 'number' },
                { 'tfInputIndex': 1, 'dlParamName': 'stop', 'type': 'number' }, {
                    'tfInputIndex': 2,
                    'dlParamName': 'step',
                    'type': 'number',
                    'defaultValue': 0
                },
                { 'tfParamName': 'Tidx', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'truncatedNormal',
            'dlOpName': 'truncatedNormal',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'shape', 'type': 'number[]' }, {
                    'tfParamName': 'means',
                    'dlParamName': 'mean',
                    'type': 'number',
                    'defaultValue': 0.0
                },
                {
                    'tfParamName': 'stddev',
                    'dlParamName': 'stdDev',
                    'type': 'number',
                    'defaultValue': 1.0
                },
                { 'tfParamName': 'seed', 'dlParamName': 'seed', 'type': 'number' }, {
                    'tfParamName': 'seed2',
                    'dlParamName': 'seed2',
                    'type': 'number',
                    'defaultValue': 0,
                    'notSupported': true
                },
                { 'tfParamName': 'dtype', 'dlParamName': 'dtype', 'type': 'dtype' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'T',
                    'type': 'number',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Zeros',
            'dlOpName': 'zeros',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'shape', 'type': 'number[]' },
                { 'tfParamName': 'T', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'ZerosLike',
            'dlOpName': 'zerosLike',
            'category': 'creation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfParamName': 'T', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        }
    ];

    var creation = /*#__PURE__*/Object.freeze({
        json: json$4
    });

    var json$5 = [
        {
            'tfOpName': 'NonMaxSuppressionV2',
            'dlOpName': 'nonMaxSuppression',
            'category': 'dynamic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'boxes', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'scores', 'type': 'tensor' },
                { 'tfInputIndex': 2, 'dlParamName': 'maxOutputSize', 'type': 'number' },
                { 'tfInputIndex': 3, 'dlParamName': 'iouThreshold', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'NonMaxSuppressionV3',
            'dlOpName': 'nonMaxSuppression',
            'category': 'dynamic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'boxes', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'scores', 'type': 'tensor' },
                { 'tfInputIndex': 2, 'dlParamName': 'maxOutputSize', 'type': 'number' },
                { 'tfInputIndex': 3, 'dlParamName': 'iouThreshold', 'type': 'number' },
                { 'tfInputIndex': 4, 'dlParamName': 'scoreThreshold', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'Where',
            'dlOpName': 'whereAsync',
            'category': 'dynamic',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'condition', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        }
    ];

    var dynamic = /*#__PURE__*/Object.freeze({
        json: json$5
    });

    var json$6 = [{
            'tfOpName': 'TopKV2',
            'dlOpName': 'topK',
            'category': 'evaluation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'k', 'type': 'number' },
                { 'tfParamName': 'sorted', 'dlParamName': 'sorted', 'type': 'bool' }
            ]
        }];

    var evaluation = /*#__PURE__*/Object.freeze({
        json: json$6
    });

    var json$7 = [
        {
            'tfOpName': 'PlaceholderWithDefault',
            'dlOpName': 'placeholder',
            'category': 'graph',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'default', 'type': 'tensor' },
                { 'tfParamName': 'shape', 'dlParamName': 'shape', 'type': 'shape' },
                { 'tfParamName': 'dtype', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'Placeholder',
            'dlOpName': 'placeholder',
            'category': 'graph',
            'params': [
                { 'tfParamName': 'shape', 'dlParamName': 'shape', 'type': 'shape' },
                { 'tfParamName': 'dtype', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        { 'tfOpName': 'Const', 'dlOpName': 'const', 'category': 'graph' }, {
            'tfOpName': 'Identity',
            'dlOpName': 'identity',
            'category': 'graph',
            'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
        },
        {
            'tfOpName': 'Snapshot',
            'dlOpName': 'snapshot',
            'category': 'graph',
            'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
        },
        {
            'tfOpName': 'Rank',
            'dlOpName': 'rank',
            'category': 'graph',
            'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
        },
        {
            'tfOpName': 'Size',
            'dlOpName': 'size',
            'category': 'graph',
            'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
        },
        {
            'tfOpName': 'Shape',
            'dlOpName': 'shape',
            'category': 'graph',
            'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
        },
        {
            'tfOpName': 'ShapeN',
            'dlOpName': 'shapeN',
            'category': 'graph',
            'params': [{
                    'tfInputIndex': 0,
                    'tfInputParamLength': 0,
                    'dlParamName': 'x',
                    'type': 'tensors'
                }]
        },
        {
            'tfOpName': 'Print',
            'dlOpName': 'print',
            'category': 'graph',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfInputIndex': 1,
                    'tfInputParamLength': 1,
                    'dlParamName': 'data',
                    'type': 'tensors'
                },
                { 'tfParamName': 'message', 'dlParamName': 'message', 'type': 'string' }, {
                    'tfParamName': 'first_n',
                    'dlParamName': 'firstN',
                    'type': 'number',
                    'notSupprted': true
                },
                {
                    'tfParamName': 'summarize',
                    'dlParamName': 'summarize',
                    'type': 'number',
                    'defaultValue': 3
                }
            ]
        },
        { 'tfOpName': 'NoOp', 'dlOpName': 'noop', 'category': 'graph', 'params': [] }, {
            'tfOpName': 'StopGradient',
            'dlOpName': 'stopGradient',
            'category': 'graph',
            'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
        },
        {
            'tfOpName': 'FakeQuantWithMinMaxVars',
            'dlOpName': 'fakeQuantWithMinMaxVars',
            'category': 'graph',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfParamName': 'min', 'dlParamName': 'min', 'type': 'number' },
                { 'tfParamName': 'max', 'dlParamName': 'max', 'type': 'number' }
            ]
        }
    ];

    var graph = /*#__PURE__*/Object.freeze({
        json: json$7
    });

    var json$8 = [
        {
            'tfOpName': 'ResizeBilinear',
            'dlOpName': 'resizeBilinear',
            'category': 'image',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'images', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'size', 'type': 'number[]' }, {
                    'tfParamName': 'align_corners',
                    'dlParamName': 'alignCorners',
                    'type': 'bool'
                },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'ResizeNearestNeighbor',
            'dlOpName': 'resizeNearestNeighbor',
            'category': 'image',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'images', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'size', 'type': 'number[]' }, {
                    'tfParamName': 'align_corners',
                    'dlParamName': 'alignCorners',
                    'type': 'bool'
                },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'CropAndResize',
            'dlOpName': 'cropAndResize',
            'category': 'image',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'image', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'boxes', 'type': 'tensor' },
                { 'tfInputIndex': 2, 'dlParamName': 'boxInd', 'type': 'tensor' },
                { 'tfInputIndex': 3, 'dlParamName': 'cropSize', 'type': 'number[]' },
                { 'tfParamName': 'method', 'dlParamName': 'method', 'type': 'string' }, {
                    'tfParamName': 'extrapolation_value',
                    'dlParamName': 'extrapolationValue',
                    'type': 'number'
                }
            ]
        }
    ];

    var image = /*#__PURE__*/Object.freeze({
        json: json$8
    });

    var json$9 = [
        {
            'tfOpName': 'Equal',
            'dlOpName': 'equal',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'NotEqual',
            'dlOpName': 'notEqual',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Greater',
            'dlOpName': 'greater',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'GreaterEqual',
            'dlOpName': 'greaterEqual',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Less',
            'dlOpName': 'less',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'LessEqual',
            'dlOpName': 'lessEqual',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'LogicalAnd',
            'dlOpName': 'logicalAnd',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'LogicalNot',
            'dlOpName': 'logicalNot',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'LogicalOr',
            'dlOpName': 'logicalOr',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Select',
            'dlOpName': 'where',
            'category': 'logical',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'condition', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 2, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        }
    ];

    var logical = /*#__PURE__*/Object.freeze({
        json: json$9
    });

    var json$10 = [
        {
            'tfOpName': 'MatMul',
            'dlOpName': 'matMul',
            'category': 'matrices',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'transpose_a',
                    'dlParamName': 'transposeA',
                    'type': 'bool',
                    'defaultValue': false
                },
                {
                    'tfParamName': 'transpose_b',
                    'dlParamName': 'transposeB',
                    'type': 'bool',
                    'defaultValue': false
                },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'BatchMatMul',
            'dlOpName': 'matMul',
            'category': 'matrices',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'a', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'b', 'type': 'tensor' }, {
                    'tfParamName': 'adj_x',
                    'dlParamName': 'transposeA',
                    'type': 'bool',
                    'defaultValue': false
                },
                {
                    'tfParamName': 'adj_y',
                    'dlParamName': 'transposeB',
                    'type': 'bool',
                    'defaultValue': false
                },
                {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Transpose',
            'dlOpName': 'transpose',
            'category': 'matrices',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'perm', 'type': 'number[]' }, {
                    'tfParamName': 'T',
                    'dlParamName': 'dtype',
                    'type': 'dtype',
                    'notSupported': true
                }
            ]
        }
    ];

    var matrices = /*#__PURE__*/Object.freeze({
        json: json$10
    });

    var json$11 = [
        {
            'tfOpName': 'FusedBatchNorm',
            'dlOpName': 'batchNormalization',
            'category': 'normalization',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'scale', 'type': 'tensor' },
                { 'tfInputIndex': 2, 'dlParamName': 'offset', 'type': 'tensor' },
                { 'tfInputIndex': 3, 'dlParamName': 'mean', 'type': 'tensor' },
                { 'tfInputIndex': 4, 'dlParamName': 'variance', 'type': 'tensor' }, {
                    'tfParamName': 'epsilon',
                    'dlParamName': 'epsilon',
                    'type': 'number',
                    'defaultValue': 0.001
                },
                {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'FusedBatchNormV2',
            'dlOpName': 'batchNormalization',
            'category': 'normalization',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'scale', 'type': 'tensor' },
                { 'tfInputIndex': 2, 'dlParamName': 'offset', 'type': 'tensor' },
                { 'tfInputIndex': 3, 'dlParamName': 'mean', 'type': 'tensor' },
                { 'tfInputIndex': 4, 'dlParamName': 'variance', 'type': 'tensor' }, {
                    'tfParamName': 'epsilon',
                    'dlParamName': 'epsilon',
                    'type': 'number',
                    'defaultValue': 0.001
                },
                {
                    'tfParamName': 'data_format',
                    'dlParamName': 'dataFormat',
                    'type': 'string',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'LRN',
            'dlOpName': 'localResponseNormalization',
            'category': 'normalization',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'depth_radius',
                    'dlParamName': 'radius',
                    'type': 'number',
                    'defaultValue': 5
                },
                {
                    'tfParamName': 'bias',
                    'dlParamName': 'bias',
                    'type': 'number',
                    'defaultValue': 1.0
                },
                {
                    'tfParamName': 'alpha',
                    'dlParamName': 'alpha',
                    'type': 'number',
                    'defaultValue': 1.0
                },
                {
                    'tfParamName': 'beta',
                    'dlParamName': 'beta',
                    'type': 'number',
                    'defaultValue': 0.5
                }
            ]
        },
        {
            'tfOpName': 'Softmax',
            'dlOpName': 'softmax',
            'category': 'normalization',
            'params': [{ 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }]
        }
    ];

    var normalization = /*#__PURE__*/Object.freeze({
        json: json$11
    });

    var json$12 = [
        {
            'tfOpName': 'Max',
            'dlOpName': 'max',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number[]' },
                { 'tfParamName': 'keep_dims', 'dlParamName': 'keepDims', 'type': 'bool' }
            ]
        },
        {
            'tfOpName': 'Mean',
            'dlOpName': 'mean',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number[]' },
                { 'tfParamName': 'keep_dims', 'dlParamName': 'keepDims', 'type': 'bool' }
            ]
        },
        {
            'tfOpName': 'Min',
            'dlOpName': 'min',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number[]' },
                { 'tfParamName': 'keep_dims', 'dlParamName': 'keepDims', 'type': 'bool' }
            ]
        },
        {
            'tfOpName': 'Sum',
            'dlOpName': 'sum',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number[]' },
                { 'tfParamName': 'keep_dims', 'dlParamName': 'keepDims', 'type': 'bool' }
            ]
        },
        {
            'tfOpName': 'All',
            'dlOpName': 'all',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number[]' },
                { 'tfParamName': 'keep_dims', 'dlParamName': 'keepDims', 'type': 'bool' }
            ]
        },
        {
            'tfOpName': 'Any',
            'dlOpName': 'any',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number[]' },
                { 'tfParamName': 'keep_dims', 'dlParamName': 'keepDims', 'type': 'bool' }
            ]
        },
        {
            'tfOpName': 'ArgMax',
            'dlOpName': 'argMax',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'ArgMin',
            'dlOpName': 'argMin',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'Prod',
            'dlOpName': 'prod',
            'category': 'reduction',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number[]' }, {
                    'tfParamName': 'keep_dims',
                    'dlParamName': 'keepDims',
                    'type': 'bool'
                }
            ]
        }
    ];

    var reduction = /*#__PURE__*/Object.freeze({
        json: json$12
    });

    var json$13 = [
        {
            'tfOpName': 'ConcatV2',
            'dlOpName': 'concat',
            'category': 'slice_join',
            'params': [
                {
                    'tfInputIndex': 0,
                    'tfInputParamLength': 1,
                    'dlParamName': 'tensors',
                    'type': 'tensors'
                },
                { 'tfInputIndex': -1, 'dlParamName': 'axis', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'Concat',
            'dlOpName': 'concat',
            'category': 'slice_join',
            'params': [
                {
                    'tfInputIndex': 1,
                    'tfInputParamLength': 1,
                    'dlParamName': 'tensors',
                    'type': 'tensors'
                },
                { 'tfInputIndex': 0, 'dlParamName': 'axis', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'GatherV2',
            'dlOpName': 'gather',
            'category': 'slice_join',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'indices', 'type': 'tensor' }, {
                    'tfParamName': 'axis',
                    'dlParamName': 'axis',
                    'type': 'number',
                    'defaultValue': 0
                }
            ]
        },
        {
            'tfOpName': 'Gather',
            'dlOpName': 'gather',
            'category': 'slice_join',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'indices', 'type': 'tensor' }, {
                    'tfParamName': 'axis',
                    'dlParamName': 'axis',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'validate_indices',
                    'dlParamName': 'validateIndices',
                    'type': 'bool',
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Reverse',
            'dlOpName': 'reverse',
            'category': 'slice_join',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'ReverseV2',
            'dlOpName': 'reverse',
            'category': 'slice_join',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'axis', 'type': 'number' }
            ]
        },
        {
            'tfOpName': 'Slice',
            'dlOpName': 'slice',
            'category': 'slice_join',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'begin', 'type': 'number[]' },
                { 'tfInputIndex': 2, 'dlParamName': 'size', 'type': 'number[]' }
            ]
        },
        {
            'tfOpName': 'StridedSlice',
            'dlOpName': 'stridedSlice',
            'category': 'slice_join',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'begin', 'type': 'number[]' },
                { 'tfInputIndex': 2, 'dlParamName': 'end', 'type': 'number[]' },
                { 'tfInputIndex': 3, 'dlParamName': 'strides', 'type': 'number[]' }, {
                    'tfParamName': 'begin_mask',
                    'dlParamName': 'beginMask',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'end_mask',
                    'dlParamName': 'endMask',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'new_axis_mask',
                    'dlParamName': 'newAxisMask',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'ellipsis_mask',
                    'dlParamName': 'ellipsisMask',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'shrink_axis_mask',
                    'dlParamName': 'shrinkAxisMask',
                    'type': 'number',
                    'defaultValue': 0
                }
            ]
        },
        {
            'tfOpName': 'Pack',
            'dlOpName': 'stack',
            'category': 'slice_join',
            'params': [
                {
                    'tfInputIndex': 0,
                    'tfInputParamLength': 0,
                    'dlParamName': 'tensors',
                    'type': 'tensors'
                },
                {
                    'tfParamName': 'axis',
                    'dlParamName': 'axis',
                    'type': 'number',
                    'defaultValue': 0
                }
            ]
        },
        {
            'tfOpName': 'Unpack',
            'dlOpName': 'unstack',
            'category': 'slice_join',
            'params': [
                {
                    'tfInputIndex': 0,
                    'tfInputParamLength': 0,
                    'dlParamName': 'tensor',
                    'type': 'tensor'
                },
                {
                    'tfParamName': 'axis',
                    'dlParamName': 'axis',
                    'type': 'number',
                    'defaultValue': 0
                },
                {
                    'tfParamName': 'num',
                    'dlParamName': 'num',
                    'type': 'number',
                    'defaultValue': 0,
                    'notSupported': true
                }
            ]
        },
        {
            'tfOpName': 'Tile',
            'dlOpName': 'tile',
            'category': 'slice_join',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'reps', 'type': 'number[]' }
            ]
        },
        {
            'tfOpName': 'Split',
            'dlOpName': 'split',
            'category': 'slice_join',
            'params': [
                {
                    'tfInputIndex': 0,
                    'dlParamName': 'axis',
                    'type': 'number',
                    'defaultValue': 0
                },
                { 'tfInputIndex': 1, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'num_split',
                    'dlParamName': 'numOrSizeSplits',
                    'type': 'number',
                    'defaultValue': 1
                }
            ]
        },
        {
            'tfOpName': 'SplitV',
            'dlOpName': 'split',
            'category': 'slice_join',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'numOrSizeSplits', 'type': 'number[]' },
                {
                    'tfInputIndex': 2,
                    'dlParamName': 'axis',
                    'type': 'number',
                    'defaultValue': 0
                }
            ]
        }
    ];

    var sliceJoin = /*#__PURE__*/Object.freeze({
        json: json$13
    });

    var json$14 = [
        {
            'tfOpName': 'Cast',
            'dlOpName': 'cast',
            'category': 'transformation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'SrcT',
                    'dlParamName': 'sdtype',
                    'type': 'dtype',
                    'notSupported': true
                },
                { 'tfParamName': 'DstT', 'dlParamName': 'dtype', 'type': 'dtype' }
            ]
        },
        {
            'tfOpName': 'ExpandDims',
            'dlOpName': 'expandDims',
            'category': 'transformation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfInputIndex': 1,
                    'tfParamNameDeprecated': 'dim',
                    'dlParamName': 'axis',
                    'type': 'number'
                }
            ]
        },
        {
            'tfOpName': 'Pad',
            'dlOpName': 'pad',
            'category': 'transformation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'padding', 'type': 'number[]' }, {
                    'tfParamName': 'constant_value',
                    'dlParamName': 'constantValue',
                    'type': 'number',
                    'defaultValue': 0
                }
            ]
        },
        {
            'tfOpName': 'PadV2',
            'dlOpName': 'pad',
            'category': 'transformation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'padding', 'type': 'number[]' }, {
                    'tfInputIndex': 2,
                    'dlParamName': 'constantValue',
                    'type': 'number',
                    'defaultValue': 0
                }
            ]
        },
        {
            'tfOpName': 'Reshape',
            'dlOpName': 'reshape',
            'category': 'transformation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'shape', 'type': 'number[]' }
            ]
        },
        {
            'tfOpName': 'Squeeze',
            'dlOpName': 'squeeze',
            'category': 'transformation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' }, {
                    'tfParamName': 'axis',
                    'tfParamNameDeprecated': 'squeeze_dims',
                    'dlParamName': 'axis',
                    'type': 'number[]'
                }
            ]
        },
        {
            'tfOpName': 'SpaceToBatchND',
            'dlOpName': 'spaceToBatchND',
            'category': 'transformation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'blockShape', 'type': 'number[]' },
                { 'tfInputIndex': 2, 'dlParamName': 'paddings', 'type': 'number[]' }
            ]
        },
        {
            'tfOpName': 'BatchToSpaceND',
            'dlOpName': 'batchToSpaceND',
            'category': 'transformation',
            'params': [
                { 'tfInputIndex': 0, 'dlParamName': 'x', 'type': 'tensor' },
                { 'tfInputIndex': 1, 'dlParamName': 'blockShape', 'type': 'number[]' },
                { 'tfInputIndex': 2, 'dlParamName': 'crops', 'type': 'number[]' }
            ]
        }
    ];

    var transformation = /*#__PURE__*/Object.freeze({
        json: json$14
    });

    var CONTROL_FLOW_OPS = ['Switch', 'Merge', 'Enter', 'Exit', 'NextIteration'];
    var DYNAMIC_SHAPE_OPS = ['NonMaxSuppressionV2', 'NonMaxSuppressionV3', 'Where'];
    var OperationMapper = (function () {
        function OperationMapper() {
            var ops = [
                arithmetic, basicMath, control, convolution, creation, dynamic,
                evaluation, logical, image, graph, matrices, normalization, reduction,
                sliceJoin, transformation
            ];
            var mappersJson = [].concat.apply([], ops.map(function (op) { return op.json; }));
            this.opMappers = mappersJson.reduce(function (map, mapper) {
                map[mapper.tfOpName] = mapper;
                return map;
            }, {});
        }
        Object.defineProperty(OperationMapper, "Instance", {
            get: function () {
                return this._instance || (this._instance = new this());
            },
            enumerable: true,
            configurable: true
        });
        OperationMapper.prototype.isControlFlow = function (node) {
            return CONTROL_FLOW_OPS.some(function (op) { return op === node.op; });
        };
        OperationMapper.prototype.isDynamicShape = function (node) {
            return DYNAMIC_SHAPE_OPS.some(function (op) { return op === node.op; });
        };
        OperationMapper.prototype.transformGraph = function (graph) {
            var _this = this;
            var tfNodes = graph.node;
            var withControlFlow = false;
            var withDynamicShape = false;
            var placeholders = [];
            var weights = [];
            var nodes = tfNodes.reduce(function (map, node) {
                map[node.name] = _this.mapNode(node);
                if (_this.isControlFlow(node))
                    withControlFlow = true;
                if (_this.isDynamicShape(node))
                    withDynamicShape = true;
                if (node.op === 'Placeholder')
                    placeholders.push(map[node.name]);
                if (node.op === 'Const')
                    weights.push(map[node.name]);
                return map;
            }, {});
            var inputs = [];
            var outputs = [];
            Object.keys(nodes).forEach(function (key) {
                var node = nodes[key];
                node.inputNames.forEach(function (name) {
                    var nodeName = getNodeNameAndIndex(name)[0];
                    node.inputs.push(nodes[nodeName]);
                    nodes[nodeName].children.push(node);
                });
                if (node.inputs.length === 0)
                    inputs.push(node);
            });
            Object.keys(nodes).forEach(function (key) {
                var node = nodes[key];
                if (node.children.length === 0)
                    outputs.push(node);
            });
            return {
                nodes: nodes,
                inputs: inputs,
                outputs: outputs,
                weights: weights,
                placeholders: placeholders,
                withControlFlow: withControlFlow,
                withDynamicShape: withDynamicShape
            };
        };
        OperationMapper.prototype.mapNode = function (node) {
            var _this = this;
            var mapper = this.opMappers[node.op];
            if (mapper === undefined) {
                throw new Error('Tensorflow Op is not supported: ' + node.op);
            }
            var newNode = {
                name: node.name,
                op: mapper.dlOpName,
                category: mapper.category,
                inputNames: (node.input ||
                    []).map(function (input) { return input.startsWith('^') ? input.substr(1) : input; }),
                inputs: [],
                children: [],
                params: {}
            };
            if (!!mapper.params) {
                newNode.params = mapper.params.reduce(function (map, param) {
                    var inputIndex = param.tfInputIndex;
                    var inputParamLength = param.tfInputParamLength;
                    var type = param.type;
                    var value = undefined;
                    if (inputIndex === undefined) {
                        switch (param.type) {
                            case 'string':
                                value = _this.getStringParam(node.attr, param.tfParamName, param.defaultValue);
                                if (value === undefined && !!param.tfParamNameDeprecated) {
                                    value = _this.getStringParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                                }
                                break;
                            case 'number':
                                value = _this.getNumberParam(node.attr, param.tfParamName, param.defaultValue);
                                if (value === undefined && !!param.tfParamNameDeprecated) {
                                    value = _this.getNumberParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                                }
                                break;
                            case 'number[]':
                                value = _this.getNumericArrayParam(node.attr, param.tfParamName, param.defaultValue);
                                if (value === undefined && !!param.tfParamNameDeprecated) {
                                    value = _this.getNumericArrayParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                                }
                                break;
                            case 'bool':
                                value = _this.getBoolParam(node.attr, param.tfParamName, param.defaultValue);
                                if (value === undefined && !!param.tfParamNameDeprecated) {
                                    value = _this.getBoolParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                                }
                                break;
                            case 'shape':
                                value = _this.getTensorShapeParam(node.attr, param.tfParamName, param.defaultValue);
                                if (value === undefined && !!param.tfParamNameDeprecated) {
                                    value = _this.getTensorShapeParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                                }
                                break;
                            case 'dtype':
                                value = _this.getDtypeParam(node.attr, param.tfParamName, param.defaultValue);
                                if (value === undefined && !!param.tfParamNameDeprecated) {
                                    value = _this.getDtypeParam(node.attr, param.tfParamNameDeprecated, param.defaultValue);
                                }
                                break;
                            case 'tensor':
                            case 'tensors':
                                break;
                            default:
                                throw new Error("Unsupported param type: " + param.type + " for op: " + node.op);
                        }
                    }
                    map[param.dlParamName] = { value: value, inputIndex: inputIndex, type: type, inputParamLength: inputParamLength };
                    return map;
                }, {});
            }
            return newNode;
        };
        OperationMapper.prototype.getStringParam = function (attrs, name, def, keepCase) {
            if (keepCase === void 0) { keepCase = false; }
            var param = attrs[name];
            if (param !== undefined) {
                var value = String.fromCharCode.apply(null, param.s);
                return keepCase ? value : value.toLowerCase();
            }
            return def;
        };
        OperationMapper.prototype.getBoolParam = function (attrs, name, def) {
            var param = attrs[name];
            return param ? param.b : def;
        };
        OperationMapper.prototype.getNumberParam = function (attrs, name, def) {
            var param = attrs[name];
            var value = (param ? param[param.value] : def);
            return (typeof value === 'number') ? value : value['toInt']();
        };
        OperationMapper.prototype.getDtypeParam = function (attrs, name, def) {
            var param = attrs[name];
            if (param && param.type) {
                switch (param.type) {
                    case compiled_api_1.DataType.DT_FLOAT:
                        return 'float32';
                    case compiled_api_1.DataType.DT_INT32:
                        return 'int32';
                    case compiled_api_1.DataType.DT_BOOL:
                        return 'bool';
                    default:
                        return def;
                }
            }
            return def;
        };
        OperationMapper.prototype.getTensorShapeParam = function (attrs, name, def) {
            var param = attrs[name];
            if (param && param.shape) {
                return param.shape.dim.map(function (dim) {
                    return (typeof dim.size === 'number') ? dim.size : dim.size['toInt']();
                });
            }
            return def;
        };
        OperationMapper.prototype.getNumericArrayParam = function (attrs, name, def) {
            var param = attrs[name];
            if (param) {
                return ((param.list.f && param.list.f.length ? param.list.f :
                    param.list.i))
                    .map(function (v) { return (typeof v === 'number') ? v : v['toInt'](); });
            }
            return def;
        };
        return OperationMapper;
    }());

    var executeOp = function (node, tensorMap, context) {
        switch (node.op) {
            case 'add': {
                return [tfc.add(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'addN': {
                return [tfc.addN(getParamValue('tensors', node, tensorMap, context))];
            }
            case 'mod':
                return [tfc.mod(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            case 'mul':
                return [tfc.mul(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            case 'div': {
                return [tfc.div(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'floorDiv': {
                return [tfc.floorDiv(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'sub': {
                return [tfc.sub(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'minimum': {
                return [tfc.minimum(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'maximum': {
                return [tfc.maximum(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'pow': {
                return [tfc.pow(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'squaredDifference': {
                return [tfc.squaredDifference(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$1 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'abs':
                return [tfc.abs(getParamValue('x', node, tensorMap, context))];
            case 'acos':
                return [tfc.acos(getParamValue('x', node, tensorMap, context))];
            case 'acosh':
                return [tfc.acosh(getParamValue('x', node, tensorMap, context))];
            case 'asin':
                return [tfc.asin(getParamValue('x', node, tensorMap, context))];
            case 'asinh':
                return [tfc.asinh(getParamValue('x', node, tensorMap, context))];
            case 'atan':
                return [tfc.atan(getParamValue('x', node, tensorMap, context))];
            case 'atanh':
                return [tfc.atanh(getParamValue('x', node, tensorMap, context))];
            case 'ceil':
                return [tfc.ceil(getParamValue('x', node, tensorMap, context))];
            case 'cos':
                return [tfc.cos(getParamValue('x', node, tensorMap, context))];
            case 'cosh':
                return [tfc.cosh(getParamValue('x', node, tensorMap, context))];
            case 'elu':
                return [tfc.elu(getParamValue('x', node, tensorMap, context))];
            case 'erf':
                return [tfc.erf(getParamValue('x', node, tensorMap, context))];
            case 'exp':
                return [tfc.exp(getParamValue('x', node, tensorMap, context))];
            case 'expm1': {
                return [tfc.expm1(getParamValue('x', node, tensorMap, context))];
            }
            case 'floor':
                return [tfc.floor(getParamValue('x', node, tensorMap, context))];
            case 'log':
                return [tfc.log(getParamValue('x', node, tensorMap, context))];
            case 'log1p': {
                return [tfc.log1p(getParamValue('x', node, tensorMap, context))];
            }
            case 'neg':
                return [tfc.neg(getParamValue('x', node, tensorMap, context))];
            case 'reciprocal': {
                return [tfc.reciprocal(getParamValue('x', node, tensorMap, context))];
            }
            case 'relu':
                return [tfc.relu(getParamValue('x', node, tensorMap, context))];
            case 'round': {
                return [tfc.round(getParamValue('x', node, tensorMap, context))];
            }
            case 'selu':
                return [tfc.selu(getParamValue('x', node, tensorMap, context))];
            case 'sigmoid':
                return [tfc.sigmoid(getParamValue('x', node, tensorMap, context))];
            case 'sin':
                return [tfc.sin(getParamValue('x', node, tensorMap, context))];
            case 'sign': {
                return [tfc.sign(getParamValue('x', node, tensorMap, context))];
            }
            case 'sinh': {
                return [tfc.sinh(getParamValue('x', node, tensorMap, context))];
            }
            case 'softplus': {
                return [tfc.softplus(getParamValue('x', node, tensorMap, context))];
            }
            case 'sqrt': {
                return [tfc.sqrt(getParamValue('x', node, tensorMap, context))];
            }
            case 'square': {
                return [tfc.square(getParamValue('x', node, tensorMap, context))];
            }
            case 'tanh': {
                return [tfc.tanh(getParamValue('x', node, tensorMap, context))];
            }
            case 'tan':
                return [tfc.tan(getParamValue('x', node, tensorMap, context))];
            case 'clipByValue':
                return [tfc.clipByValue(getParamValue('x', node, tensorMap, context), getParamValue('clipValueMin', node, tensorMap, context), getParamValue('clipValueMax', node, tensorMap, context))];
            case 'rsqrt':
                return [tfc.div(tfc.scalar(1.0, 'float32'), tfc.sqrt(getTensor(node.inputNames[0], tensorMap, context)))];
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var TensorArray = (function () {
        function TensorArray(name, dtype, maxSize, elementShape, identicalElementShapes, dynamicSize, clearAfterRead) {
            this.name = name;
            this.dtype = dtype;
            this.maxSize = maxSize;
            this.elementShape = elementShape;
            this.identicalElementShapes = identicalElementShapes;
            this.dynamicSize = dynamicSize;
            this.clearAfterRead = clearAfterRead;
            this.tensors = [];
            this.closed_ = false;
            this.id = TensorArray.nextId++;
        }
        Object.defineProperty(TensorArray.prototype, "closed", {
            get: function () {
                return this.closed_;
            },
            enumerable: true,
            configurable: true
        });
        TensorArray.prototype.clearAndClose = function () {
            this.tensors.forEach(function (tensor) { return tensor.tensor.dispose(); });
            this.tensors = [];
            this.closed_ = true;
        };
        TensorArray.prototype.size = function () {
            return this.tensors.length;
        };
        TensorArray.prototype.read = function (index) {
            if (this.closed_) {
                throw new Error("TensorArray " + this.name + " has already been closed.");
            }
            if (index < 0 || index >= this.tensors.length) {
                throw new Error("Tried to read from index " + index + ", but array size is: " + this.tensors.length);
            }
            var tensorWithState = this.tensors[index];
            if (tensorWithState.cleared) {
                throw new Error("TensorArray " + this.name + ": Could not read index " + index + " twice because it was cleared after a previous read " +
                    "(perhaps try setting clear_after_read = false?).");
            }
            if (this.clearAfterRead) {
                tensorWithState.cleared = true;
            }
            tensorWithState.read = true;
            return tensorWithState.tensor;
        };
        TensorArray.prototype.readMany = function (indices) {
            var _this = this;
            return indices.map(function (index) { return _this.read(index); });
        };
        TensorArray.prototype.write = function (index, tensor) {
            if (this.closed_) {
                throw new Error("TensorArray " + this.name + " has already been closed.");
            }
            if (index < 0 || !this.dynamicSize && index >= this.maxSize) {
                throw new Error("Tried to write to index " + index + ", but array is not resizeable and size is: " + this.maxSize);
            }
            var t = this.tensors[index] || {};
            if (tensor.dtype !== this.dtype) {
                throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + index + ",\n          because the value dtype is " + tensor.dtype + ", but TensorArray dtype is " + this.dtype + ".");
            }
            if (this.size() === 0 && this.elementShape.length === 0) {
                this.elementShape = tensor.shape;
            }
            this.assertShapesMatch(this.elementShape, tensor.shape, "TensorArray " + this.name + ": Could not write to TensorArray index " + index + ".");
            if (t && t.read) {
                throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + index + ", because it has already been read.");
            }
            if (t && t.written) {
                throw new Error("TensorArray " + this.name + ": Could not write to TensorArray index " + index + ", because it has already been written.");
            }
            t.tensor = tensor;
            t.written = true;
            this.tensors[index] = t;
        };
        TensorArray.prototype.writeMany = function (indices, tensors) {
            var _this = this;
            if (indices.length !== tensors.length) {
                throw new Error("TensorArray " + this.name + ": could not write multiple tensors," +
                    ("because the index size: " + indices.length + " is not the same as tensors size: " + tensors.length + "."));
            }
            indices.forEach(function (i, index) { return _this.write(i, tensors[index]); });
        };
        TensorArray.prototype.gather = function (indices, dtype) {
            if (!!dtype && dtype !== this.dtype) {
                throw new Error("TensorArray dtype is " + this.dtype + " but gather requested dtype " + dtype);
            }
            if (!indices) {
                indices = [];
                for (var i = 0; i < this.size(); i++) {
                    indices.push(i);
                }
            }
            if (indices.length === 0) {
                return tfc.tensor([], [0].concat(this.elementShape));
            }
            var tensors = this.readMany(indices);
            this.assertShapesMatch(this.elementShape, tensors[0].shape, 'TensorArray shape mismatch: ');
            return tfc.stack(tensors, 0);
        };
        TensorArray.prototype.concat = function (dtype) {
            if (!!dtype && dtype !== this.dtype) {
                throw new Error("TensorArray dtype is " + this.dtype + " but concat requested dtype " + dtype);
            }
            if (this.size() === 0) {
                return tfc.tensor([], [0].concat(this.elementShape));
            }
            var indices = [];
            for (var i = 0; i < this.size(); i++) {
                indices.push(i);
            }
            var tensors = this.readMany(indices);
            this.assertShapesMatch(this.elementShape, tensors[0].shape, "TensorArray shape mismatch: tensor array shape (" + this.elementShape + ") vs first tensor shape (" + tensors[0].shape + ")");
            return tfc.concat(tensors, 0);
        };
        TensorArray.prototype.scatter = function (indices, tensor) {
            if (tensor.dtype !== this.dtype) {
                throw new Error("TensorArray dtype is " + this.dtype + " but tensor has dtype " + tensor.dtype);
            }
            if (indices.length !== tensor.shape[0]) {
                throw new Error("Expected len(indices) == tensor.shape[0], but saw: " + indices.length + " vs. " + tensor.shape[0]);
            }
            var maxIndex = Math.max.apply(Math, indices);
            if (!this.dynamicSize && maxIndex >= this.maxSize) {
                throw new Error("Max index must be < array size (" + maxIndex + "  vs. " + this.maxSize + ")");
            }
            this.writeMany(indices, tfc.unstack(tensor, 0));
        };
        TensorArray.prototype.split = function (length, tensor) {
            var _this = this;
            if (tensor.dtype !== this.dtype) {
                throw new Error("TensorArray dtype is " + this.dtype + " but tensor has dtype " + tensor.dtype);
            }
            var totalLength = 0;
            var cumulativeLengths = length.map(function (len) {
                totalLength += len;
                return totalLength;
            });
            if (totalLength !== tensor.shape[0]) {
                throw new Error("Expected sum of lengths to be equal to\n          tensor.shape[0], but sum of lengths is\n        " + totalLength + ", and tensor's shape is: " + tensor.shape);
            }
            if (!this.dynamicSize && length.length !== this.maxSize) {
                throw new Error("TensorArray's size is not equal to the size of lengths (" + this.maxSize + " vs. " + length.length + "), " +
                    'and the TensorArray is not marked as dynamically resizeable');
            }
            var elementPerRow = totalLength === 0 ? 0 : tensor.size / totalLength;
            var tensors = [];
            tfc.tidy(function () {
                tensor = tensor.reshape([1, totalLength, elementPerRow]);
                for (var i = 0; i < length.length; ++i) {
                    var previousLength = (i === 0) ? 0 : cumulativeLengths[i - 1];
                    var indices_1 = [0, previousLength, 0];
                    var sizes = [1, length[i], elementPerRow];
                    tensors[i] = tfc.slice(tensor, indices_1, sizes).reshape(_this.elementShape);
                }
                return tensors;
            });
            var indices = [];
            for (var i = 0; i < length.length; i++) {
                indices[i] = i;
            }
            this.writeMany(indices, tensors);
        };
        TensorArray.prototype.assertShapesMatch = function (shapeA, shapeB, errorMessagePrefix) {
            if (errorMessagePrefix === void 0) { errorMessagePrefix = ''; }
            tfc.util.assert(this.arraysEqual(shapeA, shapeB), errorMessagePrefix + (" Shapes " + shapeA + " and " + shapeB + " must match"));
        };
        TensorArray.prototype.arraysEqual = function (n1, n2) {
            if (n1.length !== n2.length) {
                return false;
            }
            for (var i = 0; i < n1.length; i++) {
                if (n1[i] !== -1 && n2[i] !== -1 && n1[i] !== n2[i]) {
                    return false;
                }
            }
            return true;
        };
        TensorArray.nextId = 0;
        return TensorArray;
    }());

    function executeOp$2(node, tensorMap, context) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, pred, data_1, inputName, frameId, data, tensor, input, size, dtype, elementShape, dynamicSize, clearAfterRead, identicalElementShapes, name_1, tensorArray, id, index, writeTensor, writeTensorArray, readId, readIndex, readTensorArray, gatherId, gatherIndices, gatherDtype, gatherTensorArray, scatterId, scatterIndices, scatterTensor, scatterTensorArray, concatId, concatTensorArray, concatDtype, splitId, splitTensor, lengths, splitTensorArray, sizeId, sizeTensorArray, closeId, closeTensorArray;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = node.op;
                        switch (_a) {
                            case 'loopCond': return [3, 1];
                            case 'switch': return [3, 2];
                            case 'merge': return [3, 4];
                            case 'enter': return [3, 5];
                            case 'exit': return [3, 6];
                            case 'nextIteration': return [3, 7];
                            case 'tensorArray': return [3, 8];
                            case 'tensorArrayWrite': return [3, 9];
                            case 'tensorArrayRead': return [3, 10];
                            case 'tensorArrayGather': return [3, 11];
                            case 'tensorArrayScatter': return [3, 12];
                            case 'tensorArrayConcat': return [3, 13];
                            case 'tensorArraySplit': return [3, 14];
                            case 'tensorArraySize': return [3, 15];
                            case 'tensorArrayClose': return [3, 16];
                        }
                        return [3, 17];
                    case 1: return [2, [getParamValue('pred', node, tensorMap, context)]];
                    case 2:
                        pred = getParamValue('pred', node, tensorMap, context);
                        data_1 = getParamValue('data', node, tensorMap, context);
                        return [4, pred.data()];
                    case 3: return [2, (_b.sent())[0] ? [undefined, data_1] : [data_1, undefined]];
                    case 4:
                        inputName = node.inputNames.find(function (name) { return getTensor(name, tensorMap, context) !== undefined; });
                        return [2, inputName ? [getTensor(inputName, tensorMap, context)] : undefined];
                    case 5:
                        frameId = getParamValue('frameName', node, tensorMap, context);
                        data = getParamValue('tensor', node, tensorMap, context);
                        context.enterFrame(frameId);
                        return [2, [data]];
                    case 6:
                        tensor = getParamValue('tensor', node, tensorMap, context);
                        context.exitFrame();
                        return [2, [tensor]];
                    case 7:
                        input = getParamValue('tensor', node, tensorMap, context);
                        context.nextIteration();
                        return [2, [input]];
                    case 8:
                        size = getParamValue('size', node, tensorMap, context);
                        dtype = getParamValue('dtype', node, tensorMap, context);
                        elementShape = getParamValue('elementShape', node, tensorMap, context);
                        dynamicSize = getParamValue('dynamicSize', node, tensorMap, context);
                        clearAfterRead = getParamValue('clearAfterRead', node, tensorMap, context);
                        identicalElementShapes = getParamValue('identicalElementShapes', node, tensorMap, context);
                        name_1 = getParamValue('name', node, tensorMap, context);
                        tensorArray = new TensorArray(name_1, dtype, size, elementShape, identicalElementShapes, dynamicSize, clearAfterRead);
                        context.addTensorArray(tensorArray);
                        return [2, [tfc.scalar(tensorArray.id), tfc.scalar(1.0)]];
                    case 9:
                        id = getParamValue('tensorArrayId', node, tensorMap, context);
                        index = getParamValue('index', node, tensorMap, context);
                        writeTensor = getParamValue('tensor', node, tensorMap, context);
                        writeTensorArray = context.getTensorArray(id);
                        writeTensorArray.write(index, writeTensor);
                        return [2, [tfc.scalar(1.0)]];
                    case 10:
                        readId = getParamValue('tensorArrayId', node, tensorMap, context);
                        readIndex = getParamValue('index', node, tensorMap, context);
                        readTensorArray = context.getTensorArray(readId);
                        return [2, [readTensorArray.read(readIndex)]];
                    case 11:
                        gatherId = getParamValue('tensorArrayId', node, tensorMap, context);
                        gatherIndices = getParamValue('indices', node, tensorMap, context);
                        gatherDtype = getParamValue('dtype', node, tensorMap, context);
                        gatherTensorArray = context.getTensorArray(gatherId);
                        return [2, [gatherTensorArray.gather(gatherIndices, gatherDtype)]];
                    case 12:
                        scatterId = getParamValue('tensorArrayId', node, tensorMap, context);
                        scatterIndices = getParamValue('indices', node, tensorMap, context);
                        scatterTensor = getParamValue('tensor', node, tensorMap, context);
                        scatterTensorArray = context.getTensorArray(scatterId);
                        scatterTensorArray.scatter(scatterIndices, scatterTensor);
                        return [2, [tfc.scalar(1.0)]];
                    case 13:
                        concatId = getParamValue('tensorArrayId', node, tensorMap, context);
                        concatTensorArray = context.getTensorArray(concatId);
                        concatDtype = getParamValue('dtype', node, tensorMap, context);
                        return [2, [concatTensorArray.concat(concatDtype)]];
                    case 14:
                        splitId = getParamValue('tensorArrayId', node, tensorMap, context);
                        splitTensor = getParamValue('tensor', node, tensorMap, context);
                        lengths = getParamValue('lengths', node, tensorMap, context);
                        splitTensorArray = context.getTensorArray(splitId);
                        splitTensorArray.split(lengths, splitTensor);
                        return [2, [tfc.scalar(1.0)]];
                    case 15:
                        sizeId = getParamValue('tensorArrayId', node, tensorMap, context);
                        sizeTensorArray = context.getTensorArray(sizeId);
                        return [2, [tfc.scalar(sizeTensorArray.size(), 'int32')]];
                    case 16:
                        closeId = getParamValue('tensorArrayId', node, tensorMap, context);
                        closeTensorArray = context.getTensorArray(closeId);
                        closeTensorArray.clearAndClose();
                        return [2, []];
                    case 17: throw TypeError("Node type " + node.op + " is not implemented");
                }
            });
        });
    }

    var executeOp$3 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'conv1d': {
                var stride = getParamValue('stride', node, tensorMap, context);
                var pad = getParamValue('pad', node, tensorMap, context);
                var dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                    .toUpperCase();
                var dilation = getParamValue('dilation', node, tensorMap, context);
                return [tfc.conv1d(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), stride, pad, dataFormat, dilation)];
            }
            case 'conv2d': {
                var stride = getParamValue('strides', node, tensorMap, context);
                var pad = getParamValue('pad', node, tensorMap, context);
                var dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                    .toUpperCase();
                var dilations = getParamValue('dilations', node, tensorMap, context);
                return [tfc.conv2d(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), [stride[1], stride[2]], pad, dataFormat, [dilations[0], dilations[1]])];
            }
            case 'conv2dTranspose': {
                var shape = getParamValue('outputShape', node, tensorMap, context);
                var stride = getParamValue('strides', node, tensorMap, context);
                var pad = getParamValue('pad', node, tensorMap, context);
                return [tfc.conv2dTranspose(getParamValue('x', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), shape, [stride[1], stride[2]], pad)];
            }
            case 'depthwiseConv2d': {
                var stride = getParamValue('strides', node, tensorMap, context);
                var pad = getParamValue('pad', node, tensorMap, context);
                var dilations = getParamValue('dilations', node, tensorMap, context);
                var dataFormat = getParamValue('dataFormat', node, tensorMap, context)
                    .toUpperCase();
                return [tfc.depthwiseConv2d(getParamValue('input', node, tensorMap, context), getParamValue('filter', node, tensorMap, context), [stride[1], stride[2]], pad, dataFormat, [dilations[0], dilations[1]])];
            }
            case 'avgPool': {
                var stride = getParamValue('strides', node, tensorMap, context);
                var pad = getParamValue('pad', node, tensorMap, context);
                var kernelSize = getParamValue('kernelSize', node, tensorMap, context);
                return [tfc.avgPool(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad)];
            }
            case 'maxPool': {
                var stride = getParamValue('strides', node, tensorMap, context);
                var pad = getParamValue('pad', node, tensorMap, context);
                var kernelSize = getParamValue('kernelSize', node, tensorMap, context);
                return [tfc.maxPool(getParamValue('x', node, tensorMap, context), [kernelSize[1], kernelSize[2]], [stride[1], stride[2]], pad)];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$4 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'fill': {
                var shape = getParamValue('shape', node, tensorMap, context);
                var dtype = getParamValue('dtype', node, tensorMap, context);
                var value = getParamValue('value', node, tensorMap, context);
                return [tfc.fill(shape, value, dtype)];
            }
            case 'linspace': {
                var start = getParamValue('start', node, tensorMap, context);
                var stop_1 = getParamValue('stop', node, tensorMap, context);
                var num = getParamValue('num', node, tensorMap, context);
                return [tfc.linspace(start, stop_1, num)];
            }
            case 'oneHot': {
                var indices = getParamValue('indices', node, tensorMap, context);
                var depth = getParamValue('depth', node, tensorMap, context);
                var onValue = getParamValue('onValue', node, tensorMap, context);
                var offValue = getParamValue('offValue', node, tensorMap, context);
                return [tfc.oneHot(indices, depth, onValue, offValue)];
            }
            case 'ones': {
                return [tfc.ones(getParamValue('shape', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
            }
            case 'onesLike': {
                return [tfc.onesLike(getParamValue('x', node, tensorMap, context))];
            }
            case 'randomUniform': {
                return [tfc.randomUniform(getParamValue('shape', node, tensorMap, context), getParamValue('minval', node, tensorMap, context), getParamValue('maxval', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
            }
            case 'range': {
                var start = getParamValue('start', node, tensorMap, context);
                var stop_2 = getParamValue('stop', node, tensorMap, context);
                var step = getParamValue('step', node, tensorMap, context);
                return [tfc.range(start, stop_2, step, getParamValue('dtype', node, tensorMap, context))];
            }
            case 'truncatedNormal': {
                var shape = getParamValue('shape', node, tensorMap, context);
                var mean = getParamValue('mean', node, tensorMap, context);
                var stdDev = getParamValue('stdDev', node, tensorMap, context);
                var seed = getParamValue('seed', node, tensorMap, context);
                return [tfc.truncatedNormal(shape, mean, stdDev, getParamValue('dtype', node, tensorMap, context), seed)];
            }
            case 'zeros': {
                return [tfc.zeros(getParamValue('shape', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
            }
            case 'zerosLike': {
                return [tfc.zerosLike(getParamValue('x', node, tensorMap, context))];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    function executeOp$5(node, tensorMap, context) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, boxes, scores, maxOutputSize, iouThreshold, scoreThreshold;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = node.op;
                        switch (_a) {
                            case 'nonMaxSuppression': return [3, 1];
                            case 'whereAsync': return [3, 3];
                        }
                        return [3, 5];
                    case 1:
                        boxes = getParamValue('boxes', node, tensorMap, context);
                        scores = getParamValue('scores', node, tensorMap, context);
                        maxOutputSize = getParamValue('maxOutputSize', node, tensorMap, context);
                        iouThreshold = getParamValue('iouThreshold', node, tensorMap, context);
                        scoreThreshold = getParamValue('scoreThreshold', node, tensorMap, context);
                        return [4, tfc.image.nonMaxSuppressionAsync(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold)];
                    case 2: return [2, [_b.sent()]];
                    case 3: return [4, tfc.whereAsync(getParamValue('condition', node, tensorMap, context))];
                    case 4: return [2, [_b.sent()]];
                    case 5: throw TypeError("Node type " + node.op + " is not implemented");
                }
            });
        });
    }

    var executeOp$6 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'topK': {
                var x = getParamValue('x', node, tensorMap, context);
                var k = getParamValue('k', node, tensorMap, context);
                var sorted = getParamValue('sorted', node, tensorMap, context);
                var result = tfc.topk(x, k, sorted);
                return [result.values, result.indices];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$7 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'const': {
                return tensorMap[node.name];
            }
            case 'placeholder':
                var def = getParamValue('default', node, tensorMap, context);
                return [getTensor(node.name, tensorMap, context) || def];
            case 'identity':
            case 'stopGradient':
            case 'fakeQuantWithMinMaxVars':
                return [getParamValue('x', node, tensorMap, context)];
            case 'snapshot':
                var snapshot = getParamValue('x', node, tensorMap, context);
                return [snapshot.clone()];
            case 'shape':
                return [tfc.tensor1d(getParamValue('x', node, tensorMap, context).shape, 'int32')];
            case 'shapeN':
                return getParamValue('x', node, tensorMap, context)
                    .map(function (t) { return tfc.tensor1d(t.shape); });
            case 'size':
                return [tfc.scalar(getParamValue('x', node, tensorMap, context).size, 'int32')];
            case 'rank':
                return [tfc.scalar(getParamValue('x', node, tensorMap, context).rank, 'int32')];
            case 'noop':
                return [];
            case 'print':
                var input = getParamValue('x', node, tensorMap, context);
                var data = getParamValue('data', node, tensorMap, context);
                var message = getParamValue('message', node, tensorMap, context);
                var summarize = getParamValue('summarize', node, tensorMap, context);
                console.warn('The graph has a tf.print() operation,' +
                    'usually used for debugging, which slows down performance.');
                console.log(message);
                for (var i = 0; i < data.length; i++) {
                    console.log(Array.prototype.slice.call(data[0].dataSync()).slice(0, summarize));
                }
                return [input];
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$8 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'resizeBilinear': {
                var images = getParamValue('images', node, tensorMap, context);
                var size = getParamValue('size', node, tensorMap, context);
                var alignCorners = getParamValue('alignCorners', node, tensorMap, context);
                return [tfc.image.resizeBilinear(images, [size[0], size[1]], alignCorners)];
            }
            case 'resizeNearestNeighbor': {
                var images = getParamValue('images', node, tensorMap, context);
                var size = getParamValue('size', node, tensorMap, context);
                var alignCorners = getParamValue('alignCorners', node, tensorMap, context);
                return [tfc.image.resizeNearestNeighbor(images, [size[0], size[1]], alignCorners)];
            }
            case 'cropAndResize': {
                var image = getParamValue('image', node, tensorMap, context);
                var boxes = getParamValue('boxes', node, tensorMap, context);
                var boxInd = getParamValue('boxInd', node, tensorMap, context);
                var cropSize = getParamValue('cropSize', node, tensorMap, context);
                var method = getParamValue('method', node, tensorMap, context);
                var extrapolationValue = getParamValue('extrapolationValue', node, tensorMap, context);
                return [tfc.image.cropAndResize(image, boxes, boxInd, cropSize, method, extrapolationValue)];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$9 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'equal': {
                return [tfc.equal(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'notEqual': {
                return [tfc.notEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'greater': {
                return [tfc.greater(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'greaterEqual': {
                return [tfc.greaterEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'less': {
                return [tfc.less(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'lessEqual': {
                return [tfc.lessEqual(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'logicalAnd': {
                return [tfc.logicalAnd(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'logicalNot': {
                return [tfc.logicalNot(getParamValue('a', node, tensorMap, context))];
            }
            case 'logicalOr': {
                return [tfc.logicalOr(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            case 'where': {
                return [tfc.where(getParamValue('condition', node, tensorMap, context), getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context))];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$10 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'matMul':
                return [tfc.matMul(getParamValue('a', node, tensorMap, context), getParamValue('b', node, tensorMap, context), getParamValue('transposeA', node, tensorMap, context), getParamValue('transposeB', node, tensorMap, context))];
            case 'transpose':
                return [tfc.transpose(getParamValue('x', node, tensorMap, context), getParamValue('perm', node, tensorMap, context))];
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$11 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'batchNormalization': {
                return [tfc.batchNormalization(getParamValue('x', node, tensorMap, context), getParamValue('mean', node, tensorMap, context), getParamValue('variance', node, tensorMap, context), getParamValue('epsilon', node, tensorMap, context), getParamValue('scale', node, tensorMap, context), getParamValue('offset', node, tensorMap, context))];
            }
            case 'localResponseNormalization': {
                return [tfc.localResponseNormalization(getParamValue('x', node, tensorMap, context), getParamValue('radius', node, tensorMap, context), getParamValue('bias', node, tensorMap, context), getParamValue('alpha', node, tensorMap, context), getParamValue('beta', node, tensorMap, context))];
            }
            case 'softmax': {
                return [tfc.softmax(getParamValue('x', node, tensorMap, context))];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$12 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'max': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var keepDims = getParamValue('keepDims', node, tensorMap, context);
                return [tfc.max(getParamValue('x', node, tensorMap, context), axis, keepDims)];
            }
            case 'mean': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var keepDims = getParamValue('keepDims', node, tensorMap, context);
                return [tfc.mean(getParamValue('x', node, tensorMap, context), axis, keepDims)];
            }
            case 'min': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var keepDims = getParamValue('keepDims', node, tensorMap, context);
                return [tfc.min(getParamValue('x', node, tensorMap, context), axis, keepDims)];
            }
            case 'sum': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var keepDims = getParamValue('keepDims', node, tensorMap, context);
                return [tfc.sum(getParamValue('x', node, tensorMap, context), axis, keepDims)];
            }
            case 'all': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var keepDims = getParamValue('keepDims', node, tensorMap, context);
                return [tfc.all(getParamValue('x', node, tensorMap, context), axis, keepDims)];
            }
            case 'any': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var keepDims = getParamValue('keepDims', node, tensorMap, context);
                return [tfc.any(getParamValue('x', node, tensorMap, context), axis, keepDims)];
            }
            case 'argMax': {
                var axis = getParamValue('axis', node, tensorMap, context);
                return [tfc.argMax(getParamValue('x', node, tensorMap, context), axis)];
            }
            case 'argMin': {
                var axis = getParamValue('axis', node, tensorMap, context);
                return [tfc.argMin(getParamValue('x', node, tensorMap, context), axis)];
            }
            case 'prod': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var keepDims = getParamValue('keepDims', node, tensorMap, context);
                return [tfc.prod(getParamValue('x', node, tensorMap, context), axis, keepDims)];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$13 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'concat': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var inputs = getParamValue('tensors', node, tensorMap, context);
                return [tfc.concat(inputs, axis)];
            }
            case 'gather': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var input = getParamValue('x', node, tensorMap, context);
                var indices = getParamValue('indices', node, tensorMap, context);
                return [tfc.gather(input, indices, axis)];
            }
            case 'reverse': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var input = getParamValue('x', node, tensorMap, context);
                return [tfc.reverse(input, axis)];
            }
            case 'slice': {
                var begin = getParamValue('begin', node, tensorMap, context);
                var size = getParamValue('size', node, tensorMap, context);
                return [tfc.slice(getParamValue('x', node, tensorMap, context), begin, size)];
            }
            case 'stridedSlice': {
                var begin = getParamValue('begin', node, tensorMap, context);
                var end = getParamValue('end', node, tensorMap, context);
                var strides = getParamValue('strides', node, tensorMap, context);
                var beginMask = getParamValue('beginMask', node, tensorMap, context);
                var endMask = getParamValue('endMask', node, tensorMap, context);
                var ellipsisMask = getParamValue('ellipsisMask', node, tensorMap, context);
                var newAxisMask = getParamValue('newAxisMask', node, tensorMap, context);
                var shrinkAxisMask = getParamValue('shrinkAxisMask', node, tensorMap, context);
                var tensor = getParamValue('x', node, tensorMap, context);
                if (begin.length === 1 && tensor.shape.length > 1) {
                    for (var i = 1; i < tensor.shape.length; i++) {
                        begin.push(0);
                        end.push(tensor.shape[i]);
                        strides.push(strides[0]);
                    }
                }
                return [tfc.stridedSlice(tensor, begin, end, strides, beginMask, endMask, ellipsisMask, newAxisMask, shrinkAxisMask)];
            }
            case 'stack': {
                return tfc.tidy(function () {
                    var axis = getParamValue('axis', node, tensorMap, context);
                    var tensors = getParamValue('tensors', node, tensorMap, context);
                    var shape = tensors[0].shape;
                    var squeezedShape = tensors[0].squeeze().shape;
                    var mapped = tensors.map(function (tensor) {
                        var sameShape = tfc.util.arraysEqual(tensor.shape, shape);
                        if (!sameShape &&
                            !tfc.util.arraysEqual(tensor.squeeze().shape, squeezedShape)) {
                            throw new Error('the input tensors shape does not match');
                        }
                        return sameShape ? tensor : tensor.reshape(shape);
                    });
                    return [tfc.stack(mapped, axis)];
                });
            }
            case 'unstack': {
                return tfc.tidy(function () {
                    var axis = getParamValue('axis', node, tensorMap, context);
                    var tensor = getParamValue('tensor', node, tensorMap, context);
                    return tfc.unstack(tensor, axis);
                });
            }
            case 'tile': {
                var reps = getParamValue('reps', node, tensorMap, context);
                return [tfc.tile(getParamValue('x', node, tensorMap, context), reps)];
            }
            case 'split': {
                var axis = getParamValue('axis', node, tensorMap, context);
                var numOrSizeSplits = getParamValue('numOrSizeSplits', node, tensorMap, context);
                return tfc.split(getParamValue('x', node, tensorMap, context), numOrSizeSplits, axis);
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    var executeOp$14 = function (node, tensorMap, context) {
        switch (node.op) {
            case 'cast': {
                return [tfc.cast(getParamValue('x', node, tensorMap, context), getParamValue('dtype', node, tensorMap, context))];
            }
            case 'expandDims': {
                var axis = getParamValue('axis', node, tensorMap, context);
                return [tfc.expandDims(getParamValue('x', node, tensorMap, context), axis)];
            }
            case 'squeeze': {
                var axis = getParamValue('axis', node, tensorMap, context);
                return [tfc.squeeze(getParamValue('x', node, tensorMap, context), axis)];
            }
            case 'reshape': {
                return [tfc.reshape(getParamValue('x', node, tensorMap, context), getParamValue('shape', node, tensorMap, context))];
            }
            case 'pad': {
                return [tfc.pad(getParamValue('x', node, tensorMap, context), split(getParamValue('padding', node, tensorMap, context), 2), getParamValue('constantValue', node, tensorMap, context))];
            }
            case 'spaceToBatchND': {
                var blockShape = getParamValue('blockShape', node, tensorMap, context);
                var paddings = split(getParamValue('paddings', node, tensorMap, context), 2);
                return [tfc.spaceToBatchND(getParamValue('x', node, tensorMap, context), blockShape, paddings)];
            }
            case 'batchToSpaceND': {
                var blockShape = getParamValue('blockShape', node, tensorMap, context);
                var crops = split(getParamValue('crops', node, tensorMap, context), 2);
                return [tfc.batchToSpaceND(getParamValue('x', node, tensorMap, context), blockShape, crops)];
            }
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    };

    function executeOp$15(node, tensorMap, context) {
        switch (node.category) {
            case 'arithmetic':
                return executeOp(node, tensorMap, context);
            case 'basic_math':
                return executeOp$1(node, tensorMap, context);
            case 'control':
                return executeOp$2(node, tensorMap, context);
            case 'convolution':
                return executeOp$3(node, tensorMap, context);
            case 'creation':
                return executeOp$4(node, tensorMap, context);
            case 'dynamic':
                return executeOp$5(node, tensorMap, context);
            case 'evaluation':
                return executeOp$6(node, tensorMap, context);
            case 'image':
                return executeOp$8(node, tensorMap, context);
            case 'graph':
                return executeOp$7(node, tensorMap, context);
            case 'logical':
                return executeOp$9(node, tensorMap, context);
            case 'matrices':
                return executeOp$10(node, tensorMap, context);
            case 'normalization':
                return executeOp$11(node, tensorMap, context);
            case 'reduction':
                return executeOp$12(node, tensorMap, context);
            case 'slice_join':
                return executeOp$13(node, tensorMap, context);
            case 'transformation':
                return executeOp$14(node, tensorMap, context);
            default:
                throw TypeError("Node type " + node.op + " is not implemented");
        }
    }

    var ExecutionContext = (function () {
        function ExecutionContext(weightMap, tensorArrayMap) {
            this.weightMap = weightMap;
            this.tensorArrayMap = tensorArrayMap;
            this.rootContext = { id: 0, frameName: '', iterationId: 0 };
            this.contexts = [this.rootContext];
            this.lastId = 0;
            this.generateCurrentContextIds();
        }
        ExecutionContext.prototype.newFrame = function (id, frameName) {
            return { id: id, frameName: frameName, iterationId: 0 };
        };
        Object.defineProperty(ExecutionContext.prototype, "currentContext", {
            get: function () {
                return this.contexts;
            },
            set: function (contexts) {
                if (this.contexts !== contexts) {
                    this.contexts = contexts;
                    this.generateCurrentContextIds();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExecutionContext.prototype, "currentContextId", {
            get: function () {
                return this._currentContextIds[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ExecutionContext.prototype, "currentContextIds", {
            get: function () {
                return this._currentContextIds;
            },
            enumerable: true,
            configurable: true
        });
        ExecutionContext.prototype.generateCurrentContextIds = function () {
            var names = [];
            for (var i = 0; i < this.contexts.length - 1; i++) {
                var contexts = this.contexts.slice(0, this.contexts.length - i);
                names.push(this.contextIdforContexts(contexts));
            }
            names.push('');
            this._currentContextIds = names;
        };
        ExecutionContext.prototype.contextIdforContexts = function (contexts) {
            return contexts ?
                contexts
                    .map(function (context) { return (context.id === 0 && context.iterationId === 0) ?
                    '' :
                    context.frameName + "-" + context.iterationId; })
                    .join('/') :
                '';
        };
        ExecutionContext.prototype.enterFrame = function (frameId) {
            if (this.contexts) {
                this.lastId++;
                this.contexts = this.contexts.slice();
                this.contexts.push(this.newFrame(this.lastId, frameId));
                this._currentContextIds.unshift(this.contextIdforContexts(this.contexts));
            }
        };
        ExecutionContext.prototype.exitFrame = function () {
            if (this.contexts && this.contexts.length > 1) {
                this.contexts = this.contexts.slice();
                this.contexts.splice(-1);
                this.currentContextIds.shift();
            }
            else {
                throw new Error('Cannot exit frame, the context is empty');
            }
        };
        ExecutionContext.prototype.nextIteration = function () {
            if (this.contexts && this.contexts.length > 0) {
                this.contexts = this.contexts.slice();
                this.lastId++;
                var context = Object.assign({}, this.contexts[this.contexts.length - 1]);
                context.iterationId += 1;
                context.id = this.lastId;
                this.contexts.splice(-1, 1, context);
                this._currentContextIds.splice(0, 1, this.contextIdforContexts(this.contexts));
            }
            else {
                throw new Error('Cannot increase frame iteration, the context is empty');
            }
        };
        ExecutionContext.prototype.getWeight = function (name) {
            return this.weightMap[name];
        };
        ExecutionContext.prototype.addTensorArray = function (tensorArray) {
            this.tensorArrayMap[tensorArray.id] = tensorArray;
        };
        ExecutionContext.prototype.getTensorArray = function (id) {
            return this.tensorArrayMap[id];
        };
        return ExecutionContext;
    }());

    var GraphExecutor = (function () {
        function GraphExecutor(graph) {
            this.graph = graph;
            this.compiledMap = new Map();
            this._weightMap = {};
            this.SEPERATOR = ',';
            this.placeholders = graph.placeholders;
            this._outputs = graph.outputs;
            this.compile();
        }
        Object.defineProperty(GraphExecutor.prototype, "weightMap", {
            get: function () {
                return this._weightMap;
            },
            set: function (weightMap) {
                var weightIds = Object.keys(weightMap).map(function (key) { return weightMap[key].map(function (tensor) { return tensor.id; }); });
                this.weightIds = [].concat.apply([], weightIds);
                this._weightMap = weightMap;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphExecutor.prototype, "inputs", {
            get: function () {
                return this.placeholders.map(function (node) {
                    return {
                        name: node.name,
                        shape: node.params['shape'] ? node.params['shape'].value :
                            undefined,
                        dtype: node.params['dtype'] ? node.params['dtype'].value :
                            undefined
                    };
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphExecutor.prototype, "outputs", {
            get: function () {
                return this._outputs.map(function (node) {
                    return {
                        name: node.name,
                        shape: node.params['shape'] ? node.params['shape'].value :
                            undefined,
                        dtype: node.params['dtype'] ? node.params['dtype'].value :
                            undefined
                    };
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphExecutor.prototype, "inputNodes", {
            get: function () {
                return this.placeholders.map(function (node) { return node.name; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphExecutor.prototype, "outputNodes", {
            get: function () {
                return this.outputs.map(function (node) { return node.name; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphExecutor.prototype, "isControlFlowModel", {
            get: function () {
                return this.graph.withControlFlow;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GraphExecutor.prototype, "isDynamicShapeModel", {
            get: function () {
                return this.graph.withDynamicShape;
            },
            enumerable: true,
            configurable: true
        });
        GraphExecutor.prototype.compile = function (startNodes) {
            if (this.graph.withControlFlow || this.graph.withDynamicShape) {
                return;
            }
            // console.log("compiling");
            var compiledOrder = [];
            var inputs = startNodes || this.graph.placeholders;
            var sortedNodeNames = inputs.map(function (node) { return node.name; }).sort();
            var nameKey = sortedNodeNames.join(this.SEPERATOR);
            if (this.compiledMap.get(nameKey)) {
                return;
            }
            var stack = inputs.concat(this.graph.weights);
            var visited = {};
            while (stack.length > 0) {
                var node = stack.pop();
                visited[node.name] = true;
                compiledOrder.push(node);
                node.children.forEach(function (childNode) {
                    if (!visited[childNode.name] && childNode.inputNames.every(function (name) {
                        var nodeName = getNodeNameAndIndex(name)[0];
                        return visited[nodeName];
                    })) {
                        stack.push(childNode);
                    }
                });
            }
            console.log(nameKey);
            this.compiledMap.set(nameKey, compiledOrder);
            console.log(this.compiledMap);
        };
        GraphExecutor.prototype.execute = function (inputs, strictInputCheck, outputs) {
            var _this = this;
            if (strictInputCheck === void 0) { strictInputCheck = true; }
            var names = Object.keys(inputs).sort();
            this.checkInput(inputs, strictInputCheck);
            this.checkInputShapeAndType(inputs, strictInputCheck);
            this.compile(names.map(function (name) { return _this.graph.nodes[name]; }));
            var outputNames = this.calculateOutputs(outputs);
            this.checkOutput(this.compiledMap.get(names.join(this.SEPERATOR)), outputNames);
            var tensorArrayMap = {};
            var result = tfc.tidy(function () {
                var context = new ExecutionContext(_this._weightMap, tensorArrayMap);
                var tensorMap = __assign({}, _this.weightMap, inputs);
                var compiledNodes = _this.compiledMap.get(names.join(_this.SEPERATOR));
                for (var i = 0; i < compiledNodes.length; i++) {
                    var node = compiledNodes[i];
                    if (!tensorMap[node.name]) {
                        tensorMap[node.name] =
                            executeOp$15(node, tensorMap, context);
                    }
                    if (outputNames.every(function (name) { return !!tensorMap[name]; })) {
                        break;
                    }
                }
                return _this.findOutputs(tensorMap, context, outputNames);
            });
            return result;
        };
        GraphExecutor.prototype.executeAsync = function (inputs, outputs) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var tensorArrayMap, context, tensors, results, outputIds, inputIdArray, inputIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.checkInput(inputs, false);
                            this.checkInputShapeAndType(inputs, false);
                            tensorArrayMap = {};
                            context = new ExecutionContext(this._weightMap, tensorArrayMap);
                            return [4, this.executeWithControlFlow(inputs, context)];
                        case 1:
                            tensors = _a.sent();
                            results = this.findOutputs(tensors, context, outputs);
                            outputIds = Object.keys(results).map(function (key) { return results[key].id; });
                            inputIdArray = Object.keys(inputs).map(function (key) { return inputs[key].map(function (input) { return input.id; }); });
                            inputIds = [].concat.apply([], inputIdArray);
                            Object.keys(tensors).forEach(function (key) {
                                var tensorArray = tensors[key];
                                tensorArray.forEach(function (tensor) {
                                    if (tensor && outputIds.indexOf(tensor.id) === -1 &&
                                        inputIds.indexOf(tensor.id) === -1 &&
                                        _this.weightIds.indexOf(tensor.id) === -1) {
                                        tensor.dispose();
                                    }
                                });
                            });
                            return [2, results];
                    }
                });
            });
        };
        GraphExecutor.prototype.executeWithControlFlow = function (inputs, context) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                var names, inputNodes, stack, tensorMap, added, promises;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            names = Object.keys(inputs);
                            inputNodes = names.map(function (name) { return _this.graph.nodes[name]; });
                            stack = inputNodes.concat(this.graph.weights).map(function (node) {
                                return { node: node, contexts: context.currentContext };
                            });
                            tensorMap = __assign({}, this.weightMap, inputs);
                            added = {};
                            _a.label = 1;
                        case 1:
                            if (!(stack.length > 0)) return [3, 3];
                            promises = this.processStack(inputNodes, stack, context, tensorMap, added);
                            return [4, Promise.all(promises)];
                        case 2:
                            _a.sent();
                            return [3, 1];
                        case 3: return [2, tensorMap];
                    }
                });
            });
        };
        GraphExecutor.prototype.processStack = function (inputNodes, stack, context, tensorMap, added) {
            var _this = this;
            var promises = [];
            var _loop_1 = function () {
                var item = stack.pop();
                context.currentContext = item.contexts;
                var nodeName = '';
                if (item.node.op === 'enter' &&
                    getParamValue('isConstant', item.node, tensorMap, context)) {
                    nodeName = getNodeNameAndIndex(item.node.name, context)[0];
                }
                if (inputNodes.indexOf(item.node) === -1) {
                    var tensors = executeOp$15(item.node, tensorMap, context);
                    if (!nodeName) {
                        nodeName = getNodeNameAndIndex(item.node.name, context)[0];
                    }
                    var currentContext_1 = context.currentContext;
                    if (tensors instanceof Promise) {
                        promises.push(tensors.then(function (t) {
                            tensorMap[nodeName] = t;
                            context.currentContext = currentContext_1;
                            _this.processChildNodes(item.node, stack, context, tensorMap, added);
                            return t;
                        }));
                    }
                    else {
                        tensorMap[nodeName] = tensors;
                        this_1.processChildNodes(item.node, stack, context, tensorMap, added);
                    }
                }
                else {
                    this_1.processChildNodes(item.node, stack, context, tensorMap, added);
                }
            };
            var this_1 = this;
            while (stack.length > 0) {
                _loop_1();
            }
            return promises;
        };
        GraphExecutor.prototype.processChildNodes = function (node, stack, context, tensorMap, added) {
            node.children.forEach(function (childNode) {
                var nodeName = getNodeNameAndIndex(childNode.name, context)[0];
                if (!added[nodeName]) {
                    if (childNode.op === 'merge') {
                        if (childNode.inputNames.some(function (name) {
                            return !!getTensor(name, tensorMap, context);
                        })) {
                            added[nodeName] = true;
                            stack.push({ contexts: context.currentContext, node: childNode });
                        }
                    }
                    else if (childNode.inputNames.every(function (name) {
                        return !!getTensor(name, tensorMap, context);
                    })) {
                        added[nodeName] = true;
                        stack.push({ contexts: context.currentContext, node: childNode });
                    }
                }
            });
        };
        GraphExecutor.prototype.calculateOutputs = function (outputs) {
            if (outputs && !(outputs instanceof Array)) {
                outputs = [outputs];
            }
            return (outputs || this.graph.outputs.map(function (node) { return node.name; }));
        };
        GraphExecutor.prototype.findOutputs = function (tensorMap, context, outputs) {
            var requestedOutputs = this.calculateOutputs(outputs);
            return requestedOutputs.reduce(function (map, name) {
                map[name] = getTensor(name, tensorMap, context);
                return map;
            }, {});
        };
        GraphExecutor.prototype.dispose = function () {
            var _this = this;
            Object.keys(this.weightMap)
                .forEach(function (key) { return _this.weightMap[key].forEach(function (tensor) { return tensor.dispose(); }); });
        };
        GraphExecutor.prototype.checkInputShapeAndType = function (inputs, strictInputCheck) {
            if (strictInputCheck === void 0) { strictInputCheck = true; }
            this.placeholders.forEach(function (node) {
                var inputTensors = inputs[node.name];
                if (!strictInputCheck && !inputTensors) {
                    return;
                }
                var input = inputTensors[0];
                if (node.params['shape'] && node.params['shape'].value) {
                    var shape_1 = node.params['shape'].value;
                    var match = shape_1.length === input.shape.length &&
                        input.shape.every(function (dim, index) { return shape_1[index] === -1 || shape_1[index] === dim; });
                    tfc.util.assert(match, "The shape of dict['" + node.name + "'] provided in model.execute(dict) must be [" + shape_1 + "], but was [" + input.shape + "]");
                }
                if (node.params['dtype'] && node.params['dtype'].value) {
                    tfc.util.assert(input.dtype === node.params['dtype'].value, "The dtype of dict['" + node.name + "'] provided in model.execute(dict) must be " + node.params['dtype'].value + ", but was " + input.dtype);
                }
            });
        };
        GraphExecutor.prototype.checkInput = function (inputs, strictInputCheck) {
            var _this = this;
            if (strictInputCheck === void 0) { strictInputCheck = true; }
            var inputKeys = Object.keys(inputs);
            var missing = [];
            var extra = [];
            this.inputNodes.forEach(function (name) {
                if (inputKeys.indexOf(name) === -1)
                    missing.push(name);
            });
            inputKeys.forEach(function (name) {
                if (_this.inputNodes.indexOf(name) === -1)
                    extra.push(name);
            });
            var notInGraph = extra.filter(function (name) { return !_this.graph.nodes[name]; });
            if (missing.length > 0 && strictInputCheck) {
                throw new Error("The dict provided in model.execute(dict) has the keys " +
                    ("[" + inputKeys + "], but is missing the required keys: [" + missing + "]."));
            }
            if (extra.length > 0 && strictInputCheck) {
                throw new Error("The dict provided in model.execute(dict) has " +
                    ("unused keys: [" + extra + "]. Please provide only the following keys: ") +
                    ("[" + this.inputNodes + "]."));
            }
            if (notInGraph.length > 0) {
                throw new Error("The dict provided in model.execute(dict) has " +
                    ("keys: [" + notInGraph + "] not part of model graph."));
            }
        };
        GraphExecutor.prototype.checkOutput = function (compiledNodes, outputs) {
            var compiledNodeNames = compiledNodes.map(function (node) { return node.name; });
            var extra = [];
            outputs.forEach(function (name) {
                if (compiledNodeNames.indexOf(name) === -1)
                    extra.push(name);
            });
            if (extra.length > 0) {
                throw new Error("The following outputs are not be generated by the execution: " +
                    ("[" + extra + "]."));
            }
        };
        return GraphExecutor;
    }());

    var FrozenModel = (function () {
        function FrozenModel(modelUrl, weightManifestUrl, requestOption) {
            this.modelUrl = modelUrl;
            this.weightManifestUrl = weightManifestUrl;
            this.requestOption = requestOption;
            this.version = 'n/a';
        }
        Object.defineProperty(FrozenModel.prototype, "modelVersion", {
            get: function () {
                return this.version;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrozenModel.prototype, "inputNodes", {
            get: function () {
                return this.executor.inputNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrozenModel.prototype, "outputNodes", {
            get: function () {
                return this.executor.outputNodes;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrozenModel.prototype, "inputs", {
            get: function () {
                return this.executor.inputs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrozenModel.prototype, "outputs", {
            get: function () {
                return this.executor.outputs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrozenModel.prototype, "weights", {
            get: function () {
                return this.executor.weightMap;
            },
            enumerable: true,
            configurable: true
        });
        FrozenModel.prototype.findIOHandler = function () {
            var path = [this.modelUrl, this.weightManifestUrl];
            if (this.requestOption) {
                this.handler = tfc.io.browserHTTPRequest(path, this.requestOption);
            }
            else {
                var handlers = tfc.io.getLoadHandlers(path);
                if (handlers.length === 0) {
                    handlers.push(tfc.io.browserHTTPRequest(path, this.requestOption));
                }
                else if (handlers.length > 1) {
                    throw new Error("Found more than one (" + handlers.length + ") load handlers for " +
                        ("URL '" + [path] + "'"));
                }
                this.handler = handlers[0];
            }
        };
        FrozenModel.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var artifacts, graph, weightMap;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.findIOHandler();
                            if (this.handler.load == null) {
                                throw new Error('Cannot proceed with model loading because the IOHandler provided ' +
                                    'does not have the `load` method implemented.');
                            }
                            return [4, this.handler.load()];
                        case 1:
                            artifacts = _a.sent();
                            graph = compiled_api_1.GraphDef.decode(new Uint8Array(artifacts.modelTopology));
                            this.version = graph.versions.producer + "." + graph.versions.minConsumer;
                            weightMap = tfc.io.decodeWeights(artifacts.weightData, artifacts.weightSpecs);
                            this.executor =
                                new GraphExecutor(OperationMapper.Instance.transformGraph(graph));
                            this.executor.weightMap = this.convertTensorMapToTensorsMap(weightMap);
                            return [2, true];
                    }
                });
            });
        };
        FrozenModel.prototype.predict = function (inputs, config) {
            return this.execute_(inputs, true, this.outputNodes);
        };
        FrozenModel.prototype.constructTensorMap = function (inputs) {
            var inputArray = inputs instanceof tfc.Tensor ? [inputs] : inputs;
            if (inputArray.length !== this.inputNodes.length) {
                throw new Error('Input tensor count mismatch,' +
                    ("the frozen model has " + this.inputNodes.length + " placeholders, ") +
                    ("while there are " + inputArray.length + " input tensors."));
            }
            return this.inputNodes.reduce(function (map, inputName, i) {
                map[inputName] = inputArray[i];
                return map;
            }, {});
        };
        FrozenModel.prototype.execute = function (inputs, outputs) {
            return this.execute_(inputs, false, outputs);
        };
        FrozenModel.prototype.execute_ = function (inputs, strictInputCheck, outputs) {
            if (strictInputCheck === void 0) { strictInputCheck = true; }
            outputs = outputs || this.outputNodes;
            if (inputs instanceof tfc.Tensor || Array.isArray(inputs)) {
                inputs = this.constructTensorMap(inputs);
            }
            if (this.executor.isControlFlowModel || this.executor.isDynamicShapeModel) {
                throw new Error('The model contains control flow or dynamic shape ops, ' +
                    'please use executeAsync method');
            }
            var result = this.executor.execute(this.convertTensorMapToTensorsMap(inputs), strictInputCheck, outputs);
            var keys = Object.keys(result);
            return (Array.isArray(outputs) && outputs.length > 1) ?
                outputs.map(function (node) { return result[node]; }) :
                result[keys[0]];
        };
        FrozenModel.prototype.executeAsync = function (inputs, outputs) {
            return __awaiter(this, void 0, void 0, function () {
                var result, keys;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.executor.isControlFlowModel ||
                                this.executor.isDynamicShapeModel)) {
                                throw new Error('The model does not contain control flow or dynamic shape ops, ' +
                                    'please use execute method for better performance.');
                            }
                            outputs = outputs || this.outputNodes;
                            if (inputs instanceof tfc.Tensor || Array.isArray(inputs)) {
                                inputs = this.constructTensorMap(inputs);
                            }
                            return [4, this.executor.executeAsync(this.convertTensorMapToTensorsMap(inputs), outputs)];
                        case 1:
                            result = _a.sent();
                            keys = Object.keys(result);
                            return [2, Array.isArray(outputs) && outputs.length > 1 ?
                                    outputs.map(function (node) { return result[node]; }) :
                                    result[keys[0]]];
                    }
                });
            });
        };
        FrozenModel.prototype.convertTensorMapToTensorsMap = function (map) {
            return Object.keys(map).reduce(function (newMap, key) {
                newMap[key] = [map[key]];
                return newMap;
            }, {});
        };
        FrozenModel.prototype.dispose = function () {
            this.executor.dispose();
        };
        return FrozenModel;
    }());
    function loadFrozenModel(modelUrl, weightsManifestUrl, requestOption) {
        return __awaiter(this, void 0, void 0, function () {
            var model;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model = new FrozenModel(modelUrl, weightsManifestUrl, requestOption);
                        return [4, model.load()];
                    case 1:
                        _a.sent();
                        return [2, model];
                }
            });
        });
    }

    var version = '0.6.4';

    exports.FrozenModel = FrozenModel;
    exports.loadFrozenModel = loadFrozenModel;
    exports.version_converter = version;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tf-converter.js.map