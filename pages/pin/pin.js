
Page({
    data: {
        Length: 6,       //输入框个数
        isFocus: true,    //聚焦
        Value: "",        //输入的内容
        ispassword: true, //是否密文显示 true为密文， false为明文。
        disabled: true,
        display: "none",
    },
    onLoad(query) {
        this.setData({
            token: query.token,
            use: query.use,
            appName: query.appName
        });
    },

    bindButtonTap() {
        // blur 事件和这个冲突
        setTimeout(() => {
            this.onFocus();
        }, 100);
    },
    onFocus() {
        this.setData({
            focus: true,
        });
    },
    onBlur() {
        this.setData({
            focus: false,
        });
    },

    /**
     * pin码输入框回调事件
     */
    inputPin(e) {
        var msgUtils = require("/utils/msg.js");
        var v = e.detail.value;
        var vlen = v.length;
        if (vlen == 6) {
            this.setData({
                disabled: false,
            })
            dd.hideKeyboard();
            dd.showLoading({
                content: '校验中...'
            });
            this.pin(v, function(successData, pageObject) {
                //服务器返回pin码正确的回调
                dd.hideLoading();   //关闭遮罩层
                msgUtils.gotoSuccessPage('操作成功', '/pages/cert/cert');
            }, function(errorData, pageObject) {
                //服务器返回pin码错误，或者别的问题的回调
                dd.hideLoading();
                msgUtils.errorMsg('pin码输入错误');
            });
        } else {
            this.setData({
                disabled: true,
            })
        }
        this.setData({
            Value: v,
        })
    },
    sixPin() {
        var sv = this.detail.value;
        console.log(sv);

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
        if (useToken == undefined || useToken == null || useToken == '') {
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
                errorFun(respData, pageObject);
            } else {
                successFun(respData, pageObject);
            }
        }, null, pageObject);
    }
});
