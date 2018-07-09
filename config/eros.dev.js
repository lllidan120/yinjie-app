// appBoard，mediator 不建议进行修改 如果修改了 也请对应修改
module.exports = {
    'eslint': false,
    'webpackWarnings': false,
    'exports': [
        // appBoard
        'js/config/index.js',
        // mediator
        'js/mediator/index.vue',
        // home
        'js/pages/yjapp/index.vue',
        'js/pages/yjapp/login.vue',
        'js/pages/yjapp/scan/logisticalscan.vue',
        'js/pages/yjapp/logistical/detail.vue',
        'js/pages/yjapp/logistical/dislist.vue',
        'js/pages/yjapp/logistical/pay.vue',
        'js/pages/yjapp/order/list.vue',
        'js/pages/yjapp/order/detail.vue',
        'js/pages/yjapp/batch-list/batch-list.vue',
        'js/pages/yjapp/collection/collection.vue',
        'js/pages/yjapp/collection/collectionlist.vue',
        'js/pages/yjapp/person/person.vue',
        'js/pages/yjapp/signin/sigin.vue',
        'js/pages/yjapp/signin/siginlist.vue',
        'js/pages/yjapp/signin/sigindetail.vue',
        'js/pages/yjapp/404.vue',
        'js/pages/yjapp/map/map.vue',
        'js/pages/yjapp/invoice/list.vue',
        'js/pages/yjapp/invoice/detail.vue',
        'js/pages/yjapp/echart/list.vue',
        'js/pages/yjapp/echart/detail.vue',
        'js/pages/yjapp/help/index.vue',
        'js/pages/yjapp/person/apprecord.vue',
        'js/pages/yjapp/service/orderRefund.vue',
        'js/pages/yjapp/muff/index.vue'

    ],
    'alias': {
        'Components': 'js/components',
        'Common': 'js/common',
        'Config': 'js/config',
        'Widget': 'js/widget',
        'Pages': 'js/pages',
        'Utils': 'js/utils'
    },
    'diff': {
        'pwd': '/yjappversion/',
        'proxy': 'http://47.106.121.134:3001/static/'

    },
    'server': {
        'path': './',
        'port': 8889
    },
    'mockServer': {
        'port': 52077,
        'mockDir': './dist/mock'
    },
    'socketServer': {
        'port': 8890,
        'switch': true
    }
}
