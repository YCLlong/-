Page({
    data: {

    },
    onLoad() { },

    verify(data) {
        var verify = require('/utils/verify.js');
        var msg = require('/utils/msg.js');
        if (verify.isBlack(data.name)) {
            msg.errorMsg("请您输入姓名");
            return false;
        }
        if (!verify.isCardNo(data.idCode)) {
            msg.errorMsg("请输入正确的身份证号码");
            return false;
        }

        if (!verify.isMobileNo(data.mobile)) {
            msg.errorMsg("请输入正确的手机号");
            return false;
        }

        if (verify.isBlack(data.pin)) {
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
            idCode: data.idCode,
            mobile: data.mobile,
            pHash: pinHash
        };
        //封装申请证书的参数
        var param = paramUtils.certApplyParam(applyInfo, app.DD_USER_TOKEN);
        app.request(app.GATE_WAY, param, function(res) {
            var respData = paramUtils.resp(res);
            if (!respData.success) {
                msg.errorMsg(respData.msg);
                return;
            }
            //请求服务器，获取当前用户的证书信息
            var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
            app.request(app.GATE_WAY, certInfoParam, function(certRes) {
                var respData = paramUtils.resp(certRes);
                if (respData.success) {
                    var certInfo = respData.data.certData;
                    //拿到证书信息开始跳转到主页
                    // certInfo = {
                    //     cn: '123ZJCA123123',
                    //     sn: '10086',
                    //     idCode: '340826199909024459',
                    //     notBefore: '2020年8月8日',
                    //     notAfter: '2020年8月8日',
                    //     status: 2000
                    // };

                    var url = "/pages/index/index" + paramUtils.certUrl(certInfo);
                    //跳转到主页
                    dd.reLaunch({
                        url: url
                    });
                } else {
                    msg.errorMsg(respData.msg);
                }
            }, null);
        }, null);
    }
});
