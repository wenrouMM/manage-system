<template>
  <div id="header">
    <div class="header clearfix">
      <section class="logo header-left fl">
        <span class="icon">
          <i class="el-icon-menu"></i>
        </span>
        <span>后台管理系统</span>
      </section>
      <section class="content"></section>
      <div class="header-right fr">
        <div class="headerBox">
          <div class="user-avatar">
            <img class="userImg" :src="logoUrl">
          </div>
          <div class="user-name">
            <span class="text">{{userName}}</span>
            <i @click.stop="showDrop" class="el-icon-caret-bottom plus"></i>
          </div>
          <div id="detailMenu" v-if="show" class="detail-menu">
            <router-link to="/userInfo" class="dropItem">个人中心</router-link>
            <span class="dropItem">用户退出</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    logoUrl: {
      type: String,
      default: require("../../base/img/normalHead.jpg")
    },
    userName: {
      type: String,
      default: "quon"
    }
  },
  data() {
    return {
      show: false
    };
  },
  methods: {
    showDrop(event) {
      this.show = !this.show;

      console.log("zheg");
      document.addEventListener(
        "click",
        this.removeEve,
        0 /* (e)=>{
        
        
        console.log('是否触发了',drop)
        console.log('触发的事件',event.target)
        console.log(drop.contains(event.target))
        
      } */
      );
    },
    removeEve() {
      var drop = document.getElementById("detailMenu");
      console.log("是否触发了", drop);
      console.log("触发的事件", event.target);
      if (drop) {
        if (!drop.contains(event.target)) {
          this.show = false;
          document.removeEventListener("click", this.removeEve);
        }
      }

      //this.show = false;
    }
  }
};
</script>

<style lang="scss" scoped>
#header {
  position: relative;
  .header {
    background-color: #24292e;
    color: hsla(0, 0%, 100%, 0.7);
    font-size: 14px;
    line-height: 1.5;
    padding: 0 25px;
    z-index: 32;
    position: relative;

    .header-left {
      height: 70px;
      line-height: 70px;
      width: 250px;
      font-size: 18px;
    }

    .header-right {
      /*--- 头像 ---*/
      .headerBox {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 70px;
        .user-name {
          font-size: 18px;
          .plus {
            cursor: pointer;
          }
        }
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 10px;
          .userImg {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
        /*--- 下拉框 ---*/
        .detail-menu {
          width: 120px;
          background-clip: padding-box;
          background-color: #fff;
          border: 1px solid rgba(27, 31, 35, 0.15);
          border-radius: 4px;
          box-shadow: 0 3px 12px rgba(27, 31, 35, 0.15);
          right: 25px;
          list-style: none;
          margin-top: 2px;
          padding-bottom: 5px;
          padding-top: 5px;
          position: absolute;
          top: 100%;
          z-index: 100;
          .dropItem {
            color: #24292e;
            display: block;
            overflow: hidden;
            padding: 4px 10px 4px 16px;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
            &:hover {
              background-color: #0366d6;
              color: #fff;
              outline: none;
              text-decoration: none;
            }
          }
        }
      }
    }
  }
}
</style>



