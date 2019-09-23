Page({
    data: {},
    onLoad(query) {
        if (query != null) {
            var msg = query.msg;
            var backUrl = query.backUrl;
            this.setData({
                msg: msg,
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
         let backUrl = this.data.backUrl;
        
        if (backUrl != undefined && backUrl != null && backUrl != '') {
             this.setData({
                backUrl:null
            });
            dd.redirectTo({
                url: backUrl,
                fail:function(e){
                    dd.alert({
                        content: '页面跳转失败，详情:' + JSON.stringify(e)
                    });
                }
            });
        }
    },
});
