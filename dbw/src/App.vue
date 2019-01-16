<template>
  <div id="app">
    <tab></tab>
    <router-view />
  </div>
</template>

<script>
import Tab from '@/components/Tab'
export default {
  name: 'app',
  created() {
  	this.$store.dispatch('getAdsData')
  },
  components: {
  	'tab': Tab
  }
}
</script>

<style>
</style>
