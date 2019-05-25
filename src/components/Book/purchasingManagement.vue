<template>
  <div class="borrowbook" style="overflow: auto">
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">采购管理</div>
    </div>
    <div id="purchasing">
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
        </div>
        <div class="right">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="筛选 :">
              <el-select v-model="searchForm.makeMethod" placeholder="采购批次" clearable style="width: 150px" @change="selectCheck(searchForm.makeMethod)">
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
          <el-table-column align="center" prop="searchNumber" label="采购批次" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" prop="code" label="备注信息" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column align="center" label="操作">
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
    <!-- 新增弹框 -->
    <div class="addEditDialog">
      <!-- Form -->
      <el-dialog @close="closeForm" width="500px" :title="Dialogtitle[i]" :visible.sync="dialogFormVisible">
        <el-form :rules="rules" :model="addForm" id="purchasingMessage" :ref="addForm" style="display: flex;flex-direction: column">
          <!-- 弹框表单按钮  验证失效-->
          <el-form-item label=" 采购批次 :" prop="PurchaseBatch" label-width="95px" style="">
            <el-input v-model="addForm.PurchaseBatch" style="width: 340px"></el-input>
          </el-form-item>
          <el-form-item label=" 备注信息 :" prop="remarks" label-width="95px">
            <el-input type="textarea" v-model="addForm.remarks" style="width: 340px" :autosize="{ minRows: 7, maxRows: 7}" resize="none"></el-input>
          </el-form-item>
          <el-form-item style="margin:0px auto">
            <el-button type="primary" @click="submitForm()" style="margin-left: 20px">确定</el-button>
            <el-button type="info" @click="resetForm()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    <!--'删除'-->
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
  </div>
</template>

<script>
  export default {
    data(){
      return{
        searchForm: {
          // 接受搜索表单的数据
          makeMethod:'',
          searchData:"",
          currentPage: 0
        },
        rules:{
          PurchaseBatch:[{ required: true,message: "请输入采购批次", trigger: "blur" }],
          remarks:[{ required: true,message: "请输入备注信息", trigger: "blur" }],
        },
        addForm:{
          //添加修改的数据
          PurchaseBatch:'',//采购批次
          remarks:'',//备注信息
        },
        tableData:[],
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        centerDialogVisible: false, // 删除弹框
        Dialogtitle: ["修改", "新增",'删除'],
        i: null, // 切换弹框标题
        tableChecked: [], // 批量选择的的数据
        currentPage: 1,
        pageInput: 1,
        pageSize: 10,
        total: 0,
      }
    },
    mounted(){

    },
    methods:{
      //新增按钮
      rechargeBtn(){
        this.i=1;
        this.dialogFormVisible=true
      },
      //修改按钮
      EditBtn(){
        this.i=0
        this.dialogFormVisible=true
      },
      //删除按钮
      drawbackBtn(val){
        this.i=2
        this.centerDialogVisible=true
      },
      //导出按钮
      deriveBtn(){

      },
      //搜索
      searchBtn(){

      },
      //新增修改弹框的确定按钮
      submitForm(){

      },
      //新增修改弹框的取消按钮
      resetForm(){

      },
      //删除弹框的确定按钮
      submitDialog(){

      },
      //批量选择
      handleSelectionChange(val) {
        console.log('全选按钮之后的数据',val);
        this.tableChecked = val;
      },
      //关闭弹窗
      closeForm(){

      },
      current_change(currentPage) {
        //分页查询
        this.currentPage = currentPage; //点击第几页
        this.paginationForm.currentPage = currentPage;
        console.log("保存当前查询", this.paginationForm, this.currentPage);
        this.searchApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
      },
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
    },
  }
</script>

<style scoped>
  .borrowbook{
    width: 100%;
    background-color: white;
  }
  #purchasing{
    width: 1400px;
    margin: 70px auto 150px;
  }
  .searchBox{
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
</style>
