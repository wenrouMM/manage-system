<template>
  <div class="useradd">
    <el-container>
      <div class="box-card">
        <div class="space"></div>
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">权限管理列表</span>
          </div>
          <!-- 2.0 表单填写 查询接口 状态：正在查询（loading组件） 查询成功 查询失败 -->
          <section class="searchBox">
            <div class="buttonBox">
              <button class="delete" @click="batchDelete">
                <i class="deleteIcon el-icon-delete"></i>批量禁用
              </button>
            </div>
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
              <el-form-item label="角色名称:" size="160">
                <el-select v-model="formInline.userType" placeholder="请选择角色" clearable
                >
                  <el-option
                    v-for="item in optionsData"
                    :key="item.roleCode"
                    :label="item.roleName"
                    :value="item.roleCode"
                  ></el-option>
                </el-select>
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

          <!-- 4.0 表格展示内容 编辑功能：状态用上 禁用 批量禁用弹框 弹框可尝试用slot插槽封装 -->
          <section class="text item tablebox">
            <el-table
              @selection-change="changeFun"
              v-loading="loading"
              class="tableBorder"
              style="width: 100%; text-align:center;"
              :row-style="rowStyle"
              :data="tableData"
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
            >
              <el-table-column align="center" type="selection" width="100"></el-table-column>
              <el-table-column align="center" prop="id" label="序号"></el-table-column>
              <el-table-column align="center" prop="fkRoleName" label="角色名称"></el-table-column>
              <el-table-column align="center" prop="fkMenuName" label="菜单名称"></el-table-column>
              <el-table-column align="center" prop="fkMenuElementName" label="元素名称"></el-table-column>
              <el-table-column align="center" prop="createTime" :formatter="dateFormat" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="updateTime" :formatter="dateFormat" label="修改时间"></el-table-column>
              <el-table-column align="center" label="操作">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="edit" @click="handleEmpower(scope.$index, scope.row)">授权</span>
                  <span class="ban" @click="handleBan(scope.$index, scope.row)">禁用</span>
                </template>
              </el-table-column>
            </el-table>
          </section>
          <!-- 5.0 分页内容 分页提交刷新页面 前进后退 点击以及调转四个事件传递数值-->
          <section class="pagination">
            <el-pagination
              background
              layout="prev, pager, next,total, jumper"
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="current_change">
            </el-pagination>
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
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import {role_name} from '../../request/api/base.js'
  import {prohibit, batch_Prohibit, command_list} from '../../request/api/base.js'

  export default {
    data () {
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
        loading: true, // 加载状态
        /*====== 0.0初始化弹框数据 ======*/
        multipleSelection: [],
        deleteparams: {},
        disabled_va: -1,
        centerDialogVisible: false, // 禁用授权弹框
        Dialogtitle: ['禁用', '批量删除', '授权'],
        i: 0, // 切换弹框标题
        editObj: null,
        dialogFormVisible: false, // // 添加弹框的展示和消失
        /*====== 2.0表单提交数据项 ======*/
        optionsData: [],
        formInline: {
          // 搜索需要的表单数据
          userName: '',
          userType: '',
          userId: '',
          userPhone: '',
          date: '' // 选择日期
        },
        search: '', // 存储搜索完成后的2.0表单数据 用于调用分页接口

        /*====== 3.0添加 批量删除所需数据 ======*/
        Allseclet: [], // 存储全选框 单选框的数据/索引 用于传递给后台同时 前端用索引号去删除表格内的内容

        /*====== 4.0表格设置项 ======*/
        rowStyle: {
          height: '60px'
        },
        // 用于注入表单的数据 这里的数据应该在created钩子函数创建的时候向后台获取
        tableData: [],
        /*====== 5.0 分页相关设置项 ======*/
        /*初始化 */
        total: 0,
        pageSize: 7,
        currentPage: 1,
        // 提交的数据 用于保存查询的结果后查询分页
        paginationForm: {}
      }
    },
    computed: {
      searchTimeForm () {
        let searchForm = {
          pageSize: this.pageSize,
          currentPage: 1,
          roleName: this.formInline.userType === '全部' ? null : this.formInline.userType,
          beginTime: this.formInline.date === '' ? null : moment(this.formInline.date[0]).format('YYYY-MM-DD'), //开始时间
          endTime: this.formInline.date === '' ? null : moment(this.formInline.date[1]).format('YYYY-MM-DD'), //结束时间
        }
        return searchForm
      },
      prohibit () {
        let prohibit = {
          disabled: this.disabled_va,
          id: this.editObj.id
        }
        return prohibit
      }
    },
    methods: {
      /*====== 2.0 表单提交相关函数 ======*/
      onSubmit () {
        // date提交的值需要做相关处理转换 提交之后的数据绑定到tableDta 映射到表格数据中
        console.log(this.formInline)
        this.currentPage = 1
        this.command_list(this.searchTimeForm)
      },
      /*====== 3.0添加删除相关操作 ======*/
      addDialogOpen () {
        this.i = 3
        this.dialogFormVisible = true
      },
      batchDelete () {
        // 批量删除
        this.i = 1
        this.centerDialogVisible = true
        this.editObj = this.multipleSelection
        let batch_list = []
        let jsonObj = {}
        for (let j = 0; j < this.editObj.length; j++) {
          jsonObj = {}
          jsonObj.id = this.editObj[j].id
          batch_list.push(jsonObj)
        }
        console.log(batch_list,"batch_list")
        this.deleteparams = {
          deleteParams: batch_list
        }
      },
      /*====== 4.0表格操作相关 ======*/
      handleBan (index, row) {
        // 禁用
        console.log(index, row) // 当前选中表格的索引和对象
        this.i = 0
        this.editObj = row
        this.centerDialogVisible = true
      },
      handleEmpower (index, row) {
        this.i = 2
        this.editObj = row
        this.centerDialogVisible = true
      },
      changeFun (val) {
        this.multipleSelection = val // 返回的是选中的列的数组集合
        console.log(this.multipleSelection, '>>>>>>>>>>>')
      },
      /*====== 弹框相关函数 ======*/
      submitDialog () {
        // 用于提交接口数据的函数 可以传入一个接口回调函数使用 删除操作和禁用操作可以写在外面 然后根据i来判断此时是禁用窗口还是删除窗口 来执行对应操作 如果觉得麻烦就复制两份单独处理
        let i = this.i
//        let tips = this.Dialogtitle[i]
        //  alert(`${tips}成功`) // 成功之后映射到数组的操作
        this.centerDialogVisible = false

        if (0 === i) {
          //0启用 1禁用
          this.disabled_va = 1
          this.prohibit_sb(this.prohibit)
        } else if (1 === i) {
          console.log(this.deleteparams, 'onsole.log(this.deleteparams')
          this.batch_Prohibit(this.deleteparams)//批量禁用
        } else if (2 === i) {
          this.disabled_va = 0
          this.prohibit_sb(this.prohibit)
        }
        // console.log(this.editObj.id, '|||')
      },
      //时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        if (date == undefined) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm')
      },
      role_name () {//查询角色名称
        axios.get(role_name, {}
        ).then(res => {
          console.log(res.data)
          if (res.data) {
            if (res.data.state) {
              this.optionsData = res.data.row //获取角色名称
            }
          }
        }).catch(error => {
          this.$message.error(error)
        })
      },
      batch_Prohibit (value) {//批量禁用
        axios.delete(batch_Prohibit, value).then(res => {
          console.log(res)
        }).catch(error => {
          this.$message.error(error)
        })
      },
      command_list (value) {//查询权限列表
        console.log(value, 1111)
        axios.get(command_list, {
          params: value
        }).then(res => {
          console.log(res.data)
          if (res.data.state === true) {
            this.tableData = res.data.row
            this.total = res.data.total //总条目数
            this.paginationForm = Object.assign({}, value) // 保存上次的查询结果
            console.log('保存当前查询', this.paginationForm)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(error => {
          this.$message.error(error)
        })
        this.loading = false // 加载状态
      },
      prohibit_sb (value) {//禁用用户管理权限
        console.log(value)
        axios.put(prohibit, value).then(res => {
          if (res.data.state === true) {
            this.$message.success(res.data.msg)
            this.command_list(this.searchTimeForm)
          }
        }).catch(error => {
          this.$message.error(error)
        })
      },
      current_change: function (currentPage) {
        //分页查询
        this.currentPage = currentPage //点击第几页
        this.paginationForm.currentPage = currentPage
        console.log('保存当前查询', this.paginationForm, '>>>>')
        this.command_list(this.paginationForm) // 这里的分页应该默认提交上次查询的条件
      }
    },
    mounted () {
      console.log(this.formInline.date, 212)
      this.role_name()
      console.log(this.searchTimeForm)
      this.command_list(this.searchTimeForm)
    }
  }
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
  .searchBox {
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
    border-top: none;
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
    display: flex; /*flex块级，inline-flex:行内快*/
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

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }

  /*过渡的状态 即过渡的关键帧打那些*/
  .dialog-enter-active,
  .dialog-leave-active {
    transition: all 0.3s;
  }

  .dialog-enter, .dialog-leave-to /* .fade-leave-active below version 2.1.8 */
  {
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
    background-color: rgba(0, 0, 0, 0);
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

