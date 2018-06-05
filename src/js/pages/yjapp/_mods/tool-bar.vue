<template>
  <div class="container" >
    <div ref="b1" class="tool-btn" style="background-color:#6A1B9A" @click="clickBtn">
        <text class="text">A</text>
    </div>
    <div ref="b2" class="tool-btn" style="background-color:#0277BD" @click="clickBtn">
        <text class="text">B</text>
    </div>
    <div ref="b3" class="tool-btn" style="background-color:#FF9800" @click="clickBtn">
        <text class="text">C</text>
    </div>

    <div ref="main_btn" class="tool-btn" @click="clickBtn">
        <image class="tool-image" ref="main_image" src="https://gw.alicdn.com/tfs/TB1PZ25antYBeNjy1XdXXXXyVXa-128-128.png" />
    </div>
  </div>
</template>



<script>
  export default {
    data () {
      return {
        isExpanded: false
      }
    },
    methods: {
        collapse: function() {
            let main_btn = this.$refs.main_btn.ref
            let main_image = this.$refs.main_image.ref
            let b1 = this.$refs.b1.ref
            let b2 = this.$refs.b2.ref
            let b3 = this.$refs.b3.ref
            let result1 = this.$bindingx.bind({
                eventType: 'timing',
                exitExpression: {
                origin: 't>800'
                },
                props: [{
                    element: main_image,
                    property: 'transform.rotateZ',
                    expression: {
                    origin: 'easeOutQuint(t,45,0-45,800)'
                    }
                },
                {
                    element: main_btn,
                    property: 'background-color',
                    expression: {
                    origin: "evaluateColor('#607D8B','#ff0000',min(t,800)/800)"
                    }
                }
                ]

            });

            let result2 = this.$bindingx.bind({
                eventType: 'timing',
                exitExpression: {
                origin: 't>800'
                },
                props: [{
                    element: b1,
                    property: 'transform.translateY',
                    expression: {
                    origin: "easeOutQuint(t,-150,150,800)"
                    }
                },
                {
                    element: b2,
                    property: 'transform.translateY',
                    expression: {
                    origin: "t<=100?0:easeOutQuint(t-100,-300,300,700)"
                    }
                },
                {
                    element: b3,
                    property: 'transform.translateY',
                    expression: {
                    origin: "t<=200?0:easeOutQuint(t-200,-450,450,600)"
                    }
                }
                ]
            })
        },
        expand: function() {
            let main_btn = this.$refs.main_btn.ref
            let main_image = this.$refs.main_image.ref
            let b1 = this.$refs.b1.ref
            let b2 = this.$refs.b2.ref
            let b3 = this.$refs.b3.ref
            let result1 = this.$bindingx.bind({
                eventType: 'timing',
                exitExpression: {
                origin: 't>100'
                },
                props: [{
                    element: main_image,
                    property: 'transform.rotateZ',
                    expression: {
                    origin: 'linear(t,0,45,100)'
                    }
                },
                {
                    element: main_btn,
                    property: 'background-color',
                    expression: {
                    origin: "evaluateColor('#ff0000','#607D8B',min(t,100)/100)"
                    }
                }
                ]
            });

            let result2 = this.$bindingx.bind({
                eventType: 'timing',
                exitExpression: {
                origin: 't>800'
                },
                props: [{
                    element: b1,
                    property: 'transform.translateY',
                    expression: {
                    origin: "easeOutBounce(t,0,0-150,800)"
                    }
                },
                {
                    element: b2,
                    property: 'transform.translateY',
                    expression: {
                    origin: "t<=100?0:easeOutBounce(t-100,0,0-300,700)"
                    }
                },
                {
                    element: b3,
                    property: 'transform.translateY',
                    expression: {
                    origin: "t<=200?0:easeOutBounce(t-200,0,0-450,600)"
                    }
                }
                ]
            })
        },
        clickBtn: function(e) {
            if (this.isExpanded) {
                this.collapse();
            } else {
                this.expand();
            }
            this.isExpanded = !this.isExpanded;
        }
    }
  }
</script>
<style scoped>
.tool-image {
  width: 60;
  height: 60;
}

.tool-text {
  color: #ffffff;
  font-size: 30;
}

.tool-btn {
  width: 100;
  height: 100;
  background-color: #ff0000;
  align-items: center;
  justify-content: center;
  position: absolute;
  border-radius: 50;
  bottom: 25;
  right: 25;
  margin-left: 315;
}
</style>