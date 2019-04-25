<template>
  <div class="borrowbook">
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">借书</div>
    </div>
    <div style="width: 100%;margin-top: 75px">
      <section style="width:400px;height: 200px;margin:0 auto">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="searchFormn"
          ref="searchFormn"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="searchFormn.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="卡号" prop="cardNum">
            <el-input v-model="searchFormn.cardNum" placeholder="请输入卡号"></el-input>
          </el-form-item>
          <el-form-item label="书籍编码" prop="bookCode">
            <el-input v-model="searchFormn.bookCode" style="width: 200px" placeholder="请输入书籍编码"></el-input>
            <el-button
              type="primary"
              style="height: 36px;width: 100px;padding-top:10px;margin-left: 15px"
              @click="selectBtn"
            >确定</el-button>
          </el-form-item>
        </el-form>
      </section>
      <section class="text item tablebox">
        <el-table
          class="tableBorder"
          @selection-change="allSelect"
          :data="tableData"
          style="width:1000px;margin:0 auto; text-align:center;"
          :row-style="rowStyle"
          :header-cell-style="{background:'#0096FF', color:'#fff',height:'60px'}"
        >
          <el-table-column align="center" prop="id" width="150" label="序号"></el-table-column>
          <el-table-column
            align="center"
            prop="bookName"
            width="200"
            label="书籍名称"
          ></el-table-column>
          <el-table-column align="center" prop="bookCode"  label="书籍编码"></el-table-column>
          <el-table-column
            align="center"
            prop="bookType"
            width="200"
            label="书籍类型"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="writer"
            width="200"
            label="作者"
          ></el-table-column>
        </el-table>
      </section>
      <div class="buttonBox">
        <el-button type="primary" size="120" @click="sellBtn" style="margin-top: 50px;">借书</el-button>
        <el-button type="warning" size="120" @click="reset">重新扫描</el-button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelPosition: "right",
      searchFormn: {
        userName: "",
        cardNum: "",
        bookCode: ""
      },
      rules: {
        // 添加的参数验证
        userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        cardNum: [{ required: true, message: "请输入卡号", trigger: "blur" }],
        bookCode:[{ required: true, message: "请输入书籍编码", trigger: "blur" }]
      },
      tableData: [
        // 用于注入表单的数据 这里的数据应该在created钩子函数创建的时候向后台获取
        {
          id: "1",
          bookName: "红楼梦",
          bookCode: "234",
          bookType: "名著",
          writer: "曹雪芹"
        },
        {
          id: "2",
          bookName: "小妖的金色城堡",
          bookCode: "432",
          bookType: "青春言情",
          writer: "饶雪漫"
        },
        {
          id: "3",
          bookName: "小时代",
          bookCode: "865",
          bookType: "青春友情",
          writer: "郭敬明"
        }
      ],
      rowStyle: {
        height: "60px"
      }
    };
  },
  methods: {
    // 搜索功能
    selectBtn() {

    },
    allSelect(val) {
      console.log("被选择的数据", val);
    },
    // 借书按钮
    sellBtn() {

    },

    // 重新扫描
    reset() {

    }
    /*------ API区 ------*/

    // websocker获取RFID

    // 通过RFID换取数据

    // 通过编号换取数据

    // 借书数据API

  },
  mounted() {}
};
</script>

<style scoped>
.borrowbook {
  width: 100%;
  background-color: white;
  height: 852px;
}
.tablebox{

}
.tablebox .tableBorder {
  border: 1px solid #ebeef5;
  border-bottom: none;
  font-size: 16px;
}
.el-button--120{
  width: 120px;
  border-radius: 6px;
}
.buttonBox{
  text-align: center;
}
</style>

