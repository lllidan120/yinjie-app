<template>
	<waterfall :show-scrollbar="false">
		<header class="top"> 
				<image 
				src="http://yj.kiy.cn/Content/Images/App/assets/distribution/bg.png" 
				class="top-img" ></image>
		</header>
		<cell style="background-color: #fff;">
				<text class="center-title">{{today}}的各项数据汇总</text>
		</cell>
		<cell>
			<div class="center">
				<card style="background-color: rgb(251,228,228);"
				class="center-left"
				title="已付款总金额"
				:text='homeData.payMoney'
				image="http://yj.kiy.cn/Content/Images/App/assets/icon/充值流量.png"
				@onClick="goPage(1)"
				></card>
				<card style="background-color: rgb(222,247,243);"
				class="center-right"
				title="未付款总金额"
				:text='homeData.unPayMoney'
				@onClick="goPage(1)"
				image="http://yj.kiy.cn/Content/Images/App/assets/icon/设备统计.png"
				></card>
				<card style="background-color: rgb(232,247,224);"
				class="center-left"
				title="已收货数量"
				:text='homeData.distribution'
				@onClick="goPage(0)"
				image="http://yj.kiy.cn/Content/Images/App/assets/icon/文件.png"
				></card>
				<card style="background-color: rgb(231,214,246);"
				class="center-right"
				title="待配送数量"
				:text='homeData.unDistribution'
				@onClick="goPage(0)"
				image="http://yj.kiy.cn/Content/Images/App/assets/icon/分账系统.png"
				></card>
			</div>
			
		</cell>
	</waterfall>
</template>
<script>
	import API from 'Utils/api'
	import card from '../_mods/card'
	var bmWebSocket = weex.requireModule('bmWebSocket')
	export default {
		components : {
			card
		},
		data () {
			return {
				homeData: {},
				data: ''
			}
		},
		created () {
	    },
	    mounted () {
			var _this = this;
			_this.getHomeData()
			setInterval(function() {
				_this.getHomeData()
			} , 120000)
	    	
	    },
	    computed :  {
			today () {
				return API.get_date('today')
			}
	    },	
	    methods : {
			async getHomeData () {
				let userInfo = API.get_userInfo(this);
				let param = { }
				if(userInfo.RoleId == 1 || userInfo.RoleId== 4) {

				} else {
					param =  Object.assign(param , {'@adminId' : userInfo.adminId})
				}
				
				const RES = await API.get_GetHomeData(param)
				const DATA = JSON.parse(RES.DATA)
				this.homeData = DATA[0]
			},
	    	goPage (num) {
				var config = [{
					title: '配送率',
					name: 'echartlist'
				},
				{
					title: '应收款率',
					type: {
					'@bPay': 0
					},
					name: 'echartlist'
				}]
				console.log(num)
	    		this.$router.open({
	    			name: config[num].name,
	    			type: 'PUSH',
	    			params: {
	    				params: config[num],
	    				type: config[num].type
	    			}
	    		})
	    	},
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
.center {
	width: 750px;
	background-color: #fff;
	padding-top: 25px;
	padding-bottom: 45px;
	display: flex;
	flex-direction: row;
	flex-wrap:wrap;
}
.center-left {
	margin-left: 15px;
	margin-right: 10px;
	margin-top: 10px;
}
.center-right {
	margin-right: 15px;
	margin-left: 10px;
	margin-top: 10px;
	
}
.center-title {
	color: #888888;
  font-size: 36px;
  font-weight: 700;
  margin-top: 20px;
  text-align: center;
}

</style>