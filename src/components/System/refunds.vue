<template>
  <div class="refunds">
    <div class="title">
      <div class="left">
        <div></div>
        <div>{{title=='drawback'?'退款':'充值'}}</div>
      </div>
      <div>
        <router-link :to="{path:'/rechargeSet'}"  style="font-size: 15px;color: #878787;text-decoration: none"> < 跳转上一页</router-link>
      </div>
    </div>
    <div class="cardData">
      <div class="selectForm">
        <p class="balance">当前余额:￥{{this.cardData.money}}</p>
        <div style="margin:30px 0px 30px 40px;height: 40px;position: relative">
          <span style="color: #878787;">卡&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号&nbsp;&nbsp;:&nbsp;&nbsp;</span>
          <span>
              <input type="text" class="inputStyle" v-model="cardNum" style="width: 520px;">
              <button class="selectButton" @click="selectInfoCheck">查询</button>
            </span>
        </div>
        <div id="cardTable">
          <div class="flexlayout">
            <p>用户名称 : {{this.cardData.userName}}</p>
            <p>用户性别 : {{this.cardData.sex}}</p>
            <p>读者状态 : {{this.cardData.state}}</p>
          </div>
          <div style="margin-top: 30px;" class="flexlayout">
            <p style="width: 300px">注册日期 : {{this.cardData.startTime}}</p>
            <p style="margin-right: 40px;width: 300px">有效期限 : {{this.cardData.vaildTime}}</p>
          </div>
        </div>
      </div>
      <div class="flexlayout" style="margin-top: 30px">
        <div>
          <span style="color: #878787;">{{refundsInput}} : </span>
          <span><input type="text" class="inputStyle"></span>
        </div>
        <div>
          <span style="color: #878787;">备注 : </span>
          <span><input type="text" class="inputStyle" style="width:350px "></span>
        </div>
      </div>
      <div style="width:350px;margin: 50px auto">
        <el-button type="info" style="width:150px">重置</el-button>
        <el-button type="primary" style="width:150px;margin-left: 40px">{{refundsButton}}</el-button>
      </div>
    </div>
    <div class="forbid">
      <el-dialog :title="messageName[i]" :visible.sync="centerDialogVisible" width="500px" center>
        <div class="dialogBody">
          是否删除当前记录?
        </div>
        <div slot="footer">
          <span class="dialogButton true mr_40" @click="submitDialog">打印凭条</span>
          <span class="dialogButton cancel" @click="centerDialogVisible = false">取消</span>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { bookOperateInt} from "../../request/api/base.js";
  export default {
    data(){
      return {
        messageName:['提示','保存'],
        i:null,
        centerDialogVisible:false,
        title:'',
        cardNum:'',
        cardData:{
          money:'',
          userName:'',
          name:'',
          sex:'',
          startTime:'',
          vaildTime:'',
          state:''
        },
        refundsButton:'',
        refundsInput:'',
      }
    },
    methods:{
      initialization(){
        this.title = this.$route.query.method;
        if(this.title=='drawback'){
          this.refundsButton='退款'
          this.refundsInput='退款金额'
        }else{
          this.refundsButton='充值'
          this.refundsInput='充值金额'
        }
        console.log('this.title',this.title)
      },
      //查询读者卡信息
      selectInfoCheck(){
        console.log('读者卡号',this.cardNum)
        this.axios.get(bookOperateInt.userInfo,{params:{cardNum:this.cardNum}}).then((res)=>{
          console.log('读者卡信息',res)
          if(res.data.state==true) {
            this.cardData.userName = res.data.row[0].cardFkReaderName
            this.cardData.money = res.data.row[0].cardGradeDeposit
            this.cardData.sex = res.data.row[0].sex == 1 ? '男' : '女'
            this.cardData.vaildTime=res.data.row[0].cardExpireTime
            this.cardData.startTime=res.data.row[0].cardCreatTime
            this.cardData.state=res.data.row[0].state
          }
        })
      },
      submitDialog(){

      }
    },
    mounted(){
      this.initialization()
    },
  }
</script>

<style scoped>
  #cardTable{
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    width: 720px;
    margin-left: 40px;
  }
  .flexlayout{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  #cardTable p{
    width: 220px;
    font-size: 16px;
    color: #878787;
  }
  .inputStyle{
    height: 35px;
    border: 1px solid #D5D5D5;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    padding-left: 30px;
  }
  .selectButton{
    cursor: auto;
    background-color: #0096FF;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    padding:8px 20px 11px 20px;
    color: white;
    font-size: 16px;
    margin-left: -5px;
    border: none;
  }
  .refunds{
    width: 100%;
    background-color: white;
    height: 950px;
  }
  .refunds .title{
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    padding-left: 30px;
    padding-top: 30px;
    padding-right: 30px
  }
  .refunds .title div:nth-child(2){
    font-size: 16px;
    color: #878787;
    cursor: default;
  }
  .refunds .title .left div:nth-child(1){
    width: 4px;
    height: 17px;
    background-color: #0096FF
  }
  .refunds .title .left div:nth-child(2){
    font-size: 16px;
    color: #878787;
    margin-left:10px;
    margin-top: -17px;
  }
  .refunds .cardData{
    width: 800px;
    height: 550px;
    margin: 200px auto;
  }
  .refunds .cardData .selectForm{
    border: 1px solid rgba(220,220,220,1);
    width: 800px;
    height: 250px;
  }
  .balance{
    font-size: 20px;
    font-weight: bold;
    color: #FF9231;
    text-align: center;
    margin-top: 30px
  }
</style>
