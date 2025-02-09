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
	    cartBool = $cls('cart-bool')[0];
	    
	 //获取导航元素
	var detalis = $cls('detail'),
	    bannerTop = $cls('banner-top'),
	    imgsBanner = $querys('.banner-top img'),
	    spansBanner = $querys('.banner-top span'),
	    arrowsBanner = $cls('arrows'),
	    arrowleftBanner = $cls('arrow-left'),
	    arrowrightBanner = $cls('arrow-right');
	
	
	//公告栏
	var amTop = $querys('.announcement-mid-top span'),
	    amBot = $querys('.announcement-mid-bot div');
	    
	//大轮播图
	var bannerTop = $cls('banner-top')[0],
	    bannerContent = $cls('banner-top-content')[0],
	    arrowLeft = $cls('arrow-left')[0],
	    arrowRight = $cls('arrow-right')[0],
	    spansBanner = $querys('.banner-num span');
	
	//服装区轮播图
	var fzBanner = $cls('fz-banner01')[0],
	    fzContent = $cls('fzb-content')[0],
	    fzarrowLeft =$cls('fz-arrow-left')[0],
	    fzarrowRight = $cls('fz-arrow-right')[0],
	    fzSpans = $querys('#fzspans span'),
       fzbtnSpans = $querys('.fwt-right ul .fwt-tab'),
       fwDivs = $querys('.fw-mid .fz001');
       
	//孕婴童区轮播图
	var childBanner = $id('childs'),
	    childContent = $cls('child-content')[0],
	    childarrowLeft = $cls('arrowc-left')[0],
	    childarrowRight = $cls('arrowc-right')[0],
	    childSpans = $querys('#child-span span');
	 
	//定义显示隐藏函数参数
	var a,b,c,d,f,g,h,k,m;
	
	//秒杀区厂商周
	var skTop = $querys('.spans-active-one span'),
	    skBot = $querys('.spike-right-content .srf');

	//版权区热搜词
	var hotKey = $cls('hot-word')[0],
	    hotList = $id('hot-list');
	
	//右侧边区
	var lrBtns = $querys('.sider-top a'),
	    lrSpans = $querys('.sider-top a span'),
	    lrBots = $querys('.sider-bot a'),
	    lrBspans = $querys('.sider-bot a span');
	    
	//左侧边区  
	var sideLeft = $cls('side-left')[0];

	//返回顶部
	var goTop = $id('gotop');
	
	
	
	/*
	 测试区
	 * */
	//console.log(fzLis,fzDivs);



	/*
	 添加事件
	 * */
	
   //城市列表事件
	show(citys,citylist);
	hide(citys,citylist);
	
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
	
	cartBool.onclick = function(e){
		e=e || window.event
		e.preventDefault();
		if(user){
			location.href = "shoppingcart.html"
		}else{
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
   
   //固定导航/左侧事件
   window.onscroll = function(){
   	var scrTopnav = document.documentElement.scrollTop || document.body.scrollTop;
   	if (scrTopnav > 200) {
   		fixLogo.style.display = "block"
   	} else{
   		fixLogo.style.display = "none"
   	}
   	if (scrTopnav < 400) {
   		sideLeft.style.display = "none"
   	} else{
   		sideLeft.style.display = "block"
   	}
   }
   
	//大轮播图事件
	changeImgs(bannerTop,bannerContent,arrowLeft,arrowRight,spansBanner,-8,"active");
	
	//公告栏事件
	announcementEvent(amTop,amBot,"span-active","div-active");
	
	//秒杀区事件
	announcementEvent(skTop,skBot,"spkie-active-one","div-active-one");
	
	
	
	
	//服装区轮播图
	changeImgs(fzBanner,fzContent,fzarrowLeft,fzarrowRight,fzSpans,-4,"fzma-active");
	
	//孕婴童区轮播图事件
	changeImgs(childBanner,childContent,childarrowLeft,childarrowRight,childSpans,-3,"fmactive")
	
	 //版权热搜关键词事件
   show(hotKey,hotList);
   hide(hotKey,hotList);
   
	//侧边区事件
   siderShow(lrBtns[0],lrSpans[0]);
   siderShow(lrBtns[1],lrSpans[1]);
   siderShow(lrBtns[2],lrSpans[2]);
   siderShow(lrBtns[3],lrSpans[3]);
   siderShow(lrBtns[4],lrSpans[4]);
   
	 //二维码事件
   	lrBots[0].onmouseover = function(){
	   	lrBspans[0].style.display = "block"
	   	lrBspans[0].style.left = -160 + "px"
      }
      lrBots[0].onmouseout = function(){
	   	lrBspans[0].style.left = 0 + "px"
	   	lrBspans[0].style.display = "none"
      }
      
	//返回顶部事件
	   goTop.onclick = function(){
	   	var timer = setInterval(function(){
	   		var scrTops = document.documentElement.scrollTop || document.body.scrollTop;
	   		scrTops -= 60
	   		if (document.documentElement.scrollTop) {
	   			document.documentElement.scrollTop = scrTops
	   		} else{
	   			document.body.scrollTop = scrTops
	   		}
	   		if (scrTops < 0){
	   			clearInterval(timer);
	   			return
	   		}
	   	},2)
	   }
	   
	   
	   
	   
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
	 *2. 选项卡模块
	 * 
	 * */
   function announcementEvent(f,g,clsa,clsb){
   	var f,g,clsa,clsb;
		for (var i=0,len=f.length;i<len;i++) {
			;(function(index){
				f[i].onmouseover=function(){
					for (var j=0;j<f.length;j++) {
						g[j].className=""
						f[j].className=""
					}
					g[index].className= clsb
					this.className= clsa
				}
			})(i)
		}
	}

	/*
	 3.轮播图模块
	 * 
	 * */
	function changeImgs(bigbanner,contentbanner,arrowl,arrowr,spanbtn,numbanner,clsx){
		var imgWidth=bigbanner.offsetWidth;
		var num=0;
		var timer=null;
		arrowl.onclick = function(e){
	   	e=e || window.event
	   	e.preventDefault();
	   	num--
	   	if (num === numbanner) {
	   		num=0
	   	}
	   	changeBanner(Math.abs(num))
	   }
	   arrowr.onclick=function(e){
	   	e=e || window.event
	   	e.preventDefault();
	   	if (num ===0 ) {
	   		num=numbanner
	   	}
	   	num++
	   	changeBanner(Math.abs(num))
	   }
	   for (var i=0,len=spanbtn.length;i<len;i++) {
	   	spanbtn[i].index=i
	   	spanbtn[i].onclick=function(){
	   		num= -this.index
	         changeBanner(Math.abs(num))
	   	}
	   }
	   intervalBanner();
	   function changeBanner(index){
	   	for (var j=0;j<len;j++) {
	   		spanbtn[j].className=""
	   	}
	   	spanbtn[index].className=clsx
	   	contentbanner.style.left=num*imgWidth + "px"
	   }
	   function intervalBanner(){
	   	timer = setInterval(function(){
	   		num--
	   		if (num === numbanner) {
	   			num=0
	   		}
	   		changeBanner(Math.abs(num))
	   	},2000)
	   }
	   bigbanner.onmouseover=function(){
	   	clearInterval(timer);
	   	arrowl.style.display="block"
	   	arrowr.style.display="block"
	   }
	   bigbanner.onmouseout=function(){
	   	intervalBanner()
	   	arrowl.style.display="none"
	   	arrowr.style.display="none"
	   }
	}
	
	 /* 
    * 4.右侧滑动函数模块
    * */
   function siderShow(a,b){
   	a.onmouseover = function(){
	   	b.style.display = "block"
	   	b.style.left = -79 + "px"
      }
      a.onmouseout = function(){
	   	b.style.left = 0 + "px"
	   	b.style.display = "none"
      }
   }	
   
	/*
	 5.cookie函数模块
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

function Tab(btns,contents,btnsact,consact){
	_this = this;
	this.btns = btns;
	this.contents = contents;
	this.btnsact = btnsact;
	this.consact = consact;
	this.len = this.btns.length;
	for (var i=0;i<this.len;i++) {
		(function(index){
			this.btns[index].onmouseover = function(){
				_this.tab(index,btnsact,consact);
			}
		})(i)
	}
}
Tab.prototype.tab = function(index,btnsact,consact){
	for (var j=0;j<this.len;j++) {
		this.btns[j].classList.remove(btnsact)
		this.contents[j].classList.remove(consact)
	}
	this.btns[index].classList.add(btnsact)
	this.contents[index].classList.add(consact)
}

function TabLimit(libtns,licontents,libtnsact,liconsact){
	Tab.call(this,libtns,licontents,libtnsact,liconsact)
}