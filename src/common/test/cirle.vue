<template>
 <div class="progress-circle">
    <svg :width="radius" :height="radius" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" :r="radius*0.5" :cx="radius*0.5" :cy="radius*0.5" fill="transparent"/>
      <circle class="progress-bar" :r="radius*0.5" :cx="radius*0.5" :cy="radius*0.5" fill="transparent" :stroke-dasharray="dashArray"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: {
      type: Number,
      default: 100
    },
    percent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dashArray: Math.PI * 100 // 这里描边
    }
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray
    }
  }
}
</script>
<style scoped>
/*CSS属性的接收和编写 设置圆环颜色*2 设置圆环宽度 也就说stroke的宽度 通过js在钩子函数内完成操作还是*/
.progress-circle{
    position:relative;
}
.progress-circle circle{
    stroke-width: 8px;
    transform-origin: center;
    
}
.progress-circle .progress-background{
    stroke:#eaeef2;
}
.progress-circle .progress-bar{
    stroke: #ff5c3f;
}
/*组件的话 大小 颜色 进度条是可控的*/
</style>

