<template>
	<waterfall :show-scrollbar="false">
		<header class="top"> 
				<image 
				src="http://yj.kiy.cn/Content/Images/App/assets/distribution/bg.png" 
				class="top-img" ></image>
		</header>
		<cell class="bottom" >
			<div class="bottom-box" v-for="item in bottomList" @click="goPage(item)" >
				<image class="bottom-box-left" :src="item.icon"></image>
				<text class="bottom-box-center">{{ item.sub }}</text>
				<wxc-icon name="more" class="bottom-box-right"></wxc-icon>
			</div>
		</cell>
		<cell class="bottom" >
			<!-- <div class="bottom-box" @click="wxPay">
				<text class="bottom-box-center">微信支付</text>
				<wxc-icon name="more" class="bottom-box-right"></wxc-icon>
			</div>
			<div class="bottom-box" @click="toMap">
				<text class="bottom-box-center">地图</text>
				<wxc-icon name="more" class="bottom-box-right"></wxc-icon>
			</div> -->
			<!-- <div class="bottom-box" @click="toSign">
				<text class="bottom-box-center">签到</text>
				<wxc-icon name="more" class="bottom-box-right"></wxc-icon>
			</div> -->
			<div class="bottom-box" @click="toBindingx">
				<text class="bottom-box-center">bindingx</text>
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
				bottomList : [
					// {
					// 	title: '未收货',
					// 	icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文档.png',
					// 	sub: '批量收货',
					// 	type: {
					// 		'@orderStatu': '1,2,5,10,6,7,8'
					// 	},
					// 	name: 'dis-list'
					// }, 
					{
						title: '未收款',
						icon: 'http://yj.kiy.cn/Content/Images/App/assets/icon/文件记录.png',
						sub: '批量收款',
						type: {
							'@isPay': 0
						},
						name: 'dis-list'
					}
				]
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
	    	},
			wxPay() {
				var _this = this;
				var bmWXPay = weex.requireModule('bmPay')
				var result = bmWXPay.isInstallWXApp(function(res){
					
					if(res.data) {
						// 已安装微信
						_this.$notice.toast({
							message: '已经安装微信'
						})
					} else {
						 _this.$notice.toast({
							message: '请先安装微信'
						})
					}
				})
			},
			toMap() {
				this.$router.open({
	    			name: 'map',
	    			type: 'PUSH'
	    		})
			},
			toSign () {
				this.$image.camera({
					imageWidth: '800',                  
					allowCrop: false                  
				})
				.then(resData => {
					console.log(resData)   
				}, error => {
					console.log(error)
				})
			},
			toBindingx () {
				this.$router.open({
	    			name: '404',
	    			type: 'PUSH'
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