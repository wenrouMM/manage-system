<template>
  <div class="index">
    <el-container>
      <!-- 2.0 二层路由 导航模块 -->
      <el-aside class="nav" width="260px" style="background-color: #343B4A">
        <!-- 侧边栏主体 -->
        <!-- bug其一 选中状态的处理 -->
        <el-menu
          class="content"
          router
          background-color="#343b4a"
          text-color="#fff"
          :default-active="this.$route.path"
        >
          <!-- index就是跳转的路由 -->
          <!-- 选中之后的样式 -->
          <el-menu-item index="powerMode">首页</el-menu-item>
          <el-submenu index="4" >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>图书管理</span>
            </template>

              <el-menu-item index="/bookType">图书类型</el-menu-item>
              <el-menu-item index="/bookInfo">图书信息</el-menu-item>
              <el-menu-item index="/bookpublishhouse">图书出版社</el-menu-item>

          </el-submenu>
          <el-submenu background-color="#545c64" index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>藏馆管理</span>
            </template>

              <el-menu-item index="libInfo">藏馆信息</el-menu-item>
              <el-menu-item index="libBookInfo">馆内图书信息</el-menu-item>
              <el-menu-item index="libBookType">馆内图书类型</el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 0.0 面包屑路由导航部分 此处路由导航可以直接跳 属于动态添加渲染出的 -->
        <div class="routerBox" v-if="navRouter">
          <span class="routerButton circularButton labelActive">
            用户管理
            <i class="Iconerror">x</i>
          </span>
        </div>
        <div class="space"></div>
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
      activeIndex2: "1",
      navRouter: true // 点击到首页的时候清空这个数组 面包屑导航
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
/*====== 路由导航部分 ======*/
.routerBox {
  background-color: #fff;
  min-height: 70px;
  width: 100%;
  padding: 0 30px;
  align-items: center;
  display: flex;
  box-sizing: border-box;
}
.routerButton {
  margin-right: 30px;
}
.space {
  background-color: #ebf7ff;
  height: 30px;
}
.labelActive {
  background-color: #0096ff;
  color: #fff;
  border: none;
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
.el-submenu__title{
  background: #343b4a !important;
}
.el-menu{
  background: #343b4a !important;
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
