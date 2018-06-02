import encode from './encode'
const bmAxios = weex.requireModule('bmAxios') 
const storage = weex.requireModule('bmStorage')
var modal = weex.requireModule('modal')
const userInfoStorage = storage.getDataSync('userInfo')

let axios = {}
let domain = 'http://yj.kiy.cn'
// domain = 'http://192.168.30.37:22669'
// TYPE : m:
axios.getAjaxData = (param , TYPE , strMethod , uid) => new Promise((resolve , reject) => {
    var paramData = param;
    if (userInfoStorage.status === 0){
        var userInfo = JSON.parse(userInfoStorage.data)
        paramData = Object.assign(param, {
            'SysAdminId': userInfo.adminId,
            'SysAdminName': userInfo.RealName,
            'SysRoleId': userInfo.RoleId
        })
    }
    if(TYPE) {
        paramData = Object.assign(param,{'m': TYPE})
    }
	if(strMethod) {
        paramData = Object.assign(paramData,{strMethod: strMethod})
    }
	const data = Object.assign(
        {uid : uid || 'd3bd0809-8030-4843-9fed-48878edb2f6a'},
        {param : paramData}
    )
    console.log(JSON.stringify(data))
	const en = encode(JSON.stringify(data))
	bmAxios.fetch({
        url: domain + '/Admins/GetData/GetAjaxData',
        data:  {data : en},
        method: 'POST',
        header: {},
        timeout: 30000
    }, (resData) => {
        console.log(JSON.stringify(resData.data))
        if(resData.status == 200) {
            if (resData.data.SUCCESS) {
                resolve(resData.data)
            } else  if(resData.data.map) {
                resolve(resData.data)
            } else {
                modal.toast({
                    message: resData.data.MESSAGE,
                    duration: 1
                })
                reject(resData.data)
            }
        } else {
            modal.toast({
                message: '网络异常，请重试',
                duration: 1
            })
        }
    })
})

axios.postApiData = (param , url , type) => new Promise((resolve , reject) => {
    if (userInfoStorage.status === 0) {
        var userInfo = JSON.parse(userInfoStorage.data)
        param = Object.assign(param, {
            'SysAdminId': userInfo.adminId,
            'SysAdminName': userInfo.RealName,
            'SysRoleId': userInfo.RoleId
        })
    }
    // console.log(JSON.stringify(param))
    bmAxios.fetch({
        url: url,
        data:  param,
        method: type || 'POST',
        header: {},
        timeout: 30000
    }, (resData) => {
        if(resData.status == 200) {
            // console.log(JSON.stringify(resData.data))
            resolve(resData.data)
        } else {
            reject(resData.data)
        }
    })
})

export default axios
