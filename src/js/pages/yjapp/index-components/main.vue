<template>
		<waterfall :show-scrollbar="false">
			<header class="top"> 
					<img src="http://yj.kiy.cn/Content/Images/App/assets/main/main-bg1.png" class="top-bg" alt="">
					<image 
					ref="inner" 
					src="http://www.easybui.com/scenes/source/common/images/round/round-inner.png" 
					class="round-inner" 
					@click="scanLogisticalOrder"></image>
					<image
					ref="scan"
					src="http://www.easybui.com/scenes/source/common/images/round/round-scan.png"
					class="round-scan" 
					></image>
					<text class="select-btn" @click="selectWarhoursCode">{{selectWarhours.WarhoursName}}</text>
			</header>
			<cell style="background-color: #fff;" v-for="(obj , i ) in centerList" :key="i"> 
				<text class="center-title">{{obj.title}}</text>
				<div class="center">
					<div v-for="(item , index) in obj.pages"  class="center-item" :key="index">
						<div  @click="toPage(item)" >
							<image :src="item.icon" class="center-icon"></image>
							<text class="center-text">{{ item.title }}</text>
						</div>
					</div>
				</div>
			</cell>
			<!-- <cell class="center"> 
				<div v-for="(item , index) in bottomList"  class="center-item" :key="index">
					<div  @click="goTo(item)" >
						<image :src="item.icon" class="center-icon"></image>
						<text class="center-text">{{ item.title }}</text>
					</div>
				</div>
			</cell> -->
		</waterfall>     
</template>
<script>
	import { Utils  } from 'weex-ui'
	import Config from '../config.js'
	import API from 'Utils/api'
	const animation = weex.requireModule('animation')
	const picker = weex.requireModule('picker')
	

	export default {
		props: {
			accessList:{
				type: Array,
				default: []
			}
		},
		data () {
			return {
				statusBarHeight: weex.config.eros.statusBarHeight ? weex.config.eros.statusBarHeight : 40,
				userInfo: {},
				check: {},
				warhours: [],
				index: -1,
				selectWarhours : {
					WarhoursName: '请选择仓库'
				},
				count: 0,
				bottomList : Config.mainList,
			  centerList : Config.distribution,
			  isLeftShow: false
			}
		},
		created () {
			var _this = this;
			this.$navigator.setNavigationInfo({
				statusBarStyle: 'LightContent'
			});
	    },
	    mounted () {
	    	var _this = this
	    	_this.init()
			_this.getWarhoursCode()
			
	    },
	    computed :  {
	    	value () {
		        if (this.index < items.length) {
		          return items[this.index]
		        }
		        return ''
		    }
	    },	
	    methods : {
			async scanLogisticalOrder () {
	        	var _this =this;
				var userInfo = await API.get_userInfo(this);
	        	this.$tools.scan().then((resData) => {
					_this.$storage.setSync('QR_Code', resData)
	        		var par = {
	        			roleId: userInfo.RoleId,
	        			qr_code: resData ,
	        			warhoursCode: _this.selectWarhours.Id,
	        			adminId: userInfo.adminId
					}
					_this.scanSuccess(par)
					// _this.scanLogisticalOrder()
					
				}).catch (ex => {
				}) 
	        },
			async scanSuccess (par) {
				var _this = this;
				try {
					this.$notice.loading.show();
					var res = await API.YJ_SCAN(par)
					this.$notice.loading.hide();
				    // var res = {
					// 		MESSAGE: '该付款单应付XX元，是否前往？',
					// 		DATA: JSON.stringify({url : 'invoice-detail'})
					// 	}
					if(res.DATA) {
						var DATA = JSON.parse(res.DATA)
						if(DATA.url) {
							_this.$notice.confirm({
								title: '扫描成功',
								message: DATA.msg ? DATA.msg : res.MESSAGE,
								okTitle: '确认',
								cancelTitle: '取消',
								okCallback() {
									_this.$router.open({
										name: DATA.url,
										type: 'PUSH',
										params: DATA
									})	
								},
								cancelCallback() {
									_this.scanLogisticalOrder(par)
								}
							})
						}else {
							this.$notice.toast({message: res.MESSAGE})
							_this.scanLogisticalOrder(par)
						}
					} else {
						this.$notice.toast({message: res.MESSAGE})
						_this.scanLogisticalOrder(par)
					}
				} catch (error) {
					this.$notice.loading.hide();
					_this.scanLogisticalOrder(par)
				}
	        },
	    	init () {
	    		var _this = this;
	    		var inner = this.$refs.inner;
	    		var scan = this.$refs.scan;
	    		this.userInfo = API.get_userInfo(this)
	    		animation.transition(inner, {
		          styles: {
		            transform: 'rotate(360deg)'
		          },
		          duration: 10000, //ms
		          timingFunction: 'ease',
		          delay: 0 //ms
		        })
	    	},
	    	async getWarhoursCode () {
				var warhoursCode = API.get_warhoursCode(this)
	    		if( warhoursCode == '') {
					const RES = await API.YJ_WARHOURSCODE({})
		    		if(RES.SUCCESS) {
						var arr = []
						JSON.parse(RES.DATA).map(item => {
							item.title = item.WarhoursName
							item.value = item.Id
							arr.push(item)
						})
						this.warhours = arr
		    			this.$storage.setSync('warhoursCode', arr)
		    		}
	    		} else {
	    			this.warhours = warhoursCode
	    		}
	    	},
	        wxcTabBarCurrentTabSelected (e) {
	        	const index = e.page;
	        },
	        
	        
	        selectWarhoursCode () {
				var warhours = this.warhours
				var items = [];
	        	if(items.length === 0){
	        		warhours.map(item => {
		        		items.push(item.WarhoursName)
		        	})
	        	}

	        	picker.pick({
		          index: this.index,
		          items
		        }, event => {
		          if (event.result === 'success') {
		          	this.selectWarhours = warhours[event.data]
		          }
				})
			},
			wxcRadioListChecked (e) {
			},
	        toPage (item) {
	        	this.$router.open({
	    			name: item.name,
	    			type: 'PUSH',
	    			params: {
	    				params: item,
	    				type: item.type
	    			}
	    		})
	        },
	        goTo (item) {
	        	if(!item.name) {
	        		this.$notice.toast({
					    message: '该功能暂未开放'
					})
	        		return
				} 
	        	this.$router.open({
	    			name: item.name,
	    			type: 'PUSH',
	    			params: item
	    		})		
			},
			popupOverlayLeftClick () {
				this.isLeftShow = false;
			}
			
	    }
	}
</script>
<style lang="sass" src='./main.scss'></style>