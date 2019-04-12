Store文件夹用于存放存放vuex状态管理相关的文件
store
state 存放全局共享数据
getter
mutations： 存放操作名与操作函数 //本质是一个操控state的同步函数
action： 异步操作
使用mutations的时候 必须是通过commit途径
注册到全局后的使用
this.$store.state
this.$store.commit(mutationName)
this.$store.dispatch(actionName)
// 使用mapMutations可以避免