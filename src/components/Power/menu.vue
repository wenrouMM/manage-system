<template>
  <div id="menu">
    <div style="display: flex;flex-direction: row" id="mymenu">
      <div style="background-color:white;width:250px;display: flex;flex-direction:column;overflow:auto">
        <div style="width: 250px;height:60px;background-color: #0096FF;font-size: 18px;color: white;text-align: center;line-height: 60px ">一体化管理系统</div>
        <ul id="treeDemo" class="ztree" style="margin-top:30px;margin-left:30px"></ul>
      </div>
      <div style="width: 1320px;margin-left: 30px;background-color:white;height:852px">
        <form id="myForm">
          <table>
            <p id="#msg"></p>
            <p class="myfont">名称 :&nbsp;&nbsp;&nbsp;
              <input type="text" class="myinput" name="menuName" id="name" autocomplete="off" chinese info="名称" maxlength="10">
            </p>
            <p class="myfont">
              U R L :&nbsp;&nbsp;
              <input type="text" class="myinput" name="href" id="url" info="url" autocomplete="off">
            </p>
            <div style="display: flex;flex-direction: row;margin-top: 40px;">
              <p class="myfont">ICON&nbsp;:&nbsp;&nbsp;&nbsp;</p>
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
            <p class="myfont">
              菜单类型 :&nbsp;&nbsp;&nbsp;
              <el-select v-model="value2" clearable placeholder="请选择" id="type" @change="change_select(value2)" style="width: 610px">
                <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.code" id="xiala"></el-option>
              </el-select>
            </p>
            <p class="myfont">
              菜单编码 :&nbsp;&nbsp;&nbsp;
              <input type="text" class="myinput" name="menuCode" id="menuCode" url info="菜单编码" autocomplete="off" style="width: 580px">
            </p>
            <p class="myfont">
              菜单描述:&nbsp;&nbsp;&nbsp;&nbsp;(选填)&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="textarea" style="width: 520px;height: 102px" class="myinput" name="menuDescribe" id="menu_msg" autocomplete="off">
            </p>
            <p class="myfont">
              是否禁用:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" value="1" name="disabled" id="yes" checked>
              <label for="yes">是</label>&nbsp;&nbsp;&nbsp;&nbsp;
              <input type="radio" value="0" name="disabled" id="no">
              <label for="no">否</label>
            </p>
            <div class="myfont" id="btn_select" style="display: flex;flex-direction: row;display: none;position: relative">
              按钮集&nbsp;&nbsp;:&nbsp;&nbsp;
              <img src="../../base/img/menu/tianjia.png" style="width: 25px;height: 25px;margin-bottom: -7px;" @click="btn_type" @mouseover="myMessagebox" @mouseleave="myMessagebox1">
              <img src="../../base/img/menu/messagebox.png" style="position: absolute;top: 20px;left: 49px;width: 330px;height: 60px;display: none" id="messagebox">
              <p style="font-size: 10px;color: white;position: absolute;top: 40px;left: 75px">如果您有已存在的按钮，则不能添加与之相同的按钮</p>
              <div style="margin-left: 120px;margin-top: -20px;" id="but_show">
                <button style="width:70px;height: 26px;border-radius: 10px;border:1px solid lightgray;margin-left:10px;background-color:white" v-for="item of but_type1">{{item.fk_elm_code}}</button>
              </div>
            </div>
            <p style="margin-top: 60px">
              <input type="button" class="mybut" @click="save" id="save" v-loading.fullscreen.lock="fullscreenLoading" value="保存">
            </p>
            <p id="msg" style="text-align: center;color: red;font-size: 15px;"></p>
            <div class="but_div" id="but_type_div">
              <div class="but_type_div">
                <div class="but_top_div">
                  按钮集
                  <img src="../../base/img/menu/xx.png" style="position: absolute;top: 25px;left: 440px;width: 30px;height:30px" @click="check_x">
                </div>
                <div style="background-color: white;border-bottom-left-radius: 10px;border-bottom-right-radius: 10px">
                  <p style="font-size: 17px;color: #878787;margin-left: 60px;margin-top: 40px">
                    元素名&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;
                    <input type="text" style="width: 235px;" class="myinput" id="btn_msg" autocomplete="off">
                  </p>
                  <p style="font-size: 17px;color: #878787;margin-left: 60px;margin-top: 40px">
                    元素类型&nbsp;:&nbsp;
                    <el-select v-model="value3" clearable placeholder="查询按钮" id="type" style="width: 267px">
                      <el-option v-for="item in butList" :key="item.value" :label="item.label" :value="item.code"></el-option>
                    </el-select>
                  </p>
                  <p style="margin-left: 85px;margin-top: 50px;margin-bottom: 50px">
                    <input type="button" value="确定" class="but_type"style="background-color: #1e9eff" @click="click_ok">
                    <input type="button" value="取消" class="but_type" style="background-color: #D5D5D5;margin-left: 30px" @click="click_no">
                  </p>
                </div>
              </div>
            </div>
          </table>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
var id; //声明id，用来判断保存按钮发的是添加请求还是修改请求
var praent; //生命的父元素id，用来发添加请求的时候获取上级id
var click; //生命click，用来判断保存按钮是否向后台发送请求
var authTbMenuElementsEdit = [];
var authTbMenuElementsAdd = [];
import serialize from "../../base/js/yf/serialize";
export default {
  name: "menu.vue",
  data() {
    return {
      fullscreenLoading: false,
      zTree: [], //点击节点后节点上对应的值
      addZTreePid: 0, //点击节点添加按钮所对应节点的值
      but_type: [], //点击按钮集添加的按钮元素
      but_type1: [], //过滤相同的按钮后渲染在表单上按钮的元素
      value2: "", //表单下拉列表的code值
      value3: "", //按钮集下拉列表的code值
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
      },
      zNodes: [
        {
          id: 0,
          //pId: 0,
          name: "图书馆管理平台",
          code: null,
          msg: null,
          href: null,
          disabled: null,
          icon_default: null,
          icon_selected: null,
          menu_code_type: null
        }
      ]
    };
  },
  methods: {
    //当鼠标移入按钮集图标，出现提示
    myMessagebox() {
      $("#messagebox").fadeIn();
    },
    //当鼠标移出按钮集图标，隐藏提示
    myMessagebox1() {
      $("#messagebox").fadeOut();
    },
    //按钮集弹窗的确定按钮传元素名称，元素类型编码
    click_ok() {
      if (this.value3 === "") {
        //当按钮元素为空的时候，给出提示不可为空
        this.$alert("元素类型不能为空，请您重新添加!", {
          confirmButtonText: "确定"
        });
        return;
      } else {
        //当按钮元素不为空的时候，继续向下执行
        var msg = ""; //申明按钮的名字，当选取按钮元素下拉框的时候根据value3的值为按钮命名相应的值
        if (this.value3 === "select") {
          msg = "查询";
        } else if (this.value3 === "edit") {
          msg = "编辑";
        } else if (this.value3 === "delete") {
          msg = "删除";
        } else if (this.value3 === "add") {
          msg = "添加";
        }
        authTbMenuElementsEdit.push({
          elmName: $("#btn_msg").val(),
          elmCode: this.value3,
          fkElmCode: this.value3,
          fkMenuId: this.zTree.id
        });
        authTbMenuElementsAdd.push({
          elmName: $("#btn_msg").val(),
          elmCode: this.value3,
          fkElmCode: this.value3
        });
        this.but_type.push({ fk_elm_code: msg }); //将选取好的按钮添加到this.but_type
        var but_arr = serialize.deteleObject(this.but_type); //过滤掉数组中相同的元素
        // console.log(but_arr)
        var but_arr1 = serialize.trimSpace(but_arr); //过滤掉数组中的空值
        //console.log(but_arr1)
        this.but_type1 = but_arr1; //将过滤完成的数组付给but_type1,but_type1将是最后展示在表单页面按钮的数组
        $("#but_type_div").hide();
      }
    },
    //按钮集弹窗的取消按钮隐藏失去文档流
    click_no() {
      $("#but_type_div").fadeOut();
    },
    //按钮集点错图标隐藏失去文档流
    check_x() {
      $("#but_type_div").fadeOut();
    },
    //按钮集点击按钮出现弹框可选择按钮元素
    btn_type() {
      /*this.$alert('如果您有已存在的按钮，则不能添加与之相同的按钮',{
          confirmButtonText: '确定',
        });*/
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
    //表单下拉选项选择列表菜单和页面菜单用来判断是否显示按钮集
    change_select(num) {
      if (num === "list_menu") {
        $("#btn_select").fadeOut();
      } else if (num === "page_menu") {
        $("#btn_select").fadeIn();
      }
    },
    //页面初始加载就请求后台服务器的数据将数据动态渲染在页面的树节点中
    async freshArea() {
      this.axios.get(menuselecturl).then((response)=>{
        console.log(response)
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
            menu_code_type: item.fkMenuTypeCode //节点菜单类型编码
          });
        }
        //将数据渲染到ztree树
        $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
      })
    },
    //删除节点向后台发请求可删除页面节点与后台数据库的节点
    zTreeBeforeRemove(treeId, treeNode) {
      //onsole.log(treeNode.id)
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
              type: "warning"
            });
          }
        });
      }
    },
    //修改时点击节点将该节点的数据展示在表单内
    zTreeOnClick(event, treeId, treeNode) {
      //console.log(treeId)
      //console.log(treeNode.name,treeNode.id,treeNode.pId,treeNode.code,treeNode.href,treeNode.disabled)
      //console.log(treeNode.menu_code_type)
      id = treeNode.id; //点击节点时节点自己的id
      click = "click"; //是否点击的赋值
      $("#name").val(treeNode.name); //展示节点名称
      $("#url").val(treeNode.href); //展示节点url
      $("#menu_msg").val(treeNode.msg); //展示节点菜单描述
      $("#menuCode").val(treeNode.code); //展示节点菜单编码
      this.value2 = treeNode.menu_code_type; //展示节点菜单类型编码
      $("input[name='disabled'][value='" + treeNode.disabled + "']").prop(
        "checked",
        "checked"
      ); //展示节点是否禁用
      this.src1 = menugetimg + treeNode.id; //展示节点图片
      this.photo=treeNode.icon_default
      console.log(this.photo)
      $("#icon1").show(); //点击节点是显示,否则隐藏
      this.zTree = treeNode; //将点击节点后的节点信息给treeNode
    },
    //鼠标移入节点时添加按钮
    addHoverDom(treeId, treeNode) {
      //this.addZTree=treeNode
      console.log(treeNode.menu_code_type);
      if (
        treeNode.menu_code_type === "list_menu" ||
        treeNode.menu_code_type === null
      ) {
        var sObj = $("#" + treeNode.tId + "_span");
        if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
          return;
        var addStr =
          "<span class='button add' id='addBtn_" +
          treeNode.tId +
          "' title='添加子节点' onfocus='this.blur();'></span>";
        sObj.after(addStr);
        var btn = $("#addBtn_" + treeNode.tId);
        if (btn)
          btn.bind("click", { paramName: treeNode }, function(e) {
            //console.log(this.zNodes)
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var newNode = { name: "newNode1" };
            newNode = treeObj.addNodes(treeNode, newNode);
            //console.log(treeNode.id)
            praent = treeNode.id;
            click = "add";
            return false;
          });
      }
    },
    //移除节点时隐藏添加按钮
    removeHoverDom(treeId, treeNode) {
      $("#addBtn_" + treeNode.tId)
        .unbind()
        .remove();
    },
    //修改或添加时点击保存按钮向后台发送修改或保存后的数据（根据节点id判断发送请求为修改或添加）
    save() {
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
        var add = {
          menuName: $("#name").val(),
          menuCode: $("#menuCode").val(),
          menuDescribe: $("#menu_msg").val(),
          menuHref: $("#url").val(),
          disabled: $('input:radio[name="disabled"]:checked').val(),
          iconDefault:this.photo ,
          iconSelected:'' ,
          fkMenuTypeCode: this.value2,
          fkParentMenuId: parent,
          fkParentMenuId: 0,
          authTbMenuElements: authTbMenuElementsAdd
        };
        console.log(add);
        var edit = {
          id: this.zTree.id,
          fkParentMenuId: this.zTree.pId,
          fkMenuId: this.zTree.id,
          menuName: $("#name").val(),
          menuCode: $("#menuCode").val(),
          menuDescribe: $("#menu_msg").val(),
          menuHref: $("#url").val(),
          disabled: $('input:radio[name="disabled"]:checked').val(),
          iconDefault: this.photo,
          iconSelected: "",
          fkMenuTypeCode: this.value2,
          authTbMenuElements: authTbMenuElementsEdit
        };
        console.log(edit)
        if (id === undefined) {
          this.axios.post(menuaddurl, add).then((request) => {
            console.log(request);
            if (request.data.state == true) {
              this.$message({
                message: request.data.msg+',刷新网页可查看！',
                type: "success"
              });
            } else {
              this.$message.error(request.data.msg);
            }
          });
        } else {
          this.axios.post(menuaddurl, edit).then((request) => {
            console.log(request);
            if (request.data.state == true) {
              this.$message({
                message: request.data.msg+',刷新网页可查看！',
                type: "success"
              });
            } else {
              this.$message.error(request.data.msg);
            }
          });
        }
      }
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
    }
  },
  mounted() {
    $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    this.freshArea();
    //当菜单页面一加载,就请求后台数据，动态渲染在菜单页面的表单下拉框上
    var list = [];
    this.axios
      .get(menutypeurl, { params: { type: "menu" } })
      .then(function(request) {
        //console.log(request)
        for (var item of request.data.row) {
          //console.log(item)
          list.push({ value: item.id, label: item.name, code: item.code });
        }
      });
    this.selectList = list;
  }
};
</script>
<style scoped>
button:hover {
  background-color: rgba(30, 158, 255, 0.8);
}
.but_div {
  width: 100%;
  height: 972px;
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
.mybut {
  width: 300px;
  height: 40px;
  font-size: 16px;
  color: white;
  background-color: #1e9eff;
  border: none;
  outline: none;
  border-radius: 3px;
  margin-left: 220px;
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
#mymenu {
  width: 100%;
  height: 852px;
}
#myForm{
  margin-left: 300px;
  margin-top: 20px
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
