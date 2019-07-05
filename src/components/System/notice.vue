<template>
  <div id="Notice">
    <el-container>
      <div  style="width:100%">
        <div class="sonTitle">
          <span class="titleName">公告管理</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <div class="left buttonBox">
            <button @click="addBtn" class="add"><i class="addIcon el-icon-plus"></i>添加</button>
          </div>
          <div class="right">
            <el-form :inline="true" :model="searchForm">
              <el-form-item label="阅读权限:">
                <el-select style="width: 200px" clearable v-model="searchForm.name" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="180" label="发布时间:">
                <el-date-picker
                  v-model="searchForm.beginTime"
                  type="date"
                  style="width: 200px"
                  placeholder="开始日期"
                  :picker-options="pickerOptions0"
                ></el-date-picker>
                <el-date-picker
                  v-model="searchForm.endTime"
                  type="date"
                  style="width: 200px"
                  placeholder="结束日期"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
        </section>
        <!-- 3.0表格数据 -->
        <section class="tableBox" v-loading="tableLoading">
          <el-table
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'14px',borderRight:'none'}"
            empty-text="无数据"
            border
            style="width: 100%; text-align:center;"
            :data="tableData"
            :row-style="{height:'60px'}"
          >
            <el-table-column align="center" prop="index" type="index" width="100" label="序号" fixed="left">
              <template slot-scope="scope">
                <span>{{(currentPage - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>

            <el-table-column width="180" align="center" prop="createTime" label="发布时间"></el-table-column>
            <el-table-column align="center" width="150" prop="username" label="作者"></el-table-column>
            <el-table-column align="center" width="150" prop="disabled" label="状态">
              <template slot-scope="scope">
                  <span>{{scope.row.disabled ===0?'启用':'禁用'}}</span>
              </template>
            </el-table-column>
            <el-table-column width="150" align="center" prop="power" label="阅读权限">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" align="center" prop="title" label="标题" width="800">
              <template slot-scope="scope">
                  <p class="textLeft">{{scope.row.title}}</p>
              </template>
              <!-- <template slot-scope="scope">
                  <p @click="jumpArticle(scope.row.id)" class="textLeft">{{scope.row.title}}</p>
              </template> -->
            </el-table-column>
            <!-- 自定义插槽 -->
            <el-table-column width="300" align="center" prop="state" label="操作" fixed="right">
              <template slot-scope="scope">
                <span  class="operate editColor" @click="editBtn(scope.$index, scope.row)">编辑</span>
                <span  class="operate deleteColor" @click="deleteBtn(scope.$index, scope.row)">删除</span>
                <span  class="operate cancelColor" @click="cancelBtn(scope.$index, scope.row)">
                  {{scope.row.disabled ===0?'撤销':'取消撤销'}}
                </span>
                <span  class="operate apexColor" @click="apexBtn(scope.$index, scope.row)">
                  {{scope.row.state ===0?'置顶':'取消置顶'}}
                  </span>
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
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { editorInt } from "@request/api/base.js";

export default {
  data() {
    return {
      /*====== 2.0表单搜索区域 ======*/
      searchForm: {
        // 接受搜索表单的数据
        name: "",
        beginTime: "",
        endTime: "",

      },
      /*初始化 */
      options: [
        {
          value: "0",
          label: "管理员&读者"
        },
        {
          value: "1",
          label: "管理员"
        },
        {
          value: "2",
          label: "读者"
        }
      ],
      /*日期禁用规则 */
      pickerOptions: {
        // 双重绑定限制规则
        disabledDate(date) {
          const maxDate = Date.now();
          const time = date.getTime();
          return time > maxDate;
        }
      },
      pickerOptions0: {
        disabledDate: time => {
          if (this.searchForm.endTime) {
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.searchForm.endTime
            );
          } else {
            return time.getTime() > Date.now();
          }
        }
      },
      pickerOptions1: {
        disabledDate: time => {
          return (
            time.getTime() < this.searchForm.beginTime ||
            time.getTime() > Date.now()
          );
        }
      },

      tableLoading: true,
      currentPage: 1,
      pageInput: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
    };
  },
  computed: {
    searchTimeForm() {
      // 计算属性 真正传递的数据
      let searchForm = {
        pageSize: this.pageSize,
        currentPage: 1,
        category:this.searchForm.name,
        beginTime: !this.searchForm.beginTime
          ? null
          : moment(this.searchForm.beginTime).format("YYYY-MM-DD"), //开始时间
        endTime: !this.searchForm.endTime
          ? null
          : moment(this.searchForm.endTime).format("YYYY-MM-DD") //结束时间
      };
      return searchForm;
    },
    // 判定提示语

    cancelTimeForm(){

    }
  },
  methods: {
    // 新增按钮
    addBtn() {
        this.$router.push({path:'/publisher'})
    },
    // 删除按钮
    deleteBtn(index,row) {
      let id = row.id
      let obj ={
        deleteParams:[{
          id:id
        }]
      }

      this.deleteApi(obj)
    },
    // 编辑按钮
    editBtn(index,row) {
      let id = row.id
      this.$router.push({path:`/editor/${id}`})
      console.log('这个信息是',row)
    },
    // 查询按钮
    searchBtn() {
      this.searchApi(this.searchTimeForm); // 查询后 把新数据保存到分页表单中
      this.currentPage = 1;
    },
    // 撤销按钮
    cancelBtn(index,row){
      console.log('是撤销还是取消撤销',row.disabled)
      this.id = row.id
      console.log('这个数据表是',row)
      if(row.disabled==0){
        this.revokeApi(row.id)
      }else if(row.disabled==1){
        this.cancelRevokeApi(row.id)
      }
    },
    // 置顶按钮
    apexBtn(index,row){
      console.log('置顶按钮的数据',row)
      if(row.state==0){
        this.placeApi(row.id)
      }else if(row.state==1){
        this.cancelPlaceApi(row.id)
      }
    },

    // 跳转按钮
    jumpArticle(id){
      this.$router.push({path:`/article/${id}`})
      console.log(id)
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
        .get(editorInt.select, {
          params: value
        })
        .then(res => {
          console.log("文章数据", res.data);
          if (res.data.state === true) {
            for(let item of res.data.row){
              if(item.category == 0){
                item.power = '管理员&读者'
              }
              if(item.category == 1){
                item.power = '管理员'
              }
              if(item.category == 2){
                item.power = '读者'
              }
            }
            this.tableData = res.data.row; //获取返回数据
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
            this.currentPage = 1; // 回到第一页显示
            this.tableLoading = false;
            console.log('列表',this.tableData)
          } else {
            this.$message.error(res.data.msg);
            this.tableLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteApi(value){
      axios({
        url:editorInt.delete,
        method:'delete',
        data:value
      }).then((res) =>{
        if(res.data.state == true){
          this.$message.success('删除成功')
          this.searchApi(this.searchTimeForm)
        } else{
          this.$message.error(res.data.msg)
        }
      })
    },
    revokeApi(value){
      this.axios.put(editorInt.revoke,{id:value}).then((res)=>{
        console.log('撤销公告返回的结果',res)
        if(res.data.state == true){
          this.$message.success('修改公告成功')
          this.searchApi(this.searchTimeForm)
        } else{
          this.$message.error(res.data.msg)
        }
      })
    },
    cancelRevokeApi(value){
      axios({
        url:editorInt.cancelRevoke,
        method:'put',
        headers:{'Content-Type':'application/json'},
        data:{id:value}
      }).then((res)=>{
        if(res.data.state == true){
          this.$message.success('修改公告成功')
          this.searchApi(this.searchTimeForm)
        } else{
          this.$message.error(res.data.msg)
        }
        console.log(res)
      })
    },
    placeApi(value){
      this.axios.put(editorInt.place,{id:value}).then((res)=>{
        if(res.data.state == true){
          this.$message.success(res.data.msg)
          this.searchApi(this.searchTimeForm)
        } else{
          this.$message.error(res.data.msg)
        }
      })
    },
    cancelPlaceApi(value){
      this.axios.put(editorInt.cancelPlace,{id:value}).then((res)=>{
        if(res.data.state == true){
          this.$message.success(res.data.msg)
          this.searchApi(this.searchTimeForm)
        } else{
          this.$message.error(res.data.msg)
        }
      })
    },
    paginationApi(value) {
      //获取登录记录
      console.log(value);
      this.tableLoading = true;
      axios
        .get(editorInt.select, {
          params: value
        })
        .then(res => {
          console.log("文章数据", res.data);
          if (res.data.state === true) {
            for(let item of res.data.row){
              if(item.category == 0){
                item.power = '管理员&读者'
              }
              if(item.category == 1){
                item.power = '管理员'
              }
              if(item.category == 2){
                item.power = '读者'
              }
            }
            this.tableData = res.data.row; //获取返回数据
            this.total = res.data.total; //总条目数
            this.paginationForm = Object.assign({}, value); // 保存上次的查询结果
            this.tableLoading = false;
            console.log('列表',this.tableData)
          } else {
            this.$message.error(res.data.msg);
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
#Notice {
  background: #ffffff;
  padding: 30px;
}
#Notice .searchBox{
    display: flex;
    justify-content: space-between;
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
.operate{
  cursor: pointer;
}
.textLeft{
  text-align: left;
}
/* .textLeft:hover{
  color: #1e9eff;
  cursor: pointer;
} */
#title {
  display: inline-block;
  padding-left: 10px;
  border-left: 5px solid #1e9eff;
  color: #878787;
}

#loginrecord .el-table {
  border: 1px solid #eaeaea;
  /*border-width: 0 1px 1px 1px ;*/
  border-bottom: 0;
}
.buttonBox .add {
    background: rgba(255, 146, 49, 1);
    border-radius: 10px;
    margin-right: 30px;
}
.buttonBox .add .addIcon {
  margin-right: 6px;
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
</style>
