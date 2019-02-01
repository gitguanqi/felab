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
	

   //获取元素
   var hotKey = $cls('hot-word')[0],
	    hotList = $id('hot-list');

   //测试
   console.log(hotKey,hotKey);
   

   //添加事件
   show(hotKey,hotList);
   hide(hotKey,hotList);
   

      /*
	 * 显示隐藏函数模块
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
	
})(document)
