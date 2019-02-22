<template>
	<div class="menu">
		<ul>
			<li class="col-xs-4" v-for="item in routers" :key="item.index"><router-link :to="item.router" :class="{'active': item.router == path}">{{item.text}}</router-link></li>
		</ul>
	</div>
</template>

<script>
	export default {
		data () {
			return {
				flag: true,
				subjects: [],
				path: '',
				routers: [
				   {
				   	text: "正在上映",
				   	router: "/movie/now"
				   },
				   {
				   	text: "即将上映",
				     	router: "/movie/coming"
				   },
				   {
				   	text: "Top250",
				   	router: "/movie/top"
				   }
				]
			}
		},
		watch: {
			$route () {
				this.path = this.$route.fullPath;
			}
		}
	}
</script>

<style scoped>
	ul,li{
		list-style: none;
	}
	.menu{
		margin: 0 auto;
		width: 100%;
		height: 1rem;
		line-height: 1rem;
	}
	.menu ul{
		margin: 0 auto;
		width: 100%;
		height: 1rem;
		line-height: 1rem;
	}
	.menu ul li{
		height: 1rem;
		line-height: 1rem;
	}
	.menu ul li a{
		color: #555;
		font-size: 16px;
		text-decoration: none;
	}
	a.active{
		color: #f00!important;
	}
</style>