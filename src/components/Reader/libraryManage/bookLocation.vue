<template>
  <div class="borrowbook" >
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">图书位置绑定</div>
    </div>
    <div style="margin:150px auto;width:1100px">
      <div style="background-color: #ededed;width: 250px;height: 200px;border-radius: 5px">
        <img src="../../../base/img/currency/book.png" style="margin-left: 26px">
      </div>
      <el-form :model="ruleForm" :rules="rules" :ref="ruleForm" label-width="100px" class="demo-ruleForm"  :label-position="labelPosition" >
        <div style="display: flex;flex-direction: column;margin-left: 330px;margin-top: -200px">
          <el-form-item label="馆 藏 码 : " prop="barcode">
            <el-input v-model="ruleForm.barcode" style="width:250px;"  v-on:input="barcodeClick" placeholder="请输入馆藏码"></el-input>
          </el-form-item>
          <el-form-item label="书　　名 :　" prop="bookName" label-width="105px"  style="margin-top: 25px">
            <span>{{ruleForm.bookName}}</span>
          </el-form-item>
          <el-form-item label="索 取 号 :　" prop="bookindex" style="margin-top: 25px">
            <span>{{ruleForm.callNumber}}</span>
          </el-form-item>
        </div>
        <div style="display: flex;flex-direction: row;margin-top: 30px">
          <el-form-item label="图书类型 :　" label-width="105px" prop="bookType" style="width: 330px">
            <span>{{ruleForm.bookType}}</span>
          </el-form-item>
          <el-form-item label="rfid : " prop="rfid" label-width="60px">
            <el-input v-model="ruleForm.rfid" placeholder="请输入rfid"></el-input>
          </el-form-item>
          <el-form-item label="图书位置 :" prop="bookLocation" style="margin-left: 100px;" label-width="90px">
            <span>{{Address.fkStoreId}}{{Address.fkRegionId}}{{Address.colNum}}{{Address.divNum}}{{Address.laysNum}}{{Address.direction}}</span>
          </el-form-item>
          <span @click="locationMessage" id="locaTion">
            位置选择
          </span>
        </div>
        <el-button type="primary" style="width:200px;margin-left: 450px;margin-top: 50px" @click="saveApi">保存</el-button>
      </el-form>
    </div>
    <div class="typeMessage">
      <div style="position: relative">
        <p>请选择位置信息</p>
        <img src="../../../base/img/menu/xx.png" style="position: absolute;top: 10px;left: 340px;width: 30px;height: 30px" @click="closeCheck">
      </div>
      <div v-loading="treeLoading" class="bookAdress">
        <ul id="treeDemo" class="ztree"></ul>
      </div>
    </div>
  </div>
</template>

<script>
  import '../../../zTree_v3/css/zTreeStyle/zTreeStyle.css'
  import { bookLocation } from "../../../request/api/base.js";
  export default {
    data(){
      return{
        treeLoading:false,
        formLoading:false,
        setting: {
          edit: {
            enable: true,
            showRemoveBtn: false,
            addHoverBtn: false,
            removeTitle: "删除节点",
            showRenameBtn: false,
            editNameSelectAll: false
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
            dblClickExpand: true,
            addDiyDom: this.addDiyDom,
            selectedMulti: true,
            addHoverDom: this.addHoverDom,
            removeHoverDom: this.removeHoverDom
          },
          callback: {
            onClick: this.zTreeOnClick, //节点点击事件
            onCollapse: this.onCollapse, //点击图标按钮节点 折叠后 异步加载子数据
            beforeRemove: this.zTreeBeforeRemove, //点击删除时，用来提示用户是否确定删除
            beforeEditName: this.beforeEditName, //点击编辑时触发，用来判断该节点是否能编辑
            onExpand: this.zTreeOnExpand,
            onCollapse: this.onCollapse,
            beforeExpand: this.zTreeBeforeExpand,
          }
        },
        zNodes: [], //ztree树加载的数据
        labelPosition:'left',
        ruleForm:{
          barcode:'',
          bookName:'',
          callNumber:'',
          bookType:'',
          bookTypeCode:'',
          rfid:'',
          bookLocation:'',
          direction:'',
          code:'',
        },//添加的数据
        Address:{ //层架绑定的位置信息
          fkStoreId:'',
          fkRegionId:'',
          colNum:'',
          divNum:'',
          laysNum:'',
          direction:'',
        },
        rules:{
          barcode: [{ required: true, message: '请输入馆藏馆', trigger: 'blur' }],
          bookCode: [{required: true, message: '请输入图书编码', trigger: 'blur' }],
          rfid: [{ required: true, message: '请输入rfid', trigger: 'blur' }],
        },//添加的验证
        ztreeShow:''
      }
    },
    mounted(){
      $('.typeMessage').fadeOut()
    },
    methods:{
      /*====== zTree保持展开单一路径的实现 ======*/
      zTreeBeforeExpand(treeId, treeNode) {
        this.singlePath(treeNode);
        return true;
      },
      singlePath(currNode) {
        //console.log(currNode);
        //节点级别，即节点展开的等级，是爸爸辈还是儿子辈
        var cLevel = currNode.level;
        //这里假设id是唯一的
        var cId = currNode.id;
        //此对象可以保存起来，没有必要每次查找
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        /**
         * 展开的所有节点，这是从父节点开始查找（也可以全文查找）
         * 从当前节点的父节点开始查找，看有没有打开的节点，如果有则判断，若为同一级别的不同节点，则关闭，否则不关闭
         */
        var expandedNodes = treeObj.getNodesByParam("open", true, currNode.getParentNode());
        console.log(expandedNodes);
        for(var i = expandedNodes.length - 1; i >= 0; i--){
          var node = expandedNodes[i];
          var level = node.level;
          var id = node.id;
          if (cId != id && level == cLevel) {
            treeObj.expandNode(node, false);
          }
        }
      },
      /*====== 取消位置信息的弹框 ======*/
      closeCheck(){
        $('.typeMessage').fadeOut()
      },
      /*====== 输入条码发送请求加载数据 ======*/
      barcodeClick:function(){
        console.log('input框值的变化')
        console.log(this.ruleForm.barcode)
        this.axios.get(bookLocation.barcode, {params: {code: this.ruleForm.barcode}}).then((res) => {
          //console.log(res.data)
          if (res.data.state == true) {
            console.log('isbn的数据', res.data)
            if (res.data.row.length == 0) {
              console.log('row为空')
              this.ruleForm.bookName=''
              this.ruleForm.bookType=''
              this.ruleForm.bookTypeCode=''
              this.ruleForm.callNumber=''
            } else {
              console.log('row不为空')
              for (let item of res.data.row){
                console.log('为表单元素赋值',item)
                this.ruleForm.bookName=item.name
                this.ruleForm.bookType=item.fkTypeName
                this.ruleForm.bookTypeCode=item.fkTypeCode
                this.ruleForm.callNumber=item.callNumber
                this.ruleForm.id=item.id
              }
            }
          }
        })
      },
      /*====== 展开节点的操作 ======*/
      zTreeOnExpand(event, treeId, treeNode){
        console.log(treeNode)
        if(treeNode.fkStoreId!=null&&treeNode.fkRegionId==null){
          this.Address.fkStoreId=treeNode.name
          $('#imgX').fadeIn()
        }else if(treeNode.fkRegionId!=null&&treeNode.colNum==null){
          this.Address.fkRegionId=treeNode.name
        }else if(treeNode.colNum!=null&&treeNode.divNum==null){
          this.Address.colNum=treeNode.name
        }else if(treeNode.divNum!=null&&treeNode.laysNum==null){
          this.Address.divNum=treeNode.name
        }else if(treeNode.laysNum!=null&&treeNode.direction==null){
          this.Address.laysNum=treeNode.name
        }
      },
      /*====== 点击节点的操作 ======*/
      zTreeOnClick(event, treeId, treeNode){
        let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        console.log('treeObj',treeObj)
        console.log('direction',treeNode.direction)
        if(treeNode.direction==null){
          this.$message('图书位置必须绑定在面级！！');
        }else{
          console.log(treeNode)
          console.log(treeNode.direction)
          this.Address.direction=treeNode.name
          this.ruleForm.code=treeNode.code
          $('.typeMessage').fadeOut()
        }
      },
      /*====== 位置信息他边框出现的操作 ======*/
      locationMessage(){
        this.ruleForm.bookLocation=''
        this.ruleForm.direction=''
        this.zNodes.length = 0
        this.freshArea()
      },
      /*====== 加载位置信息ztree树的内容 ======*/
      async freshArea() {
        let list=[]
        this.axios.get(bookLocation.tree).then((response) => {
          console.log(response)
          if(response.data.state==true){
            for (var item of response.data.row) {
              //console.log(item)
              list.push({
                id: item.id, //节点id
                pId: item.pid, //节点父id
                name: item.name, //节点名称
                isClick: item.format, //是否是可点击节点
                fkStoreId:item.fkStoreId, //库房号
                fkRegionId:item.fkRegionId, //区号
                colNum:item.colNum, //列
                divNum:item.divNum, //层
                laysNum:item.laysNum, //节
                direction:item.direction,//面
                rfid:item.rfid,
                code:item.code
              });
            }
            //将数据渲染到ztree树
            $.fn.zTree.init($("#treeDemo"), this.setting, list);
            if(list.length>0){
              console.log('ztree树打开')
              $('.typeMessage').fadeIn()
              this.zNodes=list
            }else{
              this.$message('暂无数据')
            }
          }else{
            this.$message({
              message: response.data.msg,
              type: 'error'
            });
          }
        })
      },
      /*====== 添加的表单数据 ======*/
      saveApi(){
        this.$refs[this.ruleForm].validate((valid) => {
          if (valid) {
            console.log('submit!');
            this.formLoading=true
            this.axios.post(bookLocation.location,{
              code:this.ruleForm.barcode,
              rfid:this.ruleForm.rfid,
              locationId:this.ruleForm.code,
            }).then((res)=>{
              console.log(res)
              if(res.data.state==true){
                this.$message({
                  message: res.data.msg,
                  type: 'success'
                });
                let obj = this.ruleForm;
                this.$refs[this.ruleForm].resetFields();
                for (var i in obj) {
                  obj[i] = "";
                }
                let address = this.Address;
                for (var i in address) {
                  address[i] = "";
                }
                this.formLoading=false
              }else{
                this.$message({
                  message: res.data.msg,
                  type: 'error'
                });
                this.formLoading=false
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
  }
</script>

<style scoped>
  #locaTion{
    width:80px;
    height:20px;
    padding-top:6px;
    padding-left:18px;
    color: #0096FF;
    margin-top:6px;
    cursor: default;
    font-size:15px
  }
  #locaTion:hover{
    background-color:rgba(0,150,255,0.3);
    border-radius: 10px;
  }
  .borrowbook{
    width: 100%;
    background-color: white;
    height: 852px;
  }
  .typeMessage{
    display: none;
    position: absolute;
    top: 200px;
    left:750px;
    z-index: 30000;
  }
  .typeMessage div:nth-child(1){
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
  .typeMessage div:nth-child(2){
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
</style>
