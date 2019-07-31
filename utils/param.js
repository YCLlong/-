/**
 * param.js   封装了业务操作上的很多和参数地址相关的函数
 * 比如封装参数，解析参数
 */


/**
 * 封装地址参数
 */
function analyseQuery(query) {
    var data = {
        existCert: false,    //是否存在证书信息
        existCode: false,    //是否存在二维码信息
    }
    if (query == null) {
        return data;
    }
    //解析证书信息
    if (query.certStatus == null || query.cn == null || query.cn == '') {
        data.certInfo = null;
    } else {
        //封装证书信息
        data.existCert = true;
        data.certInfo = {
            cn: query.cn,
            sn: query.sn,
            idCode: query.idCode,
            notBefore: query.notBefore,
            notAfter: query.notAfter,
            status: query.certStatus
        };
    }

    //解析二维码信息
    if (query.appCode == null || query.appCode == '') {
        data.codeInfo = null;
    } else {
        data.existCode = true;
        data.codeInfo = {
            //应用方编码
            appCode: query.appCode,

            //挑战码
            code: query.code,

            //页面标识
            webId: query.webId,
        }
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
    if (certInfo.cn != null && certInfo.cn != undefined) {
        url = url + certInfo.cn;
    }

    //sn,证书序列号
    url = url + "&sn="
    if (certInfo.sn != null && certInfo.sn != undefined) {
        url = url + certInfo.sn;
    }

    //idCode,身份证号
    url = url + "&idCode="
    if (certInfo.idCode != null && certInfo.idCode != undefined) {
        url = url + certInfo.idCode;
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
    if (!res instanceof Object || res.success == undefined || res.success == null || res.success == '' || !(res.success == 'true' || res.success == 'false')) {
      
        //TEST
        resp.success = true;
         // resp.success = false;
        resp.msg = '服务端返回参数不正确';
        resp.code = 5001;
        return resp;
    }


    if (res.success == 'false') {
        resp.success = false;
    }
    resp.code = res.code,
        resp.msg = res.msg,
        resp.data = res.data
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
    return param;
}

/**
 * API2请求参数封装
 * @param dtid  钉钉用户ID在本系统内唯一标识
 */
function loginNoPwdRequestParam(dtid) {
    var param = createRequestParam('1002');
    param.msgData.dtid = dtid;
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
    param.msgData.regData.pHash = applyInfo.pHash;
    param.msgData.token = token;
    return param;
}

/**
 * API5申请使用证书请求参数
 * @param appCode 应用标识
 * @param code    挑战码
 * @param webId   页面标识
 * @param token   登录后获得的token,时效30分钟的后续调用凭证
 */
function certUseRequestParam(appCode, code, webId, token) {
    var param = createRequestParam('1005');
    param.msgData.appCode = appCode;
    param.msgData.code = code;
    param.msgData.webId = webId;
    param.msgData.token = token;
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
    return param;
}


/**
 * 暴露方法1，不然钉钉小程序外部无法访问到
 */
module.exports = {
    analyseQuery: analyseQuery,
    certUrl: createCertInfoUrlParam,
    codeUrl: cerateCodeInfoUrlParam,
    indexUrl: indexUrl,
    resp: dealServerResponse,
    loginFirstParam:logInFirstRequestParam,
    loginNoPwdParam:loginNoPwdRequestParam,
    certInfoParam:certInfoRequestParam,
    certApplyParam:certApplyRequestParam,
    certUseParam:certUseRequestParam,
    verifyPinParam:verifyPinRequestParam
}





