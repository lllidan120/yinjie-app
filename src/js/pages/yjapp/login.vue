<template>
	<div>
		<div 
		class="login-content"
		:style="{'height': deviceHeight}"
		>
		<!-- 背景图片start -->
		<image resize="stretch" class="title-bg1" src="bmlocal://assets/login/loginbg.png"></image>
		<!-- end -->
		<div class="login-box">
			<img class="image" src="bmlocal://assets/login/logo.png">
			<div class="my-icon-input" style="margin-bottom: 30px">
				<img class="user-icon" src="bmlocal://assets/login/usericon.png">
				<input 
				class="my-input" 
				v-model="loginInfo.key" 
				placeholder="用户名热更新"
				type="text"
				></input>
			</div>
			<div class="my-icon-input" >
				<img class="user-icon" src="bmlocal://assets/login/pwdicon.png">
				<input 
				v-model="loginInfo.pwd" 
				placeholder="登录密码"
				class="my-input"
				type="password"
				></input>
			</div>

			<img class="login-btn" src="bmlocal://assets/login/loginbtn.png" @click="login">
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
				}
			}
		},
		components: {
			WxcButton
		},
		beforeCreate: function () {
            
		},
		mounted () {
			this.loadStorage()
		},
		methods : {
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
					this.$notice.toast({
						message: '登录失败'
					})
				}
				
			},
			goMain() {
				this.$router.open({
					name: 'main',
					type: 'PUSH',
					canBack: false
				})
			}
		}
	}
</script>
<style lang="sass" src='./login.scss'></style>