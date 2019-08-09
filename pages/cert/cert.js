Page({
    data: {
        existCert: false,
        certInfo: {}
    },
    onLoad(query) {
        var app = getApp();
        if(app.existCert){
            this.setData({
                existCert: true,
                certInfo: app.certInfo
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
