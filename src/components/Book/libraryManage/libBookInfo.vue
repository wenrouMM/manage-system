<template>
  <div class="bookInfo">
    <el-container>
      <div class="box-card">
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">馆内图书信息</span>
          </div>
          <!-- 2.0 表单填写 查询添加 内容需做调整  -->
          <section class="searchBox Posleft">
            <div class="buttonBox">
              <button class="add" @click="addDialogOpen">
                <i class="addIcon el-icon-plus"></i>添加
              </button>
            </div>

            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="书名:">
                <el-input size="120" v-model="searchForm.bookName" placeholder="请输入书籍名称"></el-input>
              </el-form-item>
              <el-form-item label="索书号:" size="160">
                <el-input v-model="searchForm.bookIndex" placeholder="请输入索书号"></el-input>
              </el-form-item>
              <!-- 下拉框 -->
              <el-form-item label="类型:" size="160">
                <el-select v-model="searchForm.type" placeholder="请选择类型">
                  <el-option
                    v-for="(option,index) of optionsType"
                    :key="index"
                    :label="option"
                    :value="option"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态:" size="160">
                <el-select v-model="searchForm.status" placeholder="请选择状态">
                  <el-option
                    v-for="(option,index) of optionsStatus"
                    :key="index"
                    :label="option"
                    :value="option"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button size="15" type="primary" @click="searchSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </section>
          <!-- 3.0 表格展示内容 需做更改部分 -->
          <section class="text item tablebox" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table
              class="tableBorder"
              :data="tableData"
              empty-text="无数据"
              style="width: 100%; text-align:center;"
              type="index"
              :row-style="rowStyle"
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'18px'}"
            >
              <el-table-column align="center" width="120" prop="index" label="序号"></el-table-column>
              <el-table-column align="center" width="200" prop="src" label="书籍名称"></el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="fkRoleNames"
                width="150"
                label="索书号"
              ></el-table-column>
              <el-table-column align="center" prop="username" width="150" label="作者"></el-table-column>
              <el-table-column align="center" prop="sex" width="150" label="出版社"></el-table-column>
              <el-table-column align="center" prop="idCard" width="150" label="页码"></el-table-column>
              <el-table-column align="center" prop="phone" width="150" label="价格"></el-table-column>
              <el-table-column align="center" prop="createTime" width="200" label="条码"></el-table-column>
              <el-table-column align="center" prop="isLock" width="150" label="类型"></el-table-column>
              <el-table-column align="center" label="操作" width="120">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="detail" @click="handleEdit(scope.$index, scope.row)">查看详情</span>
                </template>
              </el-table-column>
            </el-table>

            <!-- 5.0 分页内容 分页提交刷新页面 前进后退 点击以及调转四个事件传递数值-->
            <section class="pagination mt_30">
              <el-pagination
                background
                layout="prev, pager, next,total, jumper, ->"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                @current-change="current_change"
              ></el-pagination>
            </section>
          </section>
        </div>
      </div>
      <!-- end弹框组 添加弹框 -->
      <!-- 添加弹框 -->
      <div class="addEditDialog">
        <!-- Form -->
        <el-dialog
          @close="closeForm"
          width="685px"
          :title="Dialogtitle[0]"
          :visible.sync="dialogFormVisible"
        >
          <el-form
            v-loading="editLoading"
            element-loading-text="正在执行中"
            id="addFormBI"
            ref="addForm"
            :model="addForm"
            :rules="addRules"
          >
            <!-- 初始化未完成 -->
            <div class="row1">
              <el-form-item label="索书号码" class="mr_30" prop="lib" :label-width="formLabelWidth">
                <el-input v-model="addForm.lib" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="藏馆号码" prop="page" :label-width="formLabelWidth">
                <el-input v-model="addForm.page" autocomplete="off"></el-input>
              </el-form-item>
            </div>
            <div class="row1">
              <el-form-item label="藏馆数量" class="mr_30" prop="value" :label-width="formLabelWidth">
                <el-input v-model="addForm.value" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="借出数量" prop="barcode" :label-width="formLabelWidth">
                <el-input v-model="addForm.barcode" autocomplete="off"></el-input>
              </el-form-item>
            </div>
            <div class="row1">
              <el-form-item label="状态" prop="bookContent" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="addForm.bookContent" autocomplete="off"></el-input>
              </el-form-item>
            </div>
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
import {
  userManageInterface,
  roleType,
  headUpload,
  headimg
} from "../../../request/api/base.js";
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      optionsStatus: [
        "出纳",
        "前台",
        "图书盘点员",
        "采购员",
        "仓库管理员",
        "系统管理员"
      ],
      optionsType: [
        "出纳",
        "前台",
        "图书盘点员",
        "采购员",
        "仓库管理员",
        "系统管理员"
      ],
      /*====== 2.0表单搜索提交数据项 ======*/
      searchForm: {
        bookName: "",
        bookIndex: "",
        type: "",
        status: ""
      },

      /*====== 3.0表格设置项 ======*/
      tableLoading: false,
      rowStyle: {
        height: "60px"
      },
      tableData: [
        // 用于注入表单的数据 这里的数据应该在created钩子函数创建的时候向后台获取
      ],
      /*====== 3.1 分页设置项 ======*/
      total: 0,
      pageSize: 7,
      currentPage: 1,
      paginationForm: {},
      /*===== end 弹框初始化数据 ======*/
      dialogFormVisible: false, // // 添加弹框的展示和消失
      editLoading: false,
      files: null, // 传递给后台的请求
      defaultImg:'', // 默认图片地址
      Dialogtitle: ["添加"],
      addForm: {
        // 添加的数据表单 共8个参数
        addDialog: false,
        headerAddress: "", // 传递来的图片
        headIcon: "", // 预览的图片
        files: "", // 用于上传

        bookName: "", // 书籍名称
        bookIndex: "", // 书籍索引
        author: null, // 作者
        lib: "", // 出版社
        page: "", // 页码
        barcode: "", // 条码
        value: "", // 价格
        typeName: "", // 类型名称
        bookcontent: "" // 书籍简介
      },
      addRules: {
        // 添加的参数验证
        bookName: [
          { required: true, message: "请输入书籍名称", trigger: "blur" }
        ],
        bookIndex: [
          { required: true, message: "请输入索书号", trigger: "change" }
        ],
        author: [{ required: true, message: "请输入作者", trigger: "change" }],
        lib: [{ required: true, message: "请输入出版社", trigger: "blur" }],
        page: [{ required: true, message: "请输入页码", trigger: "blur" }],
        barcode: [{ required: true, message: "请输入条码", trigger: "blur" }],
        typeName: [
          { required: true, message: "请选择类型名称", trigger: "blur" }
        ],
        bookcontent: [
          { required: true, message: "请输入书籍简介", trigger: "change" }
        ]
      },
      formLabelWidth: "90px"
    };
  },
  computed: {
    searchTimeForm() {
      // 搜索所需数据 过滤数据 传递给后端的数据

      let searchForm = {};

      return searchForm;
    },
    addEdit() {
      // 添加传递数据

      let data = {};

      return data;
    }
  },
  mounted() {
    this.SearchApi(this.searchTimeForm); // 调用查询接口获取数据
    this.axios.get(libbook).then((res)=>{
      console.log(res)
    })
  },
  methods: {
    /*====== 2.0 搜索与添加按钮触发 ======*/
    searchSubmit() {
      // 条件查询按钮

      console.log("此时传给后台的搜索数据", this.searchTimeForm);
      this.SearchApi(this.searchTimeForm);
      this.currentPage = 1;
    },
    addDialogOpen() {
      // 添加按钮
      this.dialogFormVisible = true;
    },
    /*====== 3.0表格操作相关 ======*/
    // 打开详情页

    /*====== 3.1 分页查询和初始化 ======*/
    current_change: function(currentPage) {
      //分页查询
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;
      console.log("保存当前查询", this.paginationForm);
      this.SearchApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
    },

    /*====== end 弹框内相关函数 ======*/
    submitForm(formName) {
      // 提交弹框按钮执行函数
      let url = "";
      let method = "";
      let data = this.addEdit;
      let files = this.files; // 头像上传的文件 在编辑框中保存

      if (i == 2) {
        url = userManageInterface.edit;
        method = "put";
        console.log("调用编辑API", url, method, this.addEdit);
      } else {
        url = userManageInterface.add;
        method = "post";
        console.log("调用添加API", url, method, data);
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.editLoading = true; // 进入执行状态 锁定表单
          if (files != null) {
            // 检测是否有文件 有就意味着被更改了
            var formdatas = new FormData();
            formdatas.append("file", files);
            //console.log(formdatas.get('file'))
            this.axios({
              method: "post",
              url: headUpload,
              data: formdatas,
              //cache: false,//上传文件无需缓存
              processData: false, //用于对data参数进行序列化处理 这里必须false
              contentType: false, //
              dataType: "JSON",
              ContentType: "multipart/form-data"
            }).then(request => {
              // 如果是编辑 更换图片失败后
              if (request.data.row != "") {
                this.addForm.headerAddress = request.data.row;
              }
              console.log("上传图片后", this.addEdit);
            });
          }

          axios({
            // 发起API请求
            url: url,
            method: method,
            data: data
          }).then(res => {
            console.log(res.data);
            if (res.data.state) {
              this.SearchApi(this.searchTimeForm);
              this.$message.success("执行成功"); // 提示成功信息
              this.dialogFormVisible = false; // 关闭弹框
            } else {
              this.$message.error(res.data.msg); // 提示失败信息
            }
          });

          this.editLoading = false; // 执行结束后 解开锁屏
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      // 重置按钮
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
    closeForm() { // 关闭按钮 弹框关闭的时候执行 清空数据
      console.log("关闭测试");
      let obj = this.addForm;
      this.addForm.headIcon = "";
      this.$refs.addForm.resetFields(); // 调用这个方法进行清除登陆状态
    },

    pointer() {
      // 图片上传
      this.$refs.file.click();
    },
    getFile(e) {
      // 图片预览
      let _this = this; // 缓存this
      let value = _this.$refs.file.value;
      var files = e.target.files[0]; // 事件对象包含的信息 files是路径
      _this.files = files;
      console.log(_this.files);
      if (!e || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader(); // 定义 fileReader对象
      reader.readAsDataURL(files); // 转换为base64的url路径 其他三个API转换为text 二进制  arraybuffer
      reader.onloadend = function() {
        _this.addForm.headIcon = this.result; // 此时this指向的fileReader对象
        _this.$refs.file.value = "";
      };
    },
    /*====== baseAPI调用相关 ======*/
    SearchApi(value) {
      //获取登录记录 或者说是加载数据 这里应该请求的时候加状态动画
      this.loadingTable = true; // 加载前控制加载状态
      axios
        .get(userManageInterface.select, {
          params: value
        })
        .then(res => {
          console.log("当前获取的数据", res.data);
          if (res.data.state === true) {
            let nomol = res.data.row;
            let i = 1;
            for (let item of nomol) {
              item.index = i;
              i++;
            }
            this.tableData = nomol; //获取返回数据
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
            console.log("过滤后的数据", nomol);
            console.log("保存当前查询", this.paginationForm);
            this.loadingTable = false;
          } else {
            this.$message.error(res.data.msg);
            this.loadingTable = false;
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    addApi(data) {}
  }
};
</script>

<style scoped>
/*====== 0.0 初始化部分 ======*/

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

.box-card {
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
.Posleft {
  display: flex;
  justify-content: space-between;
}
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
#addFormBI {
}

#addFormBI .upload {
  width: 150px;
  height: 200px;
  background-color: #333;
}
#addFormBI .infoGroup {
  width: 440px;
}
.row1 {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
</style>

