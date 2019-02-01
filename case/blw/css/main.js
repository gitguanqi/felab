window.onload = fontSi;
function fontSi(){
	document.documentElement.style.fontSize = 
	document.documentElement.clientWidth / 8 + 'px'
}
var more = document.querySelector('.more'),
    back = document.querySelector('.back'),
    totop = document.querySelector('.totop'),
    navlist = document.querySelector('.navlist');
more.onclick = function(e){
	e=e || window.event;
	e.preventDefault();
	navlist.style.display = "block"
	more.style.display = "none"
}
back.onclick = function(e){
	e=e || window.event;
	e.preventDefault();
	navlist.style.display = "none"
	more.style.display = "block"
}
window.onscroll = function(){
	var scrTop = document.documentElement.scrollTop || document.body.scrollTop;
	scrTop += 10;
	if (scrTop > 100) {
		totop.style.display = "block";
	}
	if (scrTop < 100) {
		totop.style.display = "none";
	}
	
}
totop.onclick = function(e){
	e=e || window.event;
	e.preventDefault();
	var timer = setInterval(function(){
		var scrTops = document.documentElement.scrollTop || document.body.scrollTop;
		scrTops -= 30
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