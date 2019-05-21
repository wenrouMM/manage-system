<template>
    <div style="width: 100%;background-color: white;padding: 250px 0">
      <div style="width:600px;margin: 0px auto">
        <el-form :label-position="labelPosition" :rules="rules" ref="formLabelAlign" label-width="120px" :model="formLabelAlign">
          <el-form-item label=" 公告置顶条数 : " prop="number">
            <el-input v-model="formLabelAlign.number"></el-input>
          </el-form-item>
          <el-form-item label=" 充值最大额度 : " prop="quota">
            <el-input v-model="formLabelAlign.quota"></el-input>
          </el-form-item>
          <el-form-item label=" 补办费用设置 :" prop="setting">
            <el-input v-model="formLabelAlign.setting"></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 60px">
            <el-button type="primary" style="width: 120px">确定</el-button>
            <el-button type="info" style="width: 120px;margin-left: 150px">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
    export default {
        name: "dataDictionary",
        data(){
          return {
            labelPosition:'left',
            formLabelAlign:{
              number:'',
              quota:"",
              setting:''
            },
            rules: {
              number: [{ required: true, message: '请输入公告置顶条数', trigger: 'blur' }],
              quota: [{ required: true, message: '请输入充值最大额度', trigger: 'blur' }],
              setting: [{ required: true, message: '请输入补办费用', trigger: 'blur' }],
            }
          }
        }
    }
</script>

<style scoped>
  .el-form-item {
    margin-bottom: 40px;
  }
</style>
