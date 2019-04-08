<template>
  <div class="stoneRoom">
    <div class="stoneRoomBox">
      <!-- 左侧列表含添加 编辑区 添加区 删除四个功能  -->
      <section class="stoneRoomInfo mr_30">
        <div class="songTitle">
          <span class="titleName">库房信息</span>
        </div>
        <section class="stoneModeBox">
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
              <span>绑定区</span>
              <span>删除</span>
            </div>
          </div>
          <div class="areaCharts">
            <div class="Vhis">

            </div>
            <div class="cirle">
                
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {};
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
.stoneModeBox{

}
.stoneModeBox .stoneMode{
    border-bottom: 1px solid #eeeeee;
}
.stoneModeTitle:hover{
    background-color: #0096ff;
    color: #fff!important;
}
.stoneModeBox .stoneMode .stoneModeTitle{
    display: flex;
    flex-direction: row;
    font-size: 0;
    color: #0096ff;
    padding: 20px 0px;
    padding-left: 30px;
   
}


.stoneMode .stoneModeTitle .stoneName{
    font-size: 14px;
}
.stoneMode .stoneModeTitle .stoneOprate{
    font-size: 0;
}
.stoneModeTitle .stoneOprate span{
    font-size: 14px;
    margin-right: 8px;
    cursor: pointer;
}
.stoneTips{
    height: 123px;
    box-sizing: border-box;
    padding-top: 22px;
}
.stoneTips .iconBox{
    display: flex;
    justify-content: center;
}
/*====== 右侧图表 ======*/
.area {
  width: 100%;
  background-color: #fff;
  overflow-y: scroll;
}
.area .areaMode{
    padding: 0 20px 0 50px;
}
.area .areaMode .areaTitleBox{
    display: flex;
    padding-top: 30px;
    justify-content: space-between;
    padding-bottom: 17px;
    border-bottom: 1px solid #eeeeee;

}
.areaTitleBox .areaTitle{
   font-size: 16px;
   color: #878787;
}
.areaOparate{
    font-size: 0px;
}
.areaOparate span{
    font-size: 14px;
    margin-right: 8px;
    cursor: pointer;
    color: #0096ff;
}
</style>
