<template>
  <div class="menu">
    <el-form ref="MenuAdminForm" :model="MenuAdminForm" label-width="80px" inline> 
      <el-form-item label="名称">
        <el-input v-model="MenuAdminForm.name"></el-input>
      </el-form-item>
      <el-form-item label="封面图">
        <el-upload
          ref='picupload'
          class="upload-demo"
          action=""
          :on-change="handelChange"
          :on-remove="handelRemove"
          show-file-list
          :auto-upload="false"
          list-type="picture"
          :limit="1"
          >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
      <el-form-item label="类别">
        <el-select v-model="MenuAdminForm.type" placeholder="请选择分类">
          <el-option label="暂未选择" value="暂未选择"></el-option>
          <el-option :label="item.name" :value="item.id" v-for="item in typeinfo" :key="item.index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="MenuAdminForm.price"></el-input>
      </el-form-item>
      <el-button type="primary" @click="submit">添加</el-button>
    </el-form>
    <el-table
      :data="tableData"
      height="500"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="序号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="pic"
        label="封面图"
        width="100">
        <template slot-scope="scope">
          <el-image :src="getPicAddr(scope.row.pic)"></el-image>
        </template>
      </el-table-column>
      <el-table-column
        sortable
        prop="typename"
        :filters="[{text:'优质肉类',value:'优质肉类'},{text:'时令小蔬',value:'时令小蔬'},{text:'鲜美汤肴',value:'鲜美汤肴'},{text:'地道炒菜',value:'地道炒菜'},{text:'卤菜',value:'卤菜'},{text:'米饭',value:'米饭'},{text:'饮料',value:'饮料'},{text:'火锅',value:'火锅'}]"
        :filter-method="filterType"
        label="类别">
      </el-table-column>
      <el-table-column
        sortable
        prop="price"
        label="价格/元">
      </el-table-column>
       <el-table-column
      fixed="right"
      label="操作"
      width="120">
      <template slot-scope="scope">
        <el-button
          @click="delmenu(scope.$index, tableData)"
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
  import service from "@/service/index";
  import { Message } from "element-ui";
  export default {
    data() {
      return {
        tableData: [],
        MenuAdminForm:{
          name:"",
          pic:"",
          price:"",
          type:"暂未选择",
        },
        typeinfo:{}
      }
    },
    mounted(){
      this.getAllMenu()
      this.getTypeInfo()
    },
    methods:{
      getPicAddr(add){
        return 'https://alongz.cn'+add
      },
      getTypeInfo(){
        service.getAllType().then(res=>{
          this.typeinfo = res.data
        })
      },
      submit(){
        if( this.MenuAdminForm.name != "" && this.MenuAdminForm.pic !="" && this.MenuAdminForm.price != "暂未选择" )
        {
          var FormMenu = new FormData()
          for ( let key in this.MenuAdminForm)
          {
            FormMenu.append(key,this.MenuAdminForm[key])
          }
          service.submitMenuInfo(FormMenu).then(res=>{
            Message({
              type:"success",
              message:res.msg,
              iconClass: "el-icon-success",
              duration: 3000,
              showClose: true,
              center: true
            })
            this.$refs.picupload.clearFiles()
            this.MenuAdminForm = {
              name:"",
              pic:"",
              price:"",
              type:"",
            }
            this.getAllMenu()
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
      handelChange(file){
        this.MenuAdminForm.pic = file.raw;
      },
      handelRemove(){
        this.MenuAdminForm.pic = "";
      },
      filterType(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      delmenu(index,rows){
        var index = rows[index]
        service.delMenuInfo(index).then(res=>{
          this.getAllMenu()
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
      getAllMenu(){
        service.getAllMenu().then(res=>{
          this.tableData = res.data
        })
      }

    }
  }
</script>

<style lang="scss" scope>
  .menu{
    height: 100%;
    .el-image{
      width: 60px;
      height: 60px;
    }
    .el-form{
      text-align: left;
    }
  }
</style>