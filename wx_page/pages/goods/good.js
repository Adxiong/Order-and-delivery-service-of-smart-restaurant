// pages/goods/good.js
const App =getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index:"",
    showChoicetableno:Boolean,
    tableNo:0,
    toView:"b0",
    navActive:0,
    height:0,
    heightArr:[],
    styleHeightArr:[],
    shopcar:{
      num:0,
      price:0
    },
    menuinfo:[],
    typeinfo:[],
    tables:['1号桌','2号桌','3号桌','4号桌','5号桌','6号桌','7号桌','8号桌']
  },
  clickNav:function(e){
    var index = e.target.dataset.index;
    var id = 'b' + this.computerAddress(this.data.typeinfo[index].id , this.data.menuinfo);
    this.setData({
      toView:id,
      navActive:index
    })
  },
  computerAddress:function(target , list){
    var index = 0 ;
    for ( let i = 0 ; i < list.length ; i++)
    {
      if(list[i].type != target)
      {
        index++
      }else{
        break;
      }
    }
    return index
  },
  computerNum:function(target , list){
    var arr = list.filter(res=>res.type == target)
    return arr.length
  },
  setHeightArr:function(){
    var height = 0;
    var heightArr = [];
    for(var i = 0 ; i < this.data.typeinfo.length ; i++){
      var h=0;
      if(this.computerNum(this.data.typeinfo[i].id , this.data.menuinfo))
      {
        height = height + 50*this.computerNum(this.data.typeinfo[i].id , this.data.menuinfo);
        heightArr.push(height);
      }else{
        height = 375+height;
        heightArr.push(height)
      }
    }
    this.setData({
      heightArr:heightArr,
    })
  },
  scroll:function(e){
    var scrollTop = e.detail.scrollTop;
    var scrollArr = this.data.heightArr;
    var that = this;
    if(scrollTop > scrollArr[scrollArr.length - 1] - this.data.height){
      // console.log("最后一页")
      that.setData({
        navActive:scrollArr.length - 1
      })
      return;
    }else{
      for(var i = 0 ; i < scrollArr.length ; i++){
        if(scrollTop >= 0 && scrollTop < scrollArr[0]){
          // console.log("第一页")
          that.setData({
            navActive:0
          })
        }else if(scrollTop >= scrollArr[i - 1] && scrollTop <= scrollArr[i]){
          // console.log("第"+i+"页")
          // e.detail.scrollTop=scrollArr[i]
          that.setData({
            navActive:i
          })
        }
      }
    }
  },
  setHeight:function(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height:res.windowHeight-220
        })
      },
    })
  },
  shopcar:function(num , price){
    this.data.shopcar.num += num ;
    this.data.shopcar.price += price;
    this.setData({
      shopcar:this.data.shopcar
    })
  },
  sub:function(e){
    var index = e.target.dataset['index']    
    if(this.data.menuinfo[index].num>0){
      this.data.menuinfo[index].num--
      this.shopcar(-1,-this.data.menuinfo[index].price)
      this.setData({
        menuinfo:this.data.menuinfo
      })
    }
  },
  add:function(e){
    var index = e.target.dataset['index']    
    this.data.menuinfo[index].num++
    this.shopcar(1,this.data.menuinfo[index].price)
    this.setData({
      menuinfo:this.data.menuinfo
    })
  },
  isSure:function(){
    console.log("OK");
    var order = {
      data : [],
      tableno : this.data.tableNo,
      status:0,
      total:this.data.shopcar.price
    }
    order.data.push(...this.data.menuinfo.filter((item)=>item.num>0))

    wx.request({
      url: App.globalData.api+'/addorder',
      method:'post',
      data:order,
      success:res=>{
        wx.switchTab({
          url: '/pages/index/index',
        })
        wx.showToast({
          title: '下单完成！',
          icon: 'success',
          duration: 3000
        })
        
      },
      fail:res=>{
        wx.showToast({
          title: '下单失败！',
          icon: 'success',
          duration: 3000
        })
      }
    })
  },
  getMenuInfo:function(){
    wx.request({
      url: App.globalData.api + '/menuopt',
      method:"get",
      success:res=>{
        this.setData({
          menuinfo:res.data.data
        })
      }
    })
  },
  getTypeInfo:function(){
    wx.request({
      url: App.globalData.api + '/typeopt',
      method:"get",
      success:res=>{
        this.setData({
          typeinfo:res.data.data
        })
        this.setHeightArr()
      }
    })
  },
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value,
      tableNo:parseInt(e.detail.value)+1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.no==0){
      this.setData({
        showChoicetableno : true
      })
      wx.setNavigationBarTitle({
        title: '暂未指定餐桌',
      })
    }else{
      this.setData({
        tableNo : options.no,
        showChoicetableno : false
      })    
      wx.setNavigationBarTitle({
        title: options.no +'号座点餐',
      })
    }
    
    this.getMenuInfo()
    this.getTypeInfo()
    this.setHeight()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})