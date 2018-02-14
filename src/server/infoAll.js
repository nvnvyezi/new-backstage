const express = require('express');

const mysql = require('./mysql');
const sha1 = require('./sha1');

const router = express.Router();

router.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  // console.log(req.cookies);
  // console.log(token);
  // console.log(23);
  // console.log(req.cookies.username);
  // console.log(req.session);
  const toke = sha1.hex_sha1(req.cookies.username + 'ny');
  if (req.session.tokenAdmin === toke) {
    const token = req.cookies.token;
    if (token == 'e537173980dbc9363cd70f11edc26a6c606d4066') {
      mysql.sqlFindAll(function (boolean, data) {
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
