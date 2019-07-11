<template>
  <div style="display: flex;flex-direction: row;">
    <div style="width:250px;display: flex;flex-direction:column;">
      <div style="width: 210px;height:60px;background-color: #0096FF;font-size: 18px;color: white;padding-left: 40px;line-height: 60px ">图书出版社</div>
      <div style="overflow-y: auto;background-color:white;height: 900px">
        <ul id="treeDemo" class="ztree" style="margin-left:15px"></ul>
      </div>
    </div>
      <div style="width:1320px;margin-left: 30px;background-color:white;overflow: auto">
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
              <div >
                <div class="flexLayout">
                  <!-- 3.0 添加删除按钮 添加之前：弹框提交  状态： 正在添加 添加完成（alert提示自带）/添加失败请重试 -->
                  <div class="buttonBox">
                    <button class="add" @click="addDialogOpen">
                      <i class="addIcon el-icon-plus"></i>添加
                    </button>
                    <!--<button class="blue" @click="deriveBtn">
                      <i class="blueIcon el-icon-share"></i>导出
                    </button>-->
                  </div>
                  <div class="right">
                    <el-form :inline="true" :model="searchForm">
                      <el-form-item label="出版社名称 :">
                        <el-input v-model="searchForm.publishingName" placeholder="请输入出版社名称" clearable style="width: 200px"></el-input>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
                <!-- 4.0 表格展示内容 编辑功能：状态用上 禁用 批量禁用弹框 弹框可尝试用slot插槽封装 -->
                <section class="tableBox"  v-loading="tableLoading">
                  <el-table
                    :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px',borderRight:'none'}"
                    empty-text="无数据"
                    style="width: 100%; text-align:center;"
                    :data="tableData"
                    :row-style="{height:'60px'}"
                  >
                    <el-table-column align="center" prop="index" type="index" width="100" label="序号">
                      <template slot-scope="scope">
                        <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="name" label="出版社名称" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column align="center" prop="address" label="公司地址" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column align="center" prop="contacts" label="联系人" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column align="center" prop="telephone" label="联系电话" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column align="center" label="操作" fixed="right">
                      <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                      <template slot-scope="scope">
                        <span class="edit" @click="EditBtn(scope.$index, scope.row)">修改</span>
                        <span class="ban" @click="deleteBtn(scope.$index, scope.row)">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- 4.0 分页 -->
                  <section class="pagination mt_30">
                    <el-pagination
                      style="display: inline-block"
                      background
                      layout="prev, pager, next,total,slot"
                      :total="total"
                      :page-size="pageSize"
                      :current-page="currentPage"
                      @current-change="current_change"
                    >
                      <slot>
                  <span>
                    前往
                    <div class="el-input el-pagination__editor is-in-pagination">
                      <input
                        ref="text"
                        type="number"
                        v-model="pageInput"
                        autocomplete="off"
                        min="1"
                        max="1"
                        class="compo el-input__inner"
                      >
                    </div>页
                  </span>
                      </slot>
                    </el-pagination>
                    <el-button type="primary" class="ml_30" size="medium" @click="jumpBtn">确定</el-button>
                  </section>
                </section>
              </div>
            </div>
          </div>
          <!-- 添加弹框 -->
          <div class="addEditDialog">
            <!-- Form -->
            <el-dialog @close="closeForm" width="500px" :title="Dialogtitle[i]" :visible.sync="dialogFormVisible">
              <el-form id="addFormYf"  label-width="130px" :rules="addRules" :model="addForm" :ref="addForm" style="display: flex;flex-direction: column;margin-top: 15px">
                <el-form-item label="出版社名称 :" prop="publishName">
                  <el-input v-model="addForm.publishName"></el-input>
                </el-form-item>
                <el-form-item label="公 司 地 址 :" prop="componentAddress">
                  <el-input v-model="addForm.componentAddress"></el-input>
                </el-form-item>
                <el-form-item label="联　系　人 :" prop="contacts">
                  <el-input v-model="addForm.contacts"></el-input>
                </el-form-item>
                <el-form-item label="联 系 电 话 :" prop="contactPhone">
                  <el-input v-model="addForm.contactPhone"></el-input>
                </el-form-item>
                <!-- 弹框表单按钮  验证失效-->
                <el-form-item label-width="110px">
                  <div>
                    <span class="dialogButton true mr_40" @click="submitForm()">确 定</span>
                    <span class="dialogButton cancel" @click="resetForm()">取 消</span>
                  </div>
                </el-form-item>
              </el-form>
            </el-dialog>
          </div>
          <div class="forbid collectionDelete">
            <el-dialog :title="Dialogtitle[i]" :visible.sync="centerDialogVisible" width="400px" center>
              <div class="dialogBody">
                是否{{Dialogtitle[i]}}?
              </div>
              <div style="margin-bottom: 20px">
                <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
                <span class="dialogButton cancel" @click="centerDialogVisible=false">取 消</span>
              </div>
            </el-dialog>
          </div>
        </el-container>
      </div>
  </div>
</template>

<script>
  import {bookpublish } from '../../../request/api/base.js'
  import {isvalidPhone} from '../../../base/js/yf/elementValidate'
  var validPhone=(rule, value,callback)=>{
    if (!value){
      callback(new Error('请输入电话号码'))
    }else  if (!isvalidPhone(value)){
      callback(new Error('号码格式不正确或者位数不正确'))
    }else {
      callback()
    }
  }
  export default {
    data() {
      return {
        /*====== 0.0初始化弹框数据ztree ======*/
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
            beforeCheck: this.zTreeOnCheck, //勾选时事件
          },
          check: {
            enable: true,
            chkStyle: "radio",
            radioType: "all"
          }
        },
        tableLoading:false,
        zNodes: [

        ],
        /*====== 0.0初始化弹框数据 ======*/
        /*初始化 */
        //total: 0,
        total: 0,
        pageSize: 10,
        pageInput: 1,
        currentPage: 1,
        paginationForm: {},
        zTree:{},
        centerDialogVisible: false, // 禁用弹框
        Dialogtitle: ["添加",'修改','删除'],
        i: 0, // 切换弹框标题
        dialogFormVisible: false, // // 添加弹框的展示和消失
        addForm: {
          // 添加的数据表单 共8个参数
          idType:"",
          publishName:"", //出版社名称
          componentAddress:"", //公司地址
          contacts:"", //联系人
          contactPhone:"" //联系电话
        },
        id:'',
        code:'',
        cityName:'',
        cityCode:'',
        addRules: {
          // 添加的参数验证
          publishName: [{ required: true, message: "请输入出版社名称", trigger: "blur" }],
          componentAddress: [{ required: true, message: "请输入公司地址", trigger: "blur" }],
          contacts: [{ required: true, message: "请输入联系人", trigger: "blur" }],
          contactPhone: [{ required: true, trigger: 'blur', validator: validPhone }],
        },
        formLabelWidth: "120px",
        /*====== 2.0表单提交数据项 ======*/
        searchForm:{
          publishingName:'',
        },
        search: "", // 存储搜索完成后的2.0表单数据 用于调用分页接口

        /*====== 3.0添加 批量删除所需数据 ======*/
        Allseclet: [], // 存储全选框 单选框的数据/索引 用于传递给后台同时 前端用索引号去删除表格内的内容

        /*====== 4.0表格设置项 ======*/
        rowStyle: {
          height: "60px"
        },
        /*====== 5.0 分页相关设置项 ======*/
        tableData:[],
      };
    },
    computed:{
      searchTimeForm() {
        // 计算属性 真正传递的数据
        let citynameCode=''
        if(this.zTree.code==undefined){
          citynameCode='bj_jing'
        }else{
          citynameCode=this.zTree.code
        }
        let searchForm = {
          pageSize: this.pageSize,
          current:1,
          cityCode:citynameCode,
          fkPressName:this.searchForm.publishingName
        };
        return searchForm;
      },
    },
    methods: {
      jumpBtn() {
        // v-mode绑定好像会默认转数据类型

        let page = Math.ceil(this.total / this.pageSize)
        page ==0?1:page;
        if(this.pageInput>page || this.pageInput == ''|| this.pageInput<0){
          this.pageInput = 1
          this.$nextTick(()=>{
            this.$refs.text.value = 1 // hack方法

    })
        }else{
          this.pageInput = parseInt(this.pageInput)
          this.$refs.text.value = parseInt(this.pageInput)
          let num = parseInt(this.pageInput)
          this.current_change(num)
        }
      },
      //搜索按钮
      searchBtn(){
        this.SearchApi(this.searchTimeForm)
      },
      //导出按钮
      deriveBtn(){

      },
      //修改按钮
      EditBtn(index,row){
        this.i=1
        this.dialogFormVisible=true

        this.addForm.publishName=row.name
        this.addForm.componentAddress=row.address
        this.addForm.contacts=row.contacts
        this.addForm.contactPhone=row.telephone
        this.code=row.code
        this.cityName=row.fkCityName
        this.cityCode=row.fkCityCode
        this.id=row.id
      },
      //删除按钮
      deleteBtn(index,row){
        this.i=2
        this.centerDialogVisible=true
        this.id=row.id
      },
      //删除确定按钮
      submitDialog(){
        this.axios.post(bookpublish.delete,[{id:this.id}]).then((res)=>{

          if(res.data.state==true){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.SearchApi(this.searchTimeForm)
            this.centerDialogVisible=false
          }else {
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
          }
        })
      },
      /*====== 3.0添加相关操作 ======*/
      addDialogOpen() {
        this.i=0
        this.dialogFormVisible = true;
      },
      /*====== 3.1ztree城市树状图 ======*/
      async freshArea() {
        let list=[]
        this.axios.get(bookpublish.city).then((response)=>{

          for (let item of response.data.row) {
            list.push({
              name:item.name,
              code: item.code, //节点菜单编码
              checked:item.checked
            });
          }
          //将数据渲染到ztree树

          $.fn.zTree.init($("#treeDemo"), this.setting, list);
          this.zNodes=list
        })
      },
      /*====== 3.1点击ztree节点获取节点信息======*/
      zTreeOnCheck(event,treeId){

        let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        if(treeId.checked==true){
          treeObj.checkNode(treeId, !treeId.checked, true);
        }
        let list={
          name:treeId.name,
          code:treeId.code
        }
        this.zTree=list
        this.SearchApi(this.searchTimeForm)
      },
      zTreeOnClick(event, treeId, treeNode){

        let treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        if(treeNode.checked==false){
          treeObj.checkNode(treeNode, !treeNode.checked, true);
        }
        let list={
          name:treeNode.name,
          code:treeNode.code
        }
        this.zTree=list
        this.SearchApi(this.searchTimeForm)
      },
      /*====== 弹框相关函数 ======*/
      // 编辑弹框
      submitForm() {

        if(this.i==0){
          this.$refs[this.addForm].validate((valid) => {
            if (valid) {
              if(this.zTree.code==undefined){
                this.formApi('北京市','bj_jing')
              }else{
                this.formApi(this.zTree.name,this.zTree.code)
              }
            } else {

              return false;
            }
          });
        }else if(this.i==1){
          this.axios.post(bookpublish.edit,{
            id:this.id,
            name:this.addForm.publishName,
            code:this.code,
            fkCityCode:this.cityCode,
            fkCityName:this.cityName,
            address:this.addForm.componentAddress,
            contacts:this.addForm.contacts,
            telephone:this.addForm.contactPhone
          }).then((res)=>{

            if(res.data.state==true){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.SearchApi(this.searchTimeForm)
              this.closeForm()
              this.$refs[this.addForm].resetFields();
              this.dialogFormVisible=false
            }else{
              this.$message({
                message: res.data.msg,
                type: 'error'
              });
            }
          })
        }
      },
      formApi(ztreeName,ztreeCode){
        var addStr=[{
          id: null,
          code: "",
          name:this.addForm.publishName,
          fkCityCode:ztreeCode,
          fkCityName:ztreeName,
          address:this.addForm.componentAddress,
          contacts:this.addForm.contacts,
          telephone:this.addForm.contactPhone
        }]
        this.axios.post(bookpublish.add,addStr).then((res)=>{

          if(res.data.state==true){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.SearchApi(this.searchTimeForm)
            this.closeForm()
            this.$refs[this.addForm].resetFields();
            this.dialogFormVisible=false
            /*let cityName={cityCode:citynameCode}*/
          }else{
            this.$message({
              message: res.data.msg,
              type: 'error'
            });
            //this.closeForm()
            //this.dialogFormVisible=false
          }
        })
      },
      resetForm() {
        this.$refs[this.addForm].resetFields();
        this.dialogFormVisible=false
      },
      closeForm() { // 弹框关闭的时候执行 清空数据

        this.$refs[this.addForm].resetFields();
        let obj = this.addForm;
        for (var i in obj) {
          obj[i] = "";
        }
      },
      paginationApi(value){
        this.tableLoading= true; // 加载前控制加载状态
        this.axios
          .get(bookpublish.select, {
            params: value
          })
          .then(res => {

            if (res.data.state === true) {
              let nomol = res.data.row;
              this.tableData = nomol; //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果

              this.tableLoading = false;
            } else {
              this.$message.error(res.data.msg);
              this.tableLoading = false;
            }
          })
      },
      SearchApi(value){
        this.tableLoading= true; // 加载前控制加载状态
        this.axios
          .get(bookpublish.select, {
            params: value
          })
          .then(res => {

            if (res.data.state === true) {
              let nomol = res.data.row;
              this.tableData = nomol; //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果

              this.currentPage = 1

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

        this.paginationApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
      },

    },
    mounted(){
      this.SearchApi(this.searchTimeForm);
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
 .box-card {
    width: 100%;
  }
  .text {
    font-size: 14px;
  }
  .edit {
    color: #00d7f0;
    cursor: pointer;
    margin-right: 20px;
  }
  .ban {
    color: #ff5c3c;
    cursor: pointer;
  }
  /* 按钮 */
  .buttonBox {
    margin-bottom: 30px;
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
    margin-right: 10px;
  }
  .buttonBox .add .addIcon {
    margin-right: 6px;
  }
  .buttonBox .blue {
    background: #31D6FF;
    border-radius: 10px;
  }
  .buttonBox .blue .blueIcon {
    margin-right: 6px;
  }
</style>
