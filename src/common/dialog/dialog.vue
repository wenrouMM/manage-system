<template>
  <div class="addEditDialog">
    <!-- Form -->
    <el-button type="text" @click="dialogFormVisible = true">打开嵌套表单的 Dialog</el-button>

    <el-dialog width="685px" title="收货地址" :visible.sync="dialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="addRules">
        <el-form-item class="uploadBox">
          <section class="upload mb_30">
            <!-- 背景图片做改动 -->
            <div class="defultHead" style="width:100px; height:100px; border-radius:50%;">
              <img
                class="defaultimage"
                style="width:100px; height:100px; border-radius:50%;"
                
                alt="user image"
              >
              <img style="width:100px; height:100px ;border-radius:50%;" alt="预览照片">
              <input type="file" accept="jpg/png" style="display:none;" ref="file" id="file">
              <div class="bgload" style="width:100px; height:100px; border-radius:50%;">上传头像</div>
            </div>
          </section>
        </el-form-item>
        <!-- 表单域 -->
        <el-form-item label="姓　　名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="addForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="select" label="性　　别" prop="sex">
          <el-radio-group v-model="addForm.sex">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色类型" prop="userType" :label-width="formLabelWidth">
          <el-select v-model="addForm.userType" placeholder="性别">
            <el-option label="图书管理" value="shanghai"></el-option>
            <el-option label="其他管理" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="id" :label-width="formLabelWidth">
          <el-input v-model="addForm.id" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phoneNumber" :label-width="formLabelWidth">
          <el-input v-model="addForm.phoneNumber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="select" prop="status" label="状　　态">
          <el-radio-group v-model="addForm.status">
            <el-radio label="禁用"></el-radio>
            <el-radio label="启用"></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 弹框表单按钮  验证失效-->
        <el-form-item class="dialogFooter">
          <el-button class="buttonTrueColor"  @click="submitForm('addForm')">确定</el-button>
          <el-button class="buttonCancelColor" @click="resetForm('addForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      addForm: {
        // 添加的数据表单 共8个参数
        addDialog: false,
        preloadImg: "", // 图片相关
        files: "", // 用于上传
        name: "", // 姓名
        sex: "", // 性别
        userType: "", // 角色类型 不明参数
        id: "", // 身份证
        phoneNumber: "", // 电话号码
        status: "" // 状态
      },
      addRules: {
        // 添加的参数验证
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "change" }
        ],
        id: [{ required: true, message: "请输入身份证号码", trigger: "blur" }],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      formLabelWidth: "120px"
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addpointer() {},
    addgetFile(e) {
      // 1.判断选择事件是否为空

      // 2. 获取数据
      let _this = this; // 缓存this
      let value = _this.$refs.addfile.value;

      var files = e.target.files[0]; // 事件对象包含的信息 files是路径
      _this.addForm.files = files;
      console.log(_this.addForm.files);
      // 2.1 防止后台拿不到数据 可能需要提交额外数据时
      var formdatas = new FormData();
      var fordata = formdatas.append("file", files);
      if (!e || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader(); // 定义 fileReader对象
      reader.readAsDataURL(files); // 转换为base64的url路径 其他三个API转换为text 二进制  arraybuffer
      reader.onloadend = function() {
        _this.addForm.preloadImg = this.result; // 此时this指向的fileReader对象
        _this.$refs.file.value = "";
        console.log(_this.addForm.preloadImg);
      };
    }
  }
};
</script>

<style scoped>
.upload {
  display: flex;
  justify-content: center;
}
.upload .defultHead {
  position: relative;
}
.defultHead:hover .bgload {
  display: block;
}
.bgload {
  background-color: rgba(0, 0, 0);
  position: absolute;
  top: 0;
  text-align: center;
  line-height: 100px;
  z-index: 3;
  opacity: 0.7;
  cursor: pointer;
  display: none;
  color: #fff;
}
.defultImg {
  position: absolute;
  z-index: 1;
}
.preloadImg {
  position: absolute;
  top: 0;
  z-index: 4;
}
</style>

