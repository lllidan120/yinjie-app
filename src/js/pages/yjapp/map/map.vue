<template>
    <div class="container">
        <weex-amap class="map"
                   id="map2017"
                   :scale="true"
                   :geolocation="true"
                   :center="pos"
                   :compass="true"
                   :zoomEnable="true"
                   :showMyLocation="true"
                   zoomPosition="center"
                   gestures="zoom"
                   :myLocationEnabled="true"
                   :indoorswitch="true"
                   :zoom="zoom">
            <weex-amap-marker :position="point.position"
                              :title="point.title"></weex-amap-marker>
        </weex-amap>
    </div>
</template>

<script>
var amap = weex.requireModule("amap");
export default {
  data() {
    return {
      pos: [],
      point: {
        position: [],
        title: "this is a marker"
      },
      zoom: 16
    };
  },
  mounted() {},
  methods: {
    getGeo() {
      var _this = this;
      _this.$notice.loading.show("正在获取地址");
      amap.initAmap("349219d285861a2745a23276039a0ddb");
      this.$geo.get().then(
        data => {
          _this.pos[0] = data.locationLat;
          _this.pos[1] = data.locationLng;
          _this.point.position[0] = data.locationLat;
          _this.point.position[1] = data.locationLng;
          _this.$notice.loading.hide();
        },
        error => {
          _this.$notice.loading.hide();

          _this.$notice.toast({
            message: "获取地址失败"
          });
        }
      );
    },
    setUserLocation() {
      const self = this;
      amap.getUserLocation(this.$el("map2017").ref, function(data) {
        if (data.result == "success") {
          self.pos = data.data.position;
        }
      });
    }
  },
  created() {
    this.getGeo();
  }
};
</script>

<style>
.container {
  position: relative;
  height: 1334px;
  width: 750px;
}
.map {
  width: 750px;
  height: 1200px;
  background-color: #000;
}
</style>