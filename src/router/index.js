import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import UserAdd from '@/components/useradd'
import Userlist from '@/components/userlist'
import Home from '@/components/home'
import UserManage from '../components/Power/userManage.vue'
import UserRole from '../components/Power/userRole.vue'
import PowerControl from '../components/Power/powerControl.vue'
import Menu from '../components/Power/menu.vue'
import LoginRecord from '../components/Power/loginrecord.vue'

import PasswordRedirect from '../components/passwordRedirect.vue'
import Test from '../common/test/test.vue'
import Test2 from '../common/test/test2.vue'
import TestBook from '../common/test/testBook.vue'
import BookType from '../components/Book/BookManage/bookType.vue'
import BookInfo  from '../components/Book/BookManage/bookInfo.vue'
import BookPublishHouse from '../components/Book/BookManage/BookPublishingHouse.vue'
import LibBookInfo from '../components/Book/libraryManage/libBookInfo.vue'
import LibBookType from '../components/Book/libraryManage/libBookType'
import LibInfo from '../components/Book/libraryManage/libInfo.vue'
import TestArea from '../common/test/testArea.vue'
import StoneRoomInfo from '../components/Area/areaManage/stoneroomaInfo.vue'
import ShelfBind from '../components/Area/areaManage/shelfBind'
import TestReader from '../common/test/testReader.vue'
import ReaderAdmin from '../components/Reader/ReaderManagement/readeradmin.vue'
import GetCard from '../components/Reader/ReaderManagement/getAcard.vue'
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
Vue.use(Router)
// 暴露一个router对象
export default new Router({
  routes: [
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
              path:'/bookpublishhouse',
              component:BookPublishHouse
            },
            {
              path:'/libBookInfo',
              component:LibBookInfo
            },
            {
              path:'/libBookType',
              component:LibBookType
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
              name:"GetCard",
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
            },
            {
              path:'/loanrecorde',
              component:LoanRecorde,
            },
            {
              path:'/loanhistory',
              component:LoanHistory,
            },
            {
              path:"/borrowingbooks",
              component:BorrowingBooks
            },
            {
              path:"/borrowingstatus",
              component:BorrowingStatus
            },
            {
              path:"/returnbooks",
              component:ReturnBooks
            },
            {
              path:"/returnstatus",
              component:ReturnStatus
            },
            {
              path:"/chargemoney",
              component:ChargeMoney
            },
            {
              path:"/depositrecord",
              component:DepositRecord
            },
            {
              path:"/paymentrecord",
              component:PaymentRecord
            },
            {
              path:'/depositdetails',
              component:DepositDetails
            },
            {
              path:"/paymentdetails",
              component:PaymentDetails
            },
            {
              path:'/overduerecords',
              component:OverdueRecords
            },
            {
              path:"/overduehistory",
              component:OverdueHistory
            },
            {
              path:"/overduesetting",
              component:OverdueSetting
            },
            {
              path:"/increditrecord",
              component:IncreditRecord
            },
            {
              path:'/incredithistory',
              component:IncreditHistory
            },
            {
              path:'/increditsetting',
              component:IncreditSetting
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
