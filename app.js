
//Requiring

const express = require('express');
const hbs = require('hbs');
const index = require('./routes/index.js');
const user = require('./routes/user.js');


const port = 5000;
var app = express();

app.set('view engine', 'hbs');

//Mounting

app.use('/', index);
app.use('/user', user);

//hbs

hbs.registerPartials(__dirname + '/views/partials');


//Initialize server

app.listen(port, ()=>{
  console.log(`Server is listening to port ${port}`);
});
