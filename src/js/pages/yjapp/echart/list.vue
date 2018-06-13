<template>
	<div class="page">
		<div class="search-bar">
			<datepick @selectTime="selectTime" @startDateFinish="startDateFinish" @endDateFinish="endDateFinish"></datepick>
		</div>
    <scroller scroll-direction="horizontal" class="table">
        <div class="table-cell">
            <div class="table-td table-head"><text class="table-text">合计</text></div>
            <div class="table-td table-head"><text class="table-text">{{PayCollectionMoneySum}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{UnPayCollectionMoneySum}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{orderSumPriceSum}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{orderCountSum}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{UnSyncSum}}</text></div>
        </div>
        <div class="table-cell">
            <div class="table-td table-head"><text class="table-text">姓名</text></div>
            <div class="table-td table-head"><text class="table-text">已收</text></div>
            <div class="table-td table-head"><text class="table-text">未收</text></div>
            <div class="table-td table-head"><text class="table-text">订单总额</text></div>
            <div class="table-td table-head"><text class="table-text">订单数</text></div>
            <div class="table-td table-head"><text class="table-text">未同步</text></div>
        </div>
        <!-- @loadmore="getData" -->
        <list class="bui-list" ref="list" :show-scrollbar="true" :showRefresh="true" @refresh="getData"   loadmoreoffset="2">
            <cell class="table-cell" v-for="(item , key) in listData"  :key="key">
                <div class="table-td"><text class="table-text">{{item.RealName}}</text></div>
                <div class="table-td"><text class="table-text">{{item.PayCollectionMoney}}</text></div>
                <div class="table-td"><text class="table-text">{{item.UnPayCollectionMoney}}</text></div>
                <div class="table-td"><text class="table-text">{{item.orderSumPrice}}</text></div>
                <div class="table-td"><text class="table-text">{{item.orderCount}}</text></div>
                <div class="table-td"><text class="table-text">{{item.UnSync}}</text></div>
            </cell>
        </list>
      </scroller>
	
	</div>

</template>
<script>
import datepick from "../_mods/datepick";
import API from "Utils/api";
const picker = weex.requireModule('picker')
function checkNumber(theObj) {
  var reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(theObj)) {
    return true;
  }
  return false;
}
export default {
  components: {
    datepick
  },
  data() {
    return {
      listData: [],
      param: {
      },
      showload: false,
      sub: "",
      listType: "",
      onrefreshState: false,
      PayCollectionMoneySum: 0,
      UnPayCollectionMoneySum: 0,
      orderSumPriceSum: 0,
      orderCountSum: 0,
      UnSyncSum: 0,
      selectDeliverData: {
         RealName: '全部'
      },
      deliverList: [],
      index: -1
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
    async getData(onrefreshState) {
      const _this = this;
      let param = {};
      param  = Object.assign(this.param , param)
      if(this.userInfo.RoleId == 1 || this.userInfo.RoleId== 4) {

      } else {
          param =  Object.assign(param , {'@adminId' : this.userInfo.adminId})
      }
      if(this.selectDeliverData.RealName != '全部'){
        param =  Object.assign(param , {'@adminId' : this.selectDeliverData.Id})
      }

      let par = {}
      for(let key in param) {
          if(param[key] != undefined && param[key] != 'undefined') {
              par = Object.assign(param , param[key])
          }
      }
      if(onrefreshState) {
        
      } else {
        this.$notice.loading.show("正在加载");
      }
     
      var RES = await API.Get_AdminStatistics(par);
      if (RES.SUCCESS) {
        this.listData = []
        this.PayCollectionMoneySum = 0
          this.UnPayCollectionMoneySum = 0
          this.orderSumPriceSum = 0
          this.orderCountSum= 0
          this.UnSyncSum = 0
        var DGDATA = JSON.parse(RES.DATA);
        if (DGDATA.length != 0) {
          var newData = []
          DGDATA.map(item => {
            this.PayCollectionMoneySum += item.PayCollectionMoney
            this.UnPayCollectionMoneySum += item.UnPayCollectionMoney
            this.orderSumPriceSum += item.orderSumPrice
            this.orderCountSum += item.orderCount
           this.UnSyncSum += item.UnSync
            newData.push(item)
          });
          this.listData = this.listData.concat(newData)
        } else {
          this.$notice.toast({
            message: "没有更多数据"
          });
        }
      }
      
      if(onrefreshState) {
          this.$refs["list"].refreshEnd()
      } else {
        this.$notice.loading.hide()
      }
    },
    init(param) {
      this.QueryAdminList()
      this.setNav()
      this.getData();
    },
    startDateFinish(startDate) {
      this.param["@beginDate"] = startDate + ' 00:00:00';
      if (this.param["@endDate"] == undefined) {
        this.param["@endDate"] = startDate  + " 23:59:59"
      }
      this.getData()
    },
    endDateFinish(endDate) {
      this.param["@endDate"] = endDate + " 23:59:59"
      if (this.param["@beginDate"] == undefined) {
        this.param["@beginDate"] = endDate + ' 00:00:00'
      }
      this.getData()
    },
    selectDeliver () {
      var items = []
      if(items.length === 0){
        this.deliverList.map(item => {
          items.push(item.RealName)
        })
      }
      
      picker.pick({
            index: this.index,
            items
          }, event => {
            if (event.result === 'success') {
              this.selectDeliverData = this.deliverList[event.data]
              this.index = event.data
              this.setNav()
              this.getData()
            }
      })
    },
    setNav() {
      if(this.userInfo.RoleId === 1 || this.userInfo.RoleId === 4) {
        this.$navigator.setRightItem({
            text: this.selectDeliverData.RealName,                               // 展示的文字 (和图片 二选一)    
            textColor: '',                          // 文字颜色 (默认为白色)
            fontSize: '40',                         // 字号（默认32px）
            fontWeight: 'normal'                   // 是否加粗（默认不加粗）
        }, () => {
            // 点击回调
            this.selectDeliver()
        })
      }
    },
    async QueryAdminList() {
      var par = {
        '$RoleId': '8,13'
      }
      const RES = await API.get_adminList(par)
      const DATA = RES.map.dgData;
      this.deliverList = DATA
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
    width: 1200px;
    min-height:750px;
}
.table-cell {
    position:relative;
    width: 1200px;
    flex-direction: row;
}
.table-td {
    display:block;
    float: left;
    width: 200px;
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
