import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/base/css/reset.css'
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
Vue.config.productionTip = false


Vue.use(ElementUI) // 注册插件
// vuerouter会自动调用 这就是可以直接this.$router.push的根本？
Vue.prototype.axios = axios // 挂载到vue实例 注册到vue实例中

/* eslint-disable no-new */
// 这里挂载的原因是？
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
