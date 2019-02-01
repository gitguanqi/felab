/** 
 * author:guanqi,
 * date:2019.1.31,
 * content:element drag
*/
function DragElement(elem) {
  this.elem = elem;
  var _this = this;
  _this.winWidth = document.documentElement.clientWidth;
  _this.winHeight = document.documentElement.clientHeight;
  window.onresize = function () {  
    _this.winWidth = document.documentElement.clientWidth;
    _this.winHeight = document.documentElement.clientHeight;
  }
  this.elem.onmousedown = function (e) {
    var e = e || window.event;
    var disX = e.clientX - this.offsetLeft;
    var disY = e.clientY - this.offsetTop;
    document.onmousemove = function (e) {
      var e = e || window.event;
      var l,t;
      l = e.clientX - disX;
      t = e.clientY - disY;
      _this.move(_this,l,t);
    }
    document.onmouseup = function () {
      _this.cancel();
    }
  }
}

DragElement.prototype.move = function (_this,l,t) {
  var elem = _this.elem;
  if ((l + elem.offsetWidth) > _this.winWidth) {
    l = _this.winWidth - elem.offsetWidth;
  }
  if (l < 0) { l = 0; }
  if ((t + elem.offsetHeight) > _this.winHeight) {
    t = _this.winHeight - elem.offsetHeight;
  }
  if (t < 0) { t = 0; }
  elem.style.left = l + 'px';
  elem.style.top = t + 'px';
}

DragElement.prototype.cancel = function () {
  document.onmousemove = null;
  document.onmouseup = null;
}