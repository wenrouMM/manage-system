<template>
    <div style="display: flex;flex-direction: row;">
      <div style="background-color:white;width:250px;display: flex;flex-direction:column;overflow: paged-y">
        <div style="width: 250px;height:60px;background-color: #0096FF;font-size: 18px;color: white;text-align: center;line-height: 60px ">一体化管理系统</div>
        <ul id="treeDemo" class="ztree" style="margin-top:30px;margin-left:30px" v-loading="fullscreenLoading"></ul>
      </div>
      <div style="width: 1320px;margin-left: 30px;;height:852px;background-color:white" v-loading="formLoading">
        <el-form :model="ruleForm"
                 :rules="rules"
                 :ref="ruleForm"
                 label-width="100px"
                 class="demo-ruleForm"
                 style="width: 700px;margin: 100px auto"
                 :label-position="labelPosition">
          <el-form-item label="名　　称 :　" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入名称" id="name"></el-input>
          </el-form-item>
          <el-form-item label="U　R　L :" prop="url">
            <el-input v-model="ruleForm.url" placeholder="请输入url"></el-input>
          </el-form-item>
          <el-form-item label="I C O N : " prop="img" style="margin-top: 55px;margin-left: 10px" label-width="90px">
            <div style="display: flex;flex-direction: row;margin-top: -30px">
              <div class="inputBox">
              <!-- 预览的图片 -->
                <div v-if="src" class="preload">
                    <span class="close" @click="delet">
                      <img src="../../base/img/currency/cuowu.png" style="width: 15px;height: 15px" alt>
                    </span>
                  <img :src="src" style="width:100px; height:100px;" alt="预览照片" id="icon">
                </div>
                <div style="width: 90px;height: 90px;margin-left: 4px;margin-top: 4px" @click="point">
                  <img class="defaultimage" style="width:50px; height:50px;margin-left: 20px;margin-top: 5px" v-if="!src" src="../../base/img/menu/tbhs.png" alt="user image">
                  <input type="file" accept="jpg/png" @change="getFile" enctype="multipart/form-data" ref="file" id="file">
                  <p v-if="!src" style="position: absolute;top: 60px;left: 17px;font-size: 15px;color: lightgray;">选择图标</p>
                </div>
              </div>
              <div class="inputBox" style="margin-left: 30px;position: relative">
                <img src="../../base/img/menu/tbls.png" style="width:50px; height:50px;margin-left: 25px;margin-top: 10px">
                <p style="position: absolute;top: 60px;left: 17px;font-size: 15px;color: lightgray">默认图标</p>
                <div style="background-color:white;width:100px; height:100px;position:absolute;top: 0;left: 0;display: none;border-radius: 5px" id="icon1">
                  <img :src="src1" style="width: 100px;height: 100px">
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="菜单类型 :" prop="menuType">
            <el-select v-model="ruleForm.menuType" clearable placeholder="请选择菜单类型" @change="change_select(ruleForm.menuType)" style="width: 600px">
              <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.menuType" id="xiala"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单编码 :" prop="menuCode">
            <el-input v-model="ruleForm.menuCode" placeholder="请输入菜单编码"></el-input>
          </el-form-item>
          <el-form-item label="菜单描述 : " prop="menuMsg">
            <el-input type="textarea" v-model="ruleForm.menuMsg" placeholder="请输入菜单描述"></el-input>
          </el-form-item>
          <el-form-item label="状　　态 : " prop="state">
            <el-radio-group v-model="ruleForm.state">
              <el-radio label="禁用"></el-radio>
              <el-radio label="启用"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label=" 按 钮 集 : "  id="btn_select" style="display: none;margin-left: 10px" label-width="90px">
            <div class="myfont"  style="display: flex;flex-direction: row;position: relative">
              <img src="../../base/img/menu/tianjia.png" style="width: 25px;height: 25px;margin-top: -32px" @click="btn_type" >
              <div id="but_show">
                <el-tag
                  :key="tag.name"
                  :type="tag.code"
                  v-for="tag of dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag.name}}
                </el-tag>
              </div>
            </div>
          </el-form-item>
          <el-button type="primary" round @click="save('ruleForm')" style="width: 200px;margin: 0px 250px">保存</el-button>
        </el-form>
        <div class="but_div" id="but_type_div">
          <div class="but_type_div">
            <div class="but_top_div">
              按钮集
            </div>
            <div style="background-color: white;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px">
              <el-form  :model="formButton" :rules="rulesButton" ref="formButton" label-width="90px" :label-position="labelPosition" style="padding-left:70px;padding-bottom: 50px ;margin-top: 50px">
                <el-form-item label="元素名 : " prop="buttonName">
                  <el-input v-model="formButton.buttonName" placeholder="请输入按钮名称" style="width: 267px"></el-input>
                </el-form-item>
                <el-form-item label="元素编码 :" prop="buttonTypeCode">
                  <el-input v-model="formButton.buttonTypeCode" placeholder="请输入按钮编码" style="width: 267px"></el-input>
                </el-form-item>
                <div style="margin-top: 30px">
                  <el-button type="primary" round @click="click_ok('formButton')" style="width: 150px;">确定</el-button>
                  <el-button type="info" round @click="click_no('formButton')" style="width: 150px;margin-left: 50px">取消</el-button>
                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
parent=null;
import {menu,photoUrl} from '../../request/api/base.js'
export default {
  name: "menu.vue",
  data() {
    return {
      labelPosition:'left',
      ruleForm: {
        name: '',
        url: '',
        menuType: '',
        menuCode: '',
        menuMsg: '',
        state: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        url: [{ required: true, message: '请输入url', trigger: 'blur' }],
        menuType: [{required: true, message: '请选择菜单类型', trigger: 'change' }],
        menuCode: [{required: true, message: '请输入菜单编码', trigger: 'blur' }],
        menuMsg: [{required: true, message: '请输入菜单描述', trigger: 'blur' }],
        state: [{ required: true, message: '请选择状态', trigger: 'change' }],
      },
      formButton:{
        buttonName:'',
        buttonTypeCode:''
      },
      rulesButton:{
        buttonName: [{ required: true, message: '请输入按钮名称', trigger: 'blur' }],
        buttonTypeCode: [{ required: true, message: '请输入按钮编码', trigger: 'blur' }],
      },
      isShow:false,
      formLoading:false,
      fullscreenLoading: false,
      zTree: [], //点击节点后节点上对应的值
      addZTreePid: 0, //点击节点添加按钮所对应节点的值
      //value2: "", //表单下拉列表的code值
      //value3: "", //按钮集下拉列表的code值
      selectList: [], //渲染表单下拉列表的数组
      butList: [], //渲染按钮集下拉列表的数组
      src: "", //上传图片的地址
      src1: "",
      photo: "",
      nomarl: "",
      formdata: "",
      key: true,
      setting: {
        edit: {
          enable: true,
          showRemoveBtn: true,
          addHoverBtn: true,
          removeTitle: "删除节点",
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
          onRemove: this.onRemove, //删除事件
          beforeExpand: this.zTreeBeforeExpand,
        }
      },//ztree加载配置
      zNodes: [],//ztree加载数据
      dynamicTags:[],
      authTbMenuElementsEdit:[],//修改的按钮数组
      authTbMenuElementsAdd:[], //添加的按钮数组
      id:'',
      pId:null,
      click:'',
      add:''
    };
  },
  computed:{
    addForm() {
      // 传递给后端的搜索数据
      let addData = {
        menuName: this.ruleForm.name,
        menuCode: this.ruleForm.menuCode,
        menuDescribe: this.ruleForm.menuMsg,
        menuHref: this.ruleForm.url,
        disabled:this.ruleForm.state=='禁用'?1:0,
        iconDefault:this.photo ,
        iconSelected:'' ,
        fkMenuTypeCode: this.ruleForm.menuType,
        fkParentMenuId: parent,
        authTbMenuElements: this.authTbMenuElementsAdd
      };
      console.log(addData)
      return addData;
    },
    editForm() {
      // 传递给后端的搜索数据
      console.log('ztree',this.zTree)
      console.log('photo',this.photo)
      let editData = {
        id: this.zTree.id,
        fkParentMenuId: this.zTree.pId,
        fkMenuId: this.zTree.id,
        menuName: this.ruleForm.name,
        menuCode: this.ruleForm.menuCode,
        menuDescribe: this.ruleForm.menuMsg,
        menuHref: this.ruleForm.url,
        disabled: this.ruleForm.state=='禁用'?1:0,
        iconDefault: this.photo,
        iconSelected: "",
        fkMenuTypeCode: this.ruleForm.menuType,
        authTbMenuElements: this.authTbMenuElementsEdit
      };
      //console.log(searchForm)
      return editData;
    },
  },
  methods: {
    /*====== 表单所有元素重载 ======*/
    formOverload(){
      this.$refs[this.ruleForm].resetFields()
      $("#btn_select").fadeOut()
      this.src = "";
      this.$refs.file.value = "";
      $('#icon1').hide()
      this.formButton.length=0
      this.dynamicTags.length=0
      this.zNodes.length=0
      this.freshArea()
    },
    /*====== 移除按钮集按钮 ======*/
    handleClose(tag) {
      console.log('tag',tag)
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      console.log('this.dynamicTags',this.dynamicTags)
    },
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
    /*====== 菜单类型判断是否显示按钮集 ======*/
    change_select(num){
      console.log(num)
      if(num==='list_menu'||num===''){
        $('#btn_select').fadeOut()
      }else if(num==='page_menu'){
        $('#btn_select').fadeIn()
      }
    },
    /*====== 按钮弹框的确定按钮 ======*/
    click_ok(ruleButton) {
      console.log('按钮名称与类型',this.formButton.buttonTypeCode)
      this.$refs[ruleButton].validate((valid) => {
        if (valid) {
          this.dynamicTags.push({name:this.formButton.buttonName,code:this.formButton.buttonTypeCode}) //将按钮名字添加进buttonNameData中用来展示添加的按钮
          $("#but_type_div").fadeOut();//添加完成后按钮弹框消失
          this.$refs[ruleButton].resetFields(); //清空添加按钮的数组
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    /*====== 按钮弹框的取消按钮 ======*/
    click_no(ruleButton) {
      $("#but_type_div").fadeOut(); //添加完成后按钮弹框消失
      this.$refs[ruleButton].resetFields();
    },
    /*====== 点击按钮集添加按钮出现元素集弹框发送请求加载按钮类型下拉框数据 ======*/
    btn_type() {$("#but_type_div").fadeIn();},
    /*====== 左侧ztree树结构的加载 ======*/
    async freshArea() {
      this.axios.get(menu.select).then((response)=>{
        console.log(response)
        if(response.data.state=true){
          for (var item of response.data.row) {
            this.zNodes.push({
              id: item.id, //节点id
              pId: item.fkParentMenuId, //节点父id
              name: item.menuName, //节点名称
              code: item.menuCode, //节点菜单编码
              msg: item.menuDescribe, //节点菜单描述
              href: item.menuHref, //节点菜单链接
              disabled: item.disabled, //节点是否禁用
              icon_default: item.iconDefault, //节点默认图片
              icon_selected: item.iconSelected, //节点选择图片
              menu_code_type: item.fkMenuTypeCode, //节点菜单类型编码
            });
          }
        }
        //将数据渲染到ztree树
        $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
      })
    },
    /*====== ztree节点删除按钮做删除操作 ======*/
    zTreeBeforeRemove(treeId, treeNode) {
      console.log(treeNode.id)
      console.log(treeNode.pId)

      if (treeNode.id === undefined) {
        this.$message({
          message: "删除成功",
          type: "success"
        });
        this.formOverload()
      } else {
        let str = { deleteParam: [{ id: treeNode.id }] };
        this.axios.delete(menu.delete, { data: str }).then(response => {
          console.log(response)
          if (response.data.state == true) {
            this.$message({
              message: response.data.msg,
              type: "success"
            });
            this.formOverload()
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
      }
    },
    /*====== ztree点击节点将节点信息放入表单显示 ======*/
    zTreeOnClick(e, treeId, treeNode) {
      this.src = "";
      this.$refs.file.value = "";
      //console.log('获取点击节点的id和父id',treeNode.id,treeNode.pId)
      console.log('获取节点信息',treeNode.id)
      this.id = treeNode.id; //点击节点时节点自己的id
      this.click = 'click' //是否点击的赋值
      //$("#btn_select").fadeOut()
      if(treeNode.id==undefined){
        for (var i in this.ruleForm) {
          this.ruleForm[i] = "";
        }
        this.ruleForm.name=treeNode.name
        $('#name').focus()
      }
        this.dynamicTags.length=0
        this.axios.get(menu.button, {params: {id: treeNode.id}}).then((res) => {
          console.log('查询节点的信息',res)
          if (res.data.state == true) {
            if(res.data.row.authTbMenu.fkMenuTypeCode=="list_menu"){
              $('#btn_select').fadeOut()
            }else{
              $('#btn_select').fadeIn()
              if(res.data.row.authTbMenuElements){
                this.dynamicTags.length=0
                for (let item of res.data.row.authTbMenuElements) {
                  //console.log('已存在的按钮',item)
                  this.dynamicTags.push({name:item.elmName,code:item.elmCode})
                }
              }
            }
            this.ruleForm.name = res.data.row.authTbMenu.menuName;
            this.ruleForm.url = res.data.row.authTbMenu.menuHref;
            this.ruleForm.menuType = res.data.row.authTbMenu.fkMenuTypeCode;
            this.ruleForm.menuCode = res.data.row.authTbMenu.menuCode;
            this.ruleForm.menuMsg = res.data.row.authTbMenu.menuDescribe;
            this.ruleForm.state = res.data.row.authTbMenu.disabled == 1 ? '禁用' : '启用'
            if(res.data.row.authTbMenu.iconDefault==null||res.data.row.authTbMenu.iconDefault==''){
              $('#icon1').hide()
            }else{
              $('#icon1').show()
              this.src1 = photoUrl+res.data.row.authTbMenu.iconDefault //展示节点图片
            }
            this.zTree = treeNode //将点击节点后的节点信息给treeNode
            console.log('已存在的按钮1',res.data.row.authTbMenuElements)
          }
        })
      console.log('类表',this.ruleForm.menuType)
    },
    /*====== ztree节点添加按钮做添加操作 ======*/
    addHoverDom(treeId, treeNode) {
      //this.addZTree=treeNode
      //console.log(treeNode.menu_code_type);
      if (
        treeNode.menu_code_type === "list_menu" ||
        treeNode.menu_code_type === null
      ) {
        var sObj = $("#" + treeNode.tId + "_span");
        //console.log('sObj',sObj)
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
          return;
        console.log(treeNode.tId)
        var addStr =
          "<span class='button add' id='addBtn_" + treeNode.tId + "' title='添加子节点' onfocus='this.blur();'></span>";
        //console.log('addStr',addStr)
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        //console.log('btn',btn)
        if (btn){
          btn.bind("click", { paramName: treeNode }, function(e) {
            //console.log(this.zNodes)
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var newNode = { name: "newNode1" };
            newNode = treeObj.addNodes(treeNode, newNode);
            console.log('添加按钮'+treeNode.id)
            parent = treeNode.id;
            console.log('this.pId',parent)
            this.add = "add";
            return false;
          });
        }
      }
    },
    /*====== ztree移除节点添加按钮消失 ======*/
    removeHoverDom(treeId, treeNode) {
      $("#addBtn_" + treeNode.tId)
        .unbind()
        .remove();
    },
    /*====== 点击保存按钮发送修改或添加的请求 ======*/
    save() {
      console.log('this.zTree.id',this.zTree.id)
      //console.log('this.click',this.click)
      this.authTbMenuElementsAdd.length=0
      this.authTbMenuElementsEdit.length=0
      for(let item of this.dynamicTags){
        console.log('item',item)
        this.authTbMenuElementsAdd.push({ //发送添加保存时添加的按钮
          elmName: item.name,
          elmCode: item.code,
          fkElmCode: item.code
        })
        this.authTbMenuElementsEdit.push({ //发送添加保存时添加的按钮
          elmName: item.name,
          elmCode: item.code,
          fkElmCode: item.code,
          fkMenuId: this.zTree.id
        })
      }
      //console.log('this.authTbMenuElementsAdd',this.authTbMenuElementsAdd)
      //console.log('this.authTbMenuElementsEdit',this.authTbMenuElementsEdit)
      let files = this.formdata;
      //console.log(files)
      var formdatas = new FormData();
      formdatas.append("file", files);
      //console.log(formdatas.get('file'))
      if (this.click ==false) {
        this.$message.error('请选择您要添加或修改的内容');
        return;
      } else {
        if (this.id === undefined) {
          this.$refs[this.ruleForm].validate((valid) => {
            if (valid) {
              console.log('添加');
              this.addApi(this.addForm)
            } else {
              console.log('添加失败');
              return false;
            }
          });
        } else {
          this.$refs[this.ruleForm].validate((valid) => {
            if (valid) {
              console.log('修改');
              this.editApi(this.editForm)
            } else {
              console.log('修改失败');
              return false;
            }
          });
        }
      }
    },
    addApi(value){
      this.formLoading=true
      this.axios.post(menu.add, value).then((request) => {
        console.log(request);
        if (request.data.state == true) {
          this.$message({
            message: request.data.msg+',可展开查看！',
            type: "success"
          });
          this.formLoading=false
          this.formOverload()
        } else {
          this.$message.error(request.data.msg);
          this.formLoading=false
        }
      });
    },
    editApi(value){
      this.formLoading=true
      this.axios.post(menu.add, value).then((request) => {
        this.zNodes.length=0
        console.log(request);
        if (request.data.state == true) {
          this.$message({
            message: request.data.msg+',可展开查看！',
            type: "success"
          });
          this.formLoading=false
          this.formOverload()
        } else {
          this.$message.error(request.data.msg);
          this.formLoading=false
        }
      });
    },
    //图片上传
    point() {
      this.$refs.file.click();
    },
    delet() {
      this.src = "";
      this.$refs.file.value = "";
    },
    getFile(e) {
      var files = e.target.files[0];
      let _this = this;
      //console.log(files)
      var formdatas = new FormData();
      formdatas.append("file", files);
      //console.log(formdatas.get('file'))
      this.axios({
        method: "post",
        url: menu.img,
        data: formdatas,
        //cache: false,//上传文件无需缓存
        processData: false, //用于对data参数进行序列化处理 这里必须false
        contentType: false, //
        dataType: "JSON",
        ContentType: "multipart/form-data"
      }).then(request => {
        console.log(request);
        if(request.data.state==false){
          return
        }else{
          this.photo=request.data.row
          //alert(1111)
          console.log(this.photo)
        }
      });
      if (!e || !window.FileReader) return;
      let reader = new FileReader();
      reader.readAsDataURL(files);
      reader.onloadend = function() {
        _this.src = this.result;
      };
    },
  },
  mounted() {
    //$.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    this.freshArea();
    /*====== 菜单类型下拉框数据 ======*/
    var list = [];
    this.axios
      .get(menu.type, { params: { type: "menu" } })
      .then(function(request) {
        //console.log(request)
          for (let item of request.data.row) {
            //console.log(item)
            list.push({ value: item.id, label: item.name, menuType: item.code });
          }
      });
    this.selectList = list;
  }
};
</script>
<style scoped>
  #but_show{
    margin-left: 30px;
    margin-top: -40px;
    width: 550px;
    height:70px;
    overflow-x: auto;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  input[type="text"]{
    border: 1px solid #dcdfe6;
    width: 598px;
    height: 34px;
    border-radius: 8px;
    padding-left: 30px;
    outline: none;

  }
  input::-webkit-input-placeholder{
    color:lightgray;
    font-size: 15px;
  }
button:hover {
  background-color: rgba(30, 158, 255, 0.8);
}
.but_div {
  width: 100%;
  height: 1073px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid lightgray;
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  z-index: 11;
}
.but_type_div {
  width: 500px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 300px;
  left: 750px;
}
.but_type {
  width: 150px;
  height: 46px;
  outline: none;
  border-radius: 10px;
  font-size: 18px;
  color: white;
  line-height: 46px;
  text-align: center;
  border: none;
}
.but_top_div {
  background-color: #0096ff;
  height: 80px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-size: 26px;
  color: white;
  line-height: 80px;
  text-align: center;
  position: relative;
}
input[type="button"]:hover {
  background-color: rgba(30, 158, 255, 0.7);
}
input[type="radio"] + label::before {
  content: "\a0";
  display: inline-block;
  vertical-align: middle;
  font-size: 16px;
  width: 15px;
  height: 15px;
  margin-right: 0.4em;
  border-radius: 50%;
  border: 1px solid #d2d2d2;
  text-indent: 0.15em;
  line-height: 1;
}
input[type="radio"]:checked + label::before {
  background-color: #1e9eff;
  background-clip: content-box;
  width: 10px;
  height: 10px;
  padding: 0.2em;
  border: 1px solid #1e9eff;
}
input[type="radio"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
.myfont {
  font-size: 16px;
  color: #333333;
  margin-top: 40px;
}
.myinput {
  width: 612px;
  height: 38px;
  border-radius: 5px;
  border: 1px solid #d2d2d2;
  padding-left: 30px;
}
.inputBox {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  position: relative;
  display: flex;
  flex-direction: row;
  border-radius: 5px;
}
.preload {
  width: 100px;
  height: 100px;
  position: absolute;
  z-index: 3;
}
.defaultimage {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.close {
  position: absolute;
  left: 85px;
  top: -10px;
  cursor: pointer;
  font-size: 10px;
}
#file {
  display: none;
}
</style>
