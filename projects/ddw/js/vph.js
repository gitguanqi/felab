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
   
   //获取cookie元素
   var userNick = getCookie('userName'),
       nickName = $cls('vph-top-left')[0],
       loginEd = $cls('vph-logined')[0],
       vphUsername = $id('vph-username');
   
   //获取顶部会员元素
   var twoCode = $cls('twocode')[0],
       twocodeList = $cls('twocode-list')[0],
       myLis = $querys('.vph-top-right li'),
       myDDlists = $cls('mydd-list'),
       vphCart = $id('vph-shopcart');
   
   //获取顶部导航元素
   var allDetail = $id('alldetail'),
       vphDetail = $id('vph-detail'),
       allDetails = $id('alldetails'),
       vphDetails = $id('vph-details');
   
   //获取顶部搜索框和导航
   var fixNav = $cls('fixs')[0],
       fixBox = $cls('fix-box')[0];

   //获取右侧元素
   var rightSpans = $querys('.vcr-dates span'),
       rightDivs = $querys('.vcrb div');
       
   //获取热搜元素
   var hotKey = $cls('hot-word')[0],
	    hotList = $id('hot-list');
   
   //获取返回顶部元素
   var vphTop = $id('vph-top');
       
   
   /*
    测试区
    * */
   console.log(rightDivs,rightSpans);
   
   
   /*
    添加事件
    * */
   
   //登录判断事件
   if(userNick){
   	nickName.style.display = "none"
   	loginEd.style.display = "block"
   	vphUsername.innerHTML = userNick
   }
   
   //购物车判断事件
   vphCart.onclick = function(e){
   	e=e || window.event
   	e.preventDefault();
   	if(userNick){
	   	location.href = "shoppingcart.html"
	   }else{
	   	location.href = "shopping.html"
	   }
   }
  
   //显示隐藏事件
   show(allDetail,vphDetail);
   hide(allDetail,vphDetail);
   show(allDetails,vphDetails);
   hide(allDetails,vphDetails);
   
   //顶部显示隐藏事件
   show(twoCode,twocodeList);
   hide(twoCode,twocodeList);
   show(myLis[4],myDDlists[0]);
   hide(myLis[4],myDDlists[0]);
   show(myLis[13],myDDlists[1]);
   hide(myLis[13],myDDlists[1]);
   show(myLis[18],myDDlists[2]);
   hide(myLis[18],myDDlists[2]);
   
   //固定导航事件
   window.onscroll = function(){
   	var scrTops = document.documentElement.scrollTop || document.body.scrollTop;
   	if (scrTops >200) {
   		fixNav.style.display = "block"
   		fixBox.style.display = "block"
   	}else{
   		fixNav.style.display = "none"
   		fixBox.style.display = "none"
   	}
   }
   
   //右侧切换事件
   for (var i=0;i<rightSpans.length;i++) {
				rightSpans[i].index = i;
				rightSpans[i].onmouseover = function(){
					for (var j=0;j<rightSpans.length;j++) {
						rightDivs[j].className = ""
						rightSpans[j].className = ""
					}
					rightDivs[this.index].className = "vcr-bl-active"
					this.className = "vcr-date-active"
				}
			}
   
   
   //返回顶部事件
   vphTop.onclick = function(e){
   	e=e || window.event
   	e.preventDefault();
   	var timer = setInterval(function(){
   		   var scroTop = document.documentElement.scrollTop || document.body.scrollTop;
		   	scroTop -= 50
		   	if(document.documentElement.scrollTop){
					document.documentElement.scrollTop=scroTop;
				}else{
					document.body.scrollTop=scroTop;
				}
		   	if (scroTop < 0) {
		   		clearInterval(timer)
		   		return
	   	   }
   	},2)
   }
   
   
   //热搜事件
   show(hotKey,hotList);
   hide(hotKey,hotList);
   
   
   /*---封装的函数---*/
   
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