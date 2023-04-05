<template>
  <div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>

     <el-card>
       <el-table :data="rightList" border>
    <el-table-column type="index" label="#"></el-table-column>
    <el-table-column prop="authName" label="权限名称" width="220px"></el-table-column>
    <el-table-column prop="path" label="路径" width="220px"></el-table-column>
    <el-table-column prop="level" label="权限等级" width="220px" > </el-table-column>
       </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
    data(){
      return{
        // rightInfo:{},
        rightList:[],  
         total:0,
         levelInfo:{
            0:'一级',
            1:'二级',
            2:'三级',
         },
         levelColor:{
            0:'primary',
            1:'success',
            3:'warning'
         }
      }
    },
    created(){
        // 获取权限信息
        this.getRightList()
    },
    methods:{
      async getRightList(){
        let ret = await this.$http.get('rights/list',{params:this.queryInfo})
        this.rightList = ret.data
       
        console.log(ret.data);
        
      },
      
    }
}
</script>

<style>

</style>