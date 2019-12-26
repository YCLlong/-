App({
    //小程序后台接口网关
    //GATE_WAY: 'http://60.190.254.12:9003/spInterface/message/msg/GateWay.htm',//外网测试
    //GATE_WAY:'http://192.168.0.238:8080/spInterface/message/msg/GateWay.htm',
    //GATE_WAY:'http://192.168.1.117:8080/spInterface/message/msg/GateWay.htm',
    //GATE_WAY:'http://192.168.110.150:8080/spInterface/message/msg/GateWay.htm',
    GATE_WAY:'http://ra.zj.gov.cn/spInterface/message/msg/GateWay.htm',    //正式
   

   
    //缓存中用户钉钉号标识
    DD_USER_CODE: 'ddUserCode',

    //用户登录系统之后返回token
    DD_USER_TOKEN: '',

    //最后一次获取短信验证码的时间
    VERIFY_MSG_CODE_LAST_TIME:'verifyMsgCodeLastTime',



    onLaunch(options) {
        var paramUtils = require("/utils/param.js");
        var param = paramUtils.onloadParseParam(options.query);
       
        dd.redirectTo({
            url: '/pages/login/login' + param
        });
    },





    /**
     * @param url         :请求的地址
     * @param param       :请求参数，param json对象 
     * @param successFun  :访问成功回调函数,注意，这个函数内不能再调用别的函数，钉钉不支持
     * @param errorFun    :请求失败回调函数，如果是null,那么会打印默认的错误信息 @function showError ，这个函数内不能再调用别的函数。钉钉不支持
     * @param pointer     :调用者对象指针 可不传
     */
    request(url, param, successFun, errorFun, pointer) {
        dd.getNetworkType({
            success: (res) => {
                if (!res.networkAvailable) {
                    dd.hideLoading();
                    dd.showToast({
                        type: 'exception',
                        content: '当前网络不可用，请您检查网络状态',
                        duration: 3000,
                    });
                    return;
                }
                if (param == null || param == undefined) {
                    param = {};
                }
                //生产环境这一行去掉
                //console.info(JSON.stringify(param));
                dd.httpRequest({
                    url: url,
                    method: 'POST',
                    timeout: 30000,
                    data: param,
                    dataType: 'json',
                    success: function(res) {
                        successFun(res);
                        //生产环境这一行去掉
                        //console.info(JSON.stringify(res));
                    },
                    fail: function(res) {
                        if (errorFun != null) {
                            errorFun(res);
                        } else {
                            dd.hideLoading();
                            dd.showToast({
                                type: 'exception',
                                content: '服务端无响应，请稍后再试',
                                duration: 3000,
                            });
                        }
                    }
                });
            }
        });

    },

    /**
     * 获取用户免登标识
     * @returns 用户和系统交互的免登标识
     */
    genUserCode() {
        return this.genStorageKey(this.DD_USER_CODE);
    },

    /**
     * 获取缓存信息
     */
    genStorageKey(keyName) {
        try {
            return dd.getStorageSync({ key: keyName }).data;
        } catch (e) {
            showError("无法读取缓存信息，详情：" + e.errorMessage);
            return null;
        }
    },

    /**
    * 申请使用证书
    * 三个必须参数
    * appCode  应用code
    * webId    调用方某个标识，给调用方的扩展字段
    * code     挑战码
    */
    certUseApply(codeInfo) {
        var paramUtils = require("/utils/param.js");
        var verifyUtils = require("/utils/verify.js");
        var msgUtils = require("/utils/msg.js")
        if (codeInfo == undefined || codeInfo == null || verifyUtils.isBlank(codeInfo.bizToken)) {
            //TODO 这里要跳转到错误页面，错误页面需要指定跳转到证书界面的Url
            msgUtils.gotoErrorPage("我们无法处理这个二维码", null, '/pages/cert/cert');
            return;
        }
        //检查证书状态
        if (!this.existCert || this.certInfo == undefined || this.certInfo == null) {
            msgUtils.gotoErrorPage("不存在证书信息", '若您已经申请过证书，请重新登录后重试', null);
            return;
        }

        if (this.certInfo.status == 3000) {
            msgUtils.gotoErrorPage("您的证书已被锁定，无法进行扫码操作", '请联系客服解锁，客服电话：0571-85800758', '/pages/cert/cert');
            return;
        }

        //封装使用证书请求参数
        let param = paramUtils.certUseParam(codeInfo, this.DD_USER_TOKEN);
        this.request(this.GATE_WAY, param, function(res) {
            var respData = paramUtils.resp(res);
            if (!respData.success) {
                msgUtils.gotoErrorPage(respData.msg, null, '/pages/cert/cert');
                return;
            }
            var certUseToken = respData.data.token;
            var use = respData.data.methodTypeName;
            var appName = respData.data.appName;
            if (verifyUtils.isBlank(certUseToken) || verifyUtils.isBlank(use) || verifyUtils.isBlank(appName)) {
                msgUtils.gotoErrorPage("服务器返回参数错误", null, '/pages/cert/cert');
                return;
            }

            //跳转pin码输入界面
            dd.navigateTo({
                url: '/pages/pin/pin?token=' + certUseToken + '&use=' + use + '&appName=' + appName,
                fail:function(e){
                     msgUtils.gotoErrorPage("跳转页面时出错", null, '/pages/cert/cert');
                }
            });
        }, null);
    }
});
