/** 
 * author: guanqi,
 * date:2019.2.20,
 * content: js
*/
//获取元素
function $id(name) {
  return document.getElementById(name);
}
function $cls(name) {
  return document.getElementsByClassName(name);
}
//获取数据
GHTTP.getText('mock/list.json',function(res){
  if (res.msg == 'get_succ') {
    showData(res.data);
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
  var myfront = $id('myfront');
  var myback = $id('myback');
  var myapp = $id('myapp');
  var mypc = $id('mypc');
  var mywap = $id('mywap');
  var myrem = $id('myrem');
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
    for(var i=0;i<listdata.length;i++) {
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
    for(var i=0;i<mydata.front.length;i++) {
      var item = mydata.front[i];
      liststr += '<li><i class="icon icon-t"></i><a href="'+ item.url +'?from=demo" target="_blank">'+ item.name +'</a><span class="update">'+ item.update_time +'</span></li>'
      myfront.innerHTML = liststr;
    }
    for(var i=0;i<mydata.back.length;i++) {
      var item = mydata.back[i];
      liststr1 += '<li><i class="icon icon-t"></i><a href="'+ item.url +'?from=demo" target="_blank">'+ item.name +'</a><span class="update">'+ item.update_time +'</span></li>'
      myback.innerHTML = liststr1;
    }
    for(var i=0;i<mydata.app.length;i++) {
      var item = mydata.app[i];
      liststr2 += '<li><i class="icon icon-t"></i><a href="'+ item.url +'?from=demo" target="_blank">'+ item.name +'</a><span class="update">'+ item.update_time +'</span></li>'
      myapp.innerHTML = liststr2;
    }
    for(var i=0;i<mydata.pc.length;i++) {
      var item = mydata.pc[i];
      if (item.type.split(',')[1] == 'html') {
        mycount.html += 1;
        liststr31 += '<li><i class="icon icon-html"></i><a href="'+ item.url +'?from=demo" target="_blank">'+ item.name +'</a><span class="update">'+ item.update_time +'</span></li>'
      }
      if (item.type.split(',')[1] == 'css') {
        mycount.css += 1;
        liststr32 += '<li><i class="icon icon-css"></i><a href="'+ item.url +'?from=demo" target="_blank">'+ item.name +'</a><span class="update">'+ item.update_time +'</span></li>'
      }
      if (item.type.split(',')[1] == 'js') {
        mycount.js += 1;
        liststr33 += '<li><i class="icon icon-js"></i><a href="'+ item.url +'?from=demo" target="_blank">'+ item.name +'</a><span class="update">'+ item.update_time +'</span></li>'
      }
      mypc.innerHTML = '<li class="post-type"><span class="post-type-title">HTML案例部分(<strong class="count-part"></strong>)</span></li>' + liststr31 + '<li class="post-type"><span class="post-type-title">CSS案例部分(<strong class="count-part"></strong>)</span></li>'+ liststr32 + '<li class="post-type"><span class="post-type-title">JS例部分(<strong class="count-part"></strong>)</span></li>'+ liststr33 ;
    }
    for(var i=0;i<mydata.wap.length;i++) {
      var item = mydata.wap[i];
      liststr4 += '<li><i class="icon icon-t"></i><a href="'+ item.url +'?from=demo" target="_blank">'+ item.name +'</a><span class="update">'+ item.update_time +'</span></li>'
      mywap.innerHTML = liststr4;
    }
    for(var i=0;i<mydata.rem.length;i++) {
      var item = mydata.rem[i];
      liststr5 += '<li><i class="icon icon-t"></i><a href="'+ item.url +'?from=demo" target="_blank">'+ item.name +'</a><span class="update">'+ item.update_time +'</span></li>'
      myrem.innerHTML = liststr5;
    }
  }
  //显示计数
  showCount(mydata,mycount);
}
//显示计数
function showCount(mydata,mycount) {  
  $cls('count')[0].innerText = mydata.front.length;
  $cls('count')[1].innerText = mydata.back.length;
  $cls('count')[2].innerText = mydata.app.length;
  $cls('count')[3].innerText = mydata.pc.length;
  $cls('count')[4].innerText = mydata.wap.length;
  $cls('count')[5].innerText = mydata.rem.length;
  $cls('count-part')[0].innerText = mycount.html;
  $cls('count-part')[1].innerText = mycount.css;
  $cls('count-part')[2].innerText = mycount.js;
  $id('mydoc').innerHTML = '<li><i class="icon icon-e"></i>前端项目('+ mydata.front.length +')</li><li><i class="icon icon-e"></i>后端项目('+ mydata.back.length +')</li><li><i class="icon icon-e"></i>App项目('+ mydata.app.length +')</li><li><i class="icon icon-e"></i>PC端案例('+ mydata.pc.length +')</li><li><i class="icon icon-e"></i>移动端案例('+ mydata.wap.length +')</li><li><i class="icon icon-e"></i>响应式案例('+ mydata.rem.length +')</li>';
}
//显示简介
function showDes(data) {  
  $id('mydes').innerHTML =  '<img class="about-img" src="'+ data.img +'" title="'+ data.des +'">' + data.des;
}
//显示友链
function showLink(linkdata) {  
  //分解友链
  if (linkdata.length > 0) {
    var linkstr = '';
    for(var i=0;i<linkdata.length;i++) {
      linkstr += '<li><i class="icon icon-e"></i><a href="'+ linkdata[i].url +'?from=demo" target="_blank">'+ linkdata[i].name +'</a></li>'
    }
    $id('mylink').innerHTML = linkstr;
  }
}
//显示网页信息
function showSite(site) {
  document.title = site.title || 'Demo';
  $id('mytitle').innerText = site.title || 'Demo';
  $id('myfoot').innerHTML = site.foot || '&copy;2019 <a href="/demo">Demo</a>';
  //分解菜单
  if (site.navs.length > 0) {
    var navstr = '';
    for(var i=0;i<site.navs.length;i++) {
      navstr += '<li><a href="'+ site.navs[i].url + '" target="'+ (site.navs[i].name == 'Github' ? "_blank" : "_self") +'">'+ site.navs[i].name +'</a></li>'
    }
    $id('mynav').innerHTML = navstr;
    changeNav();
  }
}
//显示错误
function errorData() {
  $id('myfront').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $id('myback').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $id('myapp').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $id('mypc').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $id('mywap').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $id('myrem').innerHTML = '<li><i class="icon icon-t"></i><a href="#no">暂无数据</a></li>';
  $id('mydes').innerHTML = '<p>暂无数据</p>'
  $id('mylink').innerHTML = '<li><i class="icon icon-e"></i><a href="#nolink">暂无友链</a></li>';
}
//切换菜单
function changeNav() {
  var lis = document.querySelectorAll('.nav-index li');
  lis[0].className = 'active';
  new Tab(lis);
}
//播放歌曲
var mysong = document.querySelector('#mysong');
var audioMusic = document.querySelector('#audio-music');
uniHandler.add(mysong,'click',function (e) {
  var clsname = e.target.className;
  clsname = clsname.split(' ');
  var numindex = 0;
  if (numindex == 0) {
    numindex = 1;
    audioMusic.setAttribute('src','public/media/沙漠骆驼.mp3');
  }
  if (clsname[1] == 'start-btn') {
    mysong.className = 'music-btn pause-btn';
    audioMusic.play();
  } else {
    mysong.className = 'music-btn start-btn';
    audioMusic.pause();
  }
},false);