/*
 * @Author: fegq
 * @Description: This is a header comment.
 * @version: v0.0.1
 * @Date: 2021-05-20 14:51:00
 * @LastEditors: fegq
 * @LastEditTime: 2021-12-02 08:49:03
 */
function goLink (header, nav, navbox, content) {  
    let headerHei = $(header).height();
    $(window).scroll(function () {
        let navs = $(nav);
        let section = $(content);
        let scrollTop = $(this).scrollTop();
        navs.length = section.length;
        section.each(function (i, v) {
            let pos = $(v).offset().top;
            if (pos <= scrollTop + headerHei + 80) {
                navs.eq(i).addClass('active').siblings().removeClass('active');
            }
        });
    })

    
    let navs = $(nav);
    let section = $(content);
    let flag = false;
    navs.click(function () {
        let index = $(this).index();
        let topHeight = section.eq(index).offset().top;
        let top = topHeight - headerHei - 50;
        $('html,body').animate({'scrollTop': top}, 1000);
        $(this).addClass('active').siblings().removeClass('active');
    })
}