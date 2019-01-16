<template>
	<div class="me">
		<div class="me-info">
			<div class="meimg">		
			</div>
			<div class="mi-right">
				<span class="me-name">小奇</span><br/>
				<span class="me-id">ID:<strong class="me-idname">jcguanqi</strong></span>
				<a class="profile">个人主页<i>&gt;</i></a><br/>
				<hr/>
				<span class="focus">
					关注<strong>0</strong>
				</span>
				<span class="focus">
					被关注<strong>0</strong>
				</span>
			</div>
		</div>
		<div class="me-tabs">
			<router-link to="/love" class="tabs"><i class="meicon meicon1"></i><span class="medes">喜欢</span></router-link>
			<a class="tabs"><i class="meicon meicon2"></i><span class="medes">日记</span></a>
			<a class="tabs"><i class="meicon meicon3"></i><span class="medes">相册</span></a>
			<a class="tabs"><i class="meicon meicon4"></i><span class="medes">我的广播</span></a><hr/>
			<a class="tabs"><i class="meicon meicon5"></i><span class="medes">电影/电视</span></a>
			<a class="tabs"><i class="meicon meicon6"></i><span class="medes">读书</span></a>
			<a class="tabs"><i class="meicon meicon7"></i><span class="medes">音乐</span></a>
			<a class="tabs"><i class="meicon meicon8"></i><span class="medes">我的豆列</span></a><hr/>
			<a class="tabs"><i class="meicon meicon9"></i><span class="medes">同城活动</span></a>
		</div>
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		
	}
</script>

<style scoped="scoped">
	.me{
		margin-top: 1.1rem;
		background-color: #f8f8f8;
		z-index: 9999;
	}
	.me-info{
		padding: 0.5rem 0.3rem;
		width: 100%;
		height: 3rem;
		background: rgba(0,0,0,0.6);
		color: #fff;
	}
	.meimg{
		margin-left: 0.15rem;
		margin-right: 0.25rem;
		float: left;
		width: 1.8rem;
		height: 1.8rem;
		border: 0.08rem solid #fff;
		border-radius: 1rem;
		overflow: hidden;
		background: url("../assets/images/headimg.jpg") no-repeat center;
		background-size: 80px;
	}
	.meimg img{
		width: 1.9rem;
		height: 1.9rem;
	}
	.mi-right{
		padding: 0.1rem;
		float: left;
		width: 5.2rem;
	}
	.mi-right hr{
		margin: 0;
		color: #f00;
		margin-top: 0.1rem;
		margin-bottom: 0.13rem;
		padding-top: 0.15rem;
	}
	.me-name{
		font-size: 0.45rem;
	}
	.me-idname{
		margin-left: 0.02rem;
	}
	.mi-right strong{
		font-weight: 400;
	}
	.me-id{
		font-size: 0.3rem;
	}
	.profile{
		color: #fff;
		margin-left: 1.76rem;
		font-size: 0.33rem;
	}
	.profile i{
		color: #eee;
		margin-left: 0.08rem;
		height: 0.7rem;
	}
	.focus{
		margin-top: 0.5rem;
		font-size: 0.32rem;
		margin-right: 0.45rem;
	}
	.focus strong{
		margin-left: 0.1rem;
	}
	.me-tabs{
		margin-top: 0.5rem;
		width: 100%;
		height: 7rem;
		background-color: #fff;
	}
	.tabs{
		position: relative;
		display: block;
		float: left;
		width: 2rem;
		height: 2rem;
		line-height: 2rem;
		text-align: center;
	}
	.meicon{
		position: absolute;
		top: 0.35rem;
		left: 0.6rem;
		display: block;
		width: 0.75rem;
		height: 0.75rem;
		border-radius: 0.1rem;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 0.55rem;
	} 
	.meicon1{
		background-image: url("../assets/images/love.png");
	}
	.meicon2{
		background-image: url("../assets/images/riji.png");
	}
	.meicon3{
		background-image: url("../assets/images/xiangce.png");
	}
	.meicon4{
		background-image: url("../assets/images/gb.png");
	}
	.meicon5{
		background-image: url("../assets/images/tv.png");
	}
	.meicon6{
		background-image: url("../assets/images/read.png");
	}
	.meicon7{
		background-image: url("../assets/images/y.png");
	}
	.meicon8{
		background-image: url("../assets/images/list.png");
	}
	.meicon9{
		background-image: url("../assets/images/act.png");
	}
	.medes{
		position: relative;
		top: 0.5rem;
		color: #666;
		font-size: 0.3rem;
	}
</style>