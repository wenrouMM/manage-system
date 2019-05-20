<template>
  <div class="index">
    <el-container>
      <!-- 2.0 二层路由 导航模块 -->
      <el-aside class="nav" width="260px" style="background-color: #343B4A">
        <!-- 侧边栏主体 -->
        <el-menu
          class="content"
          router
          :default-active="this.$route.path"
          background-color="#343b4a"
          text-color="#fff"
          :uniqueOpened='true'
        >
          <!-- index就是跳转的路由 -->
          <!-- 选中之后的样式 -->
          <el-submenu index="readerCard">
            <template slot="title">

              <span>读者卡管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/readercardmanagement">读者卡信息</el-menu-item>
              <el-menu-item index="/readercardgrade">读者卡等级</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="self">
            <template slot="title">

              <span>借阅管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/loanrecorde">借阅记录</el-menu-item>
              <el-menu-item index="/loanhistory">借阅历史记录</el-menu-item>
              <el-menu-item index="/borrowingbooks">借书</el-menu-item>
              <el-menu-item index="/returnbooks">还书</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="recharge">
            <template slot="title">
              <span>充值管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/chargemoney">余额充值-</el-menu-item>
              <el-menu-item index="/depositrecord">押金记录</el-menu-item>
              <el-menu-item index="/paymentrecord">缴费记录*</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="outDate">
            <template slot="title">

              <span>逾期管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/overduerecords">逾期记录</el-menu-item>
              <el-menu-item index="/overduesetting">逾期设置*</el-menu-item>
              <el-menu-item index="/overduehistory">逾期历史记录</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="losttrust">
            <template slot="title">

              <span>失信管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/DishonestyRecords">失信记录</el-menu-item>
              <el-menu-item index="">失信设置*</el-menu-item>
              <el-menu-item index="/DishonestyHistory">失信历史记录</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="lose">
            <template slot="title">

              <span>遗失管理?</span>
            </template>
            <el-menu-item-group>
              <el-menu-item>暂定</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="interview">
            <template slot="title">

              <span>采访管理?</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/increditrecord">图书订购</el-menu-item>
              <el-menu-item index="/increditsetting">订购记录</el-menu-item>
              <el-menu-item index="/incredithistory">订购统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 0.0 面包屑路由导航部分 此处路由导航可以直接跳 属于动态添加渲染出的 -->
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
  padding-top: 20px;
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
