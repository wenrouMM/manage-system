<template>
  <div id="video" class="video">
    <section class="pagetitle">
      <div class="titleName">馆内视频设置</div>
    </section>
    <div class="videoBox">
      <section class="uploadBox">
        <div class="nomal-Box">
          <div class="upload-demo" style="width:360px;">
            <div class="inputBox">
              <el-form :model="addForm" :rules="rules" ref="addForm" label-width="50px">
                <el-form-item label="标题" prop="title">
                  <el-input placeholder="标题不得超过10个字" v-model="addForm.title"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <el-upload
              ref="upload"
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
              <div slot="tip" class="el-upload__tip" style="color: red">
                <p>提示:只能上传("rmvb","wmv","avi","mp4","3gp")等格式的视频文件</p>
                <p>(视频大小限500M）</p>
              </div>
            </el-upload>
            <div class="textCenter firstButton">
              <el-button class="buttonBlue" type="primary" @click="addBtn">上传</el-button>
              <el-button class="buttonGray" type="info" @click="cancelBtn">取消</el-button>
            </div>
          </div>
        </div>
      </section>
      <section class="ListBox">
        <el-scrollbar class="recomandList">
          <section >
            <p class="data-title mb_20" style="color:#0096FF">上传视频列表</p>
            <section class="tableBox">
              <el-table
                :header-cell-style="{background:'#0096FF', color:'#fff',height:'50px', fontSize:'18px',borderRight:'none'}"
                empty-text="无数据"
                style="width: 100%; text-align:center;"
                :data="videoArr"
                :row-style="{height:'50px'}"
              >
                <el-table-column min-width="160px" align="center" prop="name" label="视频封面">
                  <template slot-scope="scope">
                    <div class="tab-imgBox">
                      <video controls :src="scope.row.showFile" width="160" height="120"></video>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  align="left"
                  prop="title"
                  label="标题/时长"
                >
                  <template slot-scope="scope">
                    <div style="text-align:left" class="box">
                      <p>{{scope.row.title}}</p>
                      <p>{{scope.row.videoTime}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="fkHandleModeName" label="上传者"></el-table-column>
                <el-table-column
                  min-width="160"
                  :show-overflow-tooltip="true"
                  align="center"
                  prop="createTime"
                  label="时间/大小"
                >
                  <template slot-scope="scope">
                    <div class>
                      <p>{{scope.row.createTime}}</p>
                      <p>{{scope.row.videoSize}}M</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <span class="red" @click="deleteBtn(scope.$index, scope.row)">删除</span>
                  </template>
                </el-table-column>
              </el-table>
            </section>
          </section>
        </el-scrollbar>
      </section>
      <div class="forbid collectionDelete">
        <el-dialog title="删除" :visible.sync="centerDialogVisible" width="400px" center>
          <div class="dialogBody">是否删除这条视频?</div>
          <div style="margin-bottom: 30px">
            <span class="dialogButton true mr_40" @click="deleteDefineBut()">确 定</span>
            <span class="dialogButton cancel" @click="centerDialogVisible = false">取 消</span>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  videoUpload,
  dataSearch,
  dataAdd,
  dataDelete,
  preFile
} from "@request/api/video.js";
export default {
  data() {
    return {
      fileUrl: videoUpload,
      centerDialogVisible: false,
      fileList: [], // 文件列表
      backUrl: "", // 返回的视频链接
      videoArr: [], // video数组
      jude: false, // 判定是否禁用
      addForm: {
        title: "",
        backUrl: ""
      },
      rules: {
        title: [{ required: true, message: "标题不得为空", trigger: "blur" }]
      },
      videoSrc: "",
      videoSize: "",
      videoTime: "",
      timeFile: null, // 文件转换
      deleteObj: {}
    };
  },
  computed: {
    addTimeForm() {
      let obj = {
        path: this.addForm.backUrl,
        title: this.addForm.title,
        videoTime: this.videoTime,
        videoSize: this.videoSize
      };
      return obj;
    }
  },
  created() {
    this._search();
  },
  methods: {
    /*--- ---*/
    cancelBtn() {
      this.$refs.addForm.resetFields();
      this.fileList = [];
    },
    addBtn() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this._add();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      console.log("上传之前的数据", this.addTimeForm);
    },
    deleteBtn(index, row) {
      this.centerDialogVisible = true;
      this.deleteObj.id = row.id;
    },
    deleteDefineBut() {
      this._delete();
    },
    /*--- API ---*/
    _search() {
      dataSearch().then(res => {
        if (res.data.state == true) {
          if (res.data.row == null || res.data.length > 3) {
            this.juge = true;
          } else {
            this.juge = false;
          }
          this.videoArr = this._toFilter(res.data.row);
        } else {
          this.$message.error(res.data.msg);
        }
        console.log("测试接口", res);
      });
    },
    _add() {
      dataAdd(this.addTimeForm).then(res => {
        if (res.data.state == true) {
          this.clearObj(this.addForm);
          this.fileList = [];
          this.$refs.addForm.resetFields();
          this._search();
          this.$message.success(res.data.msg);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    _delete() {
      dataDelete(this.deleteObj).then(res => {
        if (res.data.state == true) {
          this.$message.success(res.data.msg);
          this.centerDialogVisible = false;
          this._search();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /*--- 过滤函数 ---*/
    clearObj(obj) {
      for (let key in obj) {
        obj[key] = "";
      }
    },
    _toFilter(arr) {
      let length = arr.length;

      for (let item of arr) {
        let showFile = preFile + item.path;
        item.showFile = showFile;
        // item.createTime = item.createTime.slice(0,10)
      }
      return arr;
      console.log("添加之后", this.videoArr);
    },
    /*--- 功能函数 ---*/
    // 传入一个字符串和一个限制长度的数字 生成一个补0到指定长度的字符串
    toNumebr(value, num) {
      let str = String(value);
      let length = str.length;
      while (length < num) {
        str = "0" + str;
        length++;
      }
      return str;
    },
    /*--- 上传视频文件设置 ---*/
    beforefileUpload(file) {
      let that = this;
      const fileExe = file.name.replace(/.+\./, ""); // 正则匹配 有丶慌

      const isExcel = file.type;
      this.videoSize = (file.size / 1024 / 1000).toFixed(2); // 获取文件大小
      console.log(this.videoSize, file.size);
      // 获取视频时长
      var video = document.createElement("video");
      video.preload = "metadata"; // 暗示加载元数据
      video.onloadedmetadata = function() {
        // 元数据加载完毕的生命周期函数
        window.URL.revokeObjectURL(video.src); // 回收生成的url对象
        var duration = video.duration;
        var curhours = that.toNumebr(parseInt(duration / 3600), 2);
        var curminutes = that.toNumebr(
          parseInt((duration - curhours * 3600) / 60),
          2
        );
        var curseconds = that.toNumebr(parseInt(duration % 60), 2);
        that.videoTime = curhours + ":" + curminutes + ":" + curseconds;
        console.log("看看之后的video对象", that.videoTime, curseconds);
      };

      video.src = URL.createObjectURL(file);

      console.log("文件类型", isExcel);
      if (
        ["rmvb", "wmv", "avi", "mp4", "3gp"].indexOf(fileExe.toLowerCase()) ===
        -1
      ) {
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
      this.addForm.backUrl = "";
      this.videoSize = "";
      this.videoTime = "";
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
        this.addForm.backUrl = res.row;
        /*转换信息 */
        this.timeFile = this.fileList[0].raw;

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
      this.addForm.backUrl = "";
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
.ListBox {
  max-width: 820px;
  width: 100%;
  height: 610px;
}
.recomandList {
  height: 100%;
}
.red {
  cursor: pointer;
  color: #ff3535;
}
.firstButton {
  margin-top: 30px;
}
.buttonBlue {
  color: white;
  cursor: pointer;
  background-color: #0096ffad;
  border-width: 0px;
  border-style: none;
  width: 100px;

  outline: none;
}
.buttonBlue:hover {
  color: white;
  background-color: #0096ff73;
}
.buttonGray {
  background-color: #dcdcdc;
  color: #878787;
  cursor: pointer;
  margin-left: 10px;
  border-style: none;
  width: 100px;

  outline: none;
}
.buttonGray:hover {
  background-color: #d2d2d2;
  color: #878787;
  margin-left: 10px;
}
</style>
<style>
 #video .el-scrollbar__wrap {
   overflow-x: hidden;
 }

</style>

