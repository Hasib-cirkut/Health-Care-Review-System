// @ts-check

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
var session = require('express-session');

var connection = mysql.createConnection({
	host     : 'us-cdbr-iron-east-03.cleardb.net',
	user     : 'b0fc3e71625b2b',
	password : 'ce7194f2',
	database : 'heroku_91478704387a456'
});

router.get('/', (req, res)=>{
  if(req.session.loggedin)
  {
    res.render('index');
  }else{
    res.redirect('/login');
  }

})

router.get('/login', (req, res) =>{
    res.render('login');
});

router.post('/login', (req, res)=>{
  var username = req.body.username;
  var password = req.body.password;

  if(username && password)
  {
    let q = 'select username, password from users where username = ? and password = ?';
    connection.query(q, [username, password], (err, result, fields)=>{
      if(result.length > 0)
      {
        req.session.loggedin = true;
        req.session.username = username;
        console.log(`User ${username} logged in`)
        res.redirect('/');
      }else{
        console.log('password doesnt match');
        res.redirect('/login');
      }
    })
  }
})





module.exports = router;
