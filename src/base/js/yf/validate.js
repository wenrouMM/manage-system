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
//判断url是否符合
  $(document).on("blur","*[url]",function(){
    if(notnull($(this))){
      var value=$(this).val()
      var reg=/^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/
      if(!reg.test(value)){
        $("#msg").html("您的url格式不符合");
      }
    }
  })
//判断中文是否符合
  $(document).on("blur","*[chinese]",function(){
    if(notnull($(this))){
      var value=$(this).val()
      var reg=/^[\u4e00-\u9fa5]+$/
      if(!reg.test(value)){
        $("#msg").html("您的名称格式不符合");
      }
    }
  })
//判断邮箱是否符合
  $(document).on("blur","*[email]",function(){
    if(notnull($(this))){
      var value=$(this).val()
      var reg=/^[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]@[a-zA-Z0-9][\w\.-]*[a-zA-Z0-9]\.[a-zA-Z][a-zA-Z\.]*[a-zA-Z]$/
      if(!reg.test(value)){
        $("#msg").html("您的邮箱格式不符合");
      }
    }
  })
  //判断身份证号码是否为空
  $(document).on("blur","*[idcard]",function(){
    if(notnull($(this))){
      var value=$(this).val()
      var reg=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if(!reg.test(value)){
        $("#msg").html("您的身份证格式不符合");
      }
    }
  })
//判断电话号码是否符合
  $(document).on("blur","*[photo]",function(){
    if(notnull($(this))){
      var value=$(this).val()
      var reg=/^1[34578]\d{9}$/
      if(!reg.test(value)){
        $("#msg").html("您的电话号码格式不符合");
      }
    }
  })
//判断密码的输入
  $(document).on("blur","*[pwd]",function(){
    if(notnull($(this))){
      var value=$(this).val()
      var reg=/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
      if(!reg.test(value)){
        $("#msg").html("您的密码格式不符合");
      }
    }
  })
//判断全英文的输入（大小写）
  $(document).on("blur","*[english]",function(){
    if(notnull($(this))){
      var value=$(this).val()
      var reg=/^[a-zA-Z]$/
      if(!reg.test(value)){
        $("#msg").html("您的输入格式不符合");
      }
    }
  })
//判断英文数字的输入
  $(document).on("blur","*[charnum]",function(){
    if(notnull($(this))){
      var value=$(this).val()
      var reg=/^[0-9a-zA_Z]+$/
      if(!reg.test(value)){
        $("#msg").html("您的输入格式不符合");
      }
    }
  })
  /*$(document).on("blur","*[charnum]",function(){
    if(notnull($(this))){
      charnum($(this))
    }
  })
  function charnum(dom) {
    var value = $(this).val();
    var reg =  /^[0-9a-zA_Z]+$/
    if (!reg.test(value)) {
      $("#msg").html("您的英文中文输入不符合");
      return false;
    }
    return true;
  }*/

$(document).on("click","*[submit]",function () {
  var status = $("*[status]");
  for (var i=0;i<status.length;i++){
    var statu = status.eq(i).attr("status");
      if(statu==false){
        status.eq(i).focus();
        return false;
    }
  }
  return true;
})
