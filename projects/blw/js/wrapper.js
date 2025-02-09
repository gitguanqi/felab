< script >
document.documentElement.style.fontSize = document.documentElement.clientWidth / 10 + "px";
var myscroll = new IScroll(".wrapper", {
	scrollX: true
});
var btn = document.querySelectorAll(".wrapper li");
var nameid = 0,
	Num = 1,
	url = "http://api.dagoogle.cn/news/get-news?tableNum=",
	url1 = "http://api.dagoogle.cn/news/single-news?&tableNum=";
for (var i = 0; i < btn.length; i++) {
	btn[i].index = i;
	btn[i].onclick = function() {
		Num = this.index + 1;
		if (document.getElementById('jsonp')) {
			document.body.removeChild(document.getElementById('jsonp'))
		}
		var scriptEle = document.createElement('script');
		scriptEle.id = "jsonp"
		scriptEle.src = url + Num + "&callback=fn";
		document.body.appendChild(scriptEle)
	}

}
content.onmousemove = function() {
	var oli = content.querySelectorAll('li');
	for (var a = 0; a < oli.length; a++) {
		oli[a].onclick = function() {
			nameid = this.className
			console.log(nameid)
			if (document.getElementById('jsonp')) {
				document.body.removeChild(document.getElementById('jsonp'))
			}
			var scriptEle = document.createElement('script');
			scriptEle.id = "jsonp"
			scriptEle.src = url1 + Num + "&news_id=" + nameid + "&callback=ff";
			document.body.appendChild(scriptEle)
		}
	}
}

function fn(data) {
	var res = data.data;
	console.log(res)
	var str = ""
	res.forEach(function(item, index) {
		str += '<li class="' + item.news_id + '"><img src="' + item.top_image + '"/><p>' + item.title + '</p></li>'
	})
	content.innerHTML = str;
}

function ff(data) {
	var res = data.data;
	console.log(res)
	var str = "";
	str += '<div class="message"><h4>' + res.title + '</h4><p>' + res.source + '</p><img src="' + res.top_image + '" alt="" /><span>' + res.digest + '</span></div>'
	content.innerHTML = str;
}

< /script>