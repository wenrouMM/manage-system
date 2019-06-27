<template>
  <div id="dataSetting">
    <section class="pagetitle">
      <div class="titleName">书籍推荐</div>
    </section>
    <section class="picBack mb_20">
      <div class="loopBox">
        <p class="data-title">数据实时可视化书籍推荐页面</p>
        <div class="loop">
          <div class="loopContent"></div>
        </div>
      </div>
      <div class="inputBox">
        <p class="data-title">管理员添加设置推荐书籍</p>
        <div class="coverBox clearFix">
          <div class="coverUpload">
            <div class="imgBox"></div>
            <div class="clickImg" @click="uploadBtn">
              <div class="iconBox">
                <i class="el-icon-plus"></i>
                <p class="icon-text">点击更换书籍封面</p>
              </div>
            </div>
          </div>
          <section class="uploadForm">
            <el-form
              label-width="100px"
              :inline="true"
              :model="upForm"
              :rules="rules"
              class="demo-form-inline"
            >
              <el-form-item label="书籍名称" prop="bookName">
                <el-input v-model="upForm.bookName" placeholder="请输入书籍名称"></el-input>
              </el-form-item>
              <el-form-item label-width="60px" label="作者" prop="author">
                <el-input v-model="upForm.author" placeholder="请输入作者名"></el-input>
              </el-form-item>
              <el-form-item label="出版社" prop="lib">
                <el-input v-model="upForm.lib" placeholder="请输入出版社名称"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
              </el-form-item>
            </el-form>
          </section>
        </div>
      </div>
    </section>
    <section class="recomandList">
      <p class="data-title">添加书籍推荐列表</p>
      <section class="tableBox">
        <el-table
          :header-cell-style="{background:'#0096FF', color:'#fff',height:'50px', fontSize:'18px',borderRight:'none'}"
          empty-text="无数据"
          style="width: 100%; text-align:center;"
          :data="bookArr"
          :row-style="{height:'50px'}"
        >
          <el-table-column align="center" prop="name" label="书籍封面">
            <template>
              <div class="imgBox"></div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="isbn" label="书籍名称"></el-table-column>
          <el-table-column align="center" prop="author" label="作者"></el-table-column>
          <el-table-column align="center" prop="author" label="出版社"></el-table-column>
          <el-table-column align="center" label="操作">
            <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
            <template slot-scope="scope">
              <span class="red" @click="deleteBtn(scope.$index, scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </section>
    <!-- 图片上传 -->
    <section class="uploadBox">
      <my-upload
        field="img"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
        v-model="show"
        :width="110"
        :height="130"
        :url="uploadurl"
        :langExt="zh"
        img-format="png"
      ></my-upload>
    </section>
  </div>
</template>
<script>
import myUpload from "vue-image-crop-upload";
export default {
  data() {
    return {
      upForm: {
        booKName: "",
        author: "",
        lib: "",
        imgUrl: ""
      },
      
      rules: {
        bookName: [
          { required: true, message: "书籍名称不得为空", trigger: "blur" }
        ],
        author: [
          { required: true, message: "作者名不得为空", trigger: "blur" }
        ],
        lib: [
          { required: true, message: "出版社名称不得为空", trigger: "blur" }
        ]
      },
      zh:{
        hint: '点击，或拖动图片至此处',
        loading: '正在上传……',
        noSupported: '浏览器不支持该功能，请使用IE10以上或其他现在浏览器！',
        success: '上传成功',
        fail: '图片上传失败',
        preview: '图片预览',
        btn: {
            off: '取消',
            close: '关闭',
            back: '上一步',
            save: '保存'
        },
        error: {
            onlyImg: '仅限图片格式',
            outOfSize: '单文件大小不能超过 ',
            lowestPx: '图片最低像素为（宽*高）：'
        }
    
      },
      show:false,
      bookArr: []
    };
  },
  components: {
    myUpload
  },
  methods: {
      uploadBtn(){
          this.show=true;
      },
    /*--- 图片上传 ---*/
    cropSuccess(imgDataUrl, field) {
      console.log("-------- crop success --------");
      console.log("裁剪成功的imgData", imgDataUrl);
      console.log("裁剪成功的field", field);
      this.cutimgUrl = imgDataUrl;
    },
    cropUploadSuccess(jsonData, field) {
      console.log("-------- upload success --------");
      console.log(jsonData);
      console.log("图片地址", jsonData.row);
      let imgFile = "";
      imgFile = jsonData.row;
      console.log("field: " + field);
      this.imgDataUrl = this.cutimgUrl;
    },
    cropUploadFail(status, field) {
      console.log("-------- upload fail --------");
      console.log(status);
      console.log("field: " + field);
    }
  }
};
</script>
<style scoped>
#dataSetting {
  padding: 0 30px;
  background-color: #ffffff;
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
.data-title {
  font-size: 13px;
  color: #0096ff;
  font-family: MicrosoftYaHei;

  margin-bottom: 6px;
}
.picBack {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.loop {
  width: 480px;
  height: 261px;
  border: solid 1px #d2dee6;
}
.coverBox {
  width: 1030px;
  height: 261px;
  padding: 27px 0;
  padding-left: 40px;
  border: solid 1px #d2dee6;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.coverUpload {
  position: relative;
  width: 168px;
  height: 208px;
}
.clickImg {
  width: 168px;
  height: 208px;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.8);
  cursor: pointer;
}
.clickImg .iconBox {
  font-size: 35px;
  color: #ffffff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}
.icon-text {
  font-size: 16px;
  text-align: center;
  color: #ffffff;
  padding-top: 5px;
  font-family: MicrosoftYaHei;
}
/*表单*/
.uploadForm {
  width: 75%;
  padding-top: 30px;
}
</style>

