import Vuex from 'vuex'
import Vue from 'vue'
import createLogger from 'vuex/dist/logger'
import {setToken,removeToken} from '../base/js/normal'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
const state= {
    token:null,
    user:{},
    menu:{}
}
const getters={
    userInfo: state =>{
        return state.user
    },
    menu: state => {
        return state.menu
    }
}
const mutations={
    login:(state, data) => {
        setToken(data) // 设置token
        state.token = data
    },

    logOut: (state) => {
        removeToken() // 清除token
        state.token = null
    },

    setUserInfo:(state,data) => {
        state.user = data
    },
    deleteUserInfo:(state) => {
        localStorage.removeItem('userInfo')
        state.user = {} // 清空数组
    },

    setMenu:(state,data) =>{
        state.menu = data
    },
    deleteMenu:(state) => {
        localStorage.removeItem('menu')
        state.menu = {}
    }
}
const actions= {
    
}

export default new Vuex.Store({
    state,
    mutations,
    getters,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})