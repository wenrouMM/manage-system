# vuecms

> cms

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
#涉及的数组方法
Array(20).fill(item)

#目录文件说明
##Base:放置公用的CSS Img等资源 JS等公用方法
#common: 可能会用到的公用组建
#component：组件 组件按模块区分 首页 404 登陆等公共页面置于最底层
#reques：api 存放封装的api接口 http.js封装axios请求相关
#router： 路由配置文件
#store： vuex状态管理配置文件
#static： 静态文件 目前暂无用处


#涉及到的路由管理
异步加载路由
子路由嵌套

#涉及到的状态管理
vuex store
