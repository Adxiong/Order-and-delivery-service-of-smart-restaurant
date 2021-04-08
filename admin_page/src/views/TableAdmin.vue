<template>
<div id="tableadmin">
  <div class="top">  餐桌数量
   <el-input-number v-model="num" :min="0" :max="20" label="描述文字"></el-input-number>
   <el-button type="primary" @click="updateTableInfo">修改</el-button>
  </div>

  <div class="code">
    <el-card class="box-card" v-for="(item) in tableinfo" :key="item.no">
      <div slot="header" class="clearfix">
        <span>{{item.no}} 号桌</span>
        <a :href="getPicAddr(item.adr)" :download="item.no + '号桌'" style="float: right; padding: 3px 0; text-decoration:none" class="el-button--text el-button">下载二维码</a>
      </div>
      <el-image :src="getPicAddr(item.adr)">
        <div slot="error" class="image-slot">
          <i class="el-icon-picture-outline"></i>
        </div>
      </el-image>
    </el-card>
  </div>
</div>
</template>

<script>
  import service from "@/service";
  import { Message } from "element-ui";
  export default {
    data() {
      return {
        num: 1,
        tableinfo:[]
      };
    },
    mounted(){
      this.getTableInfo()
    },
    methods: {
      getPicAddr(add){
        return 'https://alongz.cn'+add
      },
      getTableInfo(){
        service.getTableInfo().then(res=>{
          this.num = res.num
          this.tableinfo = res.data
        })
      },
      updateTableInfo(){
        service.updateTableInfo({num:this.num}).then(res=>{
          Message({
            type:"success",
            message:res.msg,
            iconClass: "el-icon-success",
            duration: 3000,
            showClose: true,
            center: true
          })
          this.getTableInfo()
        })
      }
    }
  };
</script>


<style lang="scss" scope>
#tableadmin{
  .code{
    height: 600px;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: scroll; 
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .box-card{
      width: 25%;
      height: 250px;
      margin: 20px;
      .el-image{
        width: 150px;
        height: 150px;
      }
    }
  }
}
</style>