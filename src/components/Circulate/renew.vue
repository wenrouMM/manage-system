<template>
  <div class="borrowbook">
    <div
      class="title"
      style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px"
    >
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">续借</div>
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
          <div v-if="!userTable.length">'没有数据啦'_(:з」∠)_</div>
          <div class="userInfo" v-if="userTable.length">
            <div class="headBox"></div>
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
        <!--待归还相关 -->
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
                @selection-change="selectAll"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column align="center" label="序号" width="55" type="index"></el-table-column>
                <el-table-column align="center" width="200" prop="bookName" label="书籍名称"></el-table-column>
                <el-table-column
                  align="center"
                  prop="libraryBookCode"
                  :show-overflow-tooltip="true"
                  label="书籍编码"
                ></el-table-column>
                <el-table-column align="center" width="200" prop="createTime" label="借书开始时间"></el-table-column>
                <el-table-column align="center" width="200" prop="planReturnTime" label="预计书籍归还时间"></el-table-column>
                <el-table-column align="center" width="100" prop="renewCount" label="续借次数"></el-table-column>
                <el-table-column align="center" fixed="right" width="100" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="damageBtn(scope.row)" type="text" size="small">报损</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </section>
            <div class="buttonBox">
              <el-button type="primary" size="120" @click="renewBtn">一键续借</el-button>
            </div>
          </div>
        </section>
      </div>
      <!-- tab选项卡 -->

      <div class="tabMode">
        <el-tabs v-model="activeName" @tab-click="tabBtn">
          <el-tab-pane label="续借结果" name="first">
            <section class="endTable">
              <el-table
                class="tableBorder"
                :data="endTable"
                style="width: 100%; text-align:center;"
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
              >
                <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
                <el-table-column align="center" prop="bookName" label="书籍名称"></el-table-column>
                <el-table-column align="center" prop="createTime" label="借书开始时间"></el-table-column>
                 <el-table-column align="center" prop="planReturnTime" label="预计书籍归还时间"></el-table-column> 
                <el-table-column align="center" prop="state" label="借书状态">
                  <template slot-scope="scope">
                    <span>{{scope.row.state === true?'续借成功':'续借失败'}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="message" label="提示">
                    <template slot-scope="scope">
                    <span>{{scope.row.state === true?'---':scope.row.message}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </section>
          </el-tab-pane>
          <el-tab-pane label="历史借阅记录" name="third">
            <section class="endTable">
              <el-table
                class="tableBorder"
                :data="bookHistory"
                style="width: 100%; text-align:center;"
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
              >
                <el-table-column align="center" type="index" width="60" label="序号"></el-table-column>
                <el-table-column align="center" prop="bookName" label="书籍名称"></el-table-column>
                <el-table-column
                  align="center"
                  prop="libraryBookCode"
                  :show-overflow-tooltip="true"
                  label="书籍编码"
                ></el-table-column>
                <el-table-column align="center" prop="createTime" label="借书开始时间"></el-table-column>
                <el-table-column align="center" prop="realityReturnTime" label="实际书籍归还时间"></el-table-column>
                <el-table-column align="center" prop="state" label="借书状态">
                  <template slot-scope="scope">
                    <span>{{scope.row.state ===0?'借书失败':'借书成功'}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="renewCount" label="续借次数"></el-table-column>
              </el-table>
            </section>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { bookOperateInt, borrowInt } from "@request/api/base.js";
export default {
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
        cardNum: [{ required: true, message: "请选择卡号", trigger: "blur" }]
      },
      codeData: [],
      rowStyle: {
        height: "60px"
      },
      activeName: "first",
      /*------ 全选按钮 ------*/
      lastCardNum:'',
      renewBox: [],// 续借按钮
      tabFlag: false,
      tabCard: {}, // 用户卡号？
      /*------ 用户信息 ------*/
      userTable: [],
      /*------ 续借结果配置 ------*/
      endTable: [],
      /*------ 未归还列表配置 ------*/
      oweTable: [],
      /*------ 借阅历史记录 ------*/
      bookHistory: [],
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
    // 续借传递数据
    renewForm() {
        let obj = {
            cardnumber:this.lastCardNum,
            logids:this.renewBox
        }
        return obj
    },
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
    // 全选按钮
    selectAll(val) {
      for (let item of val){
          this.renewBox.push(item.id)
      }
      console.log('续借结果',this.renewBox)
      console.log(val);
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
    // 续借按钮
    renewBtn() {
      this.renewApi(this.renewForm)
    },
    // 报损按钮
    damageBtn(row) {
        
    },
    /*------ API区 ------*/
    // websocker获取RFID
    // 读卡APi
    readCardApi(data) {
      console.log("用户信息");
      axios.get(bookOperateInt.userInfo, { params: data }).then(res => {
        if (res.data.state === true) {
          this.userTable = res.data.row;
          this.tabCard = data;
          this.tabFlag = true;
          this.lastCardNum = this.searchForm.cardNum
          this.returnBookApi(data);
          console.log("查询成功的读者卡号", data, this.tabFlag);
          console.log("用户信息", this.userTable);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 续借Api
    renewApi(data) {
      console.log("传递的数据", this.renewForm);
      axios.post(bookOperateInt.renew, data).then(res => {
        if (res.data.state === true) {
          console.log("续借记录", res.data.row);
          this.endTable = res.data.row
          console.log('数据类型测试',typeof(this.endTable[0].state))
          if(this.endTable[0].state === true){
              console.log('比较测试',)
          }
          
          this.$message.success("操作成功");
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
    }
    
  }
};
</script>

<style scoped>
.title {
  margin-bottom: 36px;
}
.borrowbook {
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
</style>

<style>
.borrowbook .searchBox .el-select .el-input--suffix {
  width: 75px;
}
</style>
