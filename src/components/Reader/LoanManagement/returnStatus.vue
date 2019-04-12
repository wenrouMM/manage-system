<template>
  <div class=" getCard">
    <div style="display: flex;flex-direction: row;justify-content:space-between;padding-left: 30px;padding-top: 30px;padding-right: 30px">
      <div>
        <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
        <div style="font-size: 16px;color: #878787;margin-left:10px;margin-top: -17px">还书状态</div>
      </div>
      <div>
        <router-link :to="{path:'/returnbooks'}"  style="font-size: 15px;color: #878787;text-decoration: none">&#8678;跳转上一页</router-link>
      </div>
    </div>
    <div style="margin-top: 100px">
      <section class="text item tablebox" style="margin-left:150px">
        <el-table class="tableBorder" v-loading="tableLoading" :data="tableData" style="width: 100%; text-align:center;" :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}">
          <el-table-column align="center" prop="id" width="150" label="序号"></el-table-column>
          <el-table-column align="center" prop="bookName" width="220" label="书籍名称" v-model="tableData.roleName"></el-table-column>
          <el-table-column align="center" prop="bookCode" width="220" label="书籍编码" v-model="tableData.bookCode"></el-table-column>
          <el-table-column align="center" prop="borrowTime" width="250" label="借书开始时间" v-model="tableData.isDefault"></el-table-column>
          <el-table-column align="center" prop="returnTime" width="250" label="书籍归还时间" v-model="tableData.disabled"></el-table-column>
          <el-table-column align="center" prop="status" width="200" label="还书状态" v-model="tableData.disabled"></el-table-column>
        </el-table>
        <div style="display: flex;flex-direction: row;font-size: 16px;color: #878787;margin-top: 30px">
          <p>注释 :&nbsp;&nbsp;红楼梦借书失败</p>
          <p style="margin-left: 40px">原因 :&nbsp;&nbsp;书籍扫码不成功</p>
        </div>
        <el-button type="primary" style="margin-left: 550px;margin-top: 150px">完成并打印凭条</el-button>
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    name: "getAcard",
    data(){
      return{
        labelPosition: 'right',
        formLabelAlign: {
          userName: '',
          cardNum: '',
          bookCode: ''
        },
        tableLoading:false,
        rules: {
          // 添加的参数验证
          userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
          cardNum: [{ required: true, message: "请选择卡号", trigger: "blur" }],
          bookCode: [{ required: true, message: "请输入书籍编码", trigger: "blur" }],
        },
        tableData: [
          // 用于注入表单的数据 这里的数据应该在created钩子函数创建的时候向后台获取
          {
            id:"1",
            bookName:"红楼梦",
            bookCode:"234",
            bookType:"名著",
            borrowTime:"2018-2-3",
            returnTime:"2018-2-3",
            status:'还书失败'
          },
          {
            id:"1",
            bookName:"红楼梦",
            bookCode:"234",
            bookType:"名著",
            borrowTime:"2018-2-3",
            returnTime:"2018-2-3",
            status:'还书失败'
          },
          {
            id:"1",
            bookName:"红楼梦",
            bookCode:"234",
            bookType:"名著",
            borrowTime:"2018-2-3",
            returnTime:"2018-2-3",
            status:'还书失败'
          },
          {
            id:"1",
            bookName:"红楼梦",
            bookCode:"234",
            bookType:"名著",
            borrowTime:"2018-2-3",
            returnTime:"2018-2-3",
            status:'还书失败'
          },
          {
            id:"1",
            bookName:"红楼梦",
            bookCode:"234",
            bookType:"名著",
            borrowTime:"2018-2-3",
            returnTime:"2018-2-3",
            status:'还书失败'
          },
          {
            id:"1",
            bookName:"红楼梦",
            bookCode:"234",
            bookType:"名著",
            borrowTime:"2018-2-3",
            returnTime:"2018-2-3",
            status:'还书失败'
          },
        ],
      }
    },
    methods:{

    },
    mounted(){

    }
  }
</script>

<style scoped>
  .getCard{
    width: 100%;
    background-color: white;
    height: 852px;
  }
  .inputDiv{
    width: 200px;
    height: 30px;
  }
  .formDiv{
    margin:70px auto
  }
  form div:nth-child(2){
    margin-left: 20px;
  }
  form div:nth-child(3){
    margin-left: 330px;
    margin-top: -60px;
  }
  form div:nth-child(4){
    margin-left: 20px;
    margin-top: 30px;
  }
  form div:nth-child(5){
    margin-left: 330px;
    margin-top: -60px;
  }
  form div:nth-child(6){
    margin-left: 20px;
    margin-top: 30px;
  }
  form div:nth-child(7){
    margin-left: 20px;
    margin-top: 40px;
  }
  form div:nth-child(8){
    margin-left: 140px;
    margin-top: 50px;
  }

</style>
