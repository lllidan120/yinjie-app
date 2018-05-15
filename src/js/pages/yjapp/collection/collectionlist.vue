<template>
  <div>
    <datepick @selectTime="selectTime" @startDateFinish="startDateFinish" @endDateFinish="endDateFinish"></datepick>
    <list @loadmore="getData" ref="list" loadmoreoffset="10" :showRefresh="true" @refresh="onrefresh">
      <cell v-for="(item,index) in listData" :key="index">
        <div class="border-cell" @click="toDetail(item)">
          <img class="img left" v-if="item.payType === '微信'" src="bmlocal://assets/wechatpay.png" alt="">
          <img class="img left" v-if="item.payType === '支付宝'" src="bmlocal://assets/alipay.png" alt="">
          <div class="center">
            <text class="text">{{item.out_trade_no}}</text>
            <text class="text overflow">订单号：{{item.strIDs}}</text>
            <text class="text" style="color: #333;">{{item.realName}} {{item.dCreateTime}}</text>
          </div>
          <text class="right">{{item.intMoney}}元</text>
        </div>
      </cell>
    </list>
    <image src='http://img.lanrentuku.com/img/allimg/1212/5-121204194026.gif' v-if="showload" style="height:40px;width:300px,align-items:center;background-color:#fff;" resize="contain" quality="original"></image>
  </div>
</template>
<script>
import API from "Utils/api";
import datepick from '../_mods/datepick'

export default {
  components: {
    datepick
  },
  data() {
    return {
      listData: [],
      param: {
        "@rowIndex": 0,
        "@pageSize": 20
      },
      wechatpay: "bmlocal://assets/wechatpay.png",
      alipay: "bmlocal://assets/alipay.png",
      showload: false,
      refresh: false,
    };
  },
  computed: {
    userInfo() {
      var userInfo = API.get_userInfo(this);
      return userInfo;
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(loadmore) {
      var _this = this;
      this.param["@rowIndex"]++;
      if (loadmore != "undefined") {
        this.showload = true;
      }
      this.param = Object.assign(this.param, { "@adminId": this.userInfo.adminId });
      try {
        var RES = await API.YJ_PAYMENTLIST(this.param);
        var RESDATA = JSON.parse(RES.DATA);
        var DGDATA = JSON.parse(RESDATA.dgData);
        if (DGDATA.length != 0) {
          DGDATA.map(item => {
            this.listData.push(item);
          });
        } else {
          this.$notice.toast({
            message: "已经到底部"
          });
        }

        if (this.refresh) {
          this.$refs["list"].refreshEnd();
          this.refresh = false;
        }
        if (loadmore != "undefined") {
          this.showload = false;
        }
      } catch (error) {
        console.log(error);
      }
    },
    onrefresh() {
      this.reset()
      this.refresh = true;
      this.param = {
        "@rowIndex": 0,
        "@pageSize": 20
      }
      this.getData();
    },
    toDetail(item) {
      this.$router.open({
        name: 'collection',
        type: 'PUSH',
        params: item
      })	
    },
    startDateFinish (startDate) {
      this.reset()
      this.param["@beginDate"] = startDate + " 00:00:00";
      console.log(this.param["@endDate"])
      if(this.param["@endDate"] == undefined) {
        this.param["@endDate"] = " 23:59:59"
      }
      this.getData()
    },
    endDateFinish (endDate) {
      this.reset()
      this.param["@endDate"] = endDate + " 23:59:59";
      if(this.param["@beginDate"] == undefined) {
        this.param["@beginDate"] = " 00:00:00"
      }
      this.getData()
    },
    reset() {
      this.param["@rowIndex"] = 0;
      this.listData = [];
    }
    
  }
};
</script>
<style scoped>
.border-cell {
  flex-direction: row;
  align-items: center;
  width: 750px;
  height: 150px;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-style: dotted;
  border-bottom-color: #cccccc;
}
.img {
  width: 100px;
  height: 100px;
}
.left {
  margin-left: 25px;
  margin-right: 25px;
}
.center {
  width: 475px;
  margin-right: 25px;
}
.right {
  width: 100px;
  color: #2096f2;
}
.overflow {
  lines: 1;
  text-overflow: ellipsis;
}
.text {
  font-size: 26px;
  margin-bottom: 5px;
}
.search-date {
  flex-direction: row;
  justify-content: center;
  height: 100px;
  background-color: rgba(31, 181, 252, 0.4);
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #eee;
}
.search-date-text {
  text-align: center;
  width: 375px;
  height: 100px;
  line-height: 100px;
  color: #000;
}

</style>