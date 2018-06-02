<template>
	<div>
		<div 
		class="login-content"
		:style="{'height': deviceHeight}"
		>
		<!-- 背景图片start -->
		<image resize="stretch" class="title-bg1" src="http://yj.kiy.cn/Content/Images/App/assets/login/loginbg.png"></image>
		<!-- end -->
		<div class="login-box">
			<img class="image" src="http://yj.kiy.cn/Content/Images/App/assets/login/logo.png" @click="checkQRCODE">
			<div class="my-icon-input" style="margin-bottom: 30px">
				<img class="user-icon" src="http://yj.kiy.cn/Content/Images/App/assets/login/usericon.png">
				<input 
				class="my-input" 
				v-model="loginInfo.key" 
				placeholder="用户名"
				type="text"
				></input>
			</div>
			<div class="my-icon-input" >
				<img class="user-icon" src="http://yj.kiy.cn/Content/Images/App/assets/login/pwdicon.png">
				<input 
				v-model="loginInfo.pwd" 
				placeholder="登录密码"
				class="my-input"
				type="password"
				></input>
			</div>

			<img class="login-btn" src="http://yj.kiy.cn/Content/Images/App/assets/login/loginbtn.png" @click="login">
			<text style="text-align: center;color: #999;margin-top:10px;" @click="downLoad">点击下载最新APP</text>
		</div>
	</div>

</div>    
</template>
<script>
	import { WxcButton } from 'weex-ui'
	import API from 'Utils/api'
	export default {
		data () {
			return  {
				deviceHeight: weex.config.eros.deviceHeight + weex.config.eros.statusBarHeight,
				loginInfo : {
					key: '',
					pwd: '',
				},
				jsVersion: weex.config.eros.jsVersion,
				curHomeBackTriggerTimes: 1,
      			maxHomeBackTriggerTimes: 2
			}
		},
		components: {
			WxcButton
		},
		beforeCreate: function () {
            
		},
		mounted () {
			this.loadStorage()
			this.androidFinishApp()
		},
		methods : {
			androidFinishApp () {
				const globalEvent = weex.requireModule('globalEvent')
				globalEvent.addEventListener('homeBack', options => {
				(this.curHomeBackTriggerTimes === this.maxHomeBackTriggerTimes) && this.$router.finish()
					this.curHomeBackTriggerTimes++
				})
			},
            loadStorage () {
                var nameAndPwd = this.$storage.getSync('nameAndPwd')
                if(nameAndPwd) {
                    this.loginInfo = nameAndPwd
                }
            },
			async login () {
				var _this = this;
				try {
					this.$notice.loading.show("正在登录")
					const RES = await API.YJ_LOGIN(this.loginInfo)
					this.$notice.loading.hide()
					if(RES.SUCCESS) {
                        this.$storage.setSync('nameAndPwd' , _this.loginInfo)
                        this.$storage.setSync('userInfo', RES.DATA)
						this.goMain()
					} else {
						_this.$notice.toast({
							message: RES.MESSAGE
						})
					}
				} catch (e) {
					this.$notice.loading.hide()
					this.$notice.toast({
						message: '登录失败'
					})
				}
				
			},
			goMain() {
				this.$router.setHomePage('/pages/yjapp/index.js')
				// this.$router.open({
				// 	name: 'main',
				// 	type: 'PUSH',
				// 	canBack: false
				// })
			},
			downLoad () {
				this.$router.openBrowser('http://yj.kiy.cn/Global/HotUpdate/HttpDownload')
			},
			checkQRCODE () {
				this.$image.preview({
					index: 1,                     // 所点击图片下标
					images: ['http://yj.kiy.cn/Content/Images/App/download.png'],        // 图片的网络地址
				})
			}
		}
	}
</script>
<style lang="sass" src='./login.scss'></style>