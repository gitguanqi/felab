<template>
	<div class="info">
		<div class="ad-info">
			<span class="ad-des">用App打开查看影人相册</span>
			<span class="ad-dl">极速下载</span>
			<span class="ad-open">打开</span>
		</div>
		<div class="movie">
			<h1>{{subjects.title}}</h1>
			<div class="pk">
				<span class="star">评分：<b v-for="(key, vlaue, index) in subjects.rating" :key="index" v-if="key == 'average'">{{vlaue}}</b></span>
				<span class="pingjia"><b>{{subjects.ratings_count}}</b>评价</span>				
			</div>
			<p class="detail">
				<b class="geners" v-for="gen in subjects.genres" :key="gen.index">{{gen}}/</b>导演：
				<b class="director" v-for="dir in subjects.directors" :key="dir.index">{{dir.name}}</b>演员：
				<b class="action" v-for="cast in subjects.casts" :key="cast.index">{{cast.name}}/</b>
				<b class="playtime">{{subjects.year}}</b>上映
			</p>
			<b v-for="(key, vlaue, index) in subjects.images" :key="index" v-if="index == 2">
				<img class="movie-pic" :src="key" alt="" />
			</b>
			<div class="info-btn">
			  <button class="wantlook">想看</button>
			  <button class="wanted">看过</button>
			  <button class="savelook">在App上保存你的观影足迹</button>
			</div>
		</div>
		<div class="movie-speak">
			<h3>{{subjects.title}}的剧情简介</h3>
			<p class="ms-des">
				{{subjects.summary}}
			</p>
		</div>
		<div class="stars">
			<h3>影人</h3>
			<p class="star-info">
			  <a href="" v-for="cast in subjects.casts" :key="cast.index">
			     <img :src="cast.avatars.medium" alt="" />
			     <span class="s-name">{{cast.name}}</span>
			  </a>
			</p>
		</div>
		<div class="movie-reply">
			<h3>{{subjects.title}}的短评({{subjects.wish_count}})</h3>
			<div class="mr-block">
			  <img src="../assets/images/act.png" alt="" />
			  <span class="mr-name">唐传营业</span>
			  <span class="mr-time">2017-11-08</span>
			  <p class="mr-content">
			  	 中国所有的悬疑电影都应该效仿东方列车的拍摄手法，拍摄出的是一种想让人探求真相的神秘感，而不是惊吓感，这一点目前只有烈日灼心做到了
			  </p>
			</div>
		</div>
	</div>
</template>

<script>
	import { jsonp } from '@/assets/js/jsona'
	export default {
		data () {
			return {
				flag: true,
				id: '',
				subjects: {}
			}
		},
		created () {
		    var id = this.$route.params.id;
		    this.id = id
		},
		 mounted () {
			 this.getData();
			// var res = confirm('因豆瓣Api临时业务调整，详细信息接口暂时关闭！');
		},
		methods: {
			getData() {
				let url = 'https://api.douban.com/v2/movie/subject/'
				let data = {  	 
					id: this.id
				}
				let options = {
					
				}
				jsonp(url,data,options)
				.then(res => {
						this.subjects = res;
						this.flag = false
				})
				.catch(err => {
					throw new Error(err)
				})
			}
		}
	}
</script>

<style scoped>
	.info{
		margin-top: 1.1rem;
		z-index: 9999;
		height: 15rem;
	}
	.ad-info{
		position: relative;
		width: 100%;
		height: 2rem;
		background: url("../assets/images/info-bg.jpg") no-repeat center;
		background-size: 8rem;
	}
	.ad-des{
		position: absolute;
		top: 0.5rem;
		left: 0.3rem;
		width: 2rem;
		height: 1rem;
		line-height: 0.5rem;
		color: #2CA532;
	}
	.ad-dl{
		position: absolute;
		top: 0.7rem;
		right: 1.8rem;
		font-size: 0.29rem;
		color: #fff;
		width: 1.7rem;
		height: 0.6rem;
		line-height: 0.6rem;
		text-align: center;
		background: #42bd56;
		border-radius: 0.05rem;
	}
	.ad-open{
		position: absolute;
		top: 0.7rem;
		right: 0.4rem;
		font-size: 0.29rem;
		color: #42bd56;
		width: 1.2rem;
		height: 0.6rem;
		line-height: 0.6rem;
		text-align: center;
		border-radius: 0.05rem;
		font-weight: bold;
		border: 0.01rem solid #42bd56;;
	}
	.movie{
		position: relative;
		padding: 0.2rem 0.3rem;
		width: 100%;
		height:8rem;
	}
	.movie h1{
		margin: 0 auto 0.1rem auto;
		width: 100%;
		height: 1rem;
		line-height: 1rem;
		text-align: left;
		font-size: 0.55rem;
	}
	.movie .star b{
		color: #666;
		font-weight: 580;
		margin-right: 0.8rem;
	}
	.movie .pingjia,.pingjia b{
		font-weight: 300;
		color: #888;
		margin-right: 0.1rem;
	}
	.detail{
		float: left;
		margin: 0.3rem 0;
		width: 59%;
		height: 6rem;
	}
	.detail b{
		color: #555;
		font-weight: 400;
		margin: 0 0.05rem;
	}
	.movie-pic{
		float: right;
		margin-top: -0.4rem;
		width: 30%;
		height: 3rem;
	}
	.info-btn{
		position: absolute;
		bottom: 0.2rem;
		left: 0;
		padding: 0.1rem 0.3rem;
		width: 100%;
		height: 2rem;
	}
	.info-btn .wantlook{
		display: block;
		float: left;
		margin-right: 0.2rem;
		margin-bottom: 0.2rem;
		width: 48%;
		height: 0.8rem;
		line-height: 0.8rem;
		text-align: center;
		color: #ffb712;
		font-weight: 400;
		border-radius: 0.05rem;
		border: 0.025rem solid #ffb712;
		background: #fff;
	}
	.info-btn .wanted{
		display: block;
		float: left;
		margin-right: 0.2rem;
		margin-bottom: 0.2rem;
		width: 46%;
		height: 0.8rem;
		line-height: 0.8rem;
		text-align: center;
		color: #ffb712;
		font-weight: 400;
		border-radius: 0.05rem;
		border: 0.025rem solid #ffb712;
		background: #fff;
	}
	.savelook{
		display: block;
		float: left;
		margin-right: 0.2rem;
		margin-bottom: 0.1rem;
		width: 96%;
		height: 0.8rem;
		line-height: 0.8rem;
		text-align: center;
		color: #42bd56;
		font-weight: 400;
		border-radius: 0.05rem;
		border: 0.025rem solid #42bd56;
		background: #fff;
	}
	.movie-speak,.stars,.movie-reply{
		margin-bottom: 0.2rem;
		padding: 0.15rem 0.3rem;
		width: 100%;
	}
	.movie-speak{
		height: auto;
	}
	.movie-speak h3,.stars h3,.movie-reply h3{
		padding-left: 0.2rem;
      margin-bottom: 0.2rem;
		color: #888;
		font-size: 0.35rem;
	}
	.movie-speak p{
		margin: 0 auto 0.3rem 0.2rem;
		width: 90%;
	}
	.stars{
		height: 4rem;
	}
	.stars .star-info{
		width: 100%;
		height: 2.5rem;
		text-align: center;
	}
	.star-info a{
		margin-left: 0.1rem;
		display: block;
		float: left;
		width: 23%;
		height: 100%;
		color: #333;
		font-size: 0.28rem;
	}
	.star-info a img{
		width: 90%;
		height: 1.9rem;
		margin-bottom: 0.2rem;
	}
	.movie-reply{
		height: auto;
	}
	.mr-block{
		position: relative;
		padding: 0.1rem 0.15rem;
		width: 100%;
		height: 3rem;
	}
	.mr-block img{
		position: absolute;
		left: 0.1rem;
		top: 0.1rem;
		width: 1rem;
		height: 1rem;
		line-height: 1rem;
		border-radius: 0.5rem;
		border: 0.01rem solid #00f;
	}
	.mr-name{
		position: absolute;
		top: 0.1rem;
		left: 1.3rem;
		font-weight: bold;
		color: #333;
		width: auto;
	}
	.mr-time{
		position: absolute;
		top: 0.65rem;
		left: 1.3rem;
		width: auto;
	}
	.mr-content{
		position: absolute;
		bottom: 0.3rem;
		right: 0.1rem;
		top: 1.3rem;
		width: 82%;
		height: 2rem;
		float: right;
		overflow: hidden;
	}
</style>