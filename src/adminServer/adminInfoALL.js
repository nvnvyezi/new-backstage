const express = require('express');

const mysql = require('./adminMysql');
const sha1 = require('./sha1');

const router = express.Router();

router.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  // console.log(req.cookies);
  const token = req.cookies.token;
  const toke = sha1.hex_sha1(req.cookies.username + 'ny');
  // console.log(token);
  if (req.session.tokenAdmin !== toke || token !== 'e537173980dbc9363cd70f11edc26a6c606d4066') {
    let result = {
      "Error": true,
      'Result': '请先登录'
    }
    res.jsonp(result);
    res.end();
  } else {
    mysql.sqlAdminFindAll(function (boolean, data) {
      if (boolean) {
        let result = {
          "Error": false,
          'Result': data
        }
        res.jsonp(result);
        res.end();
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
})

module.exports = router;
