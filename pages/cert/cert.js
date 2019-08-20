Page({
    data: {
        existCert: false,
        certInfo: {}
    },
    onLoad(query) {
        var app = getApp();
        if(app.existCert){
            var certInfo = app.certInfo;
            if(app.certInfo.status == 2000){
                certInfo.statusName = '正常';
            }else if(app.certInfo.status == 3000){
                certInfo.statusName = '锁定';
            }
            this.setData({
                existCert: true,
                certInfo:certInfo
            });
        }
    },
    /**
     * 扫二维码
     */
    scan() {
        var msgUtils = require("/utils/msg.js");
        var paramUtils = require("/utils/param.js");
        dd.scan({
            type: 'qr',
            success: (res) => {
                var query = paramUtils.getParameter('query', res.code);
                if(query == null){
                    msgUtils.gotoErrorPage('我们不能处理这个二维码',null,'/pages/cert/cert');
                    //dd.alert({ title: '二维码内容', content: res.code });
                    return;
                }
                var paramContent = '?' + query;//decodeURIComponent();
                var codeInfo = {};
                codeInfo.bizToken = paramUtils.getParameter('bizToken',paramContent);
                if( codeInfo.bizToken == null){
                    msgUtils.gotoErrorPage('我们不能处理这个二维码',null,'/pages/cert/cert');
                    //dd.alert({ title: '二维码内容', content: res.code });
                }else{
                    getApp().certUseApply(codeInfo);
                }
            },
            fail: (res) => {
                msgUtils.errorMsg("扫码失败");
            }
        });
    }
});
