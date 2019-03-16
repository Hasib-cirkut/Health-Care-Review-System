const express = require('express');
const router = express.Router();
const session = require('express-session');
const pool = require('./database');

router.get('/', (req, res) => {
  if (req.session.loggedin) {

    var firstname, lastname, email;
    var ans;

    let q = `SELECT * FROM blogs, users
             WHERE blogs.username = users.username AND users.username = ?;`

    pool.query(q, [req.session.username], (err, result, fields) => {
      if (err) {
        console.log(err);
      } else {
        res.render('user', {
          result: result,
          username: result[0].username,
          email: result[0].email,
          firstname: result[0].firstname,
          lastname: result[0].lastname
        });
      }
    })


  } else {
    res.redirect('/login');
  }
})

router.get('/addBlog', (req, res) => {
  if (req.session.loggedin) {
    res.render('addBlog');
  } else {
    res.redirect('/login');
  }
})


router.post('/addBlog', (req, res) => {

  var username = req.session.username;
  var body = req.body.body;
  var keywords = req.body.keywords;
  var rating = req.body.rating;
  var dName = req.body.doctorName;
  var dDesignation = req.body.doctorDesignation;
  var typeOfDisease = req.body.typeOfDisease;
  var status = req.body.status;
  var date = new Date();

  let q = `insert into blogs values('', ?, ?, ?, ?, ?, ?, ?, ?, ? )`

  pool.query(q, [username, body, keywords, rating, dName, dDesignation, typeOfDisease, status, date], (err, result, fields) => {
    if (err) {
      throw err;
    } else {
      res.redirect('/user');
    }
  })

})

router.get('/deletePost/:blogId', (req, res) => {
  let blogId = req.params.blogId;

  let q = `delete from blogs where blogId = ?`

  pool.query(q, [blogId], (err, result, fields) => {
    if (err) throw err;
    else {
      res.redirect('/user');
    }
  })
})









module.exports = router;