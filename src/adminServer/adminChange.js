const express = require('express');

const mysql = require('./adminMysql');
const sha1 = require('./sha1');

const router = express.Router();

router.get('/', function (req, res) {
  const Data = {
    username: req.query.username,
    password: req.query.password
  }
  const toke = sha1.hex_sha1(req.cookies.username + 'ny');
  const token = req.cookies.token;
  if (req.session.tokenAdmin !== toke || token != 'e537173980dbc9363cd70f11edc26a6c606d4066') {
    let result = {
      "Error": true,
      'Result': '请先登录'
    }
    res.jsonp(result);
    res.end();
  } else {
    let reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(Data.username) && Data.username.length == 8) {
      mysql.sqlAdminFind(Data.username, function (boolean, data) {
        if (boolean) {
          if (data[0] == undefined) {
            let result = {
              "Error": true,
              'Result': '不存在'
            }
            res.jsonp(result);
            res.end();
          } else {
            mysql.sqlAdminChange(Data, function (bool, resu) {
              if (bool) {
                let result = {
                  "Error": false,
                  'Result': resu
                }
                res.jsonp(result);
                res.end();
              } else {
                let result = {
                  "Error": true,
                  'Result': '数据库错误'
                }
                res.jsonp(result);
                res.end();
              }
            })
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
    } else {
      let result = {
        "Error": true,
        'Result': 'username Error'
      }
      res.jsonp(result);
      res.end();
    }
  }
})

module.exports = router;