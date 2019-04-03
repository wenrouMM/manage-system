export function resetObject(obj) { // 改变原对象 清空对象的值 保留键
    for(var i in obj){
        obj[i] = ''
    }
}