<template>
  <div class="page">
    <div class="page-content">
      <div class="row title">
        <text class="col-1"></text>
        <text class="col-2">签到时间</text>
        <text class="col-3">公里数</text>
        <text class="col-4">审核状态</text>
      </div>
      <list  ref="list" loadmoreoffset="10" :showRefresh="true" @refresh="onrefresh">
        <cell v-for="(item,index) in listData"  :key="index">
          <div class="row">
            <text class="col-1 text-color">{{item.rowNum}}</text>
            <text class="col-2 text-color">{{item.startTime}}</text>
            <text class="col-3 text-color">{{item.kilometres}}</text>
            <text class="col-4 text-color">{{item.AuditingState}}</text>
          </div>
        </cell>
        <loading class="loading" @loading="getData" :display="showload ? 'show' : 'hide'">
          <text class="indicator-text">加载更多 ...</text>
          <loading-indicator class="indicator"></loading-indicator>
        </loading>
      </list>
    </div>
  </div>
</template>
<script>
import API from "Utils/api";

export default {
  data() {
    return {
      param: {
        "@rowIndex": 0,
        "@pageSize": 20
      },
      listData: [],
      showload: false,
      refresh: false
    };
  },
  computed: {
    userInfo() {
      var userInfo = API.get_userInfo(this);

      return userInfo;
    }
  },
  mounted() {
    this.getData();
    this.$navigator.setCenterItem(
      {
        text: `${this.userInfo.RealName}的签到记录`,
        textColor: "",
        fontSize: "32",
        fontWeight: "normal"
      },
      () => {}
    );
  }, 
  methods: {
    async getData(loadmore) {
      this.param["@rowIndex"]++;
      if(this.userInfo.RoleId === 1 || this.userInfo.RoleId === 4) {

      } else {
        this.param = Object.assign(this.param, {
          "@myName": this.userInfo.RealName
        });
      }

      try {
        if(this.refresh) {

        } else {
          this.showload = true;
        }
        const RES = await API.YJ_GETDRIVINGRECORD(this.param);
        const RESDATA = JSON.parse(RES.DATA);
        const DGDATA = JSON.parse(RESDATA.dgData);
        DGDATA.map(item => {
          this.listData.push(item);
        });

        if (this.refresh) {
          this.$refs["list"].refreshEnd();
          this.refresh = false;
        } else {
          this.showload = false;
        }
      } catch (error) {}
    },
    onrefresh() {
      this.param["@rowIndex"] = 0;
      this.refresh = true;
      this.listData = [];
      this.getData();
    }
  }
};
</script>
<style scoped>
.page {
  width: 750px;
  padding: 25px;
}
.title {
  background-color: #b0d1eb;
}
.page-content {
  width: 700px;
}
.row {
  flex-direction: row;
  justify-items: center;
  align-items: center;
  width: 700px;
  height: 80px;
  background-color: #fff;
}
.col-1 {
  width: 80px;
  text-align: center;
}
.col-2 {
  width: 285px;
}
.col-3 {
  width: 165px;
  text-align: center;
}
.col-4 {
  width: 170px;
  text-align: center;
}
.text {
  font-size: 30px;
}
.text-color {
  color: #333333;
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
