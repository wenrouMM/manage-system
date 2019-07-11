<template>
  <div class="borrowbook " style="overflow: auto">
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">采购管理</div>
    </div>
    <div id="purchasing" style="overflow: auto">
      <section class="searchBox">
        <div class="buttonBox">
          <button class="add" @click="rechargeBtn">
            <i class="addIcon el-icon-plus"></i>添加
          </button>
          <button class="delete" @click="drawbackBtn">
            <i class="deleteIcon el-icon-delete"></i>批量删除
          </button>
          <!--<button class="blue" @click="deriveBtn">
            <i class="blueIcon el-icon-share"></i>导出
          </button>-->
        </div>
        <div class="right" id="searchInput">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="筛选 :">
              <el-select
                style="width: 150px"
                v-model="searchForm.makeMethod"
                placeholder="请选择"
                clearable
                @change="selectCheck(searchForm.makeMethod)"
              >
                <el-option label="采购批次" value="0"></el-option>
                <el-option label="备注信息" value="1"></el-option>
              </el-select>
              <el-input v-model="searchForm.searchData" placeholder="请输入相关信息" clearable style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
      <section class="tableBox"  v-loading="tableLoading">
        <el-table
          :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px',borderRight:'none'}"
          empty-text="无数据"
          style="width: 100%; text-align:center;"
          :data="tableData"
          :row-style="{height:'60px'}"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="100"></el-table-column>
          <el-table-column align="center" prop="batch" label="采购批次" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" prop="remark" label="备注信息" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="200">
            <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
            <template slot-scope="scope" >
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
    <!-- 新增弹框 -->
    <div class="addEditDialog">
      <!-- Form -->
      <el-dialog
        @close="closeForm"
        width="500px"
        :title="Dialogtitle[i]"
        :visible.sync="dialogFormVisible"
      >
        <el-form
          :rules="rules"
          :model="addForm"
          id="purchasingMessage"
          :ref="addForm"
          style="display: flex;flex-direction: column"
        >
          <!-- 弹框表单按钮  验证失效-->
          <el-form-item label=" 采购批次 :" prop="PurchaseBatch" label-width="100px" style>
            <el-input v-model="addForm.PurchaseBatch"  style="width: 340px"></el-input>
          </el-form-item>
          <el-form-item label=" 备注信息 :" prop="remarks" label-width="100px">
            <el-input
              type="textarea"
              v-model="addForm.remarks"
              style="width: 340px"
              :autosize="{ minRows: 7, maxRows: 7}"
              resize="none"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin:0px auto">
            <div style="margin-bottom: 10px">
              <span class="dialogButton true mr_40" @click="submitForm()">确 定</span>
              <span class="dialogButton cancel" @click="resetForm()">取 消</span>
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--'删除'-->
    <div class="forbid collectionDelete">
      <el-dialog :title="Dialogtitle[i]" :visible.sync="centerDialogVisible" width="400px" center>
        <div class="dialogBody">是否{{Dialogtitle[i]}}?</div>
        <div style="margin-bottom: 30px">
          <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
          <span class="dialogButton cancel" @click="centerDialogVisible = false">取 消</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { purchasing } from "@request/api/base.js";
export default {
  data() {
    return {
      searchForm: {
        // 接受搜索表单的数据
        makeMethod: "",
        searchData: "",
        currentPage: 0
      },
      searchData: "",
      id: "",
      selectSearchForm: {
        batch: "", //批次号
        remark: "", //备注信息
        currentPage: 0
      },
      rules: {
        PurchaseBatch: [
          { required: true, message: "请输入采购批次", trigger: "blur" }
        ],
        remarks: [
          { required: true, message: "请输入备注信息", trigger: "blur" }
        ]
      },
      addForm: {
        //添加修改的数据
        PurchaseBatch: "", //采购批次
        remarks: "" //备注信息
      },
      tableData: [],
      tableLoading:true,
      dialogFormVisible: false, // // 新增修改弹框的展示和消失
      centerDialogVisible: false, // 删除弹框
      Dialogtitle: ["修改", "新增", "批量删除"],
      i: null, // 切换弹框标题
      tableChecked: [], // 批量选择的的数据
      currentPage: 1,
      pageInput: 1,
      pageSize: 10,
      total: 0
    };
  },
  computed: {
    searchTimeForm() {
      if (this.searchData) {
        switch (this.searchData / 1) {
          case 0:

            this.selectSearchForm.batch = this.searchForm.searchData;
            break;
          case 1:

            this.selectSearchForm.remark = this.searchForm.searchData;
            break;
        }
      } else {

        this.selectSearchForm.batch = "";
        this.selectSearchForm.remark = "";
      }
      let newData = {
        batch: this.selectSearchForm.batch,
        remark: this.selectSearchForm.remark,
        pageSize: this.pageSize,
        currentPage: 1
      };

      return newData;
    }
  },
  methods: {
    //筛选搜索
    selectCheck(val) {

      this.searchForm.searchData=""
      for(const index in this.selectSearchForm){
        this.selectSearchForm[index]=""
      }
      this.searchData = val;
    },
    //新增按钮
    rechargeBtn() {
      this.i = 1;
      this.dialogFormVisible = true;
    },
    //修改按钮
    EditBtn(index, row) {

      this.id = row.id;
      this.i = 0;
      this.dialogFormVisible = true;
      this.addForm.PurchaseBatch = row.batch;
      this.addForm.remarks = row.remark;
    },
    //删除按钮
    drawbackBtn() {
      if (this.tableChecked.length) {
        this.i = 2;
        this.centerDialogVisible = true;
      } else {
        this.$message.error("请先选择删除对象");
      }
    },
    //导出按钮
    deriveBtn() {},
    //搜索
    searchBtn() {
      this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
      this.currentPage = 1;
    },
    //新增修改弹框的确定按钮
    submitForm() {
      if (this.i == 1) {
        this.axios
          .post(purchasing.add, {
            batch: this.addForm.PurchaseBatch,
            remark: this.addForm.remarks
          })
          .then(res => {
            if (res.data.state == true) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.closeForm();
              this.searchApi(this.searchTimeForm);
            } else {
              this.$message({
                message: res.data.msg,
                type: "error"
              });
            }
          });
      } else if (this.i == 0) {
        this.axios
          .post(purchasing.edit, {
            id: this.id,
            batch: this.addForm.PurchaseBatch,
            remark: this.addForm.remarks
          })
          .then(res => {
            if (res.data.state == true) {
              this.$message({
                message: res.data.msg,
                type: "success"
              });
              this.closeForm();
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
      //新增修改弹框的取消按钮
      resetForm(){
        this.closeForm()
      },
      //删除弹框的确定按钮
      submitDialog(){
        let idData=[]
        for (var item of this.tableChecked) {

          idData.push({id:item.id})
        }
        this.axios.post(purchasing.delete,idData).then((res)=>{
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
      },
      //批量选择
      handleSelectionChange(val) {

        this.tableChecked = val;
      },
      //关闭弹窗
      closeForm(){
        this.$refs[this.addForm].resetFields(); // 调用这个方法进行清除登陆状态 打开的时候再清理？
        for (var i in this.addForm) {
          this.addForm[i] = "";
        }
        this.dialogFormVisible = false
      },
      searchApi(value) {
        //获取登录记录

        this.tableLoading = true;
        axios
          .get(purchasing.select, {
            params: value
          })
          .then(res => {

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

          });
      },
      paginationApi(value) {
        //获取登录记录

        this.tableLoading = true;
        axios
          .get(purchasing.select, {
            params: value
          })
          .then(res => {

            if (res.data.state === true) {
              this.tableData = res.data.row; //获取返回数据
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

          });
      },
      current_change(currentPage) {
        //分页查询
        this.currentPage = currentPage; //点击第几页
        this.paginationForm.currentPage = currentPage;

        this.paginationApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
      },
      jumpBtn() {

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
    },
    created() {
      this.searchApi(this.searchTimeForm); // 调用查询接口获取数据
    }
  }
</script>

<style scoped>
.edit {
  color: #00f0ed;
  cursor: pointer;
}
.borrowbook {
  width: 100%;
  background-color: white;
}
#purchasing {
  width: 1400px;
  margin: 30px auto 30px;
}
.searchBox {
  display: flex;
  justify-content: space-between;
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
  margin-right: 10px;
}
.buttonBox .add .addIcon {
  margin-right: 6px;
}
.buttonBox .delete {
  background: rgba(255, 92, 60, 1);
  border-radius: 10px;
  margin-right: 10px;
}
.buttonBox .delete .deleteIcon {
  margin-right: 6px;
}
.buttonBox .blue {
  background: #31d6ff;
  border-radius: 10px;
}

.buttonBox .blue .blueIcon {
  margin-right: 6px;
}
</style>
