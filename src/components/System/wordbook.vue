<template>
  <div class="dataError">
    <div class="errBox">
      <el-form ref="form" :model="changeForm" label-width="120px" size="mini">
        <el-form-item label="公告置顶条数">
          <el-input v-model="changeForm.apex"></el-input>
        </el-form-item>
        <el-form-item label="充值最大额度">
          <el-input v-model="changeForm.recharge"></el-input>
        </el-form-item>
        <el-form-item label="补办费用设置">
          <el-input v-model="changeForm.assist"></el-input>
        </el-form-item>
        <el-form-item label="读者卡有效时间">
          <el-input v-model="changeForm.cardCost"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editBtn">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { bookWordInt } from "@request/api/base.js";
export default {
  data() {
    return {
      changeForm: {
        apex: "",
        recharge: "",
        assist: "",
        cardCost: "",
        id:''
      }
    };
  },
  methods: {
    editBtn() {
        this.editApi(this.submitForm)
    },
    searchApi() {
      axios.get(bookWordInt.search).then(res => {
        if (res.data.state) {
          let data = res.data.row;
          this.changeForm.apex = data.maxPlacingNum;
          this.changeForm.recharge = data.maxRechargeNum;
          this.changeForm.assist = data.effectiveTime;
          this.changeForm.cardCost = data.setReissueCost;
          this.changeForm.id = data.id
          console.log("接收的数据", res.data.row);
          console.log("回显", this.changeForm);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    editApi(value) {
      axios({
        method: "put",
        url: bookWordInt.edit,
        data: value
      }).then(res=>{
          if(res.data.state){
              this.$message.success('修改成功')
          } else{
              this.$message.error(res.data.msg)
          }
      });
    }
  },
  computed: {
    submitForm() {
      let obj = {
        maxPlacingNum: this.changeForm.apex,
        maxRechargeNum: this.changeForm.recharge,
        effectiveTime: this.changeForm.assist,
        setReissueCost: this.changeForm.cardCost,
        id:this.changeForm.id
      };
      return obj;
    }
  },
  created() {
    this.searchApi();
  }
};
</script>
<style scoped>
</style>
