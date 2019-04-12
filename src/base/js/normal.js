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