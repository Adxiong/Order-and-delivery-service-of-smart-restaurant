<template>
  <div id="login" class="clear">
    <el-form inline class="loginform" ref="loginForm"  :model="loginForm" :rules="loginFormRules" status-icon>
      <div class="title">商易通管理系统</div>
      <el-form-item label="账号" prop="user">
        <el-input prefix-icon="el-icon-user" v-model="loginForm.user" placeholder="请输入用户账号" clearable  maxlength="11"
  show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" placeholder="请输入用户密码" type="password" clearable show-password></el-input>
      </el-form-item>
      <el-button class="submit" type='primary' @click="submit">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import service from "@/service/index.js";
export default{
  data () {
    return {
      loginForm:{
        user:'',
        password:""
      },
      loginFormRules:{
        user:[
          { required:true,message:"请输入用户名",trigger:'blur'},
          { min:3,max:11,message:"长度在5到11个字符",trigger:'blur'}
        ],
        password:[
          { required:true,message:"请输入密码",trigger:'blur'},
          { min:5,max:11,message:"长度在5到11个字符",trigger:'blur'}
        ]
      }
    }
  },
  methods:{
    submit(){
      const that = this;
      if(this.loginForm.user!="" && this.loginForm.password!="")
      {
        const {user , password} = this.loginForm
        service.login(user,password).then(res=>{
          that.$global.userInfo = res.userinfo;
          that.$router.push('/home')
        })
      }else{
        this.$message.error("请填写用户或密码！！！")
      }
    }
  }
}
</script>

<style lang="scss" scope>
#login{
  width: 100%;
  height: 100%;
  background: url(https://img.tukuppt.com/bg_grid/00/04/70/PaDosjk1FW.jpg!/fh/350) 0 0 no-repeat;
  background-size: cover;
  float: left;
  .clear{
    display: block;
    clear: both;
  }
  .title{
    font-family: '华文彩云';
    font-size: 36px;
    color: black;
    text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.7);
    margin-bottom: 40px;
  }
  .loginform{
    width: 40%;
    margin: 30px auto;
    padding: 40px 0;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .el-form-item{
      display: block;
    }
  }
}
</style>