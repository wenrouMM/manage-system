<template>
  <div class="editor">
    <!-- 输入框 -->
    <section class="formInputBox">
      <div class="title mb_30">
        <p>修改公告</p>
        <span class="backBtn" @click="backBtn">
          <i class="el-icon-back"></i>返回
        </span>
      </div>
      <div class="formInput">
        <div class="inputBox">
          <el-form
            :rules="editrules"
            ref="editForm"
            :label-position="labelPosition"
            label-width="80px"
            :model="editForm"
          >
            <el-form-item label="标题" prop="title">
              <el-input v-model="editForm.title"></el-input>
            </el-form-item>

            <el-form-item label="作者">{{editForm.author}}</el-form-item>

            <div class="limit">
              <el-form-item label="阅读权限" prop="user">
                <el-radio-group v-model="editForm.user">
                  <el-radio label="2">读者</el-radio>
                  <el-radio label="1">管理员</el-radio>
                  <el-radio label="0">全部</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="limit">
              <el-form-item label="是否置顶" prop="apex">
                <el-radio-group v-model="editForm.apex">
                  <el-radio label="0">否</el-radio>
                  <el-radio label="1">是</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="limit">
              <el-form-item label="文章状态" prop="disabled">
                <el-radio-group v-model="editForm.disabled">
                  <el-radio label="0">可用</el-radio>
                  <el-radio label="1">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </section>
    <!-- 富文本编辑器 -->
    <section class="editorBox mb_30" v-loading="editorloading">
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
    <!-- 附件上传 -->
    <section class="upFile mb_30">
      <h2 class="mb_30">附件上传</h2>
      <div class="uploadBox">
        <el-upload
          class="upload-demo"
          drag
          :action="fileUrl"
          :file-list="fileList"
          :limit="3"
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
          <div slot="tip" class="el-upload__tip">上传文件大小不得超过50M</div>
        </el-upload>
      </div>
    </section>
    <!-- 发布按钮 -->
    <section class="buttonBox mb_30">
      <el-button type="primary" @click="submitFile">发布</el-button>
    </section>
    <section class="imageLoad">
      <el-upload
        class="avatar-uploader"
        :action="imgUrl"
        accept="image/*"
        name="img"
        :show-file-list="false"
        :on-success="imgSuccess"
        :on-error="imgError"
        :before-upload="beforeUpload"
      ></el-upload>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import { uploadInt, editorInt } from "../../request/api/base.js";
import { editorData } from "../editor.js";
import { Quill, quillEditor } from "vue-quill-editor";
import ImageResize from "quill-image-resize-module";
Quill.register("modules/imageResize", ImageResize);
var Font = Quill.import("formats/font");
var Size = Quill.import("attributors/style/size");
Size.whitelist = editorData.size;
Font.whitelist = editorData.fonts;
Quill.register(Font, true);
Quill.register(Size, true);
export default {
  data() {
    return {
        id:'', // 页面ID
      /*------ 表单配置项 ------*/
      labelPosition: "right",
      editForm: {
        title: "",
        author: "",
        user: "",
        apex: "0",
        disabled: "0"
      },
      editrules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        user: [
          { required: true, message: "请选择文章阅读权限", trigger: "change" }
        ],
        apex: [
          { required: true, message: "请选择文章是否置顶", trigger: "change" }
        ],
        disabled: [
          { required: true, message: "请选择文章是否禁用", trigger: "change" }
        ]
      },
      /*------ 富文本配置项 ------*/
      editorloading: false,
      content: "",
      editorOption: {
        placeholder: "请输入文字,内容不得少于20字",
        theme: "snow",
        modules: {
          toolbar: {
            container: editorData.toolbarOptions,
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
        }
      },
      /*------ 图片上传配置 ------*/
      imgUrl: uploadInt.editorImg,
      /*------ 附件上传配置项 ------*/
      fileUrl: uploadInt.editorFile,
      fileList: [],
      fileContent: []
    };
  },
  computed: {
    editTimeForm() {
      let obj = {
        title: this.editForm.title,
        content: this.content,
        category: this.editForm.user,
        state: this.editForm.apex,
        disabled: this.editForm.disabled,
        sysTbEnclosures: this.fileContent,
        id:this.id
      };
      return obj;
    }
  },
  components: {
    quillEditor
  },
  methods: {
    /*------ ------*/
    // 离开前需要提示用户 单独的路由守卫
    backBtn() {
      this.$router.push({ path: "/noticeSet" });
    },
    /*------ 富文本编辑器 ------*/
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
    },

    /*------ 上传附件功能 ------*/
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    fileRemove(file, fileList) {
      this.fileList = fileList;
      console.log("删除后的列表", this.fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
      console.log("限制后的数据列表", this.fileList, fileList);
    },
    fileSuccess(res, file, fileList) {
      if (res.state == true) {
        console.log("正确回复的是", res, fileList);
        this.fileList = fileList;
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
      this.$message.error("文件大小不得超过50M");
    },
    fileChange(file, fileList) {
      this.fileList = fileList.slice(-3);
      console.log("超过三个的列表", this.fileList);
    },

    /*------ 上传图片 ------*/
    beforeUpload(res, file) {
      this.$message.info("图片上传中");
      this.editorloading = true;
    },
    imgSuccess(res, file) {
      // 获取富文本组件实例
      let quill = this.$refs.myTextEditor.quill;
      console.log("图片奉还", res);
      if (res.state === true) {
        // 获取光标所在位置

        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        let info = uploadInt.preimg + res.row;
        quill.insertEmbed(length, "image", info);
        // 调整光标到最后
        quill.setSelection(length + 1);
        this.editorloading = false;
      } else {
        this.$message.error(res.msg);
        this.editorloading = false;
      }
      // loading动画消失
    },
    imgError(res, file) {
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
      this.editorloading = false;
    },
    /*------ 提交 ------*/
    submitFile() {
      let arr = [];
      let flag = false;
      if (this.content) {
        flag = true;
      }
      // 是否需要判定文件列表为空 对了 这里要开验证
      this.$refs.editForm.validate(valid => {
        if (valid && flag) {
          for (let item of this.fileList) {
            let obj = {};
            if(item.response){
                obj.fileAddress = item.response.row;
                obj.fileName = item.name;
            } else{
                obj.fileAddress =item.fileAddress
                obj.fileName = item.name
            }
            
            arr.push(obj);
          }
          this.fileContent = arr;
          this.addArticeApi()
          console.log("提交的附件名称", this.fileContent);
          console.log('上传的内容',this.editTimeForm)
        } else {
          if(!flag){
            this.$message.error('请填写文章内容')
          }
          console.log("error submit!!");
          return false;
        }
      });
    },

    /*------ Api ------*/
    addArticeApi(){
      let data = this.editTimeForm
      axios({
        url:editorInt.edit,
        method:'put',
         headers:{'Content-Type':'application/json'},
        data:data
      }).then((res)=>{
        if(res.data.state == true){
          this.$message.success('修改成功')
          this.$router.push({path:'/noticeSet'})
        } else{
          this.$message.error(res.data.msg)
        }
        console.log(res)
      })
    },
    idSearchApi(){
        let obj = this.$route.params
        console.log('id号',obj)
        this.axios.get(editorInt.detail,{
            params:obj
        }).then((res) =>{
            console.log('res',res)
            if(res.data.state ==true){
                let data = res.data.row
                this.editForm.title = data.title
                this.content = data.content
                this.editForm.user=data.category.toString()
                this.editForm.apex = data.state.toString()
                this.editForm.disabled = data.disabled.toString()
                this.editForm.author = data.username
                let arr = []
                for(let item of data.sysTbEnclosures){
                    let obj ={}
                    obj.name = item.fileName
                    obj.fileAddress = item.fileAddress
                    obj.createTime = item.createTime
                    arr.push(obj)
                }
                this.fileList = arr
                console.log(res.data.row)
            } else{
                this.$message.error(res.data.msg)
            }
        })
        
    }
  },
  created(){
      this.idSearchApi()
      this.id = this.$route.params.id
      
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
}
.buttonBox {
  text-align: center;
}
</style>

<style>
.ql-tooltip.ql-editing {
  left: 0 !important;
}
.editorBox .ql-container.ql-snow {
  height: 400px;
}

</style>
