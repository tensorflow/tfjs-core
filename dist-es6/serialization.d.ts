export declare type ConfigDictValue = boolean | number | string | null | ConfigDictArray | ConfigDict;
export interface ConfigDict {
    [key: string]: ConfigDictValue;
}
export interface ConfigDictArray extends Array<ConfigDictValue> {
}
export declare type SerializableConstructor<T extends Serializable> = {
    new (...args: any[]): T;
    className: string;
    fromConfig: FromConfigMethod<T>;
};
export declare type FromConfigMethod<T extends Serializable> = (cls: SerializableConstructor<T>, config: ConfigDict) => T;
export declare abstract class Serializable {
    getClassName(): string;
    abstract getConfig(): ConfigDict;
    static fromConfig<T extends Serializable>(cls: SerializableConstructor<T>, config: ConfigDict): T;
}
export declare class SerializationMap {
    private static instance;
    classNameMap: {
        [className: string]: [SerializableConstructor<Serializable>, FromConfigMethod<Serializable>];
    };
    private constructor();
    static getMap(): SerializationMap;
    static register<T extends Serializable>(cls: SerializableConstructor<T>): void;
}
