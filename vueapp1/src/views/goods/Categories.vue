<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  
  <el-card>
    <el-row :gutter="20">
      <!-- 第一行搜索框和按钮 -->
       <el-col :span="10">
           <el-button type="primary"  @click="addVisible=true">添加分类</el-button>
       </el-col>
     </el-row>

     <!-- 表格区域  
     columns:使用时的参数设置 
     selection-type:不可以多选 
     expand-type:是否为展开行类型表格
     show-index:显示索引列
     index-text:序号
     border:加边框
     :show-row-hover:鼠标悬停的那一行高亮显示
     -->
     <zk-table 
     :data="Categorieslist"
     :columns="columns"
     :selection-type="false"
     :expand-type="false"
     show-index
     index-text="序号"
     border
     :show-row-hover="true"
     class="treetable"
     >
     <!-- 是否有效列 -->
      <template slot="isOK" slot-scope="scope">
        <i class="el-icon-success"
        v-if="scope.row.cat_deleted===false"
        style="color:lightgreen;">
        </i>
        <i class="el-icon-error" v-else style="color:red;"></i>
      </template>
      <!-- 排序列 -->
      <template slot="order" slot-scope="scope">
        <el-tag v-if="scope.row.evel===0" size="mini">一级</el-tag>
        <el-tag type="success" v-else-if="scope.row.level===1" size="mini">二级</el-tag>
        <el-tag type="danger" v-else-if="scope.row.level===2" size="mini">三级</el-tag>
      </template>
      <!-- 操作 -->
      <template slot="opt" slot-scope="scope">
        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCate(scope.row.id)">删除</el-button>
      </template>
     </zk-table>
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
   <el-form :model="addForm" label-width="70px">
    <el-form-item label="分类名称" prop="cat_name">
        <el-input v-model="addForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="分类ID" prop="cat_pid">
        <el-input v-model="addForm.cat_pid"></el-input>
    </el-form-item>
    <el-form-item label="分类层级" prop="cat_level">
        <el-input v-model="addForm.cat_level"></el-input>
    </el-form-item>
   </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
  
<script>

export default {

    data() {
        return {
          Categorieslist: [],
          addVisible:false,
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 5
            },
            total: 0,
            columns: [
                // 第一列数据
                { label: "分类名称", prop: "cat_name" },
                // 第二列数据
                { label: "是否有效", 
                    // 表示将当前列定义为模板列
                    type: "template", 
                    // 表示当前这一列使用模板的名称
                    template: "isOK", width: "75px"
                },
                // 第三列数据
                { label: "排序", type: "template", template: "order"
                },
                // 第四列数据
                { label: "操作", type: "template", template: "opt"
                }
            ],
            addForm:{
              cat_name:'',
              cat_pid:'',
              cat_level:''
            }
        };
    },
    created() {
        this.getCategorieslist();
    },
    methods: {
        async getCategorieslist() {
            let ret = await this.$http.get("/categories", { params: this.queryInfo });
            console.log(ret);
            this.Categorieslist = ret.data.result;
            this.total = ret.data.total;
        },
          //  换每页显示的条数
    handleSizeChange(size){
       this.queryInfo.pagesize = size
       this.getCategorieslist() 
     },
    //  换页
     handleCurrentChange(p){
       this.queryInfo.pagenum = p
       this.getCategorieslist()
     },
     async addCate(){
       let ret = await this.$http.post('/categories',this.addForm)
       if(ret.meta.status!=201){
        return this.$message.error(ret.meta.msg)
       }
        this.$message.success(ret.meta.msg)
        this.addVisible = false
       //  重新读取数据
        this.getCategorieslist
     },
     async delCate(id){
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.$http.delete('/categories/'+id);
          this.getCategorieslist();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
     }
    },
}
</script>

<style>

</style>