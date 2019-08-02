App({
    //小程序后台接口网关
    GATE_WAY:'https://www.baidu.com',

    //缓存中用户钉钉号标识
    DD_USER_CODE: 'ddUserCode',

    //用户登录系统之后返回token
    DD_USER_TOKEN:'',



    onLaunch(options) {
        // 第一次打开
        if(options.query != null){
            var paramUtils = require("/utils/param.js");
            var data = paramUtils.analyseQuery(options.query);
            if(data != null && data.existCode){
                //需要处理二维码信息
                var param = paramUtils.codeUrl(data.codeInfo);
                dd.redirectTo({
                    url: '/pages/login/login' + param
                })
            }
        }
    },
    onShow(options) {
    },



    

    /**
     * @param url         :请求的地址
     * @param param       :请求参数，param json对象 
     * @param successFun  :访问成功回调函数,注意，这个函数内不能再调用别的函数，钉钉不支持
     * @param errorFun    :请求失败回调函数，如果是null,那么会打印默认的错误信息 @function showError ，这个函数内不能再调用别的函数。钉钉不支持
     * @param pointer     :调用者对象指针
     */
    request(url, param, successFun, errorFun,pointer) {
        dd.getNetworkType({
            success: (res) => {
                if (!res.networkAvailable) {
                    dd.showToast({
                        type: 'exception',
                        content: '当前网络不可用，请您检查网络状态',
                        duration: 3000,
                    });
                    return;
                }
                // if(param != null && param != undefined){
                //     param = JSON.stringify(param);
                // }else{
                       //param = '';
                //}
                dd.httpRequest({
                    headers: {
                        //"Content-Type": "application/json"
                    },
                    url: url,
                    method: 'POST',
                    timeout: 3000,
                    data: param,
                    //dataType: 'json',
                    dataType: 'text',
                    success: function(res) {
                        successFun(res);
                    },
                    fail: function(res) {
                        if (errorFun != null) {
                            errorFun(res);
                        } else {
                            dd.showToast({
                                type: 'exception',
                                content: res.errorMessage,
                                duration: 3000,
                            });
                        }
                    },
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
    genStorageKey(keyName){
        try {
            return dd.getStorageSync({key: keyName}).data;
        } catch (e) {
            showError("无法读取缓存信息，详情：" + e.errorMessage);
            return null;
        }
    }
});
