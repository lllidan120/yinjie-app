module.exports = {
    'appName': 'yjapp',
    'appBoard': '/config/index.js',
    // android 监听全局事件homeBack 如果为true 安卓端需要自行调用router.finish方法来关闭应用
    'androidIsListenHomeBack': 'true',
    'version': {
        'android': '1.0',
        'iOS': '1.0.0'
    },
    'page': {
        'homePage': '/pages/yjapp/index.js',
        'mediatorPage': '/mediator/index.js',
        'navBarColor': '#2096f2',
        'navItemColor': '#ffffff'
    },
    'url': {
        'image': 'https://lev-inf.benmu-health.com/test/xxx',
        'bundleUpdate': 'http://47.106.121.134:3001/app/check'

    },
    'zipFolder': {
        'iOS': '/ios/WeexEros/WeexEros',
        'android': '/android/WeexFrameworkWrapper/app/src/main/assets'
    },
    'getui': {
        'enabled': 'false',
        'appId': 'kUKePtEOlT6DtDS16j8Db2',
        'appKey': 'vaQQo76BsX7mHUEvIXfSw3',
        'appSecret': 'StJwwDk6Ms6LtlcSa4cmY8'
    }
}
