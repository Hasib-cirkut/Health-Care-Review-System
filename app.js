
//Requiring
const path = require('path');
const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const index = require('./routes/index.js');
const user = require('./routes/user.js');


const port = process.env.PORT || 5000;
var app = express();

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'hbs');


//Mounting
app.use(express.urlencoded({extended : false}));
app.use(express.json());

//app.use(bodyParser.urlencoded({extended: false}))
//app.use(bodyParser.json())
app.use('/', index);
app.use('/user', user);


//hbs

hbs.registerPartials(__dirname + '/views/partials');


//Initialize server

app.listen(port, ()=>{
  console.log(`Server is listening to port ${port}`);
  console.log(process.env.PORT);
});
