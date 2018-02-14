const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const infoOne = require('./infoOne');
const infoAll  = require('./infoAll');
const loginAdmin = require('./adminLogin');
const adminDel = require('./adminDel');
const change = require('./change');
const adminInnfoAll = require('./adminInfoALL');
const adminChange = require('./adminChange');
const addAdmin = require('./addAdmin');

const app = express();

app.use(cookieParser('ny'));
app.use(session({
  secret: 'ny',
  name: 'session_nvnvyezi',
  cookie: {
    maxAge: 9000000,
    httpOnly: true,
  },
  sameSite: 'Lax',
  resave: true,
  rolling: true,
  saveUninitialized: false
}));

//  创建cookie
        // res.cookie('token', 'tokensession', {
        //   // 'MaxAge': 90000,
        //   'signed': true,
        //   // 'path': '/',
        //   'httpOnly': true,
        //   // domain: ''
        //   // expires: new Date(Date.now() + 90000)
        // });

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use('/infoOne', infoOne);
app.use('/infoAll', infoAll);
app.use('/change', change);
app.use('/nvnvyezi',loginAdmin);
app.use('/adminDel', adminDel);
app.use('/adminInfoAll', adminInnfoAll);
app.use('/adminChange', adminChange);
app.use('/addAdmin', addAdmin);

app.listen(3000, function (params) {
  console.log('3000 is ready');  
});