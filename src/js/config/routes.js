// 这里的后缀都是 .js 因为打包出来的都是js文件，而不是.vue文件，我们要告诉客户端跳转那个js

//  这里的路径和dev.json路径的区别
//  pages里面配置的是路由跳转的地址，也就是dev生成的 dist文件夹下的js bundle路径 从dist/js开始
//  dev.json 的 exports 需要打包的js地址，填入src的需要被打包成js bundle的地址   从src开始

export default {
    'main': {
        url: '/pages/yjapp/index.js'
    },
    'login': { 
        url: '/pages/yjapp/login.js'
    },
    'logistical-list': {
        title: '物流列表',
        url: '/pages/yjapp/logistical/list.js'
    },
    'logistical-detail': {
        title: '详情页',
        url: '/pages/yjapp/logistical/detail.js'
    },
    'dis-list' : {
        title: '列表',
        url: '/pages/yjapp/logistical/dislist.js'
    },
    'pay' : {
        title: '支付',
        url: '/pages/yjapp/logistical/pay.js'
    },
    'order-list' : {
        title: '平台订单',
        url: '/pages/yjapp/order/list.js'
    },
    'order-detail' : {
        title: '平台订单详情',
        url: '/pages/yjapp/order/detail.js'
    },
    'batch-list' : {
        title: '批量操作列表',
        url: '/pages/yjapp/batch-list/batch-list.js'
    },
    'collection' : {
        title: '财务记录',
        url: '/pages/yjapp/collection/collection.js'
    },
    'collectionlist': {
        title: '财务记录',
        url: '/pages/yjapp/collection/collectionlist.js'
    },
    'person' : {
        title: '修改密码',
        url: '/pages/yjapp/person/person.js',
    },
    'signin': {
        title: '签到',
        url: '/pages/yjapp/signin/sigin.js'
    },
    'signinlist': {
        title: '签到记录',
        url: '/pages/yjapp/signin/siginlist.js'
    },
    'sigindetail': {
        title: '签到详情',
        url: '/pages/yjapp/signin/sigindetail.js'
    },
    '404' : {
        title: '404',
        url: '/pages/yjapp/404.js'
    },
    'map' : {
        title: '地图',
        url: '/pages/yjapp/map/map.js'
    },
    'invoice-list': {
        title: '发货单列表',
        url: '/pages/yjapp/invoice/list.js'
    },
    'invoice-detail': {
        title: '发货单详情',
        url: '/pages/yjapp/invoice/detail.js'
    },
    'echartlist' : {
        title: '业务员配送率',
        url: '/pages/yjapp/echart/list.js'
    },
    'echartdetail': {
        title: '业务员配送率详情',
        url: '/pages/yjapp/echart/detail.js'
    },
    'helpindex': {
        title: '帮助中心',
        url: '/pages/yjapp/help/index.js'
    },
    'apprecord': {
        title: 'APP操作记录查询',
        url: '/pages/yjapp/person/apprecord.js'
    },
    'orderRefund' : {
        title: '发起售后',
        url: '/pages/yjapp/service/orderRefund.js'
    },
    'manualInput': {
        title: '手工输入',
        url: '/pages/yjapp/muff/index.js'
    }



}
