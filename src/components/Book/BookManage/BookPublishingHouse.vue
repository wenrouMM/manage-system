<template>
  <div id="bookpublishhouse" style="">
    <div style="display: flex;flex-direction: row;height: 952px" id="mybook">
      <div style="background-color:white;width:250px;height:952px;display: flex;flex-direction:column;overflow-y: auto">
        <div style="width: 250px;height:60px;background-color: #0096FF;font-size: 18px;color: white;text-align: center;line-height: 60px ">图书出版社</div>
        <div style="width: 250px;height: 892px;background-color: white;overflow-y: scroll">
          <ul id="treeDemo" class="ztree" style="margin-top:30px;margin-left:30px"></ul>
        </div>
      </div>
      <div style="width:1288px;margin-left: 30px;background-color:white;height:952px">
        <el-container>
          <div class="box-card">
            <!-- 0.0 面包屑路由导航部分 此处路由导航可以直接跳 属于动态添加渲染出的 -->
            <div class="space"></div>
            <!-- 估计是第三层路由展示区域 -->
            <div class="important">
              <!-- 1.0 标题 -->
              <div class="sonTitle">
                <span class="titleName">图书出版社</span>
              </div>
              <div style="display: flex;flex-direction: row">
                <!-- 3.0 添加删除按钮 添加之前：弹框提交  状态： 正在添加 添加完成（alert提示自带）/添加失败请重试 -->
                <div class="buttonBox">
                  <button class="add" @click="addDialogOpen">
                    <i class="addIcon el-icon-plus"></i>添加
                  </button>
                </div>
              </div>
              <!-- 4.0 表格展示内容 编辑功能：状态用上 禁用 批量禁用弹框 弹框可尝试用slot插槽封装 -->
                <section class="text item tablebox" v-loading="tableLoading" element-loading-text="拼命加载中">
                  <el-table
                    class="tableBorder"
                    :data="tableData"
                    empty-text="无数据"
                    style="width: 100%; text-align:center;"
                    type="index"
                    :row-style="rowStyle"
                    :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'18px'}"
                  >
                  <el-table-column align="center" prop="index" width="220" label="序号">
                    <template slot-scope="scope">
                      <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="name" width="250" label="出版社名称"></el-table-column>
                  <el-table-column align="center" prop="address" width="250" label="公司地址"></el-table-column>
                  <el-table-column align="center" prop="contacts" width="250" label="联系人"></el-table-column>
                  <el-table-column align="center" prop="telephone" width="250" label="联系电话"></el-table-column>
                </el-table>
                  <!-- 5.0 分页内容 分页提交刷新页面 前进后退 点击以及调转四个事件传递数值-->
                  <section class="pagination mt_30">
                  <el-pagination
                    background
                    layout="prev, pager, next,total, jumper, ->"
                    :total="total"
                    :page-size="pageSize"
                    :current-page="currentPage"
                    @current-change="current_change"
                  ></el-pagination>
                  <span class="pagaButton">确定</span>
                </section>
              </section>
            </div>
          </div>
          <!-- 添加弹框 -->
          <div class="addEditDialog">
            <!-- Form -->
            <el-dialog @close="closeForm" width="568px" :title="Dialogtitle[0]" :visible.sync="dialogFormVisible">
              <el-form id="addFormYf"  label-width="100px" :rules="addRules" :model="addForm" :ref="addForm" style="display: flex;flex-direction: column">
                <el-form-item label="出版社名称 :" prop="publishName" style="padding-left: 70px">
                  <el-input v-model="addForm.publishName"></el-input>
                </el-form-item>
                <el-form-item label="公司地址 :" prop="componentAddress" style="padding-left: 70px">
                  <el-input v-model="addForm.componentAddress"></el-input>
                </el-form-item>
                <el-form-item label="联 系 人 :" prop="contacts" style="padding-left: 70px">
                  <el-input v-model="addForm.contacts"></el-input>
                </el-form-item>
                <el-form-item label="联系电话 :" prop="contactPhone" style="padding-left: 70px">
                  <el-input v-model="addForm.contactPhone"></el-input>
                </el-form-item>
                <!-- 弹框表单按钮  验证失效-->
                <el-form-item>
                  <el-button type="primary" @click="submitForm()" >确定</el-button>
                  <el-button type="info" @click="resetForm()" >取消</el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </div>
        </el-container>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        /*====== 0.0初始化弹框数据ztree ======*/
        setting: {
          edit: {
            enable: true,
            showRemoveBtn: false,
            addHoverBtn:true,
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
        tableLoading:false,
        zNodes: [

        ],
        /*====== 0.0初始化弹框数据 ======*/
        /*初始化 */
        //total: 0,
        total: 0,
        pageSize: 7,
        currentPage: 1,
        paginationForm: {},
        centerDialogVisible: false, // 禁用弹框
        Dialogtitle: ["添加"],
        i: 0, // 切换弹框标题
        dialogFormVisible: false, // // 添加弹框的展示和消失
        addForm: {
          // 添加的数据表单 共8个参数
          idType:"", //序号
          publishName:"", //出版社名称
          companyAddress:"", //公司地址
          contacts:"", //联系人
          contactPhone:"" //联系电话
        },
        addRules: {
          // 添加的参数验证
          publishName: [{ required: true, message: "请输入出版社名称", trigger: "blur" }],
          componentAddress: [{ required: true, message: "请输入公司地址", trigger: "blur" }],
          contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
          contactPhone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        },
        formLabelWidth: "120px",
        /*====== 2.0表单提交数据项 ======*/
        search: "", // 存储搜索完成后的2.0表单数据 用于调用分页接口

        /*====== 3.0添加 批量删除所需数据 ======*/
        Allseclet: [], // 存储全选框 单选框的数据/索引 用于传递给后台同时 前端用索引号去删除表格内的内容

        /*====== 4.0表格设置项 ======*/
        rowStyle: {
          height: "60px"
        },
        /*====== 5.0 分页相关设置项 ======*/
        zTree:{},
        tableData:[]
      };
    },
    methods: {
      /*====== 3.0添加删除相关操作 ======*/
      addDialogOpen() {
        //this.dialogFormVisible = true;
        this.$alert('请选择您要添加图书出版社的所在地区', {
          confirmButtonText: '确定',
          callback: action => {
            //this.dialogFormVisible = true
          }
        });
      },
      /*====== 3.1ztree城市树状图 ======*/
      async freshArea() {
        this.axios.get(bookurlcity).then((response)=>{
          console.log(response)
          for (var item of response.data.row) {
            this.zNodes.push({
              name:item.name,
              code: item.code, //节点菜单编码
            });
          }
          //将数据渲染到ztree树
          $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
        })
      },
      /*====== 3.1点击ztree节点获取节点信息======*/
      zTreeOnClick(event, treeId, treeNode){
        console.log(treeNode.name,treeNode.code)
        var list={
          name:treeNode.name,
          code:treeNode.code
        }
        this.zTree=list
        this.dialogFormVisible = true
      },
      /*====== 弹框相关函数 ======*/
      // 编辑弹框
      submitForm() {
        var addStr=[{
          id: null,
          code: "",
          name:this.addForm.publishName,
          fkCityCode:this.zTree.code,
          fkCityName:this.zTree.name,
          address:this.addForm.componentAddress,
          contacts:this.addForm.contacts,
          telephone:this.addForm.contactPhone
        }]
        this.axios.post(bookpublishhouse,addStr).then((res)=>{
          console.log(res)
          if(res.data.state==true){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.closeForm()
            this.dialogFormVisible=false
            this.table()
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
            this.closeForm()
            this.dialogFormVisible=false
          }
        })
        this.$refs[this.addForm].resetFields();
      },
      resetForm() {
        this.$refs[this.addForm].resetFields();
        this.dialogFormVisible=false
      },
      closeForm() { // 弹框关闭的时候执行 清空数据
        //console.log("关闭测试");
        console.log(111)
        this.$refs[this.addForm].resetFields();
        let obj = this.addForm;
        for (var i in obj) {
          obj[i] = "";
        }
      },
      table(value){
        this.tableLoading= true; // 加载前控制加载状态
        this.axios
          .get(bookurlselect, {
            params: value
          })
          .then(res => {
            console.log("当前获取的数据", res.data);
            if (res.data.state === true) {
              let nomol = res.data.row;
              // let i = 1;
              // for (let item of nomol) {
              //   item.index = i;
              //   i++;
              // }
              this.tableData = nomol; //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
              console.log("过滤后的数据", nomol);
              console.log("保存当前查询", this.paginationForm);
              this.tableLoading = false;
            } else {
              this.$message.error(res.data.msg);
              this.tableLoading = false;
            }
          })
      },
      current_change: function(currentPage) {
        //分页查询
        this.currentPage = currentPage; //点击第几页
        this.paginationForm.currentPage = currentPage;
        console.log("保存当前查询", this.paginationForm);
        this.table(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
      },
    },
    mounted(){
      this.table()
      this.freshArea()
    }
  };
</script>

<style scoped>
  #mybook{
    width: 100%;
  }
  section.pagination {
    display: flex;
    justify-content: center;
  }
  .formbutton button{
    width: 150px;
    border-radius: 10px
  }
  .important {
    padding: 30px;
  }
  /* 1.0标题 通用部分 */
  .sonTitle {
  }
  .sonTitle .titleName {
    border-left: 4px solid #0096ff;
    padding-left: 10px;
    font-size: 16px;
    font-family: MicrosoftYaHei;
    font-weight: 400;
    color: rgba(135, 135, 135, 1);
    display: inline-block;
    margin-bottom: 33px;
  }
  .useradd .box-card {
    width: 100%;
  }
  .text {
    font-size: 14px;
  }
  /* 按钮 */
  .buttonBox {
    margin-bottom: 30px;
    margin-right: 800px;
  }
  .buttonBox button {
    padding-left: 18px;
    padding-right: 18px;
    height: 40px;
    font-size: 16px;
    color: #fff;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: none;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
  }
  .buttonBox .add {
    background: rgba(255, 146, 49, 1);
    border-radius: 10px;
    margin-right: 30px;
  }
  .buttonBox .add .addIcon {
    margin-right: 6px;
  }
  .buttonBox .delete {
    background: rgba(255, 92, 60, 1);
    border-radius: 10px;
  }
  .buttonBox .delete .deleteIcon {
    margin-right: 6px;
  }
</style>
