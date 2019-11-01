Page({
    data: {
        existCert: false,
        lastScanTime:0,
        certInfo: {}
    },
    onLoad() {
        var app = getApp();
        if (app.existCert) {
            var certInfo = app.certInfo;
            if (app.certInfo.status == 2000) {
                certInfo.statusName = '正常';
            } else if (app.certInfo.status == 3000) {
                certInfo.statusName = '锁定';
            }
            this.setData({
                existCert: true,
                certInfo: certInfo
            });
        } else {
            dd.redirectTo({
                url: '/pages/index/index'
            });
        }
    },

    /**
     * 扫二维码
     */
    scan() {
        /**
         * 相当于加了一个锁，防止快速点击多次,点击多次会唤起多个扫一扫界面，每个界面都无法扫描
         * 1s内只能点击一次
         */
        if(new Date().getTime() - this.data.lastScanTime <1000){
            return;
        }
        this.setData({
            lastScanTime:new Date().getTime()
        });

        var msgUtils = require("/utils/msg.js");
        var paramUtils = require("/utils/param.js");
        dd.scan({
            type: 'qr',
            success: (res) => {

                var query = null;
                try {
                    query = paramUtils.getParameter('query', res.code);
                } catch (e) {
                    query = null;
                }

                if (query == null) {
                    msgUtils.gotoErrorPage('我们不能处理这个二维码', null, '/pages/cert/cert');
                    //dd.alert({ title: '二维码内容', content: res.code });
                    return;
                }
                var paramContent = '?' + query;//decodeURIComponent();
                var codeInfo = {};
                codeInfo.bizToken = paramUtils.getParameter('bizToken', paramContent);
                if (codeInfo.bizToken == null) {
                    msgUtils.gotoErrorPage('我们不能处理这个二维码', null, '/pages/cert/cert');
                    //dd.alert({ title: '二维码内容', content: res.code });
                } else {
                    getApp().certUseApply(codeInfo);
                }
            },
            fail: (res) => {
               // msgUtils.errorMsg("扫码失败");
            }
        });
    }
});
