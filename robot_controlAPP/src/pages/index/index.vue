<template>
	<view class="content">
		<div class="control">
			<view class="toolModel top">
				<img src="@/static/jiushui1.png" alt="" @click="naviationTo('wine')">
				<img src="@/static/chufang1.png" @click="naviationTo('kitchen')" >
			</view>
			<view class="toolModel">
				<img src="@/static/songcan1.png" @click="naviationTo('sendFood')"></img>
			</view>
			<view class="toolModel">
				<img src="@/static/chongdian1.png"  @click="naviationTo('charge')"></img>
			</view>
		</div>
		<uni-drawer :visible="true">
			<view style="padding:30rpx;">
				saf
			</view>
		</uni-drawer>
	</view>
		
</template>

<script>
	// import {uniDr} from '@dcloudio/uni-ui';
	export default {
		data() {
			return {
				title: 'Hello'
			} 
		},
		onLoad() {

		},
		components:{
			// uni-drawer       
		},
		methods: {
			naviationTo(param){
				uni.navigateTo({
					animationType:'zoom-fade-out',
					animationDuration:200,
					url:'../'+param+'/index'
				})
			}
		}
	}
</script>

<style>
	uni-page-body{
		height: 100%;
	}
	.content {
		width: 100%;
		overflow-y: scroll;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.control{
		width: 90%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-content: center;
	}
	.toolModel{
		width: 100%;
		height: 30%;
		margin: 10rpx 0;
	}
	view.toolModel.top{
		display: flex;
		justify-content: space-between;
	}
	view.toolModel.top img{
		width: 45%;
		height: 100%;
	}
	img{
		width: 100%;
		height: 100%;
		border: 1px solid red;
	}
</style>
