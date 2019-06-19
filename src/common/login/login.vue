<template>
  <div id="login">
    <div id="particles-js"></div>
    <div class="login">
      <p class="title">用户登录</p>
      <section class="formBox">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="0px"
          class="ms-content"
        >
          <el-form-item prop="username">
            <el-input v-model="ruleForm.username" placeholder="username">
              <el-button slot="prepend" icon="iconduzheguanli iconfont"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              placeholder="password"
              v-model="ruleForm.password"
              @keyup.enter.native="submitForm('ruleForm')"
            >
              <el-button slot="prepend" icon="iconmima iconfont"></el-button>
            </el-input>
          </el-form-item>
          <div class="login-btn">
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
          </div>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script>
import particlesJs from "particles.js";
import particlesConfig from "./particles.json";

export default {
  data() {
    return {
      ruleForm: {
        username: "admin",
        password: "123123"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    init() {
      particlesJS("particles-js", particlesConfig);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          localStorage.setItem("ms_username", this.ruleForm.username);
          this.$router.push("/");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (pJSDom && pJSDom.length > 0) {
      pJSDom[0].pJS.fn.vendors.destroypJS();
      pJSDom = [];
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
  #particles-js {
    width: 100%;
    height: 100%;
    background-image: url("./bg1.jpg");
    background-size: cover;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }

  .login {
    width: 300px;
    
    position: absolute;
    background-color: rgba(255, 255, 255, 0.1);
    left: 50%;
    margin-left: -200px;
    top: 50%;
    margin-top: -200px;
    padding: 30px;
    .title {
      text-align: center;
      color: #ffffff;
      margin-bottom: 20px;
    }
    .formBox {
      .login-btn {
        text-align: center;
        margin-top: 30px;
        margin-bottom: 30px;
        button {
          width: 100%;
          height: 36px;
          
        }
      }
    }
  }
}
</style>
