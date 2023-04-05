<template>
   <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
   <!-- 卡片视图 -->
   <el-card>
    <!-- 2.为Echarts准备一个具备大小(宽高)的Dom -->
    <div id="main" style="width:750px;height:400px"></div>
   </el-card>
   </div> 
</template>

<script>
import * as echarts from 'echarts'
export default {
    
   data(){
    return{

    }
   },
   async mounted(){
    const ret = await this.$http.get('reports/type/1')
    console.log('报表',ret);
    // 图标配置
    let chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    myChart.setOption(ret.data)
   }
}
</script>

<style>

</style>