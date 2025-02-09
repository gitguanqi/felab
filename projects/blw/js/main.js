window.onload = fontSi;
function fontSi(){
	document.documentElement.style.fontSize = 
	document.documentElement.clientWidth / 8 + 'px'
}
var more = document.querySelector('.more'),
    back = document.querySelector('.back'),
    totop = document.querySelector('.totop'),
    navlist = document.querySelector('.navlist');
if (more) {
	more.onclick = function(e){
		e=e || window.event;
		e.preventDefault();
		navlist.style.display = "block"
		more.style.display = "none"
	}
}

if (back) {
	back.onclick = function(e){
		e=e || window.event;
		e.preventDefault();
		navlist.style.display = "none"
		more.style.display = "block"
	}
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

if (totop) {
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
}

window.onresize = function () {
	let clientWin = document.documentElement.clientWidth ||
	document.body.clientWidth || screen.width;
	if (clientWin <= 768) {
		window.location.href = './index.html';
	} else {
		window.location.href = './default.html';
	}
}