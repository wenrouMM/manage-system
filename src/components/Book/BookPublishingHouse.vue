<template>
  <div id="menu">
    <div style="display: flex;flex-direction: row" id="mymenu">
      <div style="background-color:white;width:250px;display: flex;flex-direction:column;overflow:auto">
        <div style="width: 250px;height:60px;background-color: #0096FF;font-size: 18px;color: white;text-align: center;line-height: 60px ">一体化管理系统</div>
        <ul id="treeDemo" class="ztree" style="margin-top:30px;margin-left:30px"></ul>
      </div>
      <div style="width: 1320px;margin-left: 30px;background-color:white;height:852px">
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">图书出版社</span>
          </div>
          <!-- 2.0 表单填写 查询接口 状态：正在查询（loading组件） 查询成功 查询失败 -->
          <div style='display:flex;flex-direction:row'>
            <!-- 3.0 添加删除按钮 添加之前：弹框提交  状态： 正在添加 添加完成（alert提示自带）/添加失败请重试 -->
            <div class="buttonBox">
              <button class="add" @click="addDialogOpen">
                <i class="addIcon el-icon-plus"></i>添加
              </button>
            </div>
            <section class="searchBox" style='margin-left:720px'>
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="出版社名称:" size="160">
                  <el-input v-model="formInline.userId" placeholder="请输入出版社名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="15" type="primary" @click="onSubmit">搜索</el-button>
                </el-form-item>
              </el-form>
            </section>
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
              <el-table-column align="center" prop="bookname" width="100" label="出版社名称"></el-table-column>
              <el-table-column align="center" prop="address" width label="公司地址"></el-table-column>
              <el-table-column align="center" prop="name" width="100" label="联系人"></el-table-column>
              <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
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
          <section class="pagination" style="margin-top: 80px">
            <el-pagination background layout="prev, pager, next,total, jumper, ->" :total="1000"></el-pagination>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        /*====== 0.0初始化弹框数据ztree ======*/
        setting: {
          edit: {
            enable: true,
            showRemoveBtn: true,
            addHoverBtn: true,
            removeTitle: "删除节点",
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
            addDiyDom: this.addDiyDom,
            selectedMulti: true,
            addHoverDom: this.addHoverDom,
            removeHoverDom: this.removeHoverDom
          },
          callback: {
            onClick: this.zTreeOnClick, //节点点击事件
            onCollapse: this.onCollapse, //点击图标按钮节点 折叠后 异步加载子数据
            beforeRemove: this.zTreeBeforeRemove, //点击删除时，用来提示用户是否确定删除
            beforeEditName: this.beforeEditName, //点击编辑时触发，用来判断该节点是否能编辑
            onRemove: this.onRemove //删除事件
          }
        },
        zNodes: [
          {
            id: 1,
            pId: 0,
            name: "图书馆管理平台",
            code: null,
            msg: null,
            href: null,
            disabled: null,
            icon_default: null,
            icon_selected: null,
            menu_code_type: null
          }
        ],
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
            srcdata:
              "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3031412719,4225417772&fm=11&gp=0.jpg",
            name: "王小虎",
            password: "123456",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            now: "禁用"
          },
          {
            idType: "2",
            srcdata: "",
            name: "王小虎",
            password: "123456",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            now: "禁用"
          },
          {
            idType: "3",
            username: "",
            name: "王小虎",
            password: "123456",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            now: "禁用"
          },
          {
            idType: "4",
            username: "admin",
            name: "王小虎",
            password: "123456",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            now: "禁用"
          },
          {
            idType: "5",
            username: "admin",
            name: "王小虎",
            password: "123456",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            now: "禁用"
          },
          {
            idType: "6",
            username: "admin",
            name: "王小虎",
            password: "123456",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            now: "禁用"
          },
          {
            idType: "7",
            username: "admin",
            name: "王小虎",
            password: "123456",
            sex: "男",
            ID: 500221199502011716,
            phone: 18223213182,
            startTime: "2019-03-24 12:33",
            now: "禁用"
          }
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
        this.dialogFormVisible = true;
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
        this.i = 2;
        this.dialogFormVisible = true;
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
            this.dialogFormVisible = true; // 关闭弹框
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
      closeForm() {
        // 弹框关闭的时候执行 清空数据
        console.log("关闭测试");
        let obj = this.addForm;
        for (var i in obj) {
          obj[i] = "";
        }
      }
    },
    mounted(){
      $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    }
  };
</script>

<style scoped>
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
</style>
