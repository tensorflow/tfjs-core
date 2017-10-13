---
layout: page
order: 2
---
# Getting the best performance

This guide is intended to help developers make applications using deeplearn.js
more performant.

## Chrome Developer Tools - Performance Tab

One of the most powerful tools for debugging your deeplearn.js application is
the performance tab in Chrome developer tools. There is much more information
on the details of the performance tab
[here](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/),
but we will focus on how to use it in a deeplearn.js application.

Below is a performance trace of one of the core demos. The two rows to pay
attention to are the "Main" thread and the "GPU" process:

![Chrome Developer Tools - Performance tab](devtools-performance.png "Chrome Developer Tools - Performance tab")

The "Main" thread shows browser activity on the main CPU UI thread. This is
where JavaScript is executed, and where page layout / some painting happens.

The "GPU" process shows the activity of the GPU process. For compute intensive
applications, we want this row to be solid green, which indicates we're maximally
utilizing the GPU. If we are constantly introducing interlocks between the CPU
and the GPU, the GPU process may look choppy as the GPU is waiting for more work
to be scheduled. There are exceptions to this rule, for example if there isn't a
lot of work to be done.


### Understanding CPU / GPU interlocks

The most common thing you'll see is a big "readPixels" call on the main thread.
This is the underlying WebGL call that downloads NDArrays from a WebGL texture
to the CPU.



## Memory leaks & math.scope

Preventing memory leaks in applications that may have an infinite loop
(for example, reading from the webcam and making a prediction) is critical for
performance.

When math operations are used, you should wrap them in a math.scope() function
closure as shown in the example below. The results of math operations in this
scope will get disposed at the end of the scope, unless they are the value
returned in the scope.

Two functions are passed to the function closure, `keep()` and `track()`.

`keep()` ensures that the NDArray passed to keep will not be cleaned up
automatically when the scope ends.

`track()` tracks any NDArrays that you may construct directly inside of a
scope. When the scope ends, any manually tracked `NDArray`s will get
cleaned up. Results of all `math.method()` functions, as well as results of
many other core library functions are automatically cleaned up, so you don't
have to manually track them.

```ts
const math = new NDArrayMathGPU();

let output;

math.scope((keep, track) => {
  // CORRECT: By default, math wont track NDArrays that are constructed
  // directly. You can call track() on the NDArray for it to get tracked and
  // cleaned up at the end of the scope.
  const a = track(Scalar.new(2));

  // INCORRECT: This is a texture leak!!
  // math doesn't know about b, so it can't track it. When the scope ends, the
  // GPU-resident NDArray will not get cleaned up, even though b goes out of
  // scope. Make sure you call track() on NDArrays you create.
  const b = Scalar.new(2);

  // CORRECT: By default, math tracks all outputs of math functions.
  const c = math.neg(math.exp(a));

  // CORRECT: d is tracked by the parent scope.
  const d = math.scope(() => {
    // CORRECT: e will get cleaned up when this inner scope ends.
    const e = track(Scalar.new(3));

    // CORRECT: The result of this math function is tracked. Since it is the
    // return value of this scope, it will not get cleaned up with this inner
    // scope. However, the result will be tracked automatically in the parent
    // scope.
    return math.elementWiseMul(e, e);
  });

  // CORRECT, BUT BE CAREFUL: The output of math.tanh will be tracked
  // automatically, however we can call keep() on it so that it will be kept
  // when the scope ends. That means if you are not careful about calling
  // output.dispose() some time later, you might introduce a texture memory
  // leak. A better way to do this would be to return this value as a return
  // value of a scope so that it gets tracked in a parent scope.
  output = keep(math.tanh(d));
});
```

> More technical details: When WebGL textures go out of scope in JavaScript,
they don't get cleaned up automatically by the browser's garbage collection
mechanism. This means when you are done with an NDArray that is GPU-resident,
it must manually be disposed some time later. If you forget to manually call
`ndarray.dispose()` when you are done with an NDArray, you will introduce
a texture memory leak, which will cause serious performance issues.
If you use `math.scope()`, any NDArrays created by `math.method()` and
any other method that returns the result through a scope will automatically
get cleaned up.


> If you want to do manual memory management and not use math.scope(), you can.
This is not recommended, but is useful for `NDArrayMathCPU` since CPU-resident
memory will get cleaned up automatically by the JavaScript garbage collector.

### TODO(nsthorat|smilkov): How to track down memory leaks

## Debug mode

