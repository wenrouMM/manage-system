<template>
  <div class="getCard">
    <div
      style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px"
    >
      <div>
        <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
        <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">借书结果</div>
      </div>
      <div>
        <router-link
          :to="{path:'/returnbooks'}"
          style="font-size: 15px;color: #878787;text-decoration: none"
        >&#8678;跳转上一页</router-link>
      </div>
    </div>
    <div style="margin-top: 50px" class="stateBox">
      <section class="text item tablebox">
        <!--
        <div class="reason mb_30">
          <p>用户名 :&nbsp;&nbsp;{{detail.name}}</p>
          <p style="margin-left: 40px">卡号 :&nbsp;&nbsp;{{detail.cardNum}}</p>
        </div>
        -->
        <el-table
          class="tableBorder"
          :data="tableData"
          style="width: 100%; text-align:center;"
          :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
        >
          <el-table-column align="center" type="index" width="150" label="序号"></el-table-column>
          <el-table-column align="center" prop="bookName" width="200" label="书籍名称"></el-table-column>
          <el-table-column align="center" :show-overflow-tooltip="true" prop="libraryBookCode"  label="书籍编码"></el-table-column>
          <el-table-column align="center" prop="start" width="250" label="借书开始时间"></el-table-column>
          <el-table-column align="center" prop="end" width="250" label="预计书籍归还时间"></el-table-column>
          <el-table-column align="center" prop="state" width="200"  label="还书状态">
            <template slot-scope="scope">
              <span>{{scope.row.state ===0?'还书失败':'还书成功'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <section class="reasonBox">
          <div class="block" v-for="(item,index) of tableData" :key="index">
            <div class="reason" v-if="item.state == 0">
              <p>注释 :&nbsp;&nbsp;《{{item.bookName}}》还书失败</p>
              <p style="margin-left: 40px">原因 :&nbsp;&nbsp;{{item.reason}}</p>
            </div>
            
          </div>
        </section>
        <!--
        <el-button
          @click="stampBtn"
          type="primary"
          style="margin-left: 550px;margin-top: 150px"
        >完成并打印凭条</el-button>
        -->
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: "getAcard",
  data() {
    return {
      labelPosition: "right",
      tableData: [],
      detail: {}, // 传递的所有数据
      fail:{}
    };
  },
  methods: {
    stampBtn() {}
  },
  created() {
    // 需要做一次判定 看这个人是不是从其他页面直接过来的 传读者卡吧
    let obj = localStorage.getItem("return");
    this.detail = JSON.parse(obj);
    let Num = this.detail.cardNum
    let cardNum = this.$route.query
    this.tableData = this.detail.list;
    this.fail = this.detail.fail
    console.log(this.$route.query)
    /*
    if(Num=== cardNum.Num){
      this.tableData = this.detail.list;
      this.fail = this.detail.fail
      console.log('Num',Num,'cardNum',cardNum.Num)
    } else{
      this.$router.push({path:'/returnbooks'})
    }
    console.log(this.detail);
    console.log(this.tableData);
    */
  }
};
</script>

<style scoped>
.getCard {
  width: 100%;
  background-color: white;
  height: 852px;
}
.reason{
  display: flex;
  flex-direction: row;
  font-size: 16px;
  color: #878787;
  margin-top: 30px;
}
.inputDiv {
  width: 200px;
  height: 30px;
}
.tablebox {
}
.tablebox .tableBorder {
  border: 1px solid #ebeef5;
  border-bottom: none;
  font-size: 16px;
}
.stateBox{
  width: 100%;
  padding : 0 150px;
  box-sizing: border-box;
}
</style>
