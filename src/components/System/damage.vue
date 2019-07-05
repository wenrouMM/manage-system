<template>
  <div id="Notice">
    <el-container>
      <div class="commonMode" style="width:100%">
        <div class="sonTitle">
          <span class="titleName">损坏管理</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <button class="add" @click="addBtn">
              <i class="addIcon el-icon-plus"></i>添加
            </button>
          </div>
          <div class="right">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="损坏方式 :">
                <el-input clearable v-model="searchForm.damageMothod" placeholder="请输入损坏方式" style="width: 200px"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
        </section>
        <!-- 3.0表格数据 -->
        <section class="tablebox" v-loading="tableLoading">
          <el-table
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px',borderRight:'none'}"
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

            <el-table-column align="center" prop="damageName" label="损坏方式"></el-table-column>
            <el-table-column align="center" prop="compensationType" label="赔偿方式">
              <template slot-scope="scope">
                <span>{{scope.row.compensationType ==0?'具体金额':'价格倍数'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="compensationNum" label="赔偿额度">
              <template slot-scope="scope">
                <span v-if="scope.row.compensationType==0">{{scope.row.compensationNum}}元</span>
                <span v-if="scope.row.compensationType==1">{{scope.row.compensationNum}}倍</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="distinction" label="区别号">
              <template slot-scope="scope">
                <span>{{scope.row.distinction ==0?'损坏':'遗失'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
            <!-- 自定义插槽 -->
            <el-table-column align="center" label="操作" width="200" fixed="right">
              <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
              <template slot-scope="scope">
                <span class="edit" @click="EditBtn(scope.$index, scope.row)">修改</span>
                <span class="ban" @click="deleteBtn(scope.$index, scope.row)">删除</span>
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
      <!--删除弹框-->
      <div class="forbid collectionDelete">
        <el-dialog title="删除" :visible.sync="centerDialogVisible" width="400px" center>
          <div class="dialogBody">
            是否删除当前记录?
          </div>
          <div style="margin-bottom: 30px">
            <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
            <span class="dialogButton cancel" @click="centerDialogVisible = false">取消</span>
          </div>
        </el-dialog>
      </div>
      <!-- 修改新增弹框 -->
      <div class="addEditDialog">
        <!-- Form -->
        <el-dialog
          @close="closeForm"
          width="600px"
          :title="Dialogtitle[i]"
          :visible.sync="dialogFormVisible"
        >
          <el-form
            id="damageForm"
            :model="addForm"
            :rules="rules"
            :ref="addForm"
            label-width="90px"
            class="demo-ruleForm"
            style="display: flex;flex-direction: column"
          >
            <el-form-item label="损坏原因 : " prop="damageMothod" >
              <el-input v-model="addForm.damageMothod" placeholder="请输入损坏的原因"></el-input>
            </el-form-item>
            <el-form-item label="赔偿方式 : " prop="payFor">
              <el-select clearable v-model="addForm.payFor" @change="payForMethodCheck(addForm.payFor)" placeholder="请选择赔偿的方式">
                <el-option
                  v-for="(item,index) of options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="title" prop="payforNum" id="titleJ">
              <el-input v-model="addForm.payforNum" :placeholder="placeholderTitle" style="position: relative"></el-input>
              <span style="position: absolute;top: 0px;right: 15px">{{moneyTitle}}</span>
            </el-form-item>
            <el-form-item label=" 区 别 号 : " prop="differenceNumber">
              <el-radio-group v-model="addForm.differenceNumber">
                <el-radio label="损坏"></el-radio>
                <el-radio label="遗失"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注信息 : " prop="remark">
              <el-input type="textarea" style="width: 464px" v-model="addForm.remark" resize="none"  :autosize="{ minRows: 4, maxRows: 4}" placeholder="请输入备注信息"></el-input>
            </el-form-item>
            <!-- 弹框表单按钮  验证失效-->
            <el-form-item>
              <div style="width: 255px;margin-left: 70px">
                <span class="dialogButton true mr_40" @click="submitForm('addForm')">确 定</span>
                <span class="dialogButton cancel" @click="resetForm('addForm')">取 消</span>
              </div>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
  import axios from "axios";
  import moment from "moment";
  import { damage } from "../../request/api/base.js";

  export default {
    data() {
      return {
        /*====== 2.0表单搜索区域 ======*/
        centerDialogVisible: false, // 删除弹框
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        Dialogtitle: ["修改", "新增"],
        title:'',
        placeholderTitle:'',
        j:null,
        i: null, // 切换弹框标题
        searchForm: {
          // 接受搜索表单的数据
          damageMothod:'',
          currentPage: 0
        },
        addForm:{
          damageMothod:'',
          payFor:'',
          payforNum:'',
          remark:'',
          differenceNumber:''//区别号
        },
        rules:{
          damageMothod:[{ required: true, message: "请输入损坏方式", trigger: "blur" }],
          payFor:[{ required: true, message: "请选择赔偿方式", trigger: "change" }],
          payforNum:[{ required: true, message: "请先选择赔偿方式", trigger: "blur" }],
          remark:[{ required: true, message: "请输入备注信息", trigger: "blur" }],
          differenceNumber:[{ required: true, message: "请选择区别号", trigger: "change" }],
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
        moneyTitle:''
      };
    },
    computed: {
      newEdit() {
        // 计算属性 真正传递的数据
        let newForm = {
          id:this.id,
          damageName:this.addForm.damageMothod,
          compensationType:this.addForm.payFor=='按价格倍数赔偿'?1:0,
          compensationNum:this.addForm.payforNum,
          distinction:this.addForm.differenceNumber=='遗失'?1:0,
          remarks:this.addForm.remark,
        };
        return newForm;
      },
      newAdd(){
        let newForm = {
          damageName:this.addForm.damageMothod,
          compensationType:this.addForm.payFor,
          compensationNum:this.addForm.payforNum,
          distinction:this.addForm.differenceNumber=='遗失'?1:0,
          remarks:this.addForm.remark,
        };
        return newForm;
      },
      searchTimeForm(){
        let newSearch={
          name:this.searchForm.damageMothod,
          pageSize: this.pageSize,
          currentPage: 1,
        }
        return newSearch
      }
    },
    methods: {
      payForMethodCheck(val){
        console.log('赔偿方式',val)
        console.log(this.rules.payforNum[0].message)
        if(val==0){
          this.title='具体金额 :'
          this.placeholderTitle='请输入具体赔偿金额'
          this.rules.payforNum[0].message='赔偿的价格倍数/具体金额不能为空'
          this.moneyTitle='元'
        }else if(val==1){
          this.title='价格倍数 :'
          this.placeholderTitle='请输入赔偿价格倍数'
          this.rules.payforNum[0].message='赔偿的价格倍数/具体金额不能为空'
          this.moneyTitle='倍'
        }
      },
      // 删除按钮
      deleteBtn(index, row) {
        this.centerDialogVisible=true
        console.log('row',row)
        this.id=row.id
      },
      //删除弹框确定按钮
      submitDialog(){
        this.axios.post(damage.delete,{id:this.id}).then((res)=>{
          console.log(res)
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
      },
      // 新增按钮
      addBtn() {
        this.i=1
        this.dialogFormVisible=true
      },
      // 修改按钮
      EditBtn(index,row) {
        this.i=0
        this.id=row.id
        this.dialogFormVisible=true
        if(row.compensationType==0){
          this.title='具体金额 :'
          this.moneyTitle="元"
          //this.placeholderTitle='请输入具体赔偿金额'
          //this.rules.payforNum[0].message='赔偿的价格倍数/具体金额不能为空'
        }else if(row.compensationType==1){
          this.title='价格倍数 :'
          this.moneyTitle="倍"
          //this.placeholderTitle='请输入赔偿价格倍数'
          //this.rules.payforNum[0].message='赔偿的价格倍数/具体金额不能为空'
        }
        console.log('row',row)
        this.addForm.damageMothod=row.damageName
        this.addForm.payFor=row.compensationType==0?'按具体金额赔偿':'按价格倍数赔偿'
        this.addForm.differenceNumber=row.distinction==0?'损坏':'遗失'
        this.addForm.payforNum=row.compensationNum
        this.addForm.remark=row.remarks
      },
      //新增修改弹窗确定按钮
      submitForm() {
        this.$refs[this.addForm].validate(valid => {
          if (valid) {
            if (this.i === 0) {
              this.editApi(this.newEdit);
            }
            if (this.i === 1) {
              this.addApi(this.newAdd);
            }
          } else {
            return false;
          }
        });
      },
      //新增
      addApi(value){
        this.axios.post(damage.add,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.dialogFormVisible=false
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
      //修改
      editApi(value){
        this.axios.post(damage.edit,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.dialogFormVisible=false
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
      //新增删除取消按钮
      resetForm() {
        this.closeForm()
      },
      closeForm() {
        this.title=''
        this.moneyTitle=""
        this.placeholderTitle=''
        let obj = this.addForm;
        this.$refs[this.addForm].resetFields(); // 调用这个方法进行清除登陆状态 打开的时候再清理？
        for (var i in obj) {
          obj[i] = "";
        }
        this.dialogFormVisible = false
      },
      // 查询按钮
      searchBtn() {
        this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
        this.currentPage = 1;
      },
      paginationApi(value) {
        //获取登录记录
        console.log(value);
        this.tableLoading = true;
        axios
          .get(damage.select, {
            params: value
          })
          .then(res => {
            console.log("损坏记录", res.data);
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
          .get(damage.select, {
            params: value
          })
          .then(res => {
            console.log("损坏记录", res.data);
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
          .get(damage.select, {
            params: value
          })
          .then(res => {
            console.log("损坏记录", res.data);
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
    margin-right: 30px;
  }
  .buttonBox .add .addIcon {
    margin-right: 6px;
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
  .tablebox .tableBorder {
    border: 1px solid #ebeef5;
    border-bottom: none;
    font-size: 16px;
  }
  #titleJ{
    position: relative;
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
