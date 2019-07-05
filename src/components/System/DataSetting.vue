<template>
  <div id="dataSetting">
    <section class="pagetitle">
      <div class="titleName">书籍推荐</div>
    </section>
    <section class="picBack mb_20">
      <div class="loopBox">
        <p class="data-title">数据实时可视化书籍推荐页面</p>
        <div class="loop">
          <div class="loopContent">
            <swiper :imgBox="propArr"></swiper>
          </div>
          <div class="bookList">
            <div class="textBox" v-for="(item,index) of bookArr" :key="index">
              <span class="rankNumber" style="color: #0096FF">{{index+1}}.</span>
              <div class="content">
                <P>原作名:{{item.name}}</P>
                <p>作者:{{item.author}}</p>
                <p>出版社:{{item.press}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 添加设置 -->
      <div class="inputBox">
        <p class="data-title">
          管理员添加设置推荐书籍
          <span class="data-tips" style="color: red">(提示：推荐书籍列表最多可上传3本 如列表已有3本 请先进行删除再上传)</span>
        </p>
        <div class="coverBox clearFix">
          <div class="coverUpload">
            <div class="imgBox">
              <img :src="showSrc" />
            </div>
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
              ref="addForm"
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
                <el-button type="primary" :disabled="juge" @click="onSubmit('addForm')">确定</el-button>
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
            <template slot-scope="scope">
              <div class="tab-imgBox">
                <img :src="scope.row.showImg" style="width:60px;height: 80px" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="书籍名称"></el-table-column>
          <el-table-column align="center" prop="author" label="作者"></el-table-column>
          <el-table-column align="center" prop="press" label="出版社"></el-table-column>
          <el-table-column align="center" label="操作">
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
    <div class="forbid collectionDelete">
      <el-dialog title="删除" :visible.sync="centerDialogVisible" width="400px" center>
        <div class="dialogBody">是否删除这本书籍?</div>
        <div style="margin-bottom: 30px">
          <span class="dialogButton true mr_40" @click="deleteDefineBut()">确 定</span>
          <span class="dialogButton cancel" @click="centerDialogVisible = false">取 消</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import myUpload from "vue-image-crop-upload";
import swiper from "../../common/swiper/swiper";
import {
  imgUpload,
  preImg,
  dataSearch,
  dataAdd,
  dataDelete
} from "@request/api/api.js";
export default {
  data() {
    return {
      centerDialogVisible: false,
      upForm: {
        bookName: "",
        author: "",
        lib: "",
        imgUrl: ""
      },
      juge: false,
      imgDataUrl: "",
      propArr: [],
      defaultSrc: require("../../base/img/swiper/02.jpg"),
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
      zh: {
        hint: "点击，或拖动图片至此处",
        loading: "正在上传……",
        noSupported: "浏览器不支持该功能，请使用IE10以上或其他现在浏览器！",
        success: "上传成功",
        fail: "图片上传失败",
        preview: "图片预览",
        btn: {
          off: "取消",
          close: "关闭",
          back: "上一步",
          save: "保存"
        },
        error: {
          onlyImg: "仅限图片格式",
          outOfSize: "单文件大小不能超过 ",
          lowestPx: "图片最低像素为（宽*高）："
        }
      },
      uploadurl: imgUpload,
      show: false,
      bookArr: [],
      deleteObj: {}
    };
  },
  computed: {
    showSrc() {
      if (this.imgDataUrl) {
        return this.imgDataUrl;
      } else {
        return this.defaultSrc;
      }
    },
    addTimeForm() {
      let obj = {
        name: this.upForm.bookName,
        author: this.upForm.author,
        press: this.upForm.lib,
        cover: this.upForm.imgUrl
      };
      return obj;
    }
  },
  components: {
    myUpload,
    swiper
  },
  created() {
    this._search();
  },
  methods: {
    uploadBtn() {
      this.show = true;
    },
    deleteBtn(index, row) {
      this.centerDialogVisible = true;
      this.deleteObj.id = row.id;
    },
    deleteDefineBut() {
      this._delete();
    },
    onSubmit(formName) {
      console.log("数据提交", this.addTimeForm);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._add();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    /*--- API ---*/
    _search() {
      dataSearch().then(res => {
        if (res.data.state) {
          if (res.data.row.length == 3 || res.data.row == null) {
            this.juge = true;
          } else {
            this.juge = false;
          }
          console.log("现在的数组长度", res.data.row.length);
          this._toFilter(res.data.row);
          console.log("测试接口", res);
        } else{
          this.$message.error(res.data.msg)
        }
      });
    },
    _add() {
      dataAdd(this.addTimeForm).then(res => {
        if(res.data.state){
          console.log("测试添加", res);
        this.clearObj(this.upForm);
        this.imgDataUrl = "";
        this.$refs.addForm.resetFields();
        this._search();
        this.$message.success(res.data.msg);
        } else{
          this.$message.error(res.data.msg);
        }
        
      });
    },
    _delete() {
      dataDelete(this.deleteObj).then(res => {
        if(res.data.state){
          this.$message.success(res.data.msg);
          this.centerDialogVisible = false;
          this._search();
        } else{
          this.$message.error(res.data.msg);
        }
        
      });
    },
    /*--- 过滤函数 ---*/
    _toFilter(arr) {
      let length = arr.length;
      let propArr = [];
      for (let item of arr) {
        let showImg = preImg + item.cover;
        item.showImg = showImg;
        propArr.push(showImg);
      }

      if (length < 3) {
        while (length < 3) {
          propArr.push(this.defaultSrc);
          length++;
        }
      }
      this.bookArr = arr;
      this.propArr = propArr;
      console.log("添加之后", this.bookArr, this.propArr);
    },
    clearObj(obj) {
      for (let key in obj) {
        obj[key] = "";
      }
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
      /* let imgFile = "";
      imgFile = jsonData.row; */
      this.upForm.imgUrl = jsonData.row;
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
  padding-bottom: 30px;
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
.data-tips {
  color: #878787;
}
.picBack {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
/*--- 回显 ---*/
.loop {
  width: 480px;
  height: 261px;
  padding-top: 20px;
  border: solid 1px #d2dee6;
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
}
.loopContent {
  width: 250px;
}
.textBox {
  font-size: 13px;
  line-height: 18px;
  color: #878787;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
}
.textBox .rankNumber {
  display: inline-block;
  text-align: center;
  line-height: 18px;
  font-size: 16px;

  color: #0e0d0d;
}
.content p {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bookList {
}
.ml_24 {
  margin-left: 24px;
}
.mb_8 {
  margin-bottom: 8px;
}
/*--- 设置图片  ---*/
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
.coverUpload:hover .clickImg {
  display: block;
}
.coverBox .imgBox {
  width: 168px;
  height: 208px;
}
.coverBox .imgBox img {
  width: 100%;
  height: 100%;
}
.clickImg {
  width: 168px;
  height: 208px;
  position: absolute;
  top: 0;
  background-color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  display: none;
}
.clickImg img {
  width: 168px;
  height: 208px;
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
.red {
  color: #ff334b;
  cursor: pointer;
}
.tab-imgBox {
}
</style>

