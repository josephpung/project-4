const exphbs = require("express-handlebars")
const express = require("express")
const path = require("path")
const bodyParser = require('body-parser')
const session = require("express-session")
const MongoStore = require("connect-mongo")(session)
const passport = require("./config/ppConfig")
const methodOverride = require('method-override')
const flash = require("connect-flash")
const app = express()
require("dotenv").config({silent: true})

var hbs = exphbs.create({
    defaultLayout: 'main',
    helpers      : {

      checkAdmin: function(first, second, options) {
        console.log(first, second);

        if (String(first) === String(second)) {
          return options.fn(this)
        }
      },
      times: function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
}
    }
})
//======= Set up handlebars
// app.engine('handlebars', exphbs({defaultLayout:'main'}))
app.engine('handlebars', hbs.engine)
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')));

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/proj4local', {
  useMongoClient: true
})
mongoose.Promise = global.Promise
// ======== Setting up Sessions AFTER connecting to mongoose ===== //
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true, //saves session and stores it in DB
  store: new MongoStore({ mongooseConnection: mongoose.connection }) // store it in MongoDB, this requires mongo-connect to work
}))
// ====== set up flash ======
app.use(flash())
// setup methodOverride
app.use(methodOverride('_method'))
//=== Setup passport
app.use(passport.initialize())
app.use(passport.session())
// ===== Set up bodyparser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

//Access models
const Restaurant = require("./models/restaurant")
const Restotable = require("./models/restotable")

////
app.get("/staff", (req,res)=>{
  Restaurant.findOne({"name":"Restaurant 3"})
  .then(resto=>{
    res.render("owners/main",{
      title: "Staff Page",
      resto
    })
  })
})
app.get('/', function(req, res) {
  Restaurant.find()
  .then(resto=>{

    Restotable.find("restaurant_id=1")
    .then(table=>{

    res.render('defaultviews/home',{
      title: "Home Page",
      resto,
      table

   })
 })
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
app.post("/addrestaurant", (req,res)=>{
  let newRes = new Restaurant({
    name: req.body.name,
    cuisine: req.body.cuisine,
    address: req.body.address,
    contact: req.body.contact,
    tables: req.body.tableNo

  })

  newRes.save()
  .then(()=>{
    res.redirect("/")
  })
})

app.post('/addtableorder', (req,res)=>{
  let newTable = new Restotable({
    user_id: 1,
    restaurant_id: 1,
    transaction_id: 12,
    table_number: 3,
    dishes: [123,223,4432],
    status: "cooked"
  })

  newTable.save()
  .then(()=>{
    res.redirect("/")
  })
})

app.listen(8000)
