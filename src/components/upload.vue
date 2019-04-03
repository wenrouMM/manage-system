<template>
  <div class="inputBox">
    <!-- 预览的图片 -->
    <div v-if="src" class="preload">
      <span class="close" @click="delet">X</span>
      <img :src="src" style="width:100px; height:100px;" alt="预览照片">
    </div>
    <img
      class="defaultimage"
      @click="point"
      style="width:100px; height:100px;"
      src=""
      alt="user image"
    >
    <input type="file" accept="jpg/png" @change="getFile" ref="file" id="file">
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: "", // 预览图片
      nomarl: "", // 废弃数据 默认图片的url
      formdata: "" // 传给后台的数据
    };
  },
  methods: {
    // 函数其一 触发input的点击事件
    point() {
      this.$refs.file.click();
    },
    // 函数其二 删除/清除预览图片的src数据
    delet() {
      this.src = "";
    },

    // 坑其一 不清除上次上传的url 下次上传相同的图片不会成功 所以要清除上传路径 清除掉value值
    // 坑其二 后台拿不到可能这次的url数据 我上次后台就是没拿到 formdata对象的坑

    // 补充其一 对上传的文件格式做限制 非图片格式应该弹框警告不允许 不过可以设置接收类型
    // 补充其二 对上传文件的大小对限制  两者都可以使用e.target.files的属性 size和type进行判断

    getFile(e) { // 函数其三 上传文件并预览
      // 1.判断选择事件是否为空

      // 2. 获取数据
      let _this = this; // 缓存this
      var files = e.target.files[0]; // 事件对象包含的信息 files是路径

      // 2.1 防止后台拿不到数据 可能需要提交额外数据时
      var formdatas = new FormData()
       formdatas.append('file',files)

      _this.formdata = fordata
      console.log(files);
      
      // 3.异步预览开始 使用fileReader对象异步读取本地文件并转换为url后扔给图片url
      if (!e || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader(); // 定义 fileReader对象
      reader.readAsDataURL(files); // 转换为base64的url路径 其他三个API转换为text 二进制  arraybuffer
      reader.onloadend = function() { // 事件读取操作结束时
        // 读取完成后把转换的url给图片
        _this.src = this.result; // 此时this指向的fileReader对象
        console.log(_this.src);
        _this.$refs.file.value=''; // 清空上传路径 否则第二次上传不了同样的文件 路径不变会视为没有改变就不会触发change
      };

      /*

       */

      // 这里是一个异步事件 有状态码 FileReader.readyState
      read.onload = function(e) {
        console.log('读取完成')
      }
      reader.onloadstart = function(e) { // 读取操作开始
        console.log("开始读取....");
      };
      reader.onprogress = function(e) {
        console.log("正在读取中....");
      };
      reader.onabort = function(e) {
        console.log("中断读取....");
      };
      reader.onerror = function(e) {
        console.log("读取异常....");
      };
    }
  }
  /* 额外其一
    fordata提交的时候注意data格式要修改为formData
        data:formData,
        cache: false,//上传文件无需缓存
       	processData: false,//用于对data参数进行序列化处理 这里必须false
        contentType: false, //必须
     额外其二
     关于formdata对象和readfile对象的API使用

     头疼其二 实现带进度条的图片上传
     头疼其三 实现图片的裁剪放大缩小旋转
     头疼其一 增加用户体验 在用户等待上传的时候使用loading标志 不过这里有默认图片代替 理论上可以
     根据异步过程来控制默认图片的src路径完成
     头疼其四 多张图片的预览上传和删除实现 = =kill me 我放弃了思考
  */
};
</script>

<style scoped>
.inputbox {
  width: 100px;
  height: 100px;
  border: 1px solid #ccc;
  position: relative;
}
.preload {
  width: 100px;
  height: 100px;
  position: absolute;
  z-index: 3;
}
.inputBox .defaultimage {
  width: 100px;
  height: 100px;
  cursor: pointer;
}
.point {
  cursor: pointer;
}
.close {
  position: absolute;
  right: -5px;
  top: -5px;
  cursor: pointer;
}
#file {
  display: none;
}
</style>

