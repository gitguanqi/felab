/**
 * author: guanqi,
 * date:2019.2.20;
 * content: gjs;
 * version: 1.0.0;
 */
var xyz;
if (!xyz) {
  xyz = {};
} else if (typeof xyz != 'object') {
  throw new Error("xyz already exists and is not an object");
}

if (!xyz.guanqi) {
  xyz.guanqi = {};
} else if (typeof xyz.guanqi != 'object') {
  throw new Error("xyz.guanqi already exists and is not an object");
}

if (xyz.guanqi.Class) {
  throw new Error("xyz.guanqi.Class: Class already exists");
}

var $g = xyz.guanqi.Class;

$g = {
  name: '$g',
  version: '1.0.0'
}
// $g dom封装方法
var $w = window;
var $d = document;
//创建dom元素
$g.celem = function (name) {
  return $d.createElement(name);
}
$g.ctext = function (name) {
  return $d.createTextNode(name);
}
// 获取dom元素
$g.eid = function (name) {
  return $d.getElementById(name);
}
$g.ecls = function (name) {
  return $d.getElementsByClassName(name);
}
$g.etag = function (name) {
  return $d.getElementsByTagName(name);
}
$g.ename = function (name) {
  return $d.getElementsByName(name);
}
$g.eone = function (name) {
  return $d.querySelector(name);
}
$g.eall = function (name) {
  return $d.querySelectorAll(name);
}
// 节点操作
$g.nodep = function (name) {
  return name.parentNode;
}
$g.nodepe = function (name) {
  return name.parentElement;
}
$g.nodec = function (name) {
  return name.childNodes;
}
$g.nodece = function (name) {
  return name.children;
}
$g.nodecf = function (name) {
  return name.firstChild;
}
$g.nodecfe = function (name) {
  return name.firstElementChild;
}
$g.nodecl = function (name) {
  return name.lastChild;
}
$g.nodecle = function (name) {
  return name.lastElementChild;
}
$g.nodecn = function (name) {
  return name.nextSibling;
}
$g.nodecne = function (name) {
  return name.nextElementSibling;
}
$g.nodecp = function (name) {
  return name.previousSibling;
}
$g.nodecpe = function (name) {
  return name.previousElementSibling;
}
// 属性操作
$g.setAttr = function (elem, key, val) {
  elem.setAttribute(key, val);
}
$g.getAttr = function (elem, key) {
  elem.getAttribute(key);
}
$g.delAttr = function (elem, key) {
  elem.removeAttribute(key);
}
// 添加元素
$g.addElem = function (parent, child) {
  parent.appendChild(child);
}
// 替换元素
$g.replaceElem = function (parent, newelem, oldelem) {
  parent.replaceChild(newelem, oldelem);
}
// 插入元素
$g.insertElem = function (parent, newelem, oldelem) {
  parent.insertBefore(newelem, oldelem);
}
//克隆元素
/** 
 * 深克隆，又叫深拷贝。就是既克隆元素本身，又克隆元素的子节点和节点的内容。
  浅克隆，又叫浅拷贝。只是克隆节点本身，不包括节点的内容。
*/
$g.cloneElem = function (elem, isDeep) { // isDeep 是否深克隆
  return elem.cloneNode(isDeep);
}
//删除元素
$g.delElem = function (parent, child) {
  parent.removeChild(child);
}
//查看游览器是否支持dom标准
$g.supportDom = function (name, version) {
  if (document.implementation &&
    document.implementation.hasFeature &&
    document.implementation.hasFeature(name, version)
  ) {
    return true;
  } else {
    return false;
  }
}
// 事件监听
if (document.addEventListener) {
  $g.addEvent = function (elem, eventType, handleEvent, isCapture) {
    elem.addEventListener(eventType, handleEvent, isCapture);
  }
  $g.removeEvent = function (elem, eventType, handleEvent, isCapture) {
    elem.removeEventListener(eventType, handleEvent, isCapture);
  }
  $g.stoppro = function (e) {
    e.stopPropagation();
  };
  $g.prevent = function (e) {
    e.preventDefault();
  }
} else if (document.attachEvent) {
  $g.addEvent = function (elem, eventType, handleEvent) {
    elem.attachEvent('on' + eventType, handleEvent);
  }
  $g.removeEvent = function (elem, eventType, handleEvent) {
    elem.detachEvent('on' + eventType, handleEvent);
  }
  $g.stoppro = function (e) {
    e.cancelBubble = true;
  };
  $g.prevent = function (e) {
    e.returnValue = false;
  }
} else {
  $g.unevent = function (elem, eventType, handleEvent) {
    elem.eventType = handleEvent;
  }
}
// $g cookie 封装方法
//设置cookie
$g.setCookie = function (name, value, maxAge, path, domain, secure) {
  //检测flag
  var cookieinfo = {
    name: name,
    value: value,
    maxAge: maxAge,
    path: path,
    domain: domain,
    secure: secure
  };
  var res = '';

  //验证值
  for (key in cookieinfo) {
    var val = cookieinfo[key];
    if (key == 'path') {
      if (!val) {
        continue;
      } else if (typeof val != 'string') {
        throw new Error('Error: path must be an string!');
      }
    } else if (key == 'domain') {
      if (!val) {
        continue;
      } else if (typeof val != 'string') {
        throw new Error('Error: domain must be an string!');
      }
    } else if (key == 'secure') {
      if (!val) {
        continue;
      } else if (typeof val != 'boolean') {
        throw new Error('Error: secure must be an boolean!');
      }
    } else if (val == '' || val == undefined || val == null) {
      throw new Error('Error:' + key + ' not a null value!');
    }
  }

  //赋值
  for (var key in cookieinfo) {
    var val = cookieinfo[key];
    if (val == undefined) {
      continue;
    }
    if (key == 'value') {
      continue;
    }
    if (key == 'name') {
      res += cookieinfo['name'] + '=' + encodeURIComponent(cookieinfo['value']) + ';';
    } else if (key == 'maxAge') {
      res += 'max-age' + '=' + cookieinfo['maxAge'] + ';';
    } else if (key == 'secure' && cookieinfo['secure'] === true) {
      res += 'secure;';
    } else {
      res += key + '=' + val + ';';
    }
  }

  if (res) {
    document.cookie = res;
  }
}

//获取cookie
$g.getCookie = function (isAll, name) {
  var tisAll = isAll;
  var tname = name;

  if (typeof tisAll != 'boolean') {
    throw new Error('Error: tisAll not an boolean!');
  }
  if (!tisAll) {
    if (tname == 'undefined' || tname == null ||
      tname == '' || typeof tname == 'object' ||
      typeof tname == 'function') {
      throw new Error('Error: name not an object or function or undefined!');
    }
  }

  var cookie = document.cookie;
  var cookies = cookie.split(';');
  var value = '';
  var allObj = {};
  for (var i = 0; i < cookies.length; i++) {
    var vals = cookies[i].split('=');
    var allKey = vals[0].trim();
    var allVal = decodeURIComponent(vals[1]);
    if (allKey == '' && allVal == '') {
      continue;
    } else {
      if (tisAll) {
        allObj[allKey] = allVal;
      } else {
        if (tname == allKey) {
          value = allVal;
        }
      }
    }
  }

  if (!tisAll && value == '') {
    throw new Error('Error:' + tname + ' not found!');
  }

  if (tisAll) {
    for (var key in allObj) {
      if (key == '' && allObj[key] == 'undefined') {
        throw new Error('Error: all cookie not found!');
      }
    }
  }

  var res = tisAll ? allObj : value;

  return res;
}

// 移除cookie
$g.removeCookie = function (name) {
  if (name == '' || name == undefined || name == null) {
    throw new Error('Error: name not an null!');
  }
  var cookie = document.cookie;
  var cookies = cookie.split(';');
  var res;
  for (var i = 0; i < cookies.length; i++) {
    var vals = cookies[i].split('=');
    var allKey = vals[0].trim();
    if (name == allKey) {
      res = true;
    }
  }
  if (!res) {
    throw new Error('Error:' + name + ' not found!');
  }

  document.cookie = name + '=' + '' + ';max-age=0';
}
// $g ajax 请求封装方法
// 创建一个XMLHttpRequest对象
$g._factories = [
  function () {
    return new XMLHttpRequest();
  },
  function () {
    return new ActiveXObject('Msxml2.XMLHTTP');
  },
  function () {
    return new ActiveXObject('Microsoft.XMLHTTP');
  }
];
$g._factory = null;
$g._newRequest = function () {
  if ($g._factory != null) {
    return $g._factory();
  }
  for (var i = 0; i < $g._factories.length; i++) {
    try {
      var factory = $g._factories[i];
      var request = factory();
      if (request != null) {
        $g._factory = factory;
        return request;
      }
    } catch (e) {
      continue;
    }
  }

  $g._factory = function () {
    throw new Error('XMLHttpRequest no supported!');
  }

  $g._factory();
};

// get请求文本的方法，参数是url地址、callback函数

$g.getText = function (url, callback) {
  var request = $g._newRequest();
  request.open('GET', url);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.status == 200) {
      if (request.readyState == 4) {
        callback(JSON.parse(request.responseText));
      }
    }
  }
}

// get请求xml文件的方法，参数是url地址、callback函数

$g.getXML = function (url, callback) {
  var request = $g._newRequest();
  request.open('GET', url);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.status == 200) {
      if (request.readyState == 4) {
        callback(request.responseXML);
      }
    }
  }
}

// 解析xml文件

$g.parseXml = function (xmlFile) {
  var xmlDoc;
  if (window.ActiveXObject) {
    xmlDoc = new ActiveXObject('Microsoft.XMLDOM'); //IE
    xmlDoc.async = false;
    xmlDoc.load(xmlFile);
  } else if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) { //火狐

    xmlDoc = document.implementation.createDocument('', '', null);
    xmlDoc.load(xmlFile);
  } else { //谷歌
    var xmlhttp = new window.XMLHttpRequest();
    xmlhttp.open("GET", xmlFile, false);
    xmlhttp.send(null);
    if (xmlhttp.readyState == 4) {
      xmlDoc = xmlhttp.responseXML.documentElement;
    }
  }
  return xmlDoc;
}

// 获取请求头的方法
$g.getHeaders = function (url, callback, errorHandler) {
  var request = $g._newRequest();
  request.open('HEAD', url);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.status == 200) {
      if (request.readyState == 4) {
        callback($g.parseHeaders(request));
      } else {
        if (errorHandler) {
          errorHandler(request.status, request.statusText);
        } else {
          callback(null);
        }
      }
    }
  }
}

//解析请求头
$g.parseHeaders = function (request) {
  console.log(request);
  var headerText = request.getAllResponseHeaders();
  var headers = {};
  var ls = /^\s*/;
  var ts = /\s*$/;
  var lines = headerText.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.length == 0) {
      continue;
    }
    var pos = line.indexOf(':');
    var name = line.substring(0, pos).replace(ls, '').replace(ts, '');
    var value = line.substring(pos + 1).replace(ls, '').replace(ts, '');
    headers[name] = value;
  }
  return headers;
}

//post请求
$g.post = function (params) {
  var request = $g._newRequest();
  var postObj = {
    url: params.url,
    data: params.data,
    callback: params.callback,
    errorHandler: params.errorHandler
  }
  request.open('POST', postObj.url);
  request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  request.send($g.encodeFormData(postObj.data));
  request.onreadystatechange = function () {
    if (request.status == 200) {
      if (request.readyState == 4) {
        postObj.callback($g._getResponse(request));
      } else {
        if (postObj.errorHandler) {
          postObj.errorHandler(request.status, request.statusText);
        } else {
          postObj.callback(null);
        }
      }
    }
  }
}

//解析表单数据
$g.encodeFormData = function (data) {
  var pairs = [];
  var regexp = /%20/g;
  for (name in data) {
    var value = data[name].toString();
    var pair = encodeURIComponent(name).replace(regexp, '+') + '=' +
      encodeURIComponent(value).replace(regexp, '+');
    pairs.push(pair);
  }
  return pairs.join('&');
}

//获取相应数据格式并解析
$g._getResponse = function (request) {
  var headerType = request.getAllResponseHeaders('Content-Type');
  headerType = headerType.split(':')[1].split(';')[0];
  if (headerType.indexOf('application/json') != -1) {
    return JSON.parse(request.responseText);
  } else if (headerType.indexOf('text/html') != -1) {
    return request.responseXML;
  } else {
    return request.responseText;
  }
}
// 拖拽封装方法
$g.Drag = function DragElement(elem) {
  this.elem = elem;
  var _this = this;
  _this.winWidth = document.documentElement.clientWidth;
  _this.winHeight = document.documentElement.clientHeight;
  window.onresize = function () {
    _this.winWidth = document.documentElement.clientWidth;
    _this.winHeight = document.documentElement.clientHeight;
  }
  this.elem.onmousedown = function (e) {
    var e = e || window.event;
    var disX = e.clientX - this.offsetLeft;
    var disY = e.clientY - this.offsetTop;
    document.onmousemove = function (e) {
      var e = e || window.event;
      var l, t;
      l = e.clientX - disX;
      t = e.clientY - disY;
      _this.move(_this, l, t);
    }
    document.onmouseup = function () {
      _this.cancel();
    }
  }
}
// 移动元素
$g.Drag.prototype.move = function (_this, l, t) {
  var elem = _this.elem;
  if ((l + elem.offsetWidth) > _this.winWidth) {
    l = _this.winWidth - elem.offsetWidth;
  }
  if (l < 0) {
    l = 0;
  }
  if ((t + elem.offsetHeight) > _this.winHeight) {
    t = _this.winHeight - elem.offsetHeight;
  }
  if (t < 0) {
    t = 0;
  }
  elem.style.left = l + 'px';
  elem.style.top = t + 'px';
}
$g.Drag.prototype.cancel = function () {
  document.onmousemove = null;
  document.onmouseup = null;
}
// tab切换
$g.Tab = function (btns, style) {
  var _this = this;
  var len = btns.length;
  this.btns = btns;
  this.style = style;
  this.len = len;
  for (var i = 0; i < this.len; i++) {
    this.btns[i].index = i;
    this.btns[i].onclick = function () {
      _this.toggleTabs(_this, this.index);
    }
  }
}
// 这是一个对象的方法，用来切换选项卡的。
$g.Tab.prototype.toggleTabs = function (obj, index) {
  for (var j = 0; j < obj.len; j++) {
    obj.btns[j].className = '';
  }
  obj.btns[index].className = obj.style;
}
// banner轮播图封装方法
$g.Carousels = function (isAuto, box, banner, lis, point, arrowLeft, arrowRight, active, boxWidth, bannerWidth, liWidth) {
  var _this = this;
  this.box = _this.getOne(box); // 获取外面大框
  this.banner = _this.getOne(banner); //获取列表框
  this.boxWidth = boxWidth; // 获取外面大框宽度
  this.bannerWidth = bannerWidth; //获取列表框宽度
  this.lis = _this.getAll(lis); // 获取所有图片列表
  this.liWidth = liWidth; // 获取所有图片列表宽度
  this.points = _this.getAll(point); // 获取所有指示灯列表
  this.arrowLeft = _this.getOne(arrowLeft); //获取左箭头
  this.arrowRight = _this.getOne(arrowRight); //获取右箭头
  this.active = active; //点样式
  this.len = this.lis.length; //长度
  this.num = 0;
  this.timer = null; //计时器
  this.isAuto = isAuto; //是否自动轮播
  this.arrowLeft.onclick = function () { //左箭头点击
    clearInterval(_this.timer);
    if (_this.num <= _this.len && _this.num > 0) {
      _this.num--;
      _this.moveBanner(_this);
    }
  };
  this.arrowLeft.onmouseover = function () { //鼠标移入左箭头
    clearInterval(_this.timer);
  };
  this.arrowLeft.onmouseout = function () { //鼠标移入出左箭头
    _this.autoPlay(_this);
  };
  this.arrowRight.onclick = function () { //右箭头点击
    clearInterval(_this.timer);
    if (_this.num < _this.len - 1) {
      _this.num++;
      _this.moveBanner(_this);
    }
  }
  this.arrowRight.onmouseover = function () { //鼠标移入右箭头
    clearInterval(_this.timer);
  };
  this.arrowRight.onmouseout = function () { //鼠标移出右箭头
    _this.autoPlay(_this);
  };
  this.box.onmouseover = function () { //鼠标移入图片
    clearInterval(_this.timer);
  };
  this.box.onmouseout = function () { //鼠标移出图片
    _this.autoPlay(_this);
  };
  for (var i = 0; i < _this.len; i++) {
    ; //鼠标移入红点
    (function (index) {
      _this.points[index].onmouseover = function () {
        _this.changePointStyle(_this, index);
        var MoveWidth = -(_this.liWidth) * index;
        _this.banner.style.left = MoveWidth + 'px';
      }
    })(i)
  }
  if (isAuto) { //是否自动播放
    _this.autoPlay(_this);
  }
}
$g.Carousels.prototype.getCls = function (elem) { //通过class
  var res = document.getElementById(elem);
  return res;
}
$g.Carousels.prototype.getClsOne = function (elem) { //通过class获取一个
  var res = document.getElementsByClassName(elem)[0];
  return res;
}
$g.Carousels.prototype.getCls = function (elem) { //通过class
  var res = document.getElementsByClassName(elem);
  return res;
}
$g.Carousels.prototype.getTag = function (elem) { //通过标签
  var res = document.getElementsByTagName(elem);
  return res;
}
$g.Carousels.prototype.getOne = function (elem) { //获取任意一个
  var res = document.querySelector(elem);
  return res;
}
$g.Carousels.prototype.getAll = function (elem) { //获取全部
  var res = document.querySelectorAll(elem);
  return res;
}
$g.Carousels.prototype.moveBanner = function (obj) { //移动图片
  var MoveWidth = -(obj.liWidth) * (obj.num);
  obj.banner.style.left = MoveWidth + 'px';
  obj.changePointStyle(obj, obj.num);
}
$g.Carousels.prototype.changePointStyle = function (obj, num) { // 改变红点样式
  var index = num;
  for (var j = 0; j < obj.len; j++) {
    obj.points[j].className = '';
  }
  obj.points[index].className = obj.active;
}
$g.Carousels.prototype.autoPlay = function (obj) { //自动播放
  obj.timer = setInterval(function () {
    if (obj.num < obj.len - 1) {
      obj.num++;
      obj.moveBanner(obj);
    } else {
      obj.num = 0;
      obj.moveBanner(obj);
    }
  }, 3000);
}