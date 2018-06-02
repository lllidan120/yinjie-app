<template>
  <div>
    <div class="search-bar">
      <search-bar :searchType="searchType" :showScanBtn='true' @onChange="typeChange" @inputChange="inputChange" @scanClick="scanClick" @searchClick="searchClick">
      </search-bar>
      <datepick @selectTime="selectTime" @startDateFinish="startDateFinish" @endDateFinish="endDateFinish"></datepick>
    </div>
    <recycle-list for="(item, cellIndex) in listData" @loadmore="getData">
      <cell-slot>
        <div class="list">
          <div class="list-box">
            <div class="list-box-title" @click="toDetail(item)">
              <div class="list-col" style="width:300px;padding-left:15px;">
                <div class="icon-title-content">
                  <img class="list-title-icon" src="http://yj.kiy.cn/Content/Images/App/assets/icon/time.png">
                  <text class="title">入仓时间</text>
                </div>
                <text class="text center text-color">{{ item.DistributorDate ? item.DistributorDate : '暂无' }}</text>
              </div>
              <div class="list-col">
                <div class="icon-title-content">
                  <img class="list-title-icon" src="http://yj.kiy.cn/Content/Images/App/assets/icon/user.png">
                  <text class="title">会员号</text>
                </div>
                <text class="text center text-color">{{item.ThirdPlatformId}}</text>
              </div>
              <div class="list-col">
                <text class="blue">总金额: {{ item.Price }}</text>
                <text class="text">平台单:{{ item.CytMallId }}</text>
              </div>
            </div>
            <div class="list-box-content">
              <div class="list-box-content-left" @click="toDetail(item)">
                <image src="http://yj.kiy.cn/Content/Images/App/assets/icon/tabimg.png" class="list-box-content-left-icon"></image>
                <div class="col">
                  <text class="text gray-color">货物数量  </text>
                  <text class="text num-color" style="width:110px;">X{{item.Goods_Qty}}</text>
                  <text class="text gray-color"  v-if="item.oCount != 0">未收货  </text>
                  <text class="text num-color"  v-if="item.oCount != 0">X{{item.oCount}} </text>
                  <text class="text num-color"  v-if="item.oCount == 0">(已经全部收货)</text>
                </div>
                <div class="col">
                  <text class="text gray-color">物流编号  </text>
                  <text class="text text-color" style="width:110px;">{{item.Id}}</text>
                  <text class="text gray-color">生产单号  </text>
                  <text class="text text-color">{{item.ThirdPlatformOrderNo}} </text>
                </div>
                <div class="col" style="height: 100px;">
                  <image src="http://yj.kiy.cn/Content/Images/App/assets/icon/company.png" class="col-icon"></image>
                  <text class="address text text-color">{{ item.ReceiveName }}</text>
                </div>
              </div>
              <div class="list-box-content-right">
                <text class="enter-btn text" v-if="item.logState === 1 || item.logState === 2 || item.logState === 5 || item.logState === 10 || item.logState === 11 || item.logState === 6 || item.logState === 7 || item.logState === 8 " @click="ok(item)">确认收货</text>
                <text class="enter-btn text" v-if="item.IsPay === false" @click="payType(item)">代收货款</text>
              </div>
            </div>
          </div>
        </div>
      </cell-slot>
    </recycle-list>
    <image src='http://img.lanrentuku.com/img/allimg/1212/5-121204194026.gif' v-if="showload" style="height:40px;width:300px,align-items:center;background-color:#fff;" resize="contain" quality="original"></image>

    <bmmask class="mask" animation="transition" position="top" :duration="300" ref="payType">
      <bmpop class="modal-top">
        <div class="pay-content">
          <div class="pay-title">
            <text>请选择支付方式>></text>
          </div>
          <div class="pay-group">
            <image class="pay-type" src='http://yj.kiy.cn/Content/Images/App/assets/list/wechatpay.png' @click="pay(true)"></image>
            <image class="pay-type" src='http://yj.kiy.cn/Content/Images/App/assets/list/alipay.png' v-on:click="pay(false)" style="margin-left:80px;"></image>
          </div>
        </div>
      </bmpop>
    </bmmask>

    <wxc-popover ref="wxc-popover" :buttons="btns" :position="popoverPosition" :arrowPosition="popoverArrowPosition" @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>

  </div>

</template>

<script>
import { WxcPopover } from "weex-ui";
import searchBar from "../_mods/search-bar";
import datepick from "../_mods/datepick";
import API from "Utils/api";
export default {
  components: {
    searchBar,
    WxcPopover,
    datepick
  },
  data() {
    return {
      listData: [],
      param: {
        "@rowIndex": 0,
        "@pageSize": 20
      },
      type: "range",
      minimumDate: "",
      maximumDate: "",
      showload: false,
      payGroup: [],
      searchValue: "",
      searchType: "物流号",
      listType: "",
      btns: [
        {
          text: "物流号",
          key: "物流号"
        },
        {
          text: "会员号",
          key: "会员号"
        },
        {
          text: "订单号",
          key: "订单号"
        }
      ],
      popoverPosition: { x: 15, y: 100 },
      popoverArrowPosition: { pos: "top", x: 50 }
    };
  },
  computed: {
    userInfo() {
      var userInfo = API.get_userInfo(this);
      return userInfo;
    }
  },
  created() {
    this.$router.getParams().then(resData => {
      this.init(resData);
    });
  },
  mounted() {},
  methods: {
    async getData() {
      var _this = this;
      this.param["@rowIndex"]++;
      this.param = Object.assign(this.param, {
        "@adminId": this.userInfo.adminId
      });
      this.param = Object.assign(this.param, this.listType);
      if (this.searchValue != "") {
        if (this.searchType == this.btns[0].key) {
          // 物流号
          this.param = Object.assign(this.param, { "@id": this.searchValue });
        } else if (this.searchType == this.btns[1].key) {
          this.param = Object.assign(this.param, {
            // 会员号
            "@userId": this.searchValue
          });
        } else if (this.searchType == this.btns[2].key) {
          // 订单号
          this.param = Object.assign(this.param, {
            "@orderId": this.searchValue
          });
        }
      } else {
        this.param = Object.assign(this.param, { "@id": undefined });
        this.param = Object.assign(this.param, {"@userId": undefined});
        this.param = Object.assign(this.param, {"@orderId": undefined});
      }

      if (this.param["@rowIndex"] === 1) {
        _this.$notice.loading.show("正在加载");
      } else {
        this.showload = true;
      }
      var RES = await API.YJ_SEARCH(this.param);
      if (RES.SUCCESS) {
        if (this.param["@rowIndex"] === 1)  {
          this.listData = []
        }
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
        if (this.param["@rowIndex"] === 1) {
          _this.$notice.loading.hide();
        } else {
          this.showload = false;
        }
      }
    },
    init(param) {
      var par = param.params;
      this.$navigator.setCenterItem(
        {
          text: par.title,
          textColor: "",
          fontSize: "32",
          fontWeight: "normal"
        },
        () => {
          this.refresh();
        }
      );
      this.listType = param.type;
      // this.param = Object.assign(this.param , param.type)
      this.getData();
    },
    typeChange(value) {
      // this.searchType = value;
      this.$refs["wxc-popover"].wxcPopoverShow();
    },
    inputChange(val) {
      this.searchValue = val;
    },
    scanClick(val) {
      this.searchType = "物流号";
      this.searchValue = val;
      this.refresh();
    },
    searchClick(val) {
      this.searchValue = val
      this.refresh();
    },
    refresh() {
      this.param['@rowIndex'] = 0
      this.listData = [];
      this.getData();
    },
    startDateFinish(startDate) {
      this.param["@beginDate"] = startDate + " 00:00:00";
      if (this.param["@endDate"] == undefined) {
        this.param["@endDate"] = startDate + " 23:59:59";
      }
      console.log(this.param)
    },
    endDateFinish(endDate) {
      this.param["@endDate"] = endDate + " 23:59:59";
      if (this.param["@beginDate"] == undefined) {
        this.param["@beginDate"] = endDate + " 00:00:00";
      }
      console.log(this.param)
    },
    ok(item) {
      var _this = this;
      this.$notice.confirm({
        title: "物流号" + item.Id,
        message: `会员号${item.UserId}欠款${item.Freight}元，确认收货?`,
        okTitle: "确认收货",
        cancelTitl: "取消",
        okCallback() {
          _this.enterIn(item);
        },
        cancelCallback() {}
      });
    },
    async enterIn(item) {
      const param = { orderId: item.Id, adminId: this.userInfo.adminId };
      this.$notice.loading.show("正在加载");

      const RES = await API.YJ_ENTER(param);
      this.$notice.loading.hide();
      if (RES.SUCCESS) {
        this.listData.map((listItem , index) => {
          if(listItem.Id == item.Id) {
            this.listData[index].logState = 50;
          }
        })
        this.$notice.toast({
          message: RES.MESSAGE
        });
      }
    },
    payType(item) {
      this.payGroup = [];
      this.$refs["payType"].show();
      this.payGroup.push(item);
    },
    toDetail(item) {
      this.$router.open({
        name: "logistical-detail",
        type: "PUSH",
        params: item
      });
    },

    async pay(type) {
      const userInfo = this.userInfo;
      const payGroup = this.payGroup;
      const len = this.payGroup.length - 1;
      let orderGroup = "";
      let keyGroup = "";
      let payMoney = 0;
      payGroup.map((item, index) => {
        if (index === len) {
          orderGroup += item.CytMallId;
          keyGroup += item.Id;
        } else {
          orderGroup += item.CytMallId + ",";
          keyGroup += item.Id + ",";
        }
        payMoney += item.Price;
      });
      const param = {
        intMustPay: payMoney,
        orderId: orderGroup,
        key: keyGroup,
        adminId: userInfo.adminId,
        bweixin: type
      };
      try {
        var bweixin = type ? "微信支付" : "支付宝支付";
        this.$notice.loading.show(`你选择了${bweixin}`);
        const RES = await API.YJ_PAY(param);
        if (RES.SUCCESS) {
          this.$refs["payType"].hide();
          this.$notice.loading.hide();
          var par = Object.assign(param, RES.DATA);
          this.$notice.loading.hide();

          this.$router.open({
            name: "pay",
            type: "PRESENT",
            params: par
          });
        } else {
          this.$notice.loading.hide();
          this.$notice.toast({
            message: RES.MESSAGE
          });
        }
      } catch (ex) {
        this.$notice.loading.hide();
        this.$notice.toast({
          message: "网络繁忙，请稍后再试"
        });
      }
    },
    popoverButtonClicked(obj) {
      this.searchType = obj.key;
    }
  }
};
</script>

<style scoped>
.search-bar {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #dddddd;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-top {
  align-items: flex-start;
}

.calendar {
  height: 800px;
  background-color: #ffffff;
  select-color: #1da1f2;
}
.list {
  width: 750px;
  padding-left: 29px;
  background-color: #f3f6f7;
  padding-top: 13px;
  padding-bottom: 13px;
}
.list-box {
  width: 692px;
  height: 335px;
  background-color: #fff;
  border-radius: 12px;
  color: #666666;
}
.list-box-title {
  flex-direction: row;
  align-items: center;
  width: 644px;
  height: 102px;
  line-height: 102px;
  margin-left: 24px;
  font-size: 39px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-color: #e2e2e2;
}
.list-col {
  width: 152px;
  text-align: center;
}
.list-box-content {
  
}
.list-box-content-left {
  position: relative;
  width: 644px;
  height: 146px;
}
.list-box-content-right {
  display: felx;
  flex-direction: row;
  justify-content:flex-end;
  width: 644px;
  height: 88px;
  padding-top: 17px;
  padding-right: 8px;
  border-top-width: 1px;
  border-top-style: solid;
  border-color: #e2e2e2;
}
.enter-btn {
  width: 140px;
  height: 55px;
  line-height: 55px;
  text-align: center;
  background-color: #ffffff;
  color: #1da1f2;
  border-radius: 4px;
  margin-left: 42px;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.1);
}

.col {
  flex-direction: row;
  height: 46px;
  padding-left: 165px;
  padding-top: 16px;
}
.col-icon {
  width: 26px;
  height: 26px;
  margin-right: 15px;
}
.address {
  width: 450px;
  lines: 3;
  text-overflow: ellipsis;
}
.text {
  font-size: 25px;
}
.map {
  background-color: #42b983;
}

.loading {
  display: block;
  align-items: center;
}
.pay-content {
  margin-left: 84px;
  margin-top: 312px;
  width: 580px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
}
.pay-title {
  height: 105px;
  justify-content: center;
  padding-left: 48px;
  border-bottom-width: 1px;
  border-bottom-style: dotted;
  border-bottom-color: #cccccc;
}
.pay-group {
  flex-direction: row;
  padding-top: 52px;
  justify-content: center;
}
.pay-type {
  width: 215px;
  height: 66px;
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
.icon-title-content {
  flex-direction: row;
  align-items: center;
}
.list-title-icon {
  width: 21px;
  height: 21px;
  margin-right: 6px;
  margin-bottom: 5px;
}
.list-box-content-left-icon {
  position: absolute;
  width: 102px;
  height: 116px;
  left: 38px;
  top: 18px;
}
.blue {
  color: #2096f2;
  font-size: 25px;
}
.title {
  font-size: 25px;
  color: #666666;
}
.text-color {
  color: #333333;
}
.num-color {
  color: #deae07;
}
.gray-color {
  color:#666666;
}
</style>
