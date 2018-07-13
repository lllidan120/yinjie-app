const globalEvent = weex.requireModule('globalEvent')
const router = weex.requireModule('bmRouter')
const bmPush = weex.requireModule('bmPush')
const modal = weex.requireModule('modal')
    try {
        bmPush.initPush({
            appId: 'kUKePtEOlT6DtDS16j8Db2', // appId、appKey、appSecret 需要到个推后台获取
            appKey: 'vaQQo76BsX7mHUEvIXfSw3',
            appSecret: 'StJwwDk6Ms6LtlcSa4cmY8'
        })
    } catch (error) {
        
    }
/**
 * 消息推送
 * options 客户端个推推送的所有消息
 */
globalEvent.addEventListener('pushMessage', function (options) {
    console.log(options)
})
