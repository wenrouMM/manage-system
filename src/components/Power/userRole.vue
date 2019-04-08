<template>
  <div class="userRole">
    <el-container>
      <div class="box-card">
        <!-- 0.0 面包屑路由导航部分 此处路由导航可以直接跳 属于动态添加渲染出的 -->
        <div class="routerBox">
          <span class="routerButton circularButton labelActive">
            角色管理
            <i class="Iconerror">x</i>
          </span>
        </div>
        <div class="space"></div>
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">角色管理列表</span>
          </div>
          <!-- 2.0 表单填写 查询接口 状态：正在查询（loading组件） 查询成功 查询失败 -->
          <div style='display:flex;flex-direction:row'>
            <!-- 3.0 添加删除按钮 添加之前：弹框提交  状态： 正在添加 添加完成（alert提示自带）/添加失败请重试 -->
          <div class="buttonBox">
            <button class="add" @click="addDialogOpen">
              <i class="addIcon el-icon-plus"></i>添加
            </button>
            <button class="delete" @click="batchDelete(tableChecked)">
              <i class="deleteIcon el-icon-delete"></i>批量删除
            </button>
          </div>
          <section class="searchBox" style='margin-left:320px'>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="角色名称:" size="160">
                <el-input size="120" v-model="formInline.parent" placeholder="请输入角色名称"></el-input>
              </el-form-item>
              <el-form-item label="创建时间:" size="130">
                <el-date-picker
                  v-model="formInline.startTime"
                  type="date"
                  placeholder="开始日期"
                  :picker-options="pickerOptions0"
                ></el-date-picker>
                <el-date-picker
                  v-model="formInline.endTime"
                  type="date"
                  placeholder="结束日期"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button size="15" type="primary" @click="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </section>
          </div>
          <!-- 4.0 表格展示内容 编辑功能：状态用上 禁用 批量禁用弹框 弹框可尝试用slot插槽封装 -->
          <section class="text item tablebox">
            <el-table class="tableBorder" v-loading="tableLoading" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%; text-align:center;" :row-style="rowStyle" :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}">
              <el-table-column align="center" type="selection" width="100" ></el-table-column>
              <el-table-column align="center" prop="id" label="序号"></el-table-column>
              <el-table-column align="center" prop="roleName" width="100" label="角色名称" v-model="tableData.roleName"></el-table-column>
              <el-table-column align="center" prop="fkParentRoleCode" width label="上級" v-model="tableData.roleCode"></el-table-column>
              <el-table-column align="center" prop="createTime" width="200" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="isDefault" label="是否默認" v-model="tableData.isDefault"></el-table-column>
              <el-table-column align="center" prop="disabled" width="70" label="状态" v-model="tableData.disabled"></el-table-column>
              <el-table-column align="center" label="操作" width="200">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="edit" @click="handleEdit(scope.$index, scope.row)">编辑</span>
                  <span class="ban" @click="handleBan(scope.$index, scope.row)">禁用</span>
                </template>
              </el-table-column>
            </el-table>
            <!-- 5.0 分页内容 分页提交刷新页面 前进后退 点击以及调转四个事件传递数值-->
            <section class="pagination">
              <el-pagination style="display: inline-block;padding-top: 30px;"
                             background
                             layout="prev, pager, next,total, jumper, ->"
                             :total="total"
                             :current-page="currentPage"
                             @current-change="current_change"
              ></el-pagination>
            </section>
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
        <el-dialog @close="closeForm" width="586px" :title="Dialogtitle[i]" :visible.sync="dialogFormVisible">
          <el-form id="addFormYf" :model="addForm" :rules="rules" ref="addForm" label-width="100px" class="demo-ruleForm" style="display: flex;flex-direction: column">
            <el-form-item label="名称" prop="userType" style="margin-left: 50px;">
              <el-input v-model="addForm.userType"></el-input>
            </el-form-item>
            <el-form-item label="上级" prop="parent" style="margin-left: 50px">
              <el-select v-model="addForm.parent" placeholder="请选择上级">
                <el-option
                  v-for="(option,index) of optionsData"
                  :key="index"
                  :label="option.roleName"
                  :value="option.roleCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status" style="margin-left: 50px">
              <el-radio-group v-model="addForm.status">
                <el-radio label="禁用" ></el-radio>
                <el-radio label="启用"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否默认" prop="isDefault" style="margin-left: 80px">
              <el-radio-group v-model="addForm.isDefault">
                <el-radio label="是"></el-radio>
                <el-radio label="否" ></el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- 弹框表单按钮  验证失效-->
            <el-form-item>
              <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
              <el-button type="info" @click="resetForm('addForm')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
  import moment from "moment";
  export default {
    data() {
      return {
        tableData:[],
        tableChecked:[],
        ids:[],
        /*日期禁用规则 */
        pickerOptions0: {
          disabledDate: time => {
            if (this.end_time !== "") {
              return (
                time.getTime() > Date.now() || time.getTime() > this.end_time
              );
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
        pickerOptions1: {
          disabledDate: time => {
            return (
              time.getTime() < this.start_time || time.getTime() > Date.now()
            );
          }
        },
        /*====== 0.0初始化弹框数据 ======*/
        centerDialogVisible: false, // 禁用弹框
        Dialogtitle: ["禁用", "批量删除", "编辑", "添加"],
        i: null, // 切换弹框标题
        defaultImg: " ", // 上传头像默认头像
        dialogFormVisible: false, // // 添加弹框的展示和消失
        addForm: {
          // 添加的数据表单 共8个参数
          addDialog: false,
          userType: "", // 角色名称 不明参数
          parent: "", // 上级
          isDefault: "", // 是否默认
          status: "" // 状态
        },
        rules: {
          // 添加的参数验证
          userType: [{ required: true, message: "请选择角色类型", trigger: "change" }],
          parent: [{ required: true, message: "选择角色名称", trigger: "blur" }],
          status: [{ required: true, message: "请选择状态", trigger: "change" }],
          isDefault: [{ required: true, message: "请选择是否默认", trigger: "change" }],
        },
        formLabelWidth: "120px",
        /*====== 2.0表单提交数据项 ======*/
        optionsData: [

        ],
        formInline: {
          // 搜索需要的表单数据
          parent:'',
          startTime:'',
          endTime:'',
          currentPage:0,
        },
        /*======4.0分页器相关数据 ======*/
        tableLoading:false,
        /*初始化 */
        total: 0,
        pageSize: 7,
        currentPage: 1,
        // 提交的数据 用于保存查询的结果后查询分页
        paginationForm:{

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

        ],
        id:null,
        roleCode:null,
        disable:null,
        /*====== 5.0 分页相关设置项 ======*/
      };
    },

    methods: {
      /*====== 2.0 表单提交相关函数 ======*/
      handleSelectionChange(val){
        console.log(val)
        this.tableChecked=val
      },
      onSubmit() {
        // date提交的值需要做相关处理转换 提交之后的数据绑定到tableDta 映射到表格数据中
        //console.log(this.formInline);
        this.select(this.searchTimeForm)
        this.currentPage = 1
      },
      select(value){
        this.tableLoading = true
        this.axios.get(userroleselect,{params:value}).then((response)=>{
          console.log(response)
          if (response.data.state === true) {
            this.tableData = response.data.row.list; //获取返回数据
            this.total = response.data.row.total; //总条目数
            this.paginationForm = Object.assign({},value) // 保存上次的查询结果
            this.tableLoading = false
          } else {
            this.$message.error(response.data.msg);
            this.tableLoading = false
          }
        })
        //
      },
      current_change: function(currentPage) {
        //分页查询
        this.currentPage = currentPage; //点击第几页
        this.paginationForm.currentPage = currentPage+1;
        //console.log('保存当前查询',this.paginationForm);
        this.select(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
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
        this.id=row.id;
        this.disable=row.disabled
        this.roleCode=row.roleCode
        console.log(row.roleCode)
      },
      handleEdit(index, row) {
        // 编辑
        //console.log(this.tableData.roleName)
        //this.addForm.userType=this.tableData.roleName
        //console.log(this.addForm.userType)
        this.i = 2;
        this.dialogFormVisible = true;
        console.log(row);
        console.log(row.id,row.roleName,row.roleCode,row.isDefault,row.disabled)
        this.addForm.userType=row.roleName
        this.addForm.parent=row.fkParentRoleCode
        if(row.disabled==1){
          this.addForm.status='禁用'
        }else{
          this.addForm.status='启用'
        }
        if(row.isDefault==1){
          this.addForm.isDefault='是'
        }else{
          this.addForm.isDefault='否'
        }
        this.id=row.id
        this.roleCode=row.roleCode
        //this.addForm.push({userType:,parent:this.tableData.roleCode,isdefault:this.tableData.isDefault,status:this.tableData.disabled,})
      },

      /*====== 弹框相关函数 ======*/
      submitDialog() {
        // 用于提交接口数据的函数 可以传入一个接口回调函数使用 删除操作和禁用操作可以写在外面 然后根据i来判断此时是禁用窗口还是删除窗口 来执行对应操作 如果觉得麻烦就复制两份单独处理
        let i = this.i;
        console.log(this.i)
        if(this.i===0){
          console.log(this.roleCode)
          var roleCode=this.roleCode
          this.axios.put(userroleedit,{id:this.id,disabled:1,roleCode:roleCode}).then((respones)=>{
            console.log(respones)
          })
        }
        if(this.i===1){
          var deleteParam=[]
          for(var item of this.tableChecked){
            console.log(item.id ,item.roleCode)
            deleteParam.push({id:item.id,code:item.roleCode})
          }
          var deleteStr={
            deleteParam:deleteParam
          }
          console.log(deleteParam)
          this.axios.delete(userroledelete,{data:deleteStr}).then((response)=>{
            console.log(response)
            if(response.data.state==true){
              this.$message({
                message: response.data.msg,
                type: 'success'
              });
            }else{
              this.$message({
                message: response.data.msg,
                type: 'error'
              });
            }
          })
        }
        let tips = this.Dialogtitle[i];
        alert(`${tips}成功`); // 成功之后映射到数组的操作
        this.centerDialogVisible = false;
      },
      // 编辑弹框
      submitForm(formName) {
        console.log(formName)
        console.log(this.i)
        if(this.i===3){
          //alert(111)
          this.add(this.newaddForm)
        }
        if(this.i===2){
          //alert(222)
          this.edit(this.neweditForm) //
        }
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
      //修改
      edit(value){
        this.axios.put(userroleedit,value).then((respones)=>{
          //console.log(respones)
          if(respones.data.state==true){
            this.$message({
              message: respones.data.msg,
              type: 'success'
            });
            this.centerDialogVisible=false
          }else{
            this.$message({
              message: respones.data.msg,
              type: 'error'
            });
          }
        })
      },
      // 添加
      add(value){
        this.axios.post(userroleadd,value).then((respones)=>{
          //console.log(respones)
          if(respones.data.state==true){
            this.$message({
              message: respones.data.msg,
              type: 'success'
            });
            this.closeForm()
          }else{
            this.$message({
              message: respones.data.msg,
              type: 'error'
            });
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      pointer() {
        this.$refs.file.click();
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
      console.log(this.searchTimeForm)
      //this.select(this.searchTimeForm)
      //页面初始化加载的表格数据
      this.axios.get(userrole).then((response)=>{
        console.log(response)
        if(response.data.state==true){
          for(var item of response.data.row){
            console.log(item.roleName)
            this.optionsData.push({roleName:item.roleName,roleCode:item.roleCode})
          }
        }
      })
      //表单中下拉框上级的初始化数据
      this.axios.get(userroleselect).then((response)=>{
        //console.log(response.data.row.list)
        if(response.data.state=true){
          this.tableData=response.data.row.list
        }
      })
    },
    computed: {
      //模糊查询参数
      searchTimeForm(){ // 计算属性 真正传递的数据
        let searchForm = {
          pageSize: this.pageSize,
          currentPage:1,
          roleName:this.formInline.parent,
          beginTime: this.formInline.startTime === ""? null : moment(this.formInline.startTime).format("YYYY-MM-DD"), //开始时间
          endTime: this.formInline.endTime === ""? null : moment(this.formInline.endTime).format("YYYY-MM-DD"), //结束时间
        }
        //console.log(searchForm)
        return searchForm
      },
      //添加参数
      newaddForm(){
        let newForm={
          roleName:this.addForm.userType,
          //isDefault:this.addForm.isdefault,
          isDefault:this.addForm.isdefault==='是'?1:0,
          disabled:this.addForm.disabled==='禁用'?1:0,
          fkParentRoleCode:this.addForm.parent
        }
        //console.log(newForm)
        return newForm
      },
      //修改参数
      neweditForm(){
        let newForm={
          id:this.id,
          roleCode:this.roleCode,
          roleName:this.addForm.userType,
          //isDefault:this.addForm.isdefault,
          isDefault:this.addForm.isdefault==='是'?1:0,
          disabled:this.addForm.disabled==='禁用'?1:0,
          fkParentRoleCode:this.addForm.parent
        }
        //console.log(newForm)
        return newForm
      }
    },
  };
</script>

<style scoped>
  /*====== 0.0 初始化部分 ======*/
  section.pagination {
    display: flex;
    justify-content: center;
  }
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

