<template>
  <div class="app-container">
    <aside>点击按钮开始引导操作</aside>
    <el-button size="small" icon="el-icon-question" type="primary" @click.prevent.stop="guide">开始引导</el-button>
  </div>
</template>
<script>
import steps from "./steps";
import Driver from "driver.js";
import "driver.js/dist/driver.min.css";
export default {
  name: "Guide",
  data() {
    return {
      driver: null
    };
  },
  mounted() {
    this.driver = new Driver({
      doneBtnText: '结束',
      closeBtnText: '关闭',
      nextBtnText: '下一个',
      prevBtnText: '上一个',
    });
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps);
      this.driver.start(); 
    }
  }
};
</script>

<style scoped>
</style>
