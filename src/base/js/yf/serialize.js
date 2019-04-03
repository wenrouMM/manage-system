let loading;
export default {
  //表单序列化
  serializeForm(form) {
    var setForm = "";
    for (var key in form) {
      if (form.hasOwnProperty(key)) {
        setForm += '"' + form[key].name + '"' + ':' + '"' + form[key].value + '"' + ',';
      }
    }
    setForm = "{" + setForm.slice(0, setForm.length - 1) + "}";
    console.log(setForm);
    return JSON.parse(setForm);
  },
  //过滤掉数组中相同的对象
  deteleObject(obj) {
    var uniques = [];
    var stringify = {};
    for (var i = 0; i < obj.length; i++) {
      var keys = Object.keys(obj[i]);
      keys.sort(function (a, b) {
        return (Number(a) - Number(b));
      });
      var str = '';
      for (var j = 0; j < keys.length; j++) {
        str += JSON.stringify(keys[j]);
        str += JSON.stringify(obj[i][keys[j]]);
      }
      if (!stringify.hasOwnProperty(str)) {
        uniques.push(obj[i]);
        stringify[str] = true;
      }
    }
    uniques = uniques;
    return uniques;
  },
  //过滤数组中的空值
  trimSpace(array){
    for(var i = 0 ;i<array.length;i++)
    {
      if(array[i] == "" || typeof(array[i]) == "undefined")
      {
        array.splice(i,1);
        i= i-1;
      }
    }
    return array;
  },
  startLoading() {    //使用Element loading-start 方法
    loading = Loading.service({
      lock: true,
      text: '加载中……',
      background: 'rgba(0, 0, 0, 0.7)'
    })
  },
  endLoading() {    //使用Element loading-close 方法
    loading.close()
  }
}


