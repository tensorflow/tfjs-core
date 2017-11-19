import * as $protobuf from "protobufjs";

/** Namespace caffe. */
export namespace caffe {

    /** Properties of a BlobShape. */
    interface IBlobShape {

        /** BlobShape dim */
        dim?: (number|Long)[];
    }

    /** Represents a BlobShape. */
    class BlobShape {

        /**
         * Constructs a new BlobShape.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IBlobShape);

        /** BlobShape dim. */
        public dim: (number|Long)[];

        /**
         * Creates a new BlobShape instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BlobShape instance
         */
        public static create(properties?: caffe.IBlobShape): caffe.BlobShape;

        /**
         * Encodes the specified BlobShape message. Does not implicitly {@link caffe.BlobShape.verify|verify} messages.
         * @param message BlobShape message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IBlobShape, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BlobShape message, length delimited. Does not implicitly {@link caffe.BlobShape.verify|verify} messages.
         * @param message BlobShape message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IBlobShape, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BlobShape message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BlobShape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.BlobShape;

        /**
         * Decodes a BlobShape message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BlobShape
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.BlobShape;

        /**
         * Verifies a BlobShape message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BlobShape message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BlobShape
         */
        public static fromObject(object: { [k: string]: any }): caffe.BlobShape;

        /**
         * Creates a plain object from a BlobShape message. Also converts values to other types if specified.
         * @param message BlobShape
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.BlobShape, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BlobShape to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BlobProto. */
    interface IBlobProto {

        /** BlobProto shape */
        shape?: caffe.IBlobShape;

        /** BlobProto data */
        data?: number[];

        /** BlobProto diff */
        diff?: number[];

        /** BlobProto doubleData */
        doubleData?: number[];

        /** BlobProto doubleDiff */
        doubleDiff?: number[];

        /** BlobProto num */
        num?: number;

        /** BlobProto channels */
        channels?: number;

        /** BlobProto height */
        height?: number;

        /** BlobProto width */
        width?: number;
    }

    /** Represents a BlobProto. */
    class BlobProto {

        /**
         * Constructs a new BlobProto.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IBlobProto);

        /** BlobProto shape. */
        public shape?: (caffe.IBlobShape|null);

        /** BlobProto data. */
        public data: number[];

        /** BlobProto diff. */
        public diff: number[];

        /** BlobProto doubleData. */
        public doubleData: number[];

        /** BlobProto doubleDiff. */
        public doubleDiff: number[];

        /** BlobProto num. */
        public num: number;

        /** BlobProto channels. */
        public channels: number;

        /** BlobProto height. */
        public height: number;

        /** BlobProto width. */
        public width: number;

        /**
         * Creates a new BlobProto instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BlobProto instance
         */
        public static create(properties?: caffe.IBlobProto): caffe.BlobProto;

        /**
         * Encodes the specified BlobProto message. Does not implicitly {@link caffe.BlobProto.verify|verify} messages.
         * @param message BlobProto message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IBlobProto, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BlobProto message, length delimited. Does not implicitly {@link caffe.BlobProto.verify|verify} messages.
         * @param message BlobProto message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IBlobProto, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BlobProto message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BlobProto
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.BlobProto;

        /**
         * Decodes a BlobProto message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BlobProto
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.BlobProto;

        /**
         * Verifies a BlobProto message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BlobProto message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BlobProto
         */
        public static fromObject(object: { [k: string]: any }): caffe.BlobProto;

        /**
         * Creates a plain object from a BlobProto message. Also converts values to other types if specified.
         * @param message BlobProto
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.BlobProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BlobProto to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BlobProtoVector. */
    interface IBlobProtoVector {

        /** BlobProtoVector blobs */
        blobs?: caffe.IBlobProto[];
    }

    /** Represents a BlobProtoVector. */
    class BlobProtoVector {

        /**
         * Constructs a new BlobProtoVector.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IBlobProtoVector);

        /** BlobProtoVector blobs. */
        public blobs: caffe.IBlobProto[];

        /**
         * Creates a new BlobProtoVector instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BlobProtoVector instance
         */
        public static create(properties?: caffe.IBlobProtoVector): caffe.BlobProtoVector;

        /**
         * Encodes the specified BlobProtoVector message. Does not implicitly {@link caffe.BlobProtoVector.verify|verify} messages.
         * @param message BlobProtoVector message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IBlobProtoVector, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BlobProtoVector message, length delimited. Does not implicitly {@link caffe.BlobProtoVector.verify|verify} messages.
         * @param message BlobProtoVector message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IBlobProtoVector, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BlobProtoVector message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BlobProtoVector
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.BlobProtoVector;

        /**
         * Decodes a BlobProtoVector message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BlobProtoVector
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.BlobProtoVector;

        /**
         * Verifies a BlobProtoVector message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BlobProtoVector message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BlobProtoVector
         */
        public static fromObject(object: { [k: string]: any }): caffe.BlobProtoVector;

        /**
         * Creates a plain object from a BlobProtoVector message. Also converts values to other types if specified.
         * @param message BlobProtoVector
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.BlobProtoVector, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BlobProtoVector to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Datum. */
    interface IDatum {

        /** Datum channels */
        channels?: number;

        /** Datum height */
        height?: number;

        /** Datum width */
        width?: number;

        /** Datum data */
        data?: Uint8Array;

        /** Datum label */
        label?: number;

        /** Datum floatData */
        floatData?: number[];

        /** Datum encoded */
        encoded?: boolean;
    }

    /** Represents a Datum. */
    class Datum {

        /**
         * Constructs a new Datum.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IDatum);

        /** Datum channels. */
        public channels: number;

        /** Datum height. */
        public height: number;

        /** Datum width. */
        public width: number;

        /** Datum data. */
        public data: Uint8Array;

        /** Datum label. */
        public label: number;

        /** Datum floatData. */
        public floatData: number[];

        /** Datum encoded. */
        public encoded: boolean;

        /**
         * Creates a new Datum instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Datum instance
         */
        public static create(properties?: caffe.IDatum): caffe.Datum;

        /**
         * Encodes the specified Datum message. Does not implicitly {@link caffe.Datum.verify|verify} messages.
         * @param message Datum message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IDatum, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Datum message, length delimited. Does not implicitly {@link caffe.Datum.verify|verify} messages.
         * @param message Datum message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IDatum, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Datum message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Datum
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.Datum;

        /**
         * Decodes a Datum message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Datum
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.Datum;

        /**
         * Verifies a Datum message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Datum message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Datum
         */
        public static fromObject(object: { [k: string]: any }): caffe.Datum;

        /**
         * Creates a plain object from a Datum message. Also converts values to other types if specified.
         * @param message Datum
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.Datum, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Datum to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FillerParameter. */
    interface IFillerParameter {

        /** FillerParameter type */
        type?: string;

        /** FillerParameter value */
        value?: number;

        /** FillerParameter min */
        min?: number;

        /** FillerParameter max */
        max?: number;

        /** FillerParameter mean */
        mean?: number;

        /** FillerParameter std */
        std?: number;

        /** FillerParameter sparse */
        sparse?: number;

        /** FillerParameter varianceNorm */
        varianceNorm?: caffe.FillerParameter.VarianceNorm;
    }

    /** Represents a FillerParameter. */
    class FillerParameter {

        /**
         * Constructs a new FillerParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IFillerParameter);

        /** FillerParameter type. */
        public type: string;

        /** FillerParameter value. */
        public value: number;

        /** FillerParameter min. */
        public min: number;

        /** FillerParameter max. */
        public max: number;

        /** FillerParameter mean. */
        public mean: number;

        /** FillerParameter std. */
        public std: number;

        /** FillerParameter sparse. */
        public sparse: number;

        /** FillerParameter varianceNorm. */
        public varianceNorm: caffe.FillerParameter.VarianceNorm;

        /**
         * Creates a new FillerParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FillerParameter instance
         */
        public static create(properties?: caffe.IFillerParameter): caffe.FillerParameter;

        /**
         * Encodes the specified FillerParameter message. Does not implicitly {@link caffe.FillerParameter.verify|verify} messages.
         * @param message FillerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IFillerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FillerParameter message, length delimited. Does not implicitly {@link caffe.FillerParameter.verify|verify} messages.
         * @param message FillerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IFillerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FillerParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FillerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.FillerParameter;

        /**
         * Decodes a FillerParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FillerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.FillerParameter;

        /**
         * Verifies a FillerParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FillerParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FillerParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.FillerParameter;

        /**
         * Creates a plain object from a FillerParameter message. Also converts values to other types if specified.
         * @param message FillerParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.FillerParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FillerParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace FillerParameter {

        /** VarianceNorm enum. */
        enum VarianceNorm {
            FAN_IN = 0,
            FAN_OUT = 1,
            AVERAGE = 2
        }
    }

    /** Properties of a NetParameter. */
    interface INetParameter {

        /** NetParameter name */
        name?: string;

        /** NetParameter input */
        input?: string[];

        /** NetParameter inputShape */
        inputShape?: caffe.IBlobShape[];

        /** NetParameter inputDim */
        inputDim?: number[];

        /** NetParameter forceBackward */
        forceBackward?: boolean;

        /** NetParameter state */
        state?: caffe.INetState;

        /** NetParameter debugInfo */
        debugInfo?: boolean;

        /** NetParameter layer */
        layer?: caffe.ILayerParameter[];

        /** NetParameter layers */
        layers?: caffe.IV1LayerParameter[];
    }

    /** Represents a NetParameter. */
    class NetParameter {

        /**
         * Constructs a new NetParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.INetParameter);

        /** NetParameter name. */
        public name: string;

        /** NetParameter input. */
        public input: string[];

        /** NetParameter inputShape. */
        public inputShape: caffe.IBlobShape[];

        /** NetParameter inputDim. */
        public inputDim: number[];

        /** NetParameter forceBackward. */
        public forceBackward: boolean;

        /** NetParameter state. */
        public state?: (caffe.INetState|null);

        /** NetParameter debugInfo. */
        public debugInfo: boolean;

        /** NetParameter layer. */
        public layer: caffe.ILayerParameter[];

        /** NetParameter layers. */
        public layers: caffe.IV1LayerParameter[];

        /**
         * Creates a new NetParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NetParameter instance
         */
        public static create(properties?: caffe.INetParameter): caffe.NetParameter;

        /**
         * Encodes the specified NetParameter message. Does not implicitly {@link caffe.NetParameter.verify|verify} messages.
         * @param message NetParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.INetParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NetParameter message, length delimited. Does not implicitly {@link caffe.NetParameter.verify|verify} messages.
         * @param message NetParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.INetParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NetParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NetParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.NetParameter;

        /**
         * Decodes a NetParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NetParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.NetParameter;

        /**
         * Verifies a NetParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NetParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NetParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.NetParameter;

        /**
         * Creates a plain object from a NetParameter message. Also converts values to other types if specified.
         * @param message NetParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.NetParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NetParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SolverParameter. */
    interface ISolverParameter {

        /** SolverParameter net */
        net?: string;

        /** SolverParameter netParam */
        netParam?: caffe.INetParameter;

        /** SolverParameter trainNet */
        trainNet?: string;

        /** SolverParameter testNet */
        testNet?: string[];

        /** SolverParameter trainNetParam */
        trainNetParam?: caffe.INetParameter;

        /** SolverParameter testNetParam */
        testNetParam?: caffe.INetParameter[];

        /** SolverParameter trainState */
        trainState?: caffe.INetState;

        /** SolverParameter testState */
        testState?: caffe.INetState[];

        /** SolverParameter testIter */
        testIter?: number[];

        /** SolverParameter testInterval */
        testInterval?: number;

        /** SolverParameter testComputeLoss */
        testComputeLoss?: boolean;

        /** SolverParameter testInitialization */
        testInitialization?: boolean;

        /** SolverParameter baseLr */
        baseLr?: number;

        /** SolverParameter display */
        display?: number;

        /** SolverParameter averageLoss */
        averageLoss?: number;

        /** SolverParameter maxIter */
        maxIter?: number;

        /** SolverParameter iterSize */
        iterSize?: number;

        /** SolverParameter lrPolicy */
        lrPolicy?: string;

        /** SolverParameter gamma */
        gamma?: number;

        /** SolverParameter power */
        power?: number;

        /** SolverParameter momentum */
        momentum?: number;

        /** SolverParameter weightDecay */
        weightDecay?: number;

        /** SolverParameter regularizationType */
        regularizationType?: string;

        /** SolverParameter stepsize */
        stepsize?: number;

        /** SolverParameter stepvalue */
        stepvalue?: number[];

        /** SolverParameter clipGradients */
        clipGradients?: number;

        /** SolverParameter snapshot */
        snapshot?: number;

        /** SolverParameter snapshotPrefix */
        snapshotPrefix?: string;

        /** SolverParameter snapshotDiff */
        snapshotDiff?: boolean;

        /** SolverParameter snapshotFormat */
        snapshotFormat?: caffe.SolverParameter.SnapshotFormat;

        /** SolverParameter solverMode */
        solverMode?: caffe.SolverParameter.SolverMode;

        /** SolverParameter deviceId */
        deviceId?: number;

        /** SolverParameter randomSeed */
        randomSeed?: (number|Long);

        /** SolverParameter type */
        type?: string;

        /** SolverParameter delta */
        delta?: number;

        /** SolverParameter momentum2 */
        momentum2?: number;

        /** SolverParameter rmsDecay */
        rmsDecay?: number;

        /** SolverParameter debugInfo */
        debugInfo?: boolean;

        /** SolverParameter snapshotAfterTrain */
        snapshotAfterTrain?: boolean;

        /** SolverParameter solverType */
        solverType?: caffe.SolverParameter.SolverType;

        /** SolverParameter layerWiseReduce */
        layerWiseReduce?: boolean;
    }

    /** Represents a SolverParameter. */
    class SolverParameter {

        /**
         * Constructs a new SolverParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ISolverParameter);

        /** SolverParameter net. */
        public net: string;

        /** SolverParameter netParam. */
        public netParam?: (caffe.INetParameter|null);

        /** SolverParameter trainNet. */
        public trainNet: string;

        /** SolverParameter testNet. */
        public testNet: string[];

        /** SolverParameter trainNetParam. */
        public trainNetParam?: (caffe.INetParameter|null);

        /** SolverParameter testNetParam. */
        public testNetParam: caffe.INetParameter[];

        /** SolverParameter trainState. */
        public trainState?: (caffe.INetState|null);

        /** SolverParameter testState. */
        public testState: caffe.INetState[];

        /** SolverParameter testIter. */
        public testIter: number[];

        /** SolverParameter testInterval. */
        public testInterval: number;

        /** SolverParameter testComputeLoss. */
        public testComputeLoss: boolean;

        /** SolverParameter testInitialization. */
        public testInitialization: boolean;

        /** SolverParameter baseLr. */
        public baseLr: number;

        /** SolverParameter display. */
        public display: number;

        /** SolverParameter averageLoss. */
        public averageLoss: number;

        /** SolverParameter maxIter. */
        public maxIter: number;

        /** SolverParameter iterSize. */
        public iterSize: number;

        /** SolverParameter lrPolicy. */
        public lrPolicy: string;

        /** SolverParameter gamma. */
        public gamma: number;

        /** SolverParameter power. */
        public power: number;

        /** SolverParameter momentum. */
        public momentum: number;

        /** SolverParameter weightDecay. */
        public weightDecay: number;

        /** SolverParameter regularizationType. */
        public regularizationType: string;

        /** SolverParameter stepsize. */
        public stepsize: number;

        /** SolverParameter stepvalue. */
        public stepvalue: number[];

        /** SolverParameter clipGradients. */
        public clipGradients: number;

        /** SolverParameter snapshot. */
        public snapshot: number;

        /** SolverParameter snapshotPrefix. */
        public snapshotPrefix: string;

        /** SolverParameter snapshotDiff. */
        public snapshotDiff: boolean;

        /** SolverParameter snapshotFormat. */
        public snapshotFormat: caffe.SolverParameter.SnapshotFormat;

        /** SolverParameter solverMode. */
        public solverMode: caffe.SolverParameter.SolverMode;

        /** SolverParameter deviceId. */
        public deviceId: number;

        /** SolverParameter randomSeed. */
        public randomSeed: (number|Long);

        /** SolverParameter type. */
        public type: string;

        /** SolverParameter delta. */
        public delta: number;

        /** SolverParameter momentum2. */
        public momentum2: number;

        /** SolverParameter rmsDecay. */
        public rmsDecay: number;

        /** SolverParameter debugInfo. */
        public debugInfo: boolean;

        /** SolverParameter snapshotAfterTrain. */
        public snapshotAfterTrain: boolean;

        /** SolverParameter solverType. */
        public solverType: caffe.SolverParameter.SolverType;

        /** SolverParameter layerWiseReduce. */
        public layerWiseReduce: boolean;

        /**
         * Creates a new SolverParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SolverParameter instance
         */
        public static create(properties?: caffe.ISolverParameter): caffe.SolverParameter;

        /**
         * Encodes the specified SolverParameter message. Does not implicitly {@link caffe.SolverParameter.verify|verify} messages.
         * @param message SolverParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ISolverParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SolverParameter message, length delimited. Does not implicitly {@link caffe.SolverParameter.verify|verify} messages.
         * @param message SolverParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ISolverParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SolverParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SolverParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.SolverParameter;

        /**
         * Decodes a SolverParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SolverParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.SolverParameter;

        /**
         * Verifies a SolverParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SolverParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SolverParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.SolverParameter;

        /**
         * Creates a plain object from a SolverParameter message. Also converts values to other types if specified.
         * @param message SolverParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.SolverParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SolverParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace SolverParameter {

        /** SnapshotFormat enum. */
        enum SnapshotFormat {
            HDF5 = 0,
            BINARYPROTO = 1
        }

        /** SolverMode enum. */
        enum SolverMode {
            CPU = 0,
            GPU = 1
        }

        /** SolverType enum. */
        enum SolverType {
            SGD = 0,
            NESTEROV = 1,
            ADAGRAD = 2,
            RMSPROP = 3,
            ADADELTA = 4,
            ADAM = 5
        }
    }

    /** Properties of a SolverState. */
    interface ISolverState {

        /** SolverState iter */
        iter?: number;

        /** SolverState learnedNet */
        learnedNet?: string;

        /** SolverState history */
        history?: caffe.IBlobProto[];

        /** SolverState currentStep */
        currentStep?: number;
    }

    /** Represents a SolverState. */
    class SolverState {

        /**
         * Constructs a new SolverState.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ISolverState);

        /** SolverState iter. */
        public iter: number;

        /** SolverState learnedNet. */
        public learnedNet: string;

        /** SolverState history. */
        public history: caffe.IBlobProto[];

        /** SolverState currentStep. */
        public currentStep: number;

        /**
         * Creates a new SolverState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SolverState instance
         */
        public static create(properties?: caffe.ISolverState): caffe.SolverState;

        /**
         * Encodes the specified SolverState message. Does not implicitly {@link caffe.SolverState.verify|verify} messages.
         * @param message SolverState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ISolverState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SolverState message, length delimited. Does not implicitly {@link caffe.SolverState.verify|verify} messages.
         * @param message SolverState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ISolverState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SolverState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SolverState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.SolverState;

        /**
         * Decodes a SolverState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SolverState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.SolverState;

        /**
         * Verifies a SolverState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SolverState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SolverState
         */
        public static fromObject(object: { [k: string]: any }): caffe.SolverState;

        /**
         * Creates a plain object from a SolverState message. Also converts values to other types if specified.
         * @param message SolverState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.SolverState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SolverState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Phase enum. */
    enum Phase {
        TRAIN = 0,
        TEST = 1
    }

    /** Properties of a NetState. */
    interface INetState {

        /** NetState phase */
        phase?: caffe.Phase;

        /** NetState level */
        level?: number;

        /** NetState stage */
        stage?: string[];
    }

    /** Represents a NetState. */
    class NetState {

        /**
         * Constructs a new NetState.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.INetState);

        /** NetState phase. */
        public phase: caffe.Phase;

        /** NetState level. */
        public level: number;

        /** NetState stage. */
        public stage: string[];

        /**
         * Creates a new NetState instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NetState instance
         */
        public static create(properties?: caffe.INetState): caffe.NetState;

        /**
         * Encodes the specified NetState message. Does not implicitly {@link caffe.NetState.verify|verify} messages.
         * @param message NetState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.INetState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NetState message, length delimited. Does not implicitly {@link caffe.NetState.verify|verify} messages.
         * @param message NetState message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.INetState, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NetState message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NetState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.NetState;

        /**
         * Decodes a NetState message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NetState
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.NetState;

        /**
         * Verifies a NetState message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NetState message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NetState
         */
        public static fromObject(object: { [k: string]: any }): caffe.NetState;

        /**
         * Creates a plain object from a NetState message. Also converts values to other types if specified.
         * @param message NetState
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.NetState, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NetState to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a NetStateRule. */
    interface INetStateRule {

        /** NetStateRule phase */
        phase?: caffe.Phase;

        /** NetStateRule minLevel */
        minLevel?: number;

        /** NetStateRule maxLevel */
        maxLevel?: number;

        /** NetStateRule stage */
        stage?: string[];

        /** NetStateRule notStage */
        notStage?: string[];
    }

    /** Represents a NetStateRule. */
    class NetStateRule {

        /**
         * Constructs a new NetStateRule.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.INetStateRule);

        /** NetStateRule phase. */
        public phase: caffe.Phase;

        /** NetStateRule minLevel. */
        public minLevel: number;

        /** NetStateRule maxLevel. */
        public maxLevel: number;

        /** NetStateRule stage. */
        public stage: string[];

        /** NetStateRule notStage. */
        public notStage: string[];

        /**
         * Creates a new NetStateRule instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NetStateRule instance
         */
        public static create(properties?: caffe.INetStateRule): caffe.NetStateRule;

        /**
         * Encodes the specified NetStateRule message. Does not implicitly {@link caffe.NetStateRule.verify|verify} messages.
         * @param message NetStateRule message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.INetStateRule, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NetStateRule message, length delimited. Does not implicitly {@link caffe.NetStateRule.verify|verify} messages.
         * @param message NetStateRule message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.INetStateRule, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NetStateRule message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NetStateRule
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.NetStateRule;

        /**
         * Decodes a NetStateRule message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NetStateRule
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.NetStateRule;

        /**
         * Verifies a NetStateRule message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NetStateRule message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NetStateRule
         */
        public static fromObject(object: { [k: string]: any }): caffe.NetStateRule;

        /**
         * Creates a plain object from a NetStateRule message. Also converts values to other types if specified.
         * @param message NetStateRule
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.NetStateRule, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NetStateRule to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ParamSpec. */
    interface IParamSpec {

        /** ParamSpec name */
        name?: string;

        /** ParamSpec shareMode */
        shareMode?: caffe.ParamSpec.DimCheckMode;

        /** ParamSpec lrMult */
        lrMult?: number;

        /** ParamSpec decayMult */
        decayMult?: number;
    }

    /** Represents a ParamSpec. */
    class ParamSpec {

        /**
         * Constructs a new ParamSpec.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IParamSpec);

        /** ParamSpec name. */
        public name: string;

        /** ParamSpec shareMode. */
        public shareMode: caffe.ParamSpec.DimCheckMode;

        /** ParamSpec lrMult. */
        public lrMult: number;

        /** ParamSpec decayMult. */
        public decayMult: number;

        /**
         * Creates a new ParamSpec instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ParamSpec instance
         */
        public static create(properties?: caffe.IParamSpec): caffe.ParamSpec;

        /**
         * Encodes the specified ParamSpec message. Does not implicitly {@link caffe.ParamSpec.verify|verify} messages.
         * @param message ParamSpec message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IParamSpec, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ParamSpec message, length delimited. Does not implicitly {@link caffe.ParamSpec.verify|verify} messages.
         * @param message ParamSpec message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IParamSpec, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ParamSpec message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ParamSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ParamSpec;

        /**
         * Decodes a ParamSpec message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ParamSpec
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ParamSpec;

        /**
         * Verifies a ParamSpec message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ParamSpec message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ParamSpec
         */
        public static fromObject(object: { [k: string]: any }): caffe.ParamSpec;

        /**
         * Creates a plain object from a ParamSpec message. Also converts values to other types if specified.
         * @param message ParamSpec
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ParamSpec, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ParamSpec to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ParamSpec {

        /** DimCheckMode enum. */
        enum DimCheckMode {
            STRICT = 0,
            PERMISSIVE = 1
        }
    }

    /** Properties of a LayerParameter. */
    interface ILayerParameter {

        /** LayerParameter name */
        name?: string;

        /** LayerParameter type */
        type?: string;

        /** LayerParameter bottom */
        bottom?: string[];

        /** LayerParameter top */
        top?: string[];

        /** LayerParameter phase */
        phase?: caffe.Phase;

        /** LayerParameter lossWeight */
        lossWeight?: number[];

        /** LayerParameter param */
        param?: caffe.IParamSpec[];

        /** LayerParameter blobs */
        blobs?: caffe.IBlobProto[];

        /** LayerParameter propagateDown */
        propagateDown?: boolean[];

        /** LayerParameter include */
        include?: caffe.INetStateRule[];

        /** LayerParameter exclude */
        exclude?: caffe.INetStateRule[];

        /** LayerParameter transformParam */
        transformParam?: caffe.ITransformationParameter;

        /** LayerParameter lossParam */
        lossParam?: caffe.ILossParameter;

        /** LayerParameter accuracyParam */
        accuracyParam?: caffe.IAccuracyParameter;

        /** LayerParameter argmaxParam */
        argmaxParam?: caffe.IArgMaxParameter;

        /** LayerParameter batchNormParam */
        batchNormParam?: caffe.IBatchNormParameter;

        /** LayerParameter biasParam */
        biasParam?: caffe.IBiasParameter;

        /** LayerParameter concatParam */
        concatParam?: caffe.IConcatParameter;

        /** LayerParameter contrastiveLossParam */
        contrastiveLossParam?: caffe.IContrastiveLossParameter;

        /** LayerParameter convolutionParam */
        convolutionParam?: caffe.IConvolutionParameter;

        /** LayerParameter cropParam */
        cropParam?: caffe.ICropParameter;

        /** LayerParameter dataParam */
        dataParam?: caffe.IDataParameter;

        /** LayerParameter dropoutParam */
        dropoutParam?: caffe.IDropoutParameter;

        /** LayerParameter dummyDataParam */
        dummyDataParam?: caffe.IDummyDataParameter;

        /** LayerParameter eltwiseParam */
        eltwiseParam?: caffe.IEltwiseParameter;

        /** LayerParameter eluParam */
        eluParam?: caffe.IELUParameter;

        /** LayerParameter embedParam */
        embedParam?: caffe.IEmbedParameter;

        /** LayerParameter expParam */
        expParam?: caffe.IExpParameter;

        /** LayerParameter flattenParam */
        flattenParam?: caffe.IFlattenParameter;

        /** LayerParameter hdf5DataParam */
        hdf5DataParam?: caffe.IHDF5DataParameter;

        /** LayerParameter hdf5OutputParam */
        hdf5OutputParam?: caffe.IHDF5OutputParameter;

        /** LayerParameter hingeLossParam */
        hingeLossParam?: caffe.IHingeLossParameter;

        /** LayerParameter imageDataParam */
        imageDataParam?: caffe.IImageDataParameter;

        /** LayerParameter infogainLossParam */
        infogainLossParam?: caffe.IInfogainLossParameter;

        /** LayerParameter innerProductParam */
        innerProductParam?: caffe.IInnerProductParameter;

        /** LayerParameter inputParam */
        inputParam?: caffe.IInputParameter;

        /** LayerParameter logParam */
        logParam?: caffe.ILogParameter;

        /** LayerParameter lrnParam */
        lrnParam?: caffe.ILRNParameter;

        /** LayerParameter memoryDataParam */
        memoryDataParam?: caffe.IMemoryDataParameter;

        /** LayerParameter mvnParam */
        mvnParam?: caffe.IMVNParameter;

        /** LayerParameter parameterParam */
        parameterParam?: caffe.IParameterParameter;

        /** LayerParameter poolingParam */
        poolingParam?: caffe.IPoolingParameter;

        /** LayerParameter powerParam */
        powerParam?: caffe.IPowerParameter;

        /** LayerParameter preluParam */
        preluParam?: caffe.IPReLUParameter;

        /** LayerParameter pythonParam */
        pythonParam?: caffe.IPythonParameter;

        /** LayerParameter recurrentParam */
        recurrentParam?: caffe.IRecurrentParameter;

        /** LayerParameter reductionParam */
        reductionParam?: caffe.IReductionParameter;

        /** LayerParameter reluParam */
        reluParam?: caffe.IReLUParameter;

        /** LayerParameter reshapeParam */
        reshapeParam?: caffe.IReshapeParameter;

        /** LayerParameter scaleParam */
        scaleParam?: caffe.IScaleParameter;

        /** LayerParameter sigmoidParam */
        sigmoidParam?: caffe.ISigmoidParameter;

        /** LayerParameter softmaxParam */
        softmaxParam?: caffe.ISoftmaxParameter;

        /** LayerParameter sppParam */
        sppParam?: caffe.ISPPParameter;

        /** LayerParameter sliceParam */
        sliceParam?: caffe.ISliceParameter;

        /** LayerParameter tanhParam */
        tanhParam?: caffe.ITanHParameter;

        /** LayerParameter thresholdParam */
        thresholdParam?: caffe.IThresholdParameter;

        /** LayerParameter tileParam */
        tileParam?: caffe.ITileParameter;

        /** LayerParameter windowDataParam */
        windowDataParam?: caffe.IWindowDataParameter;
    }

    /** Represents a LayerParameter. */
    class LayerParameter {

        /**
         * Constructs a new LayerParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ILayerParameter);

        /** LayerParameter name. */
        public name: string;

        /** LayerParameter type. */
        public type: string;

        /** LayerParameter bottom. */
        public bottom: string[];

        /** LayerParameter top. */
        public top: string[];

        /** LayerParameter phase. */
        public phase: caffe.Phase;

        /** LayerParameter lossWeight. */
        public lossWeight: number[];

        /** LayerParameter param. */
        public param: caffe.IParamSpec[];

        /** LayerParameter blobs. */
        public blobs: caffe.IBlobProto[];

        /** LayerParameter propagateDown. */
        public propagateDown: boolean[];

        /** LayerParameter include. */
        public include: caffe.INetStateRule[];

        /** LayerParameter exclude. */
        public exclude: caffe.INetStateRule[];

        /** LayerParameter transformParam. */
        public transformParam?: (caffe.ITransformationParameter|null);

        /** LayerParameter lossParam. */
        public lossParam?: (caffe.ILossParameter|null);

        /** LayerParameter accuracyParam. */
        public accuracyParam?: (caffe.IAccuracyParameter|null);

        /** LayerParameter argmaxParam. */
        public argmaxParam?: (caffe.IArgMaxParameter|null);

        /** LayerParameter batchNormParam. */
        public batchNormParam?: (caffe.IBatchNormParameter|null);

        /** LayerParameter biasParam. */
        public biasParam?: (caffe.IBiasParameter|null);

        /** LayerParameter concatParam. */
        public concatParam?: (caffe.IConcatParameter|null);

        /** LayerParameter contrastiveLossParam. */
        public contrastiveLossParam?: (caffe.IContrastiveLossParameter|null);

        /** LayerParameter convolutionParam. */
        public convolutionParam?: (caffe.IConvolutionParameter|null);

        /** LayerParameter cropParam. */
        public cropParam?: (caffe.ICropParameter|null);

        /** LayerParameter dataParam. */
        public dataParam?: (caffe.IDataParameter|null);

        /** LayerParameter dropoutParam. */
        public dropoutParam?: (caffe.IDropoutParameter|null);

        /** LayerParameter dummyDataParam. */
        public dummyDataParam?: (caffe.IDummyDataParameter|null);

        /** LayerParameter eltwiseParam. */
        public eltwiseParam?: (caffe.IEltwiseParameter|null);

        /** LayerParameter eluParam. */
        public eluParam?: (caffe.IELUParameter|null);

        /** LayerParameter embedParam. */
        public embedParam?: (caffe.IEmbedParameter|null);

        /** LayerParameter expParam. */
        public expParam?: (caffe.IExpParameter|null);

        /** LayerParameter flattenParam. */
        public flattenParam?: (caffe.IFlattenParameter|null);

        /** LayerParameter hdf5DataParam. */
        public hdf5DataParam?: (caffe.IHDF5DataParameter|null);

        /** LayerParameter hdf5OutputParam. */
        public hdf5OutputParam?: (caffe.IHDF5OutputParameter|null);

        /** LayerParameter hingeLossParam. */
        public hingeLossParam?: (caffe.IHingeLossParameter|null);

        /** LayerParameter imageDataParam. */
        public imageDataParam?: (caffe.IImageDataParameter|null);

        /** LayerParameter infogainLossParam. */
        public infogainLossParam?: (caffe.IInfogainLossParameter|null);

        /** LayerParameter innerProductParam. */
        public innerProductParam?: (caffe.IInnerProductParameter|null);

        /** LayerParameter inputParam. */
        public inputParam?: (caffe.IInputParameter|null);

        /** LayerParameter logParam. */
        public logParam?: (caffe.ILogParameter|null);

        /** LayerParameter lrnParam. */
        public lrnParam?: (caffe.ILRNParameter|null);

        /** LayerParameter memoryDataParam. */
        public memoryDataParam?: (caffe.IMemoryDataParameter|null);

        /** LayerParameter mvnParam. */
        public mvnParam?: (caffe.IMVNParameter|null);

        /** LayerParameter parameterParam. */
        public parameterParam?: (caffe.IParameterParameter|null);

        /** LayerParameter poolingParam. */
        public poolingParam?: (caffe.IPoolingParameter|null);

        /** LayerParameter powerParam. */
        public powerParam?: (caffe.IPowerParameter|null);

        /** LayerParameter preluParam. */
        public preluParam?: (caffe.IPReLUParameter|null);

        /** LayerParameter pythonParam. */
        public pythonParam?: (caffe.IPythonParameter|null);

        /** LayerParameter recurrentParam. */
        public recurrentParam?: (caffe.IRecurrentParameter|null);

        /** LayerParameter reductionParam. */
        public reductionParam?: (caffe.IReductionParameter|null);

        /** LayerParameter reluParam. */
        public reluParam?: (caffe.IReLUParameter|null);

        /** LayerParameter reshapeParam. */
        public reshapeParam?: (caffe.IReshapeParameter|null);

        /** LayerParameter scaleParam. */
        public scaleParam?: (caffe.IScaleParameter|null);

        /** LayerParameter sigmoidParam. */
        public sigmoidParam?: (caffe.ISigmoidParameter|null);

        /** LayerParameter softmaxParam. */
        public softmaxParam?: (caffe.ISoftmaxParameter|null);

        /** LayerParameter sppParam. */
        public sppParam?: (caffe.ISPPParameter|null);

        /** LayerParameter sliceParam. */
        public sliceParam?: (caffe.ISliceParameter|null);

        /** LayerParameter tanhParam. */
        public tanhParam?: (caffe.ITanHParameter|null);

        /** LayerParameter thresholdParam. */
        public thresholdParam?: (caffe.IThresholdParameter|null);

        /** LayerParameter tileParam. */
        public tileParam?: (caffe.ITileParameter|null);

        /** LayerParameter windowDataParam. */
        public windowDataParam?: (caffe.IWindowDataParameter|null);

        /**
         * Creates a new LayerParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LayerParameter instance
         */
        public static create(properties?: caffe.ILayerParameter): caffe.LayerParameter;

        /**
         * Encodes the specified LayerParameter message. Does not implicitly {@link caffe.LayerParameter.verify|verify} messages.
         * @param message LayerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ILayerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LayerParameter message, length delimited. Does not implicitly {@link caffe.LayerParameter.verify|verify} messages.
         * @param message LayerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ILayerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LayerParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.LayerParameter;

        /**
         * Decodes a LayerParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.LayerParameter;

        /**
         * Verifies a LayerParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LayerParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LayerParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.LayerParameter;

        /**
         * Creates a plain object from a LayerParameter message. Also converts values to other types if specified.
         * @param message LayerParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.LayerParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LayerParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TransformationParameter. */
    interface ITransformationParameter {

        /** TransformationParameter scale */
        scale?: number;

        /** TransformationParameter mirror */
        mirror?: boolean;

        /** TransformationParameter cropSize */
        cropSize?: number;

        /** TransformationParameter meanFile */
        meanFile?: string;

        /** TransformationParameter meanValue */
        meanValue?: number[];

        /** TransformationParameter forceColor */
        forceColor?: boolean;

        /** TransformationParameter forceGray */
        forceGray?: boolean;
    }

    /** Represents a TransformationParameter. */
    class TransformationParameter {

        /**
         * Constructs a new TransformationParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ITransformationParameter);

        /** TransformationParameter scale. */
        public scale: number;

        /** TransformationParameter mirror. */
        public mirror: boolean;

        /** TransformationParameter cropSize. */
        public cropSize: number;

        /** TransformationParameter meanFile. */
        public meanFile: string;

        /** TransformationParameter meanValue. */
        public meanValue: number[];

        /** TransformationParameter forceColor. */
        public forceColor: boolean;

        /** TransformationParameter forceGray. */
        public forceGray: boolean;

        /**
         * Creates a new TransformationParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransformationParameter instance
         */
        public static create(properties?: caffe.ITransformationParameter): caffe.TransformationParameter;

        /**
         * Encodes the specified TransformationParameter message. Does not implicitly {@link caffe.TransformationParameter.verify|verify} messages.
         * @param message TransformationParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ITransformationParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransformationParameter message, length delimited. Does not implicitly {@link caffe.TransformationParameter.verify|verify} messages.
         * @param message TransformationParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ITransformationParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransformationParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransformationParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.TransformationParameter;

        /**
         * Decodes a TransformationParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransformationParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.TransformationParameter;

        /**
         * Verifies a TransformationParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransformationParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransformationParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.TransformationParameter;

        /**
         * Creates a plain object from a TransformationParameter message. Also converts values to other types if specified.
         * @param message TransformationParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.TransformationParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransformationParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LossParameter. */
    interface ILossParameter {

        /** LossParameter ignoreLabel */
        ignoreLabel?: number;

        /** LossParameter normalization */
        normalization?: caffe.LossParameter.NormalizationMode;

        /** LossParameter normalize */
        normalize?: boolean;
    }

    /** Represents a LossParameter. */
    class LossParameter {

        /**
         * Constructs a new LossParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ILossParameter);

        /** LossParameter ignoreLabel. */
        public ignoreLabel: number;

        /** LossParameter normalization. */
        public normalization: caffe.LossParameter.NormalizationMode;

        /** LossParameter normalize. */
        public normalize: boolean;

        /**
         * Creates a new LossParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LossParameter instance
         */
        public static create(properties?: caffe.ILossParameter): caffe.LossParameter;

        /**
         * Encodes the specified LossParameter message. Does not implicitly {@link caffe.LossParameter.verify|verify} messages.
         * @param message LossParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ILossParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LossParameter message, length delimited. Does not implicitly {@link caffe.LossParameter.verify|verify} messages.
         * @param message LossParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ILossParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LossParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.LossParameter;

        /**
         * Decodes a LossParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.LossParameter;

        /**
         * Verifies a LossParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LossParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LossParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.LossParameter;

        /**
         * Creates a plain object from a LossParameter message. Also converts values to other types if specified.
         * @param message LossParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.LossParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LossParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace LossParameter {

        /** NormalizationMode enum. */
        enum NormalizationMode {
            FULL = 0,
            VALID = 1,
            BATCH_SIZE = 2,
            NONE = 3
        }
    }

    /** Properties of an AccuracyParameter. */
    interface IAccuracyParameter {

        /** AccuracyParameter topK */
        topK?: number;

        /** AccuracyParameter axis */
        axis?: number;

        /** AccuracyParameter ignoreLabel */
        ignoreLabel?: number;
    }

    /** Represents an AccuracyParameter. */
    class AccuracyParameter {

        /**
         * Constructs a new AccuracyParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IAccuracyParameter);

        /** AccuracyParameter topK. */
        public topK: number;

        /** AccuracyParameter axis. */
        public axis: number;

        /** AccuracyParameter ignoreLabel. */
        public ignoreLabel: number;

        /**
         * Creates a new AccuracyParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AccuracyParameter instance
         */
        public static create(properties?: caffe.IAccuracyParameter): caffe.AccuracyParameter;

        /**
         * Encodes the specified AccuracyParameter message. Does not implicitly {@link caffe.AccuracyParameter.verify|verify} messages.
         * @param message AccuracyParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IAccuracyParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AccuracyParameter message, length delimited. Does not implicitly {@link caffe.AccuracyParameter.verify|verify} messages.
         * @param message AccuracyParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IAccuracyParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AccuracyParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AccuracyParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.AccuracyParameter;

        /**
         * Decodes an AccuracyParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AccuracyParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.AccuracyParameter;

        /**
         * Verifies an AccuracyParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AccuracyParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AccuracyParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.AccuracyParameter;

        /**
         * Creates a plain object from an AccuracyParameter message. Also converts values to other types if specified.
         * @param message AccuracyParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.AccuracyParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AccuracyParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ArgMaxParameter. */
    interface IArgMaxParameter {

        /** ArgMaxParameter outMaxVal */
        outMaxVal?: boolean;

        /** ArgMaxParameter topK */
        topK?: number;

        /** ArgMaxParameter axis */
        axis?: number;
    }

    /** Represents an ArgMaxParameter. */
    class ArgMaxParameter {

        /**
         * Constructs a new ArgMaxParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IArgMaxParameter);

        /** ArgMaxParameter outMaxVal. */
        public outMaxVal: boolean;

        /** ArgMaxParameter topK. */
        public topK: number;

        /** ArgMaxParameter axis. */
        public axis: number;

        /**
         * Creates a new ArgMaxParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ArgMaxParameter instance
         */
        public static create(properties?: caffe.IArgMaxParameter): caffe.ArgMaxParameter;

        /**
         * Encodes the specified ArgMaxParameter message. Does not implicitly {@link caffe.ArgMaxParameter.verify|verify} messages.
         * @param message ArgMaxParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IArgMaxParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ArgMaxParameter message, length delimited. Does not implicitly {@link caffe.ArgMaxParameter.verify|verify} messages.
         * @param message ArgMaxParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IArgMaxParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ArgMaxParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ArgMaxParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ArgMaxParameter;

        /**
         * Decodes an ArgMaxParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ArgMaxParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ArgMaxParameter;

        /**
         * Verifies an ArgMaxParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ArgMaxParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ArgMaxParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ArgMaxParameter;

        /**
         * Creates a plain object from an ArgMaxParameter message. Also converts values to other types if specified.
         * @param message ArgMaxParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ArgMaxParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ArgMaxParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ConcatParameter. */
    interface IConcatParameter {

        /** ConcatParameter axis */
        axis?: number;

        /** ConcatParameter concatDim */
        concatDim?: number;
    }

    /** Represents a ConcatParameter. */
    class ConcatParameter {

        /**
         * Constructs a new ConcatParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IConcatParameter);

        /** ConcatParameter axis. */
        public axis: number;

        /** ConcatParameter concatDim. */
        public concatDim: number;

        /**
         * Creates a new ConcatParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConcatParameter instance
         */
        public static create(properties?: caffe.IConcatParameter): caffe.ConcatParameter;

        /**
         * Encodes the specified ConcatParameter message. Does not implicitly {@link caffe.ConcatParameter.verify|verify} messages.
         * @param message ConcatParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IConcatParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ConcatParameter message, length delimited. Does not implicitly {@link caffe.ConcatParameter.verify|verify} messages.
         * @param message ConcatParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IConcatParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConcatParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConcatParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ConcatParameter;

        /**
         * Decodes a ConcatParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ConcatParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ConcatParameter;

        /**
         * Verifies a ConcatParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ConcatParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ConcatParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ConcatParameter;

        /**
         * Creates a plain object from a ConcatParameter message. Also converts values to other types if specified.
         * @param message ConcatParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ConcatParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ConcatParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BatchNormParameter. */
    interface IBatchNormParameter {

        /** BatchNormParameter useGlobalStats */
        useGlobalStats?: boolean;

        /** BatchNormParameter movingAverageFraction */
        movingAverageFraction?: number;

        /** BatchNormParameter eps */
        eps?: number;
    }

    /** Represents a BatchNormParameter. */
    class BatchNormParameter {

        /**
         * Constructs a new BatchNormParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IBatchNormParameter);

        /** BatchNormParameter useGlobalStats. */
        public useGlobalStats: boolean;

        /** BatchNormParameter movingAverageFraction. */
        public movingAverageFraction: number;

        /** BatchNormParameter eps. */
        public eps: number;

        /**
         * Creates a new BatchNormParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BatchNormParameter instance
         */
        public static create(properties?: caffe.IBatchNormParameter): caffe.BatchNormParameter;

        /**
         * Encodes the specified BatchNormParameter message. Does not implicitly {@link caffe.BatchNormParameter.verify|verify} messages.
         * @param message BatchNormParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IBatchNormParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BatchNormParameter message, length delimited. Does not implicitly {@link caffe.BatchNormParameter.verify|verify} messages.
         * @param message BatchNormParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IBatchNormParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BatchNormParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BatchNormParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.BatchNormParameter;

        /**
         * Decodes a BatchNormParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BatchNormParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.BatchNormParameter;

        /**
         * Verifies a BatchNormParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BatchNormParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BatchNormParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.BatchNormParameter;

        /**
         * Creates a plain object from a BatchNormParameter message. Also converts values to other types if specified.
         * @param message BatchNormParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.BatchNormParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BatchNormParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BiasParameter. */
    interface IBiasParameter {

        /** BiasParameter axis */
        axis?: number;

        /** BiasParameter numAxes */
        numAxes?: number;

        /** BiasParameter filler */
        filler?: caffe.IFillerParameter;
    }

    /** Represents a BiasParameter. */
    class BiasParameter {

        /**
         * Constructs a new BiasParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IBiasParameter);

        /** BiasParameter axis. */
        public axis: number;

        /** BiasParameter numAxes. */
        public numAxes: number;

        /** BiasParameter filler. */
        public filler?: (caffe.IFillerParameter|null);

        /**
         * Creates a new BiasParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BiasParameter instance
         */
        public static create(properties?: caffe.IBiasParameter): caffe.BiasParameter;

        /**
         * Encodes the specified BiasParameter message. Does not implicitly {@link caffe.BiasParameter.verify|verify} messages.
         * @param message BiasParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IBiasParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BiasParameter message, length delimited. Does not implicitly {@link caffe.BiasParameter.verify|verify} messages.
         * @param message BiasParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IBiasParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BiasParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BiasParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.BiasParameter;

        /**
         * Decodes a BiasParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BiasParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.BiasParameter;

        /**
         * Verifies a BiasParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BiasParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BiasParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.BiasParameter;

        /**
         * Creates a plain object from a BiasParameter message. Also converts values to other types if specified.
         * @param message BiasParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.BiasParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BiasParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContrastiveLossParameter. */
    interface IContrastiveLossParameter {

        /** ContrastiveLossParameter margin */
        margin?: number;

        /** ContrastiveLossParameter legacyVersion */
        legacyVersion?: boolean;
    }

    /** Represents a ContrastiveLossParameter. */
    class ContrastiveLossParameter {

        /**
         * Constructs a new ContrastiveLossParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IContrastiveLossParameter);

        /** ContrastiveLossParameter margin. */
        public margin: number;

        /** ContrastiveLossParameter legacyVersion. */
        public legacyVersion: boolean;

        /**
         * Creates a new ContrastiveLossParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContrastiveLossParameter instance
         */
        public static create(properties?: caffe.IContrastiveLossParameter): caffe.ContrastiveLossParameter;

        /**
         * Encodes the specified ContrastiveLossParameter message. Does not implicitly {@link caffe.ContrastiveLossParameter.verify|verify} messages.
         * @param message ContrastiveLossParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IContrastiveLossParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContrastiveLossParameter message, length delimited. Does not implicitly {@link caffe.ContrastiveLossParameter.verify|verify} messages.
         * @param message ContrastiveLossParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IContrastiveLossParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContrastiveLossParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContrastiveLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ContrastiveLossParameter;

        /**
         * Decodes a ContrastiveLossParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContrastiveLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ContrastiveLossParameter;

        /**
         * Verifies a ContrastiveLossParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContrastiveLossParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContrastiveLossParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ContrastiveLossParameter;

        /**
         * Creates a plain object from a ContrastiveLossParameter message. Also converts values to other types if specified.
         * @param message ContrastiveLossParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ContrastiveLossParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContrastiveLossParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ConvolutionParameter. */
    interface IConvolutionParameter {

        /** ConvolutionParameter numOutput */
        numOutput?: number;

        /** ConvolutionParameter biasTerm */
        biasTerm?: boolean;

        /** ConvolutionParameter pad */
        pad?: number[];

        /** ConvolutionParameter kernelSize */
        kernelSize?: number[];

        /** ConvolutionParameter stride */
        stride?: number[];

        /** ConvolutionParameter dilation */
        dilation?: number[];

        /** ConvolutionParameter padH */
        padH?: number;

        /** ConvolutionParameter padW */
        padW?: number;

        /** ConvolutionParameter kernelH */
        kernelH?: number;

        /** ConvolutionParameter kernelW */
        kernelW?: number;

        /** ConvolutionParameter strideH */
        strideH?: number;

        /** ConvolutionParameter strideW */
        strideW?: number;

        /** ConvolutionParameter group */
        group?: number;

        /** ConvolutionParameter weightFiller */
        weightFiller?: caffe.IFillerParameter;

        /** ConvolutionParameter biasFiller */
        biasFiller?: caffe.IFillerParameter;

        /** ConvolutionParameter engine */
        engine?: caffe.ConvolutionParameter.Engine;

        /** ConvolutionParameter axis */
        axis?: number;

        /** ConvolutionParameter forceNdIm2col */
        forceNdIm2col?: boolean;
    }

    /** Represents a ConvolutionParameter. */
    class ConvolutionParameter {

        /**
         * Constructs a new ConvolutionParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IConvolutionParameter);

        /** ConvolutionParameter numOutput. */
        public numOutput: number;

        /** ConvolutionParameter biasTerm. */
        public biasTerm: boolean;

        /** ConvolutionParameter pad. */
        public pad: number[];

        /** ConvolutionParameter kernelSize. */
        public kernelSize: number[];

        /** ConvolutionParameter stride. */
        public stride: number[];

        /** ConvolutionParameter dilation. */
        public dilation: number[];

        /** ConvolutionParameter padH. */
        public padH: number;

        /** ConvolutionParameter padW. */
        public padW: number;

        /** ConvolutionParameter kernelH. */
        public kernelH: number;

        /** ConvolutionParameter kernelW. */
        public kernelW: number;

        /** ConvolutionParameter strideH. */
        public strideH: number;

        /** ConvolutionParameter strideW. */
        public strideW: number;

        /** ConvolutionParameter group. */
        public group: number;

        /** ConvolutionParameter weightFiller. */
        public weightFiller?: (caffe.IFillerParameter|null);

        /** ConvolutionParameter biasFiller. */
        public biasFiller?: (caffe.IFillerParameter|null);

        /** ConvolutionParameter engine. */
        public engine: caffe.ConvolutionParameter.Engine;

        /** ConvolutionParameter axis. */
        public axis: number;

        /** ConvolutionParameter forceNdIm2col. */
        public forceNdIm2col: boolean;

        /**
         * Creates a new ConvolutionParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ConvolutionParameter instance
         */
        public static create(properties?: caffe.IConvolutionParameter): caffe.ConvolutionParameter;

        /**
         * Encodes the specified ConvolutionParameter message. Does not implicitly {@link caffe.ConvolutionParameter.verify|verify} messages.
         * @param message ConvolutionParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IConvolutionParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ConvolutionParameter message, length delimited. Does not implicitly {@link caffe.ConvolutionParameter.verify|verify} messages.
         * @param message ConvolutionParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IConvolutionParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ConvolutionParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ConvolutionParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ConvolutionParameter;

        /**
         * Decodes a ConvolutionParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ConvolutionParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ConvolutionParameter;

        /**
         * Verifies a ConvolutionParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ConvolutionParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ConvolutionParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ConvolutionParameter;

        /**
         * Creates a plain object from a ConvolutionParameter message. Also converts values to other types if specified.
         * @param message ConvolutionParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ConvolutionParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ConvolutionParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ConvolutionParameter {

        /** Engine enum. */
        enum Engine {
            DEFAULT = 0,
            CAFFE = 1,
            CUDNN = 2
        }
    }

    /** Properties of a CropParameter. */
    interface ICropParameter {

        /** CropParameter axis */
        axis?: number;

        /** CropParameter offset */
        offset?: number[];
    }

    /** Represents a CropParameter. */
    class CropParameter {

        /**
         * Constructs a new CropParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ICropParameter);

        /** CropParameter axis. */
        public axis: number;

        /** CropParameter offset. */
        public offset: number[];

        /**
         * Creates a new CropParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CropParameter instance
         */
        public static create(properties?: caffe.ICropParameter): caffe.CropParameter;

        /**
         * Encodes the specified CropParameter message. Does not implicitly {@link caffe.CropParameter.verify|verify} messages.
         * @param message CropParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ICropParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CropParameter message, length delimited. Does not implicitly {@link caffe.CropParameter.verify|verify} messages.
         * @param message CropParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ICropParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CropParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CropParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.CropParameter;

        /**
         * Decodes a CropParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CropParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.CropParameter;

        /**
         * Verifies a CropParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CropParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CropParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.CropParameter;

        /**
         * Creates a plain object from a CropParameter message. Also converts values to other types if specified.
         * @param message CropParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.CropParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CropParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataParameter. */
    interface IDataParameter {

        /** DataParameter source */
        source?: string;

        /** DataParameter batchSize */
        batchSize?: number;

        /** DataParameter randSkip */
        randSkip?: number;

        /** DataParameter backend */
        backend?: caffe.DataParameter.DB;

        /** DataParameter scale */
        scale?: number;

        /** DataParameter meanFile */
        meanFile?: string;

        /** DataParameter cropSize */
        cropSize?: number;

        /** DataParameter mirror */
        mirror?: boolean;

        /** DataParameter forceEncodedColor */
        forceEncodedColor?: boolean;

        /** DataParameter prefetch */
        prefetch?: number;
    }

    /** Represents a DataParameter. */
    class DataParameter {

        /**
         * Constructs a new DataParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IDataParameter);

        /** DataParameter source. */
        public source: string;

        /** DataParameter batchSize. */
        public batchSize: number;

        /** DataParameter randSkip. */
        public randSkip: number;

        /** DataParameter backend. */
        public backend: caffe.DataParameter.DB;

        /** DataParameter scale. */
        public scale: number;

        /** DataParameter meanFile. */
        public meanFile: string;

        /** DataParameter cropSize. */
        public cropSize: number;

        /** DataParameter mirror. */
        public mirror: boolean;

        /** DataParameter forceEncodedColor. */
        public forceEncodedColor: boolean;

        /** DataParameter prefetch. */
        public prefetch: number;

        /**
         * Creates a new DataParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataParameter instance
         */
        public static create(properties?: caffe.IDataParameter): caffe.DataParameter;

        /**
         * Encodes the specified DataParameter message. Does not implicitly {@link caffe.DataParameter.verify|verify} messages.
         * @param message DataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataParameter message, length delimited. Does not implicitly {@link caffe.DataParameter.verify|verify} messages.
         * @param message DataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.DataParameter;

        /**
         * Decodes a DataParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.DataParameter;

        /**
         * Verifies a DataParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.DataParameter;

        /**
         * Creates a plain object from a DataParameter message. Also converts values to other types if specified.
         * @param message DataParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.DataParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace DataParameter {

        /** DB enum. */
        enum DB {
            LEVELDB = 0,
            LMDB = 1
        }
    }

    /** Properties of a DropoutParameter. */
    interface IDropoutParameter {

        /** DropoutParameter dropoutRatio */
        dropoutRatio?: number;
    }

    /** Represents a DropoutParameter. */
    class DropoutParameter {

        /**
         * Constructs a new DropoutParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IDropoutParameter);

        /** DropoutParameter dropoutRatio. */
        public dropoutRatio: number;

        /**
         * Creates a new DropoutParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DropoutParameter instance
         */
        public static create(properties?: caffe.IDropoutParameter): caffe.DropoutParameter;

        /**
         * Encodes the specified DropoutParameter message. Does not implicitly {@link caffe.DropoutParameter.verify|verify} messages.
         * @param message DropoutParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IDropoutParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DropoutParameter message, length delimited. Does not implicitly {@link caffe.DropoutParameter.verify|verify} messages.
         * @param message DropoutParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IDropoutParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DropoutParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DropoutParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.DropoutParameter;

        /**
         * Decodes a DropoutParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DropoutParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.DropoutParameter;

        /**
         * Verifies a DropoutParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DropoutParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DropoutParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.DropoutParameter;

        /**
         * Creates a plain object from a DropoutParameter message. Also converts values to other types if specified.
         * @param message DropoutParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.DropoutParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DropoutParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DummyDataParameter. */
    interface IDummyDataParameter {

        /** DummyDataParameter dataFiller */
        dataFiller?: caffe.IFillerParameter[];

        /** DummyDataParameter shape */
        shape?: caffe.IBlobShape[];

        /** DummyDataParameter num */
        num?: number[];

        /** DummyDataParameter channels */
        channels?: number[];

        /** DummyDataParameter height */
        height?: number[];

        /** DummyDataParameter width */
        width?: number[];
    }

    /** Represents a DummyDataParameter. */
    class DummyDataParameter {

        /**
         * Constructs a new DummyDataParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IDummyDataParameter);

        /** DummyDataParameter dataFiller. */
        public dataFiller: caffe.IFillerParameter[];

        /** DummyDataParameter shape. */
        public shape: caffe.IBlobShape[];

        /** DummyDataParameter num. */
        public num: number[];

        /** DummyDataParameter channels. */
        public channels: number[];

        /** DummyDataParameter height. */
        public height: number[];

        /** DummyDataParameter width. */
        public width: number[];

        /**
         * Creates a new DummyDataParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DummyDataParameter instance
         */
        public static create(properties?: caffe.IDummyDataParameter): caffe.DummyDataParameter;

        /**
         * Encodes the specified DummyDataParameter message. Does not implicitly {@link caffe.DummyDataParameter.verify|verify} messages.
         * @param message DummyDataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IDummyDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DummyDataParameter message, length delimited. Does not implicitly {@link caffe.DummyDataParameter.verify|verify} messages.
         * @param message DummyDataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IDummyDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DummyDataParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DummyDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.DummyDataParameter;

        /**
         * Decodes a DummyDataParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DummyDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.DummyDataParameter;

        /**
         * Verifies a DummyDataParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DummyDataParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DummyDataParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.DummyDataParameter;

        /**
         * Creates a plain object from a DummyDataParameter message. Also converts values to other types if specified.
         * @param message DummyDataParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.DummyDataParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DummyDataParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EltwiseParameter. */
    interface IEltwiseParameter {

        /** EltwiseParameter operation */
        operation?: caffe.EltwiseParameter.EltwiseOp;

        /** EltwiseParameter coeff */
        coeff?: number[];

        /** EltwiseParameter stableProdGrad */
        stableProdGrad?: boolean;
    }

    /** Represents an EltwiseParameter. */
    class EltwiseParameter {

        /**
         * Constructs a new EltwiseParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IEltwiseParameter);

        /** EltwiseParameter operation. */
        public operation: caffe.EltwiseParameter.EltwiseOp;

        /** EltwiseParameter coeff. */
        public coeff: number[];

        /** EltwiseParameter stableProdGrad. */
        public stableProdGrad: boolean;

        /**
         * Creates a new EltwiseParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EltwiseParameter instance
         */
        public static create(properties?: caffe.IEltwiseParameter): caffe.EltwiseParameter;

        /**
         * Encodes the specified EltwiseParameter message. Does not implicitly {@link caffe.EltwiseParameter.verify|verify} messages.
         * @param message EltwiseParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IEltwiseParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EltwiseParameter message, length delimited. Does not implicitly {@link caffe.EltwiseParameter.verify|verify} messages.
         * @param message EltwiseParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IEltwiseParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EltwiseParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EltwiseParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.EltwiseParameter;

        /**
         * Decodes an EltwiseParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EltwiseParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.EltwiseParameter;

        /**
         * Verifies an EltwiseParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EltwiseParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EltwiseParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.EltwiseParameter;

        /**
         * Creates a plain object from an EltwiseParameter message. Also converts values to other types if specified.
         * @param message EltwiseParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.EltwiseParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EltwiseParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace EltwiseParameter {

        /** EltwiseOp enum. */
        enum EltwiseOp {
            PROD = 0,
            SUM = 1,
            MAX = 2
        }
    }

    /** Properties of a ELUParameter. */
    interface IELUParameter {

        /** ELUParameter alpha */
        alpha?: number;
    }

    /** Represents a ELUParameter. */
    class ELUParameter {

        /**
         * Constructs a new ELUParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IELUParameter);

        /** ELUParameter alpha. */
        public alpha: number;

        /**
         * Creates a new ELUParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ELUParameter instance
         */
        public static create(properties?: caffe.IELUParameter): caffe.ELUParameter;

        /**
         * Encodes the specified ELUParameter message. Does not implicitly {@link caffe.ELUParameter.verify|verify} messages.
         * @param message ELUParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IELUParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ELUParameter message, length delimited. Does not implicitly {@link caffe.ELUParameter.verify|verify} messages.
         * @param message ELUParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IELUParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ELUParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ELUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ELUParameter;

        /**
         * Decodes a ELUParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ELUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ELUParameter;

        /**
         * Verifies a ELUParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ELUParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ELUParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ELUParameter;

        /**
         * Creates a plain object from a ELUParameter message. Also converts values to other types if specified.
         * @param message ELUParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ELUParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ELUParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EmbedParameter. */
    interface IEmbedParameter {

        /** EmbedParameter numOutput */
        numOutput?: number;

        /** EmbedParameter inputDim */
        inputDim?: number;

        /** EmbedParameter biasTerm */
        biasTerm?: boolean;

        /** EmbedParameter weightFiller */
        weightFiller?: caffe.IFillerParameter;

        /** EmbedParameter biasFiller */
        biasFiller?: caffe.IFillerParameter;
    }

    /** Represents an EmbedParameter. */
    class EmbedParameter {

        /**
         * Constructs a new EmbedParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IEmbedParameter);

        /** EmbedParameter numOutput. */
        public numOutput: number;

        /** EmbedParameter inputDim. */
        public inputDim: number;

        /** EmbedParameter biasTerm. */
        public biasTerm: boolean;

        /** EmbedParameter weightFiller. */
        public weightFiller?: (caffe.IFillerParameter|null);

        /** EmbedParameter biasFiller. */
        public biasFiller?: (caffe.IFillerParameter|null);

        /**
         * Creates a new EmbedParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EmbedParameter instance
         */
        public static create(properties?: caffe.IEmbedParameter): caffe.EmbedParameter;

        /**
         * Encodes the specified EmbedParameter message. Does not implicitly {@link caffe.EmbedParameter.verify|verify} messages.
         * @param message EmbedParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IEmbedParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EmbedParameter message, length delimited. Does not implicitly {@link caffe.EmbedParameter.verify|verify} messages.
         * @param message EmbedParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IEmbedParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EmbedParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EmbedParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.EmbedParameter;

        /**
         * Decodes an EmbedParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EmbedParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.EmbedParameter;

        /**
         * Verifies an EmbedParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EmbedParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EmbedParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.EmbedParameter;

        /**
         * Creates a plain object from an EmbedParameter message. Also converts values to other types if specified.
         * @param message EmbedParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.EmbedParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EmbedParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ExpParameter. */
    interface IExpParameter {

        /** ExpParameter base */
        base?: number;

        /** ExpParameter scale */
        scale?: number;

        /** ExpParameter shift */
        shift?: number;
    }

    /** Represents an ExpParameter. */
    class ExpParameter {

        /**
         * Constructs a new ExpParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IExpParameter);

        /** ExpParameter base. */
        public base: number;

        /** ExpParameter scale. */
        public scale: number;

        /** ExpParameter shift. */
        public shift: number;

        /**
         * Creates a new ExpParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExpParameter instance
         */
        public static create(properties?: caffe.IExpParameter): caffe.ExpParameter;

        /**
         * Encodes the specified ExpParameter message. Does not implicitly {@link caffe.ExpParameter.verify|verify} messages.
         * @param message ExpParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IExpParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExpParameter message, length delimited. Does not implicitly {@link caffe.ExpParameter.verify|verify} messages.
         * @param message ExpParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IExpParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExpParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExpParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ExpParameter;

        /**
         * Decodes an ExpParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExpParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ExpParameter;

        /**
         * Verifies an ExpParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExpParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExpParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ExpParameter;

        /**
         * Creates a plain object from an ExpParameter message. Also converts values to other types if specified.
         * @param message ExpParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ExpParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExpParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a FlattenParameter. */
    interface IFlattenParameter {

        /** FlattenParameter axis */
        axis?: number;

        /** FlattenParameter endAxis */
        endAxis?: number;
    }

    /** Message that stores parameters used by FlattenLayer */
    class FlattenParameter {

        /**
         * Constructs a new FlattenParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IFlattenParameter);

        /** FlattenParameter axis. */
        public axis: number;

        /** FlattenParameter endAxis. */
        public endAxis: number;

        /**
         * Creates a new FlattenParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FlattenParameter instance
         */
        public static create(properties?: caffe.IFlattenParameter): caffe.FlattenParameter;

        /**
         * Encodes the specified FlattenParameter message. Does not implicitly {@link caffe.FlattenParameter.verify|verify} messages.
         * @param message FlattenParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IFlattenParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FlattenParameter message, length delimited. Does not implicitly {@link caffe.FlattenParameter.verify|verify} messages.
         * @param message FlattenParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IFlattenParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FlattenParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FlattenParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.FlattenParameter;

        /**
         * Decodes a FlattenParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FlattenParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.FlattenParameter;

        /**
         * Verifies a FlattenParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a FlattenParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FlattenParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.FlattenParameter;

        /**
         * Creates a plain object from a FlattenParameter message. Also converts values to other types if specified.
         * @param message FlattenParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.FlattenParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FlattenParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HDF5DataParameter. */
    interface IHDF5DataParameter {

        /** HDF5DataParameter source */
        source?: string;

        /** HDF5DataParameter batchSize */
        batchSize?: number;

        /** HDF5DataParameter shuffle */
        shuffle?: boolean;
    }

    /** Represents a HDF5DataParameter. */
    class HDF5DataParameter {

        /**
         * Constructs a new HDF5DataParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IHDF5DataParameter);

        /** HDF5DataParameter source. */
        public source: string;

        /** HDF5DataParameter batchSize. */
        public batchSize: number;

        /** HDF5DataParameter shuffle. */
        public shuffle: boolean;

        /**
         * Creates a new HDF5DataParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HDF5DataParameter instance
         */
        public static create(properties?: caffe.IHDF5DataParameter): caffe.HDF5DataParameter;

        /**
         * Encodes the specified HDF5DataParameter message. Does not implicitly {@link caffe.HDF5DataParameter.verify|verify} messages.
         * @param message HDF5DataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IHDF5DataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HDF5DataParameter message, length delimited. Does not implicitly {@link caffe.HDF5DataParameter.verify|verify} messages.
         * @param message HDF5DataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IHDF5DataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HDF5DataParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HDF5DataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.HDF5DataParameter;

        /**
         * Decodes a HDF5DataParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HDF5DataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.HDF5DataParameter;

        /**
         * Verifies a HDF5DataParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HDF5DataParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HDF5DataParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.HDF5DataParameter;

        /**
         * Creates a plain object from a HDF5DataParameter message. Also converts values to other types if specified.
         * @param message HDF5DataParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.HDF5DataParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HDF5DataParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HDF5OutputParameter. */
    interface IHDF5OutputParameter {

        /** HDF5OutputParameter fileName */
        fileName?: string;
    }

    /** Represents a HDF5OutputParameter. */
    class HDF5OutputParameter {

        /**
         * Constructs a new HDF5OutputParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IHDF5OutputParameter);

        /** HDF5OutputParameter fileName. */
        public fileName: string;

        /**
         * Creates a new HDF5OutputParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HDF5OutputParameter instance
         */
        public static create(properties?: caffe.IHDF5OutputParameter): caffe.HDF5OutputParameter;

        /**
         * Encodes the specified HDF5OutputParameter message. Does not implicitly {@link caffe.HDF5OutputParameter.verify|verify} messages.
         * @param message HDF5OutputParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IHDF5OutputParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HDF5OutputParameter message, length delimited. Does not implicitly {@link caffe.HDF5OutputParameter.verify|verify} messages.
         * @param message HDF5OutputParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IHDF5OutputParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HDF5OutputParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HDF5OutputParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.HDF5OutputParameter;

        /**
         * Decodes a HDF5OutputParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HDF5OutputParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.HDF5OutputParameter;

        /**
         * Verifies a HDF5OutputParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HDF5OutputParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HDF5OutputParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.HDF5OutputParameter;

        /**
         * Creates a plain object from a HDF5OutputParameter message. Also converts values to other types if specified.
         * @param message HDF5OutputParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.HDF5OutputParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HDF5OutputParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a HingeLossParameter. */
    interface IHingeLossParameter {

        /** HingeLossParameter norm */
        norm?: caffe.HingeLossParameter.Norm;
    }

    /** Represents a HingeLossParameter. */
    class HingeLossParameter {

        /**
         * Constructs a new HingeLossParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IHingeLossParameter);

        /** HingeLossParameter norm. */
        public norm: caffe.HingeLossParameter.Norm;

        /**
         * Creates a new HingeLossParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns HingeLossParameter instance
         */
        public static create(properties?: caffe.IHingeLossParameter): caffe.HingeLossParameter;

        /**
         * Encodes the specified HingeLossParameter message. Does not implicitly {@link caffe.HingeLossParameter.verify|verify} messages.
         * @param message HingeLossParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IHingeLossParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified HingeLossParameter message, length delimited. Does not implicitly {@link caffe.HingeLossParameter.verify|verify} messages.
         * @param message HingeLossParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IHingeLossParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a HingeLossParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns HingeLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.HingeLossParameter;

        /**
         * Decodes a HingeLossParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns HingeLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.HingeLossParameter;

        /**
         * Verifies a HingeLossParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a HingeLossParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns HingeLossParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.HingeLossParameter;

        /**
         * Creates a plain object from a HingeLossParameter message. Also converts values to other types if specified.
         * @param message HingeLossParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.HingeLossParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this HingeLossParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace HingeLossParameter {

        /** Norm enum. */
        enum Norm {
            L1 = 1,
            L2 = 2
        }
    }

    /** Properties of an ImageDataParameter. */
    interface IImageDataParameter {

        /** ImageDataParameter source */
        source?: string;

        /** ImageDataParameter batchSize */
        batchSize?: number;

        /** ImageDataParameter randSkip */
        randSkip?: number;

        /** ImageDataParameter shuffle */
        shuffle?: boolean;

        /** ImageDataParameter newHeight */
        newHeight?: number;

        /** ImageDataParameter newWidth */
        newWidth?: number;

        /** ImageDataParameter isColor */
        isColor?: boolean;

        /** ImageDataParameter scale */
        scale?: number;

        /** ImageDataParameter meanFile */
        meanFile?: string;

        /** ImageDataParameter cropSize */
        cropSize?: number;

        /** ImageDataParameter mirror */
        mirror?: boolean;

        /** ImageDataParameter rootFolder */
        rootFolder?: string;
    }

    /** Represents an ImageDataParameter. */
    class ImageDataParameter {

        /**
         * Constructs a new ImageDataParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IImageDataParameter);

        /** ImageDataParameter source. */
        public source: string;

        /** ImageDataParameter batchSize. */
        public batchSize: number;

        /** ImageDataParameter randSkip. */
        public randSkip: number;

        /** ImageDataParameter shuffle. */
        public shuffle: boolean;

        /** ImageDataParameter newHeight. */
        public newHeight: number;

        /** ImageDataParameter newWidth. */
        public newWidth: number;

        /** ImageDataParameter isColor. */
        public isColor: boolean;

        /** ImageDataParameter scale. */
        public scale: number;

        /** ImageDataParameter meanFile. */
        public meanFile: string;

        /** ImageDataParameter cropSize. */
        public cropSize: number;

        /** ImageDataParameter mirror. */
        public mirror: boolean;

        /** ImageDataParameter rootFolder. */
        public rootFolder: string;

        /**
         * Creates a new ImageDataParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ImageDataParameter instance
         */
        public static create(properties?: caffe.IImageDataParameter): caffe.ImageDataParameter;

        /**
         * Encodes the specified ImageDataParameter message. Does not implicitly {@link caffe.ImageDataParameter.verify|verify} messages.
         * @param message ImageDataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IImageDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ImageDataParameter message, length delimited. Does not implicitly {@link caffe.ImageDataParameter.verify|verify} messages.
         * @param message ImageDataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IImageDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ImageDataParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ImageDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ImageDataParameter;

        /**
         * Decodes an ImageDataParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ImageDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ImageDataParameter;

        /**
         * Verifies an ImageDataParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ImageDataParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ImageDataParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ImageDataParameter;

        /**
         * Creates a plain object from an ImageDataParameter message. Also converts values to other types if specified.
         * @param message ImageDataParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ImageDataParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ImageDataParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InfogainLossParameter. */
    interface IInfogainLossParameter {

        /** InfogainLossParameter source */
        source?: string;

        /** InfogainLossParameter axis */
        axis?: number;
    }

    /** Represents an InfogainLossParameter. */
    class InfogainLossParameter {

        /**
         * Constructs a new InfogainLossParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IInfogainLossParameter);

        /** InfogainLossParameter source. */
        public source: string;

        /** InfogainLossParameter axis. */
        public axis: number;

        /**
         * Creates a new InfogainLossParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InfogainLossParameter instance
         */
        public static create(properties?: caffe.IInfogainLossParameter): caffe.InfogainLossParameter;

        /**
         * Encodes the specified InfogainLossParameter message. Does not implicitly {@link caffe.InfogainLossParameter.verify|verify} messages.
         * @param message InfogainLossParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IInfogainLossParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InfogainLossParameter message, length delimited. Does not implicitly {@link caffe.InfogainLossParameter.verify|verify} messages.
         * @param message InfogainLossParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IInfogainLossParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InfogainLossParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InfogainLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.InfogainLossParameter;

        /**
         * Decodes an InfogainLossParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InfogainLossParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.InfogainLossParameter;

        /**
         * Verifies an InfogainLossParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InfogainLossParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InfogainLossParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.InfogainLossParameter;

        /**
         * Creates a plain object from an InfogainLossParameter message. Also converts values to other types if specified.
         * @param message InfogainLossParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.InfogainLossParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InfogainLossParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InnerProductParameter. */
    interface IInnerProductParameter {

        /** InnerProductParameter numOutput */
        numOutput?: number;

        /** InnerProductParameter biasTerm */
        biasTerm?: boolean;

        /** InnerProductParameter weightFiller */
        weightFiller?: caffe.IFillerParameter;

        /** InnerProductParameter biasFiller */
        biasFiller?: caffe.IFillerParameter;

        /** InnerProductParameter axis */
        axis?: number;

        /** InnerProductParameter transpose */
        transpose?: boolean;
    }

    /** Represents an InnerProductParameter. */
    class InnerProductParameter {

        /**
         * Constructs a new InnerProductParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IInnerProductParameter);

        /** InnerProductParameter numOutput. */
        public numOutput: number;

        /** InnerProductParameter biasTerm. */
        public biasTerm: boolean;

        /** InnerProductParameter weightFiller. */
        public weightFiller?: (caffe.IFillerParameter|null);

        /** InnerProductParameter biasFiller. */
        public biasFiller?: (caffe.IFillerParameter|null);

        /** InnerProductParameter axis. */
        public axis: number;

        /** InnerProductParameter transpose. */
        public transpose: boolean;

        /**
         * Creates a new InnerProductParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InnerProductParameter instance
         */
        public static create(properties?: caffe.IInnerProductParameter): caffe.InnerProductParameter;

        /**
         * Encodes the specified InnerProductParameter message. Does not implicitly {@link caffe.InnerProductParameter.verify|verify} messages.
         * @param message InnerProductParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IInnerProductParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InnerProductParameter message, length delimited. Does not implicitly {@link caffe.InnerProductParameter.verify|verify} messages.
         * @param message InnerProductParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IInnerProductParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InnerProductParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InnerProductParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.InnerProductParameter;

        /**
         * Decodes an InnerProductParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InnerProductParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.InnerProductParameter;

        /**
         * Verifies an InnerProductParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InnerProductParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InnerProductParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.InnerProductParameter;

        /**
         * Creates a plain object from an InnerProductParameter message. Also converts values to other types if specified.
         * @param message InnerProductParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.InnerProductParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InnerProductParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InputParameter. */
    interface IInputParameter {

        /** InputParameter shape */
        shape?: caffe.IBlobShape[];
    }

    /** Represents an InputParameter. */
    class InputParameter {

        /**
         * Constructs a new InputParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IInputParameter);

        /** InputParameter shape. */
        public shape: caffe.IBlobShape[];

        /**
         * Creates a new InputParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InputParameter instance
         */
        public static create(properties?: caffe.IInputParameter): caffe.InputParameter;

        /**
         * Encodes the specified InputParameter message. Does not implicitly {@link caffe.InputParameter.verify|verify} messages.
         * @param message InputParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IInputParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InputParameter message, length delimited. Does not implicitly {@link caffe.InputParameter.verify|verify} messages.
         * @param message InputParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IInputParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InputParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InputParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.InputParameter;

        /**
         * Decodes an InputParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InputParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.InputParameter;

        /**
         * Verifies an InputParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InputParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InputParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.InputParameter;

        /**
         * Creates a plain object from an InputParameter message. Also converts values to other types if specified.
         * @param message InputParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.InputParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InputParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LogParameter. */
    interface ILogParameter {

        /** LogParameter base */
        base?: number;

        /** LogParameter scale */
        scale?: number;

        /** LogParameter shift */
        shift?: number;
    }

    /** Represents a LogParameter. */
    class LogParameter {

        /**
         * Constructs a new LogParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ILogParameter);

        /** LogParameter base. */
        public base: number;

        /** LogParameter scale. */
        public scale: number;

        /** LogParameter shift. */
        public shift: number;

        /**
         * Creates a new LogParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LogParameter instance
         */
        public static create(properties?: caffe.ILogParameter): caffe.LogParameter;

        /**
         * Encodes the specified LogParameter message. Does not implicitly {@link caffe.LogParameter.verify|verify} messages.
         * @param message LogParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ILogParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LogParameter message, length delimited. Does not implicitly {@link caffe.LogParameter.verify|verify} messages.
         * @param message LogParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ILogParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LogParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LogParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.LogParameter;

        /**
         * Decodes a LogParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LogParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.LogParameter;

        /**
         * Verifies a LogParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LogParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LogParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.LogParameter;

        /**
         * Creates a plain object from a LogParameter message. Also converts values to other types if specified.
         * @param message LogParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.LogParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LogParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LRNParameter. */
    interface ILRNParameter {

        /** LRNParameter localSize */
        localSize?: number;

        /** LRNParameter alpha */
        alpha?: number;

        /** LRNParameter beta */
        beta?: number;

        /** LRNParameter normRegion */
        normRegion?: caffe.LRNParameter.NormRegion;

        /** LRNParameter k */
        k?: number;

        /** LRNParameter engine */
        engine?: caffe.LRNParameter.Engine;
    }

    /** Represents a LRNParameter. */
    class LRNParameter {

        /**
         * Constructs a new LRNParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ILRNParameter);

        /** LRNParameter localSize. */
        public localSize: number;

        /** LRNParameter alpha. */
        public alpha: number;

        /** LRNParameter beta. */
        public beta: number;

        /** LRNParameter normRegion. */
        public normRegion: caffe.LRNParameter.NormRegion;

        /** LRNParameter k. */
        public k: number;

        /** LRNParameter engine. */
        public engine: caffe.LRNParameter.Engine;

        /**
         * Creates a new LRNParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LRNParameter instance
         */
        public static create(properties?: caffe.ILRNParameter): caffe.LRNParameter;

        /**
         * Encodes the specified LRNParameter message. Does not implicitly {@link caffe.LRNParameter.verify|verify} messages.
         * @param message LRNParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ILRNParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LRNParameter message, length delimited. Does not implicitly {@link caffe.LRNParameter.verify|verify} messages.
         * @param message LRNParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ILRNParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LRNParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LRNParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.LRNParameter;

        /**
         * Decodes a LRNParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LRNParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.LRNParameter;

        /**
         * Verifies a LRNParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LRNParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LRNParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.LRNParameter;

        /**
         * Creates a plain object from a LRNParameter message. Also converts values to other types if specified.
         * @param message LRNParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.LRNParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LRNParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace LRNParameter {

        /** NormRegion enum. */
        enum NormRegion {
            ACROSS_CHANNELS = 0,
            WITHIN_CHANNEL = 1
        }

        /** Engine enum. */
        enum Engine {
            DEFAULT = 0,
            CAFFE = 1,
            CUDNN = 2
        }
    }

    /** Properties of a MemoryDataParameter. */
    interface IMemoryDataParameter {

        /** MemoryDataParameter batchSize */
        batchSize?: number;

        /** MemoryDataParameter channels */
        channels?: number;

        /** MemoryDataParameter height */
        height?: number;

        /** MemoryDataParameter width */
        width?: number;
    }

    /** Represents a MemoryDataParameter. */
    class MemoryDataParameter {

        /**
         * Constructs a new MemoryDataParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IMemoryDataParameter);

        /** MemoryDataParameter batchSize. */
        public batchSize: number;

        /** MemoryDataParameter channels. */
        public channels: number;

        /** MemoryDataParameter height. */
        public height: number;

        /** MemoryDataParameter width. */
        public width: number;

        /**
         * Creates a new MemoryDataParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MemoryDataParameter instance
         */
        public static create(properties?: caffe.IMemoryDataParameter): caffe.MemoryDataParameter;

        /**
         * Encodes the specified MemoryDataParameter message. Does not implicitly {@link caffe.MemoryDataParameter.verify|verify} messages.
         * @param message MemoryDataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IMemoryDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MemoryDataParameter message, length delimited. Does not implicitly {@link caffe.MemoryDataParameter.verify|verify} messages.
         * @param message MemoryDataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IMemoryDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MemoryDataParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MemoryDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.MemoryDataParameter;

        /**
         * Decodes a MemoryDataParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MemoryDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.MemoryDataParameter;

        /**
         * Verifies a MemoryDataParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MemoryDataParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MemoryDataParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.MemoryDataParameter;

        /**
         * Creates a plain object from a MemoryDataParameter message. Also converts values to other types if specified.
         * @param message MemoryDataParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.MemoryDataParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MemoryDataParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MVNParameter. */
    interface IMVNParameter {

        /** MVNParameter normalizeVariance */
        normalizeVariance?: boolean;

        /** MVNParameter acrossChannels */
        acrossChannels?: boolean;

        /** MVNParameter eps */
        eps?: number;
    }

    /** Represents a MVNParameter. */
    class MVNParameter {

        /**
         * Constructs a new MVNParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IMVNParameter);

        /** MVNParameter normalizeVariance. */
        public normalizeVariance: boolean;

        /** MVNParameter acrossChannels. */
        public acrossChannels: boolean;

        /** MVNParameter eps. */
        public eps: number;

        /**
         * Creates a new MVNParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MVNParameter instance
         */
        public static create(properties?: caffe.IMVNParameter): caffe.MVNParameter;

        /**
         * Encodes the specified MVNParameter message. Does not implicitly {@link caffe.MVNParameter.verify|verify} messages.
         * @param message MVNParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IMVNParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MVNParameter message, length delimited. Does not implicitly {@link caffe.MVNParameter.verify|verify} messages.
         * @param message MVNParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IMVNParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MVNParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MVNParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.MVNParameter;

        /**
         * Decodes a MVNParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MVNParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.MVNParameter;

        /**
         * Verifies a MVNParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MVNParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MVNParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.MVNParameter;

        /**
         * Creates a plain object from a MVNParameter message. Also converts values to other types if specified.
         * @param message MVNParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.MVNParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MVNParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ParameterParameter. */
    interface IParameterParameter {

        /** ParameterParameter shape */
        shape?: caffe.IBlobShape;
    }

    /** Represents a ParameterParameter. */
    class ParameterParameter {

        /**
         * Constructs a new ParameterParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IParameterParameter);

        /** ParameterParameter shape. */
        public shape?: (caffe.IBlobShape|null);

        /**
         * Creates a new ParameterParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ParameterParameter instance
         */
        public static create(properties?: caffe.IParameterParameter): caffe.ParameterParameter;

        /**
         * Encodes the specified ParameterParameter message. Does not implicitly {@link caffe.ParameterParameter.verify|verify} messages.
         * @param message ParameterParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IParameterParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ParameterParameter message, length delimited. Does not implicitly {@link caffe.ParameterParameter.verify|verify} messages.
         * @param message ParameterParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IParameterParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ParameterParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ParameterParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ParameterParameter;

        /**
         * Decodes a ParameterParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ParameterParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ParameterParameter;

        /**
         * Verifies a ParameterParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ParameterParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ParameterParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ParameterParameter;

        /**
         * Creates a plain object from a ParameterParameter message. Also converts values to other types if specified.
         * @param message ParameterParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ParameterParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ParameterParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PoolingParameter. */
    interface IPoolingParameter {

        /** PoolingParameter pool */
        pool?: caffe.PoolingParameter.PoolMethod;

        /** PoolingParameter pad */
        pad?: number;

        /** PoolingParameter padH */
        padH?: number;

        /** PoolingParameter padW */
        padW?: number;

        /** PoolingParameter kernelSize */
        kernelSize?: number;

        /** PoolingParameter kernelH */
        kernelH?: number;

        /** PoolingParameter kernelW */
        kernelW?: number;

        /** PoolingParameter stride */
        stride?: number;

        /** PoolingParameter strideH */
        strideH?: number;

        /** PoolingParameter strideW */
        strideW?: number;

        /** PoolingParameter engine */
        engine?: caffe.PoolingParameter.Engine;

        /** PoolingParameter globalPooling */
        globalPooling?: boolean;
    }

    /** Represents a PoolingParameter. */
    class PoolingParameter {

        /**
         * Constructs a new PoolingParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IPoolingParameter);

        /** PoolingParameter pool. */
        public pool: caffe.PoolingParameter.PoolMethod;

        /** PoolingParameter pad. */
        public pad: number;

        /** PoolingParameter padH. */
        public padH: number;

        /** PoolingParameter padW. */
        public padW: number;

        /** PoolingParameter kernelSize. */
        public kernelSize: number;

        /** PoolingParameter kernelH. */
        public kernelH: number;

        /** PoolingParameter kernelW. */
        public kernelW: number;

        /** PoolingParameter stride. */
        public stride: number;

        /** PoolingParameter strideH. */
        public strideH: number;

        /** PoolingParameter strideW. */
        public strideW: number;

        /** PoolingParameter engine. */
        public engine: caffe.PoolingParameter.Engine;

        /** PoolingParameter globalPooling. */
        public globalPooling: boolean;

        /**
         * Creates a new PoolingParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PoolingParameter instance
         */
        public static create(properties?: caffe.IPoolingParameter): caffe.PoolingParameter;

        /**
         * Encodes the specified PoolingParameter message. Does not implicitly {@link caffe.PoolingParameter.verify|verify} messages.
         * @param message PoolingParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IPoolingParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PoolingParameter message, length delimited. Does not implicitly {@link caffe.PoolingParameter.verify|verify} messages.
         * @param message PoolingParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IPoolingParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PoolingParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PoolingParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.PoolingParameter;

        /**
         * Decodes a PoolingParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PoolingParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.PoolingParameter;

        /**
         * Verifies a PoolingParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PoolingParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PoolingParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.PoolingParameter;

        /**
         * Creates a plain object from a PoolingParameter message. Also converts values to other types if specified.
         * @param message PoolingParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.PoolingParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PoolingParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace PoolingParameter {

        /** PoolMethod enum. */
        enum PoolMethod {
            MAX = 0,
            AVE = 1,
            STOCHASTIC = 2
        }

        /** Engine enum. */
        enum Engine {
            DEFAULT = 0,
            CAFFE = 1,
            CUDNN = 2
        }
    }

    /** Properties of a PowerParameter. */
    interface IPowerParameter {

        /** PowerParameter power */
        power?: number;

        /** PowerParameter scale */
        scale?: number;

        /** PowerParameter shift */
        shift?: number;
    }

    /** Represents a PowerParameter. */
    class PowerParameter {

        /**
         * Constructs a new PowerParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IPowerParameter);

        /** PowerParameter power. */
        public power: number;

        /** PowerParameter scale. */
        public scale: number;

        /** PowerParameter shift. */
        public shift: number;

        /**
         * Creates a new PowerParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PowerParameter instance
         */
        public static create(properties?: caffe.IPowerParameter): caffe.PowerParameter;

        /**
         * Encodes the specified PowerParameter message. Does not implicitly {@link caffe.PowerParameter.verify|verify} messages.
         * @param message PowerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IPowerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PowerParameter message, length delimited. Does not implicitly {@link caffe.PowerParameter.verify|verify} messages.
         * @param message PowerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IPowerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PowerParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PowerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.PowerParameter;

        /**
         * Decodes a PowerParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PowerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.PowerParameter;

        /**
         * Verifies a PowerParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PowerParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PowerParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.PowerParameter;

        /**
         * Creates a plain object from a PowerParameter message. Also converts values to other types if specified.
         * @param message PowerParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.PowerParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PowerParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PythonParameter. */
    interface IPythonParameter {

        /** PythonParameter module */
        module?: string;

        /** PythonParameter layer */
        layer?: string;

        /** PythonParameter paramStr */
        paramStr?: string;

        /** PythonParameter shareInParallel */
        shareInParallel?: boolean;
    }

    /** Represents a PythonParameter. */
    class PythonParameter {

        /**
         * Constructs a new PythonParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IPythonParameter);

        /** PythonParameter module. */
        public module: string;

        /** PythonParameter layer. */
        public layer: string;

        /** PythonParameter paramStr. */
        public paramStr: string;

        /** PythonParameter shareInParallel. */
        public shareInParallel: boolean;

        /**
         * Creates a new PythonParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PythonParameter instance
         */
        public static create(properties?: caffe.IPythonParameter): caffe.PythonParameter;

        /**
         * Encodes the specified PythonParameter message. Does not implicitly {@link caffe.PythonParameter.verify|verify} messages.
         * @param message PythonParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IPythonParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PythonParameter message, length delimited. Does not implicitly {@link caffe.PythonParameter.verify|verify} messages.
         * @param message PythonParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IPythonParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PythonParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PythonParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.PythonParameter;

        /**
         * Decodes a PythonParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PythonParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.PythonParameter;

        /**
         * Verifies a PythonParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PythonParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PythonParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.PythonParameter;

        /**
         * Creates a plain object from a PythonParameter message. Also converts values to other types if specified.
         * @param message PythonParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.PythonParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PythonParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RecurrentParameter. */
    interface IRecurrentParameter {

        /** RecurrentParameter numOutput */
        numOutput?: number;

        /** RecurrentParameter weightFiller */
        weightFiller?: caffe.IFillerParameter;

        /** RecurrentParameter biasFiller */
        biasFiller?: caffe.IFillerParameter;

        /** RecurrentParameter debugInfo */
        debugInfo?: boolean;

        /** RecurrentParameter exposeHidden */
        exposeHidden?: boolean;
    }

    /** Represents a RecurrentParameter. */
    class RecurrentParameter {

        /**
         * Constructs a new RecurrentParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IRecurrentParameter);

        /** RecurrentParameter numOutput. */
        public numOutput: number;

        /** RecurrentParameter weightFiller. */
        public weightFiller?: (caffe.IFillerParameter|null);

        /** RecurrentParameter biasFiller. */
        public biasFiller?: (caffe.IFillerParameter|null);

        /** RecurrentParameter debugInfo. */
        public debugInfo: boolean;

        /** RecurrentParameter exposeHidden. */
        public exposeHidden: boolean;

        /**
         * Creates a new RecurrentParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RecurrentParameter instance
         */
        public static create(properties?: caffe.IRecurrentParameter): caffe.RecurrentParameter;

        /**
         * Encodes the specified RecurrentParameter message. Does not implicitly {@link caffe.RecurrentParameter.verify|verify} messages.
         * @param message RecurrentParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IRecurrentParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RecurrentParameter message, length delimited. Does not implicitly {@link caffe.RecurrentParameter.verify|verify} messages.
         * @param message RecurrentParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IRecurrentParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RecurrentParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RecurrentParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.RecurrentParameter;

        /**
         * Decodes a RecurrentParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RecurrentParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.RecurrentParameter;

        /**
         * Verifies a RecurrentParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RecurrentParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RecurrentParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.RecurrentParameter;

        /**
         * Creates a plain object from a RecurrentParameter message. Also converts values to other types if specified.
         * @param message RecurrentParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.RecurrentParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RecurrentParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ReductionParameter. */
    interface IReductionParameter {

        /** ReductionParameter operation */
        operation?: caffe.ReductionParameter.ReductionOp;

        /** ReductionParameter axis */
        axis?: number;

        /** ReductionParameter coeff */
        coeff?: number;
    }

    /** Represents a ReductionParameter. */
    class ReductionParameter {

        /**
         * Constructs a new ReductionParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IReductionParameter);

        /** ReductionParameter operation. */
        public operation: caffe.ReductionParameter.ReductionOp;

        /** ReductionParameter axis. */
        public axis: number;

        /** ReductionParameter coeff. */
        public coeff: number;

        /**
         * Creates a new ReductionParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReductionParameter instance
         */
        public static create(properties?: caffe.IReductionParameter): caffe.ReductionParameter;

        /**
         * Encodes the specified ReductionParameter message. Does not implicitly {@link caffe.ReductionParameter.verify|verify} messages.
         * @param message ReductionParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IReductionParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReductionParameter message, length delimited. Does not implicitly {@link caffe.ReductionParameter.verify|verify} messages.
         * @param message ReductionParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IReductionParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReductionParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReductionParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ReductionParameter;

        /**
         * Decodes a ReductionParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReductionParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ReductionParameter;

        /**
         * Verifies a ReductionParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReductionParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReductionParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ReductionParameter;

        /**
         * Creates a plain object from a ReductionParameter message. Also converts values to other types if specified.
         * @param message ReductionParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ReductionParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReductionParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ReductionParameter {

        /** ReductionOp enum. */
        enum ReductionOp {
            SUM = 1,
            ASUM = 2,
            SUMSQ = 3,
            MEAN = 4
        }
    }

    /** Properties of a ReLUParameter. */
    interface IReLUParameter {

        /** ReLUParameter negativeSlope */
        negativeSlope?: number;

        /** ReLUParameter engine */
        engine?: caffe.ReLUParameter.Engine;
    }

    /** Represents a ReLUParameter. */
    class ReLUParameter {

        /**
         * Constructs a new ReLUParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IReLUParameter);

        /** ReLUParameter negativeSlope. */
        public negativeSlope: number;

        /** ReLUParameter engine. */
        public engine: caffe.ReLUParameter.Engine;

        /**
         * Creates a new ReLUParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReLUParameter instance
         */
        public static create(properties?: caffe.IReLUParameter): caffe.ReLUParameter;

        /**
         * Encodes the specified ReLUParameter message. Does not implicitly {@link caffe.ReLUParameter.verify|verify} messages.
         * @param message ReLUParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IReLUParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReLUParameter message, length delimited. Does not implicitly {@link caffe.ReLUParameter.verify|verify} messages.
         * @param message ReLUParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IReLUParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReLUParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReLUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ReLUParameter;

        /**
         * Decodes a ReLUParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReLUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ReLUParameter;

        /**
         * Verifies a ReLUParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReLUParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReLUParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ReLUParameter;

        /**
         * Creates a plain object from a ReLUParameter message. Also converts values to other types if specified.
         * @param message ReLUParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ReLUParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReLUParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ReLUParameter {

        /** Engine enum. */
        enum Engine {
            DEFAULT = 0,
            CAFFE = 1,
            CUDNN = 2
        }
    }

    /** Properties of a ReshapeParameter. */
    interface IReshapeParameter {

        /** ReshapeParameter shape */
        shape?: caffe.IBlobShape;

        /** ReshapeParameter axis */
        axis?: number;

        /** ReshapeParameter numAxes */
        numAxes?: number;
    }

    /** Represents a ReshapeParameter. */
    class ReshapeParameter {

        /**
         * Constructs a new ReshapeParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IReshapeParameter);

        /** ReshapeParameter shape. */
        public shape?: (caffe.IBlobShape|null);

        /** ReshapeParameter axis. */
        public axis: number;

        /** ReshapeParameter numAxes. */
        public numAxes: number;

        /**
         * Creates a new ReshapeParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReshapeParameter instance
         */
        public static create(properties?: caffe.IReshapeParameter): caffe.ReshapeParameter;

        /**
         * Encodes the specified ReshapeParameter message. Does not implicitly {@link caffe.ReshapeParameter.verify|verify} messages.
         * @param message ReshapeParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IReshapeParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReshapeParameter message, length delimited. Does not implicitly {@link caffe.ReshapeParameter.verify|verify} messages.
         * @param message ReshapeParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IReshapeParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReshapeParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReshapeParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ReshapeParameter;

        /**
         * Decodes a ReshapeParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReshapeParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ReshapeParameter;

        /**
         * Verifies a ReshapeParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReshapeParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReshapeParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ReshapeParameter;

        /**
         * Creates a plain object from a ReshapeParameter message. Also converts values to other types if specified.
         * @param message ReshapeParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ReshapeParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReshapeParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ScaleParameter. */
    interface IScaleParameter {

        /** ScaleParameter axis */
        axis?: number;

        /** ScaleParameter numAxes */
        numAxes?: number;

        /** ScaleParameter filler */
        filler?: caffe.IFillerParameter;

        /** ScaleParameter biasTerm */
        biasTerm?: boolean;

        /** ScaleParameter biasFiller */
        biasFiller?: caffe.IFillerParameter;
    }

    /** Represents a ScaleParameter. */
    class ScaleParameter {

        /**
         * Constructs a new ScaleParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IScaleParameter);

        /** ScaleParameter axis. */
        public axis: number;

        /** ScaleParameter numAxes. */
        public numAxes: number;

        /** ScaleParameter filler. */
        public filler?: (caffe.IFillerParameter|null);

        /** ScaleParameter biasTerm. */
        public biasTerm: boolean;

        /** ScaleParameter biasFiller. */
        public biasFiller?: (caffe.IFillerParameter|null);

        /**
         * Creates a new ScaleParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ScaleParameter instance
         */
        public static create(properties?: caffe.IScaleParameter): caffe.ScaleParameter;

        /**
         * Encodes the specified ScaleParameter message. Does not implicitly {@link caffe.ScaleParameter.verify|verify} messages.
         * @param message ScaleParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IScaleParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ScaleParameter message, length delimited. Does not implicitly {@link caffe.ScaleParameter.verify|verify} messages.
         * @param message ScaleParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IScaleParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ScaleParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ScaleParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ScaleParameter;

        /**
         * Decodes a ScaleParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ScaleParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ScaleParameter;

        /**
         * Verifies a ScaleParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ScaleParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ScaleParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ScaleParameter;

        /**
         * Creates a plain object from a ScaleParameter message. Also converts values to other types if specified.
         * @param message ScaleParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ScaleParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ScaleParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SigmoidParameter. */
    interface ISigmoidParameter {

        /** SigmoidParameter engine */
        engine?: caffe.SigmoidParameter.Engine;
    }

    /** Represents a SigmoidParameter. */
    class SigmoidParameter {

        /**
         * Constructs a new SigmoidParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ISigmoidParameter);

        /** SigmoidParameter engine. */
        public engine: caffe.SigmoidParameter.Engine;

        /**
         * Creates a new SigmoidParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SigmoidParameter instance
         */
        public static create(properties?: caffe.ISigmoidParameter): caffe.SigmoidParameter;

        /**
         * Encodes the specified SigmoidParameter message. Does not implicitly {@link caffe.SigmoidParameter.verify|verify} messages.
         * @param message SigmoidParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ISigmoidParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SigmoidParameter message, length delimited. Does not implicitly {@link caffe.SigmoidParameter.verify|verify} messages.
         * @param message SigmoidParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ISigmoidParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SigmoidParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SigmoidParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.SigmoidParameter;

        /**
         * Decodes a SigmoidParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SigmoidParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.SigmoidParameter;

        /**
         * Verifies a SigmoidParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SigmoidParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SigmoidParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.SigmoidParameter;

        /**
         * Creates a plain object from a SigmoidParameter message. Also converts values to other types if specified.
         * @param message SigmoidParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.SigmoidParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SigmoidParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace SigmoidParameter {

        /** Engine enum. */
        enum Engine {
            DEFAULT = 0,
            CAFFE = 1,
            CUDNN = 2
        }
    }

    /** Properties of a SliceParameter. */
    interface ISliceParameter {

        /** SliceParameter axis */
        axis?: number;

        /** SliceParameter slicePoint */
        slicePoint?: number[];

        /** SliceParameter sliceDim */
        sliceDim?: number;
    }

    /** Represents a SliceParameter. */
    class SliceParameter {

        /**
         * Constructs a new SliceParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ISliceParameter);

        /** SliceParameter axis. */
        public axis: number;

        /** SliceParameter slicePoint. */
        public slicePoint: number[];

        /** SliceParameter sliceDim. */
        public sliceDim: number;

        /**
         * Creates a new SliceParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SliceParameter instance
         */
        public static create(properties?: caffe.ISliceParameter): caffe.SliceParameter;

        /**
         * Encodes the specified SliceParameter message. Does not implicitly {@link caffe.SliceParameter.verify|verify} messages.
         * @param message SliceParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ISliceParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SliceParameter message, length delimited. Does not implicitly {@link caffe.SliceParameter.verify|verify} messages.
         * @param message SliceParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ISliceParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SliceParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SliceParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.SliceParameter;

        /**
         * Decodes a SliceParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SliceParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.SliceParameter;

        /**
         * Verifies a SliceParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SliceParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SliceParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.SliceParameter;

        /**
         * Creates a plain object from a SliceParameter message. Also converts values to other types if specified.
         * @param message SliceParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.SliceParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SliceParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SoftmaxParameter. */
    interface ISoftmaxParameter {

        /** SoftmaxParameter engine */
        engine?: caffe.SoftmaxParameter.Engine;

        /** SoftmaxParameter axis */
        axis?: number;
    }

    /** Represents a SoftmaxParameter. */
    class SoftmaxParameter {

        /**
         * Constructs a new SoftmaxParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ISoftmaxParameter);

        /** SoftmaxParameter engine. */
        public engine: caffe.SoftmaxParameter.Engine;

        /** SoftmaxParameter axis. */
        public axis: number;

        /**
         * Creates a new SoftmaxParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SoftmaxParameter instance
         */
        public static create(properties?: caffe.ISoftmaxParameter): caffe.SoftmaxParameter;

        /**
         * Encodes the specified SoftmaxParameter message. Does not implicitly {@link caffe.SoftmaxParameter.verify|verify} messages.
         * @param message SoftmaxParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ISoftmaxParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SoftmaxParameter message, length delimited. Does not implicitly {@link caffe.SoftmaxParameter.verify|verify} messages.
         * @param message SoftmaxParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ISoftmaxParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SoftmaxParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SoftmaxParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.SoftmaxParameter;

        /**
         * Decodes a SoftmaxParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SoftmaxParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.SoftmaxParameter;

        /**
         * Verifies a SoftmaxParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SoftmaxParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SoftmaxParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.SoftmaxParameter;

        /**
         * Creates a plain object from a SoftmaxParameter message. Also converts values to other types if specified.
         * @param message SoftmaxParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.SoftmaxParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SoftmaxParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace SoftmaxParameter {

        /** Engine enum. */
        enum Engine {
            DEFAULT = 0,
            CAFFE = 1,
            CUDNN = 2
        }
    }

    /** Properties of a TanHParameter. */
    interface ITanHParameter {

        /** TanHParameter engine */
        engine?: caffe.TanHParameter.Engine;
    }

    /** Represents a TanHParameter. */
    class TanHParameter {

        /**
         * Constructs a new TanHParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ITanHParameter);

        /** TanHParameter engine. */
        public engine: caffe.TanHParameter.Engine;

        /**
         * Creates a new TanHParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TanHParameter instance
         */
        public static create(properties?: caffe.ITanHParameter): caffe.TanHParameter;

        /**
         * Encodes the specified TanHParameter message. Does not implicitly {@link caffe.TanHParameter.verify|verify} messages.
         * @param message TanHParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ITanHParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TanHParameter message, length delimited. Does not implicitly {@link caffe.TanHParameter.verify|verify} messages.
         * @param message TanHParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ITanHParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TanHParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TanHParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.TanHParameter;

        /**
         * Decodes a TanHParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TanHParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.TanHParameter;

        /**
         * Verifies a TanHParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TanHParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TanHParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.TanHParameter;

        /**
         * Creates a plain object from a TanHParameter message. Also converts values to other types if specified.
         * @param message TanHParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.TanHParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TanHParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace TanHParameter {

        /** Engine enum. */
        enum Engine {
            DEFAULT = 0,
            CAFFE = 1,
            CUDNN = 2
        }
    }

    /** Properties of a TileParameter. */
    interface ITileParameter {

        /** TileParameter axis */
        axis?: number;

        /** TileParameter tiles */
        tiles?: number;
    }

    /** Represents a TileParameter. */
    class TileParameter {

        /**
         * Constructs a new TileParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ITileParameter);

        /** TileParameter axis. */
        public axis: number;

        /** TileParameter tiles. */
        public tiles: number;

        /**
         * Creates a new TileParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TileParameter instance
         */
        public static create(properties?: caffe.ITileParameter): caffe.TileParameter;

        /**
         * Encodes the specified TileParameter message. Does not implicitly {@link caffe.TileParameter.verify|verify} messages.
         * @param message TileParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ITileParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TileParameter message, length delimited. Does not implicitly {@link caffe.TileParameter.verify|verify} messages.
         * @param message TileParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ITileParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TileParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TileParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.TileParameter;

        /**
         * Decodes a TileParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TileParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.TileParameter;

        /**
         * Verifies a TileParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TileParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TileParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.TileParameter;

        /**
         * Creates a plain object from a TileParameter message. Also converts values to other types if specified.
         * @param message TileParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.TileParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TileParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ThresholdParameter. */
    interface IThresholdParameter {

        /** ThresholdParameter threshold */
        threshold?: number;
    }

    /** Represents a ThresholdParameter. */
    class ThresholdParameter {

        /**
         * Constructs a new ThresholdParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IThresholdParameter);

        /** ThresholdParameter threshold. */
        public threshold: number;

        /**
         * Creates a new ThresholdParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ThresholdParameter instance
         */
        public static create(properties?: caffe.IThresholdParameter): caffe.ThresholdParameter;

        /**
         * Encodes the specified ThresholdParameter message. Does not implicitly {@link caffe.ThresholdParameter.verify|verify} messages.
         * @param message ThresholdParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IThresholdParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ThresholdParameter message, length delimited. Does not implicitly {@link caffe.ThresholdParameter.verify|verify} messages.
         * @param message ThresholdParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IThresholdParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ThresholdParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ThresholdParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.ThresholdParameter;

        /**
         * Decodes a ThresholdParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ThresholdParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.ThresholdParameter;

        /**
         * Verifies a ThresholdParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ThresholdParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ThresholdParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.ThresholdParameter;

        /**
         * Creates a plain object from a ThresholdParameter message. Also converts values to other types if specified.
         * @param message ThresholdParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.ThresholdParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ThresholdParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a WindowDataParameter. */
    interface IWindowDataParameter {

        /** WindowDataParameter source */
        source?: string;

        /** WindowDataParameter scale */
        scale?: number;

        /** WindowDataParameter meanFile */
        meanFile?: string;

        /** WindowDataParameter batchSize */
        batchSize?: number;

        /** WindowDataParameter cropSize */
        cropSize?: number;

        /** WindowDataParameter mirror */
        mirror?: boolean;

        /** WindowDataParameter fgThreshold */
        fgThreshold?: number;

        /** WindowDataParameter bgThreshold */
        bgThreshold?: number;

        /** WindowDataParameter fgFraction */
        fgFraction?: number;

        /** WindowDataParameter contextPad */
        contextPad?: number;

        /** WindowDataParameter cropMode */
        cropMode?: string;

        /** WindowDataParameter cacheImages */
        cacheImages?: boolean;

        /** WindowDataParameter rootFolder */
        rootFolder?: string;
    }

    /** Represents a WindowDataParameter. */
    class WindowDataParameter {

        /**
         * Constructs a new WindowDataParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IWindowDataParameter);

        /** WindowDataParameter source. */
        public source: string;

        /** WindowDataParameter scale. */
        public scale: number;

        /** WindowDataParameter meanFile. */
        public meanFile: string;

        /** WindowDataParameter batchSize. */
        public batchSize: number;

        /** WindowDataParameter cropSize. */
        public cropSize: number;

        /** WindowDataParameter mirror. */
        public mirror: boolean;

        /** WindowDataParameter fgThreshold. */
        public fgThreshold: number;

        /** WindowDataParameter bgThreshold. */
        public bgThreshold: number;

        /** WindowDataParameter fgFraction. */
        public fgFraction: number;

        /** WindowDataParameter contextPad. */
        public contextPad: number;

        /** WindowDataParameter cropMode. */
        public cropMode: string;

        /** WindowDataParameter cacheImages. */
        public cacheImages: boolean;

        /** WindowDataParameter rootFolder. */
        public rootFolder: string;

        /**
         * Creates a new WindowDataParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns WindowDataParameter instance
         */
        public static create(properties?: caffe.IWindowDataParameter): caffe.WindowDataParameter;

        /**
         * Encodes the specified WindowDataParameter message. Does not implicitly {@link caffe.WindowDataParameter.verify|verify} messages.
         * @param message WindowDataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IWindowDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified WindowDataParameter message, length delimited. Does not implicitly {@link caffe.WindowDataParameter.verify|verify} messages.
         * @param message WindowDataParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IWindowDataParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a WindowDataParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns WindowDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.WindowDataParameter;

        /**
         * Decodes a WindowDataParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns WindowDataParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.WindowDataParameter;

        /**
         * Verifies a WindowDataParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a WindowDataParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns WindowDataParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.WindowDataParameter;

        /**
         * Creates a plain object from a WindowDataParameter message. Also converts values to other types if specified.
         * @param message WindowDataParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.WindowDataParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this WindowDataParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SPPParameter. */
    interface ISPPParameter {

        /** SPPParameter pyramidHeight */
        pyramidHeight?: number;

        /** SPPParameter pool */
        pool?: caffe.SPPParameter.PoolMethod;

        /** SPPParameter engine */
        engine?: caffe.SPPParameter.Engine;
    }

    /** Represents a SPPParameter. */
    class SPPParameter {

        /**
         * Constructs a new SPPParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.ISPPParameter);

        /** SPPParameter pyramidHeight. */
        public pyramidHeight: number;

        /** SPPParameter pool. */
        public pool: caffe.SPPParameter.PoolMethod;

        /** SPPParameter engine. */
        public engine: caffe.SPPParameter.Engine;

        /**
         * Creates a new SPPParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SPPParameter instance
         */
        public static create(properties?: caffe.ISPPParameter): caffe.SPPParameter;

        /**
         * Encodes the specified SPPParameter message. Does not implicitly {@link caffe.SPPParameter.verify|verify} messages.
         * @param message SPPParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.ISPPParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SPPParameter message, length delimited. Does not implicitly {@link caffe.SPPParameter.verify|verify} messages.
         * @param message SPPParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.ISPPParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SPPParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SPPParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.SPPParameter;

        /**
         * Decodes a SPPParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SPPParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.SPPParameter;

        /**
         * Verifies a SPPParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SPPParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SPPParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.SPPParameter;

        /**
         * Creates a plain object from a SPPParameter message. Also converts values to other types if specified.
         * @param message SPPParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.SPPParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SPPParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace SPPParameter {

        /** PoolMethod enum. */
        enum PoolMethod {
            MAX = 0,
            AVE = 1,
            STOCHASTIC = 2
        }

        /** Engine enum. */
        enum Engine {
            DEFAULT = 0,
            CAFFE = 1,
            CUDNN = 2
        }
    }

    /** Properties of a V1LayerParameter. */
    interface IV1LayerParameter {

        /** V1LayerParameter bottom */
        bottom?: string[];

        /** V1LayerParameter top */
        top?: string[];

        /** V1LayerParameter name */
        name?: string;

        /** V1LayerParameter include */
        include?: caffe.INetStateRule[];

        /** V1LayerParameter exclude */
        exclude?: caffe.INetStateRule[];

        /** V1LayerParameter type */
        type?: caffe.V1LayerParameter.LayerType;

        /** V1LayerParameter blobs */
        blobs?: caffe.IBlobProto[];

        /** V1LayerParameter param */
        param?: string[];

        /** V1LayerParameter blobShareMode */
        blobShareMode?: caffe.V1LayerParameter.DimCheckMode[];

        /** V1LayerParameter blobsLr */
        blobsLr?: number[];

        /** V1LayerParameter weightDecay */
        weightDecay?: number[];

        /** V1LayerParameter lossWeight */
        lossWeight?: number[];

        /** V1LayerParameter accuracyParam */
        accuracyParam?: caffe.IAccuracyParameter;

        /** V1LayerParameter argmaxParam */
        argmaxParam?: caffe.IArgMaxParameter;

        /** V1LayerParameter concatParam */
        concatParam?: caffe.IConcatParameter;

        /** V1LayerParameter contrastiveLossParam */
        contrastiveLossParam?: caffe.IContrastiveLossParameter;

        /** V1LayerParameter convolutionParam */
        convolutionParam?: caffe.IConvolutionParameter;

        /** V1LayerParameter dataParam */
        dataParam?: caffe.IDataParameter;

        /** V1LayerParameter dropoutParam */
        dropoutParam?: caffe.IDropoutParameter;

        /** V1LayerParameter dummyDataParam */
        dummyDataParam?: caffe.IDummyDataParameter;

        /** V1LayerParameter eltwiseParam */
        eltwiseParam?: caffe.IEltwiseParameter;

        /** V1LayerParameter expParam */
        expParam?: caffe.IExpParameter;

        /** V1LayerParameter hdf5DataParam */
        hdf5DataParam?: caffe.IHDF5DataParameter;

        /** V1LayerParameter hdf5OutputParam */
        hdf5OutputParam?: caffe.IHDF5OutputParameter;

        /** V1LayerParameter hingeLossParam */
        hingeLossParam?: caffe.IHingeLossParameter;

        /** V1LayerParameter imageDataParam */
        imageDataParam?: caffe.IImageDataParameter;

        /** V1LayerParameter infogainLossParam */
        infogainLossParam?: caffe.IInfogainLossParameter;

        /** V1LayerParameter innerProductParam */
        innerProductParam?: caffe.IInnerProductParameter;

        /** V1LayerParameter lrnParam */
        lrnParam?: caffe.ILRNParameter;

        /** V1LayerParameter memoryDataParam */
        memoryDataParam?: caffe.IMemoryDataParameter;

        /** V1LayerParameter mvnParam */
        mvnParam?: caffe.IMVNParameter;

        /** V1LayerParameter poolingParam */
        poolingParam?: caffe.IPoolingParameter;

        /** V1LayerParameter powerParam */
        powerParam?: caffe.IPowerParameter;

        /** V1LayerParameter reluParam */
        reluParam?: caffe.IReLUParameter;

        /** V1LayerParameter sigmoidParam */
        sigmoidParam?: caffe.ISigmoidParameter;

        /** V1LayerParameter softmaxParam */
        softmaxParam?: caffe.ISoftmaxParameter;

        /** V1LayerParameter sliceParam */
        sliceParam?: caffe.ISliceParameter;

        /** V1LayerParameter tanhParam */
        tanhParam?: caffe.ITanHParameter;

        /** V1LayerParameter thresholdParam */
        thresholdParam?: caffe.IThresholdParameter;

        /** V1LayerParameter windowDataParam */
        windowDataParam?: caffe.IWindowDataParameter;

        /** V1LayerParameter transformParam */
        transformParam?: caffe.ITransformationParameter;

        /** V1LayerParameter lossParam */
        lossParam?: caffe.ILossParameter;

        /** V1LayerParameter layer */
        layer?: caffe.IV0LayerParameter;
    }

    /** Represents a V1LayerParameter. */
    class V1LayerParameter {

        /**
         * Constructs a new V1LayerParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IV1LayerParameter);

        /** V1LayerParameter bottom. */
        public bottom: string[];

        /** V1LayerParameter top. */
        public top: string[];

        /** V1LayerParameter name. */
        public name: string;

        /** V1LayerParameter include. */
        public include: caffe.INetStateRule[];

        /** V1LayerParameter exclude. */
        public exclude: caffe.INetStateRule[];

        /** V1LayerParameter type. */
        public type: caffe.V1LayerParameter.LayerType;

        /** V1LayerParameter blobs. */
        public blobs: caffe.IBlobProto[];

        /** V1LayerParameter param. */
        public param: string[];

        /** V1LayerParameter blobShareMode. */
        public blobShareMode: caffe.V1LayerParameter.DimCheckMode[];

        /** V1LayerParameter blobsLr. */
        public blobsLr: number[];

        /** V1LayerParameter weightDecay. */
        public weightDecay: number[];

        /** V1LayerParameter lossWeight. */
        public lossWeight: number[];

        /** V1LayerParameter accuracyParam. */
        public accuracyParam?: (caffe.IAccuracyParameter|null);

        /** V1LayerParameter argmaxParam. */
        public argmaxParam?: (caffe.IArgMaxParameter|null);

        /** V1LayerParameter concatParam. */
        public concatParam?: (caffe.IConcatParameter|null);

        /** V1LayerParameter contrastiveLossParam. */
        public contrastiveLossParam?: (caffe.IContrastiveLossParameter|null);

        /** V1LayerParameter convolutionParam. */
        public convolutionParam?: (caffe.IConvolutionParameter|null);

        /** V1LayerParameter dataParam. */
        public dataParam?: (caffe.IDataParameter|null);

        /** V1LayerParameter dropoutParam. */
        public dropoutParam?: (caffe.IDropoutParameter|null);

        /** V1LayerParameter dummyDataParam. */
        public dummyDataParam?: (caffe.IDummyDataParameter|null);

        /** V1LayerParameter eltwiseParam. */
        public eltwiseParam?: (caffe.IEltwiseParameter|null);

        /** V1LayerParameter expParam. */
        public expParam?: (caffe.IExpParameter|null);

        /** V1LayerParameter hdf5DataParam. */
        public hdf5DataParam?: (caffe.IHDF5DataParameter|null);

        /** V1LayerParameter hdf5OutputParam. */
        public hdf5OutputParam?: (caffe.IHDF5OutputParameter|null);

        /** V1LayerParameter hingeLossParam. */
        public hingeLossParam?: (caffe.IHingeLossParameter|null);

        /** V1LayerParameter imageDataParam. */
        public imageDataParam?: (caffe.IImageDataParameter|null);

        /** V1LayerParameter infogainLossParam. */
        public infogainLossParam?: (caffe.IInfogainLossParameter|null);

        /** V1LayerParameter innerProductParam. */
        public innerProductParam?: (caffe.IInnerProductParameter|null);

        /** V1LayerParameter lrnParam. */
        public lrnParam?: (caffe.ILRNParameter|null);

        /** V1LayerParameter memoryDataParam. */
        public memoryDataParam?: (caffe.IMemoryDataParameter|null);

        /** V1LayerParameter mvnParam. */
        public mvnParam?: (caffe.IMVNParameter|null);

        /** V1LayerParameter poolingParam. */
        public poolingParam?: (caffe.IPoolingParameter|null);

        /** V1LayerParameter powerParam. */
        public powerParam?: (caffe.IPowerParameter|null);

        /** V1LayerParameter reluParam. */
        public reluParam?: (caffe.IReLUParameter|null);

        /** V1LayerParameter sigmoidParam. */
        public sigmoidParam?: (caffe.ISigmoidParameter|null);

        /** V1LayerParameter softmaxParam. */
        public softmaxParam?: (caffe.ISoftmaxParameter|null);

        /** V1LayerParameter sliceParam. */
        public sliceParam?: (caffe.ISliceParameter|null);

        /** V1LayerParameter tanhParam. */
        public tanhParam?: (caffe.ITanHParameter|null);

        /** V1LayerParameter thresholdParam. */
        public thresholdParam?: (caffe.IThresholdParameter|null);

        /** V1LayerParameter windowDataParam. */
        public windowDataParam?: (caffe.IWindowDataParameter|null);

        /** V1LayerParameter transformParam. */
        public transformParam?: (caffe.ITransformationParameter|null);

        /** V1LayerParameter lossParam. */
        public lossParam?: (caffe.ILossParameter|null);

        /** V1LayerParameter layer. */
        public layer?: (caffe.IV0LayerParameter|null);

        /**
         * Creates a new V1LayerParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns V1LayerParameter instance
         */
        public static create(properties?: caffe.IV1LayerParameter): caffe.V1LayerParameter;

        /**
         * Encodes the specified V1LayerParameter message. Does not implicitly {@link caffe.V1LayerParameter.verify|verify} messages.
         * @param message V1LayerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IV1LayerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified V1LayerParameter message, length delimited. Does not implicitly {@link caffe.V1LayerParameter.verify|verify} messages.
         * @param message V1LayerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IV1LayerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a V1LayerParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns V1LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.V1LayerParameter;

        /**
         * Decodes a V1LayerParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns V1LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.V1LayerParameter;

        /**
         * Verifies a V1LayerParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a V1LayerParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns V1LayerParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.V1LayerParameter;

        /**
         * Creates a plain object from a V1LayerParameter message. Also converts values to other types if specified.
         * @param message V1LayerParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.V1LayerParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this V1LayerParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace V1LayerParameter {

        /** LayerType enum. */
        enum LayerType {
            NONE = 0,
            ABSVAL = 35,
            ACCURACY = 1,
            ARGMAX = 30,
            BNLL = 2,
            CONCAT = 3,
            CONTRASTIVE_LOSS = 37,
            CONVOLUTION = 4,
            DATA = 5,
            DECONVOLUTION = 39,
            DROPOUT = 6,
            DUMMY_DATA = 32,
            EUCLIDEAN_LOSS = 7,
            ELTWISE = 25,
            EXP = 38,
            FLATTEN = 8,
            HDF5_DATA = 9,
            HDF5_OUTPUT = 10,
            HINGE_LOSS = 28,
            IM2COL = 11,
            IMAGE_DATA = 12,
            INFOGAIN_LOSS = 13,
            INNER_PRODUCT = 14,
            LRN = 15,
            MEMORY_DATA = 29,
            MULTINOMIAL_LOGISTIC_LOSS = 16,
            MVN = 34,
            POOLING = 17,
            POWER = 26,
            RELU = 18,
            SIGMOID = 19,
            SIGMOID_CROSS_ENTROPY_LOSS = 27,
            SILENCE = 36,
            SOFTMAX = 20,
            SOFTMAX_LOSS = 21,
            SPLIT = 22,
            SLICE = 33,
            TANH = 23,
            WINDOW_DATA = 24,
            THRESHOLD = 31
        }

        /** DimCheckMode enum. */
        enum DimCheckMode {
            STRICT = 0,
            PERMISSIVE = 1
        }
    }

    /** Properties of a V0LayerParameter. */
    interface IV0LayerParameter {

        /** V0LayerParameter name */
        name?: string;

        /** V0LayerParameter type */
        type?: string;

        /** V0LayerParameter numOutput */
        numOutput?: number;

        /** V0LayerParameter biasterm */
        biasterm?: boolean;

        /** V0LayerParameter weightFiller */
        weightFiller?: caffe.IFillerParameter;

        /** V0LayerParameter biasFiller */
        biasFiller?: caffe.IFillerParameter;

        /** V0LayerParameter pad */
        pad?: number;

        /** V0LayerParameter kernelsize */
        kernelsize?: number;

        /** V0LayerParameter group */
        group?: number;

        /** V0LayerParameter stride */
        stride?: number;

        /** V0LayerParameter pool */
        pool?: caffe.V0LayerParameter.PoolMethod;

        /** V0LayerParameter dropoutRatio */
        dropoutRatio?: number;

        /** V0LayerParameter localSize */
        localSize?: number;

        /** V0LayerParameter alpha */
        alpha?: number;

        /** V0LayerParameter beta */
        beta?: number;

        /** V0LayerParameter k */
        k?: number;

        /** V0LayerParameter source */
        source?: string;

        /** V0LayerParameter scale */
        scale?: number;

        /** V0LayerParameter meanfile */
        meanfile?: string;

        /** V0LayerParameter batchsize */
        batchsize?: number;

        /** V0LayerParameter cropsize */
        cropsize?: number;

        /** V0LayerParameter mirror */
        mirror?: boolean;

        /** V0LayerParameter blobs */
        blobs?: caffe.IBlobProto[];

        /** V0LayerParameter blobsLr */
        blobsLr?: number[];

        /** V0LayerParameter weightDecay */
        weightDecay?: number[];

        /** V0LayerParameter randSkip */
        randSkip?: number;

        /** V0LayerParameter detFgThreshold */
        detFgThreshold?: number;

        /** V0LayerParameter detBgThreshold */
        detBgThreshold?: number;

        /** V0LayerParameter detFgFraction */
        detFgFraction?: number;

        /** V0LayerParameter detContextPad */
        detContextPad?: number;

        /** V0LayerParameter detCropMode */
        detCropMode?: string;

        /** V0LayerParameter newNum */
        newNum?: number;

        /** V0LayerParameter newChannels */
        newChannels?: number;

        /** V0LayerParameter newHeight */
        newHeight?: number;

        /** V0LayerParameter newWidth */
        newWidth?: number;

        /** V0LayerParameter shuffleImages */
        shuffleImages?: boolean;

        /** V0LayerParameter concatDim */
        concatDim?: number;

        /** V0LayerParameter hdf5OutputParam */
        hdf5OutputParam?: caffe.IHDF5OutputParameter;
    }

    /** Represents a V0LayerParameter. */
    class V0LayerParameter {

        /**
         * Constructs a new V0LayerParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IV0LayerParameter);

        /** V0LayerParameter name. */
        public name: string;

        /** V0LayerParameter type. */
        public type: string;

        /** V0LayerParameter numOutput. */
        public numOutput: number;

        /** V0LayerParameter biasterm. */
        public biasterm: boolean;

        /** V0LayerParameter weightFiller. */
        public weightFiller?: (caffe.IFillerParameter|null);

        /** V0LayerParameter biasFiller. */
        public biasFiller?: (caffe.IFillerParameter|null);

        /** V0LayerParameter pad. */
        public pad: number;

        /** V0LayerParameter kernelsize. */
        public kernelsize: number;

        /** V0LayerParameter group. */
        public group: number;

        /** V0LayerParameter stride. */
        public stride: number;

        /** V0LayerParameter pool. */
        public pool: caffe.V0LayerParameter.PoolMethod;

        /** V0LayerParameter dropoutRatio. */
        public dropoutRatio: number;

        /** V0LayerParameter localSize. */
        public localSize: number;

        /** V0LayerParameter alpha. */
        public alpha: number;

        /** V0LayerParameter beta. */
        public beta: number;

        /** V0LayerParameter k. */
        public k: number;

        /** V0LayerParameter source. */
        public source: string;

        /** V0LayerParameter scale. */
        public scale: number;

        /** V0LayerParameter meanfile. */
        public meanfile: string;

        /** V0LayerParameter batchsize. */
        public batchsize: number;

        /** V0LayerParameter cropsize. */
        public cropsize: number;

        /** V0LayerParameter mirror. */
        public mirror: boolean;

        /** V0LayerParameter blobs. */
        public blobs: caffe.IBlobProto[];

        /** V0LayerParameter blobsLr. */
        public blobsLr: number[];

        /** V0LayerParameter weightDecay. */
        public weightDecay: number[];

        /** V0LayerParameter randSkip. */
        public randSkip: number;

        /** V0LayerParameter detFgThreshold. */
        public detFgThreshold: number;

        /** V0LayerParameter detBgThreshold. */
        public detBgThreshold: number;

        /** V0LayerParameter detFgFraction. */
        public detFgFraction: number;

        /** V0LayerParameter detContextPad. */
        public detContextPad: number;

        /** V0LayerParameter detCropMode. */
        public detCropMode: string;

        /** V0LayerParameter newNum. */
        public newNum: number;

        /** V0LayerParameter newChannels. */
        public newChannels: number;

        /** V0LayerParameter newHeight. */
        public newHeight: number;

        /** V0LayerParameter newWidth. */
        public newWidth: number;

        /** V0LayerParameter shuffleImages. */
        public shuffleImages: boolean;

        /** V0LayerParameter concatDim. */
        public concatDim: number;

        /** V0LayerParameter hdf5OutputParam. */
        public hdf5OutputParam?: (caffe.IHDF5OutputParameter|null);

        /**
         * Creates a new V0LayerParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns V0LayerParameter instance
         */
        public static create(properties?: caffe.IV0LayerParameter): caffe.V0LayerParameter;

        /**
         * Encodes the specified V0LayerParameter message. Does not implicitly {@link caffe.V0LayerParameter.verify|verify} messages.
         * @param message V0LayerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IV0LayerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified V0LayerParameter message, length delimited. Does not implicitly {@link caffe.V0LayerParameter.verify|verify} messages.
         * @param message V0LayerParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IV0LayerParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a V0LayerParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns V0LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.V0LayerParameter;

        /**
         * Decodes a V0LayerParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns V0LayerParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.V0LayerParameter;

        /**
         * Verifies a V0LayerParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a V0LayerParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns V0LayerParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.V0LayerParameter;

        /**
         * Creates a plain object from a V0LayerParameter message. Also converts values to other types if specified.
         * @param message V0LayerParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.V0LayerParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this V0LayerParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace V0LayerParameter {

        /** PoolMethod enum. */
        enum PoolMethod {
            MAX = 0,
            AVE = 1,
            STOCHASTIC = 2
        }
    }

    /** Properties of a PReLUParameter. */
    interface IPReLUParameter {

        /** PReLUParameter filler */
        filler?: caffe.IFillerParameter;

        /** PReLUParameter channelShared */
        channelShared?: boolean;
    }

    /** Represents a PReLUParameter. */
    class PReLUParameter {

        /**
         * Constructs a new PReLUParameter.
         * @param [properties] Properties to set
         */
        constructor(properties?: caffe.IPReLUParameter);

        /** PReLUParameter filler. */
        public filler?: (caffe.IFillerParameter|null);

        /** PReLUParameter channelShared. */
        public channelShared: boolean;

        /**
         * Creates a new PReLUParameter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PReLUParameter instance
         */
        public static create(properties?: caffe.IPReLUParameter): caffe.PReLUParameter;

        /**
         * Encodes the specified PReLUParameter message. Does not implicitly {@link caffe.PReLUParameter.verify|verify} messages.
         * @param message PReLUParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: caffe.IPReLUParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PReLUParameter message, length delimited. Does not implicitly {@link caffe.PReLUParameter.verify|verify} messages.
         * @param message PReLUParameter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: caffe.IPReLUParameter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PReLUParameter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PReLUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): caffe.PReLUParameter;

        /**
         * Decodes a PReLUParameter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PReLUParameter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): caffe.PReLUParameter;

        /**
         * Verifies a PReLUParameter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PReLUParameter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PReLUParameter
         */
        public static fromObject(object: { [k: string]: any }): caffe.PReLUParameter;

        /**
         * Creates a plain object from a PReLUParameter message. Also converts values to other types if specified.
         * @param message PReLUParameter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: caffe.PReLUParameter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PReLUParameter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}
