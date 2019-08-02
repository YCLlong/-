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
        //页面路由
        this.route();
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
        debugger;
        // 下拉更新证书信息
        var app = getApp();
        var msg = require('/utils/msg.js');
        var paramUtils = require('/utils/param.js');
        var certInfoParam = paramUtils.certInfoParam('1', app.DD_USER_TOKEN);
        var pageObject = this;
        app.request(app.GATE_WAY, certInfoParam, function(certRes) {
            dd.stopPullDownRefresh();
            var respData = paramUtils.resp(certRes);
            if (respData.success) {
                var certInfo = respData.data.certData;
                if (certInfo== undefined || certInfo == null || certInfo.status == null || certInfo.status == '') {
                    pageObject.setData({
                        existCert: false,
                        certInfo: null,
                    });
                } else {
                    pageObject.setData({
                        existCert: true,
                        certInfo: certInfo,
                    });
                }
               
                pageObject.route();
            } else {
                msg.errorMsg(respData.msg);
            }
        }, function(res){
            dd.stopPullDownRefresh();
            msg.errorMsg(res.errorMessage);
        },pageObject);
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
        if (codeInfo == null || codeInfo == undefined || verifyUtils.isBlank(codeInfo.appCode) || verifyUtils.isBlank(codeInfo.webId) || verifyUtils.isBlank(codeInfo.code)) {
            //TODO 这里要跳转到错误页面，错误页面需要指定跳转到证书界面的Url
            msgUtils.errorMsg("我们无法处理这个二维码");
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
            //TEXT 模拟获取证书使用临时token
            certUseToken = '10086';
            if (verifyUtils.isBlank(certUseToken)) {
                msgUtils.errorMsg("服务器返回参数错误");
                return;
            }
            
            //跳转pin码输入界面
            dd.navigateTo({
                url: '/pages/pin/pin?token=' + certUseToken
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
            var paramUtils = require("/utils/param.js");
            dd.redirectTo({
                url: '/pages/cert/cert' + paramUtils.certUrl(this.data.certInfo)
            });
        }
    }
});
