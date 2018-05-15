import axios from './axios.js'


let api = { 
	YJ_GETORDER : (data) => axios.getAjaxData(data , 'search' , 'YJApp_OrderInfo'),
	YJ_ENTER  : (data) => axios.getAjaxData(data , 'enterIn'),
	YJ_SEARCH : (data) => axios.getAjaxData(data , 'search'),
	YJ_SCAN   : (data) => axios.getAjaxData(data , 'scanIn'),
	YJ_LOGIN  : (data) => axios.getAjaxData(data , 'login'),
	YJ_WARHOURSCODE : (data) => axios.getAjaxData(data , 'search' , 'YJApp_GetWarhours'),
	YJ_PAY : (data) => axios.getAjaxData(data, 'payMent'),
	YJ_PAYCHECK : (data) => axios.getAjaxData(data ,'search' , 'YJApp_IsPay'),
	// 修i该用户资料
	YJ_USERMANAGE : (data) => axios.getAjaxData(data, 'userManage' ),
	YJ_PAYMENTLIST: (data) => axios.getAjaxData(data, 'search', 'YJAPP_PaymentList'),
	// 签到记录
	YJ_GETDRIVINGRECORD: (data) => axios.getAjaxData(data, 'search', 'GetDriving_record'),
	// 获取子单列表
	YJ_ORDERLIST: (data) => axios.getAjaxData(data, 'search', 'YJApp_OrderList'),
	// 查彩印通订单
	KIY_SEARCHORDER : (data) => axios.postApiData(data , 'http://www.kiy.cn/webapi/Himall.NewShop.GetOrderInfo'),
	// 以下是缓存到store的参数
	get_warhoursCode : (vm) => {return vm.$storage.getSync('warhoursCode')},
	get_userInfo : (vm) => {return vm.$storage.getSync('userInfo')},
	
	// 请求其他
	post: (options) => axios.postApiData(options.data, options.url , options.type ),

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
	    		console.log(today)
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
	    	default:
	    		return {'@beginDate' : fornow , '@endDate' : fornow}
	    }
	}

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