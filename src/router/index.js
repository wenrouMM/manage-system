import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import UserAdd from '@/components/useradd'

import Home from '@/components/home'
import UserManage from '../components/Power/userManage.vue'
import UserRole from '../components/Power/userRole.vue'
import PowerControl from '../components/Power/powerControl.vue'
import Menu from '../components/Power/menu.vue'
import LoginRecord from '../components/Power/loginrecord.vue'


import Cirle from '../common/test/cirle.vue'
import Test from '../common/test/test.vue'
import Test2 from '../common/test/test2.vue'
import TestBook from '../common/test/testBook.vue'
import BookType from '../components/Book/BookManage/bookType.vue'
import BookInfo  from '../components/Book/BookManage/bookInfo.vue'
import BookPublishHouse from '../components/Book/BookManage/BookPublishingHouse.vue'
import LibBookInfo from '../components/Book/libraryManage/libBookInfo.vue'
import libBookType from '../components/Book/libraryManage/libBookType.vue'
import LibInfo from '../components/Book/libraryManage/libInfo.vue'
import TestArea from '../common/test/testArea.vue'
import StoneRoomInfo from '../components/Area/areaManage/stoneroomaInfo.vue'
import ShelfBind from '../components/Area/areaManage/shelfBind'
import TestReader from '../common/test/testReader.vue'


import ReaderAdmin from '../components/Reader/ReaderAdmin/readeradmin.vue'
import GetCard from '../components/Reader/ReaderAdmin/getAcard.vue'
import ReaderCardManagement from '../components/Reader/ReaderCardManagement/readerCardmanagement.vue'
import ReaderCardType from '../components/Reader/ReaderCardManagement/readerCardType.vue'
import ReaderCardGrade from '../components/Reader/ReaderCardManagement/readerCardgrade'

import Login from '@/components/login.vue'
import Detail from '../components/Book/detail.vue'
import Not from '../components/error.vue'

Vue.use(Router)
// 暴露一个router对象
export default new Router({
  //mode:history,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path:'/login',
      component:Login
    },
    
    {
      path:'/home',
      name:'index',
      component: Index,
      children:[
        {
          path:'home',
          name: 'home',
          component: Home
        },
        {
          path:'cirle',
          component:Cirle
        },
        {
          path: 'useradd',
          name: 'useradd',
          component: UserAdd
        },
      ]
    },
    {
      path:'*',
      component:Not
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
              path:'/userRole',
              component:UserRole,
            },
            {
              path:'/powerControl',
              component:PowerControl,
            },
            {
              path:'/menu',
              component:Menu,
            },
            {
              path:'/loginRecord',
              component:LoginRecord
            }
          ]
        },
        {
          path:'/areaMode',
          component:TestArea,
          children:[
            {
              path:'/stoneroomInfo',
              component:StoneRoomInfo
            },
            {
              path:'/shelfBind',
              component:ShelfBind
            }
          ]
        },
        {
          path:'/bookMode',
          component:TestBook,
          children:[
            {
              path:'/bookType',
              component:BookType,
            },
            {
              path:'/bookInfo',
              component:BookInfo
            },
            {
              path: '/bookInfo/:id',
              component:Detail
            },
            {
              path:'/bookpublishhouse',
              component:BookPublishHouse
            },
            {
              path:'/libBookInfo',
              component:LibBookInfo
            },
            {
              path:'/libBookType',
              component:libBookType
            },
            {
              path:'/libInfo',
              component:LibInfo
            }
          ]
        },

        {
          path:'/readerMode',
          component:TestReader,
          children:[
            {
              path:'/readeradmin',
              component:ReaderAdmin,
            },
            {
              path:'/getcard',
              component:GetCard,
            },
            {
              path:'/readercardmanagement',
              component:ReaderCardManagement,
            },
            {
              path:'/readercardtype',
              component:ReaderCardType,
            },
            {
              path:'/readercardgrade',
              component:ReaderCardGrade,
            }
          ]
        }
      ]
    }
    
    
  ]
})
