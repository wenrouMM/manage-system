/*element-ui表单电话格式验证*/
export function isvalidPhone(str) {
  const reg = /^[0-9]{1,11}$/
  return reg.test(str)
}
export function isvalidNumber(str) {
  const reg =/^[0-9]*$/
  return reg.test(str)
}
