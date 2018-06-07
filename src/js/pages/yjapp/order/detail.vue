<template>
    <list ref="scrollerList" :showRefresh="true" @refresh="onrefresh">
        <cell>
            <scroller>
                <wxc-cell 
                    label="订单号"
                    :title="listItem.Id"
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="下单时间"
                    :title="listItem.OrderDate "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="店铺名称"
                    :title="listItem.ShopName "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="店铺ID"
                    :title="listItem.ShopId "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="店铺地址"
                    :title="listItem.SellerAddress  "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="货物数量"
                    :title="listItem.Shuliang "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="订单总价"
                    :title="listItem.OrderAmount "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="支付类型"
                    :title="listItem.PaymentTypeStr "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="下单人姓名"
                    :title="listItem.RealName "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="用户名"
                    :title="listItem.UserName "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="用户会员号"
                    :title="listItem.UserId "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <wxc-cell 
                    label="联系电话"
                    :title="listItem.CellPhone"
                    @wxcCellClicked="call(listItem.CellPhone)">
                </wxc-cell>
                <wxc-cell 
                    label="订单状态"
                    :title="listItem.OrderStatusStr  "
                    @wxcCellClicked="getParams"> 
                </wxc-cell>
                <wxc-cell 
                    label="文件名"
                    :title="listItem.FileName  "
                    @wxcCellClicked="getParams">
                </wxc-cell>
                <div class="top-three-top">
                    <wxc-simple-flow :list="testData" ></wxc-simple-flow>
                </div>
                <div class="bottom-btn" v-if="false">
                    <wxc-button text="发起售后"
                        type="blue"
                        @wxcButtonClicked="wxcButtonClicked"></wxc-button>
                </div>
            </scroller>
        </cell>
    </list>
</template>
<script>
import { WxcCell , WxcSimpleFlow , WxcButton } from 'weex-ui'
import API from 'Utils/api'
export default {
    components: { WxcCell, WxcSimpleFlow , WxcButton }, 
    data () {
        return {
            tapBackTime: 0,
            navShow: true,
            statusBarStyle: 'LightContent',
            listItem: {},
            testData: []
        }
    },
    eros: {
        beforeAppear(params, options ) {
            this.listItem = params
            this.onrefresh()
        }
    },
    methods: {
        call(number) {
            this.$coms.call(number)
        },
        async onrefresh(type) {
            var par = {
                "orderId" : this.listItem.Id,
                'page_no' : 1,
                'page_size' : 1
            }
            var RES = await API.KIY_SEARCHORDER(par)
            if(RES.Success) {
                var RESDATA = JSON.parse(RES.Data)
                var DGDATA = RESDATA.data.Models
                this.listItem = DGDATA[0]
                this.getChildOrder()
            }
            if(type) {
                this.$refs["scrollerList"].refreshEnd()
            }
        },
        async getChildOrder () {
            const Status = await API.YJ_ORDERLISTSTATUS({'@cytId': this.listItem.Id})
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
        },
        wxcButtonClicked () {
            this.$router.open({
    			name: 'orderRefund',
    			type: 'PUSH',
    			params: this.listItem
    		})
        }
    },
    mounted() {
        
    },
    created () {
        
    }

}
</script>
<style>
.top-three-top {
  flex-direction: row;
  justify-items: center;
  align-items: center;
  width: 750px;
  /* height: 72px; */
  margin-top: 20px;
  /* padding-right: 40px; */
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

