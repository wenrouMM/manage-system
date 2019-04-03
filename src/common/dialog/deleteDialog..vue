<template>
  <div class="forbid">
    <el-button type="text" @click="centerDialogVisible = true">点击打开 Dialog</el-button>
    <el-dialog title="删除" :visible.sync="centerDialogVisible" width="500px" center>
      <div class="dialogBody">是否删除?</div>
      <div slot="footer" class="dialog-footer">
        <span class="dialogButton true mr_40" @click="submitBan">确 定</span>
        <span class="dialogButton cancel" @click="centerDialogVisible = false">取消</span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /*====== 0.0 初始化参数 ======*/
      centerDialogVisible: false
      /*====== 禁用弹框 ======*/

      /*====== 批量删除 ======*/
    };
  },
  methods: {
    submitDelete() {
      console.log('正在删除')
    }
  }
};
</script>

<style scoped>
</style>
