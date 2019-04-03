<template>
  <div class="addDialog">
    <transition name="fade">
      <div class="mask" v-if="mask" @click="closeDialog"></div>
    </transition>
    <!-- 测试框 -->
    <div @click="openEditForm">点击测试</div>
    <transition name="dialog">
      <div class="add" v-if="addDialog">
        <div class="dialogTitle">
          <p>编辑</p>
          <i class="close" @click="cancelEditForm()"></i>
        </div>
        <div class="dialogBody">
          <el-form
            :model="addForm"
            :rules="addRules"
            ref="addForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <!-- 上传图片 -->
            <div class="upload mb_30" @click="point">
              <!-- 背景图片做改动 -->
              <div class="defultHead" style="width:100px; height:100px; border-radius:50%;">
                <img
                  class="defaultimage"
                  style="width:100px; height:100px; border-radius:50%;"
                  :src="defaultImg"
                  v-if="!editForm.preloadImg"
                  alt="user image"
                >
                <img
                  v-if="editForm.preloadImg"
                  :src="editForm.preloadImg"
                  style="width:100px; height:100px ;border-radius:50%;"
                  alt="预览照片"
                >
                <input
                  type="file"
                  accept="jpg/png"
                  style="display:none;"
                  @change="editgetFile"
                  ref="editfile"
                  id="file"
                >
                <div class="bgload" style="width:100px; height:100px; border-radius:50%;">上传头像</div>
              </div>
            </div>
            <div class="row1">
              <el-form-item label="姓　　名" prop="name">
                <el-input v-model="editForm.name"></el-input>
              </el-form-item>
              <el-form-item label="性　　别" prop="sex">
                <el-radio-group v-model="editForm.sex">
                  <el-radio label="男"></el-radio>
                  <el-radio label="女"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="row1">
              <el-form-item label="角色名称:" size="160" prop="userType">
                <el-select v-model="editForm.userType" placeholder="请选择角色">
                  <el-option
                    v-for="(option,index) of optionsData"
                    :key="index"
                    :label="option"
                    :value="option"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="身份证号" prop="id">
                <el-input v-model="editForm.id"></el-input>
              </el-form-item>
            </div>
            <div class="row1">
              <el-form-item label="电话号码" prop="phoneNumber">
                <el-input v-model="editForm.phoneNumber"></el-input>
              </el-form-item>

              <el-form-item label="状　　态" prop="status">
                <el-radio-group v-model="editForm.status">
                  <el-radio label="启用" value="启用"></el-radio>
                  <el-radio label="禁用" value="禁用"></el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-form>
          <div class="dialog-footer">
            <span class="dialogButton true mr_40" @click="submitEditForm">确 定</span>
            <span class="dialogButton cancel" @click="cancelEditForm">取消</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /*====== 0.0 初始化参数 ======*/
      mask: false, // 遮罩展示和关闭
      defaultImg: " ", // 上传头像默认头像
      addDialog: false, // 添加弹框的展示和消失
      optionsData: [
        // 下拉框
        "出纳",
        "前台",
        "图书盘点员",
        "采购员",
        "仓库管理员",
        "系统管理员"
      ],
      /*====== 添加弹框区域 ======*/
      editForm: {
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
      editRules: {
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
      }

      /*====== 编辑弹框区域 ======*/

      /*====== 禁用弹框 ======*/

      /*====== 批量删除 ======*/

      /*====== 分页功能 ======*/
    };
  },
  methods: {
    // 编辑和添加框
    openEditForm() {
      this.mask = true;
      this.addDialog = true;
      // 还应该把点击的对象的数据动态绑定到表单中
    },
    cancelEditForm() {
      this.addDialog = false;
      this.mask = false;
      // 清空表单
      var obj = this.addForm
      for (var i in obj) {
        obj[i] = "";
      }
    },
    submitEditForm(){
        // 1.做检验 2. 获取数据发送给后台 3. 后台收到完毕后 把该对象 添加进首页的表格数据data 4.调用cancelAddForm 清空此处的表单对象
    },
    // 图片上传
    editpoint() {
      this.$refs.editfile.click();
    },
    editgetFile(e) {
      // 1.判断选择事件是否为空

      // 2. 获取数据
      let _this = this; // 缓存this
      let value = _this.$refs.editfile.value;

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
.mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 2;

  background: rgba(0, 0, 0, 1);
  opacity: 0.5;
}
.add {
  width: 685px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0 !important;
  border-radius: 20px;
  z-index: 5;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: none;
}
.add .dialogTitle {
  height: 80px;
  background-color: #0096ff;
  text-align: center;
  line-height: 80px;
  color: #fff;
  font-size: 26px;
  position: relative;
}
.add .close {
  position: absolute;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;
  top: 25px;
  right: 30px;
  font-size: 16px;
  cursor: pointer;
}
.add .dialogBody {
  background: #fff;
  padding-top: 30px;
}
.add .dialog-footer {
  padding-bottom: 46px;
}
/*Vue过渡动画*/
/*遮罩过渡*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/*过渡的状态 即过渡的关键帧打那些*/
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s;
}
.dialog-enter, .dialog-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  top: 47%;
}
/*row排列*/
.row1 {
  display: flex;
  padding: 0 30px;
}
.row1 .el-form-item {
  margin-bottom: 30px;
}
.row1.el-input .el-input__inner {
  width: 200px;
}
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
