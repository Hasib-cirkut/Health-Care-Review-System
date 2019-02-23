const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
  res.render('user');
})

router.get('/addInfo', (req, res) =>{
  res.render('addInfo');
})

router.post('/addInfo/submit', (req, res)=>{
  console.log(`Name: ${req.body.name}`);
  console.log(`Age: ${req.body.age}`);
  res.redirect('/');
})

module.exports = router;
