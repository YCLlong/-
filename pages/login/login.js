Page({
    data: {},
    onLoad(query) {
        var paramUtils = require('/utils/param.js');
        //TEST 模拟扫码信息
        // query = {
        //     appCode: '20190808155240KH2',
        //     webId: '1',
        //     code: '2',
        //     methodType: 10
        // }

        //第一次登录可能有二维码信息
        var codeInfo = paramUtils.analyseCode(query);
        this.setData({
            codeInfo: codeInfo
        });
        //页面加载
        var app = getApp();
        var userCode = app.genUserCode();
        if (userCode != null && userCode != '') {
            //免密登录
            this.loginNoPwd(userCode, codeInfo);
        }
        // } else {
        //     //授权登录  
        //     this.loginAuth(codeInfo, this);
        // }
    },
    onPullDownRefresh() {
        dd.stopPullDownRefresh();
    },

    //点击登录按钮进行授权登录
    login() {
        this.loginAuth(this.data.codeInfo, this);
    },

    /**
     * 免密登录
     */
    loginNoPwd(userCode, codeInfo) {
        dd.showLoading({
            content: '登录中...'
        });
        var app = getApp();
        var paramUtils = require('/utils/param.js');
        var msg = require('/utils/msg.js');
        //API1，用免登Token去登录系统
        var loginParam = paramUtils.loginNoPwdParam(userCode);
        app.request(app.GATE_WAY, loginParam, function(res) {
            var resData = paramUtils.resp(res);
            if (resData.success) {
                var token = resData.data.token;

                //TEST  模拟token
                //token = '123456789';
                if (token == null || token == undefined) {
                    msg.errorMsg('服务器返回参数错误');
                    return;
                }
                //将token更新到app全局对象
                app.DD_USER_TOKEN = token;

                //请求服务器，获取当前用户证书信息
                var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
                app.request(app.GATE_WAY, certInfoParam, function(certRes) {
                    var respData = paramUtils.resp(certRes);
                    dd.hideLoading();
                    //只有用户证书信息为正常状态时，才会返回success
                    if (respData.success) {
                        var certInfo = paramUtils.analyseCert(respData.data);
                        if (certInfo != null) {
                            app.existCert = true;
                            app.certInfo = certInfo;
                        }
                        //跳转到主页
                        dd.reLaunch({
                            url: "/pages/index/index" + paramUtils.codeUrl(codeInfo)
                        });
                    } else {
                        //跳转到错误页面
                        msg.gotoErrorPage(respData.msg, null, null);
                    }

                }, function(res) {
                    dd.hideLoading();
                });
            } else {
                dd.hideLoading();
                //4020表示用户不存在，不提示
                if(resData.code != '4020'){
                    msg.errorMsg(resData.msg);
                }
               
            }
        }, null);
    },

    /**
     * 授权登录
     * @param   codeInfo    第一次登录可能存在扫码的信息
     * 
     */
    loginAuth(codeInfo, pageObject) {
         dd.showLoading({
            content: '登录中...'
        });
        var app = getApp();
        var msg = require('/utils/msg.js');
        var paramUtils = require('/utils/param.js');
        dd.getAuthCode({
            success: function(res) {
                var authCode = res.authCode;
                var param = paramUtils.loginFirstParam(authCode);
                app.request(app.GATE_WAY, param, function(res) {
                    var resData = paramUtils.resp(res);
                    if (resData.success) {
                        dd.hideLoading();
                        //获取用户免密标识
                        var userCode = resData.data.dtid;

                        //TEST 模拟用户免登标识
                        //userCode = 'DD_YCL';
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
                        pageObject.loginNoPwd(userCode, codeInfo);
                    } else {
                        dd.hideLoading();
                        msg.errorMsg(resData.msg);
                    }
                }, null);
            }
        });
    },
});
