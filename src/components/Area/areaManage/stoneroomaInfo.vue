<template>
  <div class="stoneRoom">
    <div class="stoneRoomBox">
      <!-- 左侧列表含添加 编辑区 添加区 删除四个功能  -->
      <section class="stoneRoomInfo mr_30">
        <div class="songTitle">
          <span class="titleName">库房信息</span>
        </div>
        <section class="stoneModeBox">
          <!-- 可能被遍历循环的地方 -->
          <div class="stoneMode">
            <!-- 这里应该是点击后 右边显示这个库房的信息？ -->
            <div class="stoneModeTitle">
              <span class="stoneName mr_30">库房一</span>
              <div class="stoneOprate">
                <span>编辑</span>
                <span>添加区</span>
                <span>删除</span>
              </div>
            </div>
            <div class="stoneTips">
              <div class="iconBox mb_30">
                <i class>火图标</i>
                <span class>温度： 80%</span>
              </div>
              <div class="iconBox">
                <i class>水图标</i>
                <span class>湿度：40%</span>
              </div>
            </div>
          </div>
          <div class="addBox">
            <div class="iconBox">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </section>
      </section>
      <!-- 右侧图表展示区 柱状图数据与环形图数据 -->
      <section class="area">
        <div class="areaMode">
          <div class="areaTitleBox">
            <div class="areaTitle">
              <i class="icon">图标</i>
              <span>密集S</span>
            </div>
            <div class="areaOparate">
              <span>编辑区</span>
              <span @click="openBindDialog">绑定区</span>
              <span @click="openDelete">删除区</span>
            </div>
          </div>
          <div class="areaCharts">
            <div class="Vhis">
              <ve-his
                width="680px"
                height="360px"
                :legend-visible="false"
                :data="HisData"
                :settings="HisSetting"
                :extend="HisExtend"
              ></ve-his>
            </div>
            <div class="circleBox">
              <div class="circle">
                <!-- 颜色的传递更改 -->
                <div class="temperature">
                  <ring :percent="percent"></ring>
                  <span class="text">温度: 80%</span>
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

      <!-- 右侧弹框组 -->
      <!-- 绑定区 -->
      <div class="bind">
        <el-dialog title="提示" :visible.sync="bindDialog" width="30%" :before-close="handleClose">
          <el-form ref="bindForm" :rules="bindRules" :model="bindForm">
            <el-form-item label="绑定区" prop="value">
              <el-select v-model="bindForm.value" placeholder="请选择">
                <el-option label="区域一" value="区域一"></el-option>
                <el-option label="区域二" value="区域二"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="dialogFooter">
              <el-button class="buttonTrueColor" @click="submitBind()">确定</el-button>
              <el-button class="buttonCancelColor" @click="cancelBind()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- 删除区 -->
      <div class="forbid bind">
        <el-dialog title="删除" :visible.sync="deleteDialog" width="500px" center>
          <div class="dialogBody">是否删除?</div>
          <el-form ref="bindForm" :rules="bindRules" :model="bindForm">
            <el-form-item class="dialogFooter">
              <el-button class="buttonTrueColor" @click="subDelete()">确定</el-button>
              <el-button class="buttonCancelColor" @click="cancelDelete()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
      <!-- 编辑区 -->
      <div class="editArea bind">

      </div>
    </div>
  </div>
</template>

<script>
import VeHis from "v-charts/lib/histogram.common";
import Ring from "../../../common/test/cirle";
export default {
  data() {
    return {
      /*====== 1.0左侧接收数据 ======*/

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
            barBorderRadius: [8, 8, 0, 0] // 柱子的圆角
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

      /*====== 右侧弹框配置项 ======*/
      /*------ 删除区 ------*/
      deleteDialog:false,
      /*------ 绑定区 ------*/
      bindDialog: false,
      bindForm: {
        value: ""
      },
      bindRules: {
        value: [{ required: true, message: "请选择区", trigger: "change" }]
      }
    };
  },
  computed: {
    dashOffset() {
      return (1 - this.percent) * this.dashArray;
    }
  },
  methods: {
    /*====== 弹框组  ======*/
    /*------ 左侧弹框 ------*/

    /*------ 右侧弹框 ------*/
    /*------ 打开的按钮 ------*/
    openBindDialog() {
      this.bindDialog = true;
    },
    submitBind(){
      this.bindDialog = false;
    },
    cancelBind() {
      this.bindDialog = false;
    },
    /*------ 删除的按钮 ------*/
    openDelete() {
      this.deleteDialog = true
    },
    subDelete() {

    },
    cancelDelete() {

    },

    handleClose() { // 关闭和取消 确定结束后都要清除数据
      
      console.log("清空表单的哇");
      this.bindDialog = false;
    },
    submitForm() {
      
    },
    resetForm() {
      
    }
  },
  components: {
    VeHis,
    Ring
  }
};
</script>


<style scoped>
.stoneRoom {
  width: 100%;
}
.stoneRoomBox {
  width: 100%;
  display: flex;
  flex-direction: row;
}
/*======= 左侧列表 ======*/
.stoneRoomInfo {
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
.stoneModeBox {
}
.stoneModeBox .stoneMode {
  border-bottom: 1px solid #eeeeee;
}
.stoneModeTitle:hover {
  background-color: #0096ff;
  color: #fff !important;
}
.stoneModeBox .stoneMode .stoneModeTitle {
  display: flex;
  flex-direction: row;
  font-size: 0;
  color: #0096ff;
  padding: 20px 0px;
  padding-left: 30px;
}

.stoneMode .stoneModeTitle .stoneName {
  font-size: 14px;
}
.stoneMode .stoneModeTitle .stoneOprate {
  font-size: 0;
}
.stoneModeTitle .stoneOprate span {
  font-size: 14px;
  margin-right: 8px;
  cursor: pointer;
}
.stoneTips {
  height: 123px;
  box-sizing: border-box;
  padding-top: 22px;
}
.stoneTips .iconBox {
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
.bind {
}
.bind .el-dialog {
  width: 448px !important;
}
.bind .el-form {
  width: 100%;
}
.bind .dialogFooter {
  width: 100%;
  padding-top: 20px;
  text-align: center;
  font-size: 0;
}
.bind .dialogFooter .el-button {
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
.bind .dialogFooter .el-button:first-child {
  margin-right: 20px;
}
.bind .el-button.buttonTrueColor {
  background-color: #0096ff;
}
.bind .el-button.buttonCancelColor {
  background-color: #d5d5d5;
}
.bind .el-select {
  width: 300px;
}
.bind .el-dialog__body {
  border-radius: 0 0 30px 30px;
}
</style>