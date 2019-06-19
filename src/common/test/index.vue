<template>
  <div id="index">
    <section class="header">
      <top></top>
    </section>
    <section class="bodyer">
      <div class="slider">
        <slider></slider>
      </div>
      <div class="content">
        <div class="tags">
          <tags></tags>
        </div>
        <div class="page">         
            <transition name="fade-transform" mode="out-in">
              <router-view></router-view>
            </transition>         
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import top from "../header/header";
import slider from "../slider/slider";
import tags from "./tags";
export default {
  data() {
    return {};
  },
  methods:{

  },
  components: {
    top,
    slider,
    tags
  }
};
</script>

<style lang="scss" scoped>
#index {
  .header {
  }
  .bodyer {
    display: flex;
    flex-direction: row;
    .slider {
      width: 260px;
      height: calc(100vh - 70px);
      background-color: #343b4a;
    }
    .content {
        width: 100%;
      .tags {
          margin-bottom: 10px;
      }
      .page {
      }
    }
  }
}
</style>

