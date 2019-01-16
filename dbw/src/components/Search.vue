<template>
	<div class="search">
		<input type="search" v-model="keyword" name="search" placeholder="搜索电影"/>
		<button class="s-btn" @click="search">搜索</button>
		<div class="result">
			<h3>历史结果</h3>
			<div class="showarea">
				<div class="bus">
					<v-loading v-show="flag"></v-loading>
					<div class="bus-content">
						<div class="block" v-for="subject in subjects" :key="subject.index">
							<router-link class="fonts" :to="'/info/'+subject.id">
							<img class="bimg" :src="subject.images.small" alt="" />
							<span class="bmname">{{subject.title}}</span>
							<span class="bmname">导演：<b v-for="dir in subject.directors" :key="dir.index">{{dir.name}}</b></span>
							</router-link>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
   import { jsonp } from '@/assets/js/jsonp'
   import Loading from '@/components/Loading.vue'
 	export default {
		data () {
			return {
				flag: '',
				keyword: '',
				subjects: []
			}
		},
		components: {
			'v-loading':Loading
		},
		methods: {
			search() {
				this.flag = true
				let url = 'https://api.douban.com/v2/movie/search'
	         let data = {
	         	q: this.keyword
	         }
	         let options = {
	         	param: 'callback'
			 }
			 this.flag = true;
	         jsonp(url,data,options)
	           .then(res => {
	           	 this.subjects = res.subjects
	           	 this.flag = false
	           })
	           .catch(err => {
	           	 throw new Error(err)
	           })
			}
		}
	}
</script>

<style scoped="scoped">
	.search{
		margin-top: 1.2rem;
	}
	.search input[type="search"]{
		margin-top: 0.2rem;
		margin-left: 0.3rem;
		padding: 0.3rem 0.2rem;
		width: 78%;
		height: 0.7rem;
		border: 1px solid #eee;
		border-radius: 0.1rem;
	}
	.s-btn{
		margin-left: 0.2rem;
		height: 0.6rem;
		border: none;
		color: #fff;
		background-color: #2AA221;
		border-radius: 0.1rem;
	}
	.result{
		padding: 0.2rem;
		width: 100%;
	}
	.result h3{
		margin-left: 0.2rem;
		font-size: 0.34rem;
	}
	.bus{
		position: relative;
		width: 100%;
	}
	.bus .bus-content{
		width: 100%;
	}
	.block{
		float: left;
		margin: 0.15rem 0.15rem;
		width: 90%;
		height: 4rem;
		border: 0.03rem solid #f8f8f8;
	}
	.block .bimg{
		float: left;
		width: 50%;
		height: 4rem;
	}
	.block .bmname{
		padding-left: 0.2rem;
		display: block;
		margin: 0.3rem auto;
		float: right;
		margin: 0.03rem auto;
	   width: 50%;
	   height: 1.4rem;
	   line-height: 2rem;
	   font-size: 0.3rem;
	   text-align: left;
	   color: #444;
	}
	.bmname b{
		font-weight: 400;
	}
</style>