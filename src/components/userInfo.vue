<template>
  <div class="userInfo">
    <section class="backBtnBox">
      <div @click="back" class="BtnBox">
        <i class="el-icon-back iconSize"></i>
        <span class="text">返回首页</span>
      </div>
    </section>

    <section class="headBox">
      <div class="headIcon">
        <span class="avatar"  >
          <img v-if="imgDataUrl" class="avatarImg"  :src="imgDataUrl">
          <img class="avatarImg" :src="headSrc">
        </span>
        <span class="edit" @click="toggleShow">编辑</span>
      </div>
    </section>
    <!-- 用户信息 -->
    <section class="userInfoBox">
      <div class="infoList">
        <div class="rowList">
          <div class="text">用户名:</div>
          <div class="content">{{userName}}</div>
          <div class="fix" @click="userBtn">修改</div>
        </div>
        <div class="rowList">
          <div class="text">邮箱:</div>
          <div class="content">{{userEmail}}</div>
        </div>

        <div class="rowList">
          <div class="text">电话:</div>
          <div class="content">{{userPhone}}</div>
        </div>
        <div class="rowList">
          <div class="text">身份证:</div>
          <div class="content">{{userCard}}</div>
        </div>
        <div class="rowList">
          <div class="text">密码:</div>
          <div class="content">{{hidePassword}}</div>
          <div class="fix" @click="pwdBtn">修改</div>
        </div>
        <div class="rowList">
          <div class="text">角色等级:</div>
          <div class="content">{{userGrade}}</div>
        </div>
      </div>
    </section>
    <!-- 图片上传 -->
    <section class="uploadBox">
      <my-upload
        field="img"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="show"
        :width="300"
        :height="300"
        :url="uploadurl"
        img-format="png"
      ></my-upload>
    </section>
    <!-- 弹框风格 -->
    <section v-if="appear" @click="appear = false" class="dialog">
    </section>
    <section class="unsensitive" v-if="appear">
      <!-- 修改其他弹框 -->
      <div class="diaBox">
        <div class="title">
          <p class="userEdit">修改用户名</p>
        </div>
        <!-- <div class="backLoad">
          <p class="back">用户名</p>
          <p class="backContent">回显</p>
        </div> -->
        <div class="dialogContent">
          <p class="back">用户名</p>
          <input type="text" v-model="changeInput" />
          <p class="hr"></p>
        </div>
        <div class="foot">
          <div class="buttonBox">
            <span class="cancel" @click="appear = false">取消</span>
            <span class="confrim" @click="editnameFun">确定</span>
          </div>
        </div>
      </div>
      <!-- 修改密码弹框 -->
    </section>
    <!-- 重要信息弹框 -->
    <section v-if="pwdDialog" @click="pwdDialog = false" class="dialog">
    </section>
    <section class="sensitive" v-if="pwdDialog">
      <!-- 修改其他弹框 -->
      <div class="diaBox">
        <div class="title">
          <p class="userEdit">修改密码</p>
        </div>
        <!-- <div class="backLoad">
          <p class="back">用户名</p>
          <p class="backContent">回显</p>
        </div> -->
        <div class="dialogContent">
          <div class="data mb_30">
            <p class="">旧密码</p>
            <input type="text" v-model="oldInput" />
            <p class="hr"></p>
          </div>
          <div class="data">
            <p>新密码</p>
            <input type="text" v-model="newInput" />
            <p class="hr"></p>
          </div>
        </div>
        <div class="foot">
          <div class="buttonBox">
            <span class="cancel" @click="pwdDialog = false">取消</span>
            <span class="confrim" @click="editpasswordFun">确定</span>
          </div>
        </div>
      </div>
      <!-- 修改密码弹框 -->
    </section>
  </div>
</template>

<script>
import {uploadInt , PersonalCentre} from '@/request/api/base.js'
import myUpload from "vue-image-crop-upload";
export default {
  data() {
    return {
      uploadurl:uploadInt.headImg,
      nomalHeader: require("../base/img/normalHead.jpg"), // 默认头像
      settingHead: "",
      imgDataUrl: "",
      cutimgUrl:'',
      show: false,
      appear:false,
      pwdDialog:false, // 密码区
      changeInput:'',//正常输入框
      oldInput:'', //旧密码输入框
      newInput:'', // 新密码输入框
      id:'',
      userName:'',
      userEmail:'',
      userPhone:'',
      userCard:'',
      userPassword:'',
      userGrade:'',
      hidePassword:''
    };
  },
  mounted(){
    this.InitializationFun()
  },
  methods: {
    //初始化信息
    InitializationFun(){
      this.axios.get(PersonalCentre.userInfo).then((res)=>{
        console.log(res)
        this.id=res.data.row.id;
        this.userName=res.data.row.username;
        this.userEmail=res.data.row.email;
        this.userPhone=res.data.row.phone;
        this.userCard=res.data.row.idCard;
        this.userPassword=res.data.row.operationPassword;
        this.userGrade=res.data.row.fkRoleNames;
        this.hidePassword=''
        for(var i=0;i<=this.userPassword.length;i++){
          this.hidePassword+='*'
        }
      })
    },
    toggleShow() {
      this.show = !this.show;
    },
    // 重要弹框

    back() {
      this.$router.push({ path: "/" });
    },
    // 修改用户名
    userBtn(){
      this.appear = true
    },
    //修改用户名确定按钮
    editnameFun(){
      console.log("修改的数组",{id:this.id,username:this.changeInput})
      this.axios.put(PersonalCentre.editUsername,{id:this.id,username:this.changeInput}).then((res)=>{
        console.log('修改用户名结果',res)
        if(res.data.state==true){
          this.$message({
            message:res.data.msg,
            type: 'success'
          });
          //this.InitializationFun()
          this.userName=this.changeInput
          this.appear=false
        }else{
          this.$message({
            message:res.data.msg,
            type: 'error'
          });
        }
      })
    },
    // 修改密码
    pwdBtn(){
      this.oldInput = this.userPassword
      this.newInput = ''
      this.pwdDialog = true
    },
    //修改密码确定按钮
    editpasswordFun(){
      this.axios.put(PersonalCentre.editPassword,{password:this.oldInput,newPassword:this.newInput}).then((res)=>{
        console.log('修改密码后的结果',res)
        if(res.data.state==true){
          this.$message({
            message:res.data.msg,
            type: 'success'
          });
          //this.InitializationFun()
          this.hidePassword=''
          this.userPassword=this.newInput
          for(var i=0;i<=this.userPassword.length;i++){
            this.hidePassword+='*'
          }
          this.pwdDialog=false
        }else{
          this.$message({
            message:res.data.msg,
            type: 'error'
          });
        }
      })
    },
    /*------ 图片上传相关 ------*/
    cropSuccess(imgDataUrl, field) {
      console.log("-------- crop success --------");
      console.log('裁剪成功的imgData',imgDataUrl)
      console.log('裁剪成功的field',field)
      this.cutimgUrl = imgDataUrl
    },
    cropUploadSuccess(jsonData, field) {
      console.log("-------- upload success --------");
      console.log(jsonData);
      console.log("field: " + field);
      this.imgDataUrl = this.cutimgUrl;
    },
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log(status);
      console.log("field: " + field);
    },

  },
  components:{
    myUpload
  },
  computed: {
    headSrc() {
      let src =
        this.settingHead === "" || this.settingHead === null
          ? this.nomalHeader
          : this.settingHead;
      return src;
    }
  }
};
</script>

<style scoped>
.userInfo {
  background-image: url("../base/img/userInfo/bgUser.jpg");
  min-height: 100vh;
}
.backBtnBox {
  height: 60px;
  position: relative;
}
.BtnBox {
  position: absolute;
  left: 38px;
  top: 16px;
  padding: 0 10px;
  cursor: pointer;
  height: 48px;
  line-height: 48px;
  font-size: 20px;
}
.iconSize {
  font-size: 20px;
}
.BtnBox:hover {
  background: rgba(0, 0, 0, 0.1);
}
.headBox {
  width: 100%;
  height: 103px;
  margin-bottom: 64px;
}
.fix{
  line-height: 60px;
  font-size: 20px;
  cursor: pointer;
}
.fix:hover{
  color: #878787;
}
.headIcon {
  width: 140px;
  height: 140px;
  box-sizing: border-box;
  text-align: center;

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
.avatarImg {
  width: 140px;
  height: 140px;
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
  line-height: 130px;
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
  display: flex;
  flex-direction: row;
  height: 60px;
}
.rowList .text {
  padding-left: 20px;
  width: 146px;
  text-align: left;
  line-height: 60px;
  color: #878787;
  font-size: 20px;
}
.content {
  font-size: 20px;
  color: #878787;
  line-height: 60px;
  width: 300px;
}
/*--- 弹框 ---*/
.dialog{
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 4;
  background-color: rgba(0, 0, 0, .1);
  top: 0;
}
.diaBox{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  width: 605px;
  padding-top:30px;
	padding-bottom: 30px;
	background-color: #ffffff;
	box-shadow: 0px 0px 21px 0px
    rgba(134, 185, 255, 0.4);
  box-sizing: border-box;
}
.diaBox .title{
  padding-left: 55px;
  margin-bottom: 32px;
}
.diaBox .backLoad{
  padding-left: 55px;
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.6);
}
.userEdit{
  font-size: 22px;
  color: #3c3c3c;
}
.dialogContent{
  padding: 0 55px;
  margin-bottom: 55px;
}
.dialogContent .back{
  font-size: 16px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
}
.dialogContent input{
      -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: none;
    border: none;
    background: none;
    border-radius: 0 0 0 0;
    box-shadow: none;
    display: block;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 32px;
    font-style: inherit;
    font-variant: inherit;
    font-weight: inherit;
    font-stretch: inherit;
    font-size: inherit;
    color: rgba(0,0,0,.87);
    font-family: inherit;
    position: relative;
}
.hr{
  width: 100%;
  background-color: #bde2ff;
  height: 1px;
}
.mb_10{
  margin-bottom: 10px;
}
.diaBox .foot{
  padding: 0 55px;
  font-size: 18px;
}
.diaBox .foot .buttonBox{
  text-align: right;
}
.cancel{
  cursor: pointer;
  margin-right: 20px;
}
.cancel:hover{
  color: #91959b;
}
.confrim{
  cursor: pointer;
  color: #0072ff;
  line-height: 24px;
}
.confrim:hover{
  color:#81b0e9
}
</style>
