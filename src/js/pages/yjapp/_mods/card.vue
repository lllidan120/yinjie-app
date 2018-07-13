<template>
    <div class="card" @click="onClick">
        <div class="card-left">
            <text class="card-left-title">{{title}}</text>
            <text class="card-left-text">{{text}}</text>
        </div>
        <div class="card-right">
            <image :src="image"
                   class="card-right-image"></image>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: String,
        text: String,
        image: String
    },
    methods: {
      onClick () {
         this.$emit("onClick");
      }
    }
};
</script>
<style>
.card {
  width: 350px;
  height: 200px;
  /* background-color: red; */
  border-radius: 5px;
  display: flex;
  flex-direction: row;
}
.card-left {
  padding-top: 50px;
  padding-left: 10px;
  width: 200px;
}
.card-left-title {
  color: #5B5B5B;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}
.card-left-text {
  color: #707070;
  font-size: 28px;
  font-weight: normal;
}
.card-right {
  width: 150px;
}
.card-right-image {
  width: 100px;
  height: 100px;
  margin-left: 25px;
  margin-top: 50px;
}
</style>

