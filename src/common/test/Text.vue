<template>
  <div class="textEditor">
    <!-- 输入框 -->
    <section class="formInput"></section>
    <!-- 富文本编辑器 -->
    <section class="editorBox">
      <quill-editor
        ref="myTextEditor"
        v-model="content"
        :options="editorOption"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
        @change="onEditorChange($event)"
      ></quill-editor>
    </section>
    <!-- 文件上传 -->
    <section class="anthonerFile">
      <h1>附件上传</h1>
      <el-upload
        class="upload-demo"
        drag
        :action="fileUrl"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :limit="3"
        :on-exceed="handleExceed"
        :file-list="fileList"
        :on-change="handleChange"
        :on-success="fileSuccess"
        :on-error="fileError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </section>
    <div class="ql-editor" v-html="text"></div>
    <!-- 按钮组 -->
    <section>
      <el-button size="small" type="primary" @click="submitFile">点击提交</el-button>
    </section>
    
    <!-- 图片上传组件-->
    <el-upload
      class="avatar-uploader"
      :action="serverUrl"
      accept=" image/*"
      name="img"
      :show-file-list="false"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :before-upload="beforeUpload"
    ></el-upload>
  </div>
</template>

<script>
import { Quill, quillEditor } from "vue-quill-editor";
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);
var fonts = [
  "SimSun",
  "SimHei",
  "Microsoft-YaHei",
  "KaiTi",
  "FangSong",
  "Arial",
  "Times-New-Roman",
  "sans-serif"
];
var Font = Quill.import("formats/font");
var Size = Quill.import("attributors/style/size");
Size.whitelist = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px"
];
let SizeOption = [
  "normal",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px"
];
Quill.register(Size, true);
Font.whitelist = fonts; //将字体加入到白名单
Quill.register(Font, true);

var toolbarOptions = [
  ["bold", "italic", "underline", "strike"], //加粗，斜体，下划线，删除线
  ["blockquote", "code-block"], //引用，代码块

  [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
  [{ list: "ordered" }, { list: "bullet" }], //列表
  [{ script: "sub" }, { script: "super" }], // 上下标
  [{ indent: "-1" }, { indent: "+1" }], // 缩进
  [{ direction: "rtl" }], // 文本方向

  [{ size: SizeOption }], // 字体大小
  [{ header: [1, 2, 3, 4, 5, 6, false] }], //几级标题

  [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
  [{ font: fonts }], //把上面定义的字体数组放进来

  [{ align: [] }], //对齐方式

  ["clean"], //清除字体样式
  ["link", "image", "video"] //上传图片、上传视频
];
var imgurl = "http://192.168.2.31:8090/";
const photoUrl = "http://192.168.2.31";
const headUpload = imgurl + "filemodule/uploadImg/addEditorImg";

export default {
  data() {
    return {
      /*------ 图片上传组件辅助 ------*/
      serverUrl: headUpload,
      /*------ 附件上传辅助 ------*/
      fileList: [],
      fileUrl: "http://192.168.2.31:8090/filemodule/uploadFile/addEnclosure",
      /*------ 富文本编辑器数据 ------*/
      content: "",
      text: null,
      disapper: "",
      editorOption: {
        placeholder: "请输入文字",
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              // 配置按钮点击自定义程序
              image: function(value) {
                if (value) {
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          },

          imageResize: {
            displayStyles: {
              backgroundColor: "black",
              border: "none",
              color: "white"
            },
            modules: ["Resize", "DisplaySize", "Toolbar"]
          }
        },
        theme: "snow" // 主体选择
      }
    };
  },

  // 打包
  methods: {
    submitFile() {
    },
    /*------ 文件上传钩子函数 ------*/
    fileSuccess(res, file, fileList) {
      if (res.state == true) {
        console.log("正确回复的是", res, fileList);
        this.fileList = fileList;
        console.log(this.fileList);
      } else {
        this.$message.error(res.msg);
        console.log("", res, this.fileList, fileList);
        fileList.pop();
        console.log("移出后的fileList", this.fileList);
      }
    },
    fileError(res, file, fileList) {
      console.log("错误回复的是", res, this.fileList, fileList);
      this.$message.error("文件大小不得超过500M");
    },

    /*------ ------*/
    // 删除文件之前 进行判断
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 文件删除之后
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
      console.log("现在的fileList", fileList);
      console.log("传递的fileList", this.fileList);
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3);
    },
    /*------ 图片上传组件辅助函数 ------*/
    beforeUpload(res, file) {
      this.$message.error("图片上传中");
    },
    // 上传图片成功
    uploadSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.$refs.myTextEditor.quill;
      console.log("图片奉还", res);
      if (res.state === true) {
        // 获取光标所在位置

        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        let info = res.row;
        quill.insertEmbed(length, "image", info);
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error(res.msg);
      }
      // loading动画消失
      //this.quillUpdateImg = false;
    },
    // 上传图片失败
    uploadError(res, file) {
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    },

    /*------ 富文本钩子函数 ------*/
    onEditorBlur(editor) {
      //console.log("editor blur!", editor);
    },
    onEditorFocus(editor) {
      //console.log("editor focus!", editor);
    },
    onEditorReady(editor) {
      //console.log("editor ready!", editor);
    },
    onEditorChange({ editor, html, text }) {
      console.log("editor change!", editor, html, "限制一下", this.content);
      console.log("text文本内容", text, "text字数", text.length);
      this.text = html;
    },

    submit() {
      let content = JSON.stringify(this.text);
      localStorage.setItem("content", content);
    }
  },
  components: {
    quillEditor
  },
  created() {
  }
};
</script>

<style scoped>
.editorBox {
  margin-left: 40px;
  margin-right: 40px;
}
</style>
<style>
.ql-tooltip.ql-editing {
  left: 0 !important;
}
.editorBox .ql-container.ql-snow {
  height: 600px;
}
</style>
