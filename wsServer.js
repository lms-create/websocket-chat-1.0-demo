const WebSocket = require('ws');
const url = require('url');
const vertoken = require('./token/token')
const { server } = require('./server');
const { user } = require('./db.config');
const db = require('./db')
const wsServer = new WebSocket.Server({
  server,
});

const userList = new Map()

exports.wsServer = wsServer;

wsServer.on('connection', (ws) => {
  ws.on('message',(mes) => {
    // console.log(JSON.parse(mes.toString()));
    let message = JSON.parse(mes.toString())
    // 处理客户端传过来的信息
    coreLogic(message,ws);
  })
  // 当连接关闭时
  ws.on("close",(val) => {
    console.log('关闭');
  })
  // 当连接出现错误时
  ws.on('error', function (error) {
    console.log(error)
})
})

// 显示当前在在线人数
function seeUserNum() {
  console.log(`----目前在线用户(${userList.size})--`);
      for(const k of userList.keys()){
        console.log(k);
      }
      console.log('---------------------');
}

// websocket连接的核心逻辑
function coreLogic(message,user_ws) {
  // type = 0 用户登录储存用户信息
  if(message.type === 0) {
    console.log(message.user_account + '------已登录');
    // 储存用户的ws
    userList.set(message.user_account, user_ws)
    // 更新用户在数据库中的状态
    updateMysql(message, 1)
    // 显示目前在线人数
    seeUserNum()

  } else if(message.type === 1) {
    // type = 1 用户已登录发送聊天信息
    if(userList.get(message.sendTo) != undefined) {
      let returnData = {
        code: 1, //信息成功发送
        toYouUser: message.user_account,
        data: message.msg
      }
      // 在map中找到想要发送的用户并发送
      userList.get(message.sendTo).send(JSON.stringify(returnData))
    } else {
      // 如果没找到用户信息，说明想发送的用户未登录
      let returnData = {
        code: -1, //信息发送失败
        data: '你想发送给的用户暂未登录'
      }
      //没登录就给当前发送者传回去提示
      user_ws.send(JSON.stringify(returnData))
    }
  } else if(message.type === -1) {
    // type = -1 用户下线
    console.log('用户下线');
    // 在map中删除
    userList.delete(message.user_account)
    // 更新数据库中用户状态
    updateMysql(message,-1)
    // 显示目前在线人数
    seeUserNum()
  } else {
    console.log('其他');
  }
}


// 更新数据库操作
function updateMysql(message,status) {
  // console.log(message.user_account,status);
  let update_sql = `UPDATE users SET user_status=${status} WHERE user_account='${message.user_account}'`
  // console.log(update_sql);
  db.query(update_sql).then(res => {
    for(let k of userList.keys()) {
      let select_sql = `select * from users where user_account!='${k}' and user_status=1`;
      // console.log(select_sql);
      db.query(select_sql).then(res => {
        // console.log(res);
        let data = res.map(item => {
          return {
            user_id: item.user_id,
            user_name: item.user_name,
            user_account: item.user_account
          }
        })
        let setData = {
          code: 2,
          result: data
        }
        userList.get(k).send(JSON.stringify(setData))
      })
    }
  })
}

