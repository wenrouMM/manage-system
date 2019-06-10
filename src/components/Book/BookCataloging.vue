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
              <i class="addIcon el-icon-plus"></i>新增
            </button>
            <button class="delete" @click="drawbackBtn(tableChecked)">
              <i class="deleteIcon el-icon-delete"></i>删除
            </button>
            <button class="blue" @click="deriveBtn">
              <i class="blueIcon el-icon-share"></i>导出
            </button>
            <button class="green" @click="tunnellingBtn">
              <i class="el-icon-edit greenIcon"></i>批量导入
            </button>
          </div>
          <div class="right">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="ISBN :">
                <el-input v-model="searchForm.isbn" placeholder="请输入ISBN查询" clearable style="width: 200px;position: relative"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
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
            <el-table-column align="center" prop="name" label="正题名" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="isbn" label="ISBN" width="300" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span>{{scope.row.isbn == null || scope.row.isbn=='' ?'---':scope.row.isbn}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="author" label="编著者" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkTypeCode" label="分类号" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkTypeName" label="分类名" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="fkPressName" label="出版社" width="200" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column align="center" prop="publishingTime" label="出版时间" width="200" :show-overflow-tooltip="true"></el-table-column>
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
      <div class="addEditDialog">
        <!-- Form -->
        <el-dialog @close="closeForm" width="1000px" :title="Dialogtitle[i]" :visible.sync="dialogFormVisible">
          <div v-if="i==1" style="width: 940px">
            <el-form id="book_cataloging" :rules="rules" :model="addForm" :ref="addForm" style="">
              <div style="display: flex;flex-direction: column;width: 100%">
                <div>
                  <div class="flexLayout" id="catalogingInput1" style="width: 450px;position: relative">
                    <el-form-item label=" I S B N :" prop="isbn" label-width="90px" >
                      <el-input v-model="addForm.isbn" placeholder="请输入ISBN搜索相关数据进行添加" id="isbnInput"></el-input>
                    </el-form-item>
                    <p class="searchButton" @click="isbnData">
                      <img src="../../base/img/currency/ssbs.png" id="isbnSearch">
                    </p>
                  </div>
                  <div style="margin: 0 auto 25px;width: 600px">
                    <el-checkbox-group v-model="type" class="flexLayout" @change="BookInfoFun(type)">
                      <el-checkbox :label="1" name="type">本地获取数据</el-checkbox>
                      <el-checkbox :label="2" name="type">远程获取数据</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
                <div id="noError">
                  <div id="catalogingInput2">
                    <div class="flexLayout">
                      <el-form-item label=" 正 题 名 :" prop="name" label-width="95px" style="">
                        <el-input v-model="addForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label=" 副 题 名 :" label-width="90px" style="">
                        <el-input v-model="addForm.viceName "></el-input>
                      </el-form-item>
                    </div>
                    <div class="flexLayout">
                      <el-form-item label=" 编 著 者 :" prop="author" label-width="95px" style="">
                        <el-input v-model="addForm.author "></el-input>
                      </el-form-item>
                      <el-form-item label=" 丛编题名 :" label-width="95px" style="">
                        <el-input v-model="addForm.clusterName"></el-input>
                      </el-form-item>
                    </div>
                    <div  class="flexLayout">
                      <el-form-item label=" 索 书 号 :" prop="searchNumber" label-width="95px"  class="mediumInput">
                        <el-input v-model="addForm.searchNumber "></el-input>
                      </el-form-item>
                      <el-form-item label=" 常用语种 :" prop="languageCode" label-width="95px"  class="mediumInput">
                        <el-select v-model="addForm.languageCode" clearable placeholder="请选择">
                          <el-option
                            v-for="item in options"
                            :key="item.index"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                    <div class="flexLayout" id="catalogingInput3">
                      <el-form-item label=" 分 类 号 :" prop="fkTypeCode" label-width="95px" class="smaillInput">
                        <div class="flexLayout">
                          <el-input v-model="addForm.fkTypeCode"></el-input>
                          <p class="searchButton" style="width: 50px;left: 180px" @click="typeTreeFun">
                            <img src="../../base/img/currency/ssbs.png" style="width:20px;height:20px;margin-left: 15px;margin-top: 10px">
                          </p>
                        </div>
                      </el-form-item>
                      <el-form-item label=" 分 类 名 :" prop="fkTypeName" label-width="90px"  class="bigInput" style="margin-left: 40px">
                        <el-input v-model="addForm.fkTypeName "></el-input>
                      </el-form-item>
                    </div>
                    <div id="catalogingInput4" class="flexLayout">
                      <el-form-item label=" 出 版 社 :" prop="fkPressName" label-width="95px" class="smaillInput">
                        <div class="flexLayout">
                          <el-input v-model="addForm.fkPressName"></el-input>
                          <p class="searchButton" style="width: 50px;left: 180px" @click="publishTreeFun">
                            <img src="../../base/img/currency/ssbs.png" style="width:20px;height:20px;margin-left: 15px;margin-top: 10px">
                          </p>
                        </div>
                      </el-form-item>
                      <el-form-item label=" 出 版 地 :" label-width="90px" style="margin-left: 60px">
                        <el-input v-model="addForm.publishingPleace "></el-input>
                      </el-form-item>
                      <el-form-item label=" 出版日期 :" label-width="95px">
                        <el-input v-model="addForm.publishingTime "></el-input>
                      </el-form-item>
                    </div>
                    <div class="flexLayout" id="catalogingInput5">
                      <el-form-item label=" 页　　码 :" label-width="95px">
                        <el-input v-model="addForm.pageNumber"></el-input>
                      </el-form-item>
                      <el-form-item label=" 开　　本 :" label-width="95px">
                        <el-input v-model="addForm.openBook "></el-input>
                      </el-form-item>
                      <el-form-item label=" 价　　格 :" prop="price" label-width="95px">
                        <el-input v-model="addForm.price "></el-input>
                      </el-form-item>
                    </div>
                    <div class="flexLayout">
                      <el-form-item label=" 附　　注 :" label-width="95px">
                        <el-input v-model="addForm.annotations "></el-input>
                      </el-form-item>
                      <el-form-item label=" 主 题 词 :" label-width="95px">
                        <el-input v-model="addForm.themeWord "></el-input>
                      </el-form-item>
                    </div>
                    <div>
                      <el-form-item label=" 备　　注 :" style="width: 950px;margin-left: 20px">
                        <el-input type="textarea" v-model="addForm.renarks" style="width: 845px;" :autosize="{ minRows: 5, maxRows: 5}" resize="none"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
                <div style="width: 400px;margin:20px auto 0px" class="flexLayout">
                  <el-button type="primary" @click="definiteCheck">确定</el-button>
                  <el-button type="info" style="margin-left: 55px" @click="cancelCheck">取消</el-button>
                </div>
              </div>
            </el-form>
          </div>
          <div v-if="i==0" style="width: 940px">
            <el-form :rules="rules" :model="addForm" :ref="addForm" id="catalogingEdit">
              <div style="width: 940px" >
                <div class="flexLayout" id="editCatalogInput1">
                  <el-form-item label=" I S B N :" prop="isbn" label-width="90px" >
                    <el-input v-model="addForm.isbn"></el-input>
                  </el-form-item>
                  <el-form-item label=" 正 题 名 :" prop="name" label-width="95px">
                    <el-input v-model="addForm.name"></el-input>
                  </el-form-item>
                  <el-form-item label=" 副 题 名 :" label-width="90px">
                    <el-input v-model="addForm.viceName "></el-input>
                  </el-form-item>
                </div>
                <div class="flexLayout" id="editCatalogInput2">
                  <el-form-item label=" 编 著 者 :" prop="author" label-width="95px">
                    <el-input v-model="addForm.author "></el-input>
                  </el-form-item>
                  <el-form-item label=" 丛编题名 :" label-width="95px">
                    <el-input v-model="addForm.clusterName"></el-input>
                  </el-form-item>
                </div>
                <div  class="flexLayout" id="editCatalogInput3">
                  <el-form-item label=" 索 书 号 :" prop="searchNumber" label-width="95px"  class="mediumInput">
                    <el-input v-model="addForm.searchNumber "></el-input>
                  </el-form-item>
                  <el-form-item label=" 常用语种 :" prop="languageCode" label-width="95px"  class="mediumInput">
                    <el-select v-model="addForm.languageCode" clearable placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.index"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flexLayout" id="editCatalogInput4">
                  <el-form-item label=" 分 类 号 :" prop="fkTypeCode" label-width="95px" class="smaillInput">
                    <div class="flexLayout">
                      <el-input v-model="addForm.fkTypeCode"></el-input>
                      <p class="searchButton" style="width: 50px;left: 180px" @click="typeTreeFun">
                        <img src="../../base/img/currency/ssbs.png" style="width:20px;height:20px;margin-left: 15px;margin-top: 10px">
                      </p>
                    </div>
                  </el-form-item>
                  <el-form-item label=" 分 类 名 :" prop="fkTypeName" label-width="90px"  class="bigInput" style="margin-left: 40px">
                    <el-input v-model="addForm.fkTypeName " ></el-input>
                  </el-form-item>
                </div>
                <div class="flexLayout" id="editCatalogInput5">
                  <el-form-item label=" 出 版 社 :" prop="fkPressName" label-width="95px" class="smaillInput">
                    <div class="flexLayout">
                      <el-input v-model="addForm.fkPressName"></el-input>
                      <p class="searchButton" style="width: 50px;left: 180px" @click="publishTreeFun">
                        <img src="../../base/img/currency/ssbs.png" style="width:20px;height:20px;margin-left: 15px;margin-top: 10px">
                      </p>
                    </div>
                  </el-form-item>
                  <el-form-item label=" 出 版 地 :" label-width="90px" style="margin-left: 45px">
                    <el-input v-model="addForm.publishingPleace "></el-input>
                  </el-form-item>
                  <el-form-item label=" 出版日期 :" label-width="95px">
                    <el-input v-model="addForm.publishingTime "></el-input>
                  </el-form-item>
                </div>
                <div class="flexLayout" id="editCatalogInput6">
                  <el-form-item label=" 页　　码 :" label-width="95px">
                    <el-input v-model="addForm.pageNumber"></el-input>
                  </el-form-item>
                  <el-form-item label=" 开　　本 :" label-width="95px">
                    <el-input v-model="addForm.openBook "></el-input>
                  </el-form-item>
                  <el-form-item label=" 价　　格 :" prop="price" label-width="95px">
                    <el-input v-model="addForm.price "></el-input>
                  </el-form-item>
                </div>
                <div class="flexLayout" id="editCatalogInput7">
                  <el-form-item label=" 附　　注 :" label-width="95px">
                    <el-input v-model="addForm.annotations "></el-input>
                  </el-form-item>
                  <el-form-item label=" 主 题 词 :" label-width="95px">
                    <el-input v-model="addForm.themeWord "></el-input>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label=" 备　　注 :" style="width: 950px;margin-left: 20px">
                    <el-input type="textarea" v-model="addForm.renarks" style="width: 845px;" :autosize="{ minRows: 5, maxRows: 5}" resize="none"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div style="width: 400px;margin:20px auto 0px" class="flexLayout">
                <el-button type="primary" @click="EditdefiniteCheck">确定</el-button>
                <el-button type="info" style="margin-left: 55px" @click="EditcancelCheck">取消</el-button>
              </div>
            </el-form>
          </div>
        </el-dialog>
      </div>
      <!--'调馆','删除','启用','报损'弹框-->
      <div class="forbid" id="catalogingMessage">
        <el-dialog :title="catalogtitle[j]" :visible.sync="centerDialogVisible" @close="closeHarm" :width="messageWidth" center>
          <div v-if="j==0||j==1||j==2">
            <div class="dialogBody" style="margin-left: -30px;margin-bottom: 20px">
              是否{{catalogtitle[j]}}?
            </div>
            <div slot="footer">
              <span class="dialogButton true mr_40" @click="submitDialog">确 定</span>
              <span class="dialogButton cancel" @click="centerDialogVisible = false">取消</span>
            </div>
          </div>
          <div v-if="j==3||j==4" class="bookInfo">
            <section class="tableBox">
              <el-table
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'50px', fontSize:'18px',borderRight:'none'}"
                empty-text="无数据"
                style="width: 750px; text-align:center;"
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
            <div style="width: 200px;margin: 20px auto" id="decideShow">
              <span class="dialogButton cancel" @click="decideOut" style="width: 200px">取消</span>
            </div>
          </div>
        </el-dialog>
      </div>
      <!--分类号，出版社树结构弹窗-->
      <div id="typeMessage" >
        <div style="position: relative">
          <p>{{messageName}}</p>
          <img src="../../base/img/menu/xx.png" style="position: absolute;top: 10px;left: 340px;width: 30px;height: 30px" @click="closeCheck">
        </div>
        <div>
          <ul id="treeDemo" class="ztree"></ul>
        </div>
      </div>
    </el-container>
  </div>
</template>

<script>
  import axios from "axios";
  import { catalog } from "@request/api/base.js";
  import moment from "moment";
  export default {
    data() {
      return {
        selectbookInfo:'',
        messageWidth:'',
        /*====== 2.0表单搜索区域 ======*/
        messageName:'',//树弹框的名称
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
          }
        }, //ztree树加载的配置
        zNodes: [], //ztree树的数据
        addForm:{
          isbn:'',
          name:'', //正题名
          viceName:'', //副题名
          clusterName:'',//丛编题名
          searchNumber:'',//索书号
          fkTypeCode:'',//分类号
          fkTypeName:'',//分类名
          author:'',//编著者
          fkPressName:'',//出版社
          publishingPleace:'',//出版地
          fkPressCode:'',//出版码
          publishingTime:'',//出版时间
          pageNumber:'',//页码
          openBook:'',//开本
          price:'',//价格
          language:'',//语种
          languageCode:'',
          annotations:'',//附注
          themeWord:'',//主题词
          renarks:'',//备注
        },
        rules:{
          isbn:[{ required: true, message: "请输入ISBN查询相应书籍信息进行添加", trigger: "blur" }],
          searchNumber:[{required:true,message:'索书号不能为空',trigger:'blur'}],
          name:[{required:true,message:'正题名不能为空',trigger:'blur'}],
          author:[{required:true,message:'编著者不能为空',trigger:'blur'}],
          languageCode:[{required:true,message:'常用语言不能为空',trigger:'change'}],
          fkTypeCode:[{required:true,message:'分类号不能为空',trigger:'change'}],
          fkTypeName:[{required:true,message:'分类名不能为空',trigger:'change'}],
          fkPressName:[{required:true,message:'出版社不能为空',trigger:'change'}],
          publishingPleace:[{required:true,message:'出版地不能为空',trigger:'blur'}],
          price:[{required:true,message:'价格不能为空',trigger:'blur'}],
        },
        dialogFormVisible: false, // // 新增修改弹框的展示和消失
        centerDialogVisible: false, // 删除弹框
        Dialogtitle: ["修改", "新增"],
        catalogtitle:['删除','导出','导入','若列表中没有合适的数据，请点击“取消”按钮进行远程获取','远程数据'],
        i: null, // 切换弹框标题
        j:null,
        searchForm: {
          // 接受搜索表单的数据
          isbn:"",
        },
        /*初始化 */
        options: [],
        tableLoading: true,
        total: 0,
        pageSize: 10,
        pageInput: 1,
        currentPage: 1,
        tableData: [],
        catalogingData:[],//编目数据
        id:'',
        tableChecked: [], // 全选绑定的数据
        type:[]//选择远程或本地的获取数据的按钮
      };
    },
    computed: {
      searchTimeForm(){
        let newData={
          isbn:this.searchForm.isbn,
          pageSize: this.pageSize,
          currentPage: 1,
        }
        console.log('搜索数据',newData)
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
      closeHarm(){
        console.log('关闭损坏的弹窗')
        this.type=[]
      },
      //获取图书信息弹窗的多选按钮
      BookInfoFun(value){
        console.log('获取图书信息',value)
        console.log('isbn的值',this.addForm.isbn)
        if(this.addForm.isbn){
          if(value==1){
            $('#decideShow').show()
            this.j=3
            this.messageWidth='800px'
            this.centerDialogVisible=true
            this.axios.get(catalog.localCataloging,{params:{isbn:this.addForm.isbn}}).then((res)=>{
              console.log('isbn的数据',res)
              if(res.data.state==true){
                this.catalogingData=res.data.row
              }else{
                this.$message({
                  message: '没有ISBN查询无法获取本地数据',
                  type: "error"
                });
                this.catalogingData=res.data.row
              }
            },(err)=>{
              console.log('err',err)
              this.catalogingData=[]
              this.$message({
                message: '网络出错',
                type: "error"
              });
            })
          }else if(value==2){
            $('#decideShow').hide()
            this.j=4
            this.centerDialogVisible=true
            this.messageWidth='800px'
            this.axios.get(catalog.remoteCataloging,{params:{selectisbn:this.addForm.isbn}}).then((res)=>{
              console.log('远程编目的数据',res)
              if(res.data.state==true){
                this.catalogingData=res.data.row
              }else{
                this.$message({
                  message: '没有ISBN查询无法获取远程数据',
                  type: "error"
                });
                this.catalogingData=res.data.rows
              }
            },(err)=>{
              console.log('err',err)
              this.$message({
                message: '网络出错',
                type: "error"
              });
            })
          }
        }else{
          this.$message({
            message: '请先输入搜索相应ISBN获取数据',
            type: "error"
          });
        }
      },
      //选中某条数据的选中按钮
      decideOn(index,row){
        console.log('选中的数据',row)
        this.addForm=row
        this.centerDialogVisible=false
      },
      //取消本地获取，获取远程数据
      decideOut(){
        $('#decideShow').hide()
        this.type=[2]
        this.j=4
        this.centerDialogVisible=true
        this.messageWidth='800px'
        this.axios.get(catalog.remoteCataloging,{params:{selectisbn:this.addForm.isbn}}).then((res)=>{
          console.log('远程编目的数据',res)
          if(res.data.state==true){
            this.catalogingData=res.data.row
          }else{
            this.$message({
              message: '没有ISBN查询无法获取远程数据',
              type: "error"
            });
            this.catalogingData=res.data.rows
          }
        },(err)=>{
          console.log('err',err)
          this.$message({
            message: '网络出错',
            type: "error"
          });
        })
      },
      /*====== 出版社弹窗内容 ======*/
      publishTreeFun(){
        this.messageName='请选择出版社名称'
        this.zNodes.length=0
        this.freshArea(catalog.publishTree)
      },
      /*====== 书籍弹窗内容 ======*/
      typeTreeFun() {
        console.log('书籍树状图')
        this.messageName = '请选择书籍类型'
        this.zNodes.length = 0
        this.freshArea(catalog.typeTree)
      },
      //树状结构初始化数据
      async freshArea(value) {
        let list=[]
        this.axios.get(value).then((response) => {
          console.log('树结构的数据',response)
          if(response.data.state==true){
            for (let item of response.data.row) {
              //console.log('ztree树',item)
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
      /*====== ztree节点点击添加节点信息 ======*/
      zTreeOnClick(event, treeId, treeNode){
        if(this.messageName=='请选择出版社名称'){
          if(treeNode.code!=null){
            console.log(treeNode)
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
        console.log('val',val)
        this.searchData=val
      },
      //批量选择
      handleSelectionChange(val) {
        console.log('全选按钮之后的数据',val);
        this.tableChecked = val;
      },
      //导出按钮
      deriveBtn(){
        this.j=1
        this.messageWidth='500px'
        this.centerDialogVisible=true
      },
      //删除按钮
      drawbackBtn(){
        if(this.tableChecked.length){
          this.j=0
          this.messageWidth='500px'
          this.centerDialogVisible=true
        } else {
          this.$message.error('请先选择删除对象')
        }
      },
      //新增按钮
      rechargeBtn(){
        this.i=1
        this.dialogFormVisible=true
        this.languageFun()
      },
      //语种下拉框数据
      languageFun(){
        this.axios.get(catalog.language).then((res)=>{
          console.log('语种下拉框数据',res)
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
        this.type=[1,2]
        this.axios.get(catalog.localCataloging,{params:{isbn:this.addForm.isbn}}).then((res)=>{
          console.log('isbn的数据',res)
          if(res.data.state==true){
            this.j=3
            $('#decideShow').show()
            this.centerDialogVisible=true
            this.catalogingData=res.data.row
          }else{
            this.$message({
              message: '没有ISBN查询无法获取本地数据',
              type: "error"
            });
            this.centerDialogVisible=true
            this.catalogingData=res.data.row
          }
        },(err)=>{
          console.log('err',err)
          this.j=3
          this.centerDialogVisible=true
          this.$message({
            message: '网络出错',
            type: "error"
          });
          this.catalogingData=[]
        })
      },
      //修改弹框
      EditBtn(index,row){
        console.log('点击修改按钮获取的数据',row)
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
      // 修改添加弹框确定按钮
      submitForm() {
        console.log('defaultDateRent',this.addForm.defaultDateRent,'norForLoan',this.addForm.norForLoan)
        if(this.i==1){
          this.addApi(this.addFormData)
        }else if(this.i==0){
          this.editApi(this.editFormData)
        }
      },
      //添加弹窗确定按钮
      definiteCheck(){
        console.log('新增编目数据')
        this.addApi(this.addFormData)
      },
      //修改弹窗确定按钮
      EditdefiniteCheck(){
        this.editApi(this.editFormData)
      },
      addApi(value){
        this.axios.post(catalog.add,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.dialogFormVisible = false
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
      editApi(value){
        this.axios.post(catalog.edit,value).then((res)=>{
          if (res.data.state == true) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.dialogFormVisible = false
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
        this.$refs[this.addForm].resetFields(); // 调用这个方法进行清除登陆状态 打开的时候再清理？
        for (var i in this.addForm) {
          this.addForm[i] = "";
        }
        this.dialogFormVisible = false
        this.type=''
        this.searchApi(this.searchTimeForm)
        $('#typeMessage').fadeOut()
      },
      //添加弹窗取消按钮
      cancelCheck(){
        this.closeForm()
      },
      //修改弹窗的取消按钮
      EditcancelCheck(){
        this.closeForm()
      },
      // 查询按钮
      searchBtn() {
        this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
        this.currentPage = 1;
      },
      //导入按钮
      tunnellingBtn(){
        this.j=2
        this.messageWidth='500px'
        this.centerDialogVisible=true
      },
      submitDialog(){
        let idData=[]
        for (var item of this.tableChecked) {
          console.log('删除id',item.id);
          idData.push(item.id)
        }
        this.axios.post(catalog.delete,{ids:idData}).then((res)=>{
          console.log('删除后返回的数据',res)
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
        console.log('数据类型检测',this.pageInput)
        let page = Math.ceil(this.total / this.pageSize)
        page ==0?1:page;
        if(this.pageInput>page || this.pageInput == ''|| this.pageInput<0){
          this.pageInput = 1
          this.$nextTick(()=>{
            this.$refs.text.value = 1 // hack方法
            console.log('Vmode绑定值',this.pageInput)
          })
        }else{
          this.pageInput = parseInt(this.pageInput)
          this.$refs.text.value = parseInt(this.pageInput)
          let num = parseInt(this.pageInput)
          this.current_change(num)
        }
      },
      /*------ Api ------*/
      searchApi(value) {
        //获取登录记录
        console.log(value);
        this.tableLoading = true;
        axios
          .get(catalog.select, {
            params: value
          })
          .then(res => {
            console.log("书籍编目", res);
            if (res.data.state === true) {
              this.tableData = res.data.rows; //获取返回数据
              this.total = res.data.total; //总条目数
              this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
              this.currentPage = 1; // 回到第一页显示
              this.tableLoading = false;
            } else {
              this.tableLoading = false;
            }
          })
          .catch(error => {
            console.log(error);
          });
      },
      paginationApi(value) {
        //获取登录记录
        console.log(value);
        this.tableLoading = true;
        axios
          .get(catalog.select, {
            params: value
          })
          .then(res => {
            console.log("书籍编目", res.data);
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
            console.log(error);
          });
      },
      current_change(currentPage) {
        //分页查询
        this.currentPage = currentPage; //点击第几页
        this.paginationForm.currentPage = currentPage;
        console.log("保存当前查询", this.paginationForm, this.currentPage);
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
    top: 170px;
    left:750px;
    z-index: 30000;

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
    filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
    -moz-box-shadow: 2px 2px 10px #909090;
    -webkit-box-shadow: 2px 2px 10px #909090;
    box-shadow:2px 2px 10px #909090;
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
    filter:progid:DXImageTransform.Microsoft.Shadow(color=#909090,direction=120,strength=4);
    -moz-box-shadow: 2px 2px 10px #909090;
    -webkit-box-shadow: 2px 2px 10px #909090;
    box-shadow:2px 2px 10px #909090;
  }
</style>
