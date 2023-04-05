<template>
    <div>
      <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card>
    <!-- 添加角色按钮 -->
    <el-row>
    <el-col>
      <el-button type="primary">添加角色</el-button>
    </el-col>
  </el-row>
  <!-- 角色列表区域 -->
     <el-table :data="rolelist" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row :class="[i1==0?'':'bdtop','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
             <!-- 渲染一级权限 -->
             <el-col :span="5">
              <el-tag closable @close="removeRightById(scope.row,item1.id)">{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
             </el-col>
             <!-- 二级权限,三级权限 -->
              <el-col :span="19">
                <el-row :class="[i2==0?'':'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6"> 
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                    </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable @close="removeRightById(scope.row,item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column type="角色名称" prop="roleName"></el-table-column>
      <el-table-column type="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作" width="300px">
         <template slot-scope="scope">
           <el-button size="mini" type="primary" icon="el-icon-edit">修改</el-button>
           <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
           <el-button @click="showRightsDialog(scope.row)" size="mini" type="warning" icon="el-icon-s-tools">分配权限</el-button>
         </template>
      </el-table-column>

     </el-table>
  </el-card>
  <el-dialog title="分配权限" :visible.sync="rightsVisible" width="50%">
    <!-- 树形控件 -->
    <el-tree
      :data="rightslist"
      show-checkbox
      default-expand-all
      node-key="id"
      ref="treeRef"
      :default-checked-keys="defKeys"
      :props="treeProps">
    </el-tree>

    <span slot="footer" class="dialog-footer">
      <el-button @click="rightsVisible=false">取消</el-button>
      <el-button type="primary" @click="setRights()">确定</el-button>
    </span>
  </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
     data(){
      return{
        rolelist:[],
        rightsVisible:false,
        rightslist:[],
        treeProps:{
          label:'authName',
          children:'children'
        },
        defKeys:[],
        roleId:''
      }
     },
     created(){
      this.getRoleList()
     },
     methods:{
      async getRoleList(){
        let {data:res} = await this.$http.get('roles')
        console.log(res)
        this.rolelist = res
        console.log(res)
      },
      
       async removeRightById(role,rightId){
           const confirmResult = await this.$confirm(
            '此操作将永久删除该权限,是否继续?',
            '提示',
            {
              confirmButtonText:'确定',
              cancelButtonText:'取消',
              type:'warning'
            }
           ).catch(err=>err)

           if(confirmResult!='confirm'){
            return this.$message.info('取消了删除！')
           }
           const res = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
           )
           if(res.meta.status !==200){
            return this.$message.error('删除权限失败！')
           } 
           role.children = res.data
       },
       async showRightsDialog(role){
        this.roleId = role.id
        this.defKeys = []
          this.rightsVisible = true
          
          let ret = await this.$http.get('/rights/tree')
          console.log(ret)
          this.rightslist = ret.data

          this.getLeafKeys(role,this.defKeys);

       },
       getLeafKeys(node,arr){
        if(!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item=>{
          this.getLeafKeys(item,arr)
        })
       },
       async setRights(){
          const keys=[
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
          ]
          const idStr = keys.join(',')

          const ret = await this.$http.post(
            `roles/${this.roleId}/rights`,
            {rids:idStr}
          )
          if(ret.meta.status!==200){
            return this.$message.error('分配权限失败!')
          }
          this.$message.success('分配权限成功!')
          this.getRoleList()
          this.rightsVisible=false

       }
     }
  }
  </script>
  
  <style scoped>
    .el-tag{
      margin:20px;
    }
    .bdtop{
      border-top:1px solid #eee;
    }
    .bdbottom{border-bottom:1px solid #eee}

    .vcenter{
      display:flex;
     align-items: center;
    }
  </style>