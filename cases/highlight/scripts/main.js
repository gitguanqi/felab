/*
 * @Author: Mr.Mark  
 * @Date: 2019-08-27 15:05:50 
 * @Last Modified by: Mr.Mark 
 * @Last Modified time: 2019-09-04 10:22:14
 */
// 滚动高亮
// 公用方法
// 获取dom
function dom (name) {
  return document.querySelector(name);
}
function domAll (name) {
  return document.querySelectorAll(name);
}
// 获取元素
let navList = domAll('.nav-list ul li a'); // 获取顶部菜单
let contentLi = domAll('.content .floor'); // 每个楼层
let contentTitle = domAll('.content>div>h2'); // 每个楼层的大标题
let contentTitleSmall = domAll('.content>div>h3'); // 每个楼层的二级标题
let sider = dom('.sider'); // 侧边标题
let titleArr = domTree(contentLi);

//生成侧边标题内容
let domTrees = generatorTree(titleArr);
sider.innerHTML = domTrees;

// 获取侧边菜单标题
let siderLi = domAll('.sider>li .one'); // 获取一级标题
let titleArrs = domAll('.sider>li .two'); // 获取二级标题

// 获取标题树
function domTree(elem) {
  let domTree = [];
  for (let i = 0; i < elem.length; i++) {
    const element = elem[i];
    let titleElem = Array.prototype.slice.call(element.children, 0);
    domTree[i] = {
      oneTitle: '',
      twoTitle: []
    }
    for (let j = 0; j < titleElem.length; j++) {
      const elementTitle = titleElem[j];
      if (elementTitle.nodeName == 'H2') {
        domTree[i].oneTitle = elementTitle.innerText;
      }
      if (elementTitle.nodeName == 'H3') {
        domTree[i].twoTitle.push(elementTitle.innerText);
      }
    }
  }
  return domTree;
}

// 生成侧边标题内容
function generatorTree(titleArr) {
  var str = '';
  for (let i = 0; i < titleArr.length; i++) {
    str += '<li>';
    const element = titleArr[i];
    str += '<span class="title one">' + (i + 1) + '.' + element.oneTitle + '</span>';
    for (let j = 0; j < element.twoTitle.length; j++) {
      str += '<span class="title two">' + (i + 1) + '.' + (j + 1) + element.twoTitle[j] + '</span>';
    }
    str += '</li>';
  }
  return str;
}

// 切换菜单
toggleMenu(siderLi, 'title one', 'title one active', true, contentLi);
toggleMenu(navList, '', 'active', false);

for (let i = 0; i < navList.length; i++) {
  const element = navList[i];
  element.addEventListener('click', function (e) {
    for (let j = 0; j < navList.length; j++) {
      navList[j].className = '';
    }
    this.className = 'active';
  })
}

function toggleMenu (siderLi, normal, active, isScroll, contentLi) {
  for (let i = 0; i < siderLi.length; i++) {
    const element = siderLi[i];
    element.addEventListener('click', function () {
      if (isScroll) {
        let height = contentLi[i].offsetHeight;
        let totalHeight = height * i;
        document.documentElement.scrollTop = totalHeight;
        document.body.scrollTop = totalHeight;
      }
      for (let j = 0; j < siderLi.length; j++) {
        siderLi[j].classList = normal;
      }
      siderLi[i].classList = active;
    })
  }
}

// 监听滚动，高亮侧边菜单
window.addEventListener('scroll', function () {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  for (let i = 0; i < contentLi.length; i++) {
    const element = contentLi[i].offsetTop;
    if (element <= scrollTop) {
      for (let j = 0; j < siderLi.length; j++) {
        siderLi[j].classList = 'title one';
      }
      siderLi[i].classList = 'title one active';
      location.hash = siderLi[i].innerText;
    }
  }
  for (let k = 0; k < contentTitleSmall.length; k++) {
    const element = contentTitleSmall[k].offsetTop;
    let parentHeight = contentTitleSmall[k].parentElement.offsetHeight;
    let currentFloor = parseInt(scrollTop / parentHeight) + 1;
    let elementFloor = parseInt(titleArrs[k].innerText.slice(0, 1));
    if (currentFloor === elementFloor) {
      if (element <= scrollTop) {
        for (let l = 0; l < titleArrs.length; l++) {
          titleArrs[l].classList = 'title two';
        }
        titleArrs[k].classList = 'title two active';
      }
    } else {
      titleArrs[k].classList = 'title two';
    }
  }
})

// 动态计算sider高
let siderHeight = document.documentElement.clientHeight - 60 || document.body.clientHeight - 60;
sider.style.height = siderHeight + 'px';