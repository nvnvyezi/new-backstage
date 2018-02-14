const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  port: 　3306,
  database: 'admin',
  user: 'root',
  password: ''
});

pool.getConnection(function (errr, connection) {
  if (errr) {
    console.log('ERR');
  } else {
    const add = function (data, callback) {
      const addsql = "insert into user(username, password) value(?, ?)";
      const addData = [
        data.username,
        data.password
      ];
      console.log(addData);
      connection.query(addsql, addData, function (err, rows) {
        if (err) {
          callback(false, err);
        } else {
          callback(true, rows);
        }
      })
    }

    const find = function (data, callback) {
      const findData = [data];
      const sqlFind = 'select * from user where username=?';
      connection.query(sqlFind, findData, function (err, result) {
        if (err) {
          console.log(err);
          callback(false, err);
        } else {
          callback(true, result);
        }
      })
    }

    const findAll = function (callback) {
      const sqlALL = 'SELECT * FROM user';
      connection.query(sqlALL, function (err, result) {
        if (err) {
          callback(false, err);
        } else {
          callback(true, result);
        }
      })
    }

    const change = function (data, callback) {
      const changeSql = "UPDATE user SET password = ? WHERE username = ?";
      const changeData = [
        data.password,
        data.username
      ];
      connection.query(changeSql, changeData, function (err, result) {
        if (err) {
          callback(false, err);
        } else {
          callback(true, result);
        }
      });
    };

    const Delete = function (data, callback) {
      const sqlDelete = 'DELETE FROM user WHERE username = ?';
      const deleteData = [data];
      connection.query(sqlDelete, deleteData, function (err, result) {
        if (err) {
          callback(false, err);
        } else {
          callback(true, result);
        }
      })
    }

    exports.sqlAdminAdd = add;
    exports.sqlAdminFind = find;
    exports.sqlAdminFindAll = findAll;
    exports.sqlAdminChange = change;
    exports.sqlAdminDelete = Delete;
  }
})
