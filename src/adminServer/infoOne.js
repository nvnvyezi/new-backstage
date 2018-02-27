const express = require('express');

const mysql = require('./mysql');
const sha1 = require('./sha1');

const router = express.Router();

router.get('/', function (req, res) {
  res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
  const id = req.query.id;
  const toke = sha1.hex_sha1(req.cookies.username + 'ny');
  const token = req.cookies.token;
  console.log(req.session);
  if (req.session.tokenAdmin !== toke || token != 'e537173980dbc9363cd70f11edc26a6c606d4066') {
    let result = {
      "Error": true,
      'Result': '请先登录'
    }
    res.jsonp(result);
    res.end();
  } else {
    // console.log(id);
    let reg = /^[0-9]+.?[0-9]*$/;
    if (reg.test(id) && id.length == 8) {
      mysql.sqlFind(id, function (boolean, data) {
        // console.log(3)
        if (boolean) {
          if (data[0] == undefined) {
            let result = {
              "Error": true,
              'Result': '不存在'
            }
            res.jsonp(result);
            res.end();
          } else {
            let result = {
              "Error": false,
              'Result': data
            }
            res.jsonp(result);
            res.end();
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
        'Result': 'id Error'
      }
      res.jsonp(result);
      res.end();
    }
  }
})

module.exports = router;
