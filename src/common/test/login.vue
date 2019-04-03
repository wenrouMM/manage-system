<template>
  <div class="login">
    <!-- 登陆表格 -->
    <el-form
      :model="loginForm"
      status-icon
      :rules="rules2"
      ref="loginForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <h1 class="title">用户登陆</h1>

      <el-form-item label="账户" prop="username">
        <el-input type="text" v-model.number="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="loginForm.pass" autocomplete="off"></el-input>
      </el-form-item>

      <!-- 表单按钮 -->
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
        <el-button @click="resetForm('loginForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 表单相关数据 */
      loginForm: {
        // 表单数据
        username: "",
        pass: ""
      },
      rules2: {
        // 验证规则
        pass: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 5, max: 16, message: "密码长度在 5 到 16 个字符", trigger: "blur" } // 但是验证密码框缺不报错
        ],
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },// 非空验证
          { min: 5, max: 16, message: "用户名长度在 5 到 16 个字符", trigger: "blur" } // 字符串验证 开启后会验证输入的是否是字符串
        ]
      }
    };
  },
  methods: {
    /* 表单提交相关功能： 登陆数据传递 重置参数 */
    submitForm(formName) {
      // 验证提交 监听输入的值是否都有了 否则一直禁用按钮 或者点了失效不执行任何任务
      this.$refs[formName].validate(valid => {
        if (valid) { // valid意味者值已经被收集和传递了
          // 收集用户名和密码
          let that = this
          this.axios.post('/api/checklogin',{
            username: that.loginForm.username,
            password: that.loginForm.pass
          }).then((res) => {

            if(res.data.length){
              //1. 用户信息存入本地
              localStorage.setItem('userinfo', JSON.stringify(res.data[0]))
              let userinfo = JSON.parse(localStorage.getItem('userinfo'))

              //1.1 用户信息存入state 每次数据的更改只能用commit的方式调用mutation
              that.$store.commit('SAVE_USERINFO', userinfo)

              //1.2 登陆成功提示

              that.$message({
                message: '登陆成功',
                type: 'success'
              })

              //2. 跳转到控制台首页
              that.$router.push('/')
              console.log(res.data)

            } else {
              that.$message.error('登陆失败，请检查用户名或密码')
            }
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      // 重置
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<!-- 局部修改elementUI的样式 必须加上页面前缀防止变成全局样式污染 -->
<style>
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html,
body,
#app,
.login {
}
.login {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login .el-form {
  width: 400px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 0 55px 10px 10px;
}
.login .el-form .title {
  text-align: center;
  font-size: 26px;
  padding-left: 55px;
}
</style>
