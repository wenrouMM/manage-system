<template>
  <div id="layerbinding">
    <div style="display: flex;flex-direction: row" id="mybook">
      <div style="background-color:white;width:250px;display: flex;flex-direction:column;">
        <div style="width: 250px;height:60px;background-color: #0096FF;font-size: 18px;color: white;text-align: center;line-height: 60px ">区信息</div>
        <div style="width: 250px;height: 892px;background-color: white;overflow: auto;">
          <ul id="treeDemo" class="ztree" style="margin-top:30px;margin-left:30px"></ul>
        </div>
      </div>
      <div style="width: 1320px;margin-left: 30px;background-color:white;height:952px" v-loading="formLoading">
        <div style="width: 350px" class="inputDiv">
          <span style="color:#878787;font-size: 15px;padding-left: 4px;margin: 0 auto">地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址 :&nbsp;&nbsp;&nbsp;{{Address}}{{direction}}</span>
          <span><img src="../../../base/img/currency/cuowu.png" id="imgX" style="width: 14px;height: 14px;margin-left: 10px;display: none" @click="closeCheck"></span>
          <el-form :ref="form" :model="form" label-width="90px" :rules="rules" style="width: 256px;margin-top: 30px">
            <el-form-item prop="tag" label="层架标签 : " >
              <el-input v-model="form.tag" id="tag"></el-input>
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
        rules: {
          // 添加的参数验证
          tag: [{ required: true, message: "请输入层架标签名", trigger: "blur" }],
        },
        zNodes: [

        ],
        form:{
          tag:''
        },
        Address:'',
        direction:'',
        i:0,
        saveString:{},
        id:'',
        formLoading:false
      }
    },
    computed: {
      //模糊查询参数
      saveData() {
        // 计算属性 真正传递的数据
        let saveData = { // 非空判断的各个值
          fkStoreId: this.saveString.fkStoreId,
          fkRegionId:this.saveString.fkRegionId,
          colNum:this.saveString.colNum,
          divNum:this.saveString.divNum,
          laysNum:this.saveString.laysNum,
          rfid:this.form.tag,
          direction:this.saveString.direction
        };
        //console.log(searchForm)
        return saveData;
      },
    },
    mounted(){
      $('#imgX').fadeOut()
      $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
      this.freshArea()
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
      closeCheck(){
        this.Address=''
        this.direction=''
        this.zNodes.length=0
        this.freshArea()
        this.form.tag=''
        $('#imgX').fadeOut()
      },
      async freshArea() {
        this.axios.get(layerFramezTree).then((response) => {
          console.log(response)
          if(response.data.state==true){
            for (var item of response.data.row) {
              //console.log(item)
              this.zNodes.push({
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
                rfid:item.rfid
              });
            }
            //将数据渲染到ztree树
            $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
          }else{
            this.$message.error(response.data.msg);
          }
        })
      },
      zTreeOnExpand(event, treeId, treeNode){
        console.log(treeNode)
        let name=treeNode.name.toString()
        if(this.Address.search(name) == -1 ){
          this.Address+=name
          $('#imgX').fadeIn()
        }
      },

      zTreeOnClick(event, treeId, treeNode){
        console.log(treeNode)
        console.log(treeNode.direction)
        this.saveString=treeNode
        this.form.tag=treeNode.rfid
        if(treeNode.direction!==null){
          this.direction=treeNode.name
        }
      },
      onSubmit(){
        this.$refs[this.form].validate((valid) => {
          if (valid) {
            //alert('submit!');
            this.save(this.saveData)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      save(value){
        if(this.direction){
          this.formLoading=true
          this.axios.post(layerFrameSave,value).then((res)=>{
            console.log(res)
            if(res.data.state==true){
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.formLoading=false
              this.$refs[this.form].resetFields()
              this.Address=''
              this.direction=''
              this.zNodes.length=0
              this.freshArea()
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
              this.formLoading=false
            }
          })
        }else{
          this.$alert('请选择您要修改的层架标签面', '提示', {
            confirmButtonText: '确定',
          })
        }
      }
    },
  }
</script>

<style scoped>
    .inputDiv{
      margin: 337px auto;
    }
</style>
