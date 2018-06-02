const globalEvent = weex.requireModule('globalEvent')
const bmPush = weex.requireModule('bmPush')
const modal = weex.requireModule('modal')
bmPush.initPush({
    appId: 'kUKePtEOlT6DtDS16j8Db2', // appId、appKey、appSecret 需要到个推后台获取
    appKey: 'vaQQo76BsX7mHUEvIXfSw3',
    appSecret: 'StJwwDk6Ms6LtlcSa4cmY8'
})
/**
 * 消息推送
 * options 客户端个推推送的所有消息
 */
globalEvent.addEventListener('pushMessage', function (options) {
    console.log(options)
    modal.alert({
        message: 'hello 推送消息',
        duration: 0.3
    }, function (value) {
        console.log('alert callback', value)
    })

})
