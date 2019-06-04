<template>
  <div class="borrowbook">
    <div
      class="title"
      style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px"
    >
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">借书</div>
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
        <!--书籍查询相关 -->
        <section class="bookSearchBox">
          <div class="bookSearch">
            <div class="searchBox">
              <el-form
                :label-position="labelPosition"
                label-width="80px"
                :model="searchForm"
                clearable
                ref="searchForm"
                :rules="rules"
              >
                <el-form-item label="书籍编码:" prop="bookCode">
                  <el-input
                    placeholder="请输入书籍编码"
                    v-model="searchForm.bookCode"
                    class="input-with-select"
                    @keyup.enter.native="selectBtn"
                  >
                    <el-select v-model="searchForm.selectBook" slot="prepend" placeholder="请选择">
                      <el-option label="书籍" value="1"></el-option>
                      <el-option label="期刊" value="2"></el-option>
                    </el-select>
                    <el-button
                      type="primary"
                      slot="append"
                      icon="el-icon-search"
                      @click="selectBtn"
                    ></el-button>
                  </el-input>
                </el-form-item>
              </el-form>
              <!--
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  style="height: 36px;width: 100px;padding-top:10px;margin-left: 15px"
                  @click="selectBtn"
                >确定</el-button>
              -->
            </div>
          </div>
          <div class="borrowTableBox">
            <section class="text item tablebox">
              <el-table
                class="tableBorder"
                :data="borrowTableData"
                style="text-align:center;"
                :row-style="rowStyle"
                max-height="250"
                height="250"
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
              >
                <el-table-column align="center" label="序号" width="80" type="index"></el-table-column>
                <el-table-column align="center" width="100" prop="name" label="书籍名称"></el-table-column>
                <el-table-column
                  align="center"
                  width="200"
                  prop="code"
                  label="书籍编码"
                ></el-table-column>
                <el-table-column
                  align="center"
                  width="100"
                  prop="fkTypeName"
                  label="书籍类型"
                ></el-table-column>
                <el-table-column align="center" prop="author" label="作者"></el-table-column>
                <el-table-column align="center" fixed="right" width="100" label="操作">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      @click="removeBtn(scope.$index, scope.row)"
                    >移除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </section>
            <div class="buttonBox">
              <el-button type="primary" size="120" @click="sellBtn">借书</el-button>
              <el-button type="warning" size="120" @click="reset">重新扫描</el-button>
            </div>
          </div>
        </section>
      </div>
      <!-- tab选项卡 -->

      <div class="tabMode">
        <el-tabs v-model="activeName" @tab-click="tabBtn">
          <el-tab-pane label="借阅结果" name="first">
            <section class="endTable">
              <el-table
                class="tableBorder"
                :data="endTable"
                style="width: 100%; text-align:center;"
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
              >
                <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
                <el-table-column align="center" prop="bookName" label="书籍名称"></el-table-column>
                <el-table-column
                  align="center"
                  prop="libraryBookCode"
                  :show-overflow-tooltip="true"
                  label="书籍编码"
                ></el-table-column>
                <el-table-column align="center" prop="start" label="借书开始时间"></el-table-column>
                <!-- <el-table-column align="center" prop="end" label="预计书籍归还时间"></el-table-column> -->
                <el-table-column align="center" prop="state" label="借书状态">
                  <template slot-scope="scope">
                    <span>{{scope.row.state ===0?'借书失败':'借书成功'}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="reason" label="原因"></el-table-column>
              </el-table>
            </section>
          </el-tab-pane>
          <el-tab-pane label="待归还书籍" name="second">
            <section class="endTable">
              <el-table
                class="tableBorder"
                :data="oweTable"
                style="width: 100%; text-align:center;"
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
              >
                <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
                <el-table-column align="center" prop="bookName" label="书籍名称"></el-table-column>
                <el-table-column
                  align="center"
                  prop="libraryBookCode"
                  :show-overflow-tooltip="true"
                  label="书籍编码"
                ></el-table-column>
                <el-table-column align="center" prop="createTime" label="借书开始时间"></el-table-column>
                <el-table-column align="center" prop="planReturnTime" label="预计书籍归还时间"></el-table-column>
                <el-table-column align="center" prop="renewCount" label="续借次数"></el-table-column>
                <!-- <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="renewBtn(scope.row)" type="text" size="small">续借</el-button>
                    <el-button @click="damageBtn(scope.row)" type="text" size="small">报损</el-button>
                  </template>
                </el-table-column> -->
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
                <el-table-column align="center" type="index" width="80" label="序号"></el-table-column>
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
      borrowTableData: [],
      codeData: [],
      rowStyle: {
        height: "60px"
      },
      activeName: "first",
      tabFlag: false,
      tabCard: {},
      lastCardNum:'',
      /*------ 用户信息 ------*/
      userTable: [],
      /*------ 借书结果配置 ------*/
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
    submitTimeForm() {
      let arr = [];
      let map = this.borrowTableData;
      for (let item of map) {
        let pbj = {};
        pbj.libraryBookCode = item.code;
        pbj.bookName = item.name;
        pbj.fkTypeName = item.fkTypeName;
        pbj.fkTypeCode = item.fkTypeCode;
        arr.push(pbj);
      }
      let obj = {
        cardNum: this.lastCardNum,
        list: arr
      };
      return obj;
    }
  },
  methods: {
    // 搜索功能
    selectBtn() {
      if (this.searchForm.selectBook == "1") {
        this.codeSearchApi(this.searchTimeForm);
      } else {
        console.log("现在调用的是期刊API");
      }
    },
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
    // 借书按钮
    sellBtn() {
      this.operateApi(this.submitTimeForm);
    },
    // 移除按钮
    removeBtn(index, row) {
      console.log(index);
      this.borrowTableData.splice(index, 1);
    },
    // 重新扫描 已节流 关键在于函数的自运行和 var的作用域
    reset() {
      var now = +new Date();
      console.log("相差的时间", now - this.last);
      if (now - this.last > 10000) {
        console.log("函数节流");
        this.wsValue.send("reset");
        this.borrowTableData = [];
        this.last = now;
      }
      //console.log(this.wsValue);
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
    renewBtn(row) {
      this.$confirm("是否续借该书?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "续借成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消操作"
          });
        });
    },
    // 报损按钮
    damageBtn(row) {},
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
          
          console.log("查询成功的读者卡号", data, this.tabFlag);
          console.log("用户信息", this.userTable);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 通过RFID换取数据
    RfidApi(data) {
      axios
        .get(borrowInt.selectRfid, {
          params: data
        })
        .then(res => {
          console.log(res);
          if (res.data.state === true) {
            let obj = res.data.row;
            // 数组去重
            const isExist = this.borrowTableData.some(item => {
              return item.libraryBookCode === obj.libraryBookCode;
            });
            if (!isExist) {
              this.borrowTableData.push(obj);
              console.log("现在的数据", this.borrowTableData);
            } else {
              this.$message.error("已选中该书");
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 通过编号换取数据
    codeSearchApi(data) {
      axios
        .get(borrowInt.selectCode, {
          params: data
        })
        .then(res => {
          console.log(res);
          if (res.data.state === true) {
            let obj = res.data.row;
            console.log(
              "搜索出来的数据",
              this.borrowTableData,
              "接收的数据",
              obj[0].code
            );
            // some不执行console.log
            const isExist = this.borrowTableData.some(item => {
              return item.code === obj[0].code;
            });
            console.log(isExist);
            if (!isExist) {
              this.borrowTableData.push(obj[0]);
              console.log("现在的数据", this.borrowTableData);
            } else {
              this.$message.error("已选中该书");
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 借书数据API
    operateApi(data) {
      console.log("传递的数据", this.submitTimeForm);
      axios.post(bookOperateInt.borrow, data).then(res => {
        if (res.data.state === true) {
          console.log("借书记录", res.data.row);
          this.endTable = res.data.row.list;
          this.$message.success("操作完成");
          console.log("现在的借书机理", this.endTable);
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
    // 续借API
    renewApi(){

    },
    /*------ websocket区域 ------*/
    // 建立websocket连接
    init(url) {
      var ws = new WebSocket(url);
      let that = this;
      ws.onopen = e => {
        ws.send("connect");
        console.log("连接成功");
      };
      ws.onmessage = e => {
        this.message = e.data;
        // IC卡匹配过滤
        let result = /^IC/.test(e.data);
        let notice = /'error'/.test(e.data);

        if (notice) {
          this.$message.error("连接串口已断开");
        }
        if (result) {
          let now = e.data.replace(/^IC/, "");
          console.log("IC卡", now);
          this.searchForm.cardNum = e.data.replace(/^IC/, "");
          console.log();
        } else {
          let obj = {};
          obj.rfid = e.data.replace(/\s+/g, "");
          this.RfidApi(obj);
        }

        console.log("接收数据", e.data);
      };
      ws.onclose = e => {
        console.log("连接关闭");
      };
      ws.onerror = e => {
        console.log("出错情况");
      };
      return ws;
    },

    // 数据过滤

    /*------ 多余的函数 ------*/
    // 重新连接
    reconnect() {
      var that = this;
      if (this.reconnectStatus) {
        return;
      }
      that.reconnectStatus = true;
      if (that.timeoutnum) {
        clearTimeout(that.timeoutnum);
      }
      that.timeoutNum = setTimeout(() => {
        that.wsValue = that.init("ws://127.0.0.0:7181");
        that.reconnectStatus = false;
      }, 5000);
      //that.timeoutnum && clearTimeout(that.timeoutnum);可读性极差
    },
    // 心跳开始
    webstart() {
      var self = this;
      // 检测定时器是否存在 清除定时器
      self.timeoutObj && clearTimeout(self.timeoutObj);
      self.serverTimeOutObj && clearTimeout(self.serverTimeOutObj);
      self.timeoutObj = setTimeout(res => {
        if (self.wsValue.readyState == 1) {
          self.wsValue.send("heartcheck");
        } else {
          self.reconnect();
        }
        // 超时关闭
        self.serverTimeOutObj = setTimeout(res => {
          self.wsValue.close();
        }, self.timeout);
      }, self.timeout);
    },
    // 心跳重置
    webreset() {
      var that = this;
      clearTimeout(that.timeoutObj);
      clearTimeout(that.serverTimeOutObj);
      that.start();
    }
    // 数组去重其一
  },
  created() {
    this.wsValue = this.init("ws://127.0.0.1:7181");
  },
  destroyed() {
    this.wsValue.close();
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
