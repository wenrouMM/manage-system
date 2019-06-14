<template>
  <div class="getCard">
    <div style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px">
      <div>
        <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
        <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">逾期设置</div>
      </div>
    </div>
    <div style="width: 370px;height: 370px;margin:200px auto">
      <el-form :label-position="labelPosition" :ref="formLabelAlign" :model="formLabelAlign" :rules="rules" ref="formLabelAlign">
        <div class="flexLayout fontStyle">
          <el-form-item label="逾期天数" prop="dataNum" label-width="100px">
            <el-input v-model="formLabelAlign.dataNum" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item>
            <span>天</span>
          </el-form-item>
        </div>
        <div class="flexLayout fontStyle">
          <el-form-item label="逾期金额" prop="money" label-width="100px">
            <el-input v-model="formLabelAlign.money" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item>
            <span>元</span>
          </el-form-item>
        </div>
        <div class="flexLayout fontStyle">
          <el-form-item label="催还间隔" prop="space" label-width="100px">
            <el-input v-model="formLabelAlign.space" style="width: 250px"></el-input>
          </el-form-item>
          <el-form-item>
            <span>天</span>
          </el-form-item>
        </div>
        <div style="margin-left: 30px;margin-top: 50px">
          <el-button type="primary" style="border-radius: 10px;width: 150px" @click="saveClick">保存</el-button>
          <el-button type="info"  style="border-radius: 10px;width: 150px" @click="clearClick">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {overdue} from '@request/api/base.js'
  export default {
    name: "getAcard",
    data(){
      return{
        labelPosition: 'right',
        formLabelAlign: {
          dataNum: '',
          money: '',
          space: '',
          id:''
        },
        rules: {
          dataNum: [{required: true, message: '请输入逾期天数', trigger: 'blur'}],
          money: [{required: true, message: '请输入逾期金额(元)', trigger: 'blur'}],
          space: [{required: true, message: '请输入催还间隔', trigger: 'blur'}],
        }
      }
    },
    methods:{
      saveClick(){
        this.centerDialogVisible=true
        this.$refs[this.formLabelAlign].validate((valid) => {
          if (valid) {
            this.axios.put(overdue.setEdit,{
              id:this.formLabelAlign.id,
              expectDay:this.formLabelAlign.dataNum,
              expectMoneyF:this.formLabelAlign.money,
              reminderInterval:this.formLabelAlign.space
            }).then((res)=>{
              console.log('逾期设施修改后返回的数据',res)
              if(res.data.state==true){
                this.$message({
                  message:'修改成功',
                  type: 'success'
                });
                this.initializationFun()
              }else{
                this.$message({
                  message:res.data.msg,
                  type: 'error'
                });
              }
            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      clearClick(){
        this.$refs[this.formLabelAlign].resetFields();
      },
      initializationFun(){
        this.axios.get(overdue.setSelect).then((res)=>{
          console.log('初始化逾期设置数据',res)
          this.formLabelAlign.dataNum=res.data.row.expectDay
          this.formLabelAlign.money=res.data.row.expectMoneyF
          this.formLabelAlign.space=res.data.row.reminderInterval
          this.formLabelAlign.id=res.data.row.id
        })
      },
    },
    mounted(){
      this.initializationFun()
    }
  }
</script>

<style scoped>
  .getCard{
    width: 100%;
    background-color: white;
    height: 852px;
  }
  .fontStyle{
    font-size: 14px;
    color: #878787;
  }

</style>
