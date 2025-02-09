/*
 * @Autor: MarkGuan
 * @Date: 2022-09-29 10:39:55
 * @LastEditors: MarkGuan
 * @LastEditTime: 2022-10-31 10:53:30
 * @Description: This a px to rem calc.
 */
/**
 * @author: MarkGuan
 * @description: This a px to rem calc
 * @return {*}
 */
function calcRem() {
  let clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
  if (clientWidth <= 750) {
    document.documentElement.style.fontSize = clientWidth / 23.4375 + "px";
  } else {
    document.documentElement.style.fontSize = 16 + "px";
  }
}
calcRem();

window.addEventListener("resize", calcRem, false);
