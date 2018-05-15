<template>
    <scroller>
        <category title="订单信息"></category>
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
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="订单地址"
            :title="listItem.SellerAddress  "
            @wxcCellClicked="getParams">
        </wxc-cell>
        <wxc-cell 
            label="订单状态"
            :title="listItem.OrderStatusStr  "
            @wxcCellClicked="getParams">
        </wxc-cell>
    </scroller>
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
                console.log(JSON.stringify(params))
                this.listItem = params
        }
    },
    methods: {
        
    },
    mounted() {
        
    },
    created () {
        
    }

}
</script>
