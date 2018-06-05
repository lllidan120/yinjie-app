<template>
<list ref="scrollerList" :showRefresh="true" @refresh="onrefresh">
    <cell>
    <scroller>
        <div class="qrCode">
            
        </div>
        <wxc-cell 
            label="发货号"
            :title="listItem.id"
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="发货日期"
            :title="listItem.dDate "
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="公司名称"
            :title="listItem.company "
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="联系人"
            :title="listItem.attn "
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="手机号"
            :title="listItem.tel "
            @wxcCellClicked="call(listItem.tel)">
        </wxc-cell>
        <wxc-cell 
            label="地址"
            :title="listItem.Address">
        </wxc-cell>
        <wxc-cell 
            label="合计"
            :title="listItem.CollectionMoney "
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="已收"
            :title="listItem.PayCollectionMoney "
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="应收"
            :title="listItem.intMustPay "
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="扫描人"
            v-if="listItem.strScanner"
            :title="listItem.strScanner"
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="操作日期"
            v-if="listItem.dScanner"
            :title="listItem.dScanner"
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="发货单状态"
            v-if="listItem.strStatus"
            :title="listItem.strStatus "
            @wxcCellClicked="getParams">
        </wxc-cell>
        <div class="size">
          <wxc-button text="确定到货"
                      type="blue"
                      size="medium"
                      @wxcButtonClicked="wxcButtonClicked('enter')"></wxc-button>
          <!-- <wxc-button text="确认退货"
                      type="yellow"
                      size="medium"
                      @wxcButtonClicked="wxcButtonClicked('outer')"></wxc-button> -->
          <wxc-button text="二维码"
                      type="red"
                      size="medium"
                      @wxcButtonClicked="wxcButtonClicked('getQRcode')"></wxc-button>
        </div>
        <scroller :scroll-direction="scrollType" class="table" :style="tableStyle" >
            <div class="table-cell">
                <div class="table-td"><text class="table-text">物流单</text></div>
                <div class="table-td"><text class="table-text">平台单</text></div>
                <div class="table-td"><text class="table-text">数量</text></div>
                <div class="table-td"><text class="table-text">应收</text></div>
                <div class="table-td"><text class="table-text">状态</text></div>
            </div>
            <div class="table-cell" v-for="(item , key) in listData" :key ="key">
                <div class="table-td"><text class="table-text">{{item.Id}}</text></div>
                <div class="table-td"><text class="table-text">{{item.CytMallId}}</text></div>
                <div class="table-td"><text class="table-text">{{item.intCount}}</text></div>
                <div class="table-td"><text class="table-text">{{item.intMustPay}}</text></div>
                <div class="table-td"><text class="table-text">{{item.strStatus}}</text></div>
            </div>
        </scroller>
        <wxc-dialog title="发送确认到货提示"
                    content="是否继续操作"
                    :show="enterShow"
                    @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
                    @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
        </wxc-dialog>
        <wxc-mask height="800"
              width="702"
              border-radius="0"
              duration="200"
              mask-bg-color="#FFFFFF"
              :overlay-can-close="true"
              :has-animation="false"
              :has-overlay="true"
              :show-close="true"
              :show="payShow"
              @wxcMaskSetHidden="wxcMaskSetHidden(2)"
              >
            <div class="content">
                <div class="demo-title">
                <text class="title">二维码支付</text>
                </div>
                <scroller class="content-text">
                    <wxc-checkbox title="订单号             应收额            状态" :checked="selectAll" :disabled="true" @wxcCheckBoxItemChecked="payListItemChecked"></wxc-checkbox>
                    <wxc-checkbox-list :cellStyle="cellStyle" :list="payListData" ref="payList" @wxcCheckBoxListChecked="wxcCheckBoxListChecked"
                        ></wxc-checkbox-list>
                    <div class="pay-group">
                        <image class="pay-type" src='http://yj.kiy.cn/Content/Images/App/assets/list/wechatpay.png' @click="pay(true)"></image>
                        <image class="pay-type" src='http://yj.kiy.cn/Content/Images/App/assets/list/alipay.png' v-on:click="pay(false)" style="margin-left:80px;"></image>
                    </div>
                </scroller>
            </div>
        </wxc-mask>
    </scroller>
    </cell>
</list>
</template>
<script>
import { WxcCell , wxcButton , WxcDialog , WxcCheckboxList ,WxcCheckbox , WxcMask  } from 'weex-ui'
import Category from '../_mods/category'
import API from 'Utils/api'
export default {
    components: { WxcCell, wxcButton , WxcDialog , WxcCheckboxList ,WxcCheckbox , WxcMask }, 
    data () {
        return {
            enterShow: false,
            outerShow: false,
            backspaceShow: false,
            selectAll: true,
            selectTitle: '订单号             小计            状态',
            statusBarStyle: 'LightContent',
            listItem: {},
            listData: [],
            payListData: [],
            scrollType: 'horizontal',
            cellStyle : {
                height: '60px',
                'padding-top':'0px',
                'padding-bottom': '0px'
            },
            tableStyle: {
                height: '0px'
            },
            show: false,
            overlayCanClose: true,
            isFalse: false,
            payShow: false
        }
    },
    eros: {
        beforeAppear(params, options ) {
            if(params.Head) {
                this.listItem = params.Head[0]
                this.setBody(params.Body)
            } else {
                var result = this.$storage.getSync('QR_Code')
                var code = result.split('-');
                if(code[0] === 'YJ_ORDERGROUP') {
                    this.listItem.id = code[1]
                    this.onrefresh()
                }
            }
        }
    },
    computed: {
        userInfo() {
            var userInfo = API.get_userInfo(this);
            return userInfo;
        }
    },
    methods: {
        wxcButtonClicked(type) {
            if(type === 'enter') {
                this.enter()
            }
            if(type === 'outer') {
                this.openMask()
            }
            if(type === 'getQRcode') {
                this.getQRcode()
            }
            if(type === 'ok') {
                this.ok()
            }
            if(type === 'scan') {
                this.scan()
            }
            if(type === 'cancel') {
                this.cancel()
            }
        },
        async onrefresh() {
            try {
                const RES = await API.get_fahuoInfo({'@intFahuoID' : this.listItem.id })
                const DATA = JSON.parse(RES.DATA)
                this.listItem = DATA.Head[0]
                this.setBody(DATA.Body)
                if(!this.load) {
                    this.$refs["scrollerList"].refreshEnd()
                } else {
                    this.load = false
                }
                
            } catch (error) {
                this.$refs["scrollerList"].refreshEnd()
            }
        },
        setBody(bodys) {
            let num = 1;
            this.listData = []
            bodys.map(item => {
                item.title = `${item.Id}            ${item.intMustPay}               ${item.strStatus}`
                item.value = item.Id
                item.checked = true
                num++                
                this.listData.push(item)
            })
            this.tableStyle.height = (num * 75) + 'px'
        },
        async enter () {
            this.enterShow = true
        },
        async getQRcode () {
            // 打开二维码按钮
           this.$notice.loading.show();
            const RES = await API.get_fahuoInfo({'@intFahuoID' : this.listItem.id})
            const DATA = JSON.parse(RES.DATA)
            const BODY = DATA.Body
            this.payListData = []
            BODY.map(item => {
                if(item.Status === 50 && item.intMustPay > 0){
                    item.title = `${item.Id}            ${item.intMustPay}               ${item.strStatus}`
                    item.value = item.Id
                    item.checked = true
                    this.payListData.push(item)
                }
            })
            this.$notice.loading.hide();
            if(this.payListData.length === 0){
                this.$notice.toast({
                    message: '没有符合{配送完成}并且{应收款大于0}的单'
                });
            } else {
                this.selectAll = true
                this.payShow = true;
            }
            
        },
        payListItemChecked(e) {
            var _this = this
            this.selectAll = e.checked
            this.payListData.map((item,index) => {
                this.payListData[index].checked = e.checked
            })
        },
        async pay(type) {
            var bweixin = type ? "微信支付" : "支付宝支付";
            this.$notice.loading.show(`你选择了${bweixin}`);
            const checkList = this.$refs.payList.checkedList;
            try {
                var selectList = []
                checkList.map(item => {
                    this.payListData.map(obj => {
                        if(obj.Id === item){
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
                const len = payGroup.length - 1;
                let orderGroup = "";
                let keyGroup = "";
                let payMoney = 0;
                payGroup.map((item, index) => {
                    if(item.checked) {
                        if (index === len) {
                            orderGroup += item.CytMallId;
                            keyGroup += item.Id;
                        } else {
                            orderGroup += item.CytMallId + ",";
                            keyGroup += item.Id + ",";
                        }
                        payMoney += item.CollectionMoney;
                    }
                });
                const param = {
                    intMustPay: payMoney,
                    orderId: orderGroup,
                    key: keyGroup,
                    adminId: userInfo.adminId,
                    bweixin: type
                };
                const RES = await API.YJ_PAY(param);
                if (RES.SUCCESS) {
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
        wxcDialogCancelBtnClicked () {
            this.enterShow = false;
        },
        async wxcDialogConfirmBtnClicked () {
            // 确认收货
            this.$notice.loading.show();
            try {
                const RES = await API.YJ_enterFahuo({'@intFahuoID' : this.listItem.id , '@intScanner' : this.userInfo.adminId , '@strScanner' : this.userInfo.RealName})
                this.$notice.loading.hide();
                if(RES.SUCCESS) {
                    this.$notice.toast({
                        message: RES.MESSAGE
                    });
                    this.enterShow = false;
                    this.load = true
                    this.onrefresh()
                }
            } catch (error) {
                this.$notice.loading.hide();
                this.enterShow = false;
            }
            
        },
        wxcCheckBoxItemChecked(e) {
            var _this = this;
            this.selectAll = e.checked
            this.listData.map((item,index) => {
                this.listData[index].checked = e.checked
            })
        },
        wxcCheckBoxListChecked (e , index) {
            if(e.checkedList.length != this.payListData.length) {
                this.selectAll = false
            } else {
                this.selectAll = true
            }
        },
        openMask (e) {
            this.show = true;
            this.hasAnimation = true;
        },
        wxcMaskSetHidden (type) {
            if(type == 1) {
                this.show = false;
            }
            if(type == 2) {
                this.payShow = false
            }
            
        },
        openNoAnimationMask (e) {
            this.show = true;
            this.hasAnimation = false;
        },
        ok () {

        },
        cancel() {
            this.show = false
        },
        async scan () {
            var _this =this;
            var userInfo = this.userInfo;
            this.$tools.scan().then((resData) => {
                var par = {
                    roleId: userInfo.RoleId,
                    qr_code: resData ,
                    adminId: userInfo.adminId
                }
                _this.scanSuccess(par)
            }).catch (ex => {
            }) 
        },
        call(number) {
            this.$coms.call(number)
        }
    },
    mounted() {
        var _this = this;
        this.$event.on("paySuccess", params => {
            _this.payShow = false;
            _this.onrefresh();
        });
    },
    created () {
        
    }

}
</script>
<style>
    .size {
        flex-direction: row;
        justify-content: space-around;
        margin-top: 20px;
        margin-bottom: 20px;
    }
    .table {
        margin-bottom: 50px;
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
        height: 75px;
        line-height: 75px;
        align-items: center;
        justify-content: center;
        border-width: 2px;
        border-color: #2096f2;
        border-style: solid;
        background-color: #fff;
    }
    .table-text {
        font-size: 28px;
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
    .content {
        width: 702px;
        background-color: #fff;
        border-radius: 4px;
    }
    .demo-title {
        height: 95px;
        justify-content: center;
        padding-left: 48px;
        border-bottom-width: 2px;
        border-bottom-style: solid;
        border-bottom-color: #2096f2;
    }
    .content-text {
        margin-top: 20px;
        height: 695PX;
        padding-bottom: 50px;
    }
    .title {
        color: #2096f2;
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
</style>