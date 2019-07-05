<template>
  <div class="userManage">
    <el-container>
      <div class="box-card">
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">用户管理</span>
          </div>
          <!-- 2.0 表单填写 查询接口 状态：正在查询（loading组件） 查询成功 查询失败 -->
          <section class="searchBox flexLayout">
            <!-- 3.0 添加删除按钮 添加之前：弹框提交  状态： 正在添加 添加完成（alert提示自带）/添加失败请重试 -->
            <div class="buttonBox">
              <button class="add" @click="addDialogOpen">
                <i class="addIcon el-icon-plus"></i>添加
              </button>
              <button class="delete" @click="batchDelete">
                <i class="deleteIcon el-icon-delete"></i>批量删除
              </button>
            </div>
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="筛选 :">
                <el-select
                  style="width: 150px"
                  v-model="searchForm.makeMethod"
                  placeholder="请选择"
                  clearable
                  @change="selectCheck(searchForm.makeMethod)"
                >
                  <el-option label="姓名" value="0"></el-option>
                  <el-option label="身份证号" value="1"></el-option>
                </el-select>
                <el-input v-model="searchForm.searchData" placeholder="请输入相关信息" clearable style="width: 250px"></el-input>
              </el-form-item>
              <!--<el-form-item label="手机号码:" size="160">
                <el-input v-model="searchForm.userPhone" clearable placeholder="请输入手机号码" style="width: 170px"></el-input>
              </el-form-item>-->
              <el-form-item label="角色名称 :">
                <!-- 当value为对象时必须要给一个对象内的参数与绑定的key值一致才不会出现选中一个变为选中多个 -->
                <el-select
                  clearable
                  style="width: 170px"
                  v-model="searchForm.userType"
                  value-key="roleCode"
                  placeholder="请选择角色"
                >
                  <el-option
                    v-for="(option) of optionsData"
                    :key="option.roleCode"
                    :label="option.roleName"
                    :value="option.roleCode"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间 :" size="160">
                <el-date-picker
                  v-model="searchForm.beginTime"
                  style="width: 180px"
                  type="date"
                  placeholder="开始日期"
                  :picker-options="pickerOptions0"
                ></el-date-picker>
                <el-date-picker
                  v-model="searchForm.endTime"
                  type="date"
                  style="width: 180px"
                  placeholder="结束日期"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button :loading="searchLoading" size="15" type="primary" @click="searchSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </section>
          <!-- 4.0 表格展示内容 编辑功能：状态用上 禁用 批量禁用弹框 弹框可尝试用slot插槽封装 -->
          <section class="tablebox" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table
              @selection-change="handleSelectionChange"
              :data="tableData"
              empty-text="无数据"
              style="width: 100%; text-align:center;"
              :row-style="rowStyle"
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
            >
              <el-table-column align="center" type="selection" width="100" fixed="left"></el-table-column>
              <el-table-column width="100" align="center" prop="index" type="index" label="序号" fixed="left">
                <template slot-scope="scope">
                  <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                </template>
              </el-table-column>

              <el-table-column align="center" width="150" prop="headerAddress" label="头像">
                <template slot-scope="scope">
                  <span class="imgDefault" height="30px;" style="border-radius: 50%">
                    <img
                      class="head_pic"
                      v-if="!scope.row.preUrl"
                      src="../../base/img/normalHead.jpg"
                      width="30px"
                      height="30px"
                      style="border-radius: 50%"
                    >
                    <img
                      class="head_pic"
                      v-if="scope.row.preUrl"
                      :src="scope.row.preUrl"
                      width="30px"
                      height="30px;"
                      style="border-radius: 50%"
                    >
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                :show-overflow-tooltip="true"
                prop="fkRoleNames"
                width="150"
                label="角色名称"
              ></el-table-column>
              <el-table-column align="center" prop="username" label="姓名" width="150"></el-table-column>
              <el-table-column align="center" prop="sex" label="性别" width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.sex ===1?'男':'女'}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="idShow" width="200" label="身份证号"></el-table-column>
              <el-table-column align="center" prop="phoneShow" width="200" label="手机号码"></el-table-column>
              <el-table-column align="center" prop="createTime" width="200" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="isLock" width="150" label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.isLock ===0?'启用':'禁用'}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="200" fixed="right">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="edit" @click="handleEdit(scope.$index, scope.row)">编辑</span>
                  <span class="ban" @click="resetPsd(scope.$index, scope.row)">重置密码</span>
                </template>
              </el-table-column>
            </el-table>

            <!-- 5.0 分页内容 分页提交刷新页面 前进后退 点击以及调转四个事件传递数值-->
            <section class="pagination mt_30">
              <el-pagination
                style="display: inline-block"
                background
                layout="prev, pager, next,total,slot"
                :total="total"
                :page-size="pageSize"
                :current-page="currentPage"
                @current-change="current_change"
              >
                <slot>
                  <span>
                    前往
                    <div class="el-input el-pagination__editor is-in-pagination">
                      <input
                        ref="text"
                        type="number"
                        v-model="pageInput"
                        autocomplete="off"
                        min="1"
                        max="1"
                        class="compo el-input__inner"
                      >
                    </div>页
                  </span>
                </slot>
              </el-pagination>
              <el-button type="primary" class="ml_30" size="medium" @click="jumpBtn">确定</el-button>
            </section>
          </section>
        </div>
      </div>
      <!-- 弹框组 添加弹框未知 批量删除弹框 禁用弹框 编辑弹框 -->
      <!-- 禁用弹框/批量删除弹框 -->
      <div class="forbid collectionDelete">
        <el-dialog
          v-loading="banDeleteLoading"
          element-loading-text="正在执行中 请稍等"
          :title="Dialogtitle[i]"
          :visible.sync="centerDialogVisible"
          width="400px"
          center
        >
          <div style="text-align: center;padding: 30px">
            <p style="font-size: 20px;color: #878787">是否{{Dialogtitle[i]}}?</p>
            <p v-if="i==0" style="font-size: 15px;margin-top: 10px;color: red">(重置过后密码默认为身份证号后6位)</p>
          </div>

          <div style="margin-bottom: 30px">
            <span class="dialogButton true mr_40" @click="delteBan">确 定</span>
            <span class="dialogButton cancel" @click="deleteBanCancel">取 消</span>
          </div>
        </el-dialog>
      </div>
      <!-- 批量删除弹框 -->
      <!-- 编辑弹框 -->
      <!-- 添加弹框 -->
      <div class="addEditDialog">
        <!-- Form -->
        <el-dialog
          element-loading-text="正在执行中 请稍等"
          @close="closeForm"
          width="685px"
          :title="Dialogtitle[i]"
          :visible.sync="dialogFormVisible"
        >
          <!-- 白屏问题所在 -->
          <el-form
            v-loading="editLoading"
            element-loading-text="正在执行中"
            id="addForm"
            ref="addForm"

            :model="addForm"
            :rules="addRules"
          >
            <el-form-item class="uploadBox">
              <section class="upload">
                <!-- 背景图片做改动 -->
                <div class="defultHead" style="width:100px; height:100px; border-radius:50%;">
                  <img
                    ref="imgTest"
                    class="defaultimage"
                    style="width:100px; height:100px; border-radius:50%;"
                    alt="怎么回事小老弟"
                    :src="srcPre"
                    v-if="!preloadImg"
                  >

                  <img
                    style="width:100px; height:100px ;border-radius:50%;"
                    v-if="preloadImg"
                    :src="preloadImg"
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
                  <div
                    class="bgload"
                    @click="pointer"
                    style="width:100px; height:100px; border-radius:50%;"
                  >上传头像</div>
                </div>
              </section>
            </el-form-item>
            <!-- 表单域 -->
            <el-form-item label="姓　　名" prop="username" :label-width="formLabelWidth">
              <el-input
                :disabled="addForm.username && i==2?true:false"
                v-model="addForm.username"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label="角色类型" prop="authTbRoles" :label-width="formLabelWidth">
              <el-select
                v-model="addForm.authTbRoles"
                multiple

                collapse-tags
                placeholder="请选择类型"
                value-key="roleCode"
              >
                <el-option
                  v-for="(option) of optionsData"
                  :key="option.roleCode"
                  :label="option.roleName"
                  :value="option"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard" :label-width="formLabelWidth">
              <el-input
                :disabled="addForm.idCard && i==2?true:false"
                v-model="addForm.idCard"
                autocomplete="off"
                @blur="verifyIdCradFun"
              ></el-input>
            </el-form-item>
            <el-form-item label="注册邮箱" prop="email" :label-width="formLabelWidth">
              <el-input v-model="addForm.email" autocomplete="off" @blur="verifyEmailFun"></el-input>
            </el-form-item>
            <el-form-item label="居住地址" prop="address" :label-width="formLabelWidth">
              <el-input v-model="addForm.address" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone" :label-width="formLabelWidth">
              <el-input v-model="addForm.phone" autocomplete="off" @blur="verifyPhoneFun"></el-input>
            </el-form-item>

            <el-form-item class="select" prop="isLock" label="状　　态"  label-width="85px" style="width: 310px">
              <el-radio-group v-model="addForm.isLock">
                <el-radio :label="1">禁用</el-radio>
                <el-radio :label="0">启用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <p style="color: red;">(初始密码为身份证号后6位)</p>
            </el-form-item>

            <!-- 弹框表单按钮  验证失效-->
            <el-form-item class="dialogFooter">
              <div style="">
                <span class="dialogButton true mr_40" @click="submitForm('addForm')" :loading="submitLoading">确 定</span>
                <span class="dialogButton cancel" @click="resetForm('addForm')">取 消</span>
              </div>
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
  uploadInt,
  selectRoleType,
  headUpload,
  headimg,
  photoUrl,
  getPower
} from "@request/api/base.js";
import moment from "moment";
import axios from "axios";
export default {
  created() {
    let route = this.$route.path;
    console.log(this.$route.path);
    console.log(this.$route.meta.menuCode);
    this.selectRoleType(); // 获取角色类型
    this._getPower(this.$route.meta.menuCode)
  },
  mounted() {
    this.SearchApi(this.searchTimeForm); // 调用查询接口获取数据
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        console.log("正则验证", reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入邮箱"));
      } else {
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的邮箱"));
        }
      }
    };
    var checkId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入身份证"));
      } else {
        const reg18 = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg18.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的身份证"));
        }
      }
    };
    return {
      /*------ bugHack ------*/
      formFlag: false,
      /*====== 0.0初始化弹框数据 ======*/
      centerDialogVisible: false, // 禁用弹框
      Dialogtitle: ["重置密码", "批量删除", "编辑", "添加"],
      i: 0, // 切换弹框标题
      defaultImg: " ", // 上传头像默认头像
      preloadImg: "",
      dialogFormVisible: false, // // 添加弹框的展示和消失
      files: null,
      addForm: {
        // 添加的数据表单 共8个参数
        addDialog: false,
        headerAddress: "", // 图片相关
        headIcon: "",
        files: "", // 用于上传
        username: "", // 姓名
        authTbRoles: [], // 角色类型 不明参数 初始化为数组 否则多选失效
        idCard: "", // 身份证
        phone: "", // 电话号码
        address: "",
        email: "",
        isLock: null // 状态
      },
      userId:'',
      addRules: {
        // 添加的参数验证
        username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        authTbRoles: [
          { required: true, message: "请选择用户类型", trigger: "change" }
        ],
        idCard: [{ validator: checkId, required: true, trigger: "blur" }],
        address: [
          { required: true, message: "请输入居住地址", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" }
        ],
        phone: [{ validator: checkPhone, required: true, trigger: "blur" }],
        isLock: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      formLabelWidth: "105px",
      /*====== 2.0表单提交数据项 ======*/
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      pickerOptions0: {
        disabledDate: time => {
          if (this.searchForm.endTime) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.searchForm.endTime
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          return (
            time.getTime() < this.searchForm.beginTime ||
            time.getTime() > Date.now()
          );
        }
      },
      /*====== 3.0添加 批量删除所需数据 ======*/
      deleteArr: [],
      resetArr: {
        idCard: "",
      },
      allseclet: [], // 存储全选框 单选框的数据/索引 用于传递给后台同时 前端用索引号去删除表格内的内容

      /*====== 4.0表格设置项 ======*/
      tableLoading: true,
      rowStyle: {
        height: "60px"
      },
      tableData: [
        // 用于注入表单的数据 这里的数据应该在created钩子函数创建的时候向后台获取
      ],
      /*====== 5.0 分页相关 搜索相关设置项 ======*/
      searchLoading: false,
      loading: true,
      optionsData: [],
      total: 0,
      pageSize: 10,
      pageInput: 1,
      currentPage: 1,
      searchForm: {
        // 接受搜索表单的数据
        makeMethod: "",
        searchData: "",
        userType: "",
        beginTime: "",
        endTime: "",
        currentPage: 0
      },
      searchData: "",
      selectSearchForm: {
        userName: "",
        userId: "",
        currentPage: 0
      },
      paginationForm: {},
      /*===== 6.0弹框初始化数据 ======*/
      submitLoading: false,
      editLoading: false,
      banDeleteLoading: false,
      LabelWidth: "100px"
    };
  },
  computed: {
    // 图片上传
    srcPre() {
      let src = "";
      if (
        this.addForm.headerAddress != null &&
        this.addForm.headerAddress != ""
      ) {
        src = this.addForm.preUrl;
        console.log(this.addForm.preUrl);
        console.log("真就不执行了？");
      } else {
        src = require('../..//base/img/normalHead.jpg');
      }
      return src;
    },
    searchTimeForm() {
      // 计算属性 真正传递的数据
      let date = this.searchForm.date;
      if (this.searchData) {
        switch (this.searchData / 1) {
          case 0:
            console.log("姓名");
            this.selectSearchForm.userId=''
            this.selectSearchForm.userName = this.searchForm.searchData;
            break;
          case 1:
            console.log("身份证号");
            this.selectSearchForm.userName=''
            this.selectSearchForm.userId = this.searchForm.searchData;
            break;
        }
      } else {
        console.log("为空");
        this.selectSearchForm.userName = "";
        this.selectSearchForm.userId = "";
      }
      let searchForm = {
        pageSize: this.pageSize,
        currentPage: 1,
        name: this.selectSearchForm.userName,
        fkRoleCode: this.searchForm.userType, // 只是给了一个code
        idCard: this.selectSearchForm.userId,
        beginTime: !this.searchForm.beginTime
          ? null
          : moment(this.searchForm.beginTime).format("YYYY-MM-DD"), //开始时间
        endTime: !this.searchForm.endTime
          ? null
          : moment(this.searchForm.endTime).format("YYYY-MM-DD") //结束时间
      };

      return searchForm;
    },
    addEdit() {
      let i = this.i;
      let lock = parseInt(this.addForm.isLock);
      let data = {
        username: this.addForm.username,
        idCard: this.addForm.idCard,
        address: this.addForm.address,
        phone: this.addForm.phone,
        email: this.addForm.email,
        headerAddress: this.addForm.headerAddress,
        authTbRoles: this.addForm.authTbRoles,
        isLock: lock
      };
      if (i === 2) {
        data.id = this.addForm.id;
      }
      return data;
    },
    banForm() {
      let ban = null;
    }
  },
  methods: {
    selectCheck(val) {
      console.log("val", val);
      this.searchForm.searchData=""
      for(const index in this.selectSearchForm){
        this.selectSearchForm[index]=""
      }
      this.searchData = val;
    },
    //添加时身份证验证
    verifyIdCradFun(){
      this.axios.post(userManageInterface.verifyidCard,{
        id:this.userId,
        idCard:this.addForm.idCard
      }).then((res)=>{
        console.log('身份证验证后的结果',res)
        if(res.data.state==true){
          this.$message.success(res.data.msg);
        }else{
          this.$message.error(res.data.msg);
        }
      })
    },
    //添加或修改时手机号码验证
    verifyPhoneFun(){
      console.log('添加或修改时电话时是否有id',this.userId)
      this.axios.post(userManageInterface.verifyPhone,{
        id:this.userId,
        phone:this.addForm.phone
      }).then((res)=>{
        console.log('电话号码验证后的结果',res)
        if(res.data.state==true){
          this.$message.success(res.data.msg);
        }else{
          this.$message.error(res.data.msg);
        }
      })
    },
    //添加或修改时邮箱验证
    verifyEmailFun(){
      console.log('添加或修改邮箱时是否有id',this.userId)
      this.axios.post(userManageInterface.verifyEmail,{
        id:this.userId,
        email:this.addForm.email
      }).then((res)=>{
        console.log('邮箱验证后的结果',res)
        if(res.data.state==true){
          this.$message.success(res.data.msg);
        }else{
          this.$message.error(res.data.msg);
        }
      })
      },
    // 获取按钮权限
    _getPower(value){
      let obj = value
      getPower(obj).then((res)=>{
        console.log('按钮集',res)
      })
    },
    // 重置密码按钮
    resetPsd(index, row) {
      // 禁用按钮 按钮的作用就是获取一切初始化信息
        this.i = 0;
        this.resetArr.idCard = row.idCard;
        console.log(index, row, this.resetArr); // 当前选中表格的索引和对
        this.centerDialogVisible = true;
    },
    jumpBtn() {
      // v-mode绑定好像会默认转数据类型
      console.log("数据类型检测", this.pageInput);
      let page = Math.ceil(this.total / this.pageSize);
      page == 0 ? 1 : page;
      if (this.pageInput > page || this.pageInput == "" || this.pageInput < 0) {
        this.pageInput = 1;
        this.$nextTick(() => {
          this.$refs.text.value = 1; // hack方法
          console.log("Vmode绑定值", this.pageInput);
        });
      } else {
        this.pageInput = parseInt(this.pageInput);
        this.$refs.text.value = parseInt(this.pageInput);
        let num = parseInt(this.pageInput);
        this.current_change(num);
      }
    },
    /*====== 3.0添加删除相关操作 ======*/
    addDialogOpen() {
      // 添加按钮
      let obj = this.addForm;
      if (this.formFlag) {
        this.$refs.addForm.resetFields();
      }
      for (var i in obj) {
        obj[i] = "";
      }
      obj.authTbRoles = [];
      this.i = 3;
      this.preloadImg = "";
      this.dialogFormVisible = true;
    },
    handleSelectionChange(selection) {
      // 点击全选触发的事件 过滤参数

      let arr = [];
      for (let item of selection) {
        let obj = {};
        obj.id = item.id;
        arr.push(obj);
      }
      this.deleteArr = arr;
      console.log(this.deleteArr);
    },
    batchDelete() {
      // 批量删除按钮

      if (this.deleteArr.length) {
        this.i = 1;
        this.centerDialogVisible = true;
      } else {
        this.$message.error("请先选择删除对象");
      }
    },
    deleteApi(arr) {
      // 批量删除API调用 deleteArr 确认按钮就是执行相应的API

      this.banDeleteLoading = true; // 这只是个状态提示 提示请求执行的状态而不需要结果判断
      let obj = new Object();
      obj.deleteParam = arr;
      axios
        .delete(userManageInterface.delete, {
          data: obj
        })
        .then(res => {
          console.log(res.data);
          if (res.data.state === true) {
            console.log(res.data);
            this.SearchApi(this.paginationForm); // 删除成功就重新加载一次数据
            this.centerDialogVisible = false; // 提示删除成功 是否需要提示信息
            this.$message.success("删除成功");
            this.banDeleteLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.banDeleteLoading = false;
          }
        });
    },
    /*====== 4.0表格操作相关 ======*/

    resetApi(arr) {

      console.log("禁用的数据", arr); // 正在请求的状态 通过按钮还是文本
      axios.put(userManageInterface.reset, arr).then(res => {
        console.log(res.data);
        if (res.data.state === true) {
          console.log(res.data);


          this.centerDialogVisible = false;
          this.SearchApi(this.paginationForm); // 禁用成功就重新加载一次数据
          this.$message.success("重置成功");
        } else {
          this.$message.error(res.data.msg); // 提示删除成功

        }
      });
    },
    handleEdit(index, row) {
      console.log('编辑时该用户的id',row)
      this.userId=row.id
      if(this.formFlag){
        this.$refs.addForm.resetFields();
      }
      let obj = this.addForm
      for (var i in obj) {
        obj[i] = "";
      }
      this.addForm.authTbRoles = []
      // 编辑    点击这个的时候 把row对象的数据给予弹框中的对象数据
      this.addForm.authTbRoles = []
      this.formFlag = true;
      this.preloadImg = "";
      this.i = 2;
      this.addForm.id = row.id;
      this.addForm.username = row.username;
      this.addForm.idCard = row.idCard;
      this.addForm.address = row.address;
      this.addForm.phone = row.phone;
      this.addForm.email = row.email;
      this.addForm.headerAddress = row.headerAddress;
      this.addForm.isLock = row.isLock;
      this.addForm.preUrl = row.preUrl;
      this.dialogFormVisible = true;
      this.addForm.authTbRoles = row.authTbRoles;
      console.log(index, row, typeof this.addForm.isLock);
      console.log("编辑后的表单", this.addForm);
      console.log("提交的数据", this.addEdit);
    },

    /*====== 分页查询和初始化 ======*/
    selectRoleType() {
      axios.get(selectRoleType).then(res => {
        // 没有数据怎么办
        if (res.data.state === true) {
          let data = res.data.row;
          let optionsData = [];
          for (let item of data) {
            let obj = {};
            obj.roleCode = item.roleCode;
            obj.roleName = item.roleName;
            optionsData.push(obj);
          }
          this.optionsData = optionsData;
        }
      });
    },
    searchSubmit() {
      // 条件查询 执行的按钮应该个函数节流
      console.log("此时传给后台的搜索数据", this.searchTimeForm);
      this.searchLoading = true;
      this.SearchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
      this.currentPage = 1; // 并把结果返回给第一页
    },
    paginationApi(value) {
      this.tableLoading = true; // 加载前控制加载状态
      axios
        .get(userManageInterface.select, {
          params: value
        })
        .then(res => {
          if (res.data.state === true) {
            let nomol = res.data.row;
            for (let item of nomol) {
              let id = item.idCard;
              let tel = item.phone;
              item.idShow = id.substr(0, 5) + "********" + id.substr(13);
              item.phoneShow = tel.substr(0, 3) + "****" + tel.substr(7);
              if (item.headerAddress != null && item.headerAddress != "") {
                item.preUrl = uploadInt.preimg + item.headerAddress;
              }
            }
            this.tableData = nomol; //获取返回数据
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果

            this.tableLoading = false;
            this.searchLoading = false; // 按钮放行
            console.log("保存当前查询", this.paginationForm);
          } else {
            console.log(res);
            this.$message.error(res.data.msg);
            this.tableLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    SearchApi(value) {
      //获取登录记录 或者说是加载数据 这里应该请求的时候加状态动画
      this.tableLoading = true; // 加载前控制加载状态
      axios
        .get(userManageInterface.select, {
          params: value
        })
        .then(res => {
          console.log('用户管理列表',res)
          if (res.data.state === true) {
            let nomol = res.data.row;
            for (let item of nomol) {
              let id = item.idCard;
              let tel = item.phone;
              item.idShow = id.substr(0, 5) + "********" + id.substr(13);
              item.phoneShow = tel.substr(0, 3) + "****" + tel.substr(7);
              if (item.headerAddress != null && item.headerAddress != "") {
                item.preUrl = uploadInt.preimg + item.headerAddress;
              }
            }
            this.tableData = nomol; //获取返回数据
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果

            this.tableLoading = false;
            this.searchLoading = false; // 按钮放行
            console.log("保存当前查询", this.paginationForm);
          } else {
            console.log(res);
            this.$message.error(res.data.msg);
            this.tableLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    current_change: function(currentPage) {
      //分页查询
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;
      console.log("保存当前查询", this.paginationForm);
      this.paginationApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
    },

    /*====== 弹框内相关函数 ======*/
    deleteBanCancel() {
      this.centerDialogVisible = false;
      this.editLoading = false;
      this.banDeleteLoading = false;
    },
    delteBan() {
      // 用于提交接口数据的函数 可以传入一个接口回调函数使用 删除操作和禁用操作可以写在外面 然后根据i来判断此时是禁用窗口还是删除窗口 来执行对应操作 如果觉得麻烦就复制两份单独处理
      let i = this.i;
      if (i == 1) {
        this.deleteApi(this.deleteArr);
      } else {
        this.resetApi(this.resetArr);
      }
    },
    // 编辑添加弹框
    submitForm(formName) {
      // 提交弹框按钮执行函数

      let i = this.i; // 根据i值判定启用何种API
      let url = "";
      let method = "";
      let data = this.addEdit;
      // 头像上传的文件 在编辑框中保存

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
          this.submitLoading = true; // 进入执行状态 锁定表单
          console.log("堵塞的话", this.editLoading);
          axios({
            // 发起API请求
            url: url,
            method: method,
            data: data,
            xhrFields: {
              withCredentials: true
            },
            crossDomain: true
          }).then(res => {
            console.log(res.data);
            if (res.data.state) {
              this.SearchApi(this.searchTimeForm);
              this.$message.success("执行成功"); // 提示成功信息
              this.submitLoading = false;
              this.dialogFormVisible = false; // 关闭弹框
            } else {
              this.$message.error(res.data.msg); // 提示失败信息
              this.submitLoading = false;
            }
          });

          // 执行结束后 解开锁屏
        } else {
          // 未填完不准通过
          console.log("验证不过");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      //this.$refs[formName].resetFields();

      this.editLoading = false;
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
      _this.files = files;
      console.log(_this.files);
      // 2.1 防止后台拿不到数据 可能需要提交额外数据时

      if (!e || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader(); // 定义 fileReader对象
      _this.uPphotoApi();
      reader.readAsDataURL(files); // 转换为base64的url路径 其他三个API转换为text 二进制  arraybuffer
      reader.onloadend = function() {
        _this.preloadImg = this.result; // 此时this指向的fileReader对象
        _this.$refs.file.value = "";
      };
    },
    closeForm() {
      // 弹框关闭的时候执行 清空数据

      this.formFlag = true;
      console.log("关闭测试");

      let obj = this.addForm;

       // 调用这个方法进行清除登陆状态 打开的时候再清理？

      this.files = null;
      this.editLoading = false;
      this.banDeleteLoading = false;
      //this.preloadImg = ''
      console.log("更改了吗", this.addForm);

    },
    uPphotoApi() {
      let files = this.files;
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
          ContentType: "multipart/form-data",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true
        }).then(request => {
          // 如果是编辑 更换图片失败后
          if (request.data.state == true) {
            this.addForm.headerAddress = request.data.row;
            console.log("是否图片", this.addForm);
            console.log("图片上传成功", request.data.row, this.addEdit);
          } else {
            this.$message.error(request.data.msg);
          }
        });
      }
    }
  }
};
</script>

<style scoped>
/*====== 0.0 初始化部分 ======*/
.searchBox{
  display: flex;
  justify-content: space-between;
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

.el-form--inline .el-form-item {
  margin-right: 10px;
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
  width: 90px;
  display: flex;
  justify-content: center;
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
  margin-right: 10px;
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
  background-image: url("../../base/img/timg.jpg");
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
.pagination {
  display: flex;
  justify-content: center;
}
.pagaButton {
  width: 70px;
  height: 34px;
  cursor: pointer;
  background-color: #fff;
  border: none;
  border: solid 1px #d5d5d5;
  border-radius: 5px;
  margin-left: 15px;
  text-align: center;
  line-height: 34px;
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
  justify-content: space-between;
  width: 100%;
}
.row1 .el-form-item {
  margin-bottom: 30px;
}
.upload {
  display: flex;
  justify-content: center;
}
.tablebox .tableBorder {
  border: 1px solid #ebeef5;
  border-bottom: none;
  font-size: 16px;
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
/*未完待续 :
5个按钮 三个按钮的值过滤 删除前判断是否选中 禁用前判断是否可以禁用 查询的条件更改
1.表格的序号  完成  可以传入index参数自定义 若不行则自动加一个index属性即可
2.状态动画的提示 完成 加载状态的提示应该是跟API的调用相对应 只关注API调用开始 成功失败 结束三种状态
3.单选框默认值的设定 设置的值与label要相等 同时数据格式也要相等 完成
4.表单的彻底重置 完成
5.1分页器设置的API
6.请求API的重构 代码目录结构的设置 逻辑梳理
6.vueRouter
7.总结工作
4/7
/*
行动
1.页面分配  思考中 暂时完成
2.禁用等弹框尝试封装
3.
提升
3.路由配置  重点 导航栏的切换是否会变换路由 应该是上面的路由点击之后不跳转 只切换右侧的侧边栏目录 应该说是展开才对 逻辑再整理一下
4.权限管理学习  重点
5.组件递归 和组件过度动画 重点
6.拦截器的配置
遇到的bug
0.0 bug其一 nav选中状态的处理 :default-active="this.$route.path" 使得当前路由处于选中状态
4/15
1.日期按钮消除bug 完成1 moment插件在传递空字符串的时候会返回一个非法字符 传递null的时候会返回当前日期
2.下拉框清除当前按钮或者选中全部 完成1 添加 clearable属性即可

4.序号累加 完成1 为何elementUI的未生效 若生效则使用 未生效则更改index的值
5.按钮节点限制点击 完成 :loading="true"添加限制即可
6.默认图片的替换 完成  table表格显示图像
7.邮箱绑定1 addForm的获取和传递
8.分页器确定按钮的增加1 完成 10条数据 el-button或者自己手动添加 根据current 根据个鬼= = 按钮没任何功能 就是模糊特效
9.三级联动 2
10.text文本框禁止拉伸
11.echarts数字显示
12.日期显示统一规格
13.角色管理 是否默认 删除 选项删除 默认全传否、
14.用户管理 身份证 性别 姓名禁用 字段修改 3.手机号码 身份证号码 的正则替换 不写 字符串裁剪完成 正则表达式匹配完成 待定
 用户头像自定义 有点问题
*/
</style>

