/*
 * @Autor: MarkGuan
 * @Date: 2021-12-22 17:53:53
 * @LastEditors: MarkGuan
 * @LastEditTime: 2023-06-10 20:03:23
 * @Description: This a home javascript.
 */
let siteTitle = gjs.dom(".site-title");
let counts = gjs.domAll(".count");
let content = gjs.dom(".demo-content");
let search = gjs.dom(".demo-content-search");
let count = gjs.dom("#count");
let navLis = gjs.domAll(".demo-nav-content li");
let contents = gjs.domAll(".demo-content-item");
let contentItem = gjs.domAll(".demo-content-item-ls");
let searchContent = gjs.dom(".demo-item-search");
let host = location.origin + location.pathname;
let origin =
  host.indexOf("localhost") > -1 || host.indexOf("127.0.0.1") > -1
    ? "cn"
    : host.indexOf("guanqi.xyz") > -1
    ? "xyz"
    : "cc";
let originUrls = {
  cn: "guanqi.cn",
  xyz: "guanqi.xyz",
  cc: "xqgj.cc",
};

// 到顶部
let goTopBtn = gjs.dom(".demo-go-top");
let showNav = gjs.dom(".demo-show-nav");
let demoNav = gjs.dom(".demo-nav");
let navExit = gjs.dom(".demo-nav-exit");

// 版权日期
let year = gjs.gId("year");
year.innerText = new Date().getFullYear();

// 搜索事件
gjs.addEvent(search, "input", searchDemo, false);

// 获取数据
getList();

function getList(keyword) {
  gjs.httpSimple("get", host + "/assets/mock/list.min.json", null, function (res) {
    if (res.code === 200) {
      let data = res.data;
      document.title = data.name + "- 探索新技术，展望未来云";
      siteTitle.innerText = data.name;
      let list = data.list;
      if (keyword) {
        let searchArr = [];
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (item.name.indexOf(keyword) > -1) {
            searchArr.push(item);
          }
        }
        list = searchArr;
      }
      showData(list, keyword);
    } else {
      let list = [];
      showData(list);
    }
  });
}

// 显示搜索框
function searchDemo(e) {
  let keyword = e.target.value;
  if (keyword == "") {
    for (let i = 0; i < contents.length; i++) {
      contents[i].style.display = "block";
    }
    searchContent.style.display = "none";
  } else {
    for (let i = 0; i < contents.length; i++) {
      contents[i].style.display = "none";
    }
    searchContent.style.display = "block";
    keyword = keyword.toLowerCase();
    getList(keyword);
  }
}

// 显示数据
function showData(list, keyword) {
  let contentItem = gjs.domAll(".demo-content-item-ls"),
    searchCount;
  if (keyword) {
    contentItem = gjs.dom(".demo-item-search .demo-content-item-ls");
    searchCount = gjs.gId("search-count");
    contentItem.innerHTML = "";
  }
  for (let i = 0; i < list.length; i++) {
    const element = list[i];
    let cIndex = element.cid.toString().split("")[0] - 1;
    let tags = element.tags.split(",").join(", ");
    let href = element.href;
    if (href.indexOf("localhost") > -1) {
      element.href = href.replace(/localhost/gi, originUrls[origin]);
    }
    if (element.href.indexOf("http") > -1 || element.href.indexOf("https") > -1) {
      element.href = "./link/check/?target=" + encodeURIComponent(element.href);
    } else {
      element.href = host + element.href;
    }
    let str =
      '<li><a href="' +
      element.href +
      '" target="_blank" title=" ' +
      element.description +
      '"><div class="demo-item-img"><img class="lazyimg" src="./assets/img/holder.png" data-src="' +
      "./" +
      element.picUrl +
      '" alt="' +
      element.name +
      '"></div><div class="project-bot"><span class="project-title">' +
      element.name +
      '</span><span class="project-des">' +
      element.description +
      '</span><span class="project-tags"><i class="felab felab-tags"></i>' +
      tags +
      "</span></div></a></li>";
    if (keyword) {
      contentItem.innerHTML += str;
    } else {
      contentItem[cIndex].innerHTML += str;
    }
  }
  if (keyword) {
    searchCount.innerText = list.length;
  } else {
    for (let i = 0; i < contentItem.length; i++) {
      const element = contentItem[i];
      counts[i].innerText = element.childNodes.length;
    }
    count.innerText = list.length;
  }
  if (list && list.length) {
    lazyLoad();
  }
}

// 图片懒加载
function isVisible(element) {
  let clientHei =
    window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  let rect = element.getBoundingClientRect();
  return rect.top > 0 && rect.top < clientHei;
}

function lazyLoad() {
  let lazyImgs = gjs.domAll(".lazyimg");
  for (let i = 0; i < lazyImgs.length; i++) {
    let img = lazyImgs[i];
    let res = isVisible(img);
    if (res) {
      img.setAttribute("src", img.getAttribute("data-src"));
    }
  }
}

gjs.addEvent(content, "scroll", contentScroll, false);

/**
 * @author: MarkGuan
 * @description: nav scroll
 * @return {*}
 */
function contentScroll() {
  // 懒加载
  lazyImgs = gjs.domAll(".lazyimg");
  if (lazyImgs && lazyImgs.length) {
    lazyLoad();
  }
  // 到顶部
  let scrollTop = content.scrollTop;
  if (scrollTop > 280) {
    goTopBtn.style.display = "block";
  } else {
    goTopBtn.style.display = "none";
  }
  // 滚动高亮
  for (let i = 0; i < contents.length; i++) {
    const element = contents[i].offsetTop - 50;
    if (element <= scrollTop) {
      for (let j = 0; j < navLis.length; j++) {
        navLis[j].className = "";
      }
      navLis[i].className = "active";
    }
  }
}

// 点击到对应
goNavContent();

function goNavContent() {
  let list = Array.prototype.slice.call(navLis);
  list.forEach(function (k, i) {
    gjs.addEvent(k, "click", goCurrentNav, false);
    function goCurrentNav(e) {
      let currentIndex = e.currentTarget.dataset.index;
      let contentTop = 0;
      if (contents[currentIndex]) {
        contentTop = contents[currentIndex].offsetTop;
      }
      content.scrollTop = contentTop;
    }
  });
}

// 到顶部
$g.addEvent(goTopBtn, "click", goTop, false);

function goTop() {
  let timer = setInterval(function () {
    let top = content.scrollTop;
    let speed = 0;
    if (top > 0) {
      speed = Math.floor(-top / 6);
    }
    if (top == 0) {
      clearInterval(timer);
    }
    content.scrollTop = top + speed;
  }, 10);
}

// 手机版显示左侧导航
showSlideNav();
function showSlideNav() {
  if (showNav) {
    gjs.addEvent(showNav, "click", showSilderNav, false);
    function showSilderNav() {
      demoNav.style.left = 0;
    }
  }
  if (navExit) {
    gjs.addEvent(navExit, "click", hideSilderNav, false);

    function hideSilderNav() {
      demoNav.style.left = -100 + "%";
    }
  }
}

window.onresize = function () {
  let clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
  if (clientWidth >= 750) {
    demoNav.style.left = 0;
  } else {
    demoNav.style.left = -100 + "%";
    showSlideNav();
  }
};
