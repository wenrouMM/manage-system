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
            <el-input v-model="ruleForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="U　R　L :" prop="url">
            <el-input v-model="ruleForm.url" placeholder="请输入url"></el-input>
          </el-form-item>
          <el-form-item label="I C O N : " prop="img" style="margin-top: 55px">
            <div style="display: flex;flex-direction: row;margin-top: -30px">
              <div class="inputBox">
              <!-- 预览的图片 -->
                <div v-if="src" class="preload">
                    <span class="close" @click="delet">
                      <img src="../../base/img/menu/x.png" style="width: 15px;height: 15px" alt>
                    </span>
                  <img :src="src" style="width:100px; height:100px;" alt="预览照片" id="icon">
                </div>
                <div style="width: 90px;height: 90px;margin-left: 4px;margin-top: 4px" @click="point">
                  <img class="defaultimage" style="width:50px; height:50px;margin-left: 20px;margin-top: 5px" v-if="!src" src="../../base/img/menu/tbhs.png" alt="user image">
                  <input type="file" accept="jpg/png" @change="getFile" enctype="multipart/form-data" ref="file" id="file">
                  <p v-if="!src" style="position: absolute;top: 70px;left: 17px;font-size: 15px;color: lightgray;">选择图标</p>
                </div>
              </div>
              <div class="inputBox" style="margin-left: 30px;position: relative">
                <img src="../../base/img/menu/tbls.png" style="width:50px; height:50px;margin-left: 25px;margin-top: 10px">
                <p style="position: absolute;top: 70px;left: 17px;font-size: 15px;color: lightgray">默认图标</p>
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
          <el-form-item label=" 按 钮 集 : " prop="menuMsg" id="btn_select" style="display: none">
            <div class="myfont"  style="display: flex;flex-direction: row;position: relative">
              <img src="../../base/img/menu/tianjia.png" style="width: 25px;height: 25px;margin-top: -32px" @click="btn_type" >
              <div style="margin-left: 30px;margin-top: -40px;" id="but_show">
                <button style="width:70px;height: 26px;border-radius: 10px;border:1px solid lightgray;margin-left:10px;background-color:white" v-for="item of buttonNameData">{{item}}</button>
              </div>
            </div>
          </el-form-item>
          <el-button type="primary" round @click="save()" style="width: 200px;margin: 20px 250px">保存</el-button>
        </el-form>
        <div class="but_div" id="but_type_div">
          <div class="but_type_div">
            <div class="but_top_div">
              按钮集
            </div>
            <div style="background-color: white;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px">
              <el-form ref="formButton"  :model="formButton" label-width="80px" :label-position="labelPosition" style="padding-left:80px;padding-bottom: 50px ;margin-top: 50px">
                <el-form-item label="元素名 : ">
                  <el-input v-model="formButton.buttonName" style="width: 267px"></el-input>
                </el-form-item>
                <el-form-item label="元素类型 :">
                  <el-select v-model="formButton.buttonTypeCode" clearable placeholder="请选择按钮类型" id="type" style="width: 267px">
                    <el-option v-for="item in butList" :key="item.value" :label="item.label" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
                  <el-button type="primary" round @click="click_ok()" style="width: 150px">确定</el-button>
                  <el-button type="info" round @click="click_no()" style="width: 150px;margin-left: 50px">取消</el-button>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>

</template>

<script>
var id; //声明id，用来判断保存按钮发的是添加请求还是修改请求
var praent; //生命的父元素id，用来发添加请求的时候获取上级id
var click; //生命click，用来判断保存按钮是否向后台发送请求
import serialize from "../../base/js/yf/serialize";
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
        name: [{ required: true, message: '请输入名称', trigger: 'blur' },],
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
      isShow:false,
      formLoading:false,
      fullscreenLoading: false,
      zTree: [], //点击节点后节点上对应的值
      addZTreePid: 0, //点击节点添加按钮所对应节点的值
      buttonData: [], //过滤相同的按钮后渲染在表单上按钮的元素
      buttonNameData:[],
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
          onRemove: this.onRemove //删除事件
        }
      },//ztree加载配置
      zNodes: [],//ztree加载数据
      treeName:null,
      pId:null,
      addButton:true,
      authTbMenuElementsEdit:[],//修改的按钮数组
      authTbMenuElementsAdd:[] //添加的按钮数组
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
        fkParentMenuId: this.pId,
        authTbMenuElements: this.authTbMenuElementsAdd
      };
      //console.log(searchForm)
      return addData;
    },
    editForm() {
      // 传递给后端的搜索数据
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
    /*====== 菜单类型判断是否显示按钮集 ======*/
    change_select(num){
      console.log(num)
      if(num==='list_menu'||num===''){
        $('#btn_select').fadeOut()

      }else if(num==='page_menu'){
        $('#btn_select').fadeIn()
      }
    },
    /*====== 判断数组中是否有相同元素，有则给出提示 ======*/
    findSame(arr) {
      arr.sort();
      for (var i = 0; i < arr.length - 1; i++) {
        if (arr[i] == arr[i + 1]) {
          //alert("包含相同元素，相同值为：" + arr[i]);
          this.$alert('您已存在相同的按钮类型', '提示', {
            confirmButtonText: '确定',
          })
          this.addButton=false //提示后不能添加
          return true;
        }
      };
      return false;
    },
    /*====== 按钮弹框的确定按钮 ======*/
    click_ok() {
      console.log('按钮名称与类型',this.formButton.buttonTypeCode)
      if (this.formButton.buttonTypeCode ===undefined||this.formButton.buttonName===undefined) {
        //当按钮元素为空的时候，给出提示不可为空
        //alert('22222')
        this.$alert("元素类型或名称不能为空，请您重新添加!", {
          confirmButtonText: "确定"
        });
      }else if (this.formButton.buttonTypeCode ===''||this.formButton.buttonName==='') {
        //当按钮元素为空的时候，给出提示不可为空
        //alert('22222')
        this.$alert("元素类型或名称不能为空，请您重新添加!", {
          confirmButtonText: "确定"
        });
      }else if (this.formButton.buttonTypeCode!== undefined&&this.formButton.buttonName!==undefined){
        this.buttonData.push(this.formButton.buttonTypeCode) //当元素名称和类型不为空时将元类型添加buttonData
        this.findSame(this.buttonData) //当buttonData中有相同的类型时给出提示
        this.buttonData = serialize.deteleObject(this.buttonData) //过滤buttonData相同的值
        if(this.addButton==true){  //元素不为空能添加
          this.buttonNameData.push(this.formButton.buttonName) //将按钮名字添加进buttonNameData中用来展示添加的按钮
          this.authTbMenuElementsEdit.push({ //发送修改保存时添加的按钮
            elmName: this.formButton.buttonName,
            elmCode: this.formButton.buttonTypeCode,
            fkElmCode: this.formButton.buttonTypeCode,
            fkMenuId: this.zTree.id
          });
          this.authTbMenuElementsAdd.push({ //发送添加保存时添加的按钮
            elmName: this.formButton.buttonName,
            elmCode: this.formButton.buttonTypeCode,
            fkElmCode: this.formButton.buttonTypeCode
          });
          $("#but_type_div").fadeOut();//添加完成后按钮弹框消失
        }
        //console.log(this.buttonData)
        this.addButton=true //按钮添加完成后使其可继续添加
        this.formButton={} //清空添加按钮的数组
      }
    },
    /*====== 按钮弹框的取消按钮 ======*/
    click_no() {
      $("#but_type_div").fadeOut(); //添加完成后按钮弹框消失
      this.formButton={} //按钮白哦单清空
    },
    /*====== 点击按钮集添加按钮出现元素集弹框发送请求加载按钮类型下拉框数据 ======*/
    btn_type() {
      $("#but_type_div").fadeIn();
      var list = [];
      this.axios
        .get(menutypeurl, { params: { type: "element" } })
        .then(function(request) {
          //console.log(request)
          for (var item of request.data.row) {
            //console.log(item)
            list.push({
              value: item.id,
              label: item.name,
              code: item.code,
              fkcode: item.fkDictTypeCode
            });
            //console.log(list)
          }
        });
      this.butList = list;
      //console.log(this.butList)
    },
    /*====== 左侧ztree树结构的加载 ======*/
    async freshArea() {
      this.axios.get(menuselecturl).then((response)=>{
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
          type: "warning"
        });
      } else {
        var str = { deleteParam: [{ id: treeNode.id }] };
        this.axios.delete(menudeleteurl, { data: str }).then(response => {
          //console.log(response)
          if (response.data.state == true) {
            this.$message({
              message: response.data.msg,
              type: "success"
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
            this.zNodes.length=0
            this.freshArea()
          }
        });
      }
    },
    /*====== ztree点击节点将节点信息放入表单显示 ======*/
    zTreeOnClick(e, treeId, treeNode) {
      id = treeNode.id; //点击节点时节点自己的id
      click = 'click' //是否点击的赋值
      this.buttonNameData.length=0
      $("#btn_select").fadeOut()
      if(treeNode.menu_code_type=='page_menu') {
        this.axios.get(menubutton, {params: {id: treeNode.id}}).then((res) => {
          console.log('查询节点的信息',res)
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.ruleForm.name = res.data.row.authTbMenu.menuName;
            this.ruleForm.url = res.data.row.authTbMenu.menuHref;
            this.ruleForm.menuType = res.data.row.authTbMenu.fkMenuTypeCode;
            this.ruleForm.menuCode = res.data.row.authTbMenu.menuCode;
            this.ruleForm.menuMsg = res.data.row.authTbMenu.menuDescribe;
            this.ruleForm.state = res.data.row.authTbMenu.disabled == 1 ? '禁用' : '启用'
            this.src1 = 'http://192.168.2.121:8088/authmodule/menuInformation/getImg?id=' + treeNode.id //展示节点图片
            $('#icon1').show() //点击节点是显示,否则隐藏
            this.zTree = treeNode //将点击节点后的节点信息给treeNode
            $('#btn_select').fadeIn()
            this.buttonData.length=0
            console.log('已存在的按钮1',res.data.row.authTbMenuElements)
            for (let item of res.data.row.authTbMenuElements) {
              console.log('已存在的按钮',item)
              this.buttonData.push(item.elmCode)
              this.buttonNameData.push(item.elmName)
            }
            //console.log(this.buttonData)
          } else {
            this.$message.error(res.data.msg);
          }
        })
      }else if(treeNode.menu_code_type=='list_menu'){
          console.log(111)
          this.$refs[this.ruleForm].resetFields();
      }
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
        console.log('sObj',sObj)
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
          return;
        console.log(treeNode.tId)
        var addStr =
          "<span class='button add' id='addBtn_" + treeNode.tId + "' title='添加子节点' onfocus='this.blur();'></span>";
        console.log('addStr',addStr)
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        console.log('btn',btn)
        if (btn)
          this.$refs[this.ruleForm].resetFields()
          btn.bind("click", { paramName: treeNode }, function(e) {
            //console.log(this.zNodes)
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var newNode = { name: "newNode1" };
            newNode = treeObj.addNodes(treeNode, newNode);
            console.log('添加按钮'+treeNode.id)
            praent = treeNode.id;
            click = "add";
            return false;
          });
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
      console.log(this.zNodes)
      this.pId=praent
      console.log('父id：'+this.pId)
      let files = this.formdata;
      //console.log(files)
      var formdatas = new FormData();
      formdatas.append("file", files);
      //console.log(formdatas.get('file'))
      if (click === undefined) {
        this.$alert("请选择您要添加或修改的内容", {
          confirmButtonText: "确定"
        });
        return;
      } else {
        if (id === undefined) {
          this.$refs[this.ruleForm].validate((valid) => {
            if (valid) {
              console.log('submit!');
              this.addApi(this.addForm)
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        } else {
          this.$refs[this.ruleForm].validate((valid) => {
            if (valid) {
              console.log('submit!');
              this.editApi(this.editForm)
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        }
      }
    },
    addApi(value){
      this.formLoading=true
      this.axios.post(menuaddurl, value).then((request) => {
        console.log(request);
        if (request.data.state == true) {
          this.$message({
            message: request.data.msg+',可展开查看！',
            type: "success"
          });
          this.$refs[this.ruleForm].resetFields()
          $("#btn_select").fadeOut()
          this.formLoading=false
          this.formButton.length=0
          this.buttonData.length=0
          this.zNodes.length=0
          this.freshArea()
        } else {
          this.$message.error(request.data.msg);
          this.formLoading=false
          this.buttonData.length=0
        }
      });
    },
    editApi(value){
      this.formLoading=true
      this.axios.post(menuaddurl, value).then((request) => {
        this.zNodes.length=0
        console.log(request);
        if (request.data.state == true) {
          this.$message({
            message: request.data.msg+',可展开查看！',
            type: "success"
          });
          this.$refs[this.ruleForm].resetFields()
          $("#btn_select").fadeOut()
          this.formLoading=false
          this.formButton.length=0
          this.buttonData.length=0
          this.zNodes.length=0
          this.freshArea()
        } else {
          this.$message.error(request.data.msg);
          this.formLoading=false
          this.buttonData.length=0
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
        url: menuimg,
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
          alert(1111)
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
      .get(menutypeurl, { params: { type: "menu" } })
      .then(function(request) {
        //console.log(request)
          for (var item of request.data.row) {
            //console.log(item)
            list.push({ value: item.id, label: item.name, menuType: item.code });
          }
      });
    this.selectList = list;
  }
};
</script>
<style scoped>
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
  left: 90px;
  top: -3px;
  cursor: pointer;
  font-size: 10px;
}
#file {
  display: none;
}
</style>
