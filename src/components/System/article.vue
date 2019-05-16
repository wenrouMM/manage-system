<template>
  <div class="articleBox">
      {{$route.params}}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: []
    };
  },
  methods: {
      /*
    idSearchApi() {
      let obj = this.$route.params;
      console.log("id号", obj);
      this.axios
        .get(editorInt.detail, {
          params: obj
        })
        .then(res => {
          console.log("res", res);
          if (res.data.state == true) {
            let data = res.data.row;
            this.editForm.title = data.title;
            this.content = data.content;
            this.editForm.user = data.category.toString();
            this.editForm.apex = data.state.toString();
            this.editForm.disabled = data.disabled.toString();
            this.editForm.author = data.username;
            let arr = [];
            for (let item of data.sysTbEnclosures) {
              let obj = {};
              obj.name = item.fileName;
              obj.fileAddress = item.fileAddress;
              obj.createTime = item.createTime;
              arr.push(obj);
            }
            this.fileList = arr;
            console.log(res.data.row);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    }
    */
  },
  created () {
      
  }
};
</script>

<style scoped>
</style>

