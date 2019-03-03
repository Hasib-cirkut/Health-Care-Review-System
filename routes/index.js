const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const session = require('express-session');
const pool = require('./database');

var searchKey = null;

// var connection = mysql.createConnection({
//
//   host: 'us-cdbr-iron-east-03.cleardb.net',
//   user: 'b0fc3e71625b2b',
//   password: 'ce7194f2',
//   database: 'heroku_91478704387a456'
//
// });

router.get('/', (req, res) => {
  if (req.session.loggedin) {
    res.render('index');
  } else {
    res.redirect('/login');
  }

})

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Registration',
    success: true,
    error: req.session.errors
  });
  req.session.errors = null;
})

router.post('/register', (req, res) => {

  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var role = 'user';



  req.check('email', 'invalid email').isEmail()
  req.check('password', 'too short password').isLength({
    min: 4
  })
  req.check('password', 'password doesnt match').equals(req.body.passwordconfirm)

  let error = req.validationErrors();

  if (error) {

    req.session.errors = error;
    res.redirect('/register');

  } else {

    let tempE = 'select email from users where email = ?';
    let tempU = 'select username from users where username = ?';
    let tempI = `insert into users values(?, ?, NULL, ?, ?, ?, ?)`

    pool.query(tempU, [username], (err, result, fields) => {
      if (err) throw err

      if (result.length > 0) {
        console.log('username taken');
        res.render('register', {
          emailandusername: true,
          msg: 'Username is already taken'
        })
      } else {
        pool.query(tempE, [email], (err, result, fields) => {
          if (err) throw err

          if (result.length > 0) {
            res.render('register', {
              emailandusername: true,
              msg: 'Email is already taken'
            })
          } else {
            pool.query(tempI, [username, password, email, firstname, lastname, role], (err, result, fields) => {
              if (err) throw err
              else
                res.redirect('/');
            })
          }
        })
      }
    })
  }
})


router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username && password) {

    let q = 'select username, password from users where username = ? and password = ?';
    pool.query(q, [username, password], (err, result, fields) => {
      if (err) {
        throw err;
      }

      if (result.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        console.log(`User ${username} logged in`)
        res.redirect('/');
      } else {
        console.log('password doesnt match');
        res.redirect('/login');
      }
    })

  }
})

router.get('/logout', (req, res) => {
  req.session.loggedin = false;
  res.redirect('/');
})


router.get('/search', (req, res) => {

  res.render('search', {
    result: searchKey
  });

  searchKey = null;

})

router.post('/search', (req, res) => {
  let keywords = req.body.searchText;

  let q = 'select * from blogs where keywords like ? order by rating desc;';

  pool.query(q, ['%' + keywords + '%'], (err, result, fields) => {

    if (err) {
      throw err
    } else {
      console.log(result);
      searchKey = result;
      res.redirect('/search');
    }
  })
})


module.exports = router;