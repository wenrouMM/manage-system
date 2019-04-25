<template>
  <div class="borrowbook">
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">借书</div>
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
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="searchForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="卡号" prop="cardNum">
            <el-input v-model="searchForm.cardNum" placeholder="请输入卡号"></el-input>
          </el-form-item>
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
        </el-table>
      </section>
      <div class="buttonBox">
        <el-button type="primary" size="120" @click="sellBtn" style="margin-top: 50px;">借书</el-button>
        <el-button type="warning" size="120" @click="reset">重新扫描</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { bookOperateInt, borrowInt } from "../../../request/api/base.js";
export default {
  data() {
    return {
      labelPosition: "right",
      searchForm: {
        userName: "",
        cardNum: "",
        bookCode: ""
      },
      rules: {
        // 添加的参数验证
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        cardNum: [{ required: true, message: "请选择卡号", trigger: "blur" }]
      },
      tableData: [],
      codeData: [],
      rowStyle: {
        height: "60px"
      },
      wsValue: null
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
        name: this.searchForm.userName,
        cardNum: this.searchForm.cardNum,
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

    // 重新扫描
    reset() {
      this.tableData = [];
    },
    /*------ API区 ------*/
    // 建立websocket连接
    init(url) {
      let ws = new WebSocket(url);
      ws.onopen = e => {
        console.log("连接成功");
      };
      ws.onmessage = e => {
        console.log("接收数据", data);
      };
      ws.onclose = e => {
        console.log("页面关闭");
      };
      ws.onerror = e => {
        console.log("出错情况");
      };
      return ws;
    },
    // websocker获取RFID

    // 通过RFID换取数据

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
            if(!isExist){
              this.tableData.push(obj);
              console.log("现在的数据", this.tableData);
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
          console.log("返回的数据", res.data.row);
          let obj = JSON.stringify(res.data.row);
          localStorage.setItem("borrow", obj);
          console.log("我路由跳转呢？");
          let cardNum = this.searchForm.cardNum;
          this.$router.push({ path: `/borrowingstatus`, query: { Num: cardNum} });
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
    // 数组去重其一
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

