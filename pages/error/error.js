Page({
  data: {

  },
  onLoad(query) {
      if(query != null){
          var code = query.code;
          var msg = query.msg;
          this.setData({
              code:code,
              msg,msg
          });
      }
  },
});
