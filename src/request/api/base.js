// 用来管理接口的域名相关
var url = 'http://192.168.2.31:8099/'

export const login_record = url + 'authmodule/currency/authTbManagerLoginLog/select'
export const role_name = url + 'authmodule/roleInformation/currency/select'//角色名称查询
export const command_list = url + 'authmodule/roleMenuElement/select'//权限管理列表
export const prohibit = url + 'authmodule/roleMenuElement/edit'//权限管理禁用
export const batch_Prohibit = url + 'authmodule/roleMenuElement/delete'//权限管理批量禁用
