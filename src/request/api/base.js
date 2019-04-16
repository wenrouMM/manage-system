// 用来管理接口的域名相关
// var url = 'http://192.168.2.31:8099/';
var url = 'http://192.168.2.121:8088/'
var userManage = url + 'authmodule/managerInformation/'
export const loginInter= url + 'authmodule/index/login'
export const headimg = url + 'authmodule/menuInformation/currency/getImg'
export const headUpload = url + 'filemodule/currency/uploadFile/addHead'
export const roleType = url + 'authmodule/roleInformation/currency/addSelectRole'
export const selectRoleType = url + 'authmodule/roleInformation/currency/selectRole'
export const userManageInterface={
    select:`${userManage}select`,
    add:`${userManage}add`,
    edit:`${userManage}edit`,
    delete:`${userManage}delete`,
}

export const login_record = url + "authmodule/authTbManagerLoginLog/select"
export const role_name = url + 'authmodule/roleInformation/currency/select'//角色名称查询
export const command_list = url + 'authmodule/roleMenuElement/select'//权限管理列表
export const prohibit = url + 'authmodule/roleMenuElement/edit'//权限管理禁用
export const batch_Prohibit = url + 'authmodule/roleMenuElement/delete'//权限管理批量禁用

// 默认资源地址
export const headDefault = 'https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E9%BB%91%E9%AD%82q%E7%89%88%E5%A4%B4%E5%83%8F&hs=2&pn=0&spn=0&di=108460&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=2560012624%2C2609000220&os=1900824879%2C2621214668&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=%E9%BB%91%E9%AD%82q%E7%89%88%E5%A4%B4%E5%83%8F&objurl=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180706%2Fcbfd553807df46f0bc2da3269990d2cd.jpeg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bf5i7_z%26e3Bv54AzdH3FwAzdH3Fdnlmmc8n8_caddba&gsm=0&islist=&querylist='
