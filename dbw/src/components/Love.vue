<template>
	<div class="love">
		<h3>收藏的电影</h3>
		<div class="bus">
			<div class="bus-content">
				<div class="block" v-for="ad in addsave" :key="ad.index">
	            <img class="bimg" :src="ad.target.cover_url" alt="" />
	            <span class="bmname">{{ad.title}}</span>
	            <span class="bmname"></span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		computed: {
	  	   addsave () {
	  		  return this.$store.state.addsave			
	  	   }
	   }
	}
</script>

<style scoped="scoped">
	.love{
		margin-top: 1rem;
		background-color: #fff;
		margin-top: 1.25rem;
	}
	.love h3{
		margin: 0;
		padding-left: 0.2rem;
		width: 100%;
		height: 1rem;
		line-height: 1rem;
		text-align: left;
		font-size: 0.35rem;
		color: #333;
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
		height: 3rem;
		border: 0.03rem solid #f8f8f8;
	}
	.block .bimg{
		padding: 0.1rem 0.2rem;
		float: left;
		width: 40%;
		height: 2.8rem;
		border-radius: 0.3rem;
	}
	.block .bmname{
		display: block;
		margin: 0.3rem auto;
		float: right;
		margin: 0.03rem auto;
	   width: 58%;
	   height: 1.4rem;
	   line-height: 1rem;
	   font-size: 0.3rem;
	   text-align: center;
	}
</style>