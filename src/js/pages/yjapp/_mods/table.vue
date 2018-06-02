<template>
    <div>
        <div class="table-cell" v-for="(item , key) in tableHead" :key="key">
            <div class="table-td table-head"><text class="table-text">{{item.title}}</text></div>
        </div>
        <list class="bui-list" ref="list" :show-scrollbar="true" :showRefresh="true" @refresh="onRefresh"   loadmoreoffset="2">
            <cell class="table-cell" v-for="(item , key) in tableBody" :key="key" @click="onClick(item)">
                <div class="table-td"><text class="table-text">{{item.text}}</text></div>
            </cell>
            <loading class="loading" @loading="loading" :display="showload ? 'show' : 'hide'">
              <text class="indicator-text">加载更多 ...</text>
              <loading-indicator class="indicator"></loading-indicator>
            </loading>
        </list>
    </div>
</template>

<script>
export default {
    data () {
        return {
            showload: false
        }
    },
    props: {
        tableHead: [Array],
        tableBody: [Array]
    },
    methods: {
        loading() {
            // 加载更多
            this.$emit('onLoad' )
        },
        onClick(item) {
            this.$emit('onClick' , item )
        }
    }
    
}
</script>

<style>
.table {
    width: 750px;
    min-height:750px;
}
.table-cell {
    position:relative;
    width: 750px;
    flex-direction: row;
}
.table-td {
    display:block;
    float: left;
    width: 150px;
    height: 75px;
    line-height: 75px;
    align-items: center;
    justify-content: center;
    border-width: 2px;
    border-color: #2096f2;
    border-style: solid;
    background-color: #fff;
}
.table-text {
    font-size: 26px;
}
.table-head {
    background-color: #e9eaec;
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

