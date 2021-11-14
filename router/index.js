const express = require('express');
 //引入token 
const vertoken=require('../token/token')
const db = require('../db')
const router = express.Router();
router.post('/login',(req,res) => {
  const { username,password } = req.body;
  const sql = `select * from users where user_account='${username}' and user_password='${password}'`;
  db.query(sql).then((response) => {
    const user_id = response[0].user_id
    if(response.length > 0) {
      vertoken.setToken(user_id,username).then(token=>{
        return  res.json({
              retCode: 1,
              result: {
                user_name: response[0].user_name,
                user_account: response[0].user_account,
                token: 'Bearer '+token
            },
             message: '登录成功',
         })
     })
    } else {
      res.send({
        retCode: -1,
        message: "账号/密码错误",
      });
    }
  }).catch((err)=>{
    res.send({
      retCode: -1,
      message: "",
    });
  })
})
router.post('/getAllUser',(req,res)=> {
  const { user_account } = req.body;
  const sql = `select * from users where user_account!='${user_account}' and user_status=1`;
  db.query(sql).then(response => {
  let userList = response.map((item) => {
    return {
      user_id: item.user_id,
      user_name: item.user_name,
      user_account: item.user_account
    }
  })
  // console.log(userList);
  return  res.json({
    retCode: 1,
    result: userList,
   message: '获取用户列表成功！',
})
  })
})
module.exports = router