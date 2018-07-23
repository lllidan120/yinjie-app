<template>
	<div class="page">
		<div class="search-bar">
			<datepick ref="datePick" :beginDate="param['@StartDate']" :endDate="param['@EndDate']" init @selectTime="selectTime" @startDateFinish="startDateFinish" @endDateFinish="endDateFinish"></datepick>
		</div> 
    <scroller scroll-direction="horizontal" class="table">
        <div class="table-cell">
            <div class="table-td table-head"><text class="table-text">合计</text></div>
            <div class="table-td table-head"><text class="table-text">{{orderSumPriceSum}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{dispatched}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{dispatching}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{PayCollectionMoneySum}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{UnPayCollectionMoneySum}}</text></div>
            
            
            <div class="table-td table-head"><text class="table-text">{{sumMoney}}</text></div>
            <div class="table-td table-head"><text class="table-text">{{percentage}}</text></div>
        </div>
        <div class="table-cell">
            <div class="table-td table-head"><text class="table-text">姓名</text></div>
            <div class="table-td table-head"><text class="table-text">订单总数</text></div>
            <div class="table-td table-head"><text class="table-text">已配送数</text></div>
            <div class="table-td table-head"><text class="table-text">未配送数</text></div>
            <div class="table-td table-head"><text class="table-text">已收款</text></div>
            <div class="table-td table-head"><text class="table-text">应收款</text></div>
            <div class="table-td table-head"><text class="table-text">订单总金额</text></div>
            <div class="table-td table-head"><text class="table-text">完成比率</text></div>
        </div>
        <!-- @loadmore="getData" -->
        <list class="bui-list" ref="list" :show-scrollbar="true" :showRefresh="true" @refresh="getData"   loadmoreoffset="2">
            <cell class="table-cell" v-for="(item , key) in listData"  :key="key" >
                <div class="table-td"><text class="table-text" >{{item.RealName}}</text></div>
                <div class="table-td" @click="toDetail(item)"><text class="table-text select select-three">{{item.订单总数}}</text></div>
                <div class="table-td" @click="toDetail(item , {'@fStatus': 50})"><text class="table-text select">{{item.已配送数}}</text></div>
                <div class="table-td" @click="toDetail(item , {'@nStatus': 50})"><text class="table-text select select-two">{{item.未配送数}}</text></div>
                <div class="table-td"><text class="table-text ">{{item.已收款}}</text></div>
                <div class="table-td"><text class="table-text">{{item.应收款}}</text></div>
                <div class="table-td"><text class="table-text">{{item.订单总金额}}</text></div>
                <div class="table-td"><text class="table-text">{{item.完成比率}}</text></div>
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
      _this.getData();
    });
  },
  methods: {
    async getData(onrefreshState) {
      const _this = this;
      let param = {};
      param  = Object.assign(this.param , param)
      if(this.userInfo.RoleId == 1 || this.userInfo.RoleId== 4) {

      } else {
          param =  Object.assign(param , {'@DistributorId' : this.userInfo.adminId})
      }
      if(this.selectDeliverData.RealName != '全部'){
        param =  Object.assign(param , {'@DistributorId' : this.selectDeliverData.Id})
      }
      if(onrefreshState) {
        
      } else {
        this.$notice.loading.show("正在加载");
      }
    //  Get_AdminStatistics
      var RES = await API.get_QueryDistributionRateList(param);
      // console.log(RES)

      if (RES.map.result === 'ok') {
          this.listData = []
          this.PayCollectionMoneySum = 0
          this.UnPayCollectionMoneySum = 0
          this.orderSumPriceSum = 0
          this.dispatched = 0
          this.dispatching= 0
          this.sumMoney = 0
          this.percentage = 0
        var DGDATA = RES.map.dgData;
        if (DGDATA.length != 0) {
          var newData = []
          DGDATA.map(item => {
          //   this.PayCollectionMoneySum += item.PayCollectionMoney
          //   this.UnPayCollectionMoneySum += item.UnPayCollectionMoney
          //   this.orderSumPriceSum += item.orderSumPrice
          //   this.orderCountSum += item.orderCount
          //  this.UnSyncSum += item.UnSync
           this.PayCollectionMoneySum += item.已收款
            this.UnPayCollectionMoneySum += item.应收款
            this.orderSumPriceSum += item.订单总数
            this.dispatched += item.已配送数
           this.dispatching += item.未配送数
           this.sumMoney += item.订单总金额
           this.percentage += item.完成比率
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
      this.$navigator.setCenterItem({
          text: param.params.title,                               // 展示的文字 (和图片 二选一)    
          textColor: '',                          // 文字颜色 (默认为白色)
          fontSize: '32',                         // 字号（默认32px）
          fontWeight: 'normal',                   // 是否加粗（默认不加粗）
          image: ''                               // 展示的图片url (和文字 二选一，文字优先级更高)
      }, () => {
          // 点击回调
      })
      // 获取月头
      const dateFormate = {
        startDate : API.get_date('beginMonth').split(' ')[0],
        endDate : API.get_date('today')
      }
      this.$refs['datePick'].searchDate['@beginDate'] = dateFormate.startDate
      this.$refs['datePick'].searchDate['@endDate'] = dateFormate.endDate
      this.param = Object.assign(this.param , {
        '@StartDate': dateFormate.startDate,
        '@EndDate': dateFormate.endDate
      })
      this.param  = Object.assign(this.param , param.type)
      this.QueryAdminList()
      this.setNav()
      this.getData();
    },
    startDateFinish(startDate) {
      this.param["@StartDate"] = startDate 
      if (this.param["@EndDate"] == undefined) {
        this.param["@EndDate"] = startDate  
      }
      this.getData()
    },
    endDateFinish(endDate) {
      this.param["@EndDate"] = endDate
      if (this.param["@StartDate"] == undefined) {
        this.param["@StartDate"] = endDate 
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
    },
    toDetail(item , type) {
      var par = {}
      par = Object.assign(par , this.param )
      if(type) {
        par = Object.assign(par , type )
      }
      par = Object.assign(par , {'@DistributorId': item.Id} )
      par = Object.assign(par , {'name': item.RealName})
      this.$router.open({
          name: 'echartdetail',
          type: 'PUSH',
          params: par
      })	
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
    width: 1600px;
    min-height:750px;
}
.table-cell {
    position:relative;
    width: 1600px;
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
  .select {
    border-width: 1px;
    border-style: solid;
    border-color: rgb(25, 190, 107);
    border-radius: 4px;
    padding: 5px;
    color: rgb(25, 190, 107);
  }
  .select-two {
    border-color: rgb(237, 63, 20);
    color: rgb(237, 63, 20);
  }
  .select-three {
    border-color: blue;
    color: blue;
  }
</style>
