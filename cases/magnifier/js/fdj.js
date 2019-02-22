;
(function ($w, $d) {
	var $cls = function (cls, parent) {
		parent = parent || $d;
		return parent.getElementsByClassName(cls)
	}
	var $clsOne = function (cls, parent) {
		parent = parent || $d;
		return parent.getElementsByClassName(cls)[0]
	}
	var $tag = function (tag, parent) {
		parent = parent || $d;
		return parent.getElementsByTagName(tag)
	}
	var $id = function (id) {
		return $d.getElementById(id);
	}
	var contentS = $clsOne('content-s'),
		contentB = $clsOne('content-b'),
		contentM = $clsOne('content-m'),
		imgS = $tag('img', contentS),
		imgB = $id('img-b'),
		imgM = $id('img-m'),
		magnifier = $id('magnifier'),
		modal = $clsOne('modal'),
		carouselLeft = $clsOne('carousel-left'),
		carouselRight = $clsOne('carousel-right'),
		carouselImg = $tag('img', carouselRight),
		carouselArrowLeft = $clsOne('arrow-left'),
		carouselArrowRight = $clsOne('arrow-right'),
		contentMWidth = contentM.offsetWidth;
	var disX,
		disY,
		magnifierWidth,
		magnifierWidthHalf,
		SCALE = 2,
		_url = "img/b01.png",
		num = 1,
		len = imgS.length;

	var showModal = function (num) {
		changeModalImage(num)
		modal.className = "modal"
	}

	var changeModalImage = function () {
		carouselLeft.style.backgroundImage = "url(img/b0" + num + '.png)'
		for (var j = 0; j < len; j++) {
			carouselImg[j].className = ""
		}
		carouselImg[num - 1].className = "active"
	}
	for (var i = 0; i < len; i++) {
		;
		(function (index) {
			imgS[index].onmouseover = function () {
				imgM.src = "img/m0" + (index + 1) + ".webp.jpg"
				//设置自定义属性 存储高清图片的地址，方便后边取
				var _url = "img/b0" + (index + 1) + ".png"
				imgM.setAttribute('data-url', _url)

				num = index + 1
				for (var j = 0; j < len; j++) {
					imgS[j].className = ""
				}
				this.className = "active"
			}
			imgS[index].onclick = function () {
				showModal(num)
			}
			/*contentM[index].onclick = function(){
					showModal(num)
				}*/
		})(i)
	}
	contentM.onmouseover = function () {
		magnifier.className = "magnifier";
		magnifierWidth = magnifier.offsetWidth;
		magnifierWidthHalf = magnifierWidth / 2;
		contentB.className = "content-b";
		imgB.src = imgM.getAttribute("data-url") || _url; //不是高清图片
	}
	contentM.onmouseout = function () {
		magnifier.className = "magnifier hidden"
		contentB.className = "content-b hidden"

	}
	contentM.onmousemove = function (e) {
		e = e || window.event;
		e.preventDefault();
		disX = e.clientX - contentM.offsetLeft;
		disY = e.clientY - contentM.offsetTop;
		var l = disX - magnifierWidthHalf;
		t = disY - magnifierWidthHalf;

		if (l < 0) {
			l = 0
		}
		if (l > (contentMWidth - magnifierWidth)) {
			l = contentMWidth - magnifierWidth
		}
		if (t < 0) {
			t = 0
		}
		if (t > (contentMWidth - magnifierWidth)) {
			t = contentMWidth - magnifierWidth
		}
		//console.log(disX,disY)

		magnifier.style.left = l + "px";
		magnifier.style.top = t + "px";

		var imgBLeft = l * SCALE,
			imgBTop = t * SCALE;

		imgB.style.left = -imgBLeft + 'px';
		imgB.style.top = -imgBTop + 'px';

	}
	modal.onclick = function (e) {
		e = e || window.event;
		if (e.target.className === 'modal') {
			modal.className = "modal hidden"
		}
	}
	carouselArrowLeft.onclick = function () {
		if (num === 1) {
			num = len + 1
		}
		num--
		changeModalImage(num)
	}
	carouselArrowRight.onclick = function () {
		if (num === len) {
			num = 0
		}
		num++
		changeModalImage(num)
	}
	for (var i = 0; i < len; i++) {
		;
		(function (index) {
			carouselImg[index].onclick = function () {
				num = index + 1
				changeModalImage(num)
			}
		})(i)
	}
})(window, document)