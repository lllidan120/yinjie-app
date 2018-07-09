<template>
  <div>
    <div class="search-bar" ref="top">
      <search-bar :searchTypeTwo="searchTypeTwo" :searchType="searchType" :showScanBtn='true' @onChange="typeChange" @inputChange="inputChange" @scanClick="scanClick" @searchClick="searchClick">
      </search-bar>
      <datepick @selectTime="selectTime" @startDateFinish="startDateFinish" @endDateFinish="endDateFinish"></datepick>
    </div>
    <recycle-list for="(item, cellIndex) in listData" @loadmore="getData">
      <cell-slot>
        <div class="list" v-if="item.show">
          <div class="list-box">
            <div class="list-box-title" @click="toDetail(item)">
              <div class="list-col width280" style="">
                <div class="icon-title-content">
                  <img class="list-title-icon" src="http://yj.kiy.cn/Content/Images/App/assets/icon/time.png">
                  <text class="title">操作时间</text>
                </div>
                <text class="text center text-color">{{ item.DistributorDate ? item.DistributorDate : '暂无' }}</text>
              </div>
              <div class="list-col">
                <div class="icon-title-content">
                  <img class="list-title-icon" src="http://yj.kiy.cn/Content/Images/App/assets/icon/user.png">
                  <text class="title">会员号</text>
                </div>
                <text class="text center text-color">{{item.UserId}}</text>
              </div>
              <div class="list-col width170">
                <text class="blue">总金额:{{ item.Price }}</text>
                <text class="text">平台单:{{ item.CytMallId }}</text>
                <text class="text" v-if="item.ThirdPlatformOrderNo">生产号:{{ item.ThirdPlatformOrderNo }}</text>
              </div>
            </div>
            <div class="list-box-content">
              <div class="list-box-content-left" @click="toDetail(item)">
                <image src="http://yj.kiy.cn/Content/Images/App/assets/icon/tabimg.png" class="list-box-content-left-icon"></image>
                <div class="col">
                  <text class="text gray-color">货物数量  </text>
                  <text class="text num-color" style="width:110px;">X{{item.Goods_Qty}}</text>
                  <text class="text red-color"  v-if="item.logState == 1">已下单</text>
                  <text class="text red-color"  v-if="item.logState == 2">回程中转中</text>
                  <text class="text red-color"  v-if="item.logState == 5">已入仓</text>
                  <text class="text red-color"  v-if="item.logState == 10">待配送</text>
                  <text class="text red-color"  v-if="item.logState == 11">异常</text>
                  <text class="text red-color"  v-if="item.logState == 6">已装箱</text>
                  <text class="text red-color"  v-if="item.logState == 7">中转中</text>
                  <text class="text red-color"  v-if="item.logState == 8">已卸车</text>
                  <text class="text red-color"  v-if="item.logState == 50">配送完成</text>
                  <text class="text red-color"  v-if="item.logState == 51">退货完成</text>
                  <text class="text red-color"  v-if="item.logState == 17">已回仓</text>
                  <text class="text red-color"  v-if="item.logState == 48">确认退货</text>
                  <text class="text red-color"  v-if="item.logState == 49">退货中</text>
                  <text class="text red-color"  v-if="item.logState == 100">作废</text>
                  <text class="text red-color"  v-if="item.logState == 9">分仓扫描入仓</text>
                  <text class="text red-color"  v-if="item.logState == 33">已评价</text>
                  <text class="text red-color"  v-if="item.logState == 101">取消订单</text>
                </div>
                <div class="col">
                  <text class="text gray-color">物流编号  </text>
                  <text class="text text-color" style="width:110px;">{{item.Id}}</text>
                  <text class="text gray-color">产品名  </text>
                  <text class="text text-color">{{item.Qitems}} </text>
                </div>
                <div class="col" style="height: 100px;">
                  <image src="http://yj.kiy.cn/Content/Images/App/assets/icon/company.png" class="col-icon"></image>
                  <text class="address text text-color text-overflow">{{ item.ReceiveName }}</text>
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
    <image src='http://yj.kiy.cn/Content/Images/App/assets/5-121204194026.gif' v-if="showload" style="height:40px;width:300px,align-items:center;background-color:#fff;" resize="contain" quality="original"></image>
  <!-- 支付弹窗 -->
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
    <!-- 下拉选择 -->
    <wxc-popover ref="wxc-popover" :buttons="btns" :position="popoverPosition" :arrowPosition="popoverArrowPosition" @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
    <wxc-popover ref="wxc-popover-two" :buttons="btnsTwo" :position="popoverPositionTwo" :arrowPosition="popoverArrowPositionTwo" @wxcPopoverButtonClicked="popoverButtonClickedTwo"></wxc-popover>
    <!-- 列表选择 -->
    <div ref="b1" class="tool-btn" style="background-color:#FF9800" @click="clickBtn({'@orderStatu': '1,2,5,10,6,7,8'} , '未收货')">
        <text class="tool-text">未收货</text>
    </div>
    <div ref="b2" class="tool-btn" style="background-color:#4caf50" @click="clickBtn({'@orderStatu': '50,51,48,33'} , '已收货')">
        <text class="tool-text">已收货</text>
    </div>
    <!-- 9,10,11,33,50 -->
    <div ref="b3" class="tool-btn" style="background-color:#36648B" @click="clickBtn({'@orderStatu': '1,5,6,7,8'} , '未扫描')">
        <text class="tool-text">未扫描</text>
    </div>
    
    <div ref="b5" class="tool-btn" style="background-color:#303030" @click="clickBtn({} , '全部订单')">
        <text class="tool-text">全部</text>
    </div>
    
    <div ref="a1" class="tool-btn" style="background-color:#00868B" @click="clickBtn({'@orderStatu': '6,7,8'} , '已装箱')">
        <text class="tool-text">已装箱</text>
    </div>
    <div ref="a2" class="tool-btn" style="background-color:#6A5ACD" @click="clickBtn({'@orderStatu': '10'} , '待配送')">
        <text class="tool-text">待配送</text>
    </div>
    <div ref="main_btn" class="tool-btn" style="background-color: #ff0000" @click="clickBtn">
        <image class="tool-image" ref="main_image" src="https://gw.alicdn.com/tfs/TB1PZ25antYBeNjy1XdXXXXyVXa-128-128.png" />
    </div>
  </div>

</template>

<script>
import { WxcPopover } from "weex-ui";
import searchBar from "../_mods/new-search-bar";
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
        "@pageSize": 20,
        '@id': undefined,
        '@userId':undefined,
        '@orderId': undefined,
        '@ThirdPlatformOrderNo': undefined
      },
      type: "range",
      minimumDate: "",
      maximumDate: "",
      showload: false,
      payGroup: [],
      searchValue: "",
      searchType: "物流号",
      searchTypeTwo: '全部',
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
        },
        {
          text: '生产号',
          key: '生产号'
        }
      ],
      btnsTwo: [
        {
          text: '全部',
          key: undefined
        },
        {
          text: '已付',
          key: 1
        },
        {
          text: '未付',
          key: 0
        }
      ],
      popoverPosition: { x: 15, y: 100 },
      popoverArrowPosition: { pos: "top", x: 50 },
      popoverPositionTwo: { x: 200, y: 100 },
      popoverArrowPositionTwo: { pos: "top", x: 50 },
      isExpanded: false,
      navTitle: ''
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
      this.onRefresh();
    });
  },
  methods: {
    async getData() {
      const _this = this;
      this.param["@rowIndex"]++;
      // if adminId == 1 or adminId = 4 ,is admin
      if(this.userInfo.RoleId === 1 || this.userInfo.RoleId === 4) {
      } else {
        this.param = Object.assign(this.param, {
          "@adminId": this.userInfo.adminId
        });
      }
      
      this.param = Object.assign(this.param, this.listType);
      if (this.searchValue != "") {
        if (this.searchType == this.btns[0].key) {
          // 物流号
          let searchValue = this.searchValue.split('-')
          this.param['@id'] = searchValue[0]
        } else if (this.searchType == this.btns[1].key) {
            // 会员号
          this.param['@userId'] = this.searchValue
        } else if (this.searchType == this.btns[2].key) {
          // 订单号
          this.param['@orderId'] = this.searchValue
        } else if (this.searchType == this.btns[3].key) {
          
          this.param['@ThirdPlatformOrderNo'] = this.searchValue
        }
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
            item.show = true
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
      this.setNav(par.title)
      this.listType = param.type;
      this.getData();
    },
    setNav(title) {
      this.navTitle = title
      this.$navigator.setCenterItem(
        {
          text: title,
          textColor: "",
          fontSize: "32",
          fontWeight: "normal"
        },
        () => {
          this.refresh();
        }
      );
    },
    typeChange(value) {
      if(value === 1) {
          this.$refs["wxc-popover"].wxcPopoverShow();
      }
      if(value === 2) {
          this.$refs["wxc-popover-two"].wxcPopoverShow();
      }
      
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
      this.param['@id'] = undefined
      this.param['@userId'] = undefined
      this.param['@orderId'] = undefined
      this.param['@ThirdPlatformOrderNo'] = undefined
      this.listData = [];
      this.getData();
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
    ok(item) {
      var _this = this;
      this.$notice.confirm({
        title: "物流号" + item.Id,
        message: `是否确认收货?`,
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
        var arr = []
        this.listData.map((listItem , index) => {
          if(listItem.Id == item.Id) {
            this.listData[index].logState = 50;
            // 将已确认收货的元素从列表中删除
            this.listData[index].oCount = 0
            this.$notice.toast({
              message: "已经到底部"
            });
            // 如果listType不是全部或者ispay是未付，则隐藏其中一个card
            if(JSON.stringify(this.listType) == '{}' || this.param['@isPay'] === 0) {
              
            } else {
              this.listData[index].show = false
              this.listData.splice(index , 1)
            }
            
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
        const bweixin = type ? "微信支付" : "支付宝支付";
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
    },
    collapse: function() {
        let main_btn = this.$refs.main_btn.ref
        let main_image = this.$refs.main_image.ref
        let b1 = this.$refs.b1.ref
        let b2 = this.$refs.b2.ref
        let b3 = this.$refs.b3.ref
        // let b4 = this.$refs.b4.ref
        let b5 = this.$refs.b5.ref
        let a1 = this.$refs.a1.ref
        let a2 = this.$refs.a2.ref
        let result1 = this.$bindingx.bind({
            eventType: 'timing',
            exitExpression: {
            origin: 't>800'
            },
            props: [{
                element: main_image,
                property: 'transform.rotateZ',
                expression: {
                origin: 'easeOutQuint(t,45,0-45,800)'
                }
            },
            {
                element: main_btn,
                property: 'background-color',
                expression: {
                origin: "evaluateColor('#607D8B','#ff0000',min(t,800)/800)"
                }
            }
            ]
        });
        let result2 = this.$bindingx.bind({
            eventType: 'timing',
            exitExpression: {
            origin: 't>800'
            },
            props: [{
                element: b1,
                property: 'transform.translateY',
                expression: {
                origin: "easeOutQuint(t,-150,150,800)"
                }
            },
            {
                element: b2,
                property: 'transform.translateY',
                expression: {
                origin: "t<=100?0:easeOutQuint(t-100,-300,300,700)"
                }
            },
            {
                element: b3,
                property: 'transform.translateY',
                expression: {
                origin: "t<=200?0:easeOutQuint(t-200,-450,450,600)"
                }
            },
            {
                element: b5,
                property: 'transform.translateY',
                expression: {
                origin: "t<=300?0:easeOutQuint(t-300,-600,600,500)"
                }
            },
            {
                element: a1,
                property: 'transform.translateX',
                expression: {
                origin: "t<=200?0:easeOutQuint(t,-150,150,800)"
                }
            },
            {
                element: a2,
                property: 'transform.translateX',
                expression: {
                origin: "t<=200?0:easeOutQuint(t-100,-300,300,700)"
                }
            }
            ]
        })
    },
    expand: function() {
        const _this = this;
        let main_btn = this.$refs.main_btn.ref
        let main_image = this.$refs.main_image.ref
        let b1 = this.$refs.b1.ref
        let b2 = this.$refs.b2.ref
        let b3 = this.$refs.b3.ref
        // let b4 = this.$refs.b4.ref
        let b5 = this.$refs.b5.ref
        let a1 = this.$refs.a1.ref
        let a2 = this.$refs.a2.ref
        let result1 = this.$bindingx.bind({
            eventType: 'timing',
            exitExpression: {
            origin: 't>100'
            },
            props: [{
                element: main_image,
                property: 'transform.rotateZ',
                expression: {
                origin: 'linear(t,0,45,100)'
                }
            },
            {
                element: main_btn,
                property: 'background-color',
                expression: {
                origin: "evaluateColor('#ff0000','#607D8B',min(t,100)/100)"
                }
            }
            ]
        });
        let result2 = this.$bindingx.bind({
            eventType: 'timing',
            exitExpression: {
            origin: 't>800'
            },
            props: [{
                element: b1,
                property: 'transform.translateY',
                expression: {
                origin: "easeOutBounce(t,0,0-150,800)"
                }
            },
            {
                element: b2,
                property: 'transform.translateY',
                expression: {
                origin: "t<=100?0:easeOutBounce(t-100,0,0-300,700)"
                }
            },
            {
                element: b3,
                property: 'transform.translateY',
                expression: {
                origin: "t<=200?0:easeOutBounce(t-200,0,0-450,600)"
                }
            },
            {
                element: b5,
                property: 'transform.translateY',
                expression: {
                origin: "t<=300?0:easeOutBounce(t-300,0,0-600,500)"
                }
            },
            {
                element: a1,
                property: 'transform.translateX',
                expression: {
                origin: "t<=200?0:easeOutBounce(t,0,0-150,800)"
                }
            },
            {
                element: a2,
                property: 'transform.translateX',
                expression: {
                origin: "t<=200?0:easeOutBounce(t-100,0,0-300,700)"
                }
            }
            ]
        })
    },
    clickBtn: function(e , title) {
        if (this.isExpanded) {
            this.collapse();
        } else {
            this.expand();
        }
        this.isExpanded = !this.isExpanded;
        if(!e.position) {
          this.param = {
            "@rowIndex": 0,
            "@pageSize": 20,
            '@id': undefined,
            '@userId':undefined,
            '@orderId': undefined,
            '@ThirdPlatformOrderNo': undefined
          }
          this.listType = e
          this.setNav(title)
          this.refresh()
        }
    },
    popoverButtonClickedTwo(obj) {
        this.searchTypeTwo = this.btnsTwo[obj.index].text
        this.param['@isPay'] = obj.key
        this.refresh();
    }
  }
};
</script>

<style lang="sass" src='./dislist.scss'></style>