
 //获取cookie
 function getCookie(key){
    var _cookie = document.cookie;	//username=wally; age=17; sex=man
    var arr = _cookie.split(";");
    for(var i=0;i<arr.length;i++){
        if(arr[i].split("=")[0].trim() === key){
            return arr[i].split("=")[1]
        }
    }
}
 function removeCookie(key){
         setCookie(key,null,-1)
  }
function setCookie(key, value, time){
            var date = new Date()
            date.setDate(date.getDate() + time) // 当前时间 + 30天
            document.cookie = key + "=" + encodeURIComponent(value) + ";expires=" + date
        }




var btn=document.getElementsByClassName("logi")[0];

                function setCookie(key, value, time){
                var date = new Date()
                date.setDate(date.getDate() + time) 
                document.cookie = key + "=" + encodeURIComponent(value) + ";expires=" + date
        }
                btn.onclick=function(e){
        e=e||window.event;
        e.preventDefault();
        if(username.value){
                setCookie("username", username.value, 7)
                location.href="index.html";
                }	
   
}                                                                                         /* 存cookie*/



var reg = /^[1][3,5,8,7][0-9]{9,9}$/g
                
                username.onchange = function(){
                        var _val = this.value;
                        if(reg.test(_val)){
                                msg.innerText = "格式正确"
                        }else{
                                msg.innerText = "请输入正确的账号"
                        }
                }