<template>
  <div class="index">
    <el-container>
      <!-- 2.0 二层路由 导航模块 -->
      <el-aside class="nav" width="260px" style="background-color: #343B4A">
        <!-- 侧边栏主体 -->
        <el-menu
          class="content"
          router
          :default-openeds="['1', '3']"
          background-color="#545c64"
          text-color="#fff"
        >
          <!-- index就是跳转的路由 -->
          <!-- 选中之后的样式 -->

          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item class="activeMenu" index="userManage">
            <i class="el-icon-message iconpath"></i>用户管理
          </el-menu-item>
          <el-menu-item class="activeMenu" index="userlist">角色管理</el-menu-item>
          <el-menu-item class="activeMenu" index="passwordRediret">权限管理</el-menu-item>
          <el-menu-item class="activeMenu" index="/">菜单管理</el-menu-item>
          <el-menu-item class="activeMenu" index="LoginRecord">登录记录</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
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
</style>
