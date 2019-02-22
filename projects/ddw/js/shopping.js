/*js代码开始*/
;(function($d){
	/*
	 cls 获取元素class
	 clsOne 获取元素第一个class
	 id 获取元素id
	 tag 获取元素标签
	 name 获取元素name属性
	 * */
	var $cls = function(cls){
		return $d.getElementsByClassName(cls)
	}
	var $clsOne = function(clsOne){
		return $d.getElementsByClassName(cls)[0]
	}
	var $id = function(id){
		return $d.getElementById(id)
	}
	var $tag = function(tag){
		return $d.getElementsByTagName(tag)
	}
	var $name = function(name){
		return $d.getElementsByName(name)
	}
	var $query = function(query){
		return $d.querySelector(query)
	}
	var $querys = function(querys){
		return $d.querySelectorAll(querys)
	}
	
	/*
	 * 获取顶部元素
   * */
  
   //获取登录信息
	var loginBf = $cls('loginbf')[0],
	    loginEd = $cls('logined')[0],
	    userNames = $id('username'),
	    user = getCookie('userName'),
	    logouInfo = $id('logout'),
	    cartBool = $id('cart-bool');
  
	/*
	 测试区
	 * */
	//console.log(delAll,delOne,delTwo);
	
	/*
	 添加事件
	 * */
	
	//获取登录信息
	if (user) {
		loginBf.style.display = "none"
		loginEd.style.display = "block"
		userNames.innerHTML = user
	}
	logouInfo.onclick = function(){
		if(username){
			getCookie("userName")
		} 
	   removeCookie("userName");
	   removeCookie('passWord');
	   removeCookie('phoneCode');
		location.href = "shopping.html"
	}
   
   cartBool.onclick = function(){
		if (!user) {
			location.href = "shopping.html"
		}
	}
   
   
   /*
	 cookie函数模块
	 * */
	// 设置cookie
	function setCookie(key, value, time){
		var date = new Date()
		date.setDate(date.getDate() + time) // 当前时间 + 30天
		$d.cookie = key + "=" + value + ";expires=" + date
	}
	//获取cookie
	function getCookie(key){
		var _cookie = $d.cookie;	//username=wally; age=17; sex=man
		var arr = _cookie.split(";");
		for(var i=0;i<arr.length;i++){
			if(arr[i].split("=")[0].trim() === key){
				return arr[i].split("=")[1]
			}
		}
	}
	// 移除cookie
	function removeCookie(key){
		setCookie(key,null,-1)
	}
   
   
})(document)
