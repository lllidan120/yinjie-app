<template>
  <div class="login-box">
            <category title="扫描不成功，手工输入物流单号"></category>
			<div class="my-icon-input" style="margin-bottom: 64px">
				<img class="user-icon" src="http://yj.kiy.cn/Content/Images/App/assets/person/old.png">
				<input 
				class="my-input" 
				v-model="orderId" 
				placeholder="手工输入物流单号"
				type="text"
				></input>
			</div>

			<img class="login-btn" src="http://yj.kiy.cn/Content/Images/App/assets/person/submit.png" @click="submit">
	</div>
</template>
<script>
import API from 'Utils/api'
import Category from '../_mods/category'
export default {
    components: {
        Category
    },
  data () {
    return {
      orderId: ''
    }
  },
  methods: {
    async submit () {
        try {
            const userInfo =  API.get_userInfo(this)
            var par = {
                roleId: userInfo.RoleId,
                qr_code: this.orderId ,
                adminId: userInfo.adminId
            }
            this.$notice.loading.show();
            var res = await API.YJ_SCAN(par)    
            this.$notice.loading.hide();
            this.$notice.toast({message: res.MESSAGE})
        } catch (error) {
            this.$notice.loading.hide();
        }
    }
  }
}
</script>

<style scoped>
.login-box {
  position: relative;
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
  margin-top: 50px;
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
  margin-top: 30px;
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
