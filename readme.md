## 注意事项
* 接口网址需要改变
* 请求函数的dataType 需要换成 json

## 调试说明
调试目标                      |    文件名称            |    修改位置   |      修改说明
:----------------------------|:----------------------|:-------------|:--------------------------------------------------------
模拟服务端返回参数             | /utils/param.js       |   153行      |    修改res变量内容（ps；可以测试服务端返回参数不规则）
测试token超时                 | /app.js               |   20行       |    修改param为要调试的参数
测试扫码进入程序               | /utils/param.js       |   154行      |    模拟服务端返回参数 {success='false',code='4003'}
模拟免密登录code              | /pages/login.js        |    43行      |    将userCode变量改成指定的免密code
模拟交互的零时token           | /pages/login/login.js  |    109行      |    将token变量改成指定的零时token
模拟用户是否存在证书           | /pages/login/login.js  |    59行      |   变量certInfo就是用户的证书信息，设置为null就是没有证书，改status可以控制用户的证书状态
模拟证书申请后查询证书结果      | /pages/apply/apply.js |    74行      |    变量certInfo就是用户的证书信息
模拟pin码校验结果             | /pages/pin/pin.js      |    23行      |    修改变量respData