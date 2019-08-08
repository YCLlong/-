/**
 * param.js   封装了业务操作上的很多和参数地址相关的函数
 * 比如封装参数，解析参数
 */

/**
 * 将参数解析成证书信息对象
 */
function analyseCert(query) {
    var certInfo = {}
    if (query.certStatus == null || query.cn == null || query.cn == '') {
        certInfo = null;
    } else {
        //封装证书信息
        certInfo.name = query.cn;
        certInfo.status = query.certStatus;

        if (query.sn == undefined) {
            certInfo.sn = '';
        } else {
            certInfo.sn = query.sn;
        }
        if (query.idCode == undefined) {
            certInfo.code = '';
        } else {
            certInfo.code = query.idCode;
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
    }
    return certInfo;
}

/**
 * 将参数解析成二维码信息对象
 */
function analyseCode(query) {
    var codeInfo = {};
    //解析二维码信息
    if (query.appCode == null || query.appCode == '') {
        codeInfo = null;
    } else {
        //应用方编码
        codeInfo.appCode = query.appCode

        //挑战码
        if (query.code == undefined) {
            codeInfo.code = '';
        } else {
            codeInfo.code = query.code;
        }

        //页面标识
        if (query.webId == undefined) {
            codeInfo.webId = '';
        } else {
            codeInfo.webId = query.webId;
        }
    }
    return codeInfo;
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
    if (certInfo == null || certInfo == undefined || !certInfo instanceof Object) {
        return "?cn=&sn=&idCode=&notBefore=&notAfter=&certStatus=";
    }
    var url = '?';
    //cn,证书名字
    url = url + "cn="
    if (certInfo.name != null && certInfo.name != undefined) {
        url = url + certInfo.name;
    }

    //sn,证书序列号
    url = url + "&sn="
    if (certInfo.sn != null && certInfo.sn != undefined) {
        url = url + certInfo.sn;
    }

    //身份证号
    url = url + "&idCode="
    if (certInfo.code != null && certInfo.code != undefined) {
        url = url + certInfo.code;
    }

    //notBefore,证书有效起始时间
    url = url + "&notBefore="
    if (certInfo.notBefore != null && certInfo.notBefore != undefined) {
        url = url + certInfo.notBefore;
    }

    //notAfter,证书有效截止时间
    url = url + "&notAfter="
    if (certInfo.notAfter != null && certInfo.notAfter != undefined) {
        url = url + certInfo.notAfter;
    }

    //证书状态
    url = url + "&certStatus="
    if (certInfo.status != null && certInfo.status != undefined) {
        url = url + certInfo.status;
    }

    return url;
}

/**
 * 将二维码对象封装成url形式
 */
function cerateCodeInfoUrlParam(codeInfo) {
    if (codeInfo == null || codeInfo == undefined || !codeInfo instanceof Object) {
        return "?appCode=&code=&webId=";
    }
    var url = '?';
    //appCode,应用code
    url = url + "appCode="
    if (codeInfo.appCode != null && codeInfo.appCode != undefined) {
        url = url + codeInfo.appCode;
    }

    //code,挑战码
    url = url + "&code="
    if (codeInfo.code != null && codeInfo.code != undefined) {
        url = url + codeInfo.code;
    }

    //webId,web标识
    url = url + "&webId="
    if (codeInfo.webId != null && codeInfo.webId != undefined) {
        url = url + codeInfo.webId;
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

    debugger
    if (!res instanceof Object || res.data == undefined || res.data == null ||  res.data.success == undefined || res.data.success == null || res.data.success == '' || !(res.data.success == 'true' || res.data.success == 'false')) {
        resp.success = false;
        resp.msg = '服务端返回参数不正确';
        resp.code = 5001;
        return resp;
    }

    var data = res.data;
    if (data.success == 'false') {
        if (data.code != undefined && data.code != null && data.code != '') {
            if (data.code == '4003') {
                //本来想给用户取消重新登录的操作，无奈钉钉没有提供退出小程序的方法
                dd.alert({
                    title: '温馨提示',
                    content: '您的登录身份已过期，需要重新登录',
                    buttonText: '重新登录',
                    success: () => {
                        dd.reLaunch({
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

    if (data.data == undefined || data.data == null || data.data =='') {
        resp.data == {};
    } else {
        //转化成json对象
        try{
            resp.data =  JSON.parse(data.data);
        }catch(e){
            resp.success = false;
            resp.msg = '服务端返回参数不正确';
            resp.code = 5001;
            return resp;
        }
        
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
 * API1请求参数封装
 * @param authCode 用户授权小程序后的授权码
 */
function logInFirstRequestParam(authCode) {
    var param = createRequestParam('1001');
    param.msgData.code = authCode;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * API2请求参数封装
 * @param dtid  钉钉用户ID在本系统内唯一标识
 */
function loginNoPwdRequestParam(dtid) {
    var param = createRequestParam('1002');
    param.msgData.dtid = dtid;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * API3获取证书信息接口请求参数
 * @param isForce   是否强制更新标识（1是0否）
 * @param token     登录后获得的token,时效30分钟的后续调用凭证
 */
function certInfoRequestParam(isForce, token) {
    var param = createRequestParam('1003');
    param.msgData.isForce = isForce;
    param.msgData.token = token;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * API4证书申请接口参数请求参数
 * @param applyInfo 申请信息
 * @param token     登录后获得的token,时效30分钟的后续调用凭证
 */
function certApplyRequestParam(applyInfo, token) {
    var param = createRequestParam('1004');
    param.msgData.regData = {};
    param.msgData.regData.name = applyInfo.name;
    param.msgData.regData.idcode = applyInfo.idCode;
    param.msgData.regData.mobile = applyInfo.mobile;
    param.msgData.regData = JSON.stringify(param.msgData.regData);
    param.msgData.pHash = applyInfo.pHash;
    param.msgData.token = token;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * API5申请使用证书请求参数
 * @param appCode 应用标识
 * @param code    挑战码
 * @param webId   页面标识
 * @param token   登录后获得的token,时效30分钟的后续调用凭证
 */
function certUseRequestParam(codeInfo, token) {
    var param = createRequestParam('1005');
    param.msgData.appCode = codeInfo.appCode;
    param.msgData.code = codeInfo.code;
    param.msgData.webId = codeInfo.webId;
    param.msgData.token = token;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}

/**
 * API6校验pin码的正确性
 * @param token   这个token不是登录后返回的token，而是请求使用证书的接口后代表那次请求的token
 * @param pinHash pin码的哈希值
 */
function verifyPinRequestParam(token, pinHash) {
    var param = createRequestParam('1006');
    param.msgData.token = token;
    param.msgData.pHash = pinHash;
    param.msgData = JSON.stringify(param.msgData);
    return param;
}


/**
 * 暴露方法1，不然钉钉小程序外部无法访问到
 */
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
    verifyPinParam: verifyPinRequestParam
}
