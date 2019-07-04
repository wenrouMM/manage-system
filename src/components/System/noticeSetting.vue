<template>
  <div id="video" class="video">
    <section class="pagetitle">
      <div class="titleName">馆内公告设置</div>
    </section>
    <div class="videoBox">
      <section class="uploadBox">
        <div class="nomal-Box noticeForm">
          <el-form  :model="formLabelAlign" style="margin-right: 40px">
            <el-form-item label="公告标题 :" label-width="80px">
              <el-input v-model="formLabelAlign.title" maxlength="40" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="公告内容 :" label-width="80px">
              <el-input
                type="textarea"
                :rows="18"
                maxlength="300"
                show-word-limit
                resize="none"
                v-model="formLabelAlign.content">
              </el-input>
            </el-form-item>
            <el-form-item class="buttonStyle">
              <el-button type="primary" class="buttonBlue" @click="publishBut()">发 布 </el-button>
              <el-button type="info"  class="buttonGray" @click="cancelBut()">取 消 </el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="ListBox">
        <div style="display: flex;flex-direction: column">
          <p style="color: #878787">发布公告列表</p>
          <div style="margin-top: 20px;height: 550px;">
            <div class="flexLayout NoticeContent" v-for="(item,index) of showNotice" :key="index">
              <div style="display: flex;flex-direction: column;width: 730px ">
                <p style="color: rgba(69,71,77,1)">【{{item.title}}】</p>
                <p style="margin-top: 10px;color: #878787;">{{item.content}}</p>
              </div>
              <p id="deleteBut" @click="deleteBut(item.id)">删除</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  import { libNotice } from "@request/api/base.js";
  export default {
    data() {
      return {
        formLabelAlign:{
          title:"", //标题
          content:"" //内容
        },
        showNotice:[]
      };
    },
    computed:{

    },
    created(){
      this.initializationFun()
    },
    methods: {
      //页面初始化数据
      initializationFun(){
        this.axios.get(libNotice.select).then((res)=>{
          console.log('初始化返回的公告数据',res)
          if(res.data.state==true){
            //this.$message.success(res.data.msg);
            this.showNotice=res.data.row
          }
        })
      },
      //发布的按钮
      publishBut(){
        if(this.formLabelAlign.title==""){
          this.$message.error('请填写公告标题');
        }else if(this.formLabelAlign.content==""){
          this.$message.error('请填写公告内容');
        }else if(this.formLabelAlign.content&&this.formLabelAlign.title){
          this.axios.post(libNotice.add,{
            title:this.formLabelAlign.title,
            content:this.formLabelAlign.content
          }).then((res)=>{
            console.log('添加后返回的数据',res)
            if(res.data.state==true){
              this.$message.success(res.data.msg);
              for(const item in this.formLabelAlign){
                this.formLabelAlign[item]=""
              }
              this.initializationFun()
            }else{
              this.$message.error(res.data.msg);
            }
          })
        }
      },
      //取消的按钮
      cancelBut(){
        for(const item in this.formLabelAlign){
          this.formLabelAlign[item]=""
        }
      },
      //删除
      deleteBut(val){
        this.axios.delete(libNotice.delete,{data:{id:val}}).then((res)=>{
          console.log('删除后返回的数据',res)
          if(res.data.state==true){
            this.$message.success(res.data.msg);
            this.initializationFun()
          }else{
            this.$message.error(res.data.msg);
          }
        })
      }
    }
  };
</script>

<style scoped>
  .NoticeContent{
    border: 1px solid #e4e4e4;
    padding: 20px 15px;
    height: 140px;
  }
  #deleteBut{
    line-height:140px;
    font-size: 12px;
    color:red;
    cursor: pointer;
    width: 30px;
  }
  .buttonStyle{
    width: 220px;
    margin: 0px 220px;
  }
  .buttonBlue{
    color: white;
    cursor: pointer;
    background-color: #0096ffad;
  }
  .buttonBlue:hover{
    color: white;
    background-color: #0096ff73;
  }
  .buttonGray{
    background-color: #DCDCDC;
    color: #878787;
    cursor: pointer;
    margin-left: 10px
  }
  .buttonGray:hover{
    background-color: #d2d2d2;
    color: #878787;
    margin-left: 10px
  }
  .noticeForm .buttonStyle input[type="button" i] {
    border-width: 0px;
    border-style: none;
    width: 100px;
    height: 30px;
    outline: none;
  }

  .video {
    background-color: #ffffff;
    padding-left: 30px;
    padding-bottom: 117px;
  }
  .pagetitle {
    padding: 30px 0;
  }
  .titleName {
    font-size: 16px;
    color: #878787;
    border-left: 4px solid #0096ff;
    padding-left: 10px;
  }
  .videoBox {
    display: flex;
    flex-direction: row;

    height: 610px;
    box-sizing: border-box;
  }
  .uploadBox {
    padding-top: 66px;
    margin-right: 40px;
    width: 40%;
  }
  .nomal-Box {
    height: 453px;
    border-right: 2px solid #e4e4e4;
    position: relative;
  }
  .upload-demo {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  /*--- 视频上传列表 ---*/
  .ListBox{
    max-width: 820px;
    width: 100%;
  }
  .recomandList{

  }
</style>

