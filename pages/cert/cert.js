Page({
    data: {},
    onLoad(query) {
        var paramUtils = require('/utils/param.js');
        var certInfo = paramUtils.analyseCert(query);
        if (certInfo == null) {
            this.setData({
                existCert: false
            });
        } else {
            this.setData({
                existCert: true,
                certInfo: certInfo
            });
        }
    },
     onPullDownRefresh() {
        dd.stopPullDownRefresh();
     },
    /**
     * 扫二维码
     */
    scan() {
        var msgUtils = require("/utils/msg.js")
        dd.scan({
            type: 'qr',
            success: (res) => {
                dd.alert({ title: '二维码内容', content: res.code });
            },
            fail: (res) => {
                msgUtils.errorMsg("扫码失败！错误代码：" + res.code);
            }
        });
    }
});
