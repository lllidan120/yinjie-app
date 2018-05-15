<template>
	<div>
		<div class="search-bar">
			<!-- <search-bar
			:searchType="searchType"
			@onChange="typeChange"
			@inputChange="inputChange"
			@searchClick="searchClick"
			@changeType="changeType"
			@changeProper="changeProper"
			:searchValue = "searchValue"
			></search-bar> -->
			<search-bar 
				:searchType="searchType" 
				@onChange="typeChange" 
				@inputChange="inputChange"
				@scanClick="scanClick" 
				@searchClick="searchClick">
			</search-bar>
		</div>
		<recycle-list  for="(item, cellIndex) in listData" @loadmore="getData">
			<cell-slot>
				<div class="list" @click="toDetail(item)">
					<div class="list-box">
						<div class="list-box-title">
							<image src="bmlocal://assets/icon/ordertab.png" class="list-box-title-img"></image>
							<div class="list-box-title-right">
								<text class="text text-color">{{ item.ShopName }}</text>
							</div>
							<text class="other">了解详情 >></text>
						</div>
						<div class="list-box-content">
							<image src="bmlocal://assets/icon/tabimg.png" class="list-box-content-img"></image>
							<div class="list-box-content-left">
								<div class="col">
									<text class="text">产品名称：</text>
									<text class="address text ">{{ item.Cailiao }}</text>
								</div>
								<div class="col">
									<text class="text">平台单号：</text>
									<text class="text">{{ item.Id }}</text>
								</div>
								<div class="col">
									<image src="bmlocal://assets/icon/orderstatus.png" class="col-icon"></image>
									<text class="text">订单状态：</text>
									<text class="text">{{item.OrderStatusStr}}</text>
								</div>
							</div>
							<div class="shuliang">
								<text class="text text-color big" style="">数量</text>
								<text class="text num-color big" style="font-size: 32px;margin-top:5px;">X{{item.Shuliang}}</text>
							</div>
						</div>
						<div class="list-box-bottom">
							<div class="list-box-bottom-content" style="width:365px;">
								<image src="bmlocal://assets/icon/username.png" class="bottom-img"></image>
								<text class="text gray-color">&nbsp;用户名</text>
								<text class="text text-color">&nbsp;{{item.RealName}}</text>
							</div>
							<div class="list-box-bottom-content">
								<image src="bmlocal://assets/icon/userid.png" style="width:26px; height: 23px;" class="bottom-img"></image>
								<text class="text gray-color">&nbsp;会员号</text>
								<text class="text text-color">&nbsp;{{item.UserId}}</text>
							</div>
						</div>
					</div>
				</div>
			</cell-slot>
		</recycle-list>
		<image src='http://img.lanrentuku.com/img/allimg/1212/5-121204194026.gif'
		v-if="showload"
		style="height:40px;width:300px,align-items:center;background-color:#fff;"
		resize="contain"
		quality="original"></image>

        <bmmask class="mask" animation="transition" position="top" :duration="300" ref="bmmask">
        	<bmpop class="modal-top">
        		<bmcalendar class="calendar" :selectType="type" ref="calendar" @finish="finish" :startDate="startDate" :endDate="endDate" :maximumDate="maximumDate" :minimumDate="minimumDate" ></bmcalendar>
        	</bmpop>
        </bmmask>
		
		<wxc-popover ref="wxc-popover" :buttons="btns" :position="popoverPosition" :arrowPosition="popoverArrowPosition" @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>

    </div>	

</template>

<script>
	import { WxcPopover } from 'weex-ui';
	import searchBar from "../_mods/search-bar";
	import API from 'Utils/api'
	export default {
		components : {
			searchBar,
			WxcPopover
		},
		data () {
			return {
				listData: [],
				param : {
					page_no : 0,
					page_size : 15
				},
				searchValue: '',
				type: 'range',
				minimumDate: '',
				maximumDate: '',
				startDate: '',
				endDate: '',
				showload: false,
				payGroup: [],
				searchType: '订单号',
				btns: [
					{
					text: "订单号",
					key: "订单号"
					},
					{
					text: "会员号",
					key: "会员号"
					}
				],
				popoverPosition: { x: 15, y: 100 },
				popoverArrowPosition: { pos: "top", x: 50 }
			}
		},
		computed : {
			userInfo () {
				var userInfo = API.get_userInfo(this)
				return userInfo
			}
		},
		created () {
			this.$router.getParams().then(resData => {
				this.init(resData)
			})
		},
		mounted () {

		},
		methods : {
			async getData() {
				var _this = this;
				this.param['page_no']++
				// if(this.param['orderId'] == undefined && this.param['userId'] == undefined && this.searchValue != '') {
				// 	this.param = Object.assign(this.param , {'orderId' : this.searchValue})
				// }
				if(this.searchType == this.btns[0].key && this.searchValue != ''){
					this.param = Object.assign(this.param , {'orderId' : this.searchValue})
				}
				if(this.searchType == this.btns[1].key && this.searchValue != '') {
					this.param = Object.assign(this.param , {'userId' : this.searchValue})
				}
    		// this.param = Object.assign(this.param , {'@adminId' : this.userInfo.adminId})
    		// console.log(API.get_date('一月内' , true))
    		// this.param = Object.assign(this.param , this.searchType ? this.searchType : API.get_date('一月内' , true))
    		if(this.param['page_no'] === 1) {
    			_this.$notice.loading.show("正在加载")
    		} else {
    			this.showload = true
    		}
    		
    		var RES = await API.KIY_SEARCHORDER(this.param)
    		if(RES.Success) {
    			var RESDATA = JSON.parse(RES.Data)
    			var DGDATA = RESDATA.data.Models
    			if(DGDATA.length != 0) {
					console.log(JSON.stringify(DGDATA[0]))
    				DGDATA.map(item => {
    					this.listData.push(item)
    				})
    			} else {
    				this.$notice.toast({
    					message: '已经到底部'
    				})
    			}
    			if(this.param['page_no'] === 1) {
    				_this.$notice.loading.hide()
    			} else {
    				this.showload = false
    			}
    		}

    	},
    	init (param) {
    		var par = param
    		this.$navigator.setCenterItem({
			    text: par.title,                               // 展示的文字 (和图片 二选一)    
			    textColor: '',                          // 文字颜色 (默认为白色)
			    fontSize: '32',                         // 字号（默认32px）
			    fontWeight: 'normal'                   // 是否加粗（默认不加粗）
			}, () => {
				this.refresh()
			})
    		this.param = Object.assign(this.param , param.type)
    		this.getData()
    	},
    	typeChange (value) {
			this.$refs["wxc-popover"].wxcPopoverShow();
    	},
    	searchClick (value) {
    		this.param['page_no'] = 0
    		this.listData = []
    		this.getData()
    		this.$tools.resignKeyboard().then(resData => {
			    // 收起成功的回调
			}, error => {})
    	},
    	refresh () {
    		this.param['page_no'] = 0
    		this.listData = []
    		this.getData()
    	},
    	finish (params) {
    		this.$notice.toast({
    			message: '开始时间：' + params.startDate + '\r\n结束时间：' + params.endDate
    		});
    		this.searchType = {
    			'@startDate' : params.startDate,
    			'@endDate'   : params.endDate
    		}
    		this.$refs['bmmask'].hide()
    	},
		inputChange (val){
			this.searchValue = val
		},
    	changeType(item) {
    		this.param = {
    			page_no : 0,
    			page_size : 15
    		}
    		this.listData = []
    		this.searchId = item
    		this.getData()
    	},
    	changeProper(item) {
    		console.log(item)
    	},
    	toDetail (item) {
    		this.$router.open({
    			name: 'order-detail',
    			type: 'PUSH',
    			params: item
    		})
		},
		popoverButtonClicked(obj) {
			this.searchType = obj.key;
		}
    }
}
</script>

<style scoped>
	.blue-color {
	color: #2096f2;
	}

	.title {
	color: #666666;
	}

	.text-color {
	color: #333333;
	}

	.num-color {
	color: #deae07;
	}

	.gray-color {
	color: #666666;
	}
	.search-bar {
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-bottom-color: #dddddd;
	}
	.mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, .4);
	}

	.modal-top {
		align-items: flex-start;
	}

	.calendar {
		height: 800px;
		background-color: #FFFFFF;
		select-color: #1da1f2;
	}
	.list { 
		width: 750px;
		padding-left: 28px;
		background-color: #f3f6f7;
		
	}
	.list-box {
		margin-top: 26px;
		width: 690px;
		height: 295px;
		background-color: #fff;
		border-radius: 4px;
		padding-left: 24px;
	}
	.list-box-title {
		width: 640px;
		flex-direction: row;
		height: 72px;
		border-bottom-width: 1px;
		border-bottom-style: solid;
		border-color: #cccccc;
	}
	.list-box-title-img {
		width: 45px;
		height: 60px;
	}
	.list-box-content-img {
		margin-top: 20px;
		width: 113px;
		height: 113px;
	}
	.list-box-title-right {
		padding-top: 20px;
		padding-left: 25px;
	}
	.user-box {
		margin-top: 8px;
		flex-direction: row;
	}
	.blue-bg {
		background-color: #9fd4fd;
		padding: 8px;
		border-radius: 4px;
	}
	.shuliang {
		position: absolute;
		flex-direction: column;
		align-items: center;
		top: 45px;
		right: 32px;
		height: 88px;
		
	}
	.other {
		position: absolute;
		top: 20px;
		right: 0px;
		font-size: 25px;
		color: #666666;
	}
	.list-box-content {
		flex-direction: row;
		height: 160px;
		
	}
	.list-box-content-left {
		width: 726px;
		padding-top: 20px;
	}
	.list-box-content-right {
		width: 225px;
		padding-top: 52px;
	}

	.col {
		flex-direction: row;
		height: 40px;
		padding-left: 23px;
	}
	.col-icon {
		width: 106px;
		height: 15px;
		margin-top: 7px;
		margin-right: 15px;
	}
	.address {
		width: 500px;
		lines: 3;
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
	.loading {
		display: block;
		align-items: center;
	}
	.pay-content {
		margin-left: 84px;
		margin-top: 312px;
		width: 580px;
		height: 300px;
		background-color: #fff;
		border-radius: 4px;
	}
	.pay-title {
		height: 105px;
		justify-content: center;
		padding-left: 48px;
		border-bottom-width: 1px;
		border-bottom-style: dotted;
		border-bottom-color: #cccccc;
	}
	.pay-group {
		flex-direction: row;
		padding-top: 52px;
		justify-content: center;
	}
	.pay-type {
		width: 215px;
		height: 66px;
	}
	.list-box-bottom {
		
		flex-direction: row;
		align-items: center;
		width: 640px;
		height: 60px;;
		border-top-width: 1px;
		border-top-style: solid;
		border-color: #cccccc;
	}
	.list-box-bottom-content {
		flex-direction: row;
	}
	.bottom-img {
		width: 15px;
		height: 25px;
	}
</style>
