<template>
  <div class="refunds">
    <div class="commonMode headerbox">
      <div class="sonTitle">
        <span class="titleName">充值结果</span>
      </div>
      <span class="backBtn" @click="backBtn">
        <i class="el-icon-back mr_30"></i>返回充值
      </span>
    </div>
    <!-- 用户信息卡查询 -->
    <div class="cardData">
      <div class="selectForm">
        <p class="balance">当前余额:￥{{this.cardData.money==''?0:this.cardData.money}}</p>
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
  </div>
</template>

<script>
import { bookOperateInt,rechargeInt } from "@request/api/base.js";
import axios from "axios"
export default {
  data() {
    return {
      cardInput:'',
      // 读者卡信息
      cardData: {
        money: "",
        userName: "",
        type: "",
        sex: "",
        startTime: "",
        vaildTime: "",
        state: ""
      }
    };
  },
  computed:{
    rechargeForm() {
      let obj = {
        deposit: this.changeForm.deposit,
        cardNumber: this.lastCardNum,
        operationPassword: this.changeForm.password,
        remarks:this.changeForm.remarks
      };
      return obj;
    },
  },
  methods: {
    backBtn() {
      this.$router.push("/refunds");
    },
    //查询读者卡信息
    readCardBtn() {
      let value = this.$route.params.card;
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
    /*------ API ------*/
    // 调查读者卡信息
    readCardApi(data) {  
      axios.get(bookOperateInt.userInfo, { params: data }).then(res => {
        console.log("用户信息",res);
        if (res.data.state === true) {
          let data = res.data.row[0]
          this.cardData.userName = data.cardFkReaderName
          this.cardData.sex = data.sex
          this.cardData.type = data.cardGradeName
          this.cardData.startTime = data.cardCreatTime
          this.cardData.vaildTime = data.cardExpireTime
          this.cardData.state = data.state
          
          this.lastCardNum = this.cardInput
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
  },
  created(){
      this.readCardBtn()
  }
};
</script>

<style scoped>
.refunds {
  background-color: #ffffff;
  min-height: 810px;
}
.headerbox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
}
.backBtn {
  cursor: pointer;
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
