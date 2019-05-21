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
import LoanRecorde from '../components/Reader/LoanManagement/loanRecords.vue'
import LoanHistory from '../components/Reader/LoanManagement/loanHistory.vue'
import BorrowingBooks from '../components/Reader/LoanManagement/borrowingBooks.vue'
import BorrowingStatus from '../components/Reader/LoanManagement/borrowingStatus.vue'
import ReturnBooks from '../components/Reader/LoanManagement/returnBooks.vue'
import ReturnStatus from '../components/Reader/LoanManagement/returnStatus.vue'
import ChargeMoney from '../components/Reader/RechargeManagement/chargeMoney.vue'
import DepositRecord from '../components/Reader/RechargeManagement/depositRecord.vue'
import PaymentRecord from '../components/Reader/RechargeManagement/paymentRecord.vue'
import DepositDetails from '../components/Reader/RechargeManagement/depositDetails.vue'
import PaymentDetails from '../components/Reader/RechargeManagement/paymentDetails.vue'
import OverdueRecords from '../components/Reader/OverdueManagement/overdueRecords.vue'
import OverdueHistory from '../components/Reader/OverdueManagement/overduehistory.vue'
import OverdueSetting from '../components/Reader/OverdueManagement/overduesettings.vue'
import IncreditRecord from '../components/Reader/IncreditManagement/increditRecord.vue'
import IncreditHistory from '../components/Reader/IncreditManagement/incredithistory.vue'
import IncreditSetting from '../components/Reader/IncreditManagement/increditsettings.vue'
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

        // 4.0 读者管理
        {
          path: '/readercardmanagement',
          meta:{
            title:'读者卡管理'
          },
          component: ReaderCardManagement,
        },
        {
          path: '/readercardgrade',
          component: ReaderCardGrade,
          meta:{
            title:'读者卡等级'
          }
        },
        {
          path: '/overduerecords',
          component: OverdueRecords,
          meta:{
            title:'逾期记录'
          }
        },
        {
          path: "/overduehistory",
          component: OverdueHistory,
          meta:{
            title:'逾期历史记录'
          }
        },
        {
          path: '/getcard',
          name: "GetCard",
          component: GetCard,
          meta:{
            title:'办卡'
          }
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
          path: '/menuInformation',
          meta: {
            title: '菜单管理'
          },
          component: Menu
        },
        {
          path: '/roleMenuElement',
          meta: {
            title: '权限管理'
          },
          component: PowerControl
        },
        {
          path: '/roleInformation',
          meta: {
            title: '角色管理'
          },
          component: UserRole
        },
        {
          path: '/managerInformation',
          meta: {
            title: '用户管理'
          },
          component: UserManage
        },
        {
          path: '/authTbManagerLoginLog',
          meta: {
            title: '登录记录'
          },
          component: LoginRecord
        },
        {
          path: '/noticeSet',
          meta: {
            title: '公告管理'
          },
          component: resolve => require(['../components/System/notice.vue'], resolve)
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
          path: '/bookLocation',
          component: bookLocation
        },
        {
          path: '/libBookType',
          component: LibBookType
        },
        {
          path: "/bookregistration",
          component: BookRegistration
        },
        {
          path: '/publishhouse',
          component: BookPublishHouse
        },
        {
          path: '/BookCollection',
          meta: {
            title: '书籍典藏'
          },
          component: resolve => require(['../components/Book/BookCollection.vue'], resolve)
        },
        {
          path: '/damageCount',
          meta: {
            title: '损坏清点'
          },
          component: resolve => require(['../components/Book/damageCount.vue'], resolve)
        },
        {
          path: '/damageSet',
          meta: {
            title: '损坏管理'
          },
          component: resolve => require(['../components/System/damage.vue'], resolve)
        },
        {
          path: '/rechargeSet',
          meta: {
            title: '充值管理'
          },
          component: resolve => require(['../components/System/recharge.vue'], resolve)
        },
        {
          path: '/dataDictionary',
          meta: {
            title: '数据字典'
          },
          component: resolve => require(['../components/System/dataDictionary.vue'], resolve)
        },
        {
          path: '/refunds',
          meta: {
            title: '充值管理'
          },
          component: resolve => require(['../components/System/refunds.vue'], resolve)
        },
        {
          path: '/vacationSet',
          meta: {
            title: '寒暑假设置'
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
              path: '/loanrecorde',
              component: LoanRecorde,
            },
            {
              path: '/loanhistory',
              component: LoanHistory,
            },
            /*
            {
              path: "/borrowingbooks",
              component: BorrowingBooks
            },
            {
              path: "/borrowingstatus",
              component: BorrowingStatus
            },
            {
              path: "/returnbooks",
              component: ReturnBooks
            },
            {
              path: "/returnstatus",
              component: ReturnStatus
            },
            */
            {
              path: "/chargemoney",
              component: ChargeMoney
            },
            {
              path: "/depositrecord",
              component: DepositRecord
            },
            {
              path: "/paymentrecord",
              component: PaymentRecord
            },
            {
              path: '/depositdetails',
              component: DepositDetails
            },
            {
              path: "/paymentdetails",
              component: PaymentDetails
            },
            {
              path: "/overduesetting",
              component: OverdueSetting
            },
            {
              path: "/increditrecord",
              component: IncreditRecord
            },
            {
              path: '/incredithistory',
              component: IncreditHistory
            },
            {
              path: '/IncreditSetting',
              component: IncreditSetting
            },
            {
              path: '/DishonestyRecords',
              component: DishonestyRecords
            },
            {
              path: '/DishonestyHistory',
              component: DishonestyHistory
            },
          ]
        }
      ]
    }
  ]
})
