<template>
  <div class="storeRoom">
    <div class="storeRoomBox">
      <!-- 左侧列表含添加 编辑区 添加区 删除四个功能  -->
      <section class="storeRoomInfo mr_30">
        <div class="songTitle">
          <span class="titleName">库房管理</span>
        </div>
        <section class="storeModeBox">
          <!-- 可能被遍历循环的地方 -->
          <div class="storeMode" v-for="(store,index) of storeInfo" :key="index">
            <!-- 这里应该是点击后 右边显示这个库房的信息？ -->
            <div :class="{isactive:activeIndex===index}" @click.stop="regionBtn(store,index)" class="storeModeTitle">
              <span class="storeName mr_30">{{store.storeName}}</span>
              <div class="storeOprate">
                <span @click.stop="editstoreBtn(store)">编辑</span>
                <span @click.stop="addAreaBtn(store)">添加区</span>
                <span @click.stop="deleteStoreBtn(store)">删除</span>
              </div>
            </div>
            <div  :class="{isMode:activeIndex===index}" class="storeTips">
              <div class="iconBox mb_30">
                <i class="iconfont leftFont temp iconwendu"></i>
                <span class>温度:{{!store.wd?'0':store.wd}}%</span>
              </div>
              <div class="iconBox">
                <i class="iconfont leftFont slide iconhumidity"></i>
                <span class>湿度:{{!store.sd?'0':store.sd}}%</span>
              </div>
            </div>
          </div>
          <div class="addBox">
            <div class="iconBox" @click="addStoreBtn">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </section>
      </section>
      <!-- 右侧图表展示区 柱状图数据与环形图数据 -->
      <section  class="area">
        <div  class="areaMode" v-for="(region, index) of regionInfo" :key="index">
          <div class="areaTitleBox">
            <div class="areaTitle">
              <i class="iconfont iconshuju"></i>
              <span>{{region.regionName}}</span>
            </div>
            <div class="areaOparate">
              <span @click="editAreaBtn(region,index)">编辑区</span>
              <span @click="bindAreaBtn(region,index)">绑定区</span>
              <span @click="deleteAreaBtn(region,index)">删除区</span>
            </div>
          </div>
          <div class="areaCharts">
            <div class="Vhis">
              <ve-his
                width="680px"
                height="360px"
                :legend-visible="false"
                :data="region.HisData"
                :settings="HisSetting"
                :extend="HisExtend"
              ></ve-his>
            </div>
            <div class="circleBox">
              <div class="circle">
                <!-- 颜色的传递更改 -->
                <div class="temperature">
                  <ring :percent="percent"></ring>
                  <span class="text">温度: 80℃</span>
                </div>
                <div class="humidity">
                  <ring :percent="percent" :ringColor="'#0096ff'"></ring>
                  <!-- 插槽内容 -->
                  <span class="text">湿度: 40%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <!-- 弹框组 -->
    <div class="dialogBox">
      <!-- 左侧弹框组 -->
      <!-- 库房添加/编辑 -->
      <div class="storeRoomDia common">
        <el-dialog
          :title="dialogTitle[i]"
          :visible.sync="storeRoomDialog"
          width="494px"
          @close="handleClose('changeStoreForm')"
        >
          <el-form ref="changeStoreForm" :rules="changeStoreRules" :model="changeStoreForm">
            <el-form-item class="spec" label="库房名称:" :label-width="changelabel" prop="storeName">
              <el-input v-model="changeStoreForm.storeName"></el-input>
            </el-form-item>
            <div class="row2">
              <el-form-item prop="temperatureS" label="温度警报" :label-width="changelabel">
                <el-input v-model="changeStoreForm.temperatureS"></el-input>
              </el-form-item>
              <div class="hr">-</div>
              <el-form-item prop="temperatureE">
                <el-input v-model="changeStoreForm.temperatureE"></el-input>
              </el-form-item>
            </div>
            <div class="row2">
              <el-form-item prop="humidityS" label="湿度警报" :label-width="changelabel">
                <el-input v-model="changeStoreForm.humidityS"></el-input>
              </el-form-item>
              <div class="hr">-</div>
              <el-form-item prop="humidityE">
                <el-input v-model="changeStoreForm.humidityE"></el-input>
              </el-form-item>
            </div>
            <el-form-item class="dialogFooter">
              <el-button
                class="buttonTrueColor"
                @click="submitForm('changeStoreForm','storeRoomDialog')"
              >确定</el-button>
              <el-button
                class="buttonCancelColor"
                @click="resetForm('changeStoreForm','storeRoomDialog')"
              >取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>

      <!-- 右侧弹框组 -->
      <!-- 绑定区 -->
      <div class="bind">
        <el-dialog
          :title="dialogTitle[i]"
          :visible.sync="bindDialog"
          width="442px"
          @close="handleClose('bindForm')"
        >
          <el-form ref="bindForm" :rules="bindRules" :model="bindForm">
            <el-form-item label="绑定区" prop="bindId">
              <el-select v-model="bindForm.bindId" placeholder="请选择">
                <el-option
                  v-for="(item,index) of changeOption"
                  :key="index"
                  :label="item.regionName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="dialogFooter">
              <el-button class="buttonTrueColor" @click="bindSubmit('bindForm','bindDialog')">确定</el-button>
              <el-button class="buttonCancelColor" @click="resetForm('bindForm','bindDialog')">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- 删除区Or删除库房 -->
      <div class="forbid bind">
        <el-dialog :title="dialogTitle[i]" :visible.sync="deleteDialog" width="448px" center>
          <div class="dialogBody">是否删除?</div>
          <el-form ref="bindForm" :rules="bindRules" :model="bindForm">
            <el-form-item class="dialogFooter">
              <el-button class="buttonTrueColor" @click="subDelete()">确定</el-button>
              <el-button class="buttonCancelColor" @click="deleteDialog = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- 编辑区Or添加区 -->
      <div class="changeArea common">
        <el-dialog
          :title="dialogTitle[i]"
          :visible.sync="changeDialog"
          width="900px"
          @close="handleClose('changeAreaForm')"
          center
        >
          <el-form ref="changeAreaForm" :inline="true" :rules="changeRules" :model="changeAreaForm">
            <el-form-item label="库房名称:" :label-width="changelabel" prop="storeName">
              <el-input :disabled="true" v-model="changeAreaForm.storeName"></el-input>
            </el-form-item>
            <el-form-item label="区名称:" label-width="100px" prop="zoneName">
              <el-input v-model="changeAreaForm.zoneName"></el-input>
            </el-form-item>

            <div class="row2">
              <el-form-item label="固定所在列:" :label-width="changelabel" prop="column">
                <el-select v-model="changeAreaForm.column" placeholder="请选择" style="width: 250px">
                  <el-option label="左" value="left"></el-option>
                  <el-option label="右" value="right"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="该去区共有:" :label-width="changelabel" prop="columnNumber">
                <el-input v-model="changeAreaForm.columnNumber"></el-input>
              </el-form-item>
              <span class="text">列</span>
            </div>
            <div class="row2">
              <el-form-item label="每节有:" label-width="95px" prop="floor">
                <el-input v-model="changeAreaForm.floor"></el-input>
              </el-form-item>
              <span class="text2">层</span>
              <el-form-item label="密集架宽度:" label-width="140px" prop="density">
                <el-input v-model="changeAreaForm.density"></el-input>
              </el-form-item>
            </div>
            <div class="row2">
              <el-form-item label="本区区号:" :label-width="changelabel" prop="zoneNumber">
                <el-input v-model="changeAreaForm.zoneNumber"></el-input>
              </el-form-item>
              <el-form-item label="每列有:" :label-width="changelabel" prop="section">
                <el-input v-model="changeAreaForm.section"></el-input>
              </el-form-item>
              <span class="text">节</span>
            </div>

            <el-form-item label="运行速度:" :label-width="changelabel" prop="speed">
              <el-input v-model="changeAreaForm.speed"></el-input>
            </el-form-item>
            <el-form-item label="密集架IP:" :label-width="changelabel" prop="ip">
              <el-input v-model="changeAreaForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="HTTP端口:" :label-width="changelabel" prop="httpPort">
              <el-input v-model="changeAreaForm.httpPort"></el-input>
            </el-form-item>
            <el-form-item label="通信端口:" :label-width="changelabel" prop="comPort">
              <el-input v-model="changeAreaForm.comPort"></el-input>
            </el-form-item>
            <el-form-item class="dialogFooter">
              <el-button
                class="buttonTrueColor"
                @click="submitForm('changeAreaForm','changeDialog')"
              >确定</el-button>
              <el-button
                class="buttonCancelColor"
                @click="resetForm('changeAreaForm','changeDialog')"
              >取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import VeHis from "v-charts/lib/histogram.common";
import Ring from "../../../common/test/cirle";
import { regionInt, storeInt, headUpload } from "@request/api/base.js";
import axios from "../../../request/http.js";
/*axios的配置开始迷离起来了 */
export default {
  created() {
    this.searchStore();
    this.searchRegion();
  },
  data() {
    return {
      /*------ bugHack ------*/
      storeFormBug:false,
      areaFormBug:false,
      bindFormBug:false,
      /*====== 1.0左侧接收数据 ======*/
      storeInfo: [],
      activeIndex: 0, // 控制被选中标签的数据
      /*====== 1.0右侧接收数据 ======*/
      regionInfo: [], // 区渲染数据
      /*====== 2.0右侧接收收据 ======*/
      //--------- 柱形图 ------------//
      HisData: {
        // 初始数据 横坐标和纵坐标
        columns: ["type", "数量"],
        rows: [
          { type: "现存图书", 数量: "850" },
          { type: "在架图书", 数量: "690" },
          { type: "借出图书", 数量: "320" },
          { type: "已归还图书", 数量: "650" }
        ]
      },
      HisSetting: {
        itemStyle: {
          normal: {
            color: function(params) {
              var colorList = [
                "#1e9eff",
                "#00d2ff",
                "#1e9eff",
                "#00d2ff",
                "#1e9eff",
                "#00d2ff",
                "#1e9eff"
              ];
              return colorList[params.dataIndex];
            },
            barBorderRadius: [8, 8, 0, 0], // 柱子的圆角
            label: { // 柱状图头部文字
              show: true, //开启显示
              position: "top", //在上方显示
              textStyle: {
                //数值样式
                color: "rgba(135, 135, 135, 1)",
                fontSize: 16
              }
            }
          }
        }
      },
      HisExtend: {
        grid: {
          x: 0, // 相对于绝对定义的left x2是right
          x2: 45,
          y: 68,
          y2: 28 // bottom y是top
        },
        xAxis: {
          show: true,
          axisLine: {
            show: true,
            lineStyle: {
              // 设置坐标轴
              color: "#878787" //X轴轴线的颜色
            }
          },
          splitLine: {
            // 是否启用网格线
            show: false
          },
          axisLabel: {
            // 轴线和坐标名的距离
            margin: 10
          },
          nameTextStyle: {
            // 字体设置
            fontSize: "14",
            fontFamily: "Microsoft YaHei",
            color: "#878787"
          }
        },
        yAxis: {
          show: true, // 是否展示Y轴
          position: "left", // 设置Y轴位置 多个Y轴全部合并到左边就是视觉上的一条了
          axisLine: {
            show: true, // 是否显示轴线
            lineStyle: {
              // 设置坐标轴
              color: "#878787" //Y轴轴线的颜色
            }
          },
          axisLabel: {
            // X轴轴线和坐标名的距离
            margin: 10
          },
          splitLine: {
            //是否展示网格
            show: false
          },
          nameTextStyle: {
            // 字体设置
            fontSize: "14",
            fontFamily: "Microsoft YaHei",
            color: "#878787"
          }
        },
        series: {
          barWidth: 50 // 柱条长度定死
          //barGap: '-5%',
          // barCategoryGap: "40" //同类目的间距 默认百分20% 谁的20%
        }
      },
      //-------- 圆环 组件可以避免命名空间污染 这里还是需要封装为组件------//
      percent: 0.1,
      percentH: 0.3,
      /*====== 弹框配置项 ======*/

      /*====== 左侧弹框配置项 ======*/
      // 未完待续 验证规则更严格 比如数字的验证 以及表单的placeholder
      /*------ 添加/编辑库房 ------*/
      storeRoomDialog: false,
      preImg: "",
      imgfiles: null,
      changeStoreForm: {
        storeName: "",
        temperatureS: "",
        temperatureE: "",
        humidityS: "",
        humidityE: "",
        files: "", // 喜闻乐见的上传图片
        imageAddress: "",
        id: "",
        info: ""
      },
      changeStoreRules: {
        storeName: [
          { required: true, message: "请输入库房名称", trigger: "blur" }
        ],
        temperatureS: [
          { required: true, message: "请输入温度警告", trigger: "blur" }
        ],
        temperatureE: [
          { required: true, message: "请输入温度警告", trigger: "blur" }
        ],
        humidityS: [
          { required: true, message: "请输入湿度警告", trigger: "blur" }
        ],
        humidityE: [
          { required: true, message: "请输入湿度警告", trigger: "blur" }
        ]
      },
      /*------ 删除库房 ------*/
      deleteStoreData: {},
      /*====== 右侧弹框配置项 ======*/

      /*------ 删除区 ------*/
      deleteDialog: false,
      deleteArea: {},
      /*------ 绑定区 ------*/
      bindDialog: false,
      bindForm: {
        bindId: ""
      },
      bindRules: {
        bindId: [{ required: true, message: "请选择区", trigger: "change" }]
      },
      changeOption: [], // 这里下拉肯定是个变量
      /*------ 改变区 添加 编辑 ------*/
      dialogTitle: [
        "添加区",
        "编辑区",
        "绑定区",
        "删除区",
        "编辑库房",
        "添加库房",
        "删除库房"
      ],
      i: 0, // 控制区弹框的添加编辑绑定 删除标题和调用API
      changeDialog: false,
      changeAreaForm: {
        storeName: "", // 库房名称
        zoneName: "", // 区名称
        column: "", //
        columnNumber: "", // 数据格式
        floor: "", // 层
        density: "", // 密集架宽度
        zoneNumber: "", // 区号
        section: "", // 每列节数
        speed: "", // 运行速度
        ip: "", // 密集架IP
        httpPort: "", // http端口
        comPort: "", // 通信端口
        id: "", // 数据库索引号
        fkStoreId: "" // 库房ID
      },
      changeRules: {
        storeName: [
          { required: true, message: "请输入库房名称", trigger: "blur" }
        ],
        zoneName: [
          { required: true, message: "请输入区名称", trigger: "blur" }
        ],
        column: [
          { required: true, message: "请输入固定所在列", trigger: "change" }
        ],
        columnNumber: [
          { required: true, message: "请输入去区列数", trigger: "blur" }
        ],
        floor: [{ required: true, message: "请输入层数", trigger: "blur" }],
        density: [
          { required: true, message: "请输入密集架宽度", trigger: "blur" }
        ],
        zoneNumber: [
          { required: true, message: "请输入本区区号", trigger: "blur" }
        ],
        section: [
          { required: true, message: "请输入每列节数", trigger: "blur" }
        ],
        speed: [{ required: true, message: "请输入运行速度", trigger: "blur" }],
        ip: [{ required: true, message: "请输入密集架Ip", trigger: "blur" }],
        httpPort: [
          { required: true, message: "请输入http端口", trigger: "blur" }
        ],
        comPort: [
          { required: true, message: "请输入通信端口", trigger: "blur" }
        ]
      },
      changelabel: "120px"
    };
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray;
    },
    editStoreSub() {
      let obj = {
        storeName: this.changeStoreForm.storeName,
        wddown: this.changeStoreForm.temperatureS,
        wdup: this.changeStoreForm.temperatureE,
        sddown: this.changeStoreForm.humidityS,
        sdup: this.changeStoreForm.humidityE,
        id: this.changeStoreForm.id,
        info: this.changeStoreForm.info,
        imgAddress: this.changeStoreForm.imageAddress
      };
      return obj;
    },
    bindTimeForm() {
      let obj = {
        id: this.bindForm.id,
        bindId: this.bindForm.bindId
      };
      return obj;
    },
    editAreaSub() {
      let obj = {
        id: this.changeAreaForm.id,
        fkStoreName: this.changeAreaForm.storeName,
        regionName: this.changeAreaForm.zoneName,
        gdlType: this.changeAreaForm.column,
        cols: this.changeAreaForm.columnNumber,
        lays: this.changeAreaForm.floor,
        width: this.changeAreaForm.density,
        regionNum: this.changeAreaForm.zoneNumber,
        divs: this.changeAreaForm.section,
        speed: this.changeAreaForm.speed,
        reqestIp: this.changeAreaForm.ip,
        httpPort: this.changeAreaForm.httpPort,
        tcpPort: this.changeAreaForm.comPort,
        fkStoreId: this.changeAreaForm.fkStoreId
      };
      return obj;
    },
    actionApi() {
      return headUpload;
    }
  },
  methods: {
    /*====== 弹框组  ======*/
    /*------ 结构启动按钮 ------*/
    editstoreBtn(store) {
      // 其实可以写成一个switch
      this.preImg = "";
      this.i = 4;
      this.changeStoreForm.storeName = store.storeName;
      this.changeStoreForm.temperatureS = store.wddown;
      this.changeStoreForm.temperatureE = store.wdup;
      this.changeStoreForm.humidityS = store.sddown;
      this.changeStoreForm.humidityE = store.sdup;
      this.changeStoreForm.id = store.id;
      this.changeStoreForm.info = store.info;
      this.changeStoreForm.imageAddress = store.imgAddress;
      this.storeRoomDialog = true;
    },
    addStoreBtn() {
      if(this.storeFormBug){
        this.$refs.changeStoreForm.resetFields()
      }
      //
      let pbj = this.changeStoreForm;
      for (var i in pbj) {
        pbj[i] = "";
      }
      this.i = 5;
      this.preImg = "";
      this.storeRoomDialog = true;
    },
    deleteStoreBtn(store) {
      this.i = 6;
      this.deleteStoreData.id = store.id;
      this.deleteDialog = true;
    },
    regionBtn(store, index) {
      console.log("点击库房数据", store, index);
      this.activeIndex = index; // 当前索引与active相等就给予active样式
      this.searchRegion(store.id);
    },
    /*------ 区相关按钮 ------*/
    addAreaBtn(store) {
      this.i = 0;
      if(this.areaFormBug){
        this.$refs.changeAreaForm.resetFields()
      }
      let obj = this.changeAreaForm;
      for (var i in obj) {
        obj[i] = "";
      }
      this.changeAreaForm.storeName = store.storeName;
      this.changeAreaForm.fkStoreId = store.id;
      this.changeDialog = true;
    },
    editAreaBtn(region, index) {
      console.log("编辑区的数据", region, index);
      this.i = 1;
      this.changeAreaForm.storeName = region.fkStoreName;
      this.changeAreaForm.zoneName = region.regionName;
      this.changeAreaForm.column = region.gdlType;
      this.changeAreaForm.columnNumber = region.cols;
      this.changeAreaForm.floor = region.lays;
      this.changeAreaForm.density = region.width,
      this.changeAreaForm.zoneNumber = region.regionNum;
      this.changeAreaForm.section = region.divs;
      this.changeAreaForm.speed = region.speed;
      this.changeAreaForm.ip = region.reqestIp;
      this.changeAreaForm.httpPort = region.httpPort;
      this.changeAreaForm.comPort = region.tcpPort;

      this.changeAreaForm.id = region.id;
      this.changeAreaForm.fkStoreId = region.fkStoreId;
      console.log(this.changeAreaForm);
      this.changeDialog = true;
    },
    bindAreaBtn(region, index) {
      this.i = 2;
      this.bindForm.id = region.id;
      this.bindForm.bindId = ''
      if(this.bindFormBug){
        this.$refs.bindForm.resetFields();
      }

      this.changeOptionApi(); // 这样写会不会太耦合 数据都在内层 可扩展性不强
      this.bindDialog = true;
    },
    deleteAreaBtn(region, index) {
      this.i = 3;
      this.deleteArea.id = region.id;
      this.deleteDialog = true;
    },
    /*------ 弹框按钮 ------*/
    // 未按待续 图片上传按钮功能
    Bancacncel() {
      this.deleteDialog = false;
    },
    // 删除弹框的提交按钮
    subDelete() {
      let flag = this.i; // 关闭弹框
      switch (flag) {
        case 3:
          console.log("删除区Api");
          this.deleteRegion();
          break;
        case 6:
          this.deleteStore();
          console.log("删除库房API");
      }
    },
    submitForm(formName, dialogName) {
      // 提交后也要清空 表单验证要开起来
      console.log("提交了哦");
      let i = this.i;
      let data = {};
      //let method = 'post'
      let url = "";
      // 库房编辑和添加接口
      if (i == 4 || i == 5) {
        url = i == 4 ? storeInt.edit : storeInt.add;
        //method = 'put'
        data = this.editStoreSub;
        console.log("提交的数据", data);
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 发送上传图片请求
            this.uploadImgApi();
            // 发送数据提交请求
            axios({
              url: url,
              method: "post",
              data: data
            }).then(res => {
              if (res.data.state === true) {
                this.$message.success("执行成功");
                this.searchStore();
                this[dialogName] = false;
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
      // 区编辑和添加
      if (i == 0 || i == 1) {
        url = i == 0 ? regionInt.add : regionInt.edit;
        data = this.editAreaSub;
        console.log("提交的数据", data);
        this.$refs[formName].validate(valid => {
          if (valid) {
            axios({
              url: url,
              method: "post",
              data: data
            }).then(res => {
              if (res.data.state === true) {
                this.$message.success("执行成功");
                this.searchRegion(data.fkStoreId);
                this[dialogName] = false;
              } else {
                this.$message.error(res.data.msg);
              }
            });
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    // 改变表单取消按钮
    resetForm(formName, dialogName) {
      //this.$refs[formName].resetFields();
      this[dialogName] = false;
    },
    // 绑定区按钮提交按钮
    bindSubmit(formName, dialogName) {
      this.$refs[formName].validate(valid => {
        let data = this.bindTimeForm;
        let url = regionInt.bind;
        console.log("绑定区提交的数据", data);
        if (valid) {
          axios({
            url: url,
            method: "post",
            data: data
          }).then(res => {
            if (res.data.state === true) {
              this.$message.success("执行成功");
              this[dialogName] = false;
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 弹框关闭执行的回调函数
    handleClose(formName) {
      // 关闭和取消 确定结束后都要清除数据
      if(formName == 'changeStoreForm'){
        this.storeFormBug = true

      } else{
        this.areaFormBug = true
      }
      if(formName == 'bindForm'){
        this.bindFormBug = true
        console.log('已经被打开过了')
      }
      console.log("清空表单的哇",this.changeAreaForm);
      console.log('仓库',this.changeStoreForm)
      //this.$refs[formName].resetFields();
      // 清空的是手动输入的值 而绑定的值还是要手动清理掉 循环清理吧
    },
    /*------ 图片上传相关按钮 ------*/
    pointer() {
      this.$refs.file.click();
    },
    getFile(e) {
      let _this = this; // 缓存this
      let value = _this.$refs.file.value;
      var files = e.target.files[0]; // 事件对象包含的信息 files是路径
      _this.imgfiles = files; // 文件对象保留
      console.log(_this.imgfiles);
      if (!e || !window.FileReader) return; // 看支持不支持FileReader
      let reader = new FileReader(); // 定义 fileReader对象
      reader.readAsDataURL(files); // 转换为base64的url路径 其他三个API转换为text 二进制  arraybuffer
      reader.onloadend = function() {
        _this.preImg = this.result;
        console.log("图片地址", _this.preImg);
        _this.$refs.file.value = ""; // 文件地址
      };
    },
    /*====== Api部分 总计10个接口 ======*/
    /*------ 库房API ------*/
    searchStore() {
      // 查询库房
      axios.get(storeInt.select).then(res => {
        console.log("当前获取的库房数据", res);
        if (res.data.state === true) {
          this.storeInfo = res.data.row;
          console.log("库房信息", this.storeInfo);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    deleteStore() {
      // 删除库房
      let data = this.deleteStoreData;
      console.log("提交的删除数据", data);
      axios.post(storeInt.delete, data).then(res => {
        if (res.data.state === true) {
          this.$message.success("删除成功");
          this.searchStore();
          this.searchRegion();
          this.deleteDialog = false;
          console.log(res);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    /*------ 区API ------*/
    searchRegion(num) {
      let obj = {};
      obj.id = num;
      axios
        .get(regionInt.select, {
          params: obj
        })
        .then(res => {
          console.log("区域信息", res);
          if (res.data.state === true) {
              console.log('问题在这里？',res.data.row)
            for(let item of res.data.row){

              for (let reg of item.regionIcon){
                reg.数量  = reg.value
                delete reg.value
              }
              item.HisData = {
                columns: ["type", "数量"],
                rows:item.regionIcon
              }

            }
            this.regionInfo = res.data.row;
            console.log("获取的区信息", this.regionInfo);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    deleteRegion() {
      let data = this.deleteArea;
      console.log("提交的删除数据", data);
      axios.post(regionInt.delete, data).then(res => {
        if (res.data.state === true) {
          this.$message.success("删除成功");
          this.searchRegion();
          this.deleteDialog = false;
          console.log(res);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 获取绑定区下拉框
    changeOptionApi() {
      let data = this.bindForm;
      axios
        .get(regionInt.selectBind, {
          params: data
        })
        .then(res => {
          if (res.data.state === true) {
            let arr = [];

            for (let item of res.data.row) {
              let obj = {};
              obj.regionName = item.regionName;
              obj.id = item.id;
              arr.push(obj);
            }
            this.changeOption = arr;
            console.log("获取的绑定区信息", this.changeOption);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    // 图片上传API
    uploadImgApi() {
      let files = this.imgfiles
      if (files) {
        var formdatas = new FormData();
        formdatas.append("file", files);
        //console.log(formdatas.get('file'))
        this.axios({
          method: "post",
          url: headUpload,
          data: formdatas,
          //cache: false,//上传文件无需缓存
          processData: false, //用于对data参数进行序列化处理 这里必须false
          contentType: false, //
          dataType: "JSON",
          ContentType: "multipart/form-data",
          xhrFields: {
            withCredentials: true
          },
          crossDomain: true
        }).then(request => {
          // 如果是编辑 更换图片失败后
          if (request.data.row != "") {
            console.log('上传图片成功')
          }else{
            this.$message.error('图片上传失败')
          }

        });
      }
    }
  },
  components: {
    VeHis,
    Ring
  }
};
</script>


<style scoped>
.storeRoom {
  width: 100%;
}
.storeRoomBox {
  width: 100%;
  display: flex;
  flex-direction: row;
}
/*======= 左侧列表 ======*/
.storeRoomInfo {
  width: 340px;
  background-color: #fff;
  height: 852px;
  overflow-y: scroll;
}
.songTitle {
  height: 75px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 30px;
  border-bottom: 1px solid #eeeeee;
  box-sizing: border-box;
}
.songTitle .titleName {
  border-left: 4px solid #0096ff;
  padding-left: 10px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(135, 135, 135, 1);
  display: inline-block;
}
.storeModeBox {
}
.storeModeBox .storeMode {
  border-bottom: 1px solid #eeeeee;
}
.leftFont{

}
.storeModeTitle:hover {
  background-color: #0096ff;
  color: #fff !important;
}
.storeModeTitle.isactive {
  background-color: #0096ff;
  color: #fff !important;
}
.isMode .temp{
  color: #ff5c3c;
}
.isMode .slide{
  color: #00d2ff;
}
.storeModeBox .storeMode .storeModeTitle {
  display: flex;
  flex-direction: row;
  font-size: 0;
  color: #0096ff;
  padding: 20px 0px;
  padding-left: 30px;
  cursor: pointer;
  justify-content: space-between;
}

.storeMode .storeModeTitle .storeName {
  font-size: 14px;
}
.storeMode .storeModeTitle .storeOprate {
  font-size: 0;
}
.storeModeTitle .storeOprate span {
  font-size: 14px;
  margin-right: 8px;
  cursor: pointer;
}
.storeTips {
  height: 123px;
  box-sizing: border-box;
  padding-top: 22px;
}
.storeTips .iconBox {
  display: flex;
  justify-content: center;
}
.addBox {
  height: 180px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.addBox i {
  font-size: 24px;
  color: #0096ff;
}
.addBox .iconBox {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #0096ff;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
}
/*====== 右侧图表 ======*/
/*------ 标题区 ------*/
.area {
  width: 100%;
  background-color: #fff;
  overflow-y: scroll;
  height: 852px;
}
.area .areaMode {
  padding: 0 20px 0 50px;
}
.area .areaMode .areaTitleBox {
  display: flex;
  padding-top: 30px;
  justify-content: space-between;
  padding-bottom: 17px;
  border-bottom: 1px solid #eeeeee;
}
.areaTitleBox .areaTitle {
  font-size: 16px;
  color: #878787;
}
.areaOparate {
  font-size: 0px;
}
.areaOparate span {
  font-size: 14px;
  margin-right: 8px;
  cursor: pointer;
  color: #0096ff;
}
/*----- 图表区 ------*/
.areaCharts {
  display: flex;
  justify-content: space-between;
}
.Vhis {
  width: 680px;
  height: 360px;
}
/*------ 圆环区 ------*/
.circleBox {
  display: flex;
  align-items: flex-end;
  padding-bottom: 55px;
  padding-right: 21px;
}
.circle {
  display: flex;
  flex-direction: row;
}
.temperature,
.humidity {
  position: relative;
}
.temperature circle,
.humidity circle {
  stroke-width: 12px;
  transform-origin: center;
}
/*设计稿是带圆角的 = =*/
.temperature .circle-bg,
.humidity .circle-bg {
  stroke: #eaeef2;
}
.temperature .progress {
  stroke: #ff5c3f;
}
.humidity {
  margin-left: 86px;
}
.humidity .progress {
  stroke: #00d2ff;
}
.temperature .text,
.humidity .text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
<style>
/*====== 弹框 ======*/
.bind,
.common {
}
.bind .el-dialog {
}
.bind .el-form,
.common .el-form {
  width: 100%;
  text-align: center;
}
.bind .dialogFooter,
.common .dialogFooter {
  width: 100%;
  padding-top: 20px;
  text-align: center;
  font-size: 0;
}
.bind .dialogFooter .el-button,
.common .dialogFooter .el-button {
  height: 46px;
  width: 150px;
  border-radius: 10px;
  display: inline-block;
  cursor: pointer;
  font-size: 18px;
  color: #fff;
  border: none;
  box-sizing: border-box;
  text-align: center;
}
.bind .dialogFooter .el-button:first-child,
.common .dialogFooter .el-button:first-child {
  margin-right: 20px;
}
.bind .el-button.buttonTrueColor,
.common .el-button.buttonTrueColor {
  background-color: #0096ff;
}
.bind .el-button.buttonCancelColor,
.common .el-button.buttonCancelColor {
  background-color: #d5d5d5;
}
.bind .el-select {
  width: 300px;
}
.bind .el-dialog__body,
.common .el-dialog__body {
  border-radius: 0 0 30px 30px;
}
/*自定义样式*/
.changeArea .el-select {
  width: 202px;
}
.changeArea .el-form--inline .el-form-item {
  margin-right: 30px;
}
.row2 {
  position: relative;
}
.storeRoomDia .el-form {
  text-align: inherit;
}
.storeRoomDia .row2 {
  display: flex;
}
.row2 .text {
  position: absolute;
  top: 13px;
  right: 15px;
  font-size: 14px;
  color: #878787;
}
.row2 .text2 {
  position: absolute;
  top: 13px;
  left: 380px;
  font-size: 14px;
  color: #878787;
}

.storeRoomDia .spec input.el-input__inner {
  width: 300px;
}
.storeRoomDia .row2 input.el-input__inner {
  width: 130px;
}
.hr {
  font-size: 16px;
  margin: 0 15px;
  line-height: 40px;
}
/*图片上传*/
.upload {
  height: 130px;
  padding-left: 30px;
  align-items: center;
}
.upload span {
  margin-right: 10px;
}
.imgBox {
  height: 130px;
  width: 130px;
  position: relative;
  background-image: url("../../../base/img/timg.jpg");
  border: 1px solid #0096ff;
}
.imgBox img {
  height: 130px;
  width: 130px;
}
.imgBox .defaultImg {
  height: 130px;
  width: 130px;
  position: absolute;
  z-index: 1;
}
.imgBox .preImg {
  position: absolute;
  z-index: 2;
}
.imgBox .loadImg {
  z-index: 2;
}
.acces {
  height: 130px;
  width: 130px;
  position: absolute;
  z-index: 3;
  top: 0;
  cursor: pointer;
}
</style>
