// function dec(enumerable: boolean) {
//   // tslint:disable-next-line:no-any
//   return (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//     descriptor.enumerable = enumerable;
//   };
//   // const fn = descriptor.value;
//   // // tslint:disable-next-line:no-any
//   // descriptor.value = (...args: any[]) => {
//   //   return fn(...args);
//   // };
//   // return descriptor;
// }

// /**
//  * a nikhil.
//  */
// class Nikhil {
//   /**
//    *
//    */
//   constructor() {}

//   @dec(false)
//   method(): void {
//     console.log('nothing');
//   }
// }

// function op() {}

import * as dl from './index';
console.log(dl);
