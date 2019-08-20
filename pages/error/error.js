Page({
    data: {

    },
    onLoad(query) {
        if (query != null) {
            var msg = query.msg;
            var tip = query.tip;
            var backUrl = query.backUrl;
            this.setData({
                msg: msg,
                tip: tip,
                backUrl: backUrl
            });
        }
    },
    //点击了返回就会触发页面关闭事件
    onUnload() {
        let backUrl = this.data.backUrl;
        if (backUrl == undefined || backUrl == null || backUrl == '') {
            return;
        }
        //如果设置了回跳地址就跳转到指定地址
        this.goBack();

    },

    goBack() {
        if (this.data.backUrl != null) {
            dd.redirectTo({
                url: this.data.backUrl
            });
        }
    },
});
