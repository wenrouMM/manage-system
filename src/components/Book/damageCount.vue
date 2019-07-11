<template>
  <div id="damageCount">
    <div class="commonMode" style="width:100%">
      <div class="sonTitle">
        <span class="titleName">损坏清点</span>
      </div>
    </div>
    <!-- 2.0表单填写 -->
    <div class="anthoerBox">
      <section class="searchBox">
        <div class="buttonBox">
          <!--<button class="blue" @click="deriveBtn">
            <i class="blueIcon el-icon-share"></i>导出
          </button>-->
        </div>
        <div class="right">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="筛选 :">
              <el-select
                style="width: 150px"
                v-model="searchForm.makeMethod"
                placeholder="请选择"
                clearable
                @change="selectCheck(searchForm.makeMethod)"
              >
                <el-option label="书名" value="0"></el-option>
                <el-option label="ISBN" value="1"></el-option>
              </el-select>
              <el-input v-model="searchForm.searchData" placeholder="请输入相关信息" clearable style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <!-- 3.0表格数据 -->
      <section class="tableBox" v-loading="tableLoading">
        <el-table
          :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px',borderRight:'none'}"
          empty-text="无数据"
          style="width: 100%; text-align:center;"
          :data="tableData"
          :row-style="{height:'60px'}"
        >
          <el-table-column align="center" prop="index" type="index" width="100" label="序号" fixed="left">
            <template slot-scope="scope">
              <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="书名" :show-overflow-tooltip="true" width="200"></el-table-column>
          <el-table-column align="center" prop="isbn" label="ISBN" :show-overflow-tooltip="true" width="200"></el-table-column>
          <el-table-column align="center" prop="author" label="编著者" :show-overflow-tooltip="true" width="200"></el-table-column>
          <el-table-column align="center" prop="fkPressName" label="出版社" :show-overflow-tooltip="true" width="200"></el-table-column>
          <el-table-column align="center" prop="total" label="总藏馆数量" :show-overflow-tooltip="true" width="150"></el-table-column>
          <el-table-column align="center" prop="sum" label="在馆" :show-overflow-tooltip="true" width="150"></el-table-column>
          <el-table-column align="center" prop="lend" label="已借" :show-overflow-tooltip="true" width="150"></el-table-column>
          <el-table-column align="center" prop="damage" label="损坏" :show-overflow-tooltip="true" width="150"></el-table-column>
          <el-table-column align="center" width="200" prop="damageName" label="注销清点" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>被盗:{{scope.row.stolen}}</span>
              <span>未还:{{scope.row.notReturn}}</span>
              <span>陈旧:{{scope.row.old}}</span>
              <span>破损:{{scope.row.spoiled}}</span>
              <span>其他:{{scope.row.other}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="200" fixed="right">
            <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
            <template slot-scope="scope">
              <span class="detail" @click="detailBtn(scope.$index, scope.row)">详情</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 4.0 分页 -->
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
</template>

<script>
import axios from "axios";
import { damage, damageInt } from "@request/api/base.js";

export default {
  data() {
    return {
      searchForm: {
        // 接受搜索表单的数据
        makeMethod: "",
        searchData: "",
        currentPage: 0
      },
      searchData: "",
      selectSearchForm: {
        bookName: "", //书名
        isbn: "", //isbn
        currentPage: 0
      },
      tableLoading: true,
      currentPage: 1,
      pageInput: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      id: ""
    };
  },
  computed: {
    searchTimeForm() {
      if (this.searchData) {
        switch (this.searchData / 1) {
          case 0:

            this.selectSearchForm.bookName = this.searchForm.searchData;
            break;
          case 1:

            this.selectSearchForm.isbn = this.searchForm.searchData;
            break;
        }
      } else {

        this.selectSearchForm.bookName = "";
        this.selectSearchForm.isbn = "";
      }
      let newSearch = {
        isbn: this.selectSearchForm.isbn,
        bookName: this.selectSearchForm.bookName,
        pageSize: this.pageSize,
        currentPage: 1
      };
      return newSearch;
    }
  },
  methods: {
    selectCheck(val) {

      this.searchForm.searchData=""
      for(const index in this.selectSearchForm){
        this.selectSearchForm[index]=""
      }
      this.searchData = val;
    },
    // 查询按钮
    searchBtn() {
      this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
      this.currentPage = 1;
    },
    // 导出按钮
    deriveBtn() {},
    // 详情按钮
    detailBtn(index, row) {
      let bookId = row.id;

      this.$router.push({ path: `/checkDetails/${bookId}` });
    },
    // 分页按钮
    jumpBtn() {
      // v-mode绑定好像会默认转数据类型
      let page = Math.ceil(this.total / this.pageSize);
      page == 0 ? 1 : page;
      if (this.pageInput > page || this.pageInput == "" || this.pageInput < 0) {
        this.pageInput = 1;
        this.$nextTick(() => {
          this.$refs.text.value = 1; // hack方法

        });
      } else {
        this.pageInput = parseInt(this.pageInput);
        this.$refs.text.value = parseInt(this.pageInput);
        let num = parseInt(this.pageInput);
        this.current_change(num);
      }
    },
    /*------ Api ------*/
    searchApi(value) {
      //获取登录记录

      this.tableLoading = true;
      axios
        .get(damageInt.outline, {
          params: value
        })
        .then(res => {

          if (res.data.state === true) {
            this.tableData = res.data.row; //获取返回数据
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
            this.currentPage = 1; // 回到第一页显示
            this.tableLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.tableLoading = false;
          }
        })
        .catch(error => {

        });
    },
    paginationApi(value) {
      //获取登录记录

      this.tableLoading = true;
      axios
        .get(damageInt.outline, {
          params: value
        })
        .then(res => {

          if (res.data.state === true) {
            this.tableData = res.data.row; //获取返回数据
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
            this.tableLoading = false;
          } else {
            this.$message.error(res.data.msg);
            this.tableLoading = false;
          }
        })
        .catch(error => {

        });
    },
    current_change(currentPage) {
      //分页查询
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;

      this.paginationApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
    }
  },
  created() {
    this.searchApi(this.searchTimeForm); // 调用查询接口获取数据
  }
};
</script>

<style scoped>
#damageCount {
  background-color: #ffffff;
}
#damageCount .commonMode .sonTitle {
  margin-bottom: 0 !important;
}
.anthoerBox {
  padding: 0 30px;
  padding-bottom: 30px;
}
.searchButton {
  cursor: default;
  background-color: #0096ff;
  height: 39px;
  width: 60px;
  border-radius: 3px;
  position: absolute;
  left: 910px;
}

.searchBox {
  display: flex;
  justify-content: space-between;
}
.buttonBox .blue {
  background: #31d6ff;
  border-radius: 10px;
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
/*------ 表格 ------*/
.tableBorder {
  border: 1px solid #ebeef5;
  border-bottom: none;
}
.page_div {
  text-align: center;
  margin-top: 30px;
}

.confirm_bt {
  display: inline-block;
  text-align: center;
  width: 70px;
  padding: 8px 8px;
}
.edit {
  color: #00d7f0;
  cursor: pointer;
  margin-right: 20px;
}
.button_s {
  width: 90px;
  font-size: 16px;
  text-align: center;
}
.detail {
  cursor: pointer;
  color: #00d7f0;
}
.time_p {
  margin-left: 30px;
}
</style>
