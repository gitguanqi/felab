/** 
 * author: guanqi,
 * date:2019.2.20,
 * content: js
 */
document.body.style.overflow = 'hidden';
$g.eid('loadimg').style.display = 'block';
//获取数据
$g.getText('mock/list.json', function (res) {
  if (res.msg == 'get_succ') {
    showData(res.data);
    $g.eid('loadimg').style.display = 'none';
    document.body.style.overflow = 'auto';
  } else {
    errorData();
  }
});
//显示数据
function showData(data) {
  var listdata = data.list;
  var linkdata = data.link;
  var profile = data.profile;
  var site = data.site;
  //显示列表
  showList(listdata);
  //显示简介
  showDes(profile);
  //显示友链
  showLink(linkdata);
  //显示网页信息
  showSite(site);
}
//显示列表
function showList(listdata) {
  var projects = $g.eid('project');
  var cases = $g.eid('case');
  var mydata = {
    projects: [],
    cases: []
  };
  //分解列表
  if (listdata.length > 0) {
    for (var i = 0; i < listdata.length; i++) {
      var item = listdata[i];
      var type = item.type.split(',');
      if (type[0] == 'project') {
        item.type = type;
        mydata.projects.push(item);
      }
      if (type[0] == 'case') {
        item.type = type;
        mydata.cases.push(item);
      }
    }
    var pstr = '';
    var cstr = '';
    for (var i = 0; i < mydata.projects.length; i++) {
      var item = mydata.projects[i];
      pstr += '<li><i class="icon icon-t"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      projects.innerHTML = pstr;
    }
    for (var i = 0; i < mydata.cases.length; i++) {
      var item = mydata.cases[i];
      var type = item.type[1];
      var icon;
      if (type == 'html') {
        icon = 'icon-html'
      }
      if (type == 'css') {
        icon = 'icon-css'
      }
      if (type == 'js') {
        icon = 'icon-js'
      }
      cstr += '<li><i class="icon ' + icon + '"></i><a href="' + item.url + '?from=demo" target="_blank">【' + item.type[1] + '案例】' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      cases.innerHTML = cstr;
    }
  }
  //显示计数
  showCount(mydata);
}
//显示计数
function showCount(mydata) {
  $g.ecls('count')[0].innerText = mydata.projects.length;
  $g.ecls('count')[1].innerText = mydata.cases.length;
  $g.eid('mydoc').innerHTML = '<li><i class="icon icon-e"></i>项目精选(' + mydata.projects.length + ')</li><li><i class="icon icon-e"></i>案例精选(' + mydata.cases.length + ')</li>';
}
//显示简介
function showDes(data) {
  $g.ecls('about-img')[0].src = data.img;
  $g.ecls('about-img')[0].title = data.des;
  $g.ecls('about-des-content')[0].innerHTML = data.des;
}
//显示友链
function showLink(linkdata) {
  //分解友链
  if (linkdata.length > 0) {
    var linkstr = '';
    for (var i = 0; i < linkdata.length; i++) {
      linkstr += '<li><i class="icon icon-e"></i><a href="' + linkdata[i].url + '?from=demo" target="_blank">' + linkdata[i].name + '</a></li>'
    }
    $g.eid('mylink').innerHTML = linkstr;
  }
}
//显示网页信息
function showSite(site) {
  document.title = site.title || 'Demo';
  $g.eid('mytitle').innerText = site.title || 'Demo';
  $g.eid('myfoot').innerHTML = site.foot || '&copy;2019 <a href="/demo">Demo</a>';
  //分解菜单
  if (site.navs.length > 0) {
    var navstr = '';
    for (var i = 0; i < site.navs.length; i++) {
      navstr += '<li><a href="' + site.navs[i].url + '" target="' + (site.navs[i].name == 'Github' ? "_blank" : "_self") + '">' + site.navs[i].name + '</a></li>'
    }
    $g.eid('mynav').innerHTML = navstr;
    $g.eid('mynava').innerHTML = navstr;
    changeNav();
  }
}
//显示错误
function errorData() {
  $g.eid('project').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $g.eid('case').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $g.eid('mydes').innerHTML = '<p>暂无数据</p>'
  $g.eid('mylink').innerHTML = '<li><i class="icon icon-e"></i><a href="#nolink">暂无友链</a></li>';
}
//切换菜单
function changeNav() {
  var lis = $g.eall('.nav-index li');
  lis[0].className = 'active';
  new $g.Tab(lis, 'active');
}
var navwap = $g.eone('#navwap');
var mywapnav = $g.eone('#mywapnav');
var container = $g.eone('.container');
$g.addEvent(navwap, 'click', function (e) {
  if (mywapnav.className == 'wnav-index') {
    mywapnav.className = 'wnav-index fixed-nav';
    container.style.opacity = '0.88';
  }
}, false);
$g.addEvent(mywapnav, 'click', function () {
  return false;
}, false);
$g.addEvent(document, 'click', function (e) {
  if (e.target.className != 'wnav-index fixed-nav' && e.target.className != 'load-box' &&
    e.target.className != 'load' && e.target.className != 'rect1' &&
    e.target.className != 'rect2' && e.target.className != 'rect3' &&
    e.target.className != 'rect4' && e.target.className != 'rect5') {
    mywapnav.className = 'wnav-index';
    container.style.opacity = '1';
  }
}, true);
//播放歌曲
var mysong = $g.eid('mysong');
var audioMusic = $g.eid('audio-music');
$g.addEvent(mysong, 'click', function (e) {
  var clsname = e.target.className;
  clsname = clsname.split(' ');
  var numindex = 0;
  if (numindex == 0) {
    numindex = 1;
    $g.setAttr(audioMusic, 'src', 'public/media/smlt.mp3');
  }
  if (clsname[1] == 'start-btn') {
    mysong.className = 'music-btn pause-btn';
    audioMusic.play();
  } else {
    mysong.className = 'music-btn start-btn';
    audioMusic.pause();
  }
}, false);
// 到顶部
var arrow = $g.eone('.arrow');
var header = $g.eone('header');
$g.addEvent(window, 'scroll', function (e) {
  var top = document.documentElement.scrollTop || document.body.scrollTop;
  if (top > 280) {
    arrow.style.display = 'block';
    header.className = 'header-fixed';
  } else {
    arrow.style.display = 'none';
    header.className = '';
  }
}, false);
$g.addEvent(arrow, 'click', function (e) {
  var timer = setInterval(function () {
    var top = document.documentElement.scrollTop || document.body.scrollTop;
    if (top > 0) {
      var speed = Math.floor(-top / 6);
    }
    if (top == 0) {
      clearInterval(timer);
    }
    document.documentElement.scrollTop = document.body.scrollTop = top + speed;
  }, 10);
}, false);
// 点击关闭灯箱
var picclose = $g.eone('.pic-close');
var picbox = $g.eone('.pic-box');
$g.addEvent(picclose, 'click', function () {
  picbox.style.display = 'none';
}, false);
var aimgs = $g.etag('img');
var picimg = $g.eone('.pic-img');
for (var k = 0; k < aimgs.length; k++) {
  $g.addEvent(aimgs[k], 'click', function () {
    picimg.src = this.src;
    picbox.style.display = 'block';
  }, false);
}