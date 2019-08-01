Component({
    mixins: [],
    data: {
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
                //TEXT 模拟获取证书使用临时token
                certUseToken = '10086';
                if (verifyUtils.isBlank(certUseToken)) {
                    msgUtils.errorMsg("服务器返回参数错误");
                    return;
                }
              
                //跳转pin码输入界面
                dd.navigateTo({
                    url: '/pages/pin/pin?token=' + certUseToken
                });
            }, null);

        }
    },
});
