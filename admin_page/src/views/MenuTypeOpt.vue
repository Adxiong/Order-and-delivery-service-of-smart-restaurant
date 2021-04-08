<template>
  <div class="menu">
    <el-form ref="TypeAdminForm" :model="TypeAdminForm" label-width="80px" inline> 
      <el-form-item label="编号">
        <el-input v-model="TypeAdminForm.id"></el-input>
      </el-form-item>
      <el-form-item label="类别">
        <el-input v-model="TypeAdminForm.name"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submit">添加</el-button>
    </el-form>
    <el-table
      :data="tableData"
      height="550"
      border
      stripe
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="类别">
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click="getRow(scope.$index, tableData)"
          type="text"
          size="small">
          移除
        </el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>

</template>


<script>
  import service from "@/service";
  import { Message } from "element-ui";
  export default {
    data() {
      return {
        tableData: [],
        TypeAdminForm:{
          id:"",
          name:""
        }
      }
    },
    mounted(){
      this.getAllType()
    },
    methods:{
      submit(){
        if(this.TypeAdminForm.id != "" && this.TypeAdminForm.name != "")
        {
          console.log(this.TypeAdminForm)
          service.submitTypeInfo(this.TypeAdminForm).then(res=>{
            console.log(res)
            Message({
              type:"success",
              message:res.msg,
              iconClass: "el-icon-success",
              duration: 3000,
              showClose: true,
              center: true
            })
            this.TypeAdminForm = {
              id:"",
              name:""
            }
            this.getAllType()
          })
        }else{
          Message({
            type:"warning",
            message:"数据未填写完整",
            iconClass: "el-icon-warning",
            duration: 3000,
            showClose: true,
            center: true
          })
        }
      },
      getRow(index,rows){
        service.delTypeInfo(rows[index]).then(res=>{
          this.getAllType()
          Message({
            type:"success",
            message:res.msg,
            iconClass: "el-icon-success",
            duration: 3000,
            showClose: true,
            center: true
          })
        })
      },
      getAllType(){
        service.getAllType().then(res=>{
          this.tableData = res.data;
        })
      }
    }
  }
</script>