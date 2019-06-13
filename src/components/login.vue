<template>
  <div id="login">
    <div id="backgroundImg">
      <div style="position: absolute;top: 100px;left:680px">
        <div id="reg">管理员登陆</div>
        <div class="divHeight" style="margin-top: 20px">
          <img src="../base/img/login/icon_1.png" class="imgHeight">
          <input type="text" placeholder="请输入电话号码/身份证/邮箱" id="name" notnull info="用户名"  mustlength="18" class="inputHeight" v-model="form.name">
        </div>
        <div class="divHeight">
          <img src="../base/img/login/icon_2.png" class="imgHeight">
          <input @keyup.enter="submit" type="password" placeholder="请输入密码" id="pwd"  notnull info="密码" maxlength="30" class="inputHeight" v-model="form.password" style="position: relative">
          <img src="../base/img/currency/yanjing.png"  id="show" style="width: 25px;height: 25px;position: absolute;top: 33px;left: 270px" @click="isShowCheck">
        </div>
        <div class="divHeight" id="yzm">
          <input type="text"  placeholder="请输入验证码" id="yzvalue" class="inputHeight" maxlength="4" style="position: absolute;left: 0;width: 150px" v-model="form.yzm">
          <span><img src="" id="imgYzm" @click="imgClick"></span>
        </div>
        <div style="margin-top: 55px;">
          <el-button type="primary" :loading="buttonLoading" @click="submit" >登录</el-button>
        </div>
        <div id="msg"></div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {loginInter,login} from '../request/api/base.js'
  export default {
    name: "login.vue",
    data:function(){
      return {
        form:{
          name:'',
          password:'',
          yzm:'',
        },
        isLand:null,
        clickNum:0,
        buttonLoading:false
      }
    },
    methods:{
      imgClick(){
        $('#imgYzm').attr("src",login.yzm+Math.random());
      },
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
        if($('#name').val()&&$('#pwd').val()){
          $('#msg').html('');
          console.log('登陆')
          this.clickNum++
          this.buttonLoading =true
          axios.post(loginInter ,({account:this.form.name,
            password:this.form.password,identifyingCode:this.form.yzm})).then( (res) => {
            console.log(res)
            if(res.data.state==true){ // 获取数据后进行存取操作
              this.isLand=true
              var token=res.data.row.authorization // 获取token
              var userInfo = JSON.stringify(res.data.row.authTbManager)
              var menu = JSON.stringify(res.data.row.roleModularMenus)

              sessionStorage.setItem('token',token)
              sessionStorage.setItem('userInfo',userInfo)
              sessionStorage.setItem('menu',menu)
              let number = String(res.data.row.roleModularMenus[0].priority)
              sessionStorage.setItem("headIndex",number)
              this.$store.commit('setToken',token)
              this.$store.commit('setUserInfo',userInfo)
              this.$store.commit('setMenu',menu)
              // 获取路由信息
              // 过滤生成动态路由
              // 过滤生成权限菜单信息
              // 存储动态路由
              // 存储权限带单信息
              this.$router.push('/indexTest'); // 跳转至首页 首页的渲染应加入loading设置
              this.buttonLoading = false
            }else{
              if($('#name').val()&&$('#pwd').val())
                $('#msg').html(res.data.msg)
              if(res.data.row>2){
                $('#yzm').show()
                $('#imgYzm').attr("src",login.yzm+Math.random());
              }
              this.buttonLoading = false
            }
          })
          if(this.clickNum>5){
            $('#msg').html('连接出错，请检查您的网络')
            this.buttonLoading = false
          }
          var landTime=setTimeout(()=>{
            if(this.isLand==null){
              $('#msg').html('连接出错，请检查您的网络')
              this.buttonLoading = false
            }
          },10000)
          clearTimeout(landTime)
        }else if($('#name').val()==false&&$('#pwd').val()==false){
          $('#msg').html('请先输入用户名和密码');
          this.buttonLoading = false
        }else if($('#name').val()&&$('#pwd').val()==false){
          $('#msg').html('密码不能为空');
          this.buttonLoading = false
        }else if($('#name').val()==false&&$('#pwd').val()){
          $('#msg').html('用户名不能为空');
          this.buttonLoading = false
        }
      },
    },
    mounted:function(){ // 二维码的获取
      axios.post( login.yzm ,({})).then(function (request) {
        console.log(request);
        if(request.data.row>2){
          $('#yzm').show()
          $('#imgYzm').attr("src",login.yzm+Math.random());
        }
      })
      $('#yzm').hide()
    }
  }
</script>

<style scoped>
  #login{
    background-image: url("../base/img/login/login_bg_1.png");
    background-size: cover;
    min-height: 100vh;
    width: 100%;
    padding-top: 150px;
  }
  #backgroundImg{
    border-radius: 20px;
    margin: 0px auto;
    padding-top:170px;
    width: 1100px;
    height: 380px;
    position: relative;
    background-image: url("../base/img/login/login_bg_2.png");
    overflow: auto;
    background-color: white;
    filter:progid:DXImageTransform.Microsoft.Shadow(color=#014ad4,direction=120,strength=4);
    -moz-box-shadow: 2px 2px 130px #014ad4;
    -webkit-box-shadow: 2px 2px 130px #014ad4;
    box-shadow:2px 2px 130px #014ad4;
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
