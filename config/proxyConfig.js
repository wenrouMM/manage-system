module.exports = {
  // 本地跨域测试环境
  proxyLocal: {
    '/api': { // 将接口域名映射为/api
      target: '', // 接口域名
      secure: false, // 如果是https接口
      changeOrigin: true, // 是否跨域
      pathRewrite: {
        '^/api': '' // 是否需要路径重写
      }
    }
  },
  proxyTest: {
    '/api': { //将www.exaple.com印射为/apis
      target: 'https://www.exaple.com', // 接口域名
      secure: false, // 如果是https接口，需要配置这个参数
      changeOrigin: true, //是否跨域
      pathRewrite: {
        '^/api': '' //需要rewrite的,
      }
    }
  }
}
