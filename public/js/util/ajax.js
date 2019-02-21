/** 
 * author: guanqi,
 * date:2019.1.29,
 * content: http methods
*/
if (!window.GHTTP) {
  // 创建一个对象
  var GHTTP = {};

  // 创建一个XMLHttpRequest对象
  GHTTP._factories = [
    function () { return new XMLHttpRequest();  },
    function () { return new ActiveXObject('Msxml2.XMLHTTP');  },
    function () { return new ActiveXObject('Microsoft.XMLHTTP');  }
  ];
  GHTTP._factory = null;
  GHTTP._newRequest = function () {  
    if (GHTTP._factory != null) {
      return GHTTP._factory();
    }
    for (var i=0;i<GHTTP._factories.length;i++) {
      try {
        var factory = GHTTP._factories[i];
        var request = factory();
        if (request != null) {
          GHTTP._factory = factory;
          return request;
        }
      }
      catch (e) {
        continue;
      }
    }

    GHTTP._factory = function () {  
      throw new Error('XMLHttpRequest no supported!');
    }

    GHTTP._factory();
  };

  // get请求文本的方法，参数是url地址、callback函数

  GHTTP.getText = function (url,callback) {  
    var request = GHTTP._newRequest();
    request.open('GET',url);
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

  GHTTP.getXML = function (url,callback) {  
    var request = GHTTP._newRequest();
    request.open('GET',url);
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

  GHTTP.parseXml = function (xmlFile) {
      var xmlDoc;
      if (window.ActiveXObject) {
          xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE
          xmlDoc.async = false;
          xmlDoc.load(xmlFile);
      }
      else if (isFirefox=navigator.userAgent.indexOf("Firefox")>0) { //火狐

          xmlDoc = document.implementation.createDocument('', '', null);
          xmlDoc.load(xmlFile);
      }
      else{ //谷歌
        var xmlhttp = new window.XMLHttpRequest();
          xmlhttp.open("GET",xmlFile,false);
          xmlhttp.send(null);
          if(xmlhttp.readyState == 4){
          xmlDoc = xmlhttp.responseXML.documentElement;
          } 
      }
      return xmlDoc;
  }

  // 获取请求头的方法
  GHTTP.getHeaders = function (url,callback,errorHandler) {  
    var request = GHTTP._newRequest();
    request.open('HEAD',url);
    request.send(null);
    request.onreadystatechange = function () {  
      if (request.status == 200) {
        if (request.readyState == 4) {
          callback(GHTTP.parseHeaders(request));
        } else {
          if (errorHandler) {
            errorHandler(request.status,request.statusText);
          } else {
            callback(null);
          }
        }
      }
    }
  }

  //解析请求头
  GHTTP.parseHeaders = function (request) {
    console.log(request);
    var headerText = request.getAllResponseHeaders();
    var headers = {};
    var ls = /^\s*/;
    var ts = /\s*$/;
    var lines = headerText.split('\n');
    for (var i=0;i<lines.length;i++) {
      var line = lines[i];
      if (line.length == 0) { continue; }
      var pos = line.indexOf(':');
      var name = line.substring(0,pos).replace(ls,'').replace(ts,'');
      var value = line.substring(pos+1).replace(ls,'').replace(ts,'');
      headers[name] = value;
    }
    return headers;
  }

  //post请求
  GHTTP.post = function (params) {
    var request = GHTTP._newRequest();
    var postObj = {
      url: params.url,
      data: params.data,
      callback: params.callback,
      errorHandler: params.errorHandler
    }
    request.open('POST',postObj.url);
    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
    request.send(GHTTP.encodeFormData(postObj.data));
    request.onreadystatechange = function () {  
      if (request.status == 200) {
        if (request.readyState == 4) {
          postObj.callback(GHTTP._getResponse(request));
        } else {
          if (postObj.errorHandler) {
            postObj.errorHandler(request.status,request.statusText);
          } else {
            postObj.callback(null);
          }
        }
      }
    }
  }

  //解析表单数据
  GHTTP.encodeFormData = function (data) {  
    var pairs = [];
    var regexp = /%20/g;
    for (name in data) {
      var value = data[name].toString();
      var pair = encodeURIComponent(name).replace(regexp,'+') + '=' +
          encodeURIComponent(value).replace(regexp,'+');
      pairs.push(pair);
    }
    return pairs.join('&');
  }

  //获取相应数据格式并解析
  GHTTP._getResponse = function (request) {  
    var headerType =  request.getAllResponseHeaders('Content-Type');
    headerType = headerType.split(':')[1].split(';')[0];
    if (headerType.indexOf('application/json') != -1) {
      return JSON.parse(request.responseText);
    } else if (headerType.indexOf('text/html') != -1) {
      return request.responseXML;
    } else {
      return request.responseText;
    }
  }

}else {
  throw new Error(GHTTP + 'had value!');
}