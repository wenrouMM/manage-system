// 用于对axios的封装 如基础的登陆拦截 请求超时等待 断网刷新等 这样配置就变成了全局配置？
import axios from 'axios'
import store from '../store/store'
import {
  MessageBox,
  Message
} from 'element-ui'
import {getToken} from '../base/js/normal'


 axios.defaults.timeout = 10000
// axios.defaults.baseURL = process.env // 环境 本地发送方的url环境 这个环境怪怪的
axios.interceptors.request.use(
  config => { // 做判断 如果有token就发送token 这里应该判定vuex内的状态
    if (store.state.token != null) {
      
      config.headers['Authorization'] = store.state.token // 约定头部字段
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => { // 回复信息配置 code！=200 
    
    if(response.data.code == 3001 || response.data.code ==3003){ // 没有登录 token失效
      
    }
    if(response.code == 3002){ // 权限不足

    }
    
    return response
  },
  error => {
    
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error)
  },
)


export default axios
