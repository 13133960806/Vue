import Vue from 'vue'
import { Button, Menu, Submenu,Form,FormItem,Input,
    Container,Header,Aside,Main,MenuItem, 
    Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, 
    TableColumn, Switch, Pagination, Tooltip, Dialog, Select, Option, Tag, Tree, Alert, Cascader, Tabs, TabPane } from 'element-ui'
import {MessageBox,Message} from "element-ui";

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Tabs)
Vue.use(TabPane)


// 把消息提示挂载原型上
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
