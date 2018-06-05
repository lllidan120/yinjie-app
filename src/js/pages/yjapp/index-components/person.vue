<template>
  <waterfall :show-scrollbar="false">
    <header class="top"> 
      <image class="top-content-image" src="http://yj.kiy.cn/Content/Images/App/assets/person/top.png"></image>
      <image class="top-content-head" src="http://yj.kiy.cn/Content/Images/App/assets/person/head.png" @click="uplaodHead"></image>
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
            title: 'APP操作记录',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/main/4.png',
            name: 'apprecord'
          },
          {
            title: '使用帮助',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/main/拜访记录.png',
            name: 'helpindex'
          }
          
        ],
        bottomList2 : [
          {
            title: '退出登录',
            icon: 'http://yj.kiy.cn/Content/Images/App/assets/main/拜访登记.png',
            name: 'login'
          }
        ]
      }
    },
    beforeCreate: function () {

    },
    created () {
      var item = {
        title: 'APP版本检测  V ' + API.App_Version,
        icon: 'http://yj.kiy.cn/Content/Images/App/assets/main/开始配送.png',
        name: 'update'
      }
      this.bottomList.push(item)
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
          this.$router.setHomePage('/pages/yjapp/login.js')
        } else if (item.name == 'update') {
          this.checkUpdate()
        } else {
          this.$router.open({
            name: item.name,
            type: 'PUSH',
            params: item
          })
        }
      },
      async checkUpdate() {
        this.$notice.loading.show("检测APP版本...")
        var _this = this;
        var attr = weex.config.eros
        var data = {
          appName: attr.appName,
          version: API.App_Version,
          os: attr.os
        }
        this.$notice.toast({
          message: `${attr.jsVersion}`
        });
        var RES = await API.check_version(data)
        this.$notice.loading.hide()
        this.$notice.alert({
            title: '版本检测',
            message: RES.msg,
            okTitle: '确认',
            callback() {
              if(RES.resCode === 0) {
                // 需要更新
                _this.$router.finish()
              }
            }
        })
      },
      uplaodHead() {
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
    width: 400px;
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