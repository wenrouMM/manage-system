// 用来管理接口的域名相关
var url = 'http://192.168.2.31:8099/';
var userManage = url + 'authmodule/managerInformation/'
export const headimg = url + 'authmodule/menuInformation/currency/getImg'
export const headUpload = url + 'filemodule/currency/uploadFile/addHead'
export const roleType = url + 'authmodule/roleInformation/currency/select'

export const userManageInterface={
    select:`${userManage}select`,
    add:`${userManage}add`,
    edit:`${userManage}edit`,
    delete:`${userManage}delete`,
}

export const login_record = url + "authmodule/currency/authTbManagerLoginLog/select"
