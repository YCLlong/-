var app = getApp();
var paramUtils = require('/utils/param.js');
var msg = require('/utils/msg.js');
var verify = require('/utils/verify.js');

Page({
    data: {
        verifyCodeDisable: true,
        applyDisable: true,
        verifyCodeMsg: '获取',
        countDown: 60,
        lastApplyTime:0
    },
    onLoad() {
        dd.showLoading({
            content: '正在检测证书信息...'
        });
        //请求服务器，获取当前用户的证书信息
        var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
        app.request(app.GATE_WAY, certInfoParam, function(certRes) {
            dd.hideLoading();
            var respData = paramUtils.resp(certRes);
            if (respData.success) {
                var certInfo = respData.data;
                if (certInfo != undefined && certInfo != null) {
                    app.existCert = true;
                    app.certInfo = certInfo;
                    //存在证书的话就跳转到证书界面
                    dd.redirectTo({
                        url: "/pages/cert/cert"
                    });
                }
            } else {
                //4016表示用户还没申请证书,其他错误就跳转错误页面
                if(respData.code != '4016'){
                     //跳转到错误页面
                     msg.gotoErrorPage(respData.msg, null, null);
                }
            }
        }, null);
    },
    onShow(){
        var lastTime = dd.getStorageSync({ key: app.VERIFY_MSG_CODE_LAST_TIME }).data;
        if(lastTime == null || lastTime == undefined){
             this.setData({
                verifyCodeDisable:false,
                applyDisable:true
            });
            return;
        }
        var nowDate = new Date().getTime();
        var inteval = Math.round((nowDate - lastTime)/1000);
        if(inteval < 60){
            this.setData({
                countDown:60 - inteval,
                verifyCodeDisable:true
            });
            this.countDownStep();
        }else{
             this.setData({
                verifyCodeDisable:false
            });
        }
    },
    onPullDownRefresh() {
        dd.stopPullDownRefresh();
    },

    verifyParam(data) {
        var verify = require('/utils/verify.js');
        var msg = require('/utils/msg.js');
        if (verify.isBlank(data.name)) {
            msg.errorMsg("请您输入姓名");
            return false;
        }
        if (!verify.isCardNo(data.code)) {
            msg.errorMsg("请输入正确的身份证号码");
            return false;
        }

        if (!verify.isMobileNo(data.phone)) {
            msg.errorMsg("请输入正确的手机号");
            return false;
        }

        if (verify.isBlank(data.pin)) {
            msg.errorMsg("pin码必须输入");
            return false;
        }

        if (data.pin.trim().length != 6) {
            msg.errorMsg("pin码必须是6位");
            return false;
        }

        if (data.pinConfirm != data.pin) {
            msg.errorMsg("两次pin码输入不一致");
            return false;
        }

        
        if (verify.isBlank(data.verifyCode)) {
            msg.errorMsg("验证码必须输入");
            return false;
        }

        if (data.verifyCode.trim().length != 4) {
            msg.errorMsg("验证码必须是4位");
            return false;
        }

        if(this.data.applyDisable){
             msg.errorMsg("您必须先获取手机验证码");
            return false;
        }

        
        return true;
    },


    certApply: function(e) {
        //防重复提交，1秒内不允许多次提交
        if(new Date().getTime() - this.data.lastApplyTime <1000){
            return;
        }
        this.setData({
            lastApplyTime:new Date().getTime()
        });

        var data = e.detail.value;
        if (!this.verifyParam(data)) {
            return;
        }
        var sha = require('/utils/sha256.js');
        var pinHash = sha.sha256(data.pin);
        var applyInfo = {
            name: data.name,
            code: data.code,
            phone: data.phone,
            pin: pinHash,
            verifyCode:data.verifyCode
        };

        //封装申请证书的参数
        var param = paramUtils.certApplyParam(applyInfo, app.DD_USER_TOKEN);
        dd.showLoading({
            content: '正在申请证书，请稍候...'
        });
        app.request(app.GATE_WAY, param, function(res) {
            var respData = paramUtils.resp(res);
            if (!respData.success) {
                dd.hideLoading();
                if(respData.code == '7001' || respData.code == '7002' || respData.code == '7003' || respData.code == '7004'){
                    msg.errorMsg(respData.msg);
                }else{
                    msg.gotoErrorPage(respData.msg, null, null);
                }
                return;
            }
            //请求服务器，获取当前用户的证书信息
            var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
            app.request(app.GATE_WAY, certInfoParam, function(certRes) {
                dd.hideLoading();
                var respData = paramUtils.resp(certRes);
                if (respData.success) {
                    var certInfo = respData.data;
                    if (certInfo != undefined && certInfo != null) {
                        app.existCert = true;
                        app.certInfo = certInfo;
                    }
                    var url = "/pages/cert/cert";
                    dd.redirectTo({
                        url: url
                    });
                } else {
                    //跳转到错误页面
                    msg.gotoErrorPage(respData.msg, null, null);
                }
            }, null);
        }, null);
    },

    /**
     * 输入手机号时绑定
     */
    phoneInput(e) {
        this.setData({
            phone: e.detail.value,
        });
    },

    /**
     * 获取短信验证码
     */
    getVerifyCode() {
        if (this.data.verifyCodeDisable) {
            return;
        }

        if (verify.isBlank(this.data.phone) || !verify.isMobileNo(this.data.phone)) {
            msg.errorMsg("请输正确的入手机号");
            return;
        }

        this.setData({
            verifyCodeDisable: true,
            applyDisable:false,
            verifyCodeMsg: '重新获取(60s)'
        });

        //写入最后一次获取短信验证码的毫秒时间戳
        var lastVerifyCodeTime = new Date().getTime();
        try {
            dd.setStorageSync({
                key: app.VERIFY_MSG_CODE_LAST_TIME,
                data: lastVerifyCodeTime
            });
        } catch (e) {
            msg.errorMsg('写入缓存失败');
            return;
        }
        this.countDownStep();

        //调用短信验证码接口
        var param = paramUtils.verifyCodeRequestParam(this.data.phone, app.DD_USER_TOKEN);
        app.request(app.GATE_WAY, param, function(res) {
            var respData = paramUtils.resp(res);
            if (!respData.success) {
                msg.errorMsg(respData.msg);
                return;
            }
            msg.successMsg("验证码发送成功。");
        });
    },

    countDownStep(){
        this.inteval = setInterval(()=>{
            this.data.countDown--;
            this.setData({
                verifyCodeDisable: true,
                verifyCodeMsg:'重新获取(' + this.data.countDown + 's)'
            });
            if(this.data.countDown == 0){
                clearInterval(this.inteval);
                this.setData({
                    verifyCodeMsg:'获取',
                    countDown: 60,
                    verifyCodeDisable:false
                });
            }
        },1000);
            
    }
});
