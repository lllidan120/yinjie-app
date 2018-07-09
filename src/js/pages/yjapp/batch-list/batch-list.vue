<template>
	<div>
		<div class="search-bar">
			<search-bar 
				:searchType="searchType" 
				@onChange="typeChange" 
				@inputChange="inputChange"
				@scanClick="scanClick" 
				@searchClick="searchClick">
			</search-bar>
			<datepick @selectTime="selectTime" @startDateFinish="startDateFinish" @endDateFinish="endDateFinish"></datepick>
			<div class="search-batch">
				<text class="search-batch-btn" v-if="sub == '批量收款'" @click="payType">{{sub}}</text>
				<text class="search-batch-btn" v-if="sub == '批量收货'" @click="ok">{{sub}}</text>
				<!-- <div class="example">
					<text class="label">全选</text>
					<switch :checked="selectAllStatu" @change="selectAll" ref="selectAll"></switch>
				</div> -->
			</div>
		</div>
		<scroller class="scroller" :show-scrollbar="false" @loadmore="getData" loadmoreoffset="10">
			<wxc-checkbox-list ref="payList" :list="listData" @wxcCheckBoxListChecked="wxcCheckBoxListChecked"></wxc-checkbox-list>
		</scroller>
		<image src='http://img.lanrentuku.com/img/allimg/1212/5-121204194026.gif' v-if="showload" style="height:40px;width:300px,align-items:center;background-color:#fff;" resize="contain" quality="original"></image>
		<bmmask class="mask" animation="transition" position="top" :duration="300" ref="payType">
			<bmpop class="modal-top">
				<div class="pay-content">
					<div class="pay-title">
						<text>请选择支付方式>></text>
					</div>
					<div class="pay-group">
						<image class="pay-type" src='http://yj.kiy.cn/Content/Images/App/assets/list/wechatpay.png' @click="pay(true)"></image>
						<image class="pay-type" src='http://yj.kiy.cn/Content/Images/App/assets/list/alipay.png' @click="pay(false)" style="margin-left:80px;"></image>
					</div>
				</div>
			</bmpop>
		</bmmask>
		<wxc-popover ref="wxc-popover" :buttons="btns" :position="popoverPosition" :arrowPosition="popoverArrowPosition" @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
	</div>

</template>
<script>
import searchBar from "../_mods/search-bar";
import { WxcCheckboxList, WxcPopover } from "weex-ui";
import datepick from "../_mods/datepick";
import API from "Utils/api";
export default {
  components: {
    searchBar,
    WxcCheckboxList,
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
      sub: "",
      selectAllStatu: false,
      listType: "",
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
  mounted() {
    this.$event.on("paySuccess", params => {
      this.selectAllStatu = false;
      this.refresh();
    });
  },
  methods: {
    wxcCheckBoxListChecked(e , i) {
      if(e.checkedList.length != this.listData.length) {
          this.selectAllStatu = false
      } else {
          this.selectAllStatu = true
      }
    },
    selectAll(type) {
      // 全选
      
      this.selectAllStatu = type.value;
      
      this.listData.map((item, index) => {
        this.listData[index].checked = type.value;
      });
    },
    async getData() {
      var _this = this;
      this.param["@rowIndex"]++;
      this.param = Object.assign(this.param, {
        "@adminId": this.userInfo.adminId
      });
      this.param = Object.assign(this.param, this.listType);
       this.param= Object.assign( this.param , {'@orderStatu' : '50,51,48,33'})
      
      if (this.searchValue != "") {
        if (this.searchType == "物流号") {
          this.param = Object.assign(this.param, { "@id": this.searchValue });
        } else if (this.searchType == "会员号") {
          this.param = Object.assign(this.param, {"@userId": this.searchValue});
        } else if (this.searchType == "订单号") {
          this.param = Object.assign(this.param, {"@orderId": this.searchValue});
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
        if (this.param["@rowIndex"] === 1) {
          this.listData = []
        }
        var RESDATA = JSON.parse(RES.DATA);
        var DGDATA = JSON.parse(RESDATA.dgData);
        if (DGDATA.length != 0) {
          DGDATA.map(item => {
            item.title = `订单号: ${item.Id} | 代收：${item.Price}元                                             收件人：${item.ReceiveName} | 会员号：${item.UserId}                                                                                        收货时间:${item.DistributorDate}`;
            item.value = item.Id
            item.checked = false
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
      this.sub = par.sub;
      this.$navigator.setCenterItem(
        {
          text: par.sub,
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
    searchClick(value) {
      this.searchValue = value
      this.refresh();
    },
    refresh() {
      this.param['@rowIndex'] = 0
      this.listData = [];
      this.getData();
    },
    selectTime(timeName) {
      this.$refs[timeName].show();
    },
    startDateFinish(startDate) {
      this.param["@beginDate"] = startDate + " 00:00:00";
      if (this.param["@endDate"] == undefined) {
        this.param["@endDate"] = startDate + " 23:59:59";
      }
    },
    endDateFinish(endDate) {
      this.param["@endDate"] = endDate + " 23:59:59";
      if (this.param["@beginDate"] == undefined) {
        this.param["@beginDate"] = endDate + " 00:00:00";
      }
    },
    ok() {
      var _this = this;
      var arr = [];
      var idGroup = "";
      var userIdGroup = "";
      this.listData.map(item => {
        if (item.checked) {
          arr.push(item);
        }
      });
      var len = arr.length - 1;
      arr.map((res, index) => {
        if (index == len) {
          idGroup += res.Id;
        } else {
          idGroup += res.Id + ",";
        }
      });
      this.$notice.confirm({
        title: "确认批量收货",
        message: `批量操作订单号:${idGroup},确认？`,
        okTitle: "确认收货",
        cancelTitl: "取消",
        okCallback() {
          _this.enterIn(idGroup);
        },
        cancelCallback() {}
      });
    },
    async enterIn(idGroup, userIdGroup) {
      const param = { orderId: idGroup, adminId: this.userInfo.adminId };
      this.$notice.loading.show("正在加载");
      const RES = await API.YJ_ENTER(param);
      this.$notice.loading.hide();
      if (RES.SUCCESS) {
        this.$notice.toast({
          message: RES.MESSAGE
        });
        this.selectAllStatu = false;
        this.getData();
      } else {
        this.$notice.toast({
          message: RES.MESSAGE
        });
      }
    },
    payType() {
      this.payGroup = [];
      this.$refs["payType"].show();
      // this.listData.map(item => {
      //   if (item.checked) {
      //     this.payGroup.push(item);
      //   }
      // });
    },
    selectThat(item) {
      console.log(item);
    },
    async pay(type) {
      const checkList = this.$refs.payList.checkedList;
      // return
      var selectList = []
      checkList.map(item => {
        this.listData.map(obj => {
          if(obj.Id === item) {
            selectList.push(obj)
          }
        })
      })
      if(selectList.length === 0) {
        this.$notice.toast({
          message: "请至少选择一条单支付"
        });
        return
      }
      const userInfo = this.userInfo;
      const payGroup = selectList;
      const len = selectList.length - 1;
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
.search-batch {
  width: 750px;
  height: 100px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eee;
}
.search-batch-btn {
  width: 400px;
  height: 80px;
  line-height: 80px;
  color: #fff;
  border-radius: 12px;
  text-align: center;
  background-color: #1da1f2;
}
.bottom-box {
  position: relative;
  width: 750px;
  height: 100px;
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
.example {
  position: absolute;
  right: 0px;
  top: 20px;
  flex-direction: row;
  justify-content: flex-start;
}
.label {
  font-size: 20px;
  line-height: 60px;
  width: 350px;
  color: #666;
  text-align: right;
  margin-right: 20px;
}
.info {
  font-size: 30px;
  line-height: 60px;
  color: #bbb;
  margin-left: 10px;
}
</style>
