/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.caffe = (function() {

    /**
     * Namespace caffe.
     * @exports caffe
     * @namespace
     */
    var caffe = {};

    caffe.BlobShape = (function() {

        /**
         * Properties of a BlobShape.
         * @memberof caffe
         * @interface IBlobShape
         * @property {Array.<number|Long>} [dim] BlobShape dim
         */

        /**
         * Constructs a new BlobShape.
         * @memberof caffe
         * @classdesc Represents a BlobShape.
         * @constructor
         * @param {caffe.IBlobShape=} [properties] Properties to set
         */
        function BlobShape(properties) {
            this.dim = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BlobShape dim.
         * @member {Array.<number|Long>}dim
         * @memberof caffe.BlobShape
         * @instance
         */
        BlobShape.prototype.dim = $util.emptyArray;

        /**
         * Creates a new BlobShape instance using the specified properties.
         * @function create
         * @memberof caffe.BlobShape
         * @static
         * @param {caffe.IBlobShape=} [properties] Properties to set
         * @returns {caffe.BlobShape} BlobShape instance
         */
        BlobShape.create = function create(properties) {
            return new BlobShape(properties);
        };

        /**
         * Encodes the specified BlobShape message. Does not implicitly {@link caffe.BlobShape.verify|verify} messages.
         * @function encode
         * @memberof caffe.BlobShape
         * @static
         * @param {caffe.IBlobShape} message BlobShape message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BlobShape.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.dim != null && message.dim.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.dim.length; ++i)
                    writer.int64(message.dim[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified BlobShape message, length delimited. Does not implicitly {@link caffe.BlobShape.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.BlobShape
         * @static
         * @param {caffe.IBlobShape} message BlobShape message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BlobShape.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BlobShape message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.BlobShape
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.BlobShape} BlobShape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BlobShape.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.BlobShape();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.dim && message.dim.length))
                        message.dim = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.dim.push(reader.int64());
                    } else
                        message.dim.push(reader.int64());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BlobShape message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.BlobShape
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.BlobShape} BlobShape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BlobShape.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BlobShape message.
         * @function verify
         * @memberof caffe.BlobShape
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BlobShape.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.dim != null && message.hasOwnProperty("dim")) {
                if (!Array.isArray(message.dim))
                    return "dim: array expected";
                for (var i = 0; i < message.dim.length; ++i)
                    if (!$util.isInteger(message.dim[i]) && !(message.dim[i] && $util.isInteger(message.dim[i].low) && $util.isInteger(message.dim[i].high)))
                        return "dim: integer|Long[] expected";
            }
            return null;
        };

        /**
         * Creates a BlobShape message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.BlobShape
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.BlobShape} BlobShape
         */
        BlobShape.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.BlobShape)
                return object;
            var message = new $root.caffe.BlobShape();
            if (object.dim) {
                if (!Array.isArray(object.dim))
                    throw TypeError(".caffe.BlobShape.dim: array expected");
                message.dim = [];
                for (var i = 0; i < object.dim.length; ++i)
                    if ($util.Long)
                        (message.dim[i] = $util.Long.fromValue(object.dim[i])).unsigned = false;
                    else if (typeof object.dim[i] === "string")
                        message.dim[i] = parseInt(object.dim[i], 10);
                    else if (typeof object.dim[i] === "number")
                        message.dim[i] = object.dim[i];
                    else if (typeof object.dim[i] === "object")
                        message.dim[i] = new $util.LongBits(object.dim[i].low >>> 0, object.dim[i].high >>> 0).toNumber();
            }
            return message;
        };

        /**
         * Creates a plain object from a BlobShape message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.BlobShape
         * @static
         * @param {caffe.BlobShape} message BlobShape
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BlobShape.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.dim = [];
            if (message.dim && message.dim.length) {
                object.dim = [];
                for (var j = 0; j < message.dim.length; ++j)
                    if (typeof message.dim[j] === "number")
                        object.dim[j] = options.longs === String ? String(message.dim[j]) : message.dim[j];
                    else
                        object.dim[j] = options.longs === String ? $util.Long.prototype.toString.call(message.dim[j]) : options.longs === Number ? new $util.LongBits(message.dim[j].low >>> 0, message.dim[j].high >>> 0).toNumber() : message.dim[j];
            }
            return object;
        };

        /**
         * Converts this BlobShape to JSON.
         * @function toJSON
         * @memberof caffe.BlobShape
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BlobShape.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BlobShape;
    })();

    caffe.BlobProto = (function() {

        /**
         * Properties of a BlobProto.
         * @memberof caffe
         * @interface IBlobProto
         * @property {caffe.IBlobShape} [shape] BlobProto shape
         * @property {Array.<number>} [data] BlobProto data
         * @property {Array.<number>} [diff] BlobProto diff
         * @property {Array.<number>} [doubleData] BlobProto doubleData
         * @property {Array.<number>} [doubleDiff] BlobProto doubleDiff
         * @property {number} [num] BlobProto num
         * @property {number} [channels] BlobProto channels
         * @property {number} [height] BlobProto height
         * @property {number} [width] BlobProto width
         */

        /**
         * Constructs a new BlobProto.
         * @memberof caffe
         * @classdesc Represents a BlobProto.
         * @constructor
         * @param {caffe.IBlobProto=} [properties] Properties to set
         */
        function BlobProto(properties) {
            this.data = [];
            this.diff = [];
            this.doubleData = [];
            this.doubleDiff = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BlobProto shape.
         * @member {(caffe.IBlobShape|null|undefined)}shape
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.shape = null;

        /**
         * BlobProto data.
         * @member {Array.<number>}data
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.data = $util.emptyArray;

        /**
         * BlobProto diff.
         * @member {Array.<number>}diff
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.diff = $util.emptyArray;

        /**
         * BlobProto doubleData.
         * @member {Array.<number>}doubleData
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.doubleData = $util.emptyArray;

        /**
         * BlobProto doubleDiff.
         * @member {Array.<number>}doubleDiff
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.doubleDiff = $util.emptyArray;

        /**
         * BlobProto num.
         * @member {number}num
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.num = 0;

        /**
         * BlobProto channels.
         * @member {number}channels
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.channels = 0;

        /**
         * BlobProto height.
         * @member {number}height
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.height = 0;

        /**
         * BlobProto width.
         * @member {number}width
         * @memberof caffe.BlobProto
         * @instance
         */
        BlobProto.prototype.width = 0;

        /**
         * Creates a new BlobProto instance using the specified properties.
         * @function create
         * @memberof caffe.BlobProto
         * @static
         * @param {caffe.IBlobProto=} [properties] Properties to set
         * @returns {caffe.BlobProto} BlobProto instance
         */
        BlobProto.create = function create(properties) {
            return new BlobProto(properties);
        };

        /**
         * Encodes the specified BlobProto message. Does not implicitly {@link caffe.BlobProto.verify|verify} messages.
         * @function encode
         * @memberof caffe.BlobProto
         * @static
         * @param {caffe.IBlobProto} message BlobProto message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BlobProto.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.num != null && message.hasOwnProperty("num"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.num);
            if (message.channels != null && message.hasOwnProperty("channels"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.channels);
            if (message.height != null && message.hasOwnProperty("height"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.height);
            if (message.width != null && message.hasOwnProperty("width"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.width);
            if (message.data != null && message.data.length) {
                writer.uint32(/* id 5, wireType 2 =*/42).fork();
                for (var i = 0; i < message.data.length; ++i)
                    writer.float(message.data[i]);
                writer.ldelim();
            }
            if (message.diff != null && message.diff.length) {
                writer.uint32(/* id 6, wireType 2 =*/50).fork();
                for (var i = 0; i < message.diff.length; ++i)
                    writer.float(message.diff[i]);
                writer.ldelim();
            }
            if (message.shape != null && message.hasOwnProperty("shape"))
                $root.caffe.BlobShape.encode(message.shape, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.doubleData != null && message.doubleData.length) {
                writer.uint32(/* id 8, wireType 2 =*/66).fork();
                for (var i = 0; i < message.doubleData.length; ++i)
                    writer.double(message.doubleData[i]);
                writer.ldelim();
            }
            if (message.doubleDiff != null && message.doubleDiff.length) {
                writer.uint32(/* id 9, wireType 2 =*/74).fork();
                for (var i = 0; i < message.doubleDiff.length; ++i)
                    writer.double(message.doubleDiff[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified BlobProto message, length delimited. Does not implicitly {@link caffe.BlobProto.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.BlobProto
         * @static
         * @param {caffe.IBlobProto} message BlobProto message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BlobProto.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BlobProto message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.BlobProto
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.BlobProto} BlobProto
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BlobProto.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.BlobProto();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 7:
                    message.shape = $root.caffe.BlobShape.decode(reader, reader.uint32());
                    break;
                case 5:
                    if (!(message.data && message.data.length))
                        message.data = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.data.push(reader.float());
                    } else
                        message.data.push(reader.float());
                    break;
                case 6:
                    if (!(message.diff && message.diff.length))
                        message.diff = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.diff.push(reader.float());
                    } else
                        message.diff.push(reader.float());
                    break;
                case 8:
                    if (!(message.doubleData && message.doubleData.length))
                        message.doubleData = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.doubleData.push(reader.double());
                    } else
                        message.doubleData.push(reader.double());
                    break;
                case 9:
                    if (!(message.doubleDiff && message.doubleDiff.length))
                        message.doubleDiff = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.doubleDiff.push(reader.double());
                    } else
                        message.doubleDiff.push(reader.double());
                    break;
                case 1:
                    message.num = reader.int32();
                    break;
                case 2:
                    message.channels = reader.int32();
                    break;
                case 3:
                    message.height = reader.int32();
                    break;
                case 4:
                    message.width = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BlobProto message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.BlobProto
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.BlobProto} BlobProto
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BlobProto.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BlobProto message.
         * @function verify
         * @memberof caffe.BlobProto
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BlobProto.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.shape != null && message.hasOwnProperty("shape")) {
                var error = $root.caffe.BlobShape.verify(message.shape);
                if (error)
                    return "shape." + error;
            }
            if (message.data != null && message.hasOwnProperty("data")) {
                if (!Array.isArray(message.data))
                    return "data: array expected";
                for (var i = 0; i < message.data.length; ++i)
                    if (typeof message.data[i] !== "number")
                        return "data: number[] expected";
            }
            if (message.diff != null && message.hasOwnProperty("diff")) {
                if (!Array.isArray(message.diff))
                    return "diff: array expected";
                for (var i = 0; i < message.diff.length; ++i)
                    if (typeof message.diff[i] !== "number")
                        return "diff: number[] expected";
            }
            if (message.doubleData != null && message.hasOwnProperty("doubleData")) {
                if (!Array.isArray(message.doubleData))
                    return "doubleData: array expected";
                for (var i = 0; i < message.doubleData.length; ++i)
                    if (typeof message.doubleData[i] !== "number")
                        return "doubleData: number[] expected";
            }
            if (message.doubleDiff != null && message.hasOwnProperty("doubleDiff")) {
                if (!Array.isArray(message.doubleDiff))
                    return "doubleDiff: array expected";
                for (var i = 0; i < message.doubleDiff.length; ++i)
                    if (typeof message.doubleDiff[i] !== "number")
                        return "doubleDiff: number[] expected";
            }
            if (message.num != null && message.hasOwnProperty("num"))
                if (!$util.isInteger(message.num))
                    return "num: integer expected";
            if (message.channels != null && message.hasOwnProperty("channels"))
                if (!$util.isInteger(message.channels))
                    return "channels: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            return null;
        };

        /**
         * Creates a BlobProto message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.BlobProto
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.BlobProto} BlobProto
         */
        BlobProto.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.BlobProto)
                return object;
            var message = new $root.caffe.BlobProto();
            if (object.shape != null) {
                if (typeof object.shape !== "object")
                    throw TypeError(".caffe.BlobProto.shape: object expected");
                message.shape = $root.caffe.BlobShape.fromObject(object.shape);
            }
            if (object.data) {
                if (!Array.isArray(object.data))
                    throw TypeError(".caffe.BlobProto.data: array expected");
                message.data = [];
                for (var i = 0; i < object.data.length; ++i)
                    message.data[i] = Number(object.data[i]);
            }
            if (object.diff) {
                if (!Array.isArray(object.diff))
                    throw TypeError(".caffe.BlobProto.diff: array expected");
                message.diff = [];
                for (var i = 0; i < object.diff.length; ++i)
                    message.diff[i] = Number(object.diff[i]);
            }
            if (object.doubleData) {
                if (!Array.isArray(object.doubleData))
                    throw TypeError(".caffe.BlobProto.doubleData: array expected");
                message.doubleData = [];
                for (var i = 0; i < object.doubleData.length; ++i)
                    message.doubleData[i] = Number(object.doubleData[i]);
            }
            if (object.doubleDiff) {
                if (!Array.isArray(object.doubleDiff))
                    throw TypeError(".caffe.BlobProto.doubleDiff: array expected");
                message.doubleDiff = [];
                for (var i = 0; i < object.doubleDiff.length; ++i)
                    message.doubleDiff[i] = Number(object.doubleDiff[i]);
            }
            if (object.num != null)
                message.num = object.num | 0;
            if (object.channels != null)
                message.channels = object.channels | 0;
            if (object.height != null)
                message.height = object.height | 0;
            if (object.width != null)
                message.width = object.width | 0;
            return message;
        };

        /**
         * Creates a plain object from a BlobProto message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.BlobProto
         * @static
         * @param {caffe.BlobProto} message BlobProto
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BlobProto.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.data = [];
                object.diff = [];
                object.doubleData = [];
                object.doubleDiff = [];
            }
            if (options.defaults) {
                object.num = 0;
                object.channels = 0;
                object.height = 0;
                object.width = 0;
                object.shape = null;
            }
            if (message.num != null && message.hasOwnProperty("num"))
                object.num = message.num;
            if (message.channels != null && message.hasOwnProperty("channels"))
                object.channels = message.channels;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.data && message.data.length) {
                object.data = [];
                for (var j = 0; j < message.data.length; ++j)
                    object.data[j] = options.json && !isFinite(message.data[j]) ? String(message.data[j]) : message.data[j];
            }
            if (message.diff && message.diff.length) {
                object.diff = [];
                for (var j = 0; j < message.diff.length; ++j)
                    object.diff[j] = options.json && !isFinite(message.diff[j]) ? String(message.diff[j]) : message.diff[j];
            }
            if (message.shape != null && message.hasOwnProperty("shape"))
                object.shape = $root.caffe.BlobShape.toObject(message.shape, options);
            if (message.doubleData && message.doubleData.length) {
                object.doubleData = [];
                for (var j = 0; j < message.doubleData.length; ++j)
                    object.doubleData[j] = options.json && !isFinite(message.doubleData[j]) ? String(message.doubleData[j]) : message.doubleData[j];
            }
            if (message.doubleDiff && message.doubleDiff.length) {
                object.doubleDiff = [];
                for (var j = 0; j < message.doubleDiff.length; ++j)
                    object.doubleDiff[j] = options.json && !isFinite(message.doubleDiff[j]) ? String(message.doubleDiff[j]) : message.doubleDiff[j];
            }
            return object;
        };

        /**
         * Converts this BlobProto to JSON.
         * @function toJSON
         * @memberof caffe.BlobProto
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BlobProto.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BlobProto;
    })();

    caffe.BlobProtoVector = (function() {

        /**
         * Properties of a BlobProtoVector.
         * @memberof caffe
         * @interface IBlobProtoVector
         * @property {Array.<caffe.IBlobProto>} [blobs] BlobProtoVector blobs
         */

        /**
         * Constructs a new BlobProtoVector.
         * @memberof caffe
         * @classdesc Represents a BlobProtoVector.
         * @constructor
         * @param {caffe.IBlobProtoVector=} [properties] Properties to set
         */
        function BlobProtoVector(properties) {
            this.blobs = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BlobProtoVector blobs.
         * @member {Array.<caffe.IBlobProto>}blobs
         * @memberof caffe.BlobProtoVector
         * @instance
         */
        BlobProtoVector.prototype.blobs = $util.emptyArray;

        /**
         * Creates a new BlobProtoVector instance using the specified properties.
         * @function create
         * @memberof caffe.BlobProtoVector
         * @static
         * @param {caffe.IBlobProtoVector=} [properties] Properties to set
         * @returns {caffe.BlobProtoVector} BlobProtoVector instance
         */
        BlobProtoVector.create = function create(properties) {
            return new BlobProtoVector(properties);
        };

        /**
         * Encodes the specified BlobProtoVector message. Does not implicitly {@link caffe.BlobProtoVector.verify|verify} messages.
         * @function encode
         * @memberof caffe.BlobProtoVector
         * @static
         * @param {caffe.IBlobProtoVector} message BlobProtoVector message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BlobProtoVector.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.blobs != null && message.blobs.length)
                for (var i = 0; i < message.blobs.length; ++i)
                    $root.caffe.BlobProto.encode(message.blobs[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified BlobProtoVector message, length delimited. Does not implicitly {@link caffe.BlobProtoVector.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.BlobProtoVector
         * @static
         * @param {caffe.IBlobProtoVector} message BlobProtoVector message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BlobProtoVector.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BlobProtoVector message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.BlobProtoVector
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.BlobProtoVector} BlobProtoVector
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BlobProtoVector.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.BlobProtoVector();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.blobs && message.blobs.length))
                        message.blobs = [];
                    message.blobs.push($root.caffe.BlobProto.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BlobProtoVector message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.BlobProtoVector
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.BlobProtoVector} BlobProtoVector
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BlobProtoVector.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BlobProtoVector message.
         * @function verify
         * @memberof caffe.BlobProtoVector
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BlobProtoVector.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.blobs != null && message.hasOwnProperty("blobs")) {
                if (!Array.isArray(message.blobs))
                    return "blobs: array expected";
                for (var i = 0; i < message.blobs.length; ++i) {
                    var error = $root.caffe.BlobProto.verify(message.blobs[i]);
                    if (error)
                        return "blobs." + error;
                }
            }
            return null;
        };

        /**
         * Creates a BlobProtoVector message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.BlobProtoVector
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.BlobProtoVector} BlobProtoVector
         */
        BlobProtoVector.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.BlobProtoVector)
                return object;
            var message = new $root.caffe.BlobProtoVector();
            if (object.blobs) {
                if (!Array.isArray(object.blobs))
                    throw TypeError(".caffe.BlobProtoVector.blobs: array expected");
                message.blobs = [];
                for (var i = 0; i < object.blobs.length; ++i) {
                    if (typeof object.blobs[i] !== "object")
                        throw TypeError(".caffe.BlobProtoVector.blobs: object expected");
                    message.blobs[i] = $root.caffe.BlobProto.fromObject(object.blobs[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a BlobProtoVector message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.BlobProtoVector
         * @static
         * @param {caffe.BlobProtoVector} message BlobProtoVector
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BlobProtoVector.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.blobs = [];
            if (message.blobs && message.blobs.length) {
                object.blobs = [];
                for (var j = 0; j < message.blobs.length; ++j)
                    object.blobs[j] = $root.caffe.BlobProto.toObject(message.blobs[j], options);
            }
            return object;
        };

        /**
         * Converts this BlobProtoVector to JSON.
         * @function toJSON
         * @memberof caffe.BlobProtoVector
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BlobProtoVector.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BlobProtoVector;
    })();

    caffe.Datum = (function() {

        /**
         * Properties of a Datum.
         * @memberof caffe
         * @interface IDatum
         * @property {number} [channels] Datum channels
         * @property {number} [height] Datum height
         * @property {number} [width] Datum width
         * @property {Uint8Array} [data] Datum data
         * @property {number} [label] Datum label
         * @property {Array.<number>} [floatData] Datum floatData
         * @property {boolean} [encoded] Datum encoded
         */

        /**
         * Constructs a new Datum.
         * @memberof caffe
         * @classdesc Represents a Datum.
         * @constructor
         * @param {caffe.IDatum=} [properties] Properties to set
         */
        function Datum(properties) {
            this.floatData = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Datum channels.
         * @member {number}channels
         * @memberof caffe.Datum
         * @instance
         */
        Datum.prototype.channels = 0;

        /**
         * Datum height.
         * @member {number}height
         * @memberof caffe.Datum
         * @instance
         */
        Datum.prototype.height = 0;

        /**
         * Datum width.
         * @member {number}width
         * @memberof caffe.Datum
         * @instance
         */
        Datum.prototype.width = 0;

        /**
         * Datum data.
         * @member {Uint8Array}data
         * @memberof caffe.Datum
         * @instance
         */
        Datum.prototype.data = $util.newBuffer([]);

        /**
         * Datum label.
         * @member {number}label
         * @memberof caffe.Datum
         * @instance
         */
        Datum.prototype.label = 0;

        /**
         * Datum floatData.
         * @member {Array.<number>}floatData
         * @memberof caffe.Datum
         * @instance
         */
        Datum.prototype.floatData = $util.emptyArray;

        /**
         * Datum encoded.
         * @member {boolean}encoded
         * @memberof caffe.Datum
         * @instance
         */
        Datum.prototype.encoded = false;

        /**
         * Creates a new Datum instance using the specified properties.
         * @function create
         * @memberof caffe.Datum
         * @static
         * @param {caffe.IDatum=} [properties] Properties to set
         * @returns {caffe.Datum} Datum instance
         */
        Datum.create = function create(properties) {
            return new Datum(properties);
        };

        /**
         * Encodes the specified Datum message. Does not implicitly {@link caffe.Datum.verify|verify} messages.
         * @function encode
         * @memberof caffe.Datum
         * @static
         * @param {caffe.IDatum} message Datum message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Datum.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.channels != null && message.hasOwnProperty("channels"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.channels);
            if (message.height != null && message.hasOwnProperty("height"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.height);
            if (message.width != null && message.hasOwnProperty("width"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.width);
            if (message.data != null && message.hasOwnProperty("data"))
                writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.data);
            if (message.label != null && message.hasOwnProperty("label"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.label);
            if (message.floatData != null && message.floatData.length)
                for (var i = 0; i < message.floatData.length; ++i)
                    writer.uint32(/* id 6, wireType 5 =*/53).float(message.floatData[i]);
            if (message.encoded != null && message.hasOwnProperty("encoded"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.encoded);
            return writer;
        };

        /**
         * Encodes the specified Datum message, length delimited. Does not implicitly {@link caffe.Datum.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.Datum
         * @static
         * @param {caffe.IDatum} message Datum message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Datum.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Datum message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.Datum
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.Datum} Datum
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Datum.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.Datum();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.channels = reader.int32();
                    break;
                case 2:
                    message.height = reader.int32();
                    break;
                case 3:
                    message.width = reader.int32();
                    break;
                case 4:
                    message.data = reader.bytes();
                    break;
                case 5:
                    message.label = reader.int32();
                    break;
                case 6:
                    if (!(message.floatData && message.floatData.length))
                        message.floatData = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.floatData.push(reader.float());
                    } else
                        message.floatData.push(reader.float());
                    break;
                case 7:
                    message.encoded = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Datum message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.Datum
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.Datum} Datum
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Datum.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Datum message.
         * @function verify
         * @memberof caffe.Datum
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Datum.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.channels != null && message.hasOwnProperty("channels"))
                if (!$util.isInteger(message.channels))
                    return "channels: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            if (message.data != null && message.hasOwnProperty("data"))
                if (!(message.data && typeof message.data.length === "number" || $util.isString(message.data)))
                    return "data: buffer expected";
            if (message.label != null && message.hasOwnProperty("label"))
                if (!$util.isInteger(message.label))
                    return "label: integer expected";
            if (message.floatData != null && message.hasOwnProperty("floatData")) {
                if (!Array.isArray(message.floatData))
                    return "floatData: array expected";
                for (var i = 0; i < message.floatData.length; ++i)
                    if (typeof message.floatData[i] !== "number")
                        return "floatData: number[] expected";
            }
            if (message.encoded != null && message.hasOwnProperty("encoded"))
                if (typeof message.encoded !== "boolean")
                    return "encoded: boolean expected";
            return null;
        };

        /**
         * Creates a Datum message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.Datum
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.Datum} Datum
         */
        Datum.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.Datum)
                return object;
            var message = new $root.caffe.Datum();
            if (object.channels != null)
                message.channels = object.channels | 0;
            if (object.height != null)
                message.height = object.height | 0;
            if (object.width != null)
                message.width = object.width | 0;
            if (object.data != null)
                if (typeof object.data === "string")
                    $util.base64.decode(object.data, message.data = $util.newBuffer($util.base64.length(object.data)), 0);
                else if (object.data.length)
                    message.data = object.data;
            if (object.label != null)
                message.label = object.label | 0;
            if (object.floatData) {
                if (!Array.isArray(object.floatData))
                    throw TypeError(".caffe.Datum.floatData: array expected");
                message.floatData = [];
                for (var i = 0; i < object.floatData.length; ++i)
                    message.floatData[i] = Number(object.floatData[i]);
            }
            if (object.encoded != null)
                message.encoded = Boolean(object.encoded);
            return message;
        };

        /**
         * Creates a plain object from a Datum message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.Datum
         * @static
         * @param {caffe.Datum} message Datum
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Datum.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.floatData = [];
            if (options.defaults) {
                object.channels = 0;
                object.height = 0;
                object.width = 0;
                object.data = options.bytes === String ? "" : [];
                object.label = 0;
                object.encoded = false;
            }
            if (message.channels != null && message.hasOwnProperty("channels"))
                object.channels = message.channels;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            if (message.data != null && message.hasOwnProperty("data"))
                object.data = options.bytes === String ? $util.base64.encode(message.data, 0, message.data.length) : options.bytes === Array ? Array.prototype.slice.call(message.data) : message.data;
            if (message.label != null && message.hasOwnProperty("label"))
                object.label = message.label;
            if (message.floatData && message.floatData.length) {
                object.floatData = [];
                for (var j = 0; j < message.floatData.length; ++j)
                    object.floatData[j] = options.json && !isFinite(message.floatData[j]) ? String(message.floatData[j]) : message.floatData[j];
            }
            if (message.encoded != null && message.hasOwnProperty("encoded"))
                object.encoded = message.encoded;
            return object;
        };

        /**
         * Converts this Datum to JSON.
         * @function toJSON
         * @memberof caffe.Datum
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Datum.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Datum;
    })();

    caffe.FillerParameter = (function() {

        /**
         * Properties of a FillerParameter.
         * @memberof caffe
         * @interface IFillerParameter
         * @property {string} [type] FillerParameter type
         * @property {number} [value] FillerParameter value
         * @property {number} [min] FillerParameter min
         * @property {number} [max] FillerParameter max
         * @property {number} [mean] FillerParameter mean
         * @property {number} [std] FillerParameter std
         * @property {number} [sparse] FillerParameter sparse
         * @property {caffe.FillerParameter.VarianceNorm} [varianceNorm] FillerParameter varianceNorm
         */

        /**
         * Constructs a new FillerParameter.
         * @memberof caffe
         * @classdesc Represents a FillerParameter.
         * @constructor
         * @param {caffe.IFillerParameter=} [properties] Properties to set
         */
        function FillerParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FillerParameter type.
         * @member {string}type
         * @memberof caffe.FillerParameter
         * @instance
         */
        FillerParameter.prototype.type = "constant";

        /**
         * FillerParameter value.
         * @member {number}value
         * @memberof caffe.FillerParameter
         * @instance
         */
        FillerParameter.prototype.value = 0;

        /**
         * FillerParameter min.
         * @member {number}min
         * @memberof caffe.FillerParameter
         * @instance
         */
        FillerParameter.prototype.min = 0;

        /**
         * FillerParameter max.
         * @member {number}max
         * @memberof caffe.FillerParameter
         * @instance
         */
        FillerParameter.prototype.max = 1;

        /**
         * FillerParameter mean.
         * @member {number}mean
         * @memberof caffe.FillerParameter
         * @instance
         */
        FillerParameter.prototype.mean = 0;

        /**
         * FillerParameter std.
         * @member {number}std
         * @memberof caffe.FillerParameter
         * @instance
         */
        FillerParameter.prototype.std = 1;

        /**
         * FillerParameter sparse.
         * @member {number}sparse
         * @memberof caffe.FillerParameter
         * @instance
         */
        FillerParameter.prototype.sparse = -1;

        /**
         * FillerParameter varianceNorm.
         * @member {caffe.FillerParameter.VarianceNorm}varianceNorm
         * @memberof caffe.FillerParameter
         * @instance
         */
        FillerParameter.prototype.varianceNorm = 0;

        /**
         * Creates a new FillerParameter instance using the specified properties.
         * @function create
         * @memberof caffe.FillerParameter
         * @static
         * @param {caffe.IFillerParameter=} [properties] Properties to set
         * @returns {caffe.FillerParameter} FillerParameter instance
         */
        FillerParameter.create = function create(properties) {
            return new FillerParameter(properties);
        };

        /**
         * Encodes the specified FillerParameter message. Does not implicitly {@link caffe.FillerParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.FillerParameter
         * @static
         * @param {caffe.IFillerParameter} message FillerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FillerParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.type);
            if (message.value != null && message.hasOwnProperty("value"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.value);
            if (message.min != null && message.hasOwnProperty("min"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.min);
            if (message.max != null && message.hasOwnProperty("max"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.max);
            if (message.mean != null && message.hasOwnProperty("mean"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.mean);
            if (message.std != null && message.hasOwnProperty("std"))
                writer.uint32(/* id 6, wireType 5 =*/53).float(message.std);
            if (message.sparse != null && message.hasOwnProperty("sparse"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.sparse);
            if (message.varianceNorm != null && message.hasOwnProperty("varianceNorm"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.varianceNorm);
            return writer;
        };

        /**
         * Encodes the specified FillerParameter message, length delimited. Does not implicitly {@link caffe.FillerParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.FillerParameter
         * @static
         * @param {caffe.IFillerParameter} message FillerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FillerParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FillerParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.FillerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.FillerParameter} FillerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FillerParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.FillerParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.type = reader.string();
                    break;
                case 2:
                    message.value = reader.float();
                    break;
                case 3:
                    message.min = reader.float();
                    break;
                case 4:
                    message.max = reader.float();
                    break;
                case 5:
                    message.mean = reader.float();
                    break;
                case 6:
                    message.std = reader.float();
                    break;
                case 7:
                    message.sparse = reader.int32();
                    break;
                case 8:
                    message.varianceNorm = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FillerParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.FillerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.FillerParameter} FillerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FillerParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FillerParameter message.
         * @function verify
         * @memberof caffe.FillerParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FillerParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.value != null && message.hasOwnProperty("value"))
                if (typeof message.value !== "number")
                    return "value: number expected";
            if (message.min != null && message.hasOwnProperty("min"))
                if (typeof message.min !== "number")
                    return "min: number expected";
            if (message.max != null && message.hasOwnProperty("max"))
                if (typeof message.max !== "number")
                    return "max: number expected";
            if (message.mean != null && message.hasOwnProperty("mean"))
                if (typeof message.mean !== "number")
                    return "mean: number expected";
            if (message.std != null && message.hasOwnProperty("std"))
                if (typeof message.std !== "number")
                    return "std: number expected";
            if (message.sparse != null && message.hasOwnProperty("sparse"))
                if (!$util.isInteger(message.sparse))
                    return "sparse: integer expected";
            if (message.varianceNorm != null && message.hasOwnProperty("varianceNorm"))
                switch (message.varianceNorm) {
                default:
                    return "varianceNorm: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a FillerParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.FillerParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.FillerParameter} FillerParameter
         */
        FillerParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.FillerParameter)
                return object;
            var message = new $root.caffe.FillerParameter();
            if (object.type != null)
                message.type = String(object.type);
            if (object.value != null)
                message.value = Number(object.value);
            if (object.min != null)
                message.min = Number(object.min);
            if (object.max != null)
                message.max = Number(object.max);
            if (object.mean != null)
                message.mean = Number(object.mean);
            if (object.std != null)
                message.std = Number(object.std);
            if (object.sparse != null)
                message.sparse = object.sparse | 0;
            switch (object.varianceNorm) {
            case "FAN_IN":
            case 0:
                message.varianceNorm = 0;
                break;
            case "FAN_OUT":
            case 1:
                message.varianceNorm = 1;
                break;
            case "AVERAGE":
            case 2:
                message.varianceNorm = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a FillerParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.FillerParameter
         * @static
         * @param {caffe.FillerParameter} message FillerParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FillerParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.type = "constant";
                object.value = 0;
                object.min = 0;
                object.max = 1;
                object.mean = 0;
                object.std = 1;
                object.sparse = -1;
                object.varianceNorm = options.enums === String ? "FAN_IN" : 0;
            }
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.value != null && message.hasOwnProperty("value"))
                object.value = options.json && !isFinite(message.value) ? String(message.value) : message.value;
            if (message.min != null && message.hasOwnProperty("min"))
                object.min = options.json && !isFinite(message.min) ? String(message.min) : message.min;
            if (message.max != null && message.hasOwnProperty("max"))
                object.max = options.json && !isFinite(message.max) ? String(message.max) : message.max;
            if (message.mean != null && message.hasOwnProperty("mean"))
                object.mean = options.json && !isFinite(message.mean) ? String(message.mean) : message.mean;
            if (message.std != null && message.hasOwnProperty("std"))
                object.std = options.json && !isFinite(message.std) ? String(message.std) : message.std;
            if (message.sparse != null && message.hasOwnProperty("sparse"))
                object.sparse = message.sparse;
            if (message.varianceNorm != null && message.hasOwnProperty("varianceNorm"))
                object.varianceNorm = options.enums === String ? $root.caffe.FillerParameter.VarianceNorm[message.varianceNorm] : message.varianceNorm;
            return object;
        };

        /**
         * Converts this FillerParameter to JSON.
         * @function toJSON
         * @memberof caffe.FillerParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FillerParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * VarianceNorm enum.
         * @enum {string}
         * @property {number} FAN_IN=0 FAN_IN value
         * @property {number} FAN_OUT=1 FAN_OUT value
         * @property {number} AVERAGE=2 AVERAGE value
         */
        FillerParameter.VarianceNorm = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "FAN_IN"] = 0;
            values[valuesById[1] = "FAN_OUT"] = 1;
            values[valuesById[2] = "AVERAGE"] = 2;
            return values;
        })();

        return FillerParameter;
    })();

    caffe.NetParameter = (function() {

        /**
         * Properties of a NetParameter.
         * @memberof caffe
         * @interface INetParameter
         * @property {string} [name] NetParameter name
         * @property {Array.<string>} [input] NetParameter input
         * @property {Array.<caffe.IBlobShape>} [inputShape] NetParameter inputShape
         * @property {Array.<number>} [inputDim] NetParameter inputDim
         * @property {boolean} [forceBackward] NetParameter forceBackward
         * @property {caffe.INetState} [state] NetParameter state
         * @property {boolean} [debugInfo] NetParameter debugInfo
         * @property {Array.<caffe.ILayerParameter>} [layer] NetParameter layer
         * @property {Array.<caffe.IV1LayerParameter>} [layers] NetParameter layers
         */

        /**
         * Constructs a new NetParameter.
         * @memberof caffe
         * @classdesc Represents a NetParameter.
         * @constructor
         * @param {caffe.INetParameter=} [properties] Properties to set
         */
        function NetParameter(properties) {
            this.input = [];
            this.inputShape = [];
            this.inputDim = [];
            this.layer = [];
            this.layers = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NetParameter name.
         * @member {string}name
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.name = "";

        /**
         * NetParameter input.
         * @member {Array.<string>}input
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.input = $util.emptyArray;

        /**
         * NetParameter inputShape.
         * @member {Array.<caffe.IBlobShape>}inputShape
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.inputShape = $util.emptyArray;

        /**
         * NetParameter inputDim.
         * @member {Array.<number>}inputDim
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.inputDim = $util.emptyArray;

        /**
         * NetParameter forceBackward.
         * @member {boolean}forceBackward
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.forceBackward = false;

        /**
         * NetParameter state.
         * @member {(caffe.INetState|null|undefined)}state
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.state = null;

        /**
         * NetParameter debugInfo.
         * @member {boolean}debugInfo
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.debugInfo = false;

        /**
         * NetParameter layer.
         * @member {Array.<caffe.ILayerParameter>}layer
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.layer = $util.emptyArray;

        /**
         * NetParameter layers.
         * @member {Array.<caffe.IV1LayerParameter>}layers
         * @memberof caffe.NetParameter
         * @instance
         */
        NetParameter.prototype.layers = $util.emptyArray;

        /**
         * Creates a new NetParameter instance using the specified properties.
         * @function create
         * @memberof caffe.NetParameter
         * @static
         * @param {caffe.INetParameter=} [properties] Properties to set
         * @returns {caffe.NetParameter} NetParameter instance
         */
        NetParameter.create = function create(properties) {
            return new NetParameter(properties);
        };

        /**
         * Encodes the specified NetParameter message. Does not implicitly {@link caffe.NetParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.NetParameter
         * @static
         * @param {caffe.INetParameter} message NetParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.layers != null && message.layers.length)
                for (var i = 0; i < message.layers.length; ++i)
                    $root.caffe.V1LayerParameter.encode(message.layers[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.input != null && message.input.length)
                for (var i = 0; i < message.input.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.input[i]);
            if (message.inputDim != null && message.inputDim.length)
                for (var i = 0; i < message.inputDim.length; ++i)
                    writer.uint32(/* id 4, wireType 0 =*/32).int32(message.inputDim[i]);
            if (message.forceBackward != null && message.hasOwnProperty("forceBackward"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.forceBackward);
            if (message.state != null && message.hasOwnProperty("state"))
                $root.caffe.NetState.encode(message.state, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.debugInfo);
            if (message.inputShape != null && message.inputShape.length)
                for (var i = 0; i < message.inputShape.length; ++i)
                    $root.caffe.BlobShape.encode(message.inputShape[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.layer != null && message.layer.length)
                for (var i = 0; i < message.layer.length; ++i)
                    $root.caffe.LayerParameter.encode(message.layer[i], writer.uint32(/* id 100, wireType 2 =*/802).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified NetParameter message, length delimited. Does not implicitly {@link caffe.NetParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.NetParameter
         * @static
         * @param {caffe.INetParameter} message NetParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NetParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.NetParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.NetParameter} NetParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.NetParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 3:
                    if (!(message.input && message.input.length))
                        message.input = [];
                    message.input.push(reader.string());
                    break;
                case 8:
                    if (!(message.inputShape && message.inputShape.length))
                        message.inputShape = [];
                    message.inputShape.push($root.caffe.BlobShape.decode(reader, reader.uint32()));
                    break;
                case 4:
                    if (!(message.inputDim && message.inputDim.length))
                        message.inputDim = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.inputDim.push(reader.int32());
                    } else
                        message.inputDim.push(reader.int32());
                    break;
                case 5:
                    message.forceBackward = reader.bool();
                    break;
                case 6:
                    message.state = $root.caffe.NetState.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.debugInfo = reader.bool();
                    break;
                case 100:
                    if (!(message.layer && message.layer.length))
                        message.layer = [];
                    message.layer.push($root.caffe.LayerParameter.decode(reader, reader.uint32()));
                    break;
                case 2:
                    if (!(message.layers && message.layers.length))
                        message.layers = [];
                    message.layers.push($root.caffe.V1LayerParameter.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NetParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.NetParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.NetParameter} NetParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NetParameter message.
         * @function verify
         * @memberof caffe.NetParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NetParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.input != null && message.hasOwnProperty("input")) {
                if (!Array.isArray(message.input))
                    return "input: array expected";
                for (var i = 0; i < message.input.length; ++i)
                    if (!$util.isString(message.input[i]))
                        return "input: string[] expected";
            }
            if (message.inputShape != null && message.hasOwnProperty("inputShape")) {
                if (!Array.isArray(message.inputShape))
                    return "inputShape: array expected";
                for (var i = 0; i < message.inputShape.length; ++i) {
                    var error = $root.caffe.BlobShape.verify(message.inputShape[i]);
                    if (error)
                        return "inputShape." + error;
                }
            }
            if (message.inputDim != null && message.hasOwnProperty("inputDim")) {
                if (!Array.isArray(message.inputDim))
                    return "inputDim: array expected";
                for (var i = 0; i < message.inputDim.length; ++i)
                    if (!$util.isInteger(message.inputDim[i]))
                        return "inputDim: integer[] expected";
            }
            if (message.forceBackward != null && message.hasOwnProperty("forceBackward"))
                if (typeof message.forceBackward !== "boolean")
                    return "forceBackward: boolean expected";
            if (message.state != null && message.hasOwnProperty("state")) {
                error = $root.caffe.NetState.verify(message.state);
                if (error)
                    return "state." + error;
            }
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                if (typeof message.debugInfo !== "boolean")
                    return "debugInfo: boolean expected";
            if (message.layer != null && message.hasOwnProperty("layer")) {
                if (!Array.isArray(message.layer))
                    return "layer: array expected";
                for (var i = 0; i < message.layer.length; ++i) {
                    error = $root.caffe.LayerParameter.verify(message.layer[i]);
                    if (error)
                        return "layer." + error;
                }
            }
            if (message.layers != null && message.hasOwnProperty("layers")) {
                if (!Array.isArray(message.layers))
                    return "layers: array expected";
                for (var i = 0; i < message.layers.length; ++i) {
                    error = $root.caffe.V1LayerParameter.verify(message.layers[i]);
                    if (error)
                        return "layers." + error;
                }
            }
            return null;
        };

        /**
         * Creates a NetParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.NetParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.NetParameter} NetParameter
         */
        NetParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.NetParameter)
                return object;
            var message = new $root.caffe.NetParameter();
            if (object.name != null)
                message.name = String(object.name);
            if (object.input) {
                if (!Array.isArray(object.input))
                    throw TypeError(".caffe.NetParameter.input: array expected");
                message.input = [];
                for (var i = 0; i < object.input.length; ++i)
                    message.input[i] = String(object.input[i]);
            }
            if (object.inputShape) {
                if (!Array.isArray(object.inputShape))
                    throw TypeError(".caffe.NetParameter.inputShape: array expected");
                message.inputShape = [];
                for (var i = 0; i < object.inputShape.length; ++i) {
                    if (typeof object.inputShape[i] !== "object")
                        throw TypeError(".caffe.NetParameter.inputShape: object expected");
                    message.inputShape[i] = $root.caffe.BlobShape.fromObject(object.inputShape[i]);
                }
            }
            if (object.inputDim) {
                if (!Array.isArray(object.inputDim))
                    throw TypeError(".caffe.NetParameter.inputDim: array expected");
                message.inputDim = [];
                for (var i = 0; i < object.inputDim.length; ++i)
                    message.inputDim[i] = object.inputDim[i] | 0;
            }
            if (object.forceBackward != null)
                message.forceBackward = Boolean(object.forceBackward);
            if (object.state != null) {
                if (typeof object.state !== "object")
                    throw TypeError(".caffe.NetParameter.state: object expected");
                message.state = $root.caffe.NetState.fromObject(object.state);
            }
            if (object.debugInfo != null)
                message.debugInfo = Boolean(object.debugInfo);
            if (object.layer) {
                if (!Array.isArray(object.layer))
                    throw TypeError(".caffe.NetParameter.layer: array expected");
                message.layer = [];
                for (var i = 0; i < object.layer.length; ++i) {
                    if (typeof object.layer[i] !== "object")
                        throw TypeError(".caffe.NetParameter.layer: object expected");
                    message.layer[i] = $root.caffe.LayerParameter.fromObject(object.layer[i]);
                }
            }
            if (object.layers) {
                if (!Array.isArray(object.layers))
                    throw TypeError(".caffe.NetParameter.layers: array expected");
                message.layers = [];
                for (var i = 0; i < object.layers.length; ++i) {
                    if (typeof object.layers[i] !== "object")
                        throw TypeError(".caffe.NetParameter.layers: object expected");
                    message.layers[i] = $root.caffe.V1LayerParameter.fromObject(object.layers[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a NetParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.NetParameter
         * @static
         * @param {caffe.NetParameter} message NetParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NetParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.layers = [];
                object.input = [];
                object.inputDim = [];
                object.inputShape = [];
                object.layer = [];
            }
            if (options.defaults) {
                object.name = "";
                object.forceBackward = false;
                object.state = null;
                object.debugInfo = false;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.layers && message.layers.length) {
                object.layers = [];
                for (var j = 0; j < message.layers.length; ++j)
                    object.layers[j] = $root.caffe.V1LayerParameter.toObject(message.layers[j], options);
            }
            if (message.input && message.input.length) {
                object.input = [];
                for (var j = 0; j < message.input.length; ++j)
                    object.input[j] = message.input[j];
            }
            if (message.inputDim && message.inputDim.length) {
                object.inputDim = [];
                for (var j = 0; j < message.inputDim.length; ++j)
                    object.inputDim[j] = message.inputDim[j];
            }
            if (message.forceBackward != null && message.hasOwnProperty("forceBackward"))
                object.forceBackward = message.forceBackward;
            if (message.state != null && message.hasOwnProperty("state"))
                object.state = $root.caffe.NetState.toObject(message.state, options);
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                object.debugInfo = message.debugInfo;
            if (message.inputShape && message.inputShape.length) {
                object.inputShape = [];
                for (var j = 0; j < message.inputShape.length; ++j)
                    object.inputShape[j] = $root.caffe.BlobShape.toObject(message.inputShape[j], options);
            }
            if (message.layer && message.layer.length) {
                object.layer = [];
                for (var j = 0; j < message.layer.length; ++j)
                    object.layer[j] = $root.caffe.LayerParameter.toObject(message.layer[j], options);
            }
            return object;
        };

        /**
         * Converts this NetParameter to JSON.
         * @function toJSON
         * @memberof caffe.NetParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NetParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NetParameter;
    })();

    caffe.SolverParameter = (function() {

        /**
         * Properties of a SolverParameter.
         * @memberof caffe
         * @interface ISolverParameter
         * @property {string} [net] SolverParameter net
         * @property {caffe.INetParameter} [netParam] SolverParameter netParam
         * @property {string} [trainNet] SolverParameter trainNet
         * @property {Array.<string>} [testNet] SolverParameter testNet
         * @property {caffe.INetParameter} [trainNetParam] SolverParameter trainNetParam
         * @property {Array.<caffe.INetParameter>} [testNetParam] SolverParameter testNetParam
         * @property {caffe.INetState} [trainState] SolverParameter trainState
         * @property {Array.<caffe.INetState>} [testState] SolverParameter testState
         * @property {Array.<number>} [testIter] SolverParameter testIter
         * @property {number} [testInterval] SolverParameter testInterval
         * @property {boolean} [testComputeLoss] SolverParameter testComputeLoss
         * @property {boolean} [testInitialization] SolverParameter testInitialization
         * @property {number} [baseLr] SolverParameter baseLr
         * @property {number} [display] SolverParameter display
         * @property {number} [averageLoss] SolverParameter averageLoss
         * @property {number} [maxIter] SolverParameter maxIter
         * @property {number} [iterSize] SolverParameter iterSize
         * @property {string} [lrPolicy] SolverParameter lrPolicy
         * @property {number} [gamma] SolverParameter gamma
         * @property {number} [power] SolverParameter power
         * @property {number} [momentum] SolverParameter momentum
         * @property {number} [weightDecay] SolverParameter weightDecay
         * @property {string} [regularizationType] SolverParameter regularizationType
         * @property {number} [stepsize] SolverParameter stepsize
         * @property {Array.<number>} [stepvalue] SolverParameter stepvalue
         * @property {number} [clipGradients] SolverParameter clipGradients
         * @property {number} [snapshot] SolverParameter snapshot
         * @property {string} [snapshotPrefix] SolverParameter snapshotPrefix
         * @property {boolean} [snapshotDiff] SolverParameter snapshotDiff
         * @property {caffe.SolverParameter.SnapshotFormat} [snapshotFormat] SolverParameter snapshotFormat
         * @property {caffe.SolverParameter.SolverMode} [solverMode] SolverParameter solverMode
         * @property {number} [deviceId] SolverParameter deviceId
         * @property {number|Long} [randomSeed] SolverParameter randomSeed
         * @property {string} [type] SolverParameter type
         * @property {number} [delta] SolverParameter delta
         * @property {number} [momentum2] SolverParameter momentum2
         * @property {number} [rmsDecay] SolverParameter rmsDecay
         * @property {boolean} [debugInfo] SolverParameter debugInfo
         * @property {boolean} [snapshotAfterTrain] SolverParameter snapshotAfterTrain
         * @property {caffe.SolverParameter.SolverType} [solverType] SolverParameter solverType
         * @property {boolean} [layerWiseReduce] SolverParameter layerWiseReduce
         */

        /**
         * Constructs a new SolverParameter.
         * @memberof caffe
         * @classdesc Represents a SolverParameter.
         * @constructor
         * @param {caffe.ISolverParameter=} [properties] Properties to set
         */
        function SolverParameter(properties) {
            this.testNet = [];
            this.testNetParam = [];
            this.testState = [];
            this.testIter = [];
            this.stepvalue = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SolverParameter net.
         * @member {string}net
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.net = "";

        /**
         * SolverParameter netParam.
         * @member {(caffe.INetParameter|null|undefined)}netParam
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.netParam = null;

        /**
         * SolverParameter trainNet.
         * @member {string}trainNet
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.trainNet = "";

        /**
         * SolverParameter testNet.
         * @member {Array.<string>}testNet
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.testNet = $util.emptyArray;

        /**
         * SolverParameter trainNetParam.
         * @member {(caffe.INetParameter|null|undefined)}trainNetParam
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.trainNetParam = null;

        /**
         * SolverParameter testNetParam.
         * @member {Array.<caffe.INetParameter>}testNetParam
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.testNetParam = $util.emptyArray;

        /**
         * SolverParameter trainState.
         * @member {(caffe.INetState|null|undefined)}trainState
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.trainState = null;

        /**
         * SolverParameter testState.
         * @member {Array.<caffe.INetState>}testState
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.testState = $util.emptyArray;

        /**
         * SolverParameter testIter.
         * @member {Array.<number>}testIter
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.testIter = $util.emptyArray;

        /**
         * SolverParameter testInterval.
         * @member {number}testInterval
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.testInterval = 0;

        /**
         * SolverParameter testComputeLoss.
         * @member {boolean}testComputeLoss
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.testComputeLoss = false;

        /**
         * SolverParameter testInitialization.
         * @member {boolean}testInitialization
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.testInitialization = true;

        /**
         * SolverParameter baseLr.
         * @member {number}baseLr
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.baseLr = 0;

        /**
         * SolverParameter display.
         * @member {number}display
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.display = 0;

        /**
         * SolverParameter averageLoss.
         * @member {number}averageLoss
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.averageLoss = 1;

        /**
         * SolverParameter maxIter.
         * @member {number}maxIter
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.maxIter = 0;

        /**
         * SolverParameter iterSize.
         * @member {number}iterSize
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.iterSize = 1;

        /**
         * SolverParameter lrPolicy.
         * @member {string}lrPolicy
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.lrPolicy = "";

        /**
         * SolverParameter gamma.
         * @member {number}gamma
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.gamma = 0;

        /**
         * SolverParameter power.
         * @member {number}power
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.power = 0;

        /**
         * SolverParameter momentum.
         * @member {number}momentum
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.momentum = 0;

        /**
         * SolverParameter weightDecay.
         * @member {number}weightDecay
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.weightDecay = 0;

        /**
         * SolverParameter regularizationType.
         * @member {string}regularizationType
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.regularizationType = "L2";

        /**
         * SolverParameter stepsize.
         * @member {number}stepsize
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.stepsize = 0;

        /**
         * SolverParameter stepvalue.
         * @member {Array.<number>}stepvalue
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.stepvalue = $util.emptyArray;

        /**
         * SolverParameter clipGradients.
         * @member {number}clipGradients
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.clipGradients = -1;

        /**
         * SolverParameter snapshot.
         * @member {number}snapshot
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.snapshot = 0;

        /**
         * SolverParameter snapshotPrefix.
         * @member {string}snapshotPrefix
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.snapshotPrefix = "";

        /**
         * SolverParameter snapshotDiff.
         * @member {boolean}snapshotDiff
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.snapshotDiff = false;

        /**
         * SolverParameter snapshotFormat.
         * @member {caffe.SolverParameter.SnapshotFormat}snapshotFormat
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.snapshotFormat = 1;

        /**
         * SolverParameter solverMode.
         * @member {caffe.SolverParameter.SolverMode}solverMode
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.solverMode = 1;

        /**
         * SolverParameter deviceId.
         * @member {number}deviceId
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.deviceId = 0;

        /**
         * SolverParameter randomSeed.
         * @member {number|Long}randomSeed
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.randomSeed = $util.Long ? $util.Long.fromBits(-1,-1,false) : -1;

        /**
         * SolverParameter type.
         * @member {string}type
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.type = "SGD";

        /**
         * SolverParameter delta.
         * @member {number}delta
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.delta = 1e-8;

        /**
         * SolverParameter momentum2.
         * @member {number}momentum2
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.momentum2 = 0.999;

        /**
         * SolverParameter rmsDecay.
         * @member {number}rmsDecay
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.rmsDecay = 0.99;

        /**
         * SolverParameter debugInfo.
         * @member {boolean}debugInfo
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.debugInfo = false;

        /**
         * SolverParameter snapshotAfterTrain.
         * @member {boolean}snapshotAfterTrain
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.snapshotAfterTrain = true;

        /**
         * SolverParameter solverType.
         * @member {caffe.SolverParameter.SolverType}solverType
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.solverType = 0;

        /**
         * SolverParameter layerWiseReduce.
         * @member {boolean}layerWiseReduce
         * @memberof caffe.SolverParameter
         * @instance
         */
        SolverParameter.prototype.layerWiseReduce = true;

        /**
         * Creates a new SolverParameter instance using the specified properties.
         * @function create
         * @memberof caffe.SolverParameter
         * @static
         * @param {caffe.ISolverParameter=} [properties] Properties to set
         * @returns {caffe.SolverParameter} SolverParameter instance
         */
        SolverParameter.create = function create(properties) {
            return new SolverParameter(properties);
        };

        /**
         * Encodes the specified SolverParameter message. Does not implicitly {@link caffe.SolverParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.SolverParameter
         * @static
         * @param {caffe.ISolverParameter} message SolverParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SolverParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.trainNet != null && message.hasOwnProperty("trainNet"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.trainNet);
            if (message.testNet != null && message.testNet.length)
                for (var i = 0; i < message.testNet.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.testNet[i]);
            if (message.testIter != null && message.testIter.length)
                for (var i = 0; i < message.testIter.length; ++i)
                    writer.uint32(/* id 3, wireType 0 =*/24).int32(message.testIter[i]);
            if (message.testInterval != null && message.hasOwnProperty("testInterval"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.testInterval);
            if (message.baseLr != null && message.hasOwnProperty("baseLr"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.baseLr);
            if (message.display != null && message.hasOwnProperty("display"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.display);
            if (message.maxIter != null && message.hasOwnProperty("maxIter"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.maxIter);
            if (message.lrPolicy != null && message.hasOwnProperty("lrPolicy"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.lrPolicy);
            if (message.gamma != null && message.hasOwnProperty("gamma"))
                writer.uint32(/* id 9, wireType 5 =*/77).float(message.gamma);
            if (message.power != null && message.hasOwnProperty("power"))
                writer.uint32(/* id 10, wireType 5 =*/85).float(message.power);
            if (message.momentum != null && message.hasOwnProperty("momentum"))
                writer.uint32(/* id 11, wireType 5 =*/93).float(message.momentum);
            if (message.weightDecay != null && message.hasOwnProperty("weightDecay"))
                writer.uint32(/* id 12, wireType 5 =*/101).float(message.weightDecay);
            if (message.stepsize != null && message.hasOwnProperty("stepsize"))
                writer.uint32(/* id 13, wireType 0 =*/104).int32(message.stepsize);
            if (message.snapshot != null && message.hasOwnProperty("snapshot"))
                writer.uint32(/* id 14, wireType 0 =*/112).int32(message.snapshot);
            if (message.snapshotPrefix != null && message.hasOwnProperty("snapshotPrefix"))
                writer.uint32(/* id 15, wireType 2 =*/122).string(message.snapshotPrefix);
            if (message.snapshotDiff != null && message.hasOwnProperty("snapshotDiff"))
                writer.uint32(/* id 16, wireType 0 =*/128).bool(message.snapshotDiff);
            if (message.solverMode != null && message.hasOwnProperty("solverMode"))
                writer.uint32(/* id 17, wireType 0 =*/136).int32(message.solverMode);
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                writer.uint32(/* id 18, wireType 0 =*/144).int32(message.deviceId);
            if (message.testComputeLoss != null && message.hasOwnProperty("testComputeLoss"))
                writer.uint32(/* id 19, wireType 0 =*/152).bool(message.testComputeLoss);
            if (message.randomSeed != null && message.hasOwnProperty("randomSeed"))
                writer.uint32(/* id 20, wireType 0 =*/160).int64(message.randomSeed);
            if (message.trainNetParam != null && message.hasOwnProperty("trainNetParam"))
                $root.caffe.NetParameter.encode(message.trainNetParam, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
            if (message.testNetParam != null && message.testNetParam.length)
                for (var i = 0; i < message.testNetParam.length; ++i)
                    $root.caffe.NetParameter.encode(message.testNetParam[i], writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                writer.uint32(/* id 23, wireType 0 =*/184).bool(message.debugInfo);
            if (message.net != null && message.hasOwnProperty("net"))
                writer.uint32(/* id 24, wireType 2 =*/194).string(message.net);
            if (message.netParam != null && message.hasOwnProperty("netParam"))
                $root.caffe.NetParameter.encode(message.netParam, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
            if (message.trainState != null && message.hasOwnProperty("trainState"))
                $root.caffe.NetState.encode(message.trainState, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
            if (message.testState != null && message.testState.length)
                for (var i = 0; i < message.testState.length; ++i)
                    $root.caffe.NetState.encode(message.testState[i], writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
            if (message.snapshotAfterTrain != null && message.hasOwnProperty("snapshotAfterTrain"))
                writer.uint32(/* id 28, wireType 0 =*/224).bool(message.snapshotAfterTrain);
            if (message.regularizationType != null && message.hasOwnProperty("regularizationType"))
                writer.uint32(/* id 29, wireType 2 =*/234).string(message.regularizationType);
            if (message.solverType != null && message.hasOwnProperty("solverType"))
                writer.uint32(/* id 30, wireType 0 =*/240).int32(message.solverType);
            if (message.delta != null && message.hasOwnProperty("delta"))
                writer.uint32(/* id 31, wireType 5 =*/253).float(message.delta);
            if (message.testInitialization != null && message.hasOwnProperty("testInitialization"))
                writer.uint32(/* id 32, wireType 0 =*/256).bool(message.testInitialization);
            if (message.averageLoss != null && message.hasOwnProperty("averageLoss"))
                writer.uint32(/* id 33, wireType 0 =*/264).int32(message.averageLoss);
            if (message.stepvalue != null && message.stepvalue.length)
                for (var i = 0; i < message.stepvalue.length; ++i)
                    writer.uint32(/* id 34, wireType 0 =*/272).int32(message.stepvalue[i]);
            if (message.clipGradients != null && message.hasOwnProperty("clipGradients"))
                writer.uint32(/* id 35, wireType 5 =*/285).float(message.clipGradients);
            if (message.iterSize != null && message.hasOwnProperty("iterSize"))
                writer.uint32(/* id 36, wireType 0 =*/288).int32(message.iterSize);
            if (message.snapshotFormat != null && message.hasOwnProperty("snapshotFormat"))
                writer.uint32(/* id 37, wireType 0 =*/296).int32(message.snapshotFormat);
            if (message.rmsDecay != null && message.hasOwnProperty("rmsDecay"))
                writer.uint32(/* id 38, wireType 5 =*/309).float(message.rmsDecay);
            if (message.momentum2 != null && message.hasOwnProperty("momentum2"))
                writer.uint32(/* id 39, wireType 5 =*/317).float(message.momentum2);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 40, wireType 2 =*/322).string(message.type);
            if (message.layerWiseReduce != null && message.hasOwnProperty("layerWiseReduce"))
                writer.uint32(/* id 41, wireType 0 =*/328).bool(message.layerWiseReduce);
            return writer;
        };

        /**
         * Encodes the specified SolverParameter message, length delimited. Does not implicitly {@link caffe.SolverParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.SolverParameter
         * @static
         * @param {caffe.ISolverParameter} message SolverParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SolverParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SolverParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.SolverParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.SolverParameter} SolverParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SolverParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.SolverParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 24:
                    message.net = reader.string();
                    break;
                case 25:
                    message.netParam = $root.caffe.NetParameter.decode(reader, reader.uint32());
                    break;
                case 1:
                    message.trainNet = reader.string();
                    break;
                case 2:
                    if (!(message.testNet && message.testNet.length))
                        message.testNet = [];
                    message.testNet.push(reader.string());
                    break;
                case 21:
                    message.trainNetParam = $root.caffe.NetParameter.decode(reader, reader.uint32());
                    break;
                case 22:
                    if (!(message.testNetParam && message.testNetParam.length))
                        message.testNetParam = [];
                    message.testNetParam.push($root.caffe.NetParameter.decode(reader, reader.uint32()));
                    break;
                case 26:
                    message.trainState = $root.caffe.NetState.decode(reader, reader.uint32());
                    break;
                case 27:
                    if (!(message.testState && message.testState.length))
                        message.testState = [];
                    message.testState.push($root.caffe.NetState.decode(reader, reader.uint32()));
                    break;
                case 3:
                    if (!(message.testIter && message.testIter.length))
                        message.testIter = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.testIter.push(reader.int32());
                    } else
                        message.testIter.push(reader.int32());
                    break;
                case 4:
                    message.testInterval = reader.int32();
                    break;
                case 19:
                    message.testComputeLoss = reader.bool();
                    break;
                case 32:
                    message.testInitialization = reader.bool();
                    break;
                case 5:
                    message.baseLr = reader.float();
                    break;
                case 6:
                    message.display = reader.int32();
                    break;
                case 33:
                    message.averageLoss = reader.int32();
                    break;
                case 7:
                    message.maxIter = reader.int32();
                    break;
                case 36:
                    message.iterSize = reader.int32();
                    break;
                case 8:
                    message.lrPolicy = reader.string();
                    break;
                case 9:
                    message.gamma = reader.float();
                    break;
                case 10:
                    message.power = reader.float();
                    break;
                case 11:
                    message.momentum = reader.float();
                    break;
                case 12:
                    message.weightDecay = reader.float();
                    break;
                case 29:
                    message.regularizationType = reader.string();
                    break;
                case 13:
                    message.stepsize = reader.int32();
                    break;
                case 34:
                    if (!(message.stepvalue && message.stepvalue.length))
                        message.stepvalue = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.stepvalue.push(reader.int32());
                    } else
                        message.stepvalue.push(reader.int32());
                    break;
                case 35:
                    message.clipGradients = reader.float();
                    break;
                case 14:
                    message.snapshot = reader.int32();
                    break;
                case 15:
                    message.snapshotPrefix = reader.string();
                    break;
                case 16:
                    message.snapshotDiff = reader.bool();
                    break;
                case 37:
                    message.snapshotFormat = reader.int32();
                    break;
                case 17:
                    message.solverMode = reader.int32();
                    break;
                case 18:
                    message.deviceId = reader.int32();
                    break;
                case 20:
                    message.randomSeed = reader.int64();
                    break;
                case 40:
                    message.type = reader.string();
                    break;
                case 31:
                    message.delta = reader.float();
                    break;
                case 39:
                    message.momentum2 = reader.float();
                    break;
                case 38:
                    message.rmsDecay = reader.float();
                    break;
                case 23:
                    message.debugInfo = reader.bool();
                    break;
                case 28:
                    message.snapshotAfterTrain = reader.bool();
                    break;
                case 30:
                    message.solverType = reader.int32();
                    break;
                case 41:
                    message.layerWiseReduce = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SolverParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.SolverParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.SolverParameter} SolverParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SolverParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SolverParameter message.
         * @function verify
         * @memberof caffe.SolverParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SolverParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.net != null && message.hasOwnProperty("net"))
                if (!$util.isString(message.net))
                    return "net: string expected";
            if (message.netParam != null && message.hasOwnProperty("netParam")) {
                var error = $root.caffe.NetParameter.verify(message.netParam);
                if (error)
                    return "netParam." + error;
            }
            if (message.trainNet != null && message.hasOwnProperty("trainNet"))
                if (!$util.isString(message.trainNet))
                    return "trainNet: string expected";
            if (message.testNet != null && message.hasOwnProperty("testNet")) {
                if (!Array.isArray(message.testNet))
                    return "testNet: array expected";
                for (var i = 0; i < message.testNet.length; ++i)
                    if (!$util.isString(message.testNet[i]))
                        return "testNet: string[] expected";
            }
            if (message.trainNetParam != null && message.hasOwnProperty("trainNetParam")) {
                error = $root.caffe.NetParameter.verify(message.trainNetParam);
                if (error)
                    return "trainNetParam." + error;
            }
            if (message.testNetParam != null && message.hasOwnProperty("testNetParam")) {
                if (!Array.isArray(message.testNetParam))
                    return "testNetParam: array expected";
                for (var i = 0; i < message.testNetParam.length; ++i) {
                    error = $root.caffe.NetParameter.verify(message.testNetParam[i]);
                    if (error)
                        return "testNetParam." + error;
                }
            }
            if (message.trainState != null && message.hasOwnProperty("trainState")) {
                error = $root.caffe.NetState.verify(message.trainState);
                if (error)
                    return "trainState." + error;
            }
            if (message.testState != null && message.hasOwnProperty("testState")) {
                if (!Array.isArray(message.testState))
                    return "testState: array expected";
                for (var i = 0; i < message.testState.length; ++i) {
                    error = $root.caffe.NetState.verify(message.testState[i]);
                    if (error)
                        return "testState." + error;
                }
            }
            if (message.testIter != null && message.hasOwnProperty("testIter")) {
                if (!Array.isArray(message.testIter))
                    return "testIter: array expected";
                for (var i = 0; i < message.testIter.length; ++i)
                    if (!$util.isInteger(message.testIter[i]))
                        return "testIter: integer[] expected";
            }
            if (message.testInterval != null && message.hasOwnProperty("testInterval"))
                if (!$util.isInteger(message.testInterval))
                    return "testInterval: integer expected";
            if (message.testComputeLoss != null && message.hasOwnProperty("testComputeLoss"))
                if (typeof message.testComputeLoss !== "boolean")
                    return "testComputeLoss: boolean expected";
            if (message.testInitialization != null && message.hasOwnProperty("testInitialization"))
                if (typeof message.testInitialization !== "boolean")
                    return "testInitialization: boolean expected";
            if (message.baseLr != null && message.hasOwnProperty("baseLr"))
                if (typeof message.baseLr !== "number")
                    return "baseLr: number expected";
            if (message.display != null && message.hasOwnProperty("display"))
                if (!$util.isInteger(message.display))
                    return "display: integer expected";
            if (message.averageLoss != null && message.hasOwnProperty("averageLoss"))
                if (!$util.isInteger(message.averageLoss))
                    return "averageLoss: integer expected";
            if (message.maxIter != null && message.hasOwnProperty("maxIter"))
                if (!$util.isInteger(message.maxIter))
                    return "maxIter: integer expected";
            if (message.iterSize != null && message.hasOwnProperty("iterSize"))
                if (!$util.isInteger(message.iterSize))
                    return "iterSize: integer expected";
            if (message.lrPolicy != null && message.hasOwnProperty("lrPolicy"))
                if (!$util.isString(message.lrPolicy))
                    return "lrPolicy: string expected";
            if (message.gamma != null && message.hasOwnProperty("gamma"))
                if (typeof message.gamma !== "number")
                    return "gamma: number expected";
            if (message.power != null && message.hasOwnProperty("power"))
                if (typeof message.power !== "number")
                    return "power: number expected";
            if (message.momentum != null && message.hasOwnProperty("momentum"))
                if (typeof message.momentum !== "number")
                    return "momentum: number expected";
            if (message.weightDecay != null && message.hasOwnProperty("weightDecay"))
                if (typeof message.weightDecay !== "number")
                    return "weightDecay: number expected";
            if (message.regularizationType != null && message.hasOwnProperty("regularizationType"))
                if (!$util.isString(message.regularizationType))
                    return "regularizationType: string expected";
            if (message.stepsize != null && message.hasOwnProperty("stepsize"))
                if (!$util.isInteger(message.stepsize))
                    return "stepsize: integer expected";
            if (message.stepvalue != null && message.hasOwnProperty("stepvalue")) {
                if (!Array.isArray(message.stepvalue))
                    return "stepvalue: array expected";
                for (var i = 0; i < message.stepvalue.length; ++i)
                    if (!$util.isInteger(message.stepvalue[i]))
                        return "stepvalue: integer[] expected";
            }
            if (message.clipGradients != null && message.hasOwnProperty("clipGradients"))
                if (typeof message.clipGradients !== "number")
                    return "clipGradients: number expected";
            if (message.snapshot != null && message.hasOwnProperty("snapshot"))
                if (!$util.isInteger(message.snapshot))
                    return "snapshot: integer expected";
            if (message.snapshotPrefix != null && message.hasOwnProperty("snapshotPrefix"))
                if (!$util.isString(message.snapshotPrefix))
                    return "snapshotPrefix: string expected";
            if (message.snapshotDiff != null && message.hasOwnProperty("snapshotDiff"))
                if (typeof message.snapshotDiff !== "boolean")
                    return "snapshotDiff: boolean expected";
            if (message.snapshotFormat != null && message.hasOwnProperty("snapshotFormat"))
                switch (message.snapshotFormat) {
                default:
                    return "snapshotFormat: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.solverMode != null && message.hasOwnProperty("solverMode"))
                switch (message.solverMode) {
                default:
                    return "solverMode: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                if (!$util.isInteger(message.deviceId))
                    return "deviceId: integer expected";
            if (message.randomSeed != null && message.hasOwnProperty("randomSeed"))
                if (!$util.isInteger(message.randomSeed) && !(message.randomSeed && $util.isInteger(message.randomSeed.low) && $util.isInteger(message.randomSeed.high)))
                    return "randomSeed: integer|Long expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.delta != null && message.hasOwnProperty("delta"))
                if (typeof message.delta !== "number")
                    return "delta: number expected";
            if (message.momentum2 != null && message.hasOwnProperty("momentum2"))
                if (typeof message.momentum2 !== "number")
                    return "momentum2: number expected";
            if (message.rmsDecay != null && message.hasOwnProperty("rmsDecay"))
                if (typeof message.rmsDecay !== "number")
                    return "rmsDecay: number expected";
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                if (typeof message.debugInfo !== "boolean")
                    return "debugInfo: boolean expected";
            if (message.snapshotAfterTrain != null && message.hasOwnProperty("snapshotAfterTrain"))
                if (typeof message.snapshotAfterTrain !== "boolean")
                    return "snapshotAfterTrain: boolean expected";
            if (message.solverType != null && message.hasOwnProperty("solverType"))
                switch (message.solverType) {
                default:
                    return "solverType: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                    break;
                }
            if (message.layerWiseReduce != null && message.hasOwnProperty("layerWiseReduce"))
                if (typeof message.layerWiseReduce !== "boolean")
                    return "layerWiseReduce: boolean expected";
            return null;
        };

        /**
         * Creates a SolverParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.SolverParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.SolverParameter} SolverParameter
         */
        SolverParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.SolverParameter)
                return object;
            var message = new $root.caffe.SolverParameter();
            if (object.net != null)
                message.net = String(object.net);
            if (object.netParam != null) {
                if (typeof object.netParam !== "object")
                    throw TypeError(".caffe.SolverParameter.netParam: object expected");
                message.netParam = $root.caffe.NetParameter.fromObject(object.netParam);
            }
            if (object.trainNet != null)
                message.trainNet = String(object.trainNet);
            if (object.testNet) {
                if (!Array.isArray(object.testNet))
                    throw TypeError(".caffe.SolverParameter.testNet: array expected");
                message.testNet = [];
                for (var i = 0; i < object.testNet.length; ++i)
                    message.testNet[i] = String(object.testNet[i]);
            }
            if (object.trainNetParam != null) {
                if (typeof object.trainNetParam !== "object")
                    throw TypeError(".caffe.SolverParameter.trainNetParam: object expected");
                message.trainNetParam = $root.caffe.NetParameter.fromObject(object.trainNetParam);
            }
            if (object.testNetParam) {
                if (!Array.isArray(object.testNetParam))
                    throw TypeError(".caffe.SolverParameter.testNetParam: array expected");
                message.testNetParam = [];
                for (var i = 0; i < object.testNetParam.length; ++i) {
                    if (typeof object.testNetParam[i] !== "object")
                        throw TypeError(".caffe.SolverParameter.testNetParam: object expected");
                    message.testNetParam[i] = $root.caffe.NetParameter.fromObject(object.testNetParam[i]);
                }
            }
            if (object.trainState != null) {
                if (typeof object.trainState !== "object")
                    throw TypeError(".caffe.SolverParameter.trainState: object expected");
                message.trainState = $root.caffe.NetState.fromObject(object.trainState);
            }
            if (object.testState) {
                if (!Array.isArray(object.testState))
                    throw TypeError(".caffe.SolverParameter.testState: array expected");
                message.testState = [];
                for (var i = 0; i < object.testState.length; ++i) {
                    if (typeof object.testState[i] !== "object")
                        throw TypeError(".caffe.SolverParameter.testState: object expected");
                    message.testState[i] = $root.caffe.NetState.fromObject(object.testState[i]);
                }
            }
            if (object.testIter) {
                if (!Array.isArray(object.testIter))
                    throw TypeError(".caffe.SolverParameter.testIter: array expected");
                message.testIter = [];
                for (var i = 0; i < object.testIter.length; ++i)
                    message.testIter[i] = object.testIter[i] | 0;
            }
            if (object.testInterval != null)
                message.testInterval = object.testInterval | 0;
            if (object.testComputeLoss != null)
                message.testComputeLoss = Boolean(object.testComputeLoss);
            if (object.testInitialization != null)
                message.testInitialization = Boolean(object.testInitialization);
            if (object.baseLr != null)
                message.baseLr = Number(object.baseLr);
            if (object.display != null)
                message.display = object.display | 0;
            if (object.averageLoss != null)
                message.averageLoss = object.averageLoss | 0;
            if (object.maxIter != null)
                message.maxIter = object.maxIter | 0;
            if (object.iterSize != null)
                message.iterSize = object.iterSize | 0;
            if (object.lrPolicy != null)
                message.lrPolicy = String(object.lrPolicy);
            if (object.gamma != null)
                message.gamma = Number(object.gamma);
            if (object.power != null)
                message.power = Number(object.power);
            if (object.momentum != null)
                message.momentum = Number(object.momentum);
            if (object.weightDecay != null)
                message.weightDecay = Number(object.weightDecay);
            if (object.regularizationType != null)
                message.regularizationType = String(object.regularizationType);
            if (object.stepsize != null)
                message.stepsize = object.stepsize | 0;
            if (object.stepvalue) {
                if (!Array.isArray(object.stepvalue))
                    throw TypeError(".caffe.SolverParameter.stepvalue: array expected");
                message.stepvalue = [];
                for (var i = 0; i < object.stepvalue.length; ++i)
                    message.stepvalue[i] = object.stepvalue[i] | 0;
            }
            if (object.clipGradients != null)
                message.clipGradients = Number(object.clipGradients);
            if (object.snapshot != null)
                message.snapshot = object.snapshot | 0;
            if (object.snapshotPrefix != null)
                message.snapshotPrefix = String(object.snapshotPrefix);
            if (object.snapshotDiff != null)
                message.snapshotDiff = Boolean(object.snapshotDiff);
            switch (object.snapshotFormat) {
            case "HDF5":
            case 0:
                message.snapshotFormat = 0;
                break;
            case "BINARYPROTO":
            case 1:
                message.snapshotFormat = 1;
                break;
            }
            switch (object.solverMode) {
            case "CPU":
            case 0:
                message.solverMode = 0;
                break;
            case "GPU":
            case 1:
                message.solverMode = 1;
                break;
            }
            if (object.deviceId != null)
                message.deviceId = object.deviceId | 0;
            if (object.randomSeed != null)
                if ($util.Long)
                    (message.randomSeed = $util.Long.fromValue(object.randomSeed)).unsigned = false;
                else if (typeof object.randomSeed === "string")
                    message.randomSeed = parseInt(object.randomSeed, 10);
                else if (typeof object.randomSeed === "number")
                    message.randomSeed = object.randomSeed;
                else if (typeof object.randomSeed === "object")
                    message.randomSeed = new $util.LongBits(object.randomSeed.low >>> 0, object.randomSeed.high >>> 0).toNumber();
            if (object.type != null)
                message.type = String(object.type);
            if (object.delta != null)
                message.delta = Number(object.delta);
            if (object.momentum2 != null)
                message.momentum2 = Number(object.momentum2);
            if (object.rmsDecay != null)
                message.rmsDecay = Number(object.rmsDecay);
            if (object.debugInfo != null)
                message.debugInfo = Boolean(object.debugInfo);
            if (object.snapshotAfterTrain != null)
                message.snapshotAfterTrain = Boolean(object.snapshotAfterTrain);
            switch (object.solverType) {
            case "SGD":
            case 0:
                message.solverType = 0;
                break;
            case "NESTEROV":
            case 1:
                message.solverType = 1;
                break;
            case "ADAGRAD":
            case 2:
                message.solverType = 2;
                break;
            case "RMSPROP":
            case 3:
                message.solverType = 3;
                break;
            case "ADADELTA":
            case 4:
                message.solverType = 4;
                break;
            case "ADAM":
            case 5:
                message.solverType = 5;
                break;
            }
            if (object.layerWiseReduce != null)
                message.layerWiseReduce = Boolean(object.layerWiseReduce);
            return message;
        };

        /**
         * Creates a plain object from a SolverParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.SolverParameter
         * @static
         * @param {caffe.SolverParameter} message SolverParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SolverParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.testNet = [];
                object.testIter = [];
                object.testNetParam = [];
                object.testState = [];
                object.stepvalue = [];
            }
            if (options.defaults) {
                object.trainNet = "";
                object.testInterval = 0;
                object.baseLr = 0;
                object.display = 0;
                object.maxIter = 0;
                object.lrPolicy = "";
                object.gamma = 0;
                object.power = 0;
                object.momentum = 0;
                object.weightDecay = 0;
                object.stepsize = 0;
                object.snapshot = 0;
                object.snapshotPrefix = "";
                object.snapshotDiff = false;
                object.solverMode = options.enums === String ? "GPU" : 1;
                object.deviceId = 0;
                object.testComputeLoss = false;
                if ($util.Long) {
                    var long = new $util.Long(-1, -1, false);
                    object.randomSeed = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.randomSeed = options.longs === String ? "-1" : -1;
                object.trainNetParam = null;
                object.debugInfo = false;
                object.net = "";
                object.netParam = null;
                object.trainState = null;
                object.snapshotAfterTrain = true;
                object.regularizationType = "L2";
                object.solverType = options.enums === String ? "SGD" : 0;
                object.delta = 1e-8;
                object.testInitialization = true;
                object.averageLoss = 1;
                object.clipGradients = -1;
                object.iterSize = 1;
                object.snapshotFormat = options.enums === String ? "BINARYPROTO" : 1;
                object.rmsDecay = 0.99;
                object.momentum2 = 0.999;
                object.type = "SGD";
                object.layerWiseReduce = true;
            }
            if (message.trainNet != null && message.hasOwnProperty("trainNet"))
                object.trainNet = message.trainNet;
            if (message.testNet && message.testNet.length) {
                object.testNet = [];
                for (var j = 0; j < message.testNet.length; ++j)
                    object.testNet[j] = message.testNet[j];
            }
            if (message.testIter && message.testIter.length) {
                object.testIter = [];
                for (var j = 0; j < message.testIter.length; ++j)
                    object.testIter[j] = message.testIter[j];
            }
            if (message.testInterval != null && message.hasOwnProperty("testInterval"))
                object.testInterval = message.testInterval;
            if (message.baseLr != null && message.hasOwnProperty("baseLr"))
                object.baseLr = options.json && !isFinite(message.baseLr) ? String(message.baseLr) : message.baseLr;
            if (message.display != null && message.hasOwnProperty("display"))
                object.display = message.display;
            if (message.maxIter != null && message.hasOwnProperty("maxIter"))
                object.maxIter = message.maxIter;
            if (message.lrPolicy != null && message.hasOwnProperty("lrPolicy"))
                object.lrPolicy = message.lrPolicy;
            if (message.gamma != null && message.hasOwnProperty("gamma"))
                object.gamma = options.json && !isFinite(message.gamma) ? String(message.gamma) : message.gamma;
            if (message.power != null && message.hasOwnProperty("power"))
                object.power = options.json && !isFinite(message.power) ? String(message.power) : message.power;
            if (message.momentum != null && message.hasOwnProperty("momentum"))
                object.momentum = options.json && !isFinite(message.momentum) ? String(message.momentum) : message.momentum;
            if (message.weightDecay != null && message.hasOwnProperty("weightDecay"))
                object.weightDecay = options.json && !isFinite(message.weightDecay) ? String(message.weightDecay) : message.weightDecay;
            if (message.stepsize != null && message.hasOwnProperty("stepsize"))
                object.stepsize = message.stepsize;
            if (message.snapshot != null && message.hasOwnProperty("snapshot"))
                object.snapshot = message.snapshot;
            if (message.snapshotPrefix != null && message.hasOwnProperty("snapshotPrefix"))
                object.snapshotPrefix = message.snapshotPrefix;
            if (message.snapshotDiff != null && message.hasOwnProperty("snapshotDiff"))
                object.snapshotDiff = message.snapshotDiff;
            if (message.solverMode != null && message.hasOwnProperty("solverMode"))
                object.solverMode = options.enums === String ? $root.caffe.SolverParameter.SolverMode[message.solverMode] : message.solverMode;
            if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                object.deviceId = message.deviceId;
            if (message.testComputeLoss != null && message.hasOwnProperty("testComputeLoss"))
                object.testComputeLoss = message.testComputeLoss;
            if (message.randomSeed != null && message.hasOwnProperty("randomSeed"))
                if (typeof message.randomSeed === "number")
                    object.randomSeed = options.longs === String ? String(message.randomSeed) : message.randomSeed;
                else
                    object.randomSeed = options.longs === String ? $util.Long.prototype.toString.call(message.randomSeed) : options.longs === Number ? new $util.LongBits(message.randomSeed.low >>> 0, message.randomSeed.high >>> 0).toNumber() : message.randomSeed;
            if (message.trainNetParam != null && message.hasOwnProperty("trainNetParam"))
                object.trainNetParam = $root.caffe.NetParameter.toObject(message.trainNetParam, options);
            if (message.testNetParam && message.testNetParam.length) {
                object.testNetParam = [];
                for (var j = 0; j < message.testNetParam.length; ++j)
                    object.testNetParam[j] = $root.caffe.NetParameter.toObject(message.testNetParam[j], options);
            }
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                object.debugInfo = message.debugInfo;
            if (message.net != null && message.hasOwnProperty("net"))
                object.net = message.net;
            if (message.netParam != null && message.hasOwnProperty("netParam"))
                object.netParam = $root.caffe.NetParameter.toObject(message.netParam, options);
            if (message.trainState != null && message.hasOwnProperty("trainState"))
                object.trainState = $root.caffe.NetState.toObject(message.trainState, options);
            if (message.testState && message.testState.length) {
                object.testState = [];
                for (var j = 0; j < message.testState.length; ++j)
                    object.testState[j] = $root.caffe.NetState.toObject(message.testState[j], options);
            }
            if (message.snapshotAfterTrain != null && message.hasOwnProperty("snapshotAfterTrain"))
                object.snapshotAfterTrain = message.snapshotAfterTrain;
            if (message.regularizationType != null && message.hasOwnProperty("regularizationType"))
                object.regularizationType = message.regularizationType;
            if (message.solverType != null && message.hasOwnProperty("solverType"))
                object.solverType = options.enums === String ? $root.caffe.SolverParameter.SolverType[message.solverType] : message.solverType;
            if (message.delta != null && message.hasOwnProperty("delta"))
                object.delta = options.json && !isFinite(message.delta) ? String(message.delta) : message.delta;
            if (message.testInitialization != null && message.hasOwnProperty("testInitialization"))
                object.testInitialization = message.testInitialization;
            if (message.averageLoss != null && message.hasOwnProperty("averageLoss"))
                object.averageLoss = message.averageLoss;
            if (message.stepvalue && message.stepvalue.length) {
                object.stepvalue = [];
                for (var j = 0; j < message.stepvalue.length; ++j)
                    object.stepvalue[j] = message.stepvalue[j];
            }
            if (message.clipGradients != null && message.hasOwnProperty("clipGradients"))
                object.clipGradients = options.json && !isFinite(message.clipGradients) ? String(message.clipGradients) : message.clipGradients;
            if (message.iterSize != null && message.hasOwnProperty("iterSize"))
                object.iterSize = message.iterSize;
            if (message.snapshotFormat != null && message.hasOwnProperty("snapshotFormat"))
                object.snapshotFormat = options.enums === String ? $root.caffe.SolverParameter.SnapshotFormat[message.snapshotFormat] : message.snapshotFormat;
            if (message.rmsDecay != null && message.hasOwnProperty("rmsDecay"))
                object.rmsDecay = options.json && !isFinite(message.rmsDecay) ? String(message.rmsDecay) : message.rmsDecay;
            if (message.momentum2 != null && message.hasOwnProperty("momentum2"))
                object.momentum2 = options.json && !isFinite(message.momentum2) ? String(message.momentum2) : message.momentum2;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.layerWiseReduce != null && message.hasOwnProperty("layerWiseReduce"))
                object.layerWiseReduce = message.layerWiseReduce;
            return object;
        };

        /**
         * Converts this SolverParameter to JSON.
         * @function toJSON
         * @memberof caffe.SolverParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SolverParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * SnapshotFormat enum.
         * @enum {string}
         * @property {number} HDF5=0 HDF5 value
         * @property {number} BINARYPROTO=1 BINARYPROTO value
         */
        SolverParameter.SnapshotFormat = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "HDF5"] = 0;
            values[valuesById[1] = "BINARYPROTO"] = 1;
            return values;
        })();

        /**
         * SolverMode enum.
         * @enum {string}
         * @property {number} CPU=0 CPU value
         * @property {number} GPU=1 GPU value
         */
        SolverParameter.SolverMode = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "CPU"] = 0;
            values[valuesById[1] = "GPU"] = 1;
            return values;
        })();

        /**
         * SolverType enum.
         * @enum {string}
         * @property {number} SGD=0 SGD value
         * @property {number} NESTEROV=1 NESTEROV value
         * @property {number} ADAGRAD=2 ADAGRAD value
         * @property {number} RMSPROP=3 RMSPROP value
         * @property {number} ADADELTA=4 ADADELTA value
         * @property {number} ADAM=5 ADAM value
         */
        SolverParameter.SolverType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "SGD"] = 0;
            values[valuesById[1] = "NESTEROV"] = 1;
            values[valuesById[2] = "ADAGRAD"] = 2;
            values[valuesById[3] = "RMSPROP"] = 3;
            values[valuesById[4] = "ADADELTA"] = 4;
            values[valuesById[5] = "ADAM"] = 5;
            return values;
        })();

        return SolverParameter;
    })();

    caffe.SolverState = (function() {

        /**
         * Properties of a SolverState.
         * @memberof caffe
         * @interface ISolverState
         * @property {number} [iter] SolverState iter
         * @property {string} [learnedNet] SolverState learnedNet
         * @property {Array.<caffe.IBlobProto>} [history] SolverState history
         * @property {number} [currentStep] SolverState currentStep
         */

        /**
         * Constructs a new SolverState.
         * @memberof caffe
         * @classdesc Represents a SolverState.
         * @constructor
         * @param {caffe.ISolverState=} [properties] Properties to set
         */
        function SolverState(properties) {
            this.history = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SolverState iter.
         * @member {number}iter
         * @memberof caffe.SolverState
         * @instance
         */
        SolverState.prototype.iter = 0;

        /**
         * SolverState learnedNet.
         * @member {string}learnedNet
         * @memberof caffe.SolverState
         * @instance
         */
        SolverState.prototype.learnedNet = "";

        /**
         * SolverState history.
         * @member {Array.<caffe.IBlobProto>}history
         * @memberof caffe.SolverState
         * @instance
         */
        SolverState.prototype.history = $util.emptyArray;

        /**
         * SolverState currentStep.
         * @member {number}currentStep
         * @memberof caffe.SolverState
         * @instance
         */
        SolverState.prototype.currentStep = 0;

        /**
         * Creates a new SolverState instance using the specified properties.
         * @function create
         * @memberof caffe.SolverState
         * @static
         * @param {caffe.ISolverState=} [properties] Properties to set
         * @returns {caffe.SolverState} SolverState instance
         */
        SolverState.create = function create(properties) {
            return new SolverState(properties);
        };

        /**
         * Encodes the specified SolverState message. Does not implicitly {@link caffe.SolverState.verify|verify} messages.
         * @function encode
         * @memberof caffe.SolverState
         * @static
         * @param {caffe.ISolverState} message SolverState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SolverState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.iter != null && message.hasOwnProperty("iter"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.iter);
            if (message.learnedNet != null && message.hasOwnProperty("learnedNet"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.learnedNet);
            if (message.history != null && message.history.length)
                for (var i = 0; i < message.history.length; ++i)
                    $root.caffe.BlobProto.encode(message.history[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.currentStep != null && message.hasOwnProperty("currentStep"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.currentStep);
            return writer;
        };

        /**
         * Encodes the specified SolverState message, length delimited. Does not implicitly {@link caffe.SolverState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.SolverState
         * @static
         * @param {caffe.ISolverState} message SolverState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SolverState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SolverState message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.SolverState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.SolverState} SolverState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SolverState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.SolverState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.iter = reader.int32();
                    break;
                case 2:
                    message.learnedNet = reader.string();
                    break;
                case 3:
                    if (!(message.history && message.history.length))
                        message.history = [];
                    message.history.push($root.caffe.BlobProto.decode(reader, reader.uint32()));
                    break;
                case 4:
                    message.currentStep = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SolverState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.SolverState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.SolverState} SolverState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SolverState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SolverState message.
         * @function verify
         * @memberof caffe.SolverState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SolverState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.iter != null && message.hasOwnProperty("iter"))
                if (!$util.isInteger(message.iter))
                    return "iter: integer expected";
            if (message.learnedNet != null && message.hasOwnProperty("learnedNet"))
                if (!$util.isString(message.learnedNet))
                    return "learnedNet: string expected";
            if (message.history != null && message.hasOwnProperty("history")) {
                if (!Array.isArray(message.history))
                    return "history: array expected";
                for (var i = 0; i < message.history.length; ++i) {
                    var error = $root.caffe.BlobProto.verify(message.history[i]);
                    if (error)
                        return "history." + error;
                }
            }
            if (message.currentStep != null && message.hasOwnProperty("currentStep"))
                if (!$util.isInteger(message.currentStep))
                    return "currentStep: integer expected";
            return null;
        };

        /**
         * Creates a SolverState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.SolverState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.SolverState} SolverState
         */
        SolverState.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.SolverState)
                return object;
            var message = new $root.caffe.SolverState();
            if (object.iter != null)
                message.iter = object.iter | 0;
            if (object.learnedNet != null)
                message.learnedNet = String(object.learnedNet);
            if (object.history) {
                if (!Array.isArray(object.history))
                    throw TypeError(".caffe.SolverState.history: array expected");
                message.history = [];
                for (var i = 0; i < object.history.length; ++i) {
                    if (typeof object.history[i] !== "object")
                        throw TypeError(".caffe.SolverState.history: object expected");
                    message.history[i] = $root.caffe.BlobProto.fromObject(object.history[i]);
                }
            }
            if (object.currentStep != null)
                message.currentStep = object.currentStep | 0;
            return message;
        };

        /**
         * Creates a plain object from a SolverState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.SolverState
         * @static
         * @param {caffe.SolverState} message SolverState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SolverState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.history = [];
            if (options.defaults) {
                object.iter = 0;
                object.learnedNet = "";
                object.currentStep = 0;
            }
            if (message.iter != null && message.hasOwnProperty("iter"))
                object.iter = message.iter;
            if (message.learnedNet != null && message.hasOwnProperty("learnedNet"))
                object.learnedNet = message.learnedNet;
            if (message.history && message.history.length) {
                object.history = [];
                for (var j = 0; j < message.history.length; ++j)
                    object.history[j] = $root.caffe.BlobProto.toObject(message.history[j], options);
            }
            if (message.currentStep != null && message.hasOwnProperty("currentStep"))
                object.currentStep = message.currentStep;
            return object;
        };

        /**
         * Converts this SolverState to JSON.
         * @function toJSON
         * @memberof caffe.SolverState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SolverState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SolverState;
    })();

    /**
     * Phase enum.
     * @enum {string}
     * @property {number} TRAIN=0 TRAIN value
     * @property {number} TEST=1 TEST value
     */
    caffe.Phase = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "TRAIN"] = 0;
        values[valuesById[1] = "TEST"] = 1;
        return values;
    })();

    caffe.NetState = (function() {

        /**
         * Properties of a NetState.
         * @memberof caffe
         * @interface INetState
         * @property {caffe.Phase} [phase] NetState phase
         * @property {number} [level] NetState level
         * @property {Array.<string>} [stage] NetState stage
         */

        /**
         * Constructs a new NetState.
         * @memberof caffe
         * @classdesc Represents a NetState.
         * @constructor
         * @param {caffe.INetState=} [properties] Properties to set
         */
        function NetState(properties) {
            this.stage = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NetState phase.
         * @member {caffe.Phase}phase
         * @memberof caffe.NetState
         * @instance
         */
        NetState.prototype.phase = 1;

        /**
         * NetState level.
         * @member {number}level
         * @memberof caffe.NetState
         * @instance
         */
        NetState.prototype.level = 0;

        /**
         * NetState stage.
         * @member {Array.<string>}stage
         * @memberof caffe.NetState
         * @instance
         */
        NetState.prototype.stage = $util.emptyArray;

        /**
         * Creates a new NetState instance using the specified properties.
         * @function create
         * @memberof caffe.NetState
         * @static
         * @param {caffe.INetState=} [properties] Properties to set
         * @returns {caffe.NetState} NetState instance
         */
        NetState.create = function create(properties) {
            return new NetState(properties);
        };

        /**
         * Encodes the specified NetState message. Does not implicitly {@link caffe.NetState.verify|verify} messages.
         * @function encode
         * @memberof caffe.NetState
         * @static
         * @param {caffe.INetState} message NetState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetState.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.phase != null && message.hasOwnProperty("phase"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.phase);
            if (message.level != null && message.hasOwnProperty("level"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.level);
            if (message.stage != null && message.stage.length)
                for (var i = 0; i < message.stage.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.stage[i]);
            return writer;
        };

        /**
         * Encodes the specified NetState message, length delimited. Does not implicitly {@link caffe.NetState.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.NetState
         * @static
         * @param {caffe.INetState} message NetState message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetState.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NetState message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.NetState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.NetState} NetState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetState.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.NetState();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.phase = reader.int32();
                    break;
                case 2:
                    message.level = reader.int32();
                    break;
                case 3:
                    if (!(message.stage && message.stage.length))
                        message.stage = [];
                    message.stage.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NetState message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.NetState
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.NetState} NetState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetState.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NetState message.
         * @function verify
         * @memberof caffe.NetState
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NetState.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.phase != null && message.hasOwnProperty("phase"))
                switch (message.phase) {
                default:
                    return "phase: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.level != null && message.hasOwnProperty("level"))
                if (!$util.isInteger(message.level))
                    return "level: integer expected";
            if (message.stage != null && message.hasOwnProperty("stage")) {
                if (!Array.isArray(message.stage))
                    return "stage: array expected";
                for (var i = 0; i < message.stage.length; ++i)
                    if (!$util.isString(message.stage[i]))
                        return "stage: string[] expected";
            }
            return null;
        };

        /**
         * Creates a NetState message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.NetState
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.NetState} NetState
         */
        NetState.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.NetState)
                return object;
            var message = new $root.caffe.NetState();
            switch (object.phase) {
            case "TRAIN":
            case 0:
                message.phase = 0;
                break;
            case "TEST":
            case 1:
                message.phase = 1;
                break;
            }
            if (object.level != null)
                message.level = object.level | 0;
            if (object.stage) {
                if (!Array.isArray(object.stage))
                    throw TypeError(".caffe.NetState.stage: array expected");
                message.stage = [];
                for (var i = 0; i < object.stage.length; ++i)
                    message.stage[i] = String(object.stage[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a NetState message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.NetState
         * @static
         * @param {caffe.NetState} message NetState
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NetState.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.stage = [];
            if (options.defaults) {
                object.phase = options.enums === String ? "TEST" : 1;
                object.level = 0;
            }
            if (message.phase != null && message.hasOwnProperty("phase"))
                object.phase = options.enums === String ? $root.caffe.Phase[message.phase] : message.phase;
            if (message.level != null && message.hasOwnProperty("level"))
                object.level = message.level;
            if (message.stage && message.stage.length) {
                object.stage = [];
                for (var j = 0; j < message.stage.length; ++j)
                    object.stage[j] = message.stage[j];
            }
            return object;
        };

        /**
         * Converts this NetState to JSON.
         * @function toJSON
         * @memberof caffe.NetState
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NetState.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NetState;
    })();

    caffe.NetStateRule = (function() {

        /**
         * Properties of a NetStateRule.
         * @memberof caffe
         * @interface INetStateRule
         * @property {caffe.Phase} [phase] NetStateRule phase
         * @property {number} [minLevel] NetStateRule minLevel
         * @property {number} [maxLevel] NetStateRule maxLevel
         * @property {Array.<string>} [stage] NetStateRule stage
         * @property {Array.<string>} [notStage] NetStateRule notStage
         */

        /**
         * Constructs a new NetStateRule.
         * @memberof caffe
         * @classdesc Represents a NetStateRule.
         * @constructor
         * @param {caffe.INetStateRule=} [properties] Properties to set
         */
        function NetStateRule(properties) {
            this.stage = [];
            this.notStage = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NetStateRule phase.
         * @member {caffe.Phase}phase
         * @memberof caffe.NetStateRule
         * @instance
         */
        NetStateRule.prototype.phase = 0;

        /**
         * NetStateRule minLevel.
         * @member {number}minLevel
         * @memberof caffe.NetStateRule
         * @instance
         */
        NetStateRule.prototype.minLevel = 0;

        /**
         * NetStateRule maxLevel.
         * @member {number}maxLevel
         * @memberof caffe.NetStateRule
         * @instance
         */
        NetStateRule.prototype.maxLevel = 0;

        /**
         * NetStateRule stage.
         * @member {Array.<string>}stage
         * @memberof caffe.NetStateRule
         * @instance
         */
        NetStateRule.prototype.stage = $util.emptyArray;

        /**
         * NetStateRule notStage.
         * @member {Array.<string>}notStage
         * @memberof caffe.NetStateRule
         * @instance
         */
        NetStateRule.prototype.notStage = $util.emptyArray;

        /**
         * Creates a new NetStateRule instance using the specified properties.
         * @function create
         * @memberof caffe.NetStateRule
         * @static
         * @param {caffe.INetStateRule=} [properties] Properties to set
         * @returns {caffe.NetStateRule} NetStateRule instance
         */
        NetStateRule.create = function create(properties) {
            return new NetStateRule(properties);
        };

        /**
         * Encodes the specified NetStateRule message. Does not implicitly {@link caffe.NetStateRule.verify|verify} messages.
         * @function encode
         * @memberof caffe.NetStateRule
         * @static
         * @param {caffe.INetStateRule} message NetStateRule message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetStateRule.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.phase != null && message.hasOwnProperty("phase"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.phase);
            if (message.minLevel != null && message.hasOwnProperty("minLevel"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.minLevel);
            if (message.maxLevel != null && message.hasOwnProperty("maxLevel"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.maxLevel);
            if (message.stage != null && message.stage.length)
                for (var i = 0; i < message.stage.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.stage[i]);
            if (message.notStage != null && message.notStage.length)
                for (var i = 0; i < message.notStage.length; ++i)
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.notStage[i]);
            return writer;
        };

        /**
         * Encodes the specified NetStateRule message, length delimited. Does not implicitly {@link caffe.NetStateRule.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.NetStateRule
         * @static
         * @param {caffe.INetStateRule} message NetStateRule message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetStateRule.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NetStateRule message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.NetStateRule
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.NetStateRule} NetStateRule
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetStateRule.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.NetStateRule();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.phase = reader.int32();
                    break;
                case 2:
                    message.minLevel = reader.int32();
                    break;
                case 3:
                    message.maxLevel = reader.int32();
                    break;
                case 4:
                    if (!(message.stage && message.stage.length))
                        message.stage = [];
                    message.stage.push(reader.string());
                    break;
                case 5:
                    if (!(message.notStage && message.notStage.length))
                        message.notStage = [];
                    message.notStage.push(reader.string());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a NetStateRule message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.NetStateRule
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.NetStateRule} NetStateRule
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetStateRule.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NetStateRule message.
         * @function verify
         * @memberof caffe.NetStateRule
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NetStateRule.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.phase != null && message.hasOwnProperty("phase"))
                switch (message.phase) {
                default:
                    return "phase: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.minLevel != null && message.hasOwnProperty("minLevel"))
                if (!$util.isInteger(message.minLevel))
                    return "minLevel: integer expected";
            if (message.maxLevel != null && message.hasOwnProperty("maxLevel"))
                if (!$util.isInteger(message.maxLevel))
                    return "maxLevel: integer expected";
            if (message.stage != null && message.hasOwnProperty("stage")) {
                if (!Array.isArray(message.stage))
                    return "stage: array expected";
                for (var i = 0; i < message.stage.length; ++i)
                    if (!$util.isString(message.stage[i]))
                        return "stage: string[] expected";
            }
            if (message.notStage != null && message.hasOwnProperty("notStage")) {
                if (!Array.isArray(message.notStage))
                    return "notStage: array expected";
                for (var i = 0; i < message.notStage.length; ++i)
                    if (!$util.isString(message.notStage[i]))
                        return "notStage: string[] expected";
            }
            return null;
        };

        /**
         * Creates a NetStateRule message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.NetStateRule
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.NetStateRule} NetStateRule
         */
        NetStateRule.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.NetStateRule)
                return object;
            var message = new $root.caffe.NetStateRule();
            switch (object.phase) {
            case "TRAIN":
            case 0:
                message.phase = 0;
                break;
            case "TEST":
            case 1:
                message.phase = 1;
                break;
            }
            if (object.minLevel != null)
                message.minLevel = object.minLevel | 0;
            if (object.maxLevel != null)
                message.maxLevel = object.maxLevel | 0;
            if (object.stage) {
                if (!Array.isArray(object.stage))
                    throw TypeError(".caffe.NetStateRule.stage: array expected");
                message.stage = [];
                for (var i = 0; i < object.stage.length; ++i)
                    message.stage[i] = String(object.stage[i]);
            }
            if (object.notStage) {
                if (!Array.isArray(object.notStage))
                    throw TypeError(".caffe.NetStateRule.notStage: array expected");
                message.notStage = [];
                for (var i = 0; i < object.notStage.length; ++i)
                    message.notStage[i] = String(object.notStage[i]);
            }
            return message;
        };

        /**
         * Creates a plain object from a NetStateRule message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.NetStateRule
         * @static
         * @param {caffe.NetStateRule} message NetStateRule
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NetStateRule.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.stage = [];
                object.notStage = [];
            }
            if (options.defaults) {
                object.phase = options.enums === String ? "TRAIN" : 0;
                object.minLevel = 0;
                object.maxLevel = 0;
            }
            if (message.phase != null && message.hasOwnProperty("phase"))
                object.phase = options.enums === String ? $root.caffe.Phase[message.phase] : message.phase;
            if (message.minLevel != null && message.hasOwnProperty("minLevel"))
                object.minLevel = message.minLevel;
            if (message.maxLevel != null && message.hasOwnProperty("maxLevel"))
                object.maxLevel = message.maxLevel;
            if (message.stage && message.stage.length) {
                object.stage = [];
                for (var j = 0; j < message.stage.length; ++j)
                    object.stage[j] = message.stage[j];
            }
            if (message.notStage && message.notStage.length) {
                object.notStage = [];
                for (var j = 0; j < message.notStage.length; ++j)
                    object.notStage[j] = message.notStage[j];
            }
            return object;
        };

        /**
         * Converts this NetStateRule to JSON.
         * @function toJSON
         * @memberof caffe.NetStateRule
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NetStateRule.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NetStateRule;
    })();

    caffe.ParamSpec = (function() {

        /**
         * Properties of a ParamSpec.
         * @memberof caffe
         * @interface IParamSpec
         * @property {string} [name] ParamSpec name
         * @property {caffe.ParamSpec.DimCheckMode} [shareMode] ParamSpec shareMode
         * @property {number} [lrMult] ParamSpec lrMult
         * @property {number} [decayMult] ParamSpec decayMult
         */

        /**
         * Constructs a new ParamSpec.
         * @memberof caffe
         * @classdesc Represents a ParamSpec.
         * @constructor
         * @param {caffe.IParamSpec=} [properties] Properties to set
         */
        function ParamSpec(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ParamSpec name.
         * @member {string}name
         * @memberof caffe.ParamSpec
         * @instance
         */
        ParamSpec.prototype.name = "";

        /**
         * ParamSpec shareMode.
         * @member {caffe.ParamSpec.DimCheckMode}shareMode
         * @memberof caffe.ParamSpec
         * @instance
         */
        ParamSpec.prototype.shareMode = 0;

        /**
         * ParamSpec lrMult.
         * @member {number}lrMult
         * @memberof caffe.ParamSpec
         * @instance
         */
        ParamSpec.prototype.lrMult = 1;

        /**
         * ParamSpec decayMult.
         * @member {number}decayMult
         * @memberof caffe.ParamSpec
         * @instance
         */
        ParamSpec.prototype.decayMult = 1;

        /**
         * Creates a new ParamSpec instance using the specified properties.
         * @function create
         * @memberof caffe.ParamSpec
         * @static
         * @param {caffe.IParamSpec=} [properties] Properties to set
         * @returns {caffe.ParamSpec} ParamSpec instance
         */
        ParamSpec.create = function create(properties) {
            return new ParamSpec(properties);
        };

        /**
         * Encodes the specified ParamSpec message. Does not implicitly {@link caffe.ParamSpec.verify|verify} messages.
         * @function encode
         * @memberof caffe.ParamSpec
         * @static
         * @param {caffe.IParamSpec} message ParamSpec message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ParamSpec.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.shareMode != null && message.hasOwnProperty("shareMode"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.shareMode);
            if (message.lrMult != null && message.hasOwnProperty("lrMult"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.lrMult);
            if (message.decayMult != null && message.hasOwnProperty("decayMult"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.decayMult);
            return writer;
        };

        /**
         * Encodes the specified ParamSpec message, length delimited. Does not implicitly {@link caffe.ParamSpec.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ParamSpec
         * @static
         * @param {caffe.IParamSpec} message ParamSpec message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ParamSpec.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ParamSpec message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ParamSpec
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ParamSpec} ParamSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ParamSpec.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ParamSpec();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.shareMode = reader.int32();
                    break;
                case 3:
                    message.lrMult = reader.float();
                    break;
                case 4:
                    message.decayMult = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ParamSpec message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ParamSpec
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ParamSpec} ParamSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ParamSpec.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ParamSpec message.
         * @function verify
         * @memberof caffe.ParamSpec
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ParamSpec.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.shareMode != null && message.hasOwnProperty("shareMode"))
                switch (message.shareMode) {
                default:
                    return "shareMode: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.lrMult != null && message.hasOwnProperty("lrMult"))
                if (typeof message.lrMult !== "number")
                    return "lrMult: number expected";
            if (message.decayMult != null && message.hasOwnProperty("decayMult"))
                if (typeof message.decayMult !== "number")
                    return "decayMult: number expected";
            return null;
        };

        /**
         * Creates a ParamSpec message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ParamSpec
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ParamSpec} ParamSpec
         */
        ParamSpec.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ParamSpec)
                return object;
            var message = new $root.caffe.ParamSpec();
            if (object.name != null)
                message.name = String(object.name);
            switch (object.shareMode) {
            case "STRICT":
            case 0:
                message.shareMode = 0;
                break;
            case "PERMISSIVE":
            case 1:
                message.shareMode = 1;
                break;
            }
            if (object.lrMult != null)
                message.lrMult = Number(object.lrMult);
            if (object.decayMult != null)
                message.decayMult = Number(object.decayMult);
            return message;
        };

        /**
         * Creates a plain object from a ParamSpec message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ParamSpec
         * @static
         * @param {caffe.ParamSpec} message ParamSpec
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ParamSpec.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.name = "";
                object.shareMode = options.enums === String ? "STRICT" : 0;
                object.lrMult = 1;
                object.decayMult = 1;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.shareMode != null && message.hasOwnProperty("shareMode"))
                object.shareMode = options.enums === String ? $root.caffe.ParamSpec.DimCheckMode[message.shareMode] : message.shareMode;
            if (message.lrMult != null && message.hasOwnProperty("lrMult"))
                object.lrMult = options.json && !isFinite(message.lrMult) ? String(message.lrMult) : message.lrMult;
            if (message.decayMult != null && message.hasOwnProperty("decayMult"))
                object.decayMult = options.json && !isFinite(message.decayMult) ? String(message.decayMult) : message.decayMult;
            return object;
        };

        /**
         * Converts this ParamSpec to JSON.
         * @function toJSON
         * @memberof caffe.ParamSpec
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ParamSpec.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * DimCheckMode enum.
         * @enum {string}
         * @property {number} STRICT=0 STRICT value
         * @property {number} PERMISSIVE=1 PERMISSIVE value
         */
        ParamSpec.DimCheckMode = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "STRICT"] = 0;
            values[valuesById[1] = "PERMISSIVE"] = 1;
            return values;
        })();

        return ParamSpec;
    })();

    caffe.LayerParameter = (function() {

        /**
         * Properties of a LayerParameter.
         * @memberof caffe
         * @interface ILayerParameter
         * @property {string} [name] LayerParameter name
         * @property {string} [type] LayerParameter type
         * @property {Array.<string>} [bottom] LayerParameter bottom
         * @property {Array.<string>} [top] LayerParameter top
         * @property {caffe.Phase} [phase] LayerParameter phase
         * @property {Array.<number>} [lossWeight] LayerParameter lossWeight
         * @property {Array.<caffe.IParamSpec>} [param] LayerParameter param
         * @property {Array.<caffe.IBlobProto>} [blobs] LayerParameter blobs
         * @property {Array.<boolean>} [propagateDown] LayerParameter propagateDown
         * @property {Array.<caffe.INetStateRule>} [include] LayerParameter include
         * @property {Array.<caffe.INetStateRule>} [exclude] LayerParameter exclude
         * @property {caffe.ITransformationParameter} [transformParam] LayerParameter transformParam
         * @property {caffe.ILossParameter} [lossParam] LayerParameter lossParam
         * @property {caffe.IAccuracyParameter} [accuracyParam] LayerParameter accuracyParam
         * @property {caffe.IArgMaxParameter} [argmaxParam] LayerParameter argmaxParam
         * @property {caffe.IBatchNormParameter} [batchNormParam] LayerParameter batchNormParam
         * @property {caffe.IBiasParameter} [biasParam] LayerParameter biasParam
         * @property {caffe.IConcatParameter} [concatParam] LayerParameter concatParam
         * @property {caffe.IContrastiveLossParameter} [contrastiveLossParam] LayerParameter contrastiveLossParam
         * @property {caffe.IConvolutionParameter} [convolutionParam] LayerParameter convolutionParam
         * @property {caffe.ICropParameter} [cropParam] LayerParameter cropParam
         * @property {caffe.IDataParameter} [dataParam] LayerParameter dataParam
         * @property {caffe.IDropoutParameter} [dropoutParam] LayerParameter dropoutParam
         * @property {caffe.IDummyDataParameter} [dummyDataParam] LayerParameter dummyDataParam
         * @property {caffe.IEltwiseParameter} [eltwiseParam] LayerParameter eltwiseParam
         * @property {caffe.IELUParameter} [eluParam] LayerParameter eluParam
         * @property {caffe.IEmbedParameter} [embedParam] LayerParameter embedParam
         * @property {caffe.IExpParameter} [expParam] LayerParameter expParam
         * @property {caffe.IFlattenParameter} [flattenParam] LayerParameter flattenParam
         * @property {caffe.IHDF5DataParameter} [hdf5DataParam] LayerParameter hdf5DataParam
         * @property {caffe.IHDF5OutputParameter} [hdf5OutputParam] LayerParameter hdf5OutputParam
         * @property {caffe.IHingeLossParameter} [hingeLossParam] LayerParameter hingeLossParam
         * @property {caffe.IImageDataParameter} [imageDataParam] LayerParameter imageDataParam
         * @property {caffe.IInfogainLossParameter} [infogainLossParam] LayerParameter infogainLossParam
         * @property {caffe.IInnerProductParameter} [innerProductParam] LayerParameter innerProductParam
         * @property {caffe.IInputParameter} [inputParam] LayerParameter inputParam
         * @property {caffe.ILogParameter} [logParam] LayerParameter logParam
         * @property {caffe.ILRNParameter} [lrnParam] LayerParameter lrnParam
         * @property {caffe.IMemoryDataParameter} [memoryDataParam] LayerParameter memoryDataParam
         * @property {caffe.IMVNParameter} [mvnParam] LayerParameter mvnParam
         * @property {caffe.IParameterParameter} [parameterParam] LayerParameter parameterParam
         * @property {caffe.IPoolingParameter} [poolingParam] LayerParameter poolingParam
         * @property {caffe.IPowerParameter} [powerParam] LayerParameter powerParam
         * @property {caffe.IPReLUParameter} [preluParam] LayerParameter preluParam
         * @property {caffe.IPythonParameter} [pythonParam] LayerParameter pythonParam
         * @property {caffe.IRecurrentParameter} [recurrentParam] LayerParameter recurrentParam
         * @property {caffe.IReductionParameter} [reductionParam] LayerParameter reductionParam
         * @property {caffe.IReLUParameter} [reluParam] LayerParameter reluParam
         * @property {caffe.IReshapeParameter} [reshapeParam] LayerParameter reshapeParam
         * @property {caffe.IScaleParameter} [scaleParam] LayerParameter scaleParam
         * @property {caffe.ISigmoidParameter} [sigmoidParam] LayerParameter sigmoidParam
         * @property {caffe.ISoftmaxParameter} [softmaxParam] LayerParameter softmaxParam
         * @property {caffe.ISPPParameter} [sppParam] LayerParameter sppParam
         * @property {caffe.ISliceParameter} [sliceParam] LayerParameter sliceParam
         * @property {caffe.ITanHParameter} [tanhParam] LayerParameter tanhParam
         * @property {caffe.IThresholdParameter} [thresholdParam] LayerParameter thresholdParam
         * @property {caffe.ITileParameter} [tileParam] LayerParameter tileParam
         * @property {caffe.IWindowDataParameter} [windowDataParam] LayerParameter windowDataParam
         */

        /**
         * Constructs a new LayerParameter.
         * @memberof caffe
         * @classdesc Represents a LayerParameter.
         * @constructor
         * @param {caffe.ILayerParameter=} [properties] Properties to set
         */
        function LayerParameter(properties) {
            this.bottom = [];
            this.top = [];
            this.lossWeight = [];
            this.param = [];
            this.blobs = [];
            this.propagateDown = [];
            this.include = [];
            this.exclude = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LayerParameter name.
         * @member {string}name
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.name = "";

        /**
         * LayerParameter type.
         * @member {string}type
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.type = "";

        /**
         * LayerParameter bottom.
         * @member {Array.<string>}bottom
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.bottom = $util.emptyArray;

        /**
         * LayerParameter top.
         * @member {Array.<string>}top
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.top = $util.emptyArray;

        /**
         * LayerParameter phase.
         * @member {caffe.Phase}phase
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.phase = 0;

        /**
         * LayerParameter lossWeight.
         * @member {Array.<number>}lossWeight
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.lossWeight = $util.emptyArray;

        /**
         * LayerParameter param.
         * @member {Array.<caffe.IParamSpec>}param
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.param = $util.emptyArray;

        /**
         * LayerParameter blobs.
         * @member {Array.<caffe.IBlobProto>}blobs
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.blobs = $util.emptyArray;

        /**
         * LayerParameter propagateDown.
         * @member {Array.<boolean>}propagateDown
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.propagateDown = $util.emptyArray;

        /**
         * LayerParameter include.
         * @member {Array.<caffe.INetStateRule>}include
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.include = $util.emptyArray;

        /**
         * LayerParameter exclude.
         * @member {Array.<caffe.INetStateRule>}exclude
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.exclude = $util.emptyArray;

        /**
         * LayerParameter transformParam.
         * @member {(caffe.ITransformationParameter|null|undefined)}transformParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.transformParam = null;

        /**
         * LayerParameter lossParam.
         * @member {(caffe.ILossParameter|null|undefined)}lossParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.lossParam = null;

        /**
         * LayerParameter accuracyParam.
         * @member {(caffe.IAccuracyParameter|null|undefined)}accuracyParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.accuracyParam = null;

        /**
         * LayerParameter argmaxParam.
         * @member {(caffe.IArgMaxParameter|null|undefined)}argmaxParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.argmaxParam = null;

        /**
         * LayerParameter batchNormParam.
         * @member {(caffe.IBatchNormParameter|null|undefined)}batchNormParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.batchNormParam = null;

        /**
         * LayerParameter biasParam.
         * @member {(caffe.IBiasParameter|null|undefined)}biasParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.biasParam = null;

        /**
         * LayerParameter concatParam.
         * @member {(caffe.IConcatParameter|null|undefined)}concatParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.concatParam = null;

        /**
         * LayerParameter contrastiveLossParam.
         * @member {(caffe.IContrastiveLossParameter|null|undefined)}contrastiveLossParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.contrastiveLossParam = null;

        /**
         * LayerParameter convolutionParam.
         * @member {(caffe.IConvolutionParameter|null|undefined)}convolutionParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.convolutionParam = null;

        /**
         * LayerParameter cropParam.
         * @member {(caffe.ICropParameter|null|undefined)}cropParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.cropParam = null;

        /**
         * LayerParameter dataParam.
         * @member {(caffe.IDataParameter|null|undefined)}dataParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.dataParam = null;

        /**
         * LayerParameter dropoutParam.
         * @member {(caffe.IDropoutParameter|null|undefined)}dropoutParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.dropoutParam = null;

        /**
         * LayerParameter dummyDataParam.
         * @member {(caffe.IDummyDataParameter|null|undefined)}dummyDataParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.dummyDataParam = null;

        /**
         * LayerParameter eltwiseParam.
         * @member {(caffe.IEltwiseParameter|null|undefined)}eltwiseParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.eltwiseParam = null;

        /**
         * LayerParameter eluParam.
         * @member {(caffe.IELUParameter|null|undefined)}eluParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.eluParam = null;

        /**
         * LayerParameter embedParam.
         * @member {(caffe.IEmbedParameter|null|undefined)}embedParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.embedParam = null;

        /**
         * LayerParameter expParam.
         * @member {(caffe.IExpParameter|null|undefined)}expParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.expParam = null;

        /**
         * LayerParameter flattenParam.
         * @member {(caffe.IFlattenParameter|null|undefined)}flattenParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.flattenParam = null;

        /**
         * LayerParameter hdf5DataParam.
         * @member {(caffe.IHDF5DataParameter|null|undefined)}hdf5DataParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.hdf5DataParam = null;

        /**
         * LayerParameter hdf5OutputParam.
         * @member {(caffe.IHDF5OutputParameter|null|undefined)}hdf5OutputParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.hdf5OutputParam = null;

        /**
         * LayerParameter hingeLossParam.
         * @member {(caffe.IHingeLossParameter|null|undefined)}hingeLossParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.hingeLossParam = null;

        /**
         * LayerParameter imageDataParam.
         * @member {(caffe.IImageDataParameter|null|undefined)}imageDataParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.imageDataParam = null;

        /**
         * LayerParameter infogainLossParam.
         * @member {(caffe.IInfogainLossParameter|null|undefined)}infogainLossParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.infogainLossParam = null;

        /**
         * LayerParameter innerProductParam.
         * @member {(caffe.IInnerProductParameter|null|undefined)}innerProductParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.innerProductParam = null;

        /**
         * LayerParameter inputParam.
         * @member {(caffe.IInputParameter|null|undefined)}inputParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.inputParam = null;

        /**
         * LayerParameter logParam.
         * @member {(caffe.ILogParameter|null|undefined)}logParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.logParam = null;

        /**
         * LayerParameter lrnParam.
         * @member {(caffe.ILRNParameter|null|undefined)}lrnParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.lrnParam = null;

        /**
         * LayerParameter memoryDataParam.
         * @member {(caffe.IMemoryDataParameter|null|undefined)}memoryDataParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.memoryDataParam = null;

        /**
         * LayerParameter mvnParam.
         * @member {(caffe.IMVNParameter|null|undefined)}mvnParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.mvnParam = null;

        /**
         * LayerParameter parameterParam.
         * @member {(caffe.IParameterParameter|null|undefined)}parameterParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.parameterParam = null;

        /**
         * LayerParameter poolingParam.
         * @member {(caffe.IPoolingParameter|null|undefined)}poolingParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.poolingParam = null;

        /**
         * LayerParameter powerParam.
         * @member {(caffe.IPowerParameter|null|undefined)}powerParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.powerParam = null;

        /**
         * LayerParameter preluParam.
         * @member {(caffe.IPReLUParameter|null|undefined)}preluParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.preluParam = null;

        /**
         * LayerParameter pythonParam.
         * @member {(caffe.IPythonParameter|null|undefined)}pythonParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.pythonParam = null;

        /**
         * LayerParameter recurrentParam.
         * @member {(caffe.IRecurrentParameter|null|undefined)}recurrentParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.recurrentParam = null;

        /**
         * LayerParameter reductionParam.
         * @member {(caffe.IReductionParameter|null|undefined)}reductionParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.reductionParam = null;

        /**
         * LayerParameter reluParam.
         * @member {(caffe.IReLUParameter|null|undefined)}reluParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.reluParam = null;

        /**
         * LayerParameter reshapeParam.
         * @member {(caffe.IReshapeParameter|null|undefined)}reshapeParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.reshapeParam = null;

        /**
         * LayerParameter scaleParam.
         * @member {(caffe.IScaleParameter|null|undefined)}scaleParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.scaleParam = null;

        /**
         * LayerParameter sigmoidParam.
         * @member {(caffe.ISigmoidParameter|null|undefined)}sigmoidParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.sigmoidParam = null;

        /**
         * LayerParameter softmaxParam.
         * @member {(caffe.ISoftmaxParameter|null|undefined)}softmaxParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.softmaxParam = null;

        /**
         * LayerParameter sppParam.
         * @member {(caffe.ISPPParameter|null|undefined)}sppParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.sppParam = null;

        /**
         * LayerParameter sliceParam.
         * @member {(caffe.ISliceParameter|null|undefined)}sliceParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.sliceParam = null;

        /**
         * LayerParameter tanhParam.
         * @member {(caffe.ITanHParameter|null|undefined)}tanhParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.tanhParam = null;

        /**
         * LayerParameter thresholdParam.
         * @member {(caffe.IThresholdParameter|null|undefined)}thresholdParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.thresholdParam = null;

        /**
         * LayerParameter tileParam.
         * @member {(caffe.ITileParameter|null|undefined)}tileParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.tileParam = null;

        /**
         * LayerParameter windowDataParam.
         * @member {(caffe.IWindowDataParameter|null|undefined)}windowDataParam
         * @memberof caffe.LayerParameter
         * @instance
         */
        LayerParameter.prototype.windowDataParam = null;

        /**
         * Creates a new LayerParameter instance using the specified properties.
         * @function create
         * @memberof caffe.LayerParameter
         * @static
         * @param {caffe.ILayerParameter=} [properties] Properties to set
         * @returns {caffe.LayerParameter} LayerParameter instance
         */
        LayerParameter.create = function create(properties) {
            return new LayerParameter(properties);
        };

        /**
         * Encodes the specified LayerParameter message. Does not implicitly {@link caffe.LayerParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.LayerParameter
         * @static
         * @param {caffe.ILayerParameter} message LayerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LayerParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
            if (message.bottom != null && message.bottom.length)
                for (var i = 0; i < message.bottom.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.bottom[i]);
            if (message.top != null && message.top.length)
                for (var i = 0; i < message.top.length; ++i)
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.top[i]);
            if (message.lossWeight != null && message.lossWeight.length)
                for (var i = 0; i < message.lossWeight.length; ++i)
                    writer.uint32(/* id 5, wireType 5 =*/45).float(message.lossWeight[i]);
            if (message.param != null && message.param.length)
                for (var i = 0; i < message.param.length; ++i)
                    $root.caffe.ParamSpec.encode(message.param[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.blobs != null && message.blobs.length)
                for (var i = 0; i < message.blobs.length; ++i)
                    $root.caffe.BlobProto.encode(message.blobs[i], writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.include != null && message.include.length)
                for (var i = 0; i < message.include.length; ++i)
                    $root.caffe.NetStateRule.encode(message.include[i], writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.exclude != null && message.exclude.length)
                for (var i = 0; i < message.exclude.length; ++i)
                    $root.caffe.NetStateRule.encode(message.exclude[i], writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.phase != null && message.hasOwnProperty("phase"))
                writer.uint32(/* id 10, wireType 0 =*/80).int32(message.phase);
            if (message.propagateDown != null && message.propagateDown.length)
                for (var i = 0; i < message.propagateDown.length; ++i)
                    writer.uint32(/* id 11, wireType 0 =*/88).bool(message.propagateDown[i]);
            if (message.transformParam != null && message.hasOwnProperty("transformParam"))
                $root.caffe.TransformationParameter.encode(message.transformParam, writer.uint32(/* id 100, wireType 2 =*/802).fork()).ldelim();
            if (message.lossParam != null && message.hasOwnProperty("lossParam"))
                $root.caffe.LossParameter.encode(message.lossParam, writer.uint32(/* id 101, wireType 2 =*/810).fork()).ldelim();
            if (message.accuracyParam != null && message.hasOwnProperty("accuracyParam"))
                $root.caffe.AccuracyParameter.encode(message.accuracyParam, writer.uint32(/* id 102, wireType 2 =*/818).fork()).ldelim();
            if (message.argmaxParam != null && message.hasOwnProperty("argmaxParam"))
                $root.caffe.ArgMaxParameter.encode(message.argmaxParam, writer.uint32(/* id 103, wireType 2 =*/826).fork()).ldelim();
            if (message.concatParam != null && message.hasOwnProperty("concatParam"))
                $root.caffe.ConcatParameter.encode(message.concatParam, writer.uint32(/* id 104, wireType 2 =*/834).fork()).ldelim();
            if (message.contrastiveLossParam != null && message.hasOwnProperty("contrastiveLossParam"))
                $root.caffe.ContrastiveLossParameter.encode(message.contrastiveLossParam, writer.uint32(/* id 105, wireType 2 =*/842).fork()).ldelim();
            if (message.convolutionParam != null && message.hasOwnProperty("convolutionParam"))
                $root.caffe.ConvolutionParameter.encode(message.convolutionParam, writer.uint32(/* id 106, wireType 2 =*/850).fork()).ldelim();
            if (message.dataParam != null && message.hasOwnProperty("dataParam"))
                $root.caffe.DataParameter.encode(message.dataParam, writer.uint32(/* id 107, wireType 2 =*/858).fork()).ldelim();
            if (message.dropoutParam != null && message.hasOwnProperty("dropoutParam"))
                $root.caffe.DropoutParameter.encode(message.dropoutParam, writer.uint32(/* id 108, wireType 2 =*/866).fork()).ldelim();
            if (message.dummyDataParam != null && message.hasOwnProperty("dummyDataParam"))
                $root.caffe.DummyDataParameter.encode(message.dummyDataParam, writer.uint32(/* id 109, wireType 2 =*/874).fork()).ldelim();
            if (message.eltwiseParam != null && message.hasOwnProperty("eltwiseParam"))
                $root.caffe.EltwiseParameter.encode(message.eltwiseParam, writer.uint32(/* id 110, wireType 2 =*/882).fork()).ldelim();
            if (message.expParam != null && message.hasOwnProperty("expParam"))
                $root.caffe.ExpParameter.encode(message.expParam, writer.uint32(/* id 111, wireType 2 =*/890).fork()).ldelim();
            if (message.hdf5DataParam != null && message.hasOwnProperty("hdf5DataParam"))
                $root.caffe.HDF5DataParameter.encode(message.hdf5DataParam, writer.uint32(/* id 112, wireType 2 =*/898).fork()).ldelim();
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam"))
                $root.caffe.HDF5OutputParameter.encode(message.hdf5OutputParam, writer.uint32(/* id 113, wireType 2 =*/906).fork()).ldelim();
            if (message.hingeLossParam != null && message.hasOwnProperty("hingeLossParam"))
                $root.caffe.HingeLossParameter.encode(message.hingeLossParam, writer.uint32(/* id 114, wireType 2 =*/914).fork()).ldelim();
            if (message.imageDataParam != null && message.hasOwnProperty("imageDataParam"))
                $root.caffe.ImageDataParameter.encode(message.imageDataParam, writer.uint32(/* id 115, wireType 2 =*/922).fork()).ldelim();
            if (message.infogainLossParam != null && message.hasOwnProperty("infogainLossParam"))
                $root.caffe.InfogainLossParameter.encode(message.infogainLossParam, writer.uint32(/* id 116, wireType 2 =*/930).fork()).ldelim();
            if (message.innerProductParam != null && message.hasOwnProperty("innerProductParam"))
                $root.caffe.InnerProductParameter.encode(message.innerProductParam, writer.uint32(/* id 117, wireType 2 =*/938).fork()).ldelim();
            if (message.lrnParam != null && message.hasOwnProperty("lrnParam"))
                $root.caffe.LRNParameter.encode(message.lrnParam, writer.uint32(/* id 118, wireType 2 =*/946).fork()).ldelim();
            if (message.memoryDataParam != null && message.hasOwnProperty("memoryDataParam"))
                $root.caffe.MemoryDataParameter.encode(message.memoryDataParam, writer.uint32(/* id 119, wireType 2 =*/954).fork()).ldelim();
            if (message.mvnParam != null && message.hasOwnProperty("mvnParam"))
                $root.caffe.MVNParameter.encode(message.mvnParam, writer.uint32(/* id 120, wireType 2 =*/962).fork()).ldelim();
            if (message.poolingParam != null && message.hasOwnProperty("poolingParam"))
                $root.caffe.PoolingParameter.encode(message.poolingParam, writer.uint32(/* id 121, wireType 2 =*/970).fork()).ldelim();
            if (message.powerParam != null && message.hasOwnProperty("powerParam"))
                $root.caffe.PowerParameter.encode(message.powerParam, writer.uint32(/* id 122, wireType 2 =*/978).fork()).ldelim();
            if (message.reluParam != null && message.hasOwnProperty("reluParam"))
                $root.caffe.ReLUParameter.encode(message.reluParam, writer.uint32(/* id 123, wireType 2 =*/986).fork()).ldelim();
            if (message.sigmoidParam != null && message.hasOwnProperty("sigmoidParam"))
                $root.caffe.SigmoidParameter.encode(message.sigmoidParam, writer.uint32(/* id 124, wireType 2 =*/994).fork()).ldelim();
            if (message.softmaxParam != null && message.hasOwnProperty("softmaxParam"))
                $root.caffe.SoftmaxParameter.encode(message.softmaxParam, writer.uint32(/* id 125, wireType 2 =*/1002).fork()).ldelim();
            if (message.sliceParam != null && message.hasOwnProperty("sliceParam"))
                $root.caffe.SliceParameter.encode(message.sliceParam, writer.uint32(/* id 126, wireType 2 =*/1010).fork()).ldelim();
            if (message.tanhParam != null && message.hasOwnProperty("tanhParam"))
                $root.caffe.TanHParameter.encode(message.tanhParam, writer.uint32(/* id 127, wireType 2 =*/1018).fork()).ldelim();
            if (message.thresholdParam != null && message.hasOwnProperty("thresholdParam"))
                $root.caffe.ThresholdParameter.encode(message.thresholdParam, writer.uint32(/* id 128, wireType 2 =*/1026).fork()).ldelim();
            if (message.windowDataParam != null && message.hasOwnProperty("windowDataParam"))
                $root.caffe.WindowDataParameter.encode(message.windowDataParam, writer.uint32(/* id 129, wireType 2 =*/1034).fork()).ldelim();
            if (message.pythonParam != null && message.hasOwnProperty("pythonParam"))
                $root.caffe.PythonParameter.encode(message.pythonParam, writer.uint32(/* id 130, wireType 2 =*/1042).fork()).ldelim();
            if (message.preluParam != null && message.hasOwnProperty("preluParam"))
                $root.caffe.PReLUParameter.encode(message.preluParam, writer.uint32(/* id 131, wireType 2 =*/1050).fork()).ldelim();
            if (message.sppParam != null && message.hasOwnProperty("sppParam"))
                $root.caffe.SPPParameter.encode(message.sppParam, writer.uint32(/* id 132, wireType 2 =*/1058).fork()).ldelim();
            if (message.reshapeParam != null && message.hasOwnProperty("reshapeParam"))
                $root.caffe.ReshapeParameter.encode(message.reshapeParam, writer.uint32(/* id 133, wireType 2 =*/1066).fork()).ldelim();
            if (message.logParam != null && message.hasOwnProperty("logParam"))
                $root.caffe.LogParameter.encode(message.logParam, writer.uint32(/* id 134, wireType 2 =*/1074).fork()).ldelim();
            if (message.flattenParam != null && message.hasOwnProperty("flattenParam"))
                $root.caffe.FlattenParameter.encode(message.flattenParam, writer.uint32(/* id 135, wireType 2 =*/1082).fork()).ldelim();
            if (message.reductionParam != null && message.hasOwnProperty("reductionParam"))
                $root.caffe.ReductionParameter.encode(message.reductionParam, writer.uint32(/* id 136, wireType 2 =*/1090).fork()).ldelim();
            if (message.embedParam != null && message.hasOwnProperty("embedParam"))
                $root.caffe.EmbedParameter.encode(message.embedParam, writer.uint32(/* id 137, wireType 2 =*/1098).fork()).ldelim();
            if (message.tileParam != null && message.hasOwnProperty("tileParam"))
                $root.caffe.TileParameter.encode(message.tileParam, writer.uint32(/* id 138, wireType 2 =*/1106).fork()).ldelim();
            if (message.batchNormParam != null && message.hasOwnProperty("batchNormParam"))
                $root.caffe.BatchNormParameter.encode(message.batchNormParam, writer.uint32(/* id 139, wireType 2 =*/1114).fork()).ldelim();
            if (message.eluParam != null && message.hasOwnProperty("eluParam"))
                $root.caffe.ELUParameter.encode(message.eluParam, writer.uint32(/* id 140, wireType 2 =*/1122).fork()).ldelim();
            if (message.biasParam != null && message.hasOwnProperty("biasParam"))
                $root.caffe.BiasParameter.encode(message.biasParam, writer.uint32(/* id 141, wireType 2 =*/1130).fork()).ldelim();
            if (message.scaleParam != null && message.hasOwnProperty("scaleParam"))
                $root.caffe.ScaleParameter.encode(message.scaleParam, writer.uint32(/* id 142, wireType 2 =*/1138).fork()).ldelim();
            if (message.inputParam != null && message.hasOwnProperty("inputParam"))
                $root.caffe.InputParameter.encode(message.inputParam, writer.uint32(/* id 143, wireType 2 =*/1146).fork()).ldelim();
            if (message.cropParam != null && message.hasOwnProperty("cropParam"))
                $root.caffe.CropParameter.encode(message.cropParam, writer.uint32(/* id 144, wireType 2 =*/1154).fork()).ldelim();
            if (message.parameterParam != null && message.hasOwnProperty("parameterParam"))
                $root.caffe.ParameterParameter.encode(message.parameterParam, writer.uint32(/* id 145, wireType 2 =*/1162).fork()).ldelim();
            if (message.recurrentParam != null && message.hasOwnProperty("recurrentParam"))
                $root.caffe.RecurrentParameter.encode(message.recurrentParam, writer.uint32(/* id 146, wireType 2 =*/1170).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LayerParameter message, length delimited. Does not implicitly {@link caffe.LayerParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.LayerParameter
         * @static
         * @param {caffe.ILayerParameter} message LayerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LayerParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LayerParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.LayerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.LayerParameter} LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LayerParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.LayerParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.type = reader.string();
                    break;
                case 3:
                    if (!(message.bottom && message.bottom.length))
                        message.bottom = [];
                    message.bottom.push(reader.string());
                    break;
                case 4:
                    if (!(message.top && message.top.length))
                        message.top = [];
                    message.top.push(reader.string());
                    break;
                case 10:
                    message.phase = reader.int32();
                    break;
                case 5:
                    if (!(message.lossWeight && message.lossWeight.length))
                        message.lossWeight = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.lossWeight.push(reader.float());
                    } else
                        message.lossWeight.push(reader.float());
                    break;
                case 6:
                    if (!(message.param && message.param.length))
                        message.param = [];
                    message.param.push($root.caffe.ParamSpec.decode(reader, reader.uint32()));
                    break;
                case 7:
                    if (!(message.blobs && message.blobs.length))
                        message.blobs = [];
                    message.blobs.push($root.caffe.BlobProto.decode(reader, reader.uint32()));
                    break;
                case 11:
                    if (!(message.propagateDown && message.propagateDown.length))
                        message.propagateDown = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.propagateDown.push(reader.bool());
                    } else
                        message.propagateDown.push(reader.bool());
                    break;
                case 8:
                    if (!(message.include && message.include.length))
                        message.include = [];
                    message.include.push($root.caffe.NetStateRule.decode(reader, reader.uint32()));
                    break;
                case 9:
                    if (!(message.exclude && message.exclude.length))
                        message.exclude = [];
                    message.exclude.push($root.caffe.NetStateRule.decode(reader, reader.uint32()));
                    break;
                case 100:
                    message.transformParam = $root.caffe.TransformationParameter.decode(reader, reader.uint32());
                    break;
                case 101:
                    message.lossParam = $root.caffe.LossParameter.decode(reader, reader.uint32());
                    break;
                case 102:
                    message.accuracyParam = $root.caffe.AccuracyParameter.decode(reader, reader.uint32());
                    break;
                case 103:
                    message.argmaxParam = $root.caffe.ArgMaxParameter.decode(reader, reader.uint32());
                    break;
                case 139:
                    message.batchNormParam = $root.caffe.BatchNormParameter.decode(reader, reader.uint32());
                    break;
                case 141:
                    message.biasParam = $root.caffe.BiasParameter.decode(reader, reader.uint32());
                    break;
                case 104:
                    message.concatParam = $root.caffe.ConcatParameter.decode(reader, reader.uint32());
                    break;
                case 105:
                    message.contrastiveLossParam = $root.caffe.ContrastiveLossParameter.decode(reader, reader.uint32());
                    break;
                case 106:
                    message.convolutionParam = $root.caffe.ConvolutionParameter.decode(reader, reader.uint32());
                    break;
                case 144:
                    message.cropParam = $root.caffe.CropParameter.decode(reader, reader.uint32());
                    break;
                case 107:
                    message.dataParam = $root.caffe.DataParameter.decode(reader, reader.uint32());
                    break;
                case 108:
                    message.dropoutParam = $root.caffe.DropoutParameter.decode(reader, reader.uint32());
                    break;
                case 109:
                    message.dummyDataParam = $root.caffe.DummyDataParameter.decode(reader, reader.uint32());
                    break;
                case 110:
                    message.eltwiseParam = $root.caffe.EltwiseParameter.decode(reader, reader.uint32());
                    break;
                case 140:
                    message.eluParam = $root.caffe.ELUParameter.decode(reader, reader.uint32());
                    break;
                case 137:
                    message.embedParam = $root.caffe.EmbedParameter.decode(reader, reader.uint32());
                    break;
                case 111:
                    message.expParam = $root.caffe.ExpParameter.decode(reader, reader.uint32());
                    break;
                case 135:
                    message.flattenParam = $root.caffe.FlattenParameter.decode(reader, reader.uint32());
                    break;
                case 112:
                    message.hdf5DataParam = $root.caffe.HDF5DataParameter.decode(reader, reader.uint32());
                    break;
                case 113:
                    message.hdf5OutputParam = $root.caffe.HDF5OutputParameter.decode(reader, reader.uint32());
                    break;
                case 114:
                    message.hingeLossParam = $root.caffe.HingeLossParameter.decode(reader, reader.uint32());
                    break;
                case 115:
                    message.imageDataParam = $root.caffe.ImageDataParameter.decode(reader, reader.uint32());
                    break;
                case 116:
                    message.infogainLossParam = $root.caffe.InfogainLossParameter.decode(reader, reader.uint32());
                    break;
                case 117:
                    message.innerProductParam = $root.caffe.InnerProductParameter.decode(reader, reader.uint32());
                    break;
                case 143:
                    message.inputParam = $root.caffe.InputParameter.decode(reader, reader.uint32());
                    break;
                case 134:
                    message.logParam = $root.caffe.LogParameter.decode(reader, reader.uint32());
                    break;
                case 118:
                    message.lrnParam = $root.caffe.LRNParameter.decode(reader, reader.uint32());
                    break;
                case 119:
                    message.memoryDataParam = $root.caffe.MemoryDataParameter.decode(reader, reader.uint32());
                    break;
                case 120:
                    message.mvnParam = $root.caffe.MVNParameter.decode(reader, reader.uint32());
                    break;
                case 145:
                    message.parameterParam = $root.caffe.ParameterParameter.decode(reader, reader.uint32());
                    break;
                case 121:
                    message.poolingParam = $root.caffe.PoolingParameter.decode(reader, reader.uint32());
                    break;
                case 122:
                    message.powerParam = $root.caffe.PowerParameter.decode(reader, reader.uint32());
                    break;
                case 131:
                    message.preluParam = $root.caffe.PReLUParameter.decode(reader, reader.uint32());
                    break;
                case 130:
                    message.pythonParam = $root.caffe.PythonParameter.decode(reader, reader.uint32());
                    break;
                case 146:
                    message.recurrentParam = $root.caffe.RecurrentParameter.decode(reader, reader.uint32());
                    break;
                case 136:
                    message.reductionParam = $root.caffe.ReductionParameter.decode(reader, reader.uint32());
                    break;
                case 123:
                    message.reluParam = $root.caffe.ReLUParameter.decode(reader, reader.uint32());
                    break;
                case 133:
                    message.reshapeParam = $root.caffe.ReshapeParameter.decode(reader, reader.uint32());
                    break;
                case 142:
                    message.scaleParam = $root.caffe.ScaleParameter.decode(reader, reader.uint32());
                    break;
                case 124:
                    message.sigmoidParam = $root.caffe.SigmoidParameter.decode(reader, reader.uint32());
                    break;
                case 125:
                    message.softmaxParam = $root.caffe.SoftmaxParameter.decode(reader, reader.uint32());
                    break;
                case 132:
                    message.sppParam = $root.caffe.SPPParameter.decode(reader, reader.uint32());
                    break;
                case 126:
                    message.sliceParam = $root.caffe.SliceParameter.decode(reader, reader.uint32());
                    break;
                case 127:
                    message.tanhParam = $root.caffe.TanHParameter.decode(reader, reader.uint32());
                    break;
                case 128:
                    message.thresholdParam = $root.caffe.ThresholdParameter.decode(reader, reader.uint32());
                    break;
                case 138:
                    message.tileParam = $root.caffe.TileParameter.decode(reader, reader.uint32());
                    break;
                case 129:
                    message.windowDataParam = $root.caffe.WindowDataParameter.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LayerParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.LayerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.LayerParameter} LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LayerParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LayerParameter message.
         * @function verify
         * @memberof caffe.LayerParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LayerParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.bottom != null && message.hasOwnProperty("bottom")) {
                if (!Array.isArray(message.bottom))
                    return "bottom: array expected";
                for (var i = 0; i < message.bottom.length; ++i)
                    if (!$util.isString(message.bottom[i]))
                        return "bottom: string[] expected";
            }
            if (message.top != null && message.hasOwnProperty("top")) {
                if (!Array.isArray(message.top))
                    return "top: array expected";
                for (var i = 0; i < message.top.length; ++i)
                    if (!$util.isString(message.top[i]))
                        return "top: string[] expected";
            }
            if (message.phase != null && message.hasOwnProperty("phase"))
                switch (message.phase) {
                default:
                    return "phase: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.lossWeight != null && message.hasOwnProperty("lossWeight")) {
                if (!Array.isArray(message.lossWeight))
                    return "lossWeight: array expected";
                for (var i = 0; i < message.lossWeight.length; ++i)
                    if (typeof message.lossWeight[i] !== "number")
                        return "lossWeight: number[] expected";
            }
            if (message.param != null && message.hasOwnProperty("param")) {
                if (!Array.isArray(message.param))
                    return "param: array expected";
                for (var i = 0; i < message.param.length; ++i) {
                    var error = $root.caffe.ParamSpec.verify(message.param[i]);
                    if (error)
                        return "param." + error;
                }
            }
            if (message.blobs != null && message.hasOwnProperty("blobs")) {
                if (!Array.isArray(message.blobs))
                    return "blobs: array expected";
                for (var i = 0; i < message.blobs.length; ++i) {
                    error = $root.caffe.BlobProto.verify(message.blobs[i]);
                    if (error)
                        return "blobs." + error;
                }
            }
            if (message.propagateDown != null && message.hasOwnProperty("propagateDown")) {
                if (!Array.isArray(message.propagateDown))
                    return "propagateDown: array expected";
                for (var i = 0; i < message.propagateDown.length; ++i)
                    if (typeof message.propagateDown[i] !== "boolean")
                        return "propagateDown: boolean[] expected";
            }
            if (message.include != null && message.hasOwnProperty("include")) {
                if (!Array.isArray(message.include))
                    return "include: array expected";
                for (var i = 0; i < message.include.length; ++i) {
                    error = $root.caffe.NetStateRule.verify(message.include[i]);
                    if (error)
                        return "include." + error;
                }
            }
            if (message.exclude != null && message.hasOwnProperty("exclude")) {
                if (!Array.isArray(message.exclude))
                    return "exclude: array expected";
                for (var i = 0; i < message.exclude.length; ++i) {
                    error = $root.caffe.NetStateRule.verify(message.exclude[i]);
                    if (error)
                        return "exclude." + error;
                }
            }
            if (message.transformParam != null && message.hasOwnProperty("transformParam")) {
                error = $root.caffe.TransformationParameter.verify(message.transformParam);
                if (error)
                    return "transformParam." + error;
            }
            if (message.lossParam != null && message.hasOwnProperty("lossParam")) {
                error = $root.caffe.LossParameter.verify(message.lossParam);
                if (error)
                    return "lossParam." + error;
            }
            if (message.accuracyParam != null && message.hasOwnProperty("accuracyParam")) {
                error = $root.caffe.AccuracyParameter.verify(message.accuracyParam);
                if (error)
                    return "accuracyParam." + error;
            }
            if (message.argmaxParam != null && message.hasOwnProperty("argmaxParam")) {
                error = $root.caffe.ArgMaxParameter.verify(message.argmaxParam);
                if (error)
                    return "argmaxParam." + error;
            }
            if (message.batchNormParam != null && message.hasOwnProperty("batchNormParam")) {
                error = $root.caffe.BatchNormParameter.verify(message.batchNormParam);
                if (error)
                    return "batchNormParam." + error;
            }
            if (message.biasParam != null && message.hasOwnProperty("biasParam")) {
                error = $root.caffe.BiasParameter.verify(message.biasParam);
                if (error)
                    return "biasParam." + error;
            }
            if (message.concatParam != null && message.hasOwnProperty("concatParam")) {
                error = $root.caffe.ConcatParameter.verify(message.concatParam);
                if (error)
                    return "concatParam." + error;
            }
            if (message.contrastiveLossParam != null && message.hasOwnProperty("contrastiveLossParam")) {
                error = $root.caffe.ContrastiveLossParameter.verify(message.contrastiveLossParam);
                if (error)
                    return "contrastiveLossParam." + error;
            }
            if (message.convolutionParam != null && message.hasOwnProperty("convolutionParam")) {
                error = $root.caffe.ConvolutionParameter.verify(message.convolutionParam);
                if (error)
                    return "convolutionParam." + error;
            }
            if (message.cropParam != null && message.hasOwnProperty("cropParam")) {
                error = $root.caffe.CropParameter.verify(message.cropParam);
                if (error)
                    return "cropParam." + error;
            }
            if (message.dataParam != null && message.hasOwnProperty("dataParam")) {
                error = $root.caffe.DataParameter.verify(message.dataParam);
                if (error)
                    return "dataParam." + error;
            }
            if (message.dropoutParam != null && message.hasOwnProperty("dropoutParam")) {
                error = $root.caffe.DropoutParameter.verify(message.dropoutParam);
                if (error)
                    return "dropoutParam." + error;
            }
            if (message.dummyDataParam != null && message.hasOwnProperty("dummyDataParam")) {
                error = $root.caffe.DummyDataParameter.verify(message.dummyDataParam);
                if (error)
                    return "dummyDataParam." + error;
            }
            if (message.eltwiseParam != null && message.hasOwnProperty("eltwiseParam")) {
                error = $root.caffe.EltwiseParameter.verify(message.eltwiseParam);
                if (error)
                    return "eltwiseParam." + error;
            }
            if (message.eluParam != null && message.hasOwnProperty("eluParam")) {
                error = $root.caffe.ELUParameter.verify(message.eluParam);
                if (error)
                    return "eluParam." + error;
            }
            if (message.embedParam != null && message.hasOwnProperty("embedParam")) {
                error = $root.caffe.EmbedParameter.verify(message.embedParam);
                if (error)
                    return "embedParam." + error;
            }
            if (message.expParam != null && message.hasOwnProperty("expParam")) {
                error = $root.caffe.ExpParameter.verify(message.expParam);
                if (error)
                    return "expParam." + error;
            }
            if (message.flattenParam != null && message.hasOwnProperty("flattenParam")) {
                error = $root.caffe.FlattenParameter.verify(message.flattenParam);
                if (error)
                    return "flattenParam." + error;
            }
            if (message.hdf5DataParam != null && message.hasOwnProperty("hdf5DataParam")) {
                error = $root.caffe.HDF5DataParameter.verify(message.hdf5DataParam);
                if (error)
                    return "hdf5DataParam." + error;
            }
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam")) {
                error = $root.caffe.HDF5OutputParameter.verify(message.hdf5OutputParam);
                if (error)
                    return "hdf5OutputParam." + error;
            }
            if (message.hingeLossParam != null && message.hasOwnProperty("hingeLossParam")) {
                error = $root.caffe.HingeLossParameter.verify(message.hingeLossParam);
                if (error)
                    return "hingeLossParam." + error;
            }
            if (message.imageDataParam != null && message.hasOwnProperty("imageDataParam")) {
                error = $root.caffe.ImageDataParameter.verify(message.imageDataParam);
                if (error)
                    return "imageDataParam." + error;
            }
            if (message.infogainLossParam != null && message.hasOwnProperty("infogainLossParam")) {
                error = $root.caffe.InfogainLossParameter.verify(message.infogainLossParam);
                if (error)
                    return "infogainLossParam." + error;
            }
            if (message.innerProductParam != null && message.hasOwnProperty("innerProductParam")) {
                error = $root.caffe.InnerProductParameter.verify(message.innerProductParam);
                if (error)
                    return "innerProductParam." + error;
            }
            if (message.inputParam != null && message.hasOwnProperty("inputParam")) {
                error = $root.caffe.InputParameter.verify(message.inputParam);
                if (error)
                    return "inputParam." + error;
            }
            if (message.logParam != null && message.hasOwnProperty("logParam")) {
                error = $root.caffe.LogParameter.verify(message.logParam);
                if (error)
                    return "logParam." + error;
            }
            if (message.lrnParam != null && message.hasOwnProperty("lrnParam")) {
                error = $root.caffe.LRNParameter.verify(message.lrnParam);
                if (error)
                    return "lrnParam." + error;
            }
            if (message.memoryDataParam != null && message.hasOwnProperty("memoryDataParam")) {
                error = $root.caffe.MemoryDataParameter.verify(message.memoryDataParam);
                if (error)
                    return "memoryDataParam." + error;
            }
            if (message.mvnParam != null && message.hasOwnProperty("mvnParam")) {
                error = $root.caffe.MVNParameter.verify(message.mvnParam);
                if (error)
                    return "mvnParam." + error;
            }
            if (message.parameterParam != null && message.hasOwnProperty("parameterParam")) {
                error = $root.caffe.ParameterParameter.verify(message.parameterParam);
                if (error)
                    return "parameterParam." + error;
            }
            if (message.poolingParam != null && message.hasOwnProperty("poolingParam")) {
                error = $root.caffe.PoolingParameter.verify(message.poolingParam);
                if (error)
                    return "poolingParam." + error;
            }
            if (message.powerParam != null && message.hasOwnProperty("powerParam")) {
                error = $root.caffe.PowerParameter.verify(message.powerParam);
                if (error)
                    return "powerParam." + error;
            }
            if (message.preluParam != null && message.hasOwnProperty("preluParam")) {
                error = $root.caffe.PReLUParameter.verify(message.preluParam);
                if (error)
                    return "preluParam." + error;
            }
            if (message.pythonParam != null && message.hasOwnProperty("pythonParam")) {
                error = $root.caffe.PythonParameter.verify(message.pythonParam);
                if (error)
                    return "pythonParam." + error;
            }
            if (message.recurrentParam != null && message.hasOwnProperty("recurrentParam")) {
                error = $root.caffe.RecurrentParameter.verify(message.recurrentParam);
                if (error)
                    return "recurrentParam." + error;
            }
            if (message.reductionParam != null && message.hasOwnProperty("reductionParam")) {
                error = $root.caffe.ReductionParameter.verify(message.reductionParam);
                if (error)
                    return "reductionParam." + error;
            }
            if (message.reluParam != null && message.hasOwnProperty("reluParam")) {
                error = $root.caffe.ReLUParameter.verify(message.reluParam);
                if (error)
                    return "reluParam." + error;
            }
            if (message.reshapeParam != null && message.hasOwnProperty("reshapeParam")) {
                error = $root.caffe.ReshapeParameter.verify(message.reshapeParam);
                if (error)
                    return "reshapeParam." + error;
            }
            if (message.scaleParam != null && message.hasOwnProperty("scaleParam")) {
                error = $root.caffe.ScaleParameter.verify(message.scaleParam);
                if (error)
                    return "scaleParam." + error;
            }
            if (message.sigmoidParam != null && message.hasOwnProperty("sigmoidParam")) {
                error = $root.caffe.SigmoidParameter.verify(message.sigmoidParam);
                if (error)
                    return "sigmoidParam." + error;
            }
            if (message.softmaxParam != null && message.hasOwnProperty("softmaxParam")) {
                error = $root.caffe.SoftmaxParameter.verify(message.softmaxParam);
                if (error)
                    return "softmaxParam." + error;
            }
            if (message.sppParam != null && message.hasOwnProperty("sppParam")) {
                error = $root.caffe.SPPParameter.verify(message.sppParam);
                if (error)
                    return "sppParam." + error;
            }
            if (message.sliceParam != null && message.hasOwnProperty("sliceParam")) {
                error = $root.caffe.SliceParameter.verify(message.sliceParam);
                if (error)
                    return "sliceParam." + error;
            }
            if (message.tanhParam != null && message.hasOwnProperty("tanhParam")) {
                error = $root.caffe.TanHParameter.verify(message.tanhParam);
                if (error)
                    return "tanhParam." + error;
            }
            if (message.thresholdParam != null && message.hasOwnProperty("thresholdParam")) {
                error = $root.caffe.ThresholdParameter.verify(message.thresholdParam);
                if (error)
                    return "thresholdParam." + error;
            }
            if (message.tileParam != null && message.hasOwnProperty("tileParam")) {
                error = $root.caffe.TileParameter.verify(message.tileParam);
                if (error)
                    return "tileParam." + error;
            }
            if (message.windowDataParam != null && message.hasOwnProperty("windowDataParam")) {
                error = $root.caffe.WindowDataParameter.verify(message.windowDataParam);
                if (error)
                    return "windowDataParam." + error;
            }
            return null;
        };

        /**
         * Creates a LayerParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.LayerParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.LayerParameter} LayerParameter
         */
        LayerParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.LayerParameter)
                return object;
            var message = new $root.caffe.LayerParameter();
            if (object.name != null)
                message.name = String(object.name);
            if (object.type != null)
                message.type = String(object.type);
            if (object.bottom) {
                if (!Array.isArray(object.bottom))
                    throw TypeError(".caffe.LayerParameter.bottom: array expected");
                message.bottom = [];
                for (var i = 0; i < object.bottom.length; ++i)
                    message.bottom[i] = String(object.bottom[i]);
            }
            if (object.top) {
                if (!Array.isArray(object.top))
                    throw TypeError(".caffe.LayerParameter.top: array expected");
                message.top = [];
                for (var i = 0; i < object.top.length; ++i)
                    message.top[i] = String(object.top[i]);
            }
            switch (object.phase) {
            case "TRAIN":
            case 0:
                message.phase = 0;
                break;
            case "TEST":
            case 1:
                message.phase = 1;
                break;
            }
            if (object.lossWeight) {
                if (!Array.isArray(object.lossWeight))
                    throw TypeError(".caffe.LayerParameter.lossWeight: array expected");
                message.lossWeight = [];
                for (var i = 0; i < object.lossWeight.length; ++i)
                    message.lossWeight[i] = Number(object.lossWeight[i]);
            }
            if (object.param) {
                if (!Array.isArray(object.param))
                    throw TypeError(".caffe.LayerParameter.param: array expected");
                message.param = [];
                for (var i = 0; i < object.param.length; ++i) {
                    if (typeof object.param[i] !== "object")
                        throw TypeError(".caffe.LayerParameter.param: object expected");
                    message.param[i] = $root.caffe.ParamSpec.fromObject(object.param[i]);
                }
            }
            if (object.blobs) {
                if (!Array.isArray(object.blobs))
                    throw TypeError(".caffe.LayerParameter.blobs: array expected");
                message.blobs = [];
                for (var i = 0; i < object.blobs.length; ++i) {
                    if (typeof object.blobs[i] !== "object")
                        throw TypeError(".caffe.LayerParameter.blobs: object expected");
                    message.blobs[i] = $root.caffe.BlobProto.fromObject(object.blobs[i]);
                }
            }
            if (object.propagateDown) {
                if (!Array.isArray(object.propagateDown))
                    throw TypeError(".caffe.LayerParameter.propagateDown: array expected");
                message.propagateDown = [];
                for (var i = 0; i < object.propagateDown.length; ++i)
                    message.propagateDown[i] = Boolean(object.propagateDown[i]);
            }
            if (object.include) {
                if (!Array.isArray(object.include))
                    throw TypeError(".caffe.LayerParameter.include: array expected");
                message.include = [];
                for (var i = 0; i < object.include.length; ++i) {
                    if (typeof object.include[i] !== "object")
                        throw TypeError(".caffe.LayerParameter.include: object expected");
                    message.include[i] = $root.caffe.NetStateRule.fromObject(object.include[i]);
                }
            }
            if (object.exclude) {
                if (!Array.isArray(object.exclude))
                    throw TypeError(".caffe.LayerParameter.exclude: array expected");
                message.exclude = [];
                for (var i = 0; i < object.exclude.length; ++i) {
                    if (typeof object.exclude[i] !== "object")
                        throw TypeError(".caffe.LayerParameter.exclude: object expected");
                    message.exclude[i] = $root.caffe.NetStateRule.fromObject(object.exclude[i]);
                }
            }
            if (object.transformParam != null) {
                if (typeof object.transformParam !== "object")
                    throw TypeError(".caffe.LayerParameter.transformParam: object expected");
                message.transformParam = $root.caffe.TransformationParameter.fromObject(object.transformParam);
            }
            if (object.lossParam != null) {
                if (typeof object.lossParam !== "object")
                    throw TypeError(".caffe.LayerParameter.lossParam: object expected");
                message.lossParam = $root.caffe.LossParameter.fromObject(object.lossParam);
            }
            if (object.accuracyParam != null) {
                if (typeof object.accuracyParam !== "object")
                    throw TypeError(".caffe.LayerParameter.accuracyParam: object expected");
                message.accuracyParam = $root.caffe.AccuracyParameter.fromObject(object.accuracyParam);
            }
            if (object.argmaxParam != null) {
                if (typeof object.argmaxParam !== "object")
                    throw TypeError(".caffe.LayerParameter.argmaxParam: object expected");
                message.argmaxParam = $root.caffe.ArgMaxParameter.fromObject(object.argmaxParam);
            }
            if (object.batchNormParam != null) {
                if (typeof object.batchNormParam !== "object")
                    throw TypeError(".caffe.LayerParameter.batchNormParam: object expected");
                message.batchNormParam = $root.caffe.BatchNormParameter.fromObject(object.batchNormParam);
            }
            if (object.biasParam != null) {
                if (typeof object.biasParam !== "object")
                    throw TypeError(".caffe.LayerParameter.biasParam: object expected");
                message.biasParam = $root.caffe.BiasParameter.fromObject(object.biasParam);
            }
            if (object.concatParam != null) {
                if (typeof object.concatParam !== "object")
                    throw TypeError(".caffe.LayerParameter.concatParam: object expected");
                message.concatParam = $root.caffe.ConcatParameter.fromObject(object.concatParam);
            }
            if (object.contrastiveLossParam != null) {
                if (typeof object.contrastiveLossParam !== "object")
                    throw TypeError(".caffe.LayerParameter.contrastiveLossParam: object expected");
                message.contrastiveLossParam = $root.caffe.ContrastiveLossParameter.fromObject(object.contrastiveLossParam);
            }
            if (object.convolutionParam != null) {
                if (typeof object.convolutionParam !== "object")
                    throw TypeError(".caffe.LayerParameter.convolutionParam: object expected");
                message.convolutionParam = $root.caffe.ConvolutionParameter.fromObject(object.convolutionParam);
            }
            if (object.cropParam != null) {
                if (typeof object.cropParam !== "object")
                    throw TypeError(".caffe.LayerParameter.cropParam: object expected");
                message.cropParam = $root.caffe.CropParameter.fromObject(object.cropParam);
            }
            if (object.dataParam != null) {
                if (typeof object.dataParam !== "object")
                    throw TypeError(".caffe.LayerParameter.dataParam: object expected");
                message.dataParam = $root.caffe.DataParameter.fromObject(object.dataParam);
            }
            if (object.dropoutParam != null) {
                if (typeof object.dropoutParam !== "object")
                    throw TypeError(".caffe.LayerParameter.dropoutParam: object expected");
                message.dropoutParam = $root.caffe.DropoutParameter.fromObject(object.dropoutParam);
            }
            if (object.dummyDataParam != null) {
                if (typeof object.dummyDataParam !== "object")
                    throw TypeError(".caffe.LayerParameter.dummyDataParam: object expected");
                message.dummyDataParam = $root.caffe.DummyDataParameter.fromObject(object.dummyDataParam);
            }
            if (object.eltwiseParam != null) {
                if (typeof object.eltwiseParam !== "object")
                    throw TypeError(".caffe.LayerParameter.eltwiseParam: object expected");
                message.eltwiseParam = $root.caffe.EltwiseParameter.fromObject(object.eltwiseParam);
            }
            if (object.eluParam != null) {
                if (typeof object.eluParam !== "object")
                    throw TypeError(".caffe.LayerParameter.eluParam: object expected");
                message.eluParam = $root.caffe.ELUParameter.fromObject(object.eluParam);
            }
            if (object.embedParam != null) {
                if (typeof object.embedParam !== "object")
                    throw TypeError(".caffe.LayerParameter.embedParam: object expected");
                message.embedParam = $root.caffe.EmbedParameter.fromObject(object.embedParam);
            }
            if (object.expParam != null) {
                if (typeof object.expParam !== "object")
                    throw TypeError(".caffe.LayerParameter.expParam: object expected");
                message.expParam = $root.caffe.ExpParameter.fromObject(object.expParam);
            }
            if (object.flattenParam != null) {
                if (typeof object.flattenParam !== "object")
                    throw TypeError(".caffe.LayerParameter.flattenParam: object expected");
                message.flattenParam = $root.caffe.FlattenParameter.fromObject(object.flattenParam);
            }
            if (object.hdf5DataParam != null) {
                if (typeof object.hdf5DataParam !== "object")
                    throw TypeError(".caffe.LayerParameter.hdf5DataParam: object expected");
                message.hdf5DataParam = $root.caffe.HDF5DataParameter.fromObject(object.hdf5DataParam);
            }
            if (object.hdf5OutputParam != null) {
                if (typeof object.hdf5OutputParam !== "object")
                    throw TypeError(".caffe.LayerParameter.hdf5OutputParam: object expected");
                message.hdf5OutputParam = $root.caffe.HDF5OutputParameter.fromObject(object.hdf5OutputParam);
            }
            if (object.hingeLossParam != null) {
                if (typeof object.hingeLossParam !== "object")
                    throw TypeError(".caffe.LayerParameter.hingeLossParam: object expected");
                message.hingeLossParam = $root.caffe.HingeLossParameter.fromObject(object.hingeLossParam);
            }
            if (object.imageDataParam != null) {
                if (typeof object.imageDataParam !== "object")
                    throw TypeError(".caffe.LayerParameter.imageDataParam: object expected");
                message.imageDataParam = $root.caffe.ImageDataParameter.fromObject(object.imageDataParam);
            }
            if (object.infogainLossParam != null) {
                if (typeof object.infogainLossParam !== "object")
                    throw TypeError(".caffe.LayerParameter.infogainLossParam: object expected");
                message.infogainLossParam = $root.caffe.InfogainLossParameter.fromObject(object.infogainLossParam);
            }
            if (object.innerProductParam != null) {
                if (typeof object.innerProductParam !== "object")
                    throw TypeError(".caffe.LayerParameter.innerProductParam: object expected");
                message.innerProductParam = $root.caffe.InnerProductParameter.fromObject(object.innerProductParam);
            }
            if (object.inputParam != null) {
                if (typeof object.inputParam !== "object")
                    throw TypeError(".caffe.LayerParameter.inputParam: object expected");
                message.inputParam = $root.caffe.InputParameter.fromObject(object.inputParam);
            }
            if (object.logParam != null) {
                if (typeof object.logParam !== "object")
                    throw TypeError(".caffe.LayerParameter.logParam: object expected");
                message.logParam = $root.caffe.LogParameter.fromObject(object.logParam);
            }
            if (object.lrnParam != null) {
                if (typeof object.lrnParam !== "object")
                    throw TypeError(".caffe.LayerParameter.lrnParam: object expected");
                message.lrnParam = $root.caffe.LRNParameter.fromObject(object.lrnParam);
            }
            if (object.memoryDataParam != null) {
                if (typeof object.memoryDataParam !== "object")
                    throw TypeError(".caffe.LayerParameter.memoryDataParam: object expected");
                message.memoryDataParam = $root.caffe.MemoryDataParameter.fromObject(object.memoryDataParam);
            }
            if (object.mvnParam != null) {
                if (typeof object.mvnParam !== "object")
                    throw TypeError(".caffe.LayerParameter.mvnParam: object expected");
                message.mvnParam = $root.caffe.MVNParameter.fromObject(object.mvnParam);
            }
            if (object.parameterParam != null) {
                if (typeof object.parameterParam !== "object")
                    throw TypeError(".caffe.LayerParameter.parameterParam: object expected");
                message.parameterParam = $root.caffe.ParameterParameter.fromObject(object.parameterParam);
            }
            if (object.poolingParam != null) {
                if (typeof object.poolingParam !== "object")
                    throw TypeError(".caffe.LayerParameter.poolingParam: object expected");
                message.poolingParam = $root.caffe.PoolingParameter.fromObject(object.poolingParam);
            }
            if (object.powerParam != null) {
                if (typeof object.powerParam !== "object")
                    throw TypeError(".caffe.LayerParameter.powerParam: object expected");
                message.powerParam = $root.caffe.PowerParameter.fromObject(object.powerParam);
            }
            if (object.preluParam != null) {
                if (typeof object.preluParam !== "object")
                    throw TypeError(".caffe.LayerParameter.preluParam: object expected");
                message.preluParam = $root.caffe.PReLUParameter.fromObject(object.preluParam);
            }
            if (object.pythonParam != null) {
                if (typeof object.pythonParam !== "object")
                    throw TypeError(".caffe.LayerParameter.pythonParam: object expected");
                message.pythonParam = $root.caffe.PythonParameter.fromObject(object.pythonParam);
            }
            if (object.recurrentParam != null) {
                if (typeof object.recurrentParam !== "object")
                    throw TypeError(".caffe.LayerParameter.recurrentParam: object expected");
                message.recurrentParam = $root.caffe.RecurrentParameter.fromObject(object.recurrentParam);
            }
            if (object.reductionParam != null) {
                if (typeof object.reductionParam !== "object")
                    throw TypeError(".caffe.LayerParameter.reductionParam: object expected");
                message.reductionParam = $root.caffe.ReductionParameter.fromObject(object.reductionParam);
            }
            if (object.reluParam != null) {
                if (typeof object.reluParam !== "object")
                    throw TypeError(".caffe.LayerParameter.reluParam: object expected");
                message.reluParam = $root.caffe.ReLUParameter.fromObject(object.reluParam);
            }
            if (object.reshapeParam != null) {
                if (typeof object.reshapeParam !== "object")
                    throw TypeError(".caffe.LayerParameter.reshapeParam: object expected");
                message.reshapeParam = $root.caffe.ReshapeParameter.fromObject(object.reshapeParam);
            }
            if (object.scaleParam != null) {
                if (typeof object.scaleParam !== "object")
                    throw TypeError(".caffe.LayerParameter.scaleParam: object expected");
                message.scaleParam = $root.caffe.ScaleParameter.fromObject(object.scaleParam);
            }
            if (object.sigmoidParam != null) {
                if (typeof object.sigmoidParam !== "object")
                    throw TypeError(".caffe.LayerParameter.sigmoidParam: object expected");
                message.sigmoidParam = $root.caffe.SigmoidParameter.fromObject(object.sigmoidParam);
            }
            if (object.softmaxParam != null) {
                if (typeof object.softmaxParam !== "object")
                    throw TypeError(".caffe.LayerParameter.softmaxParam: object expected");
                message.softmaxParam = $root.caffe.SoftmaxParameter.fromObject(object.softmaxParam);
            }
            if (object.sppParam != null) {
                if (typeof object.sppParam !== "object")
                    throw TypeError(".caffe.LayerParameter.sppParam: object expected");
                message.sppParam = $root.caffe.SPPParameter.fromObject(object.sppParam);
            }
            if (object.sliceParam != null) {
                if (typeof object.sliceParam !== "object")
                    throw TypeError(".caffe.LayerParameter.sliceParam: object expected");
                message.sliceParam = $root.caffe.SliceParameter.fromObject(object.sliceParam);
            }
            if (object.tanhParam != null) {
                if (typeof object.tanhParam !== "object")
                    throw TypeError(".caffe.LayerParameter.tanhParam: object expected");
                message.tanhParam = $root.caffe.TanHParameter.fromObject(object.tanhParam);
            }
            if (object.thresholdParam != null) {
                if (typeof object.thresholdParam !== "object")
                    throw TypeError(".caffe.LayerParameter.thresholdParam: object expected");
                message.thresholdParam = $root.caffe.ThresholdParameter.fromObject(object.thresholdParam);
            }
            if (object.tileParam != null) {
                if (typeof object.tileParam !== "object")
                    throw TypeError(".caffe.LayerParameter.tileParam: object expected");
                message.tileParam = $root.caffe.TileParameter.fromObject(object.tileParam);
            }
            if (object.windowDataParam != null) {
                if (typeof object.windowDataParam !== "object")
                    throw TypeError(".caffe.LayerParameter.windowDataParam: object expected");
                message.windowDataParam = $root.caffe.WindowDataParameter.fromObject(object.windowDataParam);
            }
            return message;
        };

        /**
         * Creates a plain object from a LayerParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.LayerParameter
         * @static
         * @param {caffe.LayerParameter} message LayerParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LayerParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.bottom = [];
                object.top = [];
                object.lossWeight = [];
                object.param = [];
                object.blobs = [];
                object.include = [];
                object.exclude = [];
                object.propagateDown = [];
            }
            if (options.defaults) {
                object.name = "";
                object.type = "";
                object.phase = options.enums === String ? "TRAIN" : 0;
                object.transformParam = null;
                object.lossParam = null;
                object.accuracyParam = null;
                object.argmaxParam = null;
                object.concatParam = null;
                object.contrastiveLossParam = null;
                object.convolutionParam = null;
                object.dataParam = null;
                object.dropoutParam = null;
                object.dummyDataParam = null;
                object.eltwiseParam = null;
                object.expParam = null;
                object.hdf5DataParam = null;
                object.hdf5OutputParam = null;
                object.hingeLossParam = null;
                object.imageDataParam = null;
                object.infogainLossParam = null;
                object.innerProductParam = null;
                object.lrnParam = null;
                object.memoryDataParam = null;
                object.mvnParam = null;
                object.poolingParam = null;
                object.powerParam = null;
                object.reluParam = null;
                object.sigmoidParam = null;
                object.softmaxParam = null;
                object.sliceParam = null;
                object.tanhParam = null;
                object.thresholdParam = null;
                object.windowDataParam = null;
                object.pythonParam = null;
                object.preluParam = null;
                object.sppParam = null;
                object.reshapeParam = null;
                object.logParam = null;
                object.flattenParam = null;
                object.reductionParam = null;
                object.embedParam = null;
                object.tileParam = null;
                object.batchNormParam = null;
                object.eluParam = null;
                object.biasParam = null;
                object.scaleParam = null;
                object.inputParam = null;
                object.cropParam = null;
                object.parameterParam = null;
                object.recurrentParam = null;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.bottom && message.bottom.length) {
                object.bottom = [];
                for (var j = 0; j < message.bottom.length; ++j)
                    object.bottom[j] = message.bottom[j];
            }
            if (message.top && message.top.length) {
                object.top = [];
                for (var j = 0; j < message.top.length; ++j)
                    object.top[j] = message.top[j];
            }
            if (message.lossWeight && message.lossWeight.length) {
                object.lossWeight = [];
                for (var j = 0; j < message.lossWeight.length; ++j)
                    object.lossWeight[j] = options.json && !isFinite(message.lossWeight[j]) ? String(message.lossWeight[j]) : message.lossWeight[j];
            }
            if (message.param && message.param.length) {
                object.param = [];
                for (var j = 0; j < message.param.length; ++j)
                    object.param[j] = $root.caffe.ParamSpec.toObject(message.param[j], options);
            }
            if (message.blobs && message.blobs.length) {
                object.blobs = [];
                for (var j = 0; j < message.blobs.length; ++j)
                    object.blobs[j] = $root.caffe.BlobProto.toObject(message.blobs[j], options);
            }
            if (message.include && message.include.length) {
                object.include = [];
                for (var j = 0; j < message.include.length; ++j)
                    object.include[j] = $root.caffe.NetStateRule.toObject(message.include[j], options);
            }
            if (message.exclude && message.exclude.length) {
                object.exclude = [];
                for (var j = 0; j < message.exclude.length; ++j)
                    object.exclude[j] = $root.caffe.NetStateRule.toObject(message.exclude[j], options);
            }
            if (message.phase != null && message.hasOwnProperty("phase"))
                object.phase = options.enums === String ? $root.caffe.Phase[message.phase] : message.phase;
            if (message.propagateDown && message.propagateDown.length) {
                object.propagateDown = [];
                for (var j = 0; j < message.propagateDown.length; ++j)
                    object.propagateDown[j] = message.propagateDown[j];
            }
            if (message.transformParam != null && message.hasOwnProperty("transformParam"))
                object.transformParam = $root.caffe.TransformationParameter.toObject(message.transformParam, options);
            if (message.lossParam != null && message.hasOwnProperty("lossParam"))
                object.lossParam = $root.caffe.LossParameter.toObject(message.lossParam, options);
            if (message.accuracyParam != null && message.hasOwnProperty("accuracyParam"))
                object.accuracyParam = $root.caffe.AccuracyParameter.toObject(message.accuracyParam, options);
            if (message.argmaxParam != null && message.hasOwnProperty("argmaxParam"))
                object.argmaxParam = $root.caffe.ArgMaxParameter.toObject(message.argmaxParam, options);
            if (message.concatParam != null && message.hasOwnProperty("concatParam"))
                object.concatParam = $root.caffe.ConcatParameter.toObject(message.concatParam, options);
            if (message.contrastiveLossParam != null && message.hasOwnProperty("contrastiveLossParam"))
                object.contrastiveLossParam = $root.caffe.ContrastiveLossParameter.toObject(message.contrastiveLossParam, options);
            if (message.convolutionParam != null && message.hasOwnProperty("convolutionParam"))
                object.convolutionParam = $root.caffe.ConvolutionParameter.toObject(message.convolutionParam, options);
            if (message.dataParam != null && message.hasOwnProperty("dataParam"))
                object.dataParam = $root.caffe.DataParameter.toObject(message.dataParam, options);
            if (message.dropoutParam != null && message.hasOwnProperty("dropoutParam"))
                object.dropoutParam = $root.caffe.DropoutParameter.toObject(message.dropoutParam, options);
            if (message.dummyDataParam != null && message.hasOwnProperty("dummyDataParam"))
                object.dummyDataParam = $root.caffe.DummyDataParameter.toObject(message.dummyDataParam, options);
            if (message.eltwiseParam != null && message.hasOwnProperty("eltwiseParam"))
                object.eltwiseParam = $root.caffe.EltwiseParameter.toObject(message.eltwiseParam, options);
            if (message.expParam != null && message.hasOwnProperty("expParam"))
                object.expParam = $root.caffe.ExpParameter.toObject(message.expParam, options);
            if (message.hdf5DataParam != null && message.hasOwnProperty("hdf5DataParam"))
                object.hdf5DataParam = $root.caffe.HDF5DataParameter.toObject(message.hdf5DataParam, options);
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam"))
                object.hdf5OutputParam = $root.caffe.HDF5OutputParameter.toObject(message.hdf5OutputParam, options);
            if (message.hingeLossParam != null && message.hasOwnProperty("hingeLossParam"))
                object.hingeLossParam = $root.caffe.HingeLossParameter.toObject(message.hingeLossParam, options);
            if (message.imageDataParam != null && message.hasOwnProperty("imageDataParam"))
                object.imageDataParam = $root.caffe.ImageDataParameter.toObject(message.imageDataParam, options);
            if (message.infogainLossParam != null && message.hasOwnProperty("infogainLossParam"))
                object.infogainLossParam = $root.caffe.InfogainLossParameter.toObject(message.infogainLossParam, options);
            if (message.innerProductParam != null && message.hasOwnProperty("innerProductParam"))
                object.innerProductParam = $root.caffe.InnerProductParameter.toObject(message.innerProductParam, options);
            if (message.lrnParam != null && message.hasOwnProperty("lrnParam"))
                object.lrnParam = $root.caffe.LRNParameter.toObject(message.lrnParam, options);
            if (message.memoryDataParam != null && message.hasOwnProperty("memoryDataParam"))
                object.memoryDataParam = $root.caffe.MemoryDataParameter.toObject(message.memoryDataParam, options);
            if (message.mvnParam != null && message.hasOwnProperty("mvnParam"))
                object.mvnParam = $root.caffe.MVNParameter.toObject(message.mvnParam, options);
            if (message.poolingParam != null && message.hasOwnProperty("poolingParam"))
                object.poolingParam = $root.caffe.PoolingParameter.toObject(message.poolingParam, options);
            if (message.powerParam != null && message.hasOwnProperty("powerParam"))
                object.powerParam = $root.caffe.PowerParameter.toObject(message.powerParam, options);
            if (message.reluParam != null && message.hasOwnProperty("reluParam"))
                object.reluParam = $root.caffe.ReLUParameter.toObject(message.reluParam, options);
            if (message.sigmoidParam != null && message.hasOwnProperty("sigmoidParam"))
                object.sigmoidParam = $root.caffe.SigmoidParameter.toObject(message.sigmoidParam, options);
            if (message.softmaxParam != null && message.hasOwnProperty("softmaxParam"))
                object.softmaxParam = $root.caffe.SoftmaxParameter.toObject(message.softmaxParam, options);
            if (message.sliceParam != null && message.hasOwnProperty("sliceParam"))
                object.sliceParam = $root.caffe.SliceParameter.toObject(message.sliceParam, options);
            if (message.tanhParam != null && message.hasOwnProperty("tanhParam"))
                object.tanhParam = $root.caffe.TanHParameter.toObject(message.tanhParam, options);
            if (message.thresholdParam != null && message.hasOwnProperty("thresholdParam"))
                object.thresholdParam = $root.caffe.ThresholdParameter.toObject(message.thresholdParam, options);
            if (message.windowDataParam != null && message.hasOwnProperty("windowDataParam"))
                object.windowDataParam = $root.caffe.WindowDataParameter.toObject(message.windowDataParam, options);
            if (message.pythonParam != null && message.hasOwnProperty("pythonParam"))
                object.pythonParam = $root.caffe.PythonParameter.toObject(message.pythonParam, options);
            if (message.preluParam != null && message.hasOwnProperty("preluParam"))
                object.preluParam = $root.caffe.PReLUParameter.toObject(message.preluParam, options);
            if (message.sppParam != null && message.hasOwnProperty("sppParam"))
                object.sppParam = $root.caffe.SPPParameter.toObject(message.sppParam, options);
            if (message.reshapeParam != null && message.hasOwnProperty("reshapeParam"))
                object.reshapeParam = $root.caffe.ReshapeParameter.toObject(message.reshapeParam, options);
            if (message.logParam != null && message.hasOwnProperty("logParam"))
                object.logParam = $root.caffe.LogParameter.toObject(message.logParam, options);
            if (message.flattenParam != null && message.hasOwnProperty("flattenParam"))
                object.flattenParam = $root.caffe.FlattenParameter.toObject(message.flattenParam, options);
            if (message.reductionParam != null && message.hasOwnProperty("reductionParam"))
                object.reductionParam = $root.caffe.ReductionParameter.toObject(message.reductionParam, options);
            if (message.embedParam != null && message.hasOwnProperty("embedParam"))
                object.embedParam = $root.caffe.EmbedParameter.toObject(message.embedParam, options);
            if (message.tileParam != null && message.hasOwnProperty("tileParam"))
                object.tileParam = $root.caffe.TileParameter.toObject(message.tileParam, options);
            if (message.batchNormParam != null && message.hasOwnProperty("batchNormParam"))
                object.batchNormParam = $root.caffe.BatchNormParameter.toObject(message.batchNormParam, options);
            if (message.eluParam != null && message.hasOwnProperty("eluParam"))
                object.eluParam = $root.caffe.ELUParameter.toObject(message.eluParam, options);
            if (message.biasParam != null && message.hasOwnProperty("biasParam"))
                object.biasParam = $root.caffe.BiasParameter.toObject(message.biasParam, options);
            if (message.scaleParam != null && message.hasOwnProperty("scaleParam"))
                object.scaleParam = $root.caffe.ScaleParameter.toObject(message.scaleParam, options);
            if (message.inputParam != null && message.hasOwnProperty("inputParam"))
                object.inputParam = $root.caffe.InputParameter.toObject(message.inputParam, options);
            if (message.cropParam != null && message.hasOwnProperty("cropParam"))
                object.cropParam = $root.caffe.CropParameter.toObject(message.cropParam, options);
            if (message.parameterParam != null && message.hasOwnProperty("parameterParam"))
                object.parameterParam = $root.caffe.ParameterParameter.toObject(message.parameterParam, options);
            if (message.recurrentParam != null && message.hasOwnProperty("recurrentParam"))
                object.recurrentParam = $root.caffe.RecurrentParameter.toObject(message.recurrentParam, options);
            return object;
        };

        /**
         * Converts this LayerParameter to JSON.
         * @function toJSON
         * @memberof caffe.LayerParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LayerParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LayerParameter;
    })();

    caffe.TransformationParameter = (function() {

        /**
         * Properties of a TransformationParameter.
         * @memberof caffe
         * @interface ITransformationParameter
         * @property {number} [scale] TransformationParameter scale
         * @property {boolean} [mirror] TransformationParameter mirror
         * @property {number} [cropSize] TransformationParameter cropSize
         * @property {string} [meanFile] TransformationParameter meanFile
         * @property {Array.<number>} [meanValue] TransformationParameter meanValue
         * @property {boolean} [forceColor] TransformationParameter forceColor
         * @property {boolean} [forceGray] TransformationParameter forceGray
         */

        /**
         * Constructs a new TransformationParameter.
         * @memberof caffe
         * @classdesc Represents a TransformationParameter.
         * @constructor
         * @param {caffe.ITransformationParameter=} [properties] Properties to set
         */
        function TransformationParameter(properties) {
            this.meanValue = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TransformationParameter scale.
         * @member {number}scale
         * @memberof caffe.TransformationParameter
         * @instance
         */
        TransformationParameter.prototype.scale = 1;

        /**
         * TransformationParameter mirror.
         * @member {boolean}mirror
         * @memberof caffe.TransformationParameter
         * @instance
         */
        TransformationParameter.prototype.mirror = false;

        /**
         * TransformationParameter cropSize.
         * @member {number}cropSize
         * @memberof caffe.TransformationParameter
         * @instance
         */
        TransformationParameter.prototype.cropSize = 0;

        /**
         * TransformationParameter meanFile.
         * @member {string}meanFile
         * @memberof caffe.TransformationParameter
         * @instance
         */
        TransformationParameter.prototype.meanFile = "";

        /**
         * TransformationParameter meanValue.
         * @member {Array.<number>}meanValue
         * @memberof caffe.TransformationParameter
         * @instance
         */
        TransformationParameter.prototype.meanValue = $util.emptyArray;

        /**
         * TransformationParameter forceColor.
         * @member {boolean}forceColor
         * @memberof caffe.TransformationParameter
         * @instance
         */
        TransformationParameter.prototype.forceColor = false;

        /**
         * TransformationParameter forceGray.
         * @member {boolean}forceGray
         * @memberof caffe.TransformationParameter
         * @instance
         */
        TransformationParameter.prototype.forceGray = false;

        /**
         * Creates a new TransformationParameter instance using the specified properties.
         * @function create
         * @memberof caffe.TransformationParameter
         * @static
         * @param {caffe.ITransformationParameter=} [properties] Properties to set
         * @returns {caffe.TransformationParameter} TransformationParameter instance
         */
        TransformationParameter.create = function create(properties) {
            return new TransformationParameter(properties);
        };

        /**
         * Encodes the specified TransformationParameter message. Does not implicitly {@link caffe.TransformationParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.TransformationParameter
         * @static
         * @param {caffe.ITransformationParameter} message TransformationParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TransformationParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.scale != null && message.hasOwnProperty("scale"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.scale);
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.mirror);
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.cropSize);
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.meanFile);
            if (message.meanValue != null && message.meanValue.length)
                for (var i = 0; i < message.meanValue.length; ++i)
                    writer.uint32(/* id 5, wireType 5 =*/45).float(message.meanValue[i]);
            if (message.forceColor != null && message.hasOwnProperty("forceColor"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.forceColor);
            if (message.forceGray != null && message.hasOwnProperty("forceGray"))
                writer.uint32(/* id 7, wireType 0 =*/56).bool(message.forceGray);
            return writer;
        };

        /**
         * Encodes the specified TransformationParameter message, length delimited. Does not implicitly {@link caffe.TransformationParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.TransformationParameter
         * @static
         * @param {caffe.ITransformationParameter} message TransformationParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TransformationParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TransformationParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.TransformationParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.TransformationParameter} TransformationParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TransformationParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.TransformationParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.scale = reader.float();
                    break;
                case 2:
                    message.mirror = reader.bool();
                    break;
                case 3:
                    message.cropSize = reader.uint32();
                    break;
                case 4:
                    message.meanFile = reader.string();
                    break;
                case 5:
                    if (!(message.meanValue && message.meanValue.length))
                        message.meanValue = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.meanValue.push(reader.float());
                    } else
                        message.meanValue.push(reader.float());
                    break;
                case 6:
                    message.forceColor = reader.bool();
                    break;
                case 7:
                    message.forceGray = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TransformationParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.TransformationParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.TransformationParameter} TransformationParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TransformationParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TransformationParameter message.
         * @function verify
         * @memberof caffe.TransformationParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TransformationParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.scale != null && message.hasOwnProperty("scale"))
                if (typeof message.scale !== "number")
                    return "scale: number expected";
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                if (typeof message.mirror !== "boolean")
                    return "mirror: boolean expected";
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                if (!$util.isInteger(message.cropSize))
                    return "cropSize: integer expected";
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                if (!$util.isString(message.meanFile))
                    return "meanFile: string expected";
            if (message.meanValue != null && message.hasOwnProperty("meanValue")) {
                if (!Array.isArray(message.meanValue))
                    return "meanValue: array expected";
                for (var i = 0; i < message.meanValue.length; ++i)
                    if (typeof message.meanValue[i] !== "number")
                        return "meanValue: number[] expected";
            }
            if (message.forceColor != null && message.hasOwnProperty("forceColor"))
                if (typeof message.forceColor !== "boolean")
                    return "forceColor: boolean expected";
            if (message.forceGray != null && message.hasOwnProperty("forceGray"))
                if (typeof message.forceGray !== "boolean")
                    return "forceGray: boolean expected";
            return null;
        };

        /**
         * Creates a TransformationParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.TransformationParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.TransformationParameter} TransformationParameter
         */
        TransformationParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.TransformationParameter)
                return object;
            var message = new $root.caffe.TransformationParameter();
            if (object.scale != null)
                message.scale = Number(object.scale);
            if (object.mirror != null)
                message.mirror = Boolean(object.mirror);
            if (object.cropSize != null)
                message.cropSize = object.cropSize >>> 0;
            if (object.meanFile != null)
                message.meanFile = String(object.meanFile);
            if (object.meanValue) {
                if (!Array.isArray(object.meanValue))
                    throw TypeError(".caffe.TransformationParameter.meanValue: array expected");
                message.meanValue = [];
                for (var i = 0; i < object.meanValue.length; ++i)
                    message.meanValue[i] = Number(object.meanValue[i]);
            }
            if (object.forceColor != null)
                message.forceColor = Boolean(object.forceColor);
            if (object.forceGray != null)
                message.forceGray = Boolean(object.forceGray);
            return message;
        };

        /**
         * Creates a plain object from a TransformationParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.TransformationParameter
         * @static
         * @param {caffe.TransformationParameter} message TransformationParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TransformationParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.meanValue = [];
            if (options.defaults) {
                object.scale = 1;
                object.mirror = false;
                object.cropSize = 0;
                object.meanFile = "";
                object.forceColor = false;
                object.forceGray = false;
            }
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = options.json && !isFinite(message.scale) ? String(message.scale) : message.scale;
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                object.mirror = message.mirror;
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                object.cropSize = message.cropSize;
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                object.meanFile = message.meanFile;
            if (message.meanValue && message.meanValue.length) {
                object.meanValue = [];
                for (var j = 0; j < message.meanValue.length; ++j)
                    object.meanValue[j] = options.json && !isFinite(message.meanValue[j]) ? String(message.meanValue[j]) : message.meanValue[j];
            }
            if (message.forceColor != null && message.hasOwnProperty("forceColor"))
                object.forceColor = message.forceColor;
            if (message.forceGray != null && message.hasOwnProperty("forceGray"))
                object.forceGray = message.forceGray;
            return object;
        };

        /**
         * Converts this TransformationParameter to JSON.
         * @function toJSON
         * @memberof caffe.TransformationParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TransformationParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TransformationParameter;
    })();

    caffe.LossParameter = (function() {

        /**
         * Properties of a LossParameter.
         * @memberof caffe
         * @interface ILossParameter
         * @property {number} [ignoreLabel] LossParameter ignoreLabel
         * @property {caffe.LossParameter.NormalizationMode} [normalization] LossParameter normalization
         * @property {boolean} [normalize] LossParameter normalize
         */

        /**
         * Constructs a new LossParameter.
         * @memberof caffe
         * @classdesc Represents a LossParameter.
         * @constructor
         * @param {caffe.ILossParameter=} [properties] Properties to set
         */
        function LossParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LossParameter ignoreLabel.
         * @member {number}ignoreLabel
         * @memberof caffe.LossParameter
         * @instance
         */
        LossParameter.prototype.ignoreLabel = 0;

        /**
         * LossParameter normalization.
         * @member {caffe.LossParameter.NormalizationMode}normalization
         * @memberof caffe.LossParameter
         * @instance
         */
        LossParameter.prototype.normalization = 1;

        /**
         * LossParameter normalize.
         * @member {boolean}normalize
         * @memberof caffe.LossParameter
         * @instance
         */
        LossParameter.prototype.normalize = false;

        /**
         * Creates a new LossParameter instance using the specified properties.
         * @function create
         * @memberof caffe.LossParameter
         * @static
         * @param {caffe.ILossParameter=} [properties] Properties to set
         * @returns {caffe.LossParameter} LossParameter instance
         */
        LossParameter.create = function create(properties) {
            return new LossParameter(properties);
        };

        /**
         * Encodes the specified LossParameter message. Does not implicitly {@link caffe.LossParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.LossParameter
         * @static
         * @param {caffe.ILossParameter} message LossParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LossParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ignoreLabel != null && message.hasOwnProperty("ignoreLabel"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.ignoreLabel);
            if (message.normalize != null && message.hasOwnProperty("normalize"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.normalize);
            if (message.normalization != null && message.hasOwnProperty("normalization"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.normalization);
            return writer;
        };

        /**
         * Encodes the specified LossParameter message, length delimited. Does not implicitly {@link caffe.LossParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.LossParameter
         * @static
         * @param {caffe.ILossParameter} message LossParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LossParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LossParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.LossParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.LossParameter} LossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LossParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.LossParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.ignoreLabel = reader.int32();
                    break;
                case 3:
                    message.normalization = reader.int32();
                    break;
                case 2:
                    message.normalize = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LossParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.LossParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.LossParameter} LossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LossParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LossParameter message.
         * @function verify
         * @memberof caffe.LossParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LossParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ignoreLabel != null && message.hasOwnProperty("ignoreLabel"))
                if (!$util.isInteger(message.ignoreLabel))
                    return "ignoreLabel: integer expected";
            if (message.normalization != null && message.hasOwnProperty("normalization"))
                switch (message.normalization) {
                default:
                    return "normalization: enum value expected";
                case 0:
                case 1:
                case 2:
                case 3:
                    break;
                }
            if (message.normalize != null && message.hasOwnProperty("normalize"))
                if (typeof message.normalize !== "boolean")
                    return "normalize: boolean expected";
            return null;
        };

        /**
         * Creates a LossParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.LossParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.LossParameter} LossParameter
         */
        LossParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.LossParameter)
                return object;
            var message = new $root.caffe.LossParameter();
            if (object.ignoreLabel != null)
                message.ignoreLabel = object.ignoreLabel | 0;
            switch (object.normalization) {
            case "FULL":
            case 0:
                message.normalization = 0;
                break;
            case "VALID":
            case 1:
                message.normalization = 1;
                break;
            case "BATCH_SIZE":
            case 2:
                message.normalization = 2;
                break;
            case "NONE":
            case 3:
                message.normalization = 3;
                break;
            }
            if (object.normalize != null)
                message.normalize = Boolean(object.normalize);
            return message;
        };

        /**
         * Creates a plain object from a LossParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.LossParameter
         * @static
         * @param {caffe.LossParameter} message LossParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LossParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.ignoreLabel = 0;
                object.normalize = false;
                object.normalization = options.enums === String ? "VALID" : 1;
            }
            if (message.ignoreLabel != null && message.hasOwnProperty("ignoreLabel"))
                object.ignoreLabel = message.ignoreLabel;
            if (message.normalize != null && message.hasOwnProperty("normalize"))
                object.normalize = message.normalize;
            if (message.normalization != null && message.hasOwnProperty("normalization"))
                object.normalization = options.enums === String ? $root.caffe.LossParameter.NormalizationMode[message.normalization] : message.normalization;
            return object;
        };

        /**
         * Converts this LossParameter to JSON.
         * @function toJSON
         * @memberof caffe.LossParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LossParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * NormalizationMode enum.
         * @enum {string}
         * @property {number} FULL=0 FULL value
         * @property {number} VALID=1 VALID value
         * @property {number} BATCH_SIZE=2 BATCH_SIZE value
         * @property {number} NONE=3 NONE value
         */
        LossParameter.NormalizationMode = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "FULL"] = 0;
            values[valuesById[1] = "VALID"] = 1;
            values[valuesById[2] = "BATCH_SIZE"] = 2;
            values[valuesById[3] = "NONE"] = 3;
            return values;
        })();

        return LossParameter;
    })();

    caffe.AccuracyParameter = (function() {

        /**
         * Properties of an AccuracyParameter.
         * @memberof caffe
         * @interface IAccuracyParameter
         * @property {number} [topK] AccuracyParameter topK
         * @property {number} [axis] AccuracyParameter axis
         * @property {number} [ignoreLabel] AccuracyParameter ignoreLabel
         */

        /**
         * Constructs a new AccuracyParameter.
         * @memberof caffe
         * @classdesc Represents an AccuracyParameter.
         * @constructor
         * @param {caffe.IAccuracyParameter=} [properties] Properties to set
         */
        function AccuracyParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * AccuracyParameter topK.
         * @member {number}topK
         * @memberof caffe.AccuracyParameter
         * @instance
         */
        AccuracyParameter.prototype.topK = 1;

        /**
         * AccuracyParameter axis.
         * @member {number}axis
         * @memberof caffe.AccuracyParameter
         * @instance
         */
        AccuracyParameter.prototype.axis = 1;

        /**
         * AccuracyParameter ignoreLabel.
         * @member {number}ignoreLabel
         * @memberof caffe.AccuracyParameter
         * @instance
         */
        AccuracyParameter.prototype.ignoreLabel = 0;

        /**
         * Creates a new AccuracyParameter instance using the specified properties.
         * @function create
         * @memberof caffe.AccuracyParameter
         * @static
         * @param {caffe.IAccuracyParameter=} [properties] Properties to set
         * @returns {caffe.AccuracyParameter} AccuracyParameter instance
         */
        AccuracyParameter.create = function create(properties) {
            return new AccuracyParameter(properties);
        };

        /**
         * Encodes the specified AccuracyParameter message. Does not implicitly {@link caffe.AccuracyParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.AccuracyParameter
         * @static
         * @param {caffe.IAccuracyParameter} message AccuracyParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AccuracyParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.topK != null && message.hasOwnProperty("topK"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.topK);
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.axis);
            if (message.ignoreLabel != null && message.hasOwnProperty("ignoreLabel"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.ignoreLabel);
            return writer;
        };

        /**
         * Encodes the specified AccuracyParameter message, length delimited. Does not implicitly {@link caffe.AccuracyParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.AccuracyParameter
         * @static
         * @param {caffe.IAccuracyParameter} message AccuracyParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AccuracyParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AccuracyParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.AccuracyParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.AccuracyParameter} AccuracyParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AccuracyParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.AccuracyParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.topK = reader.uint32();
                    break;
                case 2:
                    message.axis = reader.int32();
                    break;
                case 3:
                    message.ignoreLabel = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an AccuracyParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.AccuracyParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.AccuracyParameter} AccuracyParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        AccuracyParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an AccuracyParameter message.
         * @function verify
         * @memberof caffe.AccuracyParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        AccuracyParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.topK != null && message.hasOwnProperty("topK"))
                if (!$util.isInteger(message.topK))
                    return "topK: integer expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.ignoreLabel != null && message.hasOwnProperty("ignoreLabel"))
                if (!$util.isInteger(message.ignoreLabel))
                    return "ignoreLabel: integer expected";
            return null;
        };

        /**
         * Creates an AccuracyParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.AccuracyParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.AccuracyParameter} AccuracyParameter
         */
        AccuracyParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.AccuracyParameter)
                return object;
            var message = new $root.caffe.AccuracyParameter();
            if (object.topK != null)
                message.topK = object.topK >>> 0;
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.ignoreLabel != null)
                message.ignoreLabel = object.ignoreLabel | 0;
            return message;
        };

        /**
         * Creates a plain object from an AccuracyParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.AccuracyParameter
         * @static
         * @param {caffe.AccuracyParameter} message AccuracyParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        AccuracyParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.topK = 1;
                object.axis = 1;
                object.ignoreLabel = 0;
            }
            if (message.topK != null && message.hasOwnProperty("topK"))
                object.topK = message.topK;
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.ignoreLabel != null && message.hasOwnProperty("ignoreLabel"))
                object.ignoreLabel = message.ignoreLabel;
            return object;
        };

        /**
         * Converts this AccuracyParameter to JSON.
         * @function toJSON
         * @memberof caffe.AccuracyParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        AccuracyParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return AccuracyParameter;
    })();

    caffe.ArgMaxParameter = (function() {

        /**
         * Properties of an ArgMaxParameter.
         * @memberof caffe
         * @interface IArgMaxParameter
         * @property {boolean} [outMaxVal] ArgMaxParameter outMaxVal
         * @property {number} [topK] ArgMaxParameter topK
         * @property {number} [axis] ArgMaxParameter axis
         */

        /**
         * Constructs a new ArgMaxParameter.
         * @memberof caffe
         * @classdesc Represents an ArgMaxParameter.
         * @constructor
         * @param {caffe.IArgMaxParameter=} [properties] Properties to set
         */
        function ArgMaxParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ArgMaxParameter outMaxVal.
         * @member {boolean}outMaxVal
         * @memberof caffe.ArgMaxParameter
         * @instance
         */
        ArgMaxParameter.prototype.outMaxVal = false;

        /**
         * ArgMaxParameter topK.
         * @member {number}topK
         * @memberof caffe.ArgMaxParameter
         * @instance
         */
        ArgMaxParameter.prototype.topK = 1;

        /**
         * ArgMaxParameter axis.
         * @member {number}axis
         * @memberof caffe.ArgMaxParameter
         * @instance
         */
        ArgMaxParameter.prototype.axis = 0;

        /**
         * Creates a new ArgMaxParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ArgMaxParameter
         * @static
         * @param {caffe.IArgMaxParameter=} [properties] Properties to set
         * @returns {caffe.ArgMaxParameter} ArgMaxParameter instance
         */
        ArgMaxParameter.create = function create(properties) {
            return new ArgMaxParameter(properties);
        };

        /**
         * Encodes the specified ArgMaxParameter message. Does not implicitly {@link caffe.ArgMaxParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ArgMaxParameter
         * @static
         * @param {caffe.IArgMaxParameter} message ArgMaxParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ArgMaxParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.outMaxVal != null && message.hasOwnProperty("outMaxVal"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.outMaxVal);
            if (message.topK != null && message.hasOwnProperty("topK"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.topK);
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.axis);
            return writer;
        };

        /**
         * Encodes the specified ArgMaxParameter message, length delimited. Does not implicitly {@link caffe.ArgMaxParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ArgMaxParameter
         * @static
         * @param {caffe.IArgMaxParameter} message ArgMaxParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ArgMaxParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ArgMaxParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ArgMaxParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ArgMaxParameter} ArgMaxParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ArgMaxParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ArgMaxParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.outMaxVal = reader.bool();
                    break;
                case 2:
                    message.topK = reader.uint32();
                    break;
                case 3:
                    message.axis = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ArgMaxParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ArgMaxParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ArgMaxParameter} ArgMaxParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ArgMaxParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ArgMaxParameter message.
         * @function verify
         * @memberof caffe.ArgMaxParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ArgMaxParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.outMaxVal != null && message.hasOwnProperty("outMaxVal"))
                if (typeof message.outMaxVal !== "boolean")
                    return "outMaxVal: boolean expected";
            if (message.topK != null && message.hasOwnProperty("topK"))
                if (!$util.isInteger(message.topK))
                    return "topK: integer expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            return null;
        };

        /**
         * Creates an ArgMaxParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ArgMaxParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ArgMaxParameter} ArgMaxParameter
         */
        ArgMaxParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ArgMaxParameter)
                return object;
            var message = new $root.caffe.ArgMaxParameter();
            if (object.outMaxVal != null)
                message.outMaxVal = Boolean(object.outMaxVal);
            if (object.topK != null)
                message.topK = object.topK >>> 0;
            if (object.axis != null)
                message.axis = object.axis | 0;
            return message;
        };

        /**
         * Creates a plain object from an ArgMaxParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ArgMaxParameter
         * @static
         * @param {caffe.ArgMaxParameter} message ArgMaxParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ArgMaxParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.outMaxVal = false;
                object.topK = 1;
                object.axis = 0;
            }
            if (message.outMaxVal != null && message.hasOwnProperty("outMaxVal"))
                object.outMaxVal = message.outMaxVal;
            if (message.topK != null && message.hasOwnProperty("topK"))
                object.topK = message.topK;
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            return object;
        };

        /**
         * Converts this ArgMaxParameter to JSON.
         * @function toJSON
         * @memberof caffe.ArgMaxParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ArgMaxParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ArgMaxParameter;
    })();

    caffe.ConcatParameter = (function() {

        /**
         * Properties of a ConcatParameter.
         * @memberof caffe
         * @interface IConcatParameter
         * @property {number} [axis] ConcatParameter axis
         * @property {number} [concatDim] ConcatParameter concatDim
         */

        /**
         * Constructs a new ConcatParameter.
         * @memberof caffe
         * @classdesc Represents a ConcatParameter.
         * @constructor
         * @param {caffe.IConcatParameter=} [properties] Properties to set
         */
        function ConcatParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ConcatParameter axis.
         * @member {number}axis
         * @memberof caffe.ConcatParameter
         * @instance
         */
        ConcatParameter.prototype.axis = 1;

        /**
         * ConcatParameter concatDim.
         * @member {number}concatDim
         * @memberof caffe.ConcatParameter
         * @instance
         */
        ConcatParameter.prototype.concatDim = 1;

        /**
         * Creates a new ConcatParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ConcatParameter
         * @static
         * @param {caffe.IConcatParameter=} [properties] Properties to set
         * @returns {caffe.ConcatParameter} ConcatParameter instance
         */
        ConcatParameter.create = function create(properties) {
            return new ConcatParameter(properties);
        };

        /**
         * Encodes the specified ConcatParameter message. Does not implicitly {@link caffe.ConcatParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ConcatParameter
         * @static
         * @param {caffe.IConcatParameter} message ConcatParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConcatParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.concatDim != null && message.hasOwnProperty("concatDim"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.concatDim);
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.axis);
            return writer;
        };

        /**
         * Encodes the specified ConcatParameter message, length delimited. Does not implicitly {@link caffe.ConcatParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ConcatParameter
         * @static
         * @param {caffe.IConcatParameter} message ConcatParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConcatParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ConcatParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ConcatParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ConcatParameter} ConcatParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConcatParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ConcatParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    message.axis = reader.int32();
                    break;
                case 1:
                    message.concatDim = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ConcatParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ConcatParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ConcatParameter} ConcatParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConcatParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ConcatParameter message.
         * @function verify
         * @memberof caffe.ConcatParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ConcatParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.concatDim != null && message.hasOwnProperty("concatDim"))
                if (!$util.isInteger(message.concatDim))
                    return "concatDim: integer expected";
            return null;
        };

        /**
         * Creates a ConcatParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ConcatParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ConcatParameter} ConcatParameter
         */
        ConcatParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ConcatParameter)
                return object;
            var message = new $root.caffe.ConcatParameter();
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.concatDim != null)
                message.concatDim = object.concatDim >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a ConcatParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ConcatParameter
         * @static
         * @param {caffe.ConcatParameter} message ConcatParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ConcatParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.concatDim = 1;
                object.axis = 1;
            }
            if (message.concatDim != null && message.hasOwnProperty("concatDim"))
                object.concatDim = message.concatDim;
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            return object;
        };

        /**
         * Converts this ConcatParameter to JSON.
         * @function toJSON
         * @memberof caffe.ConcatParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ConcatParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ConcatParameter;
    })();

    caffe.BatchNormParameter = (function() {

        /**
         * Properties of a BatchNormParameter.
         * @memberof caffe
         * @interface IBatchNormParameter
         * @property {boolean} [useGlobalStats] BatchNormParameter useGlobalStats
         * @property {number} [movingAverageFraction] BatchNormParameter movingAverageFraction
         * @property {number} [eps] BatchNormParameter eps
         */

        /**
         * Constructs a new BatchNormParameter.
         * @memberof caffe
         * @classdesc Represents a BatchNormParameter.
         * @constructor
         * @param {caffe.IBatchNormParameter=} [properties] Properties to set
         */
        function BatchNormParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BatchNormParameter useGlobalStats.
         * @member {boolean}useGlobalStats
         * @memberof caffe.BatchNormParameter
         * @instance
         */
        BatchNormParameter.prototype.useGlobalStats = false;

        /**
         * BatchNormParameter movingAverageFraction.
         * @member {number}movingAverageFraction
         * @memberof caffe.BatchNormParameter
         * @instance
         */
        BatchNormParameter.prototype.movingAverageFraction = 0.999;

        /**
         * BatchNormParameter eps.
         * @member {number}eps
         * @memberof caffe.BatchNormParameter
         * @instance
         */
        BatchNormParameter.prototype.eps = 0.00001;

        /**
         * Creates a new BatchNormParameter instance using the specified properties.
         * @function create
         * @memberof caffe.BatchNormParameter
         * @static
         * @param {caffe.IBatchNormParameter=} [properties] Properties to set
         * @returns {caffe.BatchNormParameter} BatchNormParameter instance
         */
        BatchNormParameter.create = function create(properties) {
            return new BatchNormParameter(properties);
        };

        /**
         * Encodes the specified BatchNormParameter message. Does not implicitly {@link caffe.BatchNormParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.BatchNormParameter
         * @static
         * @param {caffe.IBatchNormParameter} message BatchNormParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BatchNormParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.useGlobalStats != null && message.hasOwnProperty("useGlobalStats"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.useGlobalStats);
            if (message.movingAverageFraction != null && message.hasOwnProperty("movingAverageFraction"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.movingAverageFraction);
            if (message.eps != null && message.hasOwnProperty("eps"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.eps);
            return writer;
        };

        /**
         * Encodes the specified BatchNormParameter message, length delimited. Does not implicitly {@link caffe.BatchNormParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.BatchNormParameter
         * @static
         * @param {caffe.IBatchNormParameter} message BatchNormParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BatchNormParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BatchNormParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.BatchNormParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.BatchNormParameter} BatchNormParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BatchNormParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.BatchNormParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.useGlobalStats = reader.bool();
                    break;
                case 2:
                    message.movingAverageFraction = reader.float();
                    break;
                case 3:
                    message.eps = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BatchNormParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.BatchNormParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.BatchNormParameter} BatchNormParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BatchNormParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BatchNormParameter message.
         * @function verify
         * @memberof caffe.BatchNormParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BatchNormParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.useGlobalStats != null && message.hasOwnProperty("useGlobalStats"))
                if (typeof message.useGlobalStats !== "boolean")
                    return "useGlobalStats: boolean expected";
            if (message.movingAverageFraction != null && message.hasOwnProperty("movingAverageFraction"))
                if (typeof message.movingAverageFraction !== "number")
                    return "movingAverageFraction: number expected";
            if (message.eps != null && message.hasOwnProperty("eps"))
                if (typeof message.eps !== "number")
                    return "eps: number expected";
            return null;
        };

        /**
         * Creates a BatchNormParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.BatchNormParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.BatchNormParameter} BatchNormParameter
         */
        BatchNormParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.BatchNormParameter)
                return object;
            var message = new $root.caffe.BatchNormParameter();
            if (object.useGlobalStats != null)
                message.useGlobalStats = Boolean(object.useGlobalStats);
            if (object.movingAverageFraction != null)
                message.movingAverageFraction = Number(object.movingAverageFraction);
            if (object.eps != null)
                message.eps = Number(object.eps);
            return message;
        };

        /**
         * Creates a plain object from a BatchNormParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.BatchNormParameter
         * @static
         * @param {caffe.BatchNormParameter} message BatchNormParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BatchNormParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.useGlobalStats = false;
                object.movingAverageFraction = 0.999;
                object.eps = 0.00001;
            }
            if (message.useGlobalStats != null && message.hasOwnProperty("useGlobalStats"))
                object.useGlobalStats = message.useGlobalStats;
            if (message.movingAverageFraction != null && message.hasOwnProperty("movingAverageFraction"))
                object.movingAverageFraction = options.json && !isFinite(message.movingAverageFraction) ? String(message.movingAverageFraction) : message.movingAverageFraction;
            if (message.eps != null && message.hasOwnProperty("eps"))
                object.eps = options.json && !isFinite(message.eps) ? String(message.eps) : message.eps;
            return object;
        };

        /**
         * Converts this BatchNormParameter to JSON.
         * @function toJSON
         * @memberof caffe.BatchNormParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BatchNormParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BatchNormParameter;
    })();

    caffe.BiasParameter = (function() {

        /**
         * Properties of a BiasParameter.
         * @memberof caffe
         * @interface IBiasParameter
         * @property {number} [axis] BiasParameter axis
         * @property {number} [numAxes] BiasParameter numAxes
         * @property {caffe.IFillerParameter} [filler] BiasParameter filler
         */

        /**
         * Constructs a new BiasParameter.
         * @memberof caffe
         * @classdesc Represents a BiasParameter.
         * @constructor
         * @param {caffe.IBiasParameter=} [properties] Properties to set
         */
        function BiasParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BiasParameter axis.
         * @member {number}axis
         * @memberof caffe.BiasParameter
         * @instance
         */
        BiasParameter.prototype.axis = 1;

        /**
         * BiasParameter numAxes.
         * @member {number}numAxes
         * @memberof caffe.BiasParameter
         * @instance
         */
        BiasParameter.prototype.numAxes = 1;

        /**
         * BiasParameter filler.
         * @member {(caffe.IFillerParameter|null|undefined)}filler
         * @memberof caffe.BiasParameter
         * @instance
         */
        BiasParameter.prototype.filler = null;

        /**
         * Creates a new BiasParameter instance using the specified properties.
         * @function create
         * @memberof caffe.BiasParameter
         * @static
         * @param {caffe.IBiasParameter=} [properties] Properties to set
         * @returns {caffe.BiasParameter} BiasParameter instance
         */
        BiasParameter.create = function create(properties) {
            return new BiasParameter(properties);
        };

        /**
         * Encodes the specified BiasParameter message. Does not implicitly {@link caffe.BiasParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.BiasParameter
         * @static
         * @param {caffe.IBiasParameter} message BiasParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BiasParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.axis);
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.numAxes);
            if (message.filler != null && message.hasOwnProperty("filler"))
                $root.caffe.FillerParameter.encode(message.filler, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified BiasParameter message, length delimited. Does not implicitly {@link caffe.BiasParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.BiasParameter
         * @static
         * @param {caffe.IBiasParameter} message BiasParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BiasParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BiasParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.BiasParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.BiasParameter} BiasParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BiasParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.BiasParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.axis = reader.int32();
                    break;
                case 2:
                    message.numAxes = reader.int32();
                    break;
                case 3:
                    message.filler = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a BiasParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.BiasParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.BiasParameter} BiasParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BiasParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BiasParameter message.
         * @function verify
         * @memberof caffe.BiasParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BiasParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                if (!$util.isInteger(message.numAxes))
                    return "numAxes: integer expected";
            if (message.filler != null && message.hasOwnProperty("filler")) {
                var error = $root.caffe.FillerParameter.verify(message.filler);
                if (error)
                    return "filler." + error;
            }
            return null;
        };

        /**
         * Creates a BiasParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.BiasParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.BiasParameter} BiasParameter
         */
        BiasParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.BiasParameter)
                return object;
            var message = new $root.caffe.BiasParameter();
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.numAxes != null)
                message.numAxes = object.numAxes | 0;
            if (object.filler != null) {
                if (typeof object.filler !== "object")
                    throw TypeError(".caffe.BiasParameter.filler: object expected");
                message.filler = $root.caffe.FillerParameter.fromObject(object.filler);
            }
            return message;
        };

        /**
         * Creates a plain object from a BiasParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.BiasParameter
         * @static
         * @param {caffe.BiasParameter} message BiasParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BiasParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.axis = 1;
                object.numAxes = 1;
                object.filler = null;
            }
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                object.numAxes = message.numAxes;
            if (message.filler != null && message.hasOwnProperty("filler"))
                object.filler = $root.caffe.FillerParameter.toObject(message.filler, options);
            return object;
        };

        /**
         * Converts this BiasParameter to JSON.
         * @function toJSON
         * @memberof caffe.BiasParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BiasParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BiasParameter;
    })();

    caffe.ContrastiveLossParameter = (function() {

        /**
         * Properties of a ContrastiveLossParameter.
         * @memberof caffe
         * @interface IContrastiveLossParameter
         * @property {number} [margin] ContrastiveLossParameter margin
         * @property {boolean} [legacyVersion] ContrastiveLossParameter legacyVersion
         */

        /**
         * Constructs a new ContrastiveLossParameter.
         * @memberof caffe
         * @classdesc Represents a ContrastiveLossParameter.
         * @constructor
         * @param {caffe.IContrastiveLossParameter=} [properties] Properties to set
         */
        function ContrastiveLossParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ContrastiveLossParameter margin.
         * @member {number}margin
         * @memberof caffe.ContrastiveLossParameter
         * @instance
         */
        ContrastiveLossParameter.prototype.margin = 1;

        /**
         * ContrastiveLossParameter legacyVersion.
         * @member {boolean}legacyVersion
         * @memberof caffe.ContrastiveLossParameter
         * @instance
         */
        ContrastiveLossParameter.prototype.legacyVersion = false;

        /**
         * Creates a new ContrastiveLossParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ContrastiveLossParameter
         * @static
         * @param {caffe.IContrastiveLossParameter=} [properties] Properties to set
         * @returns {caffe.ContrastiveLossParameter} ContrastiveLossParameter instance
         */
        ContrastiveLossParameter.create = function create(properties) {
            return new ContrastiveLossParameter(properties);
        };

        /**
         * Encodes the specified ContrastiveLossParameter message. Does not implicitly {@link caffe.ContrastiveLossParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ContrastiveLossParameter
         * @static
         * @param {caffe.IContrastiveLossParameter} message ContrastiveLossParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContrastiveLossParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.margin != null && message.hasOwnProperty("margin"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.margin);
            if (message.legacyVersion != null && message.hasOwnProperty("legacyVersion"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.legacyVersion);
            return writer;
        };

        /**
         * Encodes the specified ContrastiveLossParameter message, length delimited. Does not implicitly {@link caffe.ContrastiveLossParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ContrastiveLossParameter
         * @static
         * @param {caffe.IContrastiveLossParameter} message ContrastiveLossParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ContrastiveLossParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ContrastiveLossParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ContrastiveLossParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ContrastiveLossParameter} ContrastiveLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContrastiveLossParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ContrastiveLossParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.margin = reader.float();
                    break;
                case 2:
                    message.legacyVersion = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ContrastiveLossParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ContrastiveLossParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ContrastiveLossParameter} ContrastiveLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ContrastiveLossParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ContrastiveLossParameter message.
         * @function verify
         * @memberof caffe.ContrastiveLossParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ContrastiveLossParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.margin != null && message.hasOwnProperty("margin"))
                if (typeof message.margin !== "number")
                    return "margin: number expected";
            if (message.legacyVersion != null && message.hasOwnProperty("legacyVersion"))
                if (typeof message.legacyVersion !== "boolean")
                    return "legacyVersion: boolean expected";
            return null;
        };

        /**
         * Creates a ContrastiveLossParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ContrastiveLossParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ContrastiveLossParameter} ContrastiveLossParameter
         */
        ContrastiveLossParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ContrastiveLossParameter)
                return object;
            var message = new $root.caffe.ContrastiveLossParameter();
            if (object.margin != null)
                message.margin = Number(object.margin);
            if (object.legacyVersion != null)
                message.legacyVersion = Boolean(object.legacyVersion);
            return message;
        };

        /**
         * Creates a plain object from a ContrastiveLossParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ContrastiveLossParameter
         * @static
         * @param {caffe.ContrastiveLossParameter} message ContrastiveLossParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ContrastiveLossParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.margin = 1;
                object.legacyVersion = false;
            }
            if (message.margin != null && message.hasOwnProperty("margin"))
                object.margin = options.json && !isFinite(message.margin) ? String(message.margin) : message.margin;
            if (message.legacyVersion != null && message.hasOwnProperty("legacyVersion"))
                object.legacyVersion = message.legacyVersion;
            return object;
        };

        /**
         * Converts this ContrastiveLossParameter to JSON.
         * @function toJSON
         * @memberof caffe.ContrastiveLossParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ContrastiveLossParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ContrastiveLossParameter;
    })();

    caffe.ConvolutionParameter = (function() {

        /**
         * Properties of a ConvolutionParameter.
         * @memberof caffe
         * @interface IConvolutionParameter
         * @property {number} [numOutput] ConvolutionParameter numOutput
         * @property {boolean} [biasTerm] ConvolutionParameter biasTerm
         * @property {Array.<number>} [pad] ConvolutionParameter pad
         * @property {Array.<number>} [kernelSize] ConvolutionParameter kernelSize
         * @property {Array.<number>} [stride] ConvolutionParameter stride
         * @property {Array.<number>} [dilation] ConvolutionParameter dilation
         * @property {number} [padH] ConvolutionParameter padH
         * @property {number} [padW] ConvolutionParameter padW
         * @property {number} [kernelH] ConvolutionParameter kernelH
         * @property {number} [kernelW] ConvolutionParameter kernelW
         * @property {number} [strideH] ConvolutionParameter strideH
         * @property {number} [strideW] ConvolutionParameter strideW
         * @property {number} [group] ConvolutionParameter group
         * @property {caffe.IFillerParameter} [weightFiller] ConvolutionParameter weightFiller
         * @property {caffe.IFillerParameter} [biasFiller] ConvolutionParameter biasFiller
         * @property {caffe.ConvolutionParameter.Engine} [engine] ConvolutionParameter engine
         * @property {number} [axis] ConvolutionParameter axis
         * @property {boolean} [forceNdIm2col] ConvolutionParameter forceNdIm2col
         */

        /**
         * Constructs a new ConvolutionParameter.
         * @memberof caffe
         * @classdesc Represents a ConvolutionParameter.
         * @constructor
         * @param {caffe.IConvolutionParameter=} [properties] Properties to set
         */
        function ConvolutionParameter(properties) {
            this.pad = [];
            this.kernelSize = [];
            this.stride = [];
            this.dilation = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ConvolutionParameter numOutput.
         * @member {number}numOutput
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.numOutput = 0;

        /**
         * ConvolutionParameter biasTerm.
         * @member {boolean}biasTerm
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.biasTerm = true;

        /**
         * ConvolutionParameter pad.
         * @member {Array.<number>}pad
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.pad = $util.emptyArray;

        /**
         * ConvolutionParameter kernelSize.
         * @member {Array.<number>}kernelSize
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.kernelSize = $util.emptyArray;

        /**
         * ConvolutionParameter stride.
         * @member {Array.<number>}stride
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.stride = $util.emptyArray;

        /**
         * ConvolutionParameter dilation.
         * @member {Array.<number>}dilation
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.dilation = $util.emptyArray;

        /**
         * ConvolutionParameter padH.
         * @member {number}padH
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.padH = 0;

        /**
         * ConvolutionParameter padW.
         * @member {number}padW
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.padW = 0;

        /**
         * ConvolutionParameter kernelH.
         * @member {number}kernelH
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.kernelH = 0;

        /**
         * ConvolutionParameter kernelW.
         * @member {number}kernelW
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.kernelW = 0;

        /**
         * ConvolutionParameter strideH.
         * @member {number}strideH
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.strideH = 0;

        /**
         * ConvolutionParameter strideW.
         * @member {number}strideW
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.strideW = 0;

        /**
         * ConvolutionParameter group.
         * @member {number}group
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.group = 1;

        /**
         * ConvolutionParameter weightFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}weightFiller
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.weightFiller = null;

        /**
         * ConvolutionParameter biasFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}biasFiller
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.biasFiller = null;

        /**
         * ConvolutionParameter engine.
         * @member {caffe.ConvolutionParameter.Engine}engine
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.engine = 0;

        /**
         * ConvolutionParameter axis.
         * @member {number}axis
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.axis = 1;

        /**
         * ConvolutionParameter forceNdIm2col.
         * @member {boolean}forceNdIm2col
         * @memberof caffe.ConvolutionParameter
         * @instance
         */
        ConvolutionParameter.prototype.forceNdIm2col = false;

        /**
         * Creates a new ConvolutionParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ConvolutionParameter
         * @static
         * @param {caffe.IConvolutionParameter=} [properties] Properties to set
         * @returns {caffe.ConvolutionParameter} ConvolutionParameter instance
         */
        ConvolutionParameter.create = function create(properties) {
            return new ConvolutionParameter(properties);
        };

        /**
         * Encodes the specified ConvolutionParameter message. Does not implicitly {@link caffe.ConvolutionParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ConvolutionParameter
         * @static
         * @param {caffe.IConvolutionParameter} message ConvolutionParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConvolutionParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.numOutput);
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.biasTerm);
            if (message.pad != null && message.pad.length)
                for (var i = 0; i < message.pad.length; ++i)
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.pad[i]);
            if (message.kernelSize != null && message.kernelSize.length)
                for (var i = 0; i < message.kernelSize.length; ++i)
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.kernelSize[i]);
            if (message.group != null && message.hasOwnProperty("group"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.group);
            if (message.stride != null && message.stride.length)
                for (var i = 0; i < message.stride.length; ++i)
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.stride[i]);
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                $root.caffe.FillerParameter.encode(message.weightFiller, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                $root.caffe.FillerParameter.encode(message.biasFiller, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
            if (message.padH != null && message.hasOwnProperty("padH"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.padH);
            if (message.padW != null && message.hasOwnProperty("padW"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.padW);
            if (message.kernelH != null && message.hasOwnProperty("kernelH"))
                writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.kernelH);
            if (message.kernelW != null && message.hasOwnProperty("kernelW"))
                writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.kernelW);
            if (message.strideH != null && message.hasOwnProperty("strideH"))
                writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.strideH);
            if (message.strideW != null && message.hasOwnProperty("strideW"))
                writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.strideW);
            if (message.engine != null && message.hasOwnProperty("engine"))
                writer.uint32(/* id 15, wireType 0 =*/120).int32(message.engine);
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 16, wireType 0 =*/128).int32(message.axis);
            if (message.forceNdIm2col != null && message.hasOwnProperty("forceNdIm2col"))
                writer.uint32(/* id 17, wireType 0 =*/136).bool(message.forceNdIm2col);
            if (message.dilation != null && message.dilation.length)
                for (var i = 0; i < message.dilation.length; ++i)
                    writer.uint32(/* id 18, wireType 0 =*/144).uint32(message.dilation[i]);
            return writer;
        };

        /**
         * Encodes the specified ConvolutionParameter message, length delimited. Does not implicitly {@link caffe.ConvolutionParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ConvolutionParameter
         * @static
         * @param {caffe.IConvolutionParameter} message ConvolutionParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ConvolutionParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ConvolutionParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ConvolutionParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ConvolutionParameter} ConvolutionParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConvolutionParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ConvolutionParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.numOutput = reader.uint32();
                    break;
                case 2:
                    message.biasTerm = reader.bool();
                    break;
                case 3:
                    if (!(message.pad && message.pad.length))
                        message.pad = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.pad.push(reader.uint32());
                    } else
                        message.pad.push(reader.uint32());
                    break;
                case 4:
                    if (!(message.kernelSize && message.kernelSize.length))
                        message.kernelSize = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.kernelSize.push(reader.uint32());
                    } else
                        message.kernelSize.push(reader.uint32());
                    break;
                case 6:
                    if (!(message.stride && message.stride.length))
                        message.stride = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.stride.push(reader.uint32());
                    } else
                        message.stride.push(reader.uint32());
                    break;
                case 18:
                    if (!(message.dilation && message.dilation.length))
                        message.dilation = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.dilation.push(reader.uint32());
                    } else
                        message.dilation.push(reader.uint32());
                    break;
                case 9:
                    message.padH = reader.uint32();
                    break;
                case 10:
                    message.padW = reader.uint32();
                    break;
                case 11:
                    message.kernelH = reader.uint32();
                    break;
                case 12:
                    message.kernelW = reader.uint32();
                    break;
                case 13:
                    message.strideH = reader.uint32();
                    break;
                case 14:
                    message.strideW = reader.uint32();
                    break;
                case 5:
                    message.group = reader.uint32();
                    break;
                case 7:
                    message.weightFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 8:
                    message.biasFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.engine = reader.int32();
                    break;
                case 16:
                    message.axis = reader.int32();
                    break;
                case 17:
                    message.forceNdIm2col = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ConvolutionParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ConvolutionParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ConvolutionParameter} ConvolutionParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ConvolutionParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ConvolutionParameter message.
         * @function verify
         * @memberof caffe.ConvolutionParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ConvolutionParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                if (!$util.isInteger(message.numOutput))
                    return "numOutput: integer expected";
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                if (typeof message.biasTerm !== "boolean")
                    return "biasTerm: boolean expected";
            if (message.pad != null && message.hasOwnProperty("pad")) {
                if (!Array.isArray(message.pad))
                    return "pad: array expected";
                for (var i = 0; i < message.pad.length; ++i)
                    if (!$util.isInteger(message.pad[i]))
                        return "pad: integer[] expected";
            }
            if (message.kernelSize != null && message.hasOwnProperty("kernelSize")) {
                if (!Array.isArray(message.kernelSize))
                    return "kernelSize: array expected";
                for (var i = 0; i < message.kernelSize.length; ++i)
                    if (!$util.isInteger(message.kernelSize[i]))
                        return "kernelSize: integer[] expected";
            }
            if (message.stride != null && message.hasOwnProperty("stride")) {
                if (!Array.isArray(message.stride))
                    return "stride: array expected";
                for (var i = 0; i < message.stride.length; ++i)
                    if (!$util.isInteger(message.stride[i]))
                        return "stride: integer[] expected";
            }
            if (message.dilation != null && message.hasOwnProperty("dilation")) {
                if (!Array.isArray(message.dilation))
                    return "dilation: array expected";
                for (var i = 0; i < message.dilation.length; ++i)
                    if (!$util.isInteger(message.dilation[i]))
                        return "dilation: integer[] expected";
            }
            if (message.padH != null && message.hasOwnProperty("padH"))
                if (!$util.isInteger(message.padH))
                    return "padH: integer expected";
            if (message.padW != null && message.hasOwnProperty("padW"))
                if (!$util.isInteger(message.padW))
                    return "padW: integer expected";
            if (message.kernelH != null && message.hasOwnProperty("kernelH"))
                if (!$util.isInteger(message.kernelH))
                    return "kernelH: integer expected";
            if (message.kernelW != null && message.hasOwnProperty("kernelW"))
                if (!$util.isInteger(message.kernelW))
                    return "kernelW: integer expected";
            if (message.strideH != null && message.hasOwnProperty("strideH"))
                if (!$util.isInteger(message.strideH))
                    return "strideH: integer expected";
            if (message.strideW != null && message.hasOwnProperty("strideW"))
                if (!$util.isInteger(message.strideW))
                    return "strideW: integer expected";
            if (message.group != null && message.hasOwnProperty("group"))
                if (!$util.isInteger(message.group))
                    return "group: integer expected";
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller")) {
                var error = $root.caffe.FillerParameter.verify(message.weightFiller);
                if (error)
                    return "weightFiller." + error;
            }
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller")) {
                error = $root.caffe.FillerParameter.verify(message.biasFiller);
                if (error)
                    return "biasFiller." + error;
            }
            if (message.engine != null && message.hasOwnProperty("engine"))
                switch (message.engine) {
                default:
                    return "engine: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.forceNdIm2col != null && message.hasOwnProperty("forceNdIm2col"))
                if (typeof message.forceNdIm2col !== "boolean")
                    return "forceNdIm2col: boolean expected";
            return null;
        };

        /**
         * Creates a ConvolutionParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ConvolutionParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ConvolutionParameter} ConvolutionParameter
         */
        ConvolutionParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ConvolutionParameter)
                return object;
            var message = new $root.caffe.ConvolutionParameter();
            if (object.numOutput != null)
                message.numOutput = object.numOutput >>> 0;
            if (object.biasTerm != null)
                message.biasTerm = Boolean(object.biasTerm);
            if (object.pad) {
                if (!Array.isArray(object.pad))
                    throw TypeError(".caffe.ConvolutionParameter.pad: array expected");
                message.pad = [];
                for (var i = 0; i < object.pad.length; ++i)
                    message.pad[i] = object.pad[i] >>> 0;
            }
            if (object.kernelSize) {
                if (!Array.isArray(object.kernelSize))
                    throw TypeError(".caffe.ConvolutionParameter.kernelSize: array expected");
                message.kernelSize = [];
                for (var i = 0; i < object.kernelSize.length; ++i)
                    message.kernelSize[i] = object.kernelSize[i] >>> 0;
            }
            if (object.stride) {
                if (!Array.isArray(object.stride))
                    throw TypeError(".caffe.ConvolutionParameter.stride: array expected");
                message.stride = [];
                for (var i = 0; i < object.stride.length; ++i)
                    message.stride[i] = object.stride[i] >>> 0;
            }
            if (object.dilation) {
                if (!Array.isArray(object.dilation))
                    throw TypeError(".caffe.ConvolutionParameter.dilation: array expected");
                message.dilation = [];
                for (var i = 0; i < object.dilation.length; ++i)
                    message.dilation[i] = object.dilation[i] >>> 0;
            }
            if (object.padH != null)
                message.padH = object.padH >>> 0;
            if (object.padW != null)
                message.padW = object.padW >>> 0;
            if (object.kernelH != null)
                message.kernelH = object.kernelH >>> 0;
            if (object.kernelW != null)
                message.kernelW = object.kernelW >>> 0;
            if (object.strideH != null)
                message.strideH = object.strideH >>> 0;
            if (object.strideW != null)
                message.strideW = object.strideW >>> 0;
            if (object.group != null)
                message.group = object.group >>> 0;
            if (object.weightFiller != null) {
                if (typeof object.weightFiller !== "object")
                    throw TypeError(".caffe.ConvolutionParameter.weightFiller: object expected");
                message.weightFiller = $root.caffe.FillerParameter.fromObject(object.weightFiller);
            }
            if (object.biasFiller != null) {
                if (typeof object.biasFiller !== "object")
                    throw TypeError(".caffe.ConvolutionParameter.biasFiller: object expected");
                message.biasFiller = $root.caffe.FillerParameter.fromObject(object.biasFiller);
            }
            switch (object.engine) {
            case "DEFAULT":
            case 0:
                message.engine = 0;
                break;
            case "CAFFE":
            case 1:
                message.engine = 1;
                break;
            case "CUDNN":
            case 2:
                message.engine = 2;
                break;
            }
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.forceNdIm2col != null)
                message.forceNdIm2col = Boolean(object.forceNdIm2col);
            return message;
        };

        /**
         * Creates a plain object from a ConvolutionParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ConvolutionParameter
         * @static
         * @param {caffe.ConvolutionParameter} message ConvolutionParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ConvolutionParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.pad = [];
                object.kernelSize = [];
                object.stride = [];
                object.dilation = [];
            }
            if (options.defaults) {
                object.numOutput = 0;
                object.biasTerm = true;
                object.group = 1;
                object.weightFiller = null;
                object.biasFiller = null;
                object.padH = 0;
                object.padW = 0;
                object.kernelH = 0;
                object.kernelW = 0;
                object.strideH = 0;
                object.strideW = 0;
                object.engine = options.enums === String ? "DEFAULT" : 0;
                object.axis = 1;
                object.forceNdIm2col = false;
            }
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                object.numOutput = message.numOutput;
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                object.biasTerm = message.biasTerm;
            if (message.pad && message.pad.length) {
                object.pad = [];
                for (var j = 0; j < message.pad.length; ++j)
                    object.pad[j] = message.pad[j];
            }
            if (message.kernelSize && message.kernelSize.length) {
                object.kernelSize = [];
                for (var j = 0; j < message.kernelSize.length; ++j)
                    object.kernelSize[j] = message.kernelSize[j];
            }
            if (message.group != null && message.hasOwnProperty("group"))
                object.group = message.group;
            if (message.stride && message.stride.length) {
                object.stride = [];
                for (var j = 0; j < message.stride.length; ++j)
                    object.stride[j] = message.stride[j];
            }
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                object.weightFiller = $root.caffe.FillerParameter.toObject(message.weightFiller, options);
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                object.biasFiller = $root.caffe.FillerParameter.toObject(message.biasFiller, options);
            if (message.padH != null && message.hasOwnProperty("padH"))
                object.padH = message.padH;
            if (message.padW != null && message.hasOwnProperty("padW"))
                object.padW = message.padW;
            if (message.kernelH != null && message.hasOwnProperty("kernelH"))
                object.kernelH = message.kernelH;
            if (message.kernelW != null && message.hasOwnProperty("kernelW"))
                object.kernelW = message.kernelW;
            if (message.strideH != null && message.hasOwnProperty("strideH"))
                object.strideH = message.strideH;
            if (message.strideW != null && message.hasOwnProperty("strideW"))
                object.strideW = message.strideW;
            if (message.engine != null && message.hasOwnProperty("engine"))
                object.engine = options.enums === String ? $root.caffe.ConvolutionParameter.Engine[message.engine] : message.engine;
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.forceNdIm2col != null && message.hasOwnProperty("forceNdIm2col"))
                object.forceNdIm2col = message.forceNdIm2col;
            if (message.dilation && message.dilation.length) {
                object.dilation = [];
                for (var j = 0; j < message.dilation.length; ++j)
                    object.dilation[j] = message.dilation[j];
            }
            return object;
        };

        /**
         * Converts this ConvolutionParameter to JSON.
         * @function toJSON
         * @memberof caffe.ConvolutionParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ConvolutionParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Engine enum.
         * @enum {string}
         * @property {number} DEFAULT=0 DEFAULT value
         * @property {number} CAFFE=1 CAFFE value
         * @property {number} CUDNN=2 CUDNN value
         */
        ConvolutionParameter.Engine = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DEFAULT"] = 0;
            values[valuesById[1] = "CAFFE"] = 1;
            values[valuesById[2] = "CUDNN"] = 2;
            return values;
        })();

        return ConvolutionParameter;
    })();

    caffe.CropParameter = (function() {

        /**
         * Properties of a CropParameter.
         * @memberof caffe
         * @interface ICropParameter
         * @property {number} [axis] CropParameter axis
         * @property {Array.<number>} [offset] CropParameter offset
         */

        /**
         * Constructs a new CropParameter.
         * @memberof caffe
         * @classdesc Represents a CropParameter.
         * @constructor
         * @param {caffe.ICropParameter=} [properties] Properties to set
         */
        function CropParameter(properties) {
            this.offset = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CropParameter axis.
         * @member {number}axis
         * @memberof caffe.CropParameter
         * @instance
         */
        CropParameter.prototype.axis = 2;

        /**
         * CropParameter offset.
         * @member {Array.<number>}offset
         * @memberof caffe.CropParameter
         * @instance
         */
        CropParameter.prototype.offset = $util.emptyArray;

        /**
         * Creates a new CropParameter instance using the specified properties.
         * @function create
         * @memberof caffe.CropParameter
         * @static
         * @param {caffe.ICropParameter=} [properties] Properties to set
         * @returns {caffe.CropParameter} CropParameter instance
         */
        CropParameter.create = function create(properties) {
            return new CropParameter(properties);
        };

        /**
         * Encodes the specified CropParameter message. Does not implicitly {@link caffe.CropParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.CropParameter
         * @static
         * @param {caffe.ICropParameter} message CropParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CropParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.axis);
            if (message.offset != null && message.offset.length)
                for (var i = 0; i < message.offset.length; ++i)
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.offset[i]);
            return writer;
        };

        /**
         * Encodes the specified CropParameter message, length delimited. Does not implicitly {@link caffe.CropParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.CropParameter
         * @static
         * @param {caffe.ICropParameter} message CropParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CropParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CropParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.CropParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.CropParameter} CropParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CropParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.CropParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.axis = reader.int32();
                    break;
                case 2:
                    if (!(message.offset && message.offset.length))
                        message.offset = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.offset.push(reader.uint32());
                    } else
                        message.offset.push(reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CropParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.CropParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.CropParameter} CropParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CropParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CropParameter message.
         * @function verify
         * @memberof caffe.CropParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CropParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.offset != null && message.hasOwnProperty("offset")) {
                if (!Array.isArray(message.offset))
                    return "offset: array expected";
                for (var i = 0; i < message.offset.length; ++i)
                    if (!$util.isInteger(message.offset[i]))
                        return "offset: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a CropParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.CropParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.CropParameter} CropParameter
         */
        CropParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.CropParameter)
                return object;
            var message = new $root.caffe.CropParameter();
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.offset) {
                if (!Array.isArray(object.offset))
                    throw TypeError(".caffe.CropParameter.offset: array expected");
                message.offset = [];
                for (var i = 0; i < object.offset.length; ++i)
                    message.offset[i] = object.offset[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a CropParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.CropParameter
         * @static
         * @param {caffe.CropParameter} message CropParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CropParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.offset = [];
            if (options.defaults)
                object.axis = 2;
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.offset && message.offset.length) {
                object.offset = [];
                for (var j = 0; j < message.offset.length; ++j)
                    object.offset[j] = message.offset[j];
            }
            return object;
        };

        /**
         * Converts this CropParameter to JSON.
         * @function toJSON
         * @memberof caffe.CropParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CropParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return CropParameter;
    })();

    caffe.DataParameter = (function() {

        /**
         * Properties of a DataParameter.
         * @memberof caffe
         * @interface IDataParameter
         * @property {string} [source] DataParameter source
         * @property {number} [batchSize] DataParameter batchSize
         * @property {number} [randSkip] DataParameter randSkip
         * @property {caffe.DataParameter.DB} [backend] DataParameter backend
         * @property {number} [scale] DataParameter scale
         * @property {string} [meanFile] DataParameter meanFile
         * @property {number} [cropSize] DataParameter cropSize
         * @property {boolean} [mirror] DataParameter mirror
         * @property {boolean} [forceEncodedColor] DataParameter forceEncodedColor
         * @property {number} [prefetch] DataParameter prefetch
         */

        /**
         * Constructs a new DataParameter.
         * @memberof caffe
         * @classdesc Represents a DataParameter.
         * @constructor
         * @param {caffe.IDataParameter=} [properties] Properties to set
         */
        function DataParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DataParameter source.
         * @member {string}source
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.source = "";

        /**
         * DataParameter batchSize.
         * @member {number}batchSize
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.batchSize = 0;

        /**
         * DataParameter randSkip.
         * @member {number}randSkip
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.randSkip = 0;

        /**
         * DataParameter backend.
         * @member {caffe.DataParameter.DB}backend
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.backend = 0;

        /**
         * DataParameter scale.
         * @member {number}scale
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.scale = 1;

        /**
         * DataParameter meanFile.
         * @member {string}meanFile
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.meanFile = "";

        /**
         * DataParameter cropSize.
         * @member {number}cropSize
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.cropSize = 0;

        /**
         * DataParameter mirror.
         * @member {boolean}mirror
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.mirror = false;

        /**
         * DataParameter forceEncodedColor.
         * @member {boolean}forceEncodedColor
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.forceEncodedColor = false;

        /**
         * DataParameter prefetch.
         * @member {number}prefetch
         * @memberof caffe.DataParameter
         * @instance
         */
        DataParameter.prototype.prefetch = 4;

        /**
         * Creates a new DataParameter instance using the specified properties.
         * @function create
         * @memberof caffe.DataParameter
         * @static
         * @param {caffe.IDataParameter=} [properties] Properties to set
         * @returns {caffe.DataParameter} DataParameter instance
         */
        DataParameter.create = function create(properties) {
            return new DataParameter(properties);
        };

        /**
         * Encodes the specified DataParameter message. Does not implicitly {@link caffe.DataParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.DataParameter
         * @static
         * @param {caffe.IDataParameter} message DataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DataParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.source != null && message.hasOwnProperty("source"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
            if (message.scale != null && message.hasOwnProperty("scale"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.scale);
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.meanFile);
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.batchSize);
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.cropSize);
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.mirror);
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.randSkip);
            if (message.backend != null && message.hasOwnProperty("backend"))
                writer.uint32(/* id 8, wireType 0 =*/64).int32(message.backend);
            if (message.forceEncodedColor != null && message.hasOwnProperty("forceEncodedColor"))
                writer.uint32(/* id 9, wireType 0 =*/72).bool(message.forceEncodedColor);
            if (message.prefetch != null && message.hasOwnProperty("prefetch"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.prefetch);
            return writer;
        };

        /**
         * Encodes the specified DataParameter message, length delimited. Does not implicitly {@link caffe.DataParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.DataParameter
         * @static
         * @param {caffe.IDataParameter} message DataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DataParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DataParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.DataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.DataParameter} DataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DataParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.DataParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.source = reader.string();
                    break;
                case 4:
                    message.batchSize = reader.uint32();
                    break;
                case 7:
                    message.randSkip = reader.uint32();
                    break;
                case 8:
                    message.backend = reader.int32();
                    break;
                case 2:
                    message.scale = reader.float();
                    break;
                case 3:
                    message.meanFile = reader.string();
                    break;
                case 5:
                    message.cropSize = reader.uint32();
                    break;
                case 6:
                    message.mirror = reader.bool();
                    break;
                case 9:
                    message.forceEncodedColor = reader.bool();
                    break;
                case 10:
                    message.prefetch = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DataParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.DataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.DataParameter} DataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DataParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DataParameter message.
         * @function verify
         * @memberof caffe.DataParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DataParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                if (!$util.isInteger(message.batchSize))
                    return "batchSize: integer expected";
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                if (!$util.isInteger(message.randSkip))
                    return "randSkip: integer expected";
            if (message.backend != null && message.hasOwnProperty("backend"))
                switch (message.backend) {
                default:
                    return "backend: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.scale != null && message.hasOwnProperty("scale"))
                if (typeof message.scale !== "number")
                    return "scale: number expected";
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                if (!$util.isString(message.meanFile))
                    return "meanFile: string expected";
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                if (!$util.isInteger(message.cropSize))
                    return "cropSize: integer expected";
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                if (typeof message.mirror !== "boolean")
                    return "mirror: boolean expected";
            if (message.forceEncodedColor != null && message.hasOwnProperty("forceEncodedColor"))
                if (typeof message.forceEncodedColor !== "boolean")
                    return "forceEncodedColor: boolean expected";
            if (message.prefetch != null && message.hasOwnProperty("prefetch"))
                if (!$util.isInteger(message.prefetch))
                    return "prefetch: integer expected";
            return null;
        };

        /**
         * Creates a DataParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.DataParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.DataParameter} DataParameter
         */
        DataParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.DataParameter)
                return object;
            var message = new $root.caffe.DataParameter();
            if (object.source != null)
                message.source = String(object.source);
            if (object.batchSize != null)
                message.batchSize = object.batchSize >>> 0;
            if (object.randSkip != null)
                message.randSkip = object.randSkip >>> 0;
            switch (object.backend) {
            case "LEVELDB":
            case 0:
                message.backend = 0;
                break;
            case "LMDB":
            case 1:
                message.backend = 1;
                break;
            }
            if (object.scale != null)
                message.scale = Number(object.scale);
            if (object.meanFile != null)
                message.meanFile = String(object.meanFile);
            if (object.cropSize != null)
                message.cropSize = object.cropSize >>> 0;
            if (object.mirror != null)
                message.mirror = Boolean(object.mirror);
            if (object.forceEncodedColor != null)
                message.forceEncodedColor = Boolean(object.forceEncodedColor);
            if (object.prefetch != null)
                message.prefetch = object.prefetch >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a DataParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.DataParameter
         * @static
         * @param {caffe.DataParameter} message DataParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DataParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.source = "";
                object.scale = 1;
                object.meanFile = "";
                object.batchSize = 0;
                object.cropSize = 0;
                object.mirror = false;
                object.randSkip = 0;
                object.backend = options.enums === String ? "LEVELDB" : 0;
                object.forceEncodedColor = false;
                object.prefetch = 4;
            }
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = options.json && !isFinite(message.scale) ? String(message.scale) : message.scale;
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                object.meanFile = message.meanFile;
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                object.batchSize = message.batchSize;
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                object.cropSize = message.cropSize;
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                object.mirror = message.mirror;
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                object.randSkip = message.randSkip;
            if (message.backend != null && message.hasOwnProperty("backend"))
                object.backend = options.enums === String ? $root.caffe.DataParameter.DB[message.backend] : message.backend;
            if (message.forceEncodedColor != null && message.hasOwnProperty("forceEncodedColor"))
                object.forceEncodedColor = message.forceEncodedColor;
            if (message.prefetch != null && message.hasOwnProperty("prefetch"))
                object.prefetch = message.prefetch;
            return object;
        };

        /**
         * Converts this DataParameter to JSON.
         * @function toJSON
         * @memberof caffe.DataParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DataParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * DB enum.
         * @enum {string}
         * @property {number} LEVELDB=0 LEVELDB value
         * @property {number} LMDB=1 LMDB value
         */
        DataParameter.DB = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "LEVELDB"] = 0;
            values[valuesById[1] = "LMDB"] = 1;
            return values;
        })();

        return DataParameter;
    })();

    caffe.DropoutParameter = (function() {

        /**
         * Properties of a DropoutParameter.
         * @memberof caffe
         * @interface IDropoutParameter
         * @property {number} [dropoutRatio] DropoutParameter dropoutRatio
         */

        /**
         * Constructs a new DropoutParameter.
         * @memberof caffe
         * @classdesc Represents a DropoutParameter.
         * @constructor
         * @param {caffe.IDropoutParameter=} [properties] Properties to set
         */
        function DropoutParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DropoutParameter dropoutRatio.
         * @member {number}dropoutRatio
         * @memberof caffe.DropoutParameter
         * @instance
         */
        DropoutParameter.prototype.dropoutRatio = 0.5;

        /**
         * Creates a new DropoutParameter instance using the specified properties.
         * @function create
         * @memberof caffe.DropoutParameter
         * @static
         * @param {caffe.IDropoutParameter=} [properties] Properties to set
         * @returns {caffe.DropoutParameter} DropoutParameter instance
         */
        DropoutParameter.create = function create(properties) {
            return new DropoutParameter(properties);
        };

        /**
         * Encodes the specified DropoutParameter message. Does not implicitly {@link caffe.DropoutParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.DropoutParameter
         * @static
         * @param {caffe.IDropoutParameter} message DropoutParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DropoutParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.dropoutRatio != null && message.hasOwnProperty("dropoutRatio"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.dropoutRatio);
            return writer;
        };

        /**
         * Encodes the specified DropoutParameter message, length delimited. Does not implicitly {@link caffe.DropoutParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.DropoutParameter
         * @static
         * @param {caffe.IDropoutParameter} message DropoutParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DropoutParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DropoutParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.DropoutParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.DropoutParameter} DropoutParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DropoutParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.DropoutParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.dropoutRatio = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DropoutParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.DropoutParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.DropoutParameter} DropoutParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DropoutParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DropoutParameter message.
         * @function verify
         * @memberof caffe.DropoutParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DropoutParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.dropoutRatio != null && message.hasOwnProperty("dropoutRatio"))
                if (typeof message.dropoutRatio !== "number")
                    return "dropoutRatio: number expected";
            return null;
        };

        /**
         * Creates a DropoutParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.DropoutParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.DropoutParameter} DropoutParameter
         */
        DropoutParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.DropoutParameter)
                return object;
            var message = new $root.caffe.DropoutParameter();
            if (object.dropoutRatio != null)
                message.dropoutRatio = Number(object.dropoutRatio);
            return message;
        };

        /**
         * Creates a plain object from a DropoutParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.DropoutParameter
         * @static
         * @param {caffe.DropoutParameter} message DropoutParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DropoutParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.dropoutRatio = 0.5;
            if (message.dropoutRatio != null && message.hasOwnProperty("dropoutRatio"))
                object.dropoutRatio = options.json && !isFinite(message.dropoutRatio) ? String(message.dropoutRatio) : message.dropoutRatio;
            return object;
        };

        /**
         * Converts this DropoutParameter to JSON.
         * @function toJSON
         * @memberof caffe.DropoutParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DropoutParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DropoutParameter;
    })();

    caffe.DummyDataParameter = (function() {

        /**
         * Properties of a DummyDataParameter.
         * @memberof caffe
         * @interface IDummyDataParameter
         * @property {Array.<caffe.IFillerParameter>} [dataFiller] DummyDataParameter dataFiller
         * @property {Array.<caffe.IBlobShape>} [shape] DummyDataParameter shape
         * @property {Array.<number>} [num] DummyDataParameter num
         * @property {Array.<number>} [channels] DummyDataParameter channels
         * @property {Array.<number>} [height] DummyDataParameter height
         * @property {Array.<number>} [width] DummyDataParameter width
         */

        /**
         * Constructs a new DummyDataParameter.
         * @memberof caffe
         * @classdesc Represents a DummyDataParameter.
         * @constructor
         * @param {caffe.IDummyDataParameter=} [properties] Properties to set
         */
        function DummyDataParameter(properties) {
            this.dataFiller = [];
            this.shape = [];
            this.num = [];
            this.channels = [];
            this.height = [];
            this.width = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * DummyDataParameter dataFiller.
         * @member {Array.<caffe.IFillerParameter>}dataFiller
         * @memberof caffe.DummyDataParameter
         * @instance
         */
        DummyDataParameter.prototype.dataFiller = $util.emptyArray;

        /**
         * DummyDataParameter shape.
         * @member {Array.<caffe.IBlobShape>}shape
         * @memberof caffe.DummyDataParameter
         * @instance
         */
        DummyDataParameter.prototype.shape = $util.emptyArray;

        /**
         * DummyDataParameter num.
         * @member {Array.<number>}num
         * @memberof caffe.DummyDataParameter
         * @instance
         */
        DummyDataParameter.prototype.num = $util.emptyArray;

        /**
         * DummyDataParameter channels.
         * @member {Array.<number>}channels
         * @memberof caffe.DummyDataParameter
         * @instance
         */
        DummyDataParameter.prototype.channels = $util.emptyArray;

        /**
         * DummyDataParameter height.
         * @member {Array.<number>}height
         * @memberof caffe.DummyDataParameter
         * @instance
         */
        DummyDataParameter.prototype.height = $util.emptyArray;

        /**
         * DummyDataParameter width.
         * @member {Array.<number>}width
         * @memberof caffe.DummyDataParameter
         * @instance
         */
        DummyDataParameter.prototype.width = $util.emptyArray;

        /**
         * Creates a new DummyDataParameter instance using the specified properties.
         * @function create
         * @memberof caffe.DummyDataParameter
         * @static
         * @param {caffe.IDummyDataParameter=} [properties] Properties to set
         * @returns {caffe.DummyDataParameter} DummyDataParameter instance
         */
        DummyDataParameter.create = function create(properties) {
            return new DummyDataParameter(properties);
        };

        /**
         * Encodes the specified DummyDataParameter message. Does not implicitly {@link caffe.DummyDataParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.DummyDataParameter
         * @static
         * @param {caffe.IDummyDataParameter} message DummyDataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DummyDataParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.dataFiller != null && message.dataFiller.length)
                for (var i = 0; i < message.dataFiller.length; ++i)
                    $root.caffe.FillerParameter.encode(message.dataFiller[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.num != null && message.num.length)
                for (var i = 0; i < message.num.length; ++i)
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.num[i]);
            if (message.channels != null && message.channels.length)
                for (var i = 0; i < message.channels.length; ++i)
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.channels[i]);
            if (message.height != null && message.height.length)
                for (var i = 0; i < message.height.length; ++i)
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.height[i]);
            if (message.width != null && message.width.length)
                for (var i = 0; i < message.width.length; ++i)
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.width[i]);
            if (message.shape != null && message.shape.length)
                for (var i = 0; i < message.shape.length; ++i)
                    $root.caffe.BlobShape.encode(message.shape[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified DummyDataParameter message, length delimited. Does not implicitly {@link caffe.DummyDataParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.DummyDataParameter
         * @static
         * @param {caffe.IDummyDataParameter} message DummyDataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        DummyDataParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a DummyDataParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.DummyDataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.DummyDataParameter} DummyDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DummyDataParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.DummyDataParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.dataFiller && message.dataFiller.length))
                        message.dataFiller = [];
                    message.dataFiller.push($root.caffe.FillerParameter.decode(reader, reader.uint32()));
                    break;
                case 6:
                    if (!(message.shape && message.shape.length))
                        message.shape = [];
                    message.shape.push($root.caffe.BlobShape.decode(reader, reader.uint32()));
                    break;
                case 2:
                    if (!(message.num && message.num.length))
                        message.num = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.num.push(reader.uint32());
                    } else
                        message.num.push(reader.uint32());
                    break;
                case 3:
                    if (!(message.channels && message.channels.length))
                        message.channels = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.channels.push(reader.uint32());
                    } else
                        message.channels.push(reader.uint32());
                    break;
                case 4:
                    if (!(message.height && message.height.length))
                        message.height = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.height.push(reader.uint32());
                    } else
                        message.height.push(reader.uint32());
                    break;
                case 5:
                    if (!(message.width && message.width.length))
                        message.width = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.width.push(reader.uint32());
                    } else
                        message.width.push(reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a DummyDataParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.DummyDataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.DummyDataParameter} DummyDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        DummyDataParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a DummyDataParameter message.
         * @function verify
         * @memberof caffe.DummyDataParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        DummyDataParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.dataFiller != null && message.hasOwnProperty("dataFiller")) {
                if (!Array.isArray(message.dataFiller))
                    return "dataFiller: array expected";
                for (var i = 0; i < message.dataFiller.length; ++i) {
                    var error = $root.caffe.FillerParameter.verify(message.dataFiller[i]);
                    if (error)
                        return "dataFiller." + error;
                }
            }
            if (message.shape != null && message.hasOwnProperty("shape")) {
                if (!Array.isArray(message.shape))
                    return "shape: array expected";
                for (var i = 0; i < message.shape.length; ++i) {
                    error = $root.caffe.BlobShape.verify(message.shape[i]);
                    if (error)
                        return "shape." + error;
                }
            }
            if (message.num != null && message.hasOwnProperty("num")) {
                if (!Array.isArray(message.num))
                    return "num: array expected";
                for (var i = 0; i < message.num.length; ++i)
                    if (!$util.isInteger(message.num[i]))
                        return "num: integer[] expected";
            }
            if (message.channels != null && message.hasOwnProperty("channels")) {
                if (!Array.isArray(message.channels))
                    return "channels: array expected";
                for (var i = 0; i < message.channels.length; ++i)
                    if (!$util.isInteger(message.channels[i]))
                        return "channels: integer[] expected";
            }
            if (message.height != null && message.hasOwnProperty("height")) {
                if (!Array.isArray(message.height))
                    return "height: array expected";
                for (var i = 0; i < message.height.length; ++i)
                    if (!$util.isInteger(message.height[i]))
                        return "height: integer[] expected";
            }
            if (message.width != null && message.hasOwnProperty("width")) {
                if (!Array.isArray(message.width))
                    return "width: array expected";
                for (var i = 0; i < message.width.length; ++i)
                    if (!$util.isInteger(message.width[i]))
                        return "width: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a DummyDataParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.DummyDataParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.DummyDataParameter} DummyDataParameter
         */
        DummyDataParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.DummyDataParameter)
                return object;
            var message = new $root.caffe.DummyDataParameter();
            if (object.dataFiller) {
                if (!Array.isArray(object.dataFiller))
                    throw TypeError(".caffe.DummyDataParameter.dataFiller: array expected");
                message.dataFiller = [];
                for (var i = 0; i < object.dataFiller.length; ++i) {
                    if (typeof object.dataFiller[i] !== "object")
                        throw TypeError(".caffe.DummyDataParameter.dataFiller: object expected");
                    message.dataFiller[i] = $root.caffe.FillerParameter.fromObject(object.dataFiller[i]);
                }
            }
            if (object.shape) {
                if (!Array.isArray(object.shape))
                    throw TypeError(".caffe.DummyDataParameter.shape: array expected");
                message.shape = [];
                for (var i = 0; i < object.shape.length; ++i) {
                    if (typeof object.shape[i] !== "object")
                        throw TypeError(".caffe.DummyDataParameter.shape: object expected");
                    message.shape[i] = $root.caffe.BlobShape.fromObject(object.shape[i]);
                }
            }
            if (object.num) {
                if (!Array.isArray(object.num))
                    throw TypeError(".caffe.DummyDataParameter.num: array expected");
                message.num = [];
                for (var i = 0; i < object.num.length; ++i)
                    message.num[i] = object.num[i] >>> 0;
            }
            if (object.channels) {
                if (!Array.isArray(object.channels))
                    throw TypeError(".caffe.DummyDataParameter.channels: array expected");
                message.channels = [];
                for (var i = 0; i < object.channels.length; ++i)
                    message.channels[i] = object.channels[i] >>> 0;
            }
            if (object.height) {
                if (!Array.isArray(object.height))
                    throw TypeError(".caffe.DummyDataParameter.height: array expected");
                message.height = [];
                for (var i = 0; i < object.height.length; ++i)
                    message.height[i] = object.height[i] >>> 0;
            }
            if (object.width) {
                if (!Array.isArray(object.width))
                    throw TypeError(".caffe.DummyDataParameter.width: array expected");
                message.width = [];
                for (var i = 0; i < object.width.length; ++i)
                    message.width[i] = object.width[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a DummyDataParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.DummyDataParameter
         * @static
         * @param {caffe.DummyDataParameter} message DummyDataParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        DummyDataParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.dataFiller = [];
                object.num = [];
                object.channels = [];
                object.height = [];
                object.width = [];
                object.shape = [];
            }
            if (message.dataFiller && message.dataFiller.length) {
                object.dataFiller = [];
                for (var j = 0; j < message.dataFiller.length; ++j)
                    object.dataFiller[j] = $root.caffe.FillerParameter.toObject(message.dataFiller[j], options);
            }
            if (message.num && message.num.length) {
                object.num = [];
                for (var j = 0; j < message.num.length; ++j)
                    object.num[j] = message.num[j];
            }
            if (message.channels && message.channels.length) {
                object.channels = [];
                for (var j = 0; j < message.channels.length; ++j)
                    object.channels[j] = message.channels[j];
            }
            if (message.height && message.height.length) {
                object.height = [];
                for (var j = 0; j < message.height.length; ++j)
                    object.height[j] = message.height[j];
            }
            if (message.width && message.width.length) {
                object.width = [];
                for (var j = 0; j < message.width.length; ++j)
                    object.width[j] = message.width[j];
            }
            if (message.shape && message.shape.length) {
                object.shape = [];
                for (var j = 0; j < message.shape.length; ++j)
                    object.shape[j] = $root.caffe.BlobShape.toObject(message.shape[j], options);
            }
            return object;
        };

        /**
         * Converts this DummyDataParameter to JSON.
         * @function toJSON
         * @memberof caffe.DummyDataParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        DummyDataParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return DummyDataParameter;
    })();

    caffe.EltwiseParameter = (function() {

        /**
         * Properties of an EltwiseParameter.
         * @memberof caffe
         * @interface IEltwiseParameter
         * @property {caffe.EltwiseParameter.EltwiseOp} [operation] EltwiseParameter operation
         * @property {Array.<number>} [coeff] EltwiseParameter coeff
         * @property {boolean} [stableProdGrad] EltwiseParameter stableProdGrad
         */

        /**
         * Constructs a new EltwiseParameter.
         * @memberof caffe
         * @classdesc Represents an EltwiseParameter.
         * @constructor
         * @param {caffe.IEltwiseParameter=} [properties] Properties to set
         */
        function EltwiseParameter(properties) {
            this.coeff = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EltwiseParameter operation.
         * @member {caffe.EltwiseParameter.EltwiseOp}operation
         * @memberof caffe.EltwiseParameter
         * @instance
         */
        EltwiseParameter.prototype.operation = 1;

        /**
         * EltwiseParameter coeff.
         * @member {Array.<number>}coeff
         * @memberof caffe.EltwiseParameter
         * @instance
         */
        EltwiseParameter.prototype.coeff = $util.emptyArray;

        /**
         * EltwiseParameter stableProdGrad.
         * @member {boolean}stableProdGrad
         * @memberof caffe.EltwiseParameter
         * @instance
         */
        EltwiseParameter.prototype.stableProdGrad = true;

        /**
         * Creates a new EltwiseParameter instance using the specified properties.
         * @function create
         * @memberof caffe.EltwiseParameter
         * @static
         * @param {caffe.IEltwiseParameter=} [properties] Properties to set
         * @returns {caffe.EltwiseParameter} EltwiseParameter instance
         */
        EltwiseParameter.create = function create(properties) {
            return new EltwiseParameter(properties);
        };

        /**
         * Encodes the specified EltwiseParameter message. Does not implicitly {@link caffe.EltwiseParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.EltwiseParameter
         * @static
         * @param {caffe.IEltwiseParameter} message EltwiseParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EltwiseParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.operation != null && message.hasOwnProperty("operation"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.operation);
            if (message.coeff != null && message.coeff.length)
                for (var i = 0; i < message.coeff.length; ++i)
                    writer.uint32(/* id 2, wireType 5 =*/21).float(message.coeff[i]);
            if (message.stableProdGrad != null && message.hasOwnProperty("stableProdGrad"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.stableProdGrad);
            return writer;
        };

        /**
         * Encodes the specified EltwiseParameter message, length delimited. Does not implicitly {@link caffe.EltwiseParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.EltwiseParameter
         * @static
         * @param {caffe.IEltwiseParameter} message EltwiseParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EltwiseParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EltwiseParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.EltwiseParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.EltwiseParameter} EltwiseParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EltwiseParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.EltwiseParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.operation = reader.int32();
                    break;
                case 2:
                    if (!(message.coeff && message.coeff.length))
                        message.coeff = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.coeff.push(reader.float());
                    } else
                        message.coeff.push(reader.float());
                    break;
                case 3:
                    message.stableProdGrad = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EltwiseParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.EltwiseParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.EltwiseParameter} EltwiseParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EltwiseParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EltwiseParameter message.
         * @function verify
         * @memberof caffe.EltwiseParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EltwiseParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.operation != null && message.hasOwnProperty("operation"))
                switch (message.operation) {
                default:
                    return "operation: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.coeff != null && message.hasOwnProperty("coeff")) {
                if (!Array.isArray(message.coeff))
                    return "coeff: array expected";
                for (var i = 0; i < message.coeff.length; ++i)
                    if (typeof message.coeff[i] !== "number")
                        return "coeff: number[] expected";
            }
            if (message.stableProdGrad != null && message.hasOwnProperty("stableProdGrad"))
                if (typeof message.stableProdGrad !== "boolean")
                    return "stableProdGrad: boolean expected";
            return null;
        };

        /**
         * Creates an EltwiseParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.EltwiseParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.EltwiseParameter} EltwiseParameter
         */
        EltwiseParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.EltwiseParameter)
                return object;
            var message = new $root.caffe.EltwiseParameter();
            switch (object.operation) {
            case "PROD":
            case 0:
                message.operation = 0;
                break;
            case "SUM":
            case 1:
                message.operation = 1;
                break;
            case "MAX":
            case 2:
                message.operation = 2;
                break;
            }
            if (object.coeff) {
                if (!Array.isArray(object.coeff))
                    throw TypeError(".caffe.EltwiseParameter.coeff: array expected");
                message.coeff = [];
                for (var i = 0; i < object.coeff.length; ++i)
                    message.coeff[i] = Number(object.coeff[i]);
            }
            if (object.stableProdGrad != null)
                message.stableProdGrad = Boolean(object.stableProdGrad);
            return message;
        };

        /**
         * Creates a plain object from an EltwiseParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.EltwiseParameter
         * @static
         * @param {caffe.EltwiseParameter} message EltwiseParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EltwiseParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.coeff = [];
            if (options.defaults) {
                object.operation = options.enums === String ? "SUM" : 1;
                object.stableProdGrad = true;
            }
            if (message.operation != null && message.hasOwnProperty("operation"))
                object.operation = options.enums === String ? $root.caffe.EltwiseParameter.EltwiseOp[message.operation] : message.operation;
            if (message.coeff && message.coeff.length) {
                object.coeff = [];
                for (var j = 0; j < message.coeff.length; ++j)
                    object.coeff[j] = options.json && !isFinite(message.coeff[j]) ? String(message.coeff[j]) : message.coeff[j];
            }
            if (message.stableProdGrad != null && message.hasOwnProperty("stableProdGrad"))
                object.stableProdGrad = message.stableProdGrad;
            return object;
        };

        /**
         * Converts this EltwiseParameter to JSON.
         * @function toJSON
         * @memberof caffe.EltwiseParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EltwiseParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * EltwiseOp enum.
         * @enum {string}
         * @property {number} PROD=0 PROD value
         * @property {number} SUM=1 SUM value
         * @property {number} MAX=2 MAX value
         */
        EltwiseParameter.EltwiseOp = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "PROD"] = 0;
            values[valuesById[1] = "SUM"] = 1;
            values[valuesById[2] = "MAX"] = 2;
            return values;
        })();

        return EltwiseParameter;
    })();

    caffe.ELUParameter = (function() {

        /**
         * Properties of a ELUParameter.
         * @memberof caffe
         * @interface IELUParameter
         * @property {number} [alpha] ELUParameter alpha
         */

        /**
         * Constructs a new ELUParameter.
         * @memberof caffe
         * @classdesc Represents a ELUParameter.
         * @constructor
         * @param {caffe.IELUParameter=} [properties] Properties to set
         */
        function ELUParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ELUParameter alpha.
         * @member {number}alpha
         * @memberof caffe.ELUParameter
         * @instance
         */
        ELUParameter.prototype.alpha = 1;

        /**
         * Creates a new ELUParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ELUParameter
         * @static
         * @param {caffe.IELUParameter=} [properties] Properties to set
         * @returns {caffe.ELUParameter} ELUParameter instance
         */
        ELUParameter.create = function create(properties) {
            return new ELUParameter(properties);
        };

        /**
         * Encodes the specified ELUParameter message. Does not implicitly {@link caffe.ELUParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ELUParameter
         * @static
         * @param {caffe.IELUParameter} message ELUParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ELUParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.alpha);
            return writer;
        };

        /**
         * Encodes the specified ELUParameter message, length delimited. Does not implicitly {@link caffe.ELUParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ELUParameter
         * @static
         * @param {caffe.IELUParameter} message ELUParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ELUParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ELUParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ELUParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ELUParameter} ELUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ELUParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ELUParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.alpha = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ELUParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ELUParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ELUParameter} ELUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ELUParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ELUParameter message.
         * @function verify
         * @memberof caffe.ELUParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ELUParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                if (typeof message.alpha !== "number")
                    return "alpha: number expected";
            return null;
        };

        /**
         * Creates a ELUParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ELUParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ELUParameter} ELUParameter
         */
        ELUParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ELUParameter)
                return object;
            var message = new $root.caffe.ELUParameter();
            if (object.alpha != null)
                message.alpha = Number(object.alpha);
            return message;
        };

        /**
         * Creates a plain object from a ELUParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ELUParameter
         * @static
         * @param {caffe.ELUParameter} message ELUParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ELUParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.alpha = 1;
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                object.alpha = options.json && !isFinite(message.alpha) ? String(message.alpha) : message.alpha;
            return object;
        };

        /**
         * Converts this ELUParameter to JSON.
         * @function toJSON
         * @memberof caffe.ELUParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ELUParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ELUParameter;
    })();

    caffe.EmbedParameter = (function() {

        /**
         * Properties of an EmbedParameter.
         * @memberof caffe
         * @interface IEmbedParameter
         * @property {number} [numOutput] EmbedParameter numOutput
         * @property {number} [inputDim] EmbedParameter inputDim
         * @property {boolean} [biasTerm] EmbedParameter biasTerm
         * @property {caffe.IFillerParameter} [weightFiller] EmbedParameter weightFiller
         * @property {caffe.IFillerParameter} [biasFiller] EmbedParameter biasFiller
         */

        /**
         * Constructs a new EmbedParameter.
         * @memberof caffe
         * @classdesc Represents an EmbedParameter.
         * @constructor
         * @param {caffe.IEmbedParameter=} [properties] Properties to set
         */
        function EmbedParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * EmbedParameter numOutput.
         * @member {number}numOutput
         * @memberof caffe.EmbedParameter
         * @instance
         */
        EmbedParameter.prototype.numOutput = 0;

        /**
         * EmbedParameter inputDim.
         * @member {number}inputDim
         * @memberof caffe.EmbedParameter
         * @instance
         */
        EmbedParameter.prototype.inputDim = 0;

        /**
         * EmbedParameter biasTerm.
         * @member {boolean}biasTerm
         * @memberof caffe.EmbedParameter
         * @instance
         */
        EmbedParameter.prototype.biasTerm = true;

        /**
         * EmbedParameter weightFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}weightFiller
         * @memberof caffe.EmbedParameter
         * @instance
         */
        EmbedParameter.prototype.weightFiller = null;

        /**
         * EmbedParameter biasFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}biasFiller
         * @memberof caffe.EmbedParameter
         * @instance
         */
        EmbedParameter.prototype.biasFiller = null;

        /**
         * Creates a new EmbedParameter instance using the specified properties.
         * @function create
         * @memberof caffe.EmbedParameter
         * @static
         * @param {caffe.IEmbedParameter=} [properties] Properties to set
         * @returns {caffe.EmbedParameter} EmbedParameter instance
         */
        EmbedParameter.create = function create(properties) {
            return new EmbedParameter(properties);
        };

        /**
         * Encodes the specified EmbedParameter message. Does not implicitly {@link caffe.EmbedParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.EmbedParameter
         * @static
         * @param {caffe.IEmbedParameter} message EmbedParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmbedParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.numOutput);
            if (message.inputDim != null && message.hasOwnProperty("inputDim"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.inputDim);
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.biasTerm);
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                $root.caffe.FillerParameter.encode(message.weightFiller, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                $root.caffe.FillerParameter.encode(message.biasFiller, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified EmbedParameter message, length delimited. Does not implicitly {@link caffe.EmbedParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.EmbedParameter
         * @static
         * @param {caffe.IEmbedParameter} message EmbedParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        EmbedParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an EmbedParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.EmbedParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.EmbedParameter} EmbedParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmbedParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.EmbedParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.numOutput = reader.uint32();
                    break;
                case 2:
                    message.inputDim = reader.uint32();
                    break;
                case 3:
                    message.biasTerm = reader.bool();
                    break;
                case 4:
                    message.weightFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.biasFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an EmbedParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.EmbedParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.EmbedParameter} EmbedParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        EmbedParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an EmbedParameter message.
         * @function verify
         * @memberof caffe.EmbedParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        EmbedParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                if (!$util.isInteger(message.numOutput))
                    return "numOutput: integer expected";
            if (message.inputDim != null && message.hasOwnProperty("inputDim"))
                if (!$util.isInteger(message.inputDim))
                    return "inputDim: integer expected";
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                if (typeof message.biasTerm !== "boolean")
                    return "biasTerm: boolean expected";
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller")) {
                var error = $root.caffe.FillerParameter.verify(message.weightFiller);
                if (error)
                    return "weightFiller." + error;
            }
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller")) {
                error = $root.caffe.FillerParameter.verify(message.biasFiller);
                if (error)
                    return "biasFiller." + error;
            }
            return null;
        };

        /**
         * Creates an EmbedParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.EmbedParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.EmbedParameter} EmbedParameter
         */
        EmbedParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.EmbedParameter)
                return object;
            var message = new $root.caffe.EmbedParameter();
            if (object.numOutput != null)
                message.numOutput = object.numOutput >>> 0;
            if (object.inputDim != null)
                message.inputDim = object.inputDim >>> 0;
            if (object.biasTerm != null)
                message.biasTerm = Boolean(object.biasTerm);
            if (object.weightFiller != null) {
                if (typeof object.weightFiller !== "object")
                    throw TypeError(".caffe.EmbedParameter.weightFiller: object expected");
                message.weightFiller = $root.caffe.FillerParameter.fromObject(object.weightFiller);
            }
            if (object.biasFiller != null) {
                if (typeof object.biasFiller !== "object")
                    throw TypeError(".caffe.EmbedParameter.biasFiller: object expected");
                message.biasFiller = $root.caffe.FillerParameter.fromObject(object.biasFiller);
            }
            return message;
        };

        /**
         * Creates a plain object from an EmbedParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.EmbedParameter
         * @static
         * @param {caffe.EmbedParameter} message EmbedParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        EmbedParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.numOutput = 0;
                object.inputDim = 0;
                object.biasTerm = true;
                object.weightFiller = null;
                object.biasFiller = null;
            }
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                object.numOutput = message.numOutput;
            if (message.inputDim != null && message.hasOwnProperty("inputDim"))
                object.inputDim = message.inputDim;
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                object.biasTerm = message.biasTerm;
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                object.weightFiller = $root.caffe.FillerParameter.toObject(message.weightFiller, options);
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                object.biasFiller = $root.caffe.FillerParameter.toObject(message.biasFiller, options);
            return object;
        };

        /**
         * Converts this EmbedParameter to JSON.
         * @function toJSON
         * @memberof caffe.EmbedParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        EmbedParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return EmbedParameter;
    })();

    caffe.ExpParameter = (function() {

        /**
         * Properties of an ExpParameter.
         * @memberof caffe
         * @interface IExpParameter
         * @property {number} [base] ExpParameter base
         * @property {number} [scale] ExpParameter scale
         * @property {number} [shift] ExpParameter shift
         */

        /**
         * Constructs a new ExpParameter.
         * @memberof caffe
         * @classdesc Represents an ExpParameter.
         * @constructor
         * @param {caffe.IExpParameter=} [properties] Properties to set
         */
        function ExpParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ExpParameter base.
         * @member {number}base
         * @memberof caffe.ExpParameter
         * @instance
         */
        ExpParameter.prototype.base = -1;

        /**
         * ExpParameter scale.
         * @member {number}scale
         * @memberof caffe.ExpParameter
         * @instance
         */
        ExpParameter.prototype.scale = 1;

        /**
         * ExpParameter shift.
         * @member {number}shift
         * @memberof caffe.ExpParameter
         * @instance
         */
        ExpParameter.prototype.shift = 0;

        /**
         * Creates a new ExpParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ExpParameter
         * @static
         * @param {caffe.IExpParameter=} [properties] Properties to set
         * @returns {caffe.ExpParameter} ExpParameter instance
         */
        ExpParameter.create = function create(properties) {
            return new ExpParameter(properties);
        };

        /**
         * Encodes the specified ExpParameter message. Does not implicitly {@link caffe.ExpParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ExpParameter
         * @static
         * @param {caffe.IExpParameter} message ExpParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExpParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.base != null && message.hasOwnProperty("base"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.base);
            if (message.scale != null && message.hasOwnProperty("scale"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.scale);
            if (message.shift != null && message.hasOwnProperty("shift"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.shift);
            return writer;
        };

        /**
         * Encodes the specified ExpParameter message, length delimited. Does not implicitly {@link caffe.ExpParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ExpParameter
         * @static
         * @param {caffe.IExpParameter} message ExpParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ExpParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ExpParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ExpParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ExpParameter} ExpParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExpParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ExpParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.base = reader.float();
                    break;
                case 2:
                    message.scale = reader.float();
                    break;
                case 3:
                    message.shift = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ExpParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ExpParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ExpParameter} ExpParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ExpParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ExpParameter message.
         * @function verify
         * @memberof caffe.ExpParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ExpParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.base != null && message.hasOwnProperty("base"))
                if (typeof message.base !== "number")
                    return "base: number expected";
            if (message.scale != null && message.hasOwnProperty("scale"))
                if (typeof message.scale !== "number")
                    return "scale: number expected";
            if (message.shift != null && message.hasOwnProperty("shift"))
                if (typeof message.shift !== "number")
                    return "shift: number expected";
            return null;
        };

        /**
         * Creates an ExpParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ExpParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ExpParameter} ExpParameter
         */
        ExpParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ExpParameter)
                return object;
            var message = new $root.caffe.ExpParameter();
            if (object.base != null)
                message.base = Number(object.base);
            if (object.scale != null)
                message.scale = Number(object.scale);
            if (object.shift != null)
                message.shift = Number(object.shift);
            return message;
        };

        /**
         * Creates a plain object from an ExpParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ExpParameter
         * @static
         * @param {caffe.ExpParameter} message ExpParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ExpParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.base = -1;
                object.scale = 1;
                object.shift = 0;
            }
            if (message.base != null && message.hasOwnProperty("base"))
                object.base = options.json && !isFinite(message.base) ? String(message.base) : message.base;
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = options.json && !isFinite(message.scale) ? String(message.scale) : message.scale;
            if (message.shift != null && message.hasOwnProperty("shift"))
                object.shift = options.json && !isFinite(message.shift) ? String(message.shift) : message.shift;
            return object;
        };

        /**
         * Converts this ExpParameter to JSON.
         * @function toJSON
         * @memberof caffe.ExpParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ExpParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ExpParameter;
    })();

    caffe.FlattenParameter = (function() {

        /**
         * Properties of a FlattenParameter.
         * @memberof caffe
         * @interface IFlattenParameter
         * @property {number} [axis] FlattenParameter axis
         * @property {number} [endAxis] FlattenParameter endAxis
         */

        /**
         * Constructs a new FlattenParameter.
         * @memberof caffe
         * @classdesc Message that stores parameters used by FlattenLayer
         * @constructor
         * @param {caffe.IFlattenParameter=} [properties] Properties to set
         */
        function FlattenParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FlattenParameter axis.
         * @member {number}axis
         * @memberof caffe.FlattenParameter
         * @instance
         */
        FlattenParameter.prototype.axis = 1;

        /**
         * FlattenParameter endAxis.
         * @member {number}endAxis
         * @memberof caffe.FlattenParameter
         * @instance
         */
        FlattenParameter.prototype.endAxis = -1;

        /**
         * Creates a new FlattenParameter instance using the specified properties.
         * @function create
         * @memberof caffe.FlattenParameter
         * @static
         * @param {caffe.IFlattenParameter=} [properties] Properties to set
         * @returns {caffe.FlattenParameter} FlattenParameter instance
         */
        FlattenParameter.create = function create(properties) {
            return new FlattenParameter(properties);
        };

        /**
         * Encodes the specified FlattenParameter message. Does not implicitly {@link caffe.FlattenParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.FlattenParameter
         * @static
         * @param {caffe.IFlattenParameter} message FlattenParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FlattenParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.axis);
            if (message.endAxis != null && message.hasOwnProperty("endAxis"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.endAxis);
            return writer;
        };

        /**
         * Encodes the specified FlattenParameter message, length delimited. Does not implicitly {@link caffe.FlattenParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.FlattenParameter
         * @static
         * @param {caffe.IFlattenParameter} message FlattenParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FlattenParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FlattenParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.FlattenParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.FlattenParameter} FlattenParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FlattenParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.FlattenParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.axis = reader.int32();
                    break;
                case 2:
                    message.endAxis = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a FlattenParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.FlattenParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.FlattenParameter} FlattenParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FlattenParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FlattenParameter message.
         * @function verify
         * @memberof caffe.FlattenParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FlattenParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.endAxis != null && message.hasOwnProperty("endAxis"))
                if (!$util.isInteger(message.endAxis))
                    return "endAxis: integer expected";
            return null;
        };

        /**
         * Creates a FlattenParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.FlattenParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.FlattenParameter} FlattenParameter
         */
        FlattenParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.FlattenParameter)
                return object;
            var message = new $root.caffe.FlattenParameter();
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.endAxis != null)
                message.endAxis = object.endAxis | 0;
            return message;
        };

        /**
         * Creates a plain object from a FlattenParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.FlattenParameter
         * @static
         * @param {caffe.FlattenParameter} message FlattenParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FlattenParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.axis = 1;
                object.endAxis = -1;
            }
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.endAxis != null && message.hasOwnProperty("endAxis"))
                object.endAxis = message.endAxis;
            return object;
        };

        /**
         * Converts this FlattenParameter to JSON.
         * @function toJSON
         * @memberof caffe.FlattenParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FlattenParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return FlattenParameter;
    })();

    caffe.HDF5DataParameter = (function() {

        /**
         * Properties of a HDF5DataParameter.
         * @memberof caffe
         * @interface IHDF5DataParameter
         * @property {string} [source] HDF5DataParameter source
         * @property {number} [batchSize] HDF5DataParameter batchSize
         * @property {boolean} [shuffle] HDF5DataParameter shuffle
         */

        /**
         * Constructs a new HDF5DataParameter.
         * @memberof caffe
         * @classdesc Represents a HDF5DataParameter.
         * @constructor
         * @param {caffe.IHDF5DataParameter=} [properties] Properties to set
         */
        function HDF5DataParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HDF5DataParameter source.
         * @member {string}source
         * @memberof caffe.HDF5DataParameter
         * @instance
         */
        HDF5DataParameter.prototype.source = "";

        /**
         * HDF5DataParameter batchSize.
         * @member {number}batchSize
         * @memberof caffe.HDF5DataParameter
         * @instance
         */
        HDF5DataParameter.prototype.batchSize = 0;

        /**
         * HDF5DataParameter shuffle.
         * @member {boolean}shuffle
         * @memberof caffe.HDF5DataParameter
         * @instance
         */
        HDF5DataParameter.prototype.shuffle = false;

        /**
         * Creates a new HDF5DataParameter instance using the specified properties.
         * @function create
         * @memberof caffe.HDF5DataParameter
         * @static
         * @param {caffe.IHDF5DataParameter=} [properties] Properties to set
         * @returns {caffe.HDF5DataParameter} HDF5DataParameter instance
         */
        HDF5DataParameter.create = function create(properties) {
            return new HDF5DataParameter(properties);
        };

        /**
         * Encodes the specified HDF5DataParameter message. Does not implicitly {@link caffe.HDF5DataParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.HDF5DataParameter
         * @static
         * @param {caffe.IHDF5DataParameter} message HDF5DataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HDF5DataParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.source != null && message.hasOwnProperty("source"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.batchSize);
            if (message.shuffle != null && message.hasOwnProperty("shuffle"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.shuffle);
            return writer;
        };

        /**
         * Encodes the specified HDF5DataParameter message, length delimited. Does not implicitly {@link caffe.HDF5DataParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.HDF5DataParameter
         * @static
         * @param {caffe.IHDF5DataParameter} message HDF5DataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HDF5DataParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HDF5DataParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.HDF5DataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.HDF5DataParameter} HDF5DataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HDF5DataParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.HDF5DataParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.source = reader.string();
                    break;
                case 2:
                    message.batchSize = reader.uint32();
                    break;
                case 3:
                    message.shuffle = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HDF5DataParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.HDF5DataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.HDF5DataParameter} HDF5DataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HDF5DataParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HDF5DataParameter message.
         * @function verify
         * @memberof caffe.HDF5DataParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HDF5DataParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                if (!$util.isInteger(message.batchSize))
                    return "batchSize: integer expected";
            if (message.shuffle != null && message.hasOwnProperty("shuffle"))
                if (typeof message.shuffle !== "boolean")
                    return "shuffle: boolean expected";
            return null;
        };

        /**
         * Creates a HDF5DataParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.HDF5DataParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.HDF5DataParameter} HDF5DataParameter
         */
        HDF5DataParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.HDF5DataParameter)
                return object;
            var message = new $root.caffe.HDF5DataParameter();
            if (object.source != null)
                message.source = String(object.source);
            if (object.batchSize != null)
                message.batchSize = object.batchSize >>> 0;
            if (object.shuffle != null)
                message.shuffle = Boolean(object.shuffle);
            return message;
        };

        /**
         * Creates a plain object from a HDF5DataParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.HDF5DataParameter
         * @static
         * @param {caffe.HDF5DataParameter} message HDF5DataParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HDF5DataParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.source = "";
                object.batchSize = 0;
                object.shuffle = false;
            }
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                object.batchSize = message.batchSize;
            if (message.shuffle != null && message.hasOwnProperty("shuffle"))
                object.shuffle = message.shuffle;
            return object;
        };

        /**
         * Converts this HDF5DataParameter to JSON.
         * @function toJSON
         * @memberof caffe.HDF5DataParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HDF5DataParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HDF5DataParameter;
    })();

    caffe.HDF5OutputParameter = (function() {

        /**
         * Properties of a HDF5OutputParameter.
         * @memberof caffe
         * @interface IHDF5OutputParameter
         * @property {string} [fileName] HDF5OutputParameter fileName
         */

        /**
         * Constructs a new HDF5OutputParameter.
         * @memberof caffe
         * @classdesc Represents a HDF5OutputParameter.
         * @constructor
         * @param {caffe.IHDF5OutputParameter=} [properties] Properties to set
         */
        function HDF5OutputParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HDF5OutputParameter fileName.
         * @member {string}fileName
         * @memberof caffe.HDF5OutputParameter
         * @instance
         */
        HDF5OutputParameter.prototype.fileName = "";

        /**
         * Creates a new HDF5OutputParameter instance using the specified properties.
         * @function create
         * @memberof caffe.HDF5OutputParameter
         * @static
         * @param {caffe.IHDF5OutputParameter=} [properties] Properties to set
         * @returns {caffe.HDF5OutputParameter} HDF5OutputParameter instance
         */
        HDF5OutputParameter.create = function create(properties) {
            return new HDF5OutputParameter(properties);
        };

        /**
         * Encodes the specified HDF5OutputParameter message. Does not implicitly {@link caffe.HDF5OutputParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.HDF5OutputParameter
         * @static
         * @param {caffe.IHDF5OutputParameter} message HDF5OutputParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HDF5OutputParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.fileName);
            return writer;
        };

        /**
         * Encodes the specified HDF5OutputParameter message, length delimited. Does not implicitly {@link caffe.HDF5OutputParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.HDF5OutputParameter
         * @static
         * @param {caffe.IHDF5OutputParameter} message HDF5OutputParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HDF5OutputParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HDF5OutputParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.HDF5OutputParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.HDF5OutputParameter} HDF5OutputParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HDF5OutputParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.HDF5OutputParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.fileName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HDF5OutputParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.HDF5OutputParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.HDF5OutputParameter} HDF5OutputParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HDF5OutputParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HDF5OutputParameter message.
         * @function verify
         * @memberof caffe.HDF5OutputParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HDF5OutputParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                if (!$util.isString(message.fileName))
                    return "fileName: string expected";
            return null;
        };

        /**
         * Creates a HDF5OutputParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.HDF5OutputParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.HDF5OutputParameter} HDF5OutputParameter
         */
        HDF5OutputParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.HDF5OutputParameter)
                return object;
            var message = new $root.caffe.HDF5OutputParameter();
            if (object.fileName != null)
                message.fileName = String(object.fileName);
            return message;
        };

        /**
         * Creates a plain object from a HDF5OutputParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.HDF5OutputParameter
         * @static
         * @param {caffe.HDF5OutputParameter} message HDF5OutputParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HDF5OutputParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.fileName = "";
            if (message.fileName != null && message.hasOwnProperty("fileName"))
                object.fileName = message.fileName;
            return object;
        };

        /**
         * Converts this HDF5OutputParameter to JSON.
         * @function toJSON
         * @memberof caffe.HDF5OutputParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HDF5OutputParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return HDF5OutputParameter;
    })();

    caffe.HingeLossParameter = (function() {

        /**
         * Properties of a HingeLossParameter.
         * @memberof caffe
         * @interface IHingeLossParameter
         * @property {caffe.HingeLossParameter.Norm} [norm] HingeLossParameter norm
         */

        /**
         * Constructs a new HingeLossParameter.
         * @memberof caffe
         * @classdesc Represents a HingeLossParameter.
         * @constructor
         * @param {caffe.IHingeLossParameter=} [properties] Properties to set
         */
        function HingeLossParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * HingeLossParameter norm.
         * @member {caffe.HingeLossParameter.Norm}norm
         * @memberof caffe.HingeLossParameter
         * @instance
         */
        HingeLossParameter.prototype.norm = 1;

        /**
         * Creates a new HingeLossParameter instance using the specified properties.
         * @function create
         * @memberof caffe.HingeLossParameter
         * @static
         * @param {caffe.IHingeLossParameter=} [properties] Properties to set
         * @returns {caffe.HingeLossParameter} HingeLossParameter instance
         */
        HingeLossParameter.create = function create(properties) {
            return new HingeLossParameter(properties);
        };

        /**
         * Encodes the specified HingeLossParameter message. Does not implicitly {@link caffe.HingeLossParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.HingeLossParameter
         * @static
         * @param {caffe.IHingeLossParameter} message HingeLossParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HingeLossParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.norm != null && message.hasOwnProperty("norm"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.norm);
            return writer;
        };

        /**
         * Encodes the specified HingeLossParameter message, length delimited. Does not implicitly {@link caffe.HingeLossParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.HingeLossParameter
         * @static
         * @param {caffe.IHingeLossParameter} message HingeLossParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        HingeLossParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a HingeLossParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.HingeLossParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.HingeLossParameter} HingeLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HingeLossParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.HingeLossParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.norm = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a HingeLossParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.HingeLossParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.HingeLossParameter} HingeLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        HingeLossParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a HingeLossParameter message.
         * @function verify
         * @memberof caffe.HingeLossParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        HingeLossParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.norm != null && message.hasOwnProperty("norm"))
                switch (message.norm) {
                default:
                    return "norm: enum value expected";
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a HingeLossParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.HingeLossParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.HingeLossParameter} HingeLossParameter
         */
        HingeLossParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.HingeLossParameter)
                return object;
            var message = new $root.caffe.HingeLossParameter();
            switch (object.norm) {
            case "L1":
            case 1:
                message.norm = 1;
                break;
            case "L2":
            case 2:
                message.norm = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a HingeLossParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.HingeLossParameter
         * @static
         * @param {caffe.HingeLossParameter} message HingeLossParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        HingeLossParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.norm = options.enums === String ? "L1" : 1;
            if (message.norm != null && message.hasOwnProperty("norm"))
                object.norm = options.enums === String ? $root.caffe.HingeLossParameter.Norm[message.norm] : message.norm;
            return object;
        };

        /**
         * Converts this HingeLossParameter to JSON.
         * @function toJSON
         * @memberof caffe.HingeLossParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        HingeLossParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Norm enum.
         * @enum {string}
         * @property {number} L1=1 L1 value
         * @property {number} L2=2 L2 value
         */
        HingeLossParameter.Norm = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "L1"] = 1;
            values[valuesById[2] = "L2"] = 2;
            return values;
        })();

        return HingeLossParameter;
    })();

    caffe.ImageDataParameter = (function() {

        /**
         * Properties of an ImageDataParameter.
         * @memberof caffe
         * @interface IImageDataParameter
         * @property {string} [source] ImageDataParameter source
         * @property {number} [batchSize] ImageDataParameter batchSize
         * @property {number} [randSkip] ImageDataParameter randSkip
         * @property {boolean} [shuffle] ImageDataParameter shuffle
         * @property {number} [newHeight] ImageDataParameter newHeight
         * @property {number} [newWidth] ImageDataParameter newWidth
         * @property {boolean} [isColor] ImageDataParameter isColor
         * @property {number} [scale] ImageDataParameter scale
         * @property {string} [meanFile] ImageDataParameter meanFile
         * @property {number} [cropSize] ImageDataParameter cropSize
         * @property {boolean} [mirror] ImageDataParameter mirror
         * @property {string} [rootFolder] ImageDataParameter rootFolder
         */

        /**
         * Constructs a new ImageDataParameter.
         * @memberof caffe
         * @classdesc Represents an ImageDataParameter.
         * @constructor
         * @param {caffe.IImageDataParameter=} [properties] Properties to set
         */
        function ImageDataParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ImageDataParameter source.
         * @member {string}source
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.source = "";

        /**
         * ImageDataParameter batchSize.
         * @member {number}batchSize
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.batchSize = 1;

        /**
         * ImageDataParameter randSkip.
         * @member {number}randSkip
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.randSkip = 0;

        /**
         * ImageDataParameter shuffle.
         * @member {boolean}shuffle
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.shuffle = false;

        /**
         * ImageDataParameter newHeight.
         * @member {number}newHeight
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.newHeight = 0;

        /**
         * ImageDataParameter newWidth.
         * @member {number}newWidth
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.newWidth = 0;

        /**
         * ImageDataParameter isColor.
         * @member {boolean}isColor
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.isColor = true;

        /**
         * ImageDataParameter scale.
         * @member {number}scale
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.scale = 1;

        /**
         * ImageDataParameter meanFile.
         * @member {string}meanFile
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.meanFile = "";

        /**
         * ImageDataParameter cropSize.
         * @member {number}cropSize
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.cropSize = 0;

        /**
         * ImageDataParameter mirror.
         * @member {boolean}mirror
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.mirror = false;

        /**
         * ImageDataParameter rootFolder.
         * @member {string}rootFolder
         * @memberof caffe.ImageDataParameter
         * @instance
         */
        ImageDataParameter.prototype.rootFolder = "";

        /**
         * Creates a new ImageDataParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ImageDataParameter
         * @static
         * @param {caffe.IImageDataParameter=} [properties] Properties to set
         * @returns {caffe.ImageDataParameter} ImageDataParameter instance
         */
        ImageDataParameter.create = function create(properties) {
            return new ImageDataParameter(properties);
        };

        /**
         * Encodes the specified ImageDataParameter message. Does not implicitly {@link caffe.ImageDataParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ImageDataParameter
         * @static
         * @param {caffe.IImageDataParameter} message ImageDataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ImageDataParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.source != null && message.hasOwnProperty("source"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
            if (message.scale != null && message.hasOwnProperty("scale"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.scale);
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.meanFile);
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.batchSize);
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.cropSize);
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.mirror);
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.randSkip);
            if (message.shuffle != null && message.hasOwnProperty("shuffle"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.shuffle);
            if (message.newHeight != null && message.hasOwnProperty("newHeight"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.newHeight);
            if (message.newWidth != null && message.hasOwnProperty("newWidth"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.newWidth);
            if (message.isColor != null && message.hasOwnProperty("isColor"))
                writer.uint32(/* id 11, wireType 0 =*/88).bool(message.isColor);
            if (message.rootFolder != null && message.hasOwnProperty("rootFolder"))
                writer.uint32(/* id 12, wireType 2 =*/98).string(message.rootFolder);
            return writer;
        };

        /**
         * Encodes the specified ImageDataParameter message, length delimited. Does not implicitly {@link caffe.ImageDataParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ImageDataParameter
         * @static
         * @param {caffe.IImageDataParameter} message ImageDataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ImageDataParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an ImageDataParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ImageDataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ImageDataParameter} ImageDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ImageDataParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ImageDataParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.source = reader.string();
                    break;
                case 4:
                    message.batchSize = reader.uint32();
                    break;
                case 7:
                    message.randSkip = reader.uint32();
                    break;
                case 8:
                    message.shuffle = reader.bool();
                    break;
                case 9:
                    message.newHeight = reader.uint32();
                    break;
                case 10:
                    message.newWidth = reader.uint32();
                    break;
                case 11:
                    message.isColor = reader.bool();
                    break;
                case 2:
                    message.scale = reader.float();
                    break;
                case 3:
                    message.meanFile = reader.string();
                    break;
                case 5:
                    message.cropSize = reader.uint32();
                    break;
                case 6:
                    message.mirror = reader.bool();
                    break;
                case 12:
                    message.rootFolder = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an ImageDataParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ImageDataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ImageDataParameter} ImageDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ImageDataParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an ImageDataParameter message.
         * @function verify
         * @memberof caffe.ImageDataParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ImageDataParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                if (!$util.isInteger(message.batchSize))
                    return "batchSize: integer expected";
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                if (!$util.isInteger(message.randSkip))
                    return "randSkip: integer expected";
            if (message.shuffle != null && message.hasOwnProperty("shuffle"))
                if (typeof message.shuffle !== "boolean")
                    return "shuffle: boolean expected";
            if (message.newHeight != null && message.hasOwnProperty("newHeight"))
                if (!$util.isInteger(message.newHeight))
                    return "newHeight: integer expected";
            if (message.newWidth != null && message.hasOwnProperty("newWidth"))
                if (!$util.isInteger(message.newWidth))
                    return "newWidth: integer expected";
            if (message.isColor != null && message.hasOwnProperty("isColor"))
                if (typeof message.isColor !== "boolean")
                    return "isColor: boolean expected";
            if (message.scale != null && message.hasOwnProperty("scale"))
                if (typeof message.scale !== "number")
                    return "scale: number expected";
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                if (!$util.isString(message.meanFile))
                    return "meanFile: string expected";
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                if (!$util.isInteger(message.cropSize))
                    return "cropSize: integer expected";
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                if (typeof message.mirror !== "boolean")
                    return "mirror: boolean expected";
            if (message.rootFolder != null && message.hasOwnProperty("rootFolder"))
                if (!$util.isString(message.rootFolder))
                    return "rootFolder: string expected";
            return null;
        };

        /**
         * Creates an ImageDataParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ImageDataParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ImageDataParameter} ImageDataParameter
         */
        ImageDataParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ImageDataParameter)
                return object;
            var message = new $root.caffe.ImageDataParameter();
            if (object.source != null)
                message.source = String(object.source);
            if (object.batchSize != null)
                message.batchSize = object.batchSize >>> 0;
            if (object.randSkip != null)
                message.randSkip = object.randSkip >>> 0;
            if (object.shuffle != null)
                message.shuffle = Boolean(object.shuffle);
            if (object.newHeight != null)
                message.newHeight = object.newHeight >>> 0;
            if (object.newWidth != null)
                message.newWidth = object.newWidth >>> 0;
            if (object.isColor != null)
                message.isColor = Boolean(object.isColor);
            if (object.scale != null)
                message.scale = Number(object.scale);
            if (object.meanFile != null)
                message.meanFile = String(object.meanFile);
            if (object.cropSize != null)
                message.cropSize = object.cropSize >>> 0;
            if (object.mirror != null)
                message.mirror = Boolean(object.mirror);
            if (object.rootFolder != null)
                message.rootFolder = String(object.rootFolder);
            return message;
        };

        /**
         * Creates a plain object from an ImageDataParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ImageDataParameter
         * @static
         * @param {caffe.ImageDataParameter} message ImageDataParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ImageDataParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.source = "";
                object.scale = 1;
                object.meanFile = "";
                object.batchSize = 1;
                object.cropSize = 0;
                object.mirror = false;
                object.randSkip = 0;
                object.shuffle = false;
                object.newHeight = 0;
                object.newWidth = 0;
                object.isColor = true;
                object.rootFolder = "";
            }
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = options.json && !isFinite(message.scale) ? String(message.scale) : message.scale;
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                object.meanFile = message.meanFile;
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                object.batchSize = message.batchSize;
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                object.cropSize = message.cropSize;
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                object.mirror = message.mirror;
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                object.randSkip = message.randSkip;
            if (message.shuffle != null && message.hasOwnProperty("shuffle"))
                object.shuffle = message.shuffle;
            if (message.newHeight != null && message.hasOwnProperty("newHeight"))
                object.newHeight = message.newHeight;
            if (message.newWidth != null && message.hasOwnProperty("newWidth"))
                object.newWidth = message.newWidth;
            if (message.isColor != null && message.hasOwnProperty("isColor"))
                object.isColor = message.isColor;
            if (message.rootFolder != null && message.hasOwnProperty("rootFolder"))
                object.rootFolder = message.rootFolder;
            return object;
        };

        /**
         * Converts this ImageDataParameter to JSON.
         * @function toJSON
         * @memberof caffe.ImageDataParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ImageDataParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ImageDataParameter;
    })();

    caffe.InfogainLossParameter = (function() {

        /**
         * Properties of an InfogainLossParameter.
         * @memberof caffe
         * @interface IInfogainLossParameter
         * @property {string} [source] InfogainLossParameter source
         * @property {number} [axis] InfogainLossParameter axis
         */

        /**
         * Constructs a new InfogainLossParameter.
         * @memberof caffe
         * @classdesc Represents an InfogainLossParameter.
         * @constructor
         * @param {caffe.IInfogainLossParameter=} [properties] Properties to set
         */
        function InfogainLossParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InfogainLossParameter source.
         * @member {string}source
         * @memberof caffe.InfogainLossParameter
         * @instance
         */
        InfogainLossParameter.prototype.source = "";

        /**
         * InfogainLossParameter axis.
         * @member {number}axis
         * @memberof caffe.InfogainLossParameter
         * @instance
         */
        InfogainLossParameter.prototype.axis = 1;

        /**
         * Creates a new InfogainLossParameter instance using the specified properties.
         * @function create
         * @memberof caffe.InfogainLossParameter
         * @static
         * @param {caffe.IInfogainLossParameter=} [properties] Properties to set
         * @returns {caffe.InfogainLossParameter} InfogainLossParameter instance
         */
        InfogainLossParameter.create = function create(properties) {
            return new InfogainLossParameter(properties);
        };

        /**
         * Encodes the specified InfogainLossParameter message. Does not implicitly {@link caffe.InfogainLossParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.InfogainLossParameter
         * @static
         * @param {caffe.IInfogainLossParameter} message InfogainLossParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InfogainLossParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.source != null && message.hasOwnProperty("source"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.axis);
            return writer;
        };

        /**
         * Encodes the specified InfogainLossParameter message, length delimited. Does not implicitly {@link caffe.InfogainLossParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.InfogainLossParameter
         * @static
         * @param {caffe.IInfogainLossParameter} message InfogainLossParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InfogainLossParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InfogainLossParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.InfogainLossParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.InfogainLossParameter} InfogainLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InfogainLossParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.InfogainLossParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.source = reader.string();
                    break;
                case 2:
                    message.axis = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InfogainLossParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.InfogainLossParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.InfogainLossParameter} InfogainLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InfogainLossParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InfogainLossParameter message.
         * @function verify
         * @memberof caffe.InfogainLossParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InfogainLossParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            return null;
        };

        /**
         * Creates an InfogainLossParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.InfogainLossParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.InfogainLossParameter} InfogainLossParameter
         */
        InfogainLossParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.InfogainLossParameter)
                return object;
            var message = new $root.caffe.InfogainLossParameter();
            if (object.source != null)
                message.source = String(object.source);
            if (object.axis != null)
                message.axis = object.axis | 0;
            return message;
        };

        /**
         * Creates a plain object from an InfogainLossParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.InfogainLossParameter
         * @static
         * @param {caffe.InfogainLossParameter} message InfogainLossParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InfogainLossParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.source = "";
                object.axis = 1;
            }
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            return object;
        };

        /**
         * Converts this InfogainLossParameter to JSON.
         * @function toJSON
         * @memberof caffe.InfogainLossParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InfogainLossParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InfogainLossParameter;
    })();

    caffe.InnerProductParameter = (function() {

        /**
         * Properties of an InnerProductParameter.
         * @memberof caffe
         * @interface IInnerProductParameter
         * @property {number} [numOutput] InnerProductParameter numOutput
         * @property {boolean} [biasTerm] InnerProductParameter biasTerm
         * @property {caffe.IFillerParameter} [weightFiller] InnerProductParameter weightFiller
         * @property {caffe.IFillerParameter} [biasFiller] InnerProductParameter biasFiller
         * @property {number} [axis] InnerProductParameter axis
         * @property {boolean} [transpose] InnerProductParameter transpose
         */

        /**
         * Constructs a new InnerProductParameter.
         * @memberof caffe
         * @classdesc Represents an InnerProductParameter.
         * @constructor
         * @param {caffe.IInnerProductParameter=} [properties] Properties to set
         */
        function InnerProductParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InnerProductParameter numOutput.
         * @member {number}numOutput
         * @memberof caffe.InnerProductParameter
         * @instance
         */
        InnerProductParameter.prototype.numOutput = 0;

        /**
         * InnerProductParameter biasTerm.
         * @member {boolean}biasTerm
         * @memberof caffe.InnerProductParameter
         * @instance
         */
        InnerProductParameter.prototype.biasTerm = true;

        /**
         * InnerProductParameter weightFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}weightFiller
         * @memberof caffe.InnerProductParameter
         * @instance
         */
        InnerProductParameter.prototype.weightFiller = null;

        /**
         * InnerProductParameter biasFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}biasFiller
         * @memberof caffe.InnerProductParameter
         * @instance
         */
        InnerProductParameter.prototype.biasFiller = null;

        /**
         * InnerProductParameter axis.
         * @member {number}axis
         * @memberof caffe.InnerProductParameter
         * @instance
         */
        InnerProductParameter.prototype.axis = 1;

        /**
         * InnerProductParameter transpose.
         * @member {boolean}transpose
         * @memberof caffe.InnerProductParameter
         * @instance
         */
        InnerProductParameter.prototype.transpose = false;

        /**
         * Creates a new InnerProductParameter instance using the specified properties.
         * @function create
         * @memberof caffe.InnerProductParameter
         * @static
         * @param {caffe.IInnerProductParameter=} [properties] Properties to set
         * @returns {caffe.InnerProductParameter} InnerProductParameter instance
         */
        InnerProductParameter.create = function create(properties) {
            return new InnerProductParameter(properties);
        };

        /**
         * Encodes the specified InnerProductParameter message. Does not implicitly {@link caffe.InnerProductParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.InnerProductParameter
         * @static
         * @param {caffe.IInnerProductParameter} message InnerProductParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InnerProductParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.numOutput);
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.biasTerm);
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                $root.caffe.FillerParameter.encode(message.weightFiller, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                $root.caffe.FillerParameter.encode(message.biasFiller, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.axis);
            if (message.transpose != null && message.hasOwnProperty("transpose"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.transpose);
            return writer;
        };

        /**
         * Encodes the specified InnerProductParameter message, length delimited. Does not implicitly {@link caffe.InnerProductParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.InnerProductParameter
         * @static
         * @param {caffe.IInnerProductParameter} message InnerProductParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InnerProductParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InnerProductParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.InnerProductParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.InnerProductParameter} InnerProductParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InnerProductParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.InnerProductParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.numOutput = reader.uint32();
                    break;
                case 2:
                    message.biasTerm = reader.bool();
                    break;
                case 3:
                    message.weightFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.biasFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 5:
                    message.axis = reader.int32();
                    break;
                case 6:
                    message.transpose = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InnerProductParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.InnerProductParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.InnerProductParameter} InnerProductParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InnerProductParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InnerProductParameter message.
         * @function verify
         * @memberof caffe.InnerProductParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InnerProductParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                if (!$util.isInteger(message.numOutput))
                    return "numOutput: integer expected";
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                if (typeof message.biasTerm !== "boolean")
                    return "biasTerm: boolean expected";
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller")) {
                var error = $root.caffe.FillerParameter.verify(message.weightFiller);
                if (error)
                    return "weightFiller." + error;
            }
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller")) {
                error = $root.caffe.FillerParameter.verify(message.biasFiller);
                if (error)
                    return "biasFiller." + error;
            }
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.transpose != null && message.hasOwnProperty("transpose"))
                if (typeof message.transpose !== "boolean")
                    return "transpose: boolean expected";
            return null;
        };

        /**
         * Creates an InnerProductParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.InnerProductParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.InnerProductParameter} InnerProductParameter
         */
        InnerProductParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.InnerProductParameter)
                return object;
            var message = new $root.caffe.InnerProductParameter();
            if (object.numOutput != null)
                message.numOutput = object.numOutput >>> 0;
            if (object.biasTerm != null)
                message.biasTerm = Boolean(object.biasTerm);
            if (object.weightFiller != null) {
                if (typeof object.weightFiller !== "object")
                    throw TypeError(".caffe.InnerProductParameter.weightFiller: object expected");
                message.weightFiller = $root.caffe.FillerParameter.fromObject(object.weightFiller);
            }
            if (object.biasFiller != null) {
                if (typeof object.biasFiller !== "object")
                    throw TypeError(".caffe.InnerProductParameter.biasFiller: object expected");
                message.biasFiller = $root.caffe.FillerParameter.fromObject(object.biasFiller);
            }
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.transpose != null)
                message.transpose = Boolean(object.transpose);
            return message;
        };

        /**
         * Creates a plain object from an InnerProductParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.InnerProductParameter
         * @static
         * @param {caffe.InnerProductParameter} message InnerProductParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InnerProductParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.numOutput = 0;
                object.biasTerm = true;
                object.weightFiller = null;
                object.biasFiller = null;
                object.axis = 1;
                object.transpose = false;
            }
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                object.numOutput = message.numOutput;
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                object.biasTerm = message.biasTerm;
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                object.weightFiller = $root.caffe.FillerParameter.toObject(message.weightFiller, options);
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                object.biasFiller = $root.caffe.FillerParameter.toObject(message.biasFiller, options);
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.transpose != null && message.hasOwnProperty("transpose"))
                object.transpose = message.transpose;
            return object;
        };

        /**
         * Converts this InnerProductParameter to JSON.
         * @function toJSON
         * @memberof caffe.InnerProductParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InnerProductParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InnerProductParameter;
    })();

    caffe.InputParameter = (function() {

        /**
         * Properties of an InputParameter.
         * @memberof caffe
         * @interface IInputParameter
         * @property {Array.<caffe.IBlobShape>} [shape] InputParameter shape
         */

        /**
         * Constructs a new InputParameter.
         * @memberof caffe
         * @classdesc Represents an InputParameter.
         * @constructor
         * @param {caffe.IInputParameter=} [properties] Properties to set
         */
        function InputParameter(properties) {
            this.shape = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * InputParameter shape.
         * @member {Array.<caffe.IBlobShape>}shape
         * @memberof caffe.InputParameter
         * @instance
         */
        InputParameter.prototype.shape = $util.emptyArray;

        /**
         * Creates a new InputParameter instance using the specified properties.
         * @function create
         * @memberof caffe.InputParameter
         * @static
         * @param {caffe.IInputParameter=} [properties] Properties to set
         * @returns {caffe.InputParameter} InputParameter instance
         */
        InputParameter.create = function create(properties) {
            return new InputParameter(properties);
        };

        /**
         * Encodes the specified InputParameter message. Does not implicitly {@link caffe.InputParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.InputParameter
         * @static
         * @param {caffe.IInputParameter} message InputParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InputParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.shape != null && message.shape.length)
                for (var i = 0; i < message.shape.length; ++i)
                    $root.caffe.BlobShape.encode(message.shape[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified InputParameter message, length delimited. Does not implicitly {@link caffe.InputParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.InputParameter
         * @static
         * @param {caffe.IInputParameter} message InputParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        InputParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an InputParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.InputParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.InputParameter} InputParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InputParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.InputParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.shape && message.shape.length))
                        message.shape = [];
                    message.shape.push($root.caffe.BlobShape.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an InputParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.InputParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.InputParameter} InputParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        InputParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an InputParameter message.
         * @function verify
         * @memberof caffe.InputParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        InputParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.shape != null && message.hasOwnProperty("shape")) {
                if (!Array.isArray(message.shape))
                    return "shape: array expected";
                for (var i = 0; i < message.shape.length; ++i) {
                    var error = $root.caffe.BlobShape.verify(message.shape[i]);
                    if (error)
                        return "shape." + error;
                }
            }
            return null;
        };

        /**
         * Creates an InputParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.InputParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.InputParameter} InputParameter
         */
        InputParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.InputParameter)
                return object;
            var message = new $root.caffe.InputParameter();
            if (object.shape) {
                if (!Array.isArray(object.shape))
                    throw TypeError(".caffe.InputParameter.shape: array expected");
                message.shape = [];
                for (var i = 0; i < object.shape.length; ++i) {
                    if (typeof object.shape[i] !== "object")
                        throw TypeError(".caffe.InputParameter.shape: object expected");
                    message.shape[i] = $root.caffe.BlobShape.fromObject(object.shape[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from an InputParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.InputParameter
         * @static
         * @param {caffe.InputParameter} message InputParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        InputParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.shape = [];
            if (message.shape && message.shape.length) {
                object.shape = [];
                for (var j = 0; j < message.shape.length; ++j)
                    object.shape[j] = $root.caffe.BlobShape.toObject(message.shape[j], options);
            }
            return object;
        };

        /**
         * Converts this InputParameter to JSON.
         * @function toJSON
         * @memberof caffe.InputParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        InputParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return InputParameter;
    })();

    caffe.LogParameter = (function() {

        /**
         * Properties of a LogParameter.
         * @memberof caffe
         * @interface ILogParameter
         * @property {number} [base] LogParameter base
         * @property {number} [scale] LogParameter scale
         * @property {number} [shift] LogParameter shift
         */

        /**
         * Constructs a new LogParameter.
         * @memberof caffe
         * @classdesc Represents a LogParameter.
         * @constructor
         * @param {caffe.ILogParameter=} [properties] Properties to set
         */
        function LogParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LogParameter base.
         * @member {number}base
         * @memberof caffe.LogParameter
         * @instance
         */
        LogParameter.prototype.base = -1;

        /**
         * LogParameter scale.
         * @member {number}scale
         * @memberof caffe.LogParameter
         * @instance
         */
        LogParameter.prototype.scale = 1;

        /**
         * LogParameter shift.
         * @member {number}shift
         * @memberof caffe.LogParameter
         * @instance
         */
        LogParameter.prototype.shift = 0;

        /**
         * Creates a new LogParameter instance using the specified properties.
         * @function create
         * @memberof caffe.LogParameter
         * @static
         * @param {caffe.ILogParameter=} [properties] Properties to set
         * @returns {caffe.LogParameter} LogParameter instance
         */
        LogParameter.create = function create(properties) {
            return new LogParameter(properties);
        };

        /**
         * Encodes the specified LogParameter message. Does not implicitly {@link caffe.LogParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.LogParameter
         * @static
         * @param {caffe.ILogParameter} message LogParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.base != null && message.hasOwnProperty("base"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.base);
            if (message.scale != null && message.hasOwnProperty("scale"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.scale);
            if (message.shift != null && message.hasOwnProperty("shift"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.shift);
            return writer;
        };

        /**
         * Encodes the specified LogParameter message, length delimited. Does not implicitly {@link caffe.LogParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.LogParameter
         * @static
         * @param {caffe.ILogParameter} message LogParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LogParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LogParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.LogParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.LogParameter} LogParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.LogParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.base = reader.float();
                    break;
                case 2:
                    message.scale = reader.float();
                    break;
                case 3:
                    message.shift = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LogParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.LogParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.LogParameter} LogParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LogParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LogParameter message.
         * @function verify
         * @memberof caffe.LogParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LogParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.base != null && message.hasOwnProperty("base"))
                if (typeof message.base !== "number")
                    return "base: number expected";
            if (message.scale != null && message.hasOwnProperty("scale"))
                if (typeof message.scale !== "number")
                    return "scale: number expected";
            if (message.shift != null && message.hasOwnProperty("shift"))
                if (typeof message.shift !== "number")
                    return "shift: number expected";
            return null;
        };

        /**
         * Creates a LogParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.LogParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.LogParameter} LogParameter
         */
        LogParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.LogParameter)
                return object;
            var message = new $root.caffe.LogParameter();
            if (object.base != null)
                message.base = Number(object.base);
            if (object.scale != null)
                message.scale = Number(object.scale);
            if (object.shift != null)
                message.shift = Number(object.shift);
            return message;
        };

        /**
         * Creates a plain object from a LogParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.LogParameter
         * @static
         * @param {caffe.LogParameter} message LogParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LogParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.base = -1;
                object.scale = 1;
                object.shift = 0;
            }
            if (message.base != null && message.hasOwnProperty("base"))
                object.base = options.json && !isFinite(message.base) ? String(message.base) : message.base;
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = options.json && !isFinite(message.scale) ? String(message.scale) : message.scale;
            if (message.shift != null && message.hasOwnProperty("shift"))
                object.shift = options.json && !isFinite(message.shift) ? String(message.shift) : message.shift;
            return object;
        };

        /**
         * Converts this LogParameter to JSON.
         * @function toJSON
         * @memberof caffe.LogParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LogParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return LogParameter;
    })();

    caffe.LRNParameter = (function() {

        /**
         * Properties of a LRNParameter.
         * @memberof caffe
         * @interface ILRNParameter
         * @property {number} [localSize] LRNParameter localSize
         * @property {number} [alpha] LRNParameter alpha
         * @property {number} [beta] LRNParameter beta
         * @property {caffe.LRNParameter.NormRegion} [normRegion] LRNParameter normRegion
         * @property {number} [k] LRNParameter k
         * @property {caffe.LRNParameter.Engine} [engine] LRNParameter engine
         */

        /**
         * Constructs a new LRNParameter.
         * @memberof caffe
         * @classdesc Represents a LRNParameter.
         * @constructor
         * @param {caffe.ILRNParameter=} [properties] Properties to set
         */
        function LRNParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LRNParameter localSize.
         * @member {number}localSize
         * @memberof caffe.LRNParameter
         * @instance
         */
        LRNParameter.prototype.localSize = 5;

        /**
         * LRNParameter alpha.
         * @member {number}alpha
         * @memberof caffe.LRNParameter
         * @instance
         */
        LRNParameter.prototype.alpha = 1;

        /**
         * LRNParameter beta.
         * @member {number}beta
         * @memberof caffe.LRNParameter
         * @instance
         */
        LRNParameter.prototype.beta = 0.75;

        /**
         * LRNParameter normRegion.
         * @member {caffe.LRNParameter.NormRegion}normRegion
         * @memberof caffe.LRNParameter
         * @instance
         */
        LRNParameter.prototype.normRegion = 0;

        /**
         * LRNParameter k.
         * @member {number}k
         * @memberof caffe.LRNParameter
         * @instance
         */
        LRNParameter.prototype.k = 1;

        /**
         * LRNParameter engine.
         * @member {caffe.LRNParameter.Engine}engine
         * @memberof caffe.LRNParameter
         * @instance
         */
        LRNParameter.prototype.engine = 0;

        /**
         * Creates a new LRNParameter instance using the specified properties.
         * @function create
         * @memberof caffe.LRNParameter
         * @static
         * @param {caffe.ILRNParameter=} [properties] Properties to set
         * @returns {caffe.LRNParameter} LRNParameter instance
         */
        LRNParameter.create = function create(properties) {
            return new LRNParameter(properties);
        };

        /**
         * Encodes the specified LRNParameter message. Does not implicitly {@link caffe.LRNParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.LRNParameter
         * @static
         * @param {caffe.ILRNParameter} message LRNParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LRNParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.localSize != null && message.hasOwnProperty("localSize"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.localSize);
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.alpha);
            if (message.beta != null && message.hasOwnProperty("beta"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.beta);
            if (message.normRegion != null && message.hasOwnProperty("normRegion"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.normRegion);
            if (message.k != null && message.hasOwnProperty("k"))
                writer.uint32(/* id 5, wireType 5 =*/45).float(message.k);
            if (message.engine != null && message.hasOwnProperty("engine"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.engine);
            return writer;
        };

        /**
         * Encodes the specified LRNParameter message, length delimited. Does not implicitly {@link caffe.LRNParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.LRNParameter
         * @static
         * @param {caffe.ILRNParameter} message LRNParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LRNParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LRNParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.LRNParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.LRNParameter} LRNParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LRNParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.LRNParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.localSize = reader.uint32();
                    break;
                case 2:
                    message.alpha = reader.float();
                    break;
                case 3:
                    message.beta = reader.float();
                    break;
                case 4:
                    message.normRegion = reader.int32();
                    break;
                case 5:
                    message.k = reader.float();
                    break;
                case 6:
                    message.engine = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LRNParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.LRNParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.LRNParameter} LRNParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LRNParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LRNParameter message.
         * @function verify
         * @memberof caffe.LRNParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LRNParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.localSize != null && message.hasOwnProperty("localSize"))
                if (!$util.isInteger(message.localSize))
                    return "localSize: integer expected";
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                if (typeof message.alpha !== "number")
                    return "alpha: number expected";
            if (message.beta != null && message.hasOwnProperty("beta"))
                if (typeof message.beta !== "number")
                    return "beta: number expected";
            if (message.normRegion != null && message.hasOwnProperty("normRegion"))
                switch (message.normRegion) {
                default:
                    return "normRegion: enum value expected";
                case 0:
                case 1:
                    break;
                }
            if (message.k != null && message.hasOwnProperty("k"))
                if (typeof message.k !== "number")
                    return "k: number expected";
            if (message.engine != null && message.hasOwnProperty("engine"))
                switch (message.engine) {
                default:
                    return "engine: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a LRNParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.LRNParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.LRNParameter} LRNParameter
         */
        LRNParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.LRNParameter)
                return object;
            var message = new $root.caffe.LRNParameter();
            if (object.localSize != null)
                message.localSize = object.localSize >>> 0;
            if (object.alpha != null)
                message.alpha = Number(object.alpha);
            if (object.beta != null)
                message.beta = Number(object.beta);
            switch (object.normRegion) {
            case "ACROSS_CHANNELS":
            case 0:
                message.normRegion = 0;
                break;
            case "WITHIN_CHANNEL":
            case 1:
                message.normRegion = 1;
                break;
            }
            if (object.k != null)
                message.k = Number(object.k);
            switch (object.engine) {
            case "DEFAULT":
            case 0:
                message.engine = 0;
                break;
            case "CAFFE":
            case 1:
                message.engine = 1;
                break;
            case "CUDNN":
            case 2:
                message.engine = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a LRNParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.LRNParameter
         * @static
         * @param {caffe.LRNParameter} message LRNParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LRNParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.localSize = 5;
                object.alpha = 1;
                object.beta = 0.75;
                object.normRegion = options.enums === String ? "ACROSS_CHANNELS" : 0;
                object.k = 1;
                object.engine = options.enums === String ? "DEFAULT" : 0;
            }
            if (message.localSize != null && message.hasOwnProperty("localSize"))
                object.localSize = message.localSize;
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                object.alpha = options.json && !isFinite(message.alpha) ? String(message.alpha) : message.alpha;
            if (message.beta != null && message.hasOwnProperty("beta"))
                object.beta = options.json && !isFinite(message.beta) ? String(message.beta) : message.beta;
            if (message.normRegion != null && message.hasOwnProperty("normRegion"))
                object.normRegion = options.enums === String ? $root.caffe.LRNParameter.NormRegion[message.normRegion] : message.normRegion;
            if (message.k != null && message.hasOwnProperty("k"))
                object.k = options.json && !isFinite(message.k) ? String(message.k) : message.k;
            if (message.engine != null && message.hasOwnProperty("engine"))
                object.engine = options.enums === String ? $root.caffe.LRNParameter.Engine[message.engine] : message.engine;
            return object;
        };

        /**
         * Converts this LRNParameter to JSON.
         * @function toJSON
         * @memberof caffe.LRNParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LRNParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * NormRegion enum.
         * @enum {string}
         * @property {number} ACROSS_CHANNELS=0 ACROSS_CHANNELS value
         * @property {number} WITHIN_CHANNEL=1 WITHIN_CHANNEL value
         */
        LRNParameter.NormRegion = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "ACROSS_CHANNELS"] = 0;
            values[valuesById[1] = "WITHIN_CHANNEL"] = 1;
            return values;
        })();

        /**
         * Engine enum.
         * @enum {string}
         * @property {number} DEFAULT=0 DEFAULT value
         * @property {number} CAFFE=1 CAFFE value
         * @property {number} CUDNN=2 CUDNN value
         */
        LRNParameter.Engine = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DEFAULT"] = 0;
            values[valuesById[1] = "CAFFE"] = 1;
            values[valuesById[2] = "CUDNN"] = 2;
            return values;
        })();

        return LRNParameter;
    })();

    caffe.MemoryDataParameter = (function() {

        /**
         * Properties of a MemoryDataParameter.
         * @memberof caffe
         * @interface IMemoryDataParameter
         * @property {number} [batchSize] MemoryDataParameter batchSize
         * @property {number} [channels] MemoryDataParameter channels
         * @property {number} [height] MemoryDataParameter height
         * @property {number} [width] MemoryDataParameter width
         */

        /**
         * Constructs a new MemoryDataParameter.
         * @memberof caffe
         * @classdesc Represents a MemoryDataParameter.
         * @constructor
         * @param {caffe.IMemoryDataParameter=} [properties] Properties to set
         */
        function MemoryDataParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MemoryDataParameter batchSize.
         * @member {number}batchSize
         * @memberof caffe.MemoryDataParameter
         * @instance
         */
        MemoryDataParameter.prototype.batchSize = 0;

        /**
         * MemoryDataParameter channels.
         * @member {number}channels
         * @memberof caffe.MemoryDataParameter
         * @instance
         */
        MemoryDataParameter.prototype.channels = 0;

        /**
         * MemoryDataParameter height.
         * @member {number}height
         * @memberof caffe.MemoryDataParameter
         * @instance
         */
        MemoryDataParameter.prototype.height = 0;

        /**
         * MemoryDataParameter width.
         * @member {number}width
         * @memberof caffe.MemoryDataParameter
         * @instance
         */
        MemoryDataParameter.prototype.width = 0;

        /**
         * Creates a new MemoryDataParameter instance using the specified properties.
         * @function create
         * @memberof caffe.MemoryDataParameter
         * @static
         * @param {caffe.IMemoryDataParameter=} [properties] Properties to set
         * @returns {caffe.MemoryDataParameter} MemoryDataParameter instance
         */
        MemoryDataParameter.create = function create(properties) {
            return new MemoryDataParameter(properties);
        };

        /**
         * Encodes the specified MemoryDataParameter message. Does not implicitly {@link caffe.MemoryDataParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.MemoryDataParameter
         * @static
         * @param {caffe.IMemoryDataParameter} message MemoryDataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MemoryDataParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.batchSize);
            if (message.channels != null && message.hasOwnProperty("channels"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.channels);
            if (message.height != null && message.hasOwnProperty("height"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.height);
            if (message.width != null && message.hasOwnProperty("width"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.width);
            return writer;
        };

        /**
         * Encodes the specified MemoryDataParameter message, length delimited. Does not implicitly {@link caffe.MemoryDataParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.MemoryDataParameter
         * @static
         * @param {caffe.IMemoryDataParameter} message MemoryDataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MemoryDataParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MemoryDataParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.MemoryDataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.MemoryDataParameter} MemoryDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MemoryDataParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.MemoryDataParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.batchSize = reader.uint32();
                    break;
                case 2:
                    message.channels = reader.uint32();
                    break;
                case 3:
                    message.height = reader.uint32();
                    break;
                case 4:
                    message.width = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MemoryDataParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.MemoryDataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.MemoryDataParameter} MemoryDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MemoryDataParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MemoryDataParameter message.
         * @function verify
         * @memberof caffe.MemoryDataParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MemoryDataParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                if (!$util.isInteger(message.batchSize))
                    return "batchSize: integer expected";
            if (message.channels != null && message.hasOwnProperty("channels"))
                if (!$util.isInteger(message.channels))
                    return "channels: integer expected";
            if (message.height != null && message.hasOwnProperty("height"))
                if (!$util.isInteger(message.height))
                    return "height: integer expected";
            if (message.width != null && message.hasOwnProperty("width"))
                if (!$util.isInteger(message.width))
                    return "width: integer expected";
            return null;
        };

        /**
         * Creates a MemoryDataParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.MemoryDataParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.MemoryDataParameter} MemoryDataParameter
         */
        MemoryDataParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.MemoryDataParameter)
                return object;
            var message = new $root.caffe.MemoryDataParameter();
            if (object.batchSize != null)
                message.batchSize = object.batchSize >>> 0;
            if (object.channels != null)
                message.channels = object.channels >>> 0;
            if (object.height != null)
                message.height = object.height >>> 0;
            if (object.width != null)
                message.width = object.width >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a MemoryDataParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.MemoryDataParameter
         * @static
         * @param {caffe.MemoryDataParameter} message MemoryDataParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MemoryDataParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.batchSize = 0;
                object.channels = 0;
                object.height = 0;
                object.width = 0;
            }
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                object.batchSize = message.batchSize;
            if (message.channels != null && message.hasOwnProperty("channels"))
                object.channels = message.channels;
            if (message.height != null && message.hasOwnProperty("height"))
                object.height = message.height;
            if (message.width != null && message.hasOwnProperty("width"))
                object.width = message.width;
            return object;
        };

        /**
         * Converts this MemoryDataParameter to JSON.
         * @function toJSON
         * @memberof caffe.MemoryDataParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MemoryDataParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MemoryDataParameter;
    })();

    caffe.MVNParameter = (function() {

        /**
         * Properties of a MVNParameter.
         * @memberof caffe
         * @interface IMVNParameter
         * @property {boolean} [normalizeVariance] MVNParameter normalizeVariance
         * @property {boolean} [acrossChannels] MVNParameter acrossChannels
         * @property {number} [eps] MVNParameter eps
         */

        /**
         * Constructs a new MVNParameter.
         * @memberof caffe
         * @classdesc Represents a MVNParameter.
         * @constructor
         * @param {caffe.IMVNParameter=} [properties] Properties to set
         */
        function MVNParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * MVNParameter normalizeVariance.
         * @member {boolean}normalizeVariance
         * @memberof caffe.MVNParameter
         * @instance
         */
        MVNParameter.prototype.normalizeVariance = true;

        /**
         * MVNParameter acrossChannels.
         * @member {boolean}acrossChannels
         * @memberof caffe.MVNParameter
         * @instance
         */
        MVNParameter.prototype.acrossChannels = false;

        /**
         * MVNParameter eps.
         * @member {number}eps
         * @memberof caffe.MVNParameter
         * @instance
         */
        MVNParameter.prototype.eps = 1e-9;

        /**
         * Creates a new MVNParameter instance using the specified properties.
         * @function create
         * @memberof caffe.MVNParameter
         * @static
         * @param {caffe.IMVNParameter=} [properties] Properties to set
         * @returns {caffe.MVNParameter} MVNParameter instance
         */
        MVNParameter.create = function create(properties) {
            return new MVNParameter(properties);
        };

        /**
         * Encodes the specified MVNParameter message. Does not implicitly {@link caffe.MVNParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.MVNParameter
         * @static
         * @param {caffe.IMVNParameter} message MVNParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MVNParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.normalizeVariance != null && message.hasOwnProperty("normalizeVariance"))
                writer.uint32(/* id 1, wireType 0 =*/8).bool(message.normalizeVariance);
            if (message.acrossChannels != null && message.hasOwnProperty("acrossChannels"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.acrossChannels);
            if (message.eps != null && message.hasOwnProperty("eps"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.eps);
            return writer;
        };

        /**
         * Encodes the specified MVNParameter message, length delimited. Does not implicitly {@link caffe.MVNParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.MVNParameter
         * @static
         * @param {caffe.IMVNParameter} message MVNParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        MVNParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a MVNParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.MVNParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.MVNParameter} MVNParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MVNParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.MVNParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.normalizeVariance = reader.bool();
                    break;
                case 2:
                    message.acrossChannels = reader.bool();
                    break;
                case 3:
                    message.eps = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a MVNParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.MVNParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.MVNParameter} MVNParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        MVNParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a MVNParameter message.
         * @function verify
         * @memberof caffe.MVNParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        MVNParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.normalizeVariance != null && message.hasOwnProperty("normalizeVariance"))
                if (typeof message.normalizeVariance !== "boolean")
                    return "normalizeVariance: boolean expected";
            if (message.acrossChannels != null && message.hasOwnProperty("acrossChannels"))
                if (typeof message.acrossChannels !== "boolean")
                    return "acrossChannels: boolean expected";
            if (message.eps != null && message.hasOwnProperty("eps"))
                if (typeof message.eps !== "number")
                    return "eps: number expected";
            return null;
        };

        /**
         * Creates a MVNParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.MVNParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.MVNParameter} MVNParameter
         */
        MVNParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.MVNParameter)
                return object;
            var message = new $root.caffe.MVNParameter();
            if (object.normalizeVariance != null)
                message.normalizeVariance = Boolean(object.normalizeVariance);
            if (object.acrossChannels != null)
                message.acrossChannels = Boolean(object.acrossChannels);
            if (object.eps != null)
                message.eps = Number(object.eps);
            return message;
        };

        /**
         * Creates a plain object from a MVNParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.MVNParameter
         * @static
         * @param {caffe.MVNParameter} message MVNParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        MVNParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.normalizeVariance = true;
                object.acrossChannels = false;
                object.eps = 1e-9;
            }
            if (message.normalizeVariance != null && message.hasOwnProperty("normalizeVariance"))
                object.normalizeVariance = message.normalizeVariance;
            if (message.acrossChannels != null && message.hasOwnProperty("acrossChannels"))
                object.acrossChannels = message.acrossChannels;
            if (message.eps != null && message.hasOwnProperty("eps"))
                object.eps = options.json && !isFinite(message.eps) ? String(message.eps) : message.eps;
            return object;
        };

        /**
         * Converts this MVNParameter to JSON.
         * @function toJSON
         * @memberof caffe.MVNParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        MVNParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return MVNParameter;
    })();

    caffe.ParameterParameter = (function() {

        /**
         * Properties of a ParameterParameter.
         * @memberof caffe
         * @interface IParameterParameter
         * @property {caffe.IBlobShape} [shape] ParameterParameter shape
         */

        /**
         * Constructs a new ParameterParameter.
         * @memberof caffe
         * @classdesc Represents a ParameterParameter.
         * @constructor
         * @param {caffe.IParameterParameter=} [properties] Properties to set
         */
        function ParameterParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ParameterParameter shape.
         * @member {(caffe.IBlobShape|null|undefined)}shape
         * @memberof caffe.ParameterParameter
         * @instance
         */
        ParameterParameter.prototype.shape = null;

        /**
         * Creates a new ParameterParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ParameterParameter
         * @static
         * @param {caffe.IParameterParameter=} [properties] Properties to set
         * @returns {caffe.ParameterParameter} ParameterParameter instance
         */
        ParameterParameter.create = function create(properties) {
            return new ParameterParameter(properties);
        };

        /**
         * Encodes the specified ParameterParameter message. Does not implicitly {@link caffe.ParameterParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ParameterParameter
         * @static
         * @param {caffe.IParameterParameter} message ParameterParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ParameterParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.shape != null && message.hasOwnProperty("shape"))
                $root.caffe.BlobShape.encode(message.shape, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ParameterParameter message, length delimited. Does not implicitly {@link caffe.ParameterParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ParameterParameter
         * @static
         * @param {caffe.IParameterParameter} message ParameterParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ParameterParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ParameterParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ParameterParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ParameterParameter} ParameterParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ParameterParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ParameterParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.shape = $root.caffe.BlobShape.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ParameterParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ParameterParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ParameterParameter} ParameterParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ParameterParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ParameterParameter message.
         * @function verify
         * @memberof caffe.ParameterParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ParameterParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.shape != null && message.hasOwnProperty("shape")) {
                var error = $root.caffe.BlobShape.verify(message.shape);
                if (error)
                    return "shape." + error;
            }
            return null;
        };

        /**
         * Creates a ParameterParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ParameterParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ParameterParameter} ParameterParameter
         */
        ParameterParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ParameterParameter)
                return object;
            var message = new $root.caffe.ParameterParameter();
            if (object.shape != null) {
                if (typeof object.shape !== "object")
                    throw TypeError(".caffe.ParameterParameter.shape: object expected");
                message.shape = $root.caffe.BlobShape.fromObject(object.shape);
            }
            return message;
        };

        /**
         * Creates a plain object from a ParameterParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ParameterParameter
         * @static
         * @param {caffe.ParameterParameter} message ParameterParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ParameterParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.shape = null;
            if (message.shape != null && message.hasOwnProperty("shape"))
                object.shape = $root.caffe.BlobShape.toObject(message.shape, options);
            return object;
        };

        /**
         * Converts this ParameterParameter to JSON.
         * @function toJSON
         * @memberof caffe.ParameterParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ParameterParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ParameterParameter;
    })();

    caffe.PoolingParameter = (function() {

        /**
         * Properties of a PoolingParameter.
         * @memberof caffe
         * @interface IPoolingParameter
         * @property {caffe.PoolingParameter.PoolMethod} [pool] PoolingParameter pool
         * @property {number} [pad] PoolingParameter pad
         * @property {number} [padH] PoolingParameter padH
         * @property {number} [padW] PoolingParameter padW
         * @property {number} [kernelSize] PoolingParameter kernelSize
         * @property {number} [kernelH] PoolingParameter kernelH
         * @property {number} [kernelW] PoolingParameter kernelW
         * @property {number} [stride] PoolingParameter stride
         * @property {number} [strideH] PoolingParameter strideH
         * @property {number} [strideW] PoolingParameter strideW
         * @property {caffe.PoolingParameter.Engine} [engine] PoolingParameter engine
         * @property {boolean} [globalPooling] PoolingParameter globalPooling
         */

        /**
         * Constructs a new PoolingParameter.
         * @memberof caffe
         * @classdesc Represents a PoolingParameter.
         * @constructor
         * @param {caffe.IPoolingParameter=} [properties] Properties to set
         */
        function PoolingParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PoolingParameter pool.
         * @member {caffe.PoolingParameter.PoolMethod}pool
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.pool = 0;

        /**
         * PoolingParameter pad.
         * @member {number}pad
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.pad = 0;

        /**
         * PoolingParameter padH.
         * @member {number}padH
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.padH = 0;

        /**
         * PoolingParameter padW.
         * @member {number}padW
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.padW = 0;

        /**
         * PoolingParameter kernelSize.
         * @member {number}kernelSize
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.kernelSize = 0;

        /**
         * PoolingParameter kernelH.
         * @member {number}kernelH
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.kernelH = 0;

        /**
         * PoolingParameter kernelW.
         * @member {number}kernelW
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.kernelW = 0;

        /**
         * PoolingParameter stride.
         * @member {number}stride
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.stride = 1;

        /**
         * PoolingParameter strideH.
         * @member {number}strideH
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.strideH = 0;

        /**
         * PoolingParameter strideW.
         * @member {number}strideW
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.strideW = 0;

        /**
         * PoolingParameter engine.
         * @member {caffe.PoolingParameter.Engine}engine
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.engine = 0;

        /**
         * PoolingParameter globalPooling.
         * @member {boolean}globalPooling
         * @memberof caffe.PoolingParameter
         * @instance
         */
        PoolingParameter.prototype.globalPooling = false;

        /**
         * Creates a new PoolingParameter instance using the specified properties.
         * @function create
         * @memberof caffe.PoolingParameter
         * @static
         * @param {caffe.IPoolingParameter=} [properties] Properties to set
         * @returns {caffe.PoolingParameter} PoolingParameter instance
         */
        PoolingParameter.create = function create(properties) {
            return new PoolingParameter(properties);
        };

        /**
         * Encodes the specified PoolingParameter message. Does not implicitly {@link caffe.PoolingParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.PoolingParameter
         * @static
         * @param {caffe.IPoolingParameter} message PoolingParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PoolingParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pool != null && message.hasOwnProperty("pool"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pool);
            if (message.kernelSize != null && message.hasOwnProperty("kernelSize"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.kernelSize);
            if (message.stride != null && message.hasOwnProperty("stride"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.stride);
            if (message.pad != null && message.hasOwnProperty("pad"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.pad);
            if (message.kernelH != null && message.hasOwnProperty("kernelH"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.kernelH);
            if (message.kernelW != null && message.hasOwnProperty("kernelW"))
                writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.kernelW);
            if (message.strideH != null && message.hasOwnProperty("strideH"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.strideH);
            if (message.strideW != null && message.hasOwnProperty("strideW"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.strideW);
            if (message.padH != null && message.hasOwnProperty("padH"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.padH);
            if (message.padW != null && message.hasOwnProperty("padW"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.padW);
            if (message.engine != null && message.hasOwnProperty("engine"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.engine);
            if (message.globalPooling != null && message.hasOwnProperty("globalPooling"))
                writer.uint32(/* id 12, wireType 0 =*/96).bool(message.globalPooling);
            return writer;
        };

        /**
         * Encodes the specified PoolingParameter message, length delimited. Does not implicitly {@link caffe.PoolingParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.PoolingParameter
         * @static
         * @param {caffe.IPoolingParameter} message PoolingParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PoolingParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PoolingParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.PoolingParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.PoolingParameter} PoolingParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PoolingParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.PoolingParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pool = reader.int32();
                    break;
                case 4:
                    message.pad = reader.uint32();
                    break;
                case 9:
                    message.padH = reader.uint32();
                    break;
                case 10:
                    message.padW = reader.uint32();
                    break;
                case 2:
                    message.kernelSize = reader.uint32();
                    break;
                case 5:
                    message.kernelH = reader.uint32();
                    break;
                case 6:
                    message.kernelW = reader.uint32();
                    break;
                case 3:
                    message.stride = reader.uint32();
                    break;
                case 7:
                    message.strideH = reader.uint32();
                    break;
                case 8:
                    message.strideW = reader.uint32();
                    break;
                case 11:
                    message.engine = reader.int32();
                    break;
                case 12:
                    message.globalPooling = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PoolingParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.PoolingParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.PoolingParameter} PoolingParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PoolingParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PoolingParameter message.
         * @function verify
         * @memberof caffe.PoolingParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PoolingParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pool != null && message.hasOwnProperty("pool"))
                switch (message.pool) {
                default:
                    return "pool: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.pad != null && message.hasOwnProperty("pad"))
                if (!$util.isInteger(message.pad))
                    return "pad: integer expected";
            if (message.padH != null && message.hasOwnProperty("padH"))
                if (!$util.isInteger(message.padH))
                    return "padH: integer expected";
            if (message.padW != null && message.hasOwnProperty("padW"))
                if (!$util.isInteger(message.padW))
                    return "padW: integer expected";
            if (message.kernelSize != null && message.hasOwnProperty("kernelSize"))
                if (!$util.isInteger(message.kernelSize))
                    return "kernelSize: integer expected";
            if (message.kernelH != null && message.hasOwnProperty("kernelH"))
                if (!$util.isInteger(message.kernelH))
                    return "kernelH: integer expected";
            if (message.kernelW != null && message.hasOwnProperty("kernelW"))
                if (!$util.isInteger(message.kernelW))
                    return "kernelW: integer expected";
            if (message.stride != null && message.hasOwnProperty("stride"))
                if (!$util.isInteger(message.stride))
                    return "stride: integer expected";
            if (message.strideH != null && message.hasOwnProperty("strideH"))
                if (!$util.isInteger(message.strideH))
                    return "strideH: integer expected";
            if (message.strideW != null && message.hasOwnProperty("strideW"))
                if (!$util.isInteger(message.strideW))
                    return "strideW: integer expected";
            if (message.engine != null && message.hasOwnProperty("engine"))
                switch (message.engine) {
                default:
                    return "engine: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.globalPooling != null && message.hasOwnProperty("globalPooling"))
                if (typeof message.globalPooling !== "boolean")
                    return "globalPooling: boolean expected";
            return null;
        };

        /**
         * Creates a PoolingParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.PoolingParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.PoolingParameter} PoolingParameter
         */
        PoolingParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.PoolingParameter)
                return object;
            var message = new $root.caffe.PoolingParameter();
            switch (object.pool) {
            case "MAX":
            case 0:
                message.pool = 0;
                break;
            case "AVE":
            case 1:
                message.pool = 1;
                break;
            case "STOCHASTIC":
            case 2:
                message.pool = 2;
                break;
            }
            if (object.pad != null)
                message.pad = object.pad >>> 0;
            if (object.padH != null)
                message.padH = object.padH >>> 0;
            if (object.padW != null)
                message.padW = object.padW >>> 0;
            if (object.kernelSize != null)
                message.kernelSize = object.kernelSize >>> 0;
            if (object.kernelH != null)
                message.kernelH = object.kernelH >>> 0;
            if (object.kernelW != null)
                message.kernelW = object.kernelW >>> 0;
            if (object.stride != null)
                message.stride = object.stride >>> 0;
            if (object.strideH != null)
                message.strideH = object.strideH >>> 0;
            if (object.strideW != null)
                message.strideW = object.strideW >>> 0;
            switch (object.engine) {
            case "DEFAULT":
            case 0:
                message.engine = 0;
                break;
            case "CAFFE":
            case 1:
                message.engine = 1;
                break;
            case "CUDNN":
            case 2:
                message.engine = 2;
                break;
            }
            if (object.globalPooling != null)
                message.globalPooling = Boolean(object.globalPooling);
            return message;
        };

        /**
         * Creates a plain object from a PoolingParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.PoolingParameter
         * @static
         * @param {caffe.PoolingParameter} message PoolingParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PoolingParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.pool = options.enums === String ? "MAX" : 0;
                object.kernelSize = 0;
                object.stride = 1;
                object.pad = 0;
                object.kernelH = 0;
                object.kernelW = 0;
                object.strideH = 0;
                object.strideW = 0;
                object.padH = 0;
                object.padW = 0;
                object.engine = options.enums === String ? "DEFAULT" : 0;
                object.globalPooling = false;
            }
            if (message.pool != null && message.hasOwnProperty("pool"))
                object.pool = options.enums === String ? $root.caffe.PoolingParameter.PoolMethod[message.pool] : message.pool;
            if (message.kernelSize != null && message.hasOwnProperty("kernelSize"))
                object.kernelSize = message.kernelSize;
            if (message.stride != null && message.hasOwnProperty("stride"))
                object.stride = message.stride;
            if (message.pad != null && message.hasOwnProperty("pad"))
                object.pad = message.pad;
            if (message.kernelH != null && message.hasOwnProperty("kernelH"))
                object.kernelH = message.kernelH;
            if (message.kernelW != null && message.hasOwnProperty("kernelW"))
                object.kernelW = message.kernelW;
            if (message.strideH != null && message.hasOwnProperty("strideH"))
                object.strideH = message.strideH;
            if (message.strideW != null && message.hasOwnProperty("strideW"))
                object.strideW = message.strideW;
            if (message.padH != null && message.hasOwnProperty("padH"))
                object.padH = message.padH;
            if (message.padW != null && message.hasOwnProperty("padW"))
                object.padW = message.padW;
            if (message.engine != null && message.hasOwnProperty("engine"))
                object.engine = options.enums === String ? $root.caffe.PoolingParameter.Engine[message.engine] : message.engine;
            if (message.globalPooling != null && message.hasOwnProperty("globalPooling"))
                object.globalPooling = message.globalPooling;
            return object;
        };

        /**
         * Converts this PoolingParameter to JSON.
         * @function toJSON
         * @memberof caffe.PoolingParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PoolingParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * PoolMethod enum.
         * @enum {string}
         * @property {number} MAX=0 MAX value
         * @property {number} AVE=1 AVE value
         * @property {number} STOCHASTIC=2 STOCHASTIC value
         */
        PoolingParameter.PoolMethod = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "MAX"] = 0;
            values[valuesById[1] = "AVE"] = 1;
            values[valuesById[2] = "STOCHASTIC"] = 2;
            return values;
        })();

        /**
         * Engine enum.
         * @enum {string}
         * @property {number} DEFAULT=0 DEFAULT value
         * @property {number} CAFFE=1 CAFFE value
         * @property {number} CUDNN=2 CUDNN value
         */
        PoolingParameter.Engine = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DEFAULT"] = 0;
            values[valuesById[1] = "CAFFE"] = 1;
            values[valuesById[2] = "CUDNN"] = 2;
            return values;
        })();

        return PoolingParameter;
    })();

    caffe.PowerParameter = (function() {

        /**
         * Properties of a PowerParameter.
         * @memberof caffe
         * @interface IPowerParameter
         * @property {number} [power] PowerParameter power
         * @property {number} [scale] PowerParameter scale
         * @property {number} [shift] PowerParameter shift
         */

        /**
         * Constructs a new PowerParameter.
         * @memberof caffe
         * @classdesc Represents a PowerParameter.
         * @constructor
         * @param {caffe.IPowerParameter=} [properties] Properties to set
         */
        function PowerParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PowerParameter power.
         * @member {number}power
         * @memberof caffe.PowerParameter
         * @instance
         */
        PowerParameter.prototype.power = 1;

        /**
         * PowerParameter scale.
         * @member {number}scale
         * @memberof caffe.PowerParameter
         * @instance
         */
        PowerParameter.prototype.scale = 1;

        /**
         * PowerParameter shift.
         * @member {number}shift
         * @memberof caffe.PowerParameter
         * @instance
         */
        PowerParameter.prototype.shift = 0;

        /**
         * Creates a new PowerParameter instance using the specified properties.
         * @function create
         * @memberof caffe.PowerParameter
         * @static
         * @param {caffe.IPowerParameter=} [properties] Properties to set
         * @returns {caffe.PowerParameter} PowerParameter instance
         */
        PowerParameter.create = function create(properties) {
            return new PowerParameter(properties);
        };

        /**
         * Encodes the specified PowerParameter message. Does not implicitly {@link caffe.PowerParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.PowerParameter
         * @static
         * @param {caffe.IPowerParameter} message PowerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PowerParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.power != null && message.hasOwnProperty("power"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.power);
            if (message.scale != null && message.hasOwnProperty("scale"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.scale);
            if (message.shift != null && message.hasOwnProperty("shift"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.shift);
            return writer;
        };

        /**
         * Encodes the specified PowerParameter message, length delimited. Does not implicitly {@link caffe.PowerParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.PowerParameter
         * @static
         * @param {caffe.IPowerParameter} message PowerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PowerParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PowerParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.PowerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.PowerParameter} PowerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PowerParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.PowerParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.power = reader.float();
                    break;
                case 2:
                    message.scale = reader.float();
                    break;
                case 3:
                    message.shift = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PowerParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.PowerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.PowerParameter} PowerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PowerParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PowerParameter message.
         * @function verify
         * @memberof caffe.PowerParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PowerParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.power != null && message.hasOwnProperty("power"))
                if (typeof message.power !== "number")
                    return "power: number expected";
            if (message.scale != null && message.hasOwnProperty("scale"))
                if (typeof message.scale !== "number")
                    return "scale: number expected";
            if (message.shift != null && message.hasOwnProperty("shift"))
                if (typeof message.shift !== "number")
                    return "shift: number expected";
            return null;
        };

        /**
         * Creates a PowerParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.PowerParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.PowerParameter} PowerParameter
         */
        PowerParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.PowerParameter)
                return object;
            var message = new $root.caffe.PowerParameter();
            if (object.power != null)
                message.power = Number(object.power);
            if (object.scale != null)
                message.scale = Number(object.scale);
            if (object.shift != null)
                message.shift = Number(object.shift);
            return message;
        };

        /**
         * Creates a plain object from a PowerParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.PowerParameter
         * @static
         * @param {caffe.PowerParameter} message PowerParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PowerParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.power = 1;
                object.scale = 1;
                object.shift = 0;
            }
            if (message.power != null && message.hasOwnProperty("power"))
                object.power = options.json && !isFinite(message.power) ? String(message.power) : message.power;
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = options.json && !isFinite(message.scale) ? String(message.scale) : message.scale;
            if (message.shift != null && message.hasOwnProperty("shift"))
                object.shift = options.json && !isFinite(message.shift) ? String(message.shift) : message.shift;
            return object;
        };

        /**
         * Converts this PowerParameter to JSON.
         * @function toJSON
         * @memberof caffe.PowerParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PowerParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PowerParameter;
    })();

    caffe.PythonParameter = (function() {

        /**
         * Properties of a PythonParameter.
         * @memberof caffe
         * @interface IPythonParameter
         * @property {string} [module] PythonParameter module
         * @property {string} [layer] PythonParameter layer
         * @property {string} [paramStr] PythonParameter paramStr
         * @property {boolean} [shareInParallel] PythonParameter shareInParallel
         */

        /**
         * Constructs a new PythonParameter.
         * @memberof caffe
         * @classdesc Represents a PythonParameter.
         * @constructor
         * @param {caffe.IPythonParameter=} [properties] Properties to set
         */
        function PythonParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PythonParameter module.
         * @member {string}module
         * @memberof caffe.PythonParameter
         * @instance
         */
        PythonParameter.prototype.module = "";

        /**
         * PythonParameter layer.
         * @member {string}layer
         * @memberof caffe.PythonParameter
         * @instance
         */
        PythonParameter.prototype.layer = "";

        /**
         * PythonParameter paramStr.
         * @member {string}paramStr
         * @memberof caffe.PythonParameter
         * @instance
         */
        PythonParameter.prototype.paramStr = "";

        /**
         * PythonParameter shareInParallel.
         * @member {boolean}shareInParallel
         * @memberof caffe.PythonParameter
         * @instance
         */
        PythonParameter.prototype.shareInParallel = false;

        /**
         * Creates a new PythonParameter instance using the specified properties.
         * @function create
         * @memberof caffe.PythonParameter
         * @static
         * @param {caffe.IPythonParameter=} [properties] Properties to set
         * @returns {caffe.PythonParameter} PythonParameter instance
         */
        PythonParameter.create = function create(properties) {
            return new PythonParameter(properties);
        };

        /**
         * Encodes the specified PythonParameter message. Does not implicitly {@link caffe.PythonParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.PythonParameter
         * @static
         * @param {caffe.IPythonParameter} message PythonParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PythonParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.module != null && message.hasOwnProperty("module"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.module);
            if (message.layer != null && message.hasOwnProperty("layer"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.layer);
            if (message.paramStr != null && message.hasOwnProperty("paramStr"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.paramStr);
            if (message.shareInParallel != null && message.hasOwnProperty("shareInParallel"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.shareInParallel);
            return writer;
        };

        /**
         * Encodes the specified PythonParameter message, length delimited. Does not implicitly {@link caffe.PythonParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.PythonParameter
         * @static
         * @param {caffe.IPythonParameter} message PythonParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PythonParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PythonParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.PythonParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.PythonParameter} PythonParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PythonParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.PythonParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.module = reader.string();
                    break;
                case 2:
                    message.layer = reader.string();
                    break;
                case 3:
                    message.paramStr = reader.string();
                    break;
                case 4:
                    message.shareInParallel = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PythonParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.PythonParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.PythonParameter} PythonParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PythonParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PythonParameter message.
         * @function verify
         * @memberof caffe.PythonParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PythonParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.module != null && message.hasOwnProperty("module"))
                if (!$util.isString(message.module))
                    return "module: string expected";
            if (message.layer != null && message.hasOwnProperty("layer"))
                if (!$util.isString(message.layer))
                    return "layer: string expected";
            if (message.paramStr != null && message.hasOwnProperty("paramStr"))
                if (!$util.isString(message.paramStr))
                    return "paramStr: string expected";
            if (message.shareInParallel != null && message.hasOwnProperty("shareInParallel"))
                if (typeof message.shareInParallel !== "boolean")
                    return "shareInParallel: boolean expected";
            return null;
        };

        /**
         * Creates a PythonParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.PythonParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.PythonParameter} PythonParameter
         */
        PythonParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.PythonParameter)
                return object;
            var message = new $root.caffe.PythonParameter();
            if (object.module != null)
                message.module = String(object.module);
            if (object.layer != null)
                message.layer = String(object.layer);
            if (object.paramStr != null)
                message.paramStr = String(object.paramStr);
            if (object.shareInParallel != null)
                message.shareInParallel = Boolean(object.shareInParallel);
            return message;
        };

        /**
         * Creates a plain object from a PythonParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.PythonParameter
         * @static
         * @param {caffe.PythonParameter} message PythonParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PythonParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.module = "";
                object.layer = "";
                object.paramStr = "";
                object.shareInParallel = false;
            }
            if (message.module != null && message.hasOwnProperty("module"))
                object.module = message.module;
            if (message.layer != null && message.hasOwnProperty("layer"))
                object.layer = message.layer;
            if (message.paramStr != null && message.hasOwnProperty("paramStr"))
                object.paramStr = message.paramStr;
            if (message.shareInParallel != null && message.hasOwnProperty("shareInParallel"))
                object.shareInParallel = message.shareInParallel;
            return object;
        };

        /**
         * Converts this PythonParameter to JSON.
         * @function toJSON
         * @memberof caffe.PythonParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PythonParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PythonParameter;
    })();

    caffe.RecurrentParameter = (function() {

        /**
         * Properties of a RecurrentParameter.
         * @memberof caffe
         * @interface IRecurrentParameter
         * @property {number} [numOutput] RecurrentParameter numOutput
         * @property {caffe.IFillerParameter} [weightFiller] RecurrentParameter weightFiller
         * @property {caffe.IFillerParameter} [biasFiller] RecurrentParameter biasFiller
         * @property {boolean} [debugInfo] RecurrentParameter debugInfo
         * @property {boolean} [exposeHidden] RecurrentParameter exposeHidden
         */

        /**
         * Constructs a new RecurrentParameter.
         * @memberof caffe
         * @classdesc Represents a RecurrentParameter.
         * @constructor
         * @param {caffe.IRecurrentParameter=} [properties] Properties to set
         */
        function RecurrentParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * RecurrentParameter numOutput.
         * @member {number}numOutput
         * @memberof caffe.RecurrentParameter
         * @instance
         */
        RecurrentParameter.prototype.numOutput = 0;

        /**
         * RecurrentParameter weightFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}weightFiller
         * @memberof caffe.RecurrentParameter
         * @instance
         */
        RecurrentParameter.prototype.weightFiller = null;

        /**
         * RecurrentParameter biasFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}biasFiller
         * @memberof caffe.RecurrentParameter
         * @instance
         */
        RecurrentParameter.prototype.biasFiller = null;

        /**
         * RecurrentParameter debugInfo.
         * @member {boolean}debugInfo
         * @memberof caffe.RecurrentParameter
         * @instance
         */
        RecurrentParameter.prototype.debugInfo = false;

        /**
         * RecurrentParameter exposeHidden.
         * @member {boolean}exposeHidden
         * @memberof caffe.RecurrentParameter
         * @instance
         */
        RecurrentParameter.prototype.exposeHidden = false;

        /**
         * Creates a new RecurrentParameter instance using the specified properties.
         * @function create
         * @memberof caffe.RecurrentParameter
         * @static
         * @param {caffe.IRecurrentParameter=} [properties] Properties to set
         * @returns {caffe.RecurrentParameter} RecurrentParameter instance
         */
        RecurrentParameter.create = function create(properties) {
            return new RecurrentParameter(properties);
        };

        /**
         * Encodes the specified RecurrentParameter message. Does not implicitly {@link caffe.RecurrentParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.RecurrentParameter
         * @static
         * @param {caffe.IRecurrentParameter} message RecurrentParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RecurrentParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.numOutput);
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                $root.caffe.FillerParameter.encode(message.weightFiller, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                $root.caffe.FillerParameter.encode(message.biasFiller, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.debugInfo);
            if (message.exposeHidden != null && message.hasOwnProperty("exposeHidden"))
                writer.uint32(/* id 5, wireType 0 =*/40).bool(message.exposeHidden);
            return writer;
        };

        /**
         * Encodes the specified RecurrentParameter message, length delimited. Does not implicitly {@link caffe.RecurrentParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.RecurrentParameter
         * @static
         * @param {caffe.IRecurrentParameter} message RecurrentParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        RecurrentParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a RecurrentParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.RecurrentParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.RecurrentParameter} RecurrentParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RecurrentParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.RecurrentParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.numOutput = reader.uint32();
                    break;
                case 2:
                    message.weightFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 3:
                    message.biasFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.debugInfo = reader.bool();
                    break;
                case 5:
                    message.exposeHidden = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a RecurrentParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.RecurrentParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.RecurrentParameter} RecurrentParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        RecurrentParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a RecurrentParameter message.
         * @function verify
         * @memberof caffe.RecurrentParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        RecurrentParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                if (!$util.isInteger(message.numOutput))
                    return "numOutput: integer expected";
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller")) {
                var error = $root.caffe.FillerParameter.verify(message.weightFiller);
                if (error)
                    return "weightFiller." + error;
            }
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller")) {
                error = $root.caffe.FillerParameter.verify(message.biasFiller);
                if (error)
                    return "biasFiller." + error;
            }
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                if (typeof message.debugInfo !== "boolean")
                    return "debugInfo: boolean expected";
            if (message.exposeHidden != null && message.hasOwnProperty("exposeHidden"))
                if (typeof message.exposeHidden !== "boolean")
                    return "exposeHidden: boolean expected";
            return null;
        };

        /**
         * Creates a RecurrentParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.RecurrentParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.RecurrentParameter} RecurrentParameter
         */
        RecurrentParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.RecurrentParameter)
                return object;
            var message = new $root.caffe.RecurrentParameter();
            if (object.numOutput != null)
                message.numOutput = object.numOutput >>> 0;
            if (object.weightFiller != null) {
                if (typeof object.weightFiller !== "object")
                    throw TypeError(".caffe.RecurrentParameter.weightFiller: object expected");
                message.weightFiller = $root.caffe.FillerParameter.fromObject(object.weightFiller);
            }
            if (object.biasFiller != null) {
                if (typeof object.biasFiller !== "object")
                    throw TypeError(".caffe.RecurrentParameter.biasFiller: object expected");
                message.biasFiller = $root.caffe.FillerParameter.fromObject(object.biasFiller);
            }
            if (object.debugInfo != null)
                message.debugInfo = Boolean(object.debugInfo);
            if (object.exposeHidden != null)
                message.exposeHidden = Boolean(object.exposeHidden);
            return message;
        };

        /**
         * Creates a plain object from a RecurrentParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.RecurrentParameter
         * @static
         * @param {caffe.RecurrentParameter} message RecurrentParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        RecurrentParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.numOutput = 0;
                object.weightFiller = null;
                object.biasFiller = null;
                object.debugInfo = false;
                object.exposeHidden = false;
            }
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                object.numOutput = message.numOutput;
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                object.weightFiller = $root.caffe.FillerParameter.toObject(message.weightFiller, options);
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                object.biasFiller = $root.caffe.FillerParameter.toObject(message.biasFiller, options);
            if (message.debugInfo != null && message.hasOwnProperty("debugInfo"))
                object.debugInfo = message.debugInfo;
            if (message.exposeHidden != null && message.hasOwnProperty("exposeHidden"))
                object.exposeHidden = message.exposeHidden;
            return object;
        };

        /**
         * Converts this RecurrentParameter to JSON.
         * @function toJSON
         * @memberof caffe.RecurrentParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        RecurrentParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return RecurrentParameter;
    })();

    caffe.ReductionParameter = (function() {

        /**
         * Properties of a ReductionParameter.
         * @memberof caffe
         * @interface IReductionParameter
         * @property {caffe.ReductionParameter.ReductionOp} [operation] ReductionParameter operation
         * @property {number} [axis] ReductionParameter axis
         * @property {number} [coeff] ReductionParameter coeff
         */

        /**
         * Constructs a new ReductionParameter.
         * @memberof caffe
         * @classdesc Represents a ReductionParameter.
         * @constructor
         * @param {caffe.IReductionParameter=} [properties] Properties to set
         */
        function ReductionParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReductionParameter operation.
         * @member {caffe.ReductionParameter.ReductionOp}operation
         * @memberof caffe.ReductionParameter
         * @instance
         */
        ReductionParameter.prototype.operation = 1;

        /**
         * ReductionParameter axis.
         * @member {number}axis
         * @memberof caffe.ReductionParameter
         * @instance
         */
        ReductionParameter.prototype.axis = 0;

        /**
         * ReductionParameter coeff.
         * @member {number}coeff
         * @memberof caffe.ReductionParameter
         * @instance
         */
        ReductionParameter.prototype.coeff = 1;

        /**
         * Creates a new ReductionParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ReductionParameter
         * @static
         * @param {caffe.IReductionParameter=} [properties] Properties to set
         * @returns {caffe.ReductionParameter} ReductionParameter instance
         */
        ReductionParameter.create = function create(properties) {
            return new ReductionParameter(properties);
        };

        /**
         * Encodes the specified ReductionParameter message. Does not implicitly {@link caffe.ReductionParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ReductionParameter
         * @static
         * @param {caffe.IReductionParameter} message ReductionParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReductionParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.operation != null && message.hasOwnProperty("operation"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.operation);
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.axis);
            if (message.coeff != null && message.hasOwnProperty("coeff"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.coeff);
            return writer;
        };

        /**
         * Encodes the specified ReductionParameter message, length delimited. Does not implicitly {@link caffe.ReductionParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ReductionParameter
         * @static
         * @param {caffe.IReductionParameter} message ReductionParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReductionParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReductionParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ReductionParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ReductionParameter} ReductionParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReductionParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ReductionParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.operation = reader.int32();
                    break;
                case 2:
                    message.axis = reader.int32();
                    break;
                case 3:
                    message.coeff = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReductionParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ReductionParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ReductionParameter} ReductionParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReductionParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReductionParameter message.
         * @function verify
         * @memberof caffe.ReductionParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReductionParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.operation != null && message.hasOwnProperty("operation"))
                switch (message.operation) {
                default:
                    return "operation: enum value expected";
                case 1:
                case 2:
                case 3:
                case 4:
                    break;
                }
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.coeff != null && message.hasOwnProperty("coeff"))
                if (typeof message.coeff !== "number")
                    return "coeff: number expected";
            return null;
        };

        /**
         * Creates a ReductionParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ReductionParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ReductionParameter} ReductionParameter
         */
        ReductionParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ReductionParameter)
                return object;
            var message = new $root.caffe.ReductionParameter();
            switch (object.operation) {
            case "SUM":
            case 1:
                message.operation = 1;
                break;
            case "ASUM":
            case 2:
                message.operation = 2;
                break;
            case "SUMSQ":
            case 3:
                message.operation = 3;
                break;
            case "MEAN":
            case 4:
                message.operation = 4;
                break;
            }
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.coeff != null)
                message.coeff = Number(object.coeff);
            return message;
        };

        /**
         * Creates a plain object from a ReductionParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ReductionParameter
         * @static
         * @param {caffe.ReductionParameter} message ReductionParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReductionParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.operation = options.enums === String ? "SUM" : 1;
                object.axis = 0;
                object.coeff = 1;
            }
            if (message.operation != null && message.hasOwnProperty("operation"))
                object.operation = options.enums === String ? $root.caffe.ReductionParameter.ReductionOp[message.operation] : message.operation;
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.coeff != null && message.hasOwnProperty("coeff"))
                object.coeff = options.json && !isFinite(message.coeff) ? String(message.coeff) : message.coeff;
            return object;
        };

        /**
         * Converts this ReductionParameter to JSON.
         * @function toJSON
         * @memberof caffe.ReductionParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReductionParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * ReductionOp enum.
         * @enum {string}
         * @property {number} SUM=1 SUM value
         * @property {number} ASUM=2 ASUM value
         * @property {number} SUMSQ=3 SUMSQ value
         * @property {number} MEAN=4 MEAN value
         */
        ReductionParameter.ReductionOp = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[1] = "SUM"] = 1;
            values[valuesById[2] = "ASUM"] = 2;
            values[valuesById[3] = "SUMSQ"] = 3;
            values[valuesById[4] = "MEAN"] = 4;
            return values;
        })();

        return ReductionParameter;
    })();

    caffe.ReLUParameter = (function() {

        /**
         * Properties of a ReLUParameter.
         * @memberof caffe
         * @interface IReLUParameter
         * @property {number} [negativeSlope] ReLUParameter negativeSlope
         * @property {caffe.ReLUParameter.Engine} [engine] ReLUParameter engine
         */

        /**
         * Constructs a new ReLUParameter.
         * @memberof caffe
         * @classdesc Represents a ReLUParameter.
         * @constructor
         * @param {caffe.IReLUParameter=} [properties] Properties to set
         */
        function ReLUParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReLUParameter negativeSlope.
         * @member {number}negativeSlope
         * @memberof caffe.ReLUParameter
         * @instance
         */
        ReLUParameter.prototype.negativeSlope = 0;

        /**
         * ReLUParameter engine.
         * @member {caffe.ReLUParameter.Engine}engine
         * @memberof caffe.ReLUParameter
         * @instance
         */
        ReLUParameter.prototype.engine = 0;

        /**
         * Creates a new ReLUParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ReLUParameter
         * @static
         * @param {caffe.IReLUParameter=} [properties] Properties to set
         * @returns {caffe.ReLUParameter} ReLUParameter instance
         */
        ReLUParameter.create = function create(properties) {
            return new ReLUParameter(properties);
        };

        /**
         * Encodes the specified ReLUParameter message. Does not implicitly {@link caffe.ReLUParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ReLUParameter
         * @static
         * @param {caffe.IReLUParameter} message ReLUParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReLUParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.negativeSlope != null && message.hasOwnProperty("negativeSlope"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.negativeSlope);
            if (message.engine != null && message.hasOwnProperty("engine"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.engine);
            return writer;
        };

        /**
         * Encodes the specified ReLUParameter message, length delimited. Does not implicitly {@link caffe.ReLUParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ReLUParameter
         * @static
         * @param {caffe.IReLUParameter} message ReLUParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReLUParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReLUParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ReLUParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ReLUParameter} ReLUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReLUParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ReLUParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.negativeSlope = reader.float();
                    break;
                case 2:
                    message.engine = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReLUParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ReLUParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ReLUParameter} ReLUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReLUParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReLUParameter message.
         * @function verify
         * @memberof caffe.ReLUParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReLUParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.negativeSlope != null && message.hasOwnProperty("negativeSlope"))
                if (typeof message.negativeSlope !== "number")
                    return "negativeSlope: number expected";
            if (message.engine != null && message.hasOwnProperty("engine"))
                switch (message.engine) {
                default:
                    return "engine: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a ReLUParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ReLUParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ReLUParameter} ReLUParameter
         */
        ReLUParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ReLUParameter)
                return object;
            var message = new $root.caffe.ReLUParameter();
            if (object.negativeSlope != null)
                message.negativeSlope = Number(object.negativeSlope);
            switch (object.engine) {
            case "DEFAULT":
            case 0:
                message.engine = 0;
                break;
            case "CAFFE":
            case 1:
                message.engine = 1;
                break;
            case "CUDNN":
            case 2:
                message.engine = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a ReLUParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ReLUParameter
         * @static
         * @param {caffe.ReLUParameter} message ReLUParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReLUParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.negativeSlope = 0;
                object.engine = options.enums === String ? "DEFAULT" : 0;
            }
            if (message.negativeSlope != null && message.hasOwnProperty("negativeSlope"))
                object.negativeSlope = options.json && !isFinite(message.negativeSlope) ? String(message.negativeSlope) : message.negativeSlope;
            if (message.engine != null && message.hasOwnProperty("engine"))
                object.engine = options.enums === String ? $root.caffe.ReLUParameter.Engine[message.engine] : message.engine;
            return object;
        };

        /**
         * Converts this ReLUParameter to JSON.
         * @function toJSON
         * @memberof caffe.ReLUParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReLUParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Engine enum.
         * @enum {string}
         * @property {number} DEFAULT=0 DEFAULT value
         * @property {number} CAFFE=1 CAFFE value
         * @property {number} CUDNN=2 CUDNN value
         */
        ReLUParameter.Engine = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DEFAULT"] = 0;
            values[valuesById[1] = "CAFFE"] = 1;
            values[valuesById[2] = "CUDNN"] = 2;
            return values;
        })();

        return ReLUParameter;
    })();

    caffe.ReshapeParameter = (function() {

        /**
         * Properties of a ReshapeParameter.
         * @memberof caffe
         * @interface IReshapeParameter
         * @property {caffe.IBlobShape} [shape] ReshapeParameter shape
         * @property {number} [axis] ReshapeParameter axis
         * @property {number} [numAxes] ReshapeParameter numAxes
         */

        /**
         * Constructs a new ReshapeParameter.
         * @memberof caffe
         * @classdesc Represents a ReshapeParameter.
         * @constructor
         * @param {caffe.IReshapeParameter=} [properties] Properties to set
         */
        function ReshapeParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ReshapeParameter shape.
         * @member {(caffe.IBlobShape|null|undefined)}shape
         * @memberof caffe.ReshapeParameter
         * @instance
         */
        ReshapeParameter.prototype.shape = null;

        /**
         * ReshapeParameter axis.
         * @member {number}axis
         * @memberof caffe.ReshapeParameter
         * @instance
         */
        ReshapeParameter.prototype.axis = 0;

        /**
         * ReshapeParameter numAxes.
         * @member {number}numAxes
         * @memberof caffe.ReshapeParameter
         * @instance
         */
        ReshapeParameter.prototype.numAxes = -1;

        /**
         * Creates a new ReshapeParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ReshapeParameter
         * @static
         * @param {caffe.IReshapeParameter=} [properties] Properties to set
         * @returns {caffe.ReshapeParameter} ReshapeParameter instance
         */
        ReshapeParameter.create = function create(properties) {
            return new ReshapeParameter(properties);
        };

        /**
         * Encodes the specified ReshapeParameter message. Does not implicitly {@link caffe.ReshapeParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ReshapeParameter
         * @static
         * @param {caffe.IReshapeParameter} message ReshapeParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReshapeParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.shape != null && message.hasOwnProperty("shape"))
                $root.caffe.BlobShape.encode(message.shape, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.axis);
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.numAxes);
            return writer;
        };

        /**
         * Encodes the specified ReshapeParameter message, length delimited. Does not implicitly {@link caffe.ReshapeParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ReshapeParameter
         * @static
         * @param {caffe.IReshapeParameter} message ReshapeParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReshapeParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReshapeParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ReshapeParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ReshapeParameter} ReshapeParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReshapeParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ReshapeParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.shape = $root.caffe.BlobShape.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.axis = reader.int32();
                    break;
                case 3:
                    message.numAxes = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ReshapeParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ReshapeParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ReshapeParameter} ReshapeParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ReshapeParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ReshapeParameter message.
         * @function verify
         * @memberof caffe.ReshapeParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ReshapeParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.shape != null && message.hasOwnProperty("shape")) {
                var error = $root.caffe.BlobShape.verify(message.shape);
                if (error)
                    return "shape." + error;
            }
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                if (!$util.isInteger(message.numAxes))
                    return "numAxes: integer expected";
            return null;
        };

        /**
         * Creates a ReshapeParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ReshapeParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ReshapeParameter} ReshapeParameter
         */
        ReshapeParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ReshapeParameter)
                return object;
            var message = new $root.caffe.ReshapeParameter();
            if (object.shape != null) {
                if (typeof object.shape !== "object")
                    throw TypeError(".caffe.ReshapeParameter.shape: object expected");
                message.shape = $root.caffe.BlobShape.fromObject(object.shape);
            }
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.numAxes != null)
                message.numAxes = object.numAxes | 0;
            return message;
        };

        /**
         * Creates a plain object from a ReshapeParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ReshapeParameter
         * @static
         * @param {caffe.ReshapeParameter} message ReshapeParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ReshapeParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.shape = null;
                object.axis = 0;
                object.numAxes = -1;
            }
            if (message.shape != null && message.hasOwnProperty("shape"))
                object.shape = $root.caffe.BlobShape.toObject(message.shape, options);
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                object.numAxes = message.numAxes;
            return object;
        };

        /**
         * Converts this ReshapeParameter to JSON.
         * @function toJSON
         * @memberof caffe.ReshapeParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ReshapeParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ReshapeParameter;
    })();

    caffe.ScaleParameter = (function() {

        /**
         * Properties of a ScaleParameter.
         * @memberof caffe
         * @interface IScaleParameter
         * @property {number} [axis] ScaleParameter axis
         * @property {number} [numAxes] ScaleParameter numAxes
         * @property {caffe.IFillerParameter} [filler] ScaleParameter filler
         * @property {boolean} [biasTerm] ScaleParameter biasTerm
         * @property {caffe.IFillerParameter} [biasFiller] ScaleParameter biasFiller
         */

        /**
         * Constructs a new ScaleParameter.
         * @memberof caffe
         * @classdesc Represents a ScaleParameter.
         * @constructor
         * @param {caffe.IScaleParameter=} [properties] Properties to set
         */
        function ScaleParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ScaleParameter axis.
         * @member {number}axis
         * @memberof caffe.ScaleParameter
         * @instance
         */
        ScaleParameter.prototype.axis = 1;

        /**
         * ScaleParameter numAxes.
         * @member {number}numAxes
         * @memberof caffe.ScaleParameter
         * @instance
         */
        ScaleParameter.prototype.numAxes = 1;

        /**
         * ScaleParameter filler.
         * @member {(caffe.IFillerParameter|null|undefined)}filler
         * @memberof caffe.ScaleParameter
         * @instance
         */
        ScaleParameter.prototype.filler = null;

        /**
         * ScaleParameter biasTerm.
         * @member {boolean}biasTerm
         * @memberof caffe.ScaleParameter
         * @instance
         */
        ScaleParameter.prototype.biasTerm = false;

        /**
         * ScaleParameter biasFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}biasFiller
         * @memberof caffe.ScaleParameter
         * @instance
         */
        ScaleParameter.prototype.biasFiller = null;

        /**
         * Creates a new ScaleParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ScaleParameter
         * @static
         * @param {caffe.IScaleParameter=} [properties] Properties to set
         * @returns {caffe.ScaleParameter} ScaleParameter instance
         */
        ScaleParameter.create = function create(properties) {
            return new ScaleParameter(properties);
        };

        /**
         * Encodes the specified ScaleParameter message. Does not implicitly {@link caffe.ScaleParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ScaleParameter
         * @static
         * @param {caffe.IScaleParameter} message ScaleParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScaleParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.axis);
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.numAxes);
            if (message.filler != null && message.hasOwnProperty("filler"))
                $root.caffe.FillerParameter.encode(message.filler, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.biasTerm);
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                $root.caffe.FillerParameter.encode(message.biasFiller, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified ScaleParameter message, length delimited. Does not implicitly {@link caffe.ScaleParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ScaleParameter
         * @static
         * @param {caffe.IScaleParameter} message ScaleParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ScaleParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ScaleParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ScaleParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ScaleParameter} ScaleParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScaleParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ScaleParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.axis = reader.int32();
                    break;
                case 2:
                    message.numAxes = reader.int32();
                    break;
                case 3:
                    message.filler = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 4:
                    message.biasTerm = reader.bool();
                    break;
                case 5:
                    message.biasFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ScaleParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ScaleParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ScaleParameter} ScaleParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ScaleParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ScaleParameter message.
         * @function verify
         * @memberof caffe.ScaleParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ScaleParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                if (!$util.isInteger(message.numAxes))
                    return "numAxes: integer expected";
            if (message.filler != null && message.hasOwnProperty("filler")) {
                var error = $root.caffe.FillerParameter.verify(message.filler);
                if (error)
                    return "filler." + error;
            }
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                if (typeof message.biasTerm !== "boolean")
                    return "biasTerm: boolean expected";
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller")) {
                error = $root.caffe.FillerParameter.verify(message.biasFiller);
                if (error)
                    return "biasFiller." + error;
            }
            return null;
        };

        /**
         * Creates a ScaleParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ScaleParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ScaleParameter} ScaleParameter
         */
        ScaleParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ScaleParameter)
                return object;
            var message = new $root.caffe.ScaleParameter();
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.numAxes != null)
                message.numAxes = object.numAxes | 0;
            if (object.filler != null) {
                if (typeof object.filler !== "object")
                    throw TypeError(".caffe.ScaleParameter.filler: object expected");
                message.filler = $root.caffe.FillerParameter.fromObject(object.filler);
            }
            if (object.biasTerm != null)
                message.biasTerm = Boolean(object.biasTerm);
            if (object.biasFiller != null) {
                if (typeof object.biasFiller !== "object")
                    throw TypeError(".caffe.ScaleParameter.biasFiller: object expected");
                message.biasFiller = $root.caffe.FillerParameter.fromObject(object.biasFiller);
            }
            return message;
        };

        /**
         * Creates a plain object from a ScaleParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ScaleParameter
         * @static
         * @param {caffe.ScaleParameter} message ScaleParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ScaleParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.axis = 1;
                object.numAxes = 1;
                object.filler = null;
                object.biasTerm = false;
                object.biasFiller = null;
            }
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.numAxes != null && message.hasOwnProperty("numAxes"))
                object.numAxes = message.numAxes;
            if (message.filler != null && message.hasOwnProperty("filler"))
                object.filler = $root.caffe.FillerParameter.toObject(message.filler, options);
            if (message.biasTerm != null && message.hasOwnProperty("biasTerm"))
                object.biasTerm = message.biasTerm;
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                object.biasFiller = $root.caffe.FillerParameter.toObject(message.biasFiller, options);
            return object;
        };

        /**
         * Converts this ScaleParameter to JSON.
         * @function toJSON
         * @memberof caffe.ScaleParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ScaleParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ScaleParameter;
    })();

    caffe.SigmoidParameter = (function() {

        /**
         * Properties of a SigmoidParameter.
         * @memberof caffe
         * @interface ISigmoidParameter
         * @property {caffe.SigmoidParameter.Engine} [engine] SigmoidParameter engine
         */

        /**
         * Constructs a new SigmoidParameter.
         * @memberof caffe
         * @classdesc Represents a SigmoidParameter.
         * @constructor
         * @param {caffe.ISigmoidParameter=} [properties] Properties to set
         */
        function SigmoidParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SigmoidParameter engine.
         * @member {caffe.SigmoidParameter.Engine}engine
         * @memberof caffe.SigmoidParameter
         * @instance
         */
        SigmoidParameter.prototype.engine = 0;

        /**
         * Creates a new SigmoidParameter instance using the specified properties.
         * @function create
         * @memberof caffe.SigmoidParameter
         * @static
         * @param {caffe.ISigmoidParameter=} [properties] Properties to set
         * @returns {caffe.SigmoidParameter} SigmoidParameter instance
         */
        SigmoidParameter.create = function create(properties) {
            return new SigmoidParameter(properties);
        };

        /**
         * Encodes the specified SigmoidParameter message. Does not implicitly {@link caffe.SigmoidParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.SigmoidParameter
         * @static
         * @param {caffe.ISigmoidParameter} message SigmoidParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SigmoidParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.engine != null && message.hasOwnProperty("engine"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.engine);
            return writer;
        };

        /**
         * Encodes the specified SigmoidParameter message, length delimited. Does not implicitly {@link caffe.SigmoidParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.SigmoidParameter
         * @static
         * @param {caffe.ISigmoidParameter} message SigmoidParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SigmoidParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SigmoidParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.SigmoidParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.SigmoidParameter} SigmoidParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SigmoidParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.SigmoidParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.engine = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SigmoidParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.SigmoidParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.SigmoidParameter} SigmoidParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SigmoidParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SigmoidParameter message.
         * @function verify
         * @memberof caffe.SigmoidParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SigmoidParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.engine != null && message.hasOwnProperty("engine"))
                switch (message.engine) {
                default:
                    return "engine: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a SigmoidParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.SigmoidParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.SigmoidParameter} SigmoidParameter
         */
        SigmoidParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.SigmoidParameter)
                return object;
            var message = new $root.caffe.SigmoidParameter();
            switch (object.engine) {
            case "DEFAULT":
            case 0:
                message.engine = 0;
                break;
            case "CAFFE":
            case 1:
                message.engine = 1;
                break;
            case "CUDNN":
            case 2:
                message.engine = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a SigmoidParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.SigmoidParameter
         * @static
         * @param {caffe.SigmoidParameter} message SigmoidParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SigmoidParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.engine = options.enums === String ? "DEFAULT" : 0;
            if (message.engine != null && message.hasOwnProperty("engine"))
                object.engine = options.enums === String ? $root.caffe.SigmoidParameter.Engine[message.engine] : message.engine;
            return object;
        };

        /**
         * Converts this SigmoidParameter to JSON.
         * @function toJSON
         * @memberof caffe.SigmoidParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SigmoidParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Engine enum.
         * @enum {string}
         * @property {number} DEFAULT=0 DEFAULT value
         * @property {number} CAFFE=1 CAFFE value
         * @property {number} CUDNN=2 CUDNN value
         */
        SigmoidParameter.Engine = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DEFAULT"] = 0;
            values[valuesById[1] = "CAFFE"] = 1;
            values[valuesById[2] = "CUDNN"] = 2;
            return values;
        })();

        return SigmoidParameter;
    })();

    caffe.SliceParameter = (function() {

        /**
         * Properties of a SliceParameter.
         * @memberof caffe
         * @interface ISliceParameter
         * @property {number} [axis] SliceParameter axis
         * @property {Array.<number>} [slicePoint] SliceParameter slicePoint
         * @property {number} [sliceDim] SliceParameter sliceDim
         */

        /**
         * Constructs a new SliceParameter.
         * @memberof caffe
         * @classdesc Represents a SliceParameter.
         * @constructor
         * @param {caffe.ISliceParameter=} [properties] Properties to set
         */
        function SliceParameter(properties) {
            this.slicePoint = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SliceParameter axis.
         * @member {number}axis
         * @memberof caffe.SliceParameter
         * @instance
         */
        SliceParameter.prototype.axis = 1;

        /**
         * SliceParameter slicePoint.
         * @member {Array.<number>}slicePoint
         * @memberof caffe.SliceParameter
         * @instance
         */
        SliceParameter.prototype.slicePoint = $util.emptyArray;

        /**
         * SliceParameter sliceDim.
         * @member {number}sliceDim
         * @memberof caffe.SliceParameter
         * @instance
         */
        SliceParameter.prototype.sliceDim = 1;

        /**
         * Creates a new SliceParameter instance using the specified properties.
         * @function create
         * @memberof caffe.SliceParameter
         * @static
         * @param {caffe.ISliceParameter=} [properties] Properties to set
         * @returns {caffe.SliceParameter} SliceParameter instance
         */
        SliceParameter.create = function create(properties) {
            return new SliceParameter(properties);
        };

        /**
         * Encodes the specified SliceParameter message. Does not implicitly {@link caffe.SliceParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.SliceParameter
         * @static
         * @param {caffe.ISliceParameter} message SliceParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SliceParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.sliceDim != null && message.hasOwnProperty("sliceDim"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.sliceDim);
            if (message.slicePoint != null && message.slicePoint.length)
                for (var i = 0; i < message.slicePoint.length; ++i)
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.slicePoint[i]);
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.axis);
            return writer;
        };

        /**
         * Encodes the specified SliceParameter message, length delimited. Does not implicitly {@link caffe.SliceParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.SliceParameter
         * @static
         * @param {caffe.ISliceParameter} message SliceParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SliceParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SliceParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.SliceParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.SliceParameter} SliceParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SliceParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.SliceParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 3:
                    message.axis = reader.int32();
                    break;
                case 2:
                    if (!(message.slicePoint && message.slicePoint.length))
                        message.slicePoint = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.slicePoint.push(reader.uint32());
                    } else
                        message.slicePoint.push(reader.uint32());
                    break;
                case 1:
                    message.sliceDim = reader.uint32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SliceParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.SliceParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.SliceParameter} SliceParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SliceParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SliceParameter message.
         * @function verify
         * @memberof caffe.SliceParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SliceParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.slicePoint != null && message.hasOwnProperty("slicePoint")) {
                if (!Array.isArray(message.slicePoint))
                    return "slicePoint: array expected";
                for (var i = 0; i < message.slicePoint.length; ++i)
                    if (!$util.isInteger(message.slicePoint[i]))
                        return "slicePoint: integer[] expected";
            }
            if (message.sliceDim != null && message.hasOwnProperty("sliceDim"))
                if (!$util.isInteger(message.sliceDim))
                    return "sliceDim: integer expected";
            return null;
        };

        /**
         * Creates a SliceParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.SliceParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.SliceParameter} SliceParameter
         */
        SliceParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.SliceParameter)
                return object;
            var message = new $root.caffe.SliceParameter();
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.slicePoint) {
                if (!Array.isArray(object.slicePoint))
                    throw TypeError(".caffe.SliceParameter.slicePoint: array expected");
                message.slicePoint = [];
                for (var i = 0; i < object.slicePoint.length; ++i)
                    message.slicePoint[i] = object.slicePoint[i] >>> 0;
            }
            if (object.sliceDim != null)
                message.sliceDim = object.sliceDim >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a SliceParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.SliceParameter
         * @static
         * @param {caffe.SliceParameter} message SliceParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SliceParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.slicePoint = [];
            if (options.defaults) {
                object.sliceDim = 1;
                object.axis = 1;
            }
            if (message.sliceDim != null && message.hasOwnProperty("sliceDim"))
                object.sliceDim = message.sliceDim;
            if (message.slicePoint && message.slicePoint.length) {
                object.slicePoint = [];
                for (var j = 0; j < message.slicePoint.length; ++j)
                    object.slicePoint[j] = message.slicePoint[j];
            }
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            return object;
        };

        /**
         * Converts this SliceParameter to JSON.
         * @function toJSON
         * @memberof caffe.SliceParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SliceParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SliceParameter;
    })();

    caffe.SoftmaxParameter = (function() {

        /**
         * Properties of a SoftmaxParameter.
         * @memberof caffe
         * @interface ISoftmaxParameter
         * @property {caffe.SoftmaxParameter.Engine} [engine] SoftmaxParameter engine
         * @property {number} [axis] SoftmaxParameter axis
         */

        /**
         * Constructs a new SoftmaxParameter.
         * @memberof caffe
         * @classdesc Represents a SoftmaxParameter.
         * @constructor
         * @param {caffe.ISoftmaxParameter=} [properties] Properties to set
         */
        function SoftmaxParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SoftmaxParameter engine.
         * @member {caffe.SoftmaxParameter.Engine}engine
         * @memberof caffe.SoftmaxParameter
         * @instance
         */
        SoftmaxParameter.prototype.engine = 0;

        /**
         * SoftmaxParameter axis.
         * @member {number}axis
         * @memberof caffe.SoftmaxParameter
         * @instance
         */
        SoftmaxParameter.prototype.axis = 1;

        /**
         * Creates a new SoftmaxParameter instance using the specified properties.
         * @function create
         * @memberof caffe.SoftmaxParameter
         * @static
         * @param {caffe.ISoftmaxParameter=} [properties] Properties to set
         * @returns {caffe.SoftmaxParameter} SoftmaxParameter instance
         */
        SoftmaxParameter.create = function create(properties) {
            return new SoftmaxParameter(properties);
        };

        /**
         * Encodes the specified SoftmaxParameter message. Does not implicitly {@link caffe.SoftmaxParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.SoftmaxParameter
         * @static
         * @param {caffe.ISoftmaxParameter} message SoftmaxParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SoftmaxParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.engine != null && message.hasOwnProperty("engine"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.engine);
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.axis);
            return writer;
        };

        /**
         * Encodes the specified SoftmaxParameter message, length delimited. Does not implicitly {@link caffe.SoftmaxParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.SoftmaxParameter
         * @static
         * @param {caffe.ISoftmaxParameter} message SoftmaxParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SoftmaxParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SoftmaxParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.SoftmaxParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.SoftmaxParameter} SoftmaxParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SoftmaxParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.SoftmaxParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.engine = reader.int32();
                    break;
                case 2:
                    message.axis = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SoftmaxParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.SoftmaxParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.SoftmaxParameter} SoftmaxParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SoftmaxParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SoftmaxParameter message.
         * @function verify
         * @memberof caffe.SoftmaxParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SoftmaxParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.engine != null && message.hasOwnProperty("engine"))
                switch (message.engine) {
                default:
                    return "engine: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            return null;
        };

        /**
         * Creates a SoftmaxParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.SoftmaxParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.SoftmaxParameter} SoftmaxParameter
         */
        SoftmaxParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.SoftmaxParameter)
                return object;
            var message = new $root.caffe.SoftmaxParameter();
            switch (object.engine) {
            case "DEFAULT":
            case 0:
                message.engine = 0;
                break;
            case "CAFFE":
            case 1:
                message.engine = 1;
                break;
            case "CUDNN":
            case 2:
                message.engine = 2;
                break;
            }
            if (object.axis != null)
                message.axis = object.axis | 0;
            return message;
        };

        /**
         * Creates a plain object from a SoftmaxParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.SoftmaxParameter
         * @static
         * @param {caffe.SoftmaxParameter} message SoftmaxParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SoftmaxParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.engine = options.enums === String ? "DEFAULT" : 0;
                object.axis = 1;
            }
            if (message.engine != null && message.hasOwnProperty("engine"))
                object.engine = options.enums === String ? $root.caffe.SoftmaxParameter.Engine[message.engine] : message.engine;
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            return object;
        };

        /**
         * Converts this SoftmaxParameter to JSON.
         * @function toJSON
         * @memberof caffe.SoftmaxParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SoftmaxParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Engine enum.
         * @enum {string}
         * @property {number} DEFAULT=0 DEFAULT value
         * @property {number} CAFFE=1 CAFFE value
         * @property {number} CUDNN=2 CUDNN value
         */
        SoftmaxParameter.Engine = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DEFAULT"] = 0;
            values[valuesById[1] = "CAFFE"] = 1;
            values[valuesById[2] = "CUDNN"] = 2;
            return values;
        })();

        return SoftmaxParameter;
    })();

    caffe.TanHParameter = (function() {

        /**
         * Properties of a TanHParameter.
         * @memberof caffe
         * @interface ITanHParameter
         * @property {caffe.TanHParameter.Engine} [engine] TanHParameter engine
         */

        /**
         * Constructs a new TanHParameter.
         * @memberof caffe
         * @classdesc Represents a TanHParameter.
         * @constructor
         * @param {caffe.ITanHParameter=} [properties] Properties to set
         */
        function TanHParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TanHParameter engine.
         * @member {caffe.TanHParameter.Engine}engine
         * @memberof caffe.TanHParameter
         * @instance
         */
        TanHParameter.prototype.engine = 0;

        /**
         * Creates a new TanHParameter instance using the specified properties.
         * @function create
         * @memberof caffe.TanHParameter
         * @static
         * @param {caffe.ITanHParameter=} [properties] Properties to set
         * @returns {caffe.TanHParameter} TanHParameter instance
         */
        TanHParameter.create = function create(properties) {
            return new TanHParameter(properties);
        };

        /**
         * Encodes the specified TanHParameter message. Does not implicitly {@link caffe.TanHParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.TanHParameter
         * @static
         * @param {caffe.ITanHParameter} message TanHParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TanHParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.engine != null && message.hasOwnProperty("engine"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.engine);
            return writer;
        };

        /**
         * Encodes the specified TanHParameter message, length delimited. Does not implicitly {@link caffe.TanHParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.TanHParameter
         * @static
         * @param {caffe.ITanHParameter} message TanHParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TanHParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TanHParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.TanHParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.TanHParameter} TanHParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TanHParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.TanHParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.engine = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TanHParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.TanHParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.TanHParameter} TanHParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TanHParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TanHParameter message.
         * @function verify
         * @memberof caffe.TanHParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TanHParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.engine != null && message.hasOwnProperty("engine"))
                switch (message.engine) {
                default:
                    return "engine: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a TanHParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.TanHParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.TanHParameter} TanHParameter
         */
        TanHParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.TanHParameter)
                return object;
            var message = new $root.caffe.TanHParameter();
            switch (object.engine) {
            case "DEFAULT":
            case 0:
                message.engine = 0;
                break;
            case "CAFFE":
            case 1:
                message.engine = 1;
                break;
            case "CUDNN":
            case 2:
                message.engine = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a TanHParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.TanHParameter
         * @static
         * @param {caffe.TanHParameter} message TanHParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TanHParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.engine = options.enums === String ? "DEFAULT" : 0;
            if (message.engine != null && message.hasOwnProperty("engine"))
                object.engine = options.enums === String ? $root.caffe.TanHParameter.Engine[message.engine] : message.engine;
            return object;
        };

        /**
         * Converts this TanHParameter to JSON.
         * @function toJSON
         * @memberof caffe.TanHParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TanHParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Engine enum.
         * @enum {string}
         * @property {number} DEFAULT=0 DEFAULT value
         * @property {number} CAFFE=1 CAFFE value
         * @property {number} CUDNN=2 CUDNN value
         */
        TanHParameter.Engine = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DEFAULT"] = 0;
            values[valuesById[1] = "CAFFE"] = 1;
            values[valuesById[2] = "CUDNN"] = 2;
            return values;
        })();

        return TanHParameter;
    })();

    caffe.TileParameter = (function() {

        /**
         * Properties of a TileParameter.
         * @memberof caffe
         * @interface ITileParameter
         * @property {number} [axis] TileParameter axis
         * @property {number} [tiles] TileParameter tiles
         */

        /**
         * Constructs a new TileParameter.
         * @memberof caffe
         * @classdesc Represents a TileParameter.
         * @constructor
         * @param {caffe.ITileParameter=} [properties] Properties to set
         */
        function TileParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TileParameter axis.
         * @member {number}axis
         * @memberof caffe.TileParameter
         * @instance
         */
        TileParameter.prototype.axis = 1;

        /**
         * TileParameter tiles.
         * @member {number}tiles
         * @memberof caffe.TileParameter
         * @instance
         */
        TileParameter.prototype.tiles = 0;

        /**
         * Creates a new TileParameter instance using the specified properties.
         * @function create
         * @memberof caffe.TileParameter
         * @static
         * @param {caffe.ITileParameter=} [properties] Properties to set
         * @returns {caffe.TileParameter} TileParameter instance
         */
        TileParameter.create = function create(properties) {
            return new TileParameter(properties);
        };

        /**
         * Encodes the specified TileParameter message. Does not implicitly {@link caffe.TileParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.TileParameter
         * @static
         * @param {caffe.ITileParameter} message TileParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TileParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.axis != null && message.hasOwnProperty("axis"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.axis);
            if (message.tiles != null && message.hasOwnProperty("tiles"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.tiles);
            return writer;
        };

        /**
         * Encodes the specified TileParameter message, length delimited. Does not implicitly {@link caffe.TileParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.TileParameter
         * @static
         * @param {caffe.ITileParameter} message TileParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TileParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TileParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.TileParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.TileParameter} TileParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TileParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.TileParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.axis = reader.int32();
                    break;
                case 2:
                    message.tiles = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TileParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.TileParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.TileParameter} TileParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TileParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TileParameter message.
         * @function verify
         * @memberof caffe.TileParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TileParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.axis != null && message.hasOwnProperty("axis"))
                if (!$util.isInteger(message.axis))
                    return "axis: integer expected";
            if (message.tiles != null && message.hasOwnProperty("tiles"))
                if (!$util.isInteger(message.tiles))
                    return "tiles: integer expected";
            return null;
        };

        /**
         * Creates a TileParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.TileParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.TileParameter} TileParameter
         */
        TileParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.TileParameter)
                return object;
            var message = new $root.caffe.TileParameter();
            if (object.axis != null)
                message.axis = object.axis | 0;
            if (object.tiles != null)
                message.tiles = object.tiles | 0;
            return message;
        };

        /**
         * Creates a plain object from a TileParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.TileParameter
         * @static
         * @param {caffe.TileParameter} message TileParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TileParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.axis = 1;
                object.tiles = 0;
            }
            if (message.axis != null && message.hasOwnProperty("axis"))
                object.axis = message.axis;
            if (message.tiles != null && message.hasOwnProperty("tiles"))
                object.tiles = message.tiles;
            return object;
        };

        /**
         * Converts this TileParameter to JSON.
         * @function toJSON
         * @memberof caffe.TileParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TileParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TileParameter;
    })();

    caffe.ThresholdParameter = (function() {

        /**
         * Properties of a ThresholdParameter.
         * @memberof caffe
         * @interface IThresholdParameter
         * @property {number} [threshold] ThresholdParameter threshold
         */

        /**
         * Constructs a new ThresholdParameter.
         * @memberof caffe
         * @classdesc Represents a ThresholdParameter.
         * @constructor
         * @param {caffe.IThresholdParameter=} [properties] Properties to set
         */
        function ThresholdParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * ThresholdParameter threshold.
         * @member {number}threshold
         * @memberof caffe.ThresholdParameter
         * @instance
         */
        ThresholdParameter.prototype.threshold = 0;

        /**
         * Creates a new ThresholdParameter instance using the specified properties.
         * @function create
         * @memberof caffe.ThresholdParameter
         * @static
         * @param {caffe.IThresholdParameter=} [properties] Properties to set
         * @returns {caffe.ThresholdParameter} ThresholdParameter instance
         */
        ThresholdParameter.create = function create(properties) {
            return new ThresholdParameter(properties);
        };

        /**
         * Encodes the specified ThresholdParameter message. Does not implicitly {@link caffe.ThresholdParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.ThresholdParameter
         * @static
         * @param {caffe.IThresholdParameter} message ThresholdParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ThresholdParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.threshold != null && message.hasOwnProperty("threshold"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.threshold);
            return writer;
        };

        /**
         * Encodes the specified ThresholdParameter message, length delimited. Does not implicitly {@link caffe.ThresholdParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.ThresholdParameter
         * @static
         * @param {caffe.IThresholdParameter} message ThresholdParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ThresholdParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ThresholdParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.ThresholdParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.ThresholdParameter} ThresholdParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ThresholdParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.ThresholdParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.threshold = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a ThresholdParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.ThresholdParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.ThresholdParameter} ThresholdParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        ThresholdParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a ThresholdParameter message.
         * @function verify
         * @memberof caffe.ThresholdParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        ThresholdParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.threshold != null && message.hasOwnProperty("threshold"))
                if (typeof message.threshold !== "number")
                    return "threshold: number expected";
            return null;
        };

        /**
         * Creates a ThresholdParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.ThresholdParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.ThresholdParameter} ThresholdParameter
         */
        ThresholdParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.ThresholdParameter)
                return object;
            var message = new $root.caffe.ThresholdParameter();
            if (object.threshold != null)
                message.threshold = Number(object.threshold);
            return message;
        };

        /**
         * Creates a plain object from a ThresholdParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.ThresholdParameter
         * @static
         * @param {caffe.ThresholdParameter} message ThresholdParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        ThresholdParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.threshold = 0;
            if (message.threshold != null && message.hasOwnProperty("threshold"))
                object.threshold = options.json && !isFinite(message.threshold) ? String(message.threshold) : message.threshold;
            return object;
        };

        /**
         * Converts this ThresholdParameter to JSON.
         * @function toJSON
         * @memberof caffe.ThresholdParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        ThresholdParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return ThresholdParameter;
    })();

    caffe.WindowDataParameter = (function() {

        /**
         * Properties of a WindowDataParameter.
         * @memberof caffe
         * @interface IWindowDataParameter
         * @property {string} [source] WindowDataParameter source
         * @property {number} [scale] WindowDataParameter scale
         * @property {string} [meanFile] WindowDataParameter meanFile
         * @property {number} [batchSize] WindowDataParameter batchSize
         * @property {number} [cropSize] WindowDataParameter cropSize
         * @property {boolean} [mirror] WindowDataParameter mirror
         * @property {number} [fgThreshold] WindowDataParameter fgThreshold
         * @property {number} [bgThreshold] WindowDataParameter bgThreshold
         * @property {number} [fgFraction] WindowDataParameter fgFraction
         * @property {number} [contextPad] WindowDataParameter contextPad
         * @property {string} [cropMode] WindowDataParameter cropMode
         * @property {boolean} [cacheImages] WindowDataParameter cacheImages
         * @property {string} [rootFolder] WindowDataParameter rootFolder
         */

        /**
         * Constructs a new WindowDataParameter.
         * @memberof caffe
         * @classdesc Represents a WindowDataParameter.
         * @constructor
         * @param {caffe.IWindowDataParameter=} [properties] Properties to set
         */
        function WindowDataParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * WindowDataParameter source.
         * @member {string}source
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.source = "";

        /**
         * WindowDataParameter scale.
         * @member {number}scale
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.scale = 1;

        /**
         * WindowDataParameter meanFile.
         * @member {string}meanFile
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.meanFile = "";

        /**
         * WindowDataParameter batchSize.
         * @member {number}batchSize
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.batchSize = 0;

        /**
         * WindowDataParameter cropSize.
         * @member {number}cropSize
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.cropSize = 0;

        /**
         * WindowDataParameter mirror.
         * @member {boolean}mirror
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.mirror = false;

        /**
         * WindowDataParameter fgThreshold.
         * @member {number}fgThreshold
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.fgThreshold = 0.5;

        /**
         * WindowDataParameter bgThreshold.
         * @member {number}bgThreshold
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.bgThreshold = 0.5;

        /**
         * WindowDataParameter fgFraction.
         * @member {number}fgFraction
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.fgFraction = 0.25;

        /**
         * WindowDataParameter contextPad.
         * @member {number}contextPad
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.contextPad = 0;

        /**
         * WindowDataParameter cropMode.
         * @member {string}cropMode
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.cropMode = "warp";

        /**
         * WindowDataParameter cacheImages.
         * @member {boolean}cacheImages
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.cacheImages = false;

        /**
         * WindowDataParameter rootFolder.
         * @member {string}rootFolder
         * @memberof caffe.WindowDataParameter
         * @instance
         */
        WindowDataParameter.prototype.rootFolder = "";

        /**
         * Creates a new WindowDataParameter instance using the specified properties.
         * @function create
         * @memberof caffe.WindowDataParameter
         * @static
         * @param {caffe.IWindowDataParameter=} [properties] Properties to set
         * @returns {caffe.WindowDataParameter} WindowDataParameter instance
         */
        WindowDataParameter.create = function create(properties) {
            return new WindowDataParameter(properties);
        };

        /**
         * Encodes the specified WindowDataParameter message. Does not implicitly {@link caffe.WindowDataParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.WindowDataParameter
         * @static
         * @param {caffe.IWindowDataParameter} message WindowDataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WindowDataParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.source != null && message.hasOwnProperty("source"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.source);
            if (message.scale != null && message.hasOwnProperty("scale"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.scale);
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.meanFile);
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.batchSize);
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.cropSize);
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                writer.uint32(/* id 6, wireType 0 =*/48).bool(message.mirror);
            if (message.fgThreshold != null && message.hasOwnProperty("fgThreshold"))
                writer.uint32(/* id 7, wireType 5 =*/61).float(message.fgThreshold);
            if (message.bgThreshold != null && message.hasOwnProperty("bgThreshold"))
                writer.uint32(/* id 8, wireType 5 =*/69).float(message.bgThreshold);
            if (message.fgFraction != null && message.hasOwnProperty("fgFraction"))
                writer.uint32(/* id 9, wireType 5 =*/77).float(message.fgFraction);
            if (message.contextPad != null && message.hasOwnProperty("contextPad"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.contextPad);
            if (message.cropMode != null && message.hasOwnProperty("cropMode"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.cropMode);
            if (message.cacheImages != null && message.hasOwnProperty("cacheImages"))
                writer.uint32(/* id 12, wireType 0 =*/96).bool(message.cacheImages);
            if (message.rootFolder != null && message.hasOwnProperty("rootFolder"))
                writer.uint32(/* id 13, wireType 2 =*/106).string(message.rootFolder);
            return writer;
        };

        /**
         * Encodes the specified WindowDataParameter message, length delimited. Does not implicitly {@link caffe.WindowDataParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.WindowDataParameter
         * @static
         * @param {caffe.IWindowDataParameter} message WindowDataParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        WindowDataParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a WindowDataParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.WindowDataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.WindowDataParameter} WindowDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WindowDataParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.WindowDataParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.source = reader.string();
                    break;
                case 2:
                    message.scale = reader.float();
                    break;
                case 3:
                    message.meanFile = reader.string();
                    break;
                case 4:
                    message.batchSize = reader.uint32();
                    break;
                case 5:
                    message.cropSize = reader.uint32();
                    break;
                case 6:
                    message.mirror = reader.bool();
                    break;
                case 7:
                    message.fgThreshold = reader.float();
                    break;
                case 8:
                    message.bgThreshold = reader.float();
                    break;
                case 9:
                    message.fgFraction = reader.float();
                    break;
                case 10:
                    message.contextPad = reader.uint32();
                    break;
                case 11:
                    message.cropMode = reader.string();
                    break;
                case 12:
                    message.cacheImages = reader.bool();
                    break;
                case 13:
                    message.rootFolder = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a WindowDataParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.WindowDataParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.WindowDataParameter} WindowDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        WindowDataParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a WindowDataParameter message.
         * @function verify
         * @memberof caffe.WindowDataParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        WindowDataParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.scale != null && message.hasOwnProperty("scale"))
                if (typeof message.scale !== "number")
                    return "scale: number expected";
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                if (!$util.isString(message.meanFile))
                    return "meanFile: string expected";
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                if (!$util.isInteger(message.batchSize))
                    return "batchSize: integer expected";
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                if (!$util.isInteger(message.cropSize))
                    return "cropSize: integer expected";
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                if (typeof message.mirror !== "boolean")
                    return "mirror: boolean expected";
            if (message.fgThreshold != null && message.hasOwnProperty("fgThreshold"))
                if (typeof message.fgThreshold !== "number")
                    return "fgThreshold: number expected";
            if (message.bgThreshold != null && message.hasOwnProperty("bgThreshold"))
                if (typeof message.bgThreshold !== "number")
                    return "bgThreshold: number expected";
            if (message.fgFraction != null && message.hasOwnProperty("fgFraction"))
                if (typeof message.fgFraction !== "number")
                    return "fgFraction: number expected";
            if (message.contextPad != null && message.hasOwnProperty("contextPad"))
                if (!$util.isInteger(message.contextPad))
                    return "contextPad: integer expected";
            if (message.cropMode != null && message.hasOwnProperty("cropMode"))
                if (!$util.isString(message.cropMode))
                    return "cropMode: string expected";
            if (message.cacheImages != null && message.hasOwnProperty("cacheImages"))
                if (typeof message.cacheImages !== "boolean")
                    return "cacheImages: boolean expected";
            if (message.rootFolder != null && message.hasOwnProperty("rootFolder"))
                if (!$util.isString(message.rootFolder))
                    return "rootFolder: string expected";
            return null;
        };

        /**
         * Creates a WindowDataParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.WindowDataParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.WindowDataParameter} WindowDataParameter
         */
        WindowDataParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.WindowDataParameter)
                return object;
            var message = new $root.caffe.WindowDataParameter();
            if (object.source != null)
                message.source = String(object.source);
            if (object.scale != null)
                message.scale = Number(object.scale);
            if (object.meanFile != null)
                message.meanFile = String(object.meanFile);
            if (object.batchSize != null)
                message.batchSize = object.batchSize >>> 0;
            if (object.cropSize != null)
                message.cropSize = object.cropSize >>> 0;
            if (object.mirror != null)
                message.mirror = Boolean(object.mirror);
            if (object.fgThreshold != null)
                message.fgThreshold = Number(object.fgThreshold);
            if (object.bgThreshold != null)
                message.bgThreshold = Number(object.bgThreshold);
            if (object.fgFraction != null)
                message.fgFraction = Number(object.fgFraction);
            if (object.contextPad != null)
                message.contextPad = object.contextPad >>> 0;
            if (object.cropMode != null)
                message.cropMode = String(object.cropMode);
            if (object.cacheImages != null)
                message.cacheImages = Boolean(object.cacheImages);
            if (object.rootFolder != null)
                message.rootFolder = String(object.rootFolder);
            return message;
        };

        /**
         * Creates a plain object from a WindowDataParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.WindowDataParameter
         * @static
         * @param {caffe.WindowDataParameter} message WindowDataParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        WindowDataParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.source = "";
                object.scale = 1;
                object.meanFile = "";
                object.batchSize = 0;
                object.cropSize = 0;
                object.mirror = false;
                object.fgThreshold = 0.5;
                object.bgThreshold = 0.5;
                object.fgFraction = 0.25;
                object.contextPad = 0;
                object.cropMode = "warp";
                object.cacheImages = false;
                object.rootFolder = "";
            }
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = options.json && !isFinite(message.scale) ? String(message.scale) : message.scale;
            if (message.meanFile != null && message.hasOwnProperty("meanFile"))
                object.meanFile = message.meanFile;
            if (message.batchSize != null && message.hasOwnProperty("batchSize"))
                object.batchSize = message.batchSize;
            if (message.cropSize != null && message.hasOwnProperty("cropSize"))
                object.cropSize = message.cropSize;
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                object.mirror = message.mirror;
            if (message.fgThreshold != null && message.hasOwnProperty("fgThreshold"))
                object.fgThreshold = options.json && !isFinite(message.fgThreshold) ? String(message.fgThreshold) : message.fgThreshold;
            if (message.bgThreshold != null && message.hasOwnProperty("bgThreshold"))
                object.bgThreshold = options.json && !isFinite(message.bgThreshold) ? String(message.bgThreshold) : message.bgThreshold;
            if (message.fgFraction != null && message.hasOwnProperty("fgFraction"))
                object.fgFraction = options.json && !isFinite(message.fgFraction) ? String(message.fgFraction) : message.fgFraction;
            if (message.contextPad != null && message.hasOwnProperty("contextPad"))
                object.contextPad = message.contextPad;
            if (message.cropMode != null && message.hasOwnProperty("cropMode"))
                object.cropMode = message.cropMode;
            if (message.cacheImages != null && message.hasOwnProperty("cacheImages"))
                object.cacheImages = message.cacheImages;
            if (message.rootFolder != null && message.hasOwnProperty("rootFolder"))
                object.rootFolder = message.rootFolder;
            return object;
        };

        /**
         * Converts this WindowDataParameter to JSON.
         * @function toJSON
         * @memberof caffe.WindowDataParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        WindowDataParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return WindowDataParameter;
    })();

    caffe.SPPParameter = (function() {

        /**
         * Properties of a SPPParameter.
         * @memberof caffe
         * @interface ISPPParameter
         * @property {number} [pyramidHeight] SPPParameter pyramidHeight
         * @property {caffe.SPPParameter.PoolMethod} [pool] SPPParameter pool
         * @property {caffe.SPPParameter.Engine} [engine] SPPParameter engine
         */

        /**
         * Constructs a new SPPParameter.
         * @memberof caffe
         * @classdesc Represents a SPPParameter.
         * @constructor
         * @param {caffe.ISPPParameter=} [properties] Properties to set
         */
        function SPPParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SPPParameter pyramidHeight.
         * @member {number}pyramidHeight
         * @memberof caffe.SPPParameter
         * @instance
         */
        SPPParameter.prototype.pyramidHeight = 0;

        /**
         * SPPParameter pool.
         * @member {caffe.SPPParameter.PoolMethod}pool
         * @memberof caffe.SPPParameter
         * @instance
         */
        SPPParameter.prototype.pool = 0;

        /**
         * SPPParameter engine.
         * @member {caffe.SPPParameter.Engine}engine
         * @memberof caffe.SPPParameter
         * @instance
         */
        SPPParameter.prototype.engine = 0;

        /**
         * Creates a new SPPParameter instance using the specified properties.
         * @function create
         * @memberof caffe.SPPParameter
         * @static
         * @param {caffe.ISPPParameter=} [properties] Properties to set
         * @returns {caffe.SPPParameter} SPPParameter instance
         */
        SPPParameter.create = function create(properties) {
            return new SPPParameter(properties);
        };

        /**
         * Encodes the specified SPPParameter message. Does not implicitly {@link caffe.SPPParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.SPPParameter
         * @static
         * @param {caffe.ISPPParameter} message SPPParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SPPParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pyramidHeight != null && message.hasOwnProperty("pyramidHeight"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.pyramidHeight);
            if (message.pool != null && message.hasOwnProperty("pool"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pool);
            if (message.engine != null && message.hasOwnProperty("engine"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.engine);
            return writer;
        };

        /**
         * Encodes the specified SPPParameter message, length delimited. Does not implicitly {@link caffe.SPPParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.SPPParameter
         * @static
         * @param {caffe.ISPPParameter} message SPPParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SPPParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SPPParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.SPPParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.SPPParameter} SPPParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SPPParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.SPPParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.pyramidHeight = reader.uint32();
                    break;
                case 2:
                    message.pool = reader.int32();
                    break;
                case 6:
                    message.engine = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a SPPParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.SPPParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.SPPParameter} SPPParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SPPParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SPPParameter message.
         * @function verify
         * @memberof caffe.SPPParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SPPParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pyramidHeight != null && message.hasOwnProperty("pyramidHeight"))
                if (!$util.isInteger(message.pyramidHeight))
                    return "pyramidHeight: integer expected";
            if (message.pool != null && message.hasOwnProperty("pool"))
                switch (message.pool) {
                default:
                    return "pool: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.engine != null && message.hasOwnProperty("engine"))
                switch (message.engine) {
                default:
                    return "engine: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            return null;
        };

        /**
         * Creates a SPPParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.SPPParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.SPPParameter} SPPParameter
         */
        SPPParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.SPPParameter)
                return object;
            var message = new $root.caffe.SPPParameter();
            if (object.pyramidHeight != null)
                message.pyramidHeight = object.pyramidHeight >>> 0;
            switch (object.pool) {
            case "MAX":
            case 0:
                message.pool = 0;
                break;
            case "AVE":
            case 1:
                message.pool = 1;
                break;
            case "STOCHASTIC":
            case 2:
                message.pool = 2;
                break;
            }
            switch (object.engine) {
            case "DEFAULT":
            case 0:
                message.engine = 0;
                break;
            case "CAFFE":
            case 1:
                message.engine = 1;
                break;
            case "CUDNN":
            case 2:
                message.engine = 2;
                break;
            }
            return message;
        };

        /**
         * Creates a plain object from a SPPParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.SPPParameter
         * @static
         * @param {caffe.SPPParameter} message SPPParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SPPParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.pyramidHeight = 0;
                object.pool = options.enums === String ? "MAX" : 0;
                object.engine = options.enums === String ? "DEFAULT" : 0;
            }
            if (message.pyramidHeight != null && message.hasOwnProperty("pyramidHeight"))
                object.pyramidHeight = message.pyramidHeight;
            if (message.pool != null && message.hasOwnProperty("pool"))
                object.pool = options.enums === String ? $root.caffe.SPPParameter.PoolMethod[message.pool] : message.pool;
            if (message.engine != null && message.hasOwnProperty("engine"))
                object.engine = options.enums === String ? $root.caffe.SPPParameter.Engine[message.engine] : message.engine;
            return object;
        };

        /**
         * Converts this SPPParameter to JSON.
         * @function toJSON
         * @memberof caffe.SPPParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SPPParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * PoolMethod enum.
         * @enum {string}
         * @property {number} MAX=0 MAX value
         * @property {number} AVE=1 AVE value
         * @property {number} STOCHASTIC=2 STOCHASTIC value
         */
        SPPParameter.PoolMethod = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "MAX"] = 0;
            values[valuesById[1] = "AVE"] = 1;
            values[valuesById[2] = "STOCHASTIC"] = 2;
            return values;
        })();

        /**
         * Engine enum.
         * @enum {string}
         * @property {number} DEFAULT=0 DEFAULT value
         * @property {number} CAFFE=1 CAFFE value
         * @property {number} CUDNN=2 CUDNN value
         */
        SPPParameter.Engine = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "DEFAULT"] = 0;
            values[valuesById[1] = "CAFFE"] = 1;
            values[valuesById[2] = "CUDNN"] = 2;
            return values;
        })();

        return SPPParameter;
    })();

    caffe.V1LayerParameter = (function() {

        /**
         * Properties of a V1LayerParameter.
         * @memberof caffe
         * @interface IV1LayerParameter
         * @property {Array.<string>} [bottom] V1LayerParameter bottom
         * @property {Array.<string>} [top] V1LayerParameter top
         * @property {string} [name] V1LayerParameter name
         * @property {Array.<caffe.INetStateRule>} [include] V1LayerParameter include
         * @property {Array.<caffe.INetStateRule>} [exclude] V1LayerParameter exclude
         * @property {caffe.V1LayerParameter.LayerType} [type] V1LayerParameter type
         * @property {Array.<caffe.IBlobProto>} [blobs] V1LayerParameter blobs
         * @property {Array.<string>} [param] V1LayerParameter param
         * @property {Array.<caffe.V1LayerParameter.DimCheckMode>} [blobShareMode] V1LayerParameter blobShareMode
         * @property {Array.<number>} [blobsLr] V1LayerParameter blobsLr
         * @property {Array.<number>} [weightDecay] V1LayerParameter weightDecay
         * @property {Array.<number>} [lossWeight] V1LayerParameter lossWeight
         * @property {caffe.IAccuracyParameter} [accuracyParam] V1LayerParameter accuracyParam
         * @property {caffe.IArgMaxParameter} [argmaxParam] V1LayerParameter argmaxParam
         * @property {caffe.IConcatParameter} [concatParam] V1LayerParameter concatParam
         * @property {caffe.IContrastiveLossParameter} [contrastiveLossParam] V1LayerParameter contrastiveLossParam
         * @property {caffe.IConvolutionParameter} [convolutionParam] V1LayerParameter convolutionParam
         * @property {caffe.IDataParameter} [dataParam] V1LayerParameter dataParam
         * @property {caffe.IDropoutParameter} [dropoutParam] V1LayerParameter dropoutParam
         * @property {caffe.IDummyDataParameter} [dummyDataParam] V1LayerParameter dummyDataParam
         * @property {caffe.IEltwiseParameter} [eltwiseParam] V1LayerParameter eltwiseParam
         * @property {caffe.IExpParameter} [expParam] V1LayerParameter expParam
         * @property {caffe.IHDF5DataParameter} [hdf5DataParam] V1LayerParameter hdf5DataParam
         * @property {caffe.IHDF5OutputParameter} [hdf5OutputParam] V1LayerParameter hdf5OutputParam
         * @property {caffe.IHingeLossParameter} [hingeLossParam] V1LayerParameter hingeLossParam
         * @property {caffe.IImageDataParameter} [imageDataParam] V1LayerParameter imageDataParam
         * @property {caffe.IInfogainLossParameter} [infogainLossParam] V1LayerParameter infogainLossParam
         * @property {caffe.IInnerProductParameter} [innerProductParam] V1LayerParameter innerProductParam
         * @property {caffe.ILRNParameter} [lrnParam] V1LayerParameter lrnParam
         * @property {caffe.IMemoryDataParameter} [memoryDataParam] V1LayerParameter memoryDataParam
         * @property {caffe.IMVNParameter} [mvnParam] V1LayerParameter mvnParam
         * @property {caffe.IPoolingParameter} [poolingParam] V1LayerParameter poolingParam
         * @property {caffe.IPowerParameter} [powerParam] V1LayerParameter powerParam
         * @property {caffe.IReLUParameter} [reluParam] V1LayerParameter reluParam
         * @property {caffe.ISigmoidParameter} [sigmoidParam] V1LayerParameter sigmoidParam
         * @property {caffe.ISoftmaxParameter} [softmaxParam] V1LayerParameter softmaxParam
         * @property {caffe.ISliceParameter} [sliceParam] V1LayerParameter sliceParam
         * @property {caffe.ITanHParameter} [tanhParam] V1LayerParameter tanhParam
         * @property {caffe.IThresholdParameter} [thresholdParam] V1LayerParameter thresholdParam
         * @property {caffe.IWindowDataParameter} [windowDataParam] V1LayerParameter windowDataParam
         * @property {caffe.ITransformationParameter} [transformParam] V1LayerParameter transformParam
         * @property {caffe.ILossParameter} [lossParam] V1LayerParameter lossParam
         * @property {caffe.IV0LayerParameter} [layer] V1LayerParameter layer
         */

        /**
         * Constructs a new V1LayerParameter.
         * @memberof caffe
         * @classdesc Represents a V1LayerParameter.
         * @constructor
         * @param {caffe.IV1LayerParameter=} [properties] Properties to set
         */
        function V1LayerParameter(properties) {
            this.bottom = [];
            this.top = [];
            this.include = [];
            this.exclude = [];
            this.blobs = [];
            this.param = [];
            this.blobShareMode = [];
            this.blobsLr = [];
            this.weightDecay = [];
            this.lossWeight = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * V1LayerParameter bottom.
         * @member {Array.<string>}bottom
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.bottom = $util.emptyArray;

        /**
         * V1LayerParameter top.
         * @member {Array.<string>}top
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.top = $util.emptyArray;

        /**
         * V1LayerParameter name.
         * @member {string}name
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.name = "";

        /**
         * V1LayerParameter include.
         * @member {Array.<caffe.INetStateRule>}include
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.include = $util.emptyArray;

        /**
         * V1LayerParameter exclude.
         * @member {Array.<caffe.INetStateRule>}exclude
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.exclude = $util.emptyArray;

        /**
         * V1LayerParameter type.
         * @member {caffe.V1LayerParameter.LayerType}type
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.type = 0;

        /**
         * V1LayerParameter blobs.
         * @member {Array.<caffe.IBlobProto>}blobs
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.blobs = $util.emptyArray;

        /**
         * V1LayerParameter param.
         * @member {Array.<string>}param
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.param = $util.emptyArray;

        /**
         * V1LayerParameter blobShareMode.
         * @member {Array.<caffe.V1LayerParameter.DimCheckMode>}blobShareMode
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.blobShareMode = $util.emptyArray;

        /**
         * V1LayerParameter blobsLr.
         * @member {Array.<number>}blobsLr
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.blobsLr = $util.emptyArray;

        /**
         * V1LayerParameter weightDecay.
         * @member {Array.<number>}weightDecay
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.weightDecay = $util.emptyArray;

        /**
         * V1LayerParameter lossWeight.
         * @member {Array.<number>}lossWeight
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.lossWeight = $util.emptyArray;

        /**
         * V1LayerParameter accuracyParam.
         * @member {(caffe.IAccuracyParameter|null|undefined)}accuracyParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.accuracyParam = null;

        /**
         * V1LayerParameter argmaxParam.
         * @member {(caffe.IArgMaxParameter|null|undefined)}argmaxParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.argmaxParam = null;

        /**
         * V1LayerParameter concatParam.
         * @member {(caffe.IConcatParameter|null|undefined)}concatParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.concatParam = null;

        /**
         * V1LayerParameter contrastiveLossParam.
         * @member {(caffe.IContrastiveLossParameter|null|undefined)}contrastiveLossParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.contrastiveLossParam = null;

        /**
         * V1LayerParameter convolutionParam.
         * @member {(caffe.IConvolutionParameter|null|undefined)}convolutionParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.convolutionParam = null;

        /**
         * V1LayerParameter dataParam.
         * @member {(caffe.IDataParameter|null|undefined)}dataParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.dataParam = null;

        /**
         * V1LayerParameter dropoutParam.
         * @member {(caffe.IDropoutParameter|null|undefined)}dropoutParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.dropoutParam = null;

        /**
         * V1LayerParameter dummyDataParam.
         * @member {(caffe.IDummyDataParameter|null|undefined)}dummyDataParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.dummyDataParam = null;

        /**
         * V1LayerParameter eltwiseParam.
         * @member {(caffe.IEltwiseParameter|null|undefined)}eltwiseParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.eltwiseParam = null;

        /**
         * V1LayerParameter expParam.
         * @member {(caffe.IExpParameter|null|undefined)}expParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.expParam = null;

        /**
         * V1LayerParameter hdf5DataParam.
         * @member {(caffe.IHDF5DataParameter|null|undefined)}hdf5DataParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.hdf5DataParam = null;

        /**
         * V1LayerParameter hdf5OutputParam.
         * @member {(caffe.IHDF5OutputParameter|null|undefined)}hdf5OutputParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.hdf5OutputParam = null;

        /**
         * V1LayerParameter hingeLossParam.
         * @member {(caffe.IHingeLossParameter|null|undefined)}hingeLossParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.hingeLossParam = null;

        /**
         * V1LayerParameter imageDataParam.
         * @member {(caffe.IImageDataParameter|null|undefined)}imageDataParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.imageDataParam = null;

        /**
         * V1LayerParameter infogainLossParam.
         * @member {(caffe.IInfogainLossParameter|null|undefined)}infogainLossParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.infogainLossParam = null;

        /**
         * V1LayerParameter innerProductParam.
         * @member {(caffe.IInnerProductParameter|null|undefined)}innerProductParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.innerProductParam = null;

        /**
         * V1LayerParameter lrnParam.
         * @member {(caffe.ILRNParameter|null|undefined)}lrnParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.lrnParam = null;

        /**
         * V1LayerParameter memoryDataParam.
         * @member {(caffe.IMemoryDataParameter|null|undefined)}memoryDataParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.memoryDataParam = null;

        /**
         * V1LayerParameter mvnParam.
         * @member {(caffe.IMVNParameter|null|undefined)}mvnParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.mvnParam = null;

        /**
         * V1LayerParameter poolingParam.
         * @member {(caffe.IPoolingParameter|null|undefined)}poolingParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.poolingParam = null;

        /**
         * V1LayerParameter powerParam.
         * @member {(caffe.IPowerParameter|null|undefined)}powerParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.powerParam = null;

        /**
         * V1LayerParameter reluParam.
         * @member {(caffe.IReLUParameter|null|undefined)}reluParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.reluParam = null;

        /**
         * V1LayerParameter sigmoidParam.
         * @member {(caffe.ISigmoidParameter|null|undefined)}sigmoidParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.sigmoidParam = null;

        /**
         * V1LayerParameter softmaxParam.
         * @member {(caffe.ISoftmaxParameter|null|undefined)}softmaxParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.softmaxParam = null;

        /**
         * V1LayerParameter sliceParam.
         * @member {(caffe.ISliceParameter|null|undefined)}sliceParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.sliceParam = null;

        /**
         * V1LayerParameter tanhParam.
         * @member {(caffe.ITanHParameter|null|undefined)}tanhParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.tanhParam = null;

        /**
         * V1LayerParameter thresholdParam.
         * @member {(caffe.IThresholdParameter|null|undefined)}thresholdParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.thresholdParam = null;

        /**
         * V1LayerParameter windowDataParam.
         * @member {(caffe.IWindowDataParameter|null|undefined)}windowDataParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.windowDataParam = null;

        /**
         * V1LayerParameter transformParam.
         * @member {(caffe.ITransformationParameter|null|undefined)}transformParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.transformParam = null;

        /**
         * V1LayerParameter lossParam.
         * @member {(caffe.ILossParameter|null|undefined)}lossParam
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.lossParam = null;

        /**
         * V1LayerParameter layer.
         * @member {(caffe.IV0LayerParameter|null|undefined)}layer
         * @memberof caffe.V1LayerParameter
         * @instance
         */
        V1LayerParameter.prototype.layer = null;

        /**
         * Creates a new V1LayerParameter instance using the specified properties.
         * @function create
         * @memberof caffe.V1LayerParameter
         * @static
         * @param {caffe.IV1LayerParameter=} [properties] Properties to set
         * @returns {caffe.V1LayerParameter} V1LayerParameter instance
         */
        V1LayerParameter.create = function create(properties) {
            return new V1LayerParameter(properties);
        };

        /**
         * Encodes the specified V1LayerParameter message. Does not implicitly {@link caffe.V1LayerParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.V1LayerParameter
         * @static
         * @param {caffe.IV1LayerParameter} message V1LayerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        V1LayerParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.layer != null && message.hasOwnProperty("layer"))
                $root.caffe.V0LayerParameter.encode(message.layer, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.bottom != null && message.bottom.length)
                for (var i = 0; i < message.bottom.length; ++i)
                    writer.uint32(/* id 2, wireType 2 =*/18).string(message.bottom[i]);
            if (message.top != null && message.top.length)
                for (var i = 0; i < message.top.length; ++i)
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.top[i]);
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.name);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.type);
            if (message.blobs != null && message.blobs.length)
                for (var i = 0; i < message.blobs.length; ++i)
                    $root.caffe.BlobProto.encode(message.blobs[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.blobsLr != null && message.blobsLr.length)
                for (var i = 0; i < message.blobsLr.length; ++i)
                    writer.uint32(/* id 7, wireType 5 =*/61).float(message.blobsLr[i]);
            if (message.weightDecay != null && message.weightDecay.length)
                for (var i = 0; i < message.weightDecay.length; ++i)
                    writer.uint32(/* id 8, wireType 5 =*/69).float(message.weightDecay[i]);
            if (message.concatParam != null && message.hasOwnProperty("concatParam"))
                $root.caffe.ConcatParameter.encode(message.concatParam, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
            if (message.convolutionParam != null && message.hasOwnProperty("convolutionParam"))
                $root.caffe.ConvolutionParameter.encode(message.convolutionParam, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
            if (message.dataParam != null && message.hasOwnProperty("dataParam"))
                $root.caffe.DataParameter.encode(message.dataParam, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
            if (message.dropoutParam != null && message.hasOwnProperty("dropoutParam"))
                $root.caffe.DropoutParameter.encode(message.dropoutParam, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            if (message.hdf5DataParam != null && message.hasOwnProperty("hdf5DataParam"))
                $root.caffe.HDF5DataParameter.encode(message.hdf5DataParam, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam"))
                $root.caffe.HDF5OutputParameter.encode(message.hdf5OutputParam, writer.uint32(/* id 14, wireType 2 =*/114).fork()).ldelim();
            if (message.imageDataParam != null && message.hasOwnProperty("imageDataParam"))
                $root.caffe.ImageDataParameter.encode(message.imageDataParam, writer.uint32(/* id 15, wireType 2 =*/122).fork()).ldelim();
            if (message.infogainLossParam != null && message.hasOwnProperty("infogainLossParam"))
                $root.caffe.InfogainLossParameter.encode(message.infogainLossParam, writer.uint32(/* id 16, wireType 2 =*/130).fork()).ldelim();
            if (message.innerProductParam != null && message.hasOwnProperty("innerProductParam"))
                $root.caffe.InnerProductParameter.encode(message.innerProductParam, writer.uint32(/* id 17, wireType 2 =*/138).fork()).ldelim();
            if (message.lrnParam != null && message.hasOwnProperty("lrnParam"))
                $root.caffe.LRNParameter.encode(message.lrnParam, writer.uint32(/* id 18, wireType 2 =*/146).fork()).ldelim();
            if (message.poolingParam != null && message.hasOwnProperty("poolingParam"))
                $root.caffe.PoolingParameter.encode(message.poolingParam, writer.uint32(/* id 19, wireType 2 =*/154).fork()).ldelim();
            if (message.windowDataParam != null && message.hasOwnProperty("windowDataParam"))
                $root.caffe.WindowDataParameter.encode(message.windowDataParam, writer.uint32(/* id 20, wireType 2 =*/162).fork()).ldelim();
            if (message.powerParam != null && message.hasOwnProperty("powerParam"))
                $root.caffe.PowerParameter.encode(message.powerParam, writer.uint32(/* id 21, wireType 2 =*/170).fork()).ldelim();
            if (message.memoryDataParam != null && message.hasOwnProperty("memoryDataParam"))
                $root.caffe.MemoryDataParameter.encode(message.memoryDataParam, writer.uint32(/* id 22, wireType 2 =*/178).fork()).ldelim();
            if (message.argmaxParam != null && message.hasOwnProperty("argmaxParam"))
                $root.caffe.ArgMaxParameter.encode(message.argmaxParam, writer.uint32(/* id 23, wireType 2 =*/186).fork()).ldelim();
            if (message.eltwiseParam != null && message.hasOwnProperty("eltwiseParam"))
                $root.caffe.EltwiseParameter.encode(message.eltwiseParam, writer.uint32(/* id 24, wireType 2 =*/194).fork()).ldelim();
            if (message.thresholdParam != null && message.hasOwnProperty("thresholdParam"))
                $root.caffe.ThresholdParameter.encode(message.thresholdParam, writer.uint32(/* id 25, wireType 2 =*/202).fork()).ldelim();
            if (message.dummyDataParam != null && message.hasOwnProperty("dummyDataParam"))
                $root.caffe.DummyDataParameter.encode(message.dummyDataParam, writer.uint32(/* id 26, wireType 2 =*/210).fork()).ldelim();
            if (message.accuracyParam != null && message.hasOwnProperty("accuracyParam"))
                $root.caffe.AccuracyParameter.encode(message.accuracyParam, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
            if (message.hingeLossParam != null && message.hasOwnProperty("hingeLossParam"))
                $root.caffe.HingeLossParameter.encode(message.hingeLossParam, writer.uint32(/* id 29, wireType 2 =*/234).fork()).ldelim();
            if (message.reluParam != null && message.hasOwnProperty("reluParam"))
                $root.caffe.ReLUParameter.encode(message.reluParam, writer.uint32(/* id 30, wireType 2 =*/242).fork()).ldelim();
            if (message.sliceParam != null && message.hasOwnProperty("sliceParam"))
                $root.caffe.SliceParameter.encode(message.sliceParam, writer.uint32(/* id 31, wireType 2 =*/250).fork()).ldelim();
            if (message.include != null && message.include.length)
                for (var i = 0; i < message.include.length; ++i)
                    $root.caffe.NetStateRule.encode(message.include[i], writer.uint32(/* id 32, wireType 2 =*/258).fork()).ldelim();
            if (message.exclude != null && message.exclude.length)
                for (var i = 0; i < message.exclude.length; ++i)
                    $root.caffe.NetStateRule.encode(message.exclude[i], writer.uint32(/* id 33, wireType 2 =*/266).fork()).ldelim();
            if (message.mvnParam != null && message.hasOwnProperty("mvnParam"))
                $root.caffe.MVNParameter.encode(message.mvnParam, writer.uint32(/* id 34, wireType 2 =*/274).fork()).ldelim();
            if (message.lossWeight != null && message.lossWeight.length)
                for (var i = 0; i < message.lossWeight.length; ++i)
                    writer.uint32(/* id 35, wireType 5 =*/285).float(message.lossWeight[i]);
            if (message.transformParam != null && message.hasOwnProperty("transformParam"))
                $root.caffe.TransformationParameter.encode(message.transformParam, writer.uint32(/* id 36, wireType 2 =*/290).fork()).ldelim();
            if (message.tanhParam != null && message.hasOwnProperty("tanhParam"))
                $root.caffe.TanHParameter.encode(message.tanhParam, writer.uint32(/* id 37, wireType 2 =*/298).fork()).ldelim();
            if (message.sigmoidParam != null && message.hasOwnProperty("sigmoidParam"))
                $root.caffe.SigmoidParameter.encode(message.sigmoidParam, writer.uint32(/* id 38, wireType 2 =*/306).fork()).ldelim();
            if (message.softmaxParam != null && message.hasOwnProperty("softmaxParam"))
                $root.caffe.SoftmaxParameter.encode(message.softmaxParam, writer.uint32(/* id 39, wireType 2 =*/314).fork()).ldelim();
            if (message.contrastiveLossParam != null && message.hasOwnProperty("contrastiveLossParam"))
                $root.caffe.ContrastiveLossParameter.encode(message.contrastiveLossParam, writer.uint32(/* id 40, wireType 2 =*/322).fork()).ldelim();
            if (message.expParam != null && message.hasOwnProperty("expParam"))
                $root.caffe.ExpParameter.encode(message.expParam, writer.uint32(/* id 41, wireType 2 =*/330).fork()).ldelim();
            if (message.lossParam != null && message.hasOwnProperty("lossParam"))
                $root.caffe.LossParameter.encode(message.lossParam, writer.uint32(/* id 42, wireType 2 =*/338).fork()).ldelim();
            if (message.param != null && message.param.length)
                for (var i = 0; i < message.param.length; ++i)
                    writer.uint32(/* id 1001, wireType 2 =*/8010).string(message.param[i]);
            if (message.blobShareMode != null && message.blobShareMode.length)
                for (var i = 0; i < message.blobShareMode.length; ++i)
                    writer.uint32(/* id 1002, wireType 0 =*/8016).int32(message.blobShareMode[i]);
            return writer;
        };

        /**
         * Encodes the specified V1LayerParameter message, length delimited. Does not implicitly {@link caffe.V1LayerParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.V1LayerParameter
         * @static
         * @param {caffe.IV1LayerParameter} message V1LayerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        V1LayerParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a V1LayerParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.V1LayerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.V1LayerParameter} V1LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        V1LayerParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.V1LayerParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 2:
                    if (!(message.bottom && message.bottom.length))
                        message.bottom = [];
                    message.bottom.push(reader.string());
                    break;
                case 3:
                    if (!(message.top && message.top.length))
                        message.top = [];
                    message.top.push(reader.string());
                    break;
                case 4:
                    message.name = reader.string();
                    break;
                case 32:
                    if (!(message.include && message.include.length))
                        message.include = [];
                    message.include.push($root.caffe.NetStateRule.decode(reader, reader.uint32()));
                    break;
                case 33:
                    if (!(message.exclude && message.exclude.length))
                        message.exclude = [];
                    message.exclude.push($root.caffe.NetStateRule.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.type = reader.int32();
                    break;
                case 6:
                    if (!(message.blobs && message.blobs.length))
                        message.blobs = [];
                    message.blobs.push($root.caffe.BlobProto.decode(reader, reader.uint32()));
                    break;
                case 1001:
                    if (!(message.param && message.param.length))
                        message.param = [];
                    message.param.push(reader.string());
                    break;
                case 1002:
                    if (!(message.blobShareMode && message.blobShareMode.length))
                        message.blobShareMode = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.blobShareMode.push(reader.int32());
                    } else
                        message.blobShareMode.push(reader.int32());
                    break;
                case 7:
                    if (!(message.blobsLr && message.blobsLr.length))
                        message.blobsLr = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.blobsLr.push(reader.float());
                    } else
                        message.blobsLr.push(reader.float());
                    break;
                case 8:
                    if (!(message.weightDecay && message.weightDecay.length))
                        message.weightDecay = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.weightDecay.push(reader.float());
                    } else
                        message.weightDecay.push(reader.float());
                    break;
                case 35:
                    if (!(message.lossWeight && message.lossWeight.length))
                        message.lossWeight = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.lossWeight.push(reader.float());
                    } else
                        message.lossWeight.push(reader.float());
                    break;
                case 27:
                    message.accuracyParam = $root.caffe.AccuracyParameter.decode(reader, reader.uint32());
                    break;
                case 23:
                    message.argmaxParam = $root.caffe.ArgMaxParameter.decode(reader, reader.uint32());
                    break;
                case 9:
                    message.concatParam = $root.caffe.ConcatParameter.decode(reader, reader.uint32());
                    break;
                case 40:
                    message.contrastiveLossParam = $root.caffe.ContrastiveLossParameter.decode(reader, reader.uint32());
                    break;
                case 10:
                    message.convolutionParam = $root.caffe.ConvolutionParameter.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.dataParam = $root.caffe.DataParameter.decode(reader, reader.uint32());
                    break;
                case 12:
                    message.dropoutParam = $root.caffe.DropoutParameter.decode(reader, reader.uint32());
                    break;
                case 26:
                    message.dummyDataParam = $root.caffe.DummyDataParameter.decode(reader, reader.uint32());
                    break;
                case 24:
                    message.eltwiseParam = $root.caffe.EltwiseParameter.decode(reader, reader.uint32());
                    break;
                case 41:
                    message.expParam = $root.caffe.ExpParameter.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.hdf5DataParam = $root.caffe.HDF5DataParameter.decode(reader, reader.uint32());
                    break;
                case 14:
                    message.hdf5OutputParam = $root.caffe.HDF5OutputParameter.decode(reader, reader.uint32());
                    break;
                case 29:
                    message.hingeLossParam = $root.caffe.HingeLossParameter.decode(reader, reader.uint32());
                    break;
                case 15:
                    message.imageDataParam = $root.caffe.ImageDataParameter.decode(reader, reader.uint32());
                    break;
                case 16:
                    message.infogainLossParam = $root.caffe.InfogainLossParameter.decode(reader, reader.uint32());
                    break;
                case 17:
                    message.innerProductParam = $root.caffe.InnerProductParameter.decode(reader, reader.uint32());
                    break;
                case 18:
                    message.lrnParam = $root.caffe.LRNParameter.decode(reader, reader.uint32());
                    break;
                case 22:
                    message.memoryDataParam = $root.caffe.MemoryDataParameter.decode(reader, reader.uint32());
                    break;
                case 34:
                    message.mvnParam = $root.caffe.MVNParameter.decode(reader, reader.uint32());
                    break;
                case 19:
                    message.poolingParam = $root.caffe.PoolingParameter.decode(reader, reader.uint32());
                    break;
                case 21:
                    message.powerParam = $root.caffe.PowerParameter.decode(reader, reader.uint32());
                    break;
                case 30:
                    message.reluParam = $root.caffe.ReLUParameter.decode(reader, reader.uint32());
                    break;
                case 38:
                    message.sigmoidParam = $root.caffe.SigmoidParameter.decode(reader, reader.uint32());
                    break;
                case 39:
                    message.softmaxParam = $root.caffe.SoftmaxParameter.decode(reader, reader.uint32());
                    break;
                case 31:
                    message.sliceParam = $root.caffe.SliceParameter.decode(reader, reader.uint32());
                    break;
                case 37:
                    message.tanhParam = $root.caffe.TanHParameter.decode(reader, reader.uint32());
                    break;
                case 25:
                    message.thresholdParam = $root.caffe.ThresholdParameter.decode(reader, reader.uint32());
                    break;
                case 20:
                    message.windowDataParam = $root.caffe.WindowDataParameter.decode(reader, reader.uint32());
                    break;
                case 36:
                    message.transformParam = $root.caffe.TransformationParameter.decode(reader, reader.uint32());
                    break;
                case 42:
                    message.lossParam = $root.caffe.LossParameter.decode(reader, reader.uint32());
                    break;
                case 1:
                    message.layer = $root.caffe.V0LayerParameter.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a V1LayerParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.V1LayerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.V1LayerParameter} V1LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        V1LayerParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a V1LayerParameter message.
         * @function verify
         * @memberof caffe.V1LayerParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        V1LayerParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.bottom != null && message.hasOwnProperty("bottom")) {
                if (!Array.isArray(message.bottom))
                    return "bottom: array expected";
                for (var i = 0; i < message.bottom.length; ++i)
                    if (!$util.isString(message.bottom[i]))
                        return "bottom: string[] expected";
            }
            if (message.top != null && message.hasOwnProperty("top")) {
                if (!Array.isArray(message.top))
                    return "top: array expected";
                for (var i = 0; i < message.top.length; ++i)
                    if (!$util.isString(message.top[i]))
                        return "top: string[] expected";
            }
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.include != null && message.hasOwnProperty("include")) {
                if (!Array.isArray(message.include))
                    return "include: array expected";
                for (var i = 0; i < message.include.length; ++i) {
                    var error = $root.caffe.NetStateRule.verify(message.include[i]);
                    if (error)
                        return "include." + error;
                }
            }
            if (message.exclude != null && message.hasOwnProperty("exclude")) {
                if (!Array.isArray(message.exclude))
                    return "exclude: array expected";
                for (var i = 0; i < message.exclude.length; ++i) {
                    error = $root.caffe.NetStateRule.verify(message.exclude[i]);
                    if (error)
                        return "exclude." + error;
                }
            }
            if (message.type != null && message.hasOwnProperty("type"))
                switch (message.type) {
                default:
                    return "type: enum value expected";
                case 0:
                case 35:
                case 1:
                case 30:
                case 2:
                case 3:
                case 37:
                case 4:
                case 5:
                case 39:
                case 6:
                case 32:
                case 7:
                case 25:
                case 38:
                case 8:
                case 9:
                case 10:
                case 28:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 29:
                case 16:
                case 34:
                case 17:
                case 26:
                case 18:
                case 19:
                case 27:
                case 36:
                case 20:
                case 21:
                case 22:
                case 33:
                case 23:
                case 24:
                case 31:
                    break;
                }
            if (message.blobs != null && message.hasOwnProperty("blobs")) {
                if (!Array.isArray(message.blobs))
                    return "blobs: array expected";
                for (var i = 0; i < message.blobs.length; ++i) {
                    error = $root.caffe.BlobProto.verify(message.blobs[i]);
                    if (error)
                        return "blobs." + error;
                }
            }
            if (message.param != null && message.hasOwnProperty("param")) {
                if (!Array.isArray(message.param))
                    return "param: array expected";
                for (var i = 0; i < message.param.length; ++i)
                    if (!$util.isString(message.param[i]))
                        return "param: string[] expected";
            }
            if (message.blobShareMode != null && message.hasOwnProperty("blobShareMode")) {
                if (!Array.isArray(message.blobShareMode))
                    return "blobShareMode: array expected";
                for (var i = 0; i < message.blobShareMode.length; ++i)
                    switch (message.blobShareMode[i]) {
                    default:
                        return "blobShareMode: enum value[] expected";
                    case 0:
                    case 1:
                        break;
                    }
            }
            if (message.blobsLr != null && message.hasOwnProperty("blobsLr")) {
                if (!Array.isArray(message.blobsLr))
                    return "blobsLr: array expected";
                for (var i = 0; i < message.blobsLr.length; ++i)
                    if (typeof message.blobsLr[i] !== "number")
                        return "blobsLr: number[] expected";
            }
            if (message.weightDecay != null && message.hasOwnProperty("weightDecay")) {
                if (!Array.isArray(message.weightDecay))
                    return "weightDecay: array expected";
                for (var i = 0; i < message.weightDecay.length; ++i)
                    if (typeof message.weightDecay[i] !== "number")
                        return "weightDecay: number[] expected";
            }
            if (message.lossWeight != null && message.hasOwnProperty("lossWeight")) {
                if (!Array.isArray(message.lossWeight))
                    return "lossWeight: array expected";
                for (var i = 0; i < message.lossWeight.length; ++i)
                    if (typeof message.lossWeight[i] !== "number")
                        return "lossWeight: number[] expected";
            }
            if (message.accuracyParam != null && message.hasOwnProperty("accuracyParam")) {
                error = $root.caffe.AccuracyParameter.verify(message.accuracyParam);
                if (error)
                    return "accuracyParam." + error;
            }
            if (message.argmaxParam != null && message.hasOwnProperty("argmaxParam")) {
                error = $root.caffe.ArgMaxParameter.verify(message.argmaxParam);
                if (error)
                    return "argmaxParam." + error;
            }
            if (message.concatParam != null && message.hasOwnProperty("concatParam")) {
                error = $root.caffe.ConcatParameter.verify(message.concatParam);
                if (error)
                    return "concatParam." + error;
            }
            if (message.contrastiveLossParam != null && message.hasOwnProperty("contrastiveLossParam")) {
                error = $root.caffe.ContrastiveLossParameter.verify(message.contrastiveLossParam);
                if (error)
                    return "contrastiveLossParam." + error;
            }
            if (message.convolutionParam != null && message.hasOwnProperty("convolutionParam")) {
                error = $root.caffe.ConvolutionParameter.verify(message.convolutionParam);
                if (error)
                    return "convolutionParam." + error;
            }
            if (message.dataParam != null && message.hasOwnProperty("dataParam")) {
                error = $root.caffe.DataParameter.verify(message.dataParam);
                if (error)
                    return "dataParam." + error;
            }
            if (message.dropoutParam != null && message.hasOwnProperty("dropoutParam")) {
                error = $root.caffe.DropoutParameter.verify(message.dropoutParam);
                if (error)
                    return "dropoutParam." + error;
            }
            if (message.dummyDataParam != null && message.hasOwnProperty("dummyDataParam")) {
                error = $root.caffe.DummyDataParameter.verify(message.dummyDataParam);
                if (error)
                    return "dummyDataParam." + error;
            }
            if (message.eltwiseParam != null && message.hasOwnProperty("eltwiseParam")) {
                error = $root.caffe.EltwiseParameter.verify(message.eltwiseParam);
                if (error)
                    return "eltwiseParam." + error;
            }
            if (message.expParam != null && message.hasOwnProperty("expParam")) {
                error = $root.caffe.ExpParameter.verify(message.expParam);
                if (error)
                    return "expParam." + error;
            }
            if (message.hdf5DataParam != null && message.hasOwnProperty("hdf5DataParam")) {
                error = $root.caffe.HDF5DataParameter.verify(message.hdf5DataParam);
                if (error)
                    return "hdf5DataParam." + error;
            }
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam")) {
                error = $root.caffe.HDF5OutputParameter.verify(message.hdf5OutputParam);
                if (error)
                    return "hdf5OutputParam." + error;
            }
            if (message.hingeLossParam != null && message.hasOwnProperty("hingeLossParam")) {
                error = $root.caffe.HingeLossParameter.verify(message.hingeLossParam);
                if (error)
                    return "hingeLossParam." + error;
            }
            if (message.imageDataParam != null && message.hasOwnProperty("imageDataParam")) {
                error = $root.caffe.ImageDataParameter.verify(message.imageDataParam);
                if (error)
                    return "imageDataParam." + error;
            }
            if (message.infogainLossParam != null && message.hasOwnProperty("infogainLossParam")) {
                error = $root.caffe.InfogainLossParameter.verify(message.infogainLossParam);
                if (error)
                    return "infogainLossParam." + error;
            }
            if (message.innerProductParam != null && message.hasOwnProperty("innerProductParam")) {
                error = $root.caffe.InnerProductParameter.verify(message.innerProductParam);
                if (error)
                    return "innerProductParam." + error;
            }
            if (message.lrnParam != null && message.hasOwnProperty("lrnParam")) {
                error = $root.caffe.LRNParameter.verify(message.lrnParam);
                if (error)
                    return "lrnParam." + error;
            }
            if (message.memoryDataParam != null && message.hasOwnProperty("memoryDataParam")) {
                error = $root.caffe.MemoryDataParameter.verify(message.memoryDataParam);
                if (error)
                    return "memoryDataParam." + error;
            }
            if (message.mvnParam != null && message.hasOwnProperty("mvnParam")) {
                error = $root.caffe.MVNParameter.verify(message.mvnParam);
                if (error)
                    return "mvnParam." + error;
            }
            if (message.poolingParam != null && message.hasOwnProperty("poolingParam")) {
                error = $root.caffe.PoolingParameter.verify(message.poolingParam);
                if (error)
                    return "poolingParam." + error;
            }
            if (message.powerParam != null && message.hasOwnProperty("powerParam")) {
                error = $root.caffe.PowerParameter.verify(message.powerParam);
                if (error)
                    return "powerParam." + error;
            }
            if (message.reluParam != null && message.hasOwnProperty("reluParam")) {
                error = $root.caffe.ReLUParameter.verify(message.reluParam);
                if (error)
                    return "reluParam." + error;
            }
            if (message.sigmoidParam != null && message.hasOwnProperty("sigmoidParam")) {
                error = $root.caffe.SigmoidParameter.verify(message.sigmoidParam);
                if (error)
                    return "sigmoidParam." + error;
            }
            if (message.softmaxParam != null && message.hasOwnProperty("softmaxParam")) {
                error = $root.caffe.SoftmaxParameter.verify(message.softmaxParam);
                if (error)
                    return "softmaxParam." + error;
            }
            if (message.sliceParam != null && message.hasOwnProperty("sliceParam")) {
                error = $root.caffe.SliceParameter.verify(message.sliceParam);
                if (error)
                    return "sliceParam." + error;
            }
            if (message.tanhParam != null && message.hasOwnProperty("tanhParam")) {
                error = $root.caffe.TanHParameter.verify(message.tanhParam);
                if (error)
                    return "tanhParam." + error;
            }
            if (message.thresholdParam != null && message.hasOwnProperty("thresholdParam")) {
                error = $root.caffe.ThresholdParameter.verify(message.thresholdParam);
                if (error)
                    return "thresholdParam." + error;
            }
            if (message.windowDataParam != null && message.hasOwnProperty("windowDataParam")) {
                error = $root.caffe.WindowDataParameter.verify(message.windowDataParam);
                if (error)
                    return "windowDataParam." + error;
            }
            if (message.transformParam != null && message.hasOwnProperty("transformParam")) {
                error = $root.caffe.TransformationParameter.verify(message.transformParam);
                if (error)
                    return "transformParam." + error;
            }
            if (message.lossParam != null && message.hasOwnProperty("lossParam")) {
                error = $root.caffe.LossParameter.verify(message.lossParam);
                if (error)
                    return "lossParam." + error;
            }
            if (message.layer != null && message.hasOwnProperty("layer")) {
                error = $root.caffe.V0LayerParameter.verify(message.layer);
                if (error)
                    return "layer." + error;
            }
            return null;
        };

        /**
         * Creates a V1LayerParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.V1LayerParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.V1LayerParameter} V1LayerParameter
         */
        V1LayerParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.V1LayerParameter)
                return object;
            var message = new $root.caffe.V1LayerParameter();
            if (object.bottom) {
                if (!Array.isArray(object.bottom))
                    throw TypeError(".caffe.V1LayerParameter.bottom: array expected");
                message.bottom = [];
                for (var i = 0; i < object.bottom.length; ++i)
                    message.bottom[i] = String(object.bottom[i]);
            }
            if (object.top) {
                if (!Array.isArray(object.top))
                    throw TypeError(".caffe.V1LayerParameter.top: array expected");
                message.top = [];
                for (var i = 0; i < object.top.length; ++i)
                    message.top[i] = String(object.top[i]);
            }
            if (object.name != null)
                message.name = String(object.name);
            if (object.include) {
                if (!Array.isArray(object.include))
                    throw TypeError(".caffe.V1LayerParameter.include: array expected");
                message.include = [];
                for (var i = 0; i < object.include.length; ++i) {
                    if (typeof object.include[i] !== "object")
                        throw TypeError(".caffe.V1LayerParameter.include: object expected");
                    message.include[i] = $root.caffe.NetStateRule.fromObject(object.include[i]);
                }
            }
            if (object.exclude) {
                if (!Array.isArray(object.exclude))
                    throw TypeError(".caffe.V1LayerParameter.exclude: array expected");
                message.exclude = [];
                for (var i = 0; i < object.exclude.length; ++i) {
                    if (typeof object.exclude[i] !== "object")
                        throw TypeError(".caffe.V1LayerParameter.exclude: object expected");
                    message.exclude[i] = $root.caffe.NetStateRule.fromObject(object.exclude[i]);
                }
            }
            switch (object.type) {
            case "NONE":
            case 0:
                message.type = 0;
                break;
            case "ABSVAL":
            case 35:
                message.type = 35;
                break;
            case "ACCURACY":
            case 1:
                message.type = 1;
                break;
            case "ARGMAX":
            case 30:
                message.type = 30;
                break;
            case "BNLL":
            case 2:
                message.type = 2;
                break;
            case "CONCAT":
            case 3:
                message.type = 3;
                break;
            case "CONTRASTIVE_LOSS":
            case 37:
                message.type = 37;
                break;
            case "CONVOLUTION":
            case 4:
                message.type = 4;
                break;
            case "DATA":
            case 5:
                message.type = 5;
                break;
            case "DECONVOLUTION":
            case 39:
                message.type = 39;
                break;
            case "DROPOUT":
            case 6:
                message.type = 6;
                break;
            case "DUMMY_DATA":
            case 32:
                message.type = 32;
                break;
            case "EUCLIDEAN_LOSS":
            case 7:
                message.type = 7;
                break;
            case "ELTWISE":
            case 25:
                message.type = 25;
                break;
            case "EXP":
            case 38:
                message.type = 38;
                break;
            case "FLATTEN":
            case 8:
                message.type = 8;
                break;
            case "HDF5_DATA":
            case 9:
                message.type = 9;
                break;
            case "HDF5_OUTPUT":
            case 10:
                message.type = 10;
                break;
            case "HINGE_LOSS":
            case 28:
                message.type = 28;
                break;
            case "IM2COL":
            case 11:
                message.type = 11;
                break;
            case "IMAGE_DATA":
            case 12:
                message.type = 12;
                break;
            case "INFOGAIN_LOSS":
            case 13:
                message.type = 13;
                break;
            case "INNER_PRODUCT":
            case 14:
                message.type = 14;
                break;
            case "LRN":
            case 15:
                message.type = 15;
                break;
            case "MEMORY_DATA":
            case 29:
                message.type = 29;
                break;
            case "MULTINOMIAL_LOGISTIC_LOSS":
            case 16:
                message.type = 16;
                break;
            case "MVN":
            case 34:
                message.type = 34;
                break;
            case "POOLING":
            case 17:
                message.type = 17;
                break;
            case "POWER":
            case 26:
                message.type = 26;
                break;
            case "RELU":
            case 18:
                message.type = 18;
                break;
            case "SIGMOID":
            case 19:
                message.type = 19;
                break;
            case "SIGMOID_CROSS_ENTROPY_LOSS":
            case 27:
                message.type = 27;
                break;
            case "SILENCE":
            case 36:
                message.type = 36;
                break;
            case "SOFTMAX":
            case 20:
                message.type = 20;
                break;
            case "SOFTMAX_LOSS":
            case 21:
                message.type = 21;
                break;
            case "SPLIT":
            case 22:
                message.type = 22;
                break;
            case "SLICE":
            case 33:
                message.type = 33;
                break;
            case "TANH":
            case 23:
                message.type = 23;
                break;
            case "WINDOW_DATA":
            case 24:
                message.type = 24;
                break;
            case "THRESHOLD":
            case 31:
                message.type = 31;
                break;
            }
            if (object.blobs) {
                if (!Array.isArray(object.blobs))
                    throw TypeError(".caffe.V1LayerParameter.blobs: array expected");
                message.blobs = [];
                for (var i = 0; i < object.blobs.length; ++i) {
                    if (typeof object.blobs[i] !== "object")
                        throw TypeError(".caffe.V1LayerParameter.blobs: object expected");
                    message.blobs[i] = $root.caffe.BlobProto.fromObject(object.blobs[i]);
                }
            }
            if (object.param) {
                if (!Array.isArray(object.param))
                    throw TypeError(".caffe.V1LayerParameter.param: array expected");
                message.param = [];
                for (var i = 0; i < object.param.length; ++i)
                    message.param[i] = String(object.param[i]);
            }
            if (object.blobShareMode) {
                if (!Array.isArray(object.blobShareMode))
                    throw TypeError(".caffe.V1LayerParameter.blobShareMode: array expected");
                message.blobShareMode = [];
                for (var i = 0; i < object.blobShareMode.length; ++i)
                    switch (object.blobShareMode[i]) {
                    default:
                    case "STRICT":
                    case 0:
                        message.blobShareMode[i] = 0;
                        break;
                    case "PERMISSIVE":
                    case 1:
                        message.blobShareMode[i] = 1;
                        break;
                    }
            }
            if (object.blobsLr) {
                if (!Array.isArray(object.blobsLr))
                    throw TypeError(".caffe.V1LayerParameter.blobsLr: array expected");
                message.blobsLr = [];
                for (var i = 0; i < object.blobsLr.length; ++i)
                    message.blobsLr[i] = Number(object.blobsLr[i]);
            }
            if (object.weightDecay) {
                if (!Array.isArray(object.weightDecay))
                    throw TypeError(".caffe.V1LayerParameter.weightDecay: array expected");
                message.weightDecay = [];
                for (var i = 0; i < object.weightDecay.length; ++i)
                    message.weightDecay[i] = Number(object.weightDecay[i]);
            }
            if (object.lossWeight) {
                if (!Array.isArray(object.lossWeight))
                    throw TypeError(".caffe.V1LayerParameter.lossWeight: array expected");
                message.lossWeight = [];
                for (var i = 0; i < object.lossWeight.length; ++i)
                    message.lossWeight[i] = Number(object.lossWeight[i]);
            }
            if (object.accuracyParam != null) {
                if (typeof object.accuracyParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.accuracyParam: object expected");
                message.accuracyParam = $root.caffe.AccuracyParameter.fromObject(object.accuracyParam);
            }
            if (object.argmaxParam != null) {
                if (typeof object.argmaxParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.argmaxParam: object expected");
                message.argmaxParam = $root.caffe.ArgMaxParameter.fromObject(object.argmaxParam);
            }
            if (object.concatParam != null) {
                if (typeof object.concatParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.concatParam: object expected");
                message.concatParam = $root.caffe.ConcatParameter.fromObject(object.concatParam);
            }
            if (object.contrastiveLossParam != null) {
                if (typeof object.contrastiveLossParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.contrastiveLossParam: object expected");
                message.contrastiveLossParam = $root.caffe.ContrastiveLossParameter.fromObject(object.contrastiveLossParam);
            }
            if (object.convolutionParam != null) {
                if (typeof object.convolutionParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.convolutionParam: object expected");
                message.convolutionParam = $root.caffe.ConvolutionParameter.fromObject(object.convolutionParam);
            }
            if (object.dataParam != null) {
                if (typeof object.dataParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.dataParam: object expected");
                message.dataParam = $root.caffe.DataParameter.fromObject(object.dataParam);
            }
            if (object.dropoutParam != null) {
                if (typeof object.dropoutParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.dropoutParam: object expected");
                message.dropoutParam = $root.caffe.DropoutParameter.fromObject(object.dropoutParam);
            }
            if (object.dummyDataParam != null) {
                if (typeof object.dummyDataParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.dummyDataParam: object expected");
                message.dummyDataParam = $root.caffe.DummyDataParameter.fromObject(object.dummyDataParam);
            }
            if (object.eltwiseParam != null) {
                if (typeof object.eltwiseParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.eltwiseParam: object expected");
                message.eltwiseParam = $root.caffe.EltwiseParameter.fromObject(object.eltwiseParam);
            }
            if (object.expParam != null) {
                if (typeof object.expParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.expParam: object expected");
                message.expParam = $root.caffe.ExpParameter.fromObject(object.expParam);
            }
            if (object.hdf5DataParam != null) {
                if (typeof object.hdf5DataParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.hdf5DataParam: object expected");
                message.hdf5DataParam = $root.caffe.HDF5DataParameter.fromObject(object.hdf5DataParam);
            }
            if (object.hdf5OutputParam != null) {
                if (typeof object.hdf5OutputParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.hdf5OutputParam: object expected");
                message.hdf5OutputParam = $root.caffe.HDF5OutputParameter.fromObject(object.hdf5OutputParam);
            }
            if (object.hingeLossParam != null) {
                if (typeof object.hingeLossParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.hingeLossParam: object expected");
                message.hingeLossParam = $root.caffe.HingeLossParameter.fromObject(object.hingeLossParam);
            }
            if (object.imageDataParam != null) {
                if (typeof object.imageDataParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.imageDataParam: object expected");
                message.imageDataParam = $root.caffe.ImageDataParameter.fromObject(object.imageDataParam);
            }
            if (object.infogainLossParam != null) {
                if (typeof object.infogainLossParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.infogainLossParam: object expected");
                message.infogainLossParam = $root.caffe.InfogainLossParameter.fromObject(object.infogainLossParam);
            }
            if (object.innerProductParam != null) {
                if (typeof object.innerProductParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.innerProductParam: object expected");
                message.innerProductParam = $root.caffe.InnerProductParameter.fromObject(object.innerProductParam);
            }
            if (object.lrnParam != null) {
                if (typeof object.lrnParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.lrnParam: object expected");
                message.lrnParam = $root.caffe.LRNParameter.fromObject(object.lrnParam);
            }
            if (object.memoryDataParam != null) {
                if (typeof object.memoryDataParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.memoryDataParam: object expected");
                message.memoryDataParam = $root.caffe.MemoryDataParameter.fromObject(object.memoryDataParam);
            }
            if (object.mvnParam != null) {
                if (typeof object.mvnParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.mvnParam: object expected");
                message.mvnParam = $root.caffe.MVNParameter.fromObject(object.mvnParam);
            }
            if (object.poolingParam != null) {
                if (typeof object.poolingParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.poolingParam: object expected");
                message.poolingParam = $root.caffe.PoolingParameter.fromObject(object.poolingParam);
            }
            if (object.powerParam != null) {
                if (typeof object.powerParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.powerParam: object expected");
                message.powerParam = $root.caffe.PowerParameter.fromObject(object.powerParam);
            }
            if (object.reluParam != null) {
                if (typeof object.reluParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.reluParam: object expected");
                message.reluParam = $root.caffe.ReLUParameter.fromObject(object.reluParam);
            }
            if (object.sigmoidParam != null) {
                if (typeof object.sigmoidParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.sigmoidParam: object expected");
                message.sigmoidParam = $root.caffe.SigmoidParameter.fromObject(object.sigmoidParam);
            }
            if (object.softmaxParam != null) {
                if (typeof object.softmaxParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.softmaxParam: object expected");
                message.softmaxParam = $root.caffe.SoftmaxParameter.fromObject(object.softmaxParam);
            }
            if (object.sliceParam != null) {
                if (typeof object.sliceParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.sliceParam: object expected");
                message.sliceParam = $root.caffe.SliceParameter.fromObject(object.sliceParam);
            }
            if (object.tanhParam != null) {
                if (typeof object.tanhParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.tanhParam: object expected");
                message.tanhParam = $root.caffe.TanHParameter.fromObject(object.tanhParam);
            }
            if (object.thresholdParam != null) {
                if (typeof object.thresholdParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.thresholdParam: object expected");
                message.thresholdParam = $root.caffe.ThresholdParameter.fromObject(object.thresholdParam);
            }
            if (object.windowDataParam != null) {
                if (typeof object.windowDataParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.windowDataParam: object expected");
                message.windowDataParam = $root.caffe.WindowDataParameter.fromObject(object.windowDataParam);
            }
            if (object.transformParam != null) {
                if (typeof object.transformParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.transformParam: object expected");
                message.transformParam = $root.caffe.TransformationParameter.fromObject(object.transformParam);
            }
            if (object.lossParam != null) {
                if (typeof object.lossParam !== "object")
                    throw TypeError(".caffe.V1LayerParameter.lossParam: object expected");
                message.lossParam = $root.caffe.LossParameter.fromObject(object.lossParam);
            }
            if (object.layer != null) {
                if (typeof object.layer !== "object")
                    throw TypeError(".caffe.V1LayerParameter.layer: object expected");
                message.layer = $root.caffe.V0LayerParameter.fromObject(object.layer);
            }
            return message;
        };

        /**
         * Creates a plain object from a V1LayerParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.V1LayerParameter
         * @static
         * @param {caffe.V1LayerParameter} message V1LayerParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        V1LayerParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.bottom = [];
                object.top = [];
                object.blobs = [];
                object.blobsLr = [];
                object.weightDecay = [];
                object.include = [];
                object.exclude = [];
                object.lossWeight = [];
                object.param = [];
                object.blobShareMode = [];
            }
            if (options.defaults) {
                object.layer = null;
                object.name = "";
                object.type = options.enums === String ? "NONE" : 0;
                object.concatParam = null;
                object.convolutionParam = null;
                object.dataParam = null;
                object.dropoutParam = null;
                object.hdf5DataParam = null;
                object.hdf5OutputParam = null;
                object.imageDataParam = null;
                object.infogainLossParam = null;
                object.innerProductParam = null;
                object.lrnParam = null;
                object.poolingParam = null;
                object.windowDataParam = null;
                object.powerParam = null;
                object.memoryDataParam = null;
                object.argmaxParam = null;
                object.eltwiseParam = null;
                object.thresholdParam = null;
                object.dummyDataParam = null;
                object.accuracyParam = null;
                object.hingeLossParam = null;
                object.reluParam = null;
                object.sliceParam = null;
                object.mvnParam = null;
                object.transformParam = null;
                object.tanhParam = null;
                object.sigmoidParam = null;
                object.softmaxParam = null;
                object.contrastiveLossParam = null;
                object.expParam = null;
                object.lossParam = null;
            }
            if (message.layer != null && message.hasOwnProperty("layer"))
                object.layer = $root.caffe.V0LayerParameter.toObject(message.layer, options);
            if (message.bottom && message.bottom.length) {
                object.bottom = [];
                for (var j = 0; j < message.bottom.length; ++j)
                    object.bottom[j] = message.bottom[j];
            }
            if (message.top && message.top.length) {
                object.top = [];
                for (var j = 0; j < message.top.length; ++j)
                    object.top[j] = message.top[j];
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = options.enums === String ? $root.caffe.V1LayerParameter.LayerType[message.type] : message.type;
            if (message.blobs && message.blobs.length) {
                object.blobs = [];
                for (var j = 0; j < message.blobs.length; ++j)
                    object.blobs[j] = $root.caffe.BlobProto.toObject(message.blobs[j], options);
            }
            if (message.blobsLr && message.blobsLr.length) {
                object.blobsLr = [];
                for (var j = 0; j < message.blobsLr.length; ++j)
                    object.blobsLr[j] = options.json && !isFinite(message.blobsLr[j]) ? String(message.blobsLr[j]) : message.blobsLr[j];
            }
            if (message.weightDecay && message.weightDecay.length) {
                object.weightDecay = [];
                for (var j = 0; j < message.weightDecay.length; ++j)
                    object.weightDecay[j] = options.json && !isFinite(message.weightDecay[j]) ? String(message.weightDecay[j]) : message.weightDecay[j];
            }
            if (message.concatParam != null && message.hasOwnProperty("concatParam"))
                object.concatParam = $root.caffe.ConcatParameter.toObject(message.concatParam, options);
            if (message.convolutionParam != null && message.hasOwnProperty("convolutionParam"))
                object.convolutionParam = $root.caffe.ConvolutionParameter.toObject(message.convolutionParam, options);
            if (message.dataParam != null && message.hasOwnProperty("dataParam"))
                object.dataParam = $root.caffe.DataParameter.toObject(message.dataParam, options);
            if (message.dropoutParam != null && message.hasOwnProperty("dropoutParam"))
                object.dropoutParam = $root.caffe.DropoutParameter.toObject(message.dropoutParam, options);
            if (message.hdf5DataParam != null && message.hasOwnProperty("hdf5DataParam"))
                object.hdf5DataParam = $root.caffe.HDF5DataParameter.toObject(message.hdf5DataParam, options);
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam"))
                object.hdf5OutputParam = $root.caffe.HDF5OutputParameter.toObject(message.hdf5OutputParam, options);
            if (message.imageDataParam != null && message.hasOwnProperty("imageDataParam"))
                object.imageDataParam = $root.caffe.ImageDataParameter.toObject(message.imageDataParam, options);
            if (message.infogainLossParam != null && message.hasOwnProperty("infogainLossParam"))
                object.infogainLossParam = $root.caffe.InfogainLossParameter.toObject(message.infogainLossParam, options);
            if (message.innerProductParam != null && message.hasOwnProperty("innerProductParam"))
                object.innerProductParam = $root.caffe.InnerProductParameter.toObject(message.innerProductParam, options);
            if (message.lrnParam != null && message.hasOwnProperty("lrnParam"))
                object.lrnParam = $root.caffe.LRNParameter.toObject(message.lrnParam, options);
            if (message.poolingParam != null && message.hasOwnProperty("poolingParam"))
                object.poolingParam = $root.caffe.PoolingParameter.toObject(message.poolingParam, options);
            if (message.windowDataParam != null && message.hasOwnProperty("windowDataParam"))
                object.windowDataParam = $root.caffe.WindowDataParameter.toObject(message.windowDataParam, options);
            if (message.powerParam != null && message.hasOwnProperty("powerParam"))
                object.powerParam = $root.caffe.PowerParameter.toObject(message.powerParam, options);
            if (message.memoryDataParam != null && message.hasOwnProperty("memoryDataParam"))
                object.memoryDataParam = $root.caffe.MemoryDataParameter.toObject(message.memoryDataParam, options);
            if (message.argmaxParam != null && message.hasOwnProperty("argmaxParam"))
                object.argmaxParam = $root.caffe.ArgMaxParameter.toObject(message.argmaxParam, options);
            if (message.eltwiseParam != null && message.hasOwnProperty("eltwiseParam"))
                object.eltwiseParam = $root.caffe.EltwiseParameter.toObject(message.eltwiseParam, options);
            if (message.thresholdParam != null && message.hasOwnProperty("thresholdParam"))
                object.thresholdParam = $root.caffe.ThresholdParameter.toObject(message.thresholdParam, options);
            if (message.dummyDataParam != null && message.hasOwnProperty("dummyDataParam"))
                object.dummyDataParam = $root.caffe.DummyDataParameter.toObject(message.dummyDataParam, options);
            if (message.accuracyParam != null && message.hasOwnProperty("accuracyParam"))
                object.accuracyParam = $root.caffe.AccuracyParameter.toObject(message.accuracyParam, options);
            if (message.hingeLossParam != null && message.hasOwnProperty("hingeLossParam"))
                object.hingeLossParam = $root.caffe.HingeLossParameter.toObject(message.hingeLossParam, options);
            if (message.reluParam != null && message.hasOwnProperty("reluParam"))
                object.reluParam = $root.caffe.ReLUParameter.toObject(message.reluParam, options);
            if (message.sliceParam != null && message.hasOwnProperty("sliceParam"))
                object.sliceParam = $root.caffe.SliceParameter.toObject(message.sliceParam, options);
            if (message.include && message.include.length) {
                object.include = [];
                for (var j = 0; j < message.include.length; ++j)
                    object.include[j] = $root.caffe.NetStateRule.toObject(message.include[j], options);
            }
            if (message.exclude && message.exclude.length) {
                object.exclude = [];
                for (var j = 0; j < message.exclude.length; ++j)
                    object.exclude[j] = $root.caffe.NetStateRule.toObject(message.exclude[j], options);
            }
            if (message.mvnParam != null && message.hasOwnProperty("mvnParam"))
                object.mvnParam = $root.caffe.MVNParameter.toObject(message.mvnParam, options);
            if (message.lossWeight && message.lossWeight.length) {
                object.lossWeight = [];
                for (var j = 0; j < message.lossWeight.length; ++j)
                    object.lossWeight[j] = options.json && !isFinite(message.lossWeight[j]) ? String(message.lossWeight[j]) : message.lossWeight[j];
            }
            if (message.transformParam != null && message.hasOwnProperty("transformParam"))
                object.transformParam = $root.caffe.TransformationParameter.toObject(message.transformParam, options);
            if (message.tanhParam != null && message.hasOwnProperty("tanhParam"))
                object.tanhParam = $root.caffe.TanHParameter.toObject(message.tanhParam, options);
            if (message.sigmoidParam != null && message.hasOwnProperty("sigmoidParam"))
                object.sigmoidParam = $root.caffe.SigmoidParameter.toObject(message.sigmoidParam, options);
            if (message.softmaxParam != null && message.hasOwnProperty("softmaxParam"))
                object.softmaxParam = $root.caffe.SoftmaxParameter.toObject(message.softmaxParam, options);
            if (message.contrastiveLossParam != null && message.hasOwnProperty("contrastiveLossParam"))
                object.contrastiveLossParam = $root.caffe.ContrastiveLossParameter.toObject(message.contrastiveLossParam, options);
            if (message.expParam != null && message.hasOwnProperty("expParam"))
                object.expParam = $root.caffe.ExpParameter.toObject(message.expParam, options);
            if (message.lossParam != null && message.hasOwnProperty("lossParam"))
                object.lossParam = $root.caffe.LossParameter.toObject(message.lossParam, options);
            if (message.param && message.param.length) {
                object.param = [];
                for (var j = 0; j < message.param.length; ++j)
                    object.param[j] = message.param[j];
            }
            if (message.blobShareMode && message.blobShareMode.length) {
                object.blobShareMode = [];
                for (var j = 0; j < message.blobShareMode.length; ++j)
                    object.blobShareMode[j] = options.enums === String ? $root.caffe.V1LayerParameter.DimCheckMode[message.blobShareMode[j]] : message.blobShareMode[j];
            }
            return object;
        };

        /**
         * Converts this V1LayerParameter to JSON.
         * @function toJSON
         * @memberof caffe.V1LayerParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        V1LayerParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * LayerType enum.
         * @enum {string}
         * @property {number} NONE=0 NONE value
         * @property {number} ABSVAL=35 ABSVAL value
         * @property {number} ACCURACY=1 ACCURACY value
         * @property {number} ARGMAX=30 ARGMAX value
         * @property {number} BNLL=2 BNLL value
         * @property {number} CONCAT=3 CONCAT value
         * @property {number} CONTRASTIVE_LOSS=37 CONTRASTIVE_LOSS value
         * @property {number} CONVOLUTION=4 CONVOLUTION value
         * @property {number} DATA=5 DATA value
         * @property {number} DECONVOLUTION=39 DECONVOLUTION value
         * @property {number} DROPOUT=6 DROPOUT value
         * @property {number} DUMMY_DATA=32 DUMMY_DATA value
         * @property {number} EUCLIDEAN_LOSS=7 EUCLIDEAN_LOSS value
         * @property {number} ELTWISE=25 ELTWISE value
         * @property {number} EXP=38 EXP value
         * @property {number} FLATTEN=8 FLATTEN value
         * @property {number} HDF5_DATA=9 HDF5_DATA value
         * @property {number} HDF5_OUTPUT=10 HDF5_OUTPUT value
         * @property {number} HINGE_LOSS=28 HINGE_LOSS value
         * @property {number} IM2COL=11 IM2COL value
         * @property {number} IMAGE_DATA=12 IMAGE_DATA value
         * @property {number} INFOGAIN_LOSS=13 INFOGAIN_LOSS value
         * @property {number} INNER_PRODUCT=14 INNER_PRODUCT value
         * @property {number} LRN=15 LRN value
         * @property {number} MEMORY_DATA=29 MEMORY_DATA value
         * @property {number} MULTINOMIAL_LOGISTIC_LOSS=16 MULTINOMIAL_LOGISTIC_LOSS value
         * @property {number} MVN=34 MVN value
         * @property {number} POOLING=17 POOLING value
         * @property {number} POWER=26 POWER value
         * @property {number} RELU=18 RELU value
         * @property {number} SIGMOID=19 SIGMOID value
         * @property {number} SIGMOID_CROSS_ENTROPY_LOSS=27 SIGMOID_CROSS_ENTROPY_LOSS value
         * @property {number} SILENCE=36 SILENCE value
         * @property {number} SOFTMAX=20 SOFTMAX value
         * @property {number} SOFTMAX_LOSS=21 SOFTMAX_LOSS value
         * @property {number} SPLIT=22 SPLIT value
         * @property {number} SLICE=33 SLICE value
         * @property {number} TANH=23 TANH value
         * @property {number} WINDOW_DATA=24 WINDOW_DATA value
         * @property {number} THRESHOLD=31 THRESHOLD value
         */
        V1LayerParameter.LayerType = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "NONE"] = 0;
            values[valuesById[35] = "ABSVAL"] = 35;
            values[valuesById[1] = "ACCURACY"] = 1;
            values[valuesById[30] = "ARGMAX"] = 30;
            values[valuesById[2] = "BNLL"] = 2;
            values[valuesById[3] = "CONCAT"] = 3;
            values[valuesById[37] = "CONTRASTIVE_LOSS"] = 37;
            values[valuesById[4] = "CONVOLUTION"] = 4;
            values[valuesById[5] = "DATA"] = 5;
            values[valuesById[39] = "DECONVOLUTION"] = 39;
            values[valuesById[6] = "DROPOUT"] = 6;
            values[valuesById[32] = "DUMMY_DATA"] = 32;
            values[valuesById[7] = "EUCLIDEAN_LOSS"] = 7;
            values[valuesById[25] = "ELTWISE"] = 25;
            values[valuesById[38] = "EXP"] = 38;
            values[valuesById[8] = "FLATTEN"] = 8;
            values[valuesById[9] = "HDF5_DATA"] = 9;
            values[valuesById[10] = "HDF5_OUTPUT"] = 10;
            values[valuesById[28] = "HINGE_LOSS"] = 28;
            values[valuesById[11] = "IM2COL"] = 11;
            values[valuesById[12] = "IMAGE_DATA"] = 12;
            values[valuesById[13] = "INFOGAIN_LOSS"] = 13;
            values[valuesById[14] = "INNER_PRODUCT"] = 14;
            values[valuesById[15] = "LRN"] = 15;
            values[valuesById[29] = "MEMORY_DATA"] = 29;
            values[valuesById[16] = "MULTINOMIAL_LOGISTIC_LOSS"] = 16;
            values[valuesById[34] = "MVN"] = 34;
            values[valuesById[17] = "POOLING"] = 17;
            values[valuesById[26] = "POWER"] = 26;
            values[valuesById[18] = "RELU"] = 18;
            values[valuesById[19] = "SIGMOID"] = 19;
            values[valuesById[27] = "SIGMOID_CROSS_ENTROPY_LOSS"] = 27;
            values[valuesById[36] = "SILENCE"] = 36;
            values[valuesById[20] = "SOFTMAX"] = 20;
            values[valuesById[21] = "SOFTMAX_LOSS"] = 21;
            values[valuesById[22] = "SPLIT"] = 22;
            values[valuesById[33] = "SLICE"] = 33;
            values[valuesById[23] = "TANH"] = 23;
            values[valuesById[24] = "WINDOW_DATA"] = 24;
            values[valuesById[31] = "THRESHOLD"] = 31;
            return values;
        })();

        /**
         * DimCheckMode enum.
         * @enum {string}
         * @property {number} STRICT=0 STRICT value
         * @property {number} PERMISSIVE=1 PERMISSIVE value
         */
        V1LayerParameter.DimCheckMode = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "STRICT"] = 0;
            values[valuesById[1] = "PERMISSIVE"] = 1;
            return values;
        })();

        return V1LayerParameter;
    })();

    caffe.V0LayerParameter = (function() {

        /**
         * Properties of a V0LayerParameter.
         * @memberof caffe
         * @interface IV0LayerParameter
         * @property {string} [name] V0LayerParameter name
         * @property {string} [type] V0LayerParameter type
         * @property {number} [numOutput] V0LayerParameter numOutput
         * @property {boolean} [biasterm] V0LayerParameter biasterm
         * @property {caffe.IFillerParameter} [weightFiller] V0LayerParameter weightFiller
         * @property {caffe.IFillerParameter} [biasFiller] V0LayerParameter biasFiller
         * @property {number} [pad] V0LayerParameter pad
         * @property {number} [kernelsize] V0LayerParameter kernelsize
         * @property {number} [group] V0LayerParameter group
         * @property {number} [stride] V0LayerParameter stride
         * @property {caffe.V0LayerParameter.PoolMethod} [pool] V0LayerParameter pool
         * @property {number} [dropoutRatio] V0LayerParameter dropoutRatio
         * @property {number} [localSize] V0LayerParameter localSize
         * @property {number} [alpha] V0LayerParameter alpha
         * @property {number} [beta] V0LayerParameter beta
         * @property {number} [k] V0LayerParameter k
         * @property {string} [source] V0LayerParameter source
         * @property {number} [scale] V0LayerParameter scale
         * @property {string} [meanfile] V0LayerParameter meanfile
         * @property {number} [batchsize] V0LayerParameter batchsize
         * @property {number} [cropsize] V0LayerParameter cropsize
         * @property {boolean} [mirror] V0LayerParameter mirror
         * @property {Array.<caffe.IBlobProto>} [blobs] V0LayerParameter blobs
         * @property {Array.<number>} [blobsLr] V0LayerParameter blobsLr
         * @property {Array.<number>} [weightDecay] V0LayerParameter weightDecay
         * @property {number} [randSkip] V0LayerParameter randSkip
         * @property {number} [detFgThreshold] V0LayerParameter detFgThreshold
         * @property {number} [detBgThreshold] V0LayerParameter detBgThreshold
         * @property {number} [detFgFraction] V0LayerParameter detFgFraction
         * @property {number} [detContextPad] V0LayerParameter detContextPad
         * @property {string} [detCropMode] V0LayerParameter detCropMode
         * @property {number} [newNum] V0LayerParameter newNum
         * @property {number} [newChannels] V0LayerParameter newChannels
         * @property {number} [newHeight] V0LayerParameter newHeight
         * @property {number} [newWidth] V0LayerParameter newWidth
         * @property {boolean} [shuffleImages] V0LayerParameter shuffleImages
         * @property {number} [concatDim] V0LayerParameter concatDim
         * @property {caffe.IHDF5OutputParameter} [hdf5OutputParam] V0LayerParameter hdf5OutputParam
         */

        /**
         * Constructs a new V0LayerParameter.
         * @memberof caffe
         * @classdesc Represents a V0LayerParameter.
         * @constructor
         * @param {caffe.IV0LayerParameter=} [properties] Properties to set
         */
        function V0LayerParameter(properties) {
            this.blobs = [];
            this.blobsLr = [];
            this.weightDecay = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * V0LayerParameter name.
         * @member {string}name
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.name = "";

        /**
         * V0LayerParameter type.
         * @member {string}type
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.type = "";

        /**
         * V0LayerParameter numOutput.
         * @member {number}numOutput
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.numOutput = 0;

        /**
         * V0LayerParameter biasterm.
         * @member {boolean}biasterm
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.biasterm = true;

        /**
         * V0LayerParameter weightFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}weightFiller
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.weightFiller = null;

        /**
         * V0LayerParameter biasFiller.
         * @member {(caffe.IFillerParameter|null|undefined)}biasFiller
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.biasFiller = null;

        /**
         * V0LayerParameter pad.
         * @member {number}pad
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.pad = 0;

        /**
         * V0LayerParameter kernelsize.
         * @member {number}kernelsize
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.kernelsize = 0;

        /**
         * V0LayerParameter group.
         * @member {number}group
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.group = 1;

        /**
         * V0LayerParameter stride.
         * @member {number}stride
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.stride = 1;

        /**
         * V0LayerParameter pool.
         * @member {caffe.V0LayerParameter.PoolMethod}pool
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.pool = 0;

        /**
         * V0LayerParameter dropoutRatio.
         * @member {number}dropoutRatio
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.dropoutRatio = 0.5;

        /**
         * V0LayerParameter localSize.
         * @member {number}localSize
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.localSize = 5;

        /**
         * V0LayerParameter alpha.
         * @member {number}alpha
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.alpha = 1;

        /**
         * V0LayerParameter beta.
         * @member {number}beta
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.beta = 0.75;

        /**
         * V0LayerParameter k.
         * @member {number}k
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.k = 1;

        /**
         * V0LayerParameter source.
         * @member {string}source
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.source = "";

        /**
         * V0LayerParameter scale.
         * @member {number}scale
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.scale = 1;

        /**
         * V0LayerParameter meanfile.
         * @member {string}meanfile
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.meanfile = "";

        /**
         * V0LayerParameter batchsize.
         * @member {number}batchsize
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.batchsize = 0;

        /**
         * V0LayerParameter cropsize.
         * @member {number}cropsize
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.cropsize = 0;

        /**
         * V0LayerParameter mirror.
         * @member {boolean}mirror
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.mirror = false;

        /**
         * V0LayerParameter blobs.
         * @member {Array.<caffe.IBlobProto>}blobs
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.blobs = $util.emptyArray;

        /**
         * V0LayerParameter blobsLr.
         * @member {Array.<number>}blobsLr
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.blobsLr = $util.emptyArray;

        /**
         * V0LayerParameter weightDecay.
         * @member {Array.<number>}weightDecay
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.weightDecay = $util.emptyArray;

        /**
         * V0LayerParameter randSkip.
         * @member {number}randSkip
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.randSkip = 0;

        /**
         * V0LayerParameter detFgThreshold.
         * @member {number}detFgThreshold
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.detFgThreshold = 0.5;

        /**
         * V0LayerParameter detBgThreshold.
         * @member {number}detBgThreshold
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.detBgThreshold = 0.5;

        /**
         * V0LayerParameter detFgFraction.
         * @member {number}detFgFraction
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.detFgFraction = 0.25;

        /**
         * V0LayerParameter detContextPad.
         * @member {number}detContextPad
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.detContextPad = 0;

        /**
         * V0LayerParameter detCropMode.
         * @member {string}detCropMode
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.detCropMode = "warp";

        /**
         * V0LayerParameter newNum.
         * @member {number}newNum
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.newNum = 0;

        /**
         * V0LayerParameter newChannels.
         * @member {number}newChannels
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.newChannels = 0;

        /**
         * V0LayerParameter newHeight.
         * @member {number}newHeight
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.newHeight = 0;

        /**
         * V0LayerParameter newWidth.
         * @member {number}newWidth
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.newWidth = 0;

        /**
         * V0LayerParameter shuffleImages.
         * @member {boolean}shuffleImages
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.shuffleImages = false;

        /**
         * V0LayerParameter concatDim.
         * @member {number}concatDim
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.concatDim = 1;

        /**
         * V0LayerParameter hdf5OutputParam.
         * @member {(caffe.IHDF5OutputParameter|null|undefined)}hdf5OutputParam
         * @memberof caffe.V0LayerParameter
         * @instance
         */
        V0LayerParameter.prototype.hdf5OutputParam = null;

        /**
         * Creates a new V0LayerParameter instance using the specified properties.
         * @function create
         * @memberof caffe.V0LayerParameter
         * @static
         * @param {caffe.IV0LayerParameter=} [properties] Properties to set
         * @returns {caffe.V0LayerParameter} V0LayerParameter instance
         */
        V0LayerParameter.create = function create(properties) {
            return new V0LayerParameter(properties);
        };

        /**
         * Encodes the specified V0LayerParameter message. Does not implicitly {@link caffe.V0LayerParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.V0LayerParameter
         * @static
         * @param {caffe.IV0LayerParameter} message V0LayerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        V0LayerParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && message.hasOwnProperty("name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.type != null && message.hasOwnProperty("type"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.type);
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.numOutput);
            if (message.biasterm != null && message.hasOwnProperty("biasterm"))
                writer.uint32(/* id 4, wireType 0 =*/32).bool(message.biasterm);
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                $root.caffe.FillerParameter.encode(message.weightFiller, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                $root.caffe.FillerParameter.encode(message.biasFiller, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.pad != null && message.hasOwnProperty("pad"))
                writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.pad);
            if (message.kernelsize != null && message.hasOwnProperty("kernelsize"))
                writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.kernelsize);
            if (message.group != null && message.hasOwnProperty("group"))
                writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.group);
            if (message.stride != null && message.hasOwnProperty("stride"))
                writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.stride);
            if (message.pool != null && message.hasOwnProperty("pool"))
                writer.uint32(/* id 11, wireType 0 =*/88).int32(message.pool);
            if (message.dropoutRatio != null && message.hasOwnProperty("dropoutRatio"))
                writer.uint32(/* id 12, wireType 5 =*/101).float(message.dropoutRatio);
            if (message.localSize != null && message.hasOwnProperty("localSize"))
                writer.uint32(/* id 13, wireType 0 =*/104).uint32(message.localSize);
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                writer.uint32(/* id 14, wireType 5 =*/117).float(message.alpha);
            if (message.beta != null && message.hasOwnProperty("beta"))
                writer.uint32(/* id 15, wireType 5 =*/125).float(message.beta);
            if (message.source != null && message.hasOwnProperty("source"))
                writer.uint32(/* id 16, wireType 2 =*/130).string(message.source);
            if (message.scale != null && message.hasOwnProperty("scale"))
                writer.uint32(/* id 17, wireType 5 =*/141).float(message.scale);
            if (message.meanfile != null && message.hasOwnProperty("meanfile"))
                writer.uint32(/* id 18, wireType 2 =*/146).string(message.meanfile);
            if (message.batchsize != null && message.hasOwnProperty("batchsize"))
                writer.uint32(/* id 19, wireType 0 =*/152).uint32(message.batchsize);
            if (message.cropsize != null && message.hasOwnProperty("cropsize"))
                writer.uint32(/* id 20, wireType 0 =*/160).uint32(message.cropsize);
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                writer.uint32(/* id 21, wireType 0 =*/168).bool(message.mirror);
            if (message.k != null && message.hasOwnProperty("k"))
                writer.uint32(/* id 22, wireType 5 =*/181).float(message.k);
            if (message.blobs != null && message.blobs.length)
                for (var i = 0; i < message.blobs.length; ++i)
                    $root.caffe.BlobProto.encode(message.blobs[i], writer.uint32(/* id 50, wireType 2 =*/402).fork()).ldelim();
            if (message.blobsLr != null && message.blobsLr.length)
                for (var i = 0; i < message.blobsLr.length; ++i)
                    writer.uint32(/* id 51, wireType 5 =*/413).float(message.blobsLr[i]);
            if (message.weightDecay != null && message.weightDecay.length)
                for (var i = 0; i < message.weightDecay.length; ++i)
                    writer.uint32(/* id 52, wireType 5 =*/421).float(message.weightDecay[i]);
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                writer.uint32(/* id 53, wireType 0 =*/424).uint32(message.randSkip);
            if (message.detFgThreshold != null && message.hasOwnProperty("detFgThreshold"))
                writer.uint32(/* id 54, wireType 5 =*/437).float(message.detFgThreshold);
            if (message.detBgThreshold != null && message.hasOwnProperty("detBgThreshold"))
                writer.uint32(/* id 55, wireType 5 =*/445).float(message.detBgThreshold);
            if (message.detFgFraction != null && message.hasOwnProperty("detFgFraction"))
                writer.uint32(/* id 56, wireType 5 =*/453).float(message.detFgFraction);
            if (message.detContextPad != null && message.hasOwnProperty("detContextPad"))
                writer.uint32(/* id 58, wireType 0 =*/464).uint32(message.detContextPad);
            if (message.detCropMode != null && message.hasOwnProperty("detCropMode"))
                writer.uint32(/* id 59, wireType 2 =*/474).string(message.detCropMode);
            if (message.newNum != null && message.hasOwnProperty("newNum"))
                writer.uint32(/* id 60, wireType 0 =*/480).int32(message.newNum);
            if (message.newChannels != null && message.hasOwnProperty("newChannels"))
                writer.uint32(/* id 61, wireType 0 =*/488).int32(message.newChannels);
            if (message.newHeight != null && message.hasOwnProperty("newHeight"))
                writer.uint32(/* id 62, wireType 0 =*/496).int32(message.newHeight);
            if (message.newWidth != null && message.hasOwnProperty("newWidth"))
                writer.uint32(/* id 63, wireType 0 =*/504).int32(message.newWidth);
            if (message.shuffleImages != null && message.hasOwnProperty("shuffleImages"))
                writer.uint32(/* id 64, wireType 0 =*/512).bool(message.shuffleImages);
            if (message.concatDim != null && message.hasOwnProperty("concatDim"))
                writer.uint32(/* id 65, wireType 0 =*/520).uint32(message.concatDim);
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam"))
                $root.caffe.HDF5OutputParameter.encode(message.hdf5OutputParam, writer.uint32(/* id 1001, wireType 2 =*/8010).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified V0LayerParameter message, length delimited. Does not implicitly {@link caffe.V0LayerParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.V0LayerParameter
         * @static
         * @param {caffe.IV0LayerParameter} message V0LayerParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        V0LayerParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a V0LayerParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.V0LayerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.V0LayerParameter} V0LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        V0LayerParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.V0LayerParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.name = reader.string();
                    break;
                case 2:
                    message.type = reader.string();
                    break;
                case 3:
                    message.numOutput = reader.uint32();
                    break;
                case 4:
                    message.biasterm = reader.bool();
                    break;
                case 5:
                    message.weightFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 6:
                    message.biasFiller = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 7:
                    message.pad = reader.uint32();
                    break;
                case 8:
                    message.kernelsize = reader.uint32();
                    break;
                case 9:
                    message.group = reader.uint32();
                    break;
                case 10:
                    message.stride = reader.uint32();
                    break;
                case 11:
                    message.pool = reader.int32();
                    break;
                case 12:
                    message.dropoutRatio = reader.float();
                    break;
                case 13:
                    message.localSize = reader.uint32();
                    break;
                case 14:
                    message.alpha = reader.float();
                    break;
                case 15:
                    message.beta = reader.float();
                    break;
                case 22:
                    message.k = reader.float();
                    break;
                case 16:
                    message.source = reader.string();
                    break;
                case 17:
                    message.scale = reader.float();
                    break;
                case 18:
                    message.meanfile = reader.string();
                    break;
                case 19:
                    message.batchsize = reader.uint32();
                    break;
                case 20:
                    message.cropsize = reader.uint32();
                    break;
                case 21:
                    message.mirror = reader.bool();
                    break;
                case 50:
                    if (!(message.blobs && message.blobs.length))
                        message.blobs = [];
                    message.blobs.push($root.caffe.BlobProto.decode(reader, reader.uint32()));
                    break;
                case 51:
                    if (!(message.blobsLr && message.blobsLr.length))
                        message.blobsLr = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.blobsLr.push(reader.float());
                    } else
                        message.blobsLr.push(reader.float());
                    break;
                case 52:
                    if (!(message.weightDecay && message.weightDecay.length))
                        message.weightDecay = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.weightDecay.push(reader.float());
                    } else
                        message.weightDecay.push(reader.float());
                    break;
                case 53:
                    message.randSkip = reader.uint32();
                    break;
                case 54:
                    message.detFgThreshold = reader.float();
                    break;
                case 55:
                    message.detBgThreshold = reader.float();
                    break;
                case 56:
                    message.detFgFraction = reader.float();
                    break;
                case 58:
                    message.detContextPad = reader.uint32();
                    break;
                case 59:
                    message.detCropMode = reader.string();
                    break;
                case 60:
                    message.newNum = reader.int32();
                    break;
                case 61:
                    message.newChannels = reader.int32();
                    break;
                case 62:
                    message.newHeight = reader.int32();
                    break;
                case 63:
                    message.newWidth = reader.int32();
                    break;
                case 64:
                    message.shuffleImages = reader.bool();
                    break;
                case 65:
                    message.concatDim = reader.uint32();
                    break;
                case 1001:
                    message.hdf5OutputParam = $root.caffe.HDF5OutputParameter.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a V0LayerParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.V0LayerParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.V0LayerParameter} V0LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        V0LayerParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a V0LayerParameter message.
         * @function verify
         * @memberof caffe.V0LayerParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        V0LayerParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isString(message.type))
                    return "type: string expected";
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                if (!$util.isInteger(message.numOutput))
                    return "numOutput: integer expected";
            if (message.biasterm != null && message.hasOwnProperty("biasterm"))
                if (typeof message.biasterm !== "boolean")
                    return "biasterm: boolean expected";
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller")) {
                var error = $root.caffe.FillerParameter.verify(message.weightFiller);
                if (error)
                    return "weightFiller." + error;
            }
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller")) {
                error = $root.caffe.FillerParameter.verify(message.biasFiller);
                if (error)
                    return "biasFiller." + error;
            }
            if (message.pad != null && message.hasOwnProperty("pad"))
                if (!$util.isInteger(message.pad))
                    return "pad: integer expected";
            if (message.kernelsize != null && message.hasOwnProperty("kernelsize"))
                if (!$util.isInteger(message.kernelsize))
                    return "kernelsize: integer expected";
            if (message.group != null && message.hasOwnProperty("group"))
                if (!$util.isInteger(message.group))
                    return "group: integer expected";
            if (message.stride != null && message.hasOwnProperty("stride"))
                if (!$util.isInteger(message.stride))
                    return "stride: integer expected";
            if (message.pool != null && message.hasOwnProperty("pool"))
                switch (message.pool) {
                default:
                    return "pool: enum value expected";
                case 0:
                case 1:
                case 2:
                    break;
                }
            if (message.dropoutRatio != null && message.hasOwnProperty("dropoutRatio"))
                if (typeof message.dropoutRatio !== "number")
                    return "dropoutRatio: number expected";
            if (message.localSize != null && message.hasOwnProperty("localSize"))
                if (!$util.isInteger(message.localSize))
                    return "localSize: integer expected";
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                if (typeof message.alpha !== "number")
                    return "alpha: number expected";
            if (message.beta != null && message.hasOwnProperty("beta"))
                if (typeof message.beta !== "number")
                    return "beta: number expected";
            if (message.k != null && message.hasOwnProperty("k"))
                if (typeof message.k !== "number")
                    return "k: number expected";
            if (message.source != null && message.hasOwnProperty("source"))
                if (!$util.isString(message.source))
                    return "source: string expected";
            if (message.scale != null && message.hasOwnProperty("scale"))
                if (typeof message.scale !== "number")
                    return "scale: number expected";
            if (message.meanfile != null && message.hasOwnProperty("meanfile"))
                if (!$util.isString(message.meanfile))
                    return "meanfile: string expected";
            if (message.batchsize != null && message.hasOwnProperty("batchsize"))
                if (!$util.isInteger(message.batchsize))
                    return "batchsize: integer expected";
            if (message.cropsize != null && message.hasOwnProperty("cropsize"))
                if (!$util.isInteger(message.cropsize))
                    return "cropsize: integer expected";
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                if (typeof message.mirror !== "boolean")
                    return "mirror: boolean expected";
            if (message.blobs != null && message.hasOwnProperty("blobs")) {
                if (!Array.isArray(message.blobs))
                    return "blobs: array expected";
                for (var i = 0; i < message.blobs.length; ++i) {
                    error = $root.caffe.BlobProto.verify(message.blobs[i]);
                    if (error)
                        return "blobs." + error;
                }
            }
            if (message.blobsLr != null && message.hasOwnProperty("blobsLr")) {
                if (!Array.isArray(message.blobsLr))
                    return "blobsLr: array expected";
                for (var i = 0; i < message.blobsLr.length; ++i)
                    if (typeof message.blobsLr[i] !== "number")
                        return "blobsLr: number[] expected";
            }
            if (message.weightDecay != null && message.hasOwnProperty("weightDecay")) {
                if (!Array.isArray(message.weightDecay))
                    return "weightDecay: array expected";
                for (var i = 0; i < message.weightDecay.length; ++i)
                    if (typeof message.weightDecay[i] !== "number")
                        return "weightDecay: number[] expected";
            }
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                if (!$util.isInteger(message.randSkip))
                    return "randSkip: integer expected";
            if (message.detFgThreshold != null && message.hasOwnProperty("detFgThreshold"))
                if (typeof message.detFgThreshold !== "number")
                    return "detFgThreshold: number expected";
            if (message.detBgThreshold != null && message.hasOwnProperty("detBgThreshold"))
                if (typeof message.detBgThreshold !== "number")
                    return "detBgThreshold: number expected";
            if (message.detFgFraction != null && message.hasOwnProperty("detFgFraction"))
                if (typeof message.detFgFraction !== "number")
                    return "detFgFraction: number expected";
            if (message.detContextPad != null && message.hasOwnProperty("detContextPad"))
                if (!$util.isInteger(message.detContextPad))
                    return "detContextPad: integer expected";
            if (message.detCropMode != null && message.hasOwnProperty("detCropMode"))
                if (!$util.isString(message.detCropMode))
                    return "detCropMode: string expected";
            if (message.newNum != null && message.hasOwnProperty("newNum"))
                if (!$util.isInteger(message.newNum))
                    return "newNum: integer expected";
            if (message.newChannels != null && message.hasOwnProperty("newChannels"))
                if (!$util.isInteger(message.newChannels))
                    return "newChannels: integer expected";
            if (message.newHeight != null && message.hasOwnProperty("newHeight"))
                if (!$util.isInteger(message.newHeight))
                    return "newHeight: integer expected";
            if (message.newWidth != null && message.hasOwnProperty("newWidth"))
                if (!$util.isInteger(message.newWidth))
                    return "newWidth: integer expected";
            if (message.shuffleImages != null && message.hasOwnProperty("shuffleImages"))
                if (typeof message.shuffleImages !== "boolean")
                    return "shuffleImages: boolean expected";
            if (message.concatDim != null && message.hasOwnProperty("concatDim"))
                if (!$util.isInteger(message.concatDim))
                    return "concatDim: integer expected";
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam")) {
                error = $root.caffe.HDF5OutputParameter.verify(message.hdf5OutputParam);
                if (error)
                    return "hdf5OutputParam." + error;
            }
            return null;
        };

        /**
         * Creates a V0LayerParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.V0LayerParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.V0LayerParameter} V0LayerParameter
         */
        V0LayerParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.V0LayerParameter)
                return object;
            var message = new $root.caffe.V0LayerParameter();
            if (object.name != null)
                message.name = String(object.name);
            if (object.type != null)
                message.type = String(object.type);
            if (object.numOutput != null)
                message.numOutput = object.numOutput >>> 0;
            if (object.biasterm != null)
                message.biasterm = Boolean(object.biasterm);
            if (object.weightFiller != null) {
                if (typeof object.weightFiller !== "object")
                    throw TypeError(".caffe.V0LayerParameter.weightFiller: object expected");
                message.weightFiller = $root.caffe.FillerParameter.fromObject(object.weightFiller);
            }
            if (object.biasFiller != null) {
                if (typeof object.biasFiller !== "object")
                    throw TypeError(".caffe.V0LayerParameter.biasFiller: object expected");
                message.biasFiller = $root.caffe.FillerParameter.fromObject(object.biasFiller);
            }
            if (object.pad != null)
                message.pad = object.pad >>> 0;
            if (object.kernelsize != null)
                message.kernelsize = object.kernelsize >>> 0;
            if (object.group != null)
                message.group = object.group >>> 0;
            if (object.stride != null)
                message.stride = object.stride >>> 0;
            switch (object.pool) {
            case "MAX":
            case 0:
                message.pool = 0;
                break;
            case "AVE":
            case 1:
                message.pool = 1;
                break;
            case "STOCHASTIC":
            case 2:
                message.pool = 2;
                break;
            }
            if (object.dropoutRatio != null)
                message.dropoutRatio = Number(object.dropoutRatio);
            if (object.localSize != null)
                message.localSize = object.localSize >>> 0;
            if (object.alpha != null)
                message.alpha = Number(object.alpha);
            if (object.beta != null)
                message.beta = Number(object.beta);
            if (object.k != null)
                message.k = Number(object.k);
            if (object.source != null)
                message.source = String(object.source);
            if (object.scale != null)
                message.scale = Number(object.scale);
            if (object.meanfile != null)
                message.meanfile = String(object.meanfile);
            if (object.batchsize != null)
                message.batchsize = object.batchsize >>> 0;
            if (object.cropsize != null)
                message.cropsize = object.cropsize >>> 0;
            if (object.mirror != null)
                message.mirror = Boolean(object.mirror);
            if (object.blobs) {
                if (!Array.isArray(object.blobs))
                    throw TypeError(".caffe.V0LayerParameter.blobs: array expected");
                message.blobs = [];
                for (var i = 0; i < object.blobs.length; ++i) {
                    if (typeof object.blobs[i] !== "object")
                        throw TypeError(".caffe.V0LayerParameter.blobs: object expected");
                    message.blobs[i] = $root.caffe.BlobProto.fromObject(object.blobs[i]);
                }
            }
            if (object.blobsLr) {
                if (!Array.isArray(object.blobsLr))
                    throw TypeError(".caffe.V0LayerParameter.blobsLr: array expected");
                message.blobsLr = [];
                for (var i = 0; i < object.blobsLr.length; ++i)
                    message.blobsLr[i] = Number(object.blobsLr[i]);
            }
            if (object.weightDecay) {
                if (!Array.isArray(object.weightDecay))
                    throw TypeError(".caffe.V0LayerParameter.weightDecay: array expected");
                message.weightDecay = [];
                for (var i = 0; i < object.weightDecay.length; ++i)
                    message.weightDecay[i] = Number(object.weightDecay[i]);
            }
            if (object.randSkip != null)
                message.randSkip = object.randSkip >>> 0;
            if (object.detFgThreshold != null)
                message.detFgThreshold = Number(object.detFgThreshold);
            if (object.detBgThreshold != null)
                message.detBgThreshold = Number(object.detBgThreshold);
            if (object.detFgFraction != null)
                message.detFgFraction = Number(object.detFgFraction);
            if (object.detContextPad != null)
                message.detContextPad = object.detContextPad >>> 0;
            if (object.detCropMode != null)
                message.detCropMode = String(object.detCropMode);
            if (object.newNum != null)
                message.newNum = object.newNum | 0;
            if (object.newChannels != null)
                message.newChannels = object.newChannels | 0;
            if (object.newHeight != null)
                message.newHeight = object.newHeight | 0;
            if (object.newWidth != null)
                message.newWidth = object.newWidth | 0;
            if (object.shuffleImages != null)
                message.shuffleImages = Boolean(object.shuffleImages);
            if (object.concatDim != null)
                message.concatDim = object.concatDim >>> 0;
            if (object.hdf5OutputParam != null) {
                if (typeof object.hdf5OutputParam !== "object")
                    throw TypeError(".caffe.V0LayerParameter.hdf5OutputParam: object expected");
                message.hdf5OutputParam = $root.caffe.HDF5OutputParameter.fromObject(object.hdf5OutputParam);
            }
            return message;
        };

        /**
         * Creates a plain object from a V0LayerParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.V0LayerParameter
         * @static
         * @param {caffe.V0LayerParameter} message V0LayerParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        V0LayerParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.blobs = [];
                object.blobsLr = [];
                object.weightDecay = [];
            }
            if (options.defaults) {
                object.name = "";
                object.type = "";
                object.numOutput = 0;
                object.biasterm = true;
                object.weightFiller = null;
                object.biasFiller = null;
                object.pad = 0;
                object.kernelsize = 0;
                object.group = 1;
                object.stride = 1;
                object.pool = options.enums === String ? "MAX" : 0;
                object.dropoutRatio = 0.5;
                object.localSize = 5;
                object.alpha = 1;
                object.beta = 0.75;
                object.source = "";
                object.scale = 1;
                object.meanfile = "";
                object.batchsize = 0;
                object.cropsize = 0;
                object.mirror = false;
                object.k = 1;
                object.randSkip = 0;
                object.detFgThreshold = 0.5;
                object.detBgThreshold = 0.5;
                object.detFgFraction = 0.25;
                object.detContextPad = 0;
                object.detCropMode = "warp";
                object.newNum = 0;
                object.newChannels = 0;
                object.newHeight = 0;
                object.newWidth = 0;
                object.shuffleImages = false;
                object.concatDim = 1;
                object.hdf5OutputParam = null;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.numOutput != null && message.hasOwnProperty("numOutput"))
                object.numOutput = message.numOutput;
            if (message.biasterm != null && message.hasOwnProperty("biasterm"))
                object.biasterm = message.biasterm;
            if (message.weightFiller != null && message.hasOwnProperty("weightFiller"))
                object.weightFiller = $root.caffe.FillerParameter.toObject(message.weightFiller, options);
            if (message.biasFiller != null && message.hasOwnProperty("biasFiller"))
                object.biasFiller = $root.caffe.FillerParameter.toObject(message.biasFiller, options);
            if (message.pad != null && message.hasOwnProperty("pad"))
                object.pad = message.pad;
            if (message.kernelsize != null && message.hasOwnProperty("kernelsize"))
                object.kernelsize = message.kernelsize;
            if (message.group != null && message.hasOwnProperty("group"))
                object.group = message.group;
            if (message.stride != null && message.hasOwnProperty("stride"))
                object.stride = message.stride;
            if (message.pool != null && message.hasOwnProperty("pool"))
                object.pool = options.enums === String ? $root.caffe.V0LayerParameter.PoolMethod[message.pool] : message.pool;
            if (message.dropoutRatio != null && message.hasOwnProperty("dropoutRatio"))
                object.dropoutRatio = options.json && !isFinite(message.dropoutRatio) ? String(message.dropoutRatio) : message.dropoutRatio;
            if (message.localSize != null && message.hasOwnProperty("localSize"))
                object.localSize = message.localSize;
            if (message.alpha != null && message.hasOwnProperty("alpha"))
                object.alpha = options.json && !isFinite(message.alpha) ? String(message.alpha) : message.alpha;
            if (message.beta != null && message.hasOwnProperty("beta"))
                object.beta = options.json && !isFinite(message.beta) ? String(message.beta) : message.beta;
            if (message.source != null && message.hasOwnProperty("source"))
                object.source = message.source;
            if (message.scale != null && message.hasOwnProperty("scale"))
                object.scale = options.json && !isFinite(message.scale) ? String(message.scale) : message.scale;
            if (message.meanfile != null && message.hasOwnProperty("meanfile"))
                object.meanfile = message.meanfile;
            if (message.batchsize != null && message.hasOwnProperty("batchsize"))
                object.batchsize = message.batchsize;
            if (message.cropsize != null && message.hasOwnProperty("cropsize"))
                object.cropsize = message.cropsize;
            if (message.mirror != null && message.hasOwnProperty("mirror"))
                object.mirror = message.mirror;
            if (message.k != null && message.hasOwnProperty("k"))
                object.k = options.json && !isFinite(message.k) ? String(message.k) : message.k;
            if (message.blobs && message.blobs.length) {
                object.blobs = [];
                for (var j = 0; j < message.blobs.length; ++j)
                    object.blobs[j] = $root.caffe.BlobProto.toObject(message.blobs[j], options);
            }
            if (message.blobsLr && message.blobsLr.length) {
                object.blobsLr = [];
                for (var j = 0; j < message.blobsLr.length; ++j)
                    object.blobsLr[j] = options.json && !isFinite(message.blobsLr[j]) ? String(message.blobsLr[j]) : message.blobsLr[j];
            }
            if (message.weightDecay && message.weightDecay.length) {
                object.weightDecay = [];
                for (var j = 0; j < message.weightDecay.length; ++j)
                    object.weightDecay[j] = options.json && !isFinite(message.weightDecay[j]) ? String(message.weightDecay[j]) : message.weightDecay[j];
            }
            if (message.randSkip != null && message.hasOwnProperty("randSkip"))
                object.randSkip = message.randSkip;
            if (message.detFgThreshold != null && message.hasOwnProperty("detFgThreshold"))
                object.detFgThreshold = options.json && !isFinite(message.detFgThreshold) ? String(message.detFgThreshold) : message.detFgThreshold;
            if (message.detBgThreshold != null && message.hasOwnProperty("detBgThreshold"))
                object.detBgThreshold = options.json && !isFinite(message.detBgThreshold) ? String(message.detBgThreshold) : message.detBgThreshold;
            if (message.detFgFraction != null && message.hasOwnProperty("detFgFraction"))
                object.detFgFraction = options.json && !isFinite(message.detFgFraction) ? String(message.detFgFraction) : message.detFgFraction;
            if (message.detContextPad != null && message.hasOwnProperty("detContextPad"))
                object.detContextPad = message.detContextPad;
            if (message.detCropMode != null && message.hasOwnProperty("detCropMode"))
                object.detCropMode = message.detCropMode;
            if (message.newNum != null && message.hasOwnProperty("newNum"))
                object.newNum = message.newNum;
            if (message.newChannels != null && message.hasOwnProperty("newChannels"))
                object.newChannels = message.newChannels;
            if (message.newHeight != null && message.hasOwnProperty("newHeight"))
                object.newHeight = message.newHeight;
            if (message.newWidth != null && message.hasOwnProperty("newWidth"))
                object.newWidth = message.newWidth;
            if (message.shuffleImages != null && message.hasOwnProperty("shuffleImages"))
                object.shuffleImages = message.shuffleImages;
            if (message.concatDim != null && message.hasOwnProperty("concatDim"))
                object.concatDim = message.concatDim;
            if (message.hdf5OutputParam != null && message.hasOwnProperty("hdf5OutputParam"))
                object.hdf5OutputParam = $root.caffe.HDF5OutputParameter.toObject(message.hdf5OutputParam, options);
            return object;
        };

        /**
         * Converts this V0LayerParameter to JSON.
         * @function toJSON
         * @memberof caffe.V0LayerParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        V0LayerParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * PoolMethod enum.
         * @enum {string}
         * @property {number} MAX=0 MAX value
         * @property {number} AVE=1 AVE value
         * @property {number} STOCHASTIC=2 STOCHASTIC value
         */
        V0LayerParameter.PoolMethod = (function() {
            var valuesById = {}, values = Object.create(valuesById);
            values[valuesById[0] = "MAX"] = 0;
            values[valuesById[1] = "AVE"] = 1;
            values[valuesById[2] = "STOCHASTIC"] = 2;
            return values;
        })();

        return V0LayerParameter;
    })();

    caffe.PReLUParameter = (function() {

        /**
         * Properties of a PReLUParameter.
         * @memberof caffe
         * @interface IPReLUParameter
         * @property {caffe.IFillerParameter} [filler] PReLUParameter filler
         * @property {boolean} [channelShared] PReLUParameter channelShared
         */

        /**
         * Constructs a new PReLUParameter.
         * @memberof caffe
         * @classdesc Represents a PReLUParameter.
         * @constructor
         * @param {caffe.IPReLUParameter=} [properties] Properties to set
         */
        function PReLUParameter(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PReLUParameter filler.
         * @member {(caffe.IFillerParameter|null|undefined)}filler
         * @memberof caffe.PReLUParameter
         * @instance
         */
        PReLUParameter.prototype.filler = null;

        /**
         * PReLUParameter channelShared.
         * @member {boolean}channelShared
         * @memberof caffe.PReLUParameter
         * @instance
         */
        PReLUParameter.prototype.channelShared = false;

        /**
         * Creates a new PReLUParameter instance using the specified properties.
         * @function create
         * @memberof caffe.PReLUParameter
         * @static
         * @param {caffe.IPReLUParameter=} [properties] Properties to set
         * @returns {caffe.PReLUParameter} PReLUParameter instance
         */
        PReLUParameter.create = function create(properties) {
            return new PReLUParameter(properties);
        };

        /**
         * Encodes the specified PReLUParameter message. Does not implicitly {@link caffe.PReLUParameter.verify|verify} messages.
         * @function encode
         * @memberof caffe.PReLUParameter
         * @static
         * @param {caffe.IPReLUParameter} message PReLUParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PReLUParameter.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.filler != null && message.hasOwnProperty("filler"))
                $root.caffe.FillerParameter.encode(message.filler, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.channelShared != null && message.hasOwnProperty("channelShared"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.channelShared);
            return writer;
        };

        /**
         * Encodes the specified PReLUParameter message, length delimited. Does not implicitly {@link caffe.PReLUParameter.verify|verify} messages.
         * @function encodeDelimited
         * @memberof caffe.PReLUParameter
         * @static
         * @param {caffe.IPReLUParameter} message PReLUParameter message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PReLUParameter.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PReLUParameter message from the specified reader or buffer.
         * @function decode
         * @memberof caffe.PReLUParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {caffe.PReLUParameter} PReLUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PReLUParameter.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.caffe.PReLUParameter();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.filler = $root.caffe.FillerParameter.decode(reader, reader.uint32());
                    break;
                case 2:
                    message.channelShared = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a PReLUParameter message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof caffe.PReLUParameter
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {caffe.PReLUParameter} PReLUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PReLUParameter.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PReLUParameter message.
         * @function verify
         * @memberof caffe.PReLUParameter
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PReLUParameter.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.filler != null && message.hasOwnProperty("filler")) {
                var error = $root.caffe.FillerParameter.verify(message.filler);
                if (error)
                    return "filler." + error;
            }
            if (message.channelShared != null && message.hasOwnProperty("channelShared"))
                if (typeof message.channelShared !== "boolean")
                    return "channelShared: boolean expected";
            return null;
        };

        /**
         * Creates a PReLUParameter message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof caffe.PReLUParameter
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {caffe.PReLUParameter} PReLUParameter
         */
        PReLUParameter.fromObject = function fromObject(object) {
            if (object instanceof $root.caffe.PReLUParameter)
                return object;
            var message = new $root.caffe.PReLUParameter();
            if (object.filler != null) {
                if (typeof object.filler !== "object")
                    throw TypeError(".caffe.PReLUParameter.filler: object expected");
                message.filler = $root.caffe.FillerParameter.fromObject(object.filler);
            }
            if (object.channelShared != null)
                message.channelShared = Boolean(object.channelShared);
            return message;
        };

        /**
         * Creates a plain object from a PReLUParameter message. Also converts values to other types if specified.
         * @function toObject
         * @memberof caffe.PReLUParameter
         * @static
         * @param {caffe.PReLUParameter} message PReLUParameter
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PReLUParameter.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.filler = null;
                object.channelShared = false;
            }
            if (message.filler != null && message.hasOwnProperty("filler"))
                object.filler = $root.caffe.FillerParameter.toObject(message.filler, options);
            if (message.channelShared != null && message.hasOwnProperty("channelShared"))
                object.channelShared = message.channelShared;
            return object;
        };

        /**
         * Converts this PReLUParameter to JSON.
         * @function toJSON
         * @memberof caffe.PReLUParameter
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PReLUParameter.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PReLUParameter;
    })();

    return caffe;
})();

module.exports = $root;
