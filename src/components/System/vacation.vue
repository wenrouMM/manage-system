<template>
  <div id="Notice">
    <el-container>
      <div style="width:100%">
        <div class="sonTitle">
          <span class="titleName">假期设置</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <button class="add" @click="rechargeBtn">
              <i class="addIcon el-icon-plus"></i>添加
            </button>
            <button class="delete" @click="batchDelete(tableChecked)">
              <i class="deleteIcon el-icon-delete"></i>批量删除
            </button>
          </div>
        </section>
        <!-- 3.0表格数据 -->
        <section class="tablebox" v-loading="tableLoading">
          <el-table
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px',borderRight:'none'}"
            empty-text="无数据"
            style="width: 1540px; text-align:center;"
            :data="tableData"
            :row-style="{height:'60px'}"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" type="selection" width="100" fixed="left"></el-table-column>
            <el-table-column align="center" prop="holidayName" label="假期名称"></el-table-column>
            <el-table-column align="center" prop="holidaySource" label="发布者"></el-table-column>
            <el-table-column align="center" prop="startTime" label="开始时间"></el-table-column>
            <el-table-column align="center" prop="endTime" label="结束时间"></el-table-column>
            <el-table-column align="center" prop="state" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.state ==0?'停用':'启用'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200" fixed="right">
              <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
              <template slot-scope="scope">
                <span class="edit" @click="EditBtn(scope.$index, scope.row)">修改</span>
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
      <!-- 修改新增弹框 -->
      <div class="addEditDialog">
        <!-- Form -->
        <el-dialog
          @close="closeForm"
          width="450px"
          :title="Dialogtitle[i]"
          :visible.sync="dialogFormVisible"
        >
          <el-form
            id="vacationForm"
            :model="addForm"
            :rules="rules"
            :ref="addForm"
            label-width="120px"
            class="demo-ruleForm"
            style="display: flex;flex-direction: column"
          >
            <el-form-item label="假期名称 : " prop="vacationName">
              <el-input v-model="addForm.vacationName" placeholder="请输入假期名称"></el-input>
            </el-form-item>
            <el-form-item label="开始日期 : " prop="startTime">
              <el-date-picker
                v-model="addForm.startTime"
                type="date"
                placeholder="请选择开始日期"
                :picker-options="pickerOptions0"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结束日期 : " prop="endTime">
              <el-date-picker
                v-model="addForm.endTime"
                type="date"
                placeholder="请选择结束日期"
                :picker-options="pickerOptions1"
                format="yyyy/MM/dd"
                value-format="yyyy/MM/dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="状　　态 : " prop="state">
              <el-radio-group v-model="addForm.state">
                <el-radio label="启用"></el-radio>
                <el-radio label="停用"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label-width="130px">
              <p class="textTips" style="color: red">(假期设置日期不可重叠)</p>
            </el-form-item>

            <!-- 弹框表单按钮  验证失效-->
            <div class="flexLayout" style="width: 350px;margin: 0 auto">
              <div style="margin:0px auto 20px;width: 255px;">
                <span class="dialogButton true mr_40" @click="submitForm('addForm')">确 定</span>
                <span class="dialogButton cancel" @click="resetForm('addForm')">取 消</span>
              </div>
            </div>
          </el-form>
        </el-dialog>
      </div>
      <div class="forbid collectionDelete">
        <el-dialog :title="Dialogtitle[i]" :visible.sync="centerDialogVisible" width="400px" center>
          <div class="dialogBody">
            是否{{Dialogtitle[i]}}?
          </div>
          <div style="margin-bottom: 30px">
            <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
            <span class="dialogButton cancel" @click="centerDialogVisible = false">取 消</span>
          </div>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from "moment";
  import { vacation } from "../../request/api/base.js";
  export default {
    data() {
      return {
        /*====== 2.0表单搜索区域 ======*/
        tableChecked: [], // 全选绑定的数据
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        centerDialogVisible:false,
        Dialogtitle: ["修改", "新增","批量删除"],
        i: null, // 切换弹框标题
        searchForm: {
          // 接受搜索表单的数据
          vacationName:'',
          vacationTime:'',
          currentPage: 0
        },
        addForm:{
          vacationName:'',
          startTime:'',
          endTime:'',
          state:''
        },
        rules:{
          vacationName:[{ required: true, message: "请输入假期名称", trigger: "blur" }],
          startTime:[{ required: true, message: "请选择开始时间", trigger: "change" }],
          endTime:[{ required: true, message: "请选择结束", trigger: "change" }],
          state:[{ required: true, message: "请选择状态", trigger: "change" }]
        },
        pickerOptions0: {
          disabledDate: time => {
            if (this.addForm.endTime) {
              return (
                time.getTime() < Date.now() ||
                time.getTime() > new Date(this.TimeNow.endTime).getTime()
              );
            } else {
              return time.getTime() < Date.now();
            }
          }
        },
        pickerOptions1: {
          disabledDate: time => {
            if(this.addForm.startTime){
              return (
                time.getTime() < new Date(this.TimeNow.startTime).getTime() || time.getTime() < Date.now()
              );
            } else{
              return time.getTime() < Date.now();
            }
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
      };
    },
    computed: {
      //添加参数
      newaddForm() {
        let newForm = {
          holidayName:this.addForm.vacationName,
          state: this.addForm.state==='停用'?0:1,
          startTime:
            !this.addForm.startTime
              ? null
              : moment(this.addForm.startTime).format("YYYY-MM-DD 00:00:00"), //开始时间
          endTime:
            !this.addForm.endTime
              ? null
              : moment(this.addForm.endTime).format("YYYY-MM-DD 00:00:00") //结束时间
        };
        //console.log(newForm)
        return newForm;
      },
      //修改参数
      neweditForm() {
        let newForm = {
          id: this.id,
          holidayName:this.addForm.vacationName,
          state: this.addForm.state==='停用'?0:1,
          startTime:
            !this.addForm.startTime
              ? null
              : moment(this.addForm.startTime).format("YYYY-MM-DD 00:00:00"), //开始时间
          endTime:
            !this.addForm.endTime
              ? null
              : moment(this.addForm.endTime).format("YYYY-MM-DD 00:00:00") //结束时间
        };
        console.log(newForm);
        return newForm;
      },
      // 时间转化
      TimeNow() {
        let obj = {
          startTime:
            !this.addForm.startTime
              ? null
              : moment(this.addForm.startTime).format("YYYY-MM-DD 00:00:00"), //开始时间
          endTime:
            !this.addForm.endTime
              ? null
              : moment(this.addForm.endTime).format("YYYY-MM-DD 00:00:00") //结束时间
        }
        return obj
      }
    },
    methods: {
      //批量选择
      handleSelectionChange(val) {
        console.log("全选按钮之后的数据", val);
        this.tableChecked = val;
      },
      batchDelete() {
        // 批量删除
        if(this.tableChecked.length){
          this.i=2
          this.centerDialogVisible=true
        } else {
          this.$message.error('请先选择被删除的数据')
        }
      },
      //删除弹窗确定按钮
      submitDialog(){
        var deleteParam = [];
        for (var item of this.tableChecked) {
          console.log(item.id, item.roleCode);
          deleteParam.push({ id: item.id, code: item.roleCode });
        }
        this.axios.post(vacation.delete,deleteParam).then((res)=>{
          console.log('删除之后返回的数据',res)
          if(res.data.state==true){
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.searchApi(this.searchTimeForm);
            this.centerDialogVisible=false
          }else{
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      },
      //修改弹窗
      EditBtn (index,row) {
        this.i=0;
        this.id=row.id;
        var newStart=row.startTime.split(" ")
        var newEnd=row.endTime.split(" ")
        this.addForm.vacationName=row.holidayName
        this.addForm.startTime=newStart[0]
        this.addForm.endTime=newEnd[0]
        this.addForm.state=row.state==0?'停用':'启用'
        this.dialogFormVisible=true
      },
      //新增弹窗
      rechargeBtn(){
        this.i=1;
        this.dialogFormVisible=true
      },
      //新增/修改弹窗的确定按钮
      submitForm(){
        this.$refs[this.addForm].validate(valid => {
          if (valid) {
            if (this.i === 0) {
              this.editApi(this.neweditForm);
            }
            if (this.i === 1) {
              this.addApi(this.newaddForm);
            }
          } else {
            return false;
          }
        });
      },
      editApi(value){
        this.axios.post(vacation.edit,value).then((res)=>{
          console.log(res)
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.dialogFormVisible=false
            this.searchApi();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      },
      addApi(value){
        this.axios.post(vacation.add,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.dialogFormVisible=false
            this.searchApi();
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      },
      //新增/修改弹窗的取消按钮
      resetForm(){
        this.closeForm()
      },
      //关闭弹窗
      closeForm() {
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
          .get(vacation.select, {
            params: value
          })
          .then(res => {
            console.log("寒暑假记录", res.data);
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
          .get(vacation.select, {
            params: value
          })
          .then(res => {
            console.log("寒暑假记录", res.data);
            if (res.data.state === true) {
              this.tableData = res.data.row; //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
              this.tableLoading = false;
            } else {
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
  .edit {
    color: #00d7f0;
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
  .buttonBox .delete {
    background: rgba(255, 92, 60, 1);
    border-radius: 10px;
  }
  .buttonBox .delete .deleteIcon {
    margin-right: 6px;
  }
  .buttonBox .add {
    background: rgba(255, 146, 49, 1);
    border-radius: 10px;
    margin-right: 10px;
  }
  .buttonBox .add .addIcon {
    margin-right: 6px;
  }
  #Notice {
    background: #ffffff;
    padding: 30px;
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
  .sonTitle .titleName {
    border-left: 4px solid #0096ff;
    padding-left: 10px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(135, 135, 135, 1);
    display: inline-block;
    margin-bottom: 33px;
  }
  .button_s {
    width: 90px;
    font-size: 16px;
    text-align: center;
    margin-left: 30px;
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
  .tablebox .tableBorder {
    border: 1px solid #ebeef5;
    border-bottom: none;
    font-size: 16px;
  }
  #loginrecord .el-table {
    border: 1px solid #eaeaea;
    /*border-width: 0 1px 1px 1px ;*/
    border-bottom: 0;
  }
</style>
