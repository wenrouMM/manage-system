<template>
  <div id="damageCount">
    <div class="commonMode spect">
      <div class="sonTitle">
        <span class="titleName">损坏清点详情</span>
      </div>
      <div class="back">
        <i class="el-icon-back"></i>
        <router-link class="textback" tag="span" to="/damageCount">返回损坏清点</router-link>
      </div>
    </div>
    <!-- 2.0表单填写 -->
    <div class="anthoerBox">
      <section class="searchBox">
        <div class="buttonBox mb_30">
          <button class="blue" @click="deriveBtn">
            <i class="blueIcon el-icon-share"></i>导出
          </button>
        </div>
      </section>
      <!-- 3.0表格数据 -->
      <section class="tableBox">
        <div class="tableBorder">
          <el-table
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'18px',borderRight:'none'}"
            empty-text="无数据"
            style="width: 100%; text-align:center;"
            :data="tableData"
            :row-style="{height:'60px'}"
          >
            <el-table-column align="center" prop="index" type="index" width="100" label="序号">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="书名"></el-table-column>
            <el-table-column align="center" prop="code" label="馆内码"></el-table-column>
            <el-table-column align="center" prop="author" label="编著者"></el-table-column>
            <el-table-column align="center" prop="fkPressName" label="出版社"></el-table-column>
            <el-table-column align="center" prop="available" label="启用状态">
              <template slot-scope="scope">
                <span class>{{scope.row.available == 1 ?'启用':'停用'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="filterLend" label="在馆状态"></el-table-column>
            <el-table-column align="center" prop="filterOther" label="其他状态"></el-table-column>
          </el-table>
        </div>
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
        isbn: "",
        bookName: ""
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
      let newSearch = {
        isbn: this.searchForm.isbn,
        bookName: this.searchForm.bookName,
        pageSize: this.pageSize,
        currentPage: 1
      };
      return newSearch;
    }
  },
  methods: {
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
      console.log(row);
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
          console.log("Vmode绑定值", this.pageInput);
        });
      } else {
        this.pageInput = parseInt(this.pageInput);
        this.$refs.text.value = parseInt(this.pageInput);
        let num = parseInt(this.pageInput);
        this.current_change(num);
      }
    },
    // 状态过滤函数
    filtersOther(value) {
      let str = "";
      switch (value) {
        case 0:
          str = "无特殊状态";
          break;
        case 1:
          str = "损坏";
          break;
        case 2:
          str = "遗失";
          break;
        case 3:
          str = "调馆";
          break;
        case 4:
          str = "未还";
          break;
        case 5:
          str = "被盗";
          break;
        case 6:
          str = "陈旧";
          break;
        case 7:
          str = "破损";
          break;
        case 8:
          str = "其他";
          break;
      }
      return str;
    },
    filtersLend(value) {
      let str = "";
      switch (value) {
        case 0:
          str = "不在架";
          break;
        case 1:
          str = "在架";
          break;
        case 2:
          str = "借出";
          break;
        case 3:
          str = "剔除";
          break;
        case 4:
          str = "损坏";
          break;
      }
      return str;
    },
    /*------ Api ------*/
    searchApi(value) {
      //获取登录记录
      console.log(value);
      this.tableLoading = true;
      axios
        .get(damageInt.detail, {
          params: value
        })
        .then(res => {
          console.log("损坏记录", res.data);
          if (res.data.state === true) {
            let data = res.data.row;
            for (let item of data) {
              item.filterLend = this.filtersLend(item.lendState);
              item.filterOther = this.filtersOther(item.otherState);
            }
            this.tableData = data; //获取返回数据
            console.log("过滤后的data", this.tableData);
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
          console.log(error);
        });
    },
    paginationApi(value) {
      //获取登录记录
      console.log(value);
      this.tableLoading = true;
      axios
        .get(damageInt.detail, {
          params: value
        })
        .then(res => {
          console.log("损坏记录", res.data);
          if (res.data.state === true) {
            let data = res.data.row;
            for (let item of data) {
              item.filterLend = this.filtersLend(item.lendState);
              item.filterOther = this.filtersOther(item.otherState);
            }
            this.tableData = data; //获取返回数据
            console.log("过滤后的data", this.tableData);
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
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
    current_change(currentPage) {
      //分页查询
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;
      console.log("保存当前查询", this.paginationForm, this.currentPage);
      this.paginationApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
    }
  },
  created() {
    let obj = {};
    obj.fkCataBookId = this.$route.params.id;
    console.log(this.$route.params);

    this.searchApi(obj); // 调用查询接口获取数据
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
.spect {
  display: flex;
  justify-content: space-between;
}
.back {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.back:hover {
  color: #0096ff;
}
.textback {
  margin-left: 10px;
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
