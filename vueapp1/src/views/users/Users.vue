<template>
  <div>
<el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
  <el-card>
     <el-row :gutter="20">
      <!-- 第一行搜索框和按钮 -->
       <el-col :span="16">
        <el-input placeholder="请输入内容">
           <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
       </el-col>
       <el-col :span="4">
           <el-button type="primary" @click="addVisible=true">添加用户</el-button>
       </el-col>
     </el-row>
      <!-- 表格 -->
    <el-table :data="userlist" border style="width: 100%">
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column prop="username" label="姓名" width="180"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
    <el-table-column prop="mobile" label="电话"></el-table-column>
    <el-table-column prop="role_name" label="角色"></el-table-column>

    <el-table-column prop="mg-state" label="状态">
      <template slot-scope="scope">
                <el-switch @change="userStateChange(scope)" v-model=scope.row.mg_state></el-switch>
            </template>
    </el-table-column>

    <el-table-column label="操作" width="180px">
      <template slot-scope="scope">
     <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
     <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
     <el-button size="mini" type="warning" icon="el-icon-s-tools" @click="updateuser(scope.row);roleVisible=true"></el-button>
    </el-tooltip>
     <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
     <el-button size="mini" type="danger" icon="el-icon-delete" @click="deluser(scope.row.id)"></el-button>
     </el-tooltip>
    </template>
    </el-table-column>
  </el-table>
     <!-- 分页 -->
     <el-pagination
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
       :current-page="queryInfo.pagenum"
       :page-sizes="[2, 5, 10, 50]"
       :page-size="queryInfo.pagesize"
       layout="total, sizes, prev, pager, next, jumper"
       :total="total">
    </el-pagination>
  </el-card>

   <!-- 新增对话框 -->
  <el-dialog title="提示" :visible.sync="addVisible" width="60%">
   <!-- 放个表单 -->
    <el-form :model="addForm" ref="addFormRef" label-width="70px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="addForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="addForm.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="addForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="addForm.mobile"></el-input>
      </el-form-item>
      </el-form> 
  <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
</el-dialog>

<!-- 分配 -->
<el-dialog title="提示" :visible.sync="roleVisible" width="50%">
  <div>
    <p>当前用户:{{ userInfo.username }}</p>
    <p>当前角色:{{ userInfo.role_name }}</p>
    <p>分配新角色：
      <el-select v-model="roleId" placeholder="请选择">
        <el-option v-for="item in rolelist" :key="item.id" 
        :label="item.roleName" :value="item.id">
           
        </el-option>
        </el-select>
    </p>
  </div>
   
  <span slot="footer" class="dialog-footer">
    <el-button @click="roleVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
   data(){
      return{
        // 用户数组
         userlist:[],
        // 角色数组
         rolelist:[],
        // 准备分配角色的用户
        userInfo:{},
        roleId:'',
        //  接口数据用于查询
         queryInfo:{
           query:'',
           pagenum:1,
           pagesize:5
         },
         total:0,
          
         addVisible:false,
         roleVisible:false,
        //  表单数据对象
        addForm:{
          username:'',
          password:'',
          email:'',
          mobile:''
        }
      }
   },
   created(){
    // 获取用户数据
    this.getUserList();
   },
   methods:{
     async getUserList(){
        let ret = await this.$http.get('/users',{params:this.queryInfo})
        // console.log('用户',ret);
        this.userlist = ret.data.users
        this.total = ret.data.total
     },
    //  换每页显示的条数
     handleSizeChange(size){
       this.queryInfo.pagesize = size
       this.getUserList()  
     },
    //  换页
     handleCurrentChange(p){
       this.queryInfo.pagenum = p
       this.getUserList()
     },
     
     async userStateChange(row){
      //  console.log(row);
       let ret = await this.$http.put(`users/${row.id}/state/${row.mg_state}`)
      //  console.log(ret);
       if(ret.meta.status!==200){
        row.mg_state =! row.mg_state
        return this.$message.error(ret.meta.msg)
       }
       this.$message.success(ret.meta.msg)
     },
    //  新增用户
    async addUser(){
       let ret = await this.$http.post('/users',this.addForm)
       if(ret.meta.status!=201){
        return this.$message.error(ret.meta.msg)
       }
       this.$message.success(ret.meta.msg)
       this.addVisible = false
      //  重新读取数据
       this.getUserList
    },
    
    // 角色框的显示
    async updateuser(row){
      this.userInfo = row
      this.roleVisible = true
      let res = await this.$http.get(`/roles`)
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      this.rolelist = res.data
      // console.log(row);
      
    },
     
    // 分配用户
    saveRoleInfo(){
      this.$http.put (`users/${this.userInfo.id}/role`,this.userInfo)//路径一个id  对象一个id  {rid:this.userInfo}
      if(res.meta.status!=200){
        return this.$message.error(res.meta.msg)
      }
      this.roleVisible = false
      //  重新读取数据
       this.getUserList
    },

    // 删除用户
    deluser(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.$http.delete('/users/'+id);
          this.getUserlist();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    
  }
}
</script>

<style>

</style>