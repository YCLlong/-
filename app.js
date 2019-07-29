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

    /**
     * 校验是否是正确的身份证号码
     * @returns true | false
     */
    isCardNo(idcard) {
        // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
        // 判断如果传入的不是一个字符串，则转换成字符串
        idcard = typeof idcard === 'string' ? idcard : String(idcard);
        //正则表达式验证号码的结构
        let regx = /^[\d]{17}[0-9|X|x]{1}$/;
        if (regx.test(idcard)) {
            // 验证前面17位数字，首先定义前面17位系数
            let sevenTeenIndex = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            // 截取参数前17位
            let front_seventeen = idcard.slice(0, 17);
            // 截取第18位
            let eighteen = idcard.slice(17, 18);
            // 这里如果是X要转换成小写，如果是数字在这里是字符串类型,则转换成数字类型，好做判断
            eighteen = isNaN(parseInt(eighteen)) ? eighteen.toLowerCase() : parseInt(eighteen);
            // 定义一个变量计算系数乘积之和余数
            let remainder = 0;
            //利用循环计算前17位数与系数乘积并添加到一个数组中
            // charAt()类似数组的访问下标一样，访问单个字符串的元素,返回的是一个字符串因此要转换成数字
            for (let i = 0; i < 17; i++) {
                remainder = (remainder += parseInt(front_seventeen.charAt(i)) * sevenTeenIndex[i]) % 11;
            }
            //余数对应数字数组
            let remainderKeyArr = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            // 取得余数对应的值
            let remainderKey = remainderKeyArr[remainder] === 'X' ? remainderKeyArr[remainder].toLowerCase() : remainderKeyArr[remainder];
            // 如果最后一位数字对应上了余数所对应的值，则验证合格，否则不合格,
            // 由于不确定最后一个数字是否是大小写的X，所以还是都转换成小写进行判断
            if (eighteen === remainderKey) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    },

    /**
     * 校验手机号是否正确
     * @returns 返回true | false
     */
    isMobileNo(mobileNo){ 
        return /^1[3456789]\d{9}$/.test(mobileNo);
    } 

});
