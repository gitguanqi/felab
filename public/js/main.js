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
  var myfront = $g.eid('myfront');
  var myback = $g.eid('myback');
  var myapp = $g.eid('myapp');
  var mypc = $g.eid('mypc');
  var mywap = $g.eid('mywap');
  var myrem = $g.eid('myrem');
  var mydata = {
    front: [],
    back: [],
    app: [],
    pc: [],
    wap: [],
    rem: []
  };
  var mycount = {
    html: 0,
    css: 0,
    js: 0
  }
  //分解列表
  if (listdata.length > 0) {
    for (var i = 0; i < listdata.length; i++) {
      var item = listdata[i];
      var type = item.type.split(',');
      if (type[0] == 'front') {
        mydata.front.push(item);
      }
      if (type[0] == 'back') {
        mydata.back.push(item);
      }
      if (type[0] == 'app') {
        mydata.app.push(item);
      }
      if (type[0] == 'pc') {
        mydata.pc.push(item);
      }
      if (type[0] == 'wap') {
        mydata.wap.push(item);
      }
      if (type[0] == 'rem') {
        mydata.rem.push(item);
      }
    }
    var liststr = '';
    var liststr1 = '';
    var liststr2 = '';
    var liststr31 = '';
    var liststr32 = '';
    var liststr33 = '';
    var liststr4 = '';
    var liststr5 = '';
    for (var i = 0; i < mydata.front.length; i++) {
      var item = mydata.front[i];
      liststr += '<li><i class="icon icon-t"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      myfront.innerHTML = liststr;
    }
    for (var i = 0; i < mydata.back.length; i++) {
      var item = mydata.back[i];
      liststr1 += '<li><i class="icon icon-t"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      myback.innerHTML = liststr1;
    }
    for (var i = 0; i < mydata.app.length; i++) {
      var item = mydata.app[i];
      liststr2 += '<li><i class="icon icon-t"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      myapp.innerHTML = liststr2;
    }
    for (var i = 0; i < mydata.pc.length; i++) {
      var item = mydata.pc[i];
      if (item.type.split(',')[1] == 'html') {
        mycount.html += 1;
        liststr31 += '<li><i class="icon icon-html"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      }
      if (item.type.split(',')[1] == 'css') {
        mycount.css += 1;
        liststr32 += '<li><i class="icon icon-css"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      }
      if (item.type.split(',')[1] == 'js') {
        mycount.js += 1;
        liststr33 += '<li><i class="icon icon-js"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      }
      mypc.innerHTML = '<li class="post-type"><span class="post-type-title">HTML案例部分(<strong class="count-part"></strong>)</span></li>' + liststr31 + '<li class="post-type"><span class="post-type-title">CSS案例部分(<strong class="count-part"></strong>)</span></li>' + liststr32 + '<li class="post-type"><span class="post-type-title">JS例部分(<strong class="count-part"></strong>)</span></li>' + liststr33;
    }
    for (var i = 0; i < mydata.wap.length; i++) {
      var item = mydata.wap[i];
      liststr4 += '<li><i class="icon icon-t"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      mywap.innerHTML = liststr4;
    }
    for (var i = 0; i < mydata.rem.length; i++) {
      var item = mydata.rem[i];
      liststr5 += '<li><i class="icon icon-t"></i><a href="' + item.url + '?from=demo" target="_blank">' + item.name + '</a><span class="update">' + item.update_time + '</span></li>'
      myrem.innerHTML = liststr5;
    }
  }
  //显示计数
  showCount(mydata, mycount);
}
//显示计数
function showCount(mydata, mycount) {
  $g.ecls('count')[0].innerText = mydata.front.length;
  $g.ecls('count')[1].innerText = mydata.back.length;
  $g.ecls('count')[2].innerText = mydata.app.length;
  $g.ecls('count')[3].innerText = mydata.pc.length;
  $g.ecls('count')[4].innerText = mydata.wap.length;
  $g.ecls('count')[5].innerText = mydata.rem.length;
  $g.ecls('count-part')[0].innerText = mycount.html;
  $g.ecls('count-part')[1].innerText = mycount.css;
  $g.ecls('count-part')[2].innerText = mycount.js;
  $g.eid('mydoc').innerHTML = '<li><i class="icon icon-e"></i>前端项目(' + mydata.front.length + ')</li><li><i class="icon icon-e"></i>后端项目(' + mydata.back.length + ')</li><li><i class="icon icon-e"></i>App项目(' + mydata.app.length + ')</li><li><i class="icon icon-e"></i>PC端案例(' + mydata.pc.length + ')</li><li><i class="icon icon-e"></i>移动端案例(' + mydata.wap.length + ')</li><li><i class="icon icon-e"></i>响应式案例(' + mydata.rem.length + ')</li>';
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
  $g.eid('myfront').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $g.eid('myback').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $g.eid('myapp').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $g.eid('mypc').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $g.eid('mywap').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $g.eid('myrem').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $g.eid('mydes').innerHTML = '<p>暂无数据</p>'
  $g.eid('mylink').innerHTML = '<li><i class="icon icon-e"></i><a href="#nolink">暂无友链</a></li>';
}
//切换菜单
function changeNav() {
  var lis = $g.eall('.nav-index li');
  lis[0].className = 'active';
  new $g.Tab(lis);
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