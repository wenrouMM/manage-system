<template>
  <div class="index">
    <!-- 首栏信息 -->
    <section class="bookInfo">
      <div class="cardBox sell">
        <div class="sellicon">
          <img src="../base/img/index/borrow.png">
        </div>
        <div class="sellInfo">
          <p class="text"><span v-if="!borrowNum">{{borrowNum}}</span><ve-count v-if="borrowNum"  :end="borrowNum"></ve-count></p>
          <div class="iconBox">
            <p class="icon">今日借出</p>
          </div>
        </div>
      </div>
      <div class="cardBox repay">
        <div class="sellicon">
          <img src="../base/img/index/repay.png">
        </div>
        <div class="sellInfo">
          <p class="text"><span v-if="!returnNum">{{returnNum}}</span><ve-count v-if="returnNum"  :end="returnNum"></ve-count></p>
          <div class="iconBox">
            <p class="icon">今日归还</p>
          </div>
        </div>
      </div>
      <div class="cardBox deal">
        <div class="sellicon">
          <img src="../base/img/index/deal.png">
        </div>
        <div class="sellInfo">

          <p class="text"><span v-if="!cardNum">{{cardNum}}</span><ve-count v-if="cardNum"  :end="cardNum"></ve-count></p>
          <div class="iconBox">
            <p class="icon">今日办卡</p>
          </div>
        </div>
      </div>
      <div class="cardBox online">
        <div class="sellicon">
          <img src="../base/img/index/online.png">
        </div>
        <div class="sellInfo">

          <p class="text"><span v-if="!bookNum">{{bookNum}}</span> <ve-count v-if="bookNum" ref="bookNum" :end="bookNum"></ve-count></p>
          <div class="iconBox">
            <p class="icon">在册图书</p>
          </div>
        </div>
      </div>
    </section>
    <!-- charts图表 -->
    <section class="chartsBox">
      <div class="sellData">
        <div class="sellIcon">
          <i class="icon"></i>
          <span class="text">借出数据表</span>
        </div>
        <div class="checkBox">
          <span class="text">周借出数据</span>
        </div>
        <div class="Vhis">
          <ve-his
            width="780px"
            height="400px"
            :data="HisData"
            :legend-visible="false"
            :settings="HisSetting"
            :extend="HisExtend"
          ></ve-his>
        </div>
      </div>
      <div class="cataroyData">
        <div class="cataIcon">
          <i class="icon"></i>
          <span class="text">热门分类</span>
        </div>
        <div class="Vpie">
          <ve-pie
            width="780px"
            height="400px"
            :data="PieData"
            :colors="PieColors"
            :settings="PieSetting"
            :extend="PieExtend"
          ></ve-pie>
        </div>
      </div>
    </section>
    <!-- 实时更新信息 -->
    <section class="messageBox">
      <!-- 实时借还列表 -->
      <div class="faseList">
        <div class="title">
          <i class="icon"></i>
          <span class="text">实时借还列表</span>
        </div>
        <!-- 信息列表循环处 -->
        <div class="forlist">
          <ul v-if="recardList.length">
            <li class="listBox" v-for="(item,index) of recardList" :key="index">
              <p class="listInfo">
                <span class="listInfo">{{item.id}}</span>
                <span class="listInfo">{{item.info}}</span>
              </p>
              <p class>
                <span class="listDate">{{item.time}}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
      <!-- 系统公告 -->
      <div class="systemInfo">
        <div class="title">
          <div class="text">
            <i class="icon"></i>
            <span class="text">系统公告</span>
          </div>
          <span class="more" @click="moreBtn()">更多</span>
        </div>
        <!-- 信息列表循环处 -->
        <div class="forlist">
          <ul>
            <li class="systemBox" v-for="(item,index) of systemList" :key="index">
              <p class="systemList">
                <span @click="jumpArticle(item.id)" class="listInfo">{{item.title}}</span>
                <span>{{item.createTime}}</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import VeCount from "../common/count/count"
import VePie from "v-charts/lib/pie.common";
import VeHis from "v-charts/lib/histogram.common";
import { indexInt } from "../request/api/base.js";
import axios from "axios";
export default {
  data() {
    return {
      /*====== 上层展示数据 ======*/
      borrowNum: '',
      returnNum: '',
      bookNum: '',
      cardNum: '',
      /*====== 中层图表战术数据 ======*/
      // 柱形图相关数据
      HisData: {
        columns: ["showTime", "周借出数据"],
        rows: []
        /*
        rows: [
          { type: "2019/4/15", value: "300" },
          { type: "2019/4/16", value: "700" },
          { type: "2019/4/17", 周借出数据: "900" },
          { value: "2019/4/18", 周借出数据: "400" },
          { 日期: "2019/4/19", 周借出数据: "600" },
          { 日期: "2019/4/20", 周借出数据: "700" },
          { 日期: "2019/4/21", 周借出数据: "800" }
        ]
        */
      },
      HisSetting: {
        itemStyle: {
          normal: {
            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组 但未实现
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
            barBorderRadius: [8, 8, 0, 0], // 柱子的阴影
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
          x: 45, // 相对于绝对定义的left x2是right
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
              color: "#CECECE" //Y轴轴线的颜色
            }
          },
          splitLine: {
            // 是否启用网格线
            show: false
          },
          axisLabel: {
            // 轴线和坐标名的距离
            margin: 10
          }
        },
        yAxis: {
          show: true, // 是否展示Y轴
          position: "left", // 设置Y轴位置 多个Y轴全部合并到左边就是视觉上的一条了
          axisLine: {
            show: true, // 是否显示轴线
            lineStyle: {
              // 设置坐标轴
              color: "#CECECE" //Y轴轴线的颜色
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
            color: "#CECECE"
          }
        },
        series: {
          //barWidth: 50, // 柱条长度定死
          //barGap: '-5%',
          barCategoryGap: "40" //同类目的间距 默认百分20% 谁的20%
        }
      },
      // 饼图数据相关
      /*
        尚未完成1. 饼图整体的位移距离
        尚未完成2： label的位移距离
       */
      PieData: {
        // 饼图具体展示数据
        columns: ["type", "value"], // 两个参数选择X轴和Y轴展示的数据
        rows: []
        /*
        rows: [
          { type: "文学类", value: 1393 },
          { type: "理科类", value: 3530 },
          { type: "科学类", value: 2923 },
          { type: "艺术类", value: 1723 },
          { type: "生活常识类", value: 3792 }
        ],
        */
      },
      /* 饼图配置项 */
      // 饼图常规设置项
      PieColors: ["#00A2FF", "#FC32F0", "#00D2FF", "#ff5c3c", "#ff9231"],
      PieSetting: {
        // 饼图设置
        //roseType: "radius", // 玫瑰图配置项
        // 引导线
        labelLine: {
          show: false
        },
        // 引导标签
        label: {
          show: false
        }
      },
      PieExtend: {
        // 饼图扩展使用echarts配置覆盖原始配置
        grid: {
          // 位置无法调整 饼图是在series里调整
        },
        // 图例提示标签
        legend: {
          // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） ¦ 'vertical'（垂直）
          orient: "vertical",
          // x 设置水平安放位置，默认全图居中，可选值：'center' ¦ 'left' ¦ 'right' ¦ {number}（x坐标，单位px）
          x: "550px", // 要设置位置 否则位置和文字会相反
          // y 设置垂直安放位置，默认全图顶端，可选值：'top' ¦ 'bottom' ¦ 'center' ¦ {number}（y坐标，单位px）
          y: "center",
          icon: "circle" // 设置显示图标
        },
        series:{
          radius:'70%',
          center: ['24%','50%']
        }
      },
      //
      /*====== 下层信息展示数据 ======*/
      recardList: [],
      systemList:[],
      faseList: [
        {
          id: 1,
          info: "干脆面借《UI必修课》一本",
          time: "2019/2/3",
          secods: "17:49"
        },
        {
          id: 2,
          info: "干脆面借《UI必修课》一本",
          time: "2019/2/3",
          secods: "17:49"
        },
        {
          id: 1,
          info: "干脆面借《UI必修课》一本",
          time: "2019/2/3",
          secods: "17:49"
        }
      ]
    };
  },
  methods: {
    // 今日借出
    borrowApi() {
      axios.get(indexInt.borrow).then(res => {
        if (res.data.state === true) {
          this.borrowNum = Number(res.data.row);


        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 今日归还
    returnApi() {
      axios.get(indexInt.return).then(res => {
        if (res.data.state === true) {
          console.log('今日归还',res)
          this.returnNum = res.data.row;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 在册图书
    bookApi() {
      axios.get(indexInt.book).then(res => {
        if (res.data.state === true) {
          this.bookNum = res.data.row;

        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 办卡记录
    cardOnApi() {
      axios.get(indexInt.cardOn).then((res) =>{
        if (res.data.state === true) {
          this.cardNum = res.data.row
          console.log('办卡记录',res.data.row)
        } else {
          this.$message.error(res.data.msg);
        }
      })
    },
    // 借出记录API
    recordApi() {
      axios.get(indexInt.record).then(res => {
        if (res.data.state === true) {
          console.log('实时借还列表',res)
          this.recardList = res.data.row;
          console.log("借出记录", this.recardList);
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 饼图APi
    fanApi() {
      axios.get(indexInt.fan).then(res => {
        if (res.data.state === true) {
          console.log('热门分类',res)
          this.PieData.rows = res.data.row;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    pillarApi() {
      axios.get(indexInt.pillar).then(res => {
        if (res.data.state === true) {
          let dataArr = res.data.row.reverse();
          let arr = [];
          for (let item of dataArr) {
            delete item.endTime;
            delete item.startTime;
            item.周借出数据 = item.num;
            delete item.num;
          }
          this.HisData.rows = dataArr;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    // 系统公告
    systemApi(){
      axios.get(indexInt.notice).then((res) => {
        if(res.data.state === true){
          this.systemList = res.data.row
          console.log('具体数据',res.data)
        }else {
          this.$message.error(res.data.msg);
        }
      })
    },
    jumpArticle(id){
      this.$router.push({path:`/article/${id}`})
      console.log(id)
    },
    moreBtn(){
      this.$router.push({path:'/ActiveList'})
    }
  },
  created() {
    this.borrowApi();
    this.returnApi();
    this.bookApi();
    this.recordApi();
    this.fanApi();
    this.pillarApi();
    this.cardOnApi()
    this.systemApi()
    this.$customMessage.success('成功了') 
  },
  mounted(){

  },
  components: {
    VePie,
    VeHis,
    VeCount
  }
};
</script>

<style scoped>
/*首栏信息*/
.index {
  background-color: rgb(235, 247, 255);
  padding-bottom: 30px;
}
/*======图书信息=======*/
.bookInfo {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 40px;
}
.bookInfo .cardBox {
  width: 370px;
  height: 200px;
  background: rgba(0, 162, 255, 1);
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
}
/*卡片不同颜色开始 hover颜色待定*/
.bookInfo .sell {
  background: rgba(0, 162, 255, 1);
}
.bookInfo .sell .progress {
  background: rgba(48, 180, 255, 1);
}
.bookInfo .sell .iconBox .icon {
  background: rgba(48, 180, 255, 1); /*颜色*/
}

.bookInfo .repay {
  background: rgba(255, 146, 49, 1);
}
.bookInfo .repay .progress {
  background-color: #ffa85a;
}
.bookInfo .repay .iconBox .icon {
  background: #fca75a; /*颜色*/
}

.bookInfo .deal {
  background: rgba(0, 210, 255, 1);
}
.bookInfo .deal .progress {
  background-color: #33dbff;
}
.bookInfo .deal .iconBox .icon {
  background: #33dbff; /*颜色*/
}

.bookInfo .online {
  background: rgba(255, 92, 60, 1);
}
.bookInfo .online .progress {
  background-color: #ff7d63;
}
.bookInfo .online .iconBox .icon {
  background-color: #ff7d63;
}
/*卡片不同颜色结束*/
.bookInfo .cardBox .sellicon {
  display: flex;
  align-self: center;
  justify-content: center;
  padding-left: 20px;
  margin-right: 20px;
}
.bookInfo .cardBox .sellInfo {
  padding-top: 30px;
  padding-right: 30px;
}
.bookInfo .cardBox .sellInfo .text {
  color: #fff;
  font-size: 55px;
  margin-bottom: 20px;
  text-align: right;
}
.bookInfo .cardBox .sellInfo .progress {
  position: relative;
  width: 208px;
  height: 13px;

  border-radius: 7px;
  z-index: 2;
  margin-bottom: 15px;
}
.bookInfo .cardBox .sellInfo .percentprogress {
  position: absolute;
  width: 100px;
  height: 13px;
  background: rgba(255, 255, 255, 1);

  border-radius: 7px;
  z-index: 3;
}
.bookInfo .cardBox .sellInfo .iconBox {
  display: flex;
  justify-content: flex-end;
}
.bookInfo .cardBox .sellInfo .iconBox .icon {
  width: 100px;
  height: 25px;

  border-radius: 13px;
  text-align: center;
  line-height: 25px;
  color: #fff;
  font-size: 16px;
}

/*======echarts图表部分======*/
.chartsBox {
  margin-bottom: 40px;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.chartsBox .sellData,
.chartsBox .cataroyData {
  width: 780px;
  height: 400px;
  background-color: #ffffff;
  position: relative;
  overflow: hidden;
}
.chartsBox .sellData {
  margin-right: 40px;
}
/*柱形图*/
.chartsBox .sellData .sellIcon {
  position: absolute;
  top: 24px;
  left: 21px;
  display: flex;
  align-items: center;
}
.chartsBox .sellData .sellIcon .icon {
  width: 12px;
  height: 12px;
  background-image: url("../base/img/index/chartslist.png");
  display: inline-block;
  margin-right: 8px;
  /*margin-top: 2px;居中待定*/
}
.chartsBox .sellData .sellIcon .text {
  font-size: 16px;
  color: rgba(135, 135, 135, 1);
}
/*选择框*/
.chartsBox .sellData .checkBox {
  position: absolute;
  top: 20px;
  right: -20px;
  width: 150px;
  z-index: 55;
}
.chartsBox .sellData .checkBox .text {
  font-size: 16px;
  color: rgba(135, 135, 135, 1);
}
/*饼图*/
.chartsBox .cataroyData .cataIcon {
  position: absolute;
  top: 24px;
  left: 21px;
  display: flex;
  align-items: center;
}
.chartsBox .cataroyData .cataIcon .icon {
  width: 12px;
  height: 12px;
  background-image: url("../base/img/index/chartsType.png");
  display: inline-block;
  margin-right: 8px;
  /*margin-top: 2px;居中待定*/
}
.chartsBox .cataroyData .cataIcon .text {
  font-size: 16px;
  color: rgba(135, 135, 135, 1);
}
.chartsBox .cataroyData .Vpie {
}
/*======下层信息框======*/
.messageBox {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.messageBox .faseList,
.messageBox .systemInfo {
  width: 780px;
  height: 254px;
  background-color: #fff;
}
.messageBox .faseList {
  margin-right: 40px;
}
.messageBox .faseList .title,
.messageBox .systemInfo .title {
  padding-top: 20px;
  padding-left: 20px;
  margin-bottom: 25px;
}
.messageBox .faseList .title .icon {
  margin-top: -5px;
  display: inline-block;
  background-image: url("../base/img/index/datelist.png");
  height: 10px;
  width: 15px;
  margin-right: 4px;
  /*margin-top:2px;  居中待定*/
}
.messageBox .systemInfo .title .icon {
  margin-top: -5px;
  display: inline-block;
  background-image: url("../base/img/index/datesystem.png");
  height: 10px;
  width: 15px;
  margin-right: 4px;
}
.messageBox .faseList .title .text,
.messageBox .systemInfo .title .text {
  font-size: 16px;
  color: rgba(135, 135, 135, 1);
}
.messageBox .faseList .forlist,
.messageBox .systemInfo .forlist {
  padding: 0 50px;
}
.messageBox .faseList .forlist ul li,
.messageBox .systemInfo .forlist ul li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.messageBox .faseList .forlist ul li:last-child,
.messageBox .faseList .systemInfo ul li:last-child {
  margin-bottom: 0;
}
/*系统列表*/
.systemInfo .title{
  display: flex;
  justify-content: space-between;
  padding-right: 20px;
}

.systemList{
  display: flex;
  justify-content: space-between;
  width: 100%;
  cursor: pointer;
}
.systemList .listInfo{
  width:70%;
  display:inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.systemList .listInfo:hover{
  color: #33dbff;
}
.systemInfo .more:hover{
  color: #33dbff;

}
.systemInfo .more{
    font-size: 16px;
    cursor: pointer;
    color: rgba(135, 135, 135, 1);
}
</style>
