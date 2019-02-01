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
	    
	    
   //获取购物车加减
   var plusBtn = $id('plus'),
       reduceBtn = $id('reduce'),
       countBox = $id('count'),
       plusBtno = $id('plus-one'),
       reduceBtno = $id('reduce-one'),
       countBoxo = $id('count-one'),
       goodsPrice = $id('goods-price').innerHTML,
       allPrice = $id('all-price'),
       goodsPriceo = $id('goods-price-one').innerHTML,
       allPriceo = $id('all-price-one'),
       amountAll = $cls('amountall')[0],
       priceB = $cls('price-b')[0],
       checkOne = $cls('checkone'),
       checkAll = $id('checkall'),
       checkAlli = $id('checkalli'),
       priceActive = $cls('price-box')[0],
       cartShopone = $cls('cart-shop')[0],
       cartShoptwo = $cls('cart-shop')[1],
       delOne = $id('del-one'),
       delTwo = $id('del-two'),
       delAll = $id('del-all');
   
   //加减函数变量
   var btnNames, //按钮+
       btnoNames, //按钮-
       countValues, //件数值
       anyPrices, //总价格
       bfPrices, //现在价格
       allPrices, //结算价格
       allAounts; //结算数量
  
  
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
	
	//购物车件数事件
	
	
	
	
	//加减
	addReduce(plusBtn,reduceBtn,countBox,allPrice,goodsPrice,priceB,amountAll);
	addReduce(plusBtno,reduceBtno,countBoxo,allPriceo,goodsPriceo,priceB,amountAll);
	function addReduce(btnNames,btnoNames,countValues,anyPrices,bfPrices,allPrices,allAounts){
		btnNames.onclick = function(){
	   	if(countValues.value < 100 && countValues.value>0){
	   	  countValues.value ++;
	   	  anyPrices.innerHTML = parseFloat(countValues.value*bfPrices);
	   	  allAounts.innerHTML = parseFloat(countValues.value);
		     allPrices.innerHTML = parseFloat(anyPrices.innerHTML);
	   	}
	   }
		btnoNames.onclick = function(){
	   	if(countValues.value >1){
	   	  countValues.value --;
	   	  anyPrices.innerHTML = parseFloat(countValues.value*bfPrices);
	   	  allAounts.innerHTML = parseFloat(countValues.value);
		     allPrices.innerHTML = parseFloat(anyPrices.innerHTML);
	   	}
	   }
		
	}
	
	
   //全选与不选
   checkAll.onclick=function(){
   	if (checkAll.checked == true) {
   		for(i=0;i<checkOne.length;i++){
		       checkOne[i].checked = true
		        var _one = parseFloat(countBox.value),
		           _two = parseFloat(countBoxo.value),
		           _three = parseFloat(allPrice.innerHTML),
		           _four = parseFloat(allPriceo.innerHTML);
		       amountAll.innerHTML = _one + _two
	   	    priceB.innerHTML = _three + _four
		    }
   		checkAlli.checked = true
   		priceActive.className = "price-box-active"
	   }
      if (checkAll.checked == false) {
   		for(i=0;i<checkOne.length;i++){
		       checkOne[i].checked = false
		    }
   		checkAlli.checked = false
   		amountAll.innerHTML = "0"
	   	priceB.innerHTML = "0.00"
   		priceActive.className = "price-box"
   	}
   		
   }
   
   checkAlli.onclick=function(){
   	if (checkAlli.checked == true) {
   		for(i=0;i<checkOne.length;i++){
		       checkOne[i].checked = true
		       var _one = parseFloat(countBox.value),
		           _two = parseFloat(countBoxo.value),
		           _three = parseFloat(allPrice.innerHTML),
		           _four = parseFloat(allPriceo.innerHTML);
		       amountAll.innerHTML = _one + _two
	   	    priceB.innerHTML = _three + _four
		    }
   		checkAll.checked = true
   		priceActive.className = "price-box-active"
   	}
   	if (checkAlli.checked == false) {
   		for(i=0;i<checkOne.length;i++){
		       checkOne[i].checked = false
		    }
   		checkAll.checked = false
   		amountAll.innerHTML = "0"
	   	priceB.innerHTML = "0.00"
   		priceActive.className = "price-box"
   	}
   }
   
   //中间选择
   checkO(checkOne[0],checkOne[1],countBox,allPrice);
   checkO(checkOne[2],checkOne[3],countBoxo,allPriceo);
   function checkO(a,b,c,d){
   	var a,b,c,d;
   	a.onclick = function(){
	   	if (a.checked == true) {
	   		b.checked = true
	   		amountAll.innerHTML = parseFloat(c.value);
		      priceB.innerHTML = parseFloat(d.innerHTML);
	   	}
	   	if (a.checked == false) {
	   		b.checked = false
	   		amountAll.innerHTML = "0"
	   	   priceB.innerHTML = "0.00"
	   	}
	   }
   	b.onclick = function(){
	   	if (b.checked == true) {
	   		a.checked = true
	   		amountAll.innerHTML = parseFloat(c.value);
		      priceB.innerHTML = parseFloat(d.innerHTML);
	   	}
	   	if (b.checked == false) {
	   		a.checked = false
	   		amountAll.innerHTML = "0"
	   	   priceB.innerHTML = "0.00"
	   	}
	   }
   }
   
   //删除商品事件
	cartShop = cartShopone.parentElement;
	cartShops = cartShoptwo.parentElement;
	console.log(cartShop,cartShops);
	
		delOne.onclick = function(e){
			e=e || window.event
			e.preventDefault();
			cartShop.removeChild(cartShopone);
			amountAll.innerHTML = "0"
		   priceB.innerHTML = "0.00"
		}
		delTwo.onclick = function(e){
			e=e || window.event
			e.preventDefault();
			cartShops.removeChild(cartShoptwo)
			amountAll.innerHTML = "0"
		   priceB.innerHTML = "0.00"
		}
		delAll.onclick = function(e){
			e=e || window.event
			e.preventDefault();
			cartShop.removeChild(cartShopone);
			cartShops.removeChild(cartShoptwo);
			amountAll.innerHTML = "0"
		   priceB.innerHTML = "0.00"
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
