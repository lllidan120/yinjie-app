<template>
	<waterfall :show-scrollbar="false">
		<header class="top"> 
				<image 
				src="bmlocal://assets/distribution/bg.png" 
				class="top-img" ></image>
		</header>
		<cell class="bottom">
			<div class="bottom-box" v-for="item in bottomList" @click="goPage(item)" v-if="item.sub">
				<image class="bottom-box-left" :src="item.icon"></image>
				<text class="bottom-box-center">{{ item.sub }}</text>
				<wxc-icon name="more" class="bottom-box-right"></wxc-icon>
			</div>
		</cell>
	</waterfall>      
</template>
<script>
	import { Utils , wxcIcon } from 'weex-ui'
	import Config from '../config.js'
	import API from 'Utils/api'
	export default {
		components : {
			wxcIcon
		},
		data () {
			return {
				bottomList : Config.distribution
			}
		},
		beforeCreate: function () {

		},
		created () {

	    },
	    mounted () {

	    	
	    },
	    computed :  {

	    },	
	    methods : {
	    	goPage (item) {
	    		this.$router.open({
	    			name: 'batch-list',
	    			type: 'PUSH',
	    			params: {
	    				params: item,
	    				type: item.type
	    			}
	    		})
	    	}
	    }
	}
</script>
<style scoped>
	.top {
	  width: 750px;
	  height: 500px;
	}
	.top-img {
		width: 750px;
		height: 500px;
	}
	 .bottom-box {
	  flex-direction:row;
	  align-items:center;
	  width: 750px;
	  height: 130px;
	  background-color: #fff;
	  border-bottom-width: 1px;
	  border-bottom-style: solid;
	  border-bottom-color: #f3f2f2;
	  box-shadow: 0px 0px 10px rgba(0,0,0,0.8) inset;
	  margin-bottom: 1px;
	}
	.bottom-box-left {
	  width: 74px;
	  height: 74px;
	  margin-left: 56px;
	}
	.bottom-box-center {
	  margin-left: 36px;
	  width: 200px;
	  height: 95px;
	  line-height: 95px;
	  font-size: 26px;
	  color: #000;
	}
	.bottom-box-right {
	  position: absolute;
	  right: 56px;
	  top: 50%;
	  transform: translateY(-50%);
	}
</style>