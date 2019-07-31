Page({
    data: {},
    onLoad(query) {
        var paramUtils = require('/utils/param.js');
        //第一次登录可能只有二维码信息
        var data = paramUtils.analyseQuery(query);
        var codeInfo = data.codeInfo;
        //页面加载
        var app = getApp();
        var userCode = app.genUserCode();
        if (userCode != null && userCode != '') {
            //免密登录
            this.loginNoPwd(userCode, codeInfo);
        } else {
            //授权登录
            this.login(codeInfo);
        }
    },

    /**
     * 免密登录
     */
    loginNoPwd(userCode, codeInfo) {
        var app = getApp();
        var paramUtils = require('/utils/param.js');
        var msg = require('/utils/msg.js');
        //API1，用免登Token去登录系统
        var loginParam = paramUtils.loginNoPwdParam(userCode);
        app.request(app.GATE_WAY, loginParam, function(res) {
            var resData = paramUtils.resp(res);
            if (resData.success) {
                var token = resData.data.token;
                if (token == null || token == undefined) {
                    msg.errorMsg('服务器返回参数错误');
                    return;
                }
                //将token更新到app
                app.DD_USER_TOKEN = token;

                //请求服务器，获取当前用户是否存在证书信息
                var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
                app.request(app.GATE_WAY, certInfoParam, function(certRes) {
                    var respData = paramUtils.resp(certRes);
                    if (resData.success) {
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

                        var url = "/pages/index/index" + paramUtils.indexUrl(codeInfo, certInfo);
                        //跳转到主页
                        dd.reLaunch({
                            url: url
                        });
                    } else {
                        msg.errorMsg(respData.msg);
                    }

                }, null);


            } else {
                msg.errorMsg(resData.msg);
            }
        }, null);
        if (certInfo != null) {
            var paramUtils = require('/utils/param.js');
            var param = paramUtils.certUrl(certInfo);
            url = url + param;
        }

    },

    /**
     * 授权登录
     * @param   codeInfo    第一次登录可能存在扫码的信息
     * 
     */
    login(codeInfo) {
        var app = getApp();
        var msg = require('/utils/msg.js');
        dd.getAuthCode({
            success: function(res) {
                var authCode = res.authCode;
                var param = {
                    //首次登录接口标识码
                    method: '1001',
                    code: authCode
                };
                app.request(app.GATE_WAY, param, function(res) {
                    var paramUtils = require('/utils/param.js');
                    var resData = paramUtils.resp(res);
                    if (resData.success) {
                        //获取用户免密标识
                        var userCode = resData.data.dtid;
                        if (userCode == null || userCode == undefined) {
                            msg.errorMsg('服务器返回参数错误');
                            return;
                        }
                        //将免密标识存储到缓存
                        try {
                            dd.setStorageSync({
                                key: app.DD_USER_CODE,
                                data: userCode
                            });
                        } catch (e) {
                            msg.errorMsg('写入缓存失败');
                            return;
                        }
                        //登录系统
                        this.loginNoPwd(userCode, codeInfo);
                    } else {
                        msg.errorMsg(resData.msg);
                    }
                }, null);
            },
            fail: function(err) {
                msg.errorMsg('授权失败');
            }
        });
    },
});
