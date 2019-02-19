/*
author: guanqi;
date: 2018.11.4
content: 选项卡切换功能
comment: 这里使用原生写的，所以不需要引用其他js库或者框架。
*/
// 这里是使用js的原型模式创造的类对象。
function Tab(btns) {
    var _this = this;
    var len = btns.length;
    this.btns = btns;
    this.len = len;
    for (var i = 0; i < this.len; i++) {
        this.btns[i].index = i;
        this.btns[i].onclick = function () {
            _this.toggleTabs(_this, this.index);
        }
    }
}
// 这是一个对象的方法，用来切换选项卡的。
Tab.prototype.toggleTabs = function (obj, index) {
    for (var j = 0; j < obj.len; j++) {
        obj.btns[j].className = '';
    }
    obj.btns[index].className = 'active';
}