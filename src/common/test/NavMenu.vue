<template>
  <div class="navMenu">
  <!-- -->
    <label v-for="(navMenu,index) in navMenus" :key="index">
      <!-- 第一个出口 出口条件 没有子数据的时候 判定渲染 -->
       <!-- data传递意义不明 -->
      <el-menu-item
        v-if="navMenu.roleModularMenus ==null"
        :key="index"
        :data="navMenu"
        :index=" '/' + navMenu.menuCode"
        :route="navMenu.menuCode"
      >
      <!-- 
        <i :class="navMenu.entity.icon"></i>
      -->
        <span slot="title" class="item_title">{{navMenu.menuName}}</span>
      </el-menu-item>

      <!-- 多级递归菜单的入口 -->
      <el-submenu
        v-if="navMenu.roleModularMenus"
        :key="index"
        :data="navMenu"
        :index="navMenu.menuCode"
      >
        <template slot="title">
          <!--
          <i :class="navMenu.entity.icon"></i>
          -->
          <span class="item_title"> {{navMenu.menuName}}</span>
        </template>
        <!-- 入口条件 只要有子数据就进行递归  同时子数据没有也是出口条件-->
        <NavMenu :navMenus="navMenu.roleModularMenus"></NavMenu>
      </el-submenu>
     
    </label>
  </div>
</template>

<script>
export default {
  name: 'NavMenu',
  props: ["navMenus"],
  mounted() {
    console.log(this.navMenus);
  }
};
</script>

<style scoped>
/*
出口条件的确认  对最底层的数据做操作 
1.确认出口条件 这里表现为是否仍存在子数据
递归组件的书写流程
接收数据 对数据进行最底层的使用 即只有一层child和没有child的条件编写
此处 第一层是没有child的时候 最底层的一次渲染处理
1.此处做了一次筛选 如果给的数据就是好的 就不必做筛选 el-menu-item是最底层的数据渲染处理结果
2.对多加一层父数据做处理 此处表现其实还是做了一层判定 根据自己是不是父组件来多附加一些事物
最终还是转化映射成最底层数据
递归的处理 最底层与父层的映射关系 根节点和最后一层节点的映射
而映射还需要加一个条件判定是否是最底层元素了
如果是最底层则执行最底层的渲染结果
如果不是 则继续执行递归 把子元素提交后在做一次判定
上面出口的两次if 就是递归的两个if判定
*/
</style>

