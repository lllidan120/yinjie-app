<template>
	<list ref="listTop"  :showRefresh="true" @refresh="onrefresh"  :class="['aliColor' , payInfo.bweixin && 'wxColor' , payInfo.bweixin]">
		<cell :class="['aliColor' , payInfo.bweixin && 'wxColor' , payInfo.bweixin]">
			<text class="title head">订单详情(该页面每10秒自动刷新,现在刷新第{{count}}次)</text>
		</cell>
		<cell :class="['aliColor' , payInfo.bweixin && 'wxColor' , payInfo.bweixin]">
			<div class="list">
				<div class="list-box">
					<div class="list-box-title">
						<text class="text">支付</text>
					</div>
					<div class="list-box-content">
						<div class="list-box-content-left">
							<div class="col" >
								<image src="http://yj.kiy.cn/Content/Images/App/assets/list/3.png" class="col-icon"></image>
								<text class="text">平台单号：</text>
								<text class="text address">{{ payInfo.orderId }}</text>
							</div>
							<div class="col" >
								<image src="http://yj.kiy.cn/Content/Images/App/assets/list/4.png" class="col-icon"></image>
								<text class="text">物流单号：</text>
								<text class="text address">{{payInfo.key}}</text>
							</div>
						</div>
					</div>
					<div class="list-box-bottom">
						<text class="text paynum">支付金额: </text><text class="paynum bule">{{payInfo.intMustPay}}</text><text class="paynum">元</text>
					</div>
				</div>
			</div>
		</cell>
		<cell :class="['aliColor' , payInfo.bweixin && 'wxColor' , payInfo.bweixin]">
			<text class="title" v-if="payInfo.bweixin">打开微信扫一扫(点击二维码打开大图)>></text>	
			<text class="title" v-if="!payInfo.bweixin">打开支付宝扫一扫(点击二维码打开大图)>></text>
			<text class="title">流水号:{{payInfo.out_trade_no}}</text>	
		</cell>
		<cell :class="['aliColor' , payInfo.bweixin && 'wxColor' , payInfo.bweixin]">
			<div class="code-content">
				<image src="http://yj.kiy.cn/Content/Images/App/assets/list/codebg.png" class="code-bg"></image>
				<image :src="payInfo.strUrl" class="code-img" @click="preview"></image>
			</div>
		</cell>
		<cell :class="['aliColor' , payInfo.bweixin && 'wxColor' , payInfo.bweixin]">
			<text class="title">注意：请直接在当前页面下扫描支付，如果有截图支付或装有多个APP的业务员请注意，每次扫描二维码支付都以最新生成的二维码为准，如果该订单重新生成二维码，旧的二维码就会失效，请选择最新生成的二维码进行支付。</text>	
		</cell>
		
	</list>
</template>
<script>
	import API from 'Utils/api'
	export default {
		components: {  }, 
		data () {
			return {
				payInfo: {},
				count: 0
			}
		},
		methods: {
			onrefresh () {
				var _this =this;
				this.searchOrder()
				setTimeout(function() {
					_this.$refs["listTop"].refreshEnd()
				} , 2000)
			},
			preview () {
				var imgArr = []
				imgArr.push(this.payInfo.strUrl)
				this.$image.preview({
				    index: 0,                     // 所点击图片下标
				    images: imgArr,        // 图片的网络地址
				})
			},
			async searchOrder () {
				try {
					var par = {
						'@orderId': this.payInfo.key
					}
					this.count++
					var RES = await API.YJ_PAYCHECK(par)
					if(RES.SUCCESS = true) {
						const data = JSON.parse(RES.DATA)
						if(data[0].success > 0) {
							this.payInfo.strUrl = 'http://yj.kiy.cn/Content/Images/App/pays.png'
							this.$event.emit('paySuccess')
							this.$notice.toast({
								message: '支付成功'
							})
						} else {

						} 
					}
				} catch (error) {
					
				}
				
			}
		},
		mounted() {
			
			setInterval(this.searchOrder , 10000)
		},
		created () {

			var _this = this
			this.$router.getParams().then(resData => {
				_this.payInfo = resData
				_this.$notice.loading.show("正在加载二维码")
				setTimeout(function() {
					_this.$notice.loading.hide()
				} , 1000)
			})
		}

	}
</script>
<style scoped>
  .list { 
  	width: 750px;
  	padding-left: 92px;
  	padding-right: 92px;
  }
  .list-box {
  	margin-top: 26px;
  	width: 560px;
  	min-height: 510px;
  	background-color: #fff;
  	border-radius: 4px;
  	color: #666666;
  }
  .list-box-title {
  	height: 90px;
  	line-height: 90px;
  	font-size: 39px;
	justify-content: center;
	align-items: center;
  	border-bottom-width: 1px;
  	border-bottom-style: dashed;
  	border-color: #2096f2;
  }
  .title {
  	margin-top: 28px;
  	margin-left: 36px;
  	color: #fff;
  	font-size: 26px;
  }
  .list-box-content {
	flex-direction: row;
	padding-top: 20px;
	min-height: 280px;
  }
  .list-box-content-left {
	width: 560px;
  }
  .list-box-bottom {
  	flex-direction: row;
	min-height: 100px;
	padding-left: 18px;
	padding-right: 18px;
	justify-content: center;
	border-top-width: 1px;
	border-top-style: solid;
	border-top-color: #cccccc;
  }
  .paynum {
  	margin-top: 45px;
	font-size: 32px;
	text-align: center;
  }
  .bule {
  	color: #2096f2;
  }
   
  .col {
  	flex-direction: row;
  	padding-left: 54px;
  	padding-top: 20px;
  	min-height: 140px;
  }
  .col-icon {
  	width: 26px;
  	min-height: 26px;
  	margin-right: 15px;
  }
  .address {
  	width: 300px;
	lines: 10;
	font-size: 32px;
    text-overflow: ellipsis;
  }
  .text {
  	
	font-size: 25px;
  }
  .map {
	background-color: #42b983;
  }
  .enter-btn {
  	width: 144px;
  	height: 80px;
  	line-height: 80px;
  	text-align: center;
  	background-color: #2096f2;
  	color: #fff;
  	border-radius: 4px;
  	margin-bottom: 20px;
  }
  .code-content {
  	margin-top: 30px;
	  height: 400px;
	  /* margin-bottom: 200px; */
  	width: 750px;
	align-items: center;
	justify-content: center;
  }
  .code-bg {
	width: 500px;
	height: 500px;
  }
  .code-img {
  	position: absolute;
	left: 200px;
	top: 30px;
	width: 350px;
	height: 350px;
  }
  .wxColor {
	  background-color: rgb(69, 144, 88)
  }
  .aliColor {
	  background-color: #2096f2;
  }
  .head {
	  font-size: 32px;
  }
</style>
