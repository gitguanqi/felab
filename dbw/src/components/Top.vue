<template>
	<div class="movie">
		<v-loading v-show="flag"></v-loading>
		<div class="bus" v-show="!flag">
			<h2>Top250</h2>
			<div class="bus-content">
				<div class="bus">
					<div class="bus-content">
						<div class="block" v-for="subject in subjects" :key="subject.index">
							<router-link class="fonts" :to="'/info/'+subject.id">
				            <img class="bimg" :src="subject.images.small" alt="" />
				            <span class="bmname">{{subject.title}}</span>
				            <span class="bmo">类型：{{subject.subtype}}</span>
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
	import Mtab from '@/components/Mtab'
	import Loading from '@/components/Loading.vue'
 	export default {
		data () {
			return {
				flag: true,
				subjects: []
			}
		},
		components: {
			'mtab': Mtab,
			'v-loading':Loading
		},
		mounted () {
			let url = 'https://api.douban.com/v2/movie/top250'
         let data = {  	 
         }
         let options = {
         	param: 'callback'
         }
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
</script>
<style src="../assets/style/index.css" scoped></style>