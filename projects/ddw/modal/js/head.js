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
	var $clsOne = function(cls){
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
	 开始获取元素
	 * */
	
	//获取顶部元素
	var citys = $id('city'),
	    citylist = $id('citylist'),
	    phonedd = $id('phonedd'),
	    phones = $id('phones'),
	    liFour = $cls('li-four'),
	    liFouruls = $querys('.li-four ul'),
	    fixLogo = $cls('fix-logo')[0];
	    
	//获取登录信息
	var loginBf = $cls('loginbf')[0],
	    loginEd = $cls('logined')[0],
	    userNames = $id('username'),
	    user = getCookie('userName'),
	    logouInfo = $id('logout'),
	    cartBool = $cls('cart-bool');
	    

   /*
	 测试区
	 * */
	console.log(cartBool);
	


   /*
	 添加事件
	 * */
	
	
	//登录信息事件
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
		location.reload();
	}
	cartBool[0].onclick = function(e){
			e=e || window.event
			e.preventDefault();
			if(user){
				location.href = "shoppingcart.html"
			}
			if(!user){
				location.href = "shopping.html"
			}
	}
	cartBool[1].onclick = function(e){
			e=e || window.event
			e.preventDefault();
			if(user){
				location.href = "shoppingcart.html"
			}
			if(!user){
				location.href = "shopping.html"
			}
	}

	//手机当当悬浮事件
	show(phonedd,phones);
	hide(phonedd,phones);
	
	//其他会员信息悬浮事件
   show(liFour[0],liFouruls[0]);
   hide(liFour[0],liFouruls[0]);
   show(liFour[1],liFouruls[1]);
   hide(liFour[1],liFouruls[1]);
   show(liFour[2],liFouruls[2]);
   hide(liFour[2],liFouruls[2]);
   

   /*
	 *1. 显示隐藏函数模块
	 * 
	 * */
	function show(a,b){
		a.onmouseover=function(){
			b.style.display="block"
		}	
	}
	function hide(a,b){
		a.onmouseout=function(){
			b.style.display="none"
		}
	}
	
   /*
	 2.cookie函数模块
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
