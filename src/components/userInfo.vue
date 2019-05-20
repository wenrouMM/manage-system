<template>
  <div class="userInfo">
    <section class="backBtnBox">
      <div class="BtnBox">
        <i class="el-icon-back mr_20"></i>
        <span class="text">返回首页</span>
      </div>
    </section>

    <section class="headBox">
      <div class="headIcon">
        <span class="avatar"></span>
        <span class="edit">编辑</span>
      </div>
    </section>

    <section class="userInfoBox">
      <div class="infoList">
        <div class="rowList">
          <div class="text">邮箱:</div>
          <div class="content">a384713827@qq.com</div>
          <div class="editBtn"></div>
        </div>
        <div class="rowList">
          <div class="text">用户名:</div>
          <div class="content">a384713827@qq.com</div>
        </div>
        <div class="rowList">
          <div class="text">手机号码:</div>
          <div class="content">a384713827@qq.com</div>
        </div>
        <div class="rowList">
          <div class="text">身份证号码:</div>
          <div class="content">a384713827@qq.com</div>
        </div>
        <div class="rowList">
          <div class="text">角色等级:</div>
          <div class="content">a384713827@qq.com</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.backBtnBox {
  height: 60px;
  position: relative;
  background: #f4f7fd;
}
.BtnBox {
  position: absolute;
  left: 38px;
  top: 16px;
  width: 160px;
  height: 48px;
}
.headBox {
  width: 100%;
  height: 103px;
  background: #f4f7fd;
}
.headIcon {
  width: 72px;
  height: 72px;
  box-sizing: border-box;
  text-align: center;
  border: 3px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  margin: 0 auto;
  position: relative;
  cursor: pointer;
}
.avatar {
  border-radius: 50%;
  width: 100%;
  height: 100%;
  line-height: 72px;
  display: block;
  color: white;
  overflow: hidden;
}
.headIcon:hover .edit {
  display: block;
}
.edit {
  font-size: 18px;
  background: rgba(80, 80, 80, 0.7);
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  line-height: 72px;
  display: none;
  color: white;
  overflow: hidden;
}
.userInfoBox {
  width: 650px;
  margin: 0 auto;
  padding-top: 20px;
}
.infoList {
  padding: 8px 0;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  overflow-y: visible;
}
.rowList {
    display:flex;
    flex-direction: row;
    height: 46px;
}
.rowList .text{
  padding-left:20px;
  width:110px;
  text-align:left;
  line-height: 48px;
  color: #757575;
  font-size: 14px;
}
.content{
  font-size: 14px;
  color: #757575;
  line-height: 46px;
}
</style>
