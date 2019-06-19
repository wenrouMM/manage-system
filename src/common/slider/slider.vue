<template>
  <div id="slideBar">
    <el-menu
      
      class="content"
      router
      :default-active="this.$route.path"
      background-color="#343B4A"
      text-color="#fff"
      
      :unique-opened="true"
    >
      <el-menu-item index="/publishhouse">
        <i class="indexIcon indexIconMax iconchubanshe"></i>图书出版社
      </el-menu-item>
      <el-menu-item index="/BookCollection">
        <i class="indexIcon iconshuji"></i>书籍典藏
      </el-menu-item>
      <el-menu-item index="/bookLocation">
        <i class="indexIcon indexIconMax iconico_yunyingguanli_biangengbangdingjihuashu"></i>图书位置绑定
      </el-menu-item>
      <el-menu-item index="/BookLocationInformation">
        <i class="indexIcon indexIconMax iconziliao"></i>图书位置信息
      </el-menu-item>
      <el-menu-item index="/shelfBind">
        <i class="indexIcon indexIconMax iconcengji"></i>层架绑定
      </el-menu-item>
      <el-menu-item index="/stoneroomInfo">
        <i class="indexIcon indexIconMax iconkufangguanli"></i>库房管理
      </el-menu-item>
      <el-menu-item index="/damageCount">
        <i class="indexIcon iconbaosun"></i>损坏清点
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
</style>
