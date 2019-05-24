<template>
  <div id="Notice">
    <el-container>
      <div class="commonMode" style="width:100%">
        <div class="sonTitle">
          <span class="titleName">逾期费用</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <button class="blue" @click="deriveBtn">
              <i class="blueIcon el-icon-share"></i>导出
            </button>
          </div>
          <div class="right">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="筛选 :">
                <el-select v-model="searchForm.makeMethod" placeholder="处理方式" clearable style="width: 150px" @change="selectCheck(searchForm.makeMethod)">
                  <el-option label="索书号" value="0"></el-option>
                  <el-option label="馆藏码" value="1"></el-option>
                  <el-option label="ISBN" value="2"></el-option>
                  <el-option label="书名" value="3"></el-option>
                  <el-option label="状态" value="4"></el-option>
                </el-select>
                <el-input v-model="searchForm.searchData" style="width: 200px"></el-input>
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
            <el-table-column align="center" prop="searchNumber" label="处理方式" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="code" label="读者卡号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="isbn" label="用户名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="name" label="逾期金额" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="name" label="处理日期" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="name" label="操作用户" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="name" label="流水编号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="name" label="备注" :show-overflow-tooltip="true"></el-table-column>
          </el-table>
          <div style="width: 100%;height: 50px;background-color: #0096FF;line-height: 50px;color: white">&nbsp;&nbsp;&nbsp;押金合计&nbsp;:&nbsp;{{depositSum}}</div>
          <div style="width: 100%;height: 50px;line-height: 50px;color: #0096FF">&nbsp;&nbsp;&nbsp;总共合计&nbsp;:&nbsp;{{depositSum}}</div>
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
  import { collection } from "../../request/api/base.js";

  export default {
    data() {
      return {
        /*====== 2.0表单搜索区域 ======*/
        addForm:{
          id:'',
          isbn:'',
          code:'',//条码
          searchNumber:'',//索书号
          place:'',//藏馆地
          dailyRent:'',//默认日租金
          lendingPermission:'',//不外借
          available:'',//启用
          titleProper:'', //正题名
          bulkBook:'', //套装书
          subtitle:'', //副题名
          cluster:'', //丛编题名
          classificationCode:'',//分类号
          edition:'',//版次
          volumeNumber:'',//卷册号
          contributors:'',//编著者
          bindingLayout:'',//装订版面
          publishHouse:'',//出版社
          comeoutTime:'',//出版时间
          appendix:'',//附件
          pageNumber:'',//页码
          format:'',//开本
          price:'',//价格
        },
        rules:{
          isbn:[{ required: true, message: "请输入ISBN查询相应书籍信息", trigger: "blur" }],
          titleProper:[{ required: true}],
          subtitle:[{ required: true}],
          cluster:[{ required: true}],
          classificationCode:[{ required: true}],
          edition:[{ required: true}],
          volumeNumber:[{ required: true}],
          contributors:[{ required: true}],
          bindingLayout:[{ required: true}],
          publishHouse:[{ required: true}],
          comeoutTime:[{ required: true}],
          appendix:[{ required: true}],
          pageNumber:[{ required: true,message: "请输入页码", trigger: "blur" }],
          format:[{ required: true}],
          price:[{ required: true,message: "请输入价格", trigger: "blur" }],
          code:[{ required: true,message: "请输入条码号", trigger: "blur" }],
          searchNumber:[{ required: true,message: "请输入索书号", trigger: "blur" }],
          place:[{ required: true,message: "请输入馆藏地", trigger: "blur" }],
          Number:[{ required: true,message: "请输入编号", trigger: "blur" }],
          bookIndex:[{ required: true,message: "请输入索取号", trigger: "blur" }],
          libAdress:[{ required: true,message: "请输入馆藏地", trigger: "blur" }],
          putTime:[{ required: true,message: "请输入出版时间", trigger: "blur" }],
          causesDamage:[{ required: true,message: "请选择损坏原因", trigger: "change" }],
          amountCompensation:[{ required: true,message: "请输入赔偿金额", trigger: "blur" }],
          remarks:[{ required: true,message: "请输入备注", trigger: "blur" }],
        },
        harmForm:{
          Number:'',//编号
          bookIndex:'',//索取号
          libAdress:'',//馆藏地
          isbn:'',//isbn
          bookName:'',//正题名
          price:'',//价格
          pageNumber:'',//页码
          putTime:'',//出版时间
          causesDamage:'',//损坏原因
          amountCompensation:'',//赔偿金额
          remarks:''//备注
        },
        depositSum:'',//押金合计
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        centerDialogVisible: false, // 删除弹框
        Dialogtitle: ["修改", "新增",'调馆','删除','启用','报损','导出'],
        i: null, // 切换弹框标题
        searchForm: {
          // 接受搜索表单的数据
          makeMethod:'',
          searchData:"",
          currentPage: 0
        },
        selectSearchForm:{
          searchNumber:'',//索书号
          code:'',//馆藏码
          isbn:'',//isbn
          bookName:'',//书名
          state:'',//状态
          currentPage: 0
        },
        searchData:'',
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
        tableChecked: [], // 全选绑定的数据
      };
    },
    computed: {
      searchTimeForm(){
        let newState=''
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
            if(this.selectSearchForm.state=='不外借'){
              newState=1
            }else if(this.selectSearchForm.state=='可外借'){
              newState=0
            }else{
              newState=''
            }
            break;
        }
        let newData={
          searchNumber:this.selectSearchForm.searchNumber,
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
      //导出按钮
      deriveBtn(){
        this.i=6
        this.centerDialogVisible=true
      },
      // 查询按钮
      searchBtn() {
        this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
        this.currentPage = 1;
      },
      submitDialog(){
        let idData=[]
        for (var item of this.tableChecked) {
          console.log('删除id',item.id);
          idData.push({id:item.id})
        }
        if(this.i==4){
          this.axios.post(collection.state,{id:this.addForm.id,available:1}).then((res)=>{
            if (res.data.state == true) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.centerDialogVisible=false
              this.searchApi(this.searchTimeForm);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
        }else if(this.i==3){
          console.log('idData',idData)
          this.axios.post(collection.delete,idData).then((res)=>{
            if (res.data.state == true){
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.centerDialogVisible=false
              this.searchApi(this.searchTimeForm);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
        }else if(this.i==5){
          //报损
        }else if(this.i==2){
          console.log('idData',idData)
          this.axios.post(collection.letLeave,idData).then((res)=>{
            if (res.data.state == true){
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.centerDialogVisible=false
              this.searchApi(this.searchTimeForm);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          })
        }
      },
      // 分页按钮
      jumpBtn() {
        // v-mode绑定好像会默认转数据类型
        let page = Math.ceil(this.total / this.pageSize);
        page == 0 ? 1 : page;
        if (this.pageInput > page) {
          this.pageInput = 1;
          this.$nextTick(() => {
            this.$refs.text.value = 1; // hack方法
            console.log("Vmode绑定值", this.pageInput);
          });
        } else {
          let num = parseInt(this.pageInput);
          this.current_change(num);
        }
      },
      /*------ Api ------*/
      searchApi(value) {
        //获取登录记录
        console.log(value);
        this.tableLoading = true;
        axios
          .get(collection.select, {
            params: value
          })
          .then(res => {
            console.log("书籍典藏", res.data);
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
      current_change(currentPage) {
        //分页查询
        this.currentPage = currentPage; //点击第几页
        this.paginationForm.currentPage = currentPage;
        console.log("保存当前查询", this.paginationForm, this.currentPage);
        this.searchApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
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
