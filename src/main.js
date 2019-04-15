import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/base/css/reset.css'
import '../src/base/css/zyf.css'
import '../src/base/css/common.css'
import '../src/base/css/spReset.css'
import axios from 'axios'

import '../src/base/js/yf/url'
import '../src/base/js/yf/jquery'
import '../src/base/js/yf/jquery.flot'
import '../src/base/js/yf/validate'
import "./zTree_v3/js/jquery.ztree.core.min"
import "./zTree_v3/js/jquery.ztree.excheck.min.js"
import './zTree_v3/js/jquery.ztree.exedit.min'
import './zTree_v3/js/jquery.ztree.exhide.min'
//css
import 'element-ui/lib/theme-chalk/index.css'
import './zTree_v3/css/zTreeStyle/zTreeStyle.css'
//import './zTree_v3/css/metroStyle/metroStyle.css'
Vue.config.productionTip = false
/*
router.beforeEach((to, from, next) => {
  if(to.path === '/login'){
    if(store.state.token){ // token存在的话 如果是刷新的话 应该去本地或者session里面取 这里应该提提示
      console.log('???')
      next('/')
    } else { // token不存在
      console.log('生效了吗')
      next();
    }
  } else{
    if(store.state.token) {
      next()
    } else {
      next('/login')
    }

  }


})
*/
Vue.use(ElementUI) // 注册插件
// vuerouter会自动调用 这就是可以直接this.$router.push的根本？
Vue.prototype.axios = axios // 挂载到vue实例 注册到vue实例中

/* eslint-disable no-new */
// 这里挂载的原因是？
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
