 /**
    * 显示错误信息
    * @param errMsg 要显示的错误详情
    */
   function showError(errMsg) {
        dd.showToast({
            type: 'exception',
            content: errMsg,
            duration: 3000,
        });
    }

    /**
     * 显示成功的消息
     * @param msg   要显示的详情
     */
   function showSuccess(msg) {
        dd.showToast({
            type: 'success',
            content: msg,
            duration: 3000,
        });
    }




/**
 * 暴露方法1，不然钉钉小程序外部无法访问到
 */
module.exports = {
    errorMsg:showError,
    successMsg:showSuccess
}