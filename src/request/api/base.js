// 用来管理接口的域名相关

//var url = 'http://192.168.2.31:8088/'
var url ='http://192.168.2.121:8088/'
// 权限模块的API
// 权限管理模块
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


// 图书模块

/*------ 区域模块 ------*/
//库房模块
var store = url + 'regionmodule/store/'
export const storeInt = {
    select:`${store}select`,
    add:`${store}add`,
    edit:`${store}edit`,
    delete:`${store}delete`
}
//区模块
var region = url + 'regionmodule/region/'
export const regionInt = {
    select:`${region}select`,
    add:`${region}add`,
    edit:`${region}edit`,
    delete:`${region}delete`,
    selectBind:`${region}selectBind`,
    bind:`${region}editBind`
}

/*====== 藏馆系统 ======*/
/*------ 读者卡管理模块 ------*/
//读者卡信息

//读者卡信息
var cardInfo = url + 'tibetmuseummodule/readerTbCardInfo/'
export const cardInfoInt = {
    select:`${cardInfo}select`,
    cardReport:`${cardInfo}currency/cardReport`, // 挂失/取办
    cardReissue:`${cardInfo}currency/cardReissue`,// 补办
    cogradient:`${cardInfo}synchronizationReader`, // 登记读者卡
    add:`${cardInfo}currency/add`, // 办卡
    selectUser:`${cardInfo}selectUserInfoByCard`
}
//读者卡等级
var cardLevel = url + 'tibetmuseummodule/readerTbCardGradeinfo/'
export const cardLevelInt = {
    select:`${cardLevel}select`,
    add:`${cardLevel}add`,
    edit:`${cardLevel}edit`,
    delete:`${cardLevel}delete`
}
// 读者卡类型
var cardType = url + 'tibetmuseummodule/readerTbCardTypeinfo/'
export const cardTypeInt = {
    select:`${cardType}select`,
    add:`${cardType}add`,
    edit:`${cardType}edit`,
    delete:`${cardType}delete`
}
/*------ 通用接口 ------*/
export const loginInter= url + 'authmodule/index/login'
export const headUpload = url + 'filemodule/currency/uploadFile/addHead' //
export const roleType = url + 'authmodule/roleInformation/currency/addSelectRole' // 添加权限管理下拉
export const selectRoleType = url + 'authmodule/roleInformation/currency/selectRole' // 角色管理下拉
// 读者卡信息
export const cardReport = url + 'tibetmuseummodule/readerTbCardInfo/currency/cardReport' // 挂失
export const cardReissue = url + 'tibetmuseummodule/readerTbCardInfo/currency/cardReissue' // 补办
// 读者卡等级模块
export const selectEffect = url + 'tibetmuseummodule/readerTbCardGradeinfo/currency/selectEffectiveDropBox' // 获取未被禁用的读者卡等级类型下拉框
export const selectAllDrop = url + 'tibetmuseummodule/readerTbCardGradeinfo/currency/selectAllDropBox' // 获取所有读者卡等级类型列表下拉框

// 读者卡类型模块
export const readerType = url + 'tibetmuseummodule/readerTbCardTypeinfo/currency/selectEffectiveDropBox' // 类型 部分
export const levelOption = url + 'tibetmuseummodule/readerTbCardTypeinfo/currency/selectAllDropBox' //  全部类型
