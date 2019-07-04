// 用于对axios的封装 如基础的登陆拦截 请求超时等待 断网刷新等 这样配置就变成了全局配置？
import axios from 'axios'
import store from '../store/store'
import {
  Message
} from 'element-ui'



 //axios.defaults.timeout = 2000
// axios.defaults.baseURL = process.env // 环境 本地发送方的url环境 这个环境怪怪的

axios.interceptors.request.use(

  config => { // 做判断 如果有token就发送token 这里应该判定vuex内的状态
    if (store.state.token != null) {

      config.headers['Authorization'] = store.state.token // 约定头部字段
    }

    return config
  },

  error => {
    console.log('超时错误在这里吗',error)
    return Promise.reject(error)
  }
)
axios.interceptors.response.use(
  response => { // 回复信息配置 code！=200
    // 还要其他的方法获得权限吗 这样是否有一些缺陷
    if(response.data.code == 3001 || response.data.code ==3003){ // 没有登录 token失效
       sessionStorage.removeItem('token')
       store.commit('removeToken')// 清除vuex内token 异步还是同步
       Message.error(response.data.msg);
       console.log('拦截器')
       console.log('当前页面路径',window.vm.$route.path)
       if(window.vm.$route.path != '/login'){ // 当前页面不是登录页 就进入登录页
        window.vm.$router.push('/login')
       }
    }
    if(response.code == 3002){ // 权限不足
      window.vm.$router.push('/404') // 进入404页面Or权限不够页面
    }
    if(response.code == 3002){ // 权限不足
      window.vm.$router.push('/404') // 进入404页面Or权限不够页面
    }
    return response
  },
  error => {
     console.log(error)
     console.log(error.message.indexOf('Network') )
     /* if(error.message.indexOf('Network') == 0){
       Message.error('网络错误 请检查')
       console.log('我觉得这个支线了')
     } */
     //console.log('状态吗',error.response.status)
     console.log('超时错误吗',typeof(error),error.message);//console : Error: Request failed with status code 402
    return Promise.reject(error)
  },
)


export default axios
