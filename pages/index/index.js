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
     * 申请使用证书
     * 三个必须参数
     * appCode  应用code
     * webId    调用方某个标识，给调用方的扩展字段
     * code     挑战码
     */
    certUseApply(codeInfo) {
        var app = getApp();
        var paramUtils = require("/utils/param.js");
        var verifyUtils = require("/utils/verify.js");
        var msgUtils = require("/utils/msg.js")
        if (codeInfo == null || codeInfo == undefined || verifyUtils.isBlank(codeInfo.appCode) || verifyUtils.isBlank(codeInfo.webId)) {
            //TODO 这里要跳转到错误页面，错误页面需要指定跳转到证书界面的Url
            msgUtils.gotoErrorPage("我们无法处理这个二维码",null,null);
            return;
        }

        //封装使用证书请求参数
        let param = paramUtils.certUseParam(codeInfo, app.DD_USER_TOKEN);
        app.request(app.GATE_WAY, param, function(res) {
            var respData = paramUtils.resp(res);
            if (!respData.success) {
                msg.errorMsg(respData.msg);
                return;
            }
            var certUseToken = respData.data.token;
            var use = respData.data.use;
            var appName = respData.data.appName;
            if (verifyUtils.isBlank(certUseToken) || verifyUtils.isBlank(use) || verifyUtils.isBlank(appName)) {
                msgUtils.errorMsg("服务器返回参数错误");
                return;
            }
            
            //跳转pin码输入界面
            dd.navigateTo({
                url: '/pages/pin/pin?token=' + certUseToken + '&use=' + use + '&appName=' + appName
            });
        }, null);
    },

    /**
     * 页面逻辑跳转
     */
    route(){
         //如果存在code，且存在二维码信息，直接跳转到pin码输入界面
        if(this.data.existCert && this.data.existCode){
            this.certUseApply(this.data.codeInfo);
            return;
        }else if(this.data.existCert){
            dd.redirectTo({
                url: '/pages/cert/cert'
            });
        }
    }
});
