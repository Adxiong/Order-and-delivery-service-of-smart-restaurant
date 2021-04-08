<template>
<div class="pageinfo">
  <el-form ref="form" :model="shopinfo" label-width="80px">
    <el-form-item label="店铺名称">
      <el-input v-model="shopinfo.name"></el-input>
    </el-form-item>
    <el-form-item label="店铺简介">
      <el-input type="textarea" v-model="shopinfo.details"></el-input>
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input  v-model="shopinfo.tel"></el-input>
    </el-form-item>
    <el-form-item label="店铺位置">
      <el-input  v-model="shopinfo.address"></el-input>
    </el-form-item>
    <el-form-item label="营业时间">
      <el-col :span="11">
        <el-time-picker placeholder="选择开门时间" v-model="shopinfo.start_time" style="width: 100%;"></el-time-picker>
      </el-col>
      <el-col class="line" :span="2">-</el-col>
      <el-col :span="11">
        <el-time-picker placeholder="选择关门时间" v-model="shopinfo.end_time" style="width: 100%;"></el-time-picker>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">修改</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
import service from "@/service";
import { Message } from "element-ui";
  export default {
    data() {
      return {
        shopinfo:{}
      }
    },
    mounted(){
      this.getShopInfo()
    },
    methods: {
      getShopInfo(){
        service.getShopInfo().then(res=>{
          this.shopinfo = res.data
        })
      },
      onSubmit() {
        service.updateShopInfo(this.shopinfo).then(res=>{
          this.shopinfo = this.shopinfo
          Message({
            type:"success",
            message:res.msg,
            iconClass: "el-icon-success",
            duration: 3000,
            showClose: true,
            center: true
          })
        })
      }
    }
  }
</script>


<style lang="scss" scope>
.pageinfo{
  padding: 50px;
  box-sizing: border-box;
  text-align: left;
}
</style>