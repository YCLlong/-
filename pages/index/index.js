Page({
    data: {
        existCert: false,
        certInfo:{}
    },
    /**
     * @param   query   通过类似url地址 get请求传递到页面的参数
     * 
     */
    onLoad(query) {
        if (query.status != null) {
            //存在证书信息
            var certInfo = {
                cn: query.cn,
                sn: query.sn,
                idCode:query.idCode,
                notBefore:query.notBefore,
                notAfter: query.notAfter,
                status:query.status
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


    apply() {
        dd.confirm({
            title: '新领须知',
            content: '这个是须知内容，很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长123456',
            confirmButtonText: '同意',
            cancelButtonText: '拒绝',
            success: (result) => {
                if(result.confirm){
                    dd.navigateTo({
                        url: '/pages/apply/apply'
                    });   
                }
            },
        });
    },
     /**
     * 扫二维码
     */
    scan() {
        dd.scan({
            type: 'qr',
            success: (res) => {
                //调用第三方js库中的方法
                var sha = require('/utils/sha256.js');
                var sign = sha.sha256(res.code);
                dd.alert({ title: '二维码内容', content: sign });
            },
            fail: (res) => {
                getApp().showError("扫码失败！错误代码：" + res.code);
            }
        });
    }
});
