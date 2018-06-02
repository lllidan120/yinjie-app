<template>
  <div>
      <weex-amap class="map" id="map2017" :center="pos" ></weex-amap>
      <button @click="getGeo" style="width:750px;height:200px;background-color:red;">按钮</button>
 </div>
</template>

<script>
  var amap = weex.requireModule('amap')
  export default {
    data () {
        return {
            pos:[23.059684, 113.168702]
        }
    },
    mounted () {
        
      this.getGeo()  
    },
    methods: {
      getGeo () {
          var _this = this;
            amap.initAmap('349219d285861a2745a23276039a0ddb')
            this.$geo.get().then(data => {
                _this.pos[0] = data.locationLat
                _this.pos[1] = data.locationLng
            }, error => {
                _this.$notice.toast({
                    message: '获取地址失败'
                })
            })
      },
      setUserLocation() {
        const self = this;
        amap.getUserLocation(this.$el('map2017').ref, function (data) {
          if(data.result == 'success') {
            self.pos = data.data.position;
          }
        });  
    }
  }
};
 


</script>

<style>
    .map {
        width: 750px;
        height: 750px;
    }
</style>