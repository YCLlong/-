function Error(code,msg){
    this.code = code;
    this.msg = msg;
}

const SERVER_RESPONSE_PARAM_ERROR  = new Error(5001,'服务端响应参数不正确');      //服务端响应参数不正确