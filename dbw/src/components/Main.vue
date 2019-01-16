<template>
	<div class="main">
		<div class="four-block">
			<a href="">影院热映</a>
			<a href="">豆瓣日历</a>
			<a href="">豆瓣时间</a>
			<a href="">使用豆瓣App</a>
		</div>
		<div class="ads">
			<div class="ads-block" v-for="(ad,index) in adsdata" :key="index">
				<h3>{{ad.title}}</h3>
				<p>{{ad.target.desc}}</p>
				<span>By<i>{{ad.target.author.name}}</i></span>
				<img :src="ad.target.cover_url" alt="ad.title" />
				<button class="save" @click="addSave(ad.id)"></button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				flag: false,
				isShow: false
			}
		},
		computed: {
		  	adsdata () {
		  		return this.$store.state.adsdata			
		  	}
		},
		methods: {
			addSave (mid) {
			   this.$store.commit('ADD_SAVE',mid)
			}
		}
	}
</script>

<style scoped="scoped">
	.main{
		margin-top: 1.2rem;
	}
	.four-block{
		padding: 0.4rem 0.3rem;
		width: 100%;
		height: 3rem;
	}
	.four-block a{
		margin-left: 0.2rem;
		margin-top: 0.2rem;
		display: block;
		float: left;
		width: 3.2rem;
		height: 1rem;
		line-height: 1rem;
		background: #f8f8f8;
		text-align: center;
		border-radius: 0.1rem;
		color: #333;
	}
	.ads{
		padding: 0.2rem 0.3rem;
		width: 100%;
		height: auto;
	}
	.ads-block{
		position: relative;
		padding: 0.2rem 0.4rem;
		width: 100%;
		height: 3.5rem;
		text-align: left;
		border-bottom: 0.03rem solid #eee;
	}
	.ads-block h3{
		position: absolute;
		left: 0.3rem;
		top: 0;
		font-size: 0.38rem;
		width: 5rem;
		height: 1rem;
		line-height: 0.55rem;
	}
	.ads-block p{
		position: absolute;
		left: 0.3rem;
		top: 1.8rem;
		width: 60%;
		height: 0.75rem;
		font-size: 0.29rem;
		text-align: left;
	   white-space: wrap;
	   overflow: hidden;
	   text-overflow: ellipsis;
	   display: -webkit-box;
	   -webkit-box-orient: vertical;
	   -webkit-line-clamp: 2;
	   color: #666;
	}
	.ads-block span{
		position: absolute;
		bottom: 0.3rem;
		left: 0.3rem;
		font-size: 0.29rem;
		color: #888;
	}
	.ads-block span i{
		font: normal;
		margin-left: 0.1rem;
	}
	.ads-block img{
		position: absolute;
		right: 0.3rem;
		top: 0.5rem;
		width: 1.8rem;
		height: 1.8rem;
	}
	.save{
		position: absolute;
		bottom: 0.3rem;
		left: 2rem;
		width: 1rem;
		height: 0.5rem;
		background: #fff;
		border: none;
		outline: none;
		font-size: 0.29rem;
		color: #888;
		border-radius: 0.1rem;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 0.4rem;
		background-image: url("../assets/images/save.png");
	}
	.saved{
		position: absolute;
		bottom: 0.3rem;
		left: 2rem;
		width: 1rem;
		height: 0.5rem;
		background: #fff;
		border: none;
		outline: none;
		font-size: 0.29rem;
		color: #888;
		border-radius: 0.1rem;
		background-position: center;
		background-repeat: no-repeat;
		background-size: 0.4rem;
		background-image: url("../assets/images/saved.png");
	}
</style>