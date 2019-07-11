<template>
  <div class="uploadBook" id="bookUpload">
    <div class="title mb_30">
      <div class="sonTitle">
        <span class="titleName">书籍导入</span>
      </div>
    </div>
    <!-- 附件上传 -->
    <el-steps class="line" :active="active" finish-status="success">
      <el-step title="步骤 1" description="上传excel文件"></el-step>
      <el-step title="步骤 2" description="选取映射关系"></el-step>
      <el-step title="结果" description></el-step>
    </el-steps>

    <div v-if="active==0" class="stepOne">
      <section
        class="upFile mb_30"
        v-loading="loadingOne"
        element-loading-text="正在获取映射关系"
        element-loading-spinner="el-icon-loading"
      >
        <div class="uploadBox">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :action="fileUrl"
            :file-list="fileList"
            :limit="1"
            :before-upload="beforefileUpload"
            :on-remove="fileRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :on-success="fileSuccess"
            :on-error="fileError"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
          </el-upload>
        </div>
        <div class="textCenter firstButton">
          <el-button type="primary" @click="firstStep">下一步</el-button>
        </div>
      </section>
    </div>
    <div v-if="active==1||active==2" class="TwoBox">
      <section class="mb_30">
        <p class="mustText">提示:{{tipsText}}为必选字段</p>
      </section>
      <div
        class="loadingBox"
        v-loading="loadingTwo"
        element-loading-text="正在导入数据 可能耗费时间较长 请您稍作等待"
        element-loading-spinner="el-icon-loading"
      >
        <section class="stepTwo">
          <div class="low">
            <span class="showText">源字段名</span>
            <span class="tips">----------</span>
            <span class="showText">映射字段名</span>
          </div>
          <div class="low" v-for="(item,index) of circleData" :key="index">
            <el-select clearable @change="changeBtn" v-model="twiceList[index]" placeholder="请选择">
              <el-option v-for="item in optionData" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <span class="tips">映射到</span>
            <span class="showText">{{item.value}}</span>
          </div>
        </section>
        <div class="textCenter twoButton">
          <el-button type="primary" @click="prev">上一步</el-button>
          <el-button type="primary" @click="twiceStep">下一步</el-button>
        </div>
      </div>
    </div>
    <div v-if="active==3" class="stepThree">
      <div class="end">
        <div class="reflect">
          <p>
            <img :src="picUrl" class="imgBox">
          </p>
          <p class="Downtext">数据导入成功{{endText}}</p>
        </div>

        <p>
          <el-button type="primary" @click="backOne">继续导入书籍</el-button>
          <el-button type="primary" @click="backBtn">返回书籍编目</el-button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { uploadInt, bookUploadInt } from "@request/api/base.js";

export default {
  data() {
    return {
      /*------ 附件上传配置项 ------*/
      fileUrl: uploadInt.excelFile,
      fileList: [],
      fileContent: [],
      backUrl: "",
      twiceList: [], // 二次选择多选框
      twiceUrl: "",
      active: 0,
      value: "",
      optionData: [], // 下拉框数据
      circleData: [], // 循环输出数组
      loadingOne: false,
      loadingTwo: false,
      picUrl: require("../../base/img/import.png"),
      endText: "", // 返回成功文字
      tipsText: ""
    };
  },
  computed: {
    editTimeForm() {
      let obj = {};
      return obj;
    },
    uploadForm() {
      let arr = [];
      for (let [index, item] of this.circleData.entries()) {
        let obj = {};
        obj.excelFeild = this.twiceList[index];
        obj.objFeild = item.name;
        arr.push(obj);
      }
      let obj = {
        url: this.twiceUrl,
        relations: arr
      };
      return obj;
    }
  },
  methods: {
    /*------ ------*/
    prev() {
      if (this.active-- < 0) this.active = 0;
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    // 离开前需要提示用户 单独的路由守卫
    backBtn() {
      this.$router.push({ path: "/BookCataloging" });
    },
    firstStep() {
      let obj = {};
      obj.url = this.backUrl;
      this.searchApi(obj);
    },
    twiceStep() {
      this.submitApi(this.uploadForm);
    },
    backOne() {
      this.fileList = []
      this.backUrl = "";
      this.active = 0;
    },
    /*------ API ------*/
    // 获取搜索框
    searchApi(value) {
      this.loadingOne = true;
      this.circleData = []
      this.optionData = []
      this.twiceList = []
      axios.post(bookUploadInt.getFields, value).then(res => {
        if (res.data.state === true) {
          this.twiceUrl = res.data.row.url;
          this.optionData = res.data.row.excelHead; // 左侧下拉框
          this.circleData = res.data.row.fields; // 右侧固定
          let length = this.circleData.length;
          console.log(length);
          let str = "";
          for (let item of res.data.row.must) {
            str += "," + item;
          }

          this.tipsText = str.substring(1);
          for (let i = 0; i < length; i++) {
            this.twiceList.push("");
          }
          this.next();
          this.loadingOne = false;
          console.log("安排文件", res, "绑定数据", this.twiceList);
        } else {
          this.loadingOne = false;
          this.$message.error(res.data.msg);
        }
      });
    },
    submitApi(value) {
      this.loadingTwo = true;
      this.next()
      axios.post(bookUploadInt.add, value).then(res => {
        if (res.data.state) {
          this.$message.success(res.data.msg);
          this.endText = res.data.msg;
          this.loadingTwo = false;
          this.next();
        } else {
          this.$message.error(res.data.msg);
          this.loadingTwo = false;
          this.prev()
        }
      });
    },
    changeBtn() {
      console.log("选中之后数据是设么", this.twiceList);
    },
    /*------ 上传附件功能 ------*/
    beforefileUpload(file) {
      const fileExe = file.name.replace(/.+\./, ""); // 正则匹配 有丶慌

      const isExcel = file.type;
      console.log("文件类型", isExcel);
      if (["xls", "xlsx"].indexOf(fileExe.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名xlsx、xls的文件！"
        });
        return false;
      }
      console.log("上传之前", file);
    },
    beforeRemove(file, fileList) {
      /*  return this.$confirm(`确定移除 ${file.name}？`); */
    },
    fileRemove(file, fileList) {
      this.fileList = fileList;
      console.log("删除后的列表", this.fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
      console.log("限制后的数据列表", this.fileList, fileList);
    },
    fileSuccess(res, file, fileList) {
      if (res.state == true) {
        console.log("正确回复的是", res, fileList);
        this.fileList = fileList;
        this.backUrl = res.row;
        console.log("绑定的数据列表", this.fileList);
      } else {
        this.$message.error(res.msg);
        console.log("", res, this.fileList, fileList);
        fileList.pop();
        this.fileList = fileList;
        console.log("移出后的fileList", this.fileList);
      }
    },
    fileError(res, file, fileList) {
      this.$message.error("文件上传失败");
    },
    fileChange(file, fileList) {
      this.fileList = fileList.slice(-1);
      console.log("超过三个的列表", this.fileList);
    }
  }
};
</script>

<style scoped>
.uploadBook {
  background-color: #ffffff;
  min-height: 952px;
  padding: 30px;
}
.sonTitle {
  margin-bottom: 33px;
}
.sonTitle .titleName {
  border-left: 4px solid #0096ff;
  padding-left: 10px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(135, 135, 135, 1);
  display: inline-block;
}
/*------ 上传文件 ------*/

.buttonBox {
  text-align: center;
}
/*------ 第一步 ------*/
.stepOne {
  padding-top: 100px;
}
.upFile {
  width: 360px;
  margin: 0 auto;
}
.uploadBox {
  margin-bottom: 50px;
}
.firstButton {
}
.low {
  margin-bottom: 25px;
}
/*------ 第二步 ------*/
.mustText {
  margin: 0 auto;
  padding-left: 36px;
  width: 600px;
}
.TwoBox {
  padding-top: 50px;
}
.stepTwo {
  height: 510px;
  width: 600px;
  margin: 0 auto;
  overflow: auto;
  margin-bottom: 50px;
  text-align: center;
}
.tips {
  font-size: 16px;
  color: #f55c4c;
  line-height: 22px;
  margin: 0 27px;
  display: inline-block;
}
.showText {
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #8c8c8c;
  width: 218px;
  height: 34px;
  font-size: 14px;
  line-height: 36px;
  display: inline-block;
  text-align: center;
}
.twoButton {
  width: 600px;
  margin: 0 auto;
}
/*------ 结果 ------*/
.end {
  padding-top: 100px;
  text-align: center;
}
.reflect {
  margin-bottom: 20px;
}
.imgBox {
  width: 128px;
  height: 128px;
  margin-bottom: 40px;
}
.Downtext {
  font-size: 18px;
  color: #46dd78;
}
</style>


