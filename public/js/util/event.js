/*
*author: guanqi,
date: 2019.2.1,
content: event uni
*/
var uniHandler= {};
if (document.addEventListener) {
  uniHandler.add = function (elem,eventType,handleEvent,isCapture) {  
    elem.addEventListener(eventType,handleEvent,isCapture);
  }
  uniHandler.remove = function (elem,eventType,handleEvent,isCapture) {  
    elem.removeEventListener(eventType,handleEvent,isCapture);
  }
  uniHandler.stoppro = function (e) {  
    e.stopPropagation();
  };
  uniHandler.prevent = function (e) {  
    e.preventDefault();
  }
} else if (document.attachEvent) {
  uniHandler.add = function (elem,eventType,handleEvent) {  
    elem.attachEvent('on'+eventType,handleEvent);
  }
  uniHandler.remove = function (elem,eventType,handleEvent) {  
    elem.detachEvent('on'+eventType,handleEvent);
  }
  uniHandler.stoppro = function (e) {  
    e.cancelBubble = true;
  };
  uniHandler.prevent = function (e) {  
    e.returnValue = false;
  }
} else {
  uniHandler.eventOrigin = function (elem,eventType,handleEvent) {  
    elem.eventType = handleEvent;
  }
}