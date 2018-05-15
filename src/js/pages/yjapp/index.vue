<template>
  <wxc-tab-bar :tab-titles="tabTitles"
  :tab-styles="tabStyles"
  title-type="icon"
  @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected">
  <!-- 第一个页面内容-->
  <div class="item-container" :style="contentStyle">
   <mian></mian>
 </div>

 <!-- 第二个页面内容-->
 <div class="item-container" :style="contentStyle">
   <distribution></distribution>
 </div>

 <!-- 第三个页面内容-->
 <div class="item-container" :style="contentStyle">
  <person></person>
</div>

</wxc-tab-bar>
</template>

<style scoped>
  .item-container {
    width: 750px;
    background-color: #f2f3f4;
    align-items: center;
    justify-content: center;
  }
</style>
<script>
  import API from 'Utils/api.js'
  import { WxcTabBar, Utils } from 'weex-ui';
  import mian from './index-components/main'
  import person from './index-components/person'
  import distribution from './index-components/distribution'
  import Config from './config'

  export default {
    components: { WxcTabBar ,mian ,distribution ,person},
    data: () => ({
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles,
      curHomeBackTriggerTimes: 1,
      maxHomeBackTriggerTimes: 2,
    }),
    created () {
      const tabPageHeight = Utils.env.getPageHeight();

      // 如果页面没有导航栏，可以用下面这个计算高度的方法
      // const tabPageHeight = Utils.env.deviceHeight / Utils.env.deviceWidth * 750;
      const { tabStyles } = this;
      this.contentStyle = { height: (tabPageHeight) + 'px' };
      this.androidFinishApp()
      
    },
    mounted () {
      this.isLogin()
    },
    methods: {
      wxcTabBarCurrentTabSelected (e) {
        const index = e.page;
        
      },
      androidFinishApp () {
        const globalEvent = weex.requireModule('globalEvent')
        globalEvent.addEventListener('homeBack', options => {
          (this.curHomeBackTriggerTimes === this.maxHomeBackTriggerTimes) && this.$router.finish()
          this.curHomeBackTriggerTimes++
          // this.$notice.toast({ message: `点击返回${this.maxHomeBackTriggerTimes}次之后，会关闭应用，当前点击第${this.curHomeBackTriggerTimes}次` })
        })
      },
      isLogin () {
        const _this = this;
        var userInfo = API.get_userInfo(this);
        if(userInfo){
          _this.userInfo = userInfo
          
        } else {
          this.toLoginPage()
        }
      },
      toLoginPage() {
        this.$router.open({
          name: 'login',
          type: 'PRESENT',
          canBack: false
        })
      }
    }
  };
</script>