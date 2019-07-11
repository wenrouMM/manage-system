<template>
  <div class="userRole">
    <el-container>
      <div class="box-card" style="width: 100%">
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">权限管理</span>
          </div>
          <!-- 2.0 表单填写 查询接口 状态：正在查询（loading组件） 查询成功 查询失败 -->
          <div style="display:flex;flex-direction:row;justify-content: space-between">
            <!-- 3.0 添加删除按钮 添加之前：弹框提交  状态： 正在添加 添加完成（alert提示自带）/添加失败请重试 -->
            <div class="buttonBox">
              <!--
              <button class="add" @click="addButton('addForm')">
                <i class="addIcon el-icon-plus"></i>添加
              </button>
              -->
              <!--
              <button class="delete" @click="deleteBtn(allSeclet)">
                <i class="deleteIcon el-icon-delete"></i>批量删除
              </button>
              -->
            </div>
            <section class="searchBox" style="margin-left:320px">
              <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="角色名称:" >
                  <!-- 当value为对象时必须要给一个对象内的参数与绑定的key值一致才不会出现选中一个变为选中多个 -->
                  <el-select
                    style="width: 200px"
                    clearable
                    v-model="formInline.userType"
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
                <el-form-item label="创建时间:" size="130">
                  <el-date-picker
                    v-model="formInline.beginTime"
                    type="date"
                    style="width: 200px"
                    placeholder="开始日期"
                    :picker-options="pickerOptions0"
                  ></el-date-picker>
                  <el-date-picker
                    v-model="formInline.endTime"
                    type="date"
                    style="width: 200px"
                    placeholder="结束日期"
                    :picker-options="pickerOptions1"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button size="15" type="primary" @click="searchBtn">搜索</el-button>
                </el-form-item>
              </el-form>
            </section>
          </div>
          <!-- 4.0 表格展示内容 -->
          <section class="tablebox" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table
              @selection-change="selectAllBtn"
              :data="tableData"
              style="width: 100%;
                      text-align:center;"
              :row-style="rowStyle"
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
            >
              <!--
              <el-table-column align="center" type="selection" width="100"></el-table-column>
              -->
              <el-table-column width="100" align="center" prop="index" type="index" label="序号">
                <template slot-scope="scope">
                  <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="roleName" label="角色名称"></el-table-column>
              <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
              <el-table-column align="center" prop="updateTime" label="修改时间"></el-table-column>
              <el-table-column align="center" prop="disabled" label="状态">
                <template slot-scope="scope">
                  <span>{{scope.row.disabled ===0?'启用':'禁用'}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" fixed="right">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="edit" @click="editButton(scope.$index, scope.row)">授权</span>
                  <!--
                  <span class="ban" @click="banButton(scope.$index, scope.row)">禁用</span>
                  -->
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
                  <input ref="text" type="number" v-model="pageInput" autocomplete="off" min="1" max="1" class="compo el-input__inner">
                </div>
                页
              </span>
                </slot>
              </el-pagination>
              <el-button type="primary" class="ml_30"  size="medium" @click="jumpBtn">确定</el-button>
            </section>
          </section>
        </div>
      </div>
      <!-- 弹框组 添加弹框未知 批量删除弹框 禁用弹框 编辑弹框 -->
      <!-- 禁用弹框/批量删除弹框 -->
      <div class="forbid">
        <el-dialog :title="dialogTitle[i]" :visible.sync="refuseDialog" width="400px" center>
          <div class="dialogBody">是否{{dialogTitle[i]}}?</div>
          <div slot="footer">
            <span class="dialogButton true mr_40" @click="refuseBtn">确 定</span>
            <span class="dialogButton cancel" @click="refuseDialog = false">取 消</span>
          </div>
        </el-dialog>
      </div>
      <!-- 添加 编辑弹框 -->
      <div id="typeMessage">
        <div style="position: relative">
          <p>授权</p>
          <img src="../../base/img/menu/xx.png" style="position: absolute;top: 16px;left: 360px;width: 20px;height: 20px" @click="closeCheck">
        </div>
        <div class="powerControl">
          <ul id="treeDemo" class="ztree"></ul>
          <el-button type="primary" plain style="margin-left: 70px;width: 200px;margin-top: 10px" @click="controlClick">确定</el-button>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
  import '../../zTree_v3/css/zTreeStyle/zTreeStyle.css'
import moment from "moment";
import axios from "axios";
import { powerMangaeInt, selectRoleType,control,powerControl } from "../../request/api/base.js";
import * as respones from "echarts";
export default {
  created() {
    let route = this.$route.path;
    //console.log(this.$route.path);
    //console.log(this.$route.meta.menuName);
    this.selectRoleType(); // 获取角色类型
    this.searchApi(this.searchTimeForm);
  },
  data() {
    return {
      /*====== 2.0表单提交数据项 ======*/
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
          selectedMulti: false,
        },
        callback: {
          onCheck: this.zTreeOnCheck, //勾选时事件
          beforeCheck: this.zTreeBeforeCheck,
          beforeExpand: this.zTreeBeforeExpand,
        },
        check: {
          enable: true,
          chkStyle: "checkbox", //选择框的类型
          chkboxType: { "Y": "ps", "N": "ps" }, //关联父子节点
        },
      },//ztree树配置
      zNodes: [], //ztree树加载的数据
      optionsData: [], // 下拉框数据
      formInline: {
        // 搜索需要的表单数据
        userType: "",
        beginTime: "",
        endTime: "",
        currentPage: 0
      },
      pickerOptions0: {
        disabledDate: time => {
          if (this.formInline.endTime) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.formInline.endTime
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          return (
            time.getTime() < this.formInline.beginTime ||
            time.getTime() > Date.now()
          );
        }
      },
      /*====== 3.0表格设置项 ======*/
      tableLoading: false,
      tableData: [],
      rowStyle: {
        height: "60px"
      },
      allSeclet: [], // 全选的对象
      total: 0,
      pageSize: 10,
      pageInput: 1,
      currentPage: 1,
      paginationForm: {}, // 提交的数据 保存查询的结果后查询分页
      /*====== 弹框表单配置项 ======*/
      dialogTitle: ["添加", "删除", "授权", "禁用"],
      i: 0,
      formLabelWidth: "120px",
      /*------ 添加编辑弹框  ------*/
      changeDialog: false,
      changeLoading:false,
      modeName: ["藏馆系统", "图书系统", "区域系统", "权限系统"],
      pageName: [],
      buttonName: [],
      addForm: {
        userType: "",
        mode: [],
        pageMode: [],
        buttonMode: []
      },
      /*------ 删除禁用弹框 ------*/
      refuseDialog: false,
      refuseLoading:false,
      banArr: {  // 禁用传递数据
        fkRoleCode: ""

      },
      menuId:[],
      roleId:null,
      checked:false
    };
  },
  computed: {
    searchTimeForm() {
      // 传递给后端的搜索数据
      let searchForm = {
        // 非空判断的各个值
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        fkRoleCode: this.formInline.userType,
        beginTime: !this.formInline.beginTime
          ? null
          : moment(this.formInline.beginTime).format("YYYY-MM-DD"), //开始时间
        endTime: !this.formInline.endTime
          ? null
          : moment(this.formInline.endTime).format("YYYY-MM-DD") //结束时间
      };
      //console.log(searchForm)
      return searchForm;
    },

  },
  mounted(){
    $('#typeMessage').fadeOut()
  },
  methods: {
    jumpBtn() {
      // v-mode绑定好像会默认转数据类型
      console.log('数据类型检测',this.pageInput)
        let page = Math.ceil(this.total / this.pageSize)
        page ==0?1:page;
        if(this.pageInput>page || this.pageInput == ''|| this.pageInput<0){
          this.pageInput = 1
          this.$nextTick(()=>{
            this.$refs.text.value = 1 // hack方法
            console.log('Vmode绑定值',this.pageInput)
          })
        }else{
          this.pageInput = parseInt(this.pageInput)
          this.$refs.text.value = parseInt(this.pageInput)
          let num = parseInt(this.pageInput)
          this.current_change(num)
        }
    },
    /*====== zTree保持展开单一路径的实现 ======*/
    zTreeBeforeExpand(treeId, treeNode) {
      this.singlePath(treeNode);
      return true;
    },
    singlePath(currNode) {
      //console.log(currNode);
      //节点级别，即节点展开的等级，是爸爸辈还是儿子辈
      var cLevel = currNode.level;
      //这里假设id是唯一的
      var cId = currNode.id;
      //此对象可以保存起来，没有必要每次查找
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      /**
       * 展开的所有节点，这是从父节点开始查找（也可以全文查找）
       * 从当前节点的父节点开始查找，看有没有打开的节点，如果有则判断，若为同一级别的不同节点，则关闭，否则不关闭
       */
      var expandedNodes = treeObj.getNodesByParam("open", true, currNode.getParentNode());
      //console.log(expandedNodes);
      for(var i = expandedNodes.length - 1; i >= 0; i--){
        var node = expandedNodes[i];
        var level = node.level;
        var id = node.id;
        if (cId != id && level == cLevel) {
          treeObj.expandNode(node, false);
        }
      }
    },
    /*====== 取消授权弹框 ======*/
    closeCheck() {
      $('#typeMessage').fadeOut()
    },
    /*====== 点击授权时 ======*/
    editButton(index,row) {
      //console.log(row.id)
      this.roleId=row.id
      this.zNodes.length=0
      let list=[]
      this.axios.get(control.tree,{params:{roleid:row.id}}).then((res)=>{
        console.log("树状图",res)
        if(res.data.state==true){
          for (var item of res.data.rows) {
            //console.log(item)
            list.push({
              id: item.id, //节点id
              pId: item.pid, //节点父id
              name: item.name, //节点名称
              checked:item.choose,
              type:item.type
            });
          }
          //将数据渲染到ztree树
          $.fn.zTree.init($("#treeDemo"), this.setting,list);
          if(list.length>0){
            $('#typeMessage').fadeIn()
            this.zNodes=list
          }
        }
      })
    },
    /*====== 授权加载ztree树，节点被勾选时 ======*/
    zTreeOnCheck(event,treeId,treeNode){
      this.checked=true
      this.menuId.length=0
      console.log(treeNode)
      let treeObj=$.fn.zTree.getZTreeObj("treeDemo"),
      nodes=treeObj.getCheckedNodes(true);
      console.log('nodes',nodes)
      console.log('nodes.length',nodes.length)
      if(nodes.length!=0){
        for(let item of nodes){
          console.log(item.id)
          this.menuId.push(item.id)
        }
      }else{
        this.menuId.length=0
      }
    },
    controlClick(){
      console.log('选中值id',this.menuId)
      if(this.checked==true){
        this.axios.post(control.add,{id:this.roleId,menuIds:this.menuId}).then((res)=>{
          console.log(res)
          if(res.data.state==true){
            this.$message({
              message: res.data.msg,
              type: "success"
            });
          }else{
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
        $('#typeMessage').fadeOut()
      }else{
        this.$message({
          message:'请先选择您要赋予的权限',
          type: "error"
        });
      }

    },
    /*====== 搜索按钮 ======*/
    searchBtn() {
      // 函数节流
      this.searchApi(this.searchTimeForm);
      this.currentPage = 1;
    },
    /*====== 批量删除按钮 ======*/
    deleteBtn() {
      if (this.allSeclet.length) {
        this.i = 1;
        this.refuseDialog = true;
        console.log(this.allSeclet)
      } else {
        this.$message.error("请先选择删除对象");
      }
    },
    /*====== 禁用按钮 ======*/
    banButton(index,row) {
      if (row.disabled == 1) {
        this.$message.error("该用户已被禁用");
      } else {
        this.i = 3;
        this.banArr.fkRoleCode = row.roleCode;
        console.log('当前选中',index, row, this.banArr); // 当前选中表格的索引和对
        this.refuseDialog = true;
      }
    },
    selectAllBtn(val) {
      console.log(val);
      let arr = [];
      for (let item of val) {
        let obj = {};
        obj.code = item.roleCode;
        arr.push(obj);
      }
      this.allSeclet = arr;
    },
    /*====== 弹框相关按钮 ======*/
    refuseBtn() { // 禁用确定按钮
      if(this.i ==1){
        this.deleteApi()
        this.refuseDialog = false
      }
      if(this.i==3){
        this.banApi(this.banArr)
        console.log(this.banArr)
      }
    },
    /*====== API相关函数 ======*/
    // 通用API
    selectRoleType() {
      axios.get(selectRoleType).then(res => {
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
    searchApi(value) {
      this.tableLoading = true;
      this.axios.get(powerControl, { params: value }).then(res => {
        console.log("查询分页的页数", res.data);
        if (res.data.state === true) {
          this.tableData = res.data.row; //获取返回数据
          console.log("获取的表格数据", this.tableData);
          this.total = res.data.total; //总条目数
          this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
          console.log("保存当前查询", this.paginationForm);
          this.tableLoading = false;
        } else {
          this.$message.error(res.data.msg);
          this.tableLoading = false;
        }
      });
    },
    deleteApi() {
      //this.banDeleteLoading = true;
      let obj = new Object();
      obj.deleteParams =   this.allSeclet ;
      console.log(obj.deleteParams)
      axios
        .delete(powerMangaeInt.delete, {
          data: obj
        })
        .then(res => {
          console.log(res.data);
          if (res.data.state === true) {
            console.log(res.data);
            this.searchApi(this.paginationForm); // 删除成功就重新加载一次数据
            this.$message.success("删除成功");
            this.refuseDialog = false; // 提示删除成功 是否需要提示信息
            //this.banDeleteLoading = false;
          } else {
            this.$message.error(res.data.msg);
            //this.banDeleteLoading = false;
          }
        });
    },
    banApi(arr) {
      console.log("禁用的数据", arr); // 正在请求的状态 通过按钮还是文本
      axios.put(powerMangaeInt.prohibit, arr).then(res => {
        console.log(res.data);
        if (res.data.state === true) {
          console.log(res.data);
          this.searchApi(this.paginationForm); // 禁用成功就重新加载一次数据
          this.$message.success("禁用成功");
          this.refuseDialog = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    current_change: function(currentPage) { //分页查询
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;
      //console.log('保存当前查询',this.paginationForm);
      this.searchApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
    },
  }
};
</script>

<style scoped>
/*====== 0.0 初始化部分 ======*/
#typeMessage{
  display: none;
  position: absolute;
  border-radius: 20px;
  top: 200px;
  left:750px;
  z-index: 30000;
  filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
  -moz-box-shadow: 2px 2px 10px #909090;
  -webkit-box-shadow: 2px 2px 10px #909090;
  box-shadow:5px 5px 40px #909090;
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

}
#typeMessage div:nth-child(2){
  overflow: auto;
  width: 370px;
  height: 400px;
  background-color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  padding-left: 30px;
  padding-bottom: 30px;

}
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
.ztree li span.button.ico_docu{margin-right:2px; background-position:1px -72px; vertical-align:top; *vertical-align:middle}
.edit {
  color: #00d7f0;
  cursor: pointer;
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

