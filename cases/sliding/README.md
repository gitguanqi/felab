# 滑动模块验证案例

> 这是一个滑动模块验证案例。

## 使用方法

下面是使用方法介绍。

### 引入图片库

这个就是一个图片数组，里面存储你本地的图片，格式是`300*150`。

```js
// 验证图片库
//sliding你文件夹的名字
let picArrs = [
  '../sliding/images/v1.jpg',
  '../sliding/images/v2.jpg',
  '../sliding/images/v3.jpg',
  '../sliding/images/v4.jpg',
  '../sliding/images/v5.jpg',
  '../sliding/images/v6.jpg',
  '../sliding/images/v7.jpg',
  '../sliding/images/v8.jpg'
]
```

### 获取元素

这里包括一个验证成功后的处理方法，一个显示画布元素和一个提示。

```js
//成功以后方法
let succFn = function () {
  setTimeout(function () {
    let toUrl = 'https://github.com/gitguanqi/';
    window.location.href = toUrl;
  }, 1000)
}
//获取元素
let pic = document.querySelector('#pic');
let msg = document.querySelector('#msg');
```

### 初始化

这个就是引入js后初始化的方法。

```js
if (window.SlidingValidate) {
  window.SlidingValidate.init({
    el: pic,
    //验证成功
    onSuccess: function () {
      succFn()
    },
    //验证失败
    onFail: function () {
      msg.innerHTML = '';
    },
    imgLibs: picArrs
  })
}
```

## 获取验证图片

这个方法是用来获取符合格式的图片链接的。

```js
//获取验证码
console.log('验证码图片:', getRandomImgSrc());
function getRandomImgSrc () {
  return '//picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 1084)
}
function getRandomNumberByRange (start, end) {
  return Math.round(Math.random() * (end - start) + start)
}
```

## 特别感谢

特别感谢yeild， [本案例参考自jigsaw](https://github.com/yeild/jigsaw)

## 关注我

[我的Github](https://github.com/gitguanqi)
