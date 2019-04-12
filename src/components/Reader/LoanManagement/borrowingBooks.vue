<template>
  <div class="borrowbook">
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">借书</div>
    </div>
    <div style="width: 100%;margin-top: 75px">
      <div style="width:400px;height: 200px;margin:0 auto">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" ref="formLabelAlign" :rules="rules">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="formLabelAlign.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="卡号" prop="cardNum">
            <el-input v-model="formLabelAlign.cardNum" placeholder="请输入卡号"></el-input>
          </el-form-item>
          <el-form-item label="书籍编码" prop="bookCode">
            <el-input v-model="formLabelAlign.bookCode" style="width: 200px" placeholder="请输入书籍编码"></el-input>
            <el-button type="primary" style="height: 36px;width: 100px;padding-top:10px;margin-left: 15px">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
      <section class="text item tablebox" style="margin-left:150px">
        <el-table class="tableBorder" v-loading="tableLoading" @selection-change="handleSelectionChange" :data="tableData" style="width: 100%; text-align:center;" :row-style="rowStyle" :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}">
          <el-table-column align="center" type="selection" width="150" ></el-table-column>
          <el-table-column align="center" prop="id" width="150" label="序号"></el-table-column>
          <el-table-column align="center" prop="bookName" width="200" label="书籍名称" v-model="tableData.roleName"></el-table-column>
          <el-table-column align="center" prop="bookCode" width="200" label="书籍编码"></el-table-column>
          <el-table-column align="center" prop="bookType" width="200" label="书籍类型" v-model="tableData.isDefault"></el-table-column>
          <el-table-column align="center" prop="writer" width="200" label="作者" v-model="tableData.disabled"></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <!-- 这里的scope代表着什么 index是索引 row则是这一行的对象 -->
            <template slot-scope="scope">
              <span class="edit" @click="handleEdit(scope.$index, scope.row)">移除</span>
            </template>
          </el-table-column>
        </el-table>
      </section>
      <el-button type="primary" style="margin-top: 50px;margin-left: 725px;width: 150px">借书</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        labelPosition: 'right',
        formLabelAlign: {
          userName: '',
          cardNum: '',
          bookCode: ''
        },
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
            writer:"曹雪芹"
          },
          {
            id:"2",
            bookName:"小妖的金色城堡",
            bookCode:"432",
            bookType:"青春言情",
            writer:"饶雪漫"
          },
          {
            id:"3",
            bookName:"小时代",
            bookCode:"865",
            bookType:"青春友情",
            writer:"郭敬明"
          }

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
  .borrowbook{
    width: 100%;
    background-color: white;
    height: 852px;
  }

</style>
