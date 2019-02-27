// @ts-check

const express = require('express');
const router = express.Router();
const mysql = require('mysql');
var session = require('express-session');


var mysqlPool  = mysql.createPool({

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

router.get('/register', (req, res) =>{
	res.render('register', {title : 'Registration', success : true,  error : req.session.errors});
	req.session.errors = null;
})

router.post('/register', (req, res)=>{

	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var role = 'user';

	if(firstname && lastname){

		req.check('email', 'invalid email').isEmail()
		req.check('password', 'too short password').isLength({min: 4})
		req.check('password', 'password doesnt match').equals(req.body.passwordconfirm)

		let error = req.validationErrors();

		if(error){
			req.session.errors = error;
			//console.log(error);
			res.redirect('/register');
		}else {

			let tempU = 'select username from users where username = ?';
			let tempE = 'select email from users where email = ?';

			mysqlPool.getConnection((err, connection) =>{
					if(err) throw err;

					connection.query(tempU, [req.body.username], (err, result, fields) =>{
						if(err){
							connection.end();
							console.log(err);
						}

						if(result.length > 0){  //If username already taken
								res.render('register', {emailandusername : true , msg : 'Username is already taken'})
						}else {
							connection.query(tempE, [req.body.email], (err, result, fields) =>{
								if(err){
									connection.end();
								}

								if(result.length > 0){  //If email already taken
										res.render('register', {emailandusername : true , msg : 'Email is already taken'})
								}else {
							connection.query(`insert into users values(?, ?, NULL, ?, ?, ?, ?)`, [username, password, email, firstname, lastname, role], (err, result, fields) =>{
								if(err){
									connection.end();
								}
								connection.end();
								res.redirect('/')
							})
						}

						connection.end();

					})
				}

				connection.end();
		})

			connection.release();

			})

}

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

		mysqlPool.getConnection((err, connection) =>{
			if(err) throw err;
			let q = 'select username, password from users where username = ? and password = ?';
	    connection.query(q, [username, password], (err, result, fields)=>{
				if(err){
					connection.end()
				}

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
			connection.release()
		})
  }
})

router.get('/logout', (req, res)=>{
    req.session.loggedin = false;
    res.redirect('/');
})





module.exports = router;
