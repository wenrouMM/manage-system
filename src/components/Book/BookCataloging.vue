<template>
  <div id="Notice">
    <el-container>
      <div class="commonMode" style="width:100%;overflow: auto">
        <div class="sonTitle">
          <span class="titleName">书籍编目</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="buttonBox">
            <button class="add" @click="rechargeBtn">
              <i class="addIcon el-icon-plus"></i>添加
            </button>
            <button class="delete" @click="drawbackBtn(tableChecked)">
              <i class="deleteIcon el-icon-delete"></i>批量删除
            </button>
            <el-button icon="el-icon-share" type="primary" class="blue" :loading="downloadLoading"  @click="deriveBtn">
               <!-- <i class="blueIcon el-icon-share"></i> --> 导出
            </el-button>
            <button class="green" @click="tunnellingBtn">
              <i class="el-icon-edit greenIcon"></i>批量导入
            </button>
          </div>
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="筛选 :">
              <el-select
                style="width: 150px"
                v-model="searchForm.makeMethod"
                placeholder="请选择"
                clearable
                @change="selectCheck(searchForm.makeMethod)"
              >
                <el-option label="书名" value="0"></el-option>
                <el-option label="ISBN" value="1"></el-option>
                <el-option label="丛编题名" value="2"></el-option>
              </el-select>
              <el-input v-model="searchForm.searchData" placeholder="请输入相关信息" clearable style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
            </el-form-item>
          </el-form>
        </section>
        <!-- 3.0表格数据 -->
        <section class="tableBox"  v-loading="tableLoading">
          <el-table
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px',borderRight:'none'}"
            empty-text="无数据"
            style="width: 100%; text-align:center;"
            :data="tableData"
            :row-style="{height:'60px'}"
            @selection-change="handleSelectionChange"
          >
            <el-table-column align="center" type="selection" width="100" fixed="left"></el-table-column>
            <el-table-column align="center" prop="index" type="index" width="150" label="序号" fixed="left">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="name" label="书名" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="clusterName" label="丛编题名" width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.clusterName == null || scope.row.clusterName=='' ?'---':scope.row.clusterName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="isbn" label="ISBN" width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.isbn == null || scope.row.isbn=='' ?'---':scope.row.isbn}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="author" label="编著者" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkTypeCode" label="分类号" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkTypeName" label="分类名" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkPressName" label="出版社" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="publishingTime" label="出版时间" width="200" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.publishingTime == null || scope.row.publishingTime=='' ?'---':scope.row.publishingTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="language" label="语种" width="150" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.language == null || scope.row.language=='' ?'---':scope.row.language}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作" fixed="right" width="200">
              <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
              <template slot-scope="scope">
                <span class="edit" @click="EditBtn(scope.$index, scope.row)">修改</span>
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
                  <input ref="text" type="number" v-model="pageInput" autocomplete="off" min="1" max="1" class="compo el-input__inner">
                </div>
                页
              </span>
              </slot>
            </el-pagination>
            <el-button type="primary" class="ml_30"  size="medium" @click="jumpBtn">确定</el-button>
          </section>
        </section>
      </div>
      <!-- 新增弹框 -->
      <div class="" id="catalogMessage">
        <!-- Form -->
        <el-dialog @close="closeForm" width="900px" :title="Dialogtitle[i]" :visible.sync="dialogFormVisible">
          <div v-if="i==1||i==0" style="width: 880px">
            <div class="messageAdd_Edit">
              <el-form id="catalogingAdd"
                       :rules="rules"
                       :model="addForm"
                       label-width="100px"
                       :ref="addForm">
                <div style="display: flex;flex-direction: column;">
                  <div>
                    <div class="flexLayout" style="width: 840px;">
                      <el-form-item label=" I S B N :" prop="isbn" label-width="100px" class="isbnInput">
                        <el-input v-model="addForm.isbn" placeholder="请输入ISBN搜索相关数据进行添加" id="isbnInput">
                          <el-button slot="append" type="primary" @click="isbnData" icon="el-icon-search"></el-button>
                        </el-input>
                      </el-form-item>
                      <span style="padding-top: 15px;padding-right:60px;font-size: 10px;color: rgb(180, 187, 202)">若远程或本地都没有相关的数据，请手动录入图书资料！</span>
                      <!-- <p class="searchButton" @click="isbnData">
                        <img src="../../base/img/currency/ssbs.png" id="isbnSearch">
                      </p> -->
                    </div>
                    <div style="margin: 0px auto 15px;width: 600px">
                      <el-checkbox-group v-model="type" @change="BookInfoFun(type)" class="flexLayout">
                        <el-checkbox :label="1" name="type">本地获取数据</el-checkbox>
                        <el-checkbox :label="2" name="type">远程获取数据</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                  <div class="Separator"></div>
                  <div id="noError">
                    <div class="flexLayout twoInput">
                      <el-form-item label=" 正 题 名 :" prop="name" style="">
                        <el-input v-model="addForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label=" 副 题 名 :" style="">
                        <el-input v-model="addForm.viceName "></el-input>
                      </el-form-item>
                    </div>
                    <div class="flexLayout twoInput">
                      <el-form-item label=" 丛编题名 :" style="">
                        <el-input v-model="addForm.clusterName"></el-input>
                      </el-form-item>
                      <el-form-item label=" 编 著 者 :" prop="author" style="">
                        <el-input v-model="addForm.author "></el-input>
                      </el-form-item>
                    </div>
                    <div class="flexLayout">
                      <el-form-item label=" 分 类 号 :" prop="fkTypeCode" class="buttonInput">
                        <div class="flexLayout">
                          <el-input v-model="addForm.fkTypeCode">
                            <el-button slot="append" type="primary" @click="typeTreeFun" icon="el-icon-search"></el-button>
                          </el-input>
                          <!-- <p class="searchButton" style="width: 50px;left: 180px" @click="typeTreeFun">
                            <img src="../../base/img/currency/ssbs.png" style="width:20px;height:20px;margin-left: 15px;margin-top: 10px">
                          </p> -->
                        </div>
                      </el-form-item>
                      <el-form-item label=" 分 类 名 :" prop="fkTypeName"  class="oneInput">
                        <el-input v-model="addForm.fkTypeName "></el-input>
                      </el-form-item>
                    </div>
                    <div id="catalogingInput4" class="flexLayout">
                      <el-form-item label=" 出 版 社 :" prop="fkPressName" class="buttonInput">
                        <div class="flexLayout">
                          <el-input v-model="addForm.fkPressName">
                            <el-button slot="append" type="primary" @click="publishTreeFun" icon="el-icon-search"></el-button>
                          </el-input>
                          <!--  <p class="searchButton" style="width: 50px;left: 180px" @click="publishTreeFun">
                             <img src="../../base/img/currency/ssbs.png" style="width:20px;height:20px;margin-left: 15px;margin-top: 10px">
                           </p> -->
                        </div>
                      </el-form-item>
                      <el-form-item label=" 出 版 地 :">
                        <el-input v-model="addForm.publishingPleace "></el-input>
                      </el-form-item>
                      <el-form-item label=" 出版日期 :">
                        <el-input v-model="addForm.publishingTime "></el-input>
                      </el-form-item>
                    </div>
                    <div class="flexLayout threeInput">
                      <el-form-item label=" 页 码 :" class="oneBigInput">
                        <el-input v-model="addForm.pageNumber"></el-input>
                      </el-form-item>
                      <el-form-item label=" 开 本 :">
                        <el-select v-model="addForm.openBook" filterable>
                          <el-option label="64开" value="64"></el-option>
                          <el-option label="32开" value="32"></el-option>
                          <el-option label="16开" value="16"></el-option>
                          <el-option label="8开" value="8"></el-option>
                          <el-option label="4开" value="4"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label=" 价 格 :" prop="price">
                        <el-input v-model="addForm.price "></el-input>
                      </el-form-item>
                    </div>
                    <div  class="flexLayout">
                      <el-form-item label=" 语 种 :" prop="languageCode" class="selectInput">
                        <el-select v-model="addForm.languageCode" filterable placeholder="请选择">
                          <el-option
                            v-for="item in options"
                            :key="item.index"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label=" 文献类别 :" class="threeInput">
                        <el-select v-model="addForm.literatureType" filterable>
                          <el-option label="图书" value="图书"></el-option>
                          <el-option label="古籍" value="古籍"></el-option>
                          <el-option label="视频" value="视频"></el-option>
                          <el-option label="教材" value="教材"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label=" 装订版面 :">
                        <el-select v-model="addForm.layout" filterable>
                          <el-option label="平装" value="平装"></el-option>
                          <el-option label="精装" value="精装"></el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="flexLayout threeInput">
                      <el-form-item label=" 版 次 :" class="oneBigInput">
                        <el-input v-model="addForm.edition "></el-input>
                      </el-form-item>
                      <el-form-item label=" 卷 册 号 :">
                        <el-input v-model="addForm.volumeNum "></el-input>
                      </el-form-item>
                      <el-form-item label=" 附 件 :">
                        <el-input v-model="addForm.appendix "></el-input>
                      </el-form-item>
                    </div>
                    <div class="flexLayout twoInput">
                      <el-form-item label=" 附　　注 :">
                        <el-input v-model="addForm.annotations "></el-input>
                      </el-form-item>
                      <el-form-item label=" 主 题 词 :">
                        <el-input v-model="addForm.themeWord "></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label=" 备　　注 :" style="width: 760px;">
                        <el-input type="textarea" v-model="addForm.renarks" style="width: 740px;height: 80px" :autosize="{ minRows:3, maxRows:3}" resize="none"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </el-form>
            </div>
            <div class="messageAdd_Edit buttonStyle">
              <div style="margin:10px auto 10px;width:400px ">
                <span class="dialogButton true mr_40" @click="definiteCheck()" style="width: 150px">确 定</span>
                <span class="dialogButton cancel" @click="cancelCheck()" style="width: 150px;margin-left: 50px">取 消</span>
              </div>
            </div>
            <div style="margin-bottom: 10px">
              <el-checkbox v-model="SuitBook" @change="SuitBookFun(SuitBook)">套装书</el-checkbox>
              <span>(说明:同一套书请录入相同的丛编题名)</span>
            </div>
          </div>
          <div id="typeMessage">
            <div style="position: relative">
              <p>{{messageName}}</p>
              <img src="../../base/img/menu/xx.png" style="position: absolute;top: 15px;left: 360px;width: 20px;height: 20px" @click="closeCheck">
            </div>
            <div class="typeZtree powerElement">
              <ul id="treeDemo" class="ztree"></ul>
            </div>
          </div>
        </el-dialog>
      </div>
      <!--'调馆','删除','启用','报损'弹框-->
      <div class="forbid collectionDelete">
        <el-dialog :title="catalogtitle[j]" :visible.sync="centerDialogVisible" :width="messageWidth" center>
          <div v-if="j==0||j==1||j==2">
            <div class="dialogBody" style="margin-left: -30px">
              是否{{catalogtitle[j]}}?
            </div>
            <div style="margin-bottom: 30px">
              <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
              <span class="dialogButton cancel" @click="centerDialogVisible = false">取 消</span>
            </div>
          </div>
          <div v-if="j==3||j==4" class="bookInfo">
            <section class="tableBox">
              <el-table
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'50px', fontSize:'18px',borderRight:'none'}"
                empty-text="无数据"
                style="width: 690px; text-align:center;"
                :data="catalogingData"
                height="250"
                :row-style="{height:'50px'}"
              >
                <el-table-column align="center" prop="name" label="正题名" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" prop="isbn" label="ISBN" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" prop="author" label="编著者" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" prop="fkPressName" label="出版社" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" prop="fkTypeCode" label="分类号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" prop="publishingTime" label="卷宗号" :show-overflow-tooltip="true"></el-table-column>
                <el-table-column align="center" label="操作">
                  <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
                  <template slot-scope="scope">
                    <span class="blue" @click="decideOn(scope.$index, scope.row)">选中</span>
                  </template>
                </el-table-column>
              </el-table>
            </section>
            <div style="width: 200px;margin: 20px auto 0px" id="decideShow">
              <span class="dialogButton cancel" @click="decideOut" style="width: 200px">取消</span>
            </div>
          </div>
        </el-dialog>
      </div>
      <!--分类号，出版社树结构弹窗-->

      <a v-show="false" href="" download="" ref="excel" id="excel" >
        下载
      </a>
    </el-container>
  </div>
</template>

<script>
  import axios from "axios";
  import { catalog,deriveInt,uploadInt } from "@request/api/base.js";
  import moment from "moment";
  export default {
    data() {
      return {
        SuitBook: false,
        selectbookInfo: '',
        messageWidth: '',
        excelUrl: '',
        excelName: '',
        downloadLoading: false,
        /*====== 2.0表单搜索区域 ======*/
        messageName: '',//树弹框的名称
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
            beforeExpand: this.zTreeBeforeExpand,
            onDblClick: this.zTreeOnDblClick
          }
        }, //ztree树加载的配置
        zNodes: [], //ztree树的数据
        addForm: {
          isbn: '',
          name: '', //正题名
          viceName: '', //副题名
          clusterName: '',//丛编题名
          literatureType: '',//文献类别
          layout: '',//装订版面
          fkTypeCode: '',//分类号
          fkTypeName: '',//分类名
          author: '',//编著者
          fkPressName: '',//出版社
          publishingPleace: '',//出版地
          fkPressCode: '',//出版码
          publishingTime: '',//出版时间
          pageNumber: '',//页码
          openBook: '',//开本
          price: '',//价格
          language: '',//语种
          edition: '',//版次
          volumeNum: '',//卷册号
          appendix: '',//附件
          languageCode: '',
          annotations: '',//附注
          themeWord: '',//主题词
          renarks: '',//备注
          setBooks: 0,//套装书
        },
        rules: {
          isbn: [{required: true, message: "请输入ISBN查询相应书籍信息进行添加", trigger: "blur"}],
          searchNumber: [{required: true, message: '索书号不能为空', trigger: 'blur'}],
          name: [{required: true, message: '正题名不能为空', trigger: 'blur'}],
          author: [{required: true, message: '编著者不能为空', trigger: 'blur'}],
          languageCode: [{required: true, message: '常用语言不能为空', trigger: 'change'}],
          fkTypeCode: [{required: true, message: '分类号不能为空', trigger: 'change'}],
          fkTypeName: [{required: true, message: '分类名不能为空', trigger: 'change'}],
          fkPressName: [{required: true, message: '出版社不能为空', trigger: 'change'}],
          publishingPleace: [{required: true, message: '出版地不能为空', trigger: 'blur'}],
          price: [{required: true, message: '价格不能为空', trigger: 'blur'}],
        },
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        centerDialogVisible: false, // 删除弹框
        Dialogtitle: ["修改", "新增"],
        catalogtitle: ['批量删除', '导出', '导入', '本地数据', '远程数据'],
        i: null, // 切换弹框标题
        j: null,
        /*初始化 */
        options: [],
        tableLoading: true,
        total: 0,
        pageSize: 10,
        pageInput: 1,
        currentPage: 1,
        tableData: [],
        catalogingData: [],//编目数据
        id: '',
        tableChecked: [], // 全选绑定的数据
        type: [1, 2],//选择远程或本地的获取数据的按钮
        decideOnData: false,
        searchForm: {
          // 接受搜索表单的数据
          makeMethod: "",
          searchData: "",
          currentPage: 0
        },
        searchData: "",
        selectSearchForm: {
          name: "", //书名
          isbn: "", //isbn
          clusterName: "",//丛编题名
          currentPage: 0
        },
      };
    },
    computed: {
      searchTimeForm(){
        if (this.searchData) {
          switch (this.searchData / 1) {
            case 0:

              this.selectSearchForm.name = this.searchForm.searchData;
              break;
            case 1:

              this.selectSearchForm.isbn = this.searchForm.searchData;
              break;
            case 2:

              this.selectSearchForm.clusterName = this.searchForm.searchData
          }
        } else {

          this.selectSearchForm.name = "";
          this.selectSearchForm.isbn = "";
          this.selectSearchForm.clusterName = ""
        }
        let newData={
          isbn:this.selectSearchForm.isbn,
          name:this.selectSearchForm.name,
          clusterName:this.selectSearchForm.clusterName,
          pageSize: this.pageSize,
          currentPage: 1,
        }
        return newData
      },
      addFormData(){
        let newData=this.addForm
        return newData
      },
      editFormData(){
        let newData=this.addForm
        return newData
      }
    },
    methods: {
      SuitBookFun(val){
        if(val=false){
          this.addForm.setBooks=0
        }else{
          this.addForm.setBooks=1
        }
      },
      selectCheck(val) {
        this.searchForm.searchData=""
        for(const index in this.selectSearchForm){
          this.selectSearchForm[index]=""
        }
        this.searchData = val;
      },
      //获取图书信息弹窗的多选按钮
      BookInfoFun(value){

      },
      //选中某条数据的选中按钮
      decideOn(index,row){

        this.decideOnData=true
        this.addForm=row
        this.centerDialogVisible=false
      },
      //取消本地获取，获取远程数据
      decideOut(){
        this.centerDialogVisible=false
      },
      /*====== 出版社弹窗内容 ======*/
      publishTreeFun(){
        this.messageName='请选择出版社名称'
        this.zNodes.length=0
        this.freshArea(catalog.publishTree)
      },
      /*====== 书籍弹窗内容 ======*/
      typeTreeFun() {

        this.messageName = '请选择书籍类型'
        this.zNodes.length = 0
        this.freshArea(catalog.typeTree)
      },
      //树状结构初始化数据
      async freshArea(value) {
        let list=[]
        this.axios.get(value).then((response) => {
          if(response.data.state==true){
            for (let item of response.data.row) {
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
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        })
      },
      /*====== zTree保持展开单一路径的实现 ======*/
      zTreeBeforeExpand(treeId, treeNode) {
        this.singlePath(treeNode);
        return true;
      },
      singlePath(currNode) {
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
        for(var i = expandedNodes.length - 1; i >= 0; i--){
          var node = expandedNodes[i];
          var level = node.level;
          var id = node.id;
          if (cId != id && level == cLevel) {
            treeObj.expandNode(node, false);
          }
        }
      },
      /*====== ztree节点点击添加节点信息 ======*/
      zTreeOnClick(event, treeId, treeNode){
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        treeObj.expandNode(treeNode);
      },
      zTreeOnDblClick(event, treeId, treeNode){
        if(this.messageName=='请选择出版社名称'){
          if(treeNode.code!=null){
            this.addForm.fkPressName=treeNode.name
            this.addForm.fkPressCode=treeNode.code
            $('#typeMessage').fadeOut()
          }else{
            this.$message('请选择出版社');
          }
        }else{
          this.addForm.fkTypeName=treeNode.name
          this.addForm.fkTypeCode=treeNode.code
          $('#typeMessage').fadeOut()
        }
      },
      //关闭树弹框
      closeCheck() {
        $('#typeMessage').fadeOut()
      },
      //筛选搜索
      selectCheck(val){
        this.searchData=val
      },
      //批量选择
      handleSelectionChange(val) {
        this.tableChecked = val;
      },
      //导出按钮
      deriveBtn(){
        this.diriveApi()
        /* this.j=1
        this.messageWidth='500px'
        this.centerDialogVisible=true */
      },
      //删除按钮
      drawbackBtn(){
        if(this.tableChecked.length){
          this.j=0
          this.messageWidth='400px'
          this.centerDialogVisible=true
        } else {
          this.$message({
            message: '请先选择删除对象',
            duration:2000,
            type: 'error'
          });
      //    this.$message.error('请先选择删除对象')
        }
      },
      //新增按钮
      rechargeBtn(){
        this.type=[1,2]
        this.i=1
        this.dialogFormVisible=true
        this.languageFun()
      },
      //语种下拉框数据
      languageFun(){
        this.axios.get(catalog.language).then((res)=>{
          if(res.data.state==true){
            this.options.length=0
            for(const item of res.data.row){
              this.options.push({label:item.language,value:item.languageCode})
            }
          }
        })
      },
      //添加isbn数据搜索
      isbnData(){
        let typeIndex
        for(const item of this.type){
          typeIndex=item
        }
        if(this.addForm.isbn){
          if(this.type.length===1){
            if(typeIndex===1){
              this.localCatalogData()
            }else if(typeIndex===2){
              this.remoteCatalogData()
            }
          }else if(this.type.length===2){
            this.localCatalogData()
            if(this.catalogingData.length==0){
              this.remoteCatalogData()
            }
          }else{
            this.$message({
              message: '请先选择远程获取或本地获取',
              type: "error"
            });
          }
        }
      },
      //本地数据
      localCatalogData(){
        this.axios.get(catalog.localCataloging,{params:{isbn:this.addForm.isbn}}).then((res)=>{
          if(res.data.state==true){
            if(res.data.row.length>1){
              this.catalogingData = res.data.row
              this.j=3
              this.messageWidth='750px'
              this.centerDialogVisible=true
            }else if(res.data.row.length==1){
              this.addForm = res.data.row[0]
            }else if(res.data.row.length==0){
              return
            }
          }
        },(err)=>{
          this.$message({
            message: '网络出错',
            type: "error"
          });
        })
      },
      //远程数据
      remoteCatalogData(){
        this.axios.get(catalog.remoteCataloging,{params:{selectisbn:this.addForm.isbn}}).then((res)=>{
          if(res.data.state==true){
            if(res.data.row.length>1){
              this.catalogingData = res.data.row
              this.j=4
              this.messageWidth='750px'
              this.centerDialogVisible=true
            }else if(res.data.row.length==1){
              this.addForm = res.data.row[0]
            }else if(res.data.row==null){
              return
            }
          }
        },(err)=>{
          this.$message({
            message: '网络出错',
            type: "error"
          });
        })
      },
      //修改弹框
      EditBtn(index,row){
        this.i=0
        this.addForm=row
        if(row.languageCode==='CN'){
          this.addForm.languageCode='汉语'
        }else if(row.languageCode==='EN'){
          this.addForm.languageCode='英语'
        }else if(row.languageCode==='FR'){
          this.addForm.languageCode='法语'
        }else if(row.languageCode==='DE'){
          this.addForm.languageCode='德语'
        }else if(row.languageCode==='ja'){
          this.addForm.languageCode='日语'
        }else if(row.languageCode==='ru'){
          this.addForm.languageCode='俄语'
        }
        this.languageFun()
        this.dialogFormVisible = true;
      },
      //添加弹窗确定按钮
      definiteCheck(){
        if(this.i==0){
          this.editApi(this.editFormData)
        }else if(this.i==1){
          this.addApi(this.addFormData)
        }
      },
      addApi(value){
        this.axios.post(catalog.add,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.closeForm()
            this.searchApi(this.searchTimeForm);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        },(err)=>{

        })
      },
      editApi(value){
        this.axios.post(catalog.edit,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.closeForm()
            this.searchApi(this.searchTimeForm);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      },
      //添加修改关闭按钮
      closeForm() { // 弹框关闭的时候执行 清空数据
        for (var i in this.addForm) {
          this.addForm[i] = "";
        }
        this.$refs[this.addForm].resetFields(); // 调用这个方法进行清除登陆状态 打开的时候再清理？
        this.dialogFormVisible=false
        this.searchApi(this.searchTimeForm)
        $('#typeMessage').fadeOut()
      },
      //添加弹窗取消按钮
      cancelCheck(){
        this.closeForm()
      },
      // 查询按钮
      searchBtn() {
        this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
        this.currentPage = 1;
      },
      //导入按钮
      tunnellingBtn(){
        this.$router.push({path:'/uploadBook'})
      },
      submitDialog(){
        let idData=[]
        for (var item of this.tableChecked) {
          idData.push(item.id)
        }
        this.axios.post(catalog.delete,{ids:idData}).then((res)=>{
          if (res.data.state == true){
            this.$message({
              message: '书目信息删除成功',
              type: "success"
            });
            this.centerDialogVisible=false
            this.searchApi(this.searchTimeForm);
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        })
      },
      // 分页按钮
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
      /*------ Api ------*/
      selectDreApi(val){
        axios.get(deriveInt.select,{
          params:value
        }).then((res)=>{

        })
      },
      diriveApi(val){
        this.downloadLoading = true
        axios.get(deriveInt.derive,{
          params:val
        }).then((res) =>{
          if(res.data.state == true){

            this.excelName = res.data.row.name
            this.excelUrl = uploadInt.showFile + '/' + res.data.row.value + '?fileName=' + res.data.row.name
           const a = document.getElementById('excel')

           a.setAttribute("href",this.excelUrl)
           a.setAttribute("download",this.excelName)
            a.click()
            this.downloadLoading = false
          }else{
            this.$message.error(res.data.msg)
            this.downloadLoading = false

          }
        })
      },
      searchApi(value) {
        //获取登录记录
        this.tableLoading = true;
        axios
          .get(catalog.select, {
            params: value
          })
          .then(res => {
            if (res.data.state === true) {
              if(res.data.rows){
                this.tableData = res.data.rows;
              } else{
                this.tableData = []
              }
               //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
              this.currentPage = 1; // 回到第一页显示
              this.tableLoading = false;
            } else {
              this.tableLoading = false;
            }
          })
          .catch(error => {
            this.$message.error(res.data.msg)
          });
      },
      paginationApi(value) {
        //获取登录记录
        this.tableLoading = true;
        axios
          .get(catalog.select, {
            params: value
          })
          .then(res => {
            if (res.data.state === true) {
              this.tableData = res.data.rows; //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
              this.tableLoading = false;
            } else {
              this.tableLoading = false;
            }
          })
          .catch(error => {
            this.$message.error(res.data.msg)
          });
      },
      current_change(currentPage) {
        //分页查询
        this.currentPage = currentPage; //点击第几页
        this.paginationForm.currentPage = currentPage;
        this.paginationApi(this.paginationForm); // 这里的分页应该默认提交上次查询的条件
      }
    },
    created() {
      this.searchApi(this.searchTimeForm); // 调用查询接口获取数据
    }
  };
</script>

<style scoped>
  .searchButton{
    cursor: default;
    background-color: #0096FF;
    height:38px ;
    width: 70px;
    border-radius: 3px;
    position: absolute;
    left: 460px;
    top: 1px;
  }
  .searchButton:hover{
    background-color: rgba(0,150,255,0.8);
  }
  .edit {
    color: #00d7f0;
    cursor: pointer;
    margin-right: 20px;
    margin-left: 20px;
  }
  .ban {
    color: #ff5c3c;
    cursor: pointer;
  }
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
    margin-right:10px;
  }
  .buttonBox .add .addIcon {
    margin-right: 6px;
  }
  .buttonBox .delete {
    background: rgba(255, 92, 60, 1);
    border-radius: 10px;
    margin-right:10px;
  }
  .buttonBox .delete .deleteIcon {
    margin-right: 6px;
  }
  .buttonBox .blue {
    background: #31D6FF;
    border-radius: 10px;
  }
  .buttonBox .deongaree {
    background: #4D94FF;
    border-radius: 10px;
    margin-left: 10px;
  }
  .buttonBox .blue .blueIcon {
    margin-right: 6px;
  }
  .buttonBox .green {
    background: #01EECA;
    border-radius: 10px;
    margin-left: 10px;
  }
  .buttonBox .green .greenIcon {
    margin-right: 6px;
  }
  #Notice {
    background: #ffffff;
  }
  #Notice .searchBox{
    display: flex;
    justify-content: space-between;
  }
  .page_div {
    text-align: center;
    margin-top: 30px;
  }
  .commonMode .searchBox  .el-input .el-input__inner {
    text-align: left;
  }
  .confirm_bt {
    display: inline-block;
    text-align: center;
    width: 70px;
    padding: 8px 8px;
  }
  .gray_radio_border{
    border: 1px solid #DCDCDC;
    width:100%;
    border-radius: 5px;
    padding:10px 20px
  }
  .button_s {
    width: 90px;
    font-size: 16px;
    text-align: center;
  }

  #loginrecord {
    background: #ffffff;
  }

  .time_p {
    margin-left: 30px;
  }

  /*.el-select-dropdown__item {*/
  /*color: #878787;*/
  /*}*/
  .blue{
    color: #4d94ff;
    cursor: pointer;
  }
  #title {
    display: inline-block;
    padding-left: 10px;
    border-left: 5px solid #1e9eff;
    color: #878787;
  }
  #bookInfo .el-table th{
    background-color: #0096FF;
  }
  #loginrecord .el-table {
    border: 1px solid #eaeaea;
    /*border-width: 0 1px 1px 1px ;*/
    border-bottom: 0;
  }
  #isbnSearch{
    width: 25px;
    width:25px;
    margin-left:25px;
    margin-top: 7px
  }
  #typeMessage{
    display: none;
    position: absolute;
    top: 100px;
    z-index: 30000;
    border-radius: 20px;
    filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
    -moz-box-shadow: 2px 2px 10px #909090;
    -webkit-box-shadow: 2px 2px 10px #909090;
    box-shadow:5px 5px 30px #909090;
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
  }
</style>
