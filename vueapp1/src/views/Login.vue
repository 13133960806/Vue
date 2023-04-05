<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="logo_box">
        <img src="../assets/logo.png"/>
      </div>
      <!-- 表单 -->
        <el-form ref="loginForm" :model="form" label-width="80px" :rules="rules" class="login_form">
          <el-form-item label="用户账号"  prop="username">
              <el-input prefix-icon="iconfont  icon-user" v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
              <el-input prefix-icon="iconfont  icon-lock_fill" v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="submitForm">登录</el-button>
              <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
    data(){
      return{
            form:{
                username:'',
                password:''
            },
            rules:{
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 15, message: '长度在 4 到 15 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        submitForm(){
            this.$refs.loginForm.validate(async (ok)=>{
              if(!ok==true){
                this.$message.error('错误，请检查...');
                return;
              }

              let obj = await this.$http.post('/login',
                {'username':this.form.username,'password':this.form.password});
              if(obj.meta.status!=200){
                return this.$message.error(obj.meta.msg);
              }
              //保存token，跳主页
              sessionStorage.setItem("token",obj.data.token);
              this.$router.push('/home');
            })
        },
        resetForm(){
            this.$refs.loginForm.resetFields();
        }
    }
}  
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100vh;
}
.login_box{
    width:450px;
    height:300px;
    background-color: #fff;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    .logo_box{
      height: 130px;
      widows: 130px;
      border: 1px solid#eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position:absolute;
      left: 50%;
      background-color: #fff;
      transform: translate(-50%,-50%);
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
}
.login_form{
  position: absolute;
  bottom: 15px;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>