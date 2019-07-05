<template>
  <div class="refunds">
    <div class="commonMode headerbox">
      <div class="sonTitle">
        <span class="titleName">注销</span>
      </div>
      <span class="backBtn" @click="backBtn">
        <i class="el-icon-back mr_30"></i>返回充值管理
      </span>
    </div>
    <!-- 用户信息卡查询 -->
    <div class="cardData">
      <div class="selectForm">
        <p
          class="balance"
        >当前押金:￥{{this.cardData.balance==''|| this.cardData.balance == null?0:this.cardData.balance}}</p>
        <div class="searchBox">
          <span class="text mr_30">卡号：</span>
          <div class="inputBox">
            <el-input

              clearable
              placeholder="请输入卡号或身份证号"
              v-model="cardInput"
              class="input-with-select"
            >
              <el-button @click="readCardBtn" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>
        </div>
        <div class="cardTable">
          <div class="textBox mb_50">
            <p>
              用户名称 :
              <span>{{this.cardData.userName}}</span>
            </p>
            <p>
              用户性别 :
              <span>{{this.cardData.sex}}</span>
            </p>
            <p>
              读者角色 :
              <span>{{this.cardData.type}}</span>
            </p>
          </div>
          <div class="textBox">
            <p>
              注册日期 :
              <span>{{this.cardData.startTime.substring(0,10)}}</span>
            </p>
            <p>
              有效期限 :
              <span>{{this.cardData.vaildTime.substring(0,10)}}</span>
            </p>
            <p>
              读者状态 :
              <span>{{this.cardData.state}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <!--表单提交 -->
    <section class="entryBox">
      <div class="formBox">
        <el-form label-width="80px" label-position="left" ref="changeForm" :model="changeForm">
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" :rows="4" resize="none" v-model="changeForm.remarks"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="butonBox">
        <el-button type="info" @click="resetFormBtn" style="width: 150px">重置</el-button>
        <el-button type="primary" @click="rechargeBtn" style="width: 150px">注销</el-button>
      </div>
    </section>
    <div class="forbid collectionDelete">
      <el-dialog title="注销" :visible.sync="centerDialogVisible" width="400px" center>
        <div class="dialogBody">是否注销?</div>
        <div style="margin-bottom: 30px">
          <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
          <span class="dialogButton cancel" @click="cancelDialog">取消</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { finnaceInt } from "@request/api/base.js";
import axios from "axios";
export default {
  data() {
    return {
      centerDialogVisible: false,
      cardInput: "",
      lastCardNum: "", // 暂存卡号
      // 读者卡信息
      cardData: {
        userName: "",
        type: "",
        sex: "",
        startTime: "",
        vaildTime: "",
        state: "",
        balance: ""
      },
      readerData: {},
      hide: false,
      // 押金金额
      changeForm: {
        remarks: ""
      }
    };
  },
  computed: {
    rechargeForm() {
      let obj = {
        fkCardNumber: this.cardInput,
        remarks: this.changeForm.remarks
      };
      return obj;
    }
  },
  methods: {
    backBtn() {
      this.$router.push("/rechargeSet");
    },
    //查询读者卡信息
    readCardBtn() {
      this.lastCardNum = this.cardInput;
      let value = this.cardInput;
      for (let key in this.cardData) {
        this.cardData[key] = "";
      }
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

    resetFormBtn() {
      this.hide = false;
      this.$refs.changeForm.resetFields();
      console.log("重置冲冲冲");
    },
    //注销弹窗
    rechargeBtn() {
      if(this.cardInput){
        this.centerDialogVisible = true;
      }

    },
    //注销弹窗的确定按钮
    submitDialog() {
      this.depositApi();
    },
    //注销弹窗的取消按钮
    cancelDialog() {
      this.centerDialogVisible = false;
    },
    /*------ API ------*/
    // 调查读者卡信息
    readCardApi(data) {
      axios.get(finnaceInt.userInfo, { params: data }).then(res => {
        console.log("用户信息", res);
        if (res.data.state === true) {
          let data = res.data.row[0];
          this.cardData.userName = data.cardFkReaderName;
          this.cardData.sex = data.sex == 1 ? "男" : "女";
          this.cardData.type = data.cardGradeName;
          this.cardData.startTime = data.cardCreatTime;
          this.cardData.vaildTime = data.cardExpireTime;
          this.cardData.state = data.state;
          this.changeForm.deposit = data.cardGradeDeposit;
          this.cardData.balance = data.balance;

        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //注销充值
    depositApi() {
      let value = this.rechargeForm;
      this.axios.post(finnaceInt.logout, value).then(res => {
        console.log(res);
        if (res.data.state === true) {
          this.$message.success("注销成功,注销生成的记录可在财务管理内查看");
          this.cardInput = "";
          this.lastCardNum = "";
          let obj = this.cardData;
          for (var i in obj) {
            obj[i] = "";
          }
          this.centerDialogVisible = false;
          this.changeForm.remarks = "";
          //this.$router.push({path:'/logoffEnd'})
        } else {
          this.$message.error(res.data.msg);
          this.centerDialogVisible = false;
        }
      });
    }
  }
};
</script>

<style scoped>
  .refunds {
    background-color: #ffffff;
    min-height: 810px;
    padding-bottom: 110px;
  }
  .headerbox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 60px;
  }
  .backBtn {
    cursor: pointer;
    color: #878787;
  }
  .backBtn:hover {
    cursor: pointer;
    color: #0096FF;
  }
  /*------ 用户信息卡查询 ------*/
  .cardData {
    width: 680px;
    margin: 0 auto;
    padding-top: 30px;
    padding-bottom: 70px;
    border: 1px solid rgba(220, 220, 220, 1);
    margin-bottom: 30px;
  }
  .selectForm {
    padding: 0 40px;
  }
  .balance {
    text-align: center;
    font-size: 20px;
    color: #ff9231;
    font-weight: bold;
    margin-bottom: 60px;
  }
  .searchBox {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 60px;
  }
  .text {
    font-size: 16px;
    color: #878787;
    line-height: 19px;
  }
  .inputBox {
    width: 520px;
  }
  .textBox {
    display: flex;
    flex-direction: row;
  }
  .textBox p {
    width: 33.3%;
    display: inline-block;
    font-size: 16px;
    color: #878787;
    line-height: 19px;
  }
  .mb_50 {
    margin-bottom: 50px;
  }
  /*输入窗口*/
  .entryBox{
    width: 680px;
    margin: 0 auto;
  }
  .formBox{
    margin-bottom: 40px;
  }
  .butonBox{
    text-align: center;
  }
</style>
