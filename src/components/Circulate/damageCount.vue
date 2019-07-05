<template>
  <div id="loginrecord" class="damageCount">
    <el-container>
      <div class="commonMode" style="width:100%">
        <div class="sonTitle">
          <span class="titleName">报损记录</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <el-button type="primary" @click="batchBtn">批量处理</el-button>
          </div>
          <div class="searchFormBox">
            <el-form :inline="true" :model="searchForm">
              <el-form-item size="130" label="创建时间">
                <el-date-picker
                  v-model="searchForm.beginTime"
                  type="date"
                  style="width: 200px"
                  placeholder="开始日期"
                  :picker-options="pickerOptions0"
                ></el-date-picker>
                <el-date-picker
                  v-model="searchForm.endTime"
                  type="date"
                  style="width: 200px"
                  placeholder="结束日期"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="button_s" @click="submit_tv">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
        </section>
        <!-- 3.0表格数据 -->
        <section class="tableBox" v-loading="tableLoading" element-loading-text="拼命加载中">
          <el-table
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px'}"
            empty-text="无数据"
            :data="tableData"
            :row-style="{height:'60px'}"
            @selection-change="selectAllBtn"
          >
            <el-table-column align="center" type="selection" fixed="left" width="100"></el-table-column>
            <el-table-column align="center" prop="index" type="index" label="序号" width="100" fixed="left">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="fkReaderName" label="用户名称">
              <template slot-scope="scope">
                <span>{{scope.row.fkReaderName == null || scope.row.fkReaderName=='' ?'---':scope.row.fkReaderName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="cardNum" label="卡号">
              <template slot-scope="scope">
                <span>{{scope.row.cardNum == null || scope.row.cardNum=='' ?'---':scope.row.cardNum}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
            <el-table-column align="center" prop="fkBookPrice" label="书籍价格">
              <template slot-scope="scope">
                <span>{{scope.row.fkBookPrice == null || scope.row.fkBookPrice=='' ?'---':scope.row.fkBookPrice}}元</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fkBookName" label="损坏书籍"></el-table-column>
            <el-table-column align="center" prop="fkDamageName" label="损坏方式"></el-table-column>
            <el-table-column align="center" prop="price" label="赔偿金额">
              <template slot-scope="scope">
                <span>{{scope.row.price == null || scope.row.price=='' ?'---':scope.row.price}}</span>
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
        <div class="dealDialog collectionDelete">
          <el-dialog  title="报损处理" :visible.sync="dealDialog" width="400px">
            <div class="FormBox" style="width: 255px">
              <el-form :model="dealForm">
                <el-form-item label="应收金额" label-width="150px">
                  <span class="text">{{dealCash}}</span>
                </el-form-item>
                <!--
                <el-form-item label="实收金额" label-width="100px">
                  <el-input v-model="dealForm.dealNum" auto-complete="off"></el-input>
                </el-form-item>
                -->
              </el-form>
              <div style="margin-bottom: 20px">
                <span class="dialogButton true mr_40" @click="dealFormBtn">确 定</span>
                <span class="dialogButton cancel" @click="dealDialog = false">取 消</span>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { damageCotInt } from "@request/api/base.js";

export default {
  data() {
    return {
      /*====== 2.0表单搜索区域 ======*/
      searchForm: {
        // 接受搜索表单的数据
        loginSource: "",
        beginTime: "",
        endTime: "",
        currentPage: 0
      },
      /*初始化 */
      options: [
        {
          value: "0",
          label: "平台"
        },
        {
          value: "1",
          label: "设备"
        }
      ],
      /*日期禁用规则 */
      pickerOptions: {
        // 双重绑定限制规则
        disabledDate(date) {
          const maxDate = Date.now();
          const time = date.getTime();
          return time > maxDate;
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

      tableLoading: true,
      currentPage: 1,
      pageInput: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      /*------ 处理存储 ------*/
      dealForm: {
        dealNum: 0
      },
      dealCash:0,
      dealArr:[],
      batchArr:[],//批量处理用
      dealDialog: false
    };
  },
  computed: {
    searchTimeForm() {
      // 计算属性 真正传递的数据
      let searchForm = {
        pageSize: this.pageSize,
        currentPage: 1,

        startTime: !this.searchForm.beginTime
          ? null
          : moment(this.searchForm.beginTime).format("YYYY-MM-DD"), //开始时间
        lastTime: !this.searchForm.endTime
          ? null
          : moment(this.searchForm.endTime).format("YYYY-MM-DD") //结束时间
      };
      return searchForm;
    },
    dealTimeForm(){
      let obj = {
        ids:this.dealArr,
        num:this.dealForm.dealNum
      }
      return obj
    }
  },
  methods: {
    submit_tv() {
      //条件查询
      this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
      this.currentPage = 1;
    },
    // 批量处理按钮
    batchBtn(){

      if(this.dealArr.length){
        this.dealForm.dealNum = ''
        this.dealDialog = true
      } else{
        this.$message.error('请先选择批量报损的对象')
      }
      console.log('批量报损？',this.dealArr.length)
    },
    // 批量产生
    selectAllBtn(val) {
      this.dealArr = []
      this.dealCash =0
      for(let item of val){
        this.dealArr.push(item.id)
        item.price=item.price==null|| item.price==''?0:item.price;
        console.log('钱？',item.fkBookPrice)
        this.dealCash += Number(item.price)
      }
      console.log(val)
      console.log('此时的钱',this.dealArr,this.dealCash)
    },
    // 处理按钮
    dealBtn(row, index) {
      this.dealForm.dealNum = ''
      this.dealDialog = true
      this.dealArr.push(row.id)
      this.dealCash = row.fkBookPrice
      console.log(row,this.dealArr);
    },
    current_change(currentPage) {
      //分页查询
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;
      console.log("保存当前查询", this.paginationForm, this.currentPage);
      this.paginationApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
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
    // 弹框
    dealFormBtn(){
      this.dealApi(this.dealTimeForm)
    },
    /*------ API区 ------*/
    searchApi(value) {
      console.log(value);
      this.tableLoading = true;
      axios
        .get(damageCotInt.search, {
          params: value
        })
        .then(res => {
          console.log("损坏记录", res.data);
          if (res.data.state === true) {
            this.tableData = res.data.row; //获取返回数据
            //console.log('获取的表格数据',this.tableData)
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
            this.currentPage = 1;
            //console.log("保存当前查询", this.paginationForm);
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
      console.log(value);
      this.tableLoading = true;
      axios
        .get(damageCotInt.search, {
          params: value
        })
        .then(res => {
          console.log("登陆记录", res.data);
          if (res.data.state === true) {
            this.tableData = res.data.row; //获取返回数据
            //console.log('获取的表格数据',this.tableData)
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
    dealApi(value) {
      console.log(value)
      axios.post(damageCotInt.deal, value).then(res => {
        if (res.data.state === true) {
          console.log(res);
          this.searchApi();
          this.$message.success('报损成功')
          this.dealDialog =false
        } else {
          this.dealDialog =false
          this.$message.error(res.data.msg);
        }
      });
    }
  },
  mounted() {
    this.searchApi(this.searchTimeForm); // 调用查询接口获取数据
  }
};
</script>

<style scoped>
.page_div {
  text-align: center;
  margin-top: 30px;
}
.searchBox {
  display: flex;
  justify-content: space-between;
}
.FormBox {
  width: 400px;
}
.confirm_bt {
  display: inline-block;
  text-align: center;
  width: 70px;
  padding: 8px 8px;
}

.button_s {
  width: 90px;
  font-size: 16px;
  text-align: center;
}

#loginrecord {
  background: #ffffff;
}

.time_p {
  margin-left: 30px;
}
.deal {
}
/*.el-select-dropdown__item {*/
/*color: #878787;*/
/*}*/

#title {
  display: inline-block;
  padding-left: 10px;
  border-left: 5px solid #1e9eff;
  color: #878787;
}


</style>


