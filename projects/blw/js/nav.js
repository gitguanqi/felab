window.onload = fontSi;
function fontSi(){
	document.documentElement.style.fontSize = 
	document.documentElement.clientWidth / 8 + 'px'
}
/*移入变色事件*/
var a1=document.querySelectorAll("ul li a");

console.log(a1)
/*a1.onclick=function(e){
	e=e || window.event;
	e.preventDefault();
	a1.style.color="#f00" ;
}*/
			
for(var i=0;i<a1.length;i++){
				a1[i].index=i
				a1[i].onclick=function(){
					var _index=this.index
					for(var j=0;j<a1.length;j++){
						a1[j].className=""
					}
					this.className="active"
				}
			}
			