# tfjs-core的微信平台移植

作为TensorFlow.js生态系统的重要组成部分，本仓库托管的是TensorFlow.js核心API `@tensorflow/tfjs-core` ，
本代码库在官方 tfjs-core 库上增加了微信小程序平台的支持。具体的改进有：

* 采用微信小程序API实现全局的Fetch API
* 使用微信小程序的本地文件系统实现了模型的本地缓存

## 构建tf.js

1. 构建tf-core.js

```
yarn build-npm
```

生成的js库位于dist目录下。

2. 将生成的js库复制到tfjs项目的 `node_modules` 目录下：

```
cp dist/tf-core.* $TFJS/node_modules/\@tensorflow/tfjs-core/dist/
```

3. 进入tfjs代码库，构建tf.js

```
cd $TFJS
yarn build-npm
```

通常在微信小程序中包含tf.min.js即可。

## 微信小程序示例

请参考 https://github.com/mogoweb/wechat-tfjs-examples

## 更多信息

1. [当微信小程序遇上TensorFlow - 本地缓存模型](https://mp.weixin.qq.com/s?__biz=MzI3NTQyMzEzNQ==&mid=2247485318&idx=1&sn=f554836ab024174d5dc0d25f80993c42&chksm=eb044d76dc73c460a681330d6baffc9649bba925abcccb0a236feb935f43dd316cb0dd62c9e5&token=1175979797&lang=zh_CN#rd)
2. [当微信小程序遇上TensorFlow - tensorflow.js篇](https://mp.weixin.qq.com/s?__biz=MzI3NTQyMzEzNQ==&mid=2247485254&idx=1&sn=d93e5a4a0903708bfac3f9ba89d6a43a&chksm=eb044db6dc73c4a013f1182f826367320240679052ac6764c9a2782522bb88a6979da082a700&token=1175979797&lang=zh_CN#rd)
3. [重磅好消息！TensorFlow开始支持微信小程序](https://mp.weixin.qq.com/s?__biz=MzI3NTQyMzEzNQ==&mid=2247485239&idx=1&sn=637003237d15be64662febab837edffb&chksm=eb044dc7dc73c4d1129f9454cd2fa9265ac7a3aa4575d7e02efd9c55c297b67299fe385c4ef3&token=2017984249&lang=zh_CN&scene=21#wechat_redirect)

## 个人微信公众号：云水木石

![logo](https://github.com/mogoweb/wechat-tfjs-core/raw/master/mp.jpeg)

