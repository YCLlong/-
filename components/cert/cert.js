Component({
    mixins: [],
    data: {
        pinHidden: true,
        certUseToken: null
    },
    props: {

    },
    //页面渲染后回调
    didMount() {
        let codeInfo = this.props.codeInfo;
        if (codeInfo == null || codeInfo == undefined) {
            return;
        }
        //存在二维码信息，申请使用证书
        this.certUseApply(codeInfo);
    },
    didUpdate() { },
    didUnmount() { },
    methods: {
        /**
         * 扫二维码
         */
        scan() {
            var msgUtils = require("/utils/msg.js")
            dd.scan({
                type: 'qr',
                success: (res) => {
                    dd.alert({ title: '二维码内容', content: res.code });
                },
                fail: (res) => {
                    msgUtils.errorMsg("扫码失败！错误代码：" + res.code);
                }
            });
        },

        /**
         * 申请使用证书
         * 三个必须参数
         * appCode  应用code
         * webId    调用方某个标识，给调用方的扩展字段
         * code     挑战码
         */
        certUseApply(codeInfo) {
            var app = getApp();
            var paramUtils = require("/utils/param.js");
            var verifyUtils = require("/utils/verify.js");
            var msgUtils = require("/utils/msg.js")
            if (codeInfo == null || codeInfo == undefined || verifyUtils.isBlank(codeInfo.appCode) || verifyUtils.isBlank(codeInfo.webId) || verifyUtils.isBlank(codeInfo.code)) {
                msgUtils.errorMsg("我们无法处理这个二维码");
                return;
            }

            //封装使用证书请求参数
            let param = paramUtils.certUseParam(codeInfo, app.DD_USER_TOKEN);
            app.request(app.GATE_WAY, param, function(res) {
                var respData = paramUtils.resp(res);
                if (!respData.success) {
                    msg.errorMsg(respData.msg);
                    return;
                }
                var certUseToken = respData.data.token;
                if (verifyUtils.isBlank(applyCertUseToken)) {
                    msgUtils.errorMsg("服务器返回参数错误");
                    return;
                }
                //保存token，并显示pin码输入界面
                this.setData({
                    pinHidden: false,
                    certUseToken: certUseToken
                });
            }, null);

        },

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
    },
});
