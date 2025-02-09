/*
 v1.0 application 58同城
 author：Mr.Mark 
 date:2017-9-5
 * */
/*---字体设置---*/
document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + 'px';
var app = document.getElementsByClassName('app')[0];
var close = document.getElementById('close');
var ctop = document.getElementsByClassName('c-top')[0];
close.onclick = function () {
	app.style.display = 'none';
}
if (ctop != undefined) {
	ctop.onclick = function (e) {
		e = e || window.event;
		e.preventDefault();
		var timer = setInterval(function () {
			var scrTops = document.documentElement.scrollTop || document.body.scrollTop;
			scrTops -= 50
			if (document.documentElement.scrollTop) {
				document.documentElement.scrollTop = scrTops
			} else {
				document.body.scrollTop = scrTops
			}
			if (scrTops < 0) {
				clearInterval(timer);
				return
			}
		}, 2)
	}
	window.onscroll = function (e) {
		e = e || window.event
		e.preventDefault();
		var scrTopnav = document.documentElement.scrollTop || document.body.scrollTop;
		if (scrTopnav > 800) {
			ctop.style.display = "block"
		} else {
			ctop.style.display = "none"
		}
	}
}