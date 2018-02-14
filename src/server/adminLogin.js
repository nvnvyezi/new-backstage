const express = require('express');
const mysql = require('./adminMysql');
const sha1 = require('./sha1');

const router = express.Router();

router.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  const message = req.query.message;
  let reg = /^[A-Za-z0-9]+$/;
  //  console.log(reg.exec(message.id));
  if (reg.exec(message.id)) {
    mysql.sqlAdminFind(message.id, function (boolean, result) {
      if (true) {
        if (result[0] == undefined) {
          let Result = {
            'Err': true,
            'Data': '没有此用户'
          }
          res.jsonp(Result);
          res.end();
        } else {
          const password = result[0].password;
          // console.log(message.password);
          // console.log(password);
          const toke = sha1.hex_sha1(result[0].username + 'ny');
          // console.log(token);
          if (password === message.password) {
            req.session.tokenAdmin = toke;
            // console.log(req.session);
            let Result = {
              'Err': false,
              'Path': 'nvnvyeziMan',
              'token': 'e537173980dbc9363cd70f11edc26a6c606d4066',
              'name': result[0].username
            }
            res.jsonp(Result);
            res.end();
          } else {
            let Result = {
              'Err': true,
              'Data': '密码错误'
            }
            res.jsonp(Result);
            res.end();
          }
        }
      } else {
        let Result = {
          'Err': true,
          'Data': '数据库查询错误'
        }
        res.jsonp(Result);
        res.end();
      }
    })
  } else {
    let Result = {
      'Err': true,
      'Data': '用户名和密码格式错误'
    }
    res.jsonp(Result);
    res.end();
  }
})

module.exports = router;
