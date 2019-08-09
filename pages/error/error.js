Page({
    data: {

    },
    onPullDownRefresh() {
        dd.stopPullDownRefresh();
    },
    onLoad(query) {
        if (query != null) {
            var errorMsg = query.errorMsg;
            var tip = query.tip;
            var backUrl = query.backUrl;
            this.setData({
                errorMsg: errorMsg,
                tip: tip,
                backUrl:backUrl
            });
        }
    },
    //点击了返回就会触发页面关闭事件
    onUnload() {
        let backUrl = this.data.backUrl;
        if(backUrl == null || backUrl == undefined){
            return;
        }
        //如果设置了回跳地址就跳转到指定地址
        dd.redirectTo({
            url: backUrl,
        });
    },
 
});
