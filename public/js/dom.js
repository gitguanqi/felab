/**
 *author:guanqi,
 *date: 2019.2.1,
 *content: dom set
 * @param {*} name
 * @returns
 */
if (!window.domSet) {
  var domSet = {};
}
domSet.getElem = function (name,tagname) {
  var result;
  var $d = document;
  if (name.indexOf('#') != -1) {
    name = name.split('#')[1];
    result = $d.getElementById(name);
  } else if (name.indexOf('.') != -1) {
    name = name.split('.')[1];
    if (!document.getElementsByClassName) {
      result = $d.getElementsByTagName(tagname);
    } else {
      result = $d.getElementsByClassName(name);
    }
  } else if (name.indexOf('%') != -1) {
    name = name.split('%')[1];
    result = $d.getElementsByTagName(name);
  } else if (name.indexOf('&') != -1) {
    name = name.split('&')[1];
    result = $d.getElementsByName(name);
  }
  return result;
}