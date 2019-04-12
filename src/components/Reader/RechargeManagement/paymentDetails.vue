<template>
  <div class=" getCard">
    <div style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px">
      <div>
        <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
        <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">缴费记录详情页</div>
      </div>
      <div>
        <router-link :to="{path:'/paymentrecord'}"  style="font-size: 15px;color: #878787;text-decoration: none">&#8678;跳转上一页</router-link>
      </div>
    </div>
    <div style="margin:100px auto;width:600px;height: 500px">
      `     <div style="width: 100px;height: 100px;border-radius: 50%;border:1px solid lightgray;margin: 0 auto">
      <img src="../../../../src/base/img/menu/tbls.png" style="width:100px;height: 100px;border-radius: 50%;">
    </div>
      <div id="details" style="display: flex;flex-direction: row;font-size: 16px;color: #878787;margin-top: 50px">
        <div>
          <p>用户名称 :&nbsp;&nbsp;干脆面</p>
          <p>充值金额 :&nbsp;&nbsp;20元</p>
          <p>充值时间 :&nbsp;&nbsp;2019-04-02&nbsp;&nbsp;11:24</p>
          <p>充值地点 :&nbsp;&nbsp;重庆大学图书馆</p>
          <p>处理方式 :&nbsp;&nbsp;设备</p>
          <p>充值状态 :&nbsp;&nbsp;充值成功</p>
          <!--<p style="color: red">失败原因 :&nbsp;&nbsp;设备卡纸，未识别成功</p>-->
        </div>
        <div>
          <p>读者卡号 :&nbsp;&nbsp;234434322</p>
          <p>充值方式 :&nbsp;&nbsp;现金</p>
          <p style="margin-top: 130px">设备编号 :&nbsp;&nbsp;05号</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "getAcard",
    data(){
      return{

      }
    },
    methods:{

    },
    mounted(){

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
    margin-top: 30px;
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
