Page({
  data: {},
  onLoad(query) {
      if (query != null) {
            var msg = query.msg;
            var backUrl = query.backUrl;
            this.setData({
                msg: msg,
                backUrl:backUrl
            });
        }
  },
    //点击了返回就会触发页面关闭事件
    onUnload() {
        let backUrl = this.data.backUrl;
        if(backUrl == null || backUrl == undefined){
             this.setData({
                backUrl:null
            });
            return;
        }
        //如果设置了回跳地址就跳转到指定地址
         this.setData({
                backUrl:backUrl
            });
        dd.redirectTo({
            url: backUrl,
        });
    },
});
