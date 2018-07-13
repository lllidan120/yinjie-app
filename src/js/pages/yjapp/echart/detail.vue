<template>
	<div class="page">
    <scroller scroll-direction="horizontal" class="table">
        <div class="table-cell">
            <div class="table-td table-head"><text class="table-text">行号</text></div>
            <div class="table-td table-head"><text class="table-text">物流号</text></div>
            <div class="table-td table-head"><text class="table-text">会员号</text></div>
            <div class="table-td table-head"><text class="table-text">新单号</text></div>
            <div class="table-td table-head"><text class="table-text">创建日期</text></div>
            <div class="table-td table-head"><text class="table-text">项目产品</text></div>
            <div class="table-td table-head"><text class="table-text">订单总额</text></div>
            <div class="table-td table-head"><text class="table-text">代收总额</text></div>
            <div class="table-td table-head"><text class="table-text">已付代收总额</text></div>
            <div class="table-td table-head"><text class="table-text">未付代收总额</text></div>
            <div class="table-td table-head"><text class="table-text">配送日期</text></div>
            <div class="table-td table-head"><text class="table-text">配送员姓名</text></div>
            <div class="table-td table-head"><text class="table-text">配送情况</text></div>
            <div class="table-td table-head"><text class="table-text">公司名</text></div>
        </div>
        <!-- @loadmore="getData" -->
        <list class="bui-list" ref="list" :show-scrollbar="true" :showRefresh="true" @refresh="getData"   loadmoreoffset="2">
            <cell class="table-cell" v-for="(item , key) in listData"  :key="key" @click="toDetail(item)">
                <div class="table-td"><text class="table-text">{{item.rowNum}}</text></div>
                <div class="table-td"><text class="table-text">{{item.Id}}</text></div>
                <div class="table-td"><text class="table-text">{{item.UserId}}</text></div>
                <div class="table-td" ><text class="table-text">{{item.CytMallId}}</text></div>
                <div class="table-td"><text class="table-text">{{item.CreateDate}}</text></div>
                <div class="table-td"><text class="table-text" >{{item.Qitems}}</text></div>
                <div class="table-td"><text class="table-text">{{item.OrderSumPrice}}</text></div>
                <div class="table-td"><text class="table-text">{{item.CollectionMoney}}</text></div>
                <div class="table-td"><text class="table-text">{{item.PayCollectionMoney}}</text></div>
                <div class="table-td"><text class="table-text">{{item.nonCoolectionMoney}}</text></div>
                <div class="table-td"><text class="table-text">{{item.DistributorDate}}</text></div>
                <div class="table-td"><text class="table-text">{{item.RealName}}</text></div>
                <div class="table-td"><text class="table-text">{{item.配送情况}}</text></div>
                <div class="table-td"><text class="table-text">{{item.ReceiveName}}</text></div>
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
  methods: {
    async getData(onrefreshState) {
      const _this = this;
      let param = {};
      param  = Object.assign(this.param , param)
      if(onrefreshState) {
        
      } else {
        this.$notice.loading.show("正在加载");
      }
      if(param['@bPay'] == 0){
        var RES = await API.get_QueryDistributionRateDetail(param);
      } else {
        var RES = await API.get_QueryBusinessDistributionSummaryDetails(param);
      }

      if (RES.map.result === 'ok') {
          this.listData = []
        var DGDATA = RES.map.dgData;
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
      }
      
      if(onrefreshState) {
          this.$refs["list"].refreshEnd()
      } else {
        this.$notice.loading.hide()
      }
    },
    init(param) {
      this.param  = Object.assign(this.param , param)
      var title = '应收款详情'
      if(this.param['@bPay'] != 0) {
        title = '配送率详情'
      }
      if(this.param['@fStatus']) {
          title = title + '(已配送)'
      }
      if(this.param['@nStatus']) {
          title = title + '(未配送)'
      }
      console.log(param)
      title = this.param.name + title
      this.$navigator.setCenterItem({
          text: title,                               // 展示的文字 (和图片 二选一)    
          textColor: '',                          // 文字颜色 (默认为白色)
          fontSize: '32',                         // 字号（默认32px）
          fontWeight: 'normal',                   // 是否加粗（默认不加粗）
          image: ''                               // 展示的图片url (和文字 二选一，文字优先级更高)
      }, () => {
          // 点击回调
      })


      this.getData();
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
    width: 2800px;
    min-height:750px;
}
.table-cell {
    position:relative;
    width: 2800px;
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
