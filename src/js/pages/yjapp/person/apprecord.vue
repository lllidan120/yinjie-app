<template>
	<div class="page">
        <datepick @selectTime="selectTime" @startDateFinish="startDateFinish" @endDateFinish="endDateFinish"></datepick>
        <div class="table-cell">
            <div class="table-td table-head"><text class="table-text">操作人</text></div>
            <div class="table-td table-head"><text class="table-text">日期</text></div>
            <div class="table-td table-head width-300px"><text class="table-text">备注</text></div>
        </div>
        <!-- @loadmore="getData" -->
        <list class="bui-list" ref="list" :show-scrollbar="true" :showRefresh="true" @refresh="onRefresh"   loadmoreoffset="2">
            <cell class="table-cell" v-for="(item , key) in listData" :key="key">
                <div class="table-td"  style="padding-top:20px;"><text class="table-text">{{item.RealName}}</text></div>
                <div class="table-td" style="padding-top:20px;"><text class="table-text">{{item.dCreateDate}}</text></div>
                <div class="table-td width-300px" style="padding-top:20px;"><text class="table-text">{{item.strRemark}}</text></div>
            </cell>
            <loading class="loading" @loading="getData" :display="showload ? 'show' : 'hide'">
              <text class="indicator-text">加载更多 ...</text>
              <loading-indicator class="indicator"></loading-indicator>
            </loading>
        </list>
	</div>

</template>
<script>
import { WxcCheckboxList, WxcPopover } from "weex-ui";
import datepick from "../_mods/datepick";
import API from "Utils/api";
const picker = weex.requireModule('picker')

export default {
  components: {
    WxcCheckboxList,
    WxcPopover,
    datepick
  },
  data() {
    return {
      listData: [],
      param: {
        "@rowIndex": 0,
        "@pageSize": 20
      },
      showload: false,
      onrefreshState: false,
      deliverList: [],
      index: -1,
      selectDeliverData: {
         RealName: '全部'
      }
    };
  },
  computed: {
    userInfo() {
      var userInfo = API.get_userInfo(this);
      return userInfo;
    }
  },
  created() {
    this.$router.getParams().then(resData => {
      this.init(resData);
    });
  },
  mounted() {
    var _this =this;
    this.$event.on("paySuccess", params => {
      _this.selectAllStatu = false;
      _this.onRefresh();
    });
  },
  methods: {
    onRefresh () {
        this.onrefreshState = true
        this.refresh()
    },
    async getData() {
      const _this = this;
      this.param["@rowIndex"]++;
      let param = {};
      param  = Object.assign(this.param , param)

      if (this.param["@rowIndex"] === 1) {
          if(!this.onrefreshState) {
              _this.$notice.loading.show("正在加载");
          }
      } else {
        this.showload = true;
      }
      if(this.userInfo.RoleId === 1 || this.userInfo.RoleId === 4) {

      } else {
        param =  Object.assign(param , {'@adminId' : this.userInfo.adminId})
      }

      if(this.selectDeliverData.RealName != '全部'){
        param =  Object.assign(param , {'@adminId' : this.selectDeliverData.Id})
      }
        let par = {}
        for(let key in param) {
            if(param[key] != undefined && param[key] != 'undefined') {
                par = Object.assign(param , param[key])
            }
        }
     
      var RES = await API.Get_AppRecord(par);
      if (RES.SUCCESS) {
        if (this.param["@rowIndex"] === 1)  {
          this.listData = []
        }
        var RESDATA = JSON.parse(RES.DATA);
     
        var DGDATA = JSON.parse(RESDATA.dgData);
        if (DGDATA.length != 0) {
          var newData = []
          DGDATA.map(item => {
            var date = item.dCreateDate.split('T')
            item.dCreateDate = `${date[0]}`
            newData.push(item)
          });
          this.listData = this.listData.concat(newData)
        } else {
          this.$notice.toast({
            message: "没有更多数据"
          });
        }
        if (param["@rowIndex"] === 1) {
            // if(!this.onrefreshState) {
                _this.$notice.loading.hide();
            // }
        } else {
          this.showload = false;
        }
      }
      if(this.onrefreshState) {
          this.onrefreshState=true
          this.$refs["list"].refreshEnd()
      }
      if(this.showload){
          this.showload = false;
      }
    },
    init(param) {
      this.QueryAdminList()
      this.setNav()
      this.getData();
    },
    refresh() {
      this.param['@rowIndex'] = 0
      this.getData();
    },
    startDateFinish(startDate) {
			this.param["@startDate"] = startDate + " 00:00:00";
			if (this.param["@endDate"] == undefined) {
				this.param["@endDate"] = startDate + " 23:59:59";
      }
      this.refresh()
		},
		endDateFinish(endDate) {
			this.param["@endDate"] = endDate + " 23:59:59";
			if (this.param["@startDate"] == undefined) {
				this.param["@startDate"] = endDate + " 00:00:00";
      }
      this.refresh()
    },
    setNav() {
      if(this.userInfo.RoleId === 1 || this.userInfo.RoleId === 4) {
        this.$navigator.setRightItem({
            text: this.selectDeliverData.RealName,                               // 展示的文字 (和图片 二选一)    
            textColor: '',                          // 文字颜色 (默认为白色)
            fontSize: '40',                         // 字号（默认32px）
            fontWeight: 'normal'                   // 是否加粗（默认不加粗）
        }, () => {
            // 点击回调
            this.selectDeliver()
        })
      }
    },
    selectDeliver () {
      var items = []
      if(items.length === 0){
        this.deliverList.map(item => {
          items.push(item.RealName)
        })
      }
      
      picker.pick({
            index: this.index,
            items
          }, event => {
            if (event.result === 'success') {
              this.selectDeliverData = this.deliverList[event.data]
              this.index = event.data
              this.setNav()
              this.refresh()
            }
      })
    },
    async QueryAdminList() {
      var par = {
        '$RoleId': '8,13'
      }
      const RES = await API.get_adminList(par)
      const DATA = RES.map.dgData;
      this.deliverList = DATA
    }
  }
};
</script>

<style scoped>
.page {
    height: auto;
}
.scroller {
    height: auto;
}
.search-bar {
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #dddddd;
}
.mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-top {
  align-items: flex-start;
}

.calendar {
  height: 800px;
  background-color: #ffffff;
  select-color: #1da1f2;
}

.search-date {
  flex-direction: row;
  justify-content: center;
  height: 100px;
  background-color: rgba(31, 181, 252, 0.4);
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #eee;
}
.search-date-text {
  text-align: center;
  width: 375px;
  height: 100px;
  line-height: 100px;
  color: #000;
}
.search-batch {
  width: 750px;
  height: 100px;
  justify-content: center;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eee;
}
.search-batch-btn {
  width: 400px;
  height: 80px;
  line-height: 80px;
  color: #fff;
  border-radius: 12px;
  text-align: center;
  background-color: #1da1f2;
}
.bottom-box {
  position: relative;
  width: 750px;
  height: 100px;
}
.pay-content {
  margin-left: 84px;
  margin-top: 312px;
  width: 580px;
  height: 300px;
  background-color: #fff;
  border-radius: 4px;
}
.pay-title {
  height: 105px;
  justify-content: center;
  padding-left: 48px;
  border-bottom-width: 1px;
  border-bottom-style: dotted;
  border-bottom-color: #cccccc;
}
.pay-group {
  flex-direction: row;
  padding-top: 52px;
  justify-content: center;
}
.pay-type {
  width: 215px;
  height: 66px;
}
.example {
  position: absolute;
  right: 0px;
  top: 20px;
  flex-direction: row;
  justify-content: flex-start;
}
.label {
  font-size: 20px;
  line-height: 60px;
  width: 350px;
  color: #666;
  text-align: right;
  margin-right: 20px;
}
.info {
  font-size: 30px;
  line-height: 60px;
  color: #bbb;
  margin-left: 10px;
}
.table {
    width: 750px;
    min-height:750px;
}
.table-cell {
    position:relative;
    width: 750px;
    flex-direction: row;
}
.table-td {
    display:block;
    float: left;
    width: 150px;
    min-height: 100px;
    align-items: center;
    justify-content: center;
    border-width: 2px;
    border-color: #2096f2;
    border-style: solid;
    background-color: #fff;
}
.table-text {
    font-size: 26px;
}
.table-head {
    height: 75px;
    background-color: #e9eaec;
}
.width-200px {
  width: 200px;
}
.width-100px {
  width: 100px;
}
.width-300px {
    width: 450px;
}
.loading {
    width: 750;
    display: -ms-flex;
    display: -webkit-flex;
    display: flex;
    -ms-flex-align: center;
    -webkit-align-items: center;
    -webkit-box-align: center;
    align-items: center;
  }
  .indicator-text {
    color: #888888;
    font-size: 42px;
    text-align: center;
  }
  .indicator {
    margin-top: 16px;
    height: 40px;
    width: 40px;
    color: blue;
  }
  
</style>
