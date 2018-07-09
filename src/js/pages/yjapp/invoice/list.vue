<template>
	<div class="page">
		<div class="search-bar">
			<search-bar 
				:searchType="searchType" 
                :searchTypeTwo="searchTypeTwo"
				@onChange="typeChange" 
				@inputChange="inputChange"
				@scanClick="scanClick" 
				@searchClick="searchClick">
			</search-bar>
			<datepick @selectTime="selectTime" @startDateFinish="startDateFinish" @endDateFinish="endDateFinish"></datepick>
		</div>
        <div class="table-cell">
            <div class="table-td table-head"><text class="table-text">订单号</text></div>
            <div class="table-td table-head"><text class="table-text">会员号</text></div>
            <div class="table-td table-head width-200px"><text class="table-text">日期</text><text class="table-text">是否打印</text></div>
            <div class="table-td table-head"><text class="table-text" style="color:red;">应收款</text><text class="table-text" style="color:green;">已收款</text></div>
            <div class="table-td table-head width-100px"><text class="table-text">发货额</text></div>
        </div>
        <!-- @loadmore="getData" -->
        <list class="bui-list" ref="list" :show-scrollbar="true" :showRefresh="true" @refresh="onRefresh"   loadmoreoffset="2">
            <cell class="table-cell" v-for="(item , key) in listData" @click="toDetail(item)" :key="key">
                <div class="table-td"><text class="table-text">{{item.id}}</text></div>
                <div class="table-td"><text class="table-text">{{item.uid}}</text></div>
                <div class="table-td width-200px"><text class="table-text">{{item.dDate}}</text><text>{{item.isPrint}}</text></div>
                <div class="table-td"><text class="table-text" style="color:red;">{{item.intMustPay}}</text><text class="table-text" style="color:green;">{{item.PayCollectionMoney}}</text></div>
                <div class="table-td width-100px"><text class="table-text">{{item.CollectionMoney}}</text></div>
            </cell>
            <loading class="loading" @loading="getData" :display="showload ? 'show' : 'hide'">
              <text class="indicator-text">加载更多 ...</text>
              <loading-indicator class="indicator"></loading-indicator>
            </loading>
        </list>
        
		<!-- <image src='http://img.lanrentuku.com/img/allimg/1212/5-121204194026.gif' v-if="showload" style="height:40px;width:300px,align-items:center;background-color:#f2f2f2;" resize="contain" quality="original"></image> -->
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
        <wxc-popover ref="wxc-popover-two" :buttons="btnsTwo" :position="popoverPositionTwo" :arrowPosition="popoverArrowPositionTwo" @wxcPopoverButtonClicked="popoverButtonClickedTwo"></wxc-popover>
	</div>

</template>
<script>
import searchBar from "../_mods/new-search-bar";
import { WxcCheckboxList, WxcPopover } from "weex-ui";
import datepick from "../_mods/datepick";
import API from "Utils/api";

function checkNumber(theObj) {
  var reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(theObj)) {
    return true;
  }
  return false;
}
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
      searchType: "全部",
      searchTypeTwo: '全部',
      sub: "",
      selectAllStatu: false,
      listType: "",
      listType: "",
      btns: [
          {
            text: "全部",
            key: undefined
          },
          {
            text: "已入仓",
            key: 5
          },
          {
            text: "待配送",
            key: 10
          },
          {
            text: "配送完成",
            key: 50
          }
      ],
      btnsTwo: [
          {
              text: '全部',
              key: undefined
          },
          {
              text: '未收款',
              key: false
          },
          {
              text: '已收款',
              key: true
          }
      ],
      popoverPosition: { x: 15, y: 100 },
      
      popoverArrowPosition: { pos: "top", x: 50 },
      popoverPositionTwo: { x: 200, y: 100 },
      popoverArrowPositionTwo: { pos: "top", x: 50 },
      onrefreshState: false
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
    var _this =this;
    this.$event.on("paySuccess", params => {
      _this.selectAllStatu = false;
      _this.onRefresh();
    });
  },
  methods: {
    onRefresh () {
        this.onrefreshState = true
        this.refresh()
    },
    async toDetail (item) {
        this.$notice.loading.show("正在加载");
        try {
            const RES = await API.get_fahuoInfo({'@intFahuoID' : item.id})
            const DATA = JSON.parse(RES.DATA)
            this.$notice.loading.hide();
            this.$router.open({
                name: 'invoice-detail',
                type: 'PUSH',
                params: DATA
            })	
        } catch (error) {
            this.$notice.loading.hide();
        }
    },
    async getData() {
      const _this = this;
      this.param["@rowIndex"]++;
      let param = {};
      param  = Object.assign(this.param , param)
      if (this.searchValue != "") {
        if(checkNumber(this.searchValue)) {
          param = Object.assign(param , {'@key' : parseInt(this.searchValue)})
          param = Object.assign(param , {'@strKey' : undefined})
        } else {
          param = Object.assign(param , {'@key' : undefined})
          param = Object.assign(param , {'@strKey' : this.searchValue})
        }
      } else {
          param = Object.assign(param , {'@key' : undefined})
          param = Object.assign(param , {'@strKey' : undefined})
      }

      if (this.param["@rowIndex"] === 1) {
          if(!this.onrefreshState) {
              _this.$notice.loading.show("正在加载");
          }
      } else {
        this.showload = true;
      }
      if(this.userInfo.RoleId== 1 || this.userInfo.RoleId== 4) {

      } else {
        if(param['@Status'] == undefined) {
          param =  Object.assign(param , {'@adminId' : this.userInfo.adminId})
          param =  Object.assign(param , {'@DistributorId' : undefined})
        } else {
          param =  Object.assign(param , {'@adminId' : undefined})
          param =  Object.assign(param , {'@DistributorId' : this.userInfo.adminId})
        }
      }
    let par = {}
    for(let key in param) {
        if(param[key] != undefined && param[key] != 'undefined') {
            par = Object.assign(param , param[key])
        }
    }
     
      var RES = await API.get_fahuoList(par);
      if (RES.SUCCESS) {
        if (this.param["@rowIndex"] === 1)  {
          this.listData = []
        }
        var RESDATA = JSON.parse(RES.DATA);
        var DGDATA = JSON.parse(RESDATA.dgData);
        if (DGDATA.length != 0) {
          var newData = []
          DGDATA.map(item => {
            newData.push(item)
          });
          this.listData = this.listData.concat(newData)
        } else {
          this.$notice.toast({
            message: "没有更多数据"
          });
        }
        if (param["@rowIndex"] === 1) {
            if(!this.onrefreshState) {
                _this.$notice.loading.hide();
            }
        } else {
          this.showload = false;
        }
      }
      if(this.onrefreshState) {
          this.onrefreshState=true
          this.$refs["list"].refreshEnd()
      }
      if(this.showload){
          this.showload = false;
      }
    },
    init(param) {
      var par = param.params;
      this.sub = par.sub;
      this.$navigator.setCenterItem(
        {
          text: '发货单列表',
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
      if(value === 1) {
          this.$refs["wxc-popover"].wxcPopoverShow();
      }
      if(value === 2) {
          this.$refs["wxc-popover-two"].wxcPopoverShow();
      }
      
    },
    inputChange(e) {
      this.searchValue = e.value;
    },
    scanClick(val) {
      this.searchType = "物流号";
      this.searchValue = val;
      this.refresh();
    },
    searchClick(value) {
      this.searchValue = value
      this.onrefreshState= false
      this.refresh();
    },
    refresh() {
      this.param['@rowIndex'] = 0
      this.getData();
    },
    selectTime(timeName) {
      this.$refs[timeName].show();
    },
    startDateFinish(startDate) {
      this.param["@StartFDate"] = startDate + ' 00:00:00';
      if (this.param["@EndFDate"] == undefined) {
        this.param["@EndFDate"] = startDate  + " 23:59:59"
      }
    },
    endDateFinish(endDate) {
      this.param["@EndFDate"] = endDate + " 23:59:59"
      if (this.param["@StartFDate"] == undefined) {
        this.param["@StartFDate"] = endDate + ' 00:00:00'
      }
    },
    popoverButtonClicked(obj) {
      this.searchType = this.btns[obj.index].text
      this.param['@Status'] = obj.key
      this.onrefreshState= false
      this.refresh();
    },
    popoverButtonClickedTwo(obj) {
        this.searchTypeTwo = this.btnsTwo[obj.index].text
        this.param['@bPay'] = obj.key
        this.onrefreshState= false
        this.refresh();
    },
    onloading () {

    }
  }
};
</script>

<style scoped>
.page {
    height: auto;
}
.scroller {
    height: auto;
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
.table {
    width: 750px;
    min-height:750px;
}
.table-cell {
    position:relative;
    width: 750px;
    flex-direction: row;
}
.table-td {
    display:block;
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
    font-size: 32px;
}
.table-head {
    height: 75px;
    background-color: #e9eaec;
}
.width-200px {
  width: 200px;
}
.width-100px {
  width: 100px;
}
.loading {
    width: 750;
    display: -ms-flex;
    display: -webkit-flex;
    display: flex;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    align-items: center;
  }
  .indicator-text {
    color: #888888;
    font-size: 42px;
    text-align: center;
  }
  .indicator {
    margin-top: 16px;
    height: 40px;
    width: 40px;
    color: blue;
  }
</style>
