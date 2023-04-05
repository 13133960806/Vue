<template>
   <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

<!-- 卡片视图 -->
  <el-card>
     <!-- 添加商品 -->
     <el-row :gutter="20">
      <!-- 第一行搜索框和按钮 -->
       <el-col :span="16">
        <el-input placeholder="请输入商品">
           <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
       </el-col>
       <el-col :span="4">
           <el-button type="primary" @click="addVisible=true">添加商品</el-button>
       </el-col>
     </el-row>
     
     <!-- 创建表格 -->
     <el-table :data="goodslist" border style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品姓名" width="180"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="180">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="修改商品" placement="top">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="updategoods(scope.row);goodsVisible=true"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除商品" placement="top">
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="delgoods(scope.row.goods_id)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
     </el-table>
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
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="以为','分割的分类列表" prop="goods_cat">
        <el-input v-model="addForm.goods_cat"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="goods_price">
        <el-input v-model="addForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="goods_number">
        <el-input v-model="addForm.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="介绍" prop="goods_introduce">
        <el-input v-model="addForm.goods_introduce"></el-input>
      </el-form-item>
      <el-form-item label="上传图片" prop="pics">
        <el-input v-model="addForm.pics"></el-input>
      </el-form-item>
      <el-form-item label="商品参数" prop="attrs">
        <el-input v-model="addForm.attrs"></el-input>
      </el-form-item>
    </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addVisible = false">取 消</el-button>
    <el-button type="primary" @click="addGoods">确 定</el-button>
  </span>
</el-dialog>
 
 <!-- 分配 -->
<el-dialog title="提示" :visible.sync="goodsVisible" width="50%">
     
  <span slot="footer" class="dialog-footer">
    <el-button @click="goodsVisible = false">取 消</el-button>
    <el-button type="primary" @click="savegoodsInfo">确 定</el-button>
  </span>
</el-dialog>
   </div>
</template>

<script>
export default {
   data(){
    return{
        // 商品数组
        goodslist:[],
        queryInfo:{
           query:'',
           pagenum:1,
           pagesize:5
         },
         total:0,
        //  新增商品表单
        addForm:{
            goods_name:'',
            goods_cat:'',
            goods_price:'',
            goods_number:'',
            goods_weight:'',
            goods_introduce:'',
            pics:'',
            attrs:'',
        },
        addVisible:false,
        goodsVisible:false
    }
   },
   created(){
     this.getGoodslist();
   },
   methods:{
    async getGoodslist(){
        let ret = await this.$http.get('/goods',{params:this.queryInfo})
        // console.log(ret);
        this.goodslist = ret.data.goods
        this.total = ret.data.total
    },
    //  换每页显示的条数
    handleSizeChange(size){
       this.queryInfo.pagesize = size
       this.getGoodslist()  
     },
    //  换页
     handleCurrentChange(p){
       this.queryInfo.pagenum = p
       this.getGoodslist()
     },
    //  新增商品
     async addGoods(){
       let ret = await this.$http.post('/goods',this.addForm)
       if(ret.meta.status!=200){
        return this.$message.error(ret.meta.msg)
       }
        this.$message.success(ret.meta.msg)
        this.addVisible = false
       //  重新读取数据
        this.getGoodsList
     },
     async updategoods(row){},
     async savegoodsInfo(){},
     async delgoods(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          await this.$http.delete('/goods/'+id);
          this.getGoodslist();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
     }
   }
}
</script>

<style>

</style>