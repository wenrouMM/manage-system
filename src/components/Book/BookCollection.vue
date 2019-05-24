<template>
  <div id="Notice">
    <el-container>
      <div class="commonMode" style="width:100%">
        <div class="sonTitle">
          <span class="titleName">书籍典藏</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <button class="add" @click="rechargeBtn">
              <i class="addIcon el-icon-plus"></i>新增
            </button>
            <button class="delete" @click="drawbackBtn(tableChecked)">
              <i class="deleteIcon el-icon-delete"></i>删除
            </button>
            <button class="blue" @click="deriveBtn">
              <i class="blueIcon el-icon-share"></i>导出
            </button>
            <button class="deongaree" @click="rejectBtn">
              <i class="blueIcon el-icon-delete"></i>剔除
            </button>
            <button class="green" @click="tunnellingBtn">
              <i class="el-icon-edit"></i>调馆
            </button>
          </div>
          <div class="right">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="筛选 :">
                <el-select v-model="searchForm.makeMethod" placeholder="搜索方式" clearable style="width: 150px" @change="selectCheck(searchForm.makeMethod)">
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
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" prop="index" type="index" width="100" label="序号">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="searchNumber" label="索书号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="code" label="馆藏码" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="isbn" label="ISBN" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="name" label="书名" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="lendingPermission" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.lendingPermission ==1?'不外借':'可外借'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
              <template slot-scope="scope">
                <span class="green" @click="makeBtn(scope.$index, scope.row)">启用</span>
                <span class="edit" @click="EditBtn(scope.$index, scope.row)">修改</span>
                <span class="ban" @click="deleteBtn(scope.$index, scope.row)">报损</span>
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
      <!-- 新增弹框 -->
      <div class="addEditDialog">
        <!-- Form -->
        <el-dialog @close="closeForm" width="1000px" :title="Dialogtitle[i]" :visible.sync="dialogFormVisible">
          <el-form id="Book_collection" v-if="i==0||i==1" :rules="rules" :model="addForm" :ref="addForm" style="display: flex;flex-direction: column">
            <div class="flexLayout">
              <el-form-item label=" I S B N :" prop="isbn" label-width="80px">
                <el-input v-model="addForm.isbn" style="position: relative" id="isbnInput"></el-input>
              </el-form-item>
              <p class="searchButton" @click="isbnData">
                <img src="../../base/img/currency/ssbs.png" id="isbnSearch">
              </p>
            </div>
            <div id="haveBottomBorder">
              <div id="inputDiv1">
                <el-form-item label=" 正题名 :" prop="titleProper" label-width="80px" style="">
                  <div class="flexLayout">
                    <el-input v-model="addForm.name"></el-input>
                    <el-checkbox v-model="addForm.bulkBook">散装书</el-checkbox>
                  </div>
                </el-form-item>
              </div>
              <div class="flexLayout" id="inputDiv2">
                <el-form-item label=" 副题名 :" prop="subtitle" label-width="80px" style="">
                  <el-input v-model="addForm.viceName"></el-input>
                </el-form-item>
                <el-form-item label=" 丛编题名 :" prop="cluster" label-width="100px" style="">
                  <el-input v-model="addForm.clusterName "></el-input>
                </el-form-item>
              </div>
              <div class="flexLayout" id="inputDiv3">
                <el-form-item label=" 分类号 :" prop="classificationCode" label-width="80px" style="">
                  <el-input v-model="addForm.searchNumber"></el-input>
                </el-form-item>
                <el-form-item label=" 版　　次 :" prop="edition" label-width="95px" style="">
                  <el-input v-model="addForm.edition"></el-input>
                </el-form-item>
                <el-form-item label=" 卷册号 :" prop="volumeNumber" label-width="80px" style="">
                  <el-input v-model="addForm.volumeNumber"></el-input>
                </el-form-item>
              </div>
              <div class="flexLayout" id="inputDiv4">
                <el-form-item label=" 编著者 :" prop="contributors" label-width="80px" style="">
                  <el-input v-model="addForm.author"></el-input>
                </el-form-item>
                <el-form-item label=" 装订版面 :" prop="bindingLayout" label-width="100px" style="">
                  <el-input v-model="addForm.layout "></el-input>
                </el-form-item>
              </div>
              <div class="flexLayout" id="inputDiv5">
                <el-form-item label=" 出 版 社 :" prop="publishHouse" label-width="90px" style="">
                  <el-input v-model="addForm.fkPressName"></el-input>
                </el-form-item>
                <el-form-item label=" 出版时间 :" prop="comeoutTime" label-width="100px" style="">
                  <el-input v-model="addForm.publishingTime"></el-input>
                </el-form-item>
                <el-form-item label=" 附　　件 :" prop="appendix" label-width="100px" style="">
                  <el-input v-model="addForm.appendix"></el-input>
                </el-form-item>
              </div>
              <div class="flexLayout" id="inputDiv6" style="margin-bottom: 20px">
                <el-form-item label=" 页　　码 :" prop="pageNumber" label-width="95px" style="">
                  <el-input v-model="addForm.pageNumber"></el-input>
                </el-form-item>
                <el-form-item label=" 开　　本 :" prop="format" label-width="95px" style="">
                  <el-input v-model="addForm.openBook"></el-input>
                </el-form-item>
                <el-form-item label=" 价　　格 :" prop="price" label-width="95px" style="">
                  <el-input v-model="addForm.price"></el-input>
                </el-form-item>
              </div>
            </div>
            <div id="formDiv">
              <div class="flexLayout" style="margin-top: 10px">
                <el-form-item label=" 条码号 :" prop="code" label-width="80px" style="">
                  <el-input v-model="addForm.code"></el-input>
                </el-form-item>
                <el-form-item label=" 索书号 :" prop="searchNumber" label-width="95px" style="">
                  <el-input v-model="addForm.searchNumber"></el-input>
                </el-form-item>
                <el-form-item label=" 馆藏地 :" prop="place" label-width="80px" style="">
                  <el-input v-model="addForm.place"></el-input>
                </el-form-item>
              </div>
              <div style="margin-left: 150px">
                <el-checkbox v-model="addForm.dailyRent">默认日租金</el-checkbox>
                <el-checkbox v-model="addForm.lendingPermission" style="margin-left: 150px">不外借</el-checkbox>
                <el-checkbox v-model="addForm.available" style="margin-left: 150px">启用</el-checkbox>
              </div>
            </div>
            <!-- 弹框表单按钮  验证失效-->
            <el-form-item style="margin:30px auto 0px">
              <el-button type="primary" @click="submitForm()" >确定</el-button>
              <el-button type="info" @click="resetForm()" >取消</el-button>
            </el-form-item>
          </el-form>
          <el-form  v-if="i==5" id="harm" :rules="rules" :model="harmForm" :ref="harmForm">
            <div class="gray_radio_border" id="harm_noneTopBorder">
              <div class="flexLayout">
                <el-form-item label=" 编　　号 :" prop="Number" label-width="95px" style="">
                  <el-input v-model="harmForm.Number"></el-input>
                </el-form-item>
                <el-form-item label=" 索 取 号 :" prop="bookIndex" label-width="95px" style="">
                  <el-input v-model="harmForm.bookIndex "></el-input>
                </el-form-item>
                <el-form-item label=" 馆 藏 地 :" prop="libAdress" label-width="95px" style="">
                  <el-input v-model="harmForm.libAdress "></el-input>
                </el-form-item>
              </div>
              <div class="flexLayout">
                <el-form-item label=" I S B N :" prop="Number" label-width="85px" style="">
                  <el-input v-model="harmForm.isbn"></el-input>
                </el-form-item>
                <el-form-item label=" 正 题 名 :" prop="bookIndex" label-width="95px" class="harmInput1">
                  <el-input v-model="harmForm.bookName " style="width: 500px"></el-input>
                </el-form-item>
              </div>
              <div class="flexLayout">
                <el-form-item label=" 价　　格 :" prop="price" label-width="95px" style="">
                  <el-input v-model="harmForm.price"></el-input>
                </el-form-item>
                <el-form-item label=" 页　　码 :" prop="pageNumber" label-width="95px" style="">
                  <el-input v-model="harmForm.pageNumber "></el-input>
                </el-form-item>
                <el-form-item label=" 出版时间 :" prop="putTime" label-width="95px" style="">
                  <el-input v-model="harmForm.putTime "></el-input>
                </el-form-item>
              </div>
            </div>
            <div style="margin-top: 20px;padding: 0px 20px" id="selectInput">
              <div class="flexLayout">
                <el-form-item label=" 损坏原因 :" style="width: 400px" prop="causesDamage" class="errTitle">
                  <el-select v-model="harmForm.causesDamage" clearable  @change="selectCheck(searchForm.makeMethod)">
                    <el-option label="索书号" value="0"></el-option>
                    <el-option label="馆藏码" value="1"></el-option>
                    <el-option label="ISBN" value="2"></el-option>
                    <el-option label="书名" value="3"></el-option>
                    <el-option label="状态" value="4"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label=" 赔偿金额 :" prop="amountCompensation" label-width="95px" style="margin-left: 100px">
                  <el-input v-model="harmForm.amountCompensation "></el-input>
                </el-form-item>
              </div>
              <div id="remarks">
                <el-form-item label=" 备　　注 :" prop="remarks" style="width: 900px;" class="errTitle">
                  <el-input type="textarea" v-model="harmForm.remarks" style="width: 809px;" resize="none"></el-input>
                </el-form-item>
              </div>
              <div style="width: 400px;margin:30px auto">
                <el-button type="primary" @click="definiteCheck">确定</el-button>
                <el-button type="info" style="margin-left: 55px" @click="cancelCheck">取消</el-button>
              </div>
            </div>
          </el-form>
        </el-dialog>
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
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        centerDialogVisible: false, // 删除弹框
        Dialogtitle: ["修改", "新增",'调馆','删除','启用','报损','导出','剔除'],
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
              time.getTime() < this.searchForm.startTime ||
              time.getTime() > Date.now()
            );
          }
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
      addFormData(){
        let newData={
          fkCataBookId:this.addForm.id,
          code:this.addForm.barcode,
          callNumber:this.addForm.searchNumber,
          place:this.addForm.place,
          code:this.addForm.code,
          dailyRent:this.addForm.dailyRent==true?1:0,
          lendingPermission:this.addForm.lendingPermission==true?1:0,
          available:this.addForm.available==true?1:0,
          pageSize: this.pageSize,
          currentPage: 1,
        }
        return newData
      },
      editFormData(){
        let newData={
          id:this.addForm.id,
          code:this.addForm.code,
          callNumber:this.addForm.searchNumber,
          place:this.addForm.place,
          dailyRent:this.addForm.dailyRent==true?1:0,
          lendingPermission:this.addForm.lendingPermission==true?1:0,
          pageSize: this.pageSize,
          currentPage: 1,
        }
        console.log('newData',newData)
        return newData
      }
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
      //剔除按钮
      rejectBtn(){
        if(this.tableChecked.length){
          this.i=7
          this.centerDialogVisible=true
        } else {
          this.$message.error('请先选择剔除对象')
        }
      },
      //导出按钮
      deriveBtn(){
        this.i=6
        this.centerDialogVisible=true
      },
      //删除按钮
      drawbackBtn(){
        if(this.tableChecked.length){
          this.i=3
          this.centerDialogVisible=true
        } else {
          this.$message.error('请先选择删除对象')
        }
      },
      //新增按钮
      rechargeBtn(){
        this.i=1
        this.dialogFormVisible=true
      },
      //添加isbn数据搜索
      isbnData(){
        this.axios.get(collection.isbn,{params:{isbn:this.addForm.isbn}}).then((res)=>{
          console.log('isbn的数据',res)
          if(res.data.state==true){
            this.addForm=res.data.row[0]
          }else{
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      },
      //修改弹框
      EditBtn(index,row){
        this.i=0
        console.log(row)
        console.log('row',row)
        this.addForm=row
        this.addForm.available=row.available==1?true:false
        this.addForm.lendingPermission=row.lendingPermission==1?true:false
        this.addForm.dailyRent=row.dailyRent==1?true:false
        this.dialogFormVisible = true;
      },
      // 修改添加弹框确定按钮
      submitForm() {
        console.log('defaultDateRent',this.addForm.defaultDateRent,'norForLoan',this.addForm.norForLoan)
        if(this.i==1){
          this.addApi(this.addFormData)
        }else if(this.i==0){
          this.editApi(this.editFormData)
        }
      },
      addApi(value){

        this.axios.post(collection.add,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.closeForm()
            this.searchApi(this.searchTimeForm);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      },
      editApi(value){
        this.axios.post(collection.edit,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.closeForm()
            this.searchApi(this.searchTimeForm);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      },
      //添加修改弹框取消按钮
      resetForm() {
        this.closeForm()
      },
      //添加修改关闭按钮
      closeForm() { // 弹框关闭的时候执行 清空数据
        if(this.i==4){
          this.$refs[this.selectSearchForm].resetFields(); // 调用这个方法进行清除登陆状态 打开的时候再清理？
          for (var i in this.selectSearchForm) {
            this.selectSearchForm[i] = "";
          }
        }else{
          this.$refs[this.addForm].resetFields(); // 调用这个方法进行清除登陆状态 打开的时候再清理？
          for (var i in this.addForm) {
            this.addForm[i] = "";
          }
        }

        this.dialogFormVisible = false
        this.searchApi(this.searchTimeForm)
      },
      // 查询按钮
      searchBtn() {
        this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
        this.currentPage = 1;
      },
      //报损弹框
      deleteBtn(index,row){
        this.i=5
        this.addForm.id=row.id
        this.dialogFormVisible=true
      },
      //报损弹框确定按钮
      definiteCheck(){

      },
      //报损弹框取消按钮
      cancelCheck(){
        this.closeForm()
      },
      //调馆按钮
      tunnellingBtn(){
        this.i=2
        this.centerDialogVisible=true
      },
      //启用按钮
      makeBtn(index,row){
        this.i=4
        this.addForm.id=row.id
        this.centerDialogVisible=true
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
