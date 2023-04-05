<template>
  <el-container class="homepage">
    <el-header class="header">
      <div>
        <img width="50" src="../assets/logo.png"/>
        <span>后台管理系统</span>
        <el-button size="small">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 左侧菜单 -->
      <el-aside width="200px" class="aside">
        <el-menu unique-opened router background-color="#333744" text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu :key="item.id" v-for="item in menulist" :index="item.path+''">
            <template slot="title">
              <i class="iconfont icon-user"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="sub in item.children" :key="sub.id" :index="sub.path+''">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ sub.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区 -->
      <el-main>
        <router-view>
          <!-- 子路由占位符 -->
        </router-view>
      </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return{
      menulist:[],
      icons:{
        '125':'iconfont icon-user',
        '103':'iconfont icon-3702mima',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju',
        '145':'iconfont icon-baobiao',
      }
    }
  },
  created(){
    this.getMenuList();
  },
  methods:{
    async getMenuList(){
      let ret = await this.$http.get('/menus');
      console.log(ret);
      this.menulist = ret.data;
    }
  }
}
</script>

<style lang="less" scoped>
  .homepage{height: 100vh;}
  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: center;
    color: #fff;
    > div{
      display: flex;
      align-items: center;
      span{
        margin-left: 15px;
      }
    }
  }
  .el-aside{
    background-color: #333744;
      .el-menu{
        border-right:none
      }
  }
  .el-main{
    background-color: #eaedfe;
  }
  .inconfont{margin-right: 10px;}
</style>
