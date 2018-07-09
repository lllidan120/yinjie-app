<template>
	<scroller>
		<div class="search-bar">
			<search-bar :showScanBtn="true"
			            :searchType="searchType"
			            @onChange="typeChange"
			            @inputChange="inputChange"
			            @scanClick="scanClick"
			            @searchClick="searchClick">
			</search-bar>
			<datepick @selectTime="selectTime"
			          @startDateFinish="startDateFinish"
			          @endDateFinish="endDateFinish"></datepick>
		</div>
		<scroller :scroll-direction="scrollType"
		          class="table"
		          @touchstart="ontouchstart">
			<div class="table-cell">
				<div class="table-td table-head">
					<text class="table-text">订单号</text>
				</div>
				<div class="table-td table-head widthDate">
					<text class="table-text">用户名</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">数量</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">已付款</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">订单总额</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">订单状态</text>
				</div>
				<div class="table-td table-head widthDate">
					<text class="table-text">产品名称</text>
				</div>
				<div class="table-td table-head widthDate">
					<text class="table-text">订单日期</text>
				</div>
				<div class="table-td table-head">
					<text class="table-text">会员号</text>
				</div>
				<div class="table-td table-head width270">
					<text class="table-text">店铺名称</text>
				</div>
			</div>
			<recycle-list ref="list"
			              for="(item, cellIndex) in listData"
			              @loadmore="getData">
				<cell-slot>
					<div class="table-cell"
					     @click="toDetail(item)">
						<div class="table-td">
							<text class="table-text">{{item.Id}}</text>
						</div>
						<div class="table-td widthDate">
							<text class="table-text">{{item.RealName}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.Shuliang}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.ReceivedAmount}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.OrderAmount}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.OrderStatusStr}}</text>
						</div>
						<div class="table-td widthDate">
							<text class="table-text">{{item.Cailiao}}</text>
						</div>
						<div class="table-td widthDate">
							<text class="table-text">{{item.OrderDate}}</text>
						</div>
						<div class="table-td">
							<text class="table-text">{{item.UserId}}</text>
						</div>
						<div class="table-td width270">
							<text class="table-text">{{item.ShopName}}</text>
						</div>

					</div>
				</cell-slot>
			</recycle-list>
		</scroller>
		<image src='http://yj.kiy.cn/Content/Images/App/assets/5-121204194026.gif'
		       v-if="showload"
		       style="height:40px;width:300px,align-items:center;background-color:#fff;"
		       resize="contain"
		       quality="original"></image>

		<bmmask class="mask"
		        animation="transition"
		        position="top"
		        :duration="300"
		        ref="bmmask">
			<bmpop class="modal-top">
				<bmcalendar class="calendar"
				            :selectType="type"
				            ref="calendar"
				            @finish="finish"
				            :startDate="startDate"
				            :endDate="endDate"
				            :maximumDate="maximumDate"
				            :minimumDate="minimumDate"></bmcalendar>
			</bmpop>
		</bmmask>

		<wxc-popover ref="wxc-popover"
		             :buttons="btns"
		             :position="popoverPosition"
		             :arrowPosition="popoverArrowPosition"
		             @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>

	</scroller>

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
        page_no: 0,
        page_size: 15
      },
      searchValue: "",
      type: "range",
      minimumDate: "",
      maximumDate: "",
      startDate: "",
      endDate: "",
      showload: false,
      payGroup: [],
      scrollType: "horizontal",
      searchType: "订单号",
      btns: [
        {
          text: "订单号",
          key: "订单号"
        },
        {
          text: "会员号",
          key: "会员号"
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
      this.param["page_no"]++;
      if (this.searchType == this.btns[0].key && this.searchValue != "") {
        this.param = Object.assign(this.param, { orderId: this.searchValue });
      }
      if (this.searchType == this.btns[1].key && this.searchValue != "") {
        this.param = Object.assign(this.param, { userId: this.searchValue });
      }
      if (this.userInfo.RoleId === 1 || this.userInfo.RoleId === 4) {
      } else {
        this.param = Object.assign(this.param, {
          DeliverPhone: this.userInfo.Mobile
        });
      }
      if (this.param["page_no"] === 1) {
        _this.$notice.loading.show("正在加载");
      } else {
        this.showload = true;
      }

      var RES = await API.KIY_SEARCHORDER(this.param);
      if (RES.Success) {
        if (this.param["page_no"] === 1) {
          this.listData = [];
        }
        var RESDATA = JSON.parse(RES.Data);
        var DGDATA = RESDATA.data.Models;
        if (DGDATA.length != 0) {
          DGDATA.map(item => {
            var date = item.OrderDate.split("T");
            item.OrderDate = `${date[0]} ${date[1]}`;
            this.listData.push(item);
          });
          console.log(JSON.stringify(this.listData[0]));
        } else {
          this.$notice.toast({
            message: "已经到底部"
          });
        }
        if (this.param["page_no"] === 1) {
          _this.$notice.loading.hide();
        } else {
          this.showload = false;
        }
      }
      // this.$refs["list"].refreshEnd()
    },
    init(param) {
      var par = param;
      this.$navigator.setCenterItem(
        {
          text: par.title, // 展示的文字 (和图片 二选一)
          textColor: "", // 文字颜色 (默认为白色)
          fontSize: "32", // 字号（默认32px）
          fontWeight: "normal" // 是否加粗（默认不加粗）
        },
        () => {
          this.refresh();
        }
      );
      this.param = Object.assign(this.param, param.type);
      this.getData();
    },
    typeChange(value) {
      this.$refs["wxc-popover"].wxcPopoverShow();
    },
    searchClick(value) {
      this.param["page_no"] = 0;
      this.getData();
      this.$tools.resignKeyboard().then(
        resData => {
          // 收起成功的回调
        },
        error => {}
      );
    },
    scanClick(val) {
      this.searchValue = val;
      this.refresh();
    },
    refresh() {
      this.param["page_no"] = 0;
      this.getData();
    },
    finish(params) {
      this.$notice.toast({
        message:
          "开始时间：" + params.startDate + "\r\n结束时间：" + params.endDate
      });
      this.searchType = {
        "@startDate": params.startDate,
        "@endDate": params.endDate
      };
      this.$refs["bmmask"].hide();
    },
    startDateFinish(startDate) {
      this.param["startTime"] = startDate + " 00:00:00";
      if (this.param["endTime"] == undefined) {
        this.param["endTime"] = startDate + " 23:59:59";
      }
    },
    endDateFinish(endDate) {
      this.param["endTime"] = endDate + " 23:59:59";
      if (this.param["startTime"] == undefined) {
        this.param["startTime"] = endDate + " 00:00:00";
      }
    },
    inputChange(val) {
      this.searchValue = val;
    },
    changeType(item) {
      this.param = {
        page_no: 0,
        page_size: 15
      };
      this.searchId = item;
      this.getData();
    },
    changeProper(item) {},
    async toDetail(item) {
      // const RES = await API.YJ_GetOrder({'@cytId' : item.Id})
      // var wuliuItem = JSON.parse(RES.DATA)
      let Router = "order-detail";
      let Item = item;
      // if(wuliuItem.length != 0) {
      // 	Router = 'logistical-detail'
      // 	Item = wuliuItem[0]
      // }
      this.$router.open({
        name: Router,
        type: "PUSH",
        params: Item
      });
    },
    popoverButtonClicked(obj) {
      this.searchType = obj.key;
    }
  }
};
</script>

<style scoped>
.blue-color {
  color: #2096f2;
}

.title {
  color: #666666;
}

.text-color {
  color: #333333;
}

.num-color {
  color: #deae07;
}

.gray-color {
  color: #666666;
}
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
  /* padding-left: 28px; */
  background-color: #f3f6f7;
}

.user-box {
  margin-top: 8px;
  flex-direction: row;
}
.blue-bg {
  background-color: #9fd4fd;
  padding: 8px;
  border-radius: 4px;
}
.shuliang {
  position: absolute;
  flex-direction: column;
  align-items: center;
  top: 45px;
  right: 32px;
  height: 88px;
}
.other {
  position: absolute;
  top: 20px;
  right: 0px;
  font-size: 25px;
  color: #666666;
}

.col {
  flex-direction: row;
  height: 40px;
  /* padding-left: 23px; */
}
.col-icon {
  width: 106px;
  height: 15px;
  margin-top: 7px;
  margin-right: 15px;
}
.address {
  width: 500px;
  text-overflow: ellipsis;
}
.text {
  font-size: 25px;
}
.map {
  background-color: #42b983;
}
.enter-btn {
  width: 144px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  background-color: #2096f2;
  color: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
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

.table {
  width: 1650px;
  min-height: 750px;
}
.table-cell {
  position: relative;
  flex-direction: row;
}
.table-td {
  display: block;
  float: left;
  width: 150px;
  height: 100px;
  line-height: 100px;
  align-items: center;
  justify-content: center;
  border-width: 2px;
  border-color: #2096f2;
  border-style: solid;
  background-color: #fff;
}
.table-text {
  font-size: 26px;
}
.table-head {
  background-color: #e9eaec;
  height: 75px;
  line-height: 75px;
}
.width270 {
  width: 270px;
}
.widthDate {
  width: 160px;
}
</style>
