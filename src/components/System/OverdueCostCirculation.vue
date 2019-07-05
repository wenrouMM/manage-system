<template>
  <div id="Notice">
    <el-container>
      <div class="commonMode" style="width:100%">
        <div class="sonTitle">
          <span class="titleName">逾期费用记录</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <el-select v-model="outputSelect" placeholder="请选择导出方式" style="width: 200px">
                  <el-option label="导出当前页" value="0"></el-option>
                  <el-option label="导出全部" value="1"></el-option>
              </el-select>
             <el-button icon="el-icon-share" type="primary" class="blue" :loading="downloadLoading"  @click="deriveBtn">
              导出
            </el-button>
          </div>
          <div class="right">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="用户名:">
                <el-input v-model="searchForm.userName" style="width: 200px" clearable placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="创建时间:" size="130">
                <el-date-picker
                  v-model="searchForm.beginTime"
                  type="date"
                  placeholder="开始日期"
                  style="width: 200px"
                  :picker-options="pickerOptions0"
                ></el-date-picker>
                <el-date-picker
                  v-model="searchForm.endTime"
                  type="date"
                  placeholder="结束日期"
                  style="width: 200px"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
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
            <el-table-column align="center" prop="index" type="index" width="100" label="序号">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fkCardNumber" label="读者卡号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkReaderName" label="用户名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="overdueExpenses" label="逾期金额" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.overdueExpenses}}元</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="creatTime" label="处理日期" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkHandleModeName" label="操作用户" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="serialNumber" label="流水编号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="remarks" label="备注" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.remarks == null || scope.row.remarks=='' ?'---':scope.row.remarks}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 100%;height: 50px;background-color: #0096FF;line-height: 50px;color: white">&nbsp;&nbsp;&nbsp;费用合计&nbsp;:&nbsp;{{depositSum}}</div>
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
       <a v-show="false" href="" download="" ref="excel" id="excel" >
        下载
      </a>
      <!--'调馆','删除','启用','报损'弹框-->
      <div class="forbid">
        <el-dialog :title="Dialogtitle[i]" :visible.sync="centerDialogVisible" width="500px" center>
          <div class="dialogBody">
            是否{{Dialogtitle[i]}}?
          </div>
          <div slot="footer">
            <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
            <span class="dialogButton cancel" @click="centerDialogVisible = false">取消</span>
          </div>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
  import axios from "axios";
  import moment from "moment";
  import { overdueCostCirculation,outputExcelInt,uploadInt } from "../../request/api/base.js";

  export default {
    data() {
      return {
        /*====== 2.0表单搜索区域 ======*/
        outputSelect:'0',
        downloadLoading:false,
        paginationForm:{},
        depositSum:'',//押金合计
        centerDialogVisible: false, // 删除弹框
        Dialogtitle: ['导出'],
        i: null, // 切换弹框标题
        searchForm: {
          // 接受搜索表单的数据
          beginTime:'',
          endTime:'',
          userName:"",
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
        id:'',
      };
    },
    computed: {
      searchTimeForm(){
        let newData={
          name:this.searchForm.userName,
          beginTime:
            !this.searchForm.beginTime
              ? null
              : moment(this.searchForm.beginTime).format("YYYY-MM-DD"), //开始时间
          endTime:
            !this.searchForm.endTime
              ? null
              : moment(this.searchForm.endTime).format("YYYY-MM-DD"), //结束时间
          pageSize: this.pageSize,
          currentPage: 1,
        }
        console.log('搜索数据',newData)
        return newData
      },
      outputTimeForm(){
        let pbk = {
          exportState:this.outputSelect,
          pageSize:10,
          currentPage:this.currentPage
        }
        let obj =Object.assign({},pbk, this.paginationForm);

        return obj
      }
    },
    methods: {
      //导出按钮
      deriveBtn(){
        this.downloadLoading = true
        axios({
          url:outputExcelInt.overdue,
          data:this.outputTimeForm,
          method:'post'
        }).then((res)=>{
          if(res.data.state == true){

            var excelName = res.data.row.name
            var excelUrl = uploadInt.showFile + '/' + res.data.row.value + '?fileName=' + res.data.row.name
           const a = document.getElementById('excel')

           a.setAttribute("href",excelUrl)
           a.setAttribute("download",excelName)
           a.click()
            this.downloadLoading = false
          }else{
            this.$message.error(res.data.msg)
            this.downloadLoading = false
          }
          console.log('测试下载',res)
        })
      },
      //导出弹窗的确定按钮
      submitDialog(){

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
          .get(overdueCostCirculation, {
            params: value
          })
          .then(res => {
            console.log("逾期记录", res.data);
            if (res.data.state === true) {
              this.tableData = res.data.row; //获取返回数据
              this.depositSum=res.data.money
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
          .get(overdueCostCirculation, {
            params: value
          })
          .then(res => {
            console.log("逾期记录", res.data);
            if (res.data.state === true) {
              this.tableData = res.data.row; //获取返回数据
              this.depositSum=res.data.money
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
              this.tableLoading = false;
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
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
  .searchButton{
    cursor: default;
    background-color: #0096FF;
    height:39px ;
    width: 60px;
    border-radius: 3px;
    position: absolute;
    left: 910px;
  }
  .searchButton:hover{
    background-color: rgba(0,150,255,0.8);
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
  .green{
    color: #01D793;
    cursor: pointer;
    margin-right: 20px;
  }
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
  .buttonBox .green {
    background: #01EECA;
    border-radius: 10px;
    margin-left: 10px;
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
  .gray_radio_border{
    border: 1px solid #DCDCDC;
    width:100%;
    border-radius: 5px;
    padding:10px 20px
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
  #isbnSearch{
    width: 25px;
    width:25px;
    margin-left: 18px;
    margin-top: 7px
  }
</style>
