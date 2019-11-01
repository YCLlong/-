Page({
    data: {
        existCert: false,
        certInfo: {},
        existCode: false,
        codeInfo: {}
    },
  
    // onPullDownRefresh() {
    //     下拉更新证书信息
    //     var app = getApp();
    //     var msg = require('/utils/msg.js');
    //     var paramUtils = require('/utils/param.js');
    //     var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
    //     var pageObject = this;
    //     app.request(app.GATE_WAY, certInfoParam, function(certRes) {
    //         dd.stopPullDownRefresh();
    //         var respData = paramUtils.resp(certRes);
    //         if (respData.success) {
    //             var certInfo = respData.data.certData;
    //             if (certInfo== undefined || certInfo == null || certInfo.status == null || certInfo.status == '') {
    //                 app.existCert = false;
    //                 app.certInfo = null;
    //                 pageObject.setData({
    //                     existCert: false,
    //                     certInfo: null,
    //                 });
    //             } else {
    //                 app.existCert = true;
    //                 app.certInfo = certInfo;
    //                 pageObject.setData({
    //                     existCert: true,
    //                     certInfo: certInfo,
    //                 });
    //             }
               
    //             pageObject.route();
    //         } else {
    //             msg.errorMsg(respData.msg);
    //         }
    //     }, function(res){
    //         dd.stopPullDownRefresh();
    //         msg.errorMsg(res.errorMessage);
    //     },pageObject);
    // },
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
        // dd.confirm({
        //     title: '新领须知',
        //     content: '这个是须知内容',
        //     confirmButtonText: '同意',
        //     cancelButtonText: '拒绝',
        //     success: (result) => {
        //         if (result.confirm) {
        //             dd.navigateTo({
        //                 url: '/pages/apply/apply'
        //             });
        //         }
        //     },
        // });
         dd.navigateTo({
            url: '/pages/apply/apply'
        });
    },
});
