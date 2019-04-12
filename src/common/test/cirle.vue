<template>
 <div class="progress-circle">
    <svg :width="radius" :height="radius" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle class="progress-background" :style="{stroke:bgColor}" :r="radius*0.45" :cx="radius*0.5" :cy="radius*0.5" fill="transparent"/>
      <circle class="progress-bar" :style="{stroke:ringColor}"  :r="radius*0.45" :cx="radius*0.5" :cy="radius*0.5" fill="transparent" :stroke-dasharray="dash"
              :stroke-dashoffset="dashOffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    radius: { // 圆环半径
      type: Number,
      default: 162
    },
    percent: { // 子环百分比
      type: Number,
      default: 0
    },
    bgColor:{ // 背景环颜色
      type:String,
      default:'#eaeef2'
    },
    ringColor:{ // 子环颜色
      type:String,
      default:'#ff5c3f'
    },
    /*未启用属性 */
    ringWidth:{ // 环的宽度
      type:String,
      default:'12px'
    },
    height:{ // 绘制的图像高度

    },
    width:{ // 绘制图像的宽度

    }
  },
  data() {
    return {
      
    }
  },
  computed: {
    dash() {
      return Math.PI * this.radius // 描边
    },
    dashOffset() {
      return (1 - this.percent) * this.dash // 占据
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
    stroke-width: 12px;
    transform-origin: center;
    
}
.progress-circle .progress-background{
    /*stroke:#eaeef2;*/
}
.progress-circle .progress-bar{
    /*stroke: #ff5c3f;*/
}
/*组件的话 大小 颜色 进度条是可控的*/
</style>

