<template>
  <div id="layerbinding">
    <div style="display: flex;flex-direction: row" id="mybook">
      <div style="background-color:white;width:250px;display: flex;flex-direction:column;overflow:auto">
        <div style="width: 250px;height:60px;background-color: #0096FF;font-size: 18px;color: white;text-align: center;line-height: 60px ">一体化管理系统</div>
        <ul id="treeDemo" class="ztree" style="margin-top:30px;margin-left:30px"></ul>
      </div>
      <div style="width: 1320px;margin-left: 30px;background-color:white;height:852px">
        <div style="width: 257px" class="inputDiv">
          <el-form ref="form" :model="form" label-width="80px">
            <p style="color:#878787;font-size: 15px;padding-left: 4px;margin-bottom: 40px">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址 :&nbsp;&nbsp;&nbsp;1库房2区3列2节1层A面</p>
            <el-form-item label="层架标签 : " >
              <el-input v-model="form.tag"></el-input>
            </el-form-item>
            <el-button type="primary" @click="onSubmit" style="width: 252px;margin-left: 5px;margin-top: 20px">保存</el-button>
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
            code: null,
            msg: null,
            href: null,
            disabled: null,
            icon_default: null,
            icon_selected: null,
            menu_code_type: null
          }
        ],
        form:{
          tag:''
        }
      }
    },
    methods:{
      onSubmit(){

      }
    },
    mounted(){
      $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    }
  }
</script>

<style scoped>
    .inputDiv{
      margin: 337px auto;
    }
</style>
