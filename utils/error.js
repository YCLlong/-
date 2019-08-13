function Error(code, msg) {
    this.code = code;
    this.msg = msg;
}

const TOKEN_ERROR = new Error(4003, 'token失效');

const CERT_APPLY_ERROR = new Error(4005, '证书申请失败');
const SERVER_RESPONSE_PARAM_ERROR = new Error(5001, '服务端响应参数不正确');

