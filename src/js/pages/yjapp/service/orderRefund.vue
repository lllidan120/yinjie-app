<template>
  <scroller>
    <wxc-cell label="售后类型 >"
                :title="pos"
                :has-arrow="false"
                :has-top-border="true"
                @wxcCellClicked="location"></wxc-cell>
    <wxc-cell label="退款理由 >"
                :title="pos"
                :has-arrow="false"
                :has-top-border="true"
                @wxcCellClicked="location"></wxc-cell>
    <wxc-cell label="退款方式 >"
                :title="pos"
                :has-arrow="false"
                :has-top-border="true"
                @wxcCellClicked="location"></wxc-cell>
    <wxc-cell title="退款金额"
                :has-arrow="false"
                :has-top-border="true">
        <div class="wxc-search-bar" slot="value">
				<input class="search-bar-input"/>
        </div>
    </wxc-cell>
    <wxc-cell title="备注"
                :has-arrow="false"
                :has-top-border="true">
        <div class="wxc-search-bar" slot="value">
				<input class="search-bar-input"/>
        </div>
    </wxc-cell>
    <wxc-cell title="联系人"
                :has-arrow="false"
                :has-top-border="true">
        <div class="wxc-search-bar" slot="value">
				<input class="search-bar-input"/>
        </div>
    </wxc-cell>
    <wxc-cell title="联系电话"
                :has-arrow="false"
                :has-top-border="true">
        <div class="wxc-search-bar" slot="value">
				<input class="search-bar-input"/>
        </div>
    </wxc-cell>
    <category title="售后凭证"></category>
    
    <div class="image-group" >
        <div v-for="(item , key) in imageGroup" :key="key">
            <image class="image" :src="item"></image>
        </div>
        <div class="tool-btn" @click="pick">
            <image class="tool-image" ref="main_image" src="https://gw.alicdn.com/tfs/TB1PZ25antYBeNjy1XdXXXXyVXa-128-128.png" />
        </div>
    </div>
  </scroller>
</template>
<script>
import { WxcCell , WxcButton } from 'weex-ui';
import category from '../_mods/category'
var amap = weex.requireModule('amap')
export default {
  components: {
    WxcCell,
    category,
    WxcButton
  },
  data () {
    return {
      imageGroup:[],
      pos: ''
    }
  },
  methods: {
    location () {
       var _this = this;
       _this.$notice.loading.show('正在定位...');
        amap.initAmap('349219d285861a2745a23276039a0ddb')
        this.$geo.get().then(data => {
            _this.pos = data.locationLat + ' ' + data.locationLng
            _this.$notice.loading.hide();
        }, error => {
          _this.$notice.loading.hide();
            _this.$notice.toast({
                message: '获取地址失败'
            })
        })
    },
    car () {
      var _this = this;
      this.$image.camera({               
      })
      .then(resData => {
          console.log(resData)   
          resData.map(item => {
            _this.imageGroup.push(item)
          })
      }, error => {
          console.log(error)
      })
    },
    pick () {
        var _this = this;
        var len = 3 - this.imageGroup.length

        this.$image.pick({
            maxCount: len            
        })
        .then(resData => {
            console.log(resData)   
            resData.map(item => {
              _this.imageGroup.push(item)
            })
        }, error => {
            console.log(error)
        })
    }
  }
}
</script>
<style>
.image-group {
    flex-direction: row;
    padding-left: 20px;
}
.image {
    width: 150px;
    height: 150px;
    margin-right: 20px;
    margin-top: 20px;
}
.tool-image {
  width: 60px;
  height: 60px;
}

.tool-text {
  color: #ffffff;
  font-size: 30px;
}

.tool-btn {
  margin-top: 50px;
  margin-left: 20px;
  width: 100px;
  height: 100px;
  background-color: #2096f2;
  align-items: center;
  justify-content: center;
  border-radius: 50;

}
.wxc-search-bar {
    background-color: #ffffff;
    width: 500px;
    height: 50px;
    flex-direction: row;
}
.search-bar-input {
  padding-bottom: 0;
  padding-right: 40px;
  padding-left: 40px;
  font-size: 26px;
  width: 500px;
  height: 50px;
  line-height: 50px;
  background-color: #E5E5E5;
  color: #000;
  border-radius: 6px;
}


</style>
