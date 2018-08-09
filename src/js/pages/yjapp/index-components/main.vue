<template>
		<waterfall :show-scrollbar="false">
			<header class="top"> 
					<img src="http://yj.kiy.cn/Content/Images/App/assets/main/main-bg1.png" class="top-bg" ref="headbg" alt="">
					<image 
					ref="inner" 
					src="http://yj.kiy.cn/Content/Images/App/assets/round-inner.png" 
					class="round-inner" 
					@click="scanLogisticalOrder"></image>
					<image
					ref="scan"
					src="http://yj.kiy.cn/Content/Images/App/assets/round-scan.png"
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
				isLeftShow: false,
				isScan : false,
				scanData: undefined
			}
		},
		created () {
			var _this = this;
			this.$navigator.setNavigationInfo({
				statusBarStyle: 'LightContent'
			});
	    },
	    mounted () {
	    	this.init()
			this.getWarhoursCode()
	    },
	    computed :  {
	    	value () {
		        if (this.index < items.length) {
		          return items[this.index]
		        }
		        return ''
			},
			centerList () {

				return Config.distribution
			}
	    },	
	    methods : {
			async scanLogisticalOrder () {
	        	var _this =this;
				var userInfo = await API.get_userInfo(this);
				this.$tools.scan().then(function(resData){
						_this.$storage.setSync('QR_Code', resData)
						var par = {
							roleId: userInfo.RoleId,
							qr_code: resData ,
							warhoursCode: _this.selectWarhours.Id,
							adminId: userInfo.adminId
						}
						_this.scanSuccess(par , resData)
					
				})
	        },
			async scanSuccess (par , scanData) {
				var _this = this;
				try {
					if(this.scanData != scanData){
						this.scanData = scanData
						this.isScan = false
						this.$notice.loading.show();
						var res = await API.YJ_SCAN(par)
						this.$notice.loading.hide();
						if(res.DATA) {
							if(typeof res.DATA === 'string') {
								var DATA = JSON.parse(res.DATA)
							} else {
								var DATA = res.DATA
							}
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
						this.scanData = undefined
					}
				} catch (error) {
					this.scanData = undefined
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
		          duration: 3000, //ms
		          timingFunction: 'ease',
		          delay: 0 //ms
		        })
				setTimeout(() => {
					this.deviceorientaion()
				}, 3200);
	    	},
	    	async getWarhoursCode (load) {
				// var warhoursCode = API.get_warhoursCode(this)
				// warhoursCode = ''
	    		// if( warhoursCode == '') {
					if(load) {
						this.$notice.loading.show('正在加载仓库,稍后再试...');
					}
					const RES = await API.YJ_WARHOURSCODE({})
					if(load) {
						this.$notice.loading.hide();
					}
		    		if(RES.SUCCESS) {
						var arr = []
						JSON.parse(RES.DATA).map(item => {
							item.title = item.WarhoursName
							item.value = item.Id
							arr.push(item)
						})
						this.warhours = arr
		    			// this.$storage.setSync('warhoursCode', arr)
		    		}
	    		// } else {
	    		// 	this.warhours = warhoursCode
	    		// }
	    	},
	        wxcTabBarCurrentTabSelected (e) {
	        	const index = e.page;
	        },
	        
	        
	        selectWarhoursCode () {
				var _this = this;
				if(this.warhours.length == 0)  {
					this.getWarhoursCode(true)
					return
				}
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
					_this.index = event.data
		          	_this.selectWarhours = warhours[event.data]
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
			},
			deviceorientaion () {
				let main_btn = this.$refs.inner.ref
				let scan = this.$refs.scan.ref
				this.$bindingx.bind({
					eventType:'orientation',
					props: [
						{
							element:main_btn,
							property:'transform.rotateZ',
							expression:'x + 2'
						}
					]
				})
			}
			
	    }
	}
</script>
<style lang="sass" src='./main.scss'></style>