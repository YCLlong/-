Page({
    data: {

    },
    onLoad() { },
    onPullDownRefresh() {
        dd.stopPullDownRefresh();
    },

    verify(data) {
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
        return true;
    },


    certApply: function(e) {
        var data = e.detail.value;
        if (!this.verify(data)) {
            return;
        }
        var app = getApp();
        var sha = require('/utils/sha256.js');
        var paramUtils = require('/utils/param.js');
        var msg = require('/utils/msg.js');

        var pinHash = sha.sha256(data.pin);
        var applyInfo = {
            name: data.name,
            code: data.code,
            phone: data.phone,
            pin: pinHash
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
                msg.errorMsg(respData.msg);
                return;
            }
            //请求服务器，获取当前用户的证书信息
            var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
            app.request(app.GATE_WAY, certInfoParam, function(certRes) {
                dd.hideLoading();
                var respData = paramUtils.resp(certRes);
                if (respData.success) {
                    var certInfo = respData.data.certData;
                    //TEST 模拟获取用户信息
                    // certInfo = {
                    //     name: '小龙',
                    //     sn: '10086',
                    //     code: '110101199003073490',
                    //     notBefore: '2019年8月1日',
                    //     notAfter: '2020年8月1日',
                    //     status: 2000
                    // };

                    var url = "/pages/index/index" + paramUtils.certUrl(certInfo);
                    //跳转到主页
                    dd.reLaunch({
                        url: url
                    });
                } else {
                     //跳转到错误页面
                    msg.gotoErrorPage(respData.msg, null, null);
                }
            }, null);
        },null);
    }
});
