<template>
  <div>
    <div class="top border-tb">
      <img class="img left" v-if="item.payType != '支付宝'" src="http://yj.kiy.cn/Content/Images/App/wechatpay.png" alt="">
      <img class="img left" v-if="item.payType === '支付宝'" src="http://yj.kiy.cn/Content/Images/App/alipay.png" alt="">
      
      <text class="top-text">{{item.payType}}支付</text>
    </div>
    <div class="center border-tb">
      <div class="col-content col-content-top">
        <text class="col-content-left text">付款金额</text>
        <text class="tag">{{item.strPayStatus}}</text>
        <text class="col-content-right count">￥{{item.intMoney}}</text>
      </div>
      <div class="col-content">
        <text class="col-content-left ">流水号</text>
        <text class="col-content-right ">{{item.out_trade_no}}</text>
      </div>
      <div class="col-content ">
        <text class="col-content-left ">公司</text>
        <text class="col-content-right ">{{item.payCompany}}</text>
      </div>
      <div class="col-content ">
        <text class="col-content-left ">收款人</text>
        <text class="col-content-right ">{{item.realName}}</text>
      </div>
      <div class="col-content ">
        <text class="col-content-left ">转账时间</text>
        <text class="col-content-right ">{{item.dCreateTime}}</text>
      </div><div class="col-content ">
        <text class="col-content-left ">订单号</text>
        <text class="col-content-right ">{{item.strIDs}}</text>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .top {
    flex-direction: row;
    align-items: center;
    padding-left: 25px;
    height: 100px;
    width: 750px;
    background-color: #fff;
    margin-bottom: 50px;
  }
  .border-tb {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #cccccc;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: #cccccc;
  }
  .img {
    width: 50px;
    height: 50px;
    margin-right: 25px;
  }
  .top-text {
    font-size: 36px;
  }
  .center {
    width: 750px;
    min-height: 500px;
    background-color: #fff;
    padding-left:25px;
    padding-right: 25px;
    padding-bottom: 50px;
  }
  
  .col-content {
    flex-direction: row;
    align-items: center;
    min-height: 80px;
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
    width: 500px;
    text-align: right;
  }
  
  .text {
    font-size: 36px;
  }
  .count {
    font-size: 42px;
    color: #2096f2;
  }
  .tag {
    position: absolute;
    left: 480px;
    top: 35px;
    border-radius: 5px;
    border-width: 1px;
    border-color: red;
    border-style: solid;
    padding: 5px;
    color: red;
  }
</style>


<script>
export default {
  data() {
    return {
      item: {}
    };
  },
  eros: {
    beforeAppear(params, options) {
      this.item = params;
    }
  }
};
</script>
