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
    if (certInfo == null || !certInfo instanceof Object) {
        return "";
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
    if (codeInfo == null || !codeInfo instanceof Object) {
        return "";
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
function indexUrl(codeInfo,certInfo){
    var codeParam = cerateCodeInfoUrlParam(codeInfo);
    var certParam = createCertInfoUrlParam(certInfo);
    //去掉"?"
    certParam = certParam.subString(1,certParam.length);
    return codeParam + "&" + certParam;
}

/**
 * 处理服务器响应结果
 */
function dealServerResponse(res){
    //重新定义服务器返回结果
    var resp = {
        success:true,
        code:'',
        msg:'',
        data:{}
    };
    if(!res instanceof Object || res.success == undefined || res.success == null || res.success == '' || !(res.success == 'true' || res.success == 'false')){
        resp.success = false;
        resp.msg = '服务端返回参数不正确';
        resp.code = 5001;
        return resp;
    }


    if(res.success == 'false'){
        resp.success = false; 
    }
    resp.code = res.code,
    resp.msg = res.msg,
    resp.data = res.data
    return resp;
}

/**
 * 暴露方法1，不然钉钉小程序外部无法访问到
 */
module.exports = {
    analyseQuery: analyseQuery,
    certUrl: createCertInfoUrlParam,
    codeUrl: cerateCodeInfoUrlParam,
    indexUrl:indexUrl,
    resp:dealServerResponse
}





