/*element-ui表单电话格式验证*/
export function isvalidPhone(str) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
  return reg.test(str)
}
export function isvalidNumber(str) {
  const reg =/^[0-9]*$/
  return reg.test(str)
}
