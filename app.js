const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const router = require('./router')
var jwt = require('jsonwebtoken');
//生成token
app.use(express.json());
const vertoken = require('./token/token')
const expressJwt = require('express-jwt')
// 解析token获取用户信息
app.use(function(req, res, next) {
  // console.log('拿到请求的token---------' + req.headers['authorization']);
  var token = req.headers['authorization'];
  if(token == undefined){
      return next();
  }else{
      vertoken.getToken(token).then((data)=> {
          req.data = data;
          return next();
      }).catch((error)=>{
          return next();
      })
  }
});

//验证token是否过期并规定那些路由不需要验证
app.use(expressJwt({
  secret:'lms_first_token',
  algorithms:['HS256']
}).unless({
  path:['/api/login','/register']  //不需要验证的接口名称
}))


//中间件日志记录
app.use(morgan('dev'));
//跨域
app.use(cors());
//处理json串
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use('/api',router);
//token失效返回信息
app.use(function(err,req,res,next){
  if(err.status==401){
      return res.status(401).send('token失效')
  }
})
module.exports = app