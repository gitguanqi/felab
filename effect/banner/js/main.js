/*
author: guanqi;
date: 2018.11.4
content: 轮播图页面效果
*/
// 实例化对象
function Carousels(isAuto,box, banner, lis, point, arrowLeft, arrowRight, active, boxWidth, bannerWidth, liWidth) {
    var _this = this;
    this.box = _this.getOne(box); // 获取外面大框
    this.banner = _this.getOne(banner); //获取列表框
    this.boxWidth = boxWidth; // 获取外面大框宽度
    this.bannerWidth = bannerWidth; //获取列表框宽度
    this.lis = _this.getAll(lis); // 获取所有图片列表
    this.liWidth = liWidth; // 获取所有图片列表宽度
    this.points = _this.getAll(point); // 获取所有指示灯列表
    this.arrowLeft = _this.getOne(arrowLeft); //获取左箭头
    this.arrowRight = _this.getOne(arrowRight); //获取右箭头
    this.active = active; //点样式
    this.len = this.lis.length; //长度
    this.num = 0;
    this.timer = null; //计时器
    this.isAuto = isAuto; //是否自动轮播
    this.arrowLeft.onclick = function () { //左箭头点击
        clearInterval(_this.timer);
        if (_this.num <= _this.len && _this.num > 0) {
            _this.num--;
            _this.moveBanner(_this);
        }
    };
    this.arrowLeft.onmouseover = function () {//鼠标移入左箭头
        clearInterval(_this.timer);
    };
    this.arrowLeft.onmouseout = function () {//鼠标移入出左箭头
        _this.autoPlay(_this);
    };
    this.arrowRight.onclick = function () {//右箭头点击
        clearInterval(_this.timer);
        if (_this.num < _this.len - 1) {
            _this.num++;
            _this.moveBanner(_this);
        }
    }
    this.arrowRight.onmouseover = function () {//鼠标移入右箭头
        clearInterval(_this.timer);
    };
    this.arrowRight.onmouseout = function () {//鼠标移出右箭头
        _this.autoPlay(_this);
    };
    this.box.onmouseover = function () {//鼠标移入图片
        clearInterval(_this.timer);
    };
    this.box.onmouseout = function () {//鼠标移出图片
        _this.autoPlay(_this);
    };
    for (var i = 0; i < _this.len; i++) {; //鼠标移入红点
        (function (index) {
            _this.points[index].onmouseover = function () {
                _this.changePointStyle(_this, index);
                var MoveWidth = -(_this.liWidth) * index;
                _this.banner.style.left = MoveWidth + 'px';
            }
        })(i)
    }
    if (isAuto) { //是否自动播放
        _this.autoPlay(_this);
    }
}
Carousels.prototype.getCls = function (elem) { //通过class
    var res = document.getElementById(elem);
    return res;
}
Carousels.prototype.getClsOne = function (elem) { //通过class获取一个
    var res = document.getElementsByClassName(elem)[0];
    return res;
}
Carousels.prototype.getCls = function (elem) { //通过class
    var res = document.getElementsByClassName(elem);
    return res;
}
Carousels.prototype.getTag = function (elem) { //通过标签
    var res = document.getElementsByTagName(elem);
    return res;
}
Carousels.prototype.getOne = function (elem) { //获取任意一个
    var res = document.querySelector(elem);
    return res;
}
Carousels.prototype.getAll = function (elem) { //获取全部
    var res = document.querySelectorAll(elem);
    return res;
}
Carousels.prototype.moveBanner = function (obj) { //移动图片
    var MoveWidth = -(obj.liWidth) * (obj.num);
    obj.banner.style.left = MoveWidth + 'px';
    obj.changePointStyle(obj, obj.num);
}
Carousels.prototype.changePointStyle = function (obj, num) { // 改变红点样式
    var index = num;
    for (var j = 0; j < obj.len; j++) {
        obj.points[j].className = '';
    }
    obj.points[index].className = obj.active;
}
Carousels.prototype.autoPlay = function (obj) { //自动播放
    obj.timer = setInterval(function () {
        if (obj.num < obj.len - 1) {
            obj.num++;
            obj.moveBanner(obj);
        } else {
            obj.num = 0;
            obj.moveBanner(obj);
        }
    },3000);
}