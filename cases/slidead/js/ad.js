function initAdSlide (id) {

    var xin = true,
    yin = true;
    var step = 1;
    var delay = 10;
    var $obj;

    $obj = $(id);
    var time = window.setInterval(move, delay);
    $obj.mouseover(function () {
        clearInterval(time)
    });
    $obj.mouseout(function () {
        time = window.setInterval(move, delay)
    });

    function move() {
        var left = $obj.offset().left;
        var top = $obj.offset().top;
        var L = T = 0; //左边界和顶部边界
        var R = $(window).width() - $obj.width(); // 右边界
        var B = $(window).height() - $obj.height(); //下边界

        //难点:怎样判断广告的4个边框有没有超出可视化范围!
        if (left < L) {
            xin = true; // 水平向右移动
        }
        if (left > R) {
            xin = false;
        }
        if (top < T) {
            yin = true;
        }
        if (top > B) {
            yin = false;
        }
        //根据有没有超出范围来确定广告的移动方向
        left += step * (xin == true ? 1 : -1);
        top += step * (yin == true ? 1 : -1);
        // 给div 元素重新定位
        $obj.offset({
            top: top,
            left: left
        })
    }
}