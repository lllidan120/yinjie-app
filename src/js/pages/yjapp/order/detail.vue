<template>
    <list ref="scrollerList" :showRefresh="true" @refresh="onrefresh">
        <cell>
            <scroller>
                <!-- <category title="订单信息"></category> -->
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
            </scroller>
        </cell>
    </list>
</template>
<script>
import { WxcCell } from 'weex-ui'
import Category from '../_mods/category'
import API from 'Utils/api'
export default {
    components: { WxcCell, Category }, 
    data () {
        return {
            tapBackTime: 0,
            navShow: true,
            statusBarStyle: 'LightContent',
            listItem: {}
        }
    },
    eros: {
        beforeAppear(params, options ) {
                this.listItem = params
        }
    },
    methods: {
        call(number) {
            this.$coms.call(number)
        },
        async onrefresh() {
            var par = {
                "orderId" : this.listItem.Id,
                'page_no' : 1,
                'page_size' : 1
            }
            var RES = await API.KIY_SEARCHORDER(par)
            if(RES.Success) {
                var RESDATA = JSON.parse(RES.Data)
                var DGDATA = RESDATA.data.Models
                console.log(JSON.stringify(DGDATA[0]))
                this.listItem = DGDATA[0]
            }
            this.$refs["scrollerList"].refreshEnd()
        }
    },
    mounted() {
        
    },
    created () {
        
    }

}
</script>
