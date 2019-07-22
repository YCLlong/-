/**
 * //这个注释在生产环境需要干掉
 * 小程序登录界面
 * 1,从缓存中读取登录的user_session_key  dd.getStorage
 * 2,如果缓存不存在，请求免登授权
 *      授权成功，得到code，访问后台【接口1】，返回 user_session_key,存到换成
 *      授权失败，停留到login界面，显示详情
 * 3，如果缓存存在，拿到user_session_key访问后台【接口2】，返回服务端session会话JSESSION_ID（这个是在响应头中的cookie中，如果不能像web那样自动获得，则需要手动处理）
 *      如果服务端登录成功，则返回当前用户是否存在证书，如果存在，则返回证书信息【接口3】，小程序跳转到主页
 *      如果服务端登录失败，返回具体登录不成功的详细信息，停留在登录界面
 * */



Page({
    data: {},
    onLoad() {
        //页面加载
        var app = getApp();
        var userKey = app.genUserKey();
        if (userKey != null && userKey != '') {
            //访问接口【拿着用户账号的key去登录】
            var param = {userKey: userKey};
            app.request(app.LOGIN_URL, param, function(res) {
                //========接口返回后逻辑处理========

                //认证成功之后，拿到证书信息开始跳转到主页F
            }, null);
        }
    },
    
    login() {
        var app = getApp();
        dd.getAuthCode({
            success: function(res) {
                var authCode = res.authCode;
                var param = {authCode:authCode};
                app.request(app.LOGIN_FIRST_URL, param, function(res) {
                    //========接口返回后逻辑处理========


                    //认证成功之后，拿到证书信息开始跳转到主页
                    var certInfo = {
                        name:'123ZJCA123123',
                        code:'10086',
                        notAfter:'2020年8月8日'
                    };

                    //主页地址
                   var url = "/pages/index/index";
                     if(certInfo == null){
                         url = url + "?certName=" + certInfo.name + "&code=" + certInfo.code + "&notAfter=" + certInfo.notAfter;
                     }
                    dd.reLaunch({
                        url: url
                    });
                }, null);
            },
            fail: function(err) {
                app.showError("授权失败");
            }
        });
    },


    
});
