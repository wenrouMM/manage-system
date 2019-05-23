<template>
  <div class="colorBox">
    <div class="errorBox">
      <div class="error">
        <div class="pic-error">
          <img class="pic-parent" :src="parentImg" alt="404">
          <img class="pic-child left" :src="childImg" alt="404">
          <img class="pic-child mid" :src="childImg" alt="404">
          <img class="pic-child right" :src="childImg" alt="404">
        </div>
        <!-- 断网提示 -->
        <div class="bullshit">
          <div class="title">(⊙_⊙)?404 not found</div>
          <div class="info">(◕ᴗ◕✿)输入的地址无效 请输入正确的地址或者点击下面的按钮回到首页↓</div>
          <a href="/" class="back-home">返回首页(ง •_•)ง </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      parentImg: require("../base/img/error/404.png"),
      childImg: require("../base/img/error/404_cloud.png")
    };
  },
  methods: {}
};
</script>

<style scoped>
.colorBox {
  height: 100vh;
  background-color: #ffffff;
}
.errorBox {
  transform: translate(-50%, -50%);
  position: absolute;
  top: 40%;
  left: 50%;
}
.error {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
}
.pic-error {
  position: relative;
  float: left;
  width: 600px;
  overflow: hidden;
}
.pic-parent {
  width: 100%;
}
.pic-child {
  position: absolute;
}
.left {
  width: 80px;
  top: 17px;
  left: 220px;
  opacity: 0;
  animation-name: cloudLeft;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
.mid {
  width: 46px;
  top: 10px;
  left: 420px;
  opacity: 0;
  animation-name: cloudMid;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1.2s;
}
.right {
  width: 62px;
  top: 100px;
  left: 500px;
  opacity: 0;
  animation-name: cloudRight;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
  animation-delay: 1s;
}
/*------ 文字提示 ------*/
.bullshit {
  position: relative;
  float: left;
  width: 300px;
  padding: 30px 0;
  overflow: hidden;
}
.bullshit .title {
  font-size: 32px;
  font-weight: bold;
  line-height: 40px;
  color: #1482f0;
  opacity: 0;
  margin-bottom: 20px;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}
.bullshit .info {
  font-size: 13px;
  line-height: 21px;
  color: grey;
  opacity: 0;
  margin-bottom: 30px;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-delay: 0.2s;
  animation-fill-mode: forwards;
}
.bullshit .back-home {
  display: block;
  float: left;
  width: 120px;
  padding: 0 20px;
  height: 36px;
  background: #1482f0;
  border-radius: 100px;
  text-align: center;
  color: #ffffff;
  opacity: 0;
  font-size: 14px;
  line-height: 36px;
  cursor: pointer;
  animation-name: slideUp;
  animation-duration: 0.5s;
  animation-delay: 0.3s;
  animation-fill-mode: forwards;
}
/*------ 动画 ------*/
@keyframes cloudLeft {
  0% {
    top: 17px;
    left: 220px;
    opacity: 0;
  }
  20% {
    top: 33px;
    left: 188px;
    opacity: 1;
  }
  80% {
    top: 81px;
    left: 92px;
    opacity: 1;
  }
  100% {
    top: 97px;
    left: 60px;
    opacity: 0;
  }
}
@keyframes cloudMid {
  0% {
    top: 10px;
    left: 420px;
    opacity: 0;
  }
  20% {
    top: 40px;
    left: 360px;
    opacity: 1;
  }
  70% {
    top: 130px;
    left: 180px;
    opacity: 1;
  }
  100% {
    top: 160px;
    left: 120px;
    opacity: 0;
  }
}
@keyframes cloudRight {
  0% {
    top: 100px;
    left: 500px;
    opacity: 0;
  }
  20% {
    top: 120px;
    left: 460px;
    opacity: 1;
  }
  80% {
    top: 180px;
    left: 340px;
    opacity: 1;
  }
  100% {
    top: 200px;
    left: 300px;
    opacity: 0;
  }
}
@keyframes slideUp {
  0% {
    transform: translateY(60px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
