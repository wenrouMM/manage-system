<template>
  <div id="login">
    <el-row>
      <el-col :span="5" :push='13'><div class="grid-content bg-purple" style="margin-top: 350px;padding-left: 45px">
        <div id="reg">管理员登陆</div>
        <div class="divHeight" style="margin-top: 20px">
          <img src="../base/img/login/icon_1.png" class="imgHeight">
          <input type="text" placeholder="请输入电话号码/身份证/邮箱" id="name" notnull info="用户名"  mustlength="18" class="inputHeight" v-model="form.name">
        </div>
        <div class="divHeight">
          <img src="../base/img/login/icon_2.png" class="imgHeight">
          <input type="password" placeholder="请输入密码" id="pwd"  notnull info="密码" maxlength="30" class="inputHeight" v-model="form.password" style="position: relative">
          <img src="../base/img/currency/yanjing.png"  id="show" style="width: 25px;height: 25px;position: absolute;top: 33px;left: 270px" @click="isShowCheck">
        </div>
        <div class="divHeight" id="yzm">
          <input type="text" placeholder="请输入验证码" id="yzvalue" class="inputHeight" maxlength="4" style="position: absolute;left: 0;width: 150px" v-model="form.yzm">
          <span><img src="" id="imgYzm"></span>
        </div>
        <div style="margin-top: 55px;">
          <button @click="submit">登录</button>
        </div>
        <div id="msg"></div>
      </div></el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import {loginInter} from '../request/api/base.js'
  export default {
    name: "login.vue",
    data:function(){
      return {
        form:{
          name:'',
          password:'',
          yzm:'',
        },
      }
    },
    methods:{
      isShowCheck(){
        console.log($('#pwd').attr('type'))
        if($('#pwd').attr('type')=='password'){
          $('#pwd').attr('type','text')
        }else if($('#pwd').attr('type')=='text'){
          $('#pwd').attr('type','password')

        }
      },
      submit(){ // 提交1.token的获取存储到Vuex和一个地方 2.路由信息的获取存储 3. 菜单信息 动态路由的生成
        console.log('???执行了没')
        axios.post(loginInter ,({account:this.form.name,
          password:this.form.password,identifyingCode:this.form.yzm})).then( (res) => {
          console.log(res)
          if(res.data.state==true){ // 获取数据后进行存取操作
            var token=res.data.row.authorization // 获取token
            console.log(token)

            //localStorage.setItem('token',token) // 存入本地 字符串形式存取
            this.$store.commit('login', token)// 存入Vuex
            // 获取路由信息
            // 过滤生成动态路由
            // 过滤生成权限菜单信息
            // 存储动态路由
            // 存储权限带单信息
            this.$router.push('/powerMode'); // 跳转至首页 首页的渲染应加入loading设置
          }else{
            if($('#name').val()&&$('#pwd').val())
              $('#msg').html(res.data.msg)
            if(res.data.row>2){
              $('#yzm').show()
              $('#imgYzm').attr("src",yzmurl+Math.random());
            }
          }
        })
      },
    },
    mounted:function(){ // 二维码的获取
      axios.post( rowurl ,({})).then(function (request) {
        console.log(request);
        if(request.data.row>2){
          $('#yzm').show()
          $('#imgYzm').attr("src",yzmurl+Math.random());
        }
      })
      $('#yzm').hide()
    }
  }
</script>

<style scoped>
  #login{
    background-image: url("../base/img/login/login_bg_3.png");
    background-size: cover;
    min-height: 100vh;
    width: 100%;
  }
  #reg{
    font-size:35px;
    color: #0096FF;
    font-weight: bold;
  }
  .divHeight{
    height: 68px;
    width: 300px;
    border-bottom: 1px solid lightgray;
    position: relative;
  }
  .imgHeight{
    position: absolute;
    top:30px;
    height: 26px;
  }
  .inputHeight{
    position: absolute;
    top: 30px;
    left: 35px;
    font-size: 20px;
    outline: none;
    border: none;
  }
  input::-webkit-input-placeholder{
    color: lightgray;
    font-size: 18px;
  }
  button{
    width: 300px;
    height: 50px;
    border-radius: 30px;
    border: none;
    background-color:#0096FF ;
    color: white;
    font-size: 20px;
    outline:none;
    cursor: pointer;
  }
  #msg{
    font-size: 15px;
    color: red;
    text-align: center;
    width: 300px;
    margin-top: 5px;
  }
  #imgYzm{
    position: relative;
    left:170px;
    top:15px;
    width: 130px;
    height: 45px
  }
</style>
