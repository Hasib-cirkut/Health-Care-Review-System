const express = require('express');
const router = express.Router();
const session = require('express-session');

router.get('/', (req, res) =>{
  if(req.session.loggedin){
    res.render('user', {username : req.session.username});
  }else {
    res.redirect('/login');
  }
})


module.exports = router;
