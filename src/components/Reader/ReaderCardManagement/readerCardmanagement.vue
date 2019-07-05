<template>
  <div class="useradd reader-card">
    <el-container>
      <div class="box-card">
        <!-- 估计是第三层路由展示区域 -->
        <div class="important">
          <!-- 1.0 标题 -->
          <div class="sonTitle">
            <span class="titleName">读者卡信息</span>
          </div>
          <!-- 2.0 表单填写 查询接口 状态：正在查询（loading组件） 查询成功 查询失败 -->
          <section
            class="searchBox"
            style="display: flex;flex-direction: row;justify-content: space-between"
          >
            <div class="buttonBox">
              <button class="add" @click="conductBtn">
                <i class="addIcon el-icon-plus"></i>办卡
              </button>
            </div>
            <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="筛选 :">
                <el-select
                  style="width: 150px"
                  v-model="searchForm.makeMethod"
                  placeholder="请选择"
                  clearable
                  @change="selectCheck(searchForm.makeMethod)"
                >
                  <el-option label="卡号" value="0"></el-option>
                  <el-option label="用户名" value="1"></el-option>
                  <el-option label="等级名称" value="2"></el-option>
                </el-select>
                <el-input v-model="searchForm.searchData" id="searchInput" placeholder="请输入相关信息" clearable style="width: 250px"></el-input>
                <el-select clearable id="gradeName" v-model="searchForm.type" style="width: 250px;display: none" placeholder="请选择等级名称">
                  <el-option
                    v-for="(option,index) of optionsDataType"
                    :key="index"
                    :label="option.name"
                    :value="option.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态:">
                <el-select clearable v-model="searchForm.state" style="width: 200px" placeholder="请选择状态">
                  <el-option
                    v-for="(option,index) of optionsData"
                    :key="index"
                    :label="option.name"
                    :value="option.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!--<el-form-item label="等级名称:">
                <el-select clearable v-model="searchForm.type" style="width: 200px" placeholder="请选择等级名称">
                  <el-option
                    v-for="(option,index) of optionsDataType"
                    :key="index"
                    :label="option.name"
                    :value="option.code"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态:">
                <el-select clearable v-model="searchForm.state" style="width: 200px" placeholder="请选择状态">
                  <el-option
                    v-for="(option,index) of optionsData"
                    :key="index"
                    :label="option.name"
                    :value="option.code"
                  ></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item>
                <el-button size="15" type="primary" @click="searchBtn" class="button_s">搜索</el-button>
              </el-form-item>
            </el-form>
          </section>
          <!-- 4.0 表格展示内容 编辑功能：状态用上 禁用 批量禁用弹框 弹框可尝试用slot插槽封装 -->
          <section class="tablebox" v-loading="tableLoading">
            <el-table
              @selection-change="selectAllBtn"
              :data="tableData"
              style="width: 100%; text-align:center;"
              :row-style="rowStyle"
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
            >
              <el-table-column width="100" align="center" prop="index" type="index" label="序号" fixed="left">
                <template slot-scope="scope">
                  <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="fkReaderName" label="用户名" width="200"></el-table-column>
              <el-table-column align="center" prop="cardNumber" label="卡号" width="200"></el-table-column>
              <el-table-column align="center" prop="balance" width="200" label="押金">
                <template slot-scope="scope">
                  <span>{{scope.row.balance}}元</span>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="fkGradeName" label="等级名称" width="200"></el-table-column>
              <!-- <el-table-column align="center" prop="fkFromLibraryName" width="100" label="所属地区"></el-table-column> -->
              <el-table-column align="center" prop="creatTime" label="创建时间" width="200"></el-table-column>
              <el-table-column align="center" prop="updateTime" label="修改时间" width="200"></el-table-column>
              <el-table-column align="center" prop="state" label="状态" width="150">
                <template slot-scope="scope">
                  <span>{{scope.row.state ===0?'正常':'挂失'}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="300" fixed="right">
                <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                <template slot-scope="scope">
                  <span class="edit" @click="rechargeBtn(scope.$index, scope.row)">充值</span>
                  <span class="edit" @click="supply(scope.$index, scope.row)">补办</span>
                  <span
                    class="ban"
                    @click="lostBtn(scope.$index, scope.row)"
                  >{{scope.row.state ===0?'挂失':'取挂'}}</span>
                  <span class="edit1" @click="logoutBtn(scope.$index, scope.row)">注销</span>
                </template>
              </el-table-column>
            </el-table>
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
      </div>
      <!-- 禁用弹框/批量删除弹框 -->
      <div class="forbid collectionDelete">
        <el-dialog title="用户注销" :visible.sync="deleteDialog" width="450px" center>
          <!-- <div class="dialogBody">是否注销?</div> -->
          <div class="formBox" style="width:360px">
            <el-form :model="logOut">
              <el-form-item labelWidth="50px" label="卡号 :">
                <span>{{logOut.fkCardNumber}}</span>
              </el-form-item>
              <el-form-item label="备注 :" labelWidth="50px">
                <el-input
                  type="textarea"
                  resize="none"
                  :rows="4"
                  placeholder="请输入备注"
                  v-model="logOut.remarks"
                ></el-input>
              </el-form-item>
            </el-form>
            <div style="margin:0px auto 20px;width: 255px">
              <span class="dialogButton true mr_40" @click="subDelete">确 定</span>
              <span class="dialogButton cancel" @click="deleteDialog = false">取 消</span>
            </div>
          </div>
          <!-- <p class="tips">注销用户属于敏感操作</p> -->
        </el-dialog>
      </div>
      <!-- 批量删除弹框 -->
      <!-- 添加弹框 -->
      <div class="collectionDelete readerCard">
        <!-- Form -->
        <el-dialog
          @close="closeForm('changeForm')"
          width="400px"
          :title="Dialogtitle[i]"
          :visible.sync="changeFormDialog"
        >
          <el-form ref="changeForm" :model="changeForm" :rules="changeRules">
            <!-- 表单域 -->
            <div v-if="i!=4">
              <el-form-item :label="labelName[i]" prop="idCard">
                <el-input @keyup.enter.native v-model="changeForm.idCard" autocomplete="off"></el-input>
              </el-form-item>
              <div class="supply" style="width: 100px;margin: 0 auto 30px;color: #878787">
                <p>
                  补卡费用：
                  <span>{{supplyCost}}</span>
                </p>
              </div>
            </div>
            <div v-else-if="i==4">
              <el-form-item label="卡号" prop="cardNumber">
                <el-input :disabled="juge" v-model="changeForm.cardNumber" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="押金" prop="deposit">
                <el-input @blur="jugeCash" v-model.number="changeForm.deposit" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item v-if="hide" label="密码" label-width="50px">
                <el-input type="password" v-model="changeForm.password" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="remarks">
                <el-input type="textarea" :rows="4" resize="none" v-model="changeForm.remarks"></el-input>
              </el-form-item>
            </div>
            <!-- 弹框表单按钮  验证失效-->
            <el-form-item class="dialogFooter">
                <span class="dialogButton true mr_40" @click="submitForm('changeForm','changeFormDialog')">确 定</span>
                <span class="dialogButton cancel" @click="resetForm('changeForm','changeFormDialog')">取 消</span>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import {
  cardInfoInt,
  rechargeInt,
  bookWordInt
} from "@request/api/base.js";
export default {
  data() {
    return {
      /*====== 2.0查询功能配置项 ======*/
      optionsData: [{ name: "在用", code: 0 }, { name: "挂失", code: 1 }],
      optionsDataType: [], // 类型下拉框
      searchForm: {
        // 接受搜索表单的数据
        makeMethod: "",
        searchData: "",
        currentPage: 0
      },
      searchData: "",
      selectSearchForm: {
        cardNum: "",
        username: "",
        gradeName: "",
        state: "",
        currentPage: 0
      },
      /*====== 3.0添加 批量删除所需数据 ======*/
      Allseclet: [], // 全选
      deleteParams: [], // 删除所需数据
      /*====== 4.0表格设置项 ======*/
      rowStyle: {
        height: "60px"
      },
      tableData: [],
      // 分页器设置
      total: 0,
      pageSize: 10,
      pageInput: 1,
      currentPage: 1,
      paginationForm: {},
      /*====== 弹框配置项 ======*/
      Dialogtitle: ["补办", "登记读者卡", "挂失", "取消挂失", "押金充值"],
      labelName: ["新卡号", "读者卡号", ""],
      deleteDialog: false, // 禁用弹框
      deleteArr: {},
      operateData: {}, //
      // 添加编辑
      i: 0, // 切换弹框标题
      changeFormDialog: false, // // 添加弹框的展示和消失
      formLabelWidth: "100px",
      changeForm: {
        idCard: "", // 新卡号
        cardNumber: "",
        deposit: "",
        password: "",
        remarks: ""
      },
      changeRules: {
        idCard: [
          { required: true, message: "新卡号不得为空", trigger: "blur" }
        ],
        cardNumber: [
          { required: true, message: "卡号不得为空", trigger: "blur" }
        ],
        deposit: [{ required: true, message: "押金不得为空", trigger: "blur" }],
        remarks: [{ required: true, message: "备注不得为空", trigger: "blur" }]
      },
      hide: false, // 是否带密码输入框
      juge: false, //卡号禁用
      supplyCost: 0,
      logOut: {
        fkCardNumber: "",
        remarks: ""
      },
      tableLoading:true
    };
  },
  computed: {
    searchTimeForm() {
      if (this.searchData) {
        switch (this.searchData / 1) {
          case 0:
            console.log("卡号");
            this.selectSearchForm.cardNumber = this.searchForm.searchData;
            break;
          case 1:
            console.log("用户名");
            this.selectSearchForm.name = this.searchForm.searchData;
            break;
          case 2:
            console.log('等级名称')
            this.selectSearchForm.gradeName = this.searchForm.searchData;
            break;

        }
      } else {
        console.log("为空");
        this.selectSearchForm.name = "";
        this.selectSearchForm.cardNumber = "";
      }
      let obj = {
        name: this.selectSearchForm.name,
        cardNumber: this.selectSearchForm.cardNumber,
        gradeName: this.selectSearchForm.gradeName,
        state: this.searchForm.state,
        currentPage: 1,
        pageSize: this.pageSize
      };
      return obj;
    },
    addTimeForm() {
      // 登记卡数据
      let obj = {
        cardNumber: this.changeForm.idCard
      };
      return obj;
    },
    supplyTimeForm() {
      // 补卡数据
      let obj = {
        // 新卡号 旧卡号
        newCardNumber: this.changeForm.idCard,
        cardNumber: this.changeForm.cardNumber,
        reissueCost: this.supplyCost,
        id: this.changeForm.id
      };
      return obj;
    },
    // 押金充值
    rechargeForm() {
      let obj = {
        deposit: this.changeForm.deposit,
        cardNumber: this.changeForm.cardNumber,
        operationPassword: this.changeForm.password,
        remarks: this.changeForm.remarks
      };
      return obj;
    },
    // 挂失和取消挂失
    lostTimeForm() {
      let obj = {};
    }
  },
  mounted(){
    $('#gradeName').fadeOut()
    $('#state').fadeOut()
  },
  methods: {
    selectCheck(val) {
      console.log("val", val);
      this.searchForm.searchData=""
      for(const index in this.selectSearchForm){
        this.selectSearchForm[index]=""
      }
      this.searchData = val;
    },
    jumpBtn() {
      // v-mode绑定好像会默认转数据类型
      let page = Math.ceil(this.total / this.pageSize);
      page == 0 ? 1 : page;
      if (this.pageInput > page || this.pageInput == "" || this.pageInput < 0) {
        this.pageInput = 1;
        this.$nextTick(() => {
          this.$refs.text.value = 1; // hack方法
          console.log("Vmode绑定值", this.pageInput);
        });
      } else {
        this.pageInput = parseInt(this.pageInput);
        this.$refs.text.value = parseInt(this.pageInput);
        let num = parseInt(this.pageInput);
        this.current_change(num);
      }
    },
    /*====== 2.0 启动按钮组 ======*/
    depositBtn() {
      this.i = 4;
      this.juge = false;
      this.changeFormDialog = true;
    },
    // 全选按钮
    selectAllBtn(val) {
      this.Allseclet = val;
      console.log("全选后的数据", this.Allseclet);
    },
    // 批量删除按钮
    deleteBtn() {
      this.deleteParams = [];
      if (this.Allseclet.length) {
        this.i = 1;
        let arr = this.Allseclet;
        console.log(arr);
        for (let item of arr) {
          this.deleteParams.push({ id: item.id });
        }
        console.log("删除数据", this.deleteParams);
        this.deleteDialog = true;
      } else {
        this.$message.error("请先选择删除对象");
      }
    },
    // 登记读者卡按钮
    addCardBtn() {
      this.i = 1;
      console.log("111");
      this.changeFormDialog = true;
    },
    // 查询按钮
    searchBtn() {
      this.searchTable(this.searchTimeForm);

      console.log("当前查询", this.searchTimeForm);
    },
    // 充值快捷按钮
    rechargeBtn(index, row) {
      this.i = 4;
      this.hide = false;
      this.juge = true;
      this.changeForm.cardNumber = row.cardNumber;
      console.log(row);
      this.changeFormDialog = true;
    },
    // 补办读者卡
    supply(index, row) {
      if (row.state === 0) {
        this.$message.error("请先对卡进行挂失处理再补办");
      } else {
        this.i = 0;
        this.changeForm.cardNumber = row.cardNumber;
        this.changeForm.id = row.id;
        this.changeFormDialog = true;
      }

      console.log(index, row, this.changeForm);
    },
    // 挂失按钮
    lostBtn(index, row) {
      let obj = {};
      obj.cardNumber = row.cardNumber;
      console.log(index, row); //
      if (row.state == 0) {
        this.loseApi(obj);
      } else {
        this.cancelLoseApi(obj);
      }
    },
    // 注销按钮
    logoutBtn(index, row) {
      this.logOut.fkCardNumber = "";
      this.logOut.remarks = "";
      this.logOut.fkCardNumber = row.cardNumber;

      this.deleteDialog = true;
      //.this.logoutApi(this.logOut);
    },
    /*====== 弹框相关按钮 ======*/

    //
    subDelete() {
      this.logoutApi(this.logOut, "deleteDialog");
      console.log("挂失补办触发");
    },
    // 登记读者卡 补办卡弹框确定按钮
    submitForm(formName, dialogName) {
      let flag = this.i;
      console.log(flag);
      this.$refs[formName].validate(valid => {
        if (valid) {
          switch (flag) {
            case 0:
              this.suppleApi(this.supplyTimeForm, dialogName);
              console.log("补办卡API");
              break;
            case 1:
              this.registerApi(this.addTimeForm, dialogName);
              console.log("登记读者卡API");
              break;
            case 4:
              this.depositApi(dialogName);
              console.log("押金充值API");
              break;
          }
          this.changeFormDialog = true; // 关闭弹框
        } else {
          return false;
        }
      });
    },
    // 登记读者卡 补办卡取消按钮
    resetForm(formName, dialogName) {
      this.$refs[formName].resetFields();
      this[dialogName] = false;
    },
    // 弹框关闭的时候执行 清空数据
    closeForm(formName) {
      this.$refs[formName].resetFields();
      let obj = this.changeForm;
      for (let i in obj) {
        obj[i] = "";
      }
    },
    // 分页查询按钮
    current_change: function(currentPage) {
      this.currentPage = currentPage; //点击第几页
      this.paginationForm.currentPage = currentPage;
      //console.log('保存当前查询',this.paginationForm);
      this.pagationTable(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
    },
    // 办卡按钮
    conductBtn() {
      this.$router.push({ path: "/getCard" });
    },
    // 检查输入金额
    jugeCash() {
      this.cashJugeApi();
    },
    /*====== API部分 ======*/
    pagationTable(data) {
      console.log("记录查询", this.searchTimeForm);
      this.tableLoading=true
      axios
        .get(cardInfoInt.select, {
          params: data
        })
        .then(res => {
          if (res.data.state === true) {
            console.log(res);
            // 获取数据进行过滤
            this.tableData = res.data.row;
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, data);
            this.tableLoading=false
            console.log("保存当前查询", this.paginationForm);
          } else {
            this.$message.error(res.data.msg);
            this.tableLoading=false
          }
        });
    },
    // 查询功能API 这里区别就是需要table数组接收 可以单独封装
    searchTable(data) {
      console.log("初始化查询", this.searchTimeForm);
      this.tableLoading=true
      axios
        .get(cardInfoInt.select, {
          params: data
        })
        .then(res => {
          if (res.data.state === true) {
            console.log(res);
            // 获取数据进行过滤
            this.tableData = res.data.row;
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, data);
            console.log("保存当前查询", this.paginationForm);
            this.currentPage = 1;
            this.tableLoading=false
          } else {
            this.$message.error(res.data.msg);
            this.tableLoading=false
          }
        });
    },
    // 类型API

    // 等级API
    searchOption() {
      axios.get(cardInfoInt.option).then(res => {
        if (res.data.state === true) {
          this.optionsDataType = res.data.row;
          console.log("等级下拉框数据", res);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 登记读者卡API
    registerApi(data, dialogName) {
      console.log("提交的数据", data);
      axios.post(cardInfoInt.cogradient, data).then(res => {
        if (res.data.state === true) {
          this.$message.success("执行成功");
          this.searchTable();
          this[dialogName] = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 金额判断API
    cashJugeApi() {
      axios
        .post(rechargeInt.juge, {
          deposit: this.changeForm.deposit
        })
        .then(res => {
          console.log(res);
          if (res.data.state && res.data.code == 302) {
            this.$message.warning(res.data.msg);
            this.hide = true;
          } else {
            this.hide = false;
          }
        });
    },
    //押金充值
    depositApi(dialogName) {
      let value = this.rechargeForm;
      this.axios.post(rechargeInt.deposit, value).then(res => {
        console.log(res);
        if (res.data.state === true) {
          this.$message.success("执行成功");
          this.searchTable();
          this[dialogName] = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 注销API
    logoutApi(data, dialogName) {
      axios.post(rechargeInt.logout, data).then(res => {
        if (res.data.state === true) {
          this.$message.success("执行成功");
          this.searchTable();
          this[dialogName] = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 补办API
    suppleApi(data, dialogName) {
      console.log("提交的数据", data);
      axios.put(rechargeInt.supply, data).then(res => {
        if (res.data.state === true) {
          this.$message.success("执行成功");
          this.searchTable();
          this[dialogName] = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 取挂与挂失API
    loseApi(data) {
      axios.put(rechargeInt.lose, data).then(res => {
        if (res.data.state === true) {
          this.$message.success(res.data.msg);
          this.searchTable();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    cancelLoseApi(data) {
      axios.put(rechargeInt.cancelLost, data).then(res => {
        if (res.data.state === true) {
          this.$message.success(res.data.msg);
          this.searchTable();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // ???
    operateApi(data) {
      axios.put(cardInfoInt.cardReport, data).then(res => {
        console.log(res);
        if (res.data.state === true) {
          this.$message.success("操作成功");
          this.searchTable();
          this.deleteDialog = false;
          console.log(res);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 补办费用 数据字典
    supplyCashApi() {
      axios.get(bookWordInt.search).then(res => {
        console.log("接收的数据", res);
        if (res.data.state) {
          this.supplyCost = res.data.row.setReissueCost;
          console.log("补卡费用", this.supplyCost);
        } else {
          // this.$message.error(res.data.msg);
        }
      });
    }
  },
  created() {
    this.searchOption();
    this.supplyCashApi();
    this.searchTable(this.searchTimeForm);
  }
};
</script>
<style scoped>
/*====== 0.0 初始化部分 ======*/
.routerBox {
  background-color: #fff;
  min-height: 70px;
  width: 100%;
  padding: 0 30px;
  align-items: center;
  display: flex;
  box-sizing: border-box;
}
.routerButton {
  margin-right: 30px;
}
.space {
  background-color: #ebf7ff;
  height: 30px;
}
.box-card {
  background-color: #fff;
  box-sizing: border-box;
}
.important {
  padding: 30px;
}
/* 1.0标题 通用部分 */
.sonTitle {
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
.useradd {
}
.useradd .box-card {
  width: 100%;
}
.text {
  font-size: 14px;
}
/* 清楚浮动 */
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
/*====== 2.0表单区域 ======*/
/* 可以通过size属性添加一个classname */

.el-form--inline .el-form-item {
  margin-right: 10px;
}
.el-form--inline .el-form-item:last-child {
  margin-right: 0;
}
.el-input.el-input--120 {
  width: 160px;
}
.el-input.el-input--120 input {
  height: 36px;
  line-height: 36px;
}
.el-input.el-input--160 {
  width: 160px;
}
.el-range-editor--130 {
  width: 300px;
}
.el-select.el-select--160 {
  width: 160px;
}
.el-button--15 {
  padding: 12px 29px;
}
/* 按钮 */
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
.buttonBox .delete {
  background: rgba(255, 92, 60, 1);
  border-radius: 10px;
}
.buttonBox .delete .deleteIcon {
  margin-right: 6px;
}
/*====== 3.0表格区域 ======*/
.item {
  margin-bottom: 50px;
}
.tablebox .tableBorder {
  border: 1px solid #ebeef5;
  border-bottom: none;
  font-size: 16px;
}
/* 操作表格区 表格列添加样式名是无效的 */
.imgDefault {
  width: 30px;
  height: 30px;
  display: inline-block;
  border-radius: 50%;
  background-color: #333;
}
.operator {
}
.edit {
  color: #00d7f0;
  cursor: pointer;
  margin-right: 20px;
}
.ban {
  color: #ff5c3c;
  cursor: pointer;
  margin-right: 20px;
}
.edit1 {
  color: #00d7f0;
  cursor: pointer;
}
/*====== 4.0 分页器区域 ======*/
.pagination .el-pagination {
  display: flex;
  justify-content: center;
}

/*====== 后期频繁更改部分 ======*/
.routerButton {
  position: relative;
  text-align: left;
  padding-left: 20px;
}
.Iconerror {
  position: absolute;
  width: 12px;
  height: 12px;
  font-size: 16px;
  color: #fff;
  right: 20px;
}
.labelActive {
  background-color: #0096ff;
  color: #fff;
  border: none;
}
/*====== 弹框相关部分 后期可能更新为全局通用样式 ======*/
.mask {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 2;
  background: rgba(0, 0, 0, 1);
  opacity: 0.5;
}
.addDialog {
  width: 685px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin-top: 0 !important;
  border-radius: 20px;
  z-index: 5;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: none;
}
.addDialog .dialogTitle {
  height: 80px;
  background-color: #0096ff;
  text-align: center;
  line-height: 80px;
  color: #fff;
  font-size: 26px;
  position: relative;
}
.addDialog .close {
  position: absolute;
  color: #fff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;
  top: 25px;
  right: 30px;
  font-size: 16px;
  cursor: pointer;
}
.addDialog .dialogBody {
  background: #fff;
  padding-top: 30px;
}
.addDialog .dialog-footer {
  padding-bottom: 46px;
}
/*Vue过渡动画*/
/*遮罩过渡*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
/*过渡的状态 即过渡的关键帧打那些*/
.dialog-enter-active,
.dialog-leave-active {
  transition: all 0.3s;
}
.dialog-enter, .dialog-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  top: 47%;
}
/*row排列*/
.row1 {
  display: flex;
  padding: 0 30px;
}
.row1 .el-form-item {
  margin-bottom: 30px;
}
.row1.el-input .el-input__inner {
  width: 200px;
}
.upload {
  display: flex;
  justify-content: center;
}
.upload .defultHead {
  position: relative;
}
.defultHead:hover .bgload {
  display: block;
}
.bgload {
  background-color: rgba(0, 0, 0);
  position: absolute;
  top: 0;
  text-align: center;
  line-height: 100px;
  z-index: 3;
  opacity: 0.7;
  cursor: pointer;
  display: none;
  color: #fff;
}
.defultImg {
  position: absolute;
  z-index: 1;
}
.preloadImg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  text-align: center;
  line-height: 100px;
}
</style>
<style>
.readerCard {
}
.readerCard form.el-form {
  flex-direction: column;
}
.readerCard .el-input .el-input__inner {
  width: 100%;
}
.readerCard .el-form-item__content {
  display: flex;
  justify-content: center;
}
.readerCard .el-select {
  width: 100%;
}
.readerCard .el-form-item.select {
  width: 260px;
  margin-left: 0;
}
.readerCard .selectBan {
  display: flex;
}
.readerCard .selectBan .el-form-item__content {
  display: block;
}
.readerCard .el-button:last-child {
  margin-right: 0px;
}
.reader-card .forbid .el-dialog__body {
  border-radius: 0px 0px 20px 20px;
}
</style>

