/*
 * @Author: Mr.Mark  
 * @Date: 2019-09-04 11:14:57 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-09-05 12:53:45
 */
// 导航内容
let header = document.querySelector('header');
let navs = document.querySelectorAll('.nav>li');
let goTop = document.querySelector('.gotop');
let allSection = document.querySelectorAll('.section');
var len = allSection.length;
var n = 0;
// 导航切换
toggleNavs(navs, 'active');

function toggleNavs(navList, active) {
  for (let i = 0; i < navList.length; i++) {
    const element = navList[i];
    element.addEventListener('click', function (e) {
      for (let j = 0; j < navList.length; j++) {
        navList[j].className = '';
      }
      this.className = active;
    })
  }
  lazyLoad();
}
// 监听滚动，高亮侧边菜单
window.addEventListener('scroll', function () {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop >= 240) {
    header.className = 'header-fixed';
  } else {
    header.className = '';
  }
  if (scrollTop >= 500) {
    goTop.style.display = 'block';
  } else {
    goTop.style.display = 'none';
  }
})

// 点击到顶部
goTop.addEventListener('click', function () {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  let timer = setInterval(() => {
    let speed = 350;
    if (scrollTop > 0) {
      scrollTop -= speed;
      document.documentElement.scrollTop = scrollTop;
      document.body.scrollTop = scrollTop;
    } else {
      clearInterval(timer);
    }
  }, 50);
}, false);

// 图片懒加载
function lazyLoad() {
  var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  for (var i = n; i < len; i++) {
    if (allSection[i].offsetTop < (clientHeight + scrollTop) - 520) {
      let secImgs = allSection[i].children[1].children;
      for (let j = 0; j < secImgs.length; j++) {
        const element = secImgs[j].children[0];
        if (element.getAttribute('src') == './images/hodler.jpg') {
          element.src = element.getAttribute('data-src');
        }
      }
      n = i + 1;
    }
  }
}

window.onscroll = function () {
  setTimeout(function () {
    lazyLoad();
  }, 1000);
};