
Page({
    data: {},
    onLoad(query) {
        this.setData({
            token:query.token,
            use:query.use,
            appName:query.appName
        });
     },
    
    /**
     * 校验pin码
     * @param pinCode       用户输入的pin码
     * @param successFun    服务器校验后如果pin码正确回调的函数，不能为null,回调方式：successFun(serverResData,pageObject)，serverResData是服务端返回的结果，pageObject是当前页面对象的引用
     * @param errorFun      服务器校验后如果pin码错误回调的函数，可以为null,为Null时提示服务端提示信息，回调方式：  errorFun(serverResData,pageObject)，serverResData是服务端返回的结果，pageObject是当前页面对象的引用
     */
    pin(pinCode, successFun, errorFun) {
        var app = getApp();
        var paramUtils = require("/utils/param.js");
        var msg = require("/utils/msg.js");
        var shaUtils = require("/utils/sha256.js")
        var pinHash = shaUtils.sha256(pinCode);
        let useToken = this.data.token;
        if(useToken == undefined || useToken == null || useToken == ''){
            msg.errorMsg('丢失的token');
            return;
        }
        let param = paramUtils.verifyPinParam(useToken, pinHash);
        let pageObject = this;
        app.request(app.GATE_WAY, param, function(res) {
            var respData = paramUtils.resp(res);
            //TEST 模拟pin码结果
            //respData.success = true;

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
     * pin码输入框回调事件
     */
    pinInput(e) {
        var msgUtils = require("/utils/msg.js");
        let v = e.detail.value
        if (v == null || v.length == 0) {
            return;
        }
        if (v.length == 6) {
            dd.showLoading({
                content: '校验中...'
            });
            this.pin(v, function(successData, pageObject) {
                //服务器返回pin码正确的回调
                dd.hideLoading();   //关闭遮罩层
                msgUtils.gotoSuccessPage('操作成功','/pages/cert/cert');
            }, function(errorData, pageObject) {
                //服务器返回pin码错误，或者别的问题的回调
                dd.hideLoading();
                msgUtils.errorMsg('pin码输入错误');
            });
        }
    }
});
 