/*
 * @Inc: https://www.hz-xg.com/
 * @Author: fegq
 * @Descripttion: 
 * @version: 
 * @Date: 2020-11-19 13:22:01
 * @LastEditors: fegq
 * @LastEditTime: 2020-12-28 14:08:06
 */
function BubbleAnimate (box, pics, delay, num) {
    let init = setInterval(initBubble, delay.init);
    let clear = setInterval(checkBubble, delay.check);

    function initBubble() {
        let img = document.createElement('img');
        let imgLeft = Math.ceil(Math.random()*700);
        img.src = pics[7];
        img.className = 'bubble-img';
        img.style.left = imgLeft + 'px';
        box.appendChild(img);
    }

    function generatorImgIndex(pics) {
        let imgIndex = Math.floor(Math.random() * pics.length);
        let imgSrc = pics[imgIndex];
        return imgSrc;
    }

    function checkBubble () {
        let imgs = document.querySelectorAll('.bubble-img');
        if (imgs.length >= num) {
            clearBubble();
        }
    }

    function clearBubble() {
        let imgs = $('.bubble-img');
        imgs.each(function (i, elem) {
            if (elem.offsetTop <= 0) {
                box.removeChild(elem);
            }
        });
    }

    window.onscroll = function () {
        let scrollTop = document.documentElement.scrollTop;
        if (scrollTop > 850) {
            clearInterval(init);
            clearInterval(clear);
        }
    }

}