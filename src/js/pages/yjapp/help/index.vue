<template>
  <wxc-tab-page ref="wxc-tab-page"
                :tab-titles="tabTitles"
                :tab-styles="tabStyles"
                title-type="text"
                :need-slider='true'
                :tab-page-height="tabPageHeight"
                @wxcTabPageCurrentTabSelected="wxcTabPageCurrentTabSelected">
    <list v-for="(v,index) in tabList"
          :key="index"
          class="item-container"
          :style="{ height: (tabPageHeight - tabStyles.height) + 'px' }">
      <cell v-for="(demo,key) in v"
            class="cell"
            :key="key">
        <wxc-pan-item :ext-id="'1-' + (v) + '-' + (key)"
                    url=""
                      @wxcPanItemPan="wxcPanItemPan">
         <div class="border-cell"></div>
         <div class="content">
                <text class="content-title">{{key + 1}} : {{demo.title}}</text>
                <image :src="demo.img" :style="demo.style"></image>
         </div>
        </wxc-pan-item>
      </cell>
    </list>
  </wxc-tab-page>
</template>


<script>
  const dom = weex.requireModule('dom');
  import { WxcTabPage, WxcPanItem, Utils, BindEnv } from 'weex-ui';

  import Config from './config'

  export default {
    components: { WxcTabPage, WxcPanItem },
    data: () => ({
      tabTitles: Config.tabTitles,
      tabStyles: Config.tabStyles,
      tabContent: Config.tabContent,
      tabList: [],
      demoList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      tabPageHeight: 1334
    }),
    created () {
      this.tabPageHeight = Utils.env.getPageHeight();
      this.tabList = [...Array(this.tabTitles.length).keys()].map(i => []);
      Vue.set(this.tabList, 0, this.tabContent[0]);
    },
    methods: {
      wxcTabPageCurrentTabSelected (e) {
        const self = this;
        const index = e.page;
        /* Unloaded tab analog data request */
        if (!Utils.isNonEmptyArray(self.tabList[index])) {
          setTimeout(() => {
            Vue.set(self.tabList, index, this.tabContent[index]);
          }, 100);
        }
      },
      wxcPanItemPan (e) {
        if (BindEnv.supportsEBForAndroid()) {
          this.$refs['wxc-tab-page'].bindExp(e.element);
        }
      }
    }
  };
</script>
<style scoped>
  .item-container {
    width: 750px;
    background-color: #f2f3f4;
  }

  .border-cell {
    background-color: #f2f3f4;
    width: 750px;
    height: 24px;
    align-items: center;
    justify-content: center;
    border-bottom-width: 1px;
    border-style: solid;
    border-color: #e0e0e0;
  }

  .cell {
    background-color: #ffffff;
    margin-bottom: 24px;
  }

  .content{
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 30px;
    width:750px;
    min-height:300px;
    border-bottom-width:1px;
    align-items: center;
    justify-content: center;
  }
  .content-title {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 36px;
      color: #000;
  }
</style>