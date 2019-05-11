<template>
  <div class="useradd">
    <el-container>
      <div class="box-card">
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">图书类型列表</span>
          </div>
          <!-- 2.0 表单搜索填写 查询接口 状态：正在查询（loading组件） 查询成功 查询失败 -->
          <section class="searchBox">
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="类型标识:">
                <el-input size="120" v-model="searchForm.keywords" placeholder="请输入关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="15" type="primary" @click="searchSubmit">查询</el-button>
              </el-form-item>
            </el-form>
          </section>
          <!-- 3.0 表格展示内容 仅提供搜索和分页功能 -->
          <section class="text item tablebox" v-loading="tableLoading" element-loading-text="拼命加载中">
            <el-table
              @selection-change="handleSelectionChange"
              class="tableBorder"
              :data="tableData"
              empty-text="无数据"
              style="width: 100%; text-align:center;"
              type="index"
              :row-style="rowStyle"
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'18px'}"
            >
              <el-table-column align="center" prop="id" width="100" label="序号">
                <template slot-scope="scope">
                  <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="name" width label="类型名称"></el-table-column>
              <el-table-column align="center" prop="code" width="200" label="类型标识"></el-table-column>
              <el-table-column align="center" prop="parentCode" label="上级名称"></el-table-column>
              <el-table-column align="center" prop="parentCode" width="200" label="上级标识"></el-table-column>
            </el-table>

            <!-- 3.1 分页内容 分页提交刷新页面 前进后退 点击以及调转四个事件传递数值-->
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
  </div>
</template>

<script>
import {
  userManageInterface,
  roleType,
  headUpload,
  headimg,
  booktype
} from "../../../request/api/base.js";
import moment from "moment";
import axios from "axios";
export default {
  created() {},
  mounted() {
    this.SearchApi(this.searchTimeForm); // 调用查询接口获取数据
  },
  data() {
    return {
      /*====== 2.0表单填写搜索配置数据 ======*/
      searchForm: {
        // 搜索需要的表单数据
        keywords: ""
      },
      /*====== 3.0表格设置项 ======*/
      tableLoading: false, // loading状态控制
      rowStyle: {
        height: "60px"
      },
      tableData: [
        // 用于注入表单的数据 这里的数据应该在created钩子函数创建的时候向后台获取
        /*{id
        typeName
        typeFage
        parentName
        parentFage}*/
      ],
      tableChecked:[],
      /*====== 3.1 分页相关 搜索相关设置项 ======*/
      total: 0, // 总页数
      pageSize: 10, // 页面个数
      pageInput: 1,
      currentPage: 1, // 控制当前页面处于第几页
      paginationForm: {} // 查询保存的数据
    };
  },
  computed: {
    searchTimeForm() {
      // 计算属性 真正传递的数据
      /*{id
        typeName
        typeFage
        parentName
        parentFage}*/
      let searchForm = {
        fkTypeCode: this.searchForm.keywords
      };
      return searchForm;
    }
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
    handleSelectionChange(val){
      console.log(val)
      this.tableChecked=val
    },
    /*====== 2.0 表单提交相关函数 ======*/
    searchSubmit() { // 条件查询 执行的按钮应该个函数节流 查询的定义：获取查询条件的初次数据排序展示
      console.log("此时传给后台的搜索数据", this.searchTimeForm);
      this.SearchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
      this.currentPage = 1; // 并把页面刷新到第一页 更新视图
    },
    /*====== 3.0表格操作相关 ======*/
    /*====== 3.1分页按钮操作 ======*/
    current_change: function(currentPage) { // 分页查询 获取查询条件下得到数据再次筛选后的数据 1.使用上次查询的搜索条件 2.传递此时需要的页面数据 慨括 获取数据 传递数据 处理数据 映射数据 所谓API
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;
      console.log("保存当前查询", this.paginationForm);
      this.SearchApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
    },
    /*====== endApi调用区 ======*/
    SearchApi(value) { //获取登录记录 或者说是加载数据 这里应该请求的时候加状态动画

      this.tableLoading = true; // 加载前控制加载状态
      axios
        .get(booktype, {
          params: value
        })
        .then(res => {
          console.log("当前获取的数据", res.data);
          if (res.data.state === true) {
            console.log('123')
            let nomol = res.data.row
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
  },
  mounted(){
    this.SearchApi()
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


</style>

