/**
   * 显示错误信息
   * @param errMsg 要显示的错误详情
   */
function showError(errMsg) {
    dd.showToast({
        type: 'exception',
        content: errMsg,
        duration: 3000,
    });
}

/**
 * 显示成功的消息
 * @param msg   要显示的详情
 */
function showSuccess(msg) {
    dd.showToast({
        type: 'success',
        content: msg,
        duration: 3000,
    });
}


/**
 * 
 * @param  errorMsg 错误详情
 * @param  tip      提示信息（比如请联系客服什么的）
 * @param  backUrl  回跳地址，点击返回时跳转的地址
 */
function gotoErrorPage(errorMsg, tip, backUrl) {
    var url = '/pages/error/error?msg=';
    if (errorMsg != null && errorMsg != undefined && errorMsg != '') {
        url = url + errorMsg;
    }
    url = url + '&tip=';
    if (tip != null && tip != undefined && tip != '') {
        url = url + tip;
    }
    url = url + '&backUrl=';

    if (backUrl != null && backUrl != undefined && backUrl != '') {
        url = url + backUrl;
    }
    dd.redirectTo({
        url: url
    });
}

/**
 * 跳转到操作成功界面
 * @param msg   提示消息
 * @param backUrl   回跳地址
 */
function gotoSuccessPage(msg,backUrl){
    var url = '/pages/success/success?msg=';
    if (msg != null && msg != undefined && msg != '') {
        url = url + msg;
    }
    url = url + '&backUrl=';

    if (backUrl != null && backUrl != undefined && backUrl != '') {
        url = url + backUrl;
    }
    dd.redirectTo({
        url: url
    });
}

/**
 * 暴露方法1，不然钉钉小程序外部无法访问到
 */
module.exports = {
    errorMsg: showError,
    successMsg: showSuccess,
    gotoErrorPage: gotoErrorPage,
    gotoSuccessPage: gotoSuccessPage
}