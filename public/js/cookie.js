/**
author: guanqi,
date: 2019.1.28,
content: cookie 
 */
if (window.cookieTools) {
  throw new Error('Error:cookieTools had defined!');
} else {
  var cookieTools = {};
}
//设置cookie
cookieTools.setCookie = function (name,value,maxAge,path,domain,secure) {
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
  for(key in cookieinfo) {
    var val = cookieinfo[key];
    if (key == 'path') {
      if (!val) {
        continue;
      }else if (typeof val != 'string') {
        throw new Error('Error: path must be an string!');
      }
    }else if (key == 'domain') {
      if (!val) {
        continue;
      }else if (typeof val != 'string') {
        throw new Error('Error: domain must be an string!');
      }
    }else if (key == 'secure') {
      if (!val) {
        continue;
      }else if (typeof val != 'boolean') {
        throw new Error('Error: secure must be an boolean!');
      }
    }else if (val == '' || val == undefined || val == null) {
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
    }else if (key == 'maxAge') {
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
cookieTools.getCookie = function (isAll,name) {
  var tisAll = isAll;
  var tname = name;

  if (typeof tisAll != 'boolean') {
    throw new Error('Error: tisAll not an boolean!');
  }
  if (!tisAll) {
    if (tname == 'undefined'  || tname == null || 
      tname == '' ||  typeof tname == 'object' || 
      typeof tname == 'function') {
      throw new Error('Error: name not an object or function or undefined!');
    }
  }
  
  var cookie = document.cookie;
  var cookies = cookie.split(';');
  var value = '';
  var allObj = {};
  for(var i=0;i<cookies.length;i++) {
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
    throw new Error('Error:' + tname +  ' not found!');
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
cookieTools.removeCookie = function (name) {
  if (name == '' || name == undefined || name == null) {
    throw new Error('Error: name not an null!');
  }
  var cookie = document.cookie;
  var cookies = cookie.split(';');
  var res;
  for(var i=0;i<cookies.length;i++) {
    var vals = cookies[i].split('=');
    var allKey = vals[0].trim();
    if (name == allKey) {
      res = true;
    }
  }
  if (!res) {
    throw new Error('Error:' + name +' not found!');
  }
  
  document.cookie = name + '=' + '' + ';max-age=0';
}