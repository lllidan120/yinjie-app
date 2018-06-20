<template>
	<div>
		<div class="search-bar">
			<div class="search-bar-left" slot="left"  @click="changeType">
				<div>
					<text class="search-bar-left-text">{{ type }}</text>
				</div>
				<image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="search-bar-left-icon"></image>
			</div>

			<div class="wxc-search-bar" slot="middle">
				<input class="search-bar-input" v-model="value" return-key-type="search" placeholder="请输入单号或会员号" @input="inputChange" @change="searchClick"/>
			</div>

			<div class="search-bar-right" slot="right" @click="searchClick">
				<text class="search-bar-right-btn" >搜索</text>
			</div>
		</div>
		<!-- <div class="search-bar-tow">
			<div class="search-bar-left" @click="changeType(1)">
				<div>
					<text class="search-bar-left-text">{{ type }}</text>
				</div>
				<image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="search-bar-left-icon"></image>
			</div>
			<div class="search-bar-left" @click="changeProper(2)">
				<div>
					<text class="search-bar-left-text">{{ proper }}</text>
				</div>
				<image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="search-bar-left-icon"></image>
			</div>
		</div> -->
	</div>
</template>

<script>
	import API from 'Utils/api'
	const modal = weex.requireModule('modal');
	const picker = weex.requireModule('picker');
	
	
	
	export default {
		components: {   },
		props: {

		},
		data: () => ({
			value: '',
			index: 0,
			typeGroupIndex : 0,
			properGroupIndex: 0,
			date: '今天',
			type: '订单号',
			proper: '最新',

		}),
		created () {
			this.$navigator.setRightItem({
				image: 'http://yj.kiy.cn/Content/Images/App/assets/scan.png'
			}, () => {
				this.scanClick()
			})
		},
		methods : {
			typeClick () {
				var items = ['今天' , '一周内' , '一月内' , '其他'];
				picker.pick({
					index: this.index,
					items
				}, event => {
					if (event.result === 'success') {
						this.date = items[event.data]
						this.index = event.data
						if(items[event.data] == '其他') {
							this.$emit('onChange' , '其他')
						} else {
							var date = API.get_date(this.date , true)
							this.$emit('onChange' , date)
						}

					}
				})
			},
			changeType () {
				var items = [ '订单号' , '会员号'];
				picker.pick({
					index: this.typeGroupIndex,
					items
				}, event => {
					if (event.result === 'success') {
						this.type = items[event.data]
						this.typeGroupIndex = event.data
						this.$emit('changeType' , this.type)

					}
				})
			},
			changeProper () {
				var items = ['最新' , '最旧'];
				picker.pick({
					index: this.properGroupIndex,
					items
				}, event => {
					if (event.result === 'success') {
						this.proper = items[event.data]
						this.properGroupIndex = event.data
						this.$emit('changeProper' , this.proper)
					}
				})
			},
			inputChange () {
				this.$emit('inputChange' , this.value)
			},
			scanClick() {
				this.$tools.scan().then((resData) => {
					this.$emit('scanClick' , resData)
				}).catch (ex => {
					console.log(ex)
				}) 
			},
			searchClick () {
				this.$emit('searchClick' , this.value)
			}

			

		}
	}

</script>

<style scoped>
	.search-bar {
		height: 100px;
		flex-direction: row;
		background-color: #fff;
	}
	.search-bar-tow {
		height: 100px;
		flex-direction: row;
		background-color: #fff;

		border-top-width: 1px;
		border-top-style: solid;
		border-top-color: #eee;
		overflow: hidden;
	}
	.search-bar-left {
		width: 182px;
		height: 84px;
		padding-top: 35px;
		background-color: #fff;
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
	.search-bar-right {
		width: 145px;
		height: 100px;
		align-items: center;
		justify-content: center;
	}
	.search-bar-right-btn {
		width: 100px;
		height: 60px;
		line-height: 60px;
		font-size: 26px;
		background-color: #2096f2;
		color: #fff;
		border-radius: 4px;
		text-align: center;
	}
	.wxc-search-bar {
		margin-top: 10px;
		background-color: #ffffff;
		width: 423px;
		height: 100px;
		flex-direction: row;
	}
	.search-bar-input {
		position: absolute;
		top: 10px;
		padding-top: 0;
		padding-bottom: 0;
		padding-right: 40px;
		padding-left: 40px;
		font-size: 26px;
		width: 423px;
		height: 60px;
		line-height: 64px;
		background-color: #E5E5E5;
		border-radius: 6px;
	}

</style>

