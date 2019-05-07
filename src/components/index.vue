<template>
  <div class="index">
    <el-container v-if="menu.length" style="height:100%">
      <!-- 头部组件 -->
      <!-- 1.0头部模块 -->
      <el-header class="headmode" style="font-size: 12px">
        <!-- logo模块 logo图片载入 附加路由调转至首页 -->
        <div class="logoNav">
          <div class="logoBox">
            <i class="logo"></i>
            <span @click="skip" class="text">图书馆管理平台</span>
          </div>
          <!-- 头部导航模块 路由添加尚未完成 active驻留模块未完成 -->
          <div class="navBar">
            <el-menu
              text-color="#fff"
              mode="horizontal"
              @select="handleSelect"
              background-color="#0096ff"
              v-if="menuLo.length"
            >
              <el-menu-item :index="num"   v-for="(item,num) of menuLo" :key="num">{{item.menuName}}</el-menu-item>

            </el-menu>
          </div>
        </div>

        <!-- 用户头像模块 点击交互功能尚未完成 小图标添加及相应功能 -->
        <div class="headBox">
          <div class="headiconBox">
            <img src>
          </div>
          <div class="userBox">
            <div class="username">
              <span v-if="userLo.username!=null && userLo.username!=''">{{userLo.username}}</span>
              <!-- 下拉点击路由跳转 -->
              <div class="userDrop">
                <span class="dropItem">个人中心</span>
                <span @click="loginOut" class="dropItem">切换账户</span>
              </div>
            </div>
            <i class="notice"></i>
            <i class="set"></i>
          </div>
        </div>
      </el-header>
      <!-- 2.0 二层路由 导航模块 -->
      <el-container>
        <el-aside class="nav" width="260px" style="background-color: #343B4A">
          <!-- 侧边栏主体 -->
          <el-menu
            @select="routerBox"
            class="content"
            router
            :default-active="onRoutes"
            background-color="#545c64"
            text-color="#fff"
          >
            <!-- index就是跳转的路由 -->
            <!-- 选中之后的样式 -->
            <NavMenu v-if="menu.length" v-show="Mode==0" :navMenus="menuLo[0].roleModularMenus"></NavMenu>
            <NavMenu v-if="menu.length" v-show="Mode==1" :navMenus="menuLo[1].roleModularMenus"></NavMenu>
            <NavMenu v-if="menu.length" v-show="Mode==2" :navMenus="menuLo[2].roleModularMenus"></NavMenu>
            <NavMenu v-if="menu.length" v-show="Mode==3" :navMenus="menuLo[3].roleModularMenus"></NavMenu>
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
import NavMenu from "../common/test/NavMenu";
import Tags from "../common/test/tags";
import {mapGetters} from "vuex"
export default {
  data() {
    return {
      Mode: 0,
      navRouter: [],
      menuLo:[],
      userLo:null
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.Mode = key;
      console.log(key, keyPath);
    },
    routerBox(index, indexPath) {
      console.log(index);
      console.log(indexPath);
    },
    skip() {
      this.$router.push({path:'/'})
    },
    loginOut() {
      this.$store.commit("removeToken");
      this.$store.commit('deleteUserInfo')
      this.$store.commit('deleteMenu')
      this.$router.push("/login");
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", ""); // 把斜杠都替换为空白
    },
    ...mapGetters([
      'userInfo',
      'menu'
    ])

  },
  components: {
    NavMenu,
    Tags
  },
  created(){
    let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    let menu = JSON.parse(sessionStorage.getItem('menu'))
    this.userLo = userInfo
    this.menuLo = menu
  }
};
</script>
<style>
</style>

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
}
.headmode .logoBox .logo {
}
/*头部nav区域*/
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
}
.headBox .headiconBox {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  margin-right: 10px;
  cursor: pointer;
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
  left: -30px;
  display: none;
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
.index .nav {
  background-color: #cc85d9;
  width: 100%;
}

.index .el-menu {
  border-right: none;
}
.index .el-aside {
  color: #fff;
  overflow: visible;
}
.nav .el-menu {
  background: #343b4a !important;
}
.nav .el-menu-item {
  background: #343b4a !important;
  text-align: center;
  height: 55px;
  font-size: 18px;
  margin-bottom: 25px;
}
.nav .iconpath {
  margin-right: 15px;
}
.nav .activeMenu::after {
  content: "";
  position: absolute;
  transition: all 0.5s;
}
/*当初这里是被显示挡住了*/
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
.nav .el-menu-item.is-active {
  color: #fff !important;
  background: #0096ff !important;
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
    transition: opacity .5s;
}

.move-enter,
.move-leave {
    opacity: 0;
}

.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>

