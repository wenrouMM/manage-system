<template>
  <div class="getCard">
    <div style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px">
      <div>
        <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
        <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">逾期设置</div>
      </div>
    </div>
    <div style="width: 350px;height: 350px;margin:200px auto">
      <el-form :label-position="labelPosition" label-width="80px" :ref="formLabelAlign" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
        <el-form-item label="逾期天数" prop="dataNum">
          <el-input v-model="formLabelAlign.dataNum"></el-input>
        </el-form-item>
        <el-form-item label="逾期金额" prop="money">
          <el-input v-model="formLabelAlign.money"></el-input>
        </el-form-item>
        <el-form-item label="催还间隔" prop="space">
          <el-input v-model="formLabelAlign.space"></el-input>
        </el-form-item>
        <div style="margin-left: 17px;margin-top: 50px">
          <el-button type="primary" style="border-radius: 10px;width: 150px" @click="saveClick">保存</el-button>
          <el-button type="info"  style="border-radius: 10px;width: 150px" @click="clearClick">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "getAcard",
    data(){
      return{
        labelPosition: 'right',
        formLabelAlign: {
          dataNum: '',
          money: '',
          space: ''
        },
        rules: {
          dataNum: [{required: true, message: '请输入逾期天数', trigger: 'blur'}],
          money: [{required: true, message: '请输入逾期金额', trigger: 'blur'}],
          space: [{required: true, message: '请输入催还间隔', trigger: 'blur'}],
        }
      }
    },
    methods:{
      saveClick(){
        this.centerDialogVisible=true
        this.$refs[this.formLabelAlign].validate((valid) => {
          if (valid) {
            //alert('submit!');

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      clearClick(){
        this.$refs[this.formLabelAlign].resetFields();
      }
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


</style>
