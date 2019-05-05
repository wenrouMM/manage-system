<template>
  <div class="borrowbook">
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">还书</div>
    </div>
    <div style="width: 100%;margin-top: 75px">
      <section style="width:400px;height: 200px;margin:0 auto">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="searchForm"
          ref="searchForm"
          :rules="rules"
        >
        <!--
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="searchForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="卡号" prop="cardNum">
            <el-input v-model="searchForm.cardNum" placeholder="请输入卡号"></el-input>
          </el-form-item>
          -->
          <el-form-item label="书籍编码" prop="bookCode">
            <el-input v-model="searchForm.bookCode" style="width: 200px" placeholder="请输入书籍编码"></el-input>
            <el-button
              type="primary"
              style="height: 36px;width: 100px;padding-top:10px;margin-left: 15px"
              @click="selectBtn"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </section>
      <section class="text item tablebox">
        <el-table
          class="tableBorder"
          @selection-change="allSelect"
          :data="tableData"
          style="width:1000px;margin:0 auto; text-align:center;"
          :row-style="rowStyle"
          :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
        >
          <el-table-column width="100" align="center" type="index" label="序号"></el-table-column>
          <el-table-column align="center" prop="bookName" width="200" label="书籍名称"></el-table-column>
          <el-table-column align="center" prop="libraryBookCode" label="书籍编码"></el-table-column>
          <el-table-column align="center" prop="fkTypeName" width="200" label="书籍类型"></el-table-column>
          <el-table-column align="center" prop="author"  label="作者"></el-table-column>
        </el-table>
      </section>
      <div class="buttonBox">
        <el-button type="primary" size="120" @click="sellBtn" style="margin-top: 50px;">还书</el-button>
        <el-button type="warning" size="120" @click="reset">重新扫描</el-button>
      </div>
      <div>{{message}}</div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { bookOperateInt, borrowInt } from "../../../request/api/base.js";
export default {
  data() {
    return {
      message: "",
      labelPosition: "right",
      searchForm: {
        
        //userName: "",
        cardNum: "",
        
        bookCode: ""
      },
      rules: {
        // 添加的参数验证
        /*
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        
        cardNum: [{ required: true, message: "请选择卡号", trigger: "blur" }]
        */
      },
      tableData: [],
      codeData: [],
      rowStyle: {
        height: "60px"
      },
      /*------ websocket配置 ------*/
      wsValue: null,
      last:0
    };
  },
  computed: {
    searchTimeForm() {
      let obj = {
        libraryBookCode: this.searchForm.bookCode
      };
      return obj;
    },
    submitTimeForm() {
      let obj = {
        
        // name: this.searchForm.userName,
        // cardNum: this.searchForm.cardNum,
        
        list: this.tableData
      };
      return obj;
    }
  },
  methods: {
    // 搜索功能
    selectBtn() {
      this.codeSearchApi(this.searchTimeForm);
    },
    allSelect(val) {
      console.log("被选择的数据", val);
    },
    // 借书按钮
    sellBtn() {
      this.operateApi(this.submitTimeForm);
    },
    //
    // 重新扫描 已节流 关键在于函数的自运行和 var的作用域
    reset() {
      var now = +new Date();
      console.log("相差的时间", now - this.last);
      if (now - this.last > 10000) {
        console.log('函数节流')
        this.wsValue.send("reset");
        this.tableData = [];
        this.last = now;
      }
      //console.log(this.wsValue);
    },
    /*------ API区 ------*/
    // websocker获取RFID

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
            const isExist = this.tableData.some(item => {
              return item.libraryBookCode === obj.libraryBookCode;
            });
            if (!isExist) {
              this.tableData.push(obj);
              console.log("现在的数据", this.tableData);
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
            const isExist = this.tableData.some(item => {
              return item.libraryBookCode === obj.libraryBookCode;
            });
            if (!isExist) {
              this.tableData.push(obj);
              console.log("现在的数据", this.tableData);
            }
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 还书数据API
    operateApi(data) {
      console.log("传递的数据", this.submitTimeForm);
      axios.post(bookOperateInt.sell, data).then(res => {
        if (res.data.state === true) {
          console.log("返回的数据", res.data.row);
          let obj = JSON.stringify(res.data.row);
          localStorage.setItem("return", obj);
          console.log("我路由跳转呢？");
          let cardNum = this.searchForm.cardNum;
          this.$router.push({
            path: `/returnstatus`,
          });
        } else {
          this.$message.error(res.data.msg);
        }
      });
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
        let result = /^IC/.test(e.data)
        if(result){
          this.searchForm.cardNum = e.data.replace(/^IC/,"")
        } else{
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
.borrowbook {
  width: 100%;
  background-color: white;
  min-height: 852px;
}
.tablebox {
}
.tablebox .tableBorder {
  border: 1px solid #ebeef5;
  border-bottom: none;
  font-size: 16px;
}
.el-button--120 {
  width: 120px;
  border-radius: 6px;
}
.buttonBox {
  text-align: center;
}
</style>

