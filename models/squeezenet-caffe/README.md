# SqueezeNet-Caffe model

This package contains a standalone SqueezeNet model using Caffe weights. For the standard SqueezeNet model with deeplearn.js weights checkout [the standard SqueezeNet model](https://github.com/PAIR-code/deeplearnjs/blob/master/models/squeezenet).

## Installation
You can use this as standalone es5 bundle like this:

```html
<script src="https://unpkg.com/deeplearn-squeezenet-caffe"></script>
```

Or you can install it via npm for use in a TypeScript / ES6 project.

```sh
npm install deeplearn-squeezenet-caffe --save-dev
```

## Usage

Check out [demo.html](https://github.com/PAIR-code/deeplearnjs/blob/master/models/squeezenet-caffe/demo.html)
for an example with ES5.

To run the demo, use the following:

```bash
cd models/squeezenet-caffe

npm run prep
npm run build

# Starts a webserver, navigate to localhost:8000/demo.html.
python -m SimpleHTTPServer
```
