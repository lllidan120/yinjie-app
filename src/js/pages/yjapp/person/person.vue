<template>
  <div class="login-box">
			<!-- <img class="image" src="http://yj.kiy.cn/Content/Images/App/assets/login/logo.png"> -->
			<div class="my-icon-input" style="margin-bottom: 64px">
				<img class="user-icon" src="http://yj.kiy.cn/Content/Images/App/assets/person/old.png">
				<input 
				class="my-input" 
				v-model="oldPassword" 
				placeholder="请输入要修改的新密码"
				type="text"
				></input>
			</div>
			<div class="my-icon-input" >
				<img class="user-icon" src="http://yj.kiy.cn/Content/Images/App/assets/person/new.png">
				<input 
				v-model="newPassword" 
				placeholder="重新输入新密码"
				class="my-input"
				type="password"
				></input>
			</div>

			<img class="login-btn" src="http://yj.kiy.cn/Content/Images/App/assets/person/submit.png" @click="submit">
	</div>
</template>
<script>
import API from 'Utils/api'
export default {
  data () {
    return {
      oldPassword: '',
      newPassword: ''
    }
  },
  methods: {
    async submit () {
      const userInfo =  API.get_userInfo(this)
      console.log(userInfo)
      return


      if(this.oldPassword != newPassword) {
        modal.toast({
            message: '两次输入不一致，请重新输入',
            duration: 1
        })
      } else {
         this.userInfo = API.get_userInfo(this)
          const RES =  YJ_USERMANAGE({
            adminId: userInfo.adminId,
            Password: newPassword
          })
          this.$notice.toast({
              message: '修改成功'
          })

      }
    }
  }
}
</script>

<style scoped>
.login-box {
  position: relative;
  margin-top: 104px;
  width: 750px;
  height: 684px;
  background-color: rgba(255,255,255,0.8);
  text-align: center;
}
.image {
  display: block;
  margin-left: 185px;
  margin-top: 65px;
  margin-bottom: 86px;
  width:220px; 
  height:78px; 
  
}
.my-icon-input {
  flex-direction: row;
  width:750px; 
  height: 78px;
}
.user-icon {
  position: absolute;
  width: 44px;
  height: 44px;
  left: 40px;
  top: 20px;
}
.my-input {
  width:560px; 
  height:74px; 
  font-size: 24px;
  align-items: center;
  margin-left: 104px;
  line-height: 74px;
  font-size: 36px; 
  color: #2e2e2e ;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #2096f2;
}
.login-btn {
  width: 574px;
  height: 158px;
  margin-top: 77px;
  justify-content: center;
  /* align-items: center; */
  margin-left: 104px;
}
.title-bg1 {
  width: 750px;
  height: 1334px;
  position:absolute;
}
</style>
