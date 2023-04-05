import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element'
import axios from 'axios'
import './assets/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'
import ZkTable from "vue-table-with-tree-grid";

Vue.component('zk-table',ZkTable)
Vue.config.productionTip = false
Vue.prototype.$http = axios
//请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
//响应拦截器
axios.interceptors.response.use((ret)=>{
  return ret.data;
},(err)=>{
  console.log('失败',err);
})
//请求拦截器---头部添加一个token
axios.interceptors.request.use((config)=>{
  const tk = sessionStorage.getItem('token');
  config.headers.Authorization= tk;
  return config;//放行
},(err)=>{
  console.log('失败',err);
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')