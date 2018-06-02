<template>
  <div class="wxc-title" :aria-hidden="true">
    <image class="logo" src="http://yj.kiy.cn/Content/Images/App/assets/yj.png"></image>
    <text class="text">{{title}}</text>
  </div>
</template>

<style scoped>
  .wxc-title {
    background-color: #ffffff;
    padding: 25px;
    flex-direction: row;
    align-items: center;
  }
  .logo {
    width: 67px;
    height: 67px;
  }
  .text {
    font-size: 40px;
    font-weight: 600;
    margin-left: 20px;
    color: #1da1f2;
  }
</style>

<script>
  export default {
    props: {
      title: String
    }
  }
</script>