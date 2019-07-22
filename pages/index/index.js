Page({
    data: {
        existCert: false,
    },
    onLoad(query) {
        if (query.code != null) {
            //存在证书信息
            var certInfo = {
                name: query.certName,
                code: query.code,
                notAfter: query.notAfter
            };
            this.setData({
                existCert: true,
                certInfo: certInfo
            });

        }
    },
    onReady() {
        // 页面加载完成
    },
    onShow() {
        // 页面显示
    },
    onHide() {
        // 页面隐藏
    },
    onUnload() {
        // 页面被关闭
    },
    onTitleClick() {
        // 标题被点击
    },
    onPullDownRefresh() {
        // 页面被下拉
    },
    onReachBottom() {
        // 页面被拉到底部
    },
    onShareAppMessage() {
        // 返回自定义分享信息
        return {
            title: 'ZJCA云证书',
            desc: 'ZJCA云证书',
            path: 'pages/index/index',
        };
    },

    /**
     * 扫二维码
     */
    scan() {
        dd.scan({
            type: 'qr',
            success: (res) => {
                dd.alert({ title:'二维码内容',content: res.code });
            },
            fail: (res) => {
                debugger;
                getApp().showError("扫码失败！错误代码：" + res.code);
            }
        });
    },
    apply(){
        getApp().showSuccess('假装你申请成功');
    }
});
