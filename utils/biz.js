/**
 * 封装证书信息
 */
function getCertInfo(query) {
    if (query == null|| query.status == null || query.cn == null || query.cn == '') {   
        return null;
    }
    var certInfo = {
        cn: query.cn,
        sn: query.sn,
        idCode: query.idCode,
        notBefore: query.notBefore,
        notAfter: query.notAfter,
        status: query.status
    };
    return certInfo;
}


/**
 * 暴露方法1，不然钉钉小程序外部无法访问到
 */
module.exports = {
    getCertInfo:getCertInfo,
}





