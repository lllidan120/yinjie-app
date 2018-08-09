<template>
    <scroller>
        <category title="订单信息"></category>
        <wxc-cell label="订单号"
                  :title="listItem.Id"
                  @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell label="下单时间"
                  :title="listItem.OrderDate "
                  @wxcCellClicked="getParams">
        </wxc-cell>
        <!-- <wxc-cell label="货物数量"
                  :title="listItem.Shuliang "
                  @wxcCellClicked="getParams">
        </wxc-cell> -->
        
        <wxc-cell label="已付款"
                  :title="listItem.ReceivedAmount "
                  @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell label="未付款"
                  :title="listItem.OrderAmount - listItem.ReceivedAmount "
                  @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell label="订单总价"
                  :title="listItem.OrderAmount "
                  @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell label="下单人姓名"
                  :title="listItem.RealName "
                  @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell label="订单状态"
                  :title="listItem.OrderStatusStr  "
                  @wxcCellClicked="getParams">
        </wxc-cell>
        <category title="填写售后信息"></category>
        <wxc-cell label="售后类型 >"
                  :title="type"
                  :has-arrow="false"
                  :has-top-border="true"
                  @wxcCellClicked="pickType('type')"></wxc-cell>
        <wxc-cell label="售后理由 >"
                  :title="reason"
                  :has-arrow="false"
                  :has-top-border="true"
                  @wxcCellClicked="pickType('reason')"></wxc-cell>
        <wxc-cell label="退款方式 >"
                  :title="payType"
                  :has-arrow="false"
                  :has-top-border="true"
                  @wxcCellClicked="pickType('payType')"></wxc-cell>
        <wxc-cell v-if="type != '补印'"
                  :title="`退款金额(最多${tuiqian}元)`"
                  :has-arrow="false"
                  :has-top-border="true">
            <div class="wxc-search-bar"
                 slot="value">
                <input v-model="form.Amount"
                       class="search-bar-input" />
            </div>
        </wxc-cell>
        <wxc-cell v-if="type == '退货退款'"
                  title="退货数量"
                  :has-arrow="false"
                  :has-top-border="true">
            <div class="wxc-search-bar"
                 slot="value">
                <text class="star">*</text>
                <input v-model="form.ReturnQuantity"
                       class="search-bar-input" />
            </div>
        </wxc-cell>
        <wxc-cell title="备注"
                  :has-arrow="false"
                  :has-top-border="true">
            <div class="wxc-search-bar"
                 slot="value">
                <text class="star">*</text>
                <input v-model="form.ReasonRemarks"
                       class="search-bar-input" />
            </div>
        </wxc-cell>
        <wxc-cell title="联系人"
                  :has-arrow="false"
                  :has-top-border="true">
            <div class="wxc-search-bar"
                 slot="value">
                <text class="star">*</text>
                <input v-model="form.ContactPerson"
                       class="search-bar-input" />
            </div>
        </wxc-cell>
        <wxc-cell title="联系电话"
                  :has-arrow="false"
                  :has-top-border="true">
            <div class="wxc-search-bar"
                 slot="value">
                <text class="star">*</text>
                <input v-model="form.ContactCellPhone"
                       class="search-bar-input" />
            </div>
        </wxc-cell>
        <category title="上传售后凭证"></category>

        <div class="image-group">
            <div v-for="(item , key) in imageGroup"
                 :key="key">
                <image class="image"
                       :src="item"
                       @click="del(key)"></image>
            </div>
            <div class="tool-btn"
                 @click="pick">
                <image class="tool-image"
                       ref="main_image"
                       src="https://gw.alicdn.com/tfs/TB1PZ25antYBeNjy1XdXXXXyVXa-128-128.png" />
            </div>
        </div>
        <div class="bottom-btn">
            <wxc-button text="提交售后"
                        type="blue"
                        @wxcButtonClicked="wxcButtonClicked"></wxc-button>
        </div>
    </scroller>
</template>
<script>
var tools = weex.requireModule("bmTool");
const picker = weex.requireModule("picker");
import { WxcCell, WxcButton } from "weex-ui";
import category from "../_mods/category";
import API from "Utils/api";
const RefundType = [
  { text: "仅退款", id: 1 },
  { text: "退货退款", id: 2 },
  { text: "补印", id: 3 },
  { text: "未付款减款", id: 5 }
];
const RefundPayType = [
  { text: "退到预付款", id: 3 },
  { text: "减订单款", id: 4 }
];
const ReasonItems = ["质量问题", "少数量", "没货", "拒收" ,"贴错标" , "取消单" , "无法联系" , "要求次日配送" ,"客户没钱" , "客户休息" , "地址错误" , "无单" , "货款金额不对" ,"订单信息不对" , "有后工" , "其他"];

export default {
  components: {
    WxcCell,
    category,
    WxcButton
  },
  data() {
    return {
      imageGroup: [],
      pos: "",
      type: "请选择",
      typeIndex: 0,
      reason: "请选择",
      reasonIndex: 0,
      payType: "请选择",
      payTypeIndex: 0,
      listItem: {},
      tuiqian: 0,
      form: {
        Amount: 0,
        ReturnQuantity: 1,
        ContactPerson: "",
        ContactCellPhone: "",
        ReasonRemarks: "",
        InterventionHandle: false
      }
    };
  },
  eros: {
    beforeAppear(params, options) {
      this.listItem = params;
      this.init();
    }
  },
  computed: {
    userInfo() {
      var userInfo = API.get_userInfo(this);
      return userInfo;
    }
  },
  mounted() {},
  methods: {
    wxcButtonClicked() {
      const _this = this;
      this.$notice.confirm({
        title: "警告",
        message: "是否确认提交售后返回？",
        okTitle: "确认",
        cancelTitle: "取消",
        okCallback() {
          _this.pushOrder();
        },
        cancelCallback() {}
      });
    },
    async pushOrder() {
      const userInfo = this.userInfo;
      var par = {
        OrderId: this.listItem.Id
      };
      
      if (this.imageGroup.length > 0) {
        const imageGroup = await this.uploadImage();
        console.log(imageGroup)
        par = Object.assign(par, { CertPic1: imageGroup[0] });
        par = Object.assign(par, { CertPic2: imageGroup[1] });
        par = Object.assign(par, { CertPic3: imageGroup[2] });
      }

      par = Object.assign(par, this.form);

      par = Object.assign(par, {
        RefundType: this.getArrId(RefundType, this.type)
      });
      par = Object.assign(par, {
        Reason: this.getArrId(ReasonItems, this.reason)
      });
      par = Object.assign(par, {
        RefundPayType: this.getArrId(RefundPayType, this.payType)
      });

      par = Object.assign(par, {
        CreatorBy: userInfo.adminId,
        Applicant: userInfo.RealName
      });
      if (this.checkParam(par)) {
        let fromPar = {};
        for (let key in par) {
          if (par[key] != undefined && par[key] != "undefined") {
            fromPar = Object.assign(par, par[key]);
          }
        }
        this.$notice.loading.show("正在提交申请...");
        const res = await API.get_OrderRefundRefundApply(fromPar);
        this.$notice.loading.hide();
        this.toast(res.Message);
        if (res.Success) {
          try {
            const RES = await API.YJ_errOrder({
              statu: 11,
              cytId: par.OrderId
            });
            this.backPage()
          } catch (error) {
              this.backPage()
          }
        } else {
        }
      }
    },
    checkParam(par) {
      var isEnter = true;
      if (
        par.RefundType == undefined ||
        par.RefundPayType == undefined ||
        par.Reason == undefined
      ) {
        isEnter = false;
        this.toast("请补充完整售后类型或售后理由");
      }

      if (par.RefundType == 1 || par.RefundType == 2) {
        if (par.Amount <= 0) {
          isEnter = false;
          this.toast("选择了退款，金额必须大于0");
        }
      }
      if (par.RefundType == 2) {
        if (par.ReturnQuantity <= 0) {
          isEnter = false;
          this.toast("选择了退货，数量必须大于0");
        }
      }
      if (
        par.ContactCellPhone == "" ||
        par.ContactPerson == "" ||
        par.ReasonRemarks == ""
      ) {
        isEnter = false;
        this.toast("请补充必填资料");
      }
      if (par.Amount > this.tuiqian) {
        isEnter = false;
        this.toast(`退款金额不能大于${this.listItem.tuiqian}`);
      }

      return isEnter;
    },
    toast(text) {
      this.$notice.toast({
        message: text
      });
    },
    getArrId(arr, text) {
      let val = undefined;
      arr.map(item => {
        if (item.text) {
          if (item.text === text) {
            val = item.id;
          }
        } else {
          if (item === text) {
            val = item;
          }
        }
      });
      return val;
    },
    pickType(typeStr) {
      var _this = this;
      var items = [];
      var type = "";
      var index = 0;
      if (typeStr === "type") {
        RefundType.map(item => {
          // 只有减款
          if (this.listItem.ReceivedAmount <= 0 && item.id == 5) {
            items.push(item.text);
          }
          //   可以退款
          if (this.listItem.ReceivedAmount > 0 && item.id != 5) {
            items.push(item.text);
          }
        });
        // items = ["未付款减款", "仅退款", "退货退款", "补印"];
        index = this.typeIndex;
      } else if (typeStr === "reason") {
        items = ReasonItems;
        index = this.reasonIndex;
      } else {
        RefundPayType.map(item => {
          if (this.payType == item.text) {
            items.push(item.text);
          }
        });
        // items = ["订单减款", "退到预付款"];
        index = this.payTypeIndex;
      }
      picker.pick(
        {
          index,
          items
        },
        event => {
          if (event.result === "success") {
            if (typeStr === "type") {
              // 售后类型
              _this.type = items[event.data];
              _this.typeIndex = event.data;
            } else if (typeStr === "reason") {
              //售后理由
              _this.reason = items[event.data];
              _this.reasonIndex = event.data;
            } else {
              // 退款方式
              _this.payType = items[event.data];
              _this.payTypeIndex = event.data;
            }
          }
        }
      );
    },
    init() {
      // 如果有给过钱的
      if (this.listItem.ReceivedAmount > 0) {
        this.payType = "退到预付款";
        this.tuiqian = this.form.Amount = this.listItem.ReceivedAmount;
      } else {
        // 如果没给过钱的
        this.payType = "减订单款";
        this.type = "未付款减款";
        this.tuiqian = this.form.Amount = this.listItem.OrderAmount
      }
      this.form.ContactPerson = this.userInfo.RealName;
      this.form.ContactCellPhone = this.userInfo.Mobile;
      
    },
    pick() {
      var index = 0;
      var items = ["拍照上传", "相册选择"];
      if (this.imageGroup.length === 3) {
        this.$notice.toast({
          message: `最多上传${this.imageGroup.length}张照片`
        });
        return;
      }
      picker.pick(
        {
          index,
          items
        },
        event => {
          if (event.result === "success") {
            if (event.data === 0) {
              this.car();
            } else {
              this.pickImage();
            }
          }
        }
      );
    },
    car() {
      var _this = this;

      this.$image.camera({}).then(
        resData => {
          resData.map(item => {
            _this.imageGroup.push(item);
          });
        },
        error => {
          console.log(error);
        }
      );
    },
    uploadImage() {
      var _this = this;
      return new Promise(resolve => {
        _this.$image
          .upload({
            url: API.get_kiyImageUrl(), // 自定义图片上传地址，默认上传地址是 eros.native.js 中的 image 地址
            params: {}, // 传递的参数
            header: {}, // 自定义请求 header
            source: _this.imageGroup // 图片路径
          })
          .then(
            resData => {
              resolve(resData);
            },
            error => {
              resolve(error);
            }
          );
      });
    },
    pickImage() {
      var _this = this;
      var len = 3 - this.imageGroup.length;

      this.$image
        .pick({
          maxCount: len
        })
        .then(
          resData => {
            resData.map(item => {
              _this.imageGroup.push(item);
            });
          },
          error => {
            console.log(error);
          }
        );
    },
    del(i) {
      var newGroup = [];
      var _this = this;
      this.$notice.confirm({
        title: "是否删除该图片",
        message: "点击确认删除",
        okTitle: "确认",
        cancelTitle: "取消",
        okCallback() {
          _this.imageGroup.map((item, index) => {
            if (i === index) {
              _this.imageGroup.splice(i, 1);
            }
          });
        },
        cancelCallback() {}
      });
    },
    backPage() {
      this.$router.back({
        length: 1,
        type: "PUSH",
        callback() {
          // 返回成功回调
        }
      });
    }
  }
};
</script>
<style>
.image-group {
  flex-direction: row;
  padding-left: 20px;
}
.image {
  width: 150px;
  height: 150px;
  margin-right: 20px;
  margin-top: 20px;
}
.tool-image {
  width: 60px;
  height: 60px;
}

.tool-text {
  color: #ffffff;
  font-size: 30px;
}

.tool-btn {
  margin-top: 40px;
  margin-left: 20px;
  width: 100px;
  height: 100px;
  background-color: #2096f2;
  align-items: center;
  justify-content: center;
  border-radius: 50;
}
.wxc-search-bar {
  background-color: #ffffff;
  width: 500px;
  height: 50px;
  flex-direction: row;
}
.search-bar-input {
  padding-bottom: 0;
  padding-right: 40px;
  padding-left: 40px;
  font-size: 26px;
  width: 500px;
  height: 50px;
  line-height: 50px;
  background-color: #e5e5e5;
  color: #000;
  border-radius: 6px;
}
.bottom-btn {
  width: 750px;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #e5e5e5;
  padding-top: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.star {
  color: red;
  height: 50px;
  line-height: 50px;
}
</style>
