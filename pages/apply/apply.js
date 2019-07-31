Page({
  data: {
   
  },
  onLoad() {},

 verify(data){
    var verify = require('/utils/verify.js');
    var msg = require('/utils/msg.js');
    if(verify.isBlack(data.name)){
        msg.errorMsg("请您输入姓名");
        return false;
      }
      if(!verify.isCardNo(data.idCode)){
        msg.errorMsg("请输入正确的身份证号码");
        return false;
      }

      if(!verify.isMobileNo(data.mobile)){
        msg.errorMsg("请输入正确的手机号");
        return false;
      }

      if(verify.isBlack(data.pin)){
          msg.errorMsg("pin码必须输入");
          return false;  
      }

      if(data.pin.trim().length != 6){
          msg.errorMsg("pin码必须是6位");
          return false;
      }

      if(data.pinConfirm != data.pin){
          msg.errorMsg("两次pin码输入不一致");
          return false;
      }
      return true;
 },


  certApply: function(e) {
      var data = e.detail.value;
     if(!verify(data)){
         return;
     }
      var app = getApp();
      var sha = require('/utils/sha256.js');
     var paramUtils = require('/utils/param.js');

      var pinHash = sha.sha256(data.pin);
      var applyInfo = {
          name:data.name,
          idCode:data.idCode,
          mobile:data.mobile,
          pHash:pinHash
      }
      //封装申请证书的参数
     var param = paramUtils.certApplyParam(applyInfo,app.DD_USER_TOKEN);
     app.request(app.GATE_WAY,param,function(){
         //证书申请提交成功，处理页面跳转逻辑
        app.request(app.CERT_APPLY_URL,data,function(){
            dd.redirectTo({
                url: '/pages/index/index'
            });
        });
     },null);
  }
});
