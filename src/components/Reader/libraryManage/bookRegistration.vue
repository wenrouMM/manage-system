<template>
  <div>
    <div style="width: 100%;height: 952px;background-color: white;" v-loading="formLoading">
      <div style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px">
        <div>
          <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
          <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">图书登记</div>
        </div>
      </div>
      <el-form
        v-loading="formLoading"
        element-loading-text="正在执行中"
        id="addFormBI"
        ref="addForm"
        :model="addForm"
        :rules="addRules"
      >
          <section class="upload mr_30" @click="pointer">
            <!-- 背景图片做改动 -->
            <div class="defultHead">
              <img class="defaultimage" style="width:150px; height:200px;" alt="user image" :src="defaultImg" v-if="!addForm.headIcon||!addForm.headerAddress">
              <img style="width:150px; height:200px ;" v-if="!addForm.headIcon" :src="addForm.headerAddress" alt="传递照片" class="preloadImg">
              <img style="width:150px; height:200px ;" v-if="addForm.headIcon" :src="addForm.headIcon" alt="预览照片" class="preloadImg">
              <input type="file" accept="jpg/png" style="display:none;" ref="file" id="file" @change="getFile">
              <div class="bgload" style="width:150px; height:200px; ">上传封面</div>
            </div>
          </section>
          <div style="display: flex;flex-direction: row;width: 1200px;margin-left: 350px;margin-top: -140px">
            <el-form-item label="条码(ISBN) : " prop="barcode" style="width: 500px">
              <el-input v-model="addForm.barcode" autocomplete="off" style="width: 400px" @input="isbnCheck" :disabled="disable" placeholder="请输入条码"></el-input>
            </el-form-item>
            <el-form-item label="书籍名称 : " prop="bookName" :label-width="formLabelWidth" style="margin-left: 100px">
              <el-input v-model="addForm.bookName" autocomplete="off" style="width: 400px;" :disabled="disable" placeholder="请输入书籍名称"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width: 1200px;margin-left: 350px;margin-top: 30px">
            <el-form-item label="索书号码 : " prop="bookIndex" :label-width="formLabelWidth">
              <el-input v-model="addForm.bookIndex" autocomplete="off" style="width: 400px" :disabled="disable" placeholder="请输入索书号码"></el-input>
            </el-form-item>
            <el-form-item label="作　　者 : " prop="author" :label-width="formLabelWidth" style="margin-left: 110px">
              <el-input v-model="addForm.author" autocomplete="off" style="width: 400px;" :disabled="disable" placeholder="请输入作者"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width: 1400px;margin-left: 120px;margin-top: 30px">
            <el-form-item label="出版社团 : " class="mr_30" prop="lib" :label-width="formLabelWidth">
              <el-input v-model="addForm.lib" autocomplete="off"  style="width: 500px" :disabled="disable" placeholder="请输入出版社团"></el-input>
            </el-form-item>
            <el-form-item label="页　　码 : " prop="page" :label-width="formLabelWidth" style="margin-left: 110px">
              <el-input v-model="addForm.page" autocomplete="off"  style="width: 500px;" :disabled="disable" placeholder="请输入页码"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width: 1400px;margin-left: 120px;margin-top: 30px">
            <el-form-item label="价　　格 : " prop="value" class="mr_30" :label-width="formLabelWidth">
              <el-input v-model="addForm.value" autocomplete="off" style="width: 500px" :disabled="disable" placeholder="请输入价格"></el-input>
            </el-form-item>
            <el-form-item label="类型名称 : " prop="typeName" :label-width="formLabelWidth" style="position: relative;margin-left: 110px" >
              <el-input v-model="addForm.typeName" autocomplete="off" style="width: 500px;" :disabled="disable" placeholder="请输入类型名称"></el-input>
              <img src="../../../base/img/currency/sousuo.png" style="width: 40px;height: 40px;position: absolute;top: 0;left: 450px" @click="typeMessage">
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width: 1400px;margin-left: 120px;margin-top: 30px">
            <el-form-item label="藏馆号码 : " prop="Num" :label-width="formLabelWidth">
              <el-input v-model="addForm.Num" autocomplete="off" style="width: 500px" :disabled="disable" placeholder="请输入藏馆号码"></el-input>
            </el-form-item>
            <el-form-item label="藏馆数量 : " prop="libNum"  :label-width="formLabelWidth" style="margin-left: 140px">
              <el-input v-model="addForm.libNum" autocomplete="off"  style="width: 500px;" :disabled="disable" placeholder="请输入藏馆数量"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width:1400px;margin-left: 120px;margin-top: 30px">
            <el-form-item label="借出数量 : " prop="returnNum" :label-width="formLabelWidth">
              <el-input v-model="addForm.returnNum" autocomplete="off" style="width: 500px" :disabled="disable" placeholder="请输入借出数量"></el-input>
            </el-form-item>
            <el-form-item label="状  态 : " prop="status" style="margin-left: 140px;width: 1400px" :disabled="disable" placeholder="请选择状态">
              <el-radio-group v-model="addForm.status">
                <el-radio label="禁用" ></el-radio>
                <el-radio label="启用"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="书籍简介 : " prop="bookcontent" :label-width="formLabelWidth" style="margin-top: 40px;margin-left:100px ;">
            <el-input type="textarea" v-model="addForm.bookcontent" autocomplete="off"  :autosize="{ minRows: 4, maxRows: 4}" :disabled="disable" placeholder="请输入书籍简介"></el-input>
          </el-form-item>
          <!-- 弹框表单按钮  验证失效-->
          <el-form-item class="dialogFooter" style="margin-left: 900px;margin-top: -90px;width: 500px">
            <el-button class="buttonTrueColor" @click="submitForm('addForm')">确定</el-button>
            <el-button class="buttonCancelColor" @click="resetForm('addForm')">取消</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div id="typeMessage" >
      <div style="position: relative">
        <p>请选择类型名称</p>
        <img src="../../../base/img/menu/xx.png" style="position: absolute;top: 10px;left: 340px;width: 30px;height: 30px" @click="closeCheck">
      </div>
      <div>
        <ul id="treeDemo" class="ztree"></ul>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
      name: "bookRegistration",
      data(){
        return{
          setting: {
            edit: {
              enable: true,
              showRemoveBtn: false,
              addHoverBtn: false,
              showRenameBtn: false,
              editNameSelectAll: true
            },
            data: {
              simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
              }
            },
            view: {
              showLine: false,
              showIcon: true,
              dblClickExpand: false,
              selectedMulti: true,
            },
            callback: {
              onClick: this.zTreeOnClick, //节点点击事件
            }
          },
          zNodes: [],
          addForm: {
            // 添加的数据表单 共8个参数
            addDialog: false,
            headerAddress: "", // 传递来的图片
            headIcon: "", // 预览的图片
            files: "", // 用于上传
            bookName: "", // 书籍名称
            bookIndex: "", // 书籍索引
            author: null, // 作者
            lib: "", // 出版社
            page: "", // 页码
            barcode: "", // 条码
            value: "", // 价格
            typeName: "", // 类型名称
            bookcontent: "", // 书籍简介
            Num:"", //藏馆号码
            libNum:"", //藏馆数量
            returnNum:"", //借出数量
            status:"", //状态
          },
          files: null, // 传递给后台的请求
          defaultImg:'', // 默认图片地址
          addRules: {
            // 添加的参数验证
            bookName: [{ required: true, message: "请输入书籍名称", trigger: "blur" }],
            bookIndex: [{ required: true, message: "请输入索书号", trigger: "blur" }],
            author: [{ required: true, message: "请输入作者", trigger: "blur" }],
            lib: [{ required: true, message: "请输入出版社", trigger: "blur" }],
            page: [{ required: true, message: "请输入页码", trigger: "blur" }],
            barcode: [{ required: true, message: "请输入条码", trigger: "blur" }],
            value:[{ required: true, message: "请输入价格", trigger: "blur" }],
            typeName: [{ required: true, message: "请选择类型名称", trigger: "blur" }],
            bookcontent: [{ required: true, message: "请输入书籍简介", trigger: "blur" }],
            Num: [{ required: true, message: "请输入藏馆号码", trigger: "blur" }],
            libNum: [{ required: true, message: "请输入藏馆数量", trigger: "blur" }],
            returnNum: [{ required: true, message: "请输入借出数量", trigger: "blur" }],
            status: [{ required: true, message: "请输入状态", trigger: "change" }],
          },
          formLabelWidth: "90px",
          formLoading:false,
          disable:false
        }
      },
      methods:{
        typeMessage(){
          $('#typeMessage').fadeIn()
        },
        closeCheck(){
          $('#typeMessage').fadeOut()
        },
        zTreeOnClick(event, treeId, treeNode) {
          $('#typeMessage').fadeOut()
          this.searchForm.type=treeNode.name
        },
        async freshArea() {
          this.axios.get(bookurltypemes).then((response)=>{
            console.log(response)
            for (var item of response.data.row) {
              //console.log(item)
              this.zNodes.push({
                id: item.id, //节点id
                pId: item.pid, //节点父id
                name: item.name, //节点名称
                code:item.code, //
              });
            }
            //将数据渲染到ztree树
            $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
          })
        },
        isbnCheck(){
          console.log(this.addForm.barcode)
          this.axios.get(bookRegist,{params:{barcode:this.addForm.barcode}}).then((res)=>{
            console.log(res)
          })
        },
        submitForm(formName) {
          // 提交弹框按钮执行函数
          let url = "";
          let method = "";
          let data = this.addEdit;
          let files = this.files; // 头像上传的文件 在编辑框中保存

          this.$refs[formName].validate(valid => {
            if (valid) {
              this.formLoading = true; // 进入执行状态 锁定表单
              if (files != null) {
                // 检测是否有文件 有就意味着被更改了
                var formdatas = new FormData();
                formdatas.append("file", files);
                //console.log(formdatas.get('file'))
                this.axios({
                  method: "post",
                  url: menuimg,
                  data: formdatas,
                  //cache: false,//上传文件无需缓存
                  processData: false, //用于对data参数进行序列化处理 这里必须false
                  contentType: false, //
                  dataType: "JSON",
                  ContentType: "multipart/form-data"
                }).then(request => {
                  console.log('图片上传执行')
                  console.log(request)
                  // 如果是编辑 更换图片失败后
                  if (request.data.row != "") {
                    this.addForm.headerAddress = request.data.row;
                  }
                  console.log("上传图片后", this.addEdit);
                });
              }

              axios({
                // 发起API请求
                url: url,
                method: method,
                data: data
              }).then(res => {
                console.log(res.data);
                if (res.data.state) {
                  this.SearchApi(this.searchTimeForm);
                  this.$message.success("执行成功"); // 提示成功信息
                  this.dialogFormVisible = false; // 关闭弹框
                } else {
                  this.$message.error(res.data.msg); // 提示失败信息
                }
              });

              this.formLoading = false; // 执行结束后 解开锁屏
            } else {
              return false;
            }
          });
        },
        resetForm(formName) {
          // 重置按钮
          //this.dialogFormVisible = false;
          this.$refs[formName].resetFields();
        },
        pointer() {
          // 图片上传
          this.$refs.file.click();
        },
        getFile(e) {
          // 图片预览
          let _this = this; // 缓存this
          let value = _this.$refs.file.value;
          var files = e.target.files[0]; // 事件对象包含的信息 files是路径
          _this.files = files;
          console.log(_this.files);
          if (!e || !window.FileReader) return; // 看支持不支持FileReader
          let reader = new FileReader(); // 定义 fileReader对象
          reader.readAsDataURL(files); // 转换为base64的url路径 其他三个API转换为text 二进制  arraybuffer
          reader.onloadend = function() {
            _this.addForm.headIcon = this.result; // 此时this指向的fileReader对象
            _this.$refs.file.value = "";
          };
        },
      },
      mounted(){
        this.freshArea()
        $('#typeMessage').fadeOut()
        console.log(this.addForm.barcode)
      }
    }
</script>

<style scoped>
  #typeMessage{
    display: none;
    position: absolute;
    top: 200px;
    left:750px;
    z-index: 30000;

  }
  #typeMessage div:nth-child(1){
    width: 400px;
    height: 50px;
    background-color: #0096FF;
    font-size: 20px;
    color: white;
    text-align: center;
    line-height: 50px;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
    -moz-box-shadow: 2px 2px 10px #909090;
    -webkit-box-shadow: 2px 2px 10px #909090;
    box-shadow:2px 2px 10px #909090;
  }
  #typeMessage div:nth-child(2){
    overflow: auto;
    height:500px ;
    width: 370px;
    background-color: white;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
    padding-left: 30px;
    padding-bottom: 30px;
    filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
    -moz-box-shadow: 2px 2px 10px #909090;
    -webkit-box-shadow: 2px 2px 10px #909090;
    box-shadow:2px 2px 10px #909090;
  }
  .defultHead{
    height: 200px;
    width: 150px;
    border: 1px solid lightgray;
    background-color: lightgray;
    position: relative;
  }
  .preloadImg{
    position: absolute;
    top: 0;
    left: 0;
  }
  .upload{
    height: 200px;
    width: 150px;
    margin-left:120px;
    padding-top: 50px;
  }
  .dialogFooter{
    width: 100%;
    padding-top: 20px;
    text-align: center;
    font-size: 0;
  }
  .dialogFooter .el-button{
    height: 46px;
    width: 150px;
    border-radius:10px;
    display: inline-block;
    cursor: pointer;
    font-size:18px;
    color:#fff;
    border: none;
    box-sizing: border-box;
    text-align: center;
    margin-right: 20px;
  }
  .dialogFooter .el-button.buttonTrueColor{
    background-color:#0096FF;
  }
  .dialogFooter .el-button.buttonCancelColor{
    background-color:#D5D5D5;
  }
</style>
