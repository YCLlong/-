Page({
    data: {
        existCert: false,
        certInfo: {},
        existCode: false,
        codeInfo: {}
    },
    /**
     * @param   query   通过类似url地址 get请求传递到页面的参数
     * 
     */
    onLoad(query) {
        var app = getApp();
        var paramUtils = require("/utils/param.js");
        var codeInfo = paramUtils.analyseCode(query);
        if (codeInfo != null) {
            this.setData({
                existCode: true,
                codeInfo: codeInfo
            });
        }
        if(app.existCert){
            this.setData({
                existCert: true,
                certInfo: app.certInfo
            });
        }
        
        //页面路由
        this.route();
    },
    onPullDownRefresh() {
        // 下拉更新证书信息
        // var app = getApp();
        // var msg = require('/utils/msg.js');
        // var paramUtils = require('/utils/param.js');
        // var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
        // var pageObject = this;
        // app.request(app.GATE_WAY, certInfoParam, function(certRes) {
        //     dd.stopPullDownRefresh();
        //     var respData = paramUtils.resp(certRes);
        //     if (respData.success) {
        //         var certInfo = respData.data.certData;
        //         if (certInfo== undefined || certInfo == null || certInfo.status == null || certInfo.status == '') {
        //             app.existCert = false;
        //             app.certInfo = null;
        //             pageObject.setData({
        //                 existCert: false,
        //                 certInfo: null,
        //             });
        //         } else {
        //             app.existCert = true;
        //             app.certInfo = certInfo;
        //             pageObject.setData({
        //                 existCert: true,
        //                 certInfo: certInfo,
        //             });
        //         }
               
        //         pageObject.route();
        //     } else {
        //         msg.errorMsg(respData.msg);
        //     }
        // }, function(res){
        //     dd.stopPullDownRefresh();
        //     msg.errorMsg(res.errorMessage);
        // },pageObject);
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
    },
    

    /**
     * 页面逻辑跳转
     */
    route(){
         //如果存在code，且存在二维码信息，直接跳转到pin码输入界面
        if(this.data.existCert && this.data.existCode){
            var app = getApp();
            app.certUseApply(this.data.codeInfo);
            return;
        }else if(this.data.existCert){
            dd.redirectTo({
                url: '/pages/cert/cert'
            });
        }
    }
});
