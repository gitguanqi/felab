/*
 * @Autor: MarkGuan
 * @Date: 2022-09-29 09:48:39
 * @LastEditors: MarkGuan
 * @LastEditTime: 2023-06-10 20:12:13
 * @Description: This a file description.
 */
/**
 * @author: MarkGuan
 * @description: go link
 * @return {*}
 */
(function () {
  if (location.search) {
    let url = decodeURIComponent(location.search.split("?")[1].split("=")[1]);
    if (url && url.indexOf("http") > -1) {
      setTimeout(function () {
        location = url;
      }, 886);
    } else {
      alert("暂无链接！");
      window.history.back();
    }
  } else {
    location.href = "../";
  }
})();
