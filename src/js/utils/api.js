import axios from './axios.js'


let api = { 
	App_Version : '2.5',
	YJ_GETORDER : (data) => axios.getAjaxData(data , 'search' , 'YJApp_OrderInfo'),
	YJ_ENTER  : (data) => axios.getAjaxData(data , 'enterIn'),
	YJ_SEARCH : (data) => axios.getAjaxData(data , 'search'),
	YJ_SCAN   : (data) => axios.getAjaxData(data , 'scanIn'),
	YJ_LOGIN  : (data) => axios.getAjaxData(data , 'login'),
	YJ_errOrder: (data) => axios.getAjaxData(data, 'errOrder'),
	YJ_WARHOURSCODE : (data) => axios.getAjaxData(data , 'search' , 'YJApp_GetWarhours'),
	YJ_PAY : (data) => axios.getAjaxData(data, 'payMent'),
	// 查看彩印通订单有没有物流单
	YJ_GetOrder : (data) => axios.getAjaxData(data , 'search' , 'YJApp_GetOrder'),
	YJ_PAYCHECK : (data) => axios.getAjaxData(data ,'search' , 'YJApp_IsPay'),
	// 修i该用户资料
	YJ_USERMANAGE : (data) => axios.getAjaxData(data, 'userManage' ),
	// 财务记录
	YJ_PAYMENTLIST: (data) => axios.getAjaxData(data, 'search', 'YJAPP_PaymentList'),
	// 签到记录
	YJ_GETDRIVINGRECORD: (data) => axios.getAjaxData(data, 'search', 'GetDriving_record'),
	// 获取子单列表
	YJ_ORDERLIST: (data) => axios.getAjaxData(data, 'search', 'YJApp_OrderList'),
	// 收款汇总
	Get_AdminStatistics: (data) => axios.getAjaxData(data, 'search', 'Get_AdminStatistics'),
	// 获取子单物流状态
	YJ_ORDERLISTSTATUS: (data) => axios.getAjaxData(data , undefined , 'QueryOrderRecordsList' , '217141a5-01d0-4696-9500-ae2d82a8cb4c'),
	// 查彩印通订单
	KIY_SEARCHORDER: (data) => axios.postApiData(data, `${axios.kiyDomain}/webapi/Himall.NewShop.GetOrderInfo`),
	//权限 
	get_access: (data) => axios.getAjaxData(data , 'search' , 'AppMenuAuthor' ),
	get_accessBtn: (data) => axios.getAjaxData(data , 'search' , 'AppButtonBizAuthor' ),
	// 获取发货单列表
	get_fahuoList: (data) => axios.getAjaxData(data , 'search' , 'getFahuoList' ),
	// 获取发货信息
	get_fahuoInfo : (data) => axios.getAjaxData(data , 'search' , 'getFahuoInfo'),
	// 发货单确认到货 
	YJ_enterFahuo: (data) => axios.getAjaxData(data , 'orderGroup' , 'enterOrderGroup'),
	// 读取业务员
	get_adminList: (data) => axios.getAjaxData(data, 'search', 'GetDeliveryList', '217141a5-01d0-4696-9500-ae2d82a8cb4c'),
	// 获取APP操作记录
	Get_AppRecord: (data) => axios.getAjaxData(data , 'search' , 'Get_AppRecord'),
	// getUncollectedOrder , getPaycollectOrder , getAllOrder 根据业务员Id获取已收款， 未收款 ， 所有订单
	get_CollectedOrder: (data, methodName) => axios.getAjaxData(data, 'search', methodName),
	// 物流后台业务员配送率
	get_QueryDistributionRateList: (data) => axios.getAjaxData(data, 'search', 'QueryDistributionRateList', '217141a5-01d0-4696-9500-ae2d82a8cb4c'),
	// 全部
	get_QueryBusinessDistributionSummaryDetails: (data) => axios.getAjaxData(data, 'search', 'QueryBusinessDistributionSummaryDetailsListNew', '217141a5-01d0-4696-9500-ae2d82a8cb4c'),
	// 物流后台业务员配送率详情（未收款）
	get_QueryDistributionRateDetail: (data) => axios.getAjaxData(data, 'search', 'QueryBusinessDistributionSummaryDetailsList', '217141a5-01d0-4696-9500-ae2d82a8cb4c'),
	// 首页数据统计
	get_GetHomeData: (data) => axios.getAjaxData(data, 'search', 'GetHomeData'),
	// 检查订单是否可以售后接口
	get_IsOrderRefunds: (data) => axios.postApiData(data, `${axios.kiyDomain}/webapi/Himall.OrderRefund.IsOrderRefunds`),
	// 申请售后接口
	get_OrderRefundRefundApply: (data) => axios.postApiData(data, `${axios.kiyDomain}/webapi/Himall.OrderRefund.OrderRefundRefundApply`),
	// 上传图片接口
	get_kiyImageUrl: (data) => {return `${axios.kiyDomain}/common/PublicOperation/UploadPic`},
	// 以下是缓存到store的参数
	get_warhoursCode : (vm) => {return vm.$storage.getSync('warhoursCode')},
	get_userInfo : (vm) => {return vm.$storage.getSync('userInfo')},
	check_version: (data) => axios.postApiData(data, `${axios.YJdomain}/Global/HotUpdate/CheckUpdate?isDiff=1&appName=${data.appName}&${data.os}=${data.version}`),
	// 上传头像
	post_uploadHead: (data) => axios.postApiData(data, `${axios.YJdomain}/Global/HotUpdate/UpLoadHeadIcon?realName=${data.realName}`),
	// 请求其他
	post: (options) => axios.postApiData(options.data, options.url , options.type ),
	// 检测是不是数字
	checkNumber : (theObj) => {
	    var reg = /^[0-9]+.?[0-9]*$/;
	    if (reg.test(theObj)) {
	        return true;
	    }
	    return false;
	},

	// 获取日期
	get_date : (type , isOrder) => {
		var startTime = ' 00:00:00'
		var endTime = ' 23:59:59'
		var nowdate = new Date();
	    var y = nowdate.getFullYear();
	    var m = padLeft(nowdate.getMonth() + 1);
	    var d = padLeft(nowdate.getDate());
	    var fornow = y + '-' + m + '-' + d;

	    var oneweekdate = new Date(nowdate - 7 * 24 * 3600 * 1000);
	    var y = oneweekdate.getFullYear();
	    var m = padLeft(oneweekdate.getMonth() + 1);
	    var d = padLeft(oneweekdate.getDate());
	    var forweek = y + '-' + m + '-' + d;

	    nowdate.setMonth(nowdate.getMonth() - 1);
	    var y = nowdate.getFullYear();
	    var m = padLeft(nowdate.getMonth() + 1);
	    var d = padLeft(nowdate.getDate());
	    var formonth = y + '-' + m + '-' + d;

	    var h = nowdate.getHours();
	    var m = nowdate.getMinutes();
	    var s = nowdate.getSeconds();
	    var forTime = h + ':' + m + ':' + s;

	    switch (type) {
	    	case '今天':
	    		var today = undefined;
	    		if(!isOrder) {
	    			today = {'@beginDate' : fornow + startTime , '@endDate' : fornow + endTime}
	    		} else {
	    			today = {'startTime' : fornow + startTime , 'endTime' : fornow + endTime}
	    		}
	    		return today
	    	break;
	    	case '一周内' :
	    		var week = undefined
	    		if(!isOrder) {
	    			week = {'@beginDate' : forweek + startTime , '@endDate' : fornow + endTime}
	    		} else {
	    			week = {'startTime' : forweek + startTime , 'endTime' : fornow + endTime}
	    		}
	    		return week
	    	break;
	    	case  '一月内' :
	    		var month = undefined
	    		if(!isOrder) {
	    			month = {'@beginDate' : formonth + startTime , '@endDate' : fornow + endTime}
	    		} else {
	    			month = {'startTime' : formonth + startTime , 'startTime' : fornow + endTime}
	    		}
	    		return month
	    	break;
	    	case 'today' :
	    		return fornow
	    	break;
	    	case 'week' :
	    		return forweek
			break;
			case 'beginMonth':
				const monthOne = fornow.split('-')
				return monthOne[0] + '-' + monthOne[1] + '-' + '01'
	    	default:
	    		return {'@beginDate' : fornow , '@endDate' : fornow}
	    }
	},
	formatTime (date) {
		const data = date.split('T')
		return `${data[0]} ${data[1]}`
	},
	trim (str) {
		return str.replace(/^\s+|\s+$/g, "")
	}

}
function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
}

function padLeft (str) { 
	var len = 2;
	var char = '0';
	if(typeof str != 'string'){
		str = str.toString()
	}
	return str.length < len ? char + str : str
}

export default api  