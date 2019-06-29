<template>
  <div id="video" class="video">
    <section class="pagetitle">
      <div class="titleName">馆内视频设置</div>
    </section>
    <div class="videoBox">
      <section class="uploadBox">
        <div class="nomal-Box">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :action="fileUrl"
            :file-list="fileList"
            :limit="1"
            :before-upload="beforefileUpload"
            :on-remove="fileRemove"
            :before-remove="beforeRemove"
            :on-exceed="handleExceed"
            :on-success="fileSuccess"
            :on-error="fileError"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将视频拖到此处，或
              <em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              <p>提示:只能上传("rmvb","wmv","avi","mp4","3gp")等格式的视频文件</p>
              <p>(视频大小限500M）</p>
              <div class="textCenter firstButton">
                <el-button type="primary">上传</el-button>
                <el-button type="primary">取消</el-button>
              </div>
            </div>
          </el-upload>
        </div>
      </section>
      <section class="ListBox">
        <section class="recomandList">
          <p class="data-title mb_20">上传视频列表</p>
          <section class="tableBox">
            <el-table
              :header-cell-style="{background:'#0096FF', color:'#fff',height:'50px', fontSize:'18px',borderRight:'none'}"
              empty-text="无数据"
              style="width: 100%; text-align:center;"
              :data="videoArr"
              :row-style="{height:'50px'}"
            >
              <el-table-column align="center" prop="name" label="视频封面">
                <template slot-scope="scope">
                  <div class="tab-imgBox">
                    <img :src="scope.row.showImg">
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="name" label="标题/时长"></el-table-column>
              <el-table-column align="center" prop="author" label="上传者"></el-table-column>
              <el-table-column align="center" prop="press" label="时间/大小"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <span class="red" @click="deleteBtn(scope.$index, scope.row)">删除</span>
                </template>
              </el-table-column>
            </el-table>
          </section>
        </section>
      </section>
    </div>
  </div>
</template>

<script>
import {
  videoUpload,
  dataSearch,
  dataAdd,
  dataDelete
} from "@request/api/video.js";
export default {
  data() {
    return {
      fileUrl: videoUpload,
      fileList: [], // 文件列表
      backUrl: "", // 返回的视频链接
      videoArr: [], // video数组
      jude:false, // 判定是否禁用
      
    };
  },
  computed:{
      addTimeForm(){
          let obj={
              path:''
          }
      }
  },
  created(){
      this. _search()
  },
  methods: {
    /*--- ---*/
    deleteBtn(index, row) {
      this.deleteObj.id = row.id;
      this._delete();
    },
    /*--- API ---*/
    _search() {
      dataSearch().then(res => {
        if (res.data.row == null||res.data.row.length == 6) {
          this.juge = true;
        } else {
          this.juge = false;
        }
        
        
        console.log("测试接口", res);
      });
    },
    _add() {
      dataAdd(this.addTimeForm).then(res => {
        console.log("测试添加", res);
        this.clearObj(this.upForm);
        this.imgDataUrl = "";
        this.$refs.addForm.resetFields();
        this._search();
        this.$message.success(res.data.msg);
      });
    },
    _delete() {
      dataDelete(this.deleteObj).then(res => {
        this.$message.success(res.data.msg);
        this._search();
      });
    },
    /*--- 上传视频文件设置 ---*/
    beforefileUpload(file) {
      const fileExe = file.name.replace(/.+\./, ""); // 正则匹配 有丶慌

      const isExcel = file.type;
      console.log("文件类型", isExcel);
      if (["rmvb", "wmv","avi","mp4","3gp"].indexOf(fileExe.toLowerCase()) === -1) {
        this.$message({
          type: "warning",
          message: "请上传后缀名rmvb,wmv,avi,mp4,3gp,的文件！"
        });
        return false;
      }
      console.log("上传之前", file);
    },
    beforeRemove(file, fileList) {
      /*  return this.$confirm(`确定移除 ${file.name}？`); */
    },
    fileRemove(file, fileList) {
      this.fileList = fileList;
      console.log("删除后的列表", this.fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
      console.log("限制后的数据列表", this.fileList, fileList);
    },
    fileSuccess(res, file, fileList) {
      if (res.state == true) {
        console.log("正确回复的是", res, fileList);
        this.fileList = fileList;
        this.backUrl = res.row;
        console.log("绑定的数据列表", this.fileList);
      } else {
        this.$message.error(res.msg);
        console.log("", res, this.fileList, fileList);
        fileList.pop();
        this.fileList = fileList;
        console.log("移出后的fileList", this.fileList);
      }
    },
    fileError(res, file, fileList) {
      this.$message.error("文件上传失败");
    },
    fileChange(file, fileList) {
      this.fileList = fileList.slice(-1);
      console.log("超过三个的列表", this.fileList);
    }
  }
};
</script>

<style scoped>
.video {
  background-color: #ffffff;
  padding-left: 30px;
  padding-bottom: 117px;
}
.pagetitle {
  padding: 30px 0;
}
.titleName {
  font-size: 16px;
  color: #878787;
  border-left: 4px solid #0096ff;
  padding-left: 10px;
}
.videoBox {
  display: flex;
  flex-direction: row;

  height: 610px;
  box-sizing: border-box;
}
.uploadBox {
  padding-top: 66px;
  margin-right: 40px;
  width: 40%;
}
.nomal-Box {
  height: 453px;
  border-right: 2px solid #e4e4e4;
  position: relative;
}
.upload-demo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/*--- 视频上传列表 ---*/
.ListBox{
    max-width: 820px;
    width: 100%;
}
.recomandList{
    
}
</style>

