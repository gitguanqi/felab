<template>
	<div class="nav">
		<a href="/" class="logo"></a>
		<ul>
			<li class="col-xs-3"><router-link class="index" to="/">首页</router-link></li>
			<li class="col-xs-3"><router-link class="movie" to="/movie">电影</router-link></li>
			<li class="col-xs-3"><router-link class="book" to="">图书</router-link></li>
			<li class="col-xs-3"><router-link class="me" to="/me">我的</router-link></li>
			<li class="col-xs-3"><router-link class="search" to="/search"></router-link></li>
		</ul>
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style scoped="scoped">
	html,body{
		height: 100%;
	}
	ul,li{
		margin: 0;
		padding: 0;
		border: none;
		list-style: none;
	}
	a{
		text-decoration: none;
		color: #333;
	}
	.nav{
		position: fixed;
		top: 0;
		right: 0;
		width: 100%;
		height: 1.2rem;
		line-height: 1.2rem;
		background: #fff;
		text-align: center;
		border-bottom: 0.05rem solid #eee;
		z-index: 999;
	}
	.nav ul{
		position: fixed;
		top: 0;
		right: 0;
		width: 75%;
		height: 1.2rem;
		line-height: 1.2rem;
		text-align: center;
		z-index: 999;
	}
	.nav ul li{
		float: left;
		width: 17%;
		font-size: 0.32rem;
   }
   .nav ul li:first-child{
   	margin-left: 0.6rem;
   }
   .nav ul li a{
   	float: left;
   	display: block;
   	width: 100%;
   	height: 1.2rem;
   }
   .logo{
   	display: block;
   	width: 1.5rem;
   	margin-left: 0.2rem;
   	margin-right: 1.5rem;
   	height: 1.2rem;
   	background: url("../assets/images/logo.png") no-repeat center;
   	background-size: 1.15rem;
   }
   .index{
   	color: #2384E8;
   }
   .movie{
   	color: #9F7860;
   }
   .book{
   	color: #2AB8CC;
   }
   .me{
   	color: #E4A813;
   }
   .search{
   	height: 1.2rem;
   	background: url("../assets/images/search.png") no-repeat center;
   	background-size: 0.6rem;
   }
</style>