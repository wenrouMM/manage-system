<template>
  <div id="index" class="index">
    <el-container style="height:100%">
      <!-- 头部组件 -->
      <!-- 1.0头部模块 -->
      <el-header class="headmode" style="font-size: 12px">
        <!-- logo模块 logo图片载入 附加路由调转至首页 -->
        <div class="logoNav">
          <div id="logoBox" class="logoBox">
            <img :src="logoUrl">
            <span @click="skip" class="Logotext">图书馆管理平台</span>
          </div>
          <!-- 头部导航模块 路由添加尚未完成 active驻留模块未完成 -->
          <div id="navBar" class="navBar">
            <el-menu
              text-color="#fff"
              mode="horizontal"
              @select="handleSelect"
              background-color="#0096ff"
              :default-active="Mode"
            >
              <el-menu-item id="circle" index="3">流通管理</el-menu-item>
              <el-menu-item id="reader" index="4">读者管理</el-menu-item>
              <el-menu-item id="collect" index="1">采编管理</el-menu-item>
              <el-menu-item id="reservation" index="2">典藏管理</el-menu-item>
              <el-menu-item id="finance" index="5">财务管理</el-menu-item>
              <el-menu-item id="system" index="6">系统管理</el-menu-item>
            </el-menu>
          </div>
        </div>

        <!-- 用户头像模块 点击交互功能尚未完成 小图标添加及相应功能 -->
        <div id="userName" class="headBox">
          <div class="headiconBox">
            <img :src="headSrc" class="avatarImg">
          </div>
          <div  class="userBox">
            <div  class="username">

              <span class="nameText" v-if="userLo.username!=null && userLo.username!='...'">{{userLo.username}}</span>

              <!-- 下拉点击路由跳转 -->
              <div class="userDrop">
                <span @click="toCenter" class="dropItem">个人中心</span>
                <router-link to="/borrowingbooks" tag="span" class="dropItem">书籍借阅</router-link>
                <router-link to="/returnbooks" tag="span" class="dropItem">书籍归还</router-link>
                <span @click="rechargeBtn" class="dropItem">押金充值</span>
                <span @click="cardBtn" class="dropItem">卡号注销</span>
                <span @click="loginOut" class="dropItem">退出</span>
              </div>
            </div>
            <!-- <i class="notice"></i>
            <i class="set"></i> -->
          </div>
        </div>
      </el-header>
      <!-- 2.0 二层路由 导航模块 -->
      <el-container>
        <el-aside class="nav" width="260px"  style="background-color: #343B4A;">
          <!-- 侧边栏主体 -->
          <el-menu
            @select="routerBox"
            class="content"
            router
            :default-active="this.$route.path"
            background-color="#343B4A"
            text-color="#fff"
          >
            <div class="block"></div>
            <el-menu-item  index="/indexTest"><i  class=" indexIcon indexIconMax iconxiazai45"></i><span style="lineHeight:21px;">首页</span></el-menu-item>
            <!--采编管理 -->
            <div class="navMenu" v-show="Mode == 1">
              <el-submenu index="3">
                <template slot="title">
                  <i style="fontSize:24px;" class=" indexIcon indexIconMax iconwp-sj-3"></i>
                  <span>书籍管理</span>
                </template>
                <el-menu-item index="/BookCataloging">书籍编目</el-menu-item>
                <el-menu-item index="/purchasingManagement">采购管理</el-menu-item>
              </el-submenu>
            </div>
            <!-- 典藏管理 -->
            <div class="navMenu" v-show="Mode == 2">
                <el-menu-item index="/publishhouse"><i class="indexIcon indexIconMax iconchubanshe"></i>图书出版社</el-menu-item>
                <!-- <el-menu-item index="/bookregistration">图书登记</el-menu-item> -->
                <el-menu-item index="/BookCollection"><i class="indexIcon iconshuji"></i>书籍典藏</el-menu-item>
                <el-menu-item index="/bookLocation"><i class="indexIcon indexIconMax iconico_yunyingguanli_biangengbangdingjihuashu"></i>图书位置绑定</el-menu-item>
                <el-menu-item index="/BookLocationInformation"><i class="indexIcon indexIconMax iconziliao"></i>图书位置信息</el-menu-item>
              <el-menu-item index="/damageCount"><i class="indexIcon iconbaosun"></i>损坏清点</el-menu-item>
            </div>
            <!-- 流通管理 -->
            <div class="navMenu" v-show="Mode == 3">
              <el-submenu index="userbrowrr">
                <template slot="title">
                  <i class="indexIcon indexIconMax iconjieyuechaxun"></i>
                  <span>借阅管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/borrowingbooks">书籍借阅</el-menu-item>
                  <el-menu-item index="/returnbooks">书籍归还</el-menu-item>
                  <el-menu-item index="/renew">书籍续借</el-menu-item>
                  <el-menu-item index="/bookDamage">书籍报损</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="bookIndex">
                <template slot="title">
                  <i  class=" indexIcon  iconliutong"></i>
                  <span>流通记录</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/loanrecorde">借书记录</el-menu-item>
                  <el-menu-item index="/loanhistory">还书记录</el-menu-item>
                  <!-- <el-menu-item index="/AdvanceRecord">预借记录</el-menu-item>
                  <el-menu-item index="/EarlyWarningExpire">预警到期</el-menu-item> -->
                  <el-menu-item index="/overduerecords">逾期记录</el-menu-item>
                  <el-menu-item index="/overduehistory">逾期历史记录</el-menu-item>
                  <el-menu-item index="/reimburse">报损记录</el-menu-item>
                  <el-menu-item index="/reimburseHistory">报损历史记录</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              
            </div>
            <!-- 读者管理 -->
            <div class="navMenu" v-show="Mode == 4">
              <!-- <el-menu-item index="/reader">读者管理</el-menu-item> -->
              <el-submenu index="readerCard">
                <template slot="title">
                  <i class="indexIcon indexIconMax iconduzheguanli"></i>
                  <span>读者卡管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/readercardmanagement">读者卡信息</el-menu-item>
                  <el-menu-item index="/readercardgrade">读者卡等级</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
            </div>
            <!-- 财务管理 -->
            <div class="navMenu" v-show="Mode == 5">
              <el-menu-item index="/rechargeSet"><i style="fontSize:24px;" class="indexIcon iconchongzhi"></i>充值管理</el-menu-item>
              <el-menu-item index="/logOut"><i style="fontSize:24px;" class="indexIcon iconzhuxiaojilu"></i>注销记录</el-menu-item>
              <!-- <el-menu-item index="/Depositflowdirection">押金流向</el-menu-item> -->
              <el-menu-item index="/OverdueCostCirculation"><i class="indexIcon indexIconMax iconyuqi"></i>逾期费用记录</el-menu-item>
            </div>
            <!-- 系统设置 -->
            <div class="navMenu" v-show="Mode == 6">
              <el-menu-item index="/guideTest"><i class="indexIcon indexIconMax iconyindaoxuqiu"></i>引导页</el-menu-item>
              <el-menu-item index="/menuInformation"><i class="indexIcon  indexIconMax iconcaidanguanli"></i>菜单管理</el-menu-item>
              <el-menu-item index="/roleInformation"><i class="indexIcon indexIconMax iconjiaoseguanli"></i>角色管理</el-menu-item>
              <el-menu-item index="/roleMenuElement"><i class="indexIcon indexIconMax iconquanxianguanli"></i>权限管理</el-menu-item>
              <el-menu-item index="/managerInformation"><i class="indexIcon indexIconMax iconyonghuguanli"></i>用户管理</el-menu-item>
              <el-menu-item index="/authTbManagerLoginLog"><i class="indexIcon indexIconMax icondenglujilu"></i>登录记录</el-menu-item>
              <el-menu-item index="/damageSet"><i class="indexIcon iconsunhuai"></i>损坏管理</el-menu-item>
              <el-menu-item index="/wordBook"><i class="indexIcon iconshujuzidian"></i>数据字典</el-menu-item>
              <el-menu-item index="/noticeSet"><i class="indexIcon indexIconMax icongonggao"></i>公告管理</el-menu-item>
              <el-menu-item index="/vacationSet"><i class="indexIcon indexIconMax iconjiaqi-"></i>假期设置</el-menu-item>
            </div>
            <!-- 选中之后的样式 -->
          </el-menu>
        </el-aside>
        <el-main>
          <Tags></Tags>

          <div class="space"></div>
          <transition name="fade-transform" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {uploadInt} from '@request/api/base.js'
import NavMenu from "../common/test/NavMenu";
import Tags from "../common/test/tags";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      Mode: '',
      navRouter: [],
      menuLo: [{}],
      userLo: null,
      nomalHeader: require("../base/img/normalHead.jpg"), // 默认头像
      logoUrl:require("../base/img/logo.png"),
      settingHead: "",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.Mode = key;
      sessionStorage.setItem("headIndex",key)
      console.log(key, keyPath);
    },
    routerBox(index, indexPath) {
      console.log(index);
      console.log(indexPath);
    },
    skip() {
      this.$router.push({ path: "/" });
    },
    toCenter(){
      this.$router.push({path:'/userInfo'})
    },
    loginOut() {
      this.$store.commit("removeToken");
      this.$store.commit("deleteUserInfo");
      this.$store.commit("deleteMenu");
      this.$router.push("/login");
    },
    rechargeBtn(){
      this.$router.push("/refunds");
    },
    cardBtn(){
      this.$router.push('/logoff')
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", ""); // 把斜杠都替换为空白
    },
    headSrc() {
      let src =
        this.settingHead === "" || this.settingHead === null
          ? this.nomalHeader
          : this.settingHead;
      return src;
    },
    ...mapGetters(["userInfo", "menu"])
  },
  components: {
    NavMenu,
    Tags
  },
  created() {
    let userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    this.userLo = userInfo;
    this.settingHead = uploadInt.preimg + userInfo.headerAddress
    this.Mode = sessionStorage.getItem("headIndex");
  },
  watch: {
    $route(newValue, oldValue) {
      if (newValue.fullPath == "/indexTest") {
        return;
      }
      if(!newValue.meta.Mode){
        console.log('????')
      }else{
        this.Mode = newValue.meta.Mode
        sessionStorage.setItem("headIndex",newValue.meta.Mode)
      }

      console.log('现在的路由',newValue.meta.Mode)
    }
  }
};
</script>

<style scoped>
html,
body,
#app {
  height: 100%;
}
.index {
  height: 100%;
}
.index .title {
  font-size: 14px;
  text-align: center;
  background-color: #545c64;
  padding: 20px 0;
  color: #fff;
}
.index .el-container {
  /*vh好用 100%不行*/
  min-height: 100vh;
}
/*====== 头部区域Column  ======*/
.index .headmode {
  background: #0096ff;
  color: #333;
  height: 70px !important;
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding-right: 20px !important;
  padding-left: 0px !important;
}
.headmode .logoNav {
  display: flex;
  flex-direction: row;
}
/*logo区域*/
/* 应该可以点击回到首页 */
.headmode .logoBox {
  width: 260px;
  color: #fff;
  font-size: 20px;
  font-family: MicrosoftYaHei;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 78px;
  cursor: pointer;
  background-color: #0096ff;
}
.headmode .logoBox .logo {
}
/*头部nav区域*/
.nav {
}
.block {
  height: 20px;
  background-color: #343b4a;
  width: 260px;
}
.headmode .navBar {
  display: flex;
  align-items: center;
}
.headmode .navBar .el-menu-item {
  width: 140px;
  height: 36px;
  background: #2bcbff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  position: relative;
}

/*修改默认样式 傻逼样式*/
.navBar .el-menu-item:hover {
  outline: 0 !important;
  color: #fff !important;
  background: #2bcbff !important;
  border-bottom: 2px solid #409eff!important;

}

.navBar .el-menu-item.is-active {
  color: #fff !important;
  background: #2bcbff !important;
}
.index .headmode .el-menu.el-menu--horizontal {
  border-bottom: none;
}
/* 头像区域 */

.headmode .headBox {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0096ff;
}
.headBox .headiconBox {
  width: 40px;
  height: 40px;
  border-radius: 50%;

  margin-right: 10px;
  cursor: pointer;
}
.headBox .headiconBox img{
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.headBox .userBox {
  display: flex;
  align-items: center;
}
.headBox .username {
  font-size: 18px;
  color: #ffffff;
  margin-right: 10px;
  padding-right: 25px;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 65px;
}
/* 下拉框 */
.headBox .username .userDrop {
  position: absolute;
  background-color: #fff;
  border-radius: 10px;
  text-align: center;
  color: #fff;
  top: 60px;
  right: 0px;
  display: none;
  z-index: 5;
}
.headBox .username:hover .userDrop {
  display: block;
}
.username .userDrop .dropItem {
  display: block;
  color: #878787;
  font-size: 14px;
  height: 35px;
  line-height: 35px;
  padding: 0 17px;
  min-width: 90px;
  box-sizing: border-box;
}
.username .userDrop .dropItem:last-child {
  border-radius: 0 0 10px 10px;
}
.username .userDrop .dropItem:hover {
  background-color: #0096ff;
  color: #fff;
}
.headBox .username::before {
  content: "";
  position: absolute;
  right: 0px;
  top: 28px;
  border: 8px solid transparent;
  border-top: 8px solid #fff;
  cursor: pointer;
}
/*====== body部分 ======*/
/*侧边导航部分*/
.navMenu {
  width: 260px;
}
.nav .iconpath {
  margin-right: 15px;
}
.nav .activeMenu::after {
  content: "";
  position: absolute;
  transition: all 0.5s;
}

.el-menu-item.activeMenu.is-active::after {
  content: "";
  position: absolute;
  top: 0px;
  right: -8px;
  width: 8px;
  height: 55px;
  background: #ffba00;
}
/*待定 改成动画移动效果*/
.nav .activeMenu:hover::after {
  content: "";
  position: absolute;
  top: 0px;
  right: -8px;
  width: 8px;
  height: 55px;
  background: #ffba00;
}
.nav .el-menu-item:hover {
  outline: 0 !important;
  color: #fff !important;
  background: #0096ff !important;
}
/*
.nav .el-menu-item:hover::after {
  content: "";
  position: absolute;
  top: 0px;
  right: -8px;
  width: 8px;
  height: 55px;
  background: #ffba00;
}
.nav .el-menu-item.is-active::after {
  content: "";
  position: absolute;
  top: 0px;
  right: -8px;
  width: 8px;
  height: 55px;
  background: #ffba00;
}
*/
.nav .el-menu-item.is-active {
  color: #fff !important;
  background: #0096ff !important;
}

.nav .el-menu-item{
  font-size: 16px;
  margin: 10px 0;
}
.nav .el-submenu__title{
  font-size: 16px;
}
/*====== 图标类 可能后期需要更换 ======*/
.logo {
  background-image: url("../base/img/normal/email-icon.png");
  background-repeat: no-repeat;
  width: 40px;
  height: 40px;
  margin-right: 9px;
  background-position-y: 10px;
}
.Logotext{
  line-height: 26px;
  margin-left: 10px;
}
.notice {
  background-image: url("../base/img/normal/email-icon.png");
  background-repeat: no-repeat;
  background-position-y: 0px;
  width: 28px;
  height: 22px;
  display: inline-block;
  margin-right: 15px;
}
.set {
  background-image: url("../base/img/normal/Layer.png");
  background-repeat: no-repeat;
  width: 28px;
  height: 22px;
  display: inline-block;
}
.space {
  background-color: #ebf7ff;
  height: 30px;
}

.move-enter-active,
.move-leave-active {
  transition: opacity 0.5s;
}

.move-enter,
.move-leave {
  opacity: 0;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
.nameText{
  display:inline-block;
  max-width: 200px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>

<style>

#navBar .el-menu-item{
  margin: 0 10px;
}
</style>