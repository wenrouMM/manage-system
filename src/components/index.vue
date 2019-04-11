<template>
  <div class="index">
    <el-container style="height:100%">
      <!-- 头部组件 -->
      <!-- 1.0头部模块 -->
      <el-header class="headmode" style="font-size: 12px">
        <!-- logo模块 logo图片载入 附加路由调转至首页 -->
        <div class="logoNav">
          <div class="logoBox">
            <i class="logo"></i>
            <span class="text">图书馆管理平台</span>
          </div>
          <!-- 头部导航模块 路由添加尚未完成 active驻留模块未完成 -->
          <div class="navBar">
            <el-menu
              text-color="#fff"
              mode="horizontal"
              @select="handleSelect"
              background-color="#0096ff"
            >
              <el-menu-item index="1">读者模块</el-menu-item>
              <el-menu-item index="2">图书管理</el-menu-item>
              <el-menu-item index="3">区域管理</el-menu-item>
              <el-menu-item index="4">权限管理</el-menu-item>
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
              小猪
              <!-- 下拉点击路由跳转 -->
              <div class="userDrop">
                <span class="dropItem">个人中心</span>
                <span class="dropItem">切换账户</span>
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
            class="content"
            router
            :default-openeds="['1', '3']"
            background-color="#545c64"
            text-color="#fff"
          >
            <!-- index就是跳转的路由 -->
            <!-- 选中之后的样式 -->
            <el-menu-item index="powerMode">首页</el-menu-item>
            <NavMenu v-show="Mode==1" :navMenus="leftMenus.childs"></NavMenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavMenu from "../common/test/NavMenu";
export default {
  data() {
    return {
      Mode:1,
      leftMenus: {
        entity: null,
        childs: [
          {
            entity: { // index与路由属性的区别
              id: 1, // 自身ID用于 与下面的parentId应该是用来形成树结构的
              parentMenuId: 0, 
              name: "systemManage", // 用来做index路由跳转
              icon: "el-icon-message\r\n", // 用于自己选项的图标
              alias: "系统管理", // 名字
              state: "ENABLE", // 是否被渲染
              sort: 0, // 排序？
              value: null, // 路由地址
              type: "NONE", // 类型
              discription: "用于系统管理的菜单", // 描述
              createUserId: 1 // 生成用户的ID
            },
            childs: [
              {
                entity: {
                  id: 3,
                  parentMenuId: 1,
                  name: "authManage",
                  icon: "el-icon-loading",
                  alias: "权限管理",
                  state: "ENABLE",
                  sort: 0,
                  value: "/system/auth",
                  type: "NONE",
                  discription: "用于权限管理的菜单",
                  createUserId: 1
                },
                childs: null
              },
              {
                entity: {
                  id: 4,
                  parentMenuId: 1,
                  name: "roleManage",
                  icon: "el-icon-bell",
                  alias: "角色管理",
                  state: "ENABLE",
                  sort: 1,
                  value: "/system/role",
                  type: "LINK",
                  discription: "用于角色管理的菜单",
                  createUserId: 1
                },
                childs: null
              },
              {
                entity: {
                  id: 2,
                  parentMenuId: 1,
                  name: "menuManage",
                  icon: "el-icon-edit",
                  alias: "菜单管理",
                  state: "ENABLE",
                  sort: 2,
                  value: "/system/menu",
                  type: "LINK",
                  discription: "用于菜单管理的菜单",
                  createUserId: 1
                },
                childs: null
              },
              {
                entity: {
                  id: 5,
                  parentMenuId: 1,
                  name: "groupManage",
                  icon: "el-icon-mobile-phone\r\n",
                  alias: "分组管理",
                  state: "ENABLE",
                  sort: 3,
                  value: "/system/group",
                  type: "LINK",
                  discription: "用于分组管理的菜单",
                  createUserId: 1
                },
                childs: null
              }
            ]
          },
          {
            entity: {
              id: 6,
              parentMenuId: 0,
              name: "userManage",
              icon: "el-icon-news",
              alias: "用户管理",
              state: "ENABLE",
              sort: 1,
              value: null,
              type: "NONE",
              discription: "用于用户管理的菜单",
              createUserId: 1
            },
            childs: [
              {
                entity: {
                  id: 7,
                  parentMenuId: 6,
                  name: "accountManage",
                  icon: "el-icon-phone-outline\r\n",
                  alias: "帐号管理",
                  state: "ENABLE",
                  sort: 0,
                  value: "",
                  type: "NONE",
                  discription: "用于帐号管理的菜单",
                  createUserId: 1
                },
                childs: [
                  {
                    entity: {
                      id: 14,
                      parentMenuId: 7,
                      name: "emailManage",
                      icon: "el-icon-sold-out\r\n",
                      alias: "邮箱管理",
                      state: "ENABLE",
                      sort: 0,
                      value: "/content/email",
                      type: "LINK",
                      discription: "用于邮箱管理的菜单",
                      createUserId: 1
                    },
                    childs: null
                  },
                  {
                    entity: {
                      id: 13,
                      parentMenuId: 7,
                      name: "passManage",
                      icon: "el-icon-service\r\n",
                      alias: "密码管理",
                      state: "ENABLE",
                      sort: 1,
                      value: "/content/pass",
                      type: "LINK",
                      discription: "用于密码管理的菜单",
                      createUserId: 1
                    },
                    childs: null
                  }
                ]
              },
              {
                entity: {
                  id: 8,
                  parentMenuId: 6,
                  name: "integralManage",
                  icon: "el-icon-picture",
                  alias: "积分管理",
                  state: "ENABLE",
                  sort: 1,
                  value: "/user/integral",
                  type: "LINK",
                  discription: "用于积分管理的菜单",
                  createUserId: 1
                },
                childs: null
              }
            ]
          },
          {
            entity: {
              id: 9,
              parentMenuId: 0,
              name: "contentManage",
              icon: "el-icon-rank",
              alias: "内容管理",
              state: "ENABLE",
              sort: 2,
              value: null,
              type: "NONE",
              discription: "用于内容管理的菜单",
              createUserId: 1
            },
            childs: [
              {
                entity: {
                  id: 10,
                  parentMenuId: 9,
                  name: "classifyManage",
                  icon: "el-icon-printer",
                  alias: "分类管理",
                  state: "ENABLE",
                  sort: 0,
                  value: "/content/classify",
                  type: "LINK",
                  discription: "用于分类管理的菜单",
                  createUserId: 1
                },
                childs: null
              },
              {
                entity: {
                  id: 11,
                  parentMenuId: 9,
                  name: "articleManage",
                  icon: "el-icon-star-on",
                  alias: "文章管理",
                  state: "ENABLE",
                  sort: 1,
                  value: "/content/article",
                  type: "LINK",
                  discription: "用于文章管理的菜单",
                  createUserId: 1
                },
                childs: null
              },
              {
                entity: {
                  id: 12,
                  parentMenuId: 9,
                  name: "commentManage",
                  icon: "el-icon-share",
                  alias: "评论管理",
                  state: "ENABLE",
                  sort: 2,
                  value: "/content/comment",
                  type: "LINK",
                  discription: "用于评论管理的菜单",
                  createUserId: 1
                },
                childs: null
              }
            ]
          }
        ]
      },
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.Mode = key
      console.log(key, keyPath);
    }
  },
  components: {
    NavMenu
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
</style>
