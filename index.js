const express = require('express')
const exphbs  = require('express-handlebars')
const path = require('path')
const app = express()

app.engine('handlebars', exphbs({defaultLayout: 'main'}))
// this line sets handlebars to be the default view engine
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('defaultviews/home',{
    title: "Home Page"

 })
});

app.get('/register', function(req, res) {
  res.render('users/register',{
    title: "Register Page"

 })
});

app.get('/login', function(req, res) {
  res.render('users/login',{
    title: "Login Page"

 })
});

app.get('/profile', function(req, res) {
  res.render('users/profile',{
    title: "Profile Page"

 })
});

app.listen(8000)
