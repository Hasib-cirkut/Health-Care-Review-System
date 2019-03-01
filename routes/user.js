const express = require('express');
const router = express.Router();
const session = require('express-session');
const mysql = require('mysql');

var mysqlPool = mysql.createPool({

  host: 'us-cdbr-iron-east-03.cleardb.net',
  user: 'b0fc3e71625b2b',
  password: 'ce7194f2',
  database: 'heroku_91478704387a456'

});

router.get('/', (req, res) => {
  if (req.session.loggedin) {

    var firstname, lastname, email;

    mysqlPool.getConnection((err, connection) => {
      if (err) throw err;

      let q = `select firstname, lastname, email from users where username = ?`
      connection.query(q, [req.session.username], (err, result, fields) => {
        if (err) {
          console.log(err);
          connection.release();
        }

        firstname = result[0].firstname;
        lastname = result[0].lastname;
        email = result[0].email;

        res.render('user', {
          username: req.session.username,
          firstname: firstname,
          lastname: lastname,
          email: email
        });
        //connection.release();
      })

    })
  } else {
    res.redirect('/login');
  }
})


module.exports = router;