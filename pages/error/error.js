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
            this.setData({
                backUrl: null
            });
            return;
        }
        //如果设置了回跳地址就跳转到指定地址
        this.setData({
            backUrl: backUrl
        });
        dd.redirectTo({
            url: backUrl,
        });
    },

});
