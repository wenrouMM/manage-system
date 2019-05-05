//使用自定义属性实现值验证
  var msgid="#msg"
  var info="info";
  $(document).on("blur","*[notnull]",function(){
    notnull($(this))
  })
  //判断为空
  function notnull(dom) {
    var value=dom.val();
    var title=dom.attr(info);
    if(value==''){
      $(msgid).html(title+"不能为空");
      return false;
    }
    return true;
  }
