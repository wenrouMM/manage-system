<template>
  <div id="Notice">
    <el-container>
      <div class="commonMode" style="width:100%;overflow: auto">
        <div class="sonTitle">
          <span class="titleName">荐购审核</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox"></div>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="筛选 :">
              <el-select
                style="width: 150px"
                v-model="searchForm.makeMethod"
                placeholder="请选择"
                clearable
                @change="selectCheck(searchForm.makeMethod)"
              >
                <el-option label="读者名字" value="0"></el-option>
                <el-option label="书籍名称" value="1"></el-option>
                <el-option label="编著者" value="2"></el-option>
                <el-option label="ISBN" value="3"></el-option>
              </el-select>
              <el-input v-model="searchForm.searchData" placeholder="请输入相关信息" clearable style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
            </el-form-item>
          </el-form>
        </section>
        <!-- 3.0表格数据 -->
        <section class="tableBox"  v-loading="tableLoading">
          <el-table
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px',borderRight:'none'}"
            empty-text="无数据"
            style="width: 100%; text-align:center;"
            :data="tableData"
            :row-style="{height:'60px'}"
          >
            <el-table-column align="center" prop="index" type="index" width="150" label="序号" fixed="left">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="fkReaderName" label="读者名字" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkReaderName" label="读者卡号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="bookName" label="书籍名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="author" label="编著者" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="isbn" label="ISBN" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.isbn == null || scope.row.isbn=='' ?'---':scope.row.isbn}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" fixed="right">
              <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
              <template slot-scope="scope">
                <span class="edit" @click="EditBtn(scope.$index, scope.row)">审核</span>
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
      <div class="forbid collectionDelete">
        <el-dialog title="审核" :visible.sync="centerDialogVisible" width="600px" center>
          <div class="flexLayout forbidFont">
            <div>
              <p>书名：{{recommendData.bookName}}</p>
              <p>作者：{{recommendData.author}}</p>
              <p>价格：{{recommendData.price}}</p>
            </div>
            <div>
              <p>文献类型：{{recommendData.literatureType}}</p>
              <p>出版时间：{{recommendData.publishingTime}}</p>
              <p>文献类型：{{recommendData.literatureType}}</p>
            </div>
            <div>
              <p>ISBN：{{recommendData.isbn}}</p>
              <p>类型名：{{recommendData.typeName}}</p>
              <p>出版社：{{recommendData.pressName}}</p>
            </div>
          </div>
          <div style="width: 100%;margin-bottom: 20px">
            <p style="margin-top: 10px;margin-bottom: 10px;color: #878787">审核意见：</p>
            <el-input type="textarea" v-model="examine" resize="none" :rows="5"></el-input>
          </div>
          <div>
            <span class="dialogButton true mr_40" @click="submitDialog('1')">同 意</span>
            <span class="dialogButton cancel" style="background: #FF8A00" @click="cencalBtn('2')">驳 回</span>
          </div>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
  import axios from "axios";
  import { catalog,deriveInt,uploadInt,recommPurchase } from "@request/api/base.js";
  import moment from "moment";
  export default {
    data() {
      return {
        /*初始化 */
        centerDialogVisible:false,
        options: [],
        tableLoading: true,
        total: 0,
        pageSize: 10,
        pageInput: 1,
        currentPage: 1,
        tableData: [],
        searchForm: {
          // 接受搜索表单的数据
          makeMethod: "",
          searchData: "",
        },
        searchData: "",
        selectSearchForm: {
          bookName: "", //书名
          isbn: "", //isbn
          author: "",//作者
          readerName: ""//读者名字
        },
        examine:"",//审核意见
        recommendData:{},//审核发送的数据
      };
    },
    computed: {
      searchTimeForm(){
        if (this.searchData) {
          switch (this.searchData / 1) {
            case 0:
              this.selectSearchForm.readerName = this.searchForm.searchData;
              break;
            case 1:
              this.selectSearchForm.bookName = this.searchForm.searchData;
              break;
            case 2:
              this.selectSearchForm.author = this.searchForm.searchData;
              break;
            case 3:
              this.selectSearchForm.isbn = this.searchForm.searchData;
              break;
          }
        } else {
          this.selectSearchForm.readerName=""
          this.selectSearchForm.bookName = "";
          this.selectSearchForm.author = "";
          this.selectSearchForm.isbn = ""
        }
        let newData={
          readerName:this.selectSearchForm.readerName,
          bookName:this.selectSearchForm.bookName,
          author:this.selectSearchForm.author,
          isbn:this.selectSearchForm.isbn,
          pageSize: this.pageSize,
          currentPage: 1,
        }
        return newData
      },
    },
    methods: {
      selectCheck(val){
        this.searchForm.searchData=""
        for(const index in this.selectSearchForm){
          this.selectSearchForm[index]=""
        }
        this.searchData = val;
      },
      //审核
      EditBtn(index,row){
        console.log('审核时的图书数据',row)
        this.recommendData=row;
        this.centerDialogVisible=true;
      },
      submitDialog(val){
        console.log('荐购状态',val)
        let ids=[]
        ids.push(this.recommendData.id)
        this.axios.post(recommPurchase.check,{
          readerName:this.recommendData.fkReaderName,
          bookName:this.recommendData.bookName,
          author:this.recommendData.author,
          isbn:this.recommendData.isbn,
          examine:this.examine,
          state:parseInt(val),
          ids:ids
        }).then((res)=>{
          console.log('审核后返回的数据',res)
          if(res.data.state==true){
            this.$message.success(res.data.msg);
            this.examine="";
            this.searchApi(this.searchTimeForm)
            this.centerDialogVisible=false
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
      cencalBtn(val){
        let ids=[]
        ids.push(this.recommendData.id)
        this.axios.post(recommPurchase.check,{
          readerName:this.recommendData.fkReaderName,
          bookName:this.recommendData.bookName,
          author:this.recommendData.author,
          isbn:this.recommendData.isbn,
          examine:this.examine,
          state:parseInt(val),
          ids:ids
        }).then((res)=>{
          console.log('审核后返回的数据',res)
          if(res.data.state==true){
            this.$message.success(res.data.msg);
            this.examine="";
            this.searchApi(this.searchTimeForm)
            this.centerDialogVisible=false
          }else{
            this.$message.error(res.data.msg)
          }
        })
      },
      // 查询按钮
      searchBtn() {
        this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
        this.currentPage = 1;
      },
      // 分页按钮
      jumpBtn() {
        // v-mode绑定好像会默认转数据类型
        let page = Math.ceil(this.total / this.pageSize)
        page ==0?1:page;
        if(this.pageInput>page || this.pageInput == ''|| this.pageInput<0){
          this.pageInput = 1
          this.$nextTick(()=>{
            this.$refs.text.value = 1 // hack方法
          })
        }else{
          this.pageInput = parseInt(this.pageInput)
          this.$refs.text.value = parseInt(this.pageInput)
          let num = parseInt(this.pageInput)
          this.current_change(num)
        }
      },
      searchApi(value) {
        //获取登录记录
        this.tableLoading = true;
        axios
          .get(recommPurchase.select, {
            params: value
          })
          .then(res => {
            if (res.data.state === true) {
              console.log('荐购审核返回的数据',res)
              if(res.data.row){
                this.tableData = res.data.row;
              } else{
                this.tableData = []
              }
              //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
              this.currentPage = 1; // 回到第一页显示
              this.tableLoading = false;
            } else {
              this.tableLoading = false;
            }
          })
          .catch(error => {
            this.$message.error(res.data.msg)
          });
      },
      paginationApi(value) {
        //获取登录记录
        this.tableLoading = true;
        axios
          .get(recommPurchase.select, {
            params: value
          })
          .then(res => {
            if (res.data.state === true) {
              console.log('荐购审核返回的数据',res)
              this.tableData = res.data.row; //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
              this.tableLoading = false;
            } else {
              this.tableLoading = false;
            }
          })
          .catch(error => {
            this.$message.error(res.data.msg)
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
  .searchButton{
    cursor: default;
    background-color: #0096FF;
    height:38px ;
    width: 70px;
    border-radius: 3px;
    position: absolute;
    left: 460px;
    top: 1px;
  }
  .searchButton:hover{
    background-color: rgba(0,150,255,0.8);
  }
  .edit {
    color: #00d7f0;
    cursor: pointer;
    margin-right: 20px;
    margin-left: 20px;
  }
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
    margin-left: 10px;
  }
  .buttonBox .blue .blueIcon {
    margin-right: 6px;
  }
  .buttonBox .green {
    background: #01EECA;
    border-radius: 10px;
    margin-left: 10px;
  }
  .buttonBox .green .greenIcon {
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
  .commonMode .searchBox  .el-input .el-input__inner {
    text-align: left;
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
  .blue{
    color: #4d94ff;
    cursor: pointer;
  }
  #title {
    display: inline-block;
    padding-left: 10px;
    border-left: 5px solid #1e9eff;
    color: #878787;
  }
  #bookInfo .el-table th{
    background-color: #0096FF;
  }
  #loginrecord .el-table {
    border: 1px solid #eaeaea;
    /*border-width: 0 1px 1px 1px ;*/
    border-bottom: 0;
  }
  #isbnSearch{
    width: 25px;
    width:25px;
    margin-left:25px;
    margin-top: 7px
  }
  #typeMessage{
    display: none;
    position: absolute;
    top: 100px;
    z-index: 30000;
    border-radius: 20px;
    filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
    -moz-box-shadow: 2px 2px 10px #909090;
    -webkit-box-shadow: 2px 2px 10px #909090;
    box-shadow:5px 5px 30px #909090;
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
    height:500px ;
    width: 370px;
    background-color: white;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    padding-left: 30px;
    padding-bottom: 30px;
  }
  .forbidFont{
    width: 100%;;
  }
  .forbidFont p{
    margin-bottom: 20px;
    color: #878787;
  }
</style>
