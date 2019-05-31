<template>
  <div class="dataError">
    <div class="commonMode normal" style="width:100%">
      <div class="sonTitle">
        <span class="titleName">数据字典</span>
        <p class="tips"></p>
      </div>
    </div>
    <div class="errBox">
      <el-form ref="form" :model="changeForm" :rules="changeRules" label-width="140px" size="mini">
        <el-form-item label="公告置顶条数" prop="apex">
          <div class="inputBox">
            <el-input v-model.number="changeForm.apex"></el-input>
            <span class="ml_10 text">条</span>
          </div>
        </el-form-item>
        <el-form-item label="充值验证额度" prop="recharge">
          <div class="inputBox">
            <el-input v-model.number="changeForm.recharge"></el-input>
            <span class="ml_10 text">元</span>
          </div>
        </el-form-item>
        <el-form-item label="补办费用设置" prop="assist">
          <div class="inputBox">
            <el-input v-model.number="changeForm.assist"></el-input>
            <span class="ml_10 text">元</span>
          </div>
        </el-form-item>
        <el-form-item label="读者卡有效时间" prop="cardCost">
          <div class="inputBox">
            <el-input v-model.number="changeForm.cardCost"></el-input>
            <span class="ml_10 text">天</span>
          </div>
        </el-form-item>
        <div class="textCenter">
          <el-button type="primary" @click="editBtn">提交</el-button>
        </div>
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
        id: ""
      },
      changeRules: {
        apex: [
          {
            required: true,
            message: "公告置顶条数不得为空",
            trigger: "blur"
          }
        ],
        recharge: [
          { required: true, message: "充值验证额度不得为空", trigger: "blur" }
        ],
        assist: [
          { required: true, message: "补办费用设置不得为空", trigger: "blur" }
        ],
        cardCost: [
          { required: true, message: "读者卡有效时间不得为空", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    editBtn() {
      this.editApi(this.submitForm);
    },
    searchApi() {
      axios.get(bookWordInt.search).then(res => {
        if (res.data.state) {
          let data = res.data.row;
          this.changeForm.apex = data.maxPlacingNum;
          this.changeForm.recharge = data.maxRechargeNum;
          this.changeForm.assist = data.effectiveTime;
          this.changeForm.cardCost = data.setReissueCost;
          this.changeForm.id = data.id;
          console.log("接收的数据", res.data.row);
          console.log("回显", this.changeForm);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    editApi(value) {
      this.$refs.changeForm.validate(valid => {
        if (valid) {
          axios({
            method: "put",
            url: bookWordInt.edit,
            data: value
          }).then(res => {
            if (res.data.state) {
              this.$message.success("修改成功");
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
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
        id: this.changeForm.id
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
.dataError {
  background-color: #ffffff;
  min-height: 810px;
  position: relative;
  box-sizing: border-box;
}
.errBox {
  width: 50%;
  margin: 0 auto;
}
.normal {
  margin-bottom: 120px;
}
.textCenter {
  text-align: center;
}
.inputBox {
  position: relative;
  display: flex;
}
.inputBox .text {
  margin-left: 10px;
  line-height: 36px;
}
</style>
