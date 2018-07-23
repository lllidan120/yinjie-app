<template>
    <list ref="list" :showRefresh="true" @refresh="getData">
      <cell>
        <div class="top content">
            <div class="top-row">
                <img class="top-row-icon" src="http://yj.kiy.cn/Content/Images/App/assets/icon/time.png">
                <text class="gray-color">&nbsp;配送时间</text>
                <text class="text-color">&nbsp;{{listItem.DistributorDate}}</text>
            </div>
            <div class="top-row">
                <img class="top-row-icon" src="http://yj.kiy.cn/Content/Images/App/assets/icon/time.png">
                <text class="gray-color">&nbsp;生产单号</text>
                <text class="text-color">&nbsp;{{listItem.ThirdPlatformOrderNo}}</text>
            </div>
            <div class="top-row">
                <img class="top-row-icon" src="http://yj.kiy.cn/Content/Images/App/assets/icon/time.png">
                <text class="gray-color">&nbsp;平台单号</text>
                <text class="text-color">&nbsp;{{listItem.CytMallId}}</text>
            </div>
            <div class="top-row">
                <img class="top-row-icon" src="http://yj.kiy.cn/Content/Images/App/assets/icon/time.png">
                <text class="gray-color">&nbsp;物流单号</text>
                <text class="text-color">&nbsp;{{listItem.Id}}</text>
            </div>
        </div>

        <div class="content top-two">
            <image src="http://yj.kiy.cn/Content/Images/App/assets/icon/orderimg.png" class="content-left"></image>
            <scroller class="content-right">
                <div class="content-right-col">
                    <text class="gray-color">联系电话&nbsp;</text>
                    <text style="color: blue;" @click="call(listItem.ReceiveTelePhone)">{{listItem.ReceiveTelePhone}}</text>
                </div>
                <div class="content-right-col">
                    <text class="gray-color">路线&nbsp;</text>
                    <text>{{listItem.UserIdAndFahuoType}}</text>
                </div>
                <div class="content-right-col">
                    <text class="address">{{listItem.address}}</text>
                </div>
            </scroller>
        </div>

        

        <div class="center content" style="margin-top:28px;">
            <div class="col-content col-content-top">
                <text class="col-content-left text-color big">付款状态</text>
                <text class="col-content-right num-color big">{{listItem.IsPay ? '已付款' : '未付款' }}</text>
            </div>
            <div class="col-content">
                <text class="col-content-left gray-color">客户名称</text>
                <text class="col-content-right ">{{listItem.ReceiveName  }}</text>
            </div>
            <div class="col-content ">
                <text class="col-content-left gray-color">已收</text>
                <text class="col-content-right ">{{ listItem.PayCollectionMoney }}</text>
            </div>
            <div class="col-content ">
                <text class="col-content-left gray-color">应收</text>
                <text class="col-content-right ">{{listItem.Price }}</text>
            </div>
            <div class="col-content ">
                <text class="col-content-left gray-color">总金额</text>
                <text class="col-content-right ">{{listItem.OrderSumPrice}}</text>
            </div>
        </div>
        <div class="bottom-btn" v-if="true">
            <wxc-button text="发起售后"
                type="blue"
                @wxcButtonClicked="wxcButtonClicked"></wxc-button>
        </div>
        <div class="content top-three">
            <div class="top-three-top">
                <image src="http://yj.kiy.cn/Content/Images/App/assets/icon/orderimg.png" class="top-three-top-img"></image>
                <text class="text-color">{{listItem.MemberCard}}</text>
            </div>
            <div>
                <image src='http://img.lanrentuku.com/img/allimg/1212/5-121204194026.gif' v-if="showload" style="height:40px;width:300px,align-items:center;background-color:#fff;" resize="contain" quality="original"></image>
                <div class="top-three-center" v-for="(item , index) in list" :key="index" @click="getChildOrder(undefined , item.LogisticsNo_Key)">
                    <image src="http://yj.kiy.cn/Content/Images/App/assets/icon/tabimg.png" class="content-left order"></image>
                    <div class="content-right">
                        <div class="content-right-col">
                            <text class="gray-color text">物流状态 :&nbsp;</text>
                            <text class="blue-color text">{{item.strStatus}}</text>
                        </div>
                        <div class="content-right-col">
                            <text class="gray-color text">扫描人 :&nbsp;</text>
                            <text class="text-color text">{{item.strUserName}}&nbsp;&nbsp;</text>
                            <text class="gray-color text">扫描时间 :&nbsp;</text>
                            <text class="text-color text">{{item.InsertTime}}</text>
                        </div>
                        <div class="content-right-col">
                            <!-- <text class="gray-color text">是否异常 :&nbsp;</text>
                            <text class="text-color text">{{item.isAbnormal ? '是' : '否'}}</text> -->
                            <text class="gray-color text">物流单号 :&nbsp;</text>
                            <text class="text-color text">{{item.LogisticsNo_Key}}</text>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="top-three-top" style="">
                <!-- <text class="text-color">合计:&nbsp;</text>
                <text class="blue-color big">{{listItem.Goods_Qty}}</text> -->
                <wxc-simple-flow :list="testData" ></wxc-simple-flow>
            </div>
        </div>
      </cell>
    </list>
</template>

<script>
import API from "Utils/api";
import { WxcSimpleFlow , WxcButton } from 'weex-ui';
export default {
  components: {
    WxcSimpleFlow , WxcButton
  },
  data() {
    return {
      tapBackTime: 0,
      navShow: true,
      statusBarStyle: "LightContent",
      listItem: {},
      list: [],
      showload: true,
      themeColor: {
        lineColor: '#bf280b',
        pointInnerColor: '#b95048',
        pointBorderColor: '#bf280b',
        highlightTitleColor: '#bf280b',
        highlightPointInnerColor: '#bf280b',
        highlightPointBorderColor: '#d46262'
      },
      testData: [],
      refreshStatus: false
    };
  },
  eros: {
    beforeAppear(params, options) {
      this.listItem = params;
      // this.getChildOrder (params.Id)
      this.getData()
    }
  },
  methods: {
    refresh() {
      this.refreshStatus = true
      this.getData()
    },
    async getData(type) {
      // this.$notice.loading.show("正在加载");

      var RES = await API.YJ_GETORDER({ "@id": this.listItem.Id });
      if (RES.SUCCESS) {
        var DATA = JSON.parse(RES.DATA);
        this.listItem = DATA.Head[0];
        this.getChildOrder(DATA.Head[0].Id)
      } else {
        this.$notice.toast({ message: RES.MESSAGE });
        this.$router.back();
      }
      // this.$notice.loading.hide();
      if(type) {
        this.refreshStatus = false
        this.$refs["list"].refreshEnd()
      }
      
    },
    async getChildOrder (orderId , childOrderId) {
      this.showload = true
      if(orderId != undefined) {
        const RES = await API.YJ_ORDERLIST({'@LogisticsNO_PKey' : orderId})
        const DATA = JSON.parse(RES.DATA)
        this.list = []
        DATA.map(item => {
          this.list.push(item)
        })
      }
      var childId = childOrderId ? childOrderId : this.listItem.Id + '-001'
      const Status = await API.YJ_ORDERLISTSTATUS({'$oId': childId})
      
      this.testData = []
      var StatusArr = Status.map.dgData
      StatusArr.map((item , index) => {
        var data = {
          'date': item.CreateDate,
          'desc': item.Remark,
          'title':  '操作人: ' + item.RealName
        }
        if(index === 0) {
          data = Object.assign(data , {'highlight' : true})
        }
        this.testData.push(data)
      })
      this.showload = false

    },
    refresh() {
      this.$router.refresh();
    },
    call(number) {
      this.$coms.call(number)
    },
    async wxcButtonClicked () {
            this.$notice.loading.show();
            const status = await API.get_IsOrderRefunds({'orderId': this.listItem.CytMallId})
            this.$notice.loading.hide();
            if(status.Success) {
              var par = {
                  "orderId" : this.listItem.CytMallId,
                  'page_no' : 1,
                  'page_size' : 1
              }
              var RES = await API.KIY_SEARCHORDER(par)
              var RESDATA = JSON.parse(RES.Data)
              var DGDATA = RESDATA.data.Models
              var item = DGDATA[0]
              this.$router.open({
                name: 'orderRefund',
                type: 'PUSH',
                params: item
              })
            } else {
                this.$notice.toast({
                    message: status.Message
                });
            }
        }
  },
  mounted() {},
  created() {}
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
.content {
  width: 750px;
  background-color: #fff;
  padding-left: 28px;
}
.content-right {
  width: 750px;
  padding-left: 200px;
  padding-top: 20px;
}
.content-right-col {
  flex-direction: row;
  margin-bottom: 10px;
}
.content-left {
  position: absolute;
  width: 137px;
  height: 155px;
  left: 38px;
  top: 40px;
}
.order {
  width: 123px;
  height: 123px;
  top: 15px;
}
.top {
  height: 245px;
  padding-top: 25px;
}
.top-two {
  height: 250px;
  margin-top: 25px;
  padding-top: 30px;
}
.top-row {
  flex-direction: row;
  justify-items: center;
  margin-bottom: 20px;
}
.top-row-icon {
  margin-top: 5px;
  width: 23px;
  height: 23px;
}
.top-three {
  padding-left: 0px;
  margin-top: 25px;
  min-height: 335px;
}
.top-three-center {
  height: 150px;
  margin-bottom: 15px;
  background-color: #f7f7f7;
}
.top-three-top {
  flex-direction: row;
  justify-items: center;
  align-items: center;
  width: 750px;
  /* height: 72px; */
  padding-left: 40px;
  /* padding-right: 40px; */
}
.top-three-top-img {
  width: 24px;
  height: 24px;
  margin-right: 20px;
}
.text {
  font-size: 26px;
}
.center {
  width: 750px;
  min-height: 500px;
  background-color: #fff;
  padding-left: 25px;
  padding-right: 25px;
  padding-bottom: 50px;
}

.col-content {
  flex-direction: row;
  align-items: center;
  height: 80px;
  padding-top: 30px;
}
.col-content-top {
  height: 120px;
  padding-top: 30px;
  padding-bottom: 30px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #cccccc;
}
.col-content-left {
  color: #666666;
  width: 200px;
}
.col-content-right {
  padding-right: 10px;
  width: 500px;
  text-align: right;
}

.big {
  font-size: 42px;
}
.address {
  width: 500px;
  lines: 3;
  text-overflow: ellipsis;
}
.bottom-btn {
    width: 750px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #E5E5E5;
    padding-top: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
</style>