<template>
	<div>
		<div class="search-bar">
			<div class="search-bar-left" slot="left"  @click="typeClick(1)">
				<div>
					<text class="search-bar-left-text">{{ searchType }}</text>
				</div>
				<image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="search-bar-left-icon"></image>
			</div>
            <div class="search-bar-left" slot="left"  @click="typeClick(2)">
				<div>
					<text class="search-bar-left-text">{{ searchTypeTwo }}</text>
				</div>
				<image src="http://yj.kiy.cn/Content/Images/App/assets/la.png" class="search-bar-left-icon"></image>
			</div>

			<div class="wxc-search-bar" slot="middle">
				<input 
				class="search-bar-input" 
				v-model="value" 
				return-key-type="search" 
				:placeholder="placeholder" 
				@input="inputChange"
				@change="searchClick"
				/>
			</div>

			<div class="search-bar-right" slot="right" @click="searchClick">
				<text class="search-bar-right-btn" >搜索</text>
			</div>
		</div>
	</div>
</template>

<script>
	import API from 'Utils/api'
	
	export default {
		components: {   },
		props: {
            searchType: String,
            searchTypeTwo: String,
            placeholder: {
                type: String,
                defalut: '请输入单号'
            },
            showScanBtn : {
                type: Boolean,
                defalut: false
            }
		},
		data: () => ({
			value: '',
			index: 0,
		}),
		created () {
			
        },
        mounted () {
            if(this.showScanBtn) {
                this.$navigator.setRightItem({
					text: '扫一扫查单',
					fontSize:'26',
                image: 'http://yj.kiy.cn/Content/Images/App/assets/scan.png'
                }, () => {
                    this.scanClick()
                })
            }
        },
		methods : {
			typeClick (type) {
				this.$emit('onChange' , type)
			},
			inputChange (val) {
				this.$emit('inputChange' , this.value)
			},
			scanClick() {
				this.$tools.scan().then((resData) => {
					var data = resData.split('-')[0]
					this.value = data
					this.$emit('scanClick' , data)
				}).catch (ex => {
					console.log(ex)
				}) 
			},
			searchClick (e) {
				if(e.value === '' || e.value != undefined) {
					this.$emit('searchClick' , e.value)
				} else if(this.value.length === 1) {
					this.$emit('searchClick' , undefined)
				} else {
					this.$emit('searchClick' , this.value)
				}
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
		width: 241px;
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
		color: #000;
		background-color: #E5E5E5;
		border-radius: 6px;
	}

</style>

