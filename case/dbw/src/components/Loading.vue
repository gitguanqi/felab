<template>
  <div class="loading">
    <p></p>
  </div>
</template>

<script>
export default {

}
</script>
<style scoped>
	.loading{
		position: fixed;
		top: 1.2rem;
		left: 0;
		bottom: 0;
		right: 0;
		padding: 80% 40%;
		width: 100%;
		height: 100%;
		background: #fff;
		color: #333;
		z-index: 9999;
		background-image: url('../assets/images/loading_green.gif');
		background-repeat: no-repeat;
		background-position: 3rem 1.5rem;
	}
</style>