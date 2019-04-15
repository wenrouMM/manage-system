<template>
  <div class="bookInfo">
    <el-container>
      <div class="box-card">
        <!-- 类型名称弹框-->
        <div id="typeMessage" >
          <div style="position: relative">
            <p>请选择类型名称</p>
            <img src="../../../base/img/menu/xx.png" style="position: absolute;top: 10px;left: 340px;width: 30px;height: 30px" @click="closeCheck">
          </div>
          <div>
            <ul id="treeDemo" class="ztree"></ul>
          </div>
        </div>
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
              <el-form-item label="类型:" size="160"  style="position: relative">
                <el-input v-model="searchForm.type" placeholder="请输入类型"></el-input>
                <img src="../../../../src/base/img/currency/sousuo.png" style="width: 40px;height: 40px;position: absolute;top: 0;left: 120px" @click="typeMessage">
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
          <section class="text item tablebox">
            <el-table
              v-loading="tableLoading"
              class="tableBorder"
              :data="tableData"
              style="width: 100%; text-align:center;"
              :row-style="rowStyle"
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
            >
              <el-table-column align="center" width="80" prop="index" label="序号"></el-table-column>
              <el-table-column align="center" width="120" prop="name" label="书名"></el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="searchNumber"
                width="150"
                label="索书号"
              ></el-table-column>
              <el-table-column align="center" prop="libraryBookCode" :show-overflow-tooltip="true" width="120" label="馆藏码"></el-table-column>
              <el-table-column align="center" prop="barcode" width="150" :show-overflow-tooltip="true" label="条码"></el-table-column>
              <el-table-column align="center" prop="lend" width="80" label="借出数量"></el-table-column>
              <el-table-column align="center" prop="total" width="150" :show-overflow-tooltip="true" label="馆藏数量"></el-table-column>
              <el-table-column align="center" prop="person" width="80" :show-overflow-tooltip="true" label="录入员"></el-table-column>
              <el-table-column align="center" prop="entryTime" width="150" :show-overflow-tooltip="true" label="录入时间"></el-table-column>
              <el-table-column align="center" prop="creatTime" width="150" :show-overflow-tooltip="true" label="入藏时间"></el-table-column>
              <el-table-column align="center" prop="fkTypeCode" width="100" label="类型"></el-table-column>
              <el-table-column align="center" prop="state" width="100" label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.state ===0?'启用':'禁用'}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="110">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="edit" @click="handleEdit(scope.$index, scope.row)">详情</span>
                  <span class="ban" @click="handleBan(scope.$index, scope.row)">下架</span>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
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
      <!-- 下架弹框 -->
      <div class="forbid">
        <el-dialog :title="Dialogtitle[i]" :visible.sync="centerDialogVisible" width="500px" center>
          <div class="dialogBody">是否{{Dialogtitle[i]}}?</div>
          <div slot="footer" class="dialog-footer">
            <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
            <span class="dialogButton cancel" @click="centerDialogVisible = false">取消</span>
          </div>
        </el-dialog>
      </div>
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
              <el-form-item label="索书号码" class="mr_30" prop="indexNum" :label-width="formLabelWidth">
                <el-input v-model="addForm.indexNum" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="藏馆号码" prop="Num" :label-width="formLabelWidth">
                <el-input v-model="addForm.Num" autocomplete="off"></el-input>
              </el-form-item>
            </div>
            <div class="row1">
              <el-form-item label="藏馆数量" class="mr_30" prop="libNum" :label-width="formLabelWidth">
                <el-input v-model="addForm.libNum" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="借出数量" prop="returnNum" :label-width="formLabelWidth">
                <el-input v-model="addForm.returnNum" autocomplete="off"></el-input>
              </el-form-item>
            </div>
            <div class="row1">
              <el-form-item label="状态" prop="status" :label-width="formLabelWidth">
                <el-input type="textarea" v-model="addForm.status" autocomplete="off"></el-input>
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
      setting: {
        edit: {
          enable: true,
          showRemoveBtn: false,
          addHoverBtn: false,
          showRenameBtn: false,
          editNameSelectAll: true
        },
        data: {
          simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "pId",
            rootPId: 0
          }
        },
        view: {
          showLine: false,
          showIcon: true,
          dblClickExpand: false,
          selectedMulti: true,
        },
        callback: {
          onClick: this.zTreeOnClick, //节点点击事件
        }
      },
      zNodes: [],
      optionsStatus: [
        "禁用",
        "启用",
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
      centerDialogVisible:false,
      editLoading: false,
      files: null, // 传递给后台的请求
      defaultImg:'', // 默认图片地址
      i:0,
      Dialogtitle: ["添加",'下架'],
      addForm: {
        // 添加的数据表单 共8个参数
        addDialog: false,
        indexNum:"",
        Num:"",
        libNum:"",
        returnNum:"",
        status:""
      },
      addRules: {
        // 添加的参数验证
        indexNum: [{ required: true, message: "请输入索书号码", trigger: "blur" }],
        Num: [{ required: true, message: "请输入藏馆号码", trigger: "blur" }],
        libNum: [{ required: true, message: "请输入藏馆数量", trigger: "blur" }],
        returnNum: [{ required: true, message: "请输入借出数量", trigger: "blur" }],
        status: [{ required: true, message: "请输入状态", trigger: "blur" }],
      },
      formLabelWidth: "90px",
      undercarriage:null, //下架所需参数
    };
  },
  computed: {
    searchTimeForm() {
      // 搜索所需数据 过滤数据 传递给后端的数据
      var state=null
      if(this.searchForm.status=='禁用'){
        state=1
      }else if(this.searchForm.status=='启用'){
        state=0
      }else if(this.searchForm.status==''){
        state=''
      }
      let searchForm = {
        pageSize: this.pageSize,
        currentPage:1,
        name:this.searchForm.bookName,
        searchNumber:this.searchForm.bookIndex,
        fkTypeCode:this.searchForm.type,
        state:state
      };
      return searchForm;
    },
    addEdit() {
      // 添加传递数据

      let data = {

      };
      return data;
    }
  },
  mounted() {
    this.SearchApi(this.searchTimeForm); // 调用查询接口获取数据
    this.freshArea()
    $('#typeMessage').fadeOut()
    this.axios.get(libbook).then((res)=>{
      console.log(res)
    })
  },
  methods: {
    async freshArea() {
      this.axios.get(bookurltypemes).then((response)=>{
        console.log(response)
        for (var item of response.data.row) {
          //console.log(item)
          this.zNodes.push({
            id: item.id, //节点id
            pId: item.pid, //节点父id
            name: item.name, //节点名称
            code:item.code, //
          });
        }
        //将数据渲染到ztree树
        $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
      })
    },
    typeMessage(){
      $('#typeMessage').fadeIn()
    },
    closeCheck(){
      $('#typeMessage').fadeOut()
    },
    zTreeOnClick(event, treeId, treeNode) {
      $('#typeMessage').fadeOut()
      this.searchForm.type=treeNode.name
    },
    /*====== 2.0 搜索与添加按钮触发 ======*/
    searchSubmit() {
      // 条件查询按钮

      console.log("此时传给后台的搜索数据", this.searchTimeForm);
      this.SearchApi(this.searchTimeForm);
      this.currentPage = 1;
    },
    handleBan(index, row) {
      //下架
      console.log( row); // 当前选中表格的索引和对象
      this.undercarriage=row
      this.i= 1;
      this.centerDialogVisible = true;
    },
    submitDialog() {
      // 用于提交接口数据的函数 可以传入一个接口回调函数使用 删除操作和禁用操作可以写在外面 然后根据i来判断此时是禁用窗口还是删除窗口 来执行对应操作 如果觉得麻烦就复制两份单独处理
      let i = this.i;
      let tips = this.Dialogtitle[i];
      //alert(`${tips}成功`); // 成功之后映射到数组的操作
      this.axios.post(libbookedit,this.undercarriage).then((res)=>{
        console.log(res)
        if(res.data.state==true){
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
        }else{
          this.$message.error(res.data.msg);
        }
      })
      this.centerDialogVisible = false;
    },
    handleEdit(index, row) {
      // 详情
      this.i = 2;
      this.dialogFormVisible = true
      console.log(index, row);
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
      this.addApi(this.addEdit)
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
      this.tableLoading = true; // 加载前控制加载状态
      axios
        .get(libbook, {
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
            this.tableLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.tableLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });

    },
    addApi(data) {
      this.axios.post(libbookadd,data).then((res)=>{
        console.log(res)
      })
    }
  }
};
</script>

<style scoped>
/*====== 0.0 初始化部分 ======*/
.edit {
  color: #00d7f0;
  cursor: pointer;
  margin-right: 20px;
}
.ban {
  color: #ff5c3c;
  cursor: pointer;
}
#typeMessage{
  display: none;
  position: absolute;
  top: 200px;
  left:750px;
  z-index: 30000;

}
#typeMessage div:nth-child(1){
  width: 400px;
  height: 50px;
  background-color: #0096FF;
  font-size: 20px;
  color: white;
  text-align: center;
  line-height: 50px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
  -moz-box-shadow: 2px 2px 10px #909090;
  -webkit-box-shadow: 2px 2px 10px #909090;
  box-shadow:2px 2px 10px #909090;
}
#typeMessage div:nth-child(2) {
  overflow: auto;
  height: 500px;
  width: 370px;
  background-color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  padding-left: 30px;
  padding-bottom: 30px;
  filter: progid:DXImageTransform.Microsoft.Shadow(color=#909090, direction=120, strength=4);
  -moz-box-shadow: 2px 2px 10px #909090;
  -webkit-box-shadow: 2px 2px 10px #909090;
  box-shadow: 2px 2px 10px #909090;
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

