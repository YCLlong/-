function Error(code, msg) {
    this.code = code;
    this.msg = msg;
}

const TOKEN_ERROR = new Error(4003, 'token失效');

const CERT_APPLY_ERROR = new Error(4005, '证书申请失败');
const SERVER_RESPONSE_PARAM_ERROR = new Error(5001, '服务端响应参数不正确');

/**
 * 
 * @param  errorMsg 错误详情
 * @param  tip      提示信息（比如请联系客服什么的）
 * @param  backUrl  回调地址，点击返回时跳转的地址
 */
function gotoErrorPage(errorMsg, tip, backUrl) {
    var url = '/pages/error/error?errorMsg=';
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
    dd.navigateTo({
        url: url
    });
}

module.exports = {
    gotoErrorPage: gotoErrorPage
}