<template>
  <div id="home">
    <div class="side">
      <div class="logo">
        订单管理中心
      </div>

      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
        >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>前台管理</span>
          </template>
          <el-menu-item-group title="小程序管理">
            <el-menu-item index="/home/pageinfo">信息编辑</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <template slot="title">管理与操作</template>
            <el-menu-item index="/home/menuadminoption">菜品增删</el-menu-item>
            <el-menu-item index="/home/menutypeoption">菜品类别</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="/home/dataanalysis">
          <i class="el-icon-menu"></i>
          <span slot="title">数据分析</span>
        </el-menu-item>
        <el-menu-item index="/home/orderadmin">
          <i class="el-icon-document"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
        <el-menu-item index="/home/tableadmin">
          <i class="el-icon-setting"></i>
          <span slot="title">餐桌二维码</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="header">
      <div class="date-cont1 left">
        <span class="time">{{time}}</span>
        <p class="date">{{date}}</p>
      </div>
      <div class="dropdown right head-dropdown">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar> {{userinfo.nickname}} </el-avatar>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus">黄金糕</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus">狮子头</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus-outline">螺蛳粉</el-dropdown-item>
            <el-dropdown-item icon="el-icon-check">双皮奶</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-check">蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="box-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data () {
    var timeInterval=""; // eslint-disable-line no-unused-vars
    return {
      userinfo:{},
      time:"",
      date:""  
    }
  },
  components: {

  },
  created(){
    this.getTime()
    this.getUserInfo()
  },
  beforeDestroy(){
    clearInterval(this.timeInterval)
  },
  methods: {
    getUserInfo(){
      if(window.localStorage.getItem("userInfo")){
        this.$global.userInfo = JSON.parse(window.localStorage.getItem("userInfo")).userinfo
        this.userinfo = this.$global.userInfo
      }else{
        this.$router.push("/")
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getTime(){
      this.timeInterval = setInterval(()=>{
        var date = new Date()
        //获取时间
        var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours() //小于10 前面补零
        var min = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
        var sec = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()
        this.time = hour + ":" + min + ":" + sec
        //获取日期
        var year = date.getFullYear()
        var month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : date.getMonth()
        var day = date.getDate() < 10 ? "0" + (date.getDate() + 1) : date.getDate()
        this.date = year + "-" + month + "-" + day
      },1000)
    }
  }
};
</script>


<style lang="scss" scope>
  #home{
    width: 100%;
    height: 100%;
    .side{
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      background: #4d5b69;
      width: 200px;
      .logo{
        background: #14b9d6;
        color: #fff;
        font-size: 24px;
        text-align: center;
        line-height: 60px;
      }
    }
    .header{
      position: fixed;
      left: 200px;
      top: 0;
      background: #fff;
      z-index: 2;
      right: 0;
      padding: 0 20px;
      box-shadow: 0 1px 6px 2px rgb(0 0 0 / 20%);
      .date-cont1 {
        height: 50px;
        padding-top: 10px;
        user-select: none;
        cursor: pointer;
        .time {
          font-size: 26px;
          color: #595959;
          line-height: 26px;
        }
        .date-cont1 .date {
          color: #666;
          padding-top: 6px;
        }
        p{
          margin-block-start: 0em;
          margin-block-end: 0em;
        }
      }
      .left {
        float: left;
        display: inline;
      }
      .right {
        float: right;
        display: inline;
      }
      .dropdown {
        position: relative;
        .el-dropdown-link{
          display: block;
          margin-top: 10px;
        }
      }
    }
    .box-content{
      position: fixed;
      left: 200px;
      top: 60px;
      right: 0;
      bottom: 0;
      padding: 10px;
      box-sizing: border-box;
      overflow-y: scroll;
    }
  }
</style>