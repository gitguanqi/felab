/*
author:gianqi;
date:2019.2.15;
comment:验证表单样式;
*/
'use strict';
var btn = document.querySelector('.btn');
var tip = document.querySelectorAll('.tip');

function checkForm() {
	if (document.login.username.value == '') {
		tip[0].style.display = 'block';
		tip[0].innerText = '用户名不能为空！';
		return false;
	} else if (document.login.password.value == '') {
		tip[0].style.display = 'none';
		tip[1].style.display = 'block';
		tip[1].innerText = '密码不能为空！';
		return false;
	} else {
		alert('登录成功!');
		setTimeout(() => {
			location.href = '/';
		}, 1000);
		return false;
	}
}