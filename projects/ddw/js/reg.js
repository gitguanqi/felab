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
	
	//获取导航显示隐藏元素
	var myDd = $cls('mydd')[0],
	    giftDd = $cls('gift')[0],
	    myddUl = $query('.mydd ul'),
	    giftUl = $query('.gift ul');
	
	
	//手机号码获取表单元素
	var phoneCode = $id('phonecode'),
	    passWord = $id('passwords'),
	    repassWord = $id('repassword'),
	    phMsg = $id('ph-msg'),
	    pwMsg = $id('pw-msg'),
	    reMsg = $id('re-msg'),
	    forms = $tag('form')[0];
	
	//获取购物车cookie
	var cartBool = $cls('cart-bool')[0],
	    user = getCookie('userName');
	
	//定义正则表达式，判断是否为手机号，密码格式是否正确
	var regOne = /^[1-9][0-9]{10,11}$/g
	    regTwo = /[0-9a-zA-Z]{6,16}/g
	    
	    
	//测试区
	//console.log(regOne);
	
	/*
	 添加事件
	 * */
	
	//判断购物车cookie
	cartBool.onclick = function(e){
		e=e || window.event
		e.preventDefault();
		if(user){
			location.href = "shoppingcart.html"
		}else{
			location.href = "shopping.html"
		}
	}
	
	
	//顶部导航显示隐藏事件
	show(myDd,myddUl);
	hide(myDd,myddUl);
	show(giftDd,giftUl);
	hide(giftDd,giftUl);
	
	
	//显示隐藏函数模块
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
	
	
	
	
   //鼠标离开后判断三个输入框中的值是否为正确的格式
	phoneCode.onchange = function(){
			var _valpc = this.value;
			if (regOne.test(_valpc)) {
				phMsg.innerHTML = "<img src='img/reg/right.png'/>"
				this.className = ""
			}else{
				phMsg.innerHTML = "<span style='color:#f00'>请输入正确的手机号码！</span>"
				this.className = "texterrow"
			}
			passWord.onchange = function(){
					var _valpw = this.value;
					if (regTwo.test(_valpw)) {
					   pwMsg.innerHTML = "<img src='img/reg/right.png'/>"
						this.className = ""
					}else{
						pwMsg.innerHTML = "<span style='color:#f00'>请输入6-16位密码！</span>"
						this.className = "texterrow"
					}
					repassWord.onchange = function(){
							var _valuepw = passWord.value;
							var _valuere = this.value;
							if (_valuere === _valuepw) {
								reMsg.innerHTML = "<img src='img/reg/right.png'/>"
								this.className = ""
							}else{
								reMsg.innerHTML = "<span style='color:#f00'>密码应和上面一致！</span>"
								this.className = "texterrow"
							}
					}
			}
	}
	
	//表单提交数据事件
	document.forms[0].onsubmit = function(e){
		e=e || window.event
		e.preventDefault();
		if(form.phonecode.value == false && form.passwords.value == false){
			alert("手机号码和密码不能为空！")
		}else if(form.phonecode.value == false && form.repassword.value == false){
		   alert("手机号码和确认密码不能为空！")
		}else if(form.passwords.value == false && form.repassword.value == false){
		   alert("密码和确认密码不能为空！")
		}else if(form.passwords.value != form.repassword.value){
		   alert("密码和确认密码不相等！")
		}else if(regOne.test(form.phonecode.value) == false && regTwo.test(form.passwords.value) == false && regTwo.test(form.repassword.value) == false){
		   alert("手机号码和密码，确认密码格式不正确！")
		}else if(regOne.test(form.phonecode.value) == false && regTwo.test(form.passwords.value) == false){
		   alert("手机号码和密码格式不正确！")
		}else if(regTwo.test(form.passwords.value) == false && regTwo.test(form.repassword.value) == false){
		   alert("密码和确认密码格式不正确！")
		}else{
			if (phoneCode.value) {
				setCookie('phoneCode',phoneCode.value,7)
			}
			if (passWord.value) {
				setCookie('passWord',passWord.value,7)
			}
			alert("恭喜你，注册成功！")
		   location.href = "login.html"
		}
  }
	
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
