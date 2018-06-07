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
        label="货物数量"
        :title="listItem.Shuliang "
        @wxcCellClicked="getParams">
    </wxc-cell>
    <wxc-cell 
        label="订单总价"
        :title="listItem.OrderAmount "
        @wxcCellClicked="getParams">
    </wxc-cell>
    <wxc-cell 
        label="下单人姓名"
        :title="listItem.RealName "
        @wxcCellClicked="getParams">
    </wxc-cell>
    <wxc-cell 
        label="订单状态"
        :title="listItem.OrderStatusStr  "
        @wxcCellClicked="getParams"> 
    </wxc-cell>
    <category title="填写售后信息"></category>
    <wxc-cell label="售后类型 >"
                :title="type"
                :has-arrow="false"
                :has-top-border="true"
                @wxcCellClicked="pickType('type')"></wxc-cell>
    <wxc-cell label="退款理由 >"
                :title="reason"
                :has-arrow="false"
                :has-top-border="true"
                @wxcCellClicked="pickType('reason')"></wxc-cell>
    <wxc-cell label="退款方式 >"
                :title="payType"
                :has-arrow="false"
                :has-top-border="true"
                @wxcCellClicked="pickType('payType')"></wxc-cell>
    <wxc-cell title="退款金额"
                :has-arrow="false"
                :has-top-border="true">
        <div class="wxc-search-bar" slot="value">
				<input class="search-bar-input"/>
        </div>
    </wxc-cell>
    <wxc-cell title="备注"
                :has-arrow="false"
                :has-top-border="true">
        <div class="wxc-search-bar" slot="value">
				<input class="search-bar-input"/>
        </div>
    </wxc-cell>
    <wxc-cell title="联系人"
                :has-arrow="false"
                :has-top-border="true">
        <div class="wxc-search-bar" slot="value">
				<input class="search-bar-input"/>
        </div>
    </wxc-cell>
    <wxc-cell title="联系电话"
                :has-arrow="false"
                :has-top-border="true">
        <div class="wxc-search-bar" slot="value">
				<input class="search-bar-input"/>
        </div>
    </wxc-cell>
    <category title="上传售后凭证"></category>
    
    <div class="image-group" >
        <div v-for="(item , key) in imageGroup" :key="key">
            <image class="image" :src="item"  @click="del(key)"></image>
        </div>
        <div class="tool-btn" @click="pick">
            <image class="tool-image" ref="main_image" src="https://gw.alicdn.com/tfs/TB1PZ25antYBeNjy1XdXXXXyVXa-128-128.png" />
        </div>
    </div>
    <div class="bottom-btn">
        <wxc-button text="提交售后"
              type="blue"
              @wxcButtonClicked="wxcButtonClicked"></wxc-button>
    </div>
  </scroller>
</template>
<script>
var tools = weex.requireModule('bmTool')
const picker = weex.requireModule('picker')
import { WxcCell , WxcButton } from 'weex-ui';
import category from '../_mods/category'
var amap = weex.requireModule('amap')
export default {
  components: {
    WxcCell,
    category,
    WxcButton
  },
  data () {
    return {
      imageGroup:[],
      pos: '',
      type: '请选择',
      typeIndex: 0,
      reason: '请选择',
      reasonIndex: 0,
      payType: '请选择',
      payTypeIndex: 0,
      listItem: {}
    }
  },
  eros: {
    beforeAppear(params, options ) {
        this.listItem = params
    }
},
  methods: {
    pickType (typeStr) {
        var _this = this;
        var items = []
        var type = ''
        var index = 0
        if(typeStr === 'type') {
            items = ['未付款减款' , '仅退款' , '退货退款']
            index = this.typeIndex
        } else if (typeStr === 'reason') {
            items = ['下单错误' , '印刷色差太大' , '有修改所以取消' , '没有收到货' , '有质量问题' , '其他问题' ]
            index = this.reasonIndex
        } else {
            items = ['订单减款' , '退到预付款']
            index = this.payTypeIndex
        }
        picker.pick({
            index,
            items
        }, event => {
            if (event.result === 'success') {
                if(typeStr === 'type') {
                    _this.type = items[event.data]
                    _this.typeIndex = event.data
                } else if (typeStr === 'reason') {
                    _this.reason = items[event.data]
                    _this.reasonIndex = event.data
                } else {
                    _this.payType = items[event.data]
                    _this.payTypeIndex = event.data
                }
            }
        })
    },
    
    
    pick () {
        var index = 0;
        var items = ['拍照上传' , '相册选择']
        if(this.imageGroup.length === 3 ) {
            this.$notice.toast({
                message: `最多上传${this.imageGroup.length}张照片`
            })
            return
        }
        picker.pick({
            index,
            items
        }, event => {
            if (event.result === 'success') {
                if(event.data === 0) {
                    this.car()
                } else {
                    this.pickImage()
                }
            }
        })
    },
    car () {
      var _this = this;
      
      this.$image.camera({               
      })
      .then(resData => {
          console.log(resData)   
          resData.map(item => {
            _this.imageGroup.push(item)
          })
      }, error => {
          console.log(error)
      })
    },
    pickImage () {
        var _this = this;
        var len = 3 - this.imageGroup.length

        this.$image.pick({
            maxCount: len            
        })
        .then(resData => {
            console.log(resData)   
            resData.map(item => {
              _this.imageGroup.push(item)
            })
        }, error => {
            console.log(error)
        })
    },
    del(i) {
        var newGroup = []
        var _this = this;
        this.$notice.confirm({
            title: '是否删除该图片',
            message: '点击确认删除',
            okTitle: '确认',
            cancelTitle: '取消',
            okCallback() {
                _this.imageGroup.map((item , index) => {
                    if(i === index) {
                        _this.imageGroup.splice(i , 1)
                    } 
                })
            },
            cancelCallback() {
            }

        })
        
    },
    wxcButtonClicked () {
   
    }
  }
}
</script>
<style>
.image-group {
    flex-direction: row;
    padding-left: 20px;
}
.image {
    width: 150px;
    height: 150px;
    margin-right: 20px;
    margin-top: 20px;
}
.tool-image {
  width: 60px;
  height: 60px;
}

.tool-text {
  color: #ffffff;
  font-size: 30px;
}

.tool-btn {
  margin-top: 40px;
  margin-left: 20px;
  width: 100px;
  height: 100px;
  background-color: #2096f2;
  align-items: center;
  justify-content: center;
  border-radius: 50;

}
.wxc-search-bar {
    background-color: #ffffff;
    width: 500px;
    height: 50px;
    flex-direction: row;
}
.search-bar-input {
  padding-bottom: 0;
  padding-right: 40px;
  padding-left: 40px;
  font-size: 26px;
  width: 500px;
  height: 50px;
  line-height: 50px;
  background-color: #E5E5E5;
  color: #000;
  border-radius: 6px;
}
.bottom-btn {
    width: 750px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #E5E5E5;
    padding-top: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}


</style>
