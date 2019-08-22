/**
 * param.js   封装了业务操作上的很多和参数地址相关的函数
 * 比如封装参数，解析参数
 */

/**
 * 将参数解析成证书信息对象
 */
function analyseCert(query) {
    if (query != null && query != undefined && query.status != null && query.status != undefined && query.status != '' && query.code != null && query.code != undefined && query.code != '') {
        var certInfo = {};
        //封装证书信息
        certInfo.name = query.name;
        certInfo.status = query.status;

        if (query.sn == undefined) {
            certInfo.sn = '';
        } else {
            certInfo.sn = query.sn;
        }
        if (query.code == undefined) {
            certInfo.code = '';
        } else {
            certInfo.code = query.code;
        }

        if (query.phone == undefined) {
            certInfo.phone = '';
        } else {
            certInfo.phone = query.phone;
        }

        if (query.csn == undefined) {
            certInfo.csn = '';
        } else {
            certInfo.csn = query.csn;
        }

        if (query.notBefore == undefined) {
            certInfo.notBefore = '';
        } else {
            certInfo.notBefore = query.notBefore;
        }

        if (query.notAfter == undefined) {
            certInfo.notAfter = '';
        } else {
            certInfo.notAfter = query.notAfter;
        }
        return certInfo;
    }
    return null;
}

/**
 * 将参数解析成二维码信息对象
 */
function analyseCode(query) {
    //解析二维码信息
    if ( query != undefined && query != null &&  query.bizToken != undefined && query.bizToken != null && query.bizToken != '') {
        var codeInfo = {
            bizToken : query.bizToken//业务token
        };
        return codeInfo;
    }
    return null;
}
/**
 * 封装地址参数
 */
function analyseQuery(query) {
    var data = {
        existCert: false,    //是否存在证书信息
        existCode: false,    //是否存在二维码信息
    }
    if (query == null) {
        data.certInfo = null;
        data.codeInfo = null;
        return data;
    }
    //解析证书信息
    var certInfo = analyseCert(query);
    if (certInfo != null) {
        data.existCert = true;
        data.certInfo = certInfo;
    }

    //解析二维码信息
    var codeInfo = analyseCode(query);
    if (codeInfo != null) {
        data.existCode = true;
        data.codeInfo = codeInfo;
    }
    return data;
}

/**
 * 将证书对象转化成url的参数形式
 */
function createCertInfoUrlParam(certInfo) {
    if (certInfo == undefined || certInfo == null || !certInfo instanceof Object) {
        return "?name=&sn=&csn=&code=&notBefore=&notAfter=&status=";
    }
    var url = '?';
    //cn,证书名字
    url = url + "name="
    if (certInfo.name != undefined && certInfo.name != null) {
        url = url + certInfo.name;
    }

    //sn,证书序列号
    url = url + "&sn="
    if (certInfo.sn != undefined && certInfo.sn != null) {
        url = url + certInfo.sn;
    }

     //csn,证书不变序列号
    url = url + "&csn="
    if (certInfo.csn != undefined && certInfo.csn != null) {
        url = url + certInfo.csn;
    }

    //身份证号
    url = url + "&code="
    if (certInfo.code != undefined && certInfo.code != null) {
        url = url + certInfo.code;
    }

    //notBefore,证书有效起始时间
    url = url + "&notBefore="
    if (certInfo.notBefore != undefined && certInfo.notBefore != null) {
        url = url + certInfo.notBefore;
    }

    //notAfter,证书有效截止时间
    url = url + "&notAfter="
    if (certInfo.notAfter != undefined && certInfo.notAfter != null) {
        url = url + certInfo.notAfter;
    }

    //证书状态
    url = url + "&status="
    if (certInfo.status != undefined && certInfo.status != null) {
        url = url + certInfo.status;
    }

    return url;
}

/**
 * 将二维码对象封装成url形式
 */
function cerateCodeInfoUrlParam(codeInfo) {
    if (codeInfo == undefined || codeInfo == null ||  !codeInfo instanceof Object) {
        return "?bizToken=";
    }
    //bizToken,业务token
    let url = "?bizToken=";
    if (codeInfo.bizToken != undefined && codeInfo.bizToken != null) {
        url = url + codeInfo.bizToken;
    }
  
    return url;
}

/**
 * 在小程序中，页面之间传递参数往往通过url传递。
 * 这个函数就是跳转到主页时，将 二维码信息和证书信息 生成对应的参数格式传递
 */
function indexUrl(codeInfo, certInfo) {
    var codeParam = cerateCodeInfoUrlParam(codeInfo);
    var certParam = createCertInfoUrlParam(certInfo);
    //去掉"?"
    certParam = certParam.substring(1, certParam.length);
    return codeParam + "&" + certParam;
}

/**
 * 处理服务器响应结果
 * @param   res 服务端返回的数据
 */
function dealServerResponse(res) {
    //重新定义服务器返回结果
    var resp = {
        success: true,
        code: '',
        msg: '',
        data: {}
    };

    //TEST  模拟用户token超时
    // res.success = 'false';
    // res.code = '4003';

    //TEST 模拟服务响应正确
    //res.success = 'true';
  
    if (!res instanceof Object || res.data == undefined || res.data == null || res.data.success == undefined || res.data.success == null || res.data.success == '' || !(res.data.success == 'true' || res.data.success == 'false')) {
        resp.success = false;
        resp.msg = '服务端返回参数不正确';
        resp.code = 5001;
        return resp;
    }

    var data = res.data;
    if (data.success == 'false') {
        if (data.code != undefined && data.code != null && data.code != '') {
            //错误码4046表示token过期
            if (data.code == '4046') {
                //本来想给用户取消重新登录的操作，无奈钉钉没有提供退出小程序的方法
                dd.alert({
                    title: '温馨提示',
                    content: '您的登录身份已过期，需要重新登录',
                    buttonText: '重新登录',
                    success: () => {
                        dd.redirectTo({
                            url: '/pages/login/login'
                        });
                        return;
                    },
                });
            }
        }
        resp.success = false;
    }

    if (data.code == undefined) {
        resp.code == '';
    } else {
        resp.code = data.code;
    }

    if (data.msg == undefined) {
        resp.msg == '';
    } else {
        resp.msg = data.msg;
    }
    if (data.data == undefined || data.data == null || data.data == '') {
        resp.data == {};
    }else {
         resp.data = data.data;
    }
     
    return resp;
}

/**
 * 创建请求服务端的参数的基本格式
 * @param methodCode    接口标识
 */
function createRequestParam(methodCode) {
    var param = {
        msgData: {
            method: methodCode,
        }
    };
    return param;
}

/**
 * 通过用户授权后登录
 * @param authCode 用户授权小程序后的授权码
 */
function logInFirstRequestParam(authCode) {
    var param = createRequestParam('ddLogin');
    param.msgData.dingTalkCode = authCode;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * 通过免登标识登录
 * @param freeId  用户的免登标识
 */
function loginNoPwdRequestParam(freeId) {
    var param = createRequestParam('freeLogin');
    param.msgData.freeId = freeId;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * 查询证书信息接口请求参数
 * @param isForce   是否强制更新标识（1是0否）
 * @param userToken     登录后获得的token,时效30分钟的后续调用凭证
 */
function certInfoRequestParam(isForce, userToken) {
    var param = createRequestParam('certView');
    param.msgData.isForce = isForce;
    param.msgData.userToken = userToken;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * 证书申请接口参数请求参数
 * @param applyInfo 申请信息
 * @param userToken     登录后获得的token,时效30分钟的后续调用凭证
 */
function certApplyRequestParam(applyInfo, userToken) {
    var param = createRequestParam('createCert');
    param.msgData.name = applyInfo.name;
    param.msgData.code = applyInfo.code;
    param.msgData.phone = applyInfo.phone;
    param.msgData.pin = applyInfo.pin;
    param.msgData.userToken = userToken;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * 申请使用证书请求参数
 * @param codeInfo 二维码信息封装
 * @param token   登录后获得的token,时效30分钟的后续调用凭证
 */
function certUseRequestParam(codeInfo,userToken) {
    var param = createRequestParam('accAuthUse');
    param.msgData.userToken = userToken;
    param.msgData.token = codeInfo.bizToken;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * API6校验pin码的正确性
 * @param token   这个token不是登录后返回的token，而是请求使用证书的接口后代表那次请求的token
 * @param pinHash pin码的哈希值
 */
function verifyPinRequestParam(token, pinHash) {
    var param = createRequestParam('pinCert');
    param.msgData.token = token;
    param.msgData.pin = pinHash;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * 提取url中的参数
 * @param name  参数名称
 * @param url   链接地址
 */
function getParameter(name, url) {
    if (url == null || url == undefined || url == '' || name == null || name == undefined || name == '') {
        return null;
    }
    var reg = new RegExp('(/?|^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = url.match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}



module.exports = {
    analyseCert: analyseCert,
    analyseCode: analyseCode,
    analyseQuery: analyseQuery,
    certUrl: createCertInfoUrlParam,
    codeUrl: cerateCodeInfoUrlParam,
    indexUrl: indexUrl,
    resp: dealServerResponse,
    loginFirstParam: logInFirstRequestParam,
    loginNoPwdParam: loginNoPwdRequestParam,
    certInfoParam: certInfoRequestParam,
    certApplyParam: certApplyRequestParam,
    certUseParam: certUseRequestParam,
    verifyPinParam: verifyPinRequestParam,
    getParameter: getParameter
}
