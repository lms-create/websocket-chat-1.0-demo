var mysql = require('mysql');
var dbConfig = require('./db.config');


module.exports = {
  query: function (sql, params, callback) {
    let promise = new Promise((resolve, reject) => {
      //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
      var connection = mysql.createConnection(dbConfig);
      connection.query(sql,(err,results)=>{
        if(err) {
          reject(err)
        }
        resolve(JSON.parse(JSON.stringify(results)))
      })
    })
    return promise;
  }
};