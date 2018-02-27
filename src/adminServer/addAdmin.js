const express = require('express');

const mysql = require('./adminMysql');
const sha1 = require('./sha1');

const router = express.Router();

router.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");

  let username = req.query.username;
  let password = req.query.password;
  const token = req.cookies.token;
  const toke = sha1.hex_sha1(req.cookies.username + 'ny');
  let reg = /^[A-Za-z0-9]+$/;
  let patrn = /^(\w){6,20}$/;
  // console.log(jtoken);
  // console.log(req.session);
  // console.log(req.session.token);
  if (req.session.tokenAdmin !== toke || token == 'e537173980dbc9363cd70f11edc26a6c606d4066') {
    // console.log(2);
    if(reg.exec(username) && patrn.exec(password)) {
      let userData = {
        username: username,
        password: sha1.hex_sha1(password)
      }
      mysql.sqlAdminFind(userData.username, function (judge, data) {
        if (judge) {
          if (data[0] != undefined) {
            // console.log(req.session);
            // console.log(req.cookies);
            // console.log(res.cookies);
            // console.log(req.header.cookie);
            // console.log(req.cookies.session_ny);
            // var id = 's%3AKcg5eG-0CF_QPTiZAqaodySDZi9yQmg6.rqVHetg3bH4t%2BYp3x3QMBgKvnkibBIsPcdVG9lGiUKM'
            // console.log(req.session[id]);
            let result = {
              "Error": true,
              'Result': '你已经存在啦'
            }
            res.jsonp(result);
            res.end();
          } else {
            mysql.sqlAdminAdd(userData, function (boolean, result) {
              if (boolean) {
                let result = {
                  "Error": false,
                  'Result': '添加成功'
                }
                res.jsonp(result);
                res.end();
              } else {
                let result = {
                  "Error": 'true',
                  'Result': '数据库错误，添加失败'
                }
                res.jsonp(result);
                res.end();
              }
            });
          }
        } else {
          let result = {
            "Error": true,
            'Result': '服务器炸了'
          }
          res.jsonp(result);
          res.end();
        }
      });
    }
  } else {
    let result = {
      "Error": true,
      'Result': '请先登录'
    }
    res.jsonp(result);
    res.end();
  }
})

module.exports = router;
