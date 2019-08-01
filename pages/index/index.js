Page({
    data: {
        existCert: false,
        certInfo: {}
    },
    /**
     * @param   query   通过类似url地址 get请求传递到页面的参数
     * 
     */
    onLoad(query) {
        var paramUtils = require("/utils/param.js");
        var data = paramUtils.analyseQuery(query);
        if (data == null) {
            return;
        }
        if (data.existCert) {
            this.setData({
                existCert: true,
                certInfo: data.certInfo
            });
        }
        if (data.existCode) {
            this.setData({
                existCode: true,
                codeInfo: data.codeInfo
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
        // 下拉查找证书信息
        var paramUtils = require('/utils/param.js');
        var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
        app.request(app.GATE_WAY, certInfoParam, function(certRes) {
            var respData = paramUtils.resp(certRes);
            if (resData.success) {
                var certInfo = respData.data.certData;
                if (certInfo.sn == null || certInfo.sn == undefined || certInfo.sn == '') {
                    this.setData({
                        existCert: false,
                        certInfo: null,
                    });
                }
                this.setData({
                    existCert: true,
                    certInfo: certInfo,
                });
            } else {
                msg.errorMsg(respData.msg);
            }
        }, null);
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


    apply() {
        dd.confirm({
            title: '新领须知',
            content: '这个是须知内容，很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长123456',
            confirmButtonText: '同意',
            cancelButtonText: '拒绝',
            success: (result) => {
                if (result.confirm) {
                    dd.navigateTo({
                        url: '/pages/apply/apply'
                    });
                }
            },
        });
    }
});
