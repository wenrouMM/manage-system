//测试环境
  var url = 'http://192.168.2.54:8088/'
var imgurl='http://192.168.2.54:8090/'
let fileUrl = 'http://192.168.2.54:8090/'  

// 用来管理接口的域名相关
//var url='http://127.0.0.1:8088/'


//var url = 'http://192.168.2.121:8088/'
/* var url = 'http://192.168.2.121:8088/'


var imgurl='http://192.168.2.121:8090/'
let fileUrl = 'http://192.168.2.121:8090/'  */

/*------ 文件上传模块 ------*/

export const uploadInt = {
  headImg:`${fileUrl}filemodule/uploadImg/addHead`,
  backImg:`${fileUrl}filemodule/uploadImg/addBackage`,
  menuImg:`${fileUrl}filemodule/uploadImg/addMenu`,
  editorImg:`${fileUrl}filemodule/uploadImg/addEditorImg`,
  editorFile:`${fileUrl}filemodule/uploadFile/addEnclosure`,
  editorVideo:`${fileUrl}filemodule/uploadVideo/addShortVideo`,
  preimg:`${fileUrl}filemodule/showFile/getShow`,
  showFile:`${fileUrl}filemodule/showFile/getFile`
}
/*--- 损坏清点 ---*/
export const damageInt = {
  outline:`${url}bookcollectionmodule/countDamage/getFristPage`,
  detail:`${url}bookcollectionmodule/countDamage/getSecondPage`
}
/*------ 流通管理模块 ------*/
/*--- 流通记录 ---*/
// 报损记录与历史记录与处理操作
export const damageCotInt = {
  search:`${url}borrowmodule/damageLog/select`,
  deal:`${url}borrowmodule/damageLog/deal`,
  searchHis:`${url}borrowmodule/damageHis/select`
}
/*--- 借阅管理 ---*/
// 借书页面

var borrow = url + 'tibetmuseummodule/bookRFID/'
export const borrowInt = {
  selectCode: `${url}borrowmodule/borrow/selectByCode`,
  selectRfid: `${borrow}borrowmodule/return/selectByrfid`
}
// 还书页面
export const returnInt = {
  selectCode: `${url}borrowmodule/return/selectByCode`,
  selectRfid: `${borrow}borrowmodule/borrow/selectByrfid`
}
// 续借页面
var bookOperate = url + 'borrowmodule/'
export const bookOperateInt = {
  borrow: `${bookOperate}borrow/out`,
  sell: `${bookOperate}return/in`,
  renew:`${url}equipmentmodule/bookinfo/renewBooks`,
  userInfo:`${url}borrowmodule/borrow/getReaderInfo`,
  return:`${url}borrowmodule/borrow/getReaderLog`,
  history:`${url}borrowmodule/borrow/getReaderHis`
}
// 报损页面
export const bookDamageInt = {
  search:`${url}systemmodule/damage/select`,
  damage:`${url}bookcollectionmodule/collection/letDamage`
}



/*------ 读者管理模块 ------*/
// 押金充值和判断
export const rechargeInt = {
  juge:`${url}financemodule/depositRecord/vMoney`,
  deposit:`${url}financemodule/depositRecord/add`,
  logout:`${url}financemodule/readerTbCardLogout/Logout`, // 注销
  lose:`${url}readermodule/readerTbCardInfo//cardReport`, // 挂失
  cancelLost:`${url}readermodule/readerTbCardInfo/cardReportCancel`, // 取消挂失
  supply:`${url}readermodule/readerTbCardInfo/cardReissue`,
  option:`${url}readermodule/readerTbCardGradeinfo/currency/selectEffectiveDropBoxAll`
}

//读者卡信息
var cardInfo = url + 'tibetmuseummodule/readerTbCardInfo/'
export const cardInfoInt = {
  select: `${url}readermodule/readerTbCardInfo/select`,
  cardReport: `${cardInfo}currency/cardReport`, // 挂失/取办
  cardReissue: `${cardInfo}currency/cardReissue`,// 补办
  cogradient: `${cardInfo}synchronizationReader`, // 登记读者卡
  add: `${cardInfo}currency/add`, // 办卡
  selectUser: `${cardInfo}selectUserInfoByCard`,
  option:`${url}readermodule/readerTbCardGradeinfo/currency/selectEffectiveDropBoxAll`
}
export const getCardInt = url + 'tibetmuseummodule/readerTbCardGradeinfo/currency/selectAllDropBox'
//读者卡等级

export const cardLevelInt = {
  select: `${url}readermodule/readerTbCardGradeinfo/select`,
  add: `${url}readermodule/readerTbCardGradeinfo/add`,
  edit: `${url}readermodule/readerTbCardGradeinfo/edit`,
  delete: `${url}readermodule/readerTbCardGradeinfo/delete`,
}
/*------ 系统设置模块  ------*/

// 发布公告
export const editorInt = {
  add:`${url}systemmodule/sysTbNoticeInfo/add`,
  select: `${url}systemmodule/sysTbNoticeInfo/selectPage`,
  edit:`${url}systemmodule/sysTbNoticeInfo/edit`,
  delete:`${url}systemmodule/sysTbNoticeInfo/delete`,
  detail:`${url}systemmodule/sysTbNoticeInfo/selectOne`,
  moreDetail:`${url}systemmodule/sysTbNoticeInfo/selectMore`
}
// 数据字典
export const bookWordInt = {
  search:`${url}systemmodule/sysTbParamInfo/select`,
  edit:`${url}systemmodule/sysTbParamInfo/edit`
}
//登陆页
export const login = {
  yzm:`${url}authmodule/index/imgVerification?`,//验证码接口
}
export const powerControl=url+'authmodule/roleInformation/select' //权限表格查询
//菜单页面
export const menu = {
  select:`${url}authmodule/menuInformation/select`,//菜单查询接口
  add:`${url}authmodule/menuInformation/add`,//菜单添加接口
  delete:`${url}authmodule/menuInformation/delete`,//菜单删除接口
  type:`${url}basemodule/currency/sysTbDictCode/select`, //菜单类型接口
  img:`${imgurl}filemodule/uploadImg/addMenu`, //图片上传接口
  button:`${url}authmodule/menuInformation/currency/selectMenuById`, //点击节点发请求
}
// 首页
export const indexInt = {
  borrow:`${url}borrowmodule/index/selectTodayBorrow`,
  return:`${url}borrowmodule/index/selectTodayReturn`,
  book:`${url}tibetmuseummodule/index/selectCount`,
  record:`${url}borrowmodule/index/getNewLog`,
  fan:`${url}tibetmuseummodule/index/getHotType`,
  pillar:`${url}borrowmodule/index/selectNearBorrowInfo`,
  cardOn:`${url}tibetmuseummodule/readerTbCardInfo/currency/handleCardByOneDay`,
  notice:`${url}systemmodule/sysTbNoticeInfo/selectLittle`
}

// 权限模块的API
// 权限管理模块
export const control = {
  tree:`${url}authmodule/currency/getAllMenuAndElement`,
  add:`${url}authmodule/roleMenuElement/edit`, //权限添加
}

var userManage = url + 'authmodule/managerInformation/'
var roleManage = url + 'authmodule/roleInformation/'
var powerMangae = url + 'authmodule/roleMenuElement/'

export const userManageInterface = {
  select: `${userManage}select`,
  add: `${userManage}add`,
  edit: `${userManage}edit`,
  delete: `${userManage}delete`,
}
export const roleManageInt = {
  select: `${roleManage}select`,
  add: `${roleManage}add`,
  edit: `${roleManage}edit`,
  delete: `${roleManage}delete`,
}
export const powerMangaeInt = {
  select: `${powerMangae}select`,
  add: `${powerMangae}add`,
  edit: `${powerMangae}edit`,
  delete: `${powerMangae}delete`,
  prohibit:`${powerMangae}prohibit`
}
export const login_record = url + "authmodule/authTbManagerLoginLog/select" //登录记录接口
export const role_name = url + 'authmodule/roleInformation/currency/select'//角色名称查询
export const command_list = url + 'authmodule/roleMenuElement/select'//权限管理列表
export const prohibit = url + 'authmodule/roleMenuElement/edit'//权限管理禁用
export const batch_Prohibit = url + 'authmodule/roleMenuElement/delete'//权限管理批量禁用


// 图书模块
var bookMode = url + 'tibetmuseummodule/libraryInformationManagementPage/'
export const bookModeInt = {
  selectOne:`${bookMode}selectOne`,
  select:`${bookMode}select`
}
//图书出版社页面
export const bookpublish = {
  select:`${url}bookcollectionmodule/libraryPressManagementPage/select`,//图书出版社初始化查询接口
  city:`${url}bookcollectionmodule/libraryPressManagementPage/selectCity `, //图书出版社城市信息
  add:`${url}bookcollectionmodule/libraryPressManagementPage/add`, //图书出版社添加信息
}
//图书类型查询
export const booktype = url + 'bookmodule/bookTbType/select' // 预览图片前缀
//图书信息
export const booknews = {
  table:`${url}bookmodule/bookTbInfo/select`, //图书信息表格接口
  grade:`${url}bookmodule/bookTbType/selectAllBookType`, //图书信息类型名称下拉接口
}
//馆内图书信息
export const libbooknews = {
  table:`${url}tibetmuseummodule/libraryInformationManagementPage/select`, //馆内图书信息查询
  add:`${url}tibetmuseummodule/TbookTbInfo/add' //馆内图书信息添加`,
  edit:`${url}tibetmuseummodule/libraryInformationManagementPage/edit`, //馆内图书信息修改下架状态
  type:`${url}tibetmuseummodule/libraryBookTypeManagementPage/select`, //馆内图书类型查询
}
//图书登记
export const libbookRegist = {
  barcode:`${url}tibetmuseummodule/libraryBookRegistrationPage/selectOne`, //图书登记条码接口查详情
  add:`${url}tibetmuseummodule/libraryBookRegistrationPage/add`, //图书登记添加
  publish:`${url}tibetmuseummodule/libraryBookRegistrationPage/selectPressTree`, //图书登记出版社
  type:`${url}tibetmuseummodule/libraryBookRegistrationPage/selectAllBookType`, //图书登记书籍类型
}
//图书位置绑定
export const bookLocation = {
  location:`${url}bookcollectionmodule/collectionBing/setBing`, //图书位置绑定
  barcode:`${url}bookcollectionmodule/collectionBing/selectByCode`,//图书位置条码
  tree:`${url}bookcollectionmodule/collectionBing/selectLocationTree`, //图书位置树
}
//图书位置信息
export const bookLocationInfo = {
  LendState:`${url}bookcollectionmodule/infoPage/editLendState`, //上架修改
  select:`${url}bookcollectionmodule/infoPage/select`,//分页查询
}
//藏馆信息
export const libnews = {
  add:`${url}bookmodule/booklib/add`, //藏馆信息
  select:`${url}bookmodule/booklib/select`, //藏馆表格信息
}
//押金记录
export const deposit = {
  table:`${url}tibetmuseummodule/currency/depositRecord/select`,//查询表格
  details:`${url}tibetmuseummodule/currency/depositRecord/selectDetails`,//押金记录详情
  money:`${url}tibetmuseummodule/currency/depositRecord/add`, //押金充值
}
//逾期记录
export const overdue = {
  table:`${url}borrowmodule/expectLog/select`, //逾期查询表格
  phone:`${url}tibetmuseummodule/currency/expectLog/selectUserPhone`, //逾期催还电话
  history:`${url}borrowmodule/expectHistoryLog/select`, //逾期历史记录查询表格
  money:`${url}tibetmuseummodule/currency/expectLog/overdueMon`, //逾期金额查询
  make:`${url}tibetmuseummodule/currency/expectLog/handle` //逾期金额处理
}
//借阅记录
export const loan = {
  table:`${url}borrowmodule/log/select`, //借阅记录表格查询
  history:`${url}borrowmodule/history/select`, //借阅历史记录
}
//失信记录
export const dishonesty = {
  table:`${url}tibetmuseummodule/loseLog/select`,//失信记录表格查询
  revoke:`${url}tibetmuseummodule/loseLog/revoke`, //失信撤销操作
  history:`${url}tibetmuseummodule/loseHistoryLog/select`//失信历史记录
}
//馆内图书类型
/*------ 区域模块 ------*/
//库房模块
var store = url + 'regionmodule/areaManagementPage/store'
export const storeInt = {
  select: `${store}select`,
  add: `${store}add`,
  edit: `${store}edit`,
  delete: `${store}delete`
}
//区模块
var region = url + 'regionmodule/areaManagementPage/region'
export const regionInt = {
  select: `${region}select`,
  add: `${region}add`,
  edit: `${region}edit`,
  delete: `${region}delete`,
  selectBind: `${region}selectBind`,
  bind: `${region}editBind`
}
//层架绑定
export const layerFrame = {
  tree:`${url}regionmodule/layerKidnappingBindingPage/selectTree`, //层架绑定树
  save:`${url}regionmodule/layerKidnappingBindingPage/edit'`, //层架绑定修改
}


/*====== 藏馆系统 ======*/

// 读者卡类型
var cardType = url + 'tibetmuseummodule/readerTbCardTypeinfo/'
export const cardTypeInt = {
  select: `${cardType}select`,
  add: `${cardType}add`,
  edit: `${cardType}edit`,
  delete: `${cardType}delete`
}

/*------ 通用接口 ------*/
// 办卡接口
export const addCardInt = {
  searchId:`${url}readermodule/readerTbCardInfo/selectUserInfoByCard`,
  validateId:`${url}readermodule/readerTbCardInfo/reissueCost`,
  addCard:`${url}readermodule/readerTbCardInfo/add`
}
//通用接口
export const photoUrl = 'http://192.168.2.54' // 预览图片前缀
export const loginInter = url + 'authmodule/index/login'
export const headUpload = imgurl + 'filemodule/uploadImg/addHead' //
export const roleType = url + 'authmodule/roleInformation/currency/addSelectRole' // 添加权限管理下拉
export const selectRoleType = url + 'authmodule/roleInformation/currency/selectRole' // 角色管理下拉

// 读者卡信息
export const cardReport = url + 'tibetmuseummodule/readerTbCardInfo/currency/cardReport' // 挂失
export const cardReissue = url + 'tibetmuseummodule/readerTbCardInfo/currency/cardReissue' // 补办
// 读者卡等级模块
export const selectEffect = url + 'tibetmuseummodule/readerTbCardGradeinfo/currency/selectEffectiveDropBox' // 获取未被禁用的 没有被使用的 读者卡等级类型下拉框
export const selectAllDrop = url + 'tibetmuseummodule/readerTbCardGradeinfo/currency/selectAllDropBox' // 获取所有读者卡等级类型列表下拉框

// 读者卡类型模块
export const readerType = url + 'tibetmuseummodule/readerTbCardTypeinfo/currency/selectEffectiveDropBox' // 类型 部分
export const levelOption = url + 'tibetmuseummodule/readerTbCardTypeinfo/currency/selectAllDropBox' //  全部类型
export const unBanOption = url + 'tibetmuseummodule/readerTbCardGradeinfo/currency/selectEffectiveDropBoxAll'  // 所有的 没被禁用的 等级下拉框

//系统管理损坏管理
export const damage={
  select: `${url}systemmodule/damage/select`,
  add: `${url}systemmodule/damage/add`,
  edit: `${url}systemmodule/damage/edit`,
  delete: `${url}systemmodule/damage/delete`
}
//寒暑假设置
export const vacation={
  select:`${url}systemmodule/holiday/select`,
  add:`${url}systemmodule/holiday/add`,
  edit:`${url}systemmodule/holiday/edit`,
}

//充值设置
export const recharge ={
  select:`${url}financemodule/depositRecord/select`,
  add:`${url}financemodule/depositRecord/add`,
  edit:`${url}systemmodule/holiday/edit`,
  logout:`${url}financemodule/readerTbCardLogout/Logout`
}

//书籍典藏
export const collection ={
  select:`${url}bookcollectionmodule/collection/select`,
  add:`${url}bookcollectionmodule/collection/add`,
  edit:`${url}bookcollectionmodule/collection/edit`,
  isbn:`${url}bookcollectionmodule/collection/selectFromCata`,
  state:`${url}bookcollectionmodule/collection/editState`,
  delete:`${url}bookcollectionmodule/collection/delete`,
  letLeave:`${url}bookcollectionmodule/collection//letLeave`,
  harm:`${url}bookcollectionmodule/collection/letLeave`,
  letRemove:`${url}bookcollectionmodule/collection/letRemove`,
  harmSelect:`${url}systemmodule/damage/select`,
  damage:`${url}bookcollectionmodule/collection/letDamage`
}

//采购管理
export const purchasing ={
  select:`${url}bookcollectionmodule/procuremen/select`,
  add:`${url}bookcollectionmodule/procuremen/add`,
  delete:`${url}bookcollectionmodule/procuremen/delete`,
  edit:`${url}bookcollectionmodule/procuremen/edit`,
}

//书籍编目
export const catalog ={
  select:`${url}bookcollectionmodule/cataTbBookInfo/select`,
  add:`${url}bookcollectionmodule/cataTbBookInfo/add`,
  delete:`${url}bookcollectionmodule/cataTbBookInfo/delete`,
  edit:`${url}bookcollectionmodule/cataTbBookInfo/edit`,
  typeTree:`${url}bookcollectionmodule/cataTbBookInfo/selectAllBookType`,
  publishTree:`${url}bookcollectionmodule/cataTbBookInfo/selectPressTree`,
  language:`${url}bookcollectionmodule/cataTbBookInfo/getLanguage`
}

//个人中心
export const PersonalCentre={
  userInfo:`${url}authmodule/managerInformation/getNowUser`,
  editPassword:`${url}authmodule/loginInformation/currency/edit`,
  editUsername:`${url}authmodule/managerInformation/editPersonalCenterName`,
  resetPassword:`${url}authmodule/loginInformation/edit`
}

//注销记录
export const logOut=url+'financemodule/readerTbCardLogout/select'

//逾期费用记录
export const overdueCostCirculation=url+'financemodule/readetTbOverdueExpensesLog/select'

//个人中心头像修改
export const editHeadPortrait=url+'authmodule/managerInformation/editPersonalCenterHeade'
export const editimgFile='http://192.168.2.54:8090/filemodule/showFile/getShow'
