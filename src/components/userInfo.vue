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
          <div class="text"><i class="userIcon iconyonghuming"></i>用户名:</div>
          <div class="content">{{userName}}</div>
          <div class="fix" @click="userBtn"><i class="userIcon iconbianji"></i>修改</div>
        </div>
        <div class="rowList">
          <div class="text"><i class="userIcon icontubiao209"></i>邮箱:</div>
          <div class="content">{{userEmail}}</div>
        </div>

        <div class="rowList">
          <div class="text"><i class="userIcon icondianhua"></i>电话:</div>
          <div class="content">{{userPhone}}</div>
        </div>
        <div class="rowList">
          <div class="text"><i class="userIcon iconshenfenzheng"></i>身份证:</div>
          <div class="content">{{userCard}}</div>
        </div>
        <div class="rowList">
          <div class="text"><i class="userIcon iconmima"></i>密码:</div>
          <div class="content">******</div>
          <div class="fix" @click="pwdBtn"><i class="userIcon iconbianji"></i>修改</div>
        </div>
        <div class="rowList">
          <div class="text"><i style="fontSize:24px;" class="userIcon iconhuiyuandengji0101"></i>角色等级:</div>
          <div class="content">{{userGrade}}</div>
        </div>
      </div>
    </section>
    <div style="width: 650px;margin:0 auto " class="rowList1">
      <div class="text"><i style="fontSize:24px;" class="userIcon iconquanxian"></i>个人权限:</div>
      <div class="powerElement" id="powerZtree"><ul id="treeDemo" class="ztree"></ul></div>
    </div>
    <!-- 图片上传 -->
    <section class="uploadBox">
      <my-upload
        field="img"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="show"
        :width="100"
        :height="100"
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
          <p class="userHr"></p>
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
            <input type="password" v-model="oldInput" />
            <p class="userHr"></p>
          </div>
          <div class="data">
            <p>新密码</p>
            <input type="password" v-model="newInput" />
            <p class="userHr"></p>
          </div>
          <div class="data" style="margin-top: 30px">
            <p>确认密码</p>
            <input type="password" v-model="okInput" />
            <p class="userHr"></p>
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
import {uploadInt , PersonalCentre,editHeadPortrait ,bookLocation} from '@/request/api/base.js'
import myUpload from "vue-image-crop-upload";
export default {
  data() {
    return {
      setting: {
        edit: {
          enable: true,
          showRemoveBtn: false,
          addHoverBtn: false,
          removeTitle: "删除节点",
          showRenameBtn: false,
          editNameSelectAll: false
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: 0
          }
        },
        view: {
          showLine: false,
          showIcon: true,
          dblClickExpand: true,
          addDiyDom: this.addDiyDom,
          selectedMulti: true,
          addHoverDom: this.addHoverDom,
          removeHoverDom: this.removeHoverDom
        },
        callback: {
          onClick: this.zTreeOnClick, //节点点击事件
          onCollapse: this.onCollapse, //点击图标按钮节点 折叠后 异步加载子数据
          beforeRemove: this.zTreeBeforeRemove, //点击删除时，用来提示用户是否确定删除
          beforeEditName: this.beforeEditName, //点击编辑时触发，用来判断该节点是否能编辑
          onExpand: this.zTreeOnExpand,
          onCollapse: this.onCollapse,
          beforeExpand: this.zTreeBeforeExpand,
        }
      },
      zNodes: [], //ztree树加载的数据
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
      okInput:'',//确认密码
      id:'',
      userName:'',
      userEmail:'',
      userPhone:'',
      userCard:'',
      userPassword:'',
      userGrade:'',
      hidePassword:'',
      push:false
    };
  },
  created(){
    this.InitializationFun()
  },
  methods: {
    zTreeBeforeExpand(treeId, treeNode) {
      this.singlePath(treeNode);
      return true;
    },
    singlePath(currNode) {
      //console.log(currNode);
      //节点级别，即节点展开的等级，是爸爸辈还是儿子辈
      var cLevel = currNode.level;
      //这里假设id是唯一的
      var cId = currNode.id;
      //此对象可以保存起来，没有必要每次查找
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      /**
       * 展开的所有节点，这是从父节点开始查找（也可以全文查找）
       * 从当前节点的父节点开始查找，看有没有打开的节点，如果有则判断，若为同一级别的不同节点，则关闭，否则不关闭
       */
      var expandedNodes = treeObj.getNodesByParam("open", true, currNode.getParentNode());
      console.log(expandedNodes);
      for(var i = expandedNodes.length - 1; i >= 0; i--){
        var node = expandedNodes[i];
        var level = node.level;
        var id = node.id;
        if (cId != id && level == cLevel) {
          treeObj.expandNode(node, false);
        }
      }
    },
    //初始化信息
    InitializationFun(){
     /* return this.axios.get(PersonalCentre.userInfo).then((res)=>{
        console.log('初始化信息',res)
        this.id=res.data.row.id;
      })*/
      this.axios.get(PersonalCentre.userInfo).then((res)=>{
        console.log('初始化信息',res)
        if(res.data.state==true){
          this.id=res.data.row.id;
          this.freshArea(res.data.row.id)
          if(res.data.row.headerAddress){
            this.nomalHeader=uploadInt.preimg+res.data.row.headerAddress;
          }
          console.log('this.nomalHeader',this.nomalHeader)
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
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    freshArea(value) {
      this.axios.get(PersonalCentre.powerZtree,{
        params:{id:value}
      }).then((response) => {
        console.log('个人权限树',response)
        if(response.data.state==true){
          for (var item of response.data.rows) {
            //console.log('树',item)
            this.zNodes.push({
              id: item.id, //节点id
              pId: item.pid, //节点父id
              name: item.name, //节点名称
            });
          }
          //将数据渲染到ztree树
          $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
        }else{
          this.$message({
            message: response.data.msg,
            type: 'error'
          });
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
          this.InitializationFun()
          this.appear=false
          var token = res.data.row.authorization
          sessionStorage.setItem('token',token)
          this.$store.commit('setToken',token)
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
      this.oldInput = ''
      this.newInput = ''
      this.pwdDialog = true
    },
    //修改密码确定按钮
    editpasswordFun(){
      if(this.newInput===this.okInput){
        this.axios.put(PersonalCentre.editPassword,{password:this.oldInput,newPassword:this.newInput}).then((res)=>{
          console.log('修改密码后的结果',res)
          if(res.data.state==true){
            this.$message({
              message:'修改成功，三秒后返回重新登录',
              type: 'success'
            });
            this.pwdDialog=false
            setTimeout(()=>{
              this.$router.push({ path: "/" });
            },3000)
          }else{
            this.$message({
              message:res.data.msg,
              type: 'error'
            });
          }
        })
      }else{
        this.$message({
          message:'您的确认密码与新密码不相同',
          type: 'error'
        });
      }

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
      console.log('图片地址',jsonData.row)
      let imgFile=''
      imgFile=jsonData.row
      console.log("field: " + field);
      this.imgDataUrl = this.cutimgUrl;
      this.axios.put(editHeadPortrait,{id:this.id,headerAddress:imgFile})
      .then((res)=>{
        console.log('头像上传后返回的数据',res)
        var token = res.data.row.authorization
        sessionStorage.setItem('token',token)
        this.$store.commit('setToken',token)

      })
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
  height:360px;
}
.rowList {
  display: flex;
  flex-direction: row;
  height: 60px;
}
.rowList1 {
  display: flex;
  flex-direction: row;

}
.rowList1 .text {
  padding-left: 20px;
  width: 130px;
  text-align: left;
  line-height: 50px;
  color: #878787;
  font-size: 20px;
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
.userHr{
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
