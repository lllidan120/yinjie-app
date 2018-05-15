<template>
  <waterfall :show-scrollbar="false">
    <header class="top"> 
      <image class="top-content-image" src="bmlocal://assets/person/top.png"></image>
      <image class="top-content-head" src="bmlocal://assets/person/head.png"></image>
      <text class="top-content-text user">ID: {{ userInfo.Account }}</text>
      <text class="top-content-text date">角色: {{ userInfo.RoleName }}</text>
    </header>
    <cell class="bottom">
      <div class="bottom-box" v-for="(item , index) in bottomList" @click="goPage(item)" :key ="index">
        <image class="bottom-box-left" :src="item.icon"></image>
        <text class="bottom-box-center">{{ item.title }}</text>
        <wxc-icon name="more" class="bottom-box-right"></wxc-icon>
      </div>
    </cell>
    <cell class="bottom">
      <div class="bottom-box" v-for="(item , index) in bottomList2" @click="goPage(item)" :key = "index">
        <image class="bottom-box-left" :src="item.icon"></image>
        <text class="bottom-box-center">{{ item.title }}</text>
        <wxc-icon name="more" class="bottom-box-right"></wxc-icon>
      </div>
    </cell>
  </waterfall>      
</template>
<script>
  import { Utils , wxcIcon } from 'weex-ui'
  import API from 'Utils/api'
  export default {
    components : {
      wxcIcon
    },
    computed : {

    },
    data () {
      return {
        userInfo: {
          Account: '',
          RoleName: ''
        },
        bottomList : [
          {
            title: '修改密码',
            icon: 'bmlocal://assets/main/开始配送.png',
            name: 'person'
          }
        ],
        bottomList2 : [
          {
            title: '退出登录',
            icon: 'bmlocal://assets/main/拜访登记.png',
            name: 'login'
          }
        ]
      }
    },
    beforeCreate: function () {

    },
    created () {

    },
    mounted () {
      this.userInfo = API.get_userInfo(this)


    },
    computed :  {

    },  
    methods : {
      goPage (item) {
        if(item.name == 'login'){
          this.$storage.deleteSync('userInfo')
          this.$router.open({
            name: item.name,
            type: 'PUSH',
            canBack: false
          })
        } else {
          this.$router.open({
            name: item.name,
            type: 'PUSH',
            params: item
          })
        }
        
      }
    }
  }
</script>
<style scoped>
  .top {
    width: 750px;
    height: 523px;
    margin-bottom: 50px;
  }
  .top-content {
    position: absolute;
    top: 308px;
    left: 72px;
    width: 610px;
    height: 218px;
    align-items:center;
    justify-content: center;
    background-color: #fff;
    border-radius: 4px;
    z-index: 999;
  }
  .top-content-image {
    position: absolute;
    width: 750px;
    height: 523px;
  }
  .top-content-head {
    width: 200px;
    height: 200px;
    margin-top: 168px;
    margin-left: 274px;
  }
  .top-content-text {
    text-align: center;
    color: #000;
    
  }
  .user {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .bottom {
    padding-top: 50px;
  }
  .bottom-box {
    flex-direction:row;
    align-items:center;

    width: 750px;
    height: 95px;
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