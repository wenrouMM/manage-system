import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import UserAdd from '@/components/useradd'
import Userlist from '@/components/userlist'
import Home from '@/components/home'
import Login from '@/components/login'
import Menu from '@/components/Power/menu'
import UserRole from '@/components/Power/userRole'
import Authorization from '@/components/Power/Authorization'
import PasswordRedirect from '../components/passwordRedirect.vue'
import UserManage from '../components/Power/userManage.vue'
import LoginRecord from '../components/Power/loginrecord.vue'
import Test from '../common/test/test.vue'
import Test2 from '../common/test/test2.vue'
Vue.use(Router)
// 暴露一个router对象
export default new Router({
  routes: [
    {
      path:'/login',
      component:Login
    },
    {
      path:'/test', // 一级路由 管理横条
      component:Test,
      children:[
        {
          path:'/powerMode',// 二级路由 管理侧边栏 侧边栏内容随数据而变动 动态路由
          component: Test2,
          children:[
            {
              path:'/powerMode', // 三级路由 真正的内容
              component:Home,
            },
            {
              path:'/userManage',
              component:UserManage,
            },
            {
              path:'/loginRecord',
              component:LoginRecord,
            },
            {
              path:'/menu',
              component:Menu
            },
            {
              path:'/userrole',
              component:UserRole
            },
            {
              path:'/authorization',
              component:Authorization
            }
          ]
        }
      ]
    },

    {
      path:'/',
      name:'Index',
      component: Index,
      children:[
        {
          path:'/',
          name: 'home',
          component: Home
        },
        {
          path: '/useradd',
          name: 'useradd',
          component: UserAdd
        },
        {
          path: '/useradd',
          name: 'useradd',
          component: UserAdd
        },
        {
          path: '/userlist',
          name: 'userlist',
          component: Userlist
        },
        {
          path: '/passwordRedirect',
          name: 'passwordRedirect',
          component: PasswordRedirect
        },
      ]
    }
  ]
})
