<template>
    <div class="logOff">
        <div class="logOffEnd flexLayout">
          <div>
            <img src="../../../src/base/img/currency/wancheng.png" class="successImg">
          </div>
          <div>
            <p class="successFont">注销成功了！！！</p>
          </div>

        </div>
    </div>
</template>

<script>
  export default {
    methods:{

    }
  }
</script>

<style scoped>
  .logOff{
    background-color: white;
    padding: 200px 300px;
  }
  .logOffEnd{
    width: 500px;
  }
  .successImg{
    width: 100px;
    height: 100px;
  }
  .successFont{
    font-size: 50px;
    color: #0096FF;
    margin-top: 30px;
  }
</style>
