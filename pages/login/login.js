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
    onLoad(query) {
        //页面加载
        var app = getApp();
        var userCode = app.genUserCode();
        if (userCode != null && userCode != '') {
            //免密登录
            this.loginNoPwd(userCode);
        } else {
            this.login();
        }
    },

    /**
     * 免密登录
     */
    loginNoPwd(userCode) {
        var app = getApp();
        //API1，用免登Token去登录系统
        var param = {
            method: '1002',
            dtid: userCode,
        }
        app.request(app.GATE_WAY, param, function(res) {
            var biz = require('/utils/biz.js');
            var msg = require('/utils/msg.js');
            var resData = biz.resp(res);
            if(resData.success){
                var token = resData.data.token;
                if (token == null || token == undefined) {
                    msg.errorMsg('服务器返回参数错误');
                    return;
                }
                //将token更新到app
                getApp().DD_USER_TOKEN = token;




            }else{
                msg.errorMsg(resData.msg);
            }
        }, null);

        //拿到证书信息开始跳转到主页
        var certInfo = {
            cn: '123ZJCA123123',
            sn: '10086',
            idCode: '340826199909024459',
            notBefore: '2020年8月8日',
            notAfter: '2020年8月8日',
            status: 2000
        };

        // certInfo = null;

        //主页地址
        var url = "/pages/index/index";
        if (certInfo != null) {
            var biz = require('/utils/biz.js');
            var param = biz.certUrl(certInfo);
            url = url + param;
        }
        dd.reLaunch({
            url: url
        });
    },

    //授权登录
    login() {
        var app = getApp();
        var msg = require('/utils/msg.js');
        dd.getAuthCode({
            success: function(res) {
                var authCode = res.authCode;
                var param = {
                    //首次登录接口标识码
                    method: '1001',
                    code: authCode
                };
                app.request(app.GATE_WAY, param, function(res) {
                    var biz = require('/utils/biz.js');
                    var resData = biz.resp(res);
                    if (resData.success) {
                        //获取用户免密标识
                        var userCode = resData.data.dtid;
                        if (userCode == null || userCode == undefined) {
                            msg.errorMsg('服务器返回参数错误');
                            return;
                        }
                        //将免密标识存储到缓存
                        try{                        
                            dd.setStorageSync({
                                key: app.DD_USER_CODE,
                                data:userCode
                            });
                        }catch(e){
                            msg.errorMsg('写入缓存失败');
                            return;
                        }

                        //登录系统
                         this.loginNoPwd(userCode);
                    } else {
                        msg.errorMsg(resData.msg);
                    }
                }, null);
            },
            fail: function(err) {
                 msg.errorMsg('授权失败');
            }
        });
    },
});
