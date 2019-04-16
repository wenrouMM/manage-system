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
    deleteUserInfo:(state,data) => {
        state.user = {} // 清空数组
    },

    setMenu:(state,data) =>{
        state.menu = data
    },
    deleteMenu:(state,data) => {
        state.menu = {}
    }
}

export default new Vuex.Store({
    state,
    mutations,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})