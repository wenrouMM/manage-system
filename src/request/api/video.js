// 引用使用的模块 可以按照文件页面分块封装
import axios from 'axios'
import { Message } from 'element-ui'; 
var url = window.glob.url;
var imgurl = window.glob.imgurl;
var fileUrl = window.glob.fileUrl;

/* 书籍推荐 */
const recommendInt = {
    search:`${url}authmodule/videoTbBigDataReferr/select`,
    add:`${url}authmodule/videoTbBigDataReferr/add`,
    delete:`${url}authmodule/videoTbBigDataReferr/delete`,
    videoUpload:`${fileUrl}filemodule/uploadVideo/addBigDataVideo`
}
export const  videoUpload=`${fileUrl}filemodule/uploadVideo/addBigDataVideo`
export const preImg=`${fileUrl}filemodule/showFile/getShow`
export function dataSearch() {
   return axios.get(recommendInt.search).then((res) =>{
        return Promise.resolve(res)
    })
}

export function dataAdd(data) {
  return  axios.post(recommendInt.add,data).then((res) =>{
        if(res.data.state == true){
            return Promise.resolve(res)
        } else {
            Message.error(res.data.msg)
        }
    })
}

export function dataDelete(obj) {
  return  axios({
      method:'delete',
      url:recommendInt.delete,
      
      data:obj
  }).then((res) => {
        if(res.data.state == true){
            return Promise.resolve(res)
        } else {
            Message.error(res.data.msg)
        }
    })
}