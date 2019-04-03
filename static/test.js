function commonArr(arr1, arr2) {
  var endarr = []
  var arr1L = arr1.length
  var arr2L = arr2.length

  for (let i = 0; i < arr1L; i++) {
    for (let j = 0; j < arr2L; j++) {
      if (arr1[i] === arr2[j]) {
        var common = arr1[i]
        endarr.push(common)
      }
    }
  }
  console.log(endarr)

}
commonArr([1,2,3],[1,2])();
// 测试提交
// 邮箱设置的不对 现在试试
