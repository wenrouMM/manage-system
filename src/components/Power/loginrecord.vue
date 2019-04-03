<template slot="empty">
  <div id="loginrecord">
    <div>
      <div>
        <!--style="clear-after: both" 去除浮动-->
        <!--<div style="width: 5px;height: 20px;float: left;background-color: #A60000"></div>-->
        <span id="title">登录记录列表</span>
      </div>
    </div>
    <div>
      <p>
        登录来源:&nbsp;&nbsp;&nbsp;
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </p>
      <p class="time_p">
        登录时间:&nbsp;&nbsp;&nbsp;
        <el-date-picker
          v-model="start_time"
          type="date"
          placeholder="开始日期"
          :picker-options="pickerOptions0">
        </el-date-picker>
        -
        <el-date-picker
          v-model="end_time"
          type="date"
          placeholder="结束日期"
          :picker-options="pickerOptions1">
        </el-date-picker>
        <el-button type="primary" class="button_s" @click="submit_tv">搜索</el-button>
      </p>
    </div>


    <el-table
      v-loading="loading"
      :header-cell-style="getRowClass"
      empty-text="无数据"
      :data="tableData"
    >
      <el-table-column
        align="center"
        prop="id"
        label="序号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="loginMessage"
        label="用户名称"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="loginIp"
        label="登录IP"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="loginAccount"
        label="登录账户"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="loginSource"
        label="登录来源"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="loginTime"
        label="登录时间"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="loginStatus"
        label="登录状态"
      ></el-table-column>
    </el-table>
    <div class="page_div">
      <el-pagination
        style="display: inline-block"
        background
        layout="prev, pager, next,total,jumper"
        :total="total"
        @current-change="current_change">
      </el-pagination>
      <el-button type="primary" class="confirm_bt">确认</el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import {login_record} from '../../request/api/base.js'

  export default {
    data() {
      return {
        options: [{
          value: '全部',
          label: '全部'
        }, {
          value: '平台',
          label: '平台'
        }, {
          value: '设备',
          label: '设备'
        }],
        value: '',
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.end_time !== "") {
              return time.getTime() > Date.now() || time.getTime() > this.end_time;
            } else {
              return time.getTime() > Date.now();
            }
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            return time.getTime() < this.start_time || time.getTime() > Date.now();
          }
        },
        start_time: '',
        end_time: '',
        loading: true,
        tableData: [],
        total: 0,
        pagesize: 7,
        currentpage: 1,
      }
    },
    computed: {
      submit_value() {
        let submit_value = {
          pageSize: this.pagesize,
          currentPage: this.currentpage,
          loginSource: this.value === "全部" ? null : this.value,//登录来源
          beginTime: this.start_time === '' ? null : moment(this.start_time).format('YYYY-MM-DD'),//开始时间
          endTime: this.end_time === '' ? null : moment(this.end_time).format('YYYY-MM-DD')//结束时间
        };
        return submit_value;
      }
    },
    methods: {
      submit_tv() {//条件查询
        this.login_recod(this.submit_value);
      },
      getRowClass({rowIndex}) {
        if (rowIndex === 0) {
          return 'background:#1e9eff;color:#fff;text-align:center;font-size:15px;font-weight:500;'
        } else {
          return ''
        }
      },
      login_recod(value) {//获取登录记录
        axios.get(login_record, {
          params: value
        }).then(res => {
          console.log(res.data);
          if (res.data.state === true) {
            this.tableData = res.data.row;//获取返回数据
            this.total = res.data.total;//总条目数
          } else {
            this.$message.error(res.data.msg);
          }
        }).catch(error => {
          console.log(error);
        });
        this.loading = false;
      },
      current_change: function (currentpage) {//分页查询
        this.currentpage = currentpage; //点击第几页
        this.login_recod(this.submit_value);
      },
    },
    mounted() {
      this.login_recod(this.submit_value);
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
    margin: 30px;
  }

  p {
    display: inline-block;
    font-size: 16px;
    color: #878787;
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
    border: 1px solid #EAEAEA;
    /*border-width: 0 1px 1px 1px ;*/
    border-bottom: 0;
  }


</style>
