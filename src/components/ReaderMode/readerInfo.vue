<template>
  <div class="getCard">
    <div
      style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px"
    >
      <div>
        <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
        <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">办卡</div>
      </div>
      <div>
        <router-link
          :to="{path:'/readercardmanagement'}"
          style="font-size: 15px;color: #878787;text-decoration: none"
        >&#8678;跳转上一页</router-link>
      </div>
    </div>

    <div style="width: 610px;height: 600px;" class="formDiv">
      <el-form ref="addForm" :model="addForm" :rules="addRules">
        <el-form-item class="uploadBox" style="width: 100px;margin-left: 250px;margin-top: 20px">
          <section class="upload mb_30" @click="pointer">
            <!-- 背景图片做改动 -->
            <div
              class="defultHead"
              style="width:100px; height:100px; border-radius:50%;position: relative"
            >
              <img
                src=""
                style="position: absolute;top: 0;left: 0;width:100px; height:100px; border-radius:50%;"
                v-if="!addForm.preloading"
              >
              <img
                style="width:100px; height:100px ;border-radius:50%;position: absolute;top: 0;left: 0"
                v-if="addForm.preloadImg"
                :src="addForm.preloadImg"
                alt="预览照片"
                class="preloadImg"
              >
              <input
                type="file"
                accept="jpg/png"
                style="display:none;"
                ref="file"
                id="file"
                @change="getFile"
              >
            </div>
          </section>
        </el-form-item>
        <!-- 表单域 -->
        <div class="hideBox" v-if="!rebackData">
          <el-form-item label="身份证号" prop="id" :label-width="formLabelWidth">
            <el-input
              @blur="select"
              v-model="addForm.id"
              autocomplete="off"
              class="inputDiv"
              placeholder="请输入身份证号"
            ></el-input>
            <i v-if="loading" class="el-icon-loading"></i>
          </el-form-item>

          <el-form-item label="用户名" prop="name" :label-width="formLabelWidth">
            <el-input
              v-model="addForm.name"
              :disabled="judge"
              autocomplete="off"
              class="inputDiv"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phoneNumber" :label-width="formLabelWidth">
            <el-input
              v-model="addForm.phoneNumber"
              autocomplete="off"
              class="inputDiv"
              :disabled="judge"
              placeholder="请输入电话号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
            <el-input
              v-model="addForm.email"
              autocomplete="off"
              class="inputDiv"
              :disabled="judge"
              placeholder="请输入邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="地址" prop="address" :label-width="formLabelWidth">
            <el-input
              v-model="addForm.address"
              autocomplete="off"
              class="inputDiv"
              placeholder="请输入地址"
              :disabled="judge"
            ></el-input>
          </el-form-item>
          <el-form-item label="卡号" prop="cardNumber" :label-width="formLabelWidth">
            <el-input
              v-model="addForm.cardNumber"
              autocomplete="off"
              class="inputDiv"
              placeholder="请输入卡号"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色等级" prop="level" :label-width="formLabelWidth">
           
              <el-select value-key="name"  v-model="addForm.level" placeholder="请选择">
                <el-option
                  v-for="(item,index) in optionsData"
                  :key="index"
                  :label="item.name"
                  :value="item"
                ></el-option>
              </el-select>
            <span>押金金额￥：{{addForm.level.deposit}}</span>
          </el-form-item>
          <el-form-item class="buttonBox">
            <el-button
              type="primary"
              style="border-radius: 10px;width: 150px"
              @click="submitForm('addForm')"
            >确定</el-button>
            <el-button
              type="info"
              style="border-radius: 10px;width: 150px"
              @click="resetForm('addForm')"
            >重置</el-button>
          </el-form-item>
        </div>
        <div class="textBox" v-if="rebackData">
          <p>
            <span>身份证号：</span>
            {{addForm.id}}
          </p>
          <p>
            <span>用户名：</span>
            {{addForm.name}}
          </p>
          <P>
            <span>电话号码：</span>
            {{addForm.phoneNumber}}
          </P>
          <p>
            <span>邮箱：</span>
            {{addForm.email}}
          </p>
          <P>
            <span>地址：</span>
            {{addForm.address}}
          </P>
          <P>
            <span>卡号：</span>
            {{addForm.cardNumber}}
          </P>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  cardInfoInt,
  headUpload,
  getCardInt
} from "@request/api/base.js";
export default {
  name: "getAcard",
  data() {
    return {
      optionsData:[],// 等级选择下拉框
      formBox: false,
      formLabelWidth: "100px",
      loading: false,
      files: "", // 用于上传
      preloadImg: "", // 图片相关
      rebackData: false, // 回显数据
      selectData: {}, // 身份证查询的数据

      addForm: {
        // 添加的数据表单 共8个参数
        address: "", // 地址相关
        name: "", // 用户名
        sex: "", // 性别
        id: "", // 身份证
        preloadImg: "",
        phoneNumber: "", // 电话号码
        level: "",
        cardNumber: "",
        headerAddress: "",
        email:''
      },
      addRules: {
        // 添加的参数验证
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        id: [{ required: true, message: "请输入身份证号码", trigger: "blur" }],
        phoneNumber: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
        ],
        cardNumber: [
          { required: true, message: "请输入读书卡号", trigger: "blur" }
        ],
        level: [{ required: true, message: "请选择金额", trigger: "change" }],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        email:[{required: true, message: "请输入邮箱", trigger: "blur" }]
      }
    };
  },
  computed: {
    addTimeForm() {
      let obj = {
        fkGradeCode:this.addForm.level.code,
        deposit: this.addForm.level.deposit,
        phone: this.addForm.phoneNumber,
        cardNumber: this.addForm.cardNumber,
        fkReaderCard: this.addForm.id,
        fkReaderName: this.addForm.name,
        readerAddress: this.addForm.address,
        email:this.addForm.email
      };
      return obj;
    },
    selectTimeForm() {
      let obj = {
        idCard: this.addForm.id
      };
      return obj;
    },
    judge() {
      let obj = this.selectData;
      for (var key in obj) {
        return true; // 不是空对象 锁输入框
      }
      return false; // 是空对象 不锁
    }
  },
  methods: {
    // 等级选择下拉框
    levelOptionApi() {
      axios.get(getCardInt).then(res => {
        if(res.data.state == true){
          this.optionsData = res.data.row
          console.log('当前下拉框',this.optionsData)
        } else{
          this.$message.error(res.data.msg)
        }
        console.log("查询等级下拉框", res);
      });
    },
    // ID查询
    select() {
      let data = this.selectTimeForm;
      console.log(data);
      /*
      this.addForm.headerAddress = "";
      this.addForm.name = "";
      this.addForm.address = "";
      this.addForm.phoneNumber = "";
      this.addForm.sex = "";
      this.addForm.email = ""
      */
      if (data.idCard) {
        this.loading = true;
        axios
          .get(cardInfoInt.selectUser, {
            params: data
          })
          .then(res => {
            console.log("返回的数据", res);
            if (res.data.state === true) {
              console.log(res);
              this.selectData = res.data.row;
              let data = res.data.row;
              if (data != null) {
                this.addForm.headerAddress = data.headerAddress;
                this.addForm.name = data.readerName;
                this.addForm.address = data.readerAddress;
                this.addForm.phoneNumber = data.phone;
                this.addForm.sex = data.readerSex.toString(); // 应该是初始设置 非要字符串格式才行
                this.addForm.email = data.email
                console.log("此时的addform", this.addForm);
              }

              this.loading = false;
            } else {
              this.$message.error(res.data.msg);
              this.loading = false;
            }
          });
      }
      console.log("触发了吗");
    },
    submitForm(formName) {
      console.log("提交的数据", this.addTimeForm);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.uploadImgApi();
          axios.post(cardInfoInt.add, this.addTimeForm).then(res => {
            console.log("返回成功的信息", res);
            if (res.data.state === true) {
              console.log("提交成功");
              this.$message.success("成功");
              this.rebackData = true;
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    pointer() {
      this.$refs.file.click();
    },
    getFile(e) {
      // 1.判断选择事件是否为空
      // 2. 获取数据
      let _this = this; // 缓存this
      let value = _this.$refs.file.value;

      var files = e.target.files[0]; // 事件对象包含的信息 files是路径
      _this.files = files;
      // 2.1 防止后台拿不到数据 可能需要提交额外数据时
      var formdatas = new FormData();
      var fordata = formdatas.append("file", files);
      if (!e || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader(); // 定义 fileReader对象
      reader.readAsDataURL(files); // 转换为base64的url路径 其他三个API转换为text 二进制  arraybuffer
      reader.onloadend = function() {
        _this.addForm.preloadImg = this.result; // 此时this指向的fileReader对象
        _this.$refs.file.value = "";
        console.log(_this.addForm.preloadImg);
      };
    },
    // 图片上传API
    uploadImgApi() {
      let files = this.files;
      if (files) {
        var formdatas = new FormData();
        formdatas.append("file", files);
        //console.log(formdatas.get('file'))
        this.axios({
          method: "post",
          url: headUpload,
          data: formdatas,
          //cache: false,//上传文件无需缓存
          processData: false, //用于对data参数进行序列化处理 这里必须false
          contentType: false, //
          dataType: "JSON",
          ContentType: "multipart/form-data",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true
        }).then(request => {
          // 如果是编辑 更换图片失败后
          if (request.data.row != "") {
            console.log("上传图片成功");
          } else {
            this.$message.error("图片上传失败");
          }
        });
      }
    }
  },
  created() {
    this.levelOptionApi();
  }
};
</script>

<style scoped>
.getCard {
  width: 100%;
  background-color: white;
  min-height: 852px;
}
.buttonBox {
  text-align: center;
}
.inputDiv {
  height: 30px;
}
.formDiv {
  margin: 70px auto;
}
.textBox p {
  margin-bottom: 30px;
}
.textBox span {
  text-align: right;
  display: inline-block;
  width: 100px;
}
</style>
<style>
.getCard i.el-icon-loading {
  position: absolute;
  right: -32px;
  top: 10px;
  font-size: 18px;
}
</style>

