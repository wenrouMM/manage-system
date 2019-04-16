// 用来管理接口的域名相关
// var url = 'http://192.168.2.31:8099/';
var url = 'http://192.168.2.31:8088/'
//var url ='http://192.168.2.121:8088/'
// 权限模块的API
var userManage = url + 'authmodule/managerInformation/'
var roleManage = url + 'authmodule/roleInformation/'
var powerMangae = url + 'authmodule/roleMenuElement/'

export const userManageInterface={
    select:`${userManage}select`,
    add:`${userManage}add`,
    edit:`${userManage}edit`,
    delete:`${userManage}delete`,
}
export const roleManageInt ={
    select:`${roleManage}select`,
    add:`${roleManage}add`,
    edit:`${roleManage}edit`,
    delete:`${roleManage}delete`,
}
export const powerMangaeInt = {
    select:`${powerMangae}select`,
    add:`${powerMangae}add`,
    edit:`${powerMangae}edit`,
    delete:`${powerMangae}delete`

}
export const login_record = url + "authmodule/authTbManagerLoginLog/select" //登录记录接口
export const role_name = url + 'authmodule/roleInformation/currency/select'//角色名称查询
export const command_list = url + 'authmodule/roleMenuElement/select'//权限管理列表
export const prohibit = url + 'authmodule/roleMenuElement/edit'//权限管理禁用
export const batch_Prohibit = url + 'authmodule/roleMenuElement/delete'//权限管理批量禁用

//通用接口 
export const loginInter= url + 'authmodule/index/login'

export const headUpload = url + 'filemodule/currency/uploadFile/addHead' //
export const roleType = url + 'authmodule/roleInformation/currency/addSelectRole' // 添加权限管理下拉
export const selectRoleType = url + 'authmodule/roleInformation/currency/selectRole' // 角色管理下拉