/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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

import {assert} from './util';

export type ConfigDictValue =
    boolean|number|string|null|ConfigDictArray|ConfigDict;

export interface ConfigDict {
  [key: string]: ConfigDictValue;
}

export interface ConfigDictArray extends Array<ConfigDictValue> {}

/**
 * Type to represent the class-type of Serializable objects.
 *
 * Ie the class prototype with access to the constructor and any
 * static members/methods. Instance methods are not listed here.
 *
 * Source for this idea: https://stackoverflow.com/a/43607255
 */
export type TypedSerializableConstructor<T extends TypedSerializable<C>,
                                                   C extends ConfigDict> = {
  // tslint:disable-next-line:no-any
  new (...args: any[]): T; className: string;
  fromConfig: TypedFromConfigMethod<T, C>;
};

export type TypedFromConfigMethod<T extends TypedSerializable<C>,
                                            C extends ConfigDict> =
    (config: C) => T;

export interface Wrapper<T> {
  className: string;
  config: T;
}

export abstract class TypedSerializable<C extends ConfigDict> {
  /**
   * Return the class name for this class to use in serialization contexts.
   *
   * Generally speaking this will be the same thing that constructor.name
   * would have returned.  However, the class name needs to be robust
   * against minification for serialization/deserialization to work properly.
   *
   * There's also places such as initializers.VarianceScaling, where
   * implementation details between different languages led to different
   * class hierarchies and a non-leaf node is used for serialization purposes.
   */
  getClassName(): string {
    return (this.constructor as
            TypedSerializableConstructor<TypedSerializable<C>, C>)
        .className;
  }

  getWrapper(): Wrapper<C> {
    return {
      className: this.getClassName(),
      config: this.getConfig(),
    };
  }

  abstract getConfig(): C;
}

/**
 * Maps string keys to class constructors.
 *
 * Used during (de)serialization from the cross-language JSON format, which
 * requires the class name in the serialization format matches the class
 * names as used in Python, should it exist.
 */
export class SerializationMap {
  private static instance: SerializationMap;
  classNameMap: {
    [className: string]:
        [
          TypedSerializableConstructor<
              TypedSerializable<ConfigDict>, ConfigDict>,
          TypedFromConfigMethod<TypedSerializable<ConfigDict>, ConfigDict>
        ]
  };

  private constructor() {
    this.classNameMap = {};
  }

  /**
   * Returns the singleton instance of the map.
   */
  static getMap(): SerializationMap {
    if (SerializationMap.instance == null) {
      SerializationMap.instance = new SerializationMap();
    }
    return SerializationMap.instance;
  }

  /**
   * Registers the class as serializable.
   */
  static register<T extends TypedSerializable<C>, C extends ConfigDict>(
      cls: TypedSerializableConstructor<T, C>) {
    SerializationMap.getMap().classNameMap[cls.className] =
        [cls, cls.fromConfig];
  }
}

/**
 * Register a class with the serialization map of TensorFlow.js.
 *
 * This is often used for registering custom Layers, so they can be
 * serialized and deserialized.
 *
 * Example:
 *
 * ```js
 * class MyCustomLayer extends tf.layers.Layer {
 *   static className = 'MyCustomLayer';
 *
 *   constructor(config) {
 *     super(config);
 *   }
 * }
 * tf.serialization.registerClass(MyCustomLayer);
 * ```
 *
 * @param cls The class to be registered. It must have a public static member
 *   called `className` defined and the value must be a non-empty string.
 */
/** @doc {heading: 'Models', subheading: 'Serialization'} */
export function
registerClass<T extends TypedSerializable<C>, C extends ConfigDict>(
    cls: TypedSerializableConstructor<T, C>) {
  assert(
      cls.className != null,
      `Class being registered does not have the static className property ` +
          `defined.`);
  assert(
      typeof cls.className === 'string',
      `className is required to be a string, but got type ` +
          typeof cls.className);
  assert(
      cls.className.length > 0,
      `Class being registered has an empty-string as its className, which ` +
          `is disallowed.`);

  SerializationMap.register(cls);
}
