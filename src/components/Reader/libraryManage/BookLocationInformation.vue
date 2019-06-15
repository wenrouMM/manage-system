<template>
  <div id="Notice">
    <el-container>
      <div class="commonMode" style="width:100%;overflow: auto">
        <div class="sonTitle">
          <span class="titleName">图书位置信息</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <button class="deongaree" @click="groundingBtn(tableChecked)">
              批量上架
            </button>
            <button class="delete" @click="undercarriageBtn(tableChecked)">
              批量下架
            </button>
          </div>
          <div class="right">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="筛选 :">
                <el-select v-model="searchForm.makeMethod" placeholder="搜索方式" clearable style="width: 150px" @change="selectCheck(searchForm.makeMethod)">
                  <el-option label="索取号" value="0"></el-option>
                  <el-option label="馆藏码" value="1"></el-option>
                  <el-option label="isbn" value="2"></el-option>
                  <el-option label="书名" value="3"></el-option>
                  <el-option label="状态" value="4"></el-option>
                </el-select>
                <el-input v-model="searchForm.searchData" clearable placeholder="请输入相关内容" style="width: 250px"></el-input>
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" type="selection" width="100" fixed="left"></el-table-column>
            <el-table-column align="center" prop="index" type="index" width="100" label="序号" fixed="left">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="书名" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="callNumber" label="索取号" width="250" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.callNumber == null || scope.row.callNumber=='' ?'---':scope.row.callNumber}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="code" label="馆藏码" width="350" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="isbn" label="ISBN" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="locationNam" label="图书位置" :show-overflow-tooltip="true" width="200">
              <template slot-scope="scope">
                <span>{{scope.row.locationNam == null || scope.row.locationNam=='' ?'---':scope.row.locationNam}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="author" label="录入员" width="200"></el-table-column>
            <el-table-column align="center" prop="updateTime" label="上架时间" width="200"></el-table-column>
            <el-table-column align="center" prop="fkTypeName" label="类型" width="200"></el-table-column>
            <el-table-column align="center" prop="lendState" label="状态" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.lendState==0">不在架</span>
                <span v-else-if="scope.row.lendState==1">在架</span>
                <span v-else-if="scope.row.lendState==2">借出</span>
                <span v-else-if="scope.row.lendState==3">剔除</span>
                <span v-else="scope.row.lendState==4">损坏</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="lendState" label="操作" width="200" fixed="right">
              <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
              <template slot-scope="scope">
                <span class="ban" @click="deleteBtn(scope.$index, scope.row)" >{{scope.row.lendState==0?'上架':'下架'}}</span>
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
      <!--'调馆','删除','启用','报损'弹框-->
      <div class="forbid collectionDelete">
        <el-dialog :title="Dialogtitle[i]" :visible.sync="centerDialogVisible" width="500px" center>
          <div class="dialogBody">
            是否{{Dialogtitle[i]}}?
          </div>
          <div style="margin-bottom: 30px">
            <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
            <span class="dialogButton cancel" @click="cancelCheck">取消</span>
          </div>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
  import axios from "axios";
  import { bookLocationInfo } from "@request/api/base.js";

  export default {
    data() {
      return {
        /*====== 2.0表单搜索区域 ======*/
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        centerDialogVisible: false, // 删除弹框
        Dialogtitle: ["上架", "下架"],
        i: null, // 切换弹框标题
        searchForm: {
          // 接受搜索表单的数据
          makeMethod:'',
          searchData:"",
        },
        selectSearchForm:{
          searchNumber:'',//索书号
          code:'',//馆藏码
          isbn:'',//isbn
          bookName:'',//书名
          state:'',//状态
        },
        searchData:'',
        /*初始化 */
        tableLoading: true,
        currentPage: 1,
        pageInput: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        iDs:[],
        id:'',
        tableChecked: [], // 全选绑定的数据
      };
    },
    computed: {
      searchTimeForm(){
        let newState=''
        console.log('this.searchData',this.searchData)
        if(this.searchData){
          switch (this.searchData/1) {
            case 0:
              console.log('索书号')
              this.selectSearchForm.searchNumber=this.searchForm.searchData;
              break;
            case 1:
              console.log('馆藏码')
              this.selectSearchForm.code=this.searchForm.searchData;
              break;
            case 2:
              console.log('isbn')
              this.selectSearchForm.isbn=this.searchForm.searchData;
              break;
            case 3:
              console.log('书名')
              this.selectSearchForm.bookName=this.searchForm.searchData;
              break;
            case 4:
              console.log('状态')
              this.selectSearchForm.state=this.searchForm.searchData;
              if(this.selectSearchForm.state=='不在架'){
                newState=0
              }else if(this.selectSearchForm.state=='在架'){
                newState=1
              }else if(this.selectSearchForm.state=='借出'){
                newState=2
              }else if(this.selectSearchForm.state=='剔除'){
                newState=3
              }else if(this.selectSearchForm.state=='损坏'){
                newState=4
              }
              break;
          }
        }else{
          console.log('为空')
          this.selectSearchForm.searchNumber=''
          this.selectSearchForm.code=''
          this.selectSearchForm.isbn=''
          this.selectSearchForm.bookName=''
          newState=''
        }
        let newData={
          callNumber:this.selectSearchForm.searchNumber,
          code:this.selectSearchForm.code,
          isbn:this.selectSearchForm.isbn,
          bookName:this.selectSearchForm.bookName,
          state:newState,
          pageSize: this.pageSize,
          currentPage: 1,
        }
        console.log('搜索数据',newData)
        return newData
      },
    },
    methods: {
      //筛选搜索
      selectCheck(val){
        console.log('val',val)
        this.searchData=val
      },
      //批量选择
      handleSelectionChange(val) {
        console.log('全选按钮之后的数据',val);
        this.tableChecked = val;
      },
      //批量上架
      groundingBtn(){
        if(this.tableChecked.length){
          this.i=0
          this.centerDialogVisible=true
        } else {
          this.$message.error('请先选择上架对象')
        }
      },
      //批量下架
      undercarriageBtn(){
        if(this.tableChecked.length){
          this.i=1
          this.centerDialogVisible=true
        } else {
          this.$message.error('请先选择下架对象')
        }
      },
      //下架按钮
      deleteBtn(index,row){
        console.log('上下架修改',row.id)
        this.id=row.id
        if(row.lendState==0){
          this.i=0
        }else{
          this.i=1
        }
        this.centerDialogVisible=true
      },
      //下架弹框取消按钮
      cancelCheck(){
        this.centerDialogVisible=false
      },
      //下架弹框确定按钮
      submitDialog(){
        console.log('this.tableChecked',this.tableChecked)
        this.iDs.length=0
        if(this.tableChecked.length){
          for(const item of this.tableChecked){
            this.iDs.push(item.id)
          }
        }else{
          this.iDs.push(this.id)
        }

        if(this.i==0){
          this.axios.post(bookLocationInfo.LendState,{
            state:1,
            ids:this.iDs,
          }).then((res)=>{
            if(res.data.state==true){
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.centerDialogVisible=false
              this.searchApi(this.searchTimeForm)
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
        }else{
          this.axios.post(bookLocationInfo.LendState,{
            state:0,
            ids:this.iDs,
          }).then((res)=>{
            if(res.data.state==true){
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.centerDialogVisible=false
              this.searchApi(this.searchTimeForm)
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
        }
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
      //搜索按钮
      searchBtn(){
        this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
        this.currentPage = 1;
      },
      /*------ Api ------*/
      searchApi(value) {
        //获取登录记录
        console.log(value);
        this.tableLoading = true;
        axios
          .get(bookLocationInfo.select, {
            params: value
          })
          .then(res => {
            console.log("图书位置信息", res.data);
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
            console.log(error);
          });
      },
      paginationApi(value) {
        //获取登录记录
        console.log(value);
        this.tableLoading = true;
        axios
          .get(bookLocationInfo.select, {
            params: value
          })
          .then(res => {
            console.log("图书位置信息", res.data);
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
  .ban {
    color: #ff5c3c;
    cursor: pointer;
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
  .buttonBox .deongaree {
    background: #4D94FF;
    border-radius: 10px;
    margin-right: 10px;
  }
  #Notice {
    background: #ffffff;
  }
  #Notice .searchBox{
    display: flex;
    justify-content: space-between;
  }
  .button_s {
    width: 90px;
    font-size: 16px;
    text-align: center;
  }
  #loginrecord .el-table {
    border: 1px solid #eaeaea;
    /*border-width: 0 1px 1px 1px ;*/
    border-bottom: 0;
  }
</style>
