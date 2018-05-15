<template recyclable>
  <div class="container" >
    <div class="border">
      <div ref="box" class="box" @touchstart="ontouchstart">
        <div class="head">
          <div class="avatar"></div>
          <text class="username">HACKER</text>
        </div>
        <div class="content">
          <text class="desc">Google announced a new version of Nearby Connections for fully offline.high bandwidth peer to peer device communications.</text>
        </div>
        <div class="footer">
          <text class="action">SHARE</text>
          <text class="action" style="color:#1da1f2">EXPLORE</text>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    flex: 1;
    background-color:#eeeeee;
    
  }
  .border{
    height:700px;
    padding-left:35px;
    padding-right:35px;
    padding-top:100px;
  }
  .box {
    width: 680px;
    height: 450px;
    background-color:#1da1f2;
  }
  .head {
    background-color:#1da1f2;
    width:680px;
    height:120px;
    flex-direction:row;
    align-items:center;
  }
  .content{
    width:680px;
    height:240px;
    background-color:#1da1f2;
    padding-left:24px;
    padding-top:24px;
    padding-right:24px;
  }
  .footer {
    width:680px;
    height:90px;
    background-color: #ffffff;
    align-items:center;
    justify-content:flex-end;
    padding-right:25px;
    flex-direction:row;
  }
  .action {
    font-size:35;
    padding-right:20px;
  }
  
  .desc {
    font-size:32;
    color:#ffffff;
    padding-left:24px;
  }
  
  
  .avatar {
    width:96px;
    height:96px;
    border-radius:48px;
    background-color:#CDDC39;
    margin-left:36px;
    margin-right:48px;
  }
  
  .username {
    color:#ffffff;
    font-size:32;
  }
  
</style>

<script>
  export default {
    created() {
    	
    },
    data () {
      return {

      }
    },
    methods: {
      }
  }
</script>