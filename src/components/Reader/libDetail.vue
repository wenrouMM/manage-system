<template>
  <div class="detail">
    <section class="titleBox">
      <div class="sonTitle">
        <span class="titleName">馆内图书信息列表</span>
      </div>
      <div class="back">
        <span class="page" @click="back">
          <i class="el-icon-arrow-left"></i>返回上一页
        </span>
      </div>
    </section>
    <div class="dataBind" >
      <div v-if="!bookData.length">
        无数据
      </div>
      <div v-if="dataLength">
        <section class="Book">
          <div class="imgBox">
            <img width="150px" height="200px" alt="书籍封面" src="../../base/img/timg.jpg">
          </div>
          <div class="bookInfo">
            <p>
              <span>书籍名称： {{bookData[0].name}}</span>
              <span>索书号：{{bookData[0].searchNumber}}</span>
            </p>

            <p>
              <span>作者： {{bookData[0].author}}</span>
              <span>出版社：{{bookData[0].fkPressName}}</span>
            </p>

            <p>
              <span>页码： {{bookData[0].pageNumber}}</span>
              <span>价格：{{bookData[0].price}}</span>
            </p>
            <p>
              <span>条码： 123456789</span>
              <span>类型名称：{{bookData[0].fkTypeName}}</span>
            </p>
          </div>
        </section>
        <section class="BookAbstract">
          <div class="bookTitle">
            <span class="name">《设计心理学1：日常的设计》：</span>
          </div>
          <div class="bookContent">
            <p>{{bookData[0].introduction}}</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      name: "",
      searchNumber: "",
      author: "",
      fkPressName: "",
      pageNumber: "",
      price: "",
      fkTypeName: "",
      introduction: "",
      bookData: []
    };
  },
  computed: {
    index() {
      let id = this.$route.params.id;
      return id;
    },
    dataLength() {
      return this.bookData.length
    },
    coverPhoto() {
      //let photo = bookData.coverPhotoUrl ==''?'':bookData.coverPhotoUrl
      return photo;
    }
  },
  methods: {
    back() {
      this.$router.push("/LibBookInfo");
    },
    getData(id) {
      // 发送请求
      console.log('发送的数据',id);
      if (!this.index) {
        this.$router.push("/recommand");
      }

      let data = {
        barcode: id
      };
      axios
        .get("http://192.168.2.121:8088/tibetmuseummodule/TbookTbInfo/selectOne", {
          params: data
        })
        .then(res => {
          console.log(res);
          if (res.data.state === true) {
            console.log("未转移的bookData", this.bookData);
            let obj = [];
            obj = res.data.row;
            this.bookData = obj;
            console.log("bookData的值", this.bookData);
            console.log("数据给予后", this.bookData);
          }
        });
    }
  },
  created() {
    console.log("数据给予前");

    this.getData(this.index);
    console.log(this.dataLength)
  }
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
.detail {
  width: 100%;
  min-height: 852px;
  background-color: #ffffff;
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 40px;
  box-sizing: border-box;
}
.titleBox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50px;
}
.titleBox .back {
  position: relative;
  /*top:8px;*/
}
.titleBox .back .page {
  cursor: pointer;
}
.titleBox .sonTitle {
  border-left: 4px solid #0096ff;
  padding-left: 10px;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(135, 135, 135, 1);
  display: inline-block;
}
.titleBox .back {
  font-size: 14px;
  color: #cecece;
}
.Book {
  display: flex;
  flex-direction: row;
  margin-bottom: 38px;
}
.Book .imgBox {
  width: 150px;
  height: 200px;
  background-color: #1e9eff;
  margin-right: 70px;
  margin-left: 30px;
}
.Book .bookInfo {
  padding: 30px 0;
}
.Book .bookInfo p {
  margin-bottom: 18px;
}
.Book .bookInfo p span {
  font-size: 16px;
  color: #878787;
  display: inline-block;
  width: 300px;
  margin-right: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.BookAbstract {
  padding: 0 30px;
}
.BookAbstract .bookTitle {
  margin-bottom: 45px;
}
.bookContent {
}
.bookContent p {
  text-align: justify;
  line-height: 32px;
  font-size: 16px;
  text-indent: 40px;
}
</style>
