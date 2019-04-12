<template>
  <div class="borrowbook">
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">借书</div>
    </div>
    <div style="width: 300px;height: 300px;margin: 220px auto;">
      <p style="text-align: center;font-size: 20px;font-weight: bold;color:#FF9231">当前余额 :&nbsp;&nbsp;￥30元</p>
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" ref="formLabelAlign" :rules="rules" style="margin-top: 30px">
        <el-form-item label="卡号" prop="cardNum">
          <el-input v-model="formLabelAlign.cardNum" placeholder="请输入卡号"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="formLabelAlign.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="充值金额" prop="bookCode">
          <el-input v-model="formLabelAlign.bookCode" placeholder="请输入书籍编码"></el-input>
        </el-form-item>
      </el-form>
      <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 40px">
        <el-button type="primary" class="button">充值</el-button>
        <el-button type="info" class="button">重置</el-button>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        labelPosition: 'right',
        formLabelAlign: {
          userName: '',
          cardNum: '',
          bookCode: ''
        },
        rules: {
          // 添加的参数验证
          userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
          cardNum: [{ required: true, message: "请选择卡号", trigger: "blur" }],
          bookCode: [{ required: true, message: "请输入书籍编码", trigger: "blur" }],
        },
      }
    },
    methods:{

    },
    mounted(){

    }
  }
</script>

<style scoped>
  .borrowbook{
    width: 100%;
    background-color: white;
    height: 852px;
  }
  .button{
    width:130px ;
  }
</style>
