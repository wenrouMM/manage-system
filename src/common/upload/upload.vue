<template>
  <div class="uploadBook">
    <div class="title mb_30">
      <p>批量导入</p>
      <span class="backBtn" @click="backBtn">
        <i class="el-icon-back"></i>返回
      </span>
    </div>
    <!-- 附件上传 -->
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="上传excel文件">1</el-step>
      <el-step title="步骤 2" description="选取映射关系">2</el-step>
      <el-step title="结果" description="">3</el-step>
    </el-steps>
    
    <div v-if="active==0" class="stepOne">
      <section class="upFile mb_30">
        <div class="uploadBox">
          <el-upload
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
        <div class="textCenter">
            <el-button type="primary" @click="submitFile">下一步</el-button>
        </div>
        
      </section>
    </div>
    <div v-if="active==1" class="stepTwo">

    </div>
    <div v-if="active==2" class="stepThree">
        
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
      active: 0
    };
  },
  computed: {
    editTimeForm() {
      let obj = {};
      return obj;
    }
  },
  methods: {
    /*------ ------*/
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    // 离开前需要提示用户 单独的路由守卫
    backBtn() {
      this.$router.push({ path: "/BookCataloging" });
    },
    submitFile() {
      let obj = {};
      obj.url = this.backUrl;
      this.searchApi(obj);
      
    },
    /*------ API ------*/
    // 获取搜索框
    searchApi(value) {
      axios.post(bookUploadInt.getFields, value).then(res => {
        console.log("返回的弹框数据", res);
      });
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
.editor {
  border: 1px solid rgba(220, 220, 220, 1);
  background-color: #fff;
}
.title {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  padding-left: 25px;
  padding-right: 25px;
  background-color: #dcdcdc;
  display: flex;
  justify-content: space-between;
}
.title .backBtn {
  cursor: pointer;
}
/*------ 输入框 ------*/
.inputBox {
  width: 590px;
}
.limit {
  padding-left: 25px;
}
/*------ 富文本编辑器 ------*/
.editorBox {
  padding: 0 37px;
}
.upFile {
  padding-left: 37px;
}
/*------ 上传文件 ------*/
.uploadBox {
  width: 400px;
  margin: 0 auto;
}
.buttonBox {
  text-align: center;
}
</style>


