import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'


import Home from '@/components/home'
import UserManage from '../components/Power/userManage.vue'
import UserRole from '../components/Power/userRole.vue'
import PowerControl from '../components/Power/powerControl.vue'
import Menu from '../components/Power/menu.vue'
import LoginRecord from '../components/Power/loginrecord.vue'


import Test from '../common/test/test.vue'
import Test2 from '../common/test/test2.vue'
import TestBook from '../common/test/testBook.vue'
import BookType from '../components/Book/BookManage/bookType.vue'
import BookInfo from '../components/Book/BookManage/bookInfo.vue'
import BookPublishHouse from '../components/Book/BookManage/BookPublishingHouse.vue'
import LibInfo from '../components/Book/libInfo.vue'

import TestArea from '../common/test/testArea.vue'
import StoneRoomInfo from '../components/Area/areaManage/stoneroomaInfo.vue'
import ShelfBind from '../components/Area/areaManage/shelfBind'
import TestReader from '../common/test/testReader.vue'
import ReaderAdmin from '../components/Reader/ReaderManagement/readeradmin.vue'
import GetCard from '../components/Reader/ReaderManagement/getAcard.vue'

import LibBookType from '../components/Reader/libraryManage/libBookType'
import LibBookInfo from '../components/Reader/libraryManage/libBookInfo'
import BookRegistration from '../components/Reader/libraryManage/bookRegistration'
import bookLocation from '../components/Reader/libraryManage/bookLocation'

import ReaderCardManagement from '../components/Reader/ReaderCardManagement/readerCardmanagement.vue'
import ReaderCardType from '../components/Reader/ReaderCardManagement/readerCardType.vue'
import ReaderCardGrade from '../components/Reader/ReaderCardManagement/readerCardgrade'
import LoanRecorde from '../components/Circulate/loanRecords.vue'
import LoanHistory from '../components/Circulate/loanHistory.vue'
import BorrowingBooks from '../components/Circulate/borrowingBooks.vue'



import ChargeMoney from '../components/Reader/RechargeManagement/chargeMoney.vue'
import DepositRecord from '../components/Reader/RechargeManagement/depositRecord.vue'

import DepositDetails from '../components/Reader/RechargeManagement/depositDetails.vue'

import OverdueRecords from '../components/Reader/OverdueManagement/overdueRecords.vue'
import OverdueHistory from '../components/Reader/OverdueManagement/overduehistory.vue'
import OverdueSetting from '../components/Reader/OverdueManagement/overduesettings.vue'

import DishonestyRecords from '../components/Reader/DishonestyManagement/dishonestyRecords'
import DishonestyHistory from '../components/Reader/DishonestyManagement/dishonestyHistory'
import Login from '@/components/login.vue'
import Detail from '../components/Book/detail.vue'
import LibDetail from '../components/Reader/libDetail.vue'
import Not from '../components/error.vue'

import IndexTest from '../common/indexTest.vue'
/*系统设置 */
import TestSystem from '../common/test/testSystem.vue'
import {
  resolve
} from 'upath';
Vue.use(Router)
// 暴露一个router对象
/*导航守卫 */

export default new Router({
  //mode:history,
  routes: [{
      path: '/',
      redirect: '/indexTest'
    },
    {
      path:'/test',
      component:() => import('../common/count/count.vue')
    },
    {
      path: '/login',
      component: Login
    },
    {
      path:'/userInfo',
      meta:{
        title:'个人中心'
      },
      component:resolve => require(['../components/userInfo.vue'],resolve)
    },
    {
      path: '/indexTest',
      meta: {
        title: '测试首页'
      },
      component: IndexTest,

      children: [
        // 1.0 采编管理
        {
          path:'/uploadBook',
          meta:{
            title:'编目批量导入',
            Mode:'1'
          },
          component:resolve =>require(['../common/upload/upload.vue'],resolve)
        },


        // 2.0 典藏管理
        {
          path: '/libInfo',
          component: LibInfo
        },
        {
          path: '/bookType',
          component: BookType,
        },
        {
          path: '/bookInfo',
          component: BookInfo
        },
        {
          path: '/bookInfo/:id',
          component: Detail
        },
        {
          path: '/bookpublishhouse',
          component: BookPublishHouse
        },
        // 3.0 流通管理
        {
          path: '/loanrecorde',
          meta:{
            title:'借阅记录',
            Mode:'3'
          },
          component: LoanRecorde,
        },
        {
          path: '/loanhistory',
          meta:{
            title:'还书记录',
            Mode:'3'
          },
          component: LoanHistory,
        },
        {
          path:'/reimburse',
          meta:{
            title:'报损记录',
            Mode:'3'
          },
          component:resolve => require(['@/components/Circulate/damageCount'],resolve)
        },
        {
          path:'/reimburseHistory',
          meta:{
            title:'报损历史记录',
            Mode:'3'
          },
          component:resolve => require(['@/components/Circulate/damageCotHis.vue'],resolve)
        },
        {
          path: "/borrowingbooks",
          meta:{
            title:'书籍借阅',
            Mode:'3',
            isAlive:true
          },
          component: BorrowingBooks,
        },
        {
          path: "/returnbooks",
          meta:{
            title:'书籍归还',
            Mode:'3',
            isAlive:true
          },
          component: () => import('../components/Circulate/returnBooks.vue')
        },
        {
          path: "/returnstatus",
          component: ()  => import('../components/Circulate/returnStatus.vue')
        },
        {
          path:'/renew',
          meta:{
            title:'书籍续借',
            Mode:'3',
            isAlive:true
          },
          component:resolve => require(['@/components/Circulate/renew.vue'], resolve)
        },
        {
          path:'/bookDamage',
          meta:{
            title:'书籍报损',
            Mode:'3',
            isAlive:true
          },
          component:resolve => require(['@/components/Circulate/bookDamage.vue'], resolve)
        },
        // 4.0 读者管理
        {
          path: '/readercardmanagement',
          meta:{
            title:'读者卡管理',
            Mode:'4'
          },
          component: ReaderCardManagement,
        },
        {
          path: '/readercardgrade',
          component: ReaderCardGrade,
          meta:{
            title:'读者卡等级',
            Mode:'4'
          }
        },
        {
          path: '/DishonestyRecords',
          component: DishonestyRecords,
          meta:{
            title:'失信记录',
            Mode:'4'
          }
        },
        {
          path: '/DishonestyHistory',
          component: DishonestyHistory,
          meta:{
            title:'失信历史记录',
            Mode:'4'
          }
        },
        {
          path: '/overduerecords',
          component:resolve => require(['@/components/Reader/OverdueManagement/overdueRecords.vue'],resolve),
          meta:{
            title:'逾期记录',
            Mode:'3'
          }
        },
        {
          path: "/overduehistory",
          component: OverdueHistory,
          meta:{
            title:'逾期历史记录',
            Mode:'3'
          }
        },
        {
          path: '/overduesettings',
          component:resolve => require(['@/components/Reader/OverdueManagement/overduesettings.vue'],resolve),
          meta:{
            title:'逾期设置',
            Mode:'3'
          }
        },
        {
          path: '/getcard',
          name: "GetCard",
          component: GetCard,
          meta:{
            title:'办卡'
          },
        },
        // 6.0系统模块
        {
          path: '/indexTest',
          meta: {
            title: '首页'
          },
          component: Home
        },
        {
          path:'/guideTest',
          meta:{
            title:'系统管理引导页',
            Mode:'6'
          },
          component:resolve=> require(['../common/guide/guide.vue'],resolve)
        },
        {
          path: '/menuInformation',
          meta: {
            title: '菜单管理',
            Mode:'6'
          },
          component: Menu
        },
        {
          path: '/roleMenuElement',
          meta: {
            title: '权限管理',
            Mode:'6'
          },
          component: PowerControl
        },
        {
          path: '/roleInformation',
          meta: {
            title: '角色管理',
            Mode:'6'
          },
          component: UserRole
        },
        {
          path: '/managerInformation',
          meta: {
            title: '用户管理',
            Mode:'6'
          },
          component: UserManage
        },
        {
          path: '/authTbManagerLoginLog',
          meta: {
            title: '登录记录',
            Mode:'6'
          },
          component: LoginRecord
        },
        {
          path: '/noticeSet',
          meta: {
            title: '公告管理',
            Mode:'6'
          },
          component: resolve => require(['../components/System/notice.vue'], resolve)
        },
        /* */
        {
          path: '/publishhouse',
          meta: {
            title: '图书出版社',
            Mode:'2'
          },
          component: resolve => require(['../components/Book/BookManage/BookPublishingHouse.vue'], resolve)
        },
        {
          path: '/bookLocation',
          meta: {
            title: '图书位置绑定',
            Mode:'2'
          },
          component: resolve => require(['../components/Reader/libraryManage/bookLocation.vue'], resolve)
        },
        {
          path: '/BookLocationInformation',
          meta: {
            title: '图书位置信息',
            Mode:'2'
          },
          component: resolve => require(['../components/Reader/libraryManage/BookLocationInformation.vue'], resolve)
        },
        {
          path: '/AdvanceRecord',
          meta: {
            title: '预借记录',
            Mode:'3'
          },
          component: resolve => require(['../components/Reader/OverdueManagement/AdvanceRecord.vue'], resolve)
        },
        {
          path: '/EarlyWarningExpire',
          meta: {
            title: '预警到期',
            Mode:'3'
          },
          component: resolve => require(['../components/Reader/OverdueManagement/EarlyWarningExpire.vue'], resolve)
        },
        {
          path: '/purchasingManagement',
          meta: {
            title: '采购管理',
            Mode:'1'
          },
          component: resolve => require(['../components/Book/purchasingManagement.vue'], resolve)
        },
        {
          path: '/BookCataloging',
          meta: {
            title: '书籍编目',
            Mode:'1'
          },
          component: resolve => require(['../components/Book/BookCataloging.vue'], resolve)
        },
        {
          path: '/BookCollection',
          meta: {
            title: '书籍典藏',
            Mode:'2'
          },
          component: resolve => require(['../components/Book/BookCollection.vue'], resolve)
        },
        {
          path: '/damageCount',
          meta: {
            title: '损坏清点',
            Mode:'2'
          },
          component: resolve => require(['../components/Book/damageCount.vue'], resolve)
        },
        {
          path: '/checkDetails/:id',
          meta: {
            title: '损坏清点详情',
            Mode:'2'
          },
          component: resolve => require(['../components/Book/DamageIinventoryDetails.vue'], resolve)
        },
        {
          path: '/damageSet',
          meta: {
            title: '损坏管理',
            Mode:'6'
          },
          component: resolve => require(['../components/System/damage.vue'], resolve)
        },
        /*------ 财务管理 ------*/
        {
          path: '/rechargeSet',
          meta: {
            title: '充值管理',
            Mode:'5'
          },
          component: resolve => require(['../components/System/recharge.vue'], resolve)
        },
        {
          path: '/OverdueCostCirculation',
          meta: {
            title: '逾期费用记录',
            Mode:'5'
          },
          component: resolve => require(['../components/System/OverdueCostCirculation.vue'], resolve)
        },
        {
          path: '/Depositflowdirection',
          meta: {
            title: '押金流向',
            Mode:'5'
          },
          component: resolve => require(['../components/System/Depositflowdirection.vue'], resolve)
        },
        {
          path: '/logOut',
          meta: {
            title: '注销记录',
            Mode:'5'
          },
          component: resolve => require(['../components/System/logOut.vue'], resolve)
        },

        {
          path: '/refunds',
          meta: {
            title: '押金充值',
          },
          component: resolve => require(['../components/Finance/refunds.vue'], resolve)
        },
        {
          path: '/logoff',
          meta: {
            title: '注销页面'
          },
          component: resolve => require(['../components/Finance/logoff.vue'], resolve)
        },
        {
          path:'/logoffEnd',
          meta:{
            title:'注销结果',
            details:true
          },
          component:resolve => require(['../components/Finance/logoffEnd.vue'],resolve)
        },
        {
          path:'/refundsEnd/:card',
          meta:{
            juge:false,
            title:'充值结果'
          },
          component: resolve => require(['../components/Finance/refundsEnd.vue'], resolve)
        },
        {
          path: '/vacationSet',
          meta: {
            title: '寒暑假设置',
            Mode:'6'
          },
          component: resolve => require(['../components/System/vacation.vue'], resolve)
        }, {
          path: '/publisher',
          meta: {
            title: '文章发布'
          },
          component: resolve => require(['../common/test/editor.vue'], resolve)
        },
        {
          path: '/editor/:id',
          meta: {
            title: '文章编辑'
          },
          component: resolve => require(['../common/test/editorFix.vue'], resolve)
        },
        {
          path: '/article/:id',
          meta: {
            title: '文章详情'
          },
          component: resolve => require(['../components/System/article.vue'], resolve)
        },
        {
          path:'/wordBook',
          meta:{
            title:'数据字典',
            Mode:'6'
          },
          component: resolve => require(['../components/System/wordbook.vue'],resolve)
        }
      ]
    },
    {
      path: '/home',
      name: 'index',
      component: Index,
      children: [
      ]
    },
    {
      path: '*',
      component: Not
    },
    {
      path: '/test', // 一级路由 管理横条
      component: Test,
      children: [{
          path: '/systemMode',
          component: TestSystem,

        },

        {
          path: '/areaMode',
          component: TestArea,
          children: [{
              path: '/stoneroomInfo',
              component: StoneRoomInfo
            },
            {
              path: '/shelfBind',
              component: ShelfBind
            }
          ]
        },
        {
          path: '/bookMode',
          component: TestBook,
          children: [
          ]
        },
        {
          path: '/readerMode',
          component: TestReader,
          children: [{
              path: '/readeradmin',
              component: ReaderAdmin,
            },
            {
              path: '/LibBookInfo',
              component: LibBookInfo
            },
            {
              path: '/LibBookInfo/:id',
              component: LibDetail
            },
            {
              path: '/libBookType',
              component: LibBookType
            },
            {
              path: "/bookregistration",
              component: BookRegistration
            },
          ]
        }
      ]
    }
  ]
})
