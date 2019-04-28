<template>
  <div class="index">
    <el-container style="height:100%">
      <!-- 头部组件 -->
      <!-- 1.0头部模块 -->
      <el-header class="headmode" style="font-size: 12px">
        <!-- logo模块 logo图片载入 附加路由调转至首页 -->
        <div class="logoNav">
          <div class="logoBox">
            <i class="logo el-icon-date"></i>
            <span @click="skip" class="text">图书馆管理平台</span>
          </div>
          <!-- 头部导航模块 路由添加尚未完成 active驻留模块未完成 -->
          <div class="navBar">
            <el-menu
              text-color="#fff"
              mode="horizontal"
              router
              :default-active="onRoutes"
              @select="handleSelect"
              background-color="#0096ff"
            >
              <el-menu-item index="readerMode">藏馆系统</el-menu-item>
              <el-menu-item index="bookMode">图书管理</el-menu-item>
              <el-menu-item index="areaMode">区域管理</el-menu-item>
              <el-menu-item index="powerMode">权限管理</el-menu-item>
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
              <span>{{userInfo.username}}</span>
              <!-- 下拉点击路由跳转 -->
              <div class="userDrop">
                <span class="dropItem">个人中心</span>
                <span class="dropItem" @click="loginOut">切换账户</span>
              </div>
            </div>
            <i class="notice"></i>
            <i class="set"></i>
          </div>
        </div>
      </el-header>
      <!-- 2.0 二层路由 导航模块 -->
      <el-container>
        <router-view></router-view>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  methods: {
    skip() {
      this.$router.push({path:'/powerMode'})
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    loginOut() {
      this.$store.commit("logOut");
      this.$router.push("/login");
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", ""); // 把斜杠都替换为空白
    },
    ...mapGetters(["userInfo"])
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
  width: 100%;
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
  margin-right: 10px;
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
</style>
