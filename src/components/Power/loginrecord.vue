<template>
  <div id="loginrecord">
    <el-container>
      <div class="commonMode" style="width:100%">
        <div class="sonTitle">
          <span class="titleName">用户管理列表</span>
        </div>
        <!-- 2.0表单填写 -->
        <section class="searchBox">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="登录来源" size="160">
              <el-select v-model="searchForm.loginSource" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item size="130">
              <el-date-picker
                v-model="searchForm.beginTime"
                type="date"
                placeholder="开始日期"
                :picker-options="pickerOptions0"
              ></el-date-picker>
              <el-date-picker
                v-model="searchForm.endTime"
                type="date"
                placeholder="结束日期"
                :picker-options="pickerOptions1"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button_s" @click="submit_tv">搜索</el-button>
            </el-form-item>
          </el-form>
        </section>
        <!-- 3.0表格数据 -->
        <section class="tableBox">
          <el-table
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px', fontSize:'18px'}"
            empty-text="无数据"
            :data="tableData"
            :row-style="{height:'60px'}"
          >
            <el-table-column align="center" prop="index" label="序号"></el-table-column>
            <el-table-column align="center" prop="loginMessage" label="用户名称"></el-table-column>
            <el-table-column align="center" prop="loginIp" label="登录IP"></el-table-column>
            <el-table-column align="center" prop="loginAccount" label="登录账户"></el-table-column>
            <el-table-column align="center" prop="fkLoginName" label="登录来源"></el-table-column>
            <el-table-column align="center" prop="loginTime" label="登录时间"></el-table-column>
            <!-- 自定义插槽 -->
            <el-table-column align="center" prop="loginStatus" label="登录状态">
              <template slot-scope="scope">
                <span :class="{error: scope.row.loginStatus==='失败'}">{{scope.row.loginStatus}}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 4.0 分页 -->
          <section class="page_div">
            <el-pagination

              style="display: inline-block"
              background
              layout="prev, pager, next,total,jumper"
              :total="total"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="current_change"
            ></el-pagination>
          </section>
        </section>
      </div>
    </el-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import {login_record} from '../../request/api/base.js'

  export default {
    data () {
      return {
        /*====== 2.0表单搜索区域 ======*/
        searchForm: {
          // 接受搜索表单的数据
          loginSource: '全部',
          beginTime: '',
          endTime: '',
          currentPage: 0
        },
        /*初始化 */
        options: [
          {
            value: '全部',
            label: '全部'
          },
          {
            value: '0',
            label: '平台'
          },
          {
            value: '1',
            label: '设备'
          }
        ],
        /*日期禁用规则 */
        pickerOptions: {
          // 双重绑定限制规则
          disabledDate (date) {
            const maxDate = Date.now()
            const time = date.getTime()
            return time > maxDate
          }
        },
        pickerOptions0: {
          disabledDate: time => {
            if (this.searchForm.endTime) {
              return (
                time.getTime() > Date.now() || time.getTime() > this.searchForm.endTime
              )
            } else {
              return time.getTime() > Date.now()
            }
          }
        },
        pickerOptions1: {
          disabledDate: time => {
            return (
              time.getTime() < this.searchForm.beginTime || time.getTime() > Date.now()
            )
          }
        },
        loading: true, // 加载状态
        /*======3.0表格相关数据 ======*/
        tableData: [],
        tableLoading: true,
        /*======4.0分页器相关数据 ======*/
        /*初始化 */
        total: 0,
        pageSize: 7,
        currentPage: 1,
        // 提交的数据 用于保存查询的结果后查询分页
        paginationForm: {}
      }
    },
    computed: {
      searchTimeForm () {
        // 计算属性 真正传递的数据
        let searchForm = {
          pageSize: this.pageSize,
          currentPage: 1,
          fkLoginType: this.searchForm.loginSource === '全部' ? null : this.searchForm.loginSource,
          beginTime: !this.searchForm.beginTime ? null : moment(this.searchForm.beginTime).format('YYYY-MM-DD'), //开始时间
          endTime: !this.searchForm.endTime ? null : moment(this.searchForm.endTime).format('YYYY-MM-DD') //结束时间
        }
        return searchForm
      }
    },
    methods: {
      submit_tv () {
        //条件查询
        this.login_recod(this.searchTimeForm) // 查询后 把新数据保存到分页表单中
        this.currentPage = 1
      },
      login_recod (value) {
        //获取登录记录
        console.log(value)
        this.tableLoading = true
        axios
          .get(login_record, {
            params: value
          })
          .then(res => {
            console.log('登陆记录', res.data)
            if (res.data.state === true) {
              this.tableData = res.data.row //获取返回数据
              //console.log('获取的表格数据',this.tableData)
              this.total = res.data.total //总条目数
              this.paginationForm = Object.assign({}, value) // 保存上次的查询结果
              //console.log("保存当前查询", this.paginationForm);
            } else {
              this.$message.error(res.data.msg)
            }
          })
          .catch(error => {
            console.log(error)
          })
        this.tableLoading = false
      },
      current_change: function (currentPage) {
        //分页查询
        this.currentPage = currentPage //点击第几页
        this.paginationForm.currentPage = currentPage
        console.log('保存当前查询', this.paginationForm)
        this.login_recod(this.paginationForm) // 这里的分页应该默认提交上次查询的条件
      }
    },
    mounted () {
      this.login_recod(this.searchTimeForm) // 调用查询接口获取数据
    }
  }
</script>

<style scoped>
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
    margin-left: 30px;
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
</style>
