var jwt = require('jsonwebtoken');
var jwtScrect = 'lms_first_token';  //签名

//登录接口 生成token的方法
var setToken = function (user_id, user_name) {
    return new Promise((resolve, reject) => {
        //expiresln 设置token过期的时间
        //{ user_name: user_name, user_id: user_id } 传入需要解析的值（ 一般为用户名，用户id 等）
        const token = jwt.sign({ user_id: user_id, user_name: user_name }, jwtScrect, { expiresIn: 3600 * 24 * 3 });
        resolve(token)
    })
}
//各个接口需要验证token的方法
var getToken = function (token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            console.log('token是空的')
            reject()
        }
        else {
            var info = jwt.verify(token.split(' ')[1], jwtScrect,(err,data)=>{
              if(err === null) {
                resolve(data)
              } else {
                reject()
              }
            });
        }
    })
}

module.exports = {
    setToken,
    getToken
}