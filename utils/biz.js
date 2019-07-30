/**
 * 封装证书信息
 */
function analyseQuery(query) {
    var data = {
        existCert:false,    //是否存在证书信息
        existCode:false,    //是否存在二维码信息
    }
    if (query == null){
        return data;
    }
    //解析证书信息
     if(query.certStatus == null || query.cn == null || query.cn == '') {   
        data.certInfo = null;
    }else{
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
    if(query.appCode == null || query.appCode == ''){
        data.codeInfo = null;
    }else{
        data.existCode = true;
        data.codeInfo = {
            //应用方编码
            appCode:query.appCode,

            //挑战码
            code:query.code,

            //页面标识
            webId:query.webId,
        }
    }
    
    return data;
}


/**
 * 暴露方法1，不然钉钉小程序外部无法访问到
 */
module.exports = {
    analyseQuery:analyseQuery,
}





