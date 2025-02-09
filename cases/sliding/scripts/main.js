/*
 * @Author: Mr.Mark  
 * @Date: 2019-05-11 16:10:10 
 * @Last Modified by: Mr.Mark
 * @Last Modified time: 2020-03-22 18:10:36
 */

//成功以后访问的地址
let succFn = function () {
  setTimeout(function () {
    let toUrl = '/';
    window.location.href = toUrl;
  }, 1000)
}
// 验证图片库
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
let pic = document.querySelector('#pic');
let msg = document.querySelector('#msg');
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
//获取验证码
console.log('验证码图片:', getRandomImgSrc());

function getRandomImgSrc() {
  return '//picsum.photos/300/150/?image=' + getRandomNumberByRange(0, 1084)
}

function getRandomNumberByRange(start, end) {
  return Math.round(Math.random() * (end - start) + start)
}