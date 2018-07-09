<template>
  <div class="login-box">
      <category title="请先选择要手工输入的类型(物流单.名片.发货单):"></category>
			<div class="my-icon-input" >
        <div class="search-bar-left" slot="left"  @click="typeClick()">
          <div>
            <text class="search-bar-left-text">{{text}}</text>
          </div>
          <image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="search-bar-left-icon"></image>
        </div>
				<input 
				:class="['my-input' , status!=0 && 'my-input-two' , status== 0]" 
				v-model="orderId" 
				:placeholder="text"
				type="text"
				></input>
        <!-- <text class="logStyle" v-if="showlogistical"> 子单：</text> -->
        <wxc-stepper :default-value="childOrder" v-if="showlogistical" @wxcStepperValueChanged="stepperValueChange" style="margin-top:20px;"></wxc-stepper>
			</div>
      <text  style="margin-left: 100px;color: red;">注意：请不要输入新商城单号或生产单号!</text>
      
			<img class="login-btn" src="http://yj.kiy.cn/Content/Images/App/assets/person/submit.png" @click="submit">
      <wxc-popover ref="wxc-popover" :buttons="btns" :position="popoverPosition" :arrowPosition="popoverArrowPosition" @wxcPopoverButtonClicked="popoverButtonClicked"></wxc-popover>
	</div>
</template>
<script>
import API from 'Utils/api'
import Category from '../_mods/category'
import { WxcStepper , WxcPopover} from 'weex-ui';
export default {
    components: {
        Category,
        WxcStepper,
        WxcPopover
    },
  data () {
    return {
      orderId: '',
      showlogistical: true,
      childOrder: 1,
      popoverPosition: { x: 15, y: 200 },
      popoverArrowPosition: { pos: "top", x: 50 },
      btns: [
        {
          text: "物流单号",
          key: 0
        },
        {
          text: '和旋号(名片)',
          key:  1
        },
        {
          text: '发货单号',
          key:  2
        }
      ],
      status: 0,
      text: '物流单号'
    }
  },
  methods: {
    async submit () {
      const _this = this;
      var value = '';
      var orderId = API.trim(this.orderId);
      // 拦截器
        if(orderId == '') {
          this.$notice.toast({message: '不能输入空单号!'})
          return;
        }
        switch (this.status) {
          case 0:
            var childOrder = "" + this.childOrder
            if(childOrder.length == 2) {
              value += orderId + '-0' + this.childOrder
            } else if (childOrder.length == 1) {
              value += orderId + '-00' + this.childOrder
            } else {
              value += orderId + this.childOrder
            }
            break;
          case 1:
            value = orderId
            break;
          case 2:
            value = 'YJ_ORDERGROUP-' + orderId 
            break;
        
          default:
            break;
        }
        
        try {
            const userInfo =  API.get_userInfo(this)
            var par = {
                roleId: userInfo.RoleId,
                qr_code: value ,
                adminId: userInfo.adminId
            }
            _this.$storage.setSync('QR_Code', value)
            this.$notice.loading.show(`手工扫描：${value}`);
            var res = await API.YJ_SCAN(par)    
            this.$notice.loading.hide();
            if(res.DATA) {
							if(typeof res.DATA === 'string') {
								var DATA = JSON.parse(res.DATA)
							} else {
								var DATA = res.DATA
							}
							if(DATA.url) {
								_this.$notice.confirm({
									title: '扫描成功',
									message: DATA.msg ? DATA.msg : res.MESSAGE,
									okTitle: '确认',
									cancelTitle: '取消',
									okCallback() {
										_this.$router.open({
											name: DATA.url,
											type: 'PUSH',
											params: DATA
										})	
									},
									cancelCallback() {
									}
								})
							}else {
								this.$notice.toast({message: res.MESSAGE})
							}
						} else {
							this.$notice.toast({message: res.MESSAGE})
						}
        } catch (error) {
            this.$notice.loading.hide();
        }
    },
    stepperValueChange (e) {
      this.childOrder = e.value
    },
    typeClick () {
      this.$refs["wxc-popover"].wxcPopoverShow();
    },
    popoverButtonClicked (e) {
      if(e.key == 0) {
        this.showlogistical = true
      } else {
        this.showlogistical = false
      }
      this.text = this.btns[e.key].text
      this.status = e.key
      this.setNav()
    },
    setNav() {
      this.$navigator.setCenterItem({
            text: '手工输入' + this.text,                               // 展示的文字 (和图片 二选一)    
            textColor: '',                          // 文字颜色 (默认为白色)
            fontSize: '32',                         // 字号（默认32px）
            fontWeight: 'normal'                   // 是否加粗（默认不加粗）
        }, () => {

        })
    }
  },
  created () {
    this.setNav()
  }
}
</script>

<style scoped>
.login-box {
  position: relative;
  width: 750px;
  height: 684px;
  background-color: rgba(255,255,255,0.8);
  text-align: center;
}
.image {
  display: block;
  margin-left: 185px;
  margin-top: 65px;
  margin-bottom: 86px;
  width:220px; 
  height:78px; 
  
}
.my-icon-input {
  flex-direction: row;
  width:750px; 
  height: 78px;
  margin-top: 50px;
  margin-bottom: 20px;
}
.user-icon {
  position: absolute;
  width: 44px;
  height: 44px;
  left: 40px;
  top: 20px;
}
.my-input {
  width:300px; 
  height:74px; 
  margin-right: 10px;
  font-size: 24px;
  align-items: center;
  line-height: 74px;
  font-size: 36px; 
  color: #2e2e2e ;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #2096f2;
  padding-left: 50px;
}
.my-input-two {
  width:500px; 
  height:74px; 
  margin-right: 10px;
  font-size: 24px;
  align-items: center;
  line-height: 74px;
  font-size: 36px; 
  color: #2e2e2e ;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #2096f2;
  padding-left: 50px;
}
.logStyle {
  height: 74px;
  line-height: 74px;
}
.two {
  width: 150px;
  /* margin-left: 10px; */
}
.login-btn {
  width: 574px;
  height: 158px;
  margin-top: 30px;
  justify-content: center;
  /* align-items: center; */
  margin-left: 104px;
}
.title-bg1 {
  width: 750px;
  height: 1334px;
  position:absolute;
}
.search-bar-left {
		width: 200px;
		height: 84px;
		padding-top: 25px;
		align-content: center;
		justify-content: center;
		flex-direction: row;
		color: #666666;
	}
	.search-bar-left-text {
		color: #666666;
	}
	.search-bar-left-icon {
		margin-top: 5px;
		margin-left: 5px;
		width:20px;
		height:20px;
	}
</style>
