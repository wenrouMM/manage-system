export function resetObject(obj) { // 改变原对象 清空对象的值 保留键
    for(var i in obj){
        obj[i] = ''
    }
}
const TokenKey = 'token'
export function getToken() {
    return localStorage.getItem(TokenKey)
}

export function setToken(data) {
    return localStorage.setItem(TokenKey,data)
}

export function removeToken() {
    return localStorage.removeItem(TokenKey)
}
// 函数防抖
// 原理 点击之后设置一个定时时间 在这段时间内触发都会重置定时器 简单说就是必须等待足够时间才触发
// 与节流的区别在于 延时的时间节流是固定 无论中途点多少次都不会变化 而防抖只要点了等待时间重置
// 起床闹钟
export function debounce(method,delay) {
    var timer = null
    return function() {
        var that = this
        var args = arguments
        clearTimeout(timer)
        timer = setTimeout(() =>{
            method.apply(that,args)
        },delay)
    }
}
// 函数节流 设置延时时间
// 原理 每次调用前获得此时的时间和上回时间做对比 差距在设定之外才执行
export function throttle(method,delay) {
    var last =0
    var context = this;
    var args = arguments;
    console.log(typeof(method))
    return function () {
        var now = new Date() 
        if(now - last > delay){
            method.apply(context,args)
            last = now
        }
    }
}
// 数组去重

// 数据过滤

// 插件验证