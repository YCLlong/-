Page({
  data: {
   
  },
  onLoad() {},
  certApply: function(e) {
      var data = e.detail.value;
      var name = data.name;
      var idCode = data.idCode;
      var mobile = data.mobile;
      var pin = data.pin;
      var pinConfirm = data.pinConfirm;

      var app = getApp();
      if(name == null || name.trim() == ''){
        app.showError("请您输入姓名");
        return;
      }
      if(!app.isCardNo(idCode)){
        app.showError("请输入正确的身份证号码");
        return;
      }

      if(!app.isMobileNo(mobile)){
        app.showError("请输入正确的手机号");
        return;
      }

      if(pin == null || pin == ''){
          app.showError("pin码必须输入");
          return;  
      }

      if(pin.trim().length != 6){
          app.showError("pin码必须是6位");
          return;
      }

      if(pinConfirm != pin){
          app.showError("两次pin码输入不一致");
          return;
      }
    
     app.request(app.CERT_APPLY_URL,data,function(){
         //证书申请提交成功，处理页面跳转逻辑



         
        dd.redirectTo({
            url: '/pages/index/index'
        });



     },null);
  }
});
