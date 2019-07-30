Page({
  data: {},
  onLoad() {},


  pin(){
    var pinCode = "";//输入的pin码
    //调用第三方js库中的方法
    var sha = require('/utils/sha256.js');
    var sign = sha.sha256(pinCode); //得到pin码的哈希值
  }
});
