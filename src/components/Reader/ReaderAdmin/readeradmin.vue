<template>
  <div class="useradd">
    <el-container>
      <div class="box-card">
        <div class="space"></div>
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">用户管理列表</span>
          </div>
          <!-- 2.0 表单填写 查询接口 状态：正在查询（loading组件） 查询成功 查询失败 -->
          <section class="searchBox">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="用户名:">
                <el-input size="120" v-model="formInline.userName" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="身份证号:" size="160">
                <el-input v-model="formInline.userId" placeholder="请输入身份证号"></el-input>
              </el-form-item>
              <el-form-item label="手机号码:" size="160">
                <el-input v-model="formInline.userPhone" placeholder="请输入手机号码"></el-input>
              </el-form-item>
              <el-form-item label="创建时间:" size="130">
                <el-date-picker
                  v-model="formInline.date"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button size="15" type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </section>
          <!-- 3.0 添加删除按钮 添加之前：弹框提交  状态： 正在添加 添加完成（alert提示自带）/添加失败请重试 -->
          <div class="buttonBox">
            <button class="add" @click="addDialogOpen">
              <i class="addIcon el-icon-plus"></i>办卡
            </button>
            <button class="delete" @click="batchDelete">
              <i class="deleteIcon el-icon-delete"></i>批量禁用
            </button>
          </div>
          <!-- 4.0 表格展示内容 编辑功能：状态用上 禁用 批量禁用弹框 弹框可尝试用slot插槽封装 -->
          <section class="text item tablebox">
            <el-table
              class="tableBorder"
              :data="tableData"
              style="width: 100%; text-align:center;"
              :row-style="rowStyle"
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
            >
              <el-table-column align="center" type="selection" width="100"></el-table-column>
              <el-table-column align="center" width="100" prop="idType" label="序号"></el-table-column>
              <el-table-column align="center" width="100" prop="srcdata" label="头像">
                <template slot-scope="scope">
                  <span class="imgDefault">
                    <img
                      v-if="scope.row.srcdata"
                      class="head_pic"
                      :src="scope.row.srcdata"
                      width="30px"
                      height="30px;"
                      style="border-radius: 50%"
                    >
                  </span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="name" width label="用户名"></el-table-column>
              <el-table-column align="center" width="100" prop="sex" label="性别"></el-table-column>
              <el-table-column align="center" prop="ID" width="200" label="身份证号"></el-table-column>
              <el-table-column align="center" prop="phone" label="手机号码"></el-table-column>
              <el-table-column align="center" prop="startTime" width="200" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="editTime" width="200" label="修改时间"></el-table-column>
              <el-table-column align="center" prop="now" width="70" label="状态"></el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="edit" @click="handleEdit(scope.$index, scope.row)">编辑</span>
                  <span class="ban" @click="handleBan(scope.$index, scope.row)">禁用</span>
                </template>
              </el-table-column>
            </el-table>
          </section>
          <!-- 5.0 分页内容 分页提交刷新页面 前进后退 点击以及调转四个事件传递数值-->
          <section class="pagination">
            <el-pagination background layout="prev, pager, next,total, jumper, ->" :total="1000"></el-pagination>
          </section>
        </div>
      </div>
      <!-- 弹框组 添加弹框未知 批量删除弹框 禁用弹框 编辑弹框 -->
      <!-- 禁用弹框/批量删除弹框 -->
      <div class="forbid">
        <el-dialog :title="Dialogtitle[i]" :visible.sync="centerDialogVisible" width="500px" center>
          <div class="dialogBody">是否{{Dialogtitle[i]}}?</div>
          <div slot="footer" class="dialog-footer">
            <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
            <span class="dialogButton cancel" @click="centerDialogVisible = false">取消</span>
          </div>
        </el-dialog>
      </div>
      <!-- 批量删除弹框 -->
      <!-- 编辑弹框 -->
      <!-- 添加弹框 -->
      <div class="addEditDialog">
        <!-- Form -->
        <el-dialog @close="closeForm" width="685px" :title="Dialogtitle[3]" :visible.sync="dialogFormVisible">
          <el-form ref="addForm" :model="addForm" :rules="addRules">
            <el-form-item class="uploadBox">
              <section class="upload mb_30" @click="pointer">
                <!-- 背景图片做改动 -->
                <div class="defultHead" style="width:100px; height:100px; border-radius:50%;">
                  <img
                    class="defaultimage"
                    style="width:100px; height:100px; border-radius:50%;"
                    alt="user image"
                    :src="defaultImg"
                    v-if="!addForm.preloading"
                  >
                  <img
                    style="width:100px; height:100px ;border-radius:50%;"
                    v-if="addForm.preloadImg"
                    :src="addForm.preloadImg"
                    alt="预览照片"
                    class="preloadImg"
                  >
                  <input
                    type="file"
                    accept="jpg/png"
                    style="display:none;"
                    ref="file"
                    id="file"
                    @change="getFile"
                  >
                  <div class="bgload" style="width:100px; height:100px; border-radius:50%;">上传头像</div>
                </div>
              </section>
            </el-form-item>
            <!-- 表单域 -->
            <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
              <el-input v-model="addForm.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="select" label="性　　别" prop="sex">
              <el-radio-group v-model="addForm.sex">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
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
              <el-button class="buttonTrueColor" @click="submitForm('addForm')">确定</el-button>
              <el-button class="buttonCancelColor" @click="resetForm('addForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        /*====== 0.0初始化弹框数据 ======*/
        centerDialogVisible: false, // 禁用弹框
        Dialogtitle: ["禁用", "批量删除", "编辑", "添加"],
        i: 0, // 切换弹框标题
        defaultImg: " ", // 上传头像默认头像
        dialogFormVisible: false, // // 添加弹框的展示和消失
        addForm: {
          // 添加的数据表单 共8个参数
          addDialog: false,
          preloadImg: "", // 图片相关
          files: "", // 用于上传
          name: "", // 用户名
          sex: "", // 性别
          id: "", // 身份证
          phoneNumber: "", // 电话号码
          status: "" // 状态
        },
        addRules: {
          // 添加的参数验证
          name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
          sex: [{ required: true, message: "请选择性别", trigger: "change" }],
          id: [{ required: true, message: "请输入身份证号码", trigger: "blur" }],
          phoneNumber: [
            { required: true, message: "请输入手机号码", trigger: "blur" }
          ],
          status: [{ required: true, message: "请选择状态", trigger: "change" }]
        },
        formLabelWidth: "120px",
        /*====== 2.0表单提交数据项 ======*/
        optionsData: [
          "出纳",
          "前台",
          "图书盘点员",
          "采购员",
          "仓库管理员",
          "系统管理员"
        ],
        formInline: {
          // 搜索需要的表单数据
          userName: "",
          userType: "",
          userId: "",
          userPhone: "",
          date: "" // 选择日期
        },
        search: "", // 存储搜索完成后的2.0表单数据 用于调用分页接口

        /*====== 3.0添加 批量删除所需数据 ======*/
        Allseclet: [], // 存储全选框 单选框的数据/索引 用于传递给后台同时 前端用索引号去删除表格内的内容

        /*====== 4.0表格设置项 ======*/
        rowStyle: {
          height: "60px"
        },
        tableData: [
          // 用于注入表单的数据 这里的数据应该在created钩子函数创建的时候向后台获取
          {
            idType: "1",
            srcdata:'',//头像地址
            name: "王小虎",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            editTime:'2019-4-32 12:44',
            now: "禁用",
          },
          {
            idType: "1",
            srcdata:'',//头像地址
            name: "王小虎",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            editTime:'2019-4-32 12:44',
            now: "禁用",
          },

        ]
        /*====== 5.0 分页相关设置项 ======*/
      };
    },

    methods: {
      /*====== 2.0 表单提交相关函数 ======*/

      onSubmit() {
        // date提交的值需要做相关处理转换 提交之后的数据绑定到tableDta 映射到表格数据中
        console.log(this.formInline);
      },

      /*====== 3.0添加删除相关操作 ======*/
      addDialogOpen() {
        this.i = 3;
        this.dialogFormVisible = true
      },
      batchDelete() {
        // 批量删除
        this.i = 1;
        this.centerDialogVisible = true;
      },

      /*====== 4.0表格操作相关 ======*/
      handleBan(index, row) {
        // 删除
        console.log(index, row); // 当前选中表格的索引和对象
        this.i = 0;
        this.centerDialogVisible = true;
      },
      handleEdit(index, row) {
        // 编辑
        this.i = 2
        this.dialogFormVisible = true
        console.log(index, row);
      },

      /*====== 弹框相关函数 ======*/
      submitDialog() {
        // 用于提交接口数据的函数 可以传入一个接口回调函数使用 删除操作和禁用操作可以写在外面 然后根据i来判断此时是禁用窗口还是删除窗口 来执行对应操作 如果觉得麻烦就复制两份单独处理
        let i = this.i;
        let tips = this.Dialogtitle[i];
        alert(`${tips}成功`); // 成功之后映射到数组的操作
        this.centerDialogVisible = false;
      },
      // 编辑弹框
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            alert("submit!");
            this.dialogFormVisible = true // 关闭弹框
          } else {
            console.log("error submit!!");
            console.log(this.addForm);
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      pointer() {
        this.$refs.file.click();
      },
      getFile(e) {
        // 1.判断选择事件是否为空
        // 2. 获取数据
        let _this = this; // 缓存this
        let value = _this.$refs.file.value;

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
      },
      closeForm() { // 弹框关闭的时候执行 清空数据
        console.log("关闭测试");
        let obj = this.addForm;
        for (var i in obj) {
          obj[i] = "";
        }
      }
    }
  };
</script>

<style scoped>
  /*====== 0.0 初始化部分 ======*/
  .routerBox {
    background-color: #fff;
    min-height: 70px;
    width: 100%;
    padding: 0 30px;
    align-items: center;
    display: flex;
    box-sizing: border-box;
  }
  .routerButton {
    margin-right: 30px;
  }
  .space {
    background-color: #ebf7ff;
    height: 30px;
  }
  .box-card {
    background-color: #fff;
    box-sizing: border-box;
  }
  .important {
    padding: 30px;
  }
  /* 1.0标题 通用部分 */
  .sonTitle {
  }
  .sonTitle .titleName {
    border-left: 4px solid #0096ff;
    padding-left: 10px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(135, 135, 135, 1);
    display: inline-block;
    margin-bottom: 33px;
  }
  .useradd {
  }
  .useradd .box-card {
    width: 100%;
  }
  .text {
    font-size: 14px;
  }
  /* 清楚浮动 */
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
  /*====== 2.0表单区域 ======*/
  /* 可以通过size属性添加一个classname */

  .el-form--inline .el-form-item {
    margin-right: 25px;
  }
  .el-form--inline .el-form-item:last-child {
    margin-right: 0;
  }
  .el-input.el-input--120 {
    width: 160px;
  }
  .el-input.el-input--120 input {
    height: 36px;
    line-height: 36px;
  }
  .el-input.el-input--160 {
    width: 160px;
  }
  .el-range-editor--130 {
    width: 300px;
  }
  .el-select.el-select--160 {
    width: 160px;
  }
  .el-button--15 {
    padding: 12px 29px;
  }
  /* 按钮 */
  .buttonBox {
    margin-bottom: 30px;
  }
  .buttonBox button {
    padding-left: 18px;
    padding-right: 18px;
    height: 40px;
    font-size: 16px;
    color: #fff;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: none;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
  }
  .buttonBox .add {
    background: rgba(255, 146, 49, 1);
    border-radius: 10px;
    margin-right: 30px;
  }
  .buttonBox .add .addIcon {
    margin-right: 6px;
  }
  .buttonBox .delete {
    background: rgba(255, 92, 60, 1);
    border-radius: 10px;
  }
  .buttonBox .delete .deleteIcon {
    margin-right: 6px;
  }
  /*====== 3.0表格区域 ======*/
  .item {
    margin-bottom: 50px;
  }
  .tablebox .tableBorder {
    border: 1px solid #ebeef5;
    border-bottom: none;
    font-size: 16px;
  }
  /* 操作表格区 表格列添加样式名是无效的 */
  .imgDefault {
    width: 30px;
    height: 30px;
    display: inline-block;
    border-radius: 50%;
    background-color: #333;
  }
  .operator {
  }
  .edit {
    color: #00d7f0;
    cursor: pointer;
    margin-right: 20px;
  }
  .ban {
    color: #ff5c3c;
    cursor: pointer;
  }
  /*====== 4.0 分页器区域 ======*/
  .pagination .el-pagination {
    display: flex;
    justify-content: center;
  }

  /*====== 后期频繁更改部分 ======*/
  .routerButton {
    position: relative;
    text-align: left;
    padding-left: 20px;
  }
  .Iconerror {
    position: absolute;
    width: 12px;
    height: 12px;
    font-size: 16px;
    color: #fff;
    right: 20px;
  }
  .labelActive {
    background-color: #0096ff;
    color: #fff;
    border: none;
  }
  /*====== 弹框相关部分 后期可能更新为全局通用样式 ======*/
  .mask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 2;
    background: rgba(0, 0, 0, 1);
    opacity: 0.5;
  }
  .addDialog {
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
  .addDialog .dialogTitle {
    height: 80px;
    background-color: #0096ff;
    text-align: center;
    line-height: 80px;
    color: #fff;
    font-size: 26px;
    position: relative;
  }
  .addDialog .close {
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
  .addDialog .dialogBody {
    background: #fff;
    padding-top: 30px;
  }
  .addDialog .dialog-footer {
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
    left: 0;
    z-index: 3;
    text-align: center;
    line-height: 100px;
  }
</style>


