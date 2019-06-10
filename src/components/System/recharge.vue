<template>
  <div id="Notice">
    <el-container>
      <div class="commonMode" style="width:100%;overflow: auto">
        <div class="sonTitle">
          <span class="titleName">充值管理</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <button class="add" @click="rechargeBtn">
              <i class="addIcon el-icon-plus"></i>充值
            </button>
            <button class="delete" @click="drawbackBtn">
              <i class="deleteIcon el-icon-delete"></i>注销
            </button>
            <button class="blue" @click="deriveBtn">
              <i class="blueIcon el-icon-share"></i>导出
            </button>
          </div>
          <div class="right">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="用户名 :">
                <el-input v-model="searchForm.name" clearable placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="处理方式 :">
                <el-select v-model="searchForm.method" clearable placeholder="请选择处理方式">
                  <el-option label="充值" value="0"></el-option>
                  <el-option label="退款" value="1"></el-option>
                  <el-option label="全部" value=""></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
        </section>
        <!-- 3.0表格数据 -->
        <section class="tableBox">
          <el-table
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px',borderRight:'none'}"
            empty-text="无数据"
            style="width: 100%; text-align:center;"
            v-loading="tableLoading"
            :data="tableData"
            :row-style="{height:'60px'}"
          >
            <el-table-column align="center" prop="index" type="index" width="100" label="序号">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" prop="state" label="处理方式" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.state ==1?'退款金额':'押金充值'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fkCardNumber" label="读者卡号" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkReaderName" label="用户名" width="150"  :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="momentum" label="金额" width="150">
              <template slot-scope="scope">
                <span>{{scope.row.momentum}}元</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="处理日期" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkHandleModeName" label="操作用户"  :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="serialNumber" label="流水标号" width="250"></el-table-column>
            <el-table-column align="center" prop="remarks" label="备注" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.remarks == null || scope.row.remarks=='' ?'---':scope.row.remarks}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 100%;height: 50px;background-color: #0096FF;line-height: 50px;color: white">&nbsp;&nbsp;&nbsp;合计&nbsp;:&nbsp;￥{{TotalRecharge}}元</div>
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
    </el-container>
  </div>
</template>

<script>
  import axios from "axios";
  import moment from "moment";
  import { recharge } from "@request/api/base.js";

  export default {
    data() {
      return {
        /*====== 2.0表单搜索区域 ======*/
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        centerDialogVisible: false, // 删除弹框
        Dialogtitle: ["修改", "新增"],
        i: null, // 切换弹框标题
        TotalRecharge:'',
        searchForm: {
          // 接受搜索表单的数据
          name:'',
          method:"",
        },
        addForm:{
          damageMothod:'',
          payFor:'',
          payforNum:'',
          remark:''
        },
        rules:{
          damageMothod:[{ required: true, message: "请输入损坏方式", trigger: "blur" }],
          payFor:[{ required: true, message: "请选择赔偿方式", trigger: "change" }],
          payforNum:[{ required: true, message: "请输入损坏的数目", trigger: "blur" }],
          remark:[{ required: true, message: "请输入备注信息", trigger: "blur" }]
        },
        /*初始化 */
        options: [
          {
            value: "0",
            label: "按具体金额赔偿"
          },
          {
            value: "1",
            label: "按价格倍数赔偿"
          },
        ],
        tableLoading: true,
        currentPage: 1,
        pageInput: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        id:'',
      };
    },
    computed: {
      searchTimeForm(){
        let newSearch={
          state:this.searchForm.method,
          name:this.searchForm.name,
          pageSize: this.pageSize,
          currentPage: 1,
        }
        return newSearch
      }
    },
    methods: {
      //导出按钮
      deriveBtn(){

      },
      //退款按钮
      drawbackBtn(){
        this.$router.push({
          path:'/logoff',
          query: {
            title: '注销'
          }
        });
      },
      //充值按钮
      rechargeBtn(){
        this.$router.push({
          path:'/refunds',
          query: {
            title:'充值'
          }
        });
      },
      // 查询按钮
      searchBtn() {
        this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
        this.currentPage = 1;
      },
      // 分页按钮
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
      /*------ Api ------*/
      searchApi(value) {
        //获取登录记录
        console.log(value);
        this.tableLoading = true;
        axios
          .get(recharge.select, {
            params: value
          })
          .then(res => {
            console.log("充值记录", res.data);
            if (res.data.state === true) {
              this.tableData = res.data.row; //获取返回数据
              this.TotalRecharge=res.data.money
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
          .get(recharge.select, {
            params: value
          })
          .then(res => {
            console.log("充值管理", res.data);
            if (res.data.state === true) {
              this.tableData = res.data.row; //获取返回数据
              this.total = res.data.total; //总条目数
              this.TotalRecharge=res.data.money
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
      this.searchApi(this.searchTimeForm); // 调用查询接口获取数据
    }
  };
</script>

<style scoped>
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
    margin-right:10px;
  }
  .buttonBox .add .addIcon {
    margin-right: 6px;
  }
  .buttonBox .delete {
    background: rgba(255, 92, 60, 1);
    border-radius: 10px;
    margin-right:10px;
  }
  .buttonBox .delete .deleteIcon {
    margin-right: 6px;
  }
  .buttonBox .blue {
    background: #31D6FF;
    border-radius: 10px;
  }
  .buttonBox .blue .blueIcon {
    margin-right: 6px;
  }
  #Notice {
    background: #ffffff;
  }
  #Notice .searchBox{
    display: flex;
    justify-content: space-between;
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

  /*.el-select-dropdown__item {*/
  /*color: #878787;*/
  /*}*/

  #title {
    display: inline-block;
    padding-left: 10px;
    border-left: 5px solid #1e9eff;
    color: #878787;
  }

  #loginrecord .el-table {
    border: 1px solid #eaeaea;
    /*border-width: 0 1px 1px 1px ;*/
    border-bottom: 0;
  }
</style>
