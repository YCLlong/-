Page({
    data: {},
    onLoad() { },
    /**
          * 校验pin码
          */
    pin(pinCode, successFun, errorFun) {
        var app = getApp();
        var paramUtils = require("/utils/param.js");
        var msg = require("/utils/msg.js");
        var shaUtils = require("/utils/sha256.js")
        var pinHash = shaUtils.sha256(pinCode);

        let param = paramUtils.verifyPinParam(this.certUseToken, pinHash);
        let pageObject = this;
        app.request(app.GATE_WAY, param, function(res) {
            var respData = paramUtils.resp(res);
            if (!respData.success) {
                if (errorFun == null) {
                    msg.errorMsg(respData.msg);
                    return;
                }
                errorFun(res, pageObject);
            } else {
                successFun(res, pageObject);
            }
        }, null, pageObject);
    },

    /**
     * 关闭pin码输入面板
     */
    closePinPanel() {
        this.setData({
            pinHidden: true
        });
    },

    pinInput(e) {
        let v = e.detail.value
        if (v == null || v.length == 0) {
            return;
        }
        if (v.length == 6) {
            dd.showLoading({
                content: '校验中...'
            });
            this.pin(v, function(successData, pageObject) {
                debugger
                //服务器返回pin码正确的回调
                dd.hideLoading();   //关闭遮罩层
                pageObject.closePinPanel();//关闭pin码输入面板

                //其他逻辑，可以跳转到一个提示成功的界面
            }, function(errorData, pageObject) {
                //服务器返回pin码错误，或者别的问题的回调
                dd.hideLoading();
                debugger;
            });
        }
    }
});
