<template>
  <div class="dataError">
    <div class="commonMode normal" style="width:100%">
      <div class="sonTitle">
        <span class="titleName">数据字典</span>
        <p class="tips"></p>
      </div>
    </div>
    <div class="errBox">
      <el-form ref="changeForm" :model="changeForm" :rules="changeRules" label-width="140px" size="mini">
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
        <el-form-item label="读者卡有效时间" prop="cardValid">
          <div class="inputBox">
            <el-input v-model.number="changeForm.cardValid"></el-input>
            <span class="ml_10 text">天</span>
          </div>
        </el-form-item>
        <el-form-item label="办卡机默认等级" prop="cardValid">
          <div class="inputBox">
            <el-select @change="test" clearable value-key="code"  v-model="changeForm.level" placeholder="请选择">
                <el-option
                  v-for="(item) in optionsData"
                  :key="item.code"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
             <span class="ml_30" style="color: #878787">押金金额￥：{{changeForm.level.deposit}}元</span>
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
import { bookWordInt,cardLevelInt } from "@request/api/base.js";
import { control } from '@/request/api/base';
export default {
  data() {
    return {
      changeForm: {
        apex: "",
        recharge: "",
        assist: "",
        cardValid: "",
        id: "",
        level:{}
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
        cardValid: [
          { required: true, message: "读者卡有效时间不得为空", trigger: "blur" }
        ]
      },
      optionsData:[]
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
          this.changeForm.assist = data.setReissueCost;
          this.changeForm.cardValid = data.effectiveTime;
          this.changeForm.id = data.id;
          this.changeForm.level.code = data.equipmentGardCardCode
          this.changeForm.level.name = data.equipmentGardCardName
          this.changeForm.level.deposit = data.equipmentGardCardDeposit
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
    },
    levelOptionApi() {
      axios.get(cardLevelInt.select).then(res => {
        if(res.data.state == true){
          this.optionsData = res.data.row
          console.log('当前下拉框',this.optionsData)
        } else{
          this.$message.error(res.data.msg)
        }
        console.log("查询等级下拉框", res);
      });
    },
    test(){
      console.log('你是否变化了',this.changeForm)
    }
  },
  computed: {
    submitForm() {
      let obj = {
        maxPlacingNum: this.changeForm.apex,
        maxRechargeNum: this.changeForm.recharge,
        setReissueCost: this.changeForm.assist,
        effectiveTime: this.changeForm.cardValid,
        equipmentGardCardCode:this.changeForm.level.code,
        equipmentGardCardName:this.changeForm.level.name,
        id: this.changeForm.id
      };
      return obj;
    }
  },
  created() {
    this.searchApi();
    this.levelOptionApi()
     console.log('你是否变化了',this.changeForm)
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
  color: #878787;
}
</style>
