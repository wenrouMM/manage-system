<template>
  <div id="layerbinding">
    <div style="display: flex;flex-direction: row" id="mybook">
      <div style="background-color:white;width:250px;display: flex;flex-direction:column;">
        <div style="width: 210px;height:60px;background-color: #0096FF;font-size: 18px;color: white;padding-left:40px;line-height: 60px ">藏馆信息</div>
        <ul id="treeDemo" class="ztree" style="margin-top:30px;margin-left:30px"></ul>
      </div>
      <div style="width: 1320px;margin-left: 30px;background-color:white;height:852px">
        <div style="width: 400px" class="inputDiv">
          <el-form :label-position="labelPosition" label-width="80px" :model="form" id="form">
            <el-form-item label="名称 :">
              <el-input v-model="form.name" ></el-input>
            </el-form-item>
            <el-form-item label="建馆时间 :">
              <el-input v-model="form.date"></el-input>
            </el-form-item>
            <el-form-item label="负责人 :">
              <el-input v-model="form.body"></el-input>
            </el-form-item>
            <el-form-item label="联系电话 :">
              <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="所属地区 :">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-button @click="submitLib()" type="primary" style="width:200px;margin-left: 100px;margin-top: 30px">保存</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LayerBinding",
    data(){
      return {
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
            id: 1,
            pId: 0,
            name: "图书馆管理平台",
           // icon:'../../../../src/base/img/menu/zengjia.png'
          }
        ],
        form:{
          name:'',
          date:"",
          body:'',
          phoneL:"",
          address:""
        },
        labelPosition: 'left',
      }
    },
    computed:{
      timeInfo() {
        
      }
    },
    methods:{
      addHoverDom(treeId, treeNode) {
        //this.addZTree=treeNode
        //console.log(treeNode.menu_code_type);
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
              var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
              var newNode = { name: "newNode1" };
              newNode = treeObj.addNodes(treeNode, newNode);
              return false;
            });
      },
      //移除节点时隐藏添加按钮
      removeHoverDom(treeId, treeNode) {
        $("#addBtn_" + treeNode.tId)
          .unbind()
          .remove();
      },
      // 提交按钮
      submitLib(){

      }
    },
    mounted(){
      $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    }
  }
</script>

<style scoped>
  .inputDiv{
    margin: 200px auto;
  }
</style>
