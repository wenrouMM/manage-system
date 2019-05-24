<template>
  <div class="borrowbook" style="overflow: auto">
    <div style="display: flex;flex-direction: row;padding-left: 30px;padding-top: 30px">
      <div style="width: 4px;height: 17px;background-color: #0096FF"></div>
      <div style="font-size: 16px;color: #878787;margin-left:10px;">采购管理</div>
    </div>
    <div id="purchasing">
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
        </div>
        <div class="right">
          <el-form :inline="true" :model="searchForm">
            <el-form-item label="筛选 :">
              <el-select v-model="searchForm.makeMethod" placeholder="搜索方式" clearable style="width: 150px" @change="selectCheck(searchForm.makeMethod)">
                <el-option label="索书号" value="0"></el-option>
                <el-option label="馆藏码" value="1"></el-option>
                <el-option label="ISBN" value="2"></el-option>
                <el-option label="书名" value="3"></el-option>
                <el-option label="状态" value="4"></el-option>
              </el-select>
              <el-input v-model="searchForm.searchData" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="button_s" @click="searchBtn">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        searchForm: {
          // 接受搜索表单的数据
          makeMethod:'',
          searchData:"",
          currentPage: 0
        },
      }
    },
    mounted(){

    },
    methods:{
      //新增按钮
      rechargeBtn(){

      },
      //删除按钮
      drawbackBtn(val){

      },
      //导出按钮
      deriveBtn(){

      },
      //搜索
      searchBtn(){

      }
    },
  }
</script>

<style scoped>
  .borrowbook{
    width: 100%;
    background-color: white;
  }
  #purchasing{
    width: 1500px;
    border: 1px solid gray;
    margin: 70px auto 150px;
  }
  .searchBox{
    display: flex;
    justify-content: space-between;
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

  .buttonBox .blue .blueIcon {
    margin-right: 6px;
  }
</style>
