import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Users from '../views/users/Users.vue'
import Rights from '../views/auth/Rights.vue'
import Roles from '../views/auth/Roles.vue'
import Report from '../views/data/Report.vue'
import Goods from "../views/goods/Goods.vue";
import Categories from "../views/goods/Categories.vue";
import Cate from "../views/goods/Cate.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
    children:[
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/reports',component:Report},
      {path:'/goods',component:Goods},
      {path:'/categories',component:Categories},
      {path:'/params',component:Cate},
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
