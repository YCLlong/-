App({
    //第一次登录地址
    LOGIN_FIRST_URL: 'https://www.baidu.com',

    //登录地址
    LOGIN_URL: 'https://www.baidu.com',

    //退出登录地址
    LOGIN_OUT_URL: 'https://www.baidu.com',

    //证书详情地址
    CERT_INFO_URL: 'https://www.baidu.com',

    //证书申请URL
    CERT_APPLY_URL:"https://www.baidu.com",

    //缓存中用户钉钉号标识
    DD_USER_KEY: 'ddUserKey',



    onLaunch(options) {
        // 第一次打开
        // options.query == {number:1}
        console.info('App onLaunch');
    },
    onShow(options) {
        // 从后台被 scheme 重新打开
        // options.query == {number:1}
    },

    /**
    * 显示错误信息
    * @param errMsg 要显示的错误详情
    */
    showError(errMsg) {
        dd.showToast({
            type: 'exception',
            content: errMsg,
            duration: 3000,
        });
    },

    /**
     * 显示成功的消息
     * @param msg   要显示的详情
     */
    showSuccess(msg) {
        dd.showToast({
            type: 'success',
            content: msg,
            duration: 3000,
        });
    },


    /**
     * @param url         :请求的地址
     * @param param       :请求参数，param json对象 
     * @param successFun  :访问成功回调函数,注意，这个函数内不能再调用别的函数，钉钉不支持
     * @param errorFun    :请求失败回调函数，如果是null,那么会打印默认的错误信息 @function showError ，这个函数内不能再调用别的函数。钉钉不支持
     */
    request(url, param, successFun, errorFun) {
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
                // }
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
                            showError(res.errorMessage);
                            // dd.showToast({
                            //     type: 'exception',
                            //     content: res.errorMessage,
                            //     duration: 3000,
                            // });
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
    genUserKey() {
        try {
            return dd.getStorageSync({ key: this.DD_USER_KEY }).data;
        } catch (e) {
            showError("无法获取缓存信息，详情：" + e.errorMessage);
        }
    },

   
});
