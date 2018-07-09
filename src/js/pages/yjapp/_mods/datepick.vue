<template>
    <div>
        <div class="search-date">
            <div class="search-date-text" @click="selectTime('startDate')">
                <text class="text-left" >开始时间: </text>
                <text class="text-right">{{searchDate['@beginDate']}}</text>
            </div>
            <div class="search-date-text" @click="selectTime('endDate')">
                <text class="text-left" >结束时间: </text>
                <text class="text-right">{{searchDate['@endDate']}}</text>
            </div>
        </div>
        <bmmask class="mask" animation="transition" position="bottom" :duration="300" ref="startDate">
            <bmpop class="modal-top">
                <bmcalendar class="calendar" ref="calendar" @finish="startDateFinish"></bmcalendar>
            </bmpop>
        </bmmask>

        <bmmask class="mask" animation="transition" position="bottom" :duration="300" ref="endDate">
            <bmpop class="modal-top">
                <bmcalendar class="calendar" ref="calendar" @finish="endDateFinish"></bmcalendar>
            </bmpop>
        </bmmask>
    </div>
</template>

<script>
import API from "Utils/api";
export default {
  data() {
    return {
      searchDate: {
        "@beginDate": '',
        "@endDate": ''
      }
    };
  },
  mounted() {
  },
  methods: {
    selectTime(timeName) {
      this.$refs[timeName].show();
    },
    startDateFinish(params) {
      this.searchDate["@beginDate"] = params.startDate;
      this.$emit("startDateFinish", params.startDate);
      if(this.searchDate['@endDate'] === ''){
        this.searchDate['@endDate'] = params.endDate;
        this.$emit("startDateFinish", params.startDate);
      }
      this.$refs['startDate'].hide();
    },
    endDateFinish(params) {
      this.searchDate["@endDate"] = params.endDate;
      this.$emit("endDateFinish", params.endDate);
      console.log(this.searchDate["@endDate"] , this.searchDate["@beginDate"])
      if(this.searchDate['@beginDate'] === ''){
        this.searchDate['@beginDate'] = params.endDate;
        this.$emit("startDateFinish", params.startDate);
      }
      this.$refs['endDate'].hide();
    }
  }
};
</script>
<style scoped>
.search-date {
  flex-direction: row;
  justify-content: center;
  height: 100px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-style: solid;
  border-top-color: #eee;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #eee;
}
.search-date-text {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 375px;
  height: 100px;
  line-height: 100px;
  color: #000;
}
.text-left {
    color: #282828;
    font-size: 28px;
}
.text-right {
  width: 180px;
  height: 50px;
  padding-left: 20px;
  line-height: 50px;
  background-color: #f2f2f2;
  color: #7c7c7c;
  lines: 1;
  text-overflow: hidden;
  font-size: 28px;
}
.mask {
  position: fixed;
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
</style>

