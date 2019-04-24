<template>
  <div>
    <ul class="routerBox" v-if="showTags">
      <li
        class="routerButton circularButton"
        v-for="(item,index) in tagsList"
        :class="{'labelActive':isActive(item.path)}"
        :key="index"
      >
        <router-link :to="item.path" class="tags-li-title">{{item.title}}</router-link>
        <span class="tags-li-icon" @click="closeTags(index)">
          <i class="el-icon-close point"></i>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import bus from "../bus.js";
export default {
  data() {
    return {
      tagsList: [],
      taro:true
    };
  },
  methods: {
    // 设置标签
    setTags(route) {
      // 去重 路由未变换的时候
      const isExist = this.tagsList.some(item => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        if (this.tagsList >= 8) {
          this.tagsList.shift();
        }
        this.tagsList.push({
          title: route.meta.title,
          path: route.fullPath,
          name: route.matched[1].components.default.name
        });
      }

      console.log("此时的循环列表", this.tagsList);
      // 事件派发给父组件
      bus.$emit("tags", this.tagsList);
    },
    // 关闭标签
    closeTags(index) {
      const delItem = this.tagsList.splice(index, 1)[0];
      // 边界处理 此时的index
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1];
      if (item) {
        if (delItem.path === this.$route.fullPath) {
          this.$router.push(item.path);
        }
        // delItem.path === this.$route.fullPath && this.$router.push(item.path)
      } else {
        // 都删完的话首页判定该...
        this.$router.push("/");
        
      }
    },
    // 样式绑定
    isActive(path) {
      return path === this.$route.fullPath; // Vue element或者Vue的路由选中好像就是这样
    }
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0;
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue);
    }
  }
};
</script>

<style scoped>
.routerBox {
  background-color: #fff;
  min-height: 70px;
  width: 100%;
  padding: 0 30px;
  align-items: center;
  display: flex;
  box-sizing: border-box;
}
.routerButton {
  margin-right: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.tags-li-title{
  font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	letter-spacing: 0px;
  color: #878787;
  line-height: 36px;
}
.tags-li-icon {
  font-size: 14px;
  position: absolute;
  right: 13px;
  top:0px;
}
.point{
  cursor: pointer;
}
.labelActive {
  background-color: #0096ff;
  color: #fff;
  border: none;
}
.labelActive .tags-li-title{
  color: #fff;
}
</style>
