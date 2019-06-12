<template>
  <div class="damageBook">
    <div
      class="title"
      style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px"
    >
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">书籍报损</div>
    </div>
    <div class="borrowMode">
      <div class="borrowBox">
        <!--卡号查询相关 -->
        <section class="userInfoBox">
          <div class="searchCard">
            <div class="inputBox">
              <el-form
                :label-position="labelPosition"
                label-width="80px"
                :model="searchForm"
                ref="searchForm"
                :rules="rules"
                @submit.native.prevent
              >
                <el-form-item label="卡　　号" prop="cardNum">
                  <el-input
                    @keyup.enter.native="readCardBtn"
                    clearable
                    v-model="searchForm.cardNum"
                    placeholder="请输入卡号"
                  >
                    <el-button
                      type="primary"
                      icon="el-icon-search"
                      slot="append"
                      @click="readCardBtn"
                      class="cardBtn"
                    >读卡</el-button>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div v-if="!userTable.length"><img :src="loadingImg" class="loadingImg"></div>
          <div class="userInfo" v-if="userTable.length">
            <div class="headBox"><img :src="defaultImg" style="width:100%;height:100%;"></div>
            <div class="infoBox">
              <div class="info">
                <section class="left">
                  <p>读者姓名：{{userTable[0].cardFkReaderName}}</p>
                  <p>读者角色：{{userTable[0].cardGradeName}}</p>
                  <p>有效期限：{{userTable[0].cardExpireTime}}</p>
                  <p>可借本数：{{userTable[0].stillBorrowNumber}}</p>
                </section>
                <section class="right">
                  <p>读者性别：{{userTable[0].sex ==1?'男':'女'}}</p>
                  <p>读者状态：{{userTable[0].state}}</p>
                  <p>充值余额：{{userTable[0].cardGradeDeposit}}</p>
                </section>
              </div>
              <p class="manage">{{userTable[0].msg}}</p>
            </div>
          </div>
        </section>
        <!--报损相关 -->
        <section class="bookSearchBox">
          <div class="borrowTableBox">
            <section class="text item tablebox">
              <el-table
                class="tableBorder"
                :data="oweTable"
                style="text-align:center; width: 100%"
                :row-style="rowStyle"
                max-height="250"
                height="250"
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
              >
                <el-table-column align="center" label="序号" width="55" type="index"></el-table-column>
                <el-table-column align="center" width="200" prop="bookName" label="书籍名称"></el-table-column>
                <el-table-column
                  align="center"
                  prop="libraryBookCode"
                  :show-overflow-tooltip="true"
                  label="馆内码"
                ></el-table-column>
                <el-table-column align="center" width="200" prop="createTime" label="借书开始时间"></el-table-column>
                <el-table-column align="center" width="200" prop="planReturnTime" label="预计书籍归还时间"></el-table-column>
                <el-table-column align="center" width="100" prop="renewCount" label="续借次数"></el-table-column>
                <el-table-column align="center" fixed="right" width="150" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="damageBtn(scope.row,scope.index)" type="text" size="small">报损</el-button>
                    <el-button @click="removeBtn(scope.row,scope.index)" type="text" size="small">移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </section>
            <div class="buttonBox">
              <el-button type="primary" size="120" @click="batchDamageBtn">批量报损</el-button>
            </div>
          </div>
        </section>
      </div>
      <!-- tab选项卡 -->

      <div class="tabMode">
        <el-tabs v-model="activeName" @tab-click="tabBtn">
          <el-tab-pane label="报损结果" name="first">
            <section class="endTable">
              <el-table
                class="tableBorder"
                :data="endTable"
                style="width: 100%; text-align:center;"
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
              >
                <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
                <el-table-column align="center" prop="fkBookName" label="书籍名称"></el-table-column>
                <el-table-column align="center" prop="createTime" label="处理时间"></el-table-column>
                <el-table-column align="center" prop="state" label="处理金额">
                  <template>
                    <span>1</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="message" label="提示">
                  <template>
                    <span>------</span>
                  </template>
                </el-table-column>
              </el-table>
            </section>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 报损弹框 -->
      <div class="damageDialog">
        <el-dialog title="报损处理" @open="openForm" @close="closeForm" :visible.sync="damageDialog">
          <div class="formBox">
            <el-form ref="form" :rules="damageRules" :model="damageForm" label-width="100px">
              <div class="inputBox">
                <el-form-item prop="list" label="报损原因">
                  <el-select
                    clearable
                    value-key="id"
                    v-model="damageForm.list"
                    placeholder="请选择报损原因"
                  >
                    <el-option
                      v-for="(item,index) of this.optionsData"
                      :key="index"
                      :label="item.damageName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="赔偿金额">
                <div>{{cash}}</div>
              </el-form-item>
              <el-form-item prop="deal" label="当场处理">
                <el-radio-group v-model="damageForm.deal">
                  <el-radio label="1" value="1">是</el-radio>
                  <el-radio label="0" value="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="备　　注">
                <div class="textBox">
                  <el-input
                    size="medium"
                    resize="none"
                    type="textarea"
                    :rows="4"
                    v-model="damageForm.remarks"
                  ></el-input>
                </div>
              </el-form-item>
              <!-- <div class="textCenter anyBox">
                <el-button type="primary" @click="damageSubmit">确定</el-button>
                <el-button>取消</el-button>
              </div>-->

              <el-form-item>
                <el-button type="primary" @click="damageSubmit">确定</el-button>
                <el-button type="info" @click="cancelBtn">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { bookOperateInt, borrowInt, bookDamageInt } from "@request/api/base.js";
export default {
  name:'damage',
  data() {
    return {
      message: "",
      labelPosition: "left",
      searchForm: {
        cardNum: "",
        bookCode: "",
        selectBook: "1"
      },
      rules: {
        // 添加的参数验证
        cardNum: [{ required: true, message: "请填写卡号", trigger: "blur" }]
      },
      rowStyle: {
        height: "60px"
      },
      defaultImg:require('../../base/img/normalHead.jpg'),
      loadingImg:require('../../base/img/Nodata.png'),
      activeName: "first",
      /*------ 全选按钮 ------*/
      lastCardNum: "", // 读卡成功的读者卡
      tabFlag: false,
      tabCard: {}, // 用户卡号？
      /*------ 用户信息 ------*/
      userTable: [],
      /*------ 报损结果配置 ------*/
      endTable: [],
      /*------ 损坏列表配置 ------*/
      oweTable: [],
      /*------ 借阅历史记录 ------*/
      bookHistory: [],
      /*------ 报损表单 ------*/
      damageForm: {
        damageId: [],
        list: null, // 报损对象
        remarks: "",
        deal: "",
        bookId: [],
        bookCash: [] // 书籍价格
      },
      isBatch: false,
      deleteIndex: 0, // 删除数组
      damageRules: {
        deal: [
          { required: true, message: "请选择是否当场处理", trigger: "change" }
        ],
        list: [
          { required: true, message: "报损方式不得为空", trigger: "change" }
        ]
      },
      firstOpen: true,
      optionsData: [],
      damageDialog: false, // 弹框开启和关闭
      /*------ websocket配置 ------*/
      wsValue: null,
      reconnectStatus: false, // 是否重连
      timeout: 5 * 1000, // 心跳检测间隔
      timeoutObj: null, // 心跳间隔定时器
      serverTimeOutObj: null, // 服务器超时关闭定时器
      timeoutNum: null, // 重连定时器
      last: 0
    };
  },
  computed: {
    searchTimeForm() {
      let obj = {
        code: this.searchForm.bookCode
      };
      return obj;
    },
    cash() {
      if (this.damageForm.list != null) {
        var jude = this.damageForm.list.compensationType;
      } else {
        return (number = 0);
      }

      let number = 0;
      // 书籍按倍数赔偿 计算所有书籍总价即可
      let totalBook = 0;
      for (var item of this.damageForm.bookCash) {
        totalBook += item;
      }
      let allBook = 10;
      // 书籍按固定金额赔偿 计算总数量即可
      let bookAmount = this.damageForm.bookCash.length;
      // 按倍数赔偿
      switch (jude) {
        // 按倍数赔偿
        case 1:
          number = this.damageForm.list.compensationNum * totalBook;
          break;
        // 按固定金额赔偿
        case 0:
          number = this.damageForm.list.compensationNum * bookAmount;
          break;
        default:
          number = 0;
      }

      return number;
    },
    // 续借传递数据
    renewForm() {
      let obj = {
        cardnumber: this.lastCardNum,
        logids: this.renewBox
      };
      return obj;
    },
    damageTimeForm() {
      let obj = {
        damageId: this.damageForm.list.id,
        num: this.cash,
        remarks: this.damageForm.remarks,
        deals: this.damageForm.deal,
        bookId: this.damageForm.bookId,
        cardNum: this.lastCardNum
      };
      return obj;
    }
  },
  methods: {
    // 读卡按钮
    readCardBtn() {
      let value = this.searchForm.cardNum;
      let obj = {
        cardNum: value
      };
      console.log(value, "这是啥值啊");
      if (value) {
        this.readCardApi(obj);
      } else {
        this.$message.error("请输入读者卡号");
      }

      console.log("我就当你读卡了");
    },
    // 批量报损
    batchDamageBtn() {
      if (!this.firstOpen) {
        this.$refs.form.resetFields();
      }
      if (this.oweTable.length) {
        this.damageForm.bookCash = [];
        for (let item of this.oweTable) {
          this.damageForm.bookCash.push(item.price);
          this.damageForm.bookId.push(item.bookId);
        }
        this.isBatch = true;
        this.damageDialog = true;
      } else{
        this.$message.error('请先选择一条记录')
      }

      console.log("清除");
      console.log("此时的书籍", this.damageForm.bookCash);
    },
    cancelBtn() {
      this.damageDialog = false;
    },
    // tab切换功能
    tabBtn() {
      let value = this.tabFlag;
      let obj = this.tabCard;

      if (!value) {
        this.$message.error("请先填写读者卡号");
        return;
      }
      if (this.activeName == "second") {
        this.returnBookApi(obj);
      }
      if (this.activeName == "third") {
        this.historyApi(obj);
      }
      console.log(this.activeName);
    },
    // 损坏确定按钮
    damageSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.damageApi(this.damageTimeForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 报损按钮
    damageBtn(row, index) {
      if (!this.firstOpen) {
        this.$refs.form.resetFields();
      }
      this.damageForm.bookCash = [];
      this.damageForm.bookCash.push(row.price);
      this.damageForm.bookId.push(row.bookId);
      this.deleteIndex = index;
      this.damageDialog = true;
      this.isBatch = false;
      console.log(row);
      console.log("书籍价格", this.damageForm.bookCash);
    },
    removeBtn(row, index) {
      this.oweTable.splice(index, 1);
    },
    /*------ API区 ------*/
    // websocker获取RFID
    // 读卡APi
    readCardApi(data) {
      console.log("用户信息");
      axios.get(bookDamageInt.userInfo, { params: data }).then(res => {
        if (res.data.state === true) {
          this.userTable = res.data.row;
          this.tabCard = data;
          this.tabFlag = true;
          this.lastCardNum = this.searchForm.cardNum;
          this.returnBookApi(data);
          console.log("查询成功的读者卡号", data, this.tabFlag);
          console.log("用户信息", this.userTable);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 查询损坏方式API
    searchDamage() {
      axios.get(bookDamageInt.search).then(res => {
        if (res.data.state === true) {
          this.optionsData = res.data.row;
          console.log("损坏列表", res);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 报损Api
    damageApi(data) {
      console.log("啥数据", this.damageForm);
      console.log("数据传递", this.damageTimeForm);
      /* if (this.isBatch) {
        this.oweTable = [];
      } else {
        this.oweTable.splice(this.deleteIndex, 1);
      }
      this.damageDialog = false; */

      axios.post(bookDamageInt.damage, data).then(res => {
        if (res.data.state === true) {
          this.$message.success("报损成功 请前往报损记录查看");

          this.endTable = res.data.row;
          console.log("数据类型测试", typeof this.endTable[0].state);
          if (this.endTable[0].state === true) {
            console.log("比较测试");
          }
          if (this.isBatch) {
            this.oweTable = [];
          } else {
            this.oweTable.splice(this.deleteIndex, 1);
          }
          this.damageDialog = false;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 待归还Api
    returnBookApi(data) {
      axios.get(bookOperateInt.return, { params: data }).then(res => {
        if (res.data.state === true) {
          this.oweTable = res.data.row;
          console.log("待归还信息", this.oweTable);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 历史借阅Api
    historyApi(data) {
      axios.get(bookOperateInt.history, { params: data }).then(res => {
        if (res.data.state === true) {
          this.bookHistory = res.data.row;
          console.log("历史借阅记录", this.bookHistory);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    closeForm() {
      this.firstOpen = false;
      this.damageForm.bookId = [];
    },
    openForm() {
      this.damageForm.remarks = "";
    }
  },
  created() {
    this.searchDamage();
  }
};
</script>

<style scoped>
.title {
  margin-bottom: 36px;
}
.damageBook {
  width: 100%;
  background-color: white;
  min-height: 852px;
  overflow: auto;
}
.borrowMode {
  width: 1200px;
  margin: 0 auto;
}
.borrowBox {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
}
.userInfoBox {
  margin-right: 20px;
}
/*------ 读者卡信息搜索 ------*/
.searchCard {
  display: flex;
}
.searchCard .inputBox {
  width: 400px;
  margin-right: 30px;
}
.searchCard .btnBox {
  font-size: 0;
}
.userInfo {
  display: flex;
}
.userInfo .headBox {
  width: 118px;
  height: 136px;
  margin-right: 40px;
  background-color: antiquewhite;
}
.userInfo .infoBox .info {
  display: flex;
  margin-bottom: 20px;
}
.infoBox .info section p {
  margin-bottom: 23px;
  color: #878787;
  font-size: 14px;
}
.infoBox .info .left {
  margin-right: 60px;
}
.infoBox .manage {
  color: #0096ff;
  font-size: 14px;
}

/*------- 书籍搜索 ------*/
.bookSearch {
}
.bookSearch .searchBox {
  width: 480px;
}
.borrowTableBox {
}
.tablebox {
  width: 620px;
  height: 250px;
}
.tablebox .tableBorder {
  border: 1px solid #ebeef5;
  border-bottom: none;
  /*font-size: 16px;*/
}
.buttonBox {
  border: 1px solid #ebeef5;
  border-top: none;
  padding: 10px 0;
}
.el-button--120 {
  width: 120px;
  border-radius: 6px;
}
.buttonBox {
  text-align: center;
}
/*------ 书籍查看 ------*/
.endTable {
  border: 1px solid #ebeef5;
  border-top: none;
  border-bottom: none;
  box-sizing: border-box;
}
.textBox {
  width: 300px;
}
.text-align {
  text-align: center;
}
.inputBox {
  width: 300px;
}
.anyBox {
}
</style>

<style>
.damageBook .searchBox .el-select .el-input--suffix {
  width: 75px;
}
.damageDialog .el-dialog {
  width: 28%;
}
.damageDialog .formBox {
  width: 100%;
}
.damageBook .el-dialog__body {
  border-radius: 0 0 20px 20px;
}
.damageBook .inputBox .el-input__inner {
  width: 300px;
}
</style>
