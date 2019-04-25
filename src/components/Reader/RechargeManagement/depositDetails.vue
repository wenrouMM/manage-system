<template>
  <div class=" getCard">
    <div style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px">
      <div>
        <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
        <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">押金记录详情页</div>
      </div>
      <div>
        <router-link :to="{path:'/depositrecord'}"  style="font-size: 15px;color: #878787;text-decoration: none">&#8678;跳转上一页</router-link>
      </div>
    </div>
    <div style="margin:100px auto;width:600px;height: 500px">
  `     <div style="width: 100px;height: 100px;border-radius: 50%;border:1px solid lightgray;margin: 0 auto">
          <img src="../../../../src/base/img/menu/tbls.png" style="width:100px;height: 100px;border-radius: 50%;">
        </div>
        <div id="details" style="display: flex;flex-direction: row;font-size: 16px;color: #878787;margin-top: 50px">
          <div>
            <p>用户名称 :&nbsp;&nbsp;{{detailsData.userName}}</p>
            <p>充值金额 :&nbsp;&nbsp;{{detailsData.depositMoney}}</p>
            <p>充值时间 :&nbsp;&nbsp;{{detailsData.depositTime}}</p>
            <p>充值地点 :&nbsp;&nbsp;{{detailsData.depositAddress}}</p>
            <p>处理方式 :&nbsp;&nbsp;{{detailsData.type}}</p>
          </div>
          <div>
            <p>读者卡号 :&nbsp;&nbsp;{{detailsData.userCard}}</p>
            <p>充值方式 :&nbsp;&nbsp;{{detailsData.depositType}}</p>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        userId:'',
        detailsData:{
          userName:'',
          depositMoney:'',
          depositTime:'',
          depositAddress:'',
          type:'',
          status:'',
          userCard:'',
          depositType:'',
        }
      }
    },
    methods:{
      selectApi(){
        this.userId = Number(this.$route.query.id);
        console.log(this.userId)
        this.axios.get(depositDetails,{params: {id:this.userId}}).then((res)=>{
          console.log(res)
          /*detailsData:{
          userName:'',
          depositMoney:'',
          depositTime:'',
          depositAddress:'',
          type:'',
          userCard:'',
          depositType:'',
          code:''
        }*/
          this.detailsData.userName=res.data.row.fkReaderName
          this.detailsData.depositMoney=res.data.row.deposit
          this.detailsData.depositTime=res.data.row.createTime
          this.detailsData.depositAddress=res.data.row.fkLibraryName
          this.detailsData.type=res.data.row.fkHandleModeName
          this.detailsData.userCard=res.data.row.cardNumber
          this.detailsData.depositType=res.data.row.rechargeType===0?'现金':'其他'

        })
      }
    },
    mounted(){
      this.selectApi()
    }
  }
</script>

<style scoped>
  .getCard{
    width: 100%;
    background-color: white;
    height: 852px;
  }
  #details div{
    width: 300px;
  }
  #details div p{
    margin-top: 35px;
  }
  form div:nth-child(2){
    margin-left: 20px;
  }
  form div:nth-child(3){
    margin-left: 330px;
    margin-top: -60px;
  }
  form div:nth-child(4){
    margin-left: 20px;
    margin-top: 30px;
  }
  form div:nth-child(5){
    margin-left: 330px;
    margin-top: -60px;
  }
  form div:nth-child(6){
    margin-left: 20px;
    margin-top: 30px;
  }
  form div:nth-child(7){
    margin-left: 20px;
    margin-top: 40px;
  }
  form div:nth-child(8){
    margin-left: 140px;
    margin-top: 50px;
  }

</style>
