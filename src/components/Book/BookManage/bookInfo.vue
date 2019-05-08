<template>
  <div class="bookInfo">
    <el-container>
      <div class="box-card">
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">图书信息列表</span>
          </div>
          <!-- 2.0 表单填写 查询添加 内容需做调整  -->
          <section class="searchBox Posleft">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="书籍名称:">
                <el-input size="120" v-model="searchForm.bookName" placeholder="请输入书籍名称"></el-input>
              </el-form-item>
              <el-form-item label="索书号:" size="160">
                <el-input v-model="searchForm.bookIndex" placeholder="请输入索书号"></el-input>
              </el-form-item>
              <el-form-item label="作者:" size="160">
                <el-input v-model="searchForm.author" placeholder="请输入作家"></el-input>
              </el-form-item>
              <el-form-item label="出版社:" size="160">
                <el-input v-model="searchForm.lib" placeholder="请输入关键字"></el-input>
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
              <el-table-column align="center" width="80" prop="index" label="序号">
                <template slot-scope="scope">
                  <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" width="180" prop="name" label="书籍名称" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column align="center" :show-overflow-tooltip="true" prop="searchNumber" width="110" label="索书号"></el-table-column>
              <el-table-column align="center" prop="isbn"  label="ISBN"></el-table-column>
              <el-table-column align="center" prop="author" width="150" label="作者"></el-table-column>
              <el-table-column align="center" width="150" prop="fkPressName" label="出版社" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column align="center" prop="pageNumber" width="150" label="页码"></el-table-column>
              <el-table-column align="center" prop="price" width="100" label="价格"></el-table-column>
              <el-table-column align="center" prop="barcode" width="160" label="条码" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column align="center" prop="fkTypeName" :show-overflow-tooltip="true" width="150" label="类型"></el-table-column>
              <el-table-column align="center" label="操作" width="180">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="detail edit" @click="detailButton(scope.$index, scope.row)">查看详情</span>
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
    </el-container>
    <!-- 类型名称弹框-->
    <div id="typeMessage">
      <div>请选择类型名称</div>
      <div>
        <ul id="treeDemo" class="ztree"></ul>
      </div>
    </div>
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
      /*====== 2.0表单搜索提交数据项 ======*/
      searchForm: {
        bookName: "",
        bookIndex: "",
        author: "",
        lib: ""
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
      pageSize: 10,
      pageInput: 1,
      currentPage: 1,
      paginationForm: {},
      /*===== end 弹框初始化数据 ======*/
      dialogFormVisible: false, // // 添加弹框的展示和消失
      editLoading: false,
      /*====== 1.0类型名称ztree树 ======*/
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
      typeName:null
    };
  },
  computed: {
    searchTimeForm() {
      // 搜索所需数据 过滤数据 传递给后端的数据
      let searchForm = {
        pageSize: this.pageSize,
        currentPage:1,
        name:this.searchForm.bookName,
        searchNumber:this.searchForm.bookIndex,
        author:this.searchForm.author,
        PressName:this.searchForm.lib
      };
      return searchForm;
    },
  },
  methods: {
    jumpBtn() {
      // v-mode绑定好像会默认转数据类型
      let page = Math.ceil(this.total / this.pageSize)
      page ==0?1:page;
      if(this.pageInput>page){
        this.pageInput = 1
        this.$nextTick(()=>{
          this.$refs.text.value = 1 // hack方法
          console.log('Vmode绑定值',this.pageInput)
        })
      }else{
        let num = parseInt(this.pageInput)
        this.current_change(num)
      }
    },
    closeCheck(){
      $('#typeMessage').fadeOut()
    },
    /*====== 0.0类型名称ztree树的渲染 ======*/
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
    /*====== 0.1类型名称ztree树（点击树节点选中并且传） ======*/
    zTreeOnClick(event, treeId, treeNode) {
      this.typeName=treeNode
        console.log(treeNode)
        $('#typeMessage').fadeOut()
        this.addForm.typeName=treeNode.name
    },
    /*====== 1.0 类型名称弹框 ======*/
    typeMessage(){
      $('#typeMessage').fadeIn()
    },
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
    detailButton(index,row){
      let id = row.searchNumber
      this.$router.push({path: `/bookInfo/${id}`})
    },
    /*====== 3.1 分页查询和初始化 ======*/
    current_change: function(currentPage) {
      //分页查询
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;
      console.log("保存当前查询", this.paginationForm);
      this.SearchApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
    },
    /*====== baseAPI调用相关 ======*/
    SearchApi(value) {
      //获取登录记录 或者说是加载数据 这里应该请求的时候加状态动画
      this.tableLoading= true; // 加载前控制加载状态
      axios
        .get(bookurlmessage, {
          params: value
        })
        .then(res => {
          console.log("当前获取的数据", res.data);
          if (res.data.state === true) {
            let nomol = res.data.row;
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
  },
  mounted(){
    console.log(this.dialogFormVisible)
    this.freshArea()
    this.SearchApi(this.searchTimeForm); // 调用查询接口获取数据
    $('#typeMessage').fadeOut()
    this.tableLoading=true
  }
};
</script>

<style scoped>
/*====== 0.0 初始化部分 ======*/
.edit {
  color: #00d7f0;
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
#typeMessage div:nth-child(2){
  overflow: auto;
  height:500px ;
  width: 370px;
  background-color: white;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  padding-left: 30px;
  padding-bottom: 30px;
  filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
  -moz-box-shadow: 2px 2px 10px #909090;
  -webkit-box-shadow: 2px 2px 10px #909090;
  box-shadow:2px 2px 10px #909090;
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

