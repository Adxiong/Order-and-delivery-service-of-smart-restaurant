// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    shopinfo:{}
  },
  scancode:function(){

    wx.scanCode({
      onlyFromCamera: true,
      success:(res)=>{
        console.log(res)
        wx.showToast({
          title: '扫描成功',
          icon:"success",
          duration:2000
        })
        wx.navigateTo({
          url: res.path
        })
      },
      fail:res=>{
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  touchorder:function(){
    wx.navigateTo({
      url: '/pages/goods/good?no=0',
    })
  },

  getShopInfo:function(){
    wx.request({
      url: app.globalData.api+ '/shopinfo',
      success:res=>{
        res.data.data.start_time = this.time(new Date(res.data.data.start_time))
        res.data.data.end_time = this.time(new Date(res.data.data.end_time))
        this.setData({
          shopinfo : res.data.data
        })
      }
    })
  },
  time:function(date) {
    var h = date.getHours()
    h = h < 10 ? '0' + h : h
    var minute = date.getMinutes()
    minute = minute < 10 ? '0' + minute : minute
    var second = date.getSeconds()
    second = second < 10 ? '0' + second : second
    return h + ':' + minute + ':' + second
},
  onLoad() {
    this.getShopInfo()
  },
})
