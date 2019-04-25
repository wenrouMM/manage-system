<template>
  <div>
    <div style="width: 100%;height: 952px;background-color: white;position: relative" v-loading="formLoading">
      <div style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px">
        <div>
          <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
          <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">图书登记</div>
        </div>
      </div>
      <el-form :model="numberValidateForm" :ref="numberValidateForm" label-width="100px" class="demo-ruleForm" style="position: absolute;left: 340px;top: 135px">
        <el-form-item
          label="条　　码 :"
          prop="barcode"
          :rules="[{ required: true, message: '请输入条码',trigger: 'blur'}]">
          <el-input v-model="numberValidateForm.barcode" auto-complete="off" v-on:input="barcodeCheck"  style="width: 398px;" placeholder="请输入条码"></el-input>
        </el-form-item>
      </el-form>
      <el-form
        v-loading="formLoading"
        element-loading-text="正在执行中"
        id="addFormBI"
        :ref="addForm"
        :model="addForm"
        :rules="addRules"
      >
          <section class="upload mr_30">
            <!-- 背景图片做改动 -->
            <div class="defultHead"></div>
          </section>
          <div style="display: flex;flex-direction: row;margin-left:850px;margin-top: -160px">
            <el-form-item label=" I S B N : "  prop="isbn" style="width: 500px;margin-left: 90px" :label-width="formLabelWidth">
              <el-input v-model="addForm.isbn" autocomplete="off" style="width: 400px" placeholder="请输入ISBN" :disabled="disable"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width: 1200px;margin-left: 350px;margin-top: 30px">
            <el-form-item label="索书号码 : " prop="bookIndex" :label-width="formLabelWidth">
              <el-input v-model="addForm.bookIndex" autocomplete="off" style="width: 400px" :disabled="disable"  placeholder="请输入索书号码"></el-input>
            </el-form-item>
            <el-form-item label="书籍名称 : " prop="bookName" :label-width="formLabelWidth" style="margin-left: 100px">
              <el-input v-model="addForm.bookName" autocomplete="off" style="width: 400px;" :disabled="disable"  placeholder="请输入书籍名称"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width: 1400px;margin-left: 10px;margin-top: 50px">
            <el-form-item label="出版社名 : " class="mr_30" prop="lib" :label-width="formLabelWidth" style="position: relative;margin-left: 110px">
              <el-input v-model="addForm.lib" autocomplete="off"  style="width: 500px" :disabled="disable"  placeholder="请输入出版社名"></el-input>
              <img src="../../../base/img/currency/sousuo.png" style="width: 40px;height: 40px;position: absolute;top: 0;left: 450px" @click="libMessage">
            </el-form-item>
            <el-form-item label="作　　者 : " prop="author" :label-width="formLabelWidth" style="margin-left: 110px">
              <el-input v-model="addForm.author" autocomplete="off" style="width: 500px;" :disabled="disable"  placeholder="请输入作者"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width: 1400px;margin-left: 120px;margin-top: 20px">
            <el-form-item label="价　　格 : " prop="value" class="mr_30" :label-width="formLabelWidth">
              <el-input v-model="addForm.value" autocomplete="off" style="width: 500px" :disabled="disable"  placeholder="请输入价格"></el-input>
            </el-form-item>
            <el-form-item label="页　　码 : " prop="page" :label-width="formLabelWidth" style="margin-left: 110px">
              <el-input v-model="addForm.page" autocomplete="off"  style="width: 500px;" :disabled="disable"  placeholder="请输入页码"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width: 700px;margin-left: 790px;margin-top: 20px">
            <el-form-item label="书籍类型 : " prop="typeName" :label-width="formLabelWidth" style="position: relative;margin-left: 60px" >
              <el-input v-model="addForm.typeName" autocomplete="off" style="width: 500px;" :disabled="disable"  placeholder="请选择书籍类型"></el-input>
              <img src="../../../base/img/currency/sousuo.png" style="width: 40px;height: 40px;position: absolute;top: 0;left: 450px" @click="typeMessage">
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;width:700px;margin-left: 790px;margin-top: 20px">
            <el-form-item label="总　　数 : " prop="total" :label-width="formLabelWidth" style="margin-left:60px ">
              <el-input v-model="addForm.total" autocomplete="off" style="width: 200px"  :disabled="disable" placeholder="请输入借出数量"></el-input>
            </el-form-item>
            <el-form-item label="状　　态 : " prop="status" style="width: 300px;margin-left:70px " :label-width="formLabelWidth">
              <el-radio-group v-model="addForm.status" :disabled="disable">
                <el-radio label="上架"></el-radio>
                <el-radio label="下架"></el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <el-form-item label="书籍简介 : " prop="bookcontent" :label-width="formLabelWidth" style="margin-top: -130px;margin-left:120px ;width: 500px">
            <el-input type="textarea"  v-model="addForm.bookcontent" autocomplete="off"  :autosize="{ minRows: 4, maxRows: 4}" :disabled="disable" placeholder="请输入书籍简介"></el-input>
          </el-form-item>
          <!-- 弹框表单按钮  验证失效-->
          <el-form-item class="dialogFooter" style="margin-left: 520px;margin-top: 70px;width: 500px">
            <el-button class="buttonTrueColor" @click="submitForm">确定</el-button>
            <el-button class="buttonCancelColor" @click="resetForm">重置</el-button>
          </el-form-item>
      </el-form>
    </div>
    <div id="typeMessage" >
      <div style="position: relative">
        <p>{{messageName}}</p>
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
          }, //ztree树加载的配置
          zNodes: [], //ztree树的数据
          numberValidateForm: {
            barcode: ''
          },
          addForm: {
            // 添加的数据表单 共8个参数
            addDialog: false,
            headerAddress: "", // 传递来的图片
            headIcon: "", // 预览的图片
            files: "", // 用于上传
            bookName: "", // 书籍名称
            bookIndex: "", // 书籍索引
            author: '', // 作者
            lib: "", // 出版社
            isbn:'',
            page: "", // 页码
            value: "", // 价格
            typeName: "", // 类型名称
            bookcontent: "", // 书籍简介
            status:"", //状态
            total:'',//总数
          },
          files: null, // 传递给后台的请求
          defaultImg:'', // 默认图片地址
          addRules: {
            // 添加的参数验证
            isbn:[{ required: true, message: "请输入ISBN", trigger: "blur" }],
            bookName: [{ required: true, message: "请输入书籍名称", trigger: "blur" }],
            bookIndex: [{ required: true, message: "请输入索书号", trigger: "blur" }],
            author: [{ required: true, message: "请输入作者", trigger: "blur" }],
            lib: [{ required: true, message: "请选择出版社", trigger: "change" }],
            page: [{ required: true, message: "请输入页码", trigger: "blur" }],
            value:[{ required: true, message: "请输入价格", trigger: "blur" }],
            typeName: [{ required: true, message: "请选择书籍类型", trigger: "change" }],
            bookcontent: [{ required: true, message: "请输入书籍简介", trigger: "blur" }],
            status: [{ required: true, message: "请选择状态", trigger: "change" }],
            total:[{ required: true, message: "请输入总数", trigger: "blur" }]
          },
          formLabelWidth: "90px",
          formLoading:false,
          treeLoading:false,
          disable:false, //是否禁用
          messageName:null, //弹框名称
          libCode:null,
          typeCode:null,
          isShowMessage:''
        }
      },
      computed: {
        addData() {
          // 计算属性 添加真正传递的数据
          let addData = {
            author: this.addForm.author,
            barcode: this.numberValidateForm.barcode,
            fkPressCode: this.libCode,
            fkPressName: this.addForm.lib,
            fkTypeCode:this.typeCode,
            fkTypeName: this.addForm.typeName,
            introduction: this.addForm.bookcontent,
            name: this.addForm.bookName,
            isbn:this.addForm.isbn,
            //person //录入人
            price: this.addForm.value,
            searchNumber: this.addForm.bookIndex,
            state: this.addForm.status=='上架'?1:0,
            total:this.addForm.total,
            pageNumber: this.addForm.page
          };
          return addData;
        },
      },
      mounted() {
        $('#typeMessage').fadeOut()
      },
      methods: {
        /*====== 关闭弹窗 ======*/
        closeCheck() {
          $('#typeMessage').fadeOut()
        },
        /*====== 出版社弹窗内容 ======*/
        libMessage(){
            this.messageName='请选择出版社名称'
            this.zNodes.length=0
            this.freshArea(bookRegistlib)
        },
        /*====== 书籍弹窗内容 ======*/
        typeMessage() {
          this.messageName = '请选择书籍类型'
          this.zNodes.length = 0
          this.freshArea(bookRegisttype)
        },
        /*====== ztree节点点击添加节点信息 ======*/
        zTreeOnClick(event, treeId, treeNode){
          $('#typeMessage').fadeOut()
          if(this.messageName=='请选择出版社名称'){
            if(treeNode.code!=null)
            this.addForm.lib=treeNode.name
            this.libCode=treeNode.code
          }else{
            this.addForm.typeName=treeNode.name
            this.typeCode=treeNode.code
          }
        },
        /*====== ztree加载请求 ======*/
        async freshArea(value) {
          var list=[]
          this.axios.get(value).then((response) => {
            console.log(response)
            if(response.data.state==true){
              for (var item of response.data.row) {
                console.log('ztree树',item)
                list.push({
                  id: item.id, //节点id
                  pId: item.pid, //节点父id
                  name: item.name, //节点名称
                  code: item.code, //节点编码
                });
              }
              //将数据渲染到ztree树
              $.fn.zTree.init($("#treeDemo"), this.setting, list);
              if(list.length>0){
                $('#typeMessage').fadeIn()
                this.zNodes=list
              }

            }else{
              this.$message.error(response.data.msg);
            }
          })
        },
        /*====== ISBN条码请求数据操作 ======*/
        barcodeCheck() {
          console.log('input框值的变化')
          console.log('条码',this.numberValidateForm.barcode)
          for (let key in this.addForm) {
            console.log('表单值',this.addForm[key])
            this.addForm[key] = ''
          }
          if (this.numberValidateForm.barcode !== '') {
            //this.$refs[this.addRules].resetFields()
            this.axios.get(bookRegist, {params: {barcode: this.numberValidateForm.barcode}}).then((res) => {
              //console.log(1)
              console.log(res.data)
              if (res.data.state == true) {
                console.log('isbn的数据', res.data)
                if (res.data.row.length == 0) {
                  console.log('row为空')
                  //this.$message(res.data.msg);
                  for (let key in this.addForm) {
                    this.addForm[key] = ''
                  }
                  this.disable = false
                  //console.log(this.addForm)
                } else {
                  console.log('row不为空')
                    console.log('为表单元素赋值')
                    this.addForm.bookName = res.data.row[0].name;
                    this.addForm.isbn=res.data.row[0].isbn
                    this.addForm.bookIndex = res.data.row[0].searchNumber;
                    this.addForm.author = res.data.row[0].author;
                    this.addForm.lib = res.data.row[0].fkPressName;
                    this.addForm.page = res.data.row[0].pageNumber;
                    this.addForm.value = res.data.row[0].price;
                    this.addForm.typeName = res.data.row[0].fkTypeName;
                    this.addForm.bookcontent = res.data.row[0].introduction;
                    this.addForm.total=res.data.row[0].total;
                    this.addForm.status=res.data.row[0].state=1?'上架':'下架'
                    for(let item in this.addForm){
                      console.log(item)
                      console.log(this.addForm[item])
                      if(this.addForm[item]!==undefined){
                        console.log(item,'不为空')
                        this.disable=true
                      }
                    }
                }
              }
            })
          } else {
            console.log('isbn为空')
          }
        },
        /*====== 添加请求操作 ======*/
        addApi(value){
          this.axios.post(bookRegistadd,value).then((res)=>{
            console.log(res)
            if(res.data.state==true){
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.$refs[this.numberValidateForm].resetFields();
              this.$refs[this.addForm].resetFields();
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
        },
        /*====== 确定按钮发送添加请求 ======*/
        submitForm() {
          // 提交弹框按钮执行函数
          if (this.disable === true) {
            console.log('不执行添加')
            return
          } else {
           if(this.numberValidateForm.barcode){
             this.$alert('条码不能为空', '提示', {
               confirmButtonText: '确定',
             });
           }else{
             this.$refs[this.addForm].validate((valid) => {
               if (valid) {
                 console.log('submit!');
                 this.addApi(this.addData)
               } else {
                 console.log('error submit!!');
                 return false;
               }
             });
           }
          }
        },
        /*====== 重置按钮清空表单内容 ======*/
        resetForm() {
          // 重置按钮
          this.$refs[this.numberValidateForm].resetFields();
          this.$refs[this.addForm].resetFields();
        },
      },
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
    width: 200px;
  }
  .dialogFooter .el-button.buttonCancelColor{
    background-color:#D5D5D5;
    width: 200px
  }
</style>
