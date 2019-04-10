<template>
    <div class="getCard">
      <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
        <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
        <div style="font-size: 16px;color: #878787;margin-left:10px;">办卡</div>
      </div>
      <div style="width: 610px;height: 600px;" class="formDiv">
        <el-form ref="addForm" :model="addForm" :rules="addRules">
          <el-form-item class="uploadBox" style="width: 100px;margin-left: 250px;margin-top: 20px">
            <section class="upload mb_30" @click="pointer">
              <!-- 背景图片做改动 -->
              <div class="defultHead" style="width:100px; height:100px; border-radius:50%;position: relative">
                <img class="defaultimage" style="width:100px; height:100px; border-radius:50%;" alt="user image" :src="defaultImg" v-if="!addForm.preloading">
                <img src="../../../../src/base/img/menu/tbhs.png" style="position: absolute;top: 0;left: 0;width:100px; height:100px; border-radius:50%;" alt="">
                <img style="width:100px; height:100px ;border-radius:50%;position: absolute;top: 0;left: 0" v-if="addForm.preloadImg" :src="addForm.preloadImg" alt="预览照片" class="preloadImg">
                <input type="file" accept="jpg/png" style="display:none;" ref="file" id="file" @change="getFile">
              </div>
            </section>
          </el-form-item>
          <!-- 表单域 -->
          <el-form-item label="用   户   名" prop="name" :label-width="formLabelWidth" style="width: 300px">
            <el-input v-model="addForm.name" autocomplete="off" class="inputDiv" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item class="select" label="性　　别" prop="sex" style="width: 300px">
            <el-radio-group v-model="addForm.sex">
              <el-radio label="男"></el-radio>
              <el-radio label="女"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="身份证号" prop="id" :label-width="formLabelWidth" style="width: 300px">
            <el-input v-model="addForm.id" autocomplete="off" class="inputDiv" placeholder="请输入身份证号"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phoneNumber" :label-width="formLabelWidth" style="width: 300px">
            <el-input v-model="addForm.phoneNumber" autocomplete="off" class="inputDiv" placeholder="请输入电话号码"></el-input>
          </el-form-item>
          <el-form-item label="卡  号" prop="cardNumber" :label-width="formLabelWidth" style="width: 300px">
            <el-input v-model="addForm.cardNumber" autocomplete="off" class="inputDiv" placeholder="请输入卡号"></el-input>
          </el-form-item>
          <el-form-item label="押金金额" prop="deposit" :label-width="formLabelWidth" style="width: 580px">
            <el-button v-model="addForm.deposit.one"  type="warning" plain>￥ 100 </el-button>
            <el-button v-model="addForm.deposit.two"  type="warning" plain>￥ 200 </el-button>
            <el-button v-model="addForm.deposit.three" type="warning" plain>￥ 300 </el-button>
            <el-button v-model="addForm.deposit.three" type="warning" plain>￥ 400 </el-button>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" style="width: 400px">
            <el-button type="primary" style="border-radius: 10px;width: 150px">确定</el-button>
            <el-button type="info"  style="border-radius: 10px;width: 150px">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
    export default {
        name: "getAcard",
        data(){
          return{
            addForm: {
              // 添加的数据表单 共8个参数
              addDialog: false,
              preloadImg: "", // 图片相关
              files: "", // 用于上传
              name: "", // 用户名
              sex: "", // 性别
              id: "", // 身份证
              phoneNumber: "", // 电话号码
              deposit: {
                one:100,
                two:200,
                three:300,
                four:400
              }
            },
            addRules: {
              // 添加的参数验证
              name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
              sex: [{ required: true, message: "请选择性别", trigger: "change" }],
              id: [{ required: true, message: "请输入身份证号码", trigger: "blur" }],
              phoneNumber: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
              cardNumber: [{ required: true, message: "请输入读书卡号", trigger: "blur" }],
              deposit:[{ required: true, message: "请选择金额", trigger: "blur" }],
            },
          }
        },
        methods:{
          pointer() {
            this.$refs.file.click();
          },
          getFile(e) {
            // 1.判断选择事件是否为空
            // 2. 获取数据
            let _this = this; // 缓存this
            let value = _this.$refs.file.value;

            var files = e.target.files[0]; // 事件对象包含的信息 files是路径
            _this.addForm.files = files;
            console.log(_this.addForm.files);
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
        },
        mounted(){

        }
    }
</script>

<style scoped>
  .getCard{
    width: 100%;
    background-color: white;
    height: 757px;
  }
  .inputDiv{
    width: 200px;
    height: 30px;
  }
  .formDiv{
    margin:70px auto
  }
  form div:nth-child(2){
    margin-left: 20px;
  }
  form div:nth-child(3){
    margin-left: 330px;
    margin-top: -60px;
  }
  form div:nth-child(4){
    margin-left: 20px;
    margin-top: 30px;
  }
  form div:nth-child(5){
    margin-left: 330px;
    margin-top: -60px;
  }
  form div:nth-child(6){
    margin-left: 20px;
    margin-top: 30px;
  }
  form div:nth-child(7){
    margin-left: 20px;
    margin-top: 40px;
  }
  form div:nth-child(8){
    margin-left: 140px;
    margin-top: 50px;
  }

</style>
