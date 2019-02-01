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
	
	//获取表单元素
	var forms = $tag('form')[0],
	    userName = $id('usernames'),
	    passWord = $id('passwords'),
	    unMsg = $id('un-msg'),
	    pwsMsg = $id('pw-msg');
	
	//制定正则验证格式
	var regOne = /^[1-9][0-9]{10,11}$/g
	    regTwo = /[0-9a-zA-Z]{6,15}/g

   //获取cookie
	var phoneCodes = getCookie('phoneCode'),
	    passWords = getCookie('passWord');
	
	//测试
	//console.log(unMsg,pwsMsg)
	
	
	
	//进行表单数据正则验证事件
	userName.onchange = function(){
			var _valun = this.value;
			if (regOne.test(_valun)) {
				unMsg.innerHTML = "用户名输入正确！"
				this.className = ""
			}else{
				unMsg.innerHTML = "<span style='color:#f00'>请输入正确手机号码！</span>"
				this.className = "texterrows"
			}
			passWord.onchange = function(){
				var _valpw = this.value;
			   if (regTwo.test(_valpw)) {
			   	pwsMsg.innerHTML = "密码输入正确！"
			   	this.className = ""
			   } else{
			   	pwsMsg.innerHTML = "<span style='color:#f00'>请输入6-16位密码！</span>"
			      this.className = "texterrows"
			   }
			}
	}	
	
	//提交表单数据事件
	document.forms[0].onsubmit = function(e){
		e=e || window.event
		e.preventDefault();
		if (form.username.value == ""  && form.passwords.value == ""){
			alert("用户名和密码不能为空！")
		}else if(form.username.value == ""){
			alert("用户名不能为空！")
	   }else if(form.passwords.value == ""){
	   	alert("密码不能为空！")
		}else{
		  	if (userName.value === phoneCodes) {
					setCookie('userName',userName.value,7)
					if (passWord.value === passWords) {
						setCookie('passWord',passWord.value,7)
						alert("恭喜你！登录成功！")
						location.href = "index.html"
					}else{
						alert("密码错误，请重新输入！")
				   }
		   }else{
				alert("用户名不存在，请重新输入!")
			}
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
